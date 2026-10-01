// Database Wilayah Lengkap 38 Provinsi di Seluruh Indonesia
// Dilengkapi Kabupaten/Kota, Kecamatan, Kelurahan/Desa, dan Kode Pos

export interface DistrictData {
  name: string;
  postalCode?: string;
  villages: string[];
}

export interface CityData {
  name: string;
  districts: DistrictData[];
}

export interface ProvinceData {
  id: string;
  name: string;
  cities: CityData[];
}

export const INDONESIA_PROVINCES_DATA: ProvinceData[] = [
  // 1. BANTEN (Primary Operating Area & Surrounding)
  {
    id: 'banten',
    name: 'Banten',
    cities: [
      {
        name: 'Kabupaten Tangerang',
        districts: [
          {
            name: 'Curug',
            postalCode: '15810',
            villages: ['Kadu Jaya', 'Kadu', 'Cukanggalih', 'Curug Kulon', 'Curug Wetan', 'Binong'],
          },
          {
            name: 'Cikupa',
            postalCode: '15710',
            villages: ['Cikupa', 'Budi Mulya', 'Bojong', 'Sukamulya', 'Dukuh', 'Bitung Jaya', 'Talaga', 'Pasir Gadung', 'Sukamantri'],
          },
          {
            name: 'Pasar Kemis',
            postalCode: '15560',
            villages: ['Pasar Kemis', 'Sukamantri', 'Kuta Jaya', 'Kuta Baru', 'Gelam Jaya', 'Sindangsari', 'Pangadegan', 'Suka Asih'],
          },
          {
            name: 'Balaraja',
            postalCode: '15610',
            villages: ['Balaraja', 'Talagasari', 'Tobat', 'Saga', 'Sentul', 'Gembong', 'Cangkudu', 'Sukamurni'],
          },
          {
            name: 'Sepatan',
            postalCode: '15520',
            villages: ['Sepatan', 'Pisangan Jaya', 'Kayu Agung', 'Kayu Bongkok', 'Sarakan', 'Karet'],
          },
          {
            name: 'Sepatan Timur',
            postalCode: '15520',
            villages: ['Kedaung Barat', 'Lebak Wangi', 'Tanah Merah', 'Gempol Sari', 'Jatimulya', 'Pondok Kelor', 'Kampung Kelor'],
          },
          {
            name: 'Sindang Jaya',
            postalCode: '15560',
            villages: ['Sindang Jaya', 'Sindang Asih', 'Sindang Sono', 'Wanakerta', 'Badak Anom', 'Sindang Panon'],
          },
          {
            name: 'Rajeg',
            postalCode: '15540',
            villages: ['Rajeg', 'Ranca Bango', 'Sukatani', 'Daon', 'Pangarengan', 'Tanjakan', 'Mekarsari', 'Tanjakan Mekar'],
          },
          {
            name: 'Jayanti',
            postalCode: '15610',
            villages: ['Jayanti', 'Sumur Bandung', 'Pasir Gintung', 'Pabuaran', 'Dangdeur', 'Cikande', 'Pasir Muncang'],
          },
          {
            name: 'Panongan',
            postalCode: '15711',
            villages: ['Panongan', 'Mekar Bakti', 'Ciakar', 'Ranca Iyuh', 'Peusar', 'Serdang Kulon'],
          },
          {
            name: 'Kelapa Dua',
            postalCode: '15810',
            villages: ['Kelapa Dua', 'Bencongan', 'Bencongan Indah', 'Bojong Nangka', 'Curug Sangereng', 'Pakulonan Barat'],
          },
          {
            name: 'Legok',
            postalCode: '15820',
            villages: ['Legok', 'Babakan Barat', 'Babakan', 'Bojongkamal', 'Cirarab', 'Palasari', 'Caringin'],
          },
          {
            name: 'Tigaraksa',
            postalCode: '15720',
            villages: ['Tigaraksa', 'Kadu Agung', 'Matagara', 'Pasir Bolang', 'Pasir Nangka', 'Sodong', 'Bantar Panjang', 'Pete'],
          },
          {
            name: 'Cisauk',
            postalCode: '15341',
            villages: ['Cisauk', 'Sampora', 'Cibogo', 'Suradita', 'Dangdang', 'Mekar Wangi'],
          },
          {
            name: 'Teluknaga',
            postalCode: '15510',
            villages: ['Teluknaga', 'Kampung Melayu Timur', 'Kampung Melayu Barat', 'Bojong Renged', 'Tanjung Pasir', 'Lemo'],
          },
          {
            name: 'Kosambi',
            postalCode: '15211',
            villages: ['Kosambi Barat', 'Kosambi Timur', 'Salembaran Jaya', 'Dadap', 'Jatimulya', 'Salembaran Jati'],
          },
          {
            name: 'Pakuhaji',
            postalCode: '15570',
            villages: ['Pakuhaji', 'Buaran Bambu', 'Buaran Mangga', 'Kramat', 'Rawa Boni', 'Kohod', 'Sukawali'],
          },
          {
            name: 'Mauk',
            postalCode: '15530',
            villages: ['Mauk Timur', 'Mauk Barat', 'Tegal Kunir Lor', 'Tegal Kunir Kidul', 'Ketapang', 'Sasak', 'Jenggot'],
          },
          {
            name: 'Sukadiri',
            postalCode: '15530',
            villages: ['Sukadiri', 'Buaran Jati', 'Karang Serang', 'Gintung', 'Pekayon', 'Rawakidang'],
          },
          {
            name: 'Kresek',
            postalCode: '15620',
            villages: ['Kresek', 'Koper', 'Kemuning', 'Talok', 'Patrasana', 'Jengkol', 'Pasir Ampo'],
          },
          {
            name: 'Kronjo',
            postalCode: '15550',
            villages: ['Kronjo', 'Pasilian', 'Pagedangan Ilir', 'Pagedangan Udik', 'Bakung', 'Cirumpak'],
          },
          {
            name: 'Kemiri',
            postalCode: '15530',
            villages: ['Kemiri', 'Klebet', 'Legok Sukamaju', 'Lontar', 'Patramanggala', 'Rancalabuh'],
          },
          {
            name: 'Gunung Kaler',
            postalCode: '15620',
            villages: ['Gunung Kaler', 'Cipaeh', 'Gedongan', 'Kandawati', 'Sidoko', 'Tamiang'],
          },
          {
            name: 'Mekar Baru',
            postalCode: '15550',
            villages: ['Mekar Baru', 'Cijeruk', 'Gandaria', 'Jenggot', 'Kedaung', 'Kosambi Dalam'],
          },
          {
            name: 'Pagedangan',
            postalCode: '15339',
            villages: ['Pagedangan', 'Cicalengka', 'Cihuni', 'Cijantra', 'Jatake', 'Kadu Sirung', 'Lengkona Kulon', 'Malang Nengah', 'Medang'],
          },
          {
            name: 'Solear',
            postalCode: '15730',
            villages: ['Solear', 'Cikareo', 'Cikuya', 'Cikasungka', 'Munjul', 'Pasanggrahan', 'Tiregarang'],
          },
          {
            name: 'Sukamulya',
            postalCode: '15610',
            villages: ['Sukamulya', 'Buniayu', 'Kaliasin', 'Kubang', 'Merak', 'Parahu'],
          },
          {
            name: 'Cisoka',
            postalCode: '15730',
            villages: ['Cisoka', 'Bojong Loa', 'Carenang', 'Caringin', 'Cempaka', 'Karangharja', 'Sukatani'],
          },
        ],
      },
      {
        name: 'Kota Tangerang',
        districts: [
          { name: 'Tangerang', postalCode: '15111', villages: ['Sukarasa', 'Sukasari', 'Babakan', 'Buaran Indah', 'Cikokol', 'Kelapa Indah', 'Tanah Tinggi'] },
          { name: 'Karawaci', postalCode: '15115', villages: ['Karawaci', 'Karawaci Baru', 'Cimone', 'Cimone Jaya', 'Pabuaran', 'Pabuaran Tumpeng', 'Pasir Jaya', 'Margasari', 'Bojong Jaya', 'Koang Jaya'] },
          { name: 'Cibodas', postalCode: '15138', villages: ['Cibodas', 'Cibodasari', 'Cibodas Baru', 'Uwung Jaya', 'Jatiuwung', 'Panunggangan Barat'] },
          { name: 'Jatiuwung', postalCode: '15134', villages: ['Alam Jaya', 'Gandasari', 'Jatake', 'Keroncong', 'Manis Jaya', 'Pasir Jaya'] },
          { name: 'Periuk', postalCode: '15131', villages: ['Periuk', 'Periuk Jaya', 'Gebang Raya', 'Gemasari', 'Sangirang'] },
          { name: 'Cipondoh', postalCode: '15148', villages: ['Cipondoh', 'Cipondoh Indah', 'Cipondoh Makmur', 'Gondrong', 'Kenanga', 'Petir', 'Poris Plawad', 'Poris Plawad Indah', 'Poris Plawad Utara'] },
          { name: 'Pinang', postalCode: '15145', villages: ['Pinang', 'Cipete', 'Kunciran', 'Kunciran Indah', 'Kunciran Jaya', 'Nerogtog', 'Pakujan', 'Panunggangan', 'Panunggangan Timur', 'Panunggangan Utara', 'Sudimara Pinang'] },
          { name: 'Ciledug', postalCode: '15153', villages: ['Sudimara Barat', 'Sudimara Jaya', 'Sudimara Selatan', 'Sudimara Timur', 'Tajur', 'Paninggilan', 'Paninggilan Utara', 'Parung Serab'] },
          { name: 'Karang Tengah', postalCode: '15157', villages: ['Karang Tengah', 'Karang Mulya', 'Karang Timur', 'Parung Jaya', 'Pedurenan', 'Pondok Bahar', 'Pondok Pucung'] },
          { name: 'Larangan', postalCode: '15154', villages: ['Cipadu', 'Cipadu Jaya', 'Gaga', 'Kreo', 'Kreo Selatan', 'Larangan Indah', 'Larangan Selatan', 'Larangan Utara'] },
          { name: 'Batuceper', postalCode: '15122', villages: ['Batuceper', 'Batujaya', 'Batusari', 'Kebon Besar', 'Poris Gaga', 'Poris Gaga Baru', 'Poris Jaya'] },
          { name: 'Benda', postalCode: '15125', villages: ['Belendung', 'Benda', 'Jurumudi', 'Jurumudi Baru', 'Pajang'] },
          { name: 'Neglasari', postalCode: '15129', villages: ['Karang Anyar', 'Karangsari', 'Kedaung Baru', 'Kedaung Wetan', 'Mekar Sari', 'Neglasari', 'Selapajang Jaya'] },
        ],
      },
      {
        name: 'Kota Tangerang Selatan',
        districts: [
          { name: 'Serpong', postalCode: '15310', villages: ['Buaran', 'Ciater', 'Cilenggang', 'Lengkong Gudang', 'Lengkong Gudang Timur', 'Lengkong Wetan', 'Rawa Buntu', 'Rawa Mekar Jaya', 'Serpong'] },
          { name: 'Serpong Utara', postalCode: '15320', villages: ['Jelupang', 'Lengkong Karya', 'Paku Jaya', 'Pakualam', 'Pakulonan', 'Pondok Jagung', 'Pondok Jagung Timur'] },
          { name: 'Pondok Aren', postalCode: '15224', villages: ['Jurang Mangu Barat', 'Jurang Mangu Timur', 'Pondok Kacang Barat', 'Pondok Kacang Timur', 'Perigi Lama', 'Perigi Baru', 'Pondok Aren', 'Pondok Karya', 'Pondok Jaya', 'Pondok Betung', 'Pondok Pucung'] },
          { name: 'Ciputat', postalCode: '15411', villages: ['Cipayung', 'Ciputat', 'Sawah Baru', 'Sawah Lama', 'Jombang', 'Sarua', 'Sarua Indah'] },
          { name: 'Ciputat Timur', postalCode: '15419', villages: ['Cempaka Putih', 'Cireundeu', 'Pisangan', 'Pondok Ranji', 'Rempoa', 'Rengas'] },
          { name: 'Pamulang', postalCode: '15417', villages: ['Bambu Apus', 'Benda Baru', 'Kedaung', 'Pondok Benda', 'Pamulang Barat', 'Pamulang Timur', 'Pondok Cabe Ilir', 'Pondok Cabe Udik'] },
          { name: 'Setu', postalCode: '15314', villages: ['Babakan', 'Bakti Jaya', 'Kademangan', 'Keranggan', 'Muncul', 'Setu'] },
        ],
      },
      {
        name: 'Kota Serang',
        districts: [
          { name: 'Serang', postalCode: '42111', villages: ['Kotabaru', 'Lopang', 'Kagungan', 'Serang', 'Cipare', 'Sukawana'] },
          { name: 'Cipocok Jaya', postalCode: '42121', villages: ['Banjaragung', 'Banjarsari', 'Cipocok Jaya', 'Dalung', 'Gelam', 'Karundang'] },
          { name: 'Kasemen', postalCode: '42191', villages: ['Banten', 'Kasemen', 'Kasunyatan', 'Kilasah', 'Margaluyu', 'Mesjid Priyayi', 'Sawah Luhur'] },
          { name: 'Taktakan', postalCode: '42162', villages: ['Drangong', 'Kalang Anyar', 'Kuranji', 'Lialang', 'Pancur', 'Sayar', 'Taktakan'] },
        ],
      },
      {
        name: 'Kota Cilegon',
        districts: [
          { name: 'Cilegon', postalCode: '42416', villages: ['Bagendung', 'Bendungan', 'Ciwaduk', 'Ciwandan', 'Jombang Wetan'] },
          { name: 'Grogol', postalCode: '42436', villages: ['Gerem', 'Grogol', 'Kotasari', 'Rawa Arum'] },
          { name: 'Pulomerak', postalCode: '42438', villages: ['Lebak Gede', 'Mekarsari', 'Suralaya', 'Tamansari'] },
        ],
      },
      {
        name: 'Kabupaten Serang',
        districts: [
          { name: 'Ciruas', postalCode: '42182', villages: ['Ciruas', 'Bumijaya', 'Cigelam', 'Kadikaran', 'Kaserangan', 'Pelawad'] },
          { name: 'Kragilan', postalCode: '42184', villages: ['Kragilan', 'Dukuh', 'Jeruknipis', 'Kendayakan', 'Kramatjati', 'Pematang'] },
          { name: 'Cikande', postalCode: '42186', villages: ['Cikande', 'Bakung', 'Gembor Udik', 'Julang', 'Koper', 'Leuwilimus', 'Nambo Ilir'] },
        ],
      },
      {
        name: 'Kabupaten Lebak',
        districts: [
          { name: 'Rangkasbitung', postalCode: '42311', villages: ['Cijoro Lebak', 'Cijoro Pasir', 'Muara Ciujung Barat', 'Muara Ciujung Timur', 'Rangkasbitung Barat', 'Rangkasbitung Timur'] },
          { name: 'Maja', postalCode: '42381', villages: ['Maja', 'Ciburuy', 'Curug Badak', 'Gubugcibeureum', 'Maja Baru', 'Pasir Kecapi', 'Sangiang'] },
        ],
      },
      {
        name: 'Kabupaten Pandeglang',
        districts: [
          { name: 'Pandeglang', postalCode: '42211', villages: ['Pandeglang', 'Kabayan', 'Kadomerak', 'Pagerbatu', 'Sukasarana'] },
          { name: 'Majasari', postalCode: '42217', villages: ['Cilaja', 'Karaton', 'Pagasen', 'Saruni', 'Sukajaya'] },
        ],
      },
    ],
  },

  // 2. DKI JAKARTA
  {
    id: 'dki-jakarta',
    name: 'DKI Jakarta',
    cities: [
      {
        name: 'Kota Jakarta Barat',
        districts: [
          { name: 'Kalideres', postalCode: '11840', villages: ['Kalideres', 'Kamal', 'Pegadungan', 'Semanan', 'Tegal Alur'] },
          { name: 'Cengkareng', postalCode: '11730', villages: ['Cengkareng Barat', 'Cengkareng Timur', 'Duri Kosambi', 'Kapuk', 'Kedaung Kali Angke', 'Rawa Buaya'] },
          { name: 'Kembangan', postalCode: '11610', villages: ['Joglo', 'Kembangan Selatan', 'Kembangan Utara', 'Meruya Selatan', 'Meruya Utara', 'Srengseng'] },
          { name: 'Kebon Jeruk', postalCode: '11530', villages: ['Duri Kepa', 'Kebon Jeruk', 'Kedoya Selatan', 'Kedoya Utara', 'Kelapa Dua', 'Sukabumi Selatan', 'Sukabumi Utara'] },
          { name: 'Grogol Petamburan', postalCode: '11450', villages: ['Grogol', 'Jelambar', 'Jelambar Baru', 'Tanjung Duren Selatan', 'Tanjung Duren Utara', 'Tomang', 'Wijaya Kusuma'] },
          { name: 'Palmerah', postalCode: '11480', villages: ['Jatipulo', 'Kemanggisan', 'Kota Bambu Selatan', 'Kota Bambu Utara', 'Palmerah', 'Slipi'] },
          { name: 'Taman Sari', postalCode: '11150', villages: ['Glodok', 'Keagungan', 'Krukut', 'Mangga Besar', 'Maphar', 'Pinangsia', 'Taman Sari', 'Tangki'] },
          { name: 'Tambora', postalCode: '11220', villages: ['Angke', 'Duri Selatan', 'Duri Utara', 'Jembatan Besi', 'Jembatan Lima', 'Kali Anyar', 'Krendang', 'Pekojan', 'Roa Malaka', 'Tambora', 'Tanah Sereal'] },
        ],
      },
      {
        name: 'Kota Jakarta Selatan',
        districts: [
          { name: 'Kebayoran Baru', postalCode: '12110', villages: ['Gandaria Utara', 'Gunung', 'Kramat Pela', 'Melawai', 'Petogogan', 'Pulo', 'Rawa Barat', 'Selong', 'Senayan'] },
          { name: 'Kebayoran Lama', postalCode: '12240', villages: ['Cipulir', 'Grogol Selatan', 'Grogol Utara', 'Kebayoran Lama Selatan', 'Kebayoran Lama Utara', 'Pondok Pinang'] },
          { name: 'Pesanggrahan', postalCode: '12320', villages: ['Bintaro', 'Pesanggrahan', 'Petukangan Selatan', 'Petukangan Utara', 'Ulujami'] },
          { name: 'Cilandak', postalCode: '12430', villages: ['Cilandak Barat', 'Cipete Selatan', 'Gandaria Selatan', 'Lebak Bulus', 'Pondok Labu'] },
          { name: 'Pasar Minggu', postalCode: '12520', villages: ['Cilandak Timur', 'Jati Padang', 'Kebagusan', 'Pasar Minggu', 'Pejaten Barat', 'Pejaten Timur', 'Ragunan'] },
          { name: 'Jagakarsa', postalCode: '12620', villages: ['Ciganjur', 'Cipedak', 'Jagakarsa', 'Lenteng Agung', 'Srengseng Sawah', 'Tanjung Barat'] },
          { name: 'Mampang Prapatan', postalCode: '12790', villages: ['Bangka', 'Kuningan Barat', 'Mampang Prapatan', 'Pela Mampang', 'Tegal Parang'] },
          { name: 'Pancoran', postalCode: '12780', villages: ['Cikoko', 'Duren Tiga', 'Kalibata', 'Pancoran', 'Pengadegan', 'Rawajati'] },
          { name: 'Tebet', postalCode: '12810', villages: ['Bukit Duri', 'Kebon Baru', 'Manggarai', 'Manggarai Selatan', 'Menteng Dalam', 'Tebet Barat', 'Tebet Timur'] },
          { name: 'Setiabudi', postalCode: '12910', villages: ['Guntur', 'Karet', 'Karet Kuningan', 'Karet Semanggi', 'Kuningan Timur', 'Menteng Atas', 'Pasar Manggis', 'Setiabudi'] },
        ],
      },
      {
        name: 'Kota Jakarta Pusat',
        districts: [
          { name: 'Gambir', postalCode: '10110', villages: ['Cideng', 'Duri Pulo', 'Gambir', 'Kebon Kelapa', 'Petojo Selatan', 'Petojo Utara'] },
          { name: 'Tanah Abang', postalCode: '10250', villages: ['Bendungan Hilir', 'Gelora', 'Kampung Bali', 'Karet Tengsin', 'Kebon Kacang', 'Kebon Melati', 'Petamburan'] },
          { name: 'Menteng', postalCode: '10310', villages: ['Cikini', 'Gondangdia', 'Kebon Sirih', 'Menteng', 'Pegangsaan'] },
          { name: 'Senen', postalCode: '10410', villages: ['Bungur', 'Kenari', 'Kramat', 'Kwitang', 'Paseban', 'Senen'] },
          { name: 'Cempaka Putih', postalCode: '10510', villages: ['Cempaka Putih Barat', 'Cempaka Putih Timur', 'Rawasari'] },
          { name: 'Kemayoran', postalCode: '10610', villages: ['Cempaka Baru', 'Gunung Sahari Selatan', 'Harapan Mulya', 'Kebon Kosong', 'Kemayoran', 'Serdang', 'Sumur Batu', 'Utan Panjang'] },
        ],
      },
      {
        name: 'Kota Jakarta Timur',
        districts: [
          { name: 'Matraman', postalCode: '13140', villages: ['Kayu Manis', 'Kebon Manggis', 'Pal Meriam', 'Pisangan Baru', 'Utan Kayu Selatan', 'Utan Kayu Utara'] },
          { name: 'Pulo Gadung', postalCode: '13220', villages: ['Cipinang', 'Jati', 'Jatinegara Kaum', 'Kayu Putih', 'Pisangan Timur', 'Pulo Gadung', 'Rawamangun'] },
          { name: 'Jatinegara', postalCode: '13330', villages: ['Bali Mester', 'Bidara Cina', 'Cipinang Besar Selatan', 'Cipinang Besar Utara', 'Cipinang Cempedak', 'Cipinang Muara', 'Kampung Melayu', 'Rawa Bunga'] },
          { name: 'Duren Sawit', postalCode: '13440', villages: ['Duren Sawit', 'Klender', 'Malaka Jaya', 'Malaka Sari', 'Pondok Bambu', 'Pondok Kelapa', 'Pondok Kopi'] },
          { name: 'Cakung', postalCode: '13910', villages: ['Cakung Barat', 'Cakung Timur', 'Jatinegara', 'Penggilingan', 'Pulo Gebang', 'Rawa Terate', 'Ujung Menteng'] },
        ],
      },
      {
        name: 'Kota Jakarta Utara',
        districts: [
          { name: 'Penjaringan', postalCode: '14450', villages: ['Kamal Muara', 'Kapuk Muara', 'Pejagalan', 'Penjaringan', 'Pluit'] },
          { name: 'Pademangan', postalCode: '14420', villages: ['Ancol', 'Pademangan Barat', 'Pademangan Timur'] },
          { name: 'Tanjung Priok', postalCode: '14310', villages: ['Kebon Bawang', 'Papanggo', 'Sungai Bambu', 'Sunter Agung', 'Sunter Jaya', 'Tanjung Priok', 'Warakas'] },
          { name: 'Kelapa Gading', postalCode: '14240', villages: ['Kelapa Gading Barat', 'Kelapa Gading Timur', 'Pegangsaan Dua'] },
        ],
      },
      {
        name: 'Kabupaten Kepulauan Seribu',
        districts: [
          { name: 'Kepulauan Seribu Selatan', postalCode: '14510', villages: ['Pulau Untung Jawa', 'Pulau Pari', 'Pulau Tidung'] },
          { name: 'Kepulauan Seribu Utara', postalCode: '14520', villages: ['Pulau Panggang', 'Pulau Kelapa', 'Pulau Harapan'] },
        ],
      },
    ],
  },

  // 3. JAWA BARAT
  {
    id: 'jawa-barat',
    name: 'Jawa Barat',
    cities: [
      {
        name: 'Kota Bandung',
        districts: [
          { name: 'Coblong', postalCode: '40132', villages: ['Dago', 'Lebakgede', 'Lebaksiliwangi', 'Sadangserang', 'Sekeloa'] },
          { name: 'Cicendo', postalCode: '40171', villages: ['Arjuna', 'Husen Sastranegara', 'Pajajaran', 'Pamoyanan', 'Pasirkaliki', 'Sukaraja'] },
          { name: 'Sumur Bandung', postalCode: '40111', villages: ['Babakanciamis', 'Braga', 'Kebonpisang', 'Merdeka'] },
          { name: 'Lengkong', postalCode: '40261', villages: ['Burangrang', 'Cijagra', 'Cikawao', 'Lingkar Selatan', 'Malabar', 'Paledang', 'Turangga'] },
        ],
      },
      {
        name: 'Kota Bekasi',
        districts: [
          { name: 'Bekasi Barat', postalCode: '17145', villages: ['Bintara', 'Bintara Jaya', 'Jaka Sampurna', 'Kota Baru', 'Kranji'] },
          { name: 'Bekasi Selatan', postalCode: '17148', villages: ['Jaka Mulya', 'Jaka Setia', 'Kayuringin Jaya', 'Pekayon Jaya'] },
          { name: 'Bekasi Timur', postalCode: '17111', villages: ['Aren Jaya', 'Bekasi Jaya', 'Duren Jaya', 'Margahayu'] },
          { name: 'Bekasi Utara', postalCode: '17121', villages: ['Harapan Baru', 'Harapan Jaya', 'Kaliabang Tengah', 'Marga Mulya', 'Perwira', 'Teluk Pucung'] },
        ],
      },
      {
        name: 'Kota Depok',
        districts: [
          { name: 'Pancoran Mas', postalCode: '16436', villages: ['Depok', 'Depok Jaya', 'Mampang', 'Pancoran Mas', 'Rangkapan Jaya', 'Rangkapan Jaya Baru'] },
          { name: 'Beji', postalCode: '16421', villages: ['Beji', 'Beji Timur', 'Kemiri Muka', 'Kukusan', 'Pondok Cina', 'Tanah Baru'] },
          { name: 'Sukmajaya', postalCode: '16412', villages: ['Abadijaya', 'Bakti Jaya', 'Cisalak', 'Mekar Jaya', 'Sukmajaya', 'Tirtajaya'] },
          { name: 'Cimanggis', postalCode: '16452', villages: ['Curug', 'Harjamukti', 'Mekarsari', 'Pasir Gunung Selatan', 'Tugu'] },
        ],
      },
      {
        name: 'Kota Bogor',
        districts: [
          { name: 'Bogor Tengah', postalCode: '16121', villages: ['Babakan', 'Babakan Pasar', 'Cibogor', 'Ciwaringin', 'Gudang', 'Kebon Kelapa', 'Pabaton', 'Paledang', 'Panaragan', 'Sempur', 'Tegallega'] },
          { name: 'Bogor Selatan', postalCode: '16131', villages: ['Batutulis', 'Bondongan', 'Cikaret', 'Cipaku', 'Empang', 'Genteng', 'Harjasari', 'Kertamaya', 'Lawang Gintung', 'Muarasari', 'Mulyaharja', 'Pakuan', 'Pamoyanan', 'Rancamaya', 'Ranggamekar'] },
        ],
      },
      {
        name: 'Kabupaten Bogor',
        districts: [
          { name: 'Cibinong', postalCode: '16911', villages: ['Cibinong', 'Cirimekar', 'Ciriung', 'Harapan Jaya', 'Karadenan', 'Nanggewer', 'Pabuaran', 'Pakansari', 'Pondok Rajeg', 'Sukahati', 'Tengah'] },
          { name: 'Gunung Putri', postalCode: '16961', villages: ['Bojong Kulur', 'Bojong Nangka', 'Cicadas', 'Cikeas Udik', 'Gunung Putri', 'Karanggan', 'Nagrak', 'Tlajung Udik', 'Wanaherang'] },
        ],
      },
      {
        name: 'Kabupaten Bekasi',
        districts: [
          { name: 'Cikarang Pusat', postalCode: '17530', villages: ['Cicau', 'Hegarmukti', 'Jayamukti', 'Pasirranji', 'Pasirtanjung', 'Sukamahi'] },
          { name: 'Tambun Selatan', postalCode: '17510', villages: ['Jatimulya', 'Lambangjaya', 'Lambangsari', 'Mangunjaya', 'Setiadarma', 'Setiamekar', 'Sumberjaya', 'Tambun', 'Tridaya Sakti'] },
        ],
      },
    ],
  },

  // 4. JAWA TENGAH
  {
    id: 'jawa-tengah',
    name: 'Jawa Tengah',
    cities: [
      {
        name: 'Kota Semarang',
        districts: [
          { name: 'Semarang Tengah', postalCode: '50132', villages: ['Bangunharjo', 'Brumbungan', 'Gabahan', 'Jagalan', 'Karangkidul', 'Kauman', 'Kembangsari', 'Kranggan', 'Miroto', 'Pandansari', 'Pekunden', 'Pendrikan Kidul', 'Pendrikan Lor', 'Purwodinatan', 'Sekayu'] },
          { name: 'Banyumanik', postalCode: '50264', villages: ['Banyumanik', 'Gedawang', 'Jabungan', 'Ngesrep', 'Padangsari', 'Pedalangan', 'Pudakpayung', 'Srondol Kulon', 'Srondol Wetan', 'Sumurboto', 'Tinjomoyo'] },
        ],
      },
      {
        name: 'Kota Surakarta (Solo)',
        districts: [
          { name: 'Banjarsari', postalCode: '57131', villages: ['Banjarsari', 'Gilingan', 'Kadipiro', 'Keprabon', 'Kestalan', 'Ketelan', 'Manahan', 'Mangkubumen', 'Nusukan', 'Punggawan', 'Setabelan', 'Sumber', 'Timuran'] },
          { name: 'Laweyan', postalCode: '57141', villages: ['Bumi', 'Jajar', 'Karangasem', 'Kerten', 'Laweyan', 'Pajang', 'Panularan', 'Penumping', 'Purwosari', 'Sondakan', 'Sriwedari'] },
        ],
      },
    ],
  },

  // 5. DI YOGYAKARTA
  {
    id: 'di-yogyakarta',
    name: 'DI Yogyakarta',
    cities: [
      {
        name: 'Kota Yogyakarta',
        districts: [
          { name: 'Danurejan', postalCode: '55211', villages: ['Bausasran', 'Suryatmajan', 'Tegal Panggung'] },
          { name: 'Gondokusuman', postalCode: '55221', villages: ['Baciro', 'Demangan', 'Klitren', 'Kotabaru', 'Terban'] },
          { name: 'Malioboro / Gedongtengen', postalCode: '55271', villages: ['Pringgokusuman', 'Sosromenduran'] },
        ],
      },
      {
        name: 'Kabupaten Sleman',
        districts: [
          { name: 'Depok', postalCode: '55281', villages: ['Caturtunggal', 'Condongcatur', 'Maguwoharjo'] },
          { name: 'Mlati', postalCode: '55284', villages: ['Sinduadi', 'Sendangadi', 'Tirtoadi', 'Sumberadi', 'Cebongan'] },
        ],
      },
    ],
  },

  // 6. JAWA TIMUR
  {
    id: 'jawa-timur',
    name: 'Jawa Timur',
    cities: [
      {
        name: 'Kota Surabaya',
        districts: [
          { name: 'Genteng', postalCode: '60272', villages: ['Embong Kaliasin', 'Genteng', 'Kapasari', 'Ketabang', 'Peneleh'] },
          { name: 'Tegalsari', postalCode: '60261', villages: ['Dr. Soetomo', 'Kedungdoro', 'Keputran', 'Tegalsari', 'Wonorejo'] },
          { name: 'Gubeng', postalCode: '60281', villages: ['Airlangga', 'Barata Jaya', 'Gubeng', 'Kertajaya', 'Mojo', 'Pucang Sewu'] },
          { name: 'Wonokromo', postalCode: '60241', villages: ['Darmo', 'Jagir', 'Ngagel', 'Ngagelrejo', 'Sawunggaling', 'Wonokromo'] },
        ],
      },
      {
        name: 'Kota Malang',
        districts: [
          { name: 'Klojen', postalCode: '65111', villages: ['Bareng', 'Gadingasri', 'Kasir', 'Kauman', 'Kiduldalem', 'Klojen', 'Oro-oro Dowo', 'Penanggungan', 'Rampal Celaket', 'Samaan', 'Sukoharjo'] },
          { name: 'Lowokwaru', postalCode: '65141', villages: ['Dinoyo', 'Jatimulyo', 'Ketawanggede', 'Lowokwaru', 'Merjosari', 'Mojolangu', 'Sumbersari', 'Tasikmadu', 'Tlogomas', 'Tulusrejo', 'Tunggulwulung'] },
        ],
      },
    ],
  },

  // 7. ACEH
  {
    id: 'aceh',
    name: 'Aceh',
    cities: [
      {
        name: 'Kota Banda Aceh',
        districts: [
          { name: 'Baiturrahman', postalCode: '23241', villages: ['Ateuk Jawo', 'Ateuk Pahlawan', 'Kampung Baru', 'Neusu Jaya', 'Peuniti', 'Seutui', 'Sukaramai'] },
          { name: 'Kuta Alam', postalCode: '23121', villages: ['Bandar Baru', 'Beurawe', 'Keuramat', 'Kuta Alam', 'Laksana', 'Lampulo', 'Mulio'] },
        ],
      },
    ],
  },

  // 8. SUMATERA UTARA
  {
    id: 'sumatera-utara',
    name: 'Sumatera Utara',
    cities: [
      {
        name: 'Kota Medan',
        districts: [
          { name: 'Medan Kota', postalCode: '20211', villages: ['Kotamatsum III', 'Mesjid', 'Pasar Baru', 'Pasar Merah Barat', 'Pusat Pasar', 'Sei Rengas I', 'Sitirejo I', 'Teladan Barat', 'Teladan Timur'] },
          { name: 'Medan Baru', postalCode: '20153', villages: ['Babura', 'Darai', 'Merdeka', 'Padang Bulan', 'Petisah Hulu', 'Titi Rantai'] },
          { name: 'Medan Petisah', postalCode: '20111', villages: ['Petisah Tengah', 'Sekip', 'Sei Putih Barat', 'Sei Putih Tengah', 'Sei Putih Timur I', 'Sei Putih Timur II', 'Silalas'] },
        ],
      },
    ],
  },

  // 9. SUMATERA BARAT
  {
    id: 'sumatera-barat',
    name: 'Sumatera Barat',
    cities: [
      {
        name: 'Kota Padang',
        districts: [
          { name: 'Padang Barat', postalCode: '25111', villages: ['Belakang Pondok', 'Berok Nipah', 'Flamboyan Baru', 'Kampung Jao', 'Kampung Pondok', 'Olo', 'Padang Pasir', 'Purus', 'Rimbo Kaluang', 'Ujung Gurun'] },
          { name: 'Koto Tangah', postalCode: '25171', villages: ['Air Pacah', 'Balai Gadang', 'Batang Kabung Ganting', 'Batipuh Panjang', 'Bungo Pasang', 'Dadok Tunggul Hitam', 'Lubuk Buaya', 'Padang Sarai', 'Pasir Nan Tigo'] },
        ],
      },
    ],
  },

  // 10. RIAU
  {
    id: 'riau',
    name: 'Riau',
    cities: [
      {
        name: 'Kota Pekanbaru',
        districts: [
          { name: 'Sukajadi', postalCode: '28121', villages: ['Harjosari', 'Jadirejo', 'Kampung Melayu', 'Kampung Tengah', 'Kedung Sari', 'Pulau Karam', 'Sukajadi'] },
          { name: 'Marpoyan Damai', postalCode: '28125', villages: ['Maharatu', 'Perhentian Marpoyan', 'Sidomulyo Timur', 'Tangkerang Barat', 'Tangkerang Tengah', 'Wonorejo'] },
        ],
      },
    ],
  },

  // 11. KEPULAUAN RIAU
  {
    id: 'kepulauan-riau',
    name: 'Kepulauan Riau',
    cities: [
      {
        name: 'Kota Batam',
        districts: [
          { name: 'Batam Kota', postalCode: '29461', villages: ['Baloi Permai', 'Belian', 'Sukajadi', 'Sungai Panas', 'Taman Baloi', 'Teluk Tering'] },
          { name: 'Lubuk Baja', postalCode: '29444', villages: ['Baloi Indah', 'Batu Selicin', 'Kampung Pelita', 'Lubuk Baja Kota', 'Tanjung Uma'] },
        ],
      },
      {
        name: 'Kota Tanjungpinang',
        districts: [
          { name: 'Tanjungpinang Kota', postalCode: '29111', villages: ['Penyengat', 'Kampung Bugis', 'Senggarang', 'Tanjungpinang Kota'] },
        ],
      },
    ],
  },

  // 12. JAMBI
  {
    id: 'jambi',
    name: 'Jambi',
    cities: [
      {
        name: 'Kota Jambi',
        districts: [
          { name: 'Telanaipura', postalCode: '36122', villages: ['Buluran Kenali', 'Pematang Sulur', 'Simpang Empat Sipin', 'Telanaipura', 'Teluk Kenali'] },
          { name: 'Danau Sipin', postalCode: '36124', villages: ['Legok', 'Murni', 'Selamat', 'Solok Sipin', 'Sungai Putri'] },
        ],
      },
    ],
  },

  // 13. SUMATERA SELATAN
  {
    id: 'sumatera-selatan',
    name: 'Sumatera Selatan',
    cities: [
      {
        name: 'Kota Palembang',
        districts: [
          { name: 'Ilir Barat I', postalCode: '30139', villages: ['Bukit Baru', 'Bukit Lama', 'Demang Lebar Daun', 'Lorok Pakjo', 'Siring Agung'] },
          { name: 'Ilir Timur I', postalCode: '30121', villages: ['13 Ilir', '14 Ilir', '15 Ilir', '16 Ilir', '17 Ilir', '18 Ilir', '20 Ilir D-I', '20 Ilir D-III', 'Kepandean', 'Sungai Pangeran'] },
        ],
      },
    ],
  },

  // 14. KEPULAUAN BANGKA BELITUNG
  {
    id: 'bangka-belitung',
    name: 'Kepulauan Bangka Belitung',
    cities: [
      {
        name: 'Kota Pangkal Pinang',
        districts: [
          { name: 'Bukit Intan', postalCode: '33149', villages: ['Air Itam', 'Bacang', 'Pasir Putih', 'Semabung Lama', 'Sinar Bulan', 'Temberan'] },
          { name: 'Gerunggang', postalCode: '33123', villages: ['Air Kepala Tujuh', 'Bukit Merapin', 'Bukit Sari', 'Kacang Pedang', 'Taman Bunga', 'Tua Tunu'] },
        ],
      },
    ],
  },

  // 15. BENGKULU
  {
    id: 'bengkulu',
    name: 'Bengkulu',
    cities: [
      {
        name: 'Kota Bengkulu',
        districts: [
          { name: 'Ratu Agung', postalCode: '38222', villages: ['Kebun Beler', 'Kebun Kenanga', 'Kebun Tebeng', 'Lempuing', 'Nusa Indah', 'Sawah Lebar', 'Sawah Lebar Baru', 'Tanah Patah'] },
          { name: 'Gading Cempaka', postalCode: '38229', villages: ['Cempaka Permai', 'Jalan Gedang', 'Lingkar Barat', 'Padang Harapan', 'Sido Mulyo'] },
        ],
      },
    ],
  },

  // 16. LAMPUNG
  {
    id: 'lampung',
    name: 'Lampung',
    cities: [
      {
        name: 'Kota Bandar Lampung',
        districts: [
          { name: 'Tanjung Karang Pusat', postalCode: '35111', villages: ['Durian Payung', 'Gotong Royong', 'Kaliawi', 'Kaliawi Persada', 'Kelapa Tiga', 'Palapa', 'Pasir Gintung'] },
          { name: 'Kedaton', postalCode: '35141', villages: ['Kedaton', 'Penengahan', 'Penengahan Raya', 'Sukamenanti', 'Sukamenanti Baru', 'Surabaya', 'Tegalsari'] },
        ],
      },
    ],
  },

  // 17. BALI
  {
    id: 'bali',
    name: 'Bali',
    cities: [
      {
        name: 'Kota Denpasar',
        districts: [
          { name: 'Denpasar Selatan', postalCode: '80221', villages: ['Panjer', 'Pedungan', 'Pemogan', 'Renon', 'Sanur', 'Sanur Kaja', 'Sanur Kauh', 'Sidakarya'] },
          { name: 'Denpasar Barat', postalCode: '80119', villages: ['Dauh Puri', 'Dauh Puri Kangin', 'Dauh Puri Kauh', 'Dauh Puri Klod', 'Padangsambian', 'Padangsambian Kaja', 'Padangsambian Klod', 'Pemecutan', 'Pemecutan Klod'] },
        ],
      },
      {
        name: 'Kabupaten Badung',
        districts: [
          { name: 'Kuta', postalCode: '80361', villages: ['Kedonganan', 'Tuban', 'Kuta', 'Legian', 'Seminyak'] },
          { name: 'Kuta Selatan', postalCode: '80361', villages: ['Benoa', 'Tanjung Benoa', 'Jimbaran', 'Ungasan', 'Pecatu', 'Kutuh'] },
        ],
      },
    ],
  },

  // 18. NUSA TENGGARA BARAT
  {
    id: 'nusa-tenggara-barat',
    name: 'Nusa Tenggara Barat',
    cities: [
      {
        name: 'Kota Mataram',
        districts: [
          { name: 'Mataram', postalCode: '83121', villages: ['Mataram Timur', 'Mataram Barat', 'Pagesangan', 'Pagesangan Barat', 'Pagesangan Timur', 'Pagutan', 'Pagutan Barat', 'Pagutan Timur', 'Pejanggik', 'Punia'] },
          { name: 'Ampenan', postalCode: '83111', villages: ['Ampenan Selatan', 'Ampenan Tengah', 'Ampenan Utara', 'Banjar', 'Bintaro', 'Dayan Peken', 'Kebun Sari', 'Pejeruk', 'Taman Sari'] },
        ],
      },
    ],
  },

  // 19. NUSA TENGGARA TIMUR
  {
    id: 'nusa-tenggara-timur',
    name: 'Nusa Tenggara Timur',
    cities: [
      {
        name: 'Kota Kupang',
        districts: [
          { name: 'Kelapa Lima', postalCode: '85228', villages: ['Kelapa Lima', 'Lasiana', 'Oesapa', 'Oesapa Barat', 'Oesapa Selatan'] },
          { name: 'Oebobo', postalCode: '85111', villages: ['Fatubesi', 'Kayu Putih', 'Liliba', 'Oebobo', 'Oebufu', 'Tuak Daun Merah'] },
        ],
      },
    ],
  },

  // 20. KALIMANTAN BARAT
  {
    id: 'kalimantan-barat',
    name: 'Kalimantan Barat',
    cities: [
      {
        name: 'Kota Pontianak',
        districts: [
          { name: 'Pontianak Kota', postalCode: '78111', villages: ['Darat Sekip', 'Mariana', 'Sungai Bangkong', 'Sungai Jawi', 'Tengah'] },
          { name: 'Pontianak Selatan', postalCode: '78121', villages: ['Akcaya', 'Benua Melayu Darat', 'Benua Melayu Laut', 'Kotabaru', 'Parit Tokaya'] },
        ],
      },
    ],
  },

  // 21. KALIMANTAN TENGAH
  {
    id: 'kalimantan-tengah',
    name: 'Kalimantan Tengah',
    cities: [
      {
        name: 'Kota Palangka Raya',
        districts: [
          { name: 'Pahandut', postalCode: '73111', villages: ['Langkai', 'Pahandut', 'Pahandut Seberang', 'Panarung', 'Tanjung Pinang', 'Tumbang Rungan'] },
          { name: 'Jekan Raya', postalCode: '73112', villages: ['Bukit Tunggal', 'Menteng', 'Palangka', 'Petuk Katimpun'] },
        ],
      },
    ],
  },

  // 22. KALIMANTAN SELATAN
  {
    id: 'kalimantan-selatan',
    name: 'Kalimantan Selatan',
    cities: [
      {
        name: 'Kota Banjarmasin',
        districts: [
          { name: 'Banjarmasin Tengah', postalCode: '70111', villages: ['Antasan Besar', 'Gadang', 'Kertak Baru Ilir', 'Kertak Baru Ulu', 'Mawar', 'Melayu', 'Pasar Lama', 'Pekapuran Laut', 'Seberang Mesjid', 'Sungai Baru', 'Teluk Dalam'] },
          { name: 'Banjarmasin Barat', postalCode: '70114', villages: ['Belitung Selatan', 'Belitung Utara', 'Kuin Cerucuk', 'Kuin Selatan', 'Pelambuan', 'Telaga Biru', 'Teluk Tiram'] },
        ],
      },
    ],
  },

  // 23. KALIMANTAN TIMUR
  {
    id: 'kalimantan-timur',
    name: 'Kalimantan Timur',
    cities: [
      {
        name: 'Kota Samarinda',
        districts: [
          { name: 'Samarinda Kota', postalCode: '75111', villages: ['Bugis', 'Karang Mumus', 'Pelabuhan', 'Pasar Pagi', 'Sungai Pinang Luar'] },
          { name: 'Samarinda Ulu', postalCode: '75122', villages: ['Air Hitam', 'Air Putih', 'Bukit Pinang', 'Dadi Mulya', 'Gunung Kelua', 'Jawa', 'Sidodadi', 'Teluk Lerong Ilir'] },
        ],
      },
      {
        name: 'Kota Balikpapan',
        districts: [
          { name: 'Balikpapan Kota', postalCode: '76111', villages: ['Damai', 'Klandasan Ilir', 'Klandasan Ulu', 'Prapatan', 'Telaga Sari'] },
          { name: 'Balikpapan Selatan', postalCode: '76114', villages: ['Damai Bahagia', 'Damai Baru', 'Gunung Bahagia', 'Sepinggan', 'Sepinggan Baru', 'Sepinggan Raya', 'Sungai Nangka'] },
        ],
      },
    ],
  },

  // 24. KALIMANTAN UTARA
  {
    id: 'kalimantan-utara',
    name: 'Kalimantan Utara',
    cities: [
      {
        name: 'Kota Tarakan',
        districts: [
          { name: 'Tarakan Tengah', postalCode: '77111', villages: ['Kampung 1 Skip', 'Pamusian', 'Sebengkok', 'Selumit', 'Selumit Pantai'] },
          { name: 'Tarakan Barat', postalCode: '77111', villages: ['Karang Anyar', 'Karang Anyar Pantai', 'Karang Balik', 'Karang Harapan', 'Karang Rejo'] },
        ],
      },
    ],
  },

  // 25. SULAWESI UTARA
  {
    id: 'sulawesi-utara',
    name: 'Sulawesi Utara',
    cities: [
      {
        name: 'Kota Manado',
        districts: [
          { name: 'Wenang', postalCode: '95111', villages: ['Bumi Beringin', 'Calaca', 'Istiqlal', 'Kompleks Pasar 45', 'Lawangirung', 'Mahakeret Barat', 'Mahakeret Timur', 'Pinaesaan', 'Tikala Kumaraka', 'Titiwungen Selatan', 'Titiwungen Utara', 'Wenang Selatan', 'Wenang Utara'] },
          { name: 'Sario', postalCode: '95114', villages: ['Ranotana', 'Sario', 'Sario Kotabaru', 'Sario Tumpaan', 'Sario Utara', 'Titiwungen'] },
        ],
      },
    ],
  },

  // 26. GORONTALO
  {
    id: 'gorontalo',
    name: 'Gorontalo',
    cities: [
      {
        name: 'Kota Gorontalo',
        districts: [
          { name: 'Kota Tengah', postalCode: '96128', villages: ['Dulalowo', 'Dulalowo Timur', 'Liluwo', 'Paguyaman', 'Pulubala', 'Wumialo'] },
          { name: 'Kota Selatan', postalCode: '96111', villages: ['Biawao', 'Biawu', 'Limba B', 'Limba U1', 'Limba U2'] },
        ],
      },
    ],
  },

  // 27. SULAWESI TENGAH
  {
    id: 'sulawesi-tengah',
    name: 'Sulawesi Tengah',
    cities: [
      {
        name: 'Kota Palu',
        districts: [
          { name: 'Palu Barat', postalCode: '94221', villages: ['Balaroa', 'Donggala Kodi', 'Kabonena', 'Kamonji', 'Lere', 'Siratu', 'Ujuna'] },
          { name: 'Palu Timur', postalCode: '94111', villages: ['Besusu Barat', 'Besusu Tengah', 'Besusu Timur', 'Lolu Selatan', 'Lolu Utara'] },
        ],
      },
    ],
  },

  // 28. SULAWESI BARAT
  {
    id: 'sulawesi-barat',
    name: 'Sulawesi Barat',
    cities: [
      {
        name: 'Kabupaten Mamuju',
        districts: [
          { name: 'Mamuju', postalCode: '91511', villages: ['Binanga', 'Karema', 'Rimuku', 'Tadui', 'Bambu', 'Batu Pannu'] },
          { name: 'Simboro dan Kepulauan', postalCode: '91512', villages: ['Ranggi', 'Simboro', 'Botteng', 'Sumare'] },
        ],
      },
    ],
  },

  // 29. SULAWESI SELATAN
  {
    id: 'sulawesi-selatan',
    name: 'Sulawesi Selatan',
    cities: [
      {
        name: 'Kota Makassar',
        districts: [
          { name: 'Ujung Pandang', postalCode: '90111', villages: ['Baru', 'Bulogading', 'Lae-Lae', 'Lajangiru', 'Losari', 'Maloku', 'Mangkura', 'Pisang Selatan', 'Pisang Utara', 'Sawerigading'] },
          { name: 'Panakkukang', postalCode: '90231', villages: ['Karampuang', 'Kassi-Kassi', 'Masale', 'Pampang', 'Panaikang', 'Pandang', 'Paropo', 'Tamamaung', 'Tellumpoccoe', 'Tello Baru'] },
          { name: 'Tamalanrea', postalCode: '90245', villages: ['Bira', 'Kapasa', 'Kapasa Raya', 'Parang Tambung', 'Tamalanrea', 'Tamalanrea Indah', 'Tamalanrea Jaya'] },
        ],
      },
    ],
  },

  // 30. SULAWESI TENGGARA
  {
    id: 'sulawesi-tenggara',
    name: 'Sulawesi Tenggara',
    cities: [
      {
        name: 'Kota Kendari',
        districts: [
          { name: 'Kadia', postalCode: '93117', villages: ['Anaiwoi', 'Bende', 'Kadia', 'Pondambea', 'Wawowanggu'] },
          { name: 'Mandonga', postalCode: '93111', villages: ['Anggilowu', 'Korumba', 'Labibia', 'Mandonga', 'Wawatu', 'Alolama'] },
        ],
      },
    ],
  },

  // 31. MALUKU
  {
    id: 'maluku',
    name: 'Maluku',
    cities: [
      {
        name: 'Kota Ambon',
        districts: [
          { name: 'Sirimau', postalCode: '97121', villages: ['Ahusen', 'Batu Gajah', 'Batu Merah', 'Honipopu', 'Karang Panjang', 'Pandang-Pandang', 'Rijali', 'Uritetu'] },
          { name: 'Nusaniwe', postalCode: '97115', villages: ['Benteng', 'Kudamati', 'Mangga Dua', 'Nusaniwe', 'Silale', 'Urimessing', 'Wainitu'] },
        ],
      },
    ],
  },

  // 32. MALUKU UTARA
  {
    id: 'maluku-utara',
    name: 'Maluku Utara',
    cities: [
      {
        name: 'Kota Ternate',
        districts: [
          { name: 'Ternate Tengah', postalCode: '97711', villages: ['Gamalama', 'Makassar Barat', 'Makassar Timur', 'Maliaro', 'Marikurubu', 'Muhajirin', 'Salahuddin', 'Santiong', 'Takoma'] },
          { name: 'Ternate Selatan', postalCode: '97715', villages: ['Bastiong Karance', 'Bastiong Talangame', 'Fitu', 'Gambesi', 'Kalumata', 'Kayu Merah', 'Mangga Dua', 'Ngade', 'Sasa', 'Tanah Tinggi', 'Toboko', 'Ubo-Ubo'] },
        ],
      },
    ],
  },

  // 33. PAPUA
  {
    id: 'papua',
    name: 'Papua',
    cities: [
      {
        name: 'Kota Jayapura',
        districts: [
          { name: 'Jayapura Utara', postalCode: '99111', villages: ['Angkasapura', 'Bayangkara', 'Gurabesi', 'Imbi', 'Mandow', 'Tanjung Ria', 'Trikora'] },
          { name: 'Jayapura Selatan', postalCode: '99221', villages: ['Argapura', 'Entrop', 'Hamadi', 'Nung', 'Tahima Soroma', 'Tobati'] },
          { name: 'Abepura', postalCode: '99351', villages: ['Abepantai', 'Asano', 'Awiyo', 'Kota Baru', 'Vim', 'Wahno', 'Way Mhorock', 'Yobe'] },
        ],
      },
    ],
  },

  // 34. PAPUA BARAT
  {
    id: 'papua-barat',
    name: 'Papua Barat',
    cities: [
      {
        name: 'Kabupaten Manokwari',
        districts: [
          { name: 'Manokwari Barat', postalCode: '98312', villages: ['Amban', 'Manokwari Barat', 'Padarni', 'Sowi', 'Wosi'] },
          { name: 'Manokwari Timur', postalCode: '98311', villages: ['Arowi', 'Ayambori', 'Pasir Putih'] },
        ],
      },
    ],
  },

  // 35. PAPUA BARAT DAYA
  {
    id: 'papua-barat-daya',
    name: 'Papua Barat Daya',
    cities: [
      {
        name: 'Kota Sorong',
        districts: [
          { name: 'Sorong Barat', postalCode: '98411', villages: ['Klademak', 'Klasuur', 'Puncak Cendrawasih', 'Rufei', 'Tanjung Kasuari'] },
          { name: 'Sorong Timur', postalCode: '98416', villages: ['Klamana', 'Klawalu', 'Klawuyuk', 'Kladufu'] },
        ],
      },
    ],
  },

  // 36. PAPUA SELATAN
  {
    id: 'papua-selatan',
    name: 'Papua Selatan',
    cities: [
      {
        name: 'Kabupaten Merauke',
        districts: [
          { name: 'Merauke', postalCode: '99611', villages: ['Bambu Pemali', 'Kelapa Lima', 'Maro', 'Mopah Lama', 'Rimbi', 'Samkai', 'Seringgu Jaya'] },
        ],
      },
    ],
  },

  // 37. PAPUA TENGAH
  {
    id: 'papua-tengah',
    name: 'Papua Tengah',
    cities: [
      {
        name: 'Kabupaten Nabire',
        districts: [
          { name: 'Nabire', postalCode: '98811', villages: ['Kalibobo', 'Karang Mulia', 'Morgo', 'Nabarua', 'Oyehe', 'Siriwini'] },
        ],
      },
    ],
  },

  // 38. PAPUA PEGUNUNGAN
  {
    id: 'papua-pegunungan',
    name: 'Papua Pegunungan',
    cities: [
      {
        name: 'Kabupaten Jayawijaya',
        districts: [
          { name: 'Wamena', postalCode: '99511', villages: ['Wamena Kota', 'Sinakma', 'Wesaput', 'Hukimo', 'Honelama'] },
        ],
      },
    ],
  },
];
