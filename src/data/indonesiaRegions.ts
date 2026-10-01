// Database Wilayah Indonesia Lengkap
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

// Khusus Wilayah Layanan Pemasangan Sambungan Baru Aetra di Kabupaten Tangerang
export interface AetraInstallationKecamatan {
  name: string;
  postalCode: string;
  villages: string[];
}

export const AETRA_TANGERANG_INSTALLATION_REGIONS: AetraInstallationKecamatan[] = [
  {
    name: 'BALARAJA',
    postalCode: '15610',
    villages: ['Balaraja', 'Talagasari', 'Tobat', 'Saga', 'Sentul', 'Gembong', 'Cangkudu', 'Sukamurni'],
  },
  {
    name: 'CIKUPA',
    postalCode: '15710',
    villages: ['Cikupa', 'Budi Mulya', 'Bojong', 'Sukamulya', 'Dukuh', 'Bitung Jaya', 'Talaga', 'Pasir Gadung', 'Sukamantri', 'Cibadak', 'Pasir Jaya'],
  },
  {
    name: 'CURUG',
    postalCode: '15810',
    villages: ['Curug Kulon', 'Curug Wetan', 'Kadu Jaya', 'Kadu', 'Cukanggalih', 'Binong'],
  },
  {
    name: 'JAYANTI',
    postalCode: '15610',
    villages: ['Jayanti', 'Sumur Bandung', 'Pasir Gintung', 'Pabuaran', 'Dangdeur', 'Cikande', 'Pasir Muncang'],
  },
  {
    name: 'PASAR KEMIS',
    postalCode: '15560',
    villages: ['Pasar Kemis', 'Sukamantri', 'Kuta Jaya', 'Kuta Baru', 'Gelam Jaya', 'Sindangsari', 'Pangadegan', 'Suka Asih'],
  },
  {
    name: 'SEPATAN',
    postalCode: '15520',
    villages: ['Sepatan', 'Pisangan Jaya', 'Kayu Agung', 'Kayu Bongkok', 'Sarakan', 'Karet'],
  },
  {
    name: 'SEPATAN TIMUR',
    postalCode: '15520',
    villages: ['Kedaung Barat', 'Lebak Wangi', 'Tanah Merah', 'Gempol Sari', 'Jatimulya', 'Pondok Kelor', 'Kampung Kelor'],
  },
  {
    name: 'SINDANG JAYA',
    postalCode: '15560',
    villages: ['Sindang Jaya', 'Sindang Asih', 'Sindang Sono', 'Wanakerta', 'Badak Anom', 'Sindang Panon'],
  },
  {
    name: 'WANA KERTA',
    postalCode: '15560',
    villages: ['Wanakerta', 'Sindang Asih', 'Sindang Jaya', 'Suvarna Sutera', 'Pasir Barat'],
  },
];

