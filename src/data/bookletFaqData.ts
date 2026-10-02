// Database Tanya Jawab Resmi PT AETRA AIR TANGERANG
// Diambil secara otentik 100% dari Dokumen "Buku Panduan Pelanggan PT Aetra Air Tangerang" (11 Halaman)

export interface BookletFAQ {
  id: string;
  category: 
    | 'Sekilas Tentang Aetra' 
    | 'Tata Cara Berlangganan' 
    | 'Pipa Dinas vs Pipa Persil' 
    | 'Meter Air & Larangan' 
    | 'Standar Kualitas Air (Permenkes)' 
    | 'Tarif & Simulasi Tagihan' 
    | 'Pembayaran & Pemutusan';
  pageRef: number;
  question: string;
  shortAnswer: string;
  fullAnswer: string[];
  keyPoints: string[];
  tags: string[];
  officialQuote?: string;
}

export const BOOKLET_CATEGORIES = [
  'Semua',
  'Sekilas Tentang Aetra',
  'Tata Cara Berlangganan',
  'Pipa Dinas vs Pipa Persil',
  'Meter Air & Larangan',
  'Standar Kualitas Air (Permenkes)',
  'Tarif & Simulasi Tagihan',
  'Pembayaran & Pemutusan',
] as const;

export const BOOKLET_FAQ_DATABASE: BookletFAQ[] = [
  // ==================== HALAMAN 2: SEKILAS TENTANG AETRA ====================
  {
    id: 'faq-1',
    category: 'Sekilas Tentang Aetra',
    pageRef: 2,
    question: 'Apa itu PT Aetra Air Tangerang dan apa status proyek layanannya?',
    shortAnswer: 'PT Aetra Air Tangerang adalah perusahaan air minum swasta yang bermitra resmi dengan Pemerintah Kabupaten Tangerang dalam proyek Kerjasama Pemerintah Swasta (KPS).',
    fullAnswer: [
      'PT Aetra Air Tangerang adalah perusahaan air minum swasta yang bermitra dengan Pemerintah Kabupaten Tangerang dalam penyediaan dan pelayanan air minum di wilayah Kabupaten Tangerang.',
      'Proyek penyediaan dan pelayanan air minum ini merupakan proyek Kerjasama Pemerintah Swasta (KPS) resmi untuk meningkatkan akses air bersih dan sehat bagi masyarakat.',
    ],
    keyPoints: [
      'Mitra resmi Pemerintah Kabupaten Tangerang',
      'Skema Kerjasama Pemerintah Swasta (KPS)',
      'Komitmen meningkatkan kualitas hidup masyarakat melalui air bersih',
    ],
    tags: ['tentang aetra', 'kps', 'profil', 'pemkab', 'status kerjasama'],
    officialQuote: 'Kami adalah perusahaan air minum swasta yang bermitra dengan Pemerintah Kabupaten Tangerang dalam proyek Kerjasama Pemerintah Swasta (KPS).',
  },
  {
    id: 'faq-2',
    category: 'Sekilas Tentang Aetra',
    pageRef: 2,
    question: 'Apakah KPS Aetra Tangerang merupakan bentuk privatisasi air minum?',
    shortAnswer: 'Bukan privatisasi. Aetra tidak menguasai sumber daya air, dan seluruh aset akan diserahkan kembali kepada Pemkab Tangerang setelah masa konsesi berakhir.',
    fullAnswer: [
      'KPS yang dijalankan Aetra Tangerang bukanlah bentuk privatisasi pelayanan air minum.',
      'Aetra Tangerang tidak menguasai sumber daya yang ada, melainkan menyediakan layanan untuk mengolah sumber daya tersebut untuk kemudian disalurkan kembali kepada masyarakat yang membutuhkan.',
      'Seluruh asset yang dimiliki oleh Aetra Tangerang akan diserahkan kepada Pemerintah Kabupaten Tangerang setelah masa konsesi berakhir beserta segenap teknologi dan manajemen pelayanan.',
    ],
    keyPoints: [
      'Bukan privatisasi sumber daya air',
      'Aset & teknologi diserahkan utuh ke Pemkab Tangerang saat konsesi berakhir',
      'Fokus pada layanan pengolahan & distribusi air minum higienis',
    ],
    tags: ['privatisasi', 'konsesi', 'aset', 'sumber daya air', 'pemerintah daerah'],
    officialQuote: 'KPS yang dijalankan Aetra bukanlah bentuk privatisasi. Seluruh asset akan diserahkan kepada Pemerintah Kabupaten Tangerang setelah masa konsesi berakhir.',
  },

  // ==================== HALAMAN 3: TATA CARA BERLANGGANAN & FASILITAS ====================
  {
    id: 'faq-3',
    category: 'Tata Cara Berlangganan',
    pageRef: 3,
    question: 'Bagaimana 3 langkah mudah berlangganan air minum Aetra Tangerang?',
    shortAnswer: '1. Isi Formulir & Lengkapi Syarat (KTP, KK, PBB), 2. Survei Rumah oleh Petugas AAT (Tentukan Tarif), 3. Bayar Biaya Sambungan & Pemasangan Meter.',
    fullAnswer: [
      'Langkah 1 (Isi Formulir & Lengkapi Persyaratan): Mengisi formulir pendaftaran dan melampirkan fotocopy KTP, KK, PBB tahun terakhir atau dokumen pendukung.',
      'Langkah 2 (Survei): Petugas AAT akan melakukan survei ke rumah calon pelanggan untuk menentukan golongan tarif (R1-R4) dan memberikan tanda bukti telah disurvei.',
      'Langkah 3 (Bayar & Pasang): Petugas AAT akan melakukan pemasangan meter air setelah pelanggan membayar biaya sambungan baru melalui mitra resmi.',
    ],
    keyPoints: [
      'Langkah 1: Isi Formulir + KTP, KK, PBB',
      'Langkah 2: Survei Lapangan & Penetapan Golongan Tarif',
      'Langkah 3: Pembayaran Resmi & Pemasangan Meter Air',
    ],
    tags: ['cara berlangganan', 'pasang baru', 'sr', 'syarat', 'survei', 'tahapan'],
    officialQuote: '3 Langkah mudah berlangganan: 1. Isi Formulir & Lengkapi Persyaratan, 2. Survei, 3. Bayar & Pasang.',
  },
  {
    id: 'faq-4',
    category: 'Tata Cara Berlangganan',
    pageRef: 3,
    question: 'Apa saja fasilitas pelayanan pelanggan yang disediakan PT Aetra Air Tangerang?',
    shortAnswer: 'Contact Center 24 Jam (021-598 5474), Unit Reaksi Cepat 24 Jam, dan Layanan Pembayaran Multi-Kanal Resmi.',
    fullAnswer: [
      'Contact Center yang Siaga 24 Jam di (021) 598 5474 untuk penanganan informasi dan keluhan.',
      'Unit Reaksi Cepat untuk penanganan keluhan pelanggan serta pemeliharaan dan perbaikan pada jaringan pipa distribusi maupun sambungan pelanggan.',
      'Layanan pembayaran rekening air yang mudah melalui Kantor Pelayanan Pelanggan, ATM Bank BCA & Mandiri, Loket Kantor Pos, Alfamart, Indomaret, Internet/SMS/Mobile Banking.',
    ],
    keyPoints: [
      'Contact Center 24 Jam: 021 - 598 5474',
      'Unit Reaksi Cepat tanggap darurat kebocoran pipa',
      'Jaringan luas loket & gerai perbankan/retail pembayaran',
    ],
    tags: ['fasilitas', 'contact center', 'unit reaksi cepat', 'call center', 'layanan'],
  },

  // ==================== HALAMAN 4: KANTOR & BATAS PIPA ====================
  {
    id: 'faq-5',
    category: 'Pipa Dinas vs Pipa Persil',
    pageRef: 4,
    question: 'Di mana saja lokasi Kantor Pelayanan Pelanggan PT Aetra Air Tangerang?',
    shortAnswer: 'Kantor Pusat di Jl. Raya Curug No. 27 dan Kantor Pelayanan Pelanggan di Ruko Puri Jaya Sukamantri Pasar Kemis.',
    fullAnswer: [
      'Kantor Pusat: Jl. Raya Curug No. 27, Kadu Jaya, Curug, Kab. Tangerang 15810.',
      'Kantor Pelayanan Pelanggan Pasar Kemis: RUKO Perumahan PURI JAYA Blok AA No. 30, Sukamantri – Pasar Kemis, Kab. Tangerang 15560.',
    ],
    keyPoints: [
      'Kantor Pusat: Jl. Raya Curug No. 27, Curug',
      'Kantor Pelayanan Pasar Kemis: Puri Jaya Blok AA No. 30, Sukamantri',
    ],
    tags: ['alamat kantor', 'kantor pusat', 'kantor cabang', 'puri jaya', 'curug', 'pasar kemis'],
  },
  {
    id: 'faq-6',
    category: 'Pipa Dinas vs Pipa Persil',
    pageRef: 4,
    question: 'Bagaimana batas pembagian tanggung jawab pipa antara Aetra dan Pelanggan?',
    shortAnswer: 'Pipa dinas dari jaringan utama sampai kran/meter air adalah tanggung jawab Aetra; pipa instalasi setelah meter air ke dalam rumah adalah tanggung jawab Pelanggan.',
    fullAnswer: [
      'Tanggung Jawab Aetra Tangerang: Sambungan dari pipa utama distribusi, pipa dinas, kran meteran air, hingga penutup meteran.',
      'Tanggung Jawab Pelanggan: Sambungan pipa instalasi setelah meteran air yang mengalirkan air ke dalam persil/rumah pelanggan.',
      'Jika terjadi kerusakan/kebocoran pada pipa sebelum meter air, perbaikan dilakukan oleh Aetra. Jika kebocoran terjadi pada instalasi pipa rumah setelah meter air, perbaikan dan biaya pemakaian menjadi tanggung jawab pelanggan.',
    ],
    keyPoints: [
      'Pipa sebelum meteran = Tanggung Jawab Aetra Tangerang',
      'Pipa setelah meteran ke dalam rumah = Tanggung Jawab Pelanggan',
      'Meter air adalah titik batas resmi kepemilikan instalasi',
    ],
    tags: ['batas pipa', 'pipa dinas', 'pipa persil', 'tanggung jawab', 'kebocoran pipa'],
    officialQuote: 'Sambungan dari pipa Aetra Tangerang s/d Kran Meteran Air = Tanggung Jawab Aetra; Sambungan ke Pipa Pelanggan = Tanggung Jawab Pelanggan.',
  },

  // ==================== HALAMAN 5: METER AIR, LARANGAN & KEBOCORAN ====================
  {
    id: 'faq-7',
    category: 'Meter Air & Larangan',
    pageRef: 5,
    question: 'Apa saja 7 larangan bagi pelanggan terkait meter air dan instalasi pipa?',
    shortAnswer: 'Dilarang merusak segel, membalik/menimbun meter, mengubah ukuran/letak pipa, menyadap air, memakai pompa listrik menyedot dari meter, menjual air, dan memasukkan zat kimia.',
    fullAnswer: [
      'Pelanggan dilarang keras melakukan hal-hal berikut:',
      '1. Melepas, merusak dan menyebabkan hilangnya segel meter air.',
      '2. Membalik arah dan menimbun serta menyebabkan hilangnya meter air.',
      '3. Mengubah ukuran dan letak pipa air yang dipasang dan memindahkan meter air.',
      '4. Menyadap air langsung dari pipa air tanpa melalui meter air.',
      '5. Menggunakan pompa air listrik untuk menyedot air melalui meter air.',
      '6. Menjual air kepada pihak lain.',
      '7. Memasukkan zat apapun (ke dalam pipa sambungan) sebelum meter air yang dapat merusak kualitas air atau membuat air terkontaminasi.',
      'Sanksi atas pelanggaran di atas dapat berupa denda sesuai ketentuan yang berlaku dan/atau pemutusan sambungan air.',
    ],
    keyPoints: [
      'Dilarang merusak segel meter resmi',
      'Dilarang memasang pompa hisap langsung dari meteran',
      'Dilarang menyadap air atau menjual air ke pihak lain',
      'Sanksi: Denda denda administratif hingga pemutusan sambungan',
    ],
    tags: ['larangan', 'segel meter', 'pompa listrik', 'denda', 'sanksi', 'meter air'],
    officialQuote: 'Pelanggan dilarang merusak segel, membalik/menimbun meter, memindahkan meter, menyadap, dan menyedot air dengan pompa listrik.',
  },
  {
    id: 'faq-8',
    category: 'Meter Air & Larangan',
    pageRef: 5,
    question: 'Bagaimana 3 langkah cara melakukan pengecekan kebocoran pipa mandiri di rumah?',
    shortAnswer: '1. Tutup semua kran dalam rumah, 2. Buka kran pada meter air, 3. Tunggu 1 menit (jika angka meter bergerak, maka instalasi pipa rumah bocor).',
    fullAnswer: [
      'Langkah 1: Tutup semua kran air yang ada di dalam rumah Anda.',
      'Langkah 2: Buka semua kran pada meter air.',
      'Langkah 3: Lihat posisi angka di meter air, tunggu 1 menit. Jika angka pada meter air bergerak, maka dipastikan instalasi pipa di rumah Anda mengalami kebocoran.',
      'PERHATIAN: Jika terjadi kebocoran pada instalasi pipa di rumah Anda, dan telah tercatat pada meter air, menjadi tanggung jawab pelanggan dan harus dibayarkan sesuai tagihan air Anda.',
    ],
    keyPoints: [
      '1. Tutup seluruh kran air dalam rumah',
      '2. Buka kran pada meter air',
      '3. Pantau jarum meter air selama 1 menit',
      'Kebocoran setelah meteran air wajib dibayar sesuai angka meter',
    ],
    tags: ['cek kebocoran', 'kebocoran pipa', 'meter bergerak', 'tagihan bengkak'],
    officialQuote: 'Jika terjadi kebocoran pada instalasi pipa di rumah Anda dan telah tercatat pada meter air, menjadi tanggung jawab pelanggan.',
  },

  // ==================== HALAMAN 6: STANDAR KUALITAS AIR (PERMENKES) ====================
  {
    id: 'faq-9',
    category: 'Standar Kualitas Air (Permenkes)',
    pageRef: 6,
    question: 'Mengapa air Aetra berbau kaporit (Chlorine) dan bagaimana cara menghilangkannya?',
    shortAnswer: 'Bau kaporit berasal dari Chlorine untuk membunuh bakteri kuman penyakit sesuai Permenkes No. 492/2010. Sangat aman dan untuk menghilangkannya cukup diamkan di wadah terbuka selama 10–30 menit.',
    fullAnswer: [
      'Air yang terlihat jernih belum tentu sehat karena dapat mengandung bakteri berbahaya penyebab penyakit. Untuk membunuh bakteri dalam air, diperlukan Chlorine.',
      'PERMENKES No. 492/2010 mensyaratkan harus masih ada sisa gas Chlorine dalam air di sambungan pelanggan untuk memastikan air bebas kuman dan bakteri penyakit hingga ke kran Anda.',
      'Karena Chlorine dalam air Aetra berbentuk gas, untuk menghilangkan baunya cukup diamkan air terlebih dahulu di wadah terbuka selama ±10 menit hingga setengah jam sebelum digunakan, gas Chlorine tersebut akan menguap dengan sendirinya.',
    ],
    keyPoints: [
      'Chlorine efektif membunuh kuman & bakteri penyakit (E. Coli 0)',
      'Sesuai baku mutu PERMENKES No. 492/2010',
      'Cukup diamkan 10–30 menit di wadah terbuka agar baunya menguap',
    ],
    tags: ['kaporit', 'chlorine', 'bau kaporit', 'permenkes 492', 'kualitas air'],
    officialQuote: 'Untuk menghilangkan bau nya, maka cukup diamkan selama setengah jam di wadah terbuka, gas Chlorine tersebut akan menguap.',
  },
  {
    id: 'faq-10',
    category: 'Standar Kualitas Air (Permenkes)',
    pageRef: 6,
    question: 'Berapa standar mutu air minum Aetra berdasarkan PERMENKES No. 492/2010?',
    shortAnswer: 'Mikrobiologi (E. Coli 0, Koliform 0), Kimia (pH 6.5-8.5, Besi maks 0.3 mg/l, Sisa Chlorine 0.2-5 mg/l), Fisika (Tidak berasa, Warna <15 TCU, Kekeruhan <5 NTU).',
    fullAnswer: [
      'Parameter Mikrobiologi: E. Coli = 0 / 100ml, Total Koliform = 0 / 100ml.',
      'Parameter Kimia: Arsen maks 0.01 mg/l, Sianida maks 0.07 mg/l, Aluminium maks 0.2 mg/l, Besi maks 0.3 mg/l, Mangan maks 0.4 mg/l, Sulfat maks 250 mg/l, Kesadahan maks 500 mg/l, Khlorida maks 5 mg/l, Amonia maks 1.5 mg/l, Sisa Chlorine 0.2* - 5.0 mg/l (*pelanggan terjauh), pH 6.5 - 8.5.',
      'Parameter Fisika: Rasa Tidak berasa, Warna maks 15 TCU, Kekeruhan maks 5 NTU, TDS maks 500 mg/l.',
    ],
    keyPoints: [
      '100% Bebas Bakteri E. Coli & Koliform',
      'Tingkat kekeruhan jernih di bawah 5 NTU',
      'Derajat keasaman ideal pH 6.5 - 8.5',
    ],
    tags: ['parameter mutu', 'permenkes 492', 'e coli', 'ph air', 'laboratorium air'],
  },

  // ==================== HALAMAN 7: HARGA & SIMULASI TAGIHAN ====================
  {
    id: 'faq-11',
    category: 'Tarif & Simulasi Tagihan',
    pageRef: 7,
    question: 'Berapa tarif pemakaian air minum per m³ berdasarkan kelompok pelanggan (R1 - R4)?',
    shortAnswer: 'R1: Rp 2.170/m³ (semua blok), R2: Rp 4.840 s/d Rp 6.881/m³, R3: Rp 7.928 s/d Rp 11.128/m³, R4: Rp 11.112 s/d Rp 14.371/m³ + Abonemen.',
    fullAnswer: [
      'Struktur Tarif Air Minum Berdasarkan Blok Konsumsi (Rupiah):',
      '• Golongan R1: Blok 0-10 m³ (Rp 2.170), Blok 11-20 m³ (Rp 2.170), Blok >20 m³ (Rp 2.170), Abonemen Rp 9.466.',
      '• Golongan R2: Blok 0-10 m³ (Rp 4.840), Blok 11-20 m³ (Rp 5.716), Blok >20 m³ (Rp 6.881), Abonemen Rp 9.466.',
      '• Golongan R3: Blok 0-10 m³ (Rp 7.928), Blok 11-20 m³ (Rp 9.515), Blok >20 m³ (Rp 11.128), Abonemen Rp 9.466.',
      '• Golongan R4: Blok 0-10 m³ (Rp 11.112), Blok 11-20 m³ (Rp 12.833), Blok >20 m³ (Rp 14.371), Abonemen Rp 16.904.',
      'Kriteria Golongan:',
      '• R1: Luas bangunan < 28,8 m² rumah tinggal tanpa usaha komersil.',
      '• R2: Luas bangunan > 28,9 m² dan < 70 m² di area non real estate, rumah tinggal tanpa usaha komersil.',
      '• R3: Luas bangunan > 70 m² dan < 120 m² pemukiman umum; ATAU < 70 m² real estate tanpa usaha; ATAU 28,9-70 m² non real estate dengan usaha.',
      '• R4: Luas bangunan > 120 m² pemukiman umum ATAU > 70 m² real estate; ATAU 70-120 m² pemukiman umum dengan usaha.',
      '• Definisi Real Estate: perumahan yang dilengkapi fasilitas sport center, kolam renang serta shopping center.',
    ],
    keyPoints: [
      'Tarif bertingkat per blok konsumsi (0-10 m³, 11-20 m³, >20 m³)',
      'Biaya abonemen tetap: Rp 9.466 (R1-R3) & Rp 16.904 (R4)',
      'Golongan ditentukan dari luas bangunan & ada tidaknya usaha',
    ],
    tags: ['tarif air', 'harga per meter kubik', 'r1', 'r2', 'r3', 'r4', 'abonemen', 'blok konsumsi'],
  },
  {
    id: 'faq-12',
    category: 'Tarif & Simulasi Tagihan',
    pageRef: 7,
    question: 'Bagaimana simulasi perhitungan tagihan air R2 dan R3 untuk pemakaian 15.000 liter (15 m³)?',
    shortAnswer: 'Golongan R2: Total Rp 86.446,- (cuma Rp 5,8 per liter); Golongan R3: Total Rp 136.321,- (cuma Rp 9,0 per liter).',
    fullAnswer: [
      'Untuk Golongan Pelanggan R2 (Meter air 0,50 inci & pemakaian 15 m³ / 15.000 liter):',
      '• 0 - 10 m³ = 10 m³ x Rp 4.840 = Rp 48.400',
      '• 11 - 15 m³ = 5 m³ x Rp 5.716 = Rp 28.580',
      '• Biaya Abonemen = Rp 9.466',
      '• TOTAL TAGIHAN R2 = Rp 86.446,- untuk 15.000 liter (Cuma Rp 5,8 per liter!)',
      '',
      'Untuk Golongan Pelanggan R3 (Meter air 0,50 inci & pemakaian 15 m³ / 15.000 liter):',
      '• 0 - 10 m³ = 10 m³ x Rp 7.928 = Rp 79.280',
      '• 11 - 15 m³ = 5 m³ x Rp 9.515 = Rp 47.575',
      '• Biaya Abonemen = Rp 9.466',
      '• TOTAL TAGIHAN R3 = Rp 136.321,- untuk 15.000 liter (Cuma Rp 9,0 per liter!)',
    ],
    keyPoints: [
      'R2 (15 m³) = Rp 86.446 (Rp 5,8 per liter)',
      'R3 (15 m³) = Rp 136.321 (Rp 9,0 per liter)',
      'Jauh lebih hemat dan higienis dibanding membeli air isi ulang/jerigen',
    ],
    tags: ['simulasi tagihan', 'hitung tagihan air', '15 m3', '15000 liter', 'r2', 'r3', 'hemat'],
    officialQuote: 'Rp 86.446 untuk 15.000 liter atau cuma Rp 5,8 per liter (Golongan R2).',
  },

  // ==================== HALAMAN 8: LOKASI & TATA CARA PEMBAYARAN ====================
  {
    id: 'faq-13',
    category: 'Pembayaran & Pemutusan',
    pageRef: 8,
    question: 'Di mana saja kanal pembayaran resmi tagihan Aetra dan apa saja ketentuannya?',
    shortAnswer: 'Bank Mandiri, Bank BCA, PT Pos Indonesia, Indomaret, Alfamart, OttoCash, OttoPay. Bayar sebelum jatuh tempo dan simpan resi bukti pembayaran.',
    fullAnswer: [
      'Lokasi dan Cara Pembayaran Resmi:',
      '• Bank Mandiri: ATM, Internet Banking, SMS Banking, Mobile Banking',
      '• Bank BCA: ATM, Internet Banking, Mobile Banking',
      '• PT Pos Indonesia: Loket Kantor Pos (Tunai)',
      '• Indomaret & Alfamart: Kasir Gerai (Tunai)',
      '• OttoCash (Mobile Apps) & OttoPay (Tunai)',
      'Ketentuan Tagihan & Pembayaran:',
      '1. Pembayaran tagihan harus dilakukan sebelum tanggal JATUH TEMPO untuk menghindari denda dan pemutusan.',
      '2. Apabila tanggal JATUH TEMPO jatuh pada hari raya/hari libur, maka pembayaran harus dilakukan paling lambat 1 (satu) hari kerja sebelumnya.',
      '3. Pembayaran melalui transfer harap mencantumkan Nomor Pelanggan dan/atau Nama Pelanggan.',
      '4. Apabila tagihan belum diterima sampai akhir bulan, pelanggan dapat mengecek jumlah tagihan via website www.aetratangerang.co.id atau Contact Center 24 Jam.',
      '5. Tidak diterimanya tagihan tidak menghapus kewajiban Pelanggan untuk membayar tagihan tepat waktu.',
      '6. Resi Pembayaran harap disimpan sebagai tanda bukti sah.',
    ],
    keyPoints: [
      'Banyak pilihan: BCA, Mandiri, Kantor Pos, Alfamart, Indomaret, OttoPay',
      'Wajib bayar sebelum tanggal jatuh tempo',
      'Simpan bukti transaksi / resi pembayaran',
    ],
    tags: ['kanal bayar', 'tempat bayar', 'bca', 'mandiri', 'kantor pos', 'alfamart', 'indomaret', 'jatuh tempo'],
  },

  // ==================== HALAMAN 9: PEMUTUSAN & ANTI PUNGLI ====================
  {
    id: 'faq-14',
    category: 'Pembayaran & Pemutusan',
    pageRef: 9,
    question: 'Apa sanksi keterlambatan pembayaran dan bagaimana ketentuan pemutusan sementara / permanen?',
    shortAnswer: 'Terlambat bayar kena denda & pemutusan sementara. Jika menunggak 60 hari kerja, sambungan diputus permanen (syarat pasang baru untuk menyambung kembali).',
    fullAnswer: [
      '1. Pembayaran tagihan sesudah tanggal jatuh tempo akan dikenakan denda per bulan keterlambatan, yang besarnya sesuai dengan kelompok Pelanggan.',
      '2. Apabila tagihan tidak dibayarkan sampai tanggal jatuh tempo, maka PT Aetra Air Tangerang dapat memutus aliran air sementara.',
      '3. Penyambungan kembali aliran air yang diputus sementara dilakukan setelah Pelanggan melunasi seluruh tunggakan, denda keterlambatan, biaya ganti segel dan tagihan berjalan.',
      '4. Apabila tagihan tidak dibayar dalam jangka waktu 60 (enam puluh) hari kerja setelah tanggal terbit tagihan, maka PT Aetra Air Tangerang dapat memutus sambungan air secara permanen.',
      '5. Penyambungan kembali aliran air yang diputus permanen dilakukan setelah Pelanggan melunasi seluruh tunggakan, denda keterlambatan dan biaya sambungan baru.',
      '6. Ketentuan pemutusan dan penyambungan dilakukan berdasarkan pada properti tempat sambungan air berada tanpa memperhatikan penagihan kepemilikan/penguasaan.',
      '7. Apabila membeli/menyewa properti, pastikan properti tersebut sudah terbebas dari tunggakan atau denda dengan PT Aetra Air Tangerang.',
    ],
    keyPoints: [
      'Denda berlaku per bulan keterlambatan',
      'Pemutusan sementara jika menunggak melewati jatuh tempo',
      'Pemutusan permanen setelah 60 hari kerja belum bayar',
      'Syarat buka kembali: lunasi tunggakan, denda, ganti segel / biaya sambungan baru',
    ],
    tags: ['pemutusan', 'denda keterlambatan', 'segel', 'permanen', 'sambung kembali', 'tunggakan'],
    officialQuote: 'Pemutusan permanen dilakukan jika tagihan tidak dibayar dalam jangka waktu 60 hari kerja setelah tanggal terbit tagihan.',
  },
  {
    id: 'faq-15',
    category: 'Pembayaran & Pemutusan',
    pageRef: 9,
    question: 'Bolehkah pelanggan menitipkan uang pembayaran tagihan air kepada petugas Aetra yang datang ke rumah?',
    shortAnswer: 'DILARANG KERAS. Seluruh petugas Aetra dilarang menerima uang tunai di rumah/properti pelanggan. Segera laporkan oknum ke Contact Center 24 Jam (021) 598 5474.',
    fullAnswer: [
      'PERINGATAN RESMI PT AETRA AIR TANGERANG:',
      'Seluruh petugas Aetra Tangerang TIDAK DIPERBOLEHKAN MENERIMA PEMBAYARAN SECARA LANGSUNG DI RUMAH / PROPERTI PELANGGAN.',
      'Hanya lakukan pembayaran di loket resmi Aetra Tangerang atau di kanal pembayaran resmi lainnya yang ditunjuk (Bank, Kantor Pos, Alfamart, Indomaret, OttoPay).',
      'Jika menemui petugas yang meminta pembayaran di tempat, segera laporkan melalui Kanal Informasi Pelanggan: Contact Center 24 Jam (021) 598 5474 atau WhatsApp 0877 8822 4645.',
    ],
    keyPoints: [
      'Petugas lapangan dilarang keras menerima uang tunai di rumah',
      'Pembayaran hanya sah melalui kanal mitra resmi',
      'Laporkan oknum pungli ke Contact Center 24 Jam: 021 - 598 5474',
    ],
    tags: ['anti pungli', 'larangan bayar petugas', 'bebas pungli', 'keamanan transaksi'],
    officialQuote: 'Seluruh petugas Aetra Tangerang TIDAK DIPERBOLEHKAN MENERIMA PEMBAYARAN SECARA LANGSUNG DI RUMAH / PROPERTI PELANGGAN.',
  },
];
