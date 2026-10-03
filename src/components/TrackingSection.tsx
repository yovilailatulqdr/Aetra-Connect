import React, { useState, useEffect, useMemo } from 'react';
import { CustomerTrackingRecord, RegistrationFormData } from '../types';
import { 
  Check, 
  Clock, 
  MessageCircle, 
  MapPin, 
  Phone, 
  AlertCircle,
  Sparkles,
  Package,
  Droplets,
  CreditCard,
  UserCheck,
  Compass,
  FileCheck2,
  Calendar,
  ShieldCheck,
  Receipt,
  Wrench,
  Gauge
} from 'lucide-react';

interface TrackingSectionProps {
  trackingRecords: CustomerTrackingRecord[];
  registrations?: RegistrationFormData[];
  activeFormNumber?: string;
  onSelectCustomer?: (noForm: string) => void;
  onUpdateTrackingStep?: (noForm: string, nextStep: 1 | 2 | 3 | 4 | 5) => void;
  onNavigateToRegister?: () => void;
  onQuickDemoRegister?: () => void;
  onNavigateToAdmin?: (noForm?: string) => void;
}

export const TrackingSection: React.FC<TrackingSectionProps> = ({
  trackingRecords,
  registrations = [],
  activeFormNumber = '',
  onSelectCustomer,
  onUpdateTrackingStep,
  onNavigateToRegister,
  onQuickDemoRegister,
  onNavigateToAdmin,
}) => {
  // Selected record: match activeFormNumber or first record in trackingRecords
  const [selectedRecord, setSelectedRecord] = useState<CustomerTrackingRecord | null>(() => {
    if (activeFormNumber) {
      const match = trackingRecords.find((r) => r.noForm === activeFormNumber);
      if (match) return match;
    }
    return trackingRecords.length > 0 ? trackingRecords[0] : null;
  });

  // Keep state in sync when trackingRecords or activeFormNumber change
  useEffect(() => {
    if (trackingRecords.length === 0) {
      setSelectedRecord(null);
      return;
    }

    if (activeFormNumber) {
      const match = trackingRecords.find((r) => r.noForm === activeFormNumber);
      if (match) {
        setSelectedRecord(match);
        return;
      }
    }

    setSelectedRecord(trackingRecords[0]);
  }, [activeFormNumber, trackingRecords]);

  const handleSelectCustomerRecord = (record: CustomerTrackingRecord) => {
    setSelectedRecord(record);
    if (onSelectCustomer) {
      onSelectCustomer(record.noForm);
    }
  };

  // Status badge config
  const getStepStatusBadge = (step: 1 | 2 | 3 | 4 | 5) => {
    switch (step) {
      case 1:
        return {
          label: 'Tahap 1: Verifikasi Berkas',
          badgeClass: 'bg-blue-50 text-[#005DAA] border-blue-200',
          desc: 'Formulir diterima, proses verifikasi identitas e-KTP & survei teknis pipa',
        };
      case 2:
        return {
          label: 'Tahap 2: Menunggu Pembayaran',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
          desc: 'Nomor pembayaran telah diterbitkan, menunggu pelunasan biaya sambungan',
        };
      case 3:
        return {
          label: 'Tahap 3: SPKO & Pengerjaan Pipa Dinas',
          badgeClass: 'bg-orange-50 text-[#F37021] border-orange-200',
          desc: 'Tahap pengerjaan dari kontraktor untuk pipa dinas dan galian persil',
        };
      case 4:
        return {
          label: 'Tahap 4: Proses Pemasangan Meteran',
          badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          desc: 'Teknisi memasang water meter dan segel kran resmi di persil rumah',
        };
      case 5:
        return {
          label: 'Tahap 5: Sambungan Aktif & Air Mengalir',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          desc: 'Pemasangan rampung, meter aktif dan air bersih resmi mengalir 24 jam',
        };
      default:
        return {
          label: 'Dalam Proses',
          badgeClass: 'bg-slate-50 text-slate-700 border-slate-200',
          desc: 'Sedang dalam penanganan administrasi Aetra',
        };
    }
  };

  // =========================================================
  // EMPTY STATE: No registered connections yet
  // =========================================================
  if (trackingRecords.length === 0 || !selectedRecord) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-slate-900">
                Tracking Sambungan Baru
              </h2>
              <span className="relative flex h-2.5 w-2.5" title="Status Real-Time">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Lacak progres pemasangan sambungan air bersih PT Aetra Air Tangerang secara real-time dari pendaftaran hingga air bersih mengalir ke rumah Anda.
            </p>
          </div>
        </div>

        {/* Empty State Card */}
        <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-xs text-center max-w-2xl mx-auto space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-blue-50 text-[#005DAA] border border-blue-100 flex items-center justify-center mx-auto shadow-xs">
            <Package className="w-10 h-10 stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">
              Belum Ada Sambungan Baru yang Terdaftar
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Data pelacakan sambungan baru Anda akan otomatis tampil di sini begitu Anda mengirimkan Formulir Pendaftaran Sambungan Baru.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-left pt-2">
            {[
              { num: 1, title: 'Verifikasi', desc: 'Identitas & Dokumen' },
              { num: 2, title: 'Pembayaran', desc: 'Konfirmasi Biaya' },
              { num: 3, title: 'SPKO & Pipa', desc: 'Pengerjaan Dinas' },
              { num: 4, title: 'Pasang Meter', desc: 'Meteran & Segel' },
              { num: 5, title: 'Air Mengalir', desc: 'Siap Digunakan' },
            ].map((s) => (
              <div key={s.num} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="w-6 h-6 rounded-full bg-[#005DAA] text-white flex items-center justify-center font-bold text-[11px] mb-2">
                  {s.num}
                </span>
                <span className="font-bold text-slate-800 block text-[11px]">{s.title}</span>
                <span className="text-[10px] text-slate-500">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // ACTIVE STATE: Tracking Data Available
  // =========================================================
  const currentStatus = getStepStatusBadge(selectedRecord.currentStep);
  const customerDisplayName = selectedRecord.nama.split('/')[0].trim();
  const progressPercent = Math.round((selectedRecord.currentStep / 5) * 100);

  const matchingReg = registrations.find(
    (r) =>
      r.noForm === selectedRecord.noForm ||
      (selectedRecord.idPelanggan && r.idPelanggan === selectedRecord.idPelanggan)
  );

  const surveyorName = matchingReg?.dataPasang?.namaSales?.trim() || selectedRecord.petugasSurveyor?.nama || 'Bpk. Hendra Gunawan';
  const surveyorId = matchingReg?.dataPasang?.noWorkOrder?.trim() ? `SRV-${matchingReg.dataPasang.noWorkOrder.trim()}` : (selectedRecord.petugasSurveyor?.id || 'SRV-042');
  const teknisiName = matchingReg?.dataPasang?.namaTeknisi?.trim() || matchingReg?.dataPasang?.namaKontraktor?.trim() || selectedRecord.petugasTeknisi?.nama || 'Bpk. Ahmad Syafiq';
  const teknisiId = selectedRecord.petugasTeknisi?.id || 'TKN-AET-018';
  const petugasPhone = matchingReg?.dataPasang?.telpPetugas?.trim() || selectedRecord.petugasTeknisi?.telp || '0877-8822-4645';
  const cleanPhone = petugasPhone.replace(/\D/g, '').replace(/^0/, '62');
  const displayMeter = matchingReg?.dataPasang?.noSeriMeter?.trim() || selectedRecord.nomorMeter;
  const displaySegel = matchingReg?.dataPasang?.noSegel?.trim() || selectedRecord.nomorSegel;
  const displayPanjangPipa = matchingReg?.dataPasang?.panjangPipa?.trim()
    ? `${matchingReg.dataPasang.panjangPipa} Meter (${matchingReg.dataPasang.panjangPipaTipe || 'HDPE PE-100'})`
    : (selectedRecord.panjangPipaDinas || '6 Meter (Standar)');

  const milestones = [
    {
      step: 1,
      title: 'Tahap 1: Verifikasi Berkas & Administrasi',
      subtitle: 'Pengecekan Identitas e-KTP & Lokasi Persil',
      description: `Formulir permohonan sambungan baru (SR: ${selectedRecord.noSr}) berhasil didaftarkan dan berkas identitas pemohon telah diverifikasi lengkap oleh Petugas Administrasi Aetra.`,
      date: selectedRecord.tanggalDaftar || '21 Sep 2026',
      time: '09:15 WIB',
      actor: `Petugas Verifikator Administrasi (${surveyorName})`,
      isCompleted: selectedRecord.currentStep > 1,
      isCurrent: selectedRecord.currentStep === 1,
    },
    {
      step: 2,
      title: 'Tahap 2: Persetujuan Teknis & Konfirmasi Pembayaran',
      subtitle: 'Nomor Pembayaran Diterbitkan & Pelunasan Biaya',
      description: `Nomor Pembayaran diterbitkan. Pembayaran biaya sambungan baru sebesar Rp ${(selectedRecord.biayaSambungan || 1371545).toLocaleString('id-ID')} telah dikonfirmasi sah oleh Bagian Keuangan AETRA.`,
      date: selectedRecord.tanggalDaftar || '21 Sep 2026',
      time: '14:20 WIB',
      actor: 'Kasir & Keuangan PT Aetra Air Tangerang',
      isCompleted: selectedRecord.currentStep > 2,
      isCurrent: selectedRecord.currentStep === 2,
    },
    {
      step: 3,
      title: 'Tahap 3: Penerbitan SPKO & Pekerjaan Pipa Dinas (Kontraktor)',
      subtitle: 'Penyambungan Pipa Dinas ke Jaringan Distribusi Utama',
      description: `Surat Perintah Kerja Operasional (SPKO) diterbitkan. Tahap pengerjaan dari kontraktor mitra resmi Aetra untuk penarikan pipa dinas dan galian jalur sambungan persil.`,
      date: selectedRecord.tanggalDaftar || '22 Sep 2026',
      time: '10:00 WIB',
      actor: `Kontraktor Rekanan Aetra (${teknisiName})`,
      isCompleted: selectedRecord.currentStep > 3,
      isCurrent: selectedRecord.currentStep === 3,
    },
    {
      step: 4,
      title: 'Tahap 4: Proses Pemasangan Meteran',
      subtitle: 'Instalasi Water Meter SNI & Pemasangan Segel Resmi',
      description: `Pekerjaan proses pemasangan meteran pelanggan (${displayMeter || 'AET-2026-84720'}) dan penguncian segel kran resmi (${displaySegel || 'SGL-AAT-88192'}) di persil rumah selesai dilaksanakan.`,
      date: selectedRecord.tanggalDaftar || '24 Sep 2026',
      time: '13:45 WIB',
      actor: `Teknisi Pemasangan Meter (${teknisiName})`,
      isCompleted: selectedRecord.currentStep > 4,
      isCurrent: selectedRecord.currentStep === 4,
    },
    {
      step: 5,
      title: 'Tahap 5: Air Bersih Mengalir & Sambungan Aktif',
      subtitle: 'Uji Tekanan Aliran & Aktivasi ID Pelanggan Tetap',
      description: `Uji coba tekanan dan debit air minum telah lulus uji standar Permenkes No. 2/2023. Air bersih resmi mengalir lancar 24 jam dan sambungan aktif.`,
      date: selectedRecord.estimasiSelesai || '26 Sep 2026',
      time: '15:30 WIB',
      actor: 'Pengawas Distribusi PT Aetra Air Tangerang',
      isCompleted: selectedRecord.currentStep >= 5,
      isCurrent: selectedRecord.currentStep === 5,
    },
  ].filter((item) => item.step <= selectedRecord.currentStep);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner with SINGLE Clean SLA Highlight */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Live Tracking Sambungan Baru
            </h2>
            <span className="relative flex h-2.5 w-2.5" title="Status Real-Time">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Pantau progres tahapan penyambungan air bersih Anda secara transparan dan akurat.
          </p>
        </div>

        {/* SATU-SATUNYA ESTIMASI PENGERJAAN RESMI */}
        <div className="bg-blue-50 border-2 border-blue-200 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-2xs">
          <Calendar className="w-5 h-5 text-[#005DAA] shrink-0" />
          <div className="text-xs leading-tight">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Maksimal Estimasi Pengerjaan:</span>
            <strong className="text-[#005DAA] font-black text-xs sm:text-sm">14 &ndash; 30 Hari Kerja</strong>
          </div>
        </div>
      </div>

      {/* Switcher ONLY if customer has multiple registrations in their own session */}
      {trackingRecords.length > 1 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0">
            Pilih Sambungan Anda:
          </span>
          {trackingRecords.map((rec) => {
            const isSelected = selectedRecord.noForm === rec.noForm;
            return (
              <button
                key={rec.noForm}
                type="button"
                onClick={() => handleSelectCustomerRecord(rec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 border-blue-400 text-[#005DAA] shadow-xs ring-1 ring-[#005DAA]'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>#{rec.noForm}</span>
                <span className="text-slate-400">&bull;</span>
                <span className="max-w-[140px] truncate">{rec.alamat.split(',')[0]}</span>
                {rec.currentStep === 5 ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* ORDER SUMMARY & STEPPER                                   */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        {/* Top Header Card */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                ID Pelanggan:
              </span>
              <span className="font-mono text-sm font-black text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {selectedRecord.idPelanggan || ('10' + (selectedRecord.noForm || '123456').replace(/\D/g, '').padEnd(6, '0'))}
              </span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider ml-2">
                No. Form:
              </span>
              <span className="font-mono text-xs font-bold text-[#005DAA] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                #{selectedRecord.noForm}
              </span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider ml-2">
                No. SR:
              </span>
              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                {selectedRecord.noSr}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              {customerDisplayName}
            </h3>

            <p className="text-xs text-slate-600 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#F37021] shrink-0" />
              <span>{selectedRecord.alamat}</span>
            </p>
          </div>

          {/* Current Status Badge */}
          <div className="flex flex-col sm:items-end gap-1.5">
            <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold ${currentStatus.badgeClass}`}>
              <span className="w-2 h-2 rounded-full bg-current animate-ping" />
              {currentStatus.label}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {selectedRecord.tanggalDaftar ? `Tgl Daftar: ${selectedRecord.tanggalDaftar}` : 'Terdaftar di sistem Aetra'}
            </span>
          </div>
        </div>

        {/* 5-Step Visual Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5 text-blue-900 font-bold">
              <Compass className="w-4 h-4 text-[#005DAA]" />
              5 Tahapan Pemasangan Sambungan Air
            </span>
            <span className="font-mono text-[#005DAA] font-bold">
              Progres: {progressPercent}% ({selectedRecord.currentStep} dari 5 Tahap)
            </span>
          </div>

          {/* Progress Bar Line */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-5">
            <div 
              className="bg-gradient-to-r from-[#005DAA] via-[#0080FF] to-[#F37021] h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* 5 Step Interactive Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              {
                stepNum: 1,
                title: '1. Verifikasi Berkas',
                desc: 'Identitas & Dokumen KTP',
                completed: (selectedRecord.currentStep || 1) >= 1,
                isCurrent: (selectedRecord.currentStep || 1) === 1,
              },
              {
                stepNum: 2,
                title: '2. Pembayaran Biaya',
                desc: 'Pelunasan Biaya Pasang',
                completed: (selectedRecord.currentStep || 1) >= 2,
                isCurrent: (selectedRecord.currentStep || 1) === 2,
              },
              {
                stepNum: 3,
                title: '3. SPKO & Pipa Dinas',
                desc: 'Pekerjaan Pipa Kontraktor',
                completed: (selectedRecord.currentStep || 1) >= 3,
                isCurrent: (selectedRecord.currentStep || 1) === 3,
              },
              {
                stepNum: 4,
                title: '4. Proses Pemasangan Meteran',
                desc: 'Instalasi Meter & Segel',
                completed: (selectedRecord.currentStep || 1) >= 4,
                isCurrent: (selectedRecord.currentStep || 1) === 4,
              },
              {
                stepNum: 5,
                title: '5. Air Mengalir',
                desc: 'Sambungan Aktif 24 Jam',
                completed: (selectedRecord.currentStep || 1) >= 5,
                isCurrent: (selectedRecord.currentStep || 1) === 5,
              },
            ].map((item) => (
              <div
                key={item.stepNum}
                className={`p-3.5 rounded-2xl border transition ${
                  item.isCurrent
                    ? 'bg-blue-50/90 border-[#005DAA] shadow-xs ring-2 ring-blue-300'
                    : item.completed
                    ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    item.completed && !item.isCurrent
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : item.isCurrent
                      ? 'bg-[#005DAA] text-white animate-pulse shadow-2xs'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {item.completed && !item.isCurrent ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : item.stepNum}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {item.completed ? 'Selesai' : item.isCurrent ? 'Proses' : 'Menunggu'}
                  </span>
                </div>
                <div className={`text-xs font-bold ${item.isCurrent ? 'text-blue-950' : item.completed ? 'text-emerald-950' : 'text-slate-600'}`}>
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Display notes if present */}
        {selectedRecord.adminNotes && (
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-[#F37021] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-amber-950">Catatan Petugas Lapangan:</span>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">{selectedRecord.adminNotes}</p>
            </div>
          </div>
        )}
      </div>

      {/* TWO COLUMNS: REAL-TIME TIMELINE LOGS & FIELD OFFICER CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: REAL-TIME TIMELINE */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#005DAA]" />
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Riwayat Aktivitas &amp; Log Pemasangan
                </h4>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Waktu Indonesia Barat (WIB)
              </span>
            </div>

            {/* Timeline Feed */}
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {milestones.map((milestone) => (
                <div key={milestone.step} className="relative group">
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                      milestone.isCompleted
                        ? 'bg-emerald-500 border-emerald-100 text-white'
                        : milestone.isCurrent
                        ? 'bg-[#005DAA] border-blue-200 text-white shadow-xs animate-pulse'
                        : 'bg-slate-100 border-slate-300 text-slate-400'
                    }`}
                  >
                    {milestone.isCompleted ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : milestone.isCurrent ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    )}
                  </div>

                  <div
                    className={`p-4 rounded-2xl border transition space-y-1.5 text-xs ${
                      milestone.isCurrent
                        ? 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-300'
                        : milestone.isCompleted
                        ? 'bg-slate-50 group-hover:bg-blue-50/30 border-slate-200'
                        : 'bg-slate-50/40 border-slate-200/50 opacity-70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                        <span>{milestone.title}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            milestone.isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : milestone.isCurrent
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {milestone.isCompleted
                            ? 'Selesai'
                            : milestone.isCurrent
                            ? 'Sedang Berjalan'
                            : 'Tahap Berikutnya'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {milestone.date} &bull; {milestone.time}
                      </span>
                    </div>

                    <p className="text-slate-600 leading-relaxed text-xs">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4 text-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Droplets className="w-4 h-4 text-[#005DAA]" />
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Spesifikasi Teknis Sambungan
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 text-[11px] block">Nomor Seri Meter Air</span>
                <span className="font-mono font-bold text-slate-900 text-xs">
                  {displayMeter || (selectedRecord.currentStep >= 3 ? 'AET-2026-84720' : 'Menunggu Pemasangan Fisik')}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 text-[11px] block">Nomor Segel Kran Resmi</span>
                <span className="font-mono font-bold text-slate-900 text-xs">
                  {displaySegel || (selectedRecord.currentStep >= 4 ? 'SGL-AAT-99120' : 'Menunggu Uji Pengaliran')}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 text-[11px] block">Panjang Pipa Dinas</span>
                <span className="font-bold text-slate-900 text-xs">
                  {displayPanjangPipa}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 text-[11px] block">Golongan Tarif Resmi</span>
                <span className="font-bold text-[#005DAA] text-xs">
                  {selectedRecord.golonganTarif || 'R2 = Rumah Tangga 2'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FIELD OFFICER & PAYMENT INFO */}
        <div className="lg:col-span-5 space-y-6">
          {/* Petugas Lapangan Ditugaskan */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Petugas Lapangan Aetra
                </h4>
              </div>
              <span className="text-[10px] text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full font-bold border border-blue-200">
                Resmi AAT
              </span>
            </div>

            {/* Teknisi Pemasangan */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#005DAA] text-white font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                  {teknisiName.slice(0, 3).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-900 truncate">
                      {teknisiName}
                    </h5>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Instalatur Resmi
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {selectedRecord.petugasTeknisi?.role || 'Teknisi Pipa Dinas & Water Meter'}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400">
                    ID: {teknisiId}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                <a
                  href={`https://wa.me/${cleanPhone}?text=Halo%20${encodeURIComponent(teknisiName)},%20saya%20pemilik%20No.%20Form%20${selectedRecord.noForm}%20ingin%20konfirmasi%20jadwal%20pemasangan%20sambungan%20air.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  Chat WhatsApp
                </a>
                <a
                  href={`tel:${petugasPhone.replace(/[^\d+]/g, '')}`}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Telepon
                </a>
              </div>
            </div>

            {/* Surveyor Wilayah */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Surveyor Teknis Wilayah:</span>
                <span className="font-bold text-slate-800">
                  {surveyorName}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">
                {surveyorId}
              </span>
            </div>
          </div>

          {/* Kontak Bantuan Pelanggan */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-3 text-xs">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-[#005DAA]" />
              <span>Contact Center 24 Jam Resmi</span>
            </h4>
            <div className="space-y-1.5 text-slate-600 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span>Call Center:</span>
                <a href="tel:0215985474" className="font-bold text-[#005DAA]">(021) 598 5474</a>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span>WhatsApp:</span>
                <a href="https://wa.me/6287788224645" target="_blank" rel="noreferrer" className="font-bold text-emerald-600">0877 8822 4645</a>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span>Email Resmi:</span>
                <span className="font-mono text-slate-800">pengaduan@aetratangerang.co.id</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
