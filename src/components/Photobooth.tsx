"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCamera } from "../hooks/useCamera";
import { CameraPreview } from "./CameraPreview";
import { ResultPanel } from "./ResultPanel";
import {
  FRAME_OPTIONS,
  FILTER_OPTIONS,
  FrameOption,
  FilterOption,
  drawFrameToCanvas,
} from "../utils/framesAndFilters";
import { createCollage } from "../utils/collage";
import { generateGIF } from "../utils/gifGenerator";
import { Play, Sparkles, Sliders, LayoutGrid, Check, Loader2 } from "lucide-react";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type LayoutOption = { id: string; count: number; type: "vertical" | "grid"; label: string; desc: string };
const LAYOUT_OPTIONS: LayoutOption[] = [
  { id: "3-vert", count: 3, type: "vertical", label: "3 Frame", desc: "Strip Vertikal" },
  { id: "4-vert", count: 4, type: "vertical", label: "4 Frame", desc: "Strip Vertikal" },
  { id: "4-grid", count: 4, type: "grid", label: "4 Frame", desc: "Grid 2x2" },
  { id: "6-grid", count: 6, type: "grid", label: "6 Frame", desc: "Grid 2x3" },
];

export function Photobooth() {
  const { stream, status, error, videoRef, startCamera, stopCamera } = useCamera();
  const [mounted, setMounted] = useState(false);

  // Settings states
  const [selectedLayout, setSelectedLayout] = useState<LayoutOption>(LAYOUT_OPTIONS[2]); // Default 4-grid
  const [selectedFrame, setSelectedFrame] = useState<FrameOption>(FRAME_OPTIONS[1]); // Default Polaroid
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>(FILTER_OPTIONS[0]); // Default Normal

  // Session workflow states
  const [stage, setStage] = useState<"setup" | "countdown" | "review" | "processing" | "result">("setup");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flashActive, setFlashActive] = useState<boolean>(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [capturedCanvases, setCapturedCanvases] = useState<HTMLCanvasElement[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Processing states
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [gifProgress, setGifProgress] = useState<number>(0);

  // Result URLs
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [collageUrl, setCollageUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Start camera automatically on mount
  useEffect(() => {
    setMounted(true);
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const handleStartSession = async () => {
    if (status !== "ready" || !videoRef.current) {
      alert("Harap aktifkan kamera terlebih dahulu.");
      return;
    }

    setStage("countdown");
    setCapturedCanvases([]);
    setGifUrl(null);
    setCollageUrl(null);
    setErrorMsg(null);

    const total = selectedLayout.count;
    const tempCanvases: HTMLCanvasElement[] = [];

    for (let i = 0; i < total; i++) {
      setCurrentFrameIndex(i);

      // Countdown 3, 2, 1
      for (let c = 3; c > 0; c--) {
        setCountdown(c);
        await delay(1000);
      }
      setCountdown(null);

      // Camera Flash Effect
      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 150);

      // Capture Image
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Mirror the image horizontally
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        
        // Apply selected filter to canvas context
        ctx.filter = selectedFilter.canvasFilter;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Reset transforms so frame layout text doesn't mirror
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        drawFrameToCanvas(ctx, canvas.width, canvas.height, selectedFrame.id, i + 1, total);
      }

      tempCanvases.push(canvas);
      setCapturedCanvases([...tempCanvases]);

      // Small break between captures
      await delay(800);
    }

    // Capture complete. Move to review stage.
    setStage("review");
  };

  const handleProcessFinal = async () => {
    setStage("processing");
    setProcessingStatus("Menyusun kolase foto...");

    try {
      // 1. Create Collage Grid
      const frameBgColor =
        selectedFrame.id === "polaroid"
          ? "#ffffff"
          : selectedFrame.id === "pastel-hearts"
          ? "#fecdd3"
          : selectedFrame.id === "y2k-glitch"
          ? "#e9d5ff"
          : selectedFrame.id === "neon"
          ? "#18181b"
          : "#ffffff";

      const collage = await createCollage(capturedCanvases, selectedLayout.count, selectedLayout.type, frameBgColor);
      setCollageUrl(collage);

      // 2. Generate animated GIF
      setProcessingStatus("Membuat GIF Animasi...");
      setGifProgress(0);

      const gif = await generateGIF(capturedCanvases, 800, (progress) => {
        setGifProgress(Math.round(progress * 100));
      });
      setGifUrl(gif);

      setStage("result");
    } catch (err: any) {
      console.error("Rendering failed:", err);
      // Fallback: If GIF rendering fails (or gets blocked), we still show the collage
      if (capturedCanvases.length > 0) {
        setErrorMsg("Pembuatan GIF bermasalah. Sebagai gantinya, Anda tetap dapat mengunduh Kolase Foto!");
        setStage("result");
      } else {
        setErrorMsg("Gagal memproses tangkapan gambar. Silakan coba lagi.");
        setStage("setup");
      }
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (idx: number) => {
    setDraggedIndex(idx);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // allow drop
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIdx: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIdx) return;
    
    // Swap the elements
    const newCanvases = [...capturedCanvases];
    const temp = newCanvases[draggedIndex];
    newCanvases[draggedIndex] = newCanvases[targetIdx];
    newCanvases[targetIdx] = temp;
    
    setCapturedCanvases(newCanvases);
    setDraggedIndex(null);
  };

  const handleReset = () => {
    setStage("setup");
    setCapturedCanvases([]);
    setGifUrl(null);
    setCollageUrl(null);
    setErrorMsg(null);
    setCurrentFrameIndex(0);
    startCamera();
  };

  if (!mounted) {
    return (
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl px-4 items-center justify-center min-h-[400px]">
        <div className="text-center text-zinc-500 font-bold">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#ff5e97]" />
          Menyiapkan Photobooth...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl px-4 items-stretch">
      {/* LEFT: Preview Panel */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <CameraPreview
          videoRef={videoRef}
          status={status}
          error={error}
          selectedFrame={selectedFrame}
          selectedFilter={selectedFilter}
          startCamera={startCamera}
          countdown={countdown}
          flashActive={flashActive}
          currentFrameIndex={currentFrameIndex}
          totalFrames={selectedLayout.count}
        />

        {/* Real-time captures gallery under camera */}
        {stage !== "setup" && capturedCanvases.length > 0 && (
          <div className="mt-6 w-full max-w-[800px]">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Tangkapan Foto Sesi Ini:
            </h4>
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: selectedLayout.count }).map((_, idx) => {
                const canvas = capturedCanvases[idx];
                return (
                  <div
                    key={idx}
                    className={`aspect-[4/3] rounded-lg bg-zinc-200 border-2 overflow-hidden ${
                      idx === currentFrameIndex && stage === "countdown"
                        ? "border-[#ff5e97] ring-2 ring-[#ff5e97]/30 scale-105"
                        : "border-zinc-300"
                    } transition-all duration-300`}
                  >
                    {canvas ? (
                      <img
                        src={canvas.toDataURL("image/jpeg", 0.6)}
                        alt={`Capture ${idx + 1}`}
                        className="w-full h-full object-cover scale-x-[-1]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-zinc-400">
                        {idx + 1}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Control panel or Processing / Result screen */}
      <div className="w-full lg:w-[400px] flex flex-col justify-start relative min-h-[500px]">
        <AnimatePresence mode="wait">
          {stage === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-[#ffce56] glass-panel w-full flex flex-col justify-between gap-6"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[#ff5e97] animate-pulse" />
                  <h2 className="text-2xl font-black text-[#2d2a2e]">Pengaturan Foto</h2>
                </div>

                {/* Grid/Frame Count Selector */}
                <div className="mb-6">
                  <label className="flex items-center gap-1.5 text-sm font-extrabold text-[#2d2a2e] mb-2 uppercase tracking-wide">
                    <LayoutGrid className="w-4 h-4 text-[#ff5e97]" />
                    Jumlah Frame
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {LAYOUT_OPTIONS.map((layout) => (
                      <motion.button
                        key={layout.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedLayout(layout)}
                        className={`py-2 px-2 rounded-xl font-bold text-sm border-2 transition-colors cursor-pointer ${
                          selectedLayout.id === layout.id
                            ? "border-[#ff5e97] bg-[#ff5e97]/10 text-[#ff5e97]"
                            : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
                        }`}
                      >
                        {layout.label}
                        <span className="block text-[10px] font-medium text-zinc-400">
                          {layout.desc}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Frame Style Selector */}
                <div className="mb-6">
                  <label className="flex items-center gap-1.5 text-sm font-extrabold text-[#2d2a2e] mb-2 uppercase tracking-wide">
                    <Sliders className="w-4 h-4 text-[#ff5e97]" />
                    Gaya Frame
                  </label>
                  <div className="flex flex-col gap-2">
                    {FRAME_OPTIONS.map((frame) => (
                      <motion.button
                        key={frame.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedFrame(frame)}
                        className={`flex items-center justify-between p-3 rounded-xl border-2 text-left transition-colors cursor-pointer ${
                          selectedFrame.id === frame.id
                            ? "border-[#ff5e97] bg-[#ff5e97]/5"
                            : "border-zinc-150 hover:border-zinc-300"
                        }`}
                      >
                        <div>
                          <div className="font-bold text-sm text-[#2d2a2e]">{frame.name}</div>
                          <div className="text-[11px] text-zinc-400">{frame.description}</div>
                        </div>
                        {selectedFrame.id === frame.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5 rounded-full bg-[#ff5e97] flex items-center justify-center shrink-0"
                          >
                            <Check className="w-3.5 h-3.5 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Filter Selector */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-extrabold text-[#2d2a2e] mb-2 uppercase tracking-wide">
                    <Sparkles className="w-4 h-4 text-[#ff5e97]" />
                    Filter Visual
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {FILTER_OPTIONS.map((filter) => (
                      <motion.button
                        key={filter.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedFilter(filter)}
                        className={`py-2 px-1 text-center rounded-xl font-bold text-xs border-2 transition-colors cursor-pointer ${
                          selectedFilter.id === filter.id
                            ? "border-[#ff5e97] bg-[#ff5e97]/10 text-[#ff5e97]"
                            : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
                        }`}
                      >
                        {filter.name}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartSession}
                disabled={status !== "ready"}
                className="w-full flex items-center justify-center gap-2 py-4 mt-4 bg-[#ff5e97] hover:bg-[#e0447d] disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-extrabold rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer text-lg"
              >
                <Play className="w-5 h-5" />
                Mulai Sesi Photobooth
              </button>
            </motion.div>
          )}

          {/* Review State */}
          {stage === "review" && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-[#ffce56] glass-panel w-full flex flex-col justify-between gap-6 relative"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-[#ff5e97] animate-pulse" />
                  <h2 className="text-2xl font-black text-[#2d2a2e]">Tinjau Foto</h2>
                </div>
                <p className="text-sm text-zinc-500 mb-6 font-medium">
                  Seret dan lepas (drag & drop) foto di bawah ini untuk mengubah urutannya sebelum diproses.
                </p>

                <div className={`grid gap-3 ${
                  selectedLayout.type === "grid" && selectedLayout.count === 6 ? "grid-cols-2" :
                  selectedLayout.type === "grid" && selectedLayout.count === 4 ? "grid-cols-2" :
                  "grid-cols-1 sm:grid-cols-2"
                }`}>
                  {capturedCanvases.map((canvas, idx) => (
                    <div
                      key={idx}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, idx)}
                      className={`relative aspect-[4/3] rounded-xl overflow-hidden border-4 cursor-grab active:cursor-grabbing transition-transform ${
                        draggedIndex === idx ? "opacity-50 border-[#ffce56] scale-95" : "border-zinc-200 hover:border-[#ff5e97]"
                      }`}
                    >
                      <div className="absolute top-2 left-2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
                        {idx + 1}
                      </div>
                      <img
                        src={canvas.toDataURL("image/jpeg", 0.5)}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover scale-x-[-1] pointer-events-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleProcessFinal}
                className="w-full flex items-center justify-center gap-2 py-4 mt-4 bg-[#ffce56] hover:bg-[#eab308] text-[#2d2a2e] font-extrabold rounded-2xl shadow-lg hover:shadow-xl transition-colors cursor-pointer text-lg"
              >
                <Check className="w-5 h-5" />
                Proses Hasil Akhir
              </motion.button>
            </motion.div>
          )}

          {/* Processing State */}
          {stage === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.2 } }}
              className="bg-white rounded-3xl p-8 shadow-xl border-4 border-[#ffce56] glass-panel w-full h-full flex flex-col items-center justify-center text-center absolute top-0 left-0"
            >
              <Loader2 className="w-16 h-16 text-[#ff5e97] animate-spin mb-4" />
              <h3 className="text-xl font-black text-[#2d2a2e] mb-2">{processingStatus}</h3>
              <p className="text-sm text-zinc-500 mb-6 max-w-xs">
                Sedang menggabungkan foto-foto menjadi satu kesatuan yang estetik. Mohon tunggu...
              </p>

              {/* Progress bar for GIF render */}
              {processingStatus.includes("GIF") && (
                <div className="w-full max-w-[200px]">
                  <div className="flex justify-between text-xs font-bold text-zinc-600 mb-1">
                    <span>Rendering GIF</span>
                    <span>{gifProgress}%</span>
                  </div>
                  <div className="w-full h-3 bg-zinc-100 border border-zinc-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#ff5e97] to-[#ffce56]"
                      initial={{ width: 0 }}
                      animate={{ width: `${gifProgress}%` }}
                      transition={{ ease: "linear" }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Result State */}
          {stage === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full h-full"
            >
              <ResultPanel
                gifUrl={gifUrl}
                collageUrl={collageUrl}
                frameCount={selectedLayout.count}
                selectedFrameName={selectedFrame.name}
                selectedFilterName={selectedFilter.name}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Warning/Error Banner */}
      {errorMsg && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-amber-50 border-2 border-amber-300 rounded-xl p-4 shadow-lg flex items-start gap-3 max-w-md w-[90%]">
          <span className="text-amber-500 text-lg">⚠️</span>
          <div>
            <h4 className="text-sm font-bold text-amber-800">Catatan Sistem</h4>
            <p className="text-xs text-amber-700 mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}
    </div>
  );
}
