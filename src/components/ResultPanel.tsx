"use client";

import React, { useState } from "react";
import { Download, RefreshCw, Image as ImageIcon, Film } from "lucide-react";

interface ResultPanelProps {
  gifUrl: string | null;
  collageUrl: string | null;
  frameCount: number;
  selectedFrameName: string;
  selectedFilterName: string;
  onReset: () => void;
}

export function ResultPanel({
  gifUrl,
  collageUrl,
  frameCount,
  selectedFrameName,
  selectedFilterName,
  onReset,
}: ResultPanelProps) {
  const [activeTab, setActiveTab] = useState<"gif" | "collage">("gif");

  // Determine the default active tab. If gifUrl failed, default to collage.
  React.useEffect(() => {
    if (!gifUrl && collageUrl) {
      setActiveTab("collage");
    }
  }, [gifUrl, collageUrl]);

  const handleDownload = (type: "gif" | "collage") => {
    const url = type === "gif" ? gifUrl : collageUrl;
    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.download = `photobooth-${type}-${Date.now()}.${type === "gif" ? "gif" : "png"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-[#ffce56] glass-panel flex flex-col items-center">
      <div className="text-center mb-6">
        <span className="px-4 py-1.5 bg-[#5ce1e6]/20 text-[#00898f] rounded-full text-sm font-extrabold uppercase tracking-wide">
          Sesi Selesai 🎉
        </span>
        <h2 className="text-3xl font-black mt-2 text-[#2d2a2e]">Hasil Jepretan Kamu!</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Frame: <span className="font-bold text-[#ff5e97]">{selectedFrameName}</span> | Filter:{" "}
          <span className="font-bold text-[#ff5e97]">{selectedFilterName}</span> | {frameCount} Foto
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-zinc-100 p-1.5 rounded-2xl w-full max-w-md mb-6 border border-zinc-200">
        {gifUrl && (
          <button
            onClick={() => setActiveTab("gif")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === "gif"
                ? "bg-white text-[#ff5e97] shadow-md"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <Film className="w-4 h-4" />
            GIF Animasi
          </button>
        )}
        {collageUrl && (
          <button
            onClick={() => setActiveTab("collage")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === "collage" || !gifUrl
                ? "bg-white text-[#ff5e97] shadow-md"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Kolase Strip/Grid
          </button>
        )}
      </div>

      {/* Preview Display */}
      <div className="relative w-full flex justify-center mb-8 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-300 p-4 max-h-[500px] overflow-y-auto">
        {activeTab === "gif" && gifUrl && (
          <div className="flex flex-col items-center max-w-[400px] aspect-[4/3] w-full rounded-xl overflow-hidden shadow-lg border bg-white p-2">
            <img
              src={gifUrl}
              alt="GIF Photobooth"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        )}

        {activeTab === "collage" && collageUrl && (
          <div className="flex flex-col items-center max-w-[400px] w-full rounded-xl overflow-hidden shadow-lg border bg-white p-2">
            <img
              src={collageUrl}
              alt="Collage Photobooth"
              className="w-full object-contain rounded-lg"
            />
          </div>
        )}

        {!gifUrl && !collageUrl && (
          <div className="py-12 text-center text-zinc-400">
            Gagal memuat preview gambar.
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={() => handleDownload(activeTab)}
          disabled={activeTab === "gif" ? !gifUrl : !collageUrl}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#ff5e97] hover:bg-[#e0447d] disabled:bg-zinc-300 text-white font-extrabold rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
        >
          <Download className="w-5 h-5" />
          Download {activeTab === "gif" ? "GIF" : "Kolase"}
        </button>

        <button
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-zinc-50 text-[#2d2a2e] font-extrabold rounded-2xl border-2 border-zinc-200 shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <RefreshCw className="w-5 h-5" />
          Photo Lagi!
        </button>
      </div>
    </div>
  );
}
