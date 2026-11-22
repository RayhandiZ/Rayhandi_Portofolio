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

Situs ini statis (halaman `/` di-prerender saat build) dan tidak memerlukan backend atau environment variable. Alamat situs, `SITE_URL` di `lib/site.ts`, dipakai untuk canonical, hreflang, sitemap.xml, robots.txt, dan gambar preview tautan; ganti di sana jika domainnya berubah. Di Vercel cukup hubungkan repo ini. `vercel.json` menetapkan framework Next.js, karena project Vercel yang dulu dibuat untuk situs HTML statis memakai preset lain. Jika di pengaturan project Vercel pernah diisi Build Command atau Output Directory secara manual, kosongkan keduanya. Optimasi gambar (`next/image`) berjalan otomatis di Vercel.

## Struktur

- `app/(id)/` dan `app/(en)/`: halaman Indonesia di `/` dan halaman Inggris di `/en`, masing-masing dengan root layout sendiri (lihat Bahasa) dan `opengraph-image.tsx` di samping halamannya.
- `app/sitemap.ts` dan `app/robots.ts`: sitemap.xml dan robots.txt. `lib/og-image.tsx`: gambar preview tautan untuk kedua bahasa (lihat SEO dan preview tautan).
- `components/root-document.tsx`: kerangka HTML bersama, metadata, font lokal (`next/font`), dan skrip kecil yang berjalan sebelum paint pertama.
- `components/home.tsx`: urutan section halaman, dipakai kedua bahasa.
- `app/globals.css`: seluruh styling: warna, tata letak, responsive, dan token `--lg-*` yang menyetel tampilan kaca.
- `components/`: satu file per bagian (`hero`, `work`, `about`, `experience`, `skills`, `contact`) dan per kontrol (`site-header`, `language-switch`, `project-browser`, `contact-form`, `copy-email`, `local-time`, `to-top`).
- `lib/content.ts`: semua teks halaman dalam dua bahasa. `lib/projects.tsx`: data project, juga dua bahasa. `lib/site.ts`: alamat dan nama situs, email, tautan, dan daftar section navigasi.
- `lib/motion.ts`: seluruh motion halaman (lihat di bawah). `lib/smooth-scroll.ts`: scroll halus dengan Lenis (lihat Scroll halus).
- `lib/experience.ts`: pengalaman kerja, organisasi, pendidikan, kutipan surat referensi, dan sertifikat, diringkas dari CV di `public/cv/`. `public/certificates/`: gambar sertifikat yang ditautkan dari section Pengalaman.
- `config/liquid-glass-loader.cjs`: dua penyesuaian pada paket kaca saat build (lihat Liquid glass).
- `public/images/`: foto dan logo asli, plus `rayhandi-og.jpg`, potongan foto untuk gambar preview. `app/fonts/`: font lokal beserta lisensi SIL Open Font License. Cormorant sudah dipangkas ke huruf Latin dalam format WOFF2 (21 KB, dari 95 KB); `app/fonts/og/` berisi salinan TTF untuk gambar preview. Cara membuat keduanya ada di `app/fonts/README.md`.

### Mengubah isi

