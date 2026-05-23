import { Photobooth } from "@/components/Photobooth";
import { Sparkles, Camera, Heart, Film } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-between p-4 sm:p-8 md:p-12 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] aspect-square rounded-full bg-[#ffce56]/10 blur-[120px] pointer-events-none -z-10 animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] aspect-square rounded-full bg-[#ff5e97]/10 blur-[150px] pointer-events-none -z-10 animate-float [animation-delay:2s]" />
      <div className="absolute top-[30%] right-[-5%] w-[30%] aspect-square rounded-full bg-[#5ce1e6]/10 blur-[100px] pointer-events-none -z-10 animate-float [animation-delay:1s]" />

      {/* Header */}
      <header className="text-center mb-8 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff5e97]/10 border border-[#ff5e97]/20 text-[#ff5e97] font-bold text-sm mb-4 animate-pulse-gentle">
          <Sparkles className="w-4 h-4" />
          CaptureMoments
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#2d2a2e] mb-3">
          Web-Based <span className="text-[#ff5e97]">Photobooth</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 font-medium max-w-xl mx-auto">
          Ambil momen seru kamu langsung dari browser! Nikmati live filter & frame, lalu simpan sebagai **GIF animasi** atau **Kolase Grid** estetik.
        </p>
      </header>

      {/* Main Content Component */}
      <section className="flex-1 w-full flex justify-center items-center my-4">
        <Photobooth />
      </section>

      {/* Footer / Instructions */}
      <footer className="w-full max-w-3xl mt-12 text-center border-t border-dashed border-zinc-200 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-2xl mx-auto mb-8">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#ffce56]/20 flex items-center justify-center font-bold text-[#b28b24] shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-[#2d2a2e] text-sm">Izinkan Kamera</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Aktifkan izin kamera pada browser Anda untuk melihat video real-time.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#5ce1e6]/20 flex items-center justify-center font-bold text-[#00898f] shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-[#2d2a2e] text-sm">Kustomisasi Style</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Pilih jumlah capture, tema frame polaroid/neon, serta filter vintage/cyberpunk.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#ff5e97]/20 flex items-center justify-center font-bold text-[#d1376d] shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-[#2d2a2e] text-sm">Simpan Hasil</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Ambil foto berturut-turut, lalu unduh dalam format GIF bergerak atau Grid PNG.
              </p>
            </div>
          </div>
        </div>

        <div className="text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>Dibuat dengan 💻 HTML5 Canvas, WebRTC, dan GIF.js</span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1">
            Teknologi Browser 100% Client-Side <Heart className="w-3.5 h-3.5 text-[#ff5e97] fill-[#ff5e97]" />
          </span>
        </div>
      </footer>
    </main>
  );
}
