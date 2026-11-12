# Rayhandi Portofolio V2

Portofolio Rayhandi Zulmi, dibangun dengan Next.js 16 (App Router), React 19, dan TypeScript. Versi ini adalah migrasi dari portofolio HTML/CSS/JavaScript: desain, isi, dan gerak dipertahankan, sedangkan semua elemen kaca kini memakai [@zakisheriff/liquid-glass](https://liquidglass.theatom.lk/).

## Menjalankan

Butuh Node.js 20.9 atau lebih baru.

```sh
npm install
npm run dev      # http://localhost:3000, dengan hot reload
```

Untuk memeriksa hasil produksi secara lokal:

```sh
npm run build
npm run start
```

`npm run lint` menjalankan ESLint.

## Deploy

Situs ini statis (halaman `/` di-prerender saat build) dan tidak memerlukan backend atau environment variable. Di Vercel cukup hubungkan repo ini. `vercel.json` menetapkan framework Next.js, karena project Vercel yang dulu dibuat untuk situs HTML statis memakai preset lain. Jika di pengaturan project Vercel pernah diisi Build Command atau Output Directory secara manual, kosongkan keduanya. Optimasi gambar (`next/image`) berjalan otomatis di Vercel.

## Struktur

- `app/(id)/` dan `app/(en)/`: halaman Indonesia di `/` dan halaman Inggris di `/en`, masing-masing dengan root layout sendiri (lihat Bahasa).
- `components/root-document.tsx`: kerangka HTML bersama, metadata, font lokal (`next/font`), dan skrip kecil yang berjalan sebelum paint pertama.
- `components/home.tsx`: urutan section halaman, dipakai kedua bahasa.
- `app/globals.css`: seluruh styling: warna, tata letak, responsive, dan token `--lg-*` yang menyetel tampilan kaca.
- `components/`: satu file per bagian (`hero`, `work`, `about`, `skills`, `contact`) dan per kontrol (`site-header`, `language-switch`, `project-browser`, `contact-form`, `to-top`).
- `lib/content.ts`: semua teks halaman dalam dua bahasa. `lib/projects.tsx`: data project, juga dua bahasa. `lib/site.ts`: email, tautan, dan daftar section navigasi.
- `lib/motion.ts`: seluruh motion halaman (lihat di bawah).
- `config/liquid-glass-loader.cjs`: dua penyesuaian pada paket kaca saat build (lihat Liquid glass).
- `public/images/`: foto dan logo asli. `app/fonts/`: font lokal beserta lisensi SIL Open Font License. Cormorant sudah dipangkas ke huruf Latin dalam format WOFF2 (21 KB, dari 95 KB); cara membuatnya ada di `app/fonts/README.md`.

### Mengubah isi

- **Teks halaman:** `lib/content.ts`, dengan blok `id` dan `en` berdampingan. TypeScript akan menandai jika satu bahasa kekurangan teks. Label yang di versi Indonesia memang sudah berbahasa Inggris ("Selected work", "Let's connect", band disiplin) ditulis langsung di komponennya dan sama di kedua bahasa.
- **Project:** tambahkan entri pada array `PROJECTS` di `lib/projects.tsx` (kategori, cover, judul, deskripsi, tag, tautan). Judul, deskripsi, dan label tautan diisi `{ id, en }`. Jumlah pada filter dihitung otomatis. Entri pertama selalu menjadi project utama.
- **Keahlian dan persentase:** `SKILL_GROUPS` dan `SKILL_LEVELS` di `components/skills.tsx`; ringkasan tiap kelompok ada di `lib/content.ts`.
- **Email, GitHub, LinkedIn:** `lib/site.ts`.

## Arah desain

Gabungan dua versi: atmosfer laut dalam dari [portofolio sebelumnya](https://rayhandi-portofolio.vercel.app/), dengan komposisi dan gerak scroll dari redesign editorial.

- Navy #051221 dan #071a2e, permukaan #0b2339, gradasi laut #d4eeff ke #3b97df, satu warna pasir #e6d3b3 untuk cover DigiTask.
- Plus Jakarta Sans untuk struktur; Cormorant Garamond italic dengan gradasi laut untuk aksen personal.
- UMN Softskill sebagai featured project, diikuti HIMSI UMN dan DigiTask.
- Variasi tata letak: hero penuh dengan nama yang menimpa foto, featured project, dua project pendukung, profil, skill, kontak dengan kartu form.
- Responsive, fokus keyboard, skip link, menu mobile, filter dengan status aksesibel, reduced motion, reduced transparency.

Cover project adalah komposisi tipografi dan logo asli, **bukan screenshot antarmuka**. Tidak ditambahkan screenshot, hasil project, atau testimoni fiktif. Angka 15+, 3+, 10+ dan persentase kemampuan dipertahankan dari portofolio awal; bukan hasil verifikasi independen.

## Liquid glass

Kaca berasal dari paket `@zakisheriff/liquid-glass` (MIT), dipakai hanya untuk kontrol yang melayang atau ditekan. Kartu, form, dan stiker foto tetap solid.

| Elemen | Komponen |
| --- | --- |
| Kapsul navbar | permukaan kaca lewat `useRefraction` pada elemen sendiri |
| Tab section di navbar | `GlassNav` |
| Mari berdiskusi, Kenali saya, Jelajahi project, ikon sosial, tombol ke atas, tombol form | `GlassButton` |
| Filter project, switch bahasa ID/EN | `GlassSegmented` |

- **Bening:** token `--lg-*` di awal `app/globals.css` menyetel tint navy tipis, blur 3px, dan saturasi 1.9. Brightness diturunkan ke 0.8 supaya label navbar tetap terbaca saat judul putih lewat di belakangnya; di area gelap kacanya tetap terlihat bening.
- **Navbar tanpa blur:** kapsul navbar dan kontrol di dalamnya memakai blur 0, jadi isi yang lewat di belakangnya tetap tajam dan hanya dibelokkan di tepinya. Label menu tetap terbaca lewat brightness 0.8 dan bayangan teks.
- **Lensa:** tahan sebuah tab atau pilihan filter dan pilihannya terangkat menjadi lensa yang bisa digeser. Lensa hanya bergerak mendatar.
- **Dua penyesuaian pada paket**, dibuat saat build oleh `config/liquid-glass-loader.cjs` (file di `node_modules` tetap asli): lensa tab dan filter tanpa dispersi, jadi rim-nya putih dan huruf di bawah lensa tidak berpinggiran magenta dan hijau; dan lensa yang diseret berhenti tepat di item pertama dan terakhir, tidak melentur melewatinya. Versi paket dikunci di 4.0.0. Jika versi lain dipasang dan kodenya tidak lagi cocok, build berhenti dengan pesan yang jelas. Hapus aturan `turbopack` di `next.config.ts` untuk kembali ke perilaku asli paket.
- **Pembiasan:** di Chrome dan Edge, kaca membiaskan apa pun di belakangnya. Di Safari, lensa tab dan filter tetap membias; kapsul navbar dan tombol tampil dengan frosting dan rim. Firefox memakai jalur yang sama dengan Safari dan belum diuji oleh pembuat paketnya.
- **Selama scroll** pembiasan dijeda oleh paketnya dan kembali saat halaman diam.
- **Sentuhan:** paket ini menahan sentuhan yang dimulai di atas tombolnya, sehingga halaman tidak ikut scroll. `components/glass-touch-scroll.tsx` dan satu aturan `touch-action` mengembalikan scroll vertikal; tap dan geser mendatar tetap milik kontrolnya.
- **Di section Kontak** tidak ada tab yang aktif: pill memudar dan tombol Mari berdiskusi yang menyala.
- `prefers-reduced-transparency` mengganti semua kaca dengan warna solid.

## Bahasa

Halaman Indonesia ada di `/` dan halaman Inggris di `/en`. Keduanya di-prerender statis, dan `<html lang>` sesuai bahasanya.

- **Switch ID/EN** ada di ujung kanan navbar; di HP letaknya di samping tombol menu. Saat diganti, halaman bahasa lain dibuka di section yang sedang dilihat (misalnya `/en#project`).
- **Muat ulang penuh:** tiap bahasa punya root layout sendiri (`app/(id)/layout.tsx` dan `app/(en)/layout.tsx`), jadi pindah bahasa selalu memuat ulang halaman. Itu sengaja: animasi halaman bekerja dengan elemen ber-ID, dan halaman lama yang disimpan tersembunyi oleh navigasi sisi klien akan menggandakan ID-ID itu.
- **Tanpa JavaScript** switch tampil sebagai dua tautan biasa.
- Pilihan bahasa tidak diingat: membuka `/` selalu menampilkan versi Indonesia.
- Tautan `hreflang` antarbahasa belum dipasang karena butuh domain situs yang pasti (`metadataBase`).

## Motion

Tanpa library animasi; semuanya di `app/globals.css` dan `lib/motion.ts`, dijalankan oleh `components/motion.tsx`.

- **Ide utama, sans ke serif:** bagian `em` pada judul berubah dari Plus Jakarta Sans ke Cormorant italic mengikuti scroll, memerankan kalimat "Dibangun dengan logika. Dirancang dengan rasa." Judul skill melakukan hal yang sama saat di-hover.
- **Laut (berjalan terus selama hero terlihat):** konstelasi partikel yang tertarik ke kursor, cahaya yang mengitari bingkai foto, dan teks peran yang mengetik sendiri. Berhenti saat hero keluar layar atau tab disembunyikan.
- **Pembuka:** huruf nama naik satu per satu, foto terbuka dari bawah, stiker menempel terakhir. Tanpa preloader yang memblokir.
- **Scroll:** foto dan nama bergeser halus, tanda ✳ berputar, band disiplin hanya bergerak saat halaman di-scroll, kartu project bergeser berbeda kecepatan, section About dan Kontak melebar sampai penuh, kalimat About menyala kata demi kata, angka statistik menghitung naik, bar skill terisi, nama besar menutup halaman di footer.
- **Pointer dan aksi:** kartu project miring 3D dan isinya mengikuti pointer, sudut cover melengkung, cincin mengikuti kursor (kursor asli tetap ada), navbar mengecil saat di-scroll dan kembali normal di paling atas, garis tautan tergambar, panah bertukar saat di-hover, label form mengambang, filter memakai View Transitions.

React merender markup-nya; `lib/motion.ts` hanya menganimasikannya. Saat harus menyusun ulang teks (wipe serif, nama yang dipecah per huruf, kalimat yang menyala), modul ini menyimpan node asli dan mengembalikannya saat cleanup.

Dengan `prefers-reduced-motion` atau tanpa JavaScript, semua konten tampil dalam kondisi akhir dan diam, dan navigasi memakai tautan biasa. Jika JavaScript gagal dimuat, skrip di `components/root-document.tsx` mengembalikan halaman ke kondisi itu setelah enam detik.

## Kontak: penting

Tombol **Buka aplikasi email** membuat URL `mailto:` dengan nama, email, dan pesan yang di-encode. Pengunjung tetap harus menekan Kirim di aplikasi email mereka. **Tidak ada backend atau pengiriman langsung dari website.** Jika aplikasi email default belum dikonfigurasi, gunakan alamat email yang ditampilkan.

## Verifikasi

Dilakukan pada build produksi (`next build` lalu `next start`) dengan Chrome headless, dibandingkan dengan versi HTML sebelum migrasi:

- **Tata letak:** posisi dan ukuran 67 elemen utama dibandingkan pada lebar 390, 768, 1024, 1440, dan 1920 px. Semuanya sama dalam 1,5 px, kecuali filter project di 390 px yang 2 px lebih sempit dan tombol Mari berdiskusi yang bergeser untuk memberi ruang bagi switch bahasa.
- **Dua bahasa:** `/` dan `/en` dimuat di lebar 390 dan 1440 px dengan CPU normal dan diperlambat 6x tanpa error; tidak ada overflow di halaman Inggris dari 320 sampai 1920 px; tidak ada teks Indonesia yang tertinggal di halaman Inggris; switch membuka bahasa lain di section yang sama, lewat klik maupun keyboard, dan tombol Back kembali dengan switch yang benar; draft email versi Inggris memakai kalimat Inggris.
- **Tidak ditemukan** horizontal overflow, aset gagal dimuat, error hidrasi React, atau JavaScript runtime error, termasuk saat CPU diperlambat 4x dan 8x.
- **Lensa navbar:** tahan, geser, lepas; tidak bergerak vertikal; berhenti di tengah item pertama dan terakhir; klik dan tombol panah keyboard berpindah section dan memperbarui alamat.
- **Tanpa pinggiran warna:** piksel di sekitar lensa navbar dan filter diperiksa saat diam, ditahan, dan diseret di antara dua tab, termasuk di atas judul hero; tidak ada piksel berwarna di luar biru halaman.
- **Filter** Semua/Web/Aplikasi, jumlah hasil, dan perpindahan layout saat satu project tersisa.
- **Menu mobile:** buka, fokus ke tautan pertama, tutup dengan Escape, tutup setelah memilih.
- **Form:** kolom kosong dan hanya spasi ditolak; nama serta pesan dengan karakter khusus ter-encode benar. Hanya pembentukan draft yang diperiksa, tanpa mengirim email atau meluncurkan aplikasi email.
- **Sentuhan:** geser vertikal yang dimulai di atas tombol dan filter tetap men-scroll halaman; tap dan geser mendatar tetap berfungsi.
- **Tanpa JavaScript, reduced motion, reduced transparency,** dan mode development (React Strict Mode).
- **Axe-core 4.10.3**, rule tags WCAG 2 A/AA dan WCAG 2.1 AA: 0 pelanggaran otomatis pada 390 dan 1440 px di kedua bahasa dalam kondisi akhir, dengan 1 pemeriksaan kontras yang memerlukan peninjauan manual per ukuran, sama seperti versi sebelum migrasi. Bukan sertifikasi aksesibilitas lengkap.

Belum diuji: Safari, Firefox, dan perangkat fisik. Kehalusan gerakan dan performa di perangkat nyata dinilai dari frame statis saja. Ketersediaan tautan eksternal tidak diverifikasi.

## Catatan migrasi

- Unduhan kunjungan pertama sekitar 285 KB: JavaScript 168 KB (React dan Next.js sekitar 118 KB, sisanya paket kaca, animasi, dan kode halaman), font 49 KB, gambar 33–42 KB, CSS dan HTML 25 KB. JavaScript-nya naik dari sekitar 11 KB pada versi HTML.
- Tab navbar dan filter kini berperan sebagai `tablist` (bawaan paket), bukan tautan dan tombol toggle.
- Panah pada tombol dan tautan kini benar-benar bertukar saat di-hover; pada versi HTML panahnya menghilang karena selektor yang meleset.
