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
  X,
  Eye,
  FileText,
  Camera,
  Image as ImageIcon,
  Receipt
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
      : 'Berkas identitas pemohon dan survei kelayakan teknis jaringan telah diverifikasi dan disetujui oleh Petugas Administrasi.'
  );
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('Kelengkapan berkas KTP/PBB tidak sesuai dengan alamat persil pemasangan.');
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
    { key: 'pbb', label: 'Bukti Lunas PBB / Rekening Listrik', doc: record.persyaratanFiles?.pbb },
    { key: 'suratDomisili', label: 'Surat Domisili', doc: record.persyaratanFiles?.suratDomisili },
    { key: 'suratKuasaSewa', label: 'Surat Kuasa Sewa', doc: record.persyaratanFiles?.suratKuasaSewa },
    { key: 'lainnya', label: 'Dokumen Lainnya', doc: record.persyaratanFiles?.lainnya },
  ].filter((d) => Boolean(d.doc?.dataUrl));

  const propertyPhotos = record.fotoPropertiFiles || [];

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-700 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`p-5 text-white flex items-start justify-between gap-3 border-b-4 ${
            isRejecting
              ? 'bg-gradient-to-r from-rose-900 via-red-800 to-slate-950 border-rose-500'
              : isPaymentVerificationStage
              ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-500'
              : 'bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-[#005DAA]'
          }`}>
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                {isRejecting ? (
                  <XCircle className="w-6 h-6 text-red-300" />
                ) : isPaymentVerificationStage ? (
                  <Receipt className="w-6 h-6 text-emerald-300" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-blue-300" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-white">
                  {isRejecting 
                    ? 'Tolak / Revisi Berkas' 
                    : isPaymentVerificationStage 
                    ? 'Tahap 2: Verifikasi Pembayaran & Input ID Pelanggan' 
                    : 'Tahap 1: Verifikasi Berkas & Terbitkan No. Bayar'}
                </span>
                <h3 className="text-base sm:text-lg font-black tracking-tight mt-1">
                  {isRejecting 
                    ? 'Tolak / Batalkan Permohonan Sambungan' 
                    : isPaymentVerificationStage 
                    ? 'Verifikasi Bukti Transfer & Aktivasi ID Pelanggan' 
                    : 'Persetujuan Berkas & Penerbitan Nomor Pembayaran'}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 font-mono">
                  No. Form: #{record.noForm} &bull; No. SR: {record.noSr || '-'} &bull; {record.namaKtp}
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
          <div className="p-6 overflow-y-auto space-y-6 text-xs bg-slate-50/60 flex-1">
            
            {/* Summary Pelanggan Card */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Nama Pemohon (KTP)</span>
                  <strong className="text-slate-900 text-sm block">{record.namaKtp}</strong>
                  <span className="text-[11px] text-slate-600 block">NIK: {record.noKtp} &bull; WA: <span className="font-semibold text-emerald-700">{record.telpHp}</span></span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Lokasi Pasang Sambungan</span>
                  <p className="text-slate-800 text-xs font-medium leading-tight">
                    {record.alamatPasang}, RT/RW {record.rtRwPasang}
                  </p>
                  <span className="text-[11px] text-[#005DAA] font-semibold block">
                    Kel. {record.kelurahanPasang || record.desaPasang}, Kec. {record.kecamatanPasang}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
                <span className="text-slate-600">
                  Peruntukan: <strong className="text-slate-900">{record.fungsiBangunan}</strong>
                </span>
                <span className="text-slate-600">
                  Golongan Tarif: <strong className="text-[#005DAA]">{record.golonganTarif || 'R2 = Rumah Tangga 2'}</strong>
                </span>
                <span className="text-slate-600 font-mono">
                  Biaya Sambungan: <strong className="text-emerald-700 font-bold">Rp {(record.biayaSambungan || 1371545).toLocaleString('id-ID')}</strong>
                </span>
              </div>
            </div>

            {/* SEKSI PREVIEW DOKUMEN YANG DIUNGGAH (KTP, KK, PBB & 3 FOTO PROPERTI) */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#005DAA]" />
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                    Foto Dokumen Persyaratan &amp; Properti Lapangan ({uploadedDocs.length + propertyPhotos.length} Berkas)
                  </h4>
                </div>
                <span className="text-[10px] text-slate-500">Klik foto untuk perbesar / zoom</span>
              </div>

              {/* Grid Dokumen Administrasi */}
              {uploadedDocs.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {uploadedDocs.map((item) => (
                    <div
                      key={item.key}
                      onClick={() => setActiveViewer({
                        isOpen: true,
                        imageUrl: item.doc!.dataUrl,
                        title: item.label,
                        description: `Berkas ${item.label} milik pemohon ${record.namaKtp}`,
                      })}
                      className="group cursor-pointer rounded-xl border border-slate-200 overflow-hidden bg-slate-100 hover:border-[#005DAA] transition relative flex flex-col"
                    >
                      <div className="aspect-video bg-black/5 flex items-center justify-center overflow-hidden relative">
                        <img
                          src={item.doc!.dataUrl}
                          alt={item.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 text-white text-[11px] font-bold">
                          <Eye className="w-4 h-4" /> Buka Foto
                        </div>
                      </div>
                      <div className="p-2 bg-white text-[11px]">
                        <strong className="block text-slate-800 truncate">{item.label}</strong>
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Terlampir
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Pelanggan belum mengunggah foto dokumen identitas e-KTP.</span>
                </div>
              )}

              {/* Grid 3 Foto Properti Lapangan */}
              {propertyPhotos.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 block">Dokumentasi Foto Properti Lapangan:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {propertyPhotos.map((photo, idx) => (
                      <div
                        key={photo.id || idx}
                        onClick={() => setActiveViewer({
                          isOpen: true,
                          imageUrl: photo.dataUrl,
                          title: photo.caption || `Foto Properti Lapangan ${idx + 1}`,
                          description: `Foto dokumentasi fisik persil & rencana titik meter di ${record.alamatPasang}`,
                        })}
                        className="group cursor-pointer rounded-xl border border-slate-200 overflow-hidden bg-slate-100 hover:border-[#005DAA] transition relative flex flex-col"
                      >
                        <div className="aspect-video bg-black/5 flex items-center justify-center overflow-hidden relative">
                          <img
                            src={photo.dataUrl}
                            alt={photo.caption || 'Foto Properti'}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 text-white text-[11px] font-bold">
                            <Eye className="w-4 h-4" /> Buka Foto
                          </div>
                        </div>
                        <div className="p-2 bg-white text-[11px]">
                          <strong className="block text-slate-800 truncate">{photo.caption || `Foto ${idx + 1}`}</strong>
                          <span className="text-[10px] text-slate-500">{photo.timestamp || 'Tersimpan'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bukti Transfer Pembayaran jika ada */}
              {record.paymentProof?.dataUrl && (
                <div className="pt-3 border-t border-slate-100 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                      <Receipt className="w-4 h-4 text-emerald-700" />
                      Bukti Struk Transfer Pembayaran Biaya Sambungan
                    </span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                      Saluran: {record.paymentProof.bank || 'Bank Transfer'}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                    <div
                      onClick={() => setActiveViewer({
                        isOpen: true,
                        imageUrl: record.paymentProof!.dataUrl,
                        title: 'Bukti Transfer Pembayaran Biaya Sambungan',
                        description: `Struk pembayaran ${record.namaKtp} - Saluran: ${record.paymentProof?.bank} (${record.paymentProof?.tanggalBayar})`,
                      })}
                      className="group cursor-pointer rounded-xl border-2 border-emerald-300 overflow-hidden bg-slate-100 hover:border-emerald-600 transition relative aspect-video w-48 shrink-0 flex items-center justify-center shadow-xs"
                    >
                      <img
                        src={record.paymentProof.dataUrl}
                        alt="Bukti Transfer"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 text-white text-[11px] font-bold">
                        <Eye className="w-4 h-4" /> Perbesar Struk
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 space-y-1">
                      <div>Bank / Kanal: <strong className="text-slate-900">{record.paymentProof.bank}</strong></div>
                      <div>Tanggal Bayar: <strong className="text-slate-900">{record.paymentProof.tanggalBayar}</strong></div>
                      {record.paymentProof.catatan && (
                        <div>Catatan: <span className="text-slate-600 italic">&ldquo;{record.paymentProof.catatan}&rdquo;</span></div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!isRejecting ? (
              <div className="space-y-4">
                
                {/* JIKA TAHAP 1: Terbitkan Nomor Pembayaran */}
                {!isPaymentVerificationStage && (
                  <div className="bg-blue-50/80 p-4 rounded-2xl border-2 border-blue-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black text-slate-900 uppercase tracking-wide">
                        1. Nomor Pembayaran Pelanggan (Virtual Account / Kode Bayar) <span className="text-red-500">*</span>
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
                        placeholder="Contoh: 88290165050"
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
                      Nomor ini akan tampil langsung di halaman pelanggan untuk melakukan pembayaran biaya pasang baru di seluruh kanal mitra resmi (BCA, Mandiri, BRI, BNI, Indomaret, Alfamart, Tokopedia, dll).
                    </p>
                  </div>
                )}

                {/* JIKA TAHAP 2 (SETELAH PELANGGAN UPLOAD BUKTI BAYAR): Input ID Pelanggan Manual oleh Admin */}
                {isPaymentVerificationStage && (
                  <div className="bg-emerald-50/90 p-4 rounded-2xl border-2 border-emerald-400 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black text-slate-900 uppercase tracking-wide">
                        2. Masukkan ID Pelanggan Tetap (Aktivasi Sambungan Baru) <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateNewIdPelanggan}
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-800 hover:underline font-bold cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Generate Otomatis</span>
                      </button>
                    </div>

                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={idPelanggan}
                        onChange={(e) => setIdPelanggan(e.target.value.replace(/\s+/g, ''))}
                        placeholder="Contoh: 10842918"
                        className="w-full pl-9 pr-24 py-2.5 bg-white border-2 border-emerald-500 rounded-xl font-mono text-base font-black text-emerald-900 tracking-wider focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                      />
                      <button
                        type="button"
                        onClick={handleCopyId}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Setelah ID Pelanggan diinput dan disetujui, tampilan di portal pelanggan otomatis beralih menjadi <strong>&ldquo;Pembayaran Telah Berhasil&rdquo;</strong> dan lanjut ke tahap penerbitan SPKO fisik.
                    </p>
                  </div>
                )}

                {/* Biaya & Catatan */}
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
          <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
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
                  <span>
                    {isPaymentVerificationStage
                      ? 'Simpan ID Pelanggan & Konfirmasi Pembayaran Selesai'
                      : 'Setujui Berkas & Terbitkan Nomor Pembayaran'}
                  </span>
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

      {/* Lightbox Document & Photo Viewer */}
      <DocumentImageViewerModal
        isOpen={activeViewer.isOpen}
        onClose={() => setActiveViewer((prev) => ({ ...prev, isOpen: false }))}
        imageUrl={activeViewer.imageUrl}
        title={activeViewer.title}
        description={activeViewer.description}
      />
    </>
  );
};
