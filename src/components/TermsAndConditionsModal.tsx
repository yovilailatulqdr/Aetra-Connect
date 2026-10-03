import React, { useState } from 'react';
import { AetraLogo } from './AetraLogo';
import { 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  Scale, 
  AlertCircle,
  PhoneCall,
  MapPin,
  Clock,
  Printer
} from 'lucide-react';

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({
  isOpen,
  onClose,
  onAccept,
}) => {
  const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#005DAA] via-[#004B8A] to-[#003868] text-white p-5 sm:p-6 flex items-start justify-between gap-4 shrink-0 border-b-4 border-[#F37021]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0">
              <Scale className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full">
                  Dokumen Resmi AAT
                </span>
                <span className="text-xs text-blue-100 font-mono">
                  No. Dok: SK-BERLANGGANAN-2026
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white mt-1">
                SYARAT DAN KETENTUAN BERLANGGANAN AIR BERSIH
              </h2>
              <p className="text-xs text-blue-100 mt-0.5">
                PT AETRA AIR TANGERANG (&ldquo;AAT&rdquo;) &bull; Hak, Kewajiban, Tarif, dan Ketentuan Pelayanan Pelanggan
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition shrink-0 cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/50 flex-1">
          
          {/* Official Callout */}
          <div className="bg-blue-50 border-l-4 border-[#005DAA] p-4 rounded-r-2xl text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-[#005DAA]">
              <ShieldCheck className="w-4 h-4" />
              <span>PENTING &bull; BACA DENGAN SEKSAMA</span>
            </div>
            <p className="text-slate-600">
              Syarat dan Ketentuan ini mengikat secara hukum antara <strong>PT AETRA AIR TANGERANG</strong> sebagai penyelenggara Sistem Penyediaan Air Minum dan <strong>Pelanggan</strong> yang mengajukan sambungan baru.
            </p>
          </div>

          {/* PASAL 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base text-[#005DAA] border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#005DAA] flex items-center justify-center text-xs font-black">1</span>
              <span>PASAL 1 &mdash; HAK DAN KEWAJIBAN PT AETRA AIR TANGERANG (&ldquo;AAT&rdquo;)</span>
            </h3>

            <div className="space-y-3 pl-2 sm:pl-4">
              <div>
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm text-slate-900">1. Kewajiban AAT</h4>
                <ul className="list-decimal pl-5 space-y-1.5 mt-1 text-slate-600 text-xs">
                  <li>Menyediakan air sesuai standar Peraturan Menteri Kesehatan No. 2 Tahun 2023 tentang Peraturan Pelaksanaan Pemerintah Nomor 66 Tahun 2014 tentang Kesehatan Lingkungan (&ldquo;Air&rdquo;) kepada Pelanggan sampai ke titik lokasi meter Air yang dipasang AAT pada bangunan di lokasi Pelanggan (&ldquo;Properti Pelanggan&rdquo;), secara terus-menerus selama 24 jam sehari, 7 hari seminggu, kecuali dalam Keadaan Kahar atau selama masa perbaikan dan pemeliharaan instalasi sambungan pipa dan meter Air serta kelengkapan terkait pengolahan Air.</li>
                  <li>Menyediakan dan memasang Sambungan Pipa dan Meter dengan kualitas baik sesuai standar AAT. Sambungan Pipa dan Meter adalah milik AAT.</li>
                  <li>Melakukan dan menanggung biaya pemeliharaan Sambungan Pipa dan Meter, baik perbaikan maupun penggantian sesuai standar AAT, kecuali jika terjadi perusakan, pencurian, atau penyalahgunaan oleh Pelanggan.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm text-slate-900">2. Hak AAT</h4>
                <ul className="list-decimal pl-5 space-y-1.5 mt-1 text-slate-600 text-xs">
                  <li>Mendapatkan pembayaran dari Pelanggan atas pemakaian Air dan biaya-biaya lain (abonemen, biaya pemakaian minimum, denda, dsb.) sesuai tagihan yang disampaikan AAT.</li>
                  <li>Mendapat akses untuk melaksanakan pemeriksaan Properti Pelanggan guna keperluan penyambungan, pemeliharaan, dan pemeriksaan Sambungan Pipa dan Meter serta perubahan kondisi Properti Pelanggan terkait penggolongan Pelanggan.</li>
                  <li>Dapat memutuskan sementara aliran Air jika Pelanggan tidak melakukan pembayaran dalam jangka waktu yang ditentukan dalam tagihan.</li>
                  <li>Dapat memutuskan aliran Air secara permanen jika Pelanggan tidak melunasi tagihan dalam 60 hari kerja sejak tanggal tagihan dicetak. Jika ingin layanan kembali, Pelanggan wajib mendaftar sambungan baru setelah melunasi seluruh tagihan.</li>
                  <li>Mengenakan denda dan sanksi atas keterlambatan pembayaran serta pelanggaran lain oleh Pelanggan.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* PASAL 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base text-[#005DAA] border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#005DAA] flex items-center justify-center text-xs font-black">2</span>
              <span>PASAL 2 &mdash; HAK DAN KEWAJIBAN PELANGGAN</span>
            </h3>

            <div className="space-y-3 pl-2 sm:pl-4">
              <div>
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm text-slate-900">1. Kewajiban Pelanggan</h4>
                <ul className="list-decimal pl-5 space-y-1.5 mt-1 text-slate-600 text-xs">
                  <li>Mengisi formulir permohonan sambungan baru dengan data yang benar dan melengkapi seluruh persyaratan administrasi serta keuangan.</li>
                  <li>Membayar biaya sambungan baru (material, pengerjaan, pemasangan, administrasi, dan pajak terkait).</li>
                  <li>Membayar biaya tambahan jika panjang sambungan melebihi standar yang ditetapkan AAT.</li>
                  <li>Membayar tagihan setiap bulan sebelum tanggal jatuh tempo; keterlambatan dikenakan denda dan sanksi sesuai ketentuan yang berlaku.</li>
                  <li>Membayar pajak-pajak terkait sesuai ketentuan hukum yang berlaku.</li>
                  <li>Bertanggung jawab menjaga keutuhan Sambungan Pipa dan Meter yang terpasang di Properti Pelanggan.</li>
                  <li>Melaporkan kerusakan Sambungan Pipa dan Meter atau masalah kualitas Air (air mati, keruh, aliran kecil, berbau, kotor, dsb.) agar segera ditindaklanjuti.</li>
                  <li>Memastikan meter Air selalu terjangkau oleh petugas AAT dan dapat dibaca dengan jelas; jika tidak dapat dijangkau, AAT berhak memperkirakan pemakaian berdasarkan rata-rata pemakaian bulan sebelumnya.</li>
                  <li>Memberikan izin kepada petugas AAT untuk memasuki halaman/bangunan guna pemeliharaan, perbaikan, dan pemeriksaan.</li>
                  <li>Melaporkan perubahan status kepemilikan, kondisi fisik, dan peruntukan Properti Pelanggan.</li>
                  <li>Menyediakan wadah penampungan air dengan kapasitas minimal kebutuhan 1 hari guna mengantisipasi gangguan suplai.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm text-slate-900">2. Hak Pelanggan</h4>
                <ul className="list-decimal pl-5 space-y-1.5 mt-1 text-slate-600 text-xs">
                  <li>Mendapatkan layanan pemasangan Sambungan Pipa dan Meter pada Properti Pelanggan.</li>
                  <li>Mendapatkan aliran Air selama 24 jam sehari, 7 hari seminggu, kecuali dalam Keadaan Kahar atau masa perbaikan/pemeliharaan.</li>
                  <li>Mendapatkan layanan pemeliharaan Sambungan Pipa dan Meter sesuai kewajiban AAT pada Pasal 1.</li>
                  <li>Mendapatkan informasi tagihan bulanan yang memuat rincian volume pemakaian Air dan biaya lain yang terkait.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-red-600 text-xs sm:text-sm">3. Larangan Pelanggan</h4>
                <p className="text-xs text-slate-500 mb-1">Pelanggan dilarang keras melakukan hal-hal berikut:</p>
                <ul className="list-decimal pl-5 space-y-1.5 text-slate-600 text-xs">
                  <li>Melepas, merusak, atau menghilangkan segel meter Air.</li>
                  <li>Membalik arah, menimbun, atau menghilangkan meter Air.</li>
                  <li>Mengubah ukuran/letak pipa Air atau memindahkan meter Air tanpa izin AAT.</li>
                  <li>Menyadap Air langsung dari pipa tanpa melalui meter Air.</li>
                  <li>Menggunakan pompa air listrik untuk menyedot Air tanpa melalui meter Air.</li>
                  <li>Menjual Air kepada pihak lain.</li>
                  <li>Memecahkan atau menghilangkan kaca penutup meter Air.</li>
                  <li>Mengikir, memotong baling-baling, memasang magnet, memasukkan kawat atau benda lain ke dalam meter Air, atau melakukan tindakan lain yang merusak, memperlambat, atau menghentikan kerja meter Air.</li>
                  <li>Menguruk, menimbun, atau membiarkan meter Air tertutup puing, kotoran, atau tanah sehingga menghalangi akses dan pembacaan.</li>
                  <li>Memasukkan zat atau benda apa pun ke dalam pipa Air sebelum titik meter yang dapat merusak atau mencemari kualitas Air.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* PASAL 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base text-[#005DAA] border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#005DAA] flex items-center justify-center text-xs font-black">3</span>
              <span>PASAL 3 &mdash; TAGIHAN BULANAN</span>
            </h3>
            <ul className="list-decimal pl-5 space-y-1.5 text-slate-600 text-xs">
              <li>Setiap bulan, Pelanggan dikenakan tagihan yang terdiri dari biaya abonemen dan biaya pemakaian Air.</li>
              <li>Pelanggan wajib membayar tagihan paling lambat pada tanggal jatuh tempo yang ditetapkan AAT.</li>
              <li>Besaran abonemen ditentukan berdasarkan kelompok Pelanggan, golongan tarif, dan ukuran meter Air yang terpasang.</li>
              <li>Biaya pemakaian Air dihitung berdasarkan volume (kubikasi) pemakaian selama satu bulan penagihan sesuai tarif yang berlaku.</li>
              <li>Biaya pemakaian minimum dikenakan jika volume pemakaian di bawah batas minimum yang ditetapkan AAT.</li>
              <li>Pajak yang timbul dari tagihan bulanan, termasuk bea meterai, dibebankan kepada Pelanggan.</li>
            </ul>
          </div>

          {/* PASAL 4 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base text-[#005DAA] border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#005DAA] flex items-center justify-center text-xs font-black">4</span>
              <span>PASAL 4 &mdash; TARIF AIR</span>
            </h3>
            <ul className="list-decimal pl-5 space-y-1.5 text-slate-600 text-xs">
              <li>
                Tarif Air dibedakan berdasarkan kelompok Pelanggan dan ditagihkan berdasarkan volume pemakaian dalam blok konsumsi berikut:
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 my-2 font-mono text-[11px]">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <strong className="text-[#005DAA] block">Blok B1</strong>
                    <span>Pemakaian 0 – 10 m³</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <strong className="text-[#005DAA] block">Blok B2</strong>
                    <span>Pemakaian 11 – 20 m³</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <strong className="text-[#005DAA] block">Blok B3</strong>
                    <span>Pemakaian &gt; 20 m³</span>
                  </div>
                </div>
              </li>
              <li>Kelompok Pelanggan ditentukan berdasarkan peruntukan, luas, dan kondisi Properti Pelanggan serta tanah tempat properti berada.</li>
              <li>Besaran tarif Air, abonemen, dan perubahannya ditetapkan berdasarkan Peraturan Bupati Tangerang.</li>
            </ul>
          </div>

          {/* PASAL 5 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base text-[#005DAA] border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#005DAA] flex items-center justify-center text-xs font-black">5</span>
              <span>PASAL 5 &mdash; BIAYA LAIN</span>
            </h3>
            <p className="text-xs text-slate-600">Selain tagihan bulanan, Pelanggan dapat dikenakan biaya lain terkait:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600 list-disc pl-5">
              <li>Sambungan baru</li>
              <li>Penggantian meter Air karena rusak/hilang akibat kelalaian Pelanggan</li>
              <li>Pengujian kualitas Air atas permintaan Pelanggan</li>
              <li>Pengujian kalibrasi meter Air</li>
              <li>Balik nama Properti Pelanggan</li>
              <li>Denda pemakaian Air ilegal</li>
              <li>Denda pemasangan sambungan pipa ilegal</li>
              <li>Biaya penyambungan kembali</li>
              <li>Denda keterlambatan pembayaran</li>
              <li>Penggantian segel meter akibat pemutusan sementara</li>
              <li>Pemindahan letak meter</li>
              <li>Penggantian pipa persil</li>
              <li>Pemeriksaan instalasi atas permintaan Pelanggan</li>
              <li>Sewa instalasi &amp; biaya lainnya</li>
            </div>
            <p className="text-[11px] text-slate-500 italic mt-1">Jenis dan besaran biaya di atas ditetapkan oleh AAT dan dapat berubah sewaktu-waktu.</p>
          </div>

          {/* PASAL 6 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base text-[#005DAA] border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#005DAA] flex items-center justify-center text-xs font-black">6</span>
              <span>PASAL 6 &mdash; PROSEDUR KELUHAN PELANGGAN</span>
            </h3>
            <p className="text-xs text-slate-600">Pelanggan berhak mendapatkan layanan tanggapan atas keluhan, termasuk keadaan darurat terkait kuantitas/kualitas Air serta Sambungan Pipa dan Meter, melalui:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 space-y-1">
                <div className="font-bold text-[#005DAA] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Kantor Pelayanan Resmi</span>
                </div>
                <p className="text-slate-700"><strong>Kantor Pusat:</strong> Jl. Raya Curug No. 27, Desa Kadu Jaya, Kec. Curug, Tangerang</p>
                <p className="text-slate-700"><strong>Kantor Cabang:</strong> Ruko Puri Jaya Blok AA No. 30, Sukamantri, Kec. Pasar Kemis</p>
              </div>

              <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 space-y-1">
                <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Contact Center 24 Jam</span>
                </div>
                <p className="text-slate-700"><strong>Telepon:</strong> (021) 598 5474</p>
                <p className="text-slate-700"><strong>WhatsApp:</strong> 0877 8822 4645</p>
                <p className="text-slate-700"><strong>Email:</strong> pengaduan@aetratangerang.co.id</p>
              </div>
            </div>
          </div>

          {/* PASAL 7 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base text-[#005DAA] border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#005DAA] flex items-center justify-center text-xs font-black">7</span>
              <span>PASAL 7 &mdash; KETENTUAN LAIN-LAIN</span>
            </h3>
            <ul className="list-decimal pl-5 space-y-1.5 text-slate-600 text-xs">
              <li>Perjanjian ini tunduk pada ketentuan hukum yang berlaku di Negara Kesatuan Republik Indonesia.</li>
              <li>Segala perselisihan yang timbul akan diselesaikan secara musyawarah untuk mufakat terlebih dahulu, dan bila tidak tercapai kesepakatan, akan diselesaikan melalui yurisdiksi Pengadilan Negeri Tangerang.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer with Agreement Checkbox & Action Button */}
        <div className="p-5 sm:p-6 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 text-[#005DAA] rounded border-slate-300 focus:ring-[#005DAA]"
            />
            <span className="text-xs sm:text-sm font-bold text-slate-900">
              Saya telah membaca, memahami, dan menyetujui seluruh Syarat &amp; Ketentuan Berlangganan di atas.
            </span>
          </label>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-200 text-xs font-bold transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={!agreed}
              onClick={() => {
                if (agreed) {
                  onAccept();
                  onClose();
                }
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#005DAA] hover:bg-[#004A88] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-black shadow-md shadow-blue-900/20 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Lanjutkan Pendaftaran</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