- **Teks halaman:** `lib/content.ts`, dengan blok `id` dan `en` berdampingan. TypeScript akan menandai jika satu bahasa kekurangan teks. Label yang di versi Indonesia memang sudah berbahasa Inggris ("Selected work", "Let's connect", band disiplin) ditulis langsung di komponennya dan sama di kedua bahasa.
- **Project:** tambahkan entri pada array `PROJECTS` di `lib/projects.tsx` (kategori, cover, nama pendek, judul, deskripsi, tag, tautan). Nama pendek, judul, deskripsi, dan label tautan diisi `{ id, en }`. Jumlah pada filter dihitung otomatis. Entri pertama selalu menjadi project utama.
- **Keahlian:** `SKILL_GROUPS` di `components/skills.tsx`, dengan nama file logo dari `public/logos` (alat tanpa logo memakai tanda ✳); ringkasan tiap kelompok ada di `lib/content.ts`. Kalimat "Dipakai di ..." di bawah tiap kelompok dibuat dari tag project: project yang tag-nya menyebut salah satu alat di kelompok itu ikut disebut, dengan nama pendeknya sebagai tautan ke kartunya. Jadi saat menambah project, beri tag yang sama dengan nama alatnya (beda huruf besar-kecil dan akhiran ".js" tidak masalah).
- **Email, GitHub, LinkedIn, domain, dan nama situs:** `lib/site.ts`. `SITE_NAME` menjadi judul tab dan nama situs di preview tautan.
- **Pengalaman dan CV:** `lib/experience.ts` dan `public/cv/CV_Rayhandi_Zulmi.pdf` (alamatnya `CV_PATH` di `lib/site.ts`). Ganti keduanya bersamaan supaya halaman dan PDF bercerita sama. PDF itu memuat nomor telepon dan ikut terpublikasi saat deploy.
- **Sertifikat:** `CERTIFICATES` di `lib/experience.ts`, terbaru di atas, dengan gambarnya di `public/certificates/`. Gambar itu halaman pertama PDF sertifikat yang dirender ke JPEG selebar 1600 px dengan kualitas 80 (170–290 KB; PDF aslinya sampai 8,6 MB), misalnya dengan PyMuPDF: `page.get_pixmap(matrix=pymupdf.Matrix(z, z)).save("x.jpg", jpg_quality=80)`. Hanya sertifikat yang mendukung isi halaman yang dipasang; dua sertifikat seminar literasi keuangan sengaja tidak.
- **Kutipan surat referensi:** isian `reference` pada peran di `ROLES`. Kutipannya ditulis kata per kata dalam bahasa suratnya (`lang` menandainya untuk pembaca layar) dan tampil di bawah peran itu. Surat aslinya tidak dipasang karena memuat tanda tangan; bagikan saat diminta.
- **Status ketersediaan:** `contact.status.value` di `lib/content.ts`. Teks yang sama tampil di pill paling atas hero (tautan ke Kontak) dan di kartu Status, jadi cukup diganti di satu tempat.

## Arah desain

