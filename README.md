# Rayhandi Portofolio V2

Redesign dari portofolio HTML/CSS/JavaScript milik Rayhandi Zulmi. Folder versi asli tidak diubah.

## Cara membuka

Klik dua kali **index.html**. Tidak perlu npm, instalasi framework, koneksi internet, atau proses build. Foto, logo, CSS, JavaScript, dan font tersedia lokal. Tautan GitHub, LinkedIn, dan website project membutuhkan internet.

Untuk preview melalui server lokal, dari folder ini jalankan:

```sh
python -m http.server 8080 --bind 127.0.0.1
```

Kemudian buka http://127.0.0.1:8080. Server ini opsional.

## Arah desain

Gabungan dua versi: atmosfer laut dalam dari [portofolio sebelumnya](https://rayhandi-portofolio.vercel.app/), dengan komposisi dan gerak scroll dari redesign editorial.

- Navy #051221 dan #071a2e, permukaan #0b2339, gradasi laut #d4eeff ke #3b97df, satu warna pasir #e6d3b3 untuk cover DigiTask.
- Plus Jakarta Sans untuk struktur; Cormorant Garamond italic dengan gradasi laut untuk aksen personal.
- UMN Softskill sebagai featured project, diikuti HIMSI UMN dan DigiTask.
- Variasi tata letak: hero penuh dengan nama yang menimpa foto, featured project, dua project pendukung, profil, skill, kontak dengan kartu form.
- Responsive, fokus keyboard, skip link, menu mobile, filter dengan status aksesibel, reduced motion, reduced transparency.
- Informasi utama tetap terlihat jika JavaScript dimatikan.

## Motion

Tanpa library; semuanya di `style.css` dan fungsi `startMotion()` di `script.js`.

- **Ide utama, sans ke serif:** bagian `em` pada judul berubah dari Plus Jakarta Sans ke Cormorant italic mengikuti scroll, memerankan kalimat "Dibangun dengan logika. Dirancang dengan rasa." Judul skill melakukan hal yang sama saat di-hover.
- **Laut (berjalan terus selama hero terlihat):** konstelasi partikel yang tertarik ke kursor, cahaya yang mengitari bingkai foto, dan teks peran yang mengetik sendiri. Berhenti saat hero keluar layar atau tab disembunyikan.
- **Pembuka:** huruf nama naik satu per satu, foto terbuka dari bawah, stiker menempel terakhir. Tanpa preloader yang memblokir.
- **Scroll:** foto dan nama bergeser halus, tanda ✳ berputar, band disiplin hanya bergerak saat halaman di-scroll, kartu project bergeser berbeda kecepatan, section About dan Kontak melebar sampai penuh, kalimat About menyala kata demi kata, angka statistik menghitung naik, bar skill terisi, nama besar menutup halaman di footer.
- **Pointer dan aksi:** kartu project miring 3D dan isinya mengikuti pointer, sudut cover melengkung, cincin mengikuti kursor (kursor asli tetap ada), navbar kaca tanpa blur mengecil saat di-scroll dan kembali normal di paling atas, lensanya meluncur antar-section dan bisa ditahan lalu digeser (di layar lebih dari 900px): lensa membesar keluar dari kapsul, dan saat dilepas menuju item terdekat. Pembelokan cahaya asli hanya di browser Chromium; browser lain menampilkan lensa bening dengan tepi putih, garis tautan tergambar, panah bertukar, label form mengambang, filter memakai View Transitions.

Dengan `prefers-reduced-motion` atau tanpa JavaScript, semua konten tampil dalam kondisi akhir dan diam.

Cover project adalah komposisi tipografi dan logo asli, **bukan screenshot antarmuka**. Tidak ditambahkan screenshot, hasil project, atau testimoni fiktif. Angka 15+, 3+, 10+ dan persentase kemampuan dipertahankan dari portofolio awal; bukan hasil verifikasi independen.

## File yang dapat diedit

- `index.html`: teks, project, profil, tautan, dan kontak.
- `style.css`: warna, font, tata letak, dan responsive.
- `script.js`: navigasi mobile, filter, penyiapan draft email, dan motion.
- `fonts/`: font lokal beserta lisensi SIL Open Font License. File DM Sans tidak dipakai situs dan boleh dihapus.
- File gambar di root: foto serta logo asli.

Untuk menambahkan project, duplikasikan elemen `article.project-card`, sesuaikan `data-category`, konten, gambar, dan link. Perbarui juga jumlah awal serta angka pada tombol filter di HTML.

## Kontak: penting

Tombol **Buka aplikasi email** membuat URL `mailto:` dengan nama, email, dan pesan yang di-encode. Pengunjung tetap harus menekan Kirim di aplikasi email mereka. **Tidak ada backend atau pengiriman langsung dari website.** Jika aplikasi email default belum dikonfigurasi, gunakan alamat email yang ditampilkan. Pengujian hanya memeriksa pembentukan draft, tanpa mengirim email atau meluncurkan aplikasi email.

## Verifikasi

Dilakukan menggunakan Chrome headless melalui Playwright:

- Tampilan pada lebar 320, 390, 768, 1024, 1440, dan 1920 px.
- Tidak ditemukan horizontal overflow, gambar rusak, aset gagal dimuat, anchor internal hilang, atau JavaScript runtime error pada ukuran tersebut.
- Filter Semua/Web/Aplikasi, jumlah hasil, dan perpindahan layout saat satu project tersisa.
- Menu mobile dibuka lalu ditutup setelah memilih item.
- Lensa navbar dengan mouse dan sentuhan: tahan, geser, lepas, batal dengan Escape; klik biasa dan tombol Enter tetap berfungsi.
- Hover judul skill, pengisian bar skill, angka statistik, tombol ke atas, dan sinkronisasi sans-serif pada judul.
- Loop konstelasi berjalan di hero dan berhenti saat hero keluar layar.
- Tampilan tanpa JavaScript dan dengan reduced motion.
- Axe-core 4.10.3, rule tags WCAG 2 A/AA dan WCAG 2.1 AA: 0 pelanggaran otomatis pada 390 dan 1440 px dalam kondisi akhir, dengan 1 pemeriksaan yang memerlukan peninjauan manual per ukuran. Bukan sertifikasi aksesibilitas lengkap. Kata-kata kalimat About sengaja redup (kontras rendah) sebelum menyala karena scroll, dan axe menandainya jika dijalankan pada posisi itu.
- Screenshot desktop, tablet, dan mobile ditinjau visual. Foto bergerak dinilai dari frame statis, jadi kehalusan gerakan dan performa di perangkat nyata belum diuji.
- Validasi form kosong dan input hanya spasi; encoding nama serta pesan dengan karakter khusus. Pengujian hanya memeriksa pembentukan draft, tanpa mengirim email.
- Target URL eksternal dipertahankan dari sumber; ketersediaan layanan eksternal tidak diverifikasi.

## Audit visual

Audit akhir terhadap 10 pola desain generik: **0/10**. Tidak ada gradient tech menyeluruh, violet default, tiga feature tile seragam, accent rail, blur tanpa fungsi, statistik raksasa, icon topper berulang, center-stack menyeluruh, font default tanpa pertimbangan, atau surface yang salah. Monogram dan cover tipografi digunakan sebagai identitas, bukan UI produk fiktif.

Website belum di-deploy ke hosting. Unggah isi folder ini ke layanan static hosting bila ingin dipublikasikan; riwayat `.git` asli tidak disertakan.
