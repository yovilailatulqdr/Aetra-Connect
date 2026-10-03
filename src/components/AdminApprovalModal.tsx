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
  FileText,
  Image as ImageIcon,
  Eye,
  CheckCheck,
  ReceiptText,
  Sparkles,
  X
} from 'lucide-react';
import { DocumentImageViewerModal } from './DocumentImageViewerModal';

interface AdminApprovalModalProps {
  isOpen: boolean;
  record: RegistrationFormData | null;
  onClose: () => void;
  onApprove: (noForm: string, nomorPembayaran: string, biayaSambungan: number, adminNotes?: string, idPelanggan?: string) => void;
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

  // Determine if this is payment verification stage (when payment proof exists or status is PAYMENT_CONFIRMED)
  const isPaymentVerificationStage = Boolean(
    record.paymentProof?.dataUrl ||
    record.status_pendaftaran === 'PAYMENT_CONFIRMED' ||
    record.statusPendaftaran === 'PAYMENT_CONFIRMED' ||
    (record.currentStep === 2 && record.statusPembayaran?.includes('Menunggu Verifikasi'))
  );

  // Generate suggested 12-digit Virtual Account / Nomor Pembayaran
  const defaultNoBayar = record.nomorPembayaran || record.nomor_pembayaran || (
    '88290' + (record.noSr ? record.noSr.replace(/\D/g, '').padStart(6, '0') : Math.floor(1000000 + Math.random() * 9000000))
  );

  const defaultIdPelanggan = record.idPelanggan || (
    record.trackingRecord?.idPelanggan || ('10' + (record.noForm || '123456').replace(/\D/g, '').padEnd(6, '0'))
  );

  const [idPelanggan, setIdPelanggan] = useState<string>(defaultIdPelanggan);
  const [nomorPembayaran, setNomorPembayaran] = useState<string>(defaultNoBayar);
  const [biayaSambungan, setBiayaSambungan] = useState<number>(record.biayaSambungan || 1371545);
  const [adminNotes, setAdminNotes] = useState<string>(
    isPaymentVerificationStage 
      ? 'Pembayaran biaya sambungan baru telah diverifikasi lunas oleh Kasir & Petugas Keuangan. ID Pelanggan diterbitkan.'
      : 'Berkas identitas pemohon dan persyaratan administrasi telah diverifikasi dan disetujui oleh Petugas Administrasi.'
  );
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('Kelengkapan berkas KTP / PBB tidak sesuai dengan alamat persil pemasangan.');
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  // Lightbox preview modal state
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

  const handleGenerateNewNo = () => {
    const newNo = '88290' + Math.floor(1000000 + Math.random() * 9000000);
    setNomorPembayaran(newNo);
  };

  const handleGenerateNewIdPelanggan = () => {
    const newId = '10' + Math.floor(100000 + Math.random() * 900000);
    setIdPelanggan(newId);
  };

