"use client";

import React from "react";
import { Camera, AlertCircle, RefreshCw } from "lucide-react";
import { CameraStatus } from "../hooks/useCamera";
import { FrameOption, FilterOption } from "../utils/framesAndFilters";

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  status: CameraStatus;
  error: string | null;
  selectedFrame: FrameOption;
  selectedFilter: FilterOption;
  startCamera: () => void;
  countdown: number | null;
  flashActive: boolean;
  currentFrameIndex: number;
  totalFrames: number;
}

export function CameraPreview({
  videoRef,
  status,
  error,
  selectedFrame,
  selectedFilter,
  startCamera,
  countdown,
  flashActive,
  currentFrameIndex,
  totalFrames,
}: CameraPreviewProps) {
  
  // Render frame overlay over the video preview to match the output
  const renderFrameOverlay = () => {
    if (selectedFrame.id === "none") return null;

    if (selectedFrame.id === "polaroid") {
      return (
        <div className="absolute inset-0 border-[16px] sm:border-[24px] border-b-[60px] sm:border-b-[80px] border-white pointer-events-none z-10 flex flex-col justify-end items-center pb-2 sm:pb-4">
          <div className="text-gray-700 italic font-bold text-xs sm:text-base">
            Photo {currentFrameIndex + 1}/{totalFrames}
          </div>
        </div>
      );
    }

    if (selectedFrame.id === "neon") {
      return (
        <div className="absolute inset-0 border-[8px] sm:border-[12px] border-transparent pointer-events-none z-10"
          style={{
            borderImage: "linear-gradient(to right, #ec4899, #3b82f6) 1",
            boxShadow: "inset 0 0 15px rgba(236, 72, 153, 0.5), 0 0 15px rgba(59, 130, 246, 0.5)"
          }}
        >
          {/* Neon Stars */}
          <span className="absolute top-2 left-2 text-white text-xs sm:text-base animate-pulse drop-shadow-md">★</span>
          <span className="absolute top-2 right-2 text-white text-xs sm:text-base animate-pulse drop-shadow-md">★</span>
          <span className="absolute bottom-2 left-2 text-white text-xs sm:text-base animate-pulse drop-shadow-md">★</span>
          <span className="absolute bottom-2 right-2 text-white text-xs sm:text-base animate-pulse drop-shadow-md">★</span>
        </div>
      );
    }

    if (selectedFrame.id === "pastel-hearts") {
      return (
        <div className="absolute inset-0 border-[10px] sm:border-[16px] border-rose-300 pointer-events-none z-10 flex items-center justify-between">
          <span className="absolute top-1 left-1 text-rose-500 text-sm sm:text-xl animate-bounce">💖</span>
          <span className="absolute top-1 right-1 text-rose-500 text-sm sm:text-xl animate-bounce delay-100">💖</span>
          <span className="absolute bottom-1 left-1 text-rose-500 text-sm sm:text-xl animate-bounce delay-200">💖</span>
          <span className="absolute bottom-1 right-1 text-rose-500 text-sm sm:text-xl animate-bounce delay-300">💖</span>
          <span className="absolute top-1/2 left-1 -translate-y-1/2 text-rose-400 text-[10px] sm:text-sm">🌸</span>
          <span className="absolute top-1/2 right-1 -translate-y-1/2 text-rose-400 text-[10px] sm:text-sm">🌸</span>
        </div>
      );
    }

    if (selectedFrame.id === "y2k-glitch") {
      return (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute inset-0 border-[8px] sm:border-[14px] border-green-500 translate-x-[2px] -translate-y-[2px]" />
          <div className="absolute inset-0 border-[8px] sm:border-[14px] border-purple-300 -translate-x-[2px] translate-y-[2px] flex flex-col justify-between p-3 font-mono text-[10px] sm:text-sm text-black font-extrabold uppercase drop-shadow-md">
            <div className="flex justify-between w-full">
              <span>★ Y2K ★</span>
              <span>CAMERA 01</span>
            </div>
            <div className="flex justify-start w-full">
              <span>PHOTO {currentFrameIndex + 1}/{totalFrames}</span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="relative w-full max-w-[800px] aspect-[4/3] rounded-2xl bg-zinc-900 border-4 border-[#ffce56] shadow-xl overflow-hidden glass-panel">
      {/* Video Stream */}
      {status === "ready" && (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover scale-x-[-1] ${selectedFilter.class}`}
          />
          {renderFrameOverlay()}
        </div>
      )}

      {/* Camera Requesting/Permission state */}
      {status === "requesting" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-zinc-900 bg-opacity-95 p-6 text-center">
          <RefreshCw className="w-12 h-12 text-[#ff5e97] animate-spin mb-4" />
          <h3 className="text-xl font-bold mb-2">Mengakses Kamera...</h3>
          <p className="text-sm text-zinc-400 max-w-xs">
            Harap berikan izin akses kamera pada pop-up browser Anda untuk melanjutkan.
          </p>
        </div>
      )}

      {/* Camera Idle state */}
      {status === "idle" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-zinc-900 bg-opacity-90 p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#ff5e97]/20 flex items-center justify-center mb-4 animate-pulse-gentle">
            <Camera className="w-8 h-8 text-[#ff5e97]" />
          </div>
          <h3 className="text-xl font-bold mb-2">Kamera Belum Aktif</h3>
          <p className="text-sm text-zinc-400 max-w-sm mb-6">
            Izinkan browser mengakses kamera Anda untuk memulai sesi photobooth yang seru!
          </p>
          <button
            onClick={startCamera}
            className="px-6 py-3 bg-[#ff5e97] hover:bg-[#e0447d] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer"
          >
            Aktifkan Kamera
          </button>
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-zinc-900 p-6 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
          <h3 className="text-xl font-bold text-rose-400 mb-2">Akses Kamera Gagal</h3>
          <p className="text-sm text-zinc-300 max-w-md mb-6">{error}</p>
          <button
            onClick={startCamera}
            className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Coba Hubungkan Kembali
          </button>
        </div>
      )}

      {/* Countdown overlay */}
      {countdown !== null && (
        <div className="absolute inset-0 bg-black/35 flex items-center justify-center z-35 backdrop-blur-[2px]">
          <div className="text-white font-black text-8xl sm:text-[10rem] animate-ping duration-1000 select-none">
            {countdown}
          </div>
        </div>
      )}

      {/* Camera Capture Flash Overlay */}
      {flashActive && (
        <div className="absolute inset-0 bg-white z-40 animate-flash" />
      )}
    </div>
  );
}