Gabungan dua versi: atmosfer laut dalam dari [portofolio sebelumnya](https://rayhandi-portofolio.vercel.app/), dengan komposisi dan gerak scroll dari redesign editorial.

- Navy #051221 dan #071a2e, permukaan #0b2339, gradasi laut #d4eeff ke #3b97df, satu warna pasir #e6d3b3 untuk cover DigiTask.
- Plus Jakarta Sans untuk struktur; Cormorant Garamond italic dengan gradasi laut untuk aksen personal.
- UMN Softskill sebagai featured project, diikuti HIMSI UMN dan DigiTask.
- Variasi tata letak: hero penuh dengan nama yang menimpa foto, featured project, dua project pendukung, profil, pengalaman dan pendidikan, skill, kontak dengan kartu form. Section Pengalaman tidak punya tab sendiri; selama dibaca, tab Tentang yang menyala.
- Responsive, fokus keyboard, skip link, menu mobile, filter dengan status aksesibel, reduced motion, reduced transparency.

Cover project adalah komposisi tipografi dan logo asli, **bukan screenshot antarmuka**. Tidak ditambahkan screenshot, hasil project, atau testimoni fiktif. Statistik angka (15+, 3+, 10+) dan persentase kemampuan dari portofolio awal sudah dihapus: angkanya tidak terverifikasi, dan persentase hasil penilaian sendiri (misalnya JavaScript 50%) terbaca sebagai "baru setengah bisa".

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
- Kedua halaman memasang canonical dan `hreflang` (`id`, `en`, dan `x-default` ke versi Indonesia), sama dengan pasangan bahasa di sitemap.xml.

## SEO dan preview tautan

- **Judul dan deskripsi:** judulnya cukup "Rayhandi Zulmi", dari `SITE_NAME` di `lib/site.ts`, tanpa peran. Deskripsi per bahasa ada di `lib/content.ts`.
- **Open Graph:** `metadataFor` di `components/root-document.tsx` mengisinya, dengan `metadataBase` dari `SITE_URL`. Next.js menyalin judul, deskripsi, dan gambarnya ke kartu Twitter (`summary_large_image`), jadi kartu itu tidak ditulis terpisah.
- **Gambar preview:** `lib/og-image.tsx` menggambarnya saat build untuk `app/(id)/opengraph-image.tsx` dan `app/(en)/en/opengraph-image.tsx`: 1200×630 px, sapaan dan nama seperti di hero, alamat situs, dan foto dalam bingkai melengkung dengan senja seperti di hero. Versi Inggris berada di `app/(en)/en/` karena `app/(en)/opengraph-image` akan memakai alamat yang sama dengan versi Indonesia.
- **Aset gambar preview:** `next/og` tidak bisa membaca WOFF2, jadi gambarnya memakai salinan TTF di `app/fonts/og/`, ditambah `public/images/rayhandi-og.jpg`, potongan 4:5 dari `rayhandi-pantai.jpeg` (x 592, y 2048, 1212×1516 px, diperkecil ke 480×600). PNG-nya sekitar 380 KB; jaga di bawah 600 KB, batas WhatsApp untuk gambar preview.
- **robots.txt dan sitemap.xml:** `app/robots.ts` mengizinkan semua crawler dan menunjuk ke sitemap. `app/sitemap.ts` mendaftarkan `/` dan `/en` beserta pasangan bahasanya.
- **Setelah deploy:** LinkedIn dan WhatsApp menyimpan preview lama untuk tautan yang pernah dibagikan. Di LinkedIn, periksa tautannya lewat [Post Inspector](https://www.linkedin.com/post-inspector/) untuk mengambil preview baru.

## Motion

Tanpa library animasi; semuanya di `app/globals.css` dan `lib/motion.ts`, dijalankan oleh `components/motion.tsx`. Satu-satunya library gerak adalah Lenis untuk scroll halus (lihat Scroll halus).

- **Ide utama, sans ke serif:** bagian `em` pada judul berubah dari Plus Jakarta Sans ke Cormorant italic mengikuti scroll, memerankan kalimat "Dibangun dengan logika. Dirancang dengan rasa." Judul skill melakukan hal yang sama saat di-hover.
- **Laut (berjalan terus selama hero terlihat):** konstelasi partikel yang tertarik ke kursor, cahaya yang mengitari bingkai foto, teks peran yang mengetik sendiri, dan titik status yang berdenyut di pill ketersediaan. Berhenti saat hero keluar layar atau tab disembunyikan (denyutnya lewat kelas `is-offscreen` pada hero).
- **Pembuka:** pill ketersediaan muncul lebih dulu, huruf nama naik satu per satu, foto terbuka dari bawah, stiker menempel terakhir. Tanpa preloader yang memblokir.
- **Scroll:** foto dan nama bergeser halus, tanda ✳ berputar, band disiplin hanya bergerak saat halaman di-scroll, kartu project bergeser berbeda kecepatan, section About dan Kontak melebar sampai penuh, kalimat About menyala kata demi kata, nama besar menutup halaman di footer.
- **Pointer dan aksi:** kartu project miring 3D dan isinya mengikuti pointer, sudut cover melengkung, cincin mengikuti kursor (kursor asli tetap ada), navbar mengecil saat di-scroll dan kembali normal di paling atas, garis tautan tergambar, panah bertukar saat di-hover, label form mengambang, filter memakai View Transitions.

React merender markup-nya; `lib/motion.ts` hanya menganimasikannya. Saat harus menyusun ulang teks (wipe serif, nama yang dipecah per huruf, kalimat yang menyala), modul ini menyimpan node asli dan mengembalikannya saat cleanup.

Dengan `prefers-reduced-motion` atau tanpa JavaScript, semua konten tampil dalam kondisi akhir dan diam, dan navigasi memakai tautan biasa. Jika JavaScript gagal dimuat, skrip di `components/root-document.tsx` mengembalikan halaman ke kondisi itu setelah enam detik.

## Scroll halus

Roda mouse dan tautan di dalam halaman digulir dengan [Lenis](https://github.com/darkroomengineering/lenis) 1.3.27 (`lib/smooth-scroll.ts`), library yang juga dipakai situs referensi. Sentuhan di HP tetap memakai scroll bawaan browser.

- **Rasa:** `lerp: 0.08`. Satu putaran roda menempuh setengah jarak dalam sekitar 0,17 detik dan 90% dalam sekitar 0,5 detik, sama dengan kurva yang diukur di situs referensi.
- **Hanya bersama motion:** Lenis dinyalakan `components/motion.tsx` saat kelas `motion` aktif. Dengan `prefers-reduced-motion`, tanpa JavaScript, atau setelah fallback enam detik, scroll tetap bawaan browser.
- **Tautan dan tab:** tautan `#section` diambil alih Lenis (`anchors: true`) dan berhenti di bawah navbar karena Lenis membaca `scroll-padding-top`. Tab navbar memakai `scrollToSection()`. Selama perjalanan, pilihan tab tetap tertahan di tujuan: `scrollend` diabaikan selama Lenis masih menggulir menuju target.
- **Posisi scroll asli:** Lenis menggulir window itu sendiri (dengan `behavior: "instant"`), jadi `lib/motion.ts`, scroll spy, dan liquid glass tetap membaca `scrollY` seperti biasa. `scroll-behavior: smooth` di CSS tetap ada untuk mode tanpa Lenis.
- **Kolom pesan** di form memakai `data-lenis-prevent`, jadi pesan panjang di-scroll di dalam kolomnya, bukan menggeser halaman.

## Kontak: penting

Tombol **Buka aplikasi email** membuat URL `mailto:` dengan nama, email, dan pesan yang di-encode. Pengunjung tetap harus menekan Kirim di aplikasi email mereka. **Tidak ada backend atau pengiriman langsung dari website.** Jika aplikasi email default belum dikonfigurasi, pengunjung bisa menekan tombol **Salin** di kartu Email (`components/copy-email.tsx`). Tombol itu muncul setelah JavaScript berjalan dan hanya jika browser menyediakan clipboard; di kolom sempit ia hanya menampilkan ikon. Seluruh kartu Email tetap membuka `mailto:`.

Di bawah lokasi ada jam setempat (WIB, `components/local-time.tsx`), diperbarui tiap menit. HTML hasil prerender mengosongkan baris itu, jadi halaman statis tidak pernah menampilkan jam yang basi.

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

### SEO dan pembersihan (November 2026)

Diperiksa pada build produksi:

- `next build`, `tsc --noEmit`, dan ESLint tanpa error atau peringatan. Semua route statis, termasuk kedua gambar preview, robots.txt, dan sitemap.xml.
- `<head>` di `/` dan `/en`: judul, deskripsi per bahasa, canonical, hreflang `id`/`en`/`x-default`, Open Graph dengan `og:locale` dan `og:locale:alternate`, kartu Twitter `summary_large_image`, dan URL gambar absolut ke `rayhandi-portofolio.vercel.app`.
- Kedua gambar preview diperiksa langsung: teks sesuai bahasanya, apostrof melengkung di "Hi, I’m", tidak ada glyph yang hilang.
- Section Tentang dan Keahlian di lebar 1440 dan 390 px dengan reduced motion: tata letak tetap rapi setelah statistik dan bar skill dihapus, tanpa horizontal overflow.
- Keahlian versi baru (logo di chip, kalimat "Dipakai di" / "Used in") di kedua bahasa pada 1440 dan 390 px. Logo MySQL yang ditebalkan dicek di chip 16 px dan di tech band 32 px.
- Tautan ke kartu project saat filter menyembunyikannya: filter Data dipilih, lalu tautan DigiTask di Keahlian diklik dengan mouse. Filter kembali ke Semua, kartu tampil 96 px dari atas (di bawah navbar), dan alamat menjadi `#project-digitask`.

Belum diuji: preview sungguhan di LinkedIn dan WhatsApp (butuh deploy). Axe-core belum dijalankan ulang.

### Status, jam lokal, dan salin email (November 2026)

Ditambahkan setelah membandingkan dengan shot portofolio populer di Dribbble (status "available for work" yang terlihat sejak awal, jam lokal di header). Liquid glass tidak diubah. Diperiksa pada build produksi dengan Chrome headless dan mouse sungguhan:

- Pill status di hero tampil setelah pembuka, menautkan ke `#kontak`, dan membawa Kontak tepat di bawah navbar (96 px). Pembaca layar mendengar "Tersedia untuk freelance, hubungi saya".
- Denyut titik status berjalan saat hero terlihat dan berhenti (`paused`) saat hero di luar layar.
- Jam lokal tampil sebagai "Sekarang pukul 11.15 WIB" dan "It’s 11:15 AM here (UTC+7)".
- Tombol salin mengisi clipboard dengan alamat email, berubah menjadi "Tersalin" / "Copied", diumumkan lewat `role="status"`, lalu kembali ke label awal setelah sekitar 2,4 detik.
- Kartu Kontak di 320, 360, 390, 768, dan 1440 px: alamat email satu baris mulai sekitar 325 px, dan di bawahnya terpotong setelah "@". Tidak ada horizontal overflow di 320, 375, 414, 768, 1024, 1280, 1440, dan 1920 px di kedua bahasa.

### Scroll halus, pengalaman, dan CV (November 2026)

Diperiksa pada build produksi dengan Chrome headless, input roda dan klik sungguhan, dan posisi scroll dicatat tiap frame:

- Satu putaran roda (300 px): 50% dalam 170 ms, 90% dalam 503 ms (situs referensi: 184 ms dan 500 ms), langkah terbesar per frame 23 px, tanpa balik arah.
- Tombol Jelajahi project, tab Keahlian (7.416 px), dan tautan DigiTask dari Keahlian saat filter Data aktif: semua bergerak tanpa balik arah, berhenti 96 px dari atas, dan memperbarui alamat. Tab navbar langsung berpindah dari Beranda ke Keahlian tanpa mampir di tab lain.
- Roda di dalam kolom pesan menggulir kolomnya (200 px), halaman diam. Dengan reduced motion, Lenis tidak aktif.
- `/cv/CV_Rayhandi_Zulmi.pdf` tersaji sebagai `application/pdf` (147.354 byte, sama dengan file sumber) dan ditautkan dari section Pengalaman dan kartu CV di Kontak.
- Section Pengalaman di 390, 768, dan 1440 px, di kedua bahasa: tata letak rapi, tanpa horizontal overflow.

### Tombol CV di navbar (November 2026)

Di atas 900 px, tautan unduh CV pindah dari section Pengalaman ke navbar sebagai tombol "CV ↓" di samping Mari berdiskusi (`.nav-cv`). Di 900 px ke bawah navbar tidak memuatnya dan tautan "Unduh CV (PDF)" tetap di section Pengalaman. Diperiksa dengan Chrome headless:

- `next build`, `tsc --noEmit`, dan ESLint tanpa error.
- Lebar 320, 390, 768, 900, 901, 1024, 1100, 1101, 1280, 1440, dan 1920 px di kedua bahasa: tidak ada horizontal overflow, dan tombol di navbar tidak saling menimpa. Paling sempit di 901 px (bahasa Indonesia, sudah di-scroll): sekitar 36 px antara tab Keahlian dan tombol CV.
- Tanpa JavaScript di 901 dan 1280 px: tombol CV tampil di samping tautan biasa.
- Nama tombol untuk pembaca layar: "Unduh CV (PDF)" / "Download CV (PDF)". Teks yang sama muncul sebagai tooltip.

### Sertifikat dan surat referensi (November 2026)

Diperiksa pada build produksi dengan Chrome headless:

- Kutipan surat referensi PT Link Net tampil satu kali, di bawah peran HR Data Analytics Intern, bertanda `lang="en"` di kedua versi bahasa, dengan keterangan "Kutipan surat referensi, 3 September 2026" / "From the reference letter, 3 September 2026".
- Daftar Sertifikat di kolom kanan, setelah Organisasi. Kedua gambar tersaji sebagai `image/jpeg` (170.207 dan 295.191 byte), dibuka di tab baru, dan nama tautannya untuk pembaca layar menyebut sertifikatnya ("Lihat sertifikat: Intro to Programming").
- Tanpa horizontal overflow di 320, 375, 768, 1024, 1280, 1366, 1440, dan 1920 px di kedua bahasa. Kolom kiri yang sticky (578–600 px) tetap muat di bawah navbar, termasuk di layar 1280×720 (ruang 610 px).

## Catatan migrasi

- Unduhan kunjungan pertama sekitar 285 KB: JavaScript 168 KB (React dan Next.js sekitar 118 KB, sisanya paket kaca, animasi, dan kode halaman), font 49 KB, gambar 33–42 KB, CSS dan HTML 25 KB. JavaScript-nya naik dari sekitar 11 KB pada versi HTML.
- Tab navbar dan filter kini berperan sebagai `tablist` (bawaan paket), bukan tautan dan tombol toggle.
- Panah pada tombol dan tautan kini benar-benar bertukar saat di-hover; pada versi HTML panahnya menghilang karena selektor yang meleset.