  const handleCopyNo = () => {
    navigator.clipboard.writeText(nomorPembayaran);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(idPelanggan);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleConfirmApprove = () => {
    if (!nomorPembayaran.trim()) {
      alert('Nomor pembayaran wajib diisi.');
      return;
    }
    if (isPaymentVerificationStage && !idPelanggan.trim()) {
      alert('Mohon masukkan ID Pelanggan untuk aktivasi.');
      return;
    }
    onApprove(record.noForm, nomorPembayaran.trim(), Number(biayaSambungan), adminNotes, idPelanggan.trim());
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

  // Collect all uploaded documents & photos
  const uploadedDocs = [
    { key: 'ktp', label: 'Foto e-KTP Pemohon', doc: record.persyaratanFiles?.ktp },
    { key: 'kk', label: 'Foto Kartu Keluarga (KK)', doc: record.persyaratanFiles?.kk },
    { key: 'pbb', label: 'Pajak Bumi dan Bangunan (PBB)', doc: record.persyaratanFiles?.pbb },
    { key: 'suratDomisili', label: 'Surat Keterangan Domisili', doc: record.persyaratanFiles?.suratDomisili },
    { key: 'suratKuasaSewa', label: 'Surat Kuasa / Perjanjian Sewa', doc: record.persyaratanFiles?.suratKuasaSewa },
    { key: 'lainnya', label: 'Dokumen Pendukung Lainnya', doc: record.persyaratanFiles?.lainnya },
  ].filter((d) => Boolean(d.doc?.dataUrl));

  const paymentProofDoc = record.paymentProof?.dataUrl ? record.paymentProof : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0e172e] border border-slate-700 text-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className={`p-6 border-b border-slate-800 flex items-center justify-between gap-4 ${
          isPaymentVerificationStage
            ? 'bg-linear-to-r from-[#0d2a4a] to-[#0a382b]'
            : 'bg-linear-to-r from-slate-900 to-[#102446]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg ${
              isPaymentVerificationStage
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
            }`}>
              {isPaymentVerificationStage ? <CheckCheck className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
            </div>
            <div>
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isPaymentVerificationStage
                  ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                  : 'bg-blue-400/20 text-blue-300 border border-blue-400/30'
              }`}>
                {isPaymentVerificationStage ? 'TAHAP 2: VERIFIKASI PEMBAYARAN & TERBIT ID' : 'TAHAP 1: VERIFIKASI BERKAS & TERBIT NO. BAYAR'}
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                {isPaymentVerificationStage
                  ? 'Konfirmasi Pelunasan & Penerbitan ID Pelanggan'
                  : 'Pemeriksaan Berkas & Penerbitan Nomor Pembayaran'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Customer Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Nama Pemohon:</span>
              <strong className="text-white uppercase font-bold text-sm">{record.namaKtp}</strong>
              <span className="text-slate-400 block text-[10px] font-mono">NIK: {record.noKtp}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">No. Formulir / SR:</span>
              <strong className="text-amber-400 font-mono text-sm">#{record.noForm}</strong>
              <span className="text-slate-400 block text-[10px] font-mono">SR: {record.noSr || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Alamat Pemasangan:</span>
              <p className="text-slate-200 line-clamp-2 uppercase text-[11px]">
                {record.alamatPasang}, Kec. {record.kecamatanPasang || 'Tangerang'}
              </p>
            </div>
          </div>

          {/* DOKUMEN PERSYARATAN ADMINISTRASI (KTP, KK, PBB) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Dokumen Persyaratan Administrasi ({uploadedDocs.length} Terlampir)</span>
              </h4>
              <span className="text-[11px] text-slate-400">Klik gambar untuk melihat resolusi penuh</span>
            </div>

            {uploadedDocs.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {uploadedDocs.map((item) => (
                  <div
                    key={item.key}
                    onClick={() =>
                      setActiveViewer({
                        isOpen: true,
                        imageUrl: item.doc!.dataUrl,
                        title: item.label,
                        description: `Berkas Pemohon: ${record.namaKtp} (No. Form #${record.noForm})`,
                      })
                    }
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/60 hover:bg-slate-800/80 transition cursor-pointer group flex flex-col items-center gap-2 text-center"
                  >
                    <div className="relative w-full h-24 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
                      <img
                        src={item.doc!.dataUrl}
                        alt={item.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                        <Eye className="w-6 h-6" />
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 group-hover:text-white truncate w-full">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center text-slate-400 text-xs">
                Tidak ada dokumen digital terlampir pada formulir ini.
              </div>
            )}
          </div>

          {/* BUKTI PEMBAYARAN KASIR (JIKA ADA) */}
          {paymentProofDoc && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <ReceiptText className="w-4 h-4" />
                  <span>Struk / Bukti Pembayaran Pelanggan Terlampir</span>
                </span>
                <span className="text-[11px] text-emerald-300/80 font-mono">
                  {paymentProofDoc.bank} • {paymentProofDoc.tanggalBayar}
                </span>
              </div>

              <div
                onClick={() =>
                  setActiveViewer({
                    isOpen: true,
                    imageUrl: paymentProofDoc.dataUrl,
                    title: 'Bukti Pembayaran Biaya Sambungan Baru',
                    description: `Kanal: ${paymentProofDoc.bank} | Tgl: ${paymentProofDoc.tanggalBayar}`,
                  })
                }
                className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 hover:bg-slate-900 cursor-pointer group"
              >
                <img
                  src={paymentProofDoc.dataUrl}
                  alt="Struk Bayar"
                  className="w-16 h-16 object-cover rounded-xl border border-emerald-500/40"
                />
                <div className="flex-1">
                  <span className="text-xs font-bold text-white block">
                    Struk Validasi Bank / Kasir Minimarket
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Klik untuk memeriksa nomor referensi &amp; nominal transfer secara jelas.
                  </p>
                </div>
                <button
                  type="button"
                  className="px-3 py-2 rounded-xl bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50 text-xs font-bold transition"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* INPUT FORM SECTION */}
          {!isRejecting ? (
            <div className="space-y-4 pt-2 border-t border-slate-800">
              {/* TAHAP 1: INPUT NOMOR PEMBAYARAN (VA) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-blue-400" />
                    <span>Nomor Pembayaran (Virtual Account 12-Digit) <strong className="text-amber-400">*</strong></span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateNewNo}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-bold"
                  >
                    + Buat Nomor Baru
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nomorPembayaran}
                    onChange={(e) => setNomorPembayaran(e.target.value.replace(/\D/g, ''))}
                    placeholder="88290XXXXXXXXX"
                    className="flex-1 font-mono text-base font-bold bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-amber-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyNo}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              {/* TAHAP 2: INPUT ID PELANGGAN (UNTUK AKTIVASI SETELAH BAYAR) */}
              <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/50 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>ID Pelanggan Resmi (Nomor Rekening Tagihan Bulanan)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateNewIdPelanggan}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-bold"
                  >
                    + Generate ID Baru
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={idPelanggan}
                    onChange={(e) => setIdPelanggan(e.target.value.replace(/\D/g, ''))}
                    placeholder="10884920"
                    className="flex-1 font-mono text-base font-bold bg-slate-900 border border-blue-500/50 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedId ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  ID Pelanggan ini akan langsung tersinkronisasi ke portal pelanggan untuk pengecekan tagihan bulanan.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Biaya Sambungan Baru (Rp)
                  </label>
                  <input
                    type="number"
                    value={biayaSambungan}
                    onChange={(e) => setBiayaSambungan(Number(e.target.value))}
                    className="w-full font-mono text-sm font-bold bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-emerald-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Catatan Verifikator Admin
                  </label>
                  <input
                    type="text"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/60 space-y-3 animate-in fade-in duration-200">
              <label className="block text-xs font-bold text-red-300">
                Alasan Penolakan / Permintaan Revisi Berkas:
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full text-xs bg-slate-900 border border-red-500/50 rounded-xl p-3 text-red-200 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {!isRejecting ? (
            <>
              <button
                type="button"
                onClick={() => setIsRejecting(true)}
                className="px-4 py-2.5 rounded-xl border border-red-500/50 text-red-400 hover:bg-red-500/10 text-xs font-bold transition flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Tolak / Minta Revisi</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmApprove}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isPaymentVerificationStage
                      ? 'Verifikasi Lunas & Terbitkan ID Pelanggan'
                      : 'Setujui & Terbitkan No. Bayar'}
                  </span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsRejecting(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold transition"
              >
                Kembali ke Verifikasi
              </button>

              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-red-600/30 transition flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Kirim Penolakan Berkas</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Lightbox Preview */}
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
