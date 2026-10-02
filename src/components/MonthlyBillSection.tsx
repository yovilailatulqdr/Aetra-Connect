import React, { useState, useMemo, useEffect } from 'react';
import { UserAccount, RegistrationFormData, MonthlyBillRecord } from '../types';
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
  Flame,
  PhoneCall,
  ShieldAlert,
  Wrench,
  Ban,
  Timer
} from 'lucide-react';
import { PaymentPartnersGrid } from './PaymentPartnersGrid';
import { cloudSyncService, INITIAL_BILLS_DATA } from '../services/cloudSyncService';

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
  // Load bills from cloudSyncService / local storage
  const [bills, setBills] = useState<MonthlyBillRecord[]>(() => {
    if (externalBills && externalBills.length > 0) return externalBills;
    const local = cloudSyncService.getLocalSnapshot().bills;
    return local.length > 0 ? local : INITIAL_BILLS_DATA;
  });

  // Demo state switcher for presentation & user simulation
  const [demoState, setDemoState] = useState<DemoBillState>('NORMAL');

  // Listen to cloud updates
  useEffect(() => {
    const unsub = cloudSyncService.addListener(() => {
      const updated = cloudSyncService.getLocalSnapshot().bills;
      if (updated && updated.length > 0) {
        setBills(updated);
      }
    });
    return unsub;
  }, []);

  // Update when externalBills prop changes
  useEffect(() => {
    if (externalBills && externalBills.length > 0) {
      setBills(externalBills);
    }
  }, [externalBills]);

  // Default query to current logged-in customer's ID Pelanggan if available
  const [searchId, setSearchId] = useState<string>(() => {
    return currentUser?.idPelanggan || '10842918';
  });

  const [activeQuery, setActiveQuery] = useState<string>(() => {
    return currentUser?.idPelanggan || '10842918';
  });

  const [copiedCode, setCopiedCode] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Search result calculated
  const currentBill = useMemo(() => {
    if (!activeQuery.trim()) return null;
    const cleanQuery = activeQuery.trim().toLowerCase();

    // 1. Direct match in bills database by ID Pelanggan or No SR
    let found = bills.find(
      (b) =>
        b.idPelanggan.toLowerCase() === cleanQuery ||
        (b.noSr && b.noSr.toLowerCase() === cleanQuery)
    );

    if (!found) {
      // 2. Fallback match in registrations (create virtual bill if registered)
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
          noSr: regMatch.noSr || '168392',
          nama: regMatch.namaKtp,
          alamat: `${regMatch.alamatPasang || regMatch.alamatKtp} RT/RW ${regMatch.rtRwPasang || regMatch.rtRwKtp}`,
          golonganTarif: regMatch.golonganTarif || '2A1 - Rumah Tangga Standard (R2)',
          nomorMeter: regMatch.dataPasang?.noSeriMeter || 'AET-2609-001',
          periodeBulan: 'Maret 2026',
          tanggalJatuhTempo: '20 Maret 2026',
          standLalu: 0,
          standKini: 0,
          pemakaianM3: 0,
          rincianBlok: { blok1M3: 0, blok1Tarif: 0, blok1Total: 0, blok2M3: 0, blok2Tarif: 0, blok2Total: 0, blok3M3: 0, blok3Tarif: 0, blok3Total: 0 },
          biayaAir: 0,
          biayaPemeliharaanMeter: 12500,
          biayaAdministrasi: 5000,
          retribusi: 0,
          denda: 0,
          totalTagihan: 142600,
          status: 'BELUM LUNAS',
        };
      }
    }

    if (!found) return null;

    // Apply Demo Variations based on demoState
    if (demoState === 'WARNING_TEMPORARY_SEAL') {
      return {
        ...found,
        status: 'BELUM LUNAS' as const,
        periodeBulan: 'Februari & Maret 2026 (Tunggakan 1 Bulan)',
        totalTagihan: 284500,
        denda: 25000,
        tanggalJatuhTempo: '20 Februari 2026 (Lewat Jatuh Tempo)',
      };
    }

    if (demoState === 'DANGER_PERMANENT_DISCONNECT') {
      return {
        ...found,
        status: 'BELUM LUNAS' as const,
        periodeBulan: 'Akumulasi 5 Bulan (November 2025 - Maret 2026)',
        totalTagihan: 964200,
        denda: 150000,
        tanggalJatuhTempo: '20 November 2025 (Menunggak 5 Bulan)',
      };
    }

    return found;
  }, [activeQuery, bills, registrations, demoState]);

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

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Hero Header Banner */}
      <div className="bg-linear-to-r from-[#005DAA] via-[#004B8A] to-[#003868] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border-b-4 border-[#F37021]">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-100 text-xs font-semibold border border-white/20">
            <CreditCard className="w-3.5 h-3.5 text-[#F37021]" />
            <span>Layanan Mandiri Pelanggan Aetra</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Cek Tagihan Rekening Air
          </h1>

          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Cukup masukkan <strong>ID Pelanggan</strong> Anda di bawah ini untuk melihat total tagihan air, riwayat pembayaran, serta status penertiban sambungan.
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

        {/* Quick Sample IDs for Testing */}
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

      {/* ========================================================= */}
      {/* INTERACTIVE DEMO SCENARIO SWITCHER (FITUR SIMULASI SANKSI) */}
      {/* ========================================================= */}
      <div className="bg-slate-900 text-white p-4 rounded-3xl border border-slate-800 shadow-md space-y-2.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
              Simulasi Fitur Peringatan Keterlambatan &amp; Pemutusan (Demo Bar):
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Klik tombol di bawah untuk menguji simulasi status penertiban rekening air:
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Normal State */}
          <button
            type="button"
            onClick={() => setDemoState('NORMAL')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
              demoState === 'NORMAL'
                ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/40 shadow-sm'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <strong className="text-xs block font-bold">1. Status Normal / Lancar</strong>
              <span className="text-[10px] text-slate-400">Pembayaran bulan berjalan normal</span>
            </div>
          </button>

          {/* Demo 1: Belum Bayar Bulan Lalu (Peringatan Segel Sementara) */}
          <button
            type="button"
            onClick={() => setDemoState('WARNING_TEMPORARY_SEAL')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
              demoState === 'WARNING_TEMPORARY_SEAL'
                ? 'bg-amber-950/90 border-amber-400 text-amber-200 ring-2 ring-amber-500/40 shadow-sm'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
            <div>
              <strong className="text-xs block font-bold text-amber-300">2. Demo: Peringatan Segel (1 Bln)</strong>
              <span className="text-[10px] text-slate-400">Potensi Temporary Disconnection</span>
            </div>
          </button>

          {/* Demo 2: Menunggak 5 Bulan (Pemutusan Permanen) */}
          <button
            type="button"
            onClick={() => setDemoState('DANGER_PERMANENT_DISCONNECT')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
              demoState === 'DANGER_PERMANENT_DISCONNECT'
                ? 'bg-rose-950/90 border-rose-400 text-rose-200 ring-2 ring-rose-500/40 shadow-sm'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Ban className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <strong className="text-xs block font-bold text-rose-300">3. Demo: Pemutusan Permanen (5 Bln)</strong>
              <span className="text-[10px] text-slate-400">Permanent Disconnection &amp; Cabut Pipa</span>
            </div>
          </button>
        </div>
      </div>

      {/* Bill Result View */}
      {currentBill ? (
        <div className="space-y-6 animate-in zoom-in-95 duration-200 printable-slip">
          {/* ========================================================= */}
          {/* SANKSI BANNER 1: PERINGATAN SEGEL METER SEMENTARA         */}
          {/* ========================================================= */}
          {demoState === 'WARNING_TEMPORARY_SEAL' && (
            <div className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 p-5 sm:p-6 rounded-3xl shadow-lg border-2 border-amber-300 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-400/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-white px-2 py-0.5 rounded-full">
                      Peringatan Keterlambatan Pembayaran
                    </span>
                    <h3 className="text-base font-black text-slate-950 mt-0.5">
                      POTENSI SEGEL METER AIR SEMENTARA (TEMPORARY DISCONNECTION)
                    </h3>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 bg-slate-950 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-mono font-bold shadow-xs">
                  <Timer className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>Batas Waktu Pelunasan: 2x24 Jam</span>
                </div>
              </div>

              <div className="text-xs text-slate-900 space-y-2 leading-relaxed">
                <p>
                  Yth. Pelanggan <strong>{currentBill.nama} (ID: {currentBill.idPelanggan})</strong>, tagihan rekening air bulan lalu sebesar <strong>Rp {currentBill.totalTagihan.toLocaleString('id-ID')}</strong> belum terbayar dan telah melewati batas jatuh tempo tanggal 20.
                </p>
                <div className="bg-white/80 p-3.5 rounded-2xl border border-amber-300 space-y-1.5 font-medium text-slate-900">
                  <div className="font-bold flex items-center gap-1.5 text-amber-950">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Konsekuensi Prosedur Penertiban Aetra:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-800">
                    <li>Tim penertiban lapangan dijadwalkan memasang <strong>Segel Pengunci Kran Sementara (Segel Kuning/Merah)</strong> dalam 3x24 jam.</li>
                    <li>Pasokan aliran air akan dihentikan sementara hingga seluruh tunggakan dilunasi.</li>
                    <li>Segera lakukan pelunasan melalui gerai Indomaret, Alfamart, ATM atau Mobile Banking untuk pembukaan blokir otomatis tanpa denda tambahan.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SANKSI BANNER 2: PEMUTUSAN SAMBUNGAN PERMANEN (5 BULAN)   */}
          {/* ========================================================= */}
          {demoState === 'DANGER_PERMANENT_DISCONNECT' && (
            <div className="bg-linear-to-r from-red-950 via-rose-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-xl border-2 border-red-500 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md animate-pulse">
                    <Ban className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-red-600 text-white px-2.5 py-0.5 rounded-full">
                      STATUS KRITIS PENERTIBAN HUKUM
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-red-200 mt-0.5">
                      PEMUTUSAN SAMBUNGAN PERMANEN (PERMANENT DISCONNECTION)
                    </h3>
                  </div>
                </div>

                <div className="bg-red-900/80 text-red-200 px-3 py-1.5 rounded-xl text-xs font-bold border border-red-600/60 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>Menunggak 5 Bulan Berturut-turut</span>
                </div>
              </div>

              <div className="text-xs text-red-100 space-y-3 leading-relaxed">
                <p>
                  Berdasarkan Peraturan Pelayanan Pelanggan PT Aetra Air Tangerang, permohonan sambungan air atas nama <strong>{currentBill.nama}</strong> dengan ID Pelanggan <strong>{currentBill.idPelanggan}</strong> telah diterbitkan <strong>Surat Ketetapan Pemutusan Sambungan Permanen</strong> akibat tunggakan 5 bulan berturut-turut.
                </p>

                <div className="bg-white/10 p-4 rounded-2xl border border-red-500/50 space-y-2">
                  <span className="text-[10px] font-black uppercase text-red-300 tracking-wider block">
                    Tindakan Penertiban Operasional:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div className="bg-black/30 p-2.5 rounded-xl border border-red-800/50 space-y-1">
                      <strong className="text-red-300 block">1. Pembongkaran Pipa Dinas</strong>
                      <span className="text-slate-300">Pipa dinas telah dicabut dan diputus total dari pipa distribusi utama.</span>
                    </div>
                    <div className="bg-black/30 p-2.5 rounded-xl border border-red-800/50 space-y-1">
                      <strong className="text-red-300 block">2. Penarikan Water Meter SNI</strong>
                      <span className="text-slate-300">Meteran air dan nomor segel telah ditarik ke gudang operasional kantor Aetra.</span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-900/40 p-3.5 rounded-2xl border border-red-700/60 text-[11px] text-red-200 space-y-1">
                  <span className="font-bold text-red-300 block">Syarat Permohonan Penyambungan Kembali (Re-aktivasi):</span>
                  <ol className="list-decimal list-inside space-y-0.5 text-slate-200">
                    <li>Melunasi seluruh akumulasi tunggakan 5 bulan (Rp 964.200,-) beserta denda keterlambatan di Loket Kas Resmi.</li>
                    <li>Datang langsung ke <strong>Kantor Pusat Curug</strong> atau <strong>Kantor Cabang Pasar Kemis</strong> untuk mengajukan permohonan pemasangan baru (Re-registrasi).</li>
                    <li>Membayar biaya buka segel / biaya instalasi baru sesuai ketentuan golongan tarif.</li>
                  </ol>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="tel:0215985474"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black shadow-md transition"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Hubungi Loket Kasir Penertiban: (021) 598 5474</span>
                </a>
              </div>
            </div>
          )}

          {/* Main Card: Ringkasan Tagihan */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
            {/* Card Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#005DAA] flex items-center justify-center shrink-0 border border-blue-100">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Informasi Tagihan Resmi PT Aetra Air Tangerang
                  </span>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    Rekening Periode: {currentBill.periodeBulan}
                  </h3>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                {demoState === 'DANGER_PERMANENT_DISCONNECT' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-black border border-red-300 shadow-xs">
                    <Ban className="w-4 h-4 text-red-600" />
                    PUTUS PERMANEN (5 BULAN)
                  </span>
                ) : demoState === 'WARNING_TEMPORARY_SEAL' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black border border-amber-300 shadow-xs animate-pulse">
                    <Lock className="w-4 h-4 text-amber-700" />
                    MENUNGGU PELUNASAN (PERINGATAN SEGEL)
                  </span>
                ) : currentBill.status === 'LUNAS' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    LUNAS
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black border border-amber-300 shadow-xs animate-pulse">
                    <Clock className="w-4 h-4 text-amber-700" />
                    BELUM LUNAS
                  </span>
                )}
              </div>
            </div>

            {/* Bill Details Content */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Highlight Amount Banner */}
              <div className="p-5 sm:p-6 rounded-2xl bg-linear-to-r from-blue-50 via-sky-50 to-indigo-50/60 border-2 border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total Tagihan Rekening Air
                  </span>
                  <div className="font-mono text-3xl sm:text-4xl font-black text-[#005DAA] tracking-tight">
                    Rp {currentBill.totalTagihan.toLocaleString('id-ID')},-
                  </div>
                  <div className="flex items-center gap-2 pt-1 text-xs text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Jatuh Tempo: <strong>{currentBill.tanggalJatuhTempo}</strong></span>
                  </div>
                </div>

                {/* ID Pelanggan / Payment Code Box */}
                <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs space-y-1.5 shrink-0 min-w-[220px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Kode Bayar (ID Pelanggan):
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPaymentCode}
                      className="text-xs text-[#005DAA] font-bold hover:underline inline-flex items-center gap-1"
                      title="Salin ID Pelanggan"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Disalin' : 'Salin'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-xl sm:text-2xl font-black text-slate-900 tracking-wider">
                    {currentBill.idPelanggan}
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Gunakan nomor ini di kasir / ATM / mobile banking
                  </span>
                </div>
              </div>

              {/* Customer Info Grid */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                    Nama Pelanggan
                  </span>
                  <strong className="text-slate-900 text-sm block mt-0.5">
                    {currentBill.nama}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                    No. Sambungan (SR)
                  </span>
                  <span className="font-mono font-bold text-slate-800 text-sm block mt-0.5">
                    {currentBill.noSr || '-'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                    Golongan Tarif
                  </span>
                  <span className="text-slate-800 font-medium block mt-0.5">
                    {currentBill.golonganTarif || 'Rumah Tangga'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                    Status Rekening
                  </span>
                  <span className={`font-bold block mt-0.5 ${currentBill.status === 'LUNAS' && demoState === 'NORMAL' ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {currentBill.status === 'LUNAS' && demoState === 'NORMAL' ? '✓ Sudah Dibayar' : '⏳ Belum Dibayar'}
                  </span>
                </div>

                <div className="sm:col-span-2 lg:col-span-4 pt-2 border-t border-slate-200">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                    Alamat Pemasangan
                  </span>
                  <span className="text-slate-700 font-medium block mt-0.5 leading-relaxed">
                    {currentBill.alamat || 'Wilayah Pelayanan PT Aetra Air Tangerang'}
                  </span>
                </div>
              </div>

              {/* Payment Proof Details if already paid */}
              {currentBill.status === 'LUNAS' && demoState === 'NORMAL' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-emerald-950 block">
                      Bukti Pembayaran Rekening Air Sah
                    </span>
                    <p className="leading-relaxed text-emerald-800">
                      Tagihan bulan ini telah lunas pada <strong>{currentBill.tanggalBayar || '15 Maret 2026'}</strong> melalui <strong>{currentBill.metodeBayar || 'Mitra Resmi PT Aetra'}</strong>.
                    </p>
                    {currentBill.noReferensi && (
                      <span className="text-[11px] font-mono text-emerald-700 block">
                        No. Referensi Transaksi: {currentBill.noReferensi}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Warning Notice: Dilarang Bayar Tunai */}
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-red-900">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-black text-red-950 uppercase tracking-wide block">
                    Peringatan Resmi Pembayaran:
                  </span>
                  <p className="leading-relaxed text-red-800">
                    Dilarang keras melakukan pembayaran tunai kepada petugas lapangan manapun. Pembayaran hanya sah dilakukan melalui 9 Mitra External Payment Point resmi PT Aetra Air Tangerang menggunakan ID Pelanggan (<strong>{currentBill.idPelanggan}</strong>) Anda.
                  </p>
                </div>
              </div>

              {/* Official 9 Payment Partners Grid */}
              <div className="pt-2">
                <PaymentPartnersGrid
                  paymentCode={currentBill.idPelanggan}
                  totalAmount={currentBill.totalTagihan}
                  title="9 Mitra External Payment Point Resmi PT Aetra"
                  subtitle={`Gunakan ID Pelanggan Anda (${currentBill.idPelanggan}) untuk pelunasan tagihan melalui gerai, ATM, atau mobile banking mitra berikut:`}
                />
              </div>
            </div>

            {/* Footer Slip Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
              <span className="text-xs text-slate-500">
                Simpan nomor ID Pelanggan Anda untuk pengecekan berkala setiap bulan.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Bukti Tagihan</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#005DAA] hover:bg-[#004A88] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty / Not Found State */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <Search className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Data Tagihan Tidak Ditemukan
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tidak ada data tagihan untuk ID Pelanggan <strong className="font-mono text-slate-800">"{activeQuery}"</strong>. Pastikan nomor ID Pelanggan yang Anda masukkan sudah benar.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setSearchId('10842918');
                setActiveQuery('10842918');
              }}
              className="px-4 py-2 bg-blue-50 text-[#005DAA] rounded-xl text-xs font-bold hover:bg-blue-100 transition"
            >
              Coba ID Demo #10842918
            </button>

            {onNavigateToRegister && (
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="px-4 py-2 bg-[#005DAA] text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition"
              >
                Daftar Sambungan Baru
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
