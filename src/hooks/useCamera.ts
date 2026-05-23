import { useState, useCallback, useRef, useEffect } from "react";

export type CameraStatus = "idle" | "requesting" | "ready" | "error";

export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Auto bind stream when videoRef is mounted and stream is available
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, status]);

  const startCamera = useCallback(async () => {
    setStatus("requesting");
    setError(null);

    // Stop existing stream if any
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Browser Anda tidak mendukung akses kamera (WebRTC).");
      }

      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user", // front camera
        },
        audio: false, // no audio needed for photobooth
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setStatus("ready");
    } catch (err: any) {
      console.error("Camera access error:", err);
      setStatus("error");
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Izin kamera ditolak. Harap izinkan akses kamera di pengaturan browser Anda.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setError("Kamera tidak ditemukan. Pastikan kamera terpasang dengan benar.");
      } else {
        setError(err.message || "Gagal mengakses kamera. Silakan coba lagi.");
      }
    }
  }, [stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setStatus("idle");
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  return {
    stream,
    status,
    error,
    videoRef,
    startCamera,
    stopCamera,
  };
}
