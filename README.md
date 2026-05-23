# 📸 Web-Based Simple Photobooth (WebRTC & GIF Animasi)

Aplikasi Web Photobooth modern, minimalis, dan playful yang berjalan 100% di browser (*client-side*). Pengguna dapat mengambil serangkaian foto (3, 4, atau 6 frame) menggunakan kamera WebRTC, menerapkan frame visual dan filter secara real-time, lalu mengekspor hasilnya menjadi **GIF Animasi** bergerak atau **Kolase Foto (Grid/Strip)**.

Proyek ini dibangun menggunakan **Next.js 15**, **React 19**, **TypeScript**, **Tailwind CSS v4**, dan **GIF.js** (JS-based GIF Encoder menggunakan Web Workers). Cocok untuk tugas besar mata kuliah Pemrograman Web / Desain Produk.

---

## 🛠️ Tech Stack & Arsitektur Proyek

### 1. Teknologi Utama
- **Core Framework**: [Next.js (App Router)](https://nextjs.org/) + React + TypeScript.
- **Styling & Theme**: [Tailwind CSS v4](https://tailwindcss.com/) dengan tambahan font Google `Outfit` (playful aesthetic) dan efek *glassmorphism*.
- **Camera Access**: HTML5 WebRTC API (`navigator.mediaDevices.getUserMedia`) untuk mengambil video feed langsung.
- **GIF Generation**: [GIF.js](https://github.com/jnordberg/gif.js) yang dijalankan melalui Web Worker lokal (`public/gif.worker.js`) agar proses encoding frame GIF tidak memblokir thread UI utama.
- **Collage Processing**: HTML5 `<canvas>` API 2D context untuk menggabungkan beberapa gambar, menerapkan pencerminan (mirroring), memfilter warna, dan menggambar frame overlay.
- **Icons**: [Lucide React](https://lucide.dev/).

### 2. Struktur Folder Proyek
```text
photobooth/
├── public/
│   ├── gif.worker.js         # Web Worker untuk pemrosesan GIF (dihosting secara statis)
│   └── vercel.svg, globe.svg # Aset bawaan Next.js
├── src/
│   ├── app/
│   │   ├── globals.css       # Styling global, variabel tema playful, dan animasi custom (flash, float)
│   │   ├── layout.tsx        # Layout utama (setup font Outfit & meta SEO)
│   │   └── page.tsx          # Halaman dashboard utama photobooth
│   ├── components/
│   │   ├── CameraPreview.tsx # Komponen live preview video + filter + countdown & flash overlay
│   │   ├── ResultPanel.tsx   # Panel preview hasil akhir (Tab GIF & Kolase) + download
│   │   └── Photobooth.tsx    # Komponen utama pengatur state session & alur kerja capture
│   ├── hooks/
│   │   └── useCamera.ts      # Custom hook untuk manajemen stream kamera, perizinan, dan error handling
│   ├── utils/
│   │   ├── collage.ts        # Algoritma penyusunan grid foto (3 strip, 4 grid, 6 grid) di canvas
│   │   ├── gifGenerator.ts   # Helper untuk inisialisasi & trigger rendering GIF menggunakan gif.js
│   │   └── framesAndFilters.ts # Konfigurasi frame overlay (Polaroid, Neon, Pastel Hearts, Y2K) & filter CSS
```

---

## 🚀 Langkah Menjalankan Proyek

Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) (versi 18+ direkomendasikan) di komputer Anda.

1. **Clone / Masuk ke direktori proyek**:
   ```bash
   cd c:/laragon/www/photobooth
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```

4. **Buka di Browser**:
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda (Chrome/Firefox/Edge/Safari).

---

## ⚠️ Keterbatasan Browser & Catatan Teknis (Penting)

> [!WARNING]
> **1. Protokol Keamanan Kamera (HTTPS vs Localhost)**
> Browser modern membatasi akses kamera (`getUserMedia`) hanya untuk context yang aman (Secure Context):
> - **Lokal**: Bisa diakses secara bebas lewat alamat `http://localhost` atau `http://127.0.0.1`.
> - **Production / Deployment**: **Wajib menggunakan HTTPS**. Jika dideploy ke platform seperti Vercel, Netlify, atau Github Pages secara gratis, pastikan domain tersebut menggunakan SSL (`https://...`). Jika tidak, kamera tidak akan bisa diakses dan sistem akan memunculkan error "kamera tidak ditemukan/tidak diizinkan".
> 
> **2. Browser Mobile (Safari iOS & Chrome Android)**
> Pastikan saat meminta izin kamera, Anda memberikan akses penuh. Di iOS Safari, mode hemat daya (Low Power Mode) kadang-kadang menjeda video secara otomatis; disarankan untuk menonaktifkan mode hemat daya saat mencoba.
> 
> **3. Web Worker & Kecepatan Render**
> Library `gif.js` menggunakan *Web Workers* yang berjalan di background thread. Kami telah menyalin `gif.worker.js` ke folder `/public` agar bisa diload secara lokal dan aman dari pembatasan Cross-Origin CORS.

---

## 🎓 Rekomendasi Poin Presentasi Tugas Besar

Jika proyek ini digunakan untuk presentasi tugas kuliah pemrograman web atau proyek akhir, Anda dapat menonjolkan poin-poin berikut kepada dosen penguji untuk nilai tambah:

1. **Pemrosesan Gambar Asinkron & Non-Blocking**:
   Jelaskan bagaimana pemrosesan GIF yang berat dilakukan menggunakan *Web Workers* (`gif.worker.js`). Ini membuktikan Anda memahami konsep agar UI website tidak membeku (freeze) saat merender animasi GIF.
2. **Penggunaan Canvas API Lanjutan**:
   Tunjukkan bagaimana Canvas digunakan untuk:
   - Membalikkan sumbu X (`ctx.scale(-1, 1)`) agar foto akhir tercermin secara alami seperti cermin (mirrored preview).
   - Menghapus efek pencerminan secara sementara menggunakan `ctx.setTransform(1, 0, 0, 1, 0, 0)` tepat sebelum menggambar frame overlay, agar tulisan text di frame polaroid tidak terbalik (terbaca normal).
   - Menerapkan filter warna real-time menggunakan string query filter canvas (`ctx.filter = ...`).
3. **Respon Kamera & Error Handling**:
   Tunjukkan penanganan error yang matang di program: error saat izin ditolak (Permission Denied), error ketika device kamera tidak tercolok, dan sistem fallback otomatis ke mode Kolase apabila modul encoder GIF gagal dijalankan di browser tertentu.
4. **Desain UX yang Interaktif**:
   Fokus pada transisi countdown (3, 2, 1) dengan detak ketukan visual, efek flash putih yang meniru blitz kamera sungguhan, serta layout panel yang rapi menggunakan grid dinamis (Responsive Design) pada mobile maupun desktop.
