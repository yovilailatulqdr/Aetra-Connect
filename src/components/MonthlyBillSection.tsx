import React, { useState, useMemo, useEffect } from 'react';
import { UserAccount, RegistrationFormData, MonthlyBillRecord, PaymentProofData } from '../types';
import { 
  CreditCard, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Receipt, 
  Printer, 
  Download, 
  ExternalLink, 
  Calendar, 
  Building2, 
  MapPin, 
  QrCode, 
  Wallet, 
  Store, 
  ChevronRight, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  FileCheck, 
  History, 
  RotateCcw, 
  Copy, 
  Check, 
  Info,
  AlertTriangle,
  Lock,
  PhoneCall,
  ShieldAlert,
  Wrench,
  Ban,
  Timer,
  Upload,
  Camera,
  Trash2,
  TrendingUp,
  BarChart3,
  FileText,
  Eye
} from 'lucide-react';
import { PaymentPartnersGrid } from './PaymentPartnersGrid';
import { cloudSyncService, INITIAL_BILLS_DATA } from '../services/cloudSyncService';
import { CameraCaptureModal } from './CameraCaptureModal';
import { DocumentImageViewerModal } from './DocumentImageViewerModal';

interface MonthlyBillSectionProps {
  currentUser?: UserAccount | null;
  registrations?: RegistrationFormData[];
  onNavigateToRegister?: () => void;
  externalBills?: MonthlyBillRecord[];
}

export type DemoBillState = 'NORMAL' | 'WARNING_TEMPORARY_SEAL' | 'DANGER_PERMANENT_DISCONNECT';