export const INDONESIA_PROVINCES_DATA: ProvinceData[] = [
  // 1. BANTEN
  {
    id: 'banten',
    name: 'Banten',
    cities: [
      {
        name: 'Kabupaten Tangerang',
        districts: [
          { name: 'Balaraja', postalCode: '15610', villages: ['Balaraja', 'Talagasari', 'Tobat', 'Saga', 'Sentul', 'Gembong', 'Cangkudu', 'Sukamurni'] },
          { name: 'Cikupa', postalCode: '15710', villages: ['Cikupa', 'Budi Mulya', 'Bojong', 'Sukamulya', 'Dukuh', 'Bitung Jaya', 'Talaga', 'Pasir Gadung', 'Sukamantri', 'Cibadak'] },
          { name: 'Curug', postalCode: '15810', villages: ['Curug Kulon', 'Curug Wetan', 'Kadu Jaya', 'Kadu', 'Cukanggalih', 'Binong'] },
          { name: 'Jayanti', postalCode: '15610', villages: ['Jayanti', 'Sumur Bandung', 'Pasir Gintung', 'Pabuaran', 'Dangdeur', 'Cikande', 'Pasir Muncang'] },
          { name: 'Pasar Kemis', postalCode: '15560', villages: ['Pasar Kemis', 'Sukamantri', 'Kuta Jaya', 'Kuta Baru', 'Gelam Jaya', 'Sindangsari', 'Pangadegan', 'Suka Asih'] },
          { name: 'Sepatan', postalCode: '15520', villages: ['Sepatan', 'Pisangan Jaya', 'Kayu Agung', 'Kayu Bongkok', 'Sarakan', 'Karet'] },
          { name: 'Sepatan Timur', postalCode: '15520', villages: ['Kedaung Barat', 'Lebak Wangi', 'Tanah Merah', 'Gempol Sari', 'Jatimulya', 'Pondok Kelor', 'Kampung Kelor'] },
          { name: 'Sindang Jaya', postalCode: '15560', villages: ['Sindang Jaya', 'Sindang Asih', 'Sindang Sono', 'Wanakerta', 'Badak Anom', 'Sindang Panon'] },
          { name: 'Rajeg', postalCode: '15540', villages: ['Rajeg', 'Ranca Bango', 'Sukatani', 'Daon', 'Pangarengan', 'Tanjakan', 'Mekarsari', 'Tanjakan Mekar'] },
          { name: 'Panongan', postalCode: '15711', villages: ['Panongan', 'Mekar Bakti', 'Ciakar', 'Ranca Iyuh', 'Peusar', 'Serdang Kulon'] },
          { name: 'Kelapa Dua', postalCode: '15810', villages: ['Kelapa Dua', 'Bencongan', 'Bencongan Indah', 'Bojong Nangka', 'Curug Sangereng', 'Pakulonan Barat'] },
          { name: 'Legok', postalCode: '15820', villages: ['Legok', 'Babakan Barat', 'Babakan', 'Bojongkamal', 'Cirarab', 'Palasari', 'Caringin'] },
          { name: 'Tigaraksa', postalCode: '15720', villages: ['Tigaraksa', 'Kadu Agung', 'Matagara', 'Pasir Bolang', 'Pasir Nangka', 'Sodong', 'Bantar Panjang', 'Pete'] },
          { name: 'Cisauk', postalCode: '15341', villages: ['Cisauk', 'Sampora', 'Cibogo', 'Suradita', 'Dangdang', 'Mekar Wangi'] },
          { name: 'Pakuhaji', postalCode: '15570', villages: ['Pakuhaji', 'Buaran Bambu', 'Buaran Mangga', 'Gaga', 'Kalibaru', 'Kiara Payung', 'Kohod', 'Kramat', 'Laksana', 'Paku Alam', 'Rawa Boni', 'Sukawali', 'Surya Bahari'] },
          { name: 'Teluknaga', postalCode: '15510', villages: ['Babakan Asem', 'Bojong Renged', 'Kampung Besar', 'Kampung Melayu Barat', 'Kampung Melayu Timur', 'Keboncau', 'Lemo', 'Muara', 'Pangkalan', 'Tanjung Burung', 'Tanjung Pasir', 'Tegal Angus', 'Teluknaga'] },
          { name: 'Kosambi', postalCode: '15211', villages: ['Belimbing', 'Cengklong', 'Dadap', 'Jatimulya', 'Kosambi Barat', 'Kosambi Timur', 'Rawa Burung', 'Rawa Rengas', 'Salembaran Jaya', 'Salembaran Jati'] },
          { name: 'Kresek', postalCode: '15620', villages: ['Kresek', 'Jengkol', 'Kemuning', 'Koper', 'Pasir Ampo', 'Patrasana', 'Rancailat', 'Renged', 'Talok'] },
          { name: 'Kronjo', postalCode: '15550', villages: ['Kronjo', 'Bakung', 'Cirumpak', 'Pagedangan Ilir', 'Pagedangan Udik', 'Pasilian', 'Pasir', 'Pagenjahan'] },
          { name: 'Mauk', postalCode: '15530', villages: ['Mauk Barat', 'Mauk Timur', 'Banyu Asih', 'Gunung Sari', 'Jatiwaringin', 'Kedung Dalem', 'Ketapang', 'Marga Mulya', 'Sasak', 'Tanjung Anom'] },
          { name: 'Kemiri', postalCode: '15530', villages: ['Kemiri', 'Karang Anyar', 'Kaleran', 'Klebet', 'Lontar', 'Patramanggala', 'Ranca Labuh'] },
          { name: 'Sukadiri', postalCode: '15530', villages: ['Sukadiri', 'Buaran Jati', 'Gintung', 'Karang Serang', 'Kosambi', 'Mekar Kondang', 'Pekayon', 'Rawa Kidang'] },
          { name: 'Gunung Kaler', postalCode: '15620', villages: ['Gunung Kaler', 'Candeleh', 'Cipaeh', 'Ganda Ria', 'Kedung', 'Onyam', 'Rancagede', 'Sidoko', 'Tamiang'] },
          { name: 'Mekar Baru', postalCode: '15550', villages: ['Mekar Baru', 'Cijeruk', 'Gandaria', 'Jenggot', 'Kedaung', 'Kluit', 'Kosambi Dalam', 'Waliwis'] },
          { name: 'Pagedangan', postalCode: '15339', villages: ['Pagedangan', 'Cicalengka', 'Cihuni', 'Cijantra', 'Jatake', 'Kadu Sirung', 'Lengkona Kulon', 'Malang Nengah', 'Medang'] },
          { name: 'Solear', postalCode: '15730', villages: ['Solear', 'Cikareo', 'Cikuya', 'Cikasungka', 'Munjul', 'Pasanggrahan', 'Tiregarang'] },
          { name: 'Sukamulya', postalCode: '15610', villages: ['Sukamulya', 'Buniayu', 'Kaliasin', 'Kubang', 'Merak', 'Parahu'] },
          { name: 'Cisoka', postalCode: '15730', villages: ['Cisoka', 'Bojong Loa', 'Carenang', 'Caringin', 'Cempaka', 'Karangharja', 'Sukatani'] },
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
          { name: 'Kebon Jeruk', postalCode: '11530', villages: ['Duri Kepa', 'Kedoya Selatan', 'Kedoya Utara', 'Kebon Jeruk', 'Kelapa Dua', 'Sukabumi Selatan', 'Sukabumi Utara'] },
          { name: 'Grogol Petamburan', postalCode: '11450', villages: ['Grogol', 'Jelambar', 'Jelambar Baru', 'Tanjung Duren Selatan', 'Tanjung Duren Utara', 'Tomang', 'Wijaya Kusuma'] },
          { name: 'Palmerah', postalCode: '11480', villages: ['Jatipulo', 'Kemanggisan', 'Kota Bambu Selatan', 'Kota Bambu Utara', 'Palmerah', 'Slipi'] },
          { name: 'Taman Sari', postalCode: '11110', villages: ['Glodok', 'Keagungan', 'Krukut', 'Mangga Besar', 'Maphar', 'Pinangsia', 'Taman Sari', 'Tangki'] },
          { name: 'Tambora', postalCode: '11210', villages: ['Angke', 'Duri Selatan', 'Duri Utara', 'Jembatan Besi', 'Jembatan Lima', 'Kali Anyar', 'Krendang', 'Pekojan', 'Roa Malaka', 'Tambora', 'Tanah Sereal'] },
        ],
      },
      {
        name: 'Kota Jakarta Selatan',
        districts: [
          { name: 'Kebayoran Baru', postalCode: '12110', villages: ['Cipete Utara', 'Gandaria Utara', 'Gunung', 'Kramat Pela', 'Melawai', 'Petogogan', 'Pulo', 'Rawa Barat', 'Selong', 'Senayan'] },
          { name: 'Kebayoran Lama', postalCode: '12240', villages: ['Cipulir', 'Grogol Selatan', 'Grogol Utara', 'Kebayoran Lama Selatan', 'Kebayoran Lama Utara', 'Pondok Pinang'] },
          { name: 'Pesanggrahan', postalCode: '12250', villages: ['Bintaro', 'Pesanggrahan', 'Petukangan Selatan', 'Petukangan Utara', 'Ulujami'] },
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
          { name: 'Tanah Abang', postalCode: '10210', villages: ['Bendungan Hilir', 'Gelora', 'Kampung Bali', 'Karet Tengsin', 'Kebon Kacang', 'Kebon Melati', 'Petamburan'] },
          { name: 'Menteng', postalCode: '10310', villages: ['Cikini', 'Gondangdia', 'Kebon Sirih', 'Menteng', 'Pegangsaan'] },
          { name: 'Senen', postalCode: '10410', villages: ['Bungur', 'Kenari', 'Kramat', 'Kwitang', 'Paseban', 'Senen'] },
          { name: 'Cempaka Putih', postalCode: '10510', villages: ['Cempaka Putih Barat', 'Cempaka Putih Timur', 'Rawasari'] },
          { name: 'Johar Baru', postalCode: '10560', villages: ['Galur', 'Johar Baru', 'Kampung Rawa', 'Tanah Tinggi'] },
          { name: 'Kemayoran', postalCode: '10610', villages: ['Cempaka Baru', 'Gunung Sahari Selatan', 'Harapan Mulya', 'Kebon Kosong', 'Kemayoran', 'Serdang', 'Sumur Batu', 'Utan Panjang'] },
          { name: 'Sawah Besar', postalCode: '10710', villages: ['Gunung Sahari Utara', 'Karang Anyar', 'Kartini', 'Mangga Dua Selatan', 'Pasar Baru'] },
        ],
      },
      {
        name: 'Kota Jakarta Timur',
        districts: [
          { name: 'Matraman', postalCode: '13110', villages: ['Kayu Manis', 'Kebon Manggis', 'Pal Riam', 'Pisangan Baru', 'Utan Kayu Selatan', 'Utan Kayu Utara'] },
          { name: 'Pulogadung', postalCode: '13210', villages: ['Cipinang', 'Jati', 'Jatinegara Kaum', 'Kayu Putih', 'Pisangan Timur', 'Pulo Gadung', 'Rawamangun'] },
          { name: 'Jatinegara', postalCode: '13310', villages: ['Bali Mester', 'Bidara Cina', 'Cipinang Besar Selatan', 'Cipinang Besar Utara', 'Cipinang Cempedak', 'Cipinang Muara', 'Kampung Melayu', 'Rawa Bunga'] },
          { name: 'Kramat Jati', postalCode: '13510', villages: ['Balekambang', 'Batu Ampar', 'Cawang', 'Cililitan', 'Dukuh', 'Kramat Jati', 'Tengah'] },
          { name: 'Duren Sawit', postalCode: '13440', villages: ['Duren Sawit', 'Klender', 'Malaka Jaya', 'Malaka Sari', 'Pondok Bambu', 'Pondok Kelapa', 'Pondok Kopi'] },
          { name: 'Cakung', postalCode: '13910', villages: ['Cakung Barat', 'Cakung Timur', 'Jatinegara', 'Penggilingan', 'Pulo Gebang', 'Rawa Terate', 'Ujung Menteng'] },
        ],
      },
      {
        name: 'Kota Jakarta Utara',
        districts: [
          { name: 'Penjaringan', postalCode: '14440', villages: ['Kamal Muara', 'Kapuk Muara', 'Pejagalan', 'Penjaringan', 'Pluit'] },
          { name: 'Pademangan', postalCode: '14420', villages: ['Ancol', 'Pademangan Barat', 'Pademangan Timur'] },
          { name: 'Tanjung Priok', postalCode: '14310', villages: ['Kebon Bawang', 'Papanggo', 'Sungai Bambu', 'Sunter Agung', 'Sunter Jaya', 'Tanjung Priok', 'Warakas'] },
          { name: 'Kelapa Gading', postalCode: '14240', villages: ['Kelapa Gading Barat', 'Kelapa Gading Timur', 'Pegangsaan Dua'] },
        ],
      },
      {
        name: 'Kabupaten Kepulauan Seribu',
        districts: [
          { name: 'Kepulauan Seribu Utara', postalCode: '14530', villages: ['Pulau Harapan', 'Pulau Kelapa', 'Pulau Panggang'] },
          { name: 'Kepulauan Seribu Selatan', postalCode: '14520', villages: ['Pulau Pari', 'Pulau Tidung', 'Pulau Untung Jawa'] },
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
          { name: 'Coblong', postalCode: '40132', villages: ['Cipaganti', 'Dago', 'Lebak Gede', 'Lebak Siliwangi', 'Sadang Serang', 'Sekeloa'] },
          { name: 'Cicendo', postalCode: '40171', villages: ['Arjuna', 'Husen Sastranegara', 'Pajajaran', 'Pamoyanan', 'Pasirkaliki', 'Sukaraja'] },
          { name: 'Sumur Bandung', postalCode: '40111', villages: ['Babakan Ciamis', 'Braga', 'Kebon Pisang', 'Merdeka'] },
          { name: 'Lengkong', postalCode: '40261', villages: ['Burangrang', 'Cijagra', 'Cikawao', 'Lingkar Selatan', 'Malabar', 'Paledang', 'Turangga'] },
        ],
      },
      {
        name: 'Kota Bekasi',
        districts: [
          { name: 'Bekasi Barat', postalCode: '17145', villages: ['Bintara', 'Bintara Jaya', 'Jakasampurna', 'Kota Baru', 'Kranji'] },
          { name: 'Bekasi Selatan', postalCode: '17148', villages: ['Jaka Mulya', 'Jaka Setia', 'Kayuringin Jaya', 'Mekar Jaya', 'Pekayon Jaya'] },
          { name: 'Bekasi Timur', postalCode: '17111', villages: ['Aren Jaya', 'Bekasi Jaya', 'Duren Jaya', 'Margahayu'] },
          { name: 'Bekasi Utara', postalCode: '17121', villages: ['Harapan Baru', 'Harapan Jaya', 'Kaliabang Tengah', 'Marga Mulya', 'Perwira', 'Teluk Pucung'] },
        ],
      },
      {
        name: 'Kabupaten Bekasi',
        districts: [
          { name: 'Cikarang Pusat', postalCode: '17530', villages: ['Cicau', 'Hegarmukti', 'Jayamukti', 'Pasirranji', 'Pasirtanjung', 'Sukamahi'] },
          { name: 'Cikarang Barat', postalCode: '17520', villages: ['Cikedokan', 'Danau Indah', 'Gandamekar', 'Gandasari', 'Jatiwangi', 'Kalijaya', 'Mekarwangi', 'Sukadanau', 'Telaga Asih', 'Telagamurni', 'Telajung'] },
          { name: 'Tambun Selatan', postalCode: '17510', villages: ['Jatimulya', 'Lambangjaya', 'Lambangsari', 'Mangunjaya', 'Setiadarma', 'Setiamekar', 'Sumberjaya', 'Tambun', 'Tridaya Sakti'] },
        ],
      },
      {
        name: 'Kota Bogor',
        districts: [
          { name: 'Bogor Tengah', postalCode: '16121', villages: ['Babakan', 'Babakan Pasar', 'Cibogor', 'Ciwaringin', 'Gudang', 'Kebon Kelapa', 'Pabaton', 'Paledang', 'Panaragan', 'Sempur', 'Tegallega'] },
          { name: 'Bogor Timur', postalCode: '16142', villages: ['Baranangsiang', 'Katulampa', 'Sindangrasa', 'Sindangbarang', 'Sukasari', 'Tajur'] },
          { name: 'Bogor Selatan', postalCode: '16131', villages: ['Batutulis', 'Bojongkerta', 'Bondongan', 'Cikaret', 'Cipaku', 'Empang', 'Genteng', 'Harjasari', 'Kertamaya', 'Lawanggintung', 'Muarasari', 'Mulyaharja', 'Pakuan', 'Pamoyanan', 'Rancamaya', 'Ranggamekar'] },
        ],
      },
      {
        name: 'Kabupaten Bogor',
        districts: [
          { name: 'Cibinong', postalCode: '16911', villages: ['Cibinong', 'Cirimekar', 'Ciriung', 'Harapan Jaya', 'Karadenan', 'Nanggewer', 'Nanggewer Mekar', 'Pabuaran', 'Pabuaran Mekar', 'Pakansari', 'Pondok Rajeg', 'Sukahati', 'Tengah'] },
          { name: 'Babakan Madang', postalCode: '16810', villages: ['Babakan Madang', 'Bojong Koneng', 'Cadas Ngampar', 'Cibanon', 'Cijayanti', 'Cipambuan', 'Kadumangu', 'Karang Tengah', 'Sentul', 'Sumur Batu'] },
        ],
      },
      {
        name: 'Kota Depok',
        districts: [
          { name: 'Pancoran Mas', postalCode: '16436', villages: ['Depok', 'Depok Jaya', 'Mampang', 'Pancoran Mas', 'Rangkapan Jaya', 'Rangkapan Jaya Baru'] },
          { name: 'Cinere', postalCode: '16514', villages: ['Cinere', 'Gandul', 'Pangkalan Jati', 'Pangkalan Jati Baru'] },
          { name: 'Beji', postalCode: '16421', villages: ['Beji', 'Beji Timur', 'Kemiri Muka', 'Kukusan', 'Pondok Cina', 'Tanah Baru'] },
          { name: 'Sukmajaya', postalCode: '16412', villages: ['Abadijaya', 'Bakti Jaya', 'Cisalak', 'Mekar Jaya', 'Sukmajaya', 'Tirtajaya'] },
        ],
      },
      {
        name: 'Kota Cimahi',
        districts: [
          { name: 'Cimahi Utara', postalCode: '40511', villages: ['Cibabat', 'Cipageran', 'Citeureup', 'Pasirkaliki'] },
          { name: 'Cimahi Tengah', postalCode: '40521', villages: ['Baros', 'Cigugur Tengah', 'Cimahi', 'Karangmekar', 'Padasuka', 'Setiamanah'] },
        ],
      },
      {
        name: 'Kabupaten Bandung',
        districts: [
          { name: 'Soreang', postalCode: '40911', villages: ['Cingcin', 'Karamatmulya', 'Panyirapan', 'Parungserab', 'Sadu', 'Sekarwangi', 'Soreang', 'Sukajadi'] },
          { name: 'Baleendah', postalCode: '40375', villages: ['Andir', 'Baleendah', 'Bojongsari', 'Jelegong', 'Malakasari', 'Manggahang', 'Rancamanyar', 'Wargamekar'] },
        ],
      },
      {
        name: 'Kabupaten Bandung Barat',
        districts: [
          { name: 'Padalarang', postalCode: '40553', villages: ['Ciburuy', 'Cimerang', 'Cipeundeuy', 'Jayamekar', 'Kertajaya', 'Kertamulya', 'Laksanamekar', 'Padalarang', 'Tagogapu'] },
          { name: 'Lembang', postalCode: '40391', villages: ['Cibogo', 'Cikahuripan', 'Cikidang', 'Cikole', 'Gudangkahuripan', 'Jayagiri', 'Kayuambon', 'Lembang', 'Pagerwangi', 'Sukajaya', 'Suntenjaya', 'Wangunharja', 'Wangunsari'] },
        ],
      },
      {
        name: 'Kota Cirebon',
        districts: [
          { name: 'Kejaksan', postalCode: '45121', villages: ['Kebonbaru', 'Kejaksan', 'Kesenden', 'Sukapura'] },
          { name: 'Kesambi', postalCode: '45131', villages: ['Drajat', 'Karyamulya', 'Kesambi', 'Pekiringan', 'Sunyaragi'] },
        ],
      },
      {
        name: 'Kota Sukabumi',
        districts: [
          { name: 'Cikole', postalCode: '43111', villages: ['Cikole', 'Cisarua', 'Gunungparang', 'Kebonjati', 'Selabatu', 'Subangjaya'] },
        ],
      },
      {
        name: 'Kota Tasikmalaya',
        districts: [
          { name: 'Cihideung', postalCode: '46121', villages: ['Argasari', 'Cilembang', 'Nagarawangi', 'Tugujaya', 'Tuguraja', 'Yudanagara'] },
        ],
      },
      {
        name: 'Kota Banjar',
        districts: [
          { name: 'Banjar', postalCode: '46311', villages: ['Balokang', 'Banjar', 'Jatitujuh', 'Mekarsari', 'Situbatu'] },
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
      {
        name: 'Kota Magelang',
        districts: [
          { name: 'Magelang Tengah', postalCode: '56111', villages: ['Cacaban', 'Gelangan', 'Magelang', 'Panjatan', 'Rejowinangun Utara'] },
        ],
      },
      {
        name: 'Kota Pekalongan',
        districts: [
          { name: 'Pekalongan Barat', postalCode: '51111', villages: ['Bendan', 'Kergon', 'Medono', 'Pasirkratonkramat', 'Pringrejo', 'Sapuro Kebulen', 'Tirto'] },
        ],
      },
      {
        name: 'Kota Tegal',
        districts: [
          { name: 'Tegal Barat', postalCode: '52111', villages: ['Kraton', 'Kemandungan', 'Muarareja', 'Pekauman', 'Pesurungan Kidul', 'Tegalsari'] },
        ],
      },
      {
        name: 'Kota Salatiga',
        districts: [
          { name: 'Sidorejo', postalCode: '50711', villages: ['Blotongan', 'Bugel', 'Kauman Kidul', 'Pulutan', 'Salatiga', 'Sidorejo Lor'] },
        ],
      },
      {
        name: 'Kabupaten Banyumas (Purwokerto)',
        districts: [
          { name: 'Purwokerto Timur', postalCode: '53111', villages: ['Arcawinangun', 'Kranji', 'Mersi', 'Purwokerto Lor', 'Purwokerto Wetan', 'Sokanegara'] },
        ],
      },
      {
        name: 'Kabupaten Kudus',
        districts: [
          { name: 'Kota Kudus', postalCode: '59311', villages: ['Barongan', 'Burikan', 'Demaan', 'Demangan', 'Glantengan', 'Janggalan', 'Kajeksan', 'Kerjasan', 'Kragan', 'Mlati Kidul', 'Mlati Lor', 'Mlati Norowito', 'Nganguk', 'Panjunan', 'Purwosari', 'Rendeng', 'Singocandi', 'Wergu Kulon', 'Wergu Wetan'] },
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
          { name: 'Kraton', postalCode: '55131', villages: ['Kadipaten', 'Panembahan', 'Patehan'] },
          { name: 'Umbulharjo', postalCode: '55161', villages: ['Giwangan', 'Mujamuju', 'Pandeyan', 'Semaki', 'Sorosutan', 'Tahunan', 'Warungboto'] },
        ],
      },
      {
        name: 'Kabupaten Sleman',
        districts: [
          { name: 'Depok', postalCode: '55281', villages: ['Caturtunggal', 'Condongcatur', 'Maguwoharjo'] },
          { name: 'Mlati', postalCode: '55284', villages: ['Sinduadi', 'Sendangadi', 'Tirtoadi', 'Sumberadi', 'Cebongan'] },
          { name: 'Ngaglik', postalCode: '55581', villages: ['Donoharjo', 'Minomartani', 'Sardonoharjo', 'Sariharjo', 'Sinduharjo', 'Sukoharjo'] },
        ],
      },
      {
        name: 'Kabupaten Bantul',
        districts: [
          { name: 'Bantul', postalCode: '55711', villages: ['Bantul', 'Palbapang', 'Ringinharjo', 'Sabdodadi', 'Trirenggo'] },
          { name: 'Sewon', postalCode: '55187', villages: ['Bangunharjo', 'Panggungharjo', 'Pendowoharjo', 'Timbulharjo'] },
        ],
      },
      {
        name: 'Kabupaten Kulon Progo',
        districts: [
          { name: 'Wates', postalCode: '55611', villages: ['Bendungan', 'Giripeni', 'Karangwuni', 'Kulwaru', 'Ngestiharjo', 'Sogan', 'Triharjo', 'Wates'] },
        ],
      },
      {
        name: 'Kabupaten Gunungkidul',
        districts: [
          { name: 'Wonosari', postalCode: '55811', villages: ['Baleharjo', 'Duwet', 'Gari', 'Karangtengah', 'Kepek', 'Mulo', 'Piyaman', 'Pulutan', 'Selang', 'Siraman', 'Wareng', 'Wonosari', 'Wunung'] },
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
          { name: 'Rungkut', postalCode: '60293', villages: ['Kali Rungkut', 'Kedung Baruk', 'Medokan Ayu', 'Penjaringansari', 'Rungkut Kidul', 'Wonorejo'] },
        ],
      },
      {
        name: 'Kota Malang',
        districts: [
          { name: 'Klojen', postalCode: '65111', villages: ['Bareng', 'Gadingasri', 'Kasir', 'Kauman', 'Kiduldalem', 'Klojen', 'Oro-oro Dowo', 'Penanggungan', 'Rampal Celaket', 'Samaan', 'Sukoharjo'] },
          { name: 'Lowokwaru', postalCode: '65141', villages: ['Dinoyo', 'Jatimulyo', 'Ketawanggede', 'Lowokwaru', 'Merjosari', 'Mojolangu', 'Sumbersari', 'Tasikmadu', 'Tlogomas', 'Tulusrejo', 'Tunggulwulung'] },
        ],
      },
      {
        name: 'Kabupaten Sidoarjo',
        districts: [
          { name: 'Sidoarjo', postalCode: '61211', villages: ['Buluhsidokare', 'Celep', 'Cemengbakalan', 'Cemengkalang', 'Gebyok', 'Lemahputro', 'Magersari', 'Pekauman', 'Pucang', 'Pucanganom', 'Sekardangan', 'Sidokare', 'Sidoklumpuk', 'Sidokumpul', 'Urangagung'] },
          { name: 'Waru', postalCode: '61256', villages: ['Berbek', 'Bungurasih', 'Janti', 'Kedungrejo', 'Kepuhkiriman', 'Kureksari', 'Medaeng', 'Ngingas', 'Pepelegi', 'Tambak Oso', 'Tambak Rejo', 'Tambak Sawah', 'Tambak Sumur', 'Tropodo', 'Wadungasri', 'Waru'] },
        ],
      },
      {
        name: 'Kota Batu',
        districts: [
          { name: 'Batu', postalCode: '65311', villages: ['Ngaglik', 'Oro-oro Ombo', 'Pesanggrahan', 'Sidomulyo', 'Sisir', 'Songgokerto', 'Sumberejo', 'Temas'] },
        ],
      },
      {
        name: 'Kota Kediri',
        districts: [
          { name: 'Kota', postalCode: '64121', villages: ['Balowerti', 'Banjaran', 'Jamsaren', 'Kampung Dalem', 'Kemasan', 'Manisrenggo', 'Ngadirejo', 'Pakelan', 'Pandean', 'Pocanan', 'Rejomulyo', 'Ringinanom', 'Semampir', 'Setono Gedong', 'Setono Pande'] },
        ],
      },
      {
        name: 'Kota Madiun',
        districts: [
          { name: 'Kartoharjo', postalCode: '63111', villages: ['Kanigoro', 'Kartoharjo', 'Klegen', 'Oro-Oro Ombo', 'Pilangkenceng', 'Rejomulyo', 'Sukosari', 'Tawangrejo'] },
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
          { name: 'Syiah Kuala', postalCode: '23111', villages: ['Alue Naga', 'Deah Raya', 'Ie Masen Kaye Adang', 'Jeulingke', 'Kopelma Darussalam', 'Lambaro Skep', 'Lamgugob', 'Peurada', 'Pineung', 'Tibang'] },
        ],
      },
      {
        name: 'Kota Sabang',
        districts: [
          { name: 'Sukakarya', postalCode: '23511', villages: ['Aneuk Laot', 'Krueng Raya', 'Kuta Ateuh', 'Kuta Barat', 'Kuta Timu'] },
        ],
      },
      {
        name: 'Kota Lhokseumawe',
        districts: [
          { name: 'Banda Sakti', postalCode: '24311', villages: ['Hagu Barat Laut', 'Hagu Selatan', 'Hagu Teungoh', 'Java', 'Keude Aceh', 'Kuta Blang', 'Lancang Garam', 'Mon Geudong', 'Pusong Baru', 'Pusong Lhok', 'Simpang Empat', 'Tumpok Teungoh', 'Ujong Blang'] },
        ],
      },
      {
        name: 'Kota Langsa',
        districts: [
          { name: 'Langsa Kota', postalCode: '24411', villages: ['Alue Beurawe', 'Alue Dua', 'Blang', 'Blang Seunibong', 'Daulat', 'Gampong Jawa', 'Gampong Teungoh', 'Meutia', 'Paya Bujok Blang Pase', 'Peukan Langsa', 'Tualang Teungoh'] },
        ],
      },
      {
        name: 'Kabupaten Aceh Besar',
        districts: [
          { name: 'Darul Imarah', postalCode: '23352', villages: ['Bayu', 'Denong', 'Garot', 'Gue Gajah', 'Kandang', 'Lam Bheu', 'Lam Cot', 'Lam Kawee', 'Lampeuneurut Gampong', 'Lampeuneurut Ujong Blang', 'Lamsiteh', 'Leu', 'Pasi Beutong', 'Punang', 'Ulee Lueng'] },
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
          { name: 'Medan Selayang', postalCode: '20131', villages: ['Asam Kumbang', 'Beringin', 'Padang Bulan Selayang I', 'Padang Bulan Selayang II', 'Sempakata', 'Tanjung Sari'] },
        ],
      },
      {
        name: 'Kota Pematangsiantar',
        districts: [
          { name: 'Siantar Barat', postalCode: '21111', villages: ['Bantan', 'Banjar', 'Dwikora', 'Proklamasi', 'Simarito', 'Sipinggol-pinggol', 'Teladan', 'Timbang Galung'] },
        ],
      },
      {
        name: 'Kota Binjai',
        districts: [
          { name: 'Binjai Kota', postalCode: '20711', villages: ['Berngam', 'Binjai', 'Kartini', 'Pekan Binjai', 'Satria', 'Setia', 'Tangsi'] },
        ],
      },
      {
        name: 'Kabupaten Deli Serdang',
        districts: [
          { name: 'Lubuk Pakam', postalCode: '20511', villages: ['Cempa', 'Lubuk Pakam I-II', 'Lubuk Pakam III', 'Lubuk Pakam Pekan', 'Paluh Kemiri', 'Petapahan', 'Sekip', 'Syahmad', 'Tanjung Garbus I'] },
        ],
      },
      {
        name: 'Kabupaten Karo',
        districts: [
          { name: 'Kabanjahe', postalCode: '22111', villages: ['Gung Leto', 'Gung Negeri', 'Kaban', 'Kabanjahe', 'Ketaren', 'Lau Cimba', 'Padang Mas', 'Pekan Kabanjahe', 'Samura', 'Sumber Mufakat'] },
        ],
      },
    ],
  },

  // 9. SUMATERA BARAT (Lengkap Seluruh Kota & Kabupaten)
  {
    id: 'sumatera-barat',
    name: 'Sumatera Barat',
    cities: [
      {
        name: 'Kota Padang',
        districts: [
          { name: 'Padang Barat', postalCode: '25111', villages: ['Belakang Tangsi', 'Berok Nipah', 'Flamboyan Baru', 'Kampung Jao', 'Kampung Pondok', 'Olo', 'Padang Pasir', 'Purus', 'Rimbo Kaluang', 'Ujung Gurun'] },
          { name: 'Padang Timur', postalCode: '25121', villages: ['Andalas', 'Ganting Parak Gadang', 'Jati', 'Jati Baru', 'Kubu Marapalam', 'Kubu Parak Karakah', 'Marapalam', 'Parak Gadang Timur', 'Sawahan', 'Sawahan Timur', 'Simpang Haru'] },
          { name: 'Padang Utara', postalCode: '25131', villages: ['Air Tawar Barat', 'Air Tawar Timur', 'Alai Parak Kopi', 'Gunung Pangilun', 'Lolong Belanti', 'Ulak Karang Selatan', 'Ulak Karang Utara'] },
          { name: 'Padang Selatan', postalCode: '25141', villages: ['Air Manis', 'Alang Laweh', 'Batang Arau', 'Belakang Pondok', 'Bukit Gado-Gado', 'Mata Air', 'Pasa Gadang', 'Ranah Parak Rumbio', 'Rawang', 'Seberang Padang', 'Seberang Palinggam', 'Teluk Bayur'] },
          { name: 'Koto Tangah', postalCode: '25171', villages: ['Air Pacah', 'Balai Gadang', 'Batang Kabung Ganting', 'Bungo Pasang', 'Dadok Tunggul Hitam', 'Koto Panjang Ikur Koto', 'Koto Pulai', 'Lubuk Buaya', 'Lubuk Minturun', 'Padang Sarai', 'Pasir Nan Tigo'] },
          { name: 'Kuranji', postalCode: '25151', villages: ['Ampang', 'Anduring', 'Gunung Sarik', 'Kalumbuk', 'Korong Gadang', 'Kuranji', 'Lubuk Lintah', 'Pasar Ambacang', 'Sungai Sapih'] },
        ],
      },
      {
        name: 'Kota Bukittinggi',
        districts: [
          { name: 'Guguk Panjang', postalCode: '26111', villages: ['Benteng Pasar Atas', 'Bukit Cangang Kayu Ramang', 'Kayu Kubu', 'Pakansari', 'Tarok Dipo'] },
          { name: 'Mandiangin Koto Selayan', postalCode: '26121', villages: ['Campago Guguk Bulek', 'Campago Ipuh', 'Koto Selayan', 'Kubu Gulai Bancah', 'Mandiangin', 'Pulai Anak Air'] },
          { name: 'Aur Birugo Tigo Baleh', postalCode: '26131', villages: ['Aur Kuning', 'Belakang Balok', 'Birugo', 'Kubu Tanjung', 'Ladang Cakiah', 'Pakan Labuah', 'Parit Antang', 'Sapiran'] },
        ],
      },
      {
        name: 'Kota Payakumbuh',
        districts: [
          { name: 'Payakumbuh Barat', postalCode: '26211', villages: ['Bulakan Balai Kandi', 'Dayan', 'Ibuh', 'Kubu Gadang', 'Labuh Baru', 'Napar', 'Padang Datar Tanah Mati', 'Pakan Sinayan', 'Parit Rantang', 'Payolansek', 'Subarang Batuang', 'Talang', 'Tanah Situruk'] },
          { name: 'Payakumbuh Utara', postalCode: '26221', villages: ['Balai Baru', 'Balai Kaliki', 'Balai Tongah Koto', 'Koto Baru Balai Janggo', 'Koto Panjang Dalam', 'Koto Panjang Padang', 'Muaro', 'Ompang Tanah Sirah', 'Taratak Padang Kampuang'] },
          { name: 'Payakumbuh Timur', postalCode: '26231', villages: ['Balai Jaring', 'Padang Alai Bodi', 'Padang Tangah Payobadar', 'Padang Tiakar', 'Pueh Rambatan', 'Tiakar'] },
          { name: 'Payakumbuh Selatan', postalCode: '26241', villages: ['Balai Panjang', 'Kapalo Koto Ampangan', 'Koto Tua', 'Limbukan', 'Padang Karambia', 'Sawahpadang Aur Kuning'] },
          { name: 'Lamposi Tigo Nagori', postalCode: '26251', villages: ['Koto Panjang', 'Padang Sikabu', 'Parambahan', 'Parik Muko Aie', 'Sungai Durian'] },
        ],
      },
      {
        name: 'Kota Pariaman',
        districts: [
          { name: 'Pariaman Tengah', postalCode: '25511', villages: ['Alai Gelombang', 'Cimparambang', 'Jawi-Jawi I', 'Jawi-Jawi II', 'Kampung Baru', 'Kampung Jawa I', 'Kampung Jawa II', 'Kampung Perak', 'Kampung Pondok', 'Karan Aur', 'Lohan', 'Pasir', 'Pondok II', 'Rawang', 'Tarattak'] },
          { name: 'Pariaman Utara', postalCode: '25521', villages: ['Ampalu', 'Apar', 'Balai Naras', 'Cubadak Mentawai', 'Manggung', 'Naras I', 'Naras Hilir', 'Padang Birik-Birik', 'Sikapak Barat', 'Sikapak Timur', 'Sungai Rambai', 'Tanjung Sabar'] },
          { name: 'Pariaman Selatan', postalCode: '25531', villages: ['Balai Kurai Taji', 'Batang Kabung', 'Kampung Apar', 'Marunggi', 'Padang Cakur', 'Pauh Barat', 'Pauh Timur', 'Punggung Lading', 'Rambai', 'Simpang Koto Baringin', 'Sungai Kasai', 'Taluk'] },
          { name: 'Pariaman Timur', postalCode: '25541', villages: ['Air Santok', 'Batang Tajongkek', 'Batu Gadang', 'Bungotanjung', 'Campago', 'Koto Marapak', 'Koto Kaciak', 'Pakasai', 'Sungai Pasak', 'Sungai Sirah', 'Talago Sariak'] },
        ],
      },
      {
        name: 'Kota Solok',
        districts: [
          { name: 'Lubuk Sikarah', postalCode: '27311', villages: ['Aromako', 'IX Korong', 'Kampaung Jawa', 'Koto Panjang', 'Simpang Rumbio', 'Sinapa Piliang', 'Tanah Garam'] },
          { name: 'Tanjung Harapan', postalCode: '27321', villages: ['Kampung Barat', 'Koto Hilalang', 'Laing', 'Nan Balimo', 'Pasar Pandan Air Mati', 'Tanjung Paku'] },
        ],
      },
      {
        name: 'Kota Sawahlunto',
        districts: [
          { name: 'Lembah Segar', postalCode: '27411', villages: ['Air Dingin', 'Aur Mulyo', 'Kubang Tangah', 'Pasar', 'Saringan', 'Tanah Lapang'] },
          { name: 'Barangin', postalCode: '27421', villages: ['Kolok Mudik', 'Kolok Nan Tuo', 'Lumindai', 'Santur', 'Sitalang', 'Talago Gunung'] },
          { name: 'Silungkang', postalCode: '27431', villages: ['Muaro Kalaban', 'Silungkang Duo', 'Silungkang Oso', 'Silungkang Tigo', 'Taratak Bonjo'] },
          { name: 'Talawi', postalCode: '27441', villages: ['Batu Tanjung', 'Kandih', 'Kumbayau', 'Rantih', 'Salak', 'Sijantang Koto', 'Talawi Hilie', 'Talawi Mudik'] },
        ],
      },
      {
        name: 'Kota Padang Panjang',
        districts: [
          { name: 'Padang Panjang Barat', postalCode: '27111', villages: ['Balai-Balai', 'Bukit Surungan', 'Kampung Manggis', 'Pasar Baru', 'Pasar Usang', 'Silaing Atas', 'Silaing Bawah', 'Tanah Hitam'] },
          { name: 'Padang Panjang Timur', postalCode: '27121', villages: ['Ekor Lubuk', 'Ganting', 'Guguk Malintang', 'Koto Katik', 'Koto Panjang', 'Ngalau', 'Sigando', 'Tanah Pak Lambik'] },
        ],
      },
      {
        name: 'Kabupaten Agam',
        districts: [
          { name: 'Lubuk Basung', postalCode: '26411', villages: ['Kampung Pinang', 'Kampung Tangah', 'Lubuk Basung', 'Manggopoh', 'Sungai Jariang'] },
          { name: 'Banuhampu', postalCode: '26181', villages: ['Cingkariang', 'Kubang Putiah', 'Ladang Laweh', 'Padang Lua', 'Pakan Sinayan', 'Sungai Tanang', 'Taluak IV Suku'] },
          { name: 'IV Koto', postalCode: '26182', villages: ['Balingka', 'Guguak Tabek Sarojo', 'Koto Gadang', 'Koto Panjang', 'Koto Tuo', 'Sianok Anam Suku', 'Sungai Landia'] },
          { name: 'Tilatang Kamang', postalCode: '26152', villages: ['Gadut', 'Kapau', 'Koto Tangah'] },
          { name: 'Tanjung Raya (Maninjau)', postalCode: '26471', villages: ['Bayur', 'Duo Koto', 'Koto Gadang', 'Koto Kaciak', 'Koto Malintang', 'Maninjau', 'Sungai Batang', 'Tanjung Sani'] },
        ],
      },
      {
        name: 'Kabupaten Lima Puluh Kota',
        districts: [
          { name: 'Harau', postalCode: '26271', villages: ['Batu Balang', 'Bukik Limbuku', 'Gurukan', 'Harau', 'Koto Tuo', 'Lubuk Batingkok', 'Pilubang', 'Sarilamak', 'Solok Bio Bio', 'Taram', 'Tarantang'] },
          { name: 'Payakumbuh', postalCode: '26251', villages: ['Koto Baru Simalanggang', 'Koto Tangah', 'Piobang', 'Simalanggang', 'Sungai Beringin', 'Taeh Baruah', 'Taeh Bukik'] },
          { name: 'Luak', postalCode: '26261', villages: ['Andaleh', 'Mungka', 'Sikabu-kabu', 'Sungai Kamuyang', 'Tanjung Haro'] },
        ],
      },
      {
        name: 'Kabupaten Padang Pariaman',
        districts: [
          { name: 'Nan Sabaris', postalCode: '25571', villages: ['Kapalo Koto', 'Kuraitaji', 'Padang Bintungan', 'Pauh Kambar', 'Sunur'] },
          { name: 'Batang Anai', postalCode: '25586', villages: ['Buayan Lubuk Alung', 'Katapiang', 'Kasang', 'Sungai Buluh', 'Sungai Buluh Barat', 'Sungai Buluh Selatan', 'Sungai Buluh Timur'] },
          { name: 'Lubuk Alung', postalCode: '25584', villages: ['Aie Tajun', 'Lubuk Alung', 'Pasie Laweh', 'Pungguang Kasiak', 'Salibutan', 'Sikabu', 'Singguling', 'Sungai Abang'] },
          { name: '2x11 Enam Lingkung', postalCode: '25583', villages: ['Lubuk Pandan', 'Pakandangan', 'Parit Malintang', 'Sicincin', 'Toboh Gadang'] },
        ],
      },
      {
        name: 'Kabupaten Pesisir Selatan',
        districts: [
          { name: 'IV Jurai (Painan)', postalCode: '25611', villages: ['Bungo Pasang Salido', 'Lumpo', 'Painan', 'Painan Selatan', 'Painan Timur', 'Salido', 'Sago Salido'] },
          { name: 'Batang Kapas', postalCode: '25661', villages: ['IV Koto Mudiek', 'Koto Nan Duo', 'Koto Nan Tigo IV Koto Hilie', 'Taluak Tigo Sakato'] },
          { name: 'Lengayang', postalCode: '25663', villages: ['Kambang', 'Kambang Barat', 'Kambang Timur', 'Lakitan', 'Lakitan Selatan', 'Lakitan Tengah', 'Lakitan Timur', 'Lakitan Utara'] },
        ],
      },
      {
        name: 'Kabupaten Tanah Datar',
        districts: [
          { name: 'Lima Kaum (Batusangkar)', postalCode: '27211', villages: ['Baringin', 'Cubadak', 'Labuh', 'Limo Kaum', 'Parambahan'] },
          { name: 'Sungayang', postalCode: '27292', villages: ['Andaleh Baruh Bukik', 'Minangkabau', 'Sungai Patai', 'Sungayang', 'Tanjung'] },
          { name: 'Pariangan', postalCode: '27264', villages: ['Batu Basa', 'Pariangan', 'Sawah Tangah', 'Simabur', 'Tabek'] },
        ],
      },
      {
        name: 'Kabupaten Pasaman',
        districts: [
          { name: 'Lubuk Sikaping', postalCode: '26311', villages: ['Aia Manggih', 'Durian Tinggi', 'Gagang Barat', 'Jambak', 'Pauh', 'Sundata', 'Tanjung Baringin'] },
          { name: 'Bonjol', postalCode: '26381', villages: ['Ganggo Hilia', 'Ganggo Mudiak', 'Koto Kaciak', 'Limo Koto'] },
        ],
      },
      {
        name: 'Kabupaten Pasaman Barat',
        districts: [
          { name: 'Pasaman (Simpang Empat)', postalCode: '26566', villages: ['Aia Gadang', 'Aua Kuniang', 'Lingkuang Aua', 'Sukamenanti'] },
          { name: 'Kinali', postalCode: '26567', villages: ['Kinali', 'Koto Baru', 'Mandiangin'] },
        ],
      },
      {
        name: 'Kabupaten Solok',
        districts: [
          { name: 'Gunung Talang (Arosuka)', postalCode: '27365', villages: ['Aie Batumbuak', 'Batang Barus', 'Cupak', 'Jawi-Jawi', 'Koto Gaek Guguak', 'Koto Gadang Guguak', 'Sungai Janiah', 'Talang'] },
          { name: 'Kubung', postalCode: '27361', villages: ['Gauang', 'Koto Baru', 'Koto Hilalang', 'Panyakalan', 'Saok Laweh', 'Selayo', 'Tanjung Bingkung'] },
        ],
      },
      {
        name: 'Kabupaten Solok Selatan',
        districts: [
          { name: 'Sangir (Padang Aro)', postalCode: '27778', villages: ['Lubuk Gadang', 'Lubuk Gadang Barat', 'Lubuk Gadang Selatan', 'Lubuk Gadang Timur'] },
          { name: 'Sungai Pagu (Muara Labuh)', postalCode: '27776', villages: ['Koto Baru', 'Pasar Muara Labuh', 'Pasir Talang', 'Pasir Talang Barat', 'Pasir Talang Selatan', 'Pasir Talang Timur', 'Sako Pasir Talang'] },
        ],
      },
      {
        name: 'Kabupaten Dharmasraya',
        districts: [
          { name: 'Pulau Punjung', postalCode: '27611', villages: ['Empat Koto Pulau Punjung', 'Gunung Selasih', 'Sikabau', 'Sungai Dareh', 'Sungai Kambut', 'Tebing Tinggi'] },
          { name: 'Koto Baru', postalCode: '27681', villages: ['Ampang Kuranji', 'Koto Baru', 'Koto Padang', 'Sialang Gaung'] },
        ],
      },
      {
        name: 'Kabupaten Sijunjung',
        districts: [
          { name: 'Sijunjung', postalCode: '27511', villages: ['Aie Angek', 'Durian Gadang', 'Kandang Baru', 'Muaro', 'Paru', 'Pematang Panjang', 'Sijunjung', 'Silokek'] },
          { name: 'Kamang Baru', postalCode: '27572', villages: ['Aie Amo', 'Kamang', 'Koto Baru', 'Kunangan Parit Rantang', 'Lubuk Tarantang', 'Maloro', 'Muaro Takuak', 'Padang Tarok', 'Siaur', 'Sungai Lansek', 'Tanjung Kaliang'] },
        ],
      },
      {
        name: 'Kabupaten Kepulauan Mentawai',
        districts: [
          { name: 'Sipora Utara (Tuapejat)', postalCode: '25392', villages: ['Betumonga', 'Goisooinan', 'Sido Makmur', 'Sipora Jaya', 'Tuapejat', 'Walet Simalegi'] },
          { name: 'Siberut Selatan (Muara Siberut)', postalCode: '25393', villages: ['Madobag', 'Matotonan', 'Muntei', 'Muara Siberut', 'Rokdok'] },
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
          { name: 'Pekanbaru Kota', postalCode: '28111', villages: ['Kota Baru', 'Kota Tinggi', 'Sukaramai', 'Sumahilang', 'Tanah Datar', 'Simpang Empat'] },
          { name: 'Marpoyan Damai', postalCode: '28282', villages: ['Maharatu', 'Perhentian Marpoyan', 'Sidomulyo Timur', 'Tangkerang Barat', 'Tangkerang Tengah', 'Wonorejo'] },
          { name: 'Tampan / Tuah Madani', postalCode: '28291', villages: ['Delima', 'Sidomulyo Barat', 'Simpang Baru', 'Tobek Godang', 'Tuah Karya', 'Tuah Madani'] },
        ],
      },
      {
        name: 'Kota Dumai',
        districts: [
          { name: 'Dumai Kota', postalCode: '28811', villages: ['Bintan', 'Dumai Kota', 'Laksamana', 'Rimba Sekampung', 'Sukajadi'] },
        ],
      },
      {
        name: 'Kabupaten Kampar (Bangkinang)',
        districts: [
          { name: 'Bangkinang Kota', postalCode: '28411', villages: ['Bangkinang', 'Kumantan', 'Langgin', 'Pasir Sialang', 'Ridan Permai'] },
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
          { name: 'Lubuk Baja (Nagoya)', postalCode: '29444', villages: ['Baloi Indah', 'Batu Selicin', 'Kampung Pelita', 'Lubuk Baja Kota', 'Tanjung Uma'] },
        ],
      },
      {
        name: 'Kota Tanjungpinang',
        districts: [
          { name: 'Tanjungpinang Kota', postalCode: '29111', villages: ['Kampung Bugis', 'Penyengat', 'Senggarang', 'Tanjungpinang Kota'] },
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
          { name: 'Pasar Jambi', postalCode: '36111', villages: ['Beringin', 'Market', 'Orang Kayo Hitam', 'Sungai Asam'] },
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
          { name: 'Ilir Timur I', postalCode: '30121', villages: ['13 Ilir', '14 Ilir', '15 Ilir', '16 Ilir', '17 Ilir', '18 Ilir', '20 Ilir D-I', 'Kepandean', 'Sungai Pangeran'] },
          { name: 'Ilir Barat I', postalCode: '30139', villages: ['26 Ilir D-I', 'Bukit Lama', 'Bukit Baru', 'Demang Lebar Daun', 'Lorok Pakjo', 'Siring Agung'] },
        ],
      },
    ],
  },

  // 14. BENGKULU
  {
    id: 'bengkulu',
    name: 'Bengkulu',
    cities: [
      {
        name: 'Kota Bengkulu',
        districts: [
          { name: 'Ratu Samban', postalCode: '38221', villages: ['Anggut Atas', 'Anggut Bawah', 'Anggut Dalam', 'Belakang Pondok', 'Kebun Dahri', 'Kebun Geran', 'Padang Jati', 'Pengantungan', 'Penurunan'] },
        ],
      },
    ],
  },

  // 15. LAMPUNG
  {
    id: 'lampung',
    name: 'Lampung',
    cities: [
      {
        name: 'Kota Bandar Lampung',
        districts: [
          { name: 'Tanjung Karang Pusat', postalCode: '35111', villages: ['Durian Payung', 'Gotong Royong', 'Kaliawi', 'Kaliawi Persada', 'Kelapa Tiga', 'Palapa', 'Pasir Gintung'] },
        ],
      },
    ],
  },

  // 16. KEPULAUAN BANGKA BELITUNG
  {
    id: 'bangka-belitung',
    name: 'Kepulauan Bangka Belitung',
    cities: [
      {
        name: 'Kota Pangkalpinang',
        districts: [
          { name: 'Taman Sari', postalCode: '33121', villages: ['Batin Tikal', 'Gedung Nasional', 'Kejaksaan', 'Opas Indah', 'Rawa Bangun'] },
        ],
      },
    ],
  },

  // 17. KALIMANTAN BARAT
  {
    id: 'kalimantan-barat',
    name: 'Kalimantan Barat',
    cities: [
      {
        name: 'Kota Pontianak',
        districts: [
          { name: 'Pontianak Kota', postalCode: '78111', villages: ['Darat Sekip', 'Mariana', 'St. Antonius', 'St. Ignatius', 'Tengah'] },
        ],
      },
    ],
  },

  // 18. KALIMANTAN TENGAH
  {
    id: 'kalimantan-tengah',
    name: 'Kalimantan Tengah',
    cities: [
      {
        name: 'Kota Palangka Raya',
        districts: [
          { name: 'Pahandut', postalCode: '73111', villages: ['Langhai', 'Pahandut', 'Pahandut Seberang', 'Panarung', 'Tanjung Pinang', 'Tumbang Rungan'] },
        ],
      },
    ],
  },

  // 19. KALIMANTAN SELATAN
  {
    id: 'kalimantan-selatan',
    name: 'Kalimantan Selatan',
    cities: [
      {
        name: 'Kota Banjarmasin',
        districts: [
          { name: 'Banjarmasin Tengah', postalCode: '70111', villages: ['Antasan Besar', 'Gadang', 'Kertak Baru Ilir', 'Kertak Baru Ulu', 'Mawar', 'Melayu', 'Pasar Lama', 'Pekapuran Laut', 'Seberang Mesjid', 'Sungai Baru', 'Teluk Dalam'] },
        ],
      },
      {
        name: 'Kota Banjarbaru',
        districts: [
          { name: 'Banjarbaru Utara', postalCode: '70711', villages: ['Komet', 'Loktabat Utara', 'Mentaos', 'Sungai Ulin'] },
        ],
      },
    ],
  },

  // 20. KALIMANTAN TIMUR
  {
    id: 'kalimantan-timur',
    name: 'Kalimantan Timur',
    cities: [
      {
        name: 'Kota Samarinda',
        districts: [
          { name: 'Samarinda Kota', postalCode: '75111', villages: ['Bugis', 'Karang Mumus', 'Pelabuhan', 'Pasar Pagi', 'Sungai Pinang Luar'] },
        ],
      },
      {
        name: 'Kota Balikpapan',
        districts: [
          { name: 'Balikpapan Kota', postalCode: '76111', villages: ['Damai', 'Klandasan Ilir', 'Klandasan Ulu', 'Prapatan', 'Telaga Sari'] },
        ],
      },
    ],
  },

  // 21. KALIMANTAN UTARA
  {
    id: 'kalimantan-utara',
    name: 'Kalimantan Utara',
    cities: [
      {
        name: 'Kota Tarakan',
        districts: [
          { name: 'Tarakan Tengah', postalCode: '77111', villages: ['Kampung 1 Skip', 'Pamusian', 'Sebengkok', 'Selumit', 'Selumit Pantai'] },
        ],
      },
      {
        name: 'Kabupaten Bulungan (Tanjung Selor)',
        districts: [
          { name: 'Tanjung Selor', postalCode: '77211', villages: ['Jelarai Selor', 'Tanjung Selor Hilir', 'Tanjung Selor Hulu', 'Tanjung Selor Timur'] },
        ],
      },
    ],
  },

  // 22. SULAWESI UTARA
  {
    id: 'sulawesi-utara',
    name: 'Sulawesi Utara',
    cities: [
      {
        name: 'Kota Manado',
        districts: [
          { name: 'Wenang', postalCode: '95111', villages: ['Bumi Beringin', 'Calaca', 'Komunigi', 'Mahakeret Barat', 'Mahakeret Timur', 'Pinaesaan', 'Tikala Kumaraka', 'Wenang Selatan', 'Wenang Utara'] },
        ],
      },
    ],
  },

  // 23. GORONTALO
  {
    id: 'gorontalo',
    name: 'Gorontalo',
    cities: [
      {
        name: 'Kota Gorontalo',
        districts: [
          { name: 'Kota Tengah', postalCode: '96111', villages: ['Dulalowo', 'Dulalowo Timur', 'Liluwo', 'Paguyaman', 'Pulubala', 'Wumialo'] },
        ],
      },
    ],
  },

  // 24. SULAWESI TENGAH
  {
    id: 'sulawesi-tengah',
    name: 'Sulawesi Tengah',
    cities: [
      {
        name: 'Kota Palu',
        districts: [
          { name: 'Palu Timur', postalCode: '94111', villages: ['Besusu Barat', 'Besusu Tengah', 'Besusu Timur', 'Lolu Selatan', 'Lolu Utara'] },
        ],
      },
    ],
  },

  // 25. SULAWESI BARAT
  {
    id: 'sulawesi-barat',
    name: 'Sulawesi Barat',
    cities: [
      {
        name: 'Kabupaten Mamuju',
        districts: [
          { name: 'Mamuju', postalCode: '91511', villages: ['Bamboi', 'Binanga', 'Karema', 'Mamuju', 'Rangas', 'Rimuku'] },
        ],
      },
    ],
  },

  // 26. SULAWESI SELATAN
  {
    id: 'sulawesi-selatan',
    name: 'Sulawesi Selatan',
    cities: [
      {
        name: 'Kota Makassar',
        districts: [
          { name: 'Ujung Pandang', postalCode: '90111', villages: ['Baru', 'Bulo Gading', 'Kajaolalido', 'Lae-Lae', 'Lajangiru', 'Losari', 'Maloku', 'Mangkura', 'Pisang Selatan', 'Pisang Utara', 'Sawerigading'] },
        ],
      },
    ],
  },

  // 27. SULAWESI TENGGARA
  {
    id: 'sulawesi-tenggara',
    name: 'Sulawesi Tenggara',
    cities: [
      {
        name: 'Kota Kendari',
        districts: [
          { name: 'Kendari Barat', postalCode: '93111', villages: ['Benu-Benua', 'Dapu-Dapura', 'Kemaraya', 'Lahundape', 'Punggaloba', 'Sanua', 'Sodohoa', 'Tipulu', 'Watu-Watu'] },
        ],
      },
    ],
  },

  // 28. BALI
  {
    id: 'bali',
    name: 'Bali',
    cities: [
      {
        name: 'Kota Denpasar',
        districts: [
          { name: 'Denpasar Barat', postalCode: '80111', villages: ['Dauh Puri', 'Dauh Puri Kangin', 'Dauh Puri Kauh', 'Dauh Puri Klod', 'Padangsambian', 'Padangsambian Kaja', 'Padangsambian Klod', 'Pemecutan', 'Pemecutan Klod', 'Tegal Harum', 'Tegal Kerta'] },
          { name: 'Denpasar Selatan', postalCode: '80221', villages: ['Panjer', 'Pedungan', 'Pemogan', 'Renon', 'Sanur', 'Sanur Kaja', 'Sanur Kauh', 'Serangan', 'Sidakarya'] },
        ],
      },
      {
        name: 'Kabupaten Badung',
        districts: [
          { name: 'Kuta', postalCode: '80361', villages: ['Kedonganan', 'Tuban', 'Kuta', 'Legian', 'Seminyak'] },
          { name: 'Kuta Utara', postalCode: '80361', villages: ['Canggu', 'Dalung', 'Kerobokan', 'Kerobokan Kelod', 'Kerobokan Kaja', 'Tibubeneng'] },
        ],
      },
    ],
  },

  // 29. NUSA TENGGARA BARAT (NTB)
  {
    id: 'nusa-tenggara-barat',
    name: 'Nusa Tenggara Barat',
    cities: [
      {
        name: 'Kota Mataram',
        districts: [
          { name: 'Mataram', postalCode: '83111', villages: ['Mataram Timur', 'Pagesangan', 'Pagesangan Barat', 'Pagesangan Timur', 'Pagutan', 'Pagutan Barat', 'Pagutan Timur', 'Pejanggik', 'Punia'] },
        ],
      },
    ],
  },

  // 30. NUSA TENGGARA TIMUR (NTT)
  {
    id: 'nusa-tenggara-timur',
    name: 'Nusa Tenggara Timur',
    cities: [
      {
        name: 'Kota Kupang',
        districts: [
          { name: 'Kota Raja', postalCode: '85111', villages: ['Bakunase', 'Bakunase II', 'Fontein', 'Kuanino', 'Naikoten I', 'Naikoten II', 'Nunbaun Delha', 'Nunbaun Sabu'] },
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
          { name: 'Sirimau', postalCode: '97121', villages: ['Ahusen', 'Batu Gajah', 'Batu Meja', 'Galala', 'Hative Kecil', 'Honipopu', 'Karang Panjang', 'Pandang Kasturi', 'Rijali', 'Soya', 'Uritetu', 'Waihaong'] },
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
          { name: 'Ternate Tengah', postalCode: '97711', villages: ['Gamalama', 'Kampueng Pisang', 'Kota Baru', 'Maliaro', 'Marikurubu', 'Muhajirin', 'Salahuddin', 'Santiong', 'Takoma', 'Tongole'] },
        ],
      },
      {
        name: 'Kota Tidore Kepulauan',
        districts: [
          { name: 'Tidore', postalCode: '97811', villages: ['Gamtufkange', 'Gurabunga', 'Indonusa', 'Kotabaru', 'Soasio', 'Tomagoba', 'Tuguiha'] },
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
          { name: 'Jayapura Utara', postalCode: '99111', villages: ['Angkasapura', 'Bayangkara', 'Gurabesi', 'Imbi', 'Kayu Batu', 'Mandalik', 'Trikora'] },
          { name: 'Jayapura Selatan', postalCode: '99221', villages: ['Argapura', 'Entrop', 'Hamadi', 'Numbai', 'Tahima Soroma', 'Tobati'] },
          { name: 'Abepura', postalCode: '99351', villages: ['Abepantai', 'Asano', 'Enggros', 'Kotabaru', 'Kota Raja', 'Nafri', 'Vim', 'Wahno', 'Way Mhorock', 'Yobe'] },
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
          { name: 'Manokwari Barat', postalCode: '98311', villages: ['Amban', 'Manokwari Barat', 'Manokwari Timur', 'Padarni', 'Sanggeng', 'Wosi'] },
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
          { name: 'Sorong Kota', postalCode: '98411', villages: ['Kampung Baru', 'Klademak', 'Klasi', 'Klasuur', 'Malabutor', 'Puncak Cendrawasih', 'Remu Selatan', 'Remu Utara'] },
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
          { name: 'Merauke', postalCode: '99611', villages: ['Bambu Pemali', 'Karang Indah', 'Kelapa Lima', 'Kuda Mati', 'Maro', 'Merauke', 'Mopah Lama', 'Namas', 'Rimbe Jaya', 'Samkai', 'Seringgu Jaya'] },
        ],
      },
    ],
  },

  // 37. PAPUA PEGUNUNGAN
  {
    id: 'papua-pegunungan',
    name: 'Papua Pegunungan',
    cities: [
      {
        name: 'Kabupaten Jayawijaya (Wamena)',
        districts: [
          { name: 'Wamena', postalCode: '99511', villages: ['Autakma', 'Hukimo', 'Honelama', 'Sinakma', 'Wamena', 'Wamena Kota', 'Wouma'] },
        ],
      },
    ],
  },

  // 38. PAPUA TENGAH
  {
    id: 'papua-tengah',
    name: 'Papua Tengah',
    cities: [
      {
        name: 'Kabupaten Nabire',
        districts: [
          { name: 'Nabire', postalCode: '98811', villages: ['Girimulyo', 'Kalibobo', 'Karang Mulia', 'Karang Tumaritis', 'Morgo', 'Nabire Barat', 'Nabire Kota', 'Nabarua', 'Oyehe', 'Siriwini'] },
        ],
      },
      {
        name: 'Kabupaten Mimika (Timika)',
        districts: [
          { name: 'Mimika Baru', postalCode: '99910', villages: ['Hangaitji', 'Kebun Sirih', 'Kwamki', 'Nayaro', 'Otakwa', 'Passir Putih', 'Sempan', 'Timika Jaya', 'Wanagon'] },
        ],
      },
    ],
  },
];
