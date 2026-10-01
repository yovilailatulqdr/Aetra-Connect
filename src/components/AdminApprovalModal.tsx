import React, { useState } from 'react';
import { RegistrationFormData } from '../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  CreditCard, 
  Copy, 
  Check, 
  Building2, 
  User, 
  MapPin, 
  Calendar, 
  AlertCircle,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';

interface AdminApprovalModalProps {
  isOpen: boolean;
  record: RegistrationFormData | null;
  onClose: () => void;
  onApprove: (noForm: string, nomorPembayaran: string, biayaSambungan: number, adminNotes?: string) => void;
  onReject: (noForm: string, reason: string) => void;
}

export const AdminApprovalModal: React.FC<AdminApprovalModalProps> = ({
  isOpen,
  record,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!isOpen || !record) return null;

  // Generate suggested 12-digit Virtual Account / Nomor Pembayaran
  // Format standard: 88290 + 6 digit number
  const defaultNoBayar = record.nomorPembayaran || record.nomor_pembayaran || (
    '88290' + (record.idPelanggan ? record.idPelanggan.replace(/\D/g, '').slice(-7) : Math.floor(1000000 + Math.random() * 9000000))
  );

  const [nomorPembayaran, setNomorPembayaran] = useState<string>(defaultNoBayar);
  const [biayaSambungan, setBiayaSambungan] = useState<number>(record.biayaSambungan || 1371545);
  const [adminNotes, setAdminNotes] = useState<string>('Berkas identitas pemohon dan survei kelayakan teknis jaringan telah disetujui oleh Petugas Administrasi.');
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('Kelengkapan berkas KTP/PBB tidak sesuai dengan alamat persil pemasangan.');
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerateNewNo = () => {
    const newNo = '88290' + Math.floor(1000000 + Math.random() * 9000000);
    setNomorPembayaran(newNo);
  };

  const handleCopyNo = () => {
    navigator.clipboard.writeText(nomorPembayaran);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmApprove = () => {
    if (!nomorPembayaran.trim()) {
      alert('Nomor pembayaran wajib diisi.');
      return;
    }
    onApprove(record.noForm, nomorPembayaran.trim(), Number(biayaSambungan), adminNotes);
    onClose();
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      alert('Mohon masukkan alasan penolakan.');
      return;
    }
    onReject(record.noForm, rejectReason.trim());
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-blue-100 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-5 text-white flex items-start justify-between gap-3 border-b-4 ${
          isRejecting
            ? 'bg-linear-to-r from-red-700 via-rose-800 to-slate-900 border-red-500'
            : 'bg-linear-to-r from-[#005DAA] via-[#004B8A] to-[#003868] border-[#F37021]'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs border border-white/20">
              {isRejecting ? <XCircle className="w-6 h-6 text-red-200" /> : <ShieldCheck className="w-6 h-6 text-emerald-300" />}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-white">
                {isRejecting ? 'Penolakan / Revisi Permohonan' : 'Verifikasi & Approval Petugas'}
              </span>
              <h3 className="text-base sm:text-lg font-black tracking-tight mt-0.5">
                {isRejecting ? 'Tolak / Batalkan Pendaftaran' : 'Persetujuan Sambungan Baru & Nomor Pembayaran'}
              </h3>
              <p className="text-xs text-white/80 mt-0.5">
                No. Form: #{record.noForm} &bull; No. SR: {record.noSr || '-'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Summary Pelanggan */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Nama Pemohon (KTP)</span>
                <strong className="text-slate-900 text-sm block">{record.namaKtp}</strong>
                <span className="text-[11px] text-slate-500 block">NIK: {record.noKtp} &bull; WA: {record.telpHp}</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Lokasi Pemasangan</span>
                <p className="text-slate-800 text-xs font-medium leading-tight">
                  {record.alamatPasang}, RT/RW {record.rtRwPasang}
                </p>
                <span className="text-[11px] text-slate-500 block">
                  Kel. {record.kelurahanPasang || record.desaPasang}, Kec. {record.kecamatanPasang}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
              <span className="text-slate-600">
                Fungsi Bangunan: <strong className="text-slate-900">{record.fungsiBangunan}</strong>
              </span>
              <span className="text-slate-600">
                Golongan Tarif: <strong className="text-[#005DAA]">{record.golonganTarif || '2A1 - Rumah Tangga Standard'}</strong>
              </span>
            </div>
          </div>

          {!isRejecting ? (
            /* APPROVAL MODE: Input Nomor Pembayaran Manual & Biaya */
            <div className="space-y-4">
              <div className="bg-blue-50/70 p-4 rounded-2xl border-2 border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-wide">
                    Nomor Pembayaran Pelanggan (Virtual Account / Billing Code) <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateNewNo}
                    className="inline-flex items-center gap-1 text-[11px] text-[#005DAA] hover:underline font-bold cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate Otomatis</span>
                  </button>
                </div>

                <div className="relative">
                  <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={nomorPembayaran}
                    onChange={(e) => setNomorPembayaran(e.target.value.replace(/\s+/g, ''))}
                    placeholder="Contoh: 8829010842918"
                    className="w-full pl-9 pr-24 py-2.5 bg-white border-2 border-blue-300 rounded-xl font-mono text-base font-black text-[#005DAA] tracking-wider focus:outline-hidden focus:ring-2 focus:ring-[#005DAA]"
                  />
                  <button
                    type="button"
                    onClick={handleCopyNo}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-[#005DAA] rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Nomor ini akan tampil langsung di halaman pelanggan untuk melakukan pembayaran biaya pasang baru di seluruh kanal mitra resmi (BCA, Mandiri, BRI, Indomaret, Alfamart, dll).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Total Biaya Sambungan Baru (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={biayaSambungan}
                    onChange={(e) => setBiayaSambungan(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Catatan Verifikasi Petugas
                  </label>
                  <input
                    type="text"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Catatan persetujuan admin"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-[11px] text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Setelah tombol <strong>"Setujui &amp; Terbitkan Tagihan"</strong> diklik, status pendaftaran pelanggan akan otomatis beralih dari <em>Tahap Verifikasi</em> ke <em>Tahap Menunggu Pembayaran</em>, dan Nomor Pembayaran akan langsung tersedia di layar pelanggan.
                </span>
              </div>
            </div>
          ) : (
            /* REJECTION MODE */
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-200 space-y-3">
                <label className="block text-xs font-bold text-red-950 uppercase tracking-wide">
                  Alasan Penolakan / Permintaan Revisi Berkas <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Tuliskan alasan penolakan secara jelas untuk pelanggan..."
                  className="w-full p-3 bg-white border border-red-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!isRejecting ? (
              <button
                type="button"
                onClick={() => setIsRejecting(true)}
                className="px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition cursor-pointer"
              >
                Tolak Permohonan...
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsRejecting(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-bold transition cursor-pointer"
              >
                Batal Tolak (Kembali ke Setujui)
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-200 text-xs font-bold transition cursor-pointer"
            >
              Tutup
            </button>

            {!isRejecting ? (
              <button
                type="button"
                onClick={handleConfirmApprove}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Setujui &amp; Terbitkan Nomor Pembayaran</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmReject}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/30 transition cursor-pointer"
              >
                <XCircle className="w-4 h-4 text-white" />
                <span>Konfirmasi Tolak Permohonan</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