export const MonthlyBillSection: React.FC<MonthlyBillSectionProps> = ({
  currentUser,
  registrations = [],
  onNavigateToRegister,
  externalBills,
}) => {
  const [bills, setBills] = useState<MonthlyBillRecord[]>(() => {
    if (externalBills && externalBills.length > 0) return externalBills;
    const local = cloudSyncService.getLocalSnapshot().bills;
    return local.length > 0 ? local : INITIAL_BILLS_DATA;
  });

  const [demoState, setDemoState] = useState<DemoBillState>('NORMAL');

  useEffect(() => {
    const unsub = cloudSyncService.addListener(() => {
      const updated = cloudSyncService.getLocalSnapshot().bills;
      if (updated && updated.length > 0) {
        setBills(updated);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (externalBills && externalBills.length > 0) {
      setBills(externalBills);
    }
  }, [externalBills]);

  const [searchId, setSearchId] = useState<string>(() => {
    return currentUser?.idPelanggan || '10842918';
  });

  const [activeQuery, setActiveQuery] = useState<string>(() => {
    return currentUser?.idPelanggan || '10842918';
  });

  const [copiedCode, setCopiedCode] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Upload proof of payment state for monthly bill
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [billProofData, setBillProofData] = useState<{
    bank: string;
    tanggalBayar: string;
    catatan: string;
    fileUrl: string;
  }>({
    bank: 'Bank BCA (Virtual Account)',
    tanggalBayar: new Date().toISOString().split('T')[0],
    catatan: '',
    fileUrl: '',
  });

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSubmittingBillProof, setIsSubmittingBillProof] = useState(false);

  // Lightbox Image viewer modal state
  const [activeViewer, setActiveViewer] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
    description?: string;
  }>({
    isOpen: false,
    imageUrl: '',
    title: '',
  });

  // Calculate matching bill
  const currentBill = useMemo(() => {
    if (!activeQuery.trim()) return null;
    const cleanQuery = activeQuery.trim().toLowerCase();

    let found = bills.find(
      (b) =>
        b.idPelanggan.toLowerCase() === cleanQuery ||
        (b.noSr && b.noSr.toLowerCase() === cleanQuery)
    );

    if (!found) {
      const regMatch = registrations.find(
        (r) =>
          (r.idPelanggan && r.idPelanggan.toLowerCase() === cleanQuery) ||
          (r.noForm && r.noForm.toLowerCase() === cleanQuery) ||
          (r.noSr && r.noSr.toLowerCase() === cleanQuery)
      );
      if (regMatch) {
        found = {
          id: `bill-reg-${regMatch.noForm}`,
          idPelanggan: regMatch.idPelanggan || '10842918',
          noSr: regMatch.noSr || '165050',
          nama: regMatch.namaKtp,
          alamat: `${regMatch.alamatPasang || regMatch.alamatKtp}, RT/RW ${regMatch.rtRwPasang || regMatch.rtRwKtp}`,
          golonganTarif: regMatch.golonganTarif || 'R2 = Rumah Tangga 2',
          nomorMeter: regMatch.dataPasang?.noSeriMeter || 'AET-2026-84720',
          periodeBulan: 'Maret 2026',
          tanggalJatuhTempo: '20 Maret 2026',
          standLalu: 184,
          standKini: 202,
          pemakaianM3: 18,
          rincianBlok: { blok1M3: 10, blok1Tarif: 6200, blok1Total: 62000, blok2M3: 8, blok2Tarif: 8500, blok2Total: 68000, blok3M3: 0, blok3Tarif: 11200, blok3Total: 0 },
          biayaAir: 130000,
          biayaPemeliharaanMeter: 12500,
          biayaAdministrasi: 5000,
          retribusi: 0,
          denda: 0,
          totalTagihan: 147500,
          status: 'BELUM LUNAS',
        };
      }
    }

    if (!found) return null;

    if (demoState === 'WARNING_TEMPORARY_SEAL') {
      return {
        ...found,
        status: 'BELUM LUNAS' as const,
        periodeBulan: 'Februari & Maret 2026 (Tunggakan 1 Bulan)',
        totalTagihan: 295000,
        denda: 25000,
        tanggalJatuhTempo: '20 Februari 2026 (Lewat Jatuh Tempo)',
      };
    }

    if (demoState === 'DANGER_PERMANENT_DISCONNECT') {
      return {
        ...found,
        status: 'BELUM LUNAS' as const,
        periodeBulan: 'Akumulasi 5 Bulan (Nov 2025 - Mar 2026)',
        totalTagihan: 785000,
        denda: 125000,
        tanggalJatuhTempo: '20 November 2025 (Menunggak 5 Bulan)',
      };
    }

    return found;
  }, [activeQuery, bills, registrations, demoState]);

  // 12 Months Stand Meter History Data (Minimum 1 year as requested in item 14)
  const standMeterHistory = useMemo(() => {
    const months = [
      { bulan: 'Maret 2026', standLalu: 184, standKini: 202, pemakaian: 18, tagihan: 147500, status: 'Belum Lunas' },
      { bulan: 'Februari 2026', standLalu: 167, standKini: 184, pemakaian: 17, tagihan: 139000, status: 'Lunas' },
      { bulan: 'Januari 2026', standLalu: 148, standKini: 167, pemakaian: 19, tagihan: 156000, status: 'Lunas' },
      { bulan: 'Desember 2025', standLalu: 130, standKini: 148, pemakaian: 18, tagihan: 147500, status: 'Lunas' },
      { bulan: 'November 2025', standLalu: 114, standKini: 130, pemakaian: 16, tagihan: 130500, status: 'Lunas' },
      { bulan: 'Oktober 2025', standLalu: 95, standKini: 114, pemakaian: 19, tagihan: 156000, status: 'Lunas' },
      { bulan: 'September 2025', standLalu: 78, standKini: 95, pemakaian: 17, tagihan: 139000, status: 'Lunas' },
      { bulan: 'Agustus 2025', standLalu: 60, standKini: 78, pemakaian: 18, tagihan: 147500, status: 'Lunas' },
      { bulan: 'Juli 2025', standLalu: 40, standKini: 60, pemakaian: 20, tagihan: 164500, status: 'Lunas' },
      { bulan: 'Juni 2025', standLalu: 22, standKini: 40, pemakaian: 18, tagihan: 147500, status: 'Lunas' },
      { bulan: 'Mei 2025', standLalu: 6, standKini: 22, pemakaian: 16, tagihan: 130500, status: 'Lunas' },
      { bulan: 'April 2025', standLalu: 0, standKini: 6, pemakaian: 6, tagihan: 45000, status: 'Lunas' },
    ];
    return months;
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    setActiveQuery(searchId.trim());
    setTimeout(() => setIsSearching(false), 200);
  };

  const handleCopyPaymentCode = () => {
    if (!currentBill) return;
    navigator.clipboard.writeText(currentBill.idPelanggan);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const handleConfirmBillPaymentProof = () => {
    if (!currentBill) return;
    if (!billProofData.fileUrl) {
      alert('Mohon unggah foto struk bukti pembayaran Anda.');
      return;
    }

    setIsSubmittingBillProof(true);
    const updatedBills = bills.map((b) => {
      if (b.idPelanggan === currentBill.idPelanggan) {
        return {
          ...b,
          status: 'LUNAS' as const,
          tanggalBayar: billProofData.tanggalBayar,
          metodeBayar: billProofData.bank,
          noReferensi: 'TRX-AET-' + Math.floor(100000 + Math.random() * 900000),
        };
      }
      return b;
    });

    setBills(updatedBills);
    cloudSyncService.saveBills(updatedBills);
    setIsSubmittingBillProof(false);
    setIsUploadModalOpen(false);
    setNotification('Bukti pembayaran berhasil diunggah! Status tagihan diperbarui menjadi LUNAS.');
    setTimeout(() => setNotification(null), 5000);
  };

  // Cost component values (explicit zeroes if none as requested in item 10)
  const biayaAirVal = currentBill ? (currentBill.biayaAir || 130000) : 0;
  const dendaVal = currentBill ? (demoState === 'WARNING_TEMPORARY_SEAL' ? 25000 : demoState === 'DANGER_PERMANENT_DISCONNECT' ? 125000 : currentBill.denda || 0) : 0;
  const biayaBukaSegelVal = demoState === 'DANGER_PERMANENT_DISCONNECT' ? 50000 : 0;
  const biayaLainnyaVal = 0;
  const biayaPemeliharaanVal = currentBill ? (currentBill.biayaPemeliharaanMeter || 12500) : 0;
  const biayaAdminVal = currentBill ? (currentBill.biayaAdministrasi || 5000) : 0;
  const grandTotal = biayaAirVal + biayaPemeliharaanVal + biayaAdminVal + dendaVal + biayaBukaSegelVal + biayaLainnyaVal;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {notification && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span className="text-xs sm:text-sm font-bold">{notification}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-white/80 hover:text-white text-xs font-bold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-[#005DAA] via-[#004B8A] to-[#003868] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border-b-4 border-[#F37021]">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-100 text-xs font-semibold border border-white/20">
            <CreditCard className="w-3.5 h-3.5 text-[#F37021]" />
            <span>Layanan Mandiri Pelanggan Aetra</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Cek Tagihan Rekening Air Bulanan
          </h1>

          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Masukkan <strong>ID Pelanggan</strong> Anda di bawah ini untuk melihat rincian pemakaian, denda, histori stand meter 12 bulan, dan upload bukti struk pembayaran.
          </p>
        </div>

        {/* Input Bar Form */}
        <form onSubmit={handleSearchSubmit} className="mt-6 relative z-10">
          <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-slate-200">
            <div className="flex-1 flex items-center gap-3 px-3 w-full">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Nomor ID Pelanggan
                </label>
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value.replace(/\s+/g, ''))}
                  placeholder="Masukkan 8 Digit ID Pelanggan (contoh: 10842918)"
                  className="w-full text-slate-900 font-mono font-bold text-base sm:text-lg focus:outline-hidden placeholder:font-sans placeholder:text-xs placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!searchId.trim() || isSearching}
              className="w-full sm:w-auto px-6 py-3 bg-[#005DAA] hover:bg-[#004A88] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>Cek Tagihan</span>
            </button>
          </div>
        </form>

        {/* Quick Sample IDs */}
        <div className="mt-3 flex items-center gap-2 flex-wrap text-[11px] text-blue-100">
          <span className="font-semibold text-blue-200">Contoh ID Pelanggan:</span>
          {['10842918', '10928371', '10739182'].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setSearchId(id);
                setActiveQuery(id);
              }}
              className={`px-2.5 py-0.5 rounded-lg border font-mono transition text-xs ${
                activeQuery === id
                  ? 'bg-[#F37021] text-white border-transparent font-bold shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              #{id}
            </button>
          ))}
        </div>
      </div>

      {/* SIMULASI STATUS TAGIHAN (INFORMATIF & TIDAK MENCEKAM SESUAI NO 13) */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
              Simulasi Status Rekening Air (Pilih Demo):
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Uji tampilan edukasi &amp; panduan penertiban sambungan secara bersahabat:
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => setDemoState('NORMAL')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center gap-3 ${
              demoState === 'NORMAL'
                ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/40'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <strong className="text-xs block font-bold">1. Status Normal / Lancar</strong>
              <span className="text-[10px] text-slate-400">Tagihan bulan berjalan standar</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDemoState('WARNING_TEMPORARY_SEAL')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center gap-3 ${
              demoState === 'WARNING_TEMPORARY_SEAL'
                ? 'bg-amber-950/90 border-amber-400 text-amber-200 ring-2 ring-amber-500/40'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <strong className="text-xs block font-bold text-amber-300">2. Peringatan Segel (1-2 Bln)</strong>
              <span className="text-[10px] text-slate-400">Panduan pembayaran sebelum segel</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDemoState('DANGER_PERMANENT_DISCONNECT')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center gap-3 ${
              demoState === 'DANGER_PERMANENT_DISCONNECT'
                ? 'bg-rose-950/90 border-rose-400 text-rose-200 ring-2 ring-rose-500/40'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Ban className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <strong className="text-xs block font-bold text-rose-300">3. Pemutusan Permanen (5 Bln)</strong>
              <span className="text-[10px] text-slate-400">Prosedur penyambungan kembali</span>
            </div>
          </button>
        </div>
      </div>

      {currentBill && (
        <div className="space-y-6">
          {/* BANNER 1: PERINGATAN SEGEL SEMENTARA (INFORMATIF & SIMPEL) */}
          {demoState === 'WARNING_TEMPORARY_SEAL' && (
            <div className="bg-amber-50 border-2 border-amber-300 text-slate-900 p-5 sm:p-6 rounded-3xl shadow-sm space-y-3">
              <div className="flex items-center gap-3 border-b border-amber-200 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide bg-amber-100 px-2.5 py-0.5 rounded-full">
                    Informasi Pembayaran Tagihan
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-0.5">
                    Peringatan Keterlambatan Pembayaran &bull; Potensi Segel Kran Sementara
                  </h3>
                </div>
              </div>

              <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
                <p>
                  Yth. Pelanggan <strong>{currentBill.nama}</strong>, tagihan rekening air bulan lalu sebesar <strong>Rp {grandTotal.toLocaleString('id-ID')}</strong> telah melewati batas jatuh tempo tanggal 20.
                </p>
                <div className="bg-white p-3.5 rounded-2xl border border-amber-200 text-xs space-y-1">
                  <strong className="text-amber-900 block">Langkah Mudah Penyelesaian:</strong>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                    <li>Segera lakukan pembayaran via ATM, Mobile Banking, Indomaret, atau Alfamart menggunakan ID Pelanggan <strong>{currentBill.idPelanggan}</strong>.</li>
                    <li>Setelah bayar, Anda dapat mengunggah bukti transfer di bawah ini untuk konfirmasi instan.</li>
                    <li>Petugas tidak akan memasang segel kran apabila pembayaran telah diselesaikan.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* BANNER 2: PEMUTUSAN PERMANEN (INFORMATIF & SOLUTIF) */}
          {demoState === 'DANGER_PERMANENT_DISCONNECT' && (
            <div className="bg-rose-50 border-2 border-rose-300 text-slate-900 p-5 sm:p-6 rounded-3xl shadow-sm space-y-3">
              <div className="flex items-center gap-3 border-b border-rose-200 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <Ban className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wide bg-rose-100 px-2.5 py-0.5 rounded-full">
                    Status Sambungan Dinonaktifkan
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-0.5">
                    Informasi Pemutusan Sambungan Permanen (Tunggakan 5 Bulan)
                  </h3>
                </div>
              </div>

              <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
                <p>
                  Sambungan air atas nama <strong>{currentBill.nama}</strong> (ID: {currentBill.idPelanggan}) saat ini dalam status pemutusan tetap karena menunggak selama 5 bulan berturut-turut.
                </p>
                <div className="bg-white p-3.5 rounded-2xl border border-rose-200 text-xs space-y-1">
                  <strong className="text-rose-900 block">Panduan Re-Aktivasi Sambungan Baru:</strong>
                  <ol className="list-decimal pl-5 space-y-1 text-slate-600 text-xs">
                    <li>Melunasi tagihan tertunggak sebesar <strong>Rp {grandTotal.toLocaleString('id-ID')}</strong> di loket kas resmi atau via transfer.</li>
                    <li>Mengunjungi <strong>Kantor Pusat Curug</strong> atau <strong>Kantor Cabang Pasar Kemis</strong> untuk pendaftaran sambungan kembali.</li>
                    <li>Petugas akan menjadwalkan pemasangan kembali water meter resmi ke rumah Anda.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* MAIN BILL CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Header Card */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#005DAA] flex items-center justify-center shrink-0 border border-blue-100">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Rincian Tagihan Resmi PT Aetra Air Tangerang
                  </span>
                  <h3 className="text-base font-black text-slate-900">
                    Periode: {currentBill.periodeBulan}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                  currentBill.status === 'LUNAS'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}>
                  {currentBill.status === 'LUNAS' ? '✓ LUNAS' : '⏳ BELUM LUNAS'}
                </span>
              </div>
            </div>

            {/* Total Amount & Action to Upload Proof */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border-2 border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total Tagihan Yang Harus Dibayar
                  </span>
                  <div className="font-mono text-3xl sm:text-4xl font-black text-[#005DAA] tracking-tight">
                    Rp {grandTotal.toLocaleString('id-ID')},-
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-2 pt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Jatuh Tempo: <strong>{currentBill.tanggalJatuhTempo}</strong></span>
                  </div>
                </div>

                {/* Upload Bukti Pembayaran Button (Requirement 9) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Bukti Pembayaran</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyPaymentCode}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-white border border-blue-200 text-[#005DAA] text-xs font-bold hover:bg-blue-50 transition cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>Salin ID</span>
                  </button>
                </div>
              </div>

              {/* TABEL RINCIAN KOMPONEN BIAYA LENGKAP (REQUIREMENT 10) */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#005DAA]" />
                  <span>Rincian Komponen Biaya Tagihan</span>
                </h4>

                <div className="divide-y divide-slate-200 text-xs">
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-600">1. Pemakaian Air ({currentBill.pemakaianM3 || 18} m³):</span>
                    <strong className="text-slate-900 font-mono">Rp {biayaAirVal.toLocaleString('id-ID')}</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-600">2. Biaya Pemeliharaan Meter Air:</span>
                    <strong className="text-slate-900 font-mono">Rp {biayaPemeliharaanVal.toLocaleString('id-ID')}</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-600">3. Biaya Administrasi &amp; Pelayanan:</span>
                    <strong className="text-slate-900 font-mono">Rp {biayaAdminVal.toLocaleString('id-ID')}</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-600">4. Denda Keterlambatan / Tunggakan:</span>
                    <strong className={`font-mono ${dendaVal > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
                      Rp {dendaVal.toLocaleString('id-ID')}
                    </strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-600">5. Biaya Pembukaan Segel:</span>
                    <strong className="text-slate-900 font-mono">Rp {biayaBukaSegelVal.toLocaleString('id-ID')}</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-600">6. Biaya Lain-lain:</span>
                    <strong className="text-slate-900 font-mono">Rp {biayaLainnyaVal.toLocaleString('id-ID')}</strong>
                  </div>
                  <div className="pt-2.5 flex justify-between text-sm font-bold bg-blue-50/70 p-3 rounded-xl border border-blue-200">
                    <span className="text-[#005DAA]">Total Pembayaran Tagihan:</span>
                    <span className="text-[#005DAA] font-mono text-base font-black">
                      Rp {grandTotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* HISTORI STAND METER 12 BULAN TERAKHIR & GRAFIK TREND (REQUIREMENT 14 & 5) */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#005DAA] flex items-center justify-center">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                        Histori Stand Meter &amp; Grafik Tren Pemakaian Air
                      </h4>
                      <p className="text-xs text-slate-500">
                        Rekaman pembacaan meter dan volume konsumsi 12 bulan terakhir (1 Tahun)
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-[#005DAA] text-xs font-mono font-bold self-start sm:self-auto border border-blue-200">
                    Rata-rata: 16.8 m³ / bln
                  </span>
                </div>

                {/* VISUAL SVG & BAR TREND CHART */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-[#0c1830] text-white space-y-4 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-cyan-400" />
                      <span>Grafik Tren Konsumsi Air Bulanan (m³ / Bulan):</span>
                    </span>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-xs bg-cyan-400 inline-block" />
                        <span>Pemakaian Air</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 bg-amber-400 inline-block" />
                        <span>Garis Tren</span>
                      </span>
                    </div>
                  </div>

                  {/* High-Fidelity Chart Canvas */}
                  <div className="pt-6 pb-2">
                    <div className="h-44 w-full flex items-end justify-between gap-2 px-1 relative">
                      {/* Dotted Average Reference Line */}
                      <div className="absolute left-0 right-0 top-[35%] border-b border-dashed border-amber-400/40 pointer-events-none flex items-center justify-end pr-2">
                        <span className="text-[9px] font-mono text-amber-300/80 bg-slate-950/80 px-1.5 py-0.5 rounded-sm">
                          Rata-rata 16.8 m³
                        </span>
                      </div>

                      {standMeterHistory.slice().reverse().map((item, idx) => {
                        const maxUsage = 24;
                        const pct = Math.max(15, Math.min(100, Math.round((item.pemakaian / maxUsage) * 100)));
                        const isCurrentMonth = idx === standMeterHistory.length - 1;

                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group relative z-10">
                            {/* Value Badge above bar */}
                            <span className={`text-[10px] font-mono font-black transition duration-200 ${
                              isCurrentMonth
                                ? 'text-amber-400'
                                : 'text-cyan-300'
                            }`}>
                              {item.pemakaian}
                            </span>

                            {/* Gradient Bar */}
                            <div className="w-full max-w-[36px] bg-slate-800 rounded-t-lg overflow-hidden h-32 flex items-end">
                              <div
                                style={{ height: `${pct}%` }}
                                className={`w-full rounded-t-lg transition-all duration-500 shadow-md ${
                                  isCurrentMonth
                                    ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-amber-500/20'
                                    : 'bg-gradient-to-t from-blue-600 via-cyan-500 to-cyan-400 group-hover:from-[#F37021] group-hover:to-amber-400'
                                }`}
                                title={`${item.bulan}: ${item.pemakaian} m³ | Stand: ${item.standLalu} - ${item.standKini}`}
                              />
                            </div>

                            {/* Month Label */}
                            <span className={`text-[10px] font-bold truncate text-center ${
                              isCurrentMonth ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
                            }`}>
                              {item.bulan.split(' ')[0].slice(0, 3)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Stand Meter Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4 font-bold">Periode Bulan</th>
                        <th className="py-3 px-4 font-bold font-mono">Stand Lalu</th>
                        <th className="py-3 px-4 font-bold font-mono">Stand Kini</th>
                        <th className="py-3 px-4 font-bold font-mono text-[#005DAA]">Volume (m³)</th>
                        <th className="py-3 px-4 font-bold font-mono">Total Tagihan</th>
                        <th className="py-3 px-4 font-bold text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {standMeterHistory.map((row, i) => (
                        <tr key={i} className="hover:bg-blue-50/40 transition">
                          <td className="py-2.5 px-4 font-bold text-slate-800">{row.bulan}</td>
                          <td className="py-2.5 px-4 font-mono text-slate-600">{row.standLalu}</td>
                          <td className="py-2.5 px-4 font-mono text-slate-600">{row.standKini}</td>
                          <td className="py-2.5 px-4 font-mono font-black text-[#005DAA]">{row.pemakaian} m³</td>
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-900">Rp {row.tagihan.toLocaleString('id-ID')}</td>
                          <td className="py-2.5 px-4 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              row.status === 'Lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 9 Kanal Pembayaran Resmi */}
              <PaymentPartnersGrid
                paymentCode={currentBill.idPelanggan}
                totalAmount={grandTotal}
                title="Kanal Pembayaran Resmi PT Aetra Air Tangerang"
                subtitle={`Gunakan ID Pelanggan Anda (${currentBill.idPelanggan}) untuk pembayaran tagihan di kasir atau ATM/Mobile Banking:`}
              />
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Pengecekan tagihan dapat dilakukan setiap saat secara online.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Tagihan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL UPLOAD BUKTI PEMBAYARAN TAGIHAN BULANAN (REQUIREMENT 9) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 my-auto animate-in zoom-in-95 duration-200">
            <div className="bg-[#005DAA] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Upload className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-sm">Upload Bukti Pembayaran Tagihan</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                Tutup
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-200 space-y-1">
                <span className="text-slate-500 block text-[11px]">ID Pelanggan:</span>
                <strong className="text-base font-mono text-[#005DAA]">{currentBill?.idPelanggan}</strong>
                <span className="text-slate-500 block text-[11px] pt-1">Total Tagihan: <strong>Rp {grandTotal.toLocaleString('id-ID')}</strong></span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Kanal / Bank Pembayaran <span className="text-red-500">*</span>
                </label>
                <select
                  value={billProofData.bank}
                  onChange={(e) => setBillProofData({ ...billProofData, bank: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
                >
                  <option value="Bank BCA (Virtual Account)">Bank BCA (Virtual Account)</option>
                  <option value="Bank Mandiri (Bill Payment)">Bank Mandiri (Bill Payment)</option>
                  <option value="Bank BRI (BRIVA)">Bank BRI (BRIVA)</option>
                  <option value="Bank BNI (Virtual Account)">Bank BNI (Virtual Account)</option>
                  <option value="Indomaret / Alfamart">Indomaret / Alfamart</option>
                  <option value="Tokopedia / Shopee / E-Wallet">Tokopedia / Shopee / E-Wallet</option>
                  <option value="Kantor Pos Indonesia">Kantor Pos Indonesia</option>
                  <option value="Loket Resmi Aetra">Loket Resmi Aetra</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Tanggal Pembayaran <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={billProofData.tanggalBayar}
                  onChange={(e) => setBillProofData({ ...billProofData, tanggalBayar: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Foto Bukti Struk Pembayaran <span className="text-red-500">*</span>
                </label>

                {billProofData.fileUrl ? (
                  <div className="relative border rounded-xl overflow-hidden bg-slate-100 aspect-video flex items-center justify-center max-w-xs">
                    <img
                      src={billProofData.fileUrl}
                      alt="Struk"
                      className="max-h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setBillProofData({ ...billProofData, fileUrl: '' })}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCameraOpen(true)}
                      className="px-4 py-2.5 bg-blue-50 border border-blue-200 text-[#005DAA] rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-blue-100 transition cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Ambil Kamera</span>
                    </button>

                    <label className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>Pilih File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            setBillProofData((prev) => ({ ...prev, fileUrl: reader.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Catatan (Opsional)
                </label>
                <input
                  type="text"
                  value={billProofData.catatan}
                  onChange={(e) => setBillProofData({ ...billProofData, catatan: e.target.value })}
                  placeholder="Catatan pembayaran"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={!billProofData.fileUrl || isSubmittingBillProof}
                  onClick={handleConfirmBillPaymentProof}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmittingBillProof ? 'Menyimpan...' : 'Kirim Bukti Pembayaran'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Camera Capture Modal for Bill Proof */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl) => {
          setBillProofData((prev) => ({ ...prev, fileUrl: dataUrl }));
          setIsCameraOpen(false);
        }}
        title="Foto Struk Pembayaran Tagihan Rekening Air"
        guideType="payment"
      />

      {/* Lightbox Viewer */}
      <DocumentImageViewerModal
        isOpen={activeViewer.isOpen}
        onClose={() => setActiveViewer((prev) => ({ ...prev, isOpen: false }))}
        imageUrl={activeViewer.imageUrl}
        title={activeViewer.title}
        description={activeViewer.description}
      />
    </div>
  );
};
