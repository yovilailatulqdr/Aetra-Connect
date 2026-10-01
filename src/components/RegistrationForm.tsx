import React, { useState, useEffect, useMemo } from 'react';
import { RegistrationFormData, UploadedDoc, PropertyPhoto, UserAccount, PaymentProofData } from '../types';
import { AetraLogo } from './AetraLogo';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  MapPin, 
  User, 
  Camera, 
  Home, 
  Upload, 
  Trash2, 
  Check, 
  ShieldCheck, 
  Info, 
  ArrowRight, 
  ArrowLeft, 
  CheckCheck, 
  Compass, 
  Clock, 
  Copy,
  Lock,
  CreditCard,
  Send,
  ReceiptText
} from 'lucide-react';
import { CameraCaptureModal } from './CameraCaptureModal';
import { InteractiveMapPicker } from './InteractiveMapPicker';
import { calculateDomesticTariff } from '../data/domesticTariffs';
import { INDONESIA_PROVINCES_DATA, AETRA_TANGERANG_INSTALLATION_REGIONS } from '../data/indonesiaRegions';
import { BuildingEnvironmentFields } from './BuildingEnvironmentFields';
import { PetugasOfficerFields } from './PetugasOfficerFields';
import { DomesticTariffResultCard } from './DomesticTariffResultCard';
import { saveRegistrationToDb } from '../services/supabaseService';

export const SOSIAL_INSTANSI_OPTIONS = [
  'Tempat Ibadah',
  'Asrama Badan Sosial',
  'Rumah Yatim Piatu',
  'Kantor Instansi Pemerintah',
  'Kantor Perwakilan Asing',
  'Lembaga Swasta Non Komersial',
  'Instansi Perguruan / Kursus Instansi',
  'ABRI (TNI/POLRI)',
];

export const USAHA_OPTIONS = [
  'Kios / Warung',
  'Bengkel Kecil',
  'Usaha Kecil',
  'Pergudangan',
  'Usaha Kecil Dalam Rumah Tangga',
  'Tempat Pangkas Rambut',
  'Bengkel Menengah',
  'Usaha Menengah',
  'Usaha Menengah Dalam Rumah Tangga',
  'Penjahit',
  'Rumah Makan / Restoran',
  'RS. Swasta / Poliklinik / Lab',
  'Praktek Dokter',
  'Kantor Pengacara',
  'Salon / Barbershop',
  'Perusahaan Perdagangan / Niaga / Ruko',
];

export const getDraftKey = (user?: UserAccount | null) => {
  if (!user) return 'aetra_draft_guest';
  return `aetra_draft_${user.id || user.idPelanggan || user.email}`;
};

export const getEmptyFormData = (user?: UserAccount | null): RegistrationFormData => ({
  id: 'reg-' + Date.now(),
  noSr: '',
  noForm: '',
  idPelanggan: '',
  tanggal: new Date().toISOString().split('T')[0],
  namaKtp: user?.nama || '',
  noKtp: '',
  alamatKtp: '',
  rtRwKtp: '',
  kecamatanKtp: '',
  desaKtp: '',
  kodePosKtp: '',
  kelurahanKtp: '',
  kotaKtp: '',
  provinsiKtp: '',
  telpHp: '',
  email: user?.email || '',
  alamatPasang: '',
  rtRwPasang: '',
  kecamatanPasang: '',
  desaPasang: '',
  kodePosPasang: '',
  kelurahanPasang: '',
  kotaPasang: 'Kabupaten Tangerang',
  provinsiPasang: 'Banten',
  pekerjaan: '',
  statusKepemilikan: 'Rumah Sendiri',
  statusKepemilikanLainnya: '',
  persyaratan: {
    ktp: false,
    kk: false,
    pbb: false,
    suratDomisili: false,
    suratKuasaSewa: false,
    lainnya: false,
    keteranganLainnya: '',
  },
  persyaratanFiles: {},
  luasTanah: '',
  luasBangunan: '',
  totalLuasBangunan: 0,
  fungsiBangunan: 'Rumah Tangga',
  kondisiBangunan: {
    luasBangunan: '',
    totalLuasBangunan: '',
    jumlahLantai: '1',
    jumlahPenghuni: '4',
  },
  lingkungan: {
    saluranPembuangan: 'Ada',
    sanitasi: 'Ada',
    halaman: 'Ada',
    lebarJalan: '> 4 m',
    lingkunganTertata: 'Ya',
    realEstate: 'Bukan',
  },
  dataPasang: {
    namaSales: 'Bpk. Hendra Gunawan (Surveyor)',
    tanggalSurvey: new Date().toISOString().split('T')[0],
    noWorkOrder: 'WO-2026-AET-' + Math.floor(1000 + Math.random() * 9000),
    gpsLat: '-6.236600',
    gpsLong: '106.562100',
    namaKontraktor: 'PT Mitra Tirta Tangerang',
    dataAlamat: 'Benar',
    dataAlamatKoreksi: '',
    dataJaringan: 'Ada Jaringan',
    dataGalian: ['Tanah'],
    luasBangunanSurvey: '28,9 - 70 m²',
    kualitasBangunan: 'Permanen',
    fotoProperti: 'Ada',
    diameterPipa: '1/2 Inch',
    panjangPipa: '6',
    panjangPipaTipe: 'HDPE PE-100 PN16',
    materialTambahan: 'Kran Kuningan, Stop Kran Ball Valve, Box Meter',
    materialStatus: 'Standard',
    tanggalPasangMeter: new Date().toISOString().split('T')[0],
    noSegel: 'SGL-' + Math.floor(10000 + Math.random() * 90000),
    noSeriMeter: 'AET-2026-' + Math.floor(10000 + Math.random() * 90000),
    namaTeknisi: 'Ahmad Syafiq (Instalatur)',
    telpPetugas: '081299887766',
  },
  fotoPropertiFiles: [],
  skemaPembayaran: 'Pembayaran Penuh',
  keteranganSkema: 'Pembayaran Penuh',
  biayaSambungan: 1371545,
  golonganTarif: 'R2 = Rumah Tangga 2',
  persetujuan: false,
  trackingStep: 1,
  createdAt: new Date().toISOString(),
});

export type KategoriFungsi = 'rumah_tangga' | 'sosial_instansi' | 'usaha';

interface RegistrationFormProps {
  onRegisterSuccess: (record: RegistrationFormData) => void;
  onNavigateTracking: (noForm: string) => void;
  currentUser?: UserAccount | null;
  existingRegistrations?: RegistrationFormData[];
  onViewReceipt?: (record: RegistrationFormData) => void;
  onUpdateRegistration?: (record: RegistrationFormData) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
  onRegisterSuccess, 
  onNavigateTracking,
  currentUser,
  existingRegistrations,
  onViewReceipt,
  onUpdateRegistration,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [highestStepReached, setHighestStepReached] = useState<number>(1);

  const [formData, setFormData] = useState<RegistrationFormData>(() => {
    const draftKey = getDraftKey(currentUser);
    try {
      const draftStr = localStorage.getItem(draftKey);
      if (draftStr) {
        const parsed = JSON.parse(draftStr);
        if (parsed && typeof parsed === 'object') {
          return {
            ...getEmptyFormData(currentUser),
            ...parsed,
            namaKtp: parsed.namaKtp || currentUser?.nama || '',
            email: parsed.email || currentUser?.email || '',
          };
        }
      }
    } catch (e) {
      console.warn('Error reading draft:', e);
    }
    return getEmptyFormData(currentUser);
  });

  const [notification, setNotification] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<RegistrationFormData | null>(null);
  const [forceShowForm, setForceShowForm] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [errorFields, setErrorFields] = useState<Record<string, boolean>>({});

  // Payment confirmation form state
  const [paymentProofData, setPaymentProofData] = useState<{
    bank: string;
    namaPengirim: string;
    noRekening: string;
    tanggalBayar: string;
    catatan: string;
    fileUrl: string;
  }>({
    bank: 'BCA (Virtual Account)',
    namaPengirim: '',
    noRekening: '',
    tanggalBayar: new Date().toISOString().split('T')[0],
    catatan: '',
    fileUrl: '',
  });
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  const [cameraModalConfig, setCameraModalConfig] = useState<{
    isOpen: boolean;
    targetType: 'document' | 'property' | 'payment';
    docKey?: 'ktp' | 'kk' | 'pbb' | 'suratDomisili' | 'suratKuasaSewa' | 'lainnya';
    title: string;
    guideType?: 'document' | 'property' | 'payment';
  }>({
    isOpen: false,
    targetType: 'document',
    title: 'Kamera Pengambilan Foto',
    guideType: 'document',
  });

  const activeExistingRegistration = useMemo(() => {
    if (submittedRecord) return submittedRecord;
    if (!currentUser || currentUser.role === 'admin') return null;

    let pool: RegistrationFormData[] = existingRegistrations || [];
    if (pool.length === 0) {
      try {
        const saved = localStorage.getItem('aetra_registrations');
        if (saved) pool = JSON.parse(saved);
      } catch {
        pool = [];
      }
    }

    return (
      pool.find((r) => {
        if (currentUser.idPelanggan && r.idPelanggan === currentUser.idPelanggan) return true;
        if (currentUser.id && (r as any).userId === currentUser.id) return true;
        if (currentUser.email && r.email && r.email.toLowerCase() === currentUser.email.toLowerCase()) return true;
        return false;
      }) || null
    );
  }, [currentUser, submittedRecord, existingRegistrations]);

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        namaKtp: prev.namaKtp || currentUser.nama,
        email: prev.email || currentUser.email,
      }));
    }
  }, [currentUser]);

  const [kategoriFungsi, setKategoriFungsi] = useState<KategoriFungsi>(() => {
    if (formData.fungsiBangunan) {
      if (SOSIAL_INSTANSI_OPTIONS.includes(formData.fungsiBangunan)) return 'sosial_instansi';
      if (USAHA_OPTIONS.includes(formData.fungsiBangunan) || formData.fungsiBangunan === 'Usaha') return 'usaha';
    }
    return 'rumah_tangga';
  });

  // Calculate dynamic multi-floor tariff result
  const calculatedTariff = useMemo(() => {
    if (kategoriFungsi === 'sosial_instansi') {
      return {
        code: '1 - Sosial' as any,
        name: 'Golongan 1 - Sosial',
        appliedClause: 'Peruntukan tempat ibadah, asrama sosial, atau fasilitas umum nirlaba.',
        allPoints: ['Fasilitas sosial murni', 'Tarif subsidi khusus pemerintah'],
        color: 'emerald',
      };
    }
    if (kategoriFungsi === 'usaha') {
      return {
        code: '3 - Usaha' as any,
        name: 'Golongan 3 - Usaha',
        appliedClause: 'Peruntukan kegiatan komersial, perdagangan, toko, ruko, atau industri kecil/menengah.',
        allPoints: ['Kegiatan usaha komersil aktif', 'Tarif kategori usaha resmi Aetra'],
        color: 'amber',
      };
    }

    const baseLuas = parseFloat(String(formData.luasBangunan || '0'));
    const floorCount = Math.max(1, parseInt(String(formData.kondisiBangunan?.jumlahLantai || '1'), 10) || 1);
    const totalLuas = baseLuas * floorCount;

    const isRealEstate = formData.lingkungan?.realEstate === 'Ya';
    const hasUsaha = Boolean(formData.hasUsahaKomersil);

    return calculateDomesticTariff(totalLuas, isRealEstate, hasUsaha);
  }, [formData.luasBangunan, formData.kondisiBangunan?.jumlahLantai, formData.lingkungan?.realEstate, formData.hasUsahaKomersil, kategoriFungsi]);

  useEffect(() => {
    if (calculatedTariff) {
      setFormData((prev) => ({
        ...prev,
        golonganTarif: calculatedTariff.name,
        kategoriTarifKlausul: calculatedTariff.appliedClause,
      }));
    }
  }, [calculatedTariff]);

  // Handle Payment Confirmation & Proof Upload
  const handleConfirmPayment = () => {
    if (!activeExistingRegistration) return;
    if (!paymentProofData.fileUrl && !paymentProofData.bank) {
      alert('Mohon pilih metode pembayaran dan upload foto bukti struk pembayaran.');
      return;
    }

    setIsSubmittingPayment(true);
    const proof: PaymentProofData = {
      dataUrl: paymentProofData.fileUrl || '',
      bank: paymentProofData.bank,
      namaPengirim: paymentProofData.namaPengirim || activeExistingRegistration.namaKtp,
      noRekening: paymentProofData.noRekening,
      tanggalBayar: paymentProofData.tanggalBayar,
      catatan: paymentProofData.catatan,
      uploadedAt: new Date().toISOString(),
    };

    const updatedRecord: RegistrationFormData = {
      ...activeExistingRegistration,
      status_pendaftaran: 'PAYMENT_CONFIRMED',
      statusPendaftaran: 'PAYMENT_CONFIRMED',
      statusPembayaran: 'Menunggu Verifikasi Kasir',
      paymentProof: proof,
    };

    try {
      const saved = localStorage.getItem('aetra_registrations');
      const list: RegistrationFormData[] = saved ? JSON.parse(saved) : [];
      const updatedList = list.map((r) => r.noForm === updatedRecord.noForm ? updatedRecord : r);
      localStorage.setItem('aetra_registrations', JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }

    saveRegistrationToDb(updatedRecord).catch((e) => console.warn(e));
    if (onUpdateRegistration) {
      onUpdateRegistration(updatedRecord);
    }
    setSubmittedRecord(updatedRecord);
    setIsSubmittingPayment(false);
    setNotification('Bukti pembayaran berhasil dikonfirmasi! Sedang diverifikasi oleh Kasir & Petugas Keuangan Aetra.');
    setTimeout(() => setNotification(null), 5000);
  };

  // Section Definitions
  const SECTIONS = [
    { number: 1, title: 'Data Diri', subtitle: 'Identitas & Kontak' },
    { number: 2, title: 'Alamat KTP', subtitle: 'Domisili Kependudukan' },
    { number: 3, title: 'Alamat Pasang', subtitle: 'Titik Sambungan Baru' },
    { number: 4, title: 'Kondisi & Tarif', subtitle: 'Fisik & Golongan Tarif' },
    { number: 5, title: 'Upload Dokumen', subtitle: 'KTP, KK, PBB & Foto Rumah' },
    { number: 6, title: 'Portal Petugas', subtitle: 'Verifikasi & Persetujuan' },
  ];

  const handleDocUpload = (
    docKey: 'ktp' | 'kk' | 'pbb' | 'suratDomisili' | 'suratKuasaSewa' | 'lainnya',
    e: React.ChangeEvent<HTMLInputElement>,
    source: 'file' | 'camera' = 'file'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const uploadedDoc: UploadedDoc = {
        id: `doc-${Date.now()}`,
        name: file.name,
        dataUrl: reader.result as string,
        source: source,
        type: file.type,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadedAt: new Date().toISOString(),
      };

      setFormData((prev) => ({
        ...prev,
        persyaratan: {
          ...prev.persyaratan,
          [docKey]: true,
        },
        persyaratanFiles: {
          ...prev.persyaratanFiles,
          [docKey]: uploadedDoc,
        },
      }));

      setErrorFields((prev) => ({ ...prev, [docKey + 'Doc']: false }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveDoc = (docKey: 'ktp' | 'kk' | 'pbb' | 'suratDomisili' | 'suratKuasaSewa' | 'lainnya') => {
    setFormData((prev) => {
      const updatedFiles = { ...prev.persyaratanFiles };
      delete updatedFiles[docKey];
      return {
        ...prev,
        persyaratan: {
          ...prev.persyaratan,
          [docKey]: false,
        },
        persyaratanFiles: updatedFiles,
      };
    });
  };

  const handleDirectCameraCapture = (dataUrl: string) => {
    if (cameraModalConfig.targetType === 'payment') {
      setPaymentProofData((prev) => ({
        ...prev,
        fileUrl: dataUrl,
      }));
      setCameraModalConfig((prev) => ({ ...prev, isOpen: false }));
      return;
    }

    if (cameraModalConfig.targetType === 'property') {
      const newPhoto: PropertyPhoto = {
        id: 'photo-' + Date.now(),
        name: `Foto Properti Kamera ${new Date().toLocaleTimeString('id-ID')}`,
        dataUrl,
        source: 'camera',
        caption: 'Foto Tampak Rumah / Lokasi Titik Meter',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setFormData((prev) => ({
        ...prev,
        fotoPropertiFiles: [...(prev.fotoPropertiFiles || []), newPhoto],
      }));
      setCameraModalConfig((prev) => ({ ...prev, isOpen: false }));
      return;
    }

    if (cameraModalConfig.docKey) {
      const docKey = cameraModalConfig.docKey;
      const uploadedDoc: UploadedDoc = {
        id: `doc-${Date.now()}`,
        name: `Kamera-${docKey.toUpperCase()}-${Date.now()}.jpg`,
        dataUrl: dataUrl,
        source: 'camera',
        type: 'image/jpeg',
        size: '1.2 MB',
        uploadedAt: new Date().toISOString(),
      };

      setFormData((prev) => ({
        ...prev,
        persyaratan: {
          ...prev.persyaratan,
          [docKey]: true,
        },
        persyaratanFiles: {
          ...prev.persyaratanFiles,
          [docKey]: uploadedDoc,
        },
      }));
      setErrorFields((prev) => ({ ...prev, [docKey + 'Doc']: false }));
    }
    setCameraModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const validateCurrentSection = (stepNum: number): boolean => {
    const errors: string[] = [];
    const fields: Record<string, boolean> = {};

    if (stepNum === 1) {
      if (!formData.noSr?.trim()) {
        errors.push('No. SR (Sambungan Rumah) wajib diisi');
        fields.noSr = true;
      }
      if (!formData.namaKtp?.trim()) {
        errors.push('Nama Lengkap (Sesuai KTP) wajib diisi');
        fields.namaKtp = true;
      }
      if (!formData.noKtp?.trim()) {
        errors.push('Nomor KTP (NIK 16 Digit) wajib diisi');
        fields.noKtp = true;
      }
      if (!formData.pekerjaan?.trim()) {
        errors.push('Pekerjaan Pemohon wajib diisi');
        fields.pekerjaan = true;
      }
      if (!formData.telpHp?.trim()) {
        errors.push('Nomor HP / WhatsApp aktif wajib diisi');
        fields.telpHp = true;
      }
    } else if (stepNum === 2) {
      if (!formData.alamatKtp?.trim()) {
        errors.push('Alamat Lengkap KTP wajib diisi');
        fields.alamatKtp = true;
      }
      if (!formData.rtRwKtp?.trim()) {
        errors.push('RT / RW KTP wajib diisi');
        fields.rtRwKtp = true;
      }
      if (!formData.provinsiKtp?.trim()) {
        errors.push('Provinsi KTP wajib dipilih');
        fields.provinsiKtp = true;
      }
      if (!formData.kotaKtp?.trim()) {
        errors.push('Kota / Kabupaten KTP wajib dipilih');
        fields.kotaKtp = true;
      }
      if (!formData.kecamatanKtp?.trim()) {
        errors.push('Kecamatan KTP wajib dipilih');
        fields.kecamatanKtp = true;
      }
      if (!formData.kelurahanKtp?.trim() && !formData.desaKtp?.trim()) {
        errors.push('Kelurahan / Desa KTP wajib dipilih');
        fields.kelurahanKtp = true;
      }
      if (!formData.kodePosKtp?.trim()) {
        errors.push('Kode Pos KTP wajib diisi');
        fields.kodePosKtp = true;
      }
    } else if (stepNum === 3) {
      if (!formData.alamatPasang?.trim()) {
        errors.push('Alamat Lengkap Pemasangan wajib diisi');
        fields.alamatPasang = true;
      }
      if (!formData.rtRwPasang?.trim()) {
        errors.push('RT / RW Pemasangan wajib diisi');
        fields.rtRwPasang = true;
      }
      if (!formData.kecamatanPasang?.trim()) {
        errors.push('Kecamatan Pemasangan di Kabupaten Tangerang wajib dipilih');
        fields.kecamatanPasang = true;
      }
      if (!formData.kelurahanPasang?.trim() && !formData.desaPasang?.trim()) {
        errors.push('Kelurahan / Desa Pemasangan wajib dipilih');
        fields.kelurahanPasang = true;
      }
      if (!formData.kodePosPasang?.trim()) {
        errors.push('Kode Pos Pemasangan wajib diisi');
        fields.kodePosPasang = true;
      }
      if (!formData.statusKepemilikan?.trim()) {
        errors.push('Status Kepemilikan Bangunan wajib dipilih');
        fields.statusKepemilikan = true;
      }
    } else if (stepNum === 4) {
      if (!formData.fungsiBangunan?.trim()) {
        errors.push('Kategori peruntukan fungsi bangunan wajib dipilih');
        fields.fungsiBangunan = true;
      }
      if (kategoriFungsi === 'rumah_tangga') {
        if (!formData.luasBangunan || Number(formData.luasBangunan) <= 0) {
          errors.push('Luas Bangunan (m²) wajib diisi untuk Rumah Tangga');
          fields.luasBangunan = true;
        }
        if (!formData.luasTanah || Number(formData.luasTanah) <= 0) {
          errors.push('Luas Tanah (m²) wajib diisi untuk Rumah Tangga');
          fields.luasTanah = true;
        }
        if (!formData.kondisiBangunan?.jumlahLantai) {
          errors.push('Jumlah Lantai wajib diisi');
          fields.jumlahLantai = true;
        }
        if (!formData.kondisiBangunan?.jumlahPenghuni) {
          errors.push('Jumlah Penghuni wajib diisi');
          fields.jumlahPenghuni = true;
        }
      }
    } else if (stepNum === 5) {
      if (!formData.persyaratan?.ktp && !formData.persyaratanFiles?.ktp) {
        errors.push('Foto KTP Pemohon wajib diunggah');
        fields.ktpDoc = true;
      }
    } else if (stepNum === 6) {
      if (!formData.dataPasang?.namaSales?.trim()) {
        errors.push('Petugas Surveyor Lapangan wajib diisi');
        fields['dataPasang.namaSales'] = true;
      }
      if (!formData.dataPasang?.namaKontraktor?.trim()) {
        errors.push('Mitra Kontraktor Pelaksana wajib diisi');
        fields['dataPasang.namaKontraktor'] = true;
      }
      if (!formData.persetujuan) {
        errors.push('Wajib menyetujui Pernyataan & Ketentuan Berlangganan PT Aetra Air Tangerang');
        fields.persetujuan = true;
      }
    }

    setValidationErrors(errors);
    setErrorFields(fields);
    return errors.length === 0;
  };

  const isAllRequiredFieldsFilled = useMemo(() => {
    const s1 = Boolean(formData.noSr?.trim() && formData.namaKtp?.trim() && formData.noKtp?.trim() && formData.pekerjaan?.trim() && formData.telpHp?.trim());
    const s2 = Boolean(formData.alamatKtp?.trim() && formData.rtRwKtp?.trim() && formData.provinsiKtp?.trim() && formData.kotaKtp?.trim() && formData.kecamatanKtp?.trim() && (formData.kelurahanKtp?.trim() || formData.desaKtp?.trim()) && formData.kodePosKtp?.trim());
    const s3 = Boolean(formData.alamatPasang?.trim() && formData.rtRwPasang?.trim() && formData.kecamatanPasang?.trim() && (formData.kelurahanPasang?.trim() || formData.desaPasang?.trim()) && formData.kodePosPasang?.trim() && formData.statusKepemilikan?.trim());
    let s4 = Boolean(formData.fungsiBangunan?.trim());
    if (kategoriFungsi === 'rumah_tangga') {
      s4 = s4 && Boolean(formData.luasBangunan && Number(formData.luasBangunan) > 0 && formData.luasTanah && Number(formData.luasTanah) > 0 && formData.kondisiBangunan?.jumlahLantai && formData.kondisiBangunan?.jumlahPenghuni);
    }
    const s5 = Boolean(formData.persyaratan?.ktp || formData.persyaratanFiles?.ktp);
    const s6 = Boolean(formData.dataPasang?.namaSales?.trim() && formData.dataPasang?.namaKontraktor?.trim() && formData.persetujuan);

    return s1 && s2 && s3 && s4 && s5 && s6;
  }, [formData, kategoriFungsi]);

  const handleNextStep = () => {
    if (validateCurrentSection(currentStep)) {
      setValidationErrors([]);
      setErrorFields({});
      const next = currentStep + 1;
      setCurrentStep(next);
      if (next > highestStepReached) {
        setHighestStepReached(next);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setValidationErrors([]);
    setErrorFields({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJumpToStep = (stepNumber: number) => {
    if (stepNumber <= highestStepReached || stepNumber === currentStep + 1) {
      if (stepNumber > currentStep && !validateCurrentSection(currentStep)) {
        return;
      }
      setValidationErrors([]);
      setErrorFields({});
      setCurrentStep(stepNumber);
      if (stepNumber > highestStepReached) {
        setHighestStepReached(stepNumber);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentSection(6)) return;
    if (!isAllRequiredFieldsFilled) return;

    const noFormVal = formData.noForm || Math.floor(100000 + Math.random() * 900000).toString();
    const noSrVal = formData.noSr || Math.floor(100000 + Math.random() * 900000).toString();

    // ID Pelanggan is NOT generated yet upon initial registration. Only issued upon payment approval & meter installation.
    const finalizedRecord: RegistrationFormData = {
      ...formData,
      noForm: noFormVal,
      noSr: noSrVal,
      idPelanggan: '', // Dilengkapi nanti setelah pembayaran & meter terpasang
      statusPendaftaran: 'VERIFYING',
      status_pendaftaran: 'VERIFYING',
      statusPembayaran: 'Belum Ditagihkan',
      isSkAccepted: true,
      is_sk_accepted: true,
      trackingStep: 1,
      tanggal: formData.tanggal || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    onRegisterSuccess(finalizedRecord);
    setSubmittedRecord(finalizedRecord);

    const draftKey = getDraftKey(currentUser);
    try {
      localStorage.removeItem(draftKey);
    } catch {
      // ignore
    }

    setNotification('Pendaftaran Sambungan Baru Berhasil Disimpan! Status: Menunggu Verifikasi Petugas.');
    setTimeout(() => setNotification(null), 5000);
  };

  const handleReset = () => {
    if (window.confirm('Kosongkan formulir pendaftaran ini? Semua isian yang belum didaftarkan akan dibersihkan.')) {
      const empty = getEmptyFormData(currentUser);
      setFormData(empty);
      setCurrentStep(1);
      setHighestStepReached(1);
      setValidationErrors([]);
      setErrorFields({});
      const draftKey = getDraftKey(currentUser);
      localStorage.removeItem(draftKey);
      setNotification('Formulir berhasil dikosongkan.');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const isApprovedPaymentStage = activeExistingRegistration && (
    activeExistingRegistration.status_pendaftaran === 'WAITING_PAYMENT' ||
    activeExistingRegistration.status_pendaftaran === 'PAYMENT_CONFIRMED' ||
    Boolean(activeExistingRegistration.nomorPembayaran)
  );

  const isCompletedStage = activeExistingRegistration && (
    activeExistingRegistration.status_pendaftaran === 'ACTIVE_CUSTOMER' ||
    activeExistingRegistration.trackingStep >= 4
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-[#005DAA] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 border border-blue-400">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span className="text-xs font-bold">{notification}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* POST-REGISTRATION & PAYMENT STATUS CARD                  */}
      {/* ======================================================== */}
      {activeExistingRegistration && !forceShowForm ? (
        <div className="bg-white rounded-2xl border-2 border-blue-400 shadow-xl p-6 sm:p-8 space-y-6 animate-in fade-in">
          {/* Main Notice Header */}
          <div className="bg-linear-to-r from-blue-50 via-sky-50 to-amber-50 border border-blue-200 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-13 h-13 rounded-2xl bg-[#005DAA] text-white flex items-center justify-center shadow-md shrink-0 mt-0.5">
                {isCompletedStage ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-300" />
                ) : isApprovedPaymentStage ? (
                  <CreditCard className="w-7 h-7 text-amber-300 animate-bounce" />
                ) : (
                  <Clock className="w-7 h-7 text-amber-300 animate-pulse" />
                )}
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase font-black tracking-wider text-white bg-[#005DAA] px-3 py-0.5 rounded-full shadow-2xs">
                    Pemberitahuan Pendaftaran
                  </span>
                  <span className={`text-[10px] uppercase font-black tracking-wider px-3 py-0.5 rounded-full border ${
                    activeExistingRegistration.status_pendaftaran === 'WAITING_PAYMENT'
                      ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                      : activeExistingRegistration.status_pendaftaran === 'PAYMENT_CONFIRMED'
                      ? 'bg-purple-100 text-purple-900 border-purple-300 font-bold'
                      : isCompletedStage
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                      : 'bg-sky-100 text-[#005DAA] border-sky-300 font-bold'
                  }`}>
                    {activeExistingRegistration.status_pendaftaran === 'WAITING_PAYMENT'
                      ? 'Tahap 2: Permohonan Disetujui • Menunggu Pembayaran'
                      : activeExistingRegistration.status_pendaftaran === 'PAYMENT_CONFIRMED'
                      ? 'Tahap 2: Bukti Pembayaran Terkirim • Verifikasi Kasir'
                      : isCompletedStage
                      ? 'Tahap 4: Pembayaran Lunas & Meteran Air Terpasang Aktif'
                      : 'Tahap 1: Dalam Tahap Verifikasi Petugas'}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {isCompletedStage
                    ? 'Selamat! Sambungan Air Bersih Aetra Anda Telah Resmi Aktif'
                    : isApprovedPaymentStage
                    ? 'Permohonan Disetujui Petugas! Silakan Lakukan Pembayaran Sambungan Baru'
                    : 'Proses Pendaftaran Anda Sedang Dalam Tahap Verifikasi Petugas'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {isCompletedStage
                    ? 'Meter air telah terpasang dan diverifikasi oleh petugas. Seluruh fitur profil, cek tagihan bulanan, dan survey kepuasan telah dapat diakses.'
                    : isApprovedPaymentStage
                    ? 'Nomor pembayaran telah diterbitkan. Silakan lakukan pelunasan biaya sambungan dan konfirmasi dengan mengunggah bukti transfer di bawah ini.'
                    : 'Berkas permohonan sambungan baru Anda sedang dalam proses verifikasi administratif & teknis. Mohon dicek secara berkala.'}
                </p>
              </div>
            </div>

            {/* Tracking Access Button (Hanya jika sudah tahap pembayaran atau selesai) */}
            {(isApprovedPaymentStage || isCompletedStage) && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onNavigateTracking(activeExistingRegistration.noForm)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#005DAA] hover:bg-[#004A88] text-white text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-sky-200" />
                  <span>Buka Live Tracking &rarr;</span>
                </button>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* PAYMENT BOX & PROOF UPLOAD (KETIKA NOMOR BAYAR TERBIT)   */}
          {/* ======================================================== */}
          {isApprovedPaymentStage && (
            <div className="space-y-4">
              {/* Payment Instruction Banner */}
              <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-[#005DAA] text-white rounded-2xl p-6 shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/20 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-black tracking-wider text-emerald-100 bg-white/20 px-3 py-1 rounded-full">
                      Nomor Pembayaran Resmi (Virtual Account / Billing)
                    </span>
                    <div className="font-mono text-3xl sm:text-4xl font-black tracking-wider text-amber-200 pt-1">
                      {activeExistingRegistration.nomorPembayaran || '8899-' + activeExistingRegistration.noSr}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(activeExistingRegistration.nomorPembayaran || ('8899-' + activeExistingRegistration.noSr));
                      setNotification('Nomor Pembayaran berhasil disalin!');
                      setTimeout(() => setNotification(null), 3000);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-white text-emerald-900 font-black text-xs hover:bg-emerald-50 shadow-md transition flex items-center justify-center gap-2 cursor-pointer self-start sm:self-center"
                  >
                    <Copy className="w-4 h-4 text-emerald-700" />
                    <span>Salin Nomor Bayar</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-blue-50">
                  <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
                    <span className="text-[10px] text-emerald-200 block">Total Biaya Sambungan</span>
                    <strong className="text-base text-white font-mono">
                      Rp {((activeExistingRegistration.biayaSambungan || 1371545)).toLocaleString('id-ID')}
                    </strong>
                  </div>

                  <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
                    <span className="text-[10px] text-emerald-200 block">Metode Pembayaran</span>
                    <strong className="text-xs text-white">ATM, m-Banking, Indomaret, Alfamart</strong>
                  </div>

                  <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
                    <span className="text-[10px] text-emerald-200 block">Status Pembayaran Saat Ini</span>
                    <strong className="text-xs text-amber-300 font-bold">
                      {activeExistingRegistration.statusPembayaran || (activeExistingRegistration.status_pendaftaran === 'PAYMENT_CONFIRMED' ? 'Menunggu Verifikasi Kasir' : 'Menunggu Pelunasan')}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Upload Bukti Pembayaran & Konfirmasi Pelunasan */}
              <div className="bg-sky-50/60 p-5 rounded-2xl border-2 border-sky-200 space-y-4">
                <div className="flex items-center gap-2.5 text-slate-800 font-bold text-sm">
                  <ReceiptText className="w-5 h-5 text-[#005DAA]" />
                  <span>Konfirmasi Pembayaran &amp; Upload Bukti Transfer</span>
                </div>
                <p className="text-xs text-slate-600">
                  Setelah Anda melakukan transfer atau pelunasan di ATM / Bank / Minimarket, silakan unggah foto struk bukti pembayaran untuk diverifikasi petugas kasir Aetra:
                </p>

                {activeExistingRegistration.paymentProof ? (
                  <div className="bg-white p-4 rounded-xl border border-emerald-300 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Bukti Pembayaran Telah Diunggah
                      </span>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                        Status: Menunggu Verifikasi Kasir
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-500 block">Bank / Saluran:</span>
                        <strong className="text-slate-800">{activeExistingRegistration.paymentProof.bank}</strong>
                        <span className="text-slate-500 block mt-1">Tanggal Bayar:</span>
                        <strong className="text-slate-800">{activeExistingRegistration.paymentProof.tanggalBayar}</strong>
                      </div>

                      {activeExistingRegistration.paymentProof.dataUrl && (
                        <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video flex items-center justify-center">
                          <img
                            src={activeExistingRegistration.paymentProof.dataUrl}
                            alt="Bukti Transfer"
                            className="max-h-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-4 sm:p-5 rounded-xl border border-sky-200 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Bank / Saluran Pembayaran <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={paymentProofData.bank}
                          onChange={(e) => setPaymentProofData({ ...paymentProofData, bank: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
                        >
                          <option value="BCA (Virtual Account)">BCA (Virtual Account)</option>
                          <option value="Mandiri (Bill Payment)">Mandiri (Bill Payment)</option>
                          <option value="BRI (BRIVA)">BRI (BRIVA)</option>
                          <option value="BNI (Virtual Account)">BNI (Virtual Account)</option>
                          <option value="Indomaret / Alfamart">Indomaret / Alfamart</option>
                          <option value="QRIS / Dompet Digital">QRIS / Dompet Digital</option>
                          <option value="Loket Resmi Aetra">Loket Resmi Aetra</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Nama Pengirim / Pemilik Rekening
                        </label>
                        <input
                          type="text"
                          value={paymentProofData.namaPengirim}
                          onChange={(e) => setPaymentProofData({ ...paymentProofData, namaPengirim: e.target.value })}
                          placeholder={activeExistingRegistration.namaKtp || 'Nama pemilik rekening'}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Tanggal Pembayaran <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={paymentProofData.tanggalBayar}
                          onChange={(e) => setPaymentProofData({ ...paymentProofData, tanggalBayar: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Upload Struk Foto */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-800">
                        Foto Bukti Struk / Screenshot Transfer <span className="text-red-500">*</span>
                      </label>
                      
                      {paymentProofData.fileUrl ? (
                        <div className="relative border rounded-xl overflow-hidden bg-slate-100 max-w-sm aspect-video flex items-center justify-center">
                          <img
                            src={paymentProofData.fileUrl}
                            alt="Preview Struk"
                            className="max-h-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => setPaymentProofData({ ...paymentProofData, fileUrl: '' })}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setCameraModalConfig({
                              isOpen: true,
                              targetType: 'payment',
                              title: 'Foto Struk Pembayaran via Kamera',
                              guideType: 'payment'
                            })}
                            className="px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[#005DAA] text-xs font-bold flex items-center gap-2 hover:bg-blue-100 transition cursor-pointer"
                          >
                            <Camera className="w-4 h-4" />
                            <span>Ambil via Kamera</span>
                          </button>

                          <label className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition cursor-pointer">
                            <Upload className="w-4 h-4" />
                            <span>Pilih File Gambar</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = () => {
                                  setPaymentProofData((prev) => ({
                                    ...prev,
                                    fileUrl: reader.result as string,
                                  }));
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Tombol Konfirmasi Pembayaran */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleConfirmPayment}
                        disabled={isSubmittingPayment}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                      >
                        <Send className="w-4 h-4 text-emerald-200" />
                        <span>Saya Telah Melakukan Pembayaran (Kirim Konfirmasi)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Summary Details Grid */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Nomor Formulir</span>
                <span className="font-mono text-sm font-black text-slate-900 block">#{activeExistingRegistration.noForm}</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">No. SR (Sambungan)</span>
                <span className="font-mono text-sm font-black text-[#005DAA] block">SR - {activeExistingRegistration.noSr || '-'}</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">ID Pelanggan</span>
                <span className="font-mono text-sm font-black text-slate-800 block">
                  {activeExistingRegistration.idPelanggan ? (
                    <span className="text-emerald-700 font-black">#{activeExistingRegistration.idPelanggan}</span>
                  ) : (
                    <span className="text-slate-400 text-xs italic font-normal">Diterbitkan setelah lunas &amp; meter terpasang</span>
                  )}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Golongan Tarif</span>
                <span className="font-semibold text-xs text-slate-800 block truncate">{activeExistingRegistration.golonganTarif || 'Rumah Tangga'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Nama Pemohon (KTP):</span>
                <strong className="text-slate-900 text-sm block">{activeExistingRegistration.namaKtp}</strong>
                <span className="text-[11px] text-slate-500 block">NIK: {activeExistingRegistration.noKtp} &bull; HP/WA: {activeExistingRegistration.telpHp}</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Alamat Pemasangan:</span>
                <p className="text-slate-800 text-xs font-medium leading-relaxed">
                  {activeExistingRegistration.alamatPasang}, RT/RW {activeExistingRegistration.rtRwPasang}, Kel. {activeExistingRegistration.kelurahanPasang || activeExistingRegistration.desaPasang}, Kec. {activeExistingRegistration.kecamatanPasang}, {activeExistingRegistration.kotaPasang || activeExistingRegistration.provinsiPasang} {activeExistingRegistration.kodePosPasang ? `(${activeExistingRegistration.kodePosPasang})` : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              Petugas Aetra dan Admin memverifikasi berkas dan memproses sambungan air bersih ke lokasi Anda.
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {/* Form editing is locked once approved/payment number issued */}
              {isApprovedPaymentStage ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold border border-slate-200" title="Formulir telah disetujui & terkunci untuk tahapan pembayaran">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Formulir Terkunci (Tahap Pembayaran)</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setFormData(activeExistingRegistration);
                    setForceShowForm(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Buka / Edit Detail Formulir
                </button>
              )}

              {onViewReceipt && (
                <button
                  type="button"
                  onClick={() => onViewReceipt(activeExistingRegistration)}
                  className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-[#005DAA] font-bold text-xs transition cursor-pointer"
                >
                  Lihat Bukti Tanda Terima / SPK
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* WIZARD MULTI-SECTION REGISTRATION FORM                   */
        /* ======================================================== */
        <div className="bg-white rounded-2xl border border-slate-300 shadow-md overflow-hidden">
          {/* Form Header */}
          <div className="bg-linear-to-r from-[#005DAA] via-[#004B8A] to-[#003868] text-white p-6 border-b-4 border-[#F37021]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="bg-white px-3.5 py-1.5 rounded-xl inline-flex items-center shadow-xs">
                  <AetraLogo size="sm" variant="horizontal" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
                  Pendaftaran Sambungan Baru
                </h1>
                <p className="text-xs text-blue-100">
                  Surat Permohonan Sambungan Rumah (SR) PT Aetra Air Tangerang &bull; Formulir Pendaftaran 6 Tahap
                </p>
              </div>

              {lastSavedTime && (
                <div className="bg-white/10 backdrop-blur-xs border border-white/20 px-3 py-1.5 rounded-xl text-right shrink-0">
                  <span className="text-[10px] text-blue-200 block">Draf Tersimpan Otomatis</span>
                  <span className="text-xs font-mono font-bold text-emerald-300">Pukul {lastSavedTime} WIB</span>
                </div>
              )}
            </div>
          </div>

          {/* Stepper Navigation Bar */}
          <div className="bg-slate-100 border-b border-slate-200 p-3 sm:p-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center justify-between min-w-[700px] gap-2">
              {SECTIONS.map((sec) => {
                const isCurrent = currentStep === sec.number;
                const isCompleted = sec.number < currentStep || highestStepReached > sec.number;
                const isClickable = sec.number <= highestStepReached || sec.number === currentStep + 1;

                return (
                  <button
                    key={sec.number}
                    type="button"
                    onClick={() => handleJumpToStep(sec.number)}
                    disabled={!isClickable}
                    className={`flex-1 flex items-center gap-2.5 p-2.5 rounded-xl transition text-left cursor-pointer ${
                      isCurrent
                        ? 'bg-white border-2 border-[#005DAA] shadow-xs text-[#005DAA] ring-2 ring-blue-100'
                        : isCompleted
                        ? 'bg-white/80 hover:bg-white border border-emerald-300 text-slate-800'
                        : isClickable
                        ? 'bg-slate-50 hover:bg-white border border-slate-200 text-slate-600'
                        : 'opacity-50 cursor-not-allowed border border-transparent text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition ${
                        isCurrent
                          ? 'bg-[#005DAA] text-white'
                          : isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isCompleted && !isCurrent ? <Check className="w-4 h-4" /> : sec.number}
                    </div>
                    <div className="min-w-0">
                      <span className={`block text-xs font-bold truncate ${isCurrent ? 'text-[#005DAA]' : 'text-slate-800'}`}>
                        {sec.title}
                      </span>
                      <span className="block text-[10px] text-slate-500 truncate">
                        {sec.subtitle}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="mt-3 bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-linear-to-r from-[#005DAA] to-[#F37021] h-full transition-all duration-300"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              />
            </div>
          </div>

          {/* Validation Alert */}
          {validationErrors.length > 0 && (
            <div className="m-6 mb-0 bg-red-50 border-2 border-red-300 rounded-xl p-4 text-xs text-red-900 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-red-900">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Mohon lengkapi seluruh isian wajib bertanda bintang (*) pada bagian ini:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {validationErrors.map((err, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-red-100 text-red-800 font-semibold text-[11px] border border-red-200">
                    &bull; {err}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* FORM CONTAINER */}
          <form onSubmit={currentStep === 6 ? handleFinalSubmit : (e) => { e.preventDefault(); handleNextStep(); }} noValidate className="p-6 sm:p-8 space-y-6">

            {/* ======================================================== */}
            {/* SECTION 1: DATA DIRI PEMOHON                             */}
            {/* ======================================================== */}
            {currentStep === 1 && (
              <section className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#005DAA] border border-blue-200">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Section 1: Data Diri Pemohon</h2>
                    <p className="text-xs text-slate-500">Isi data identitas diri pemohon sesuai KTP resmi</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Tanggal Pendaftaran <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.tanggal}
                      onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      No. SR (Sambungan Rumah) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300">
                        SR -
                      </span>
                      <input
                        type="text"
                        required
                        value={formData.noSr}
                        onChange={(e) => {
                          setFormData({ ...formData, noSr: e.target.value });
                          setErrorFields((prev) => ({ ...prev, noSr: false }));
                        }}
                        placeholder="Contoh: 168392"
                        className={`w-full px-3 py-2.5 rounded-xl text-xs font-mono font-bold focus:outline-hidden transition ${
                          errorFields.noSr ? 'border-2 border-red-500 bg-red-50' : 'bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Nama Lengkap (Sesuai KTP) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.namaKtp}
                      onChange={(e) => {
                        setFormData({ ...formData, namaKtp: e.target.value });
                        setErrorFields((prev) => ({ ...prev, namaKtp: false }));
                      }}
                      placeholder="Nama lengkap sesuai e-KTP"
                      className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-hidden transition ${
                        errorFields.namaKtp ? 'border-2 border-red-500 bg-red-50' : 'bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Nomor KTP (NIK 16 Digit) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      required
                      value={formData.noKtp}
                      onChange={(e) => {
                        setFormData({ ...formData, noKtp: e.target.value });
                        setErrorFields((prev) => ({ ...prev, noKtp: false }));
                      }}
                      placeholder="16 digit NIK e-KTP"
                      className={`w-full px-3 py-2.5 rounded-xl text-xs font-mono font-bold focus:outline-hidden transition ${
                        errorFields.noKtp ? 'border-2 border-red-500 bg-red-50' : 'bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Pekerjaan Pemohon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.pekerjaan}
                      onChange={(e) => {
                        setFormData({ ...formData, pekerjaan: e.target.value });
                        setErrorFields((prev) => ({ ...prev, pekerjaan: false }));
                      }}
                      placeholder="Contoh: Karyawan Swasta, Wiraswasta, PNS"
                      className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-hidden transition ${
                        errorFields.pekerjaan ? 'border-2 border-red-500 bg-red-50' : 'bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Nomor HP / WhatsApp Aktif <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.telpHp}
                      onChange={(e) => {
                        setFormData({ ...formData, telpHp: e.target.value });
                        setErrorFields((prev) => ({ ...prev, telpHp: false }));
                      }}
                      placeholder="0812-xxxx-xxxx"
                      className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-hidden transition ${
                        errorFields.telpHp ? 'border-2 border-red-500 bg-red-50' : 'bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Email Pemohon (Opsional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@domain.com"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* ======================================================== */}
            {/* SECTION 2: ALAMAT KTP LENGKAP (WILAYAH INDONESIA LENGKAP) */}
            {/* ======================================================== */}
            {currentStep === 2 && (
              <section className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#005DAA] border border-blue-200">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Section 2: Alamat KTP Pemohon</h2>
                    <p className="text-xs text-slate-500">Pilih wilayah domisili kependudukan sesuai e-KTP</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Alamat Lengkap Jalan / No. Rumah (KTP) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.alamatKtp}
                      onChange={(e) => {
                        setFormData({ ...formData, alamatKtp: e.target.value });
                        setErrorFields((prev) => ({ ...prev, alamatKtp: false }));
                      }}
                      placeholder="Nama jalan, nomor rumah, blok / gang"
                      className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-hidden ${
                        errorFields.alamatKtp ? 'border-2 border-red-500 bg-red-50' : 'bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        RT / RW <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.rtRwKtp}
                        onChange={(e) => {
                          setFormData({ ...formData, rtRwKtp: e.target.value });
                          setErrorFields((prev) => ({ ...prev, rtRwKtp: false }));
                        }}
                        placeholder="Contoh: 003/004"
                        className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-medium focus:outline-hidden ${
                          errorFields.rtRwKtp ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                        }`}
                      />
                    </div>

                    {/* Dropdown Provinsi */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Provinsi <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.provinsiKtp || ''}
                        onChange={(e) => {
                          const newProv = e.target.value;
                          setFormData({
                            ...formData,
                            provinsiKtp: newProv,
                            kotaKtp: '',
                            kecamatanKtp: '',
                            desaKtp: '',
                            kelurahanKtp: '',
                            kodePosKtp: '',
                          });
                          setErrorFields((prev) => ({ ...prev, provinsiKtp: false }));
                        }}
                        className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-medium focus:outline-hidden ${
                          errorFields.provinsiKtp ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                        }`}
                      >
                        <option value="">-- Pilih Provinsi --</option>
                        {INDONESIA_PROVINCES_DATA.map((prov) => (
                          <option key={prov.id} value={prov.name}>
                            {prov.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Kota / Kabupaten */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Kota / Kabupaten <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.kotaKtp || ''}
                        disabled={!formData.provinsiKtp}
                        onChange={(e) => {
                          const newCity = e.target.value;
                          setFormData({
                            ...formData,
                            kotaKtp: newCity,
                            kecamatanKtp: '',
                            desaKtp: '',
                            kelurahanKtp: '',
                            kodePosKtp: '',
                          });
                          setErrorFields((prev) => ({ ...prev, kotaKtp: false }));
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden disabled:opacity-50"
                      >
                        <option value="">-- Pilih Kota / Kab --</option>
                        {INDONESIA_PROVINCES_DATA.find((p) => p.name === formData.provinsiKtp)?.cities.map((city) => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Kecamatan */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Kecamatan <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.kecamatanKtp || ''}
                        disabled={!formData.kotaKtp}
                        onChange={(e) => {
                          const newKec = e.target.value;
                          const districtObj = INDONESIA_PROVINCES_DATA.find((p) => p.name === formData.provinsiKtp)
                            ?.cities.find((c) => c.name === formData.kotaKtp)
                            ?.districts.find((d) => d.name === newKec);

                          setFormData({
                            ...formData,
                            kecamatanKtp: newKec,
                            desaKtp: '',
                            kelurahanKtp: '',
                            kodePosKtp: districtObj?.postalCode || formData.kodePosKtp || '',
                          });
                          setErrorFields((prev) => ({ ...prev, kecamatanKtp: false }));
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden disabled:opacity-50"
                      >
                        <option value="">-- Pilih Kecamatan --</option>
                        {INDONESIA_PROVINCES_DATA.find((p) => p.name === formData.provinsiKtp)
                          ?.cities.find((c) => c.name === formData.kotaKtp)
                          ?.districts.map((dist) => (
                            <option key={dist.name} value={dist.name}>
                              {dist.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Kelurahan / Desa */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Kelurahan / Desa <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.kelurahanKtp || formData.desaKtp || ''}
                        disabled={!formData.kecamatanKtp}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({
                            ...formData,
                            kelurahanKtp: val,
                            desaKtp: val,
                          });
                          setErrorFields((prev) => ({ ...prev, kelurahanKtp: false }));
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden disabled:opacity-50"
                      >
                        <option value="">-- Pilih Kelurahan / Desa --</option>
                        {(
                          INDONESIA_PROVINCES_DATA.find((p) => p.name === formData.provinsiKtp)
                            ?.cities.find((c) => c.name === formData.kotaKtp)
                            ?.districts.find((d) => d.name === formData.kecamatanKtp)?.villages || []
                        ).map((v: string) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Kode Pos */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Kode Pos <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.kodePosKtp}
                        onChange={(e) => {
                          setFormData({ ...formData, kodePosKtp: e.target.value });
                          setErrorFields((prev) => ({ ...prev, kodePosKtp: false }));
                        }}
                        placeholder="Contoh: 15710"
                        className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-mono font-bold focus:outline-hidden ${
                          errorFields.kodePosKtp ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ======================================================== */}
            {/* SECTION 3: ALAMAT PEMASANGAN (KABUPATEN TANGERANG)       */}
            {/* ======================================================== */}
            {currentStep === 3 && (
              <section className="space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#005DAA] border border-blue-200">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900 text-base">Section 3: Alamat Lengkap Pemasangan</h2>
                      <p className="text-xs text-slate-500">Wilayah Layanan Resmi Sambungan Baru Aetra &bull; Kabupaten Tangerang</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        alamatPasang: formData.alamatKtp,
                        rtRwPasang: formData.rtRwKtp,
                        provinsiPasang: 'Banten',
                        kotaPasang: 'Kabupaten Tangerang',
                        kecamatanPasang: formData.kecamatanKtp,
                        kelurahanPasang: formData.kelurahanKtp,
                        desaPasang: formData.desaKtp,
                        kodePosPasang: formData.kodePosKtp,
                      });
                    }}
                    className="text-xs font-bold text-[#005DAA] hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Salin dari Alamat KTP</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Alamat Lengkap Titik Pasang (Nama Jalan, No. Rumah, Blok/Gang) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.alamatPasang}
                      onChange={(e) => {
                        setFormData({ ...formData, alamatPasang: e.target.value });
                        setErrorFields((prev) => ({ ...prev, alamatPasang: false }));
                      }}
                      placeholder="Contoh: Jl. Merpati No. 24 RT 003/004, Perum Graha Cikupa"
                      className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-hidden ${
                        errorFields.alamatPasang ? 'border-2 border-red-500 bg-red-50' : 'bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                      }`}
                    />
                  </div>

                  {/* Interactive Map Picker */}
                  <div className="pt-1">
                    <InteractiveMapPicker
                      initialLat={formData.dataPasang?.gpsLat || '-6.236600'}
                      initialLng={formData.dataPasang?.gpsLong || '106.562100'}
                      onLocationChange={(lat: string, lng: string) => {
                        setFormData((prev) => ({
                          ...prev,
                          dataPasang: {
                            ...prev.dataPasang,
                            gpsLat: lat,
                            gpsLong: lng,
                          },
                        }));
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        RT / RW Pasang <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.rtRwPasang}
                        onChange={(e) => {
                          setFormData({ ...formData, rtRwPasang: e.target.value });
                          setErrorFields((prev) => ({ ...prev, rtRwPasang: false }));
                        }}
                        placeholder="003/004"
                        className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-medium focus:outline-hidden ${
                          errorFields.rtRwPasang ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                        }`}
                      />
                    </div>

                    {/* Filter Kecamatan Kabupaten Tangerang */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Kecamatan Pasang <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.kecamatanPasang || ''}
                        onChange={(e) => {
                          const newKec = e.target.value;
                          const found = AETRA_TANGERANG_INSTALLATION_REGIONS.find((k) => k.name === newKec);
                          setFormData({
                            ...formData,
                            kecamatanPasang: newKec,
                            kelurahanPasang: '',
                            desaPasang: '',
                            kodePosPasang: found?.postalCode || formData.kodePosPasang || '',
                          });
                          setErrorFields((prev) => ({ ...prev, kecamatanPasang: false }));
                        }}
                        className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-medium focus:outline-hidden ${
                          errorFields.kecamatanPasang ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                        }`}
                      >
                        <option value="">-- Pilih Kecamatan --</option>
                        {AETRA_TANGERANG_INSTALLATION_REGIONS.map((k) => (
                          <option key={`inst-kec-${k.name}`} value={k.name}>
                            {k.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Kelurahan / Desa Pasang */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Kelurahan / Desa <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.kelurahanPasang || formData.desaPasang || ''}
                        disabled={!formData.kecamatanPasang}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({
                            ...formData,
                            kelurahanPasang: val,
                            desaPasang: val,
                          });
                          setErrorFields((prev) => ({ ...prev, kelurahanPasang: false }));
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden disabled:opacity-50"
                      >
                        <option value="">-- Pilih Kelurahan / Desa --</option>
                        {(
                          AETRA_TANGERANG_INSTALLATION_REGIONS.find((k) => k.name === formData.kecamatanPasang)?.villages || []
                        ).map((kel: string) => (
                          <option key={`inst-vil-${kel}`} value={kel}>
                            {kel}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Kode Pos Pasang */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Kode Pos <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.kodePosPasang}
                        onChange={(e) => {
                          setFormData({ ...formData, kodePosPasang: e.target.value });
                          setErrorFields((prev) => ({ ...prev, kodePosPasang: false }));
                        }}
                        placeholder="15520"
                        className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-mono font-bold focus:outline-hidden ${
                          errorFields.kodePosPasang ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Status Kepemilikan */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Status Kepemilikan Properti <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {['Rumah Sendiri', 'Kontrak / Sewa', 'Lainnya'].map((opt) => (
                        <label
                          key={opt}
                          onClick={() => {
                            setFormData({ ...formData, statusKepemilikan: opt });
                            setErrorFields((prev) => ({ ...prev, statusKepemilikan: false }));
                          }}
                          className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition flex items-center gap-2.5 ${
                            formData.statusKepemilikan === opt
                              ? 'bg-blue-50 border-[#005DAA] text-[#005DAA] shadow-xs'
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name="statusKepemilikan"
                            checked={formData.statusKepemilikan === opt}
                            onChange={() => {
                              setFormData({ ...formData, statusKepemilikan: opt });
                              setErrorFields((prev) => ({ ...prev, statusKepemilikan: false }));
                            }}
                            className="text-[#005DAA] focus:ring-[#005DAA]"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ======================================================== */}
            {/* SECTION 4: KONDISI BANGUNAN, LINGKUNGAN & GOLONGAN TARIF */}
            {/* ======================================================== */}
            {currentStep === 4 && (
              <section className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#005DAA] border border-blue-200">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Section 4: Kondisi Bangunan &amp; Golongan Tarif</h2>
                    <p className="text-xs text-slate-500">Penentuan golongan tarif otomatis berdasarkan luas bangunan, jumlah lantai, dan kawasan</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Kategori Utama Peruntukan */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <label className="block text-xs font-bold text-slate-800">
                      Kategori Peruntukan Bangunan <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'rumah_tangga', label: 'Rumah Tangga', icon: Home, desc: 'Tempat tinggal murni' },
                        { id: 'sosial_instansi', label: 'Sosial / Instansi', icon: Building2, desc: 'Tempat ibadah & sosial' },
                        { id: 'usaha', label: 'Usaha', icon: Building2, desc: 'Toko, ruko, warung & bisnis' },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSelected = kategoriFungsi === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              setKategoriFungsi(item.id as KategoriFungsi);
                              if (item.id === 'rumah_tangga') {
                                setFormData({ ...formData, fungsiBangunan: 'Rumah Tangga' });
                              } else if (item.id === 'sosial_instansi') {
                                setFormData({ ...formData, fungsiBangunan: SOSIAL_INSTANSI_OPTIONS[0] });
                              } else {
                                setFormData({ ...formData, fungsiBangunan: 'Usaha' });
                              }
                            }}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                              isSelected
                                ? 'bg-blue-50/80 border-[#005DAA] shadow-xs'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#005DAA] text-white' : 'bg-slate-100 text-slate-600'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <strong className={`block text-xs font-bold ${isSelected ? 'text-[#005DAA]' : 'text-slate-800'}`}>
                                {item.label}
                              </strong>
                              <span className="text-[11px] text-slate-500 block mt-0.5">
                                {item.desc}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Jika Rumah Tangga: Tampilkan Luas Dasar & Lingkungan */}
                  {kategoriFungsi === 'rumah_tangga' && (
                    <div className="space-y-4">
                      {/* Luas Bangunan & Luas Tanah Dasar */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-sky-200">
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            Luas Bangunan Dasar (m²) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="5000"
                            required
                            value={formData.luasBangunan}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                luasBangunan: val,
                                totalLuasBangunan: parseFloat(val || '0') * (parseInt(String(prev.kondisiBangunan?.jumlahLantai || '1'), 10) || 1),
                              }));
                              setErrorFields((prev) => ({ ...prev, luasBangunan: false }));
                            }}
                            placeholder="Contoh: 36, 54, 72"
                            className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-bold focus:outline-hidden ${
                              errorFields.luasBangunan ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            Luas Tanah (m²) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="5000"
                            required
                            value={formData.luasTanah}
                            onChange={(e) => {
                              setFormData({ ...formData, luasTanah: e.target.value });
                              setErrorFields((prev) => ({ ...prev, luasTanah: false }));
                            }}
                            placeholder="Contoh: 60, 90, 120"
                            className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-bold focus:outline-hidden ${
                              errorFields.luasTanah ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Kondisi Bangunan (Lantai & Penghuni) & Lingkungan */}
                      <BuildingEnvironmentFields
                        formData={formData}
                        setFormData={setFormData}
                        errorFields={errorFields}
                      />
                    </div>
                  )}

                  {/* Hasil Penentuan Golongan Tarif */}
                  <DomesticTariffResultCard
                    totalLuas={parseFloat(String(formData.totalLuasBangunan || formData.luasBangunan || '0'))}
                    isRealEstate={formData.lingkungan?.realEstate === 'Ya'}
                    hasUsaha={Boolean(formData.hasUsahaKomersil)}
                    luasBangunan={formData.luasBangunan || '0'}
                    jumlahLantai={formData.kondisiBangunan?.jumlahLantai || '1'}
                  />
                </div>
              </section>
            )}

            {/* ======================================================== */}
            {/* SECTION 5: UPLOAD DOKUMEN PERSYARATAN & FOTO PROPERTI    */}
            {/* ======================================================== */}
            {currentStep === 5 && (
              <section className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#005DAA] border border-blue-200">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Section 5: Upload Dokumen Persyaratan &amp; Foto Rumah</h2>
                    <p className="text-xs text-slate-500">Unggah foto dokumen e-KTP, Kartu Keluarga, Bukti PBB, dan Foto Tampak Depan Properti / Titik Meter</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* 1. KTP */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">1. Foto e-KTP Pemohon <span className="text-red-500">*</span></span>
                      {formData.persyaratanFiles?.ktp && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Terlampir
                        </span>
                      )}
                    </div>

                    {formData.persyaratanFiles?.ktp ? (
                      <div className="relative group border rounded-xl overflow-hidden bg-black/5 aspect-video flex items-center justify-center">
                        <img
                          src={formData.persyaratanFiles.ktp.dataUrl}
                          alt="KTP"
                          className="max-h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc('ktp')}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => setCameraModalConfig({
                            isOpen: true,
                            targetType: 'document',
                            docKey: 'ktp',
                            title: 'Ambil Foto KTP via Kamera',
                            guideType: 'document'
                          })}
                          className="w-full py-2 px-3 bg-[#005DAA] hover:bg-[#004A88] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          Ambil via Kamera
                        </button>
                        <label className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer text-center">
                          <Upload className="w-3.5 h-3.5" />
                          Pilih File Foto
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleDocUpload('ktp', e, 'file')}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* 2. KK */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">2. Foto Kartu Keluarga (KK)</span>
                      {formData.persyaratanFiles?.kk && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Terlampir
                        </span>
                      )}
                    </div>

                    {formData.persyaratanFiles?.kk ? (
                      <div className="relative group border rounded-xl overflow-hidden bg-black/5 aspect-video flex items-center justify-center">
                        <img
                          src={formData.persyaratanFiles.kk.dataUrl}
                          alt="KK"
                          className="max-h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc('kk')}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => setCameraModalConfig({
                            isOpen: true,
                            targetType: 'document',
                            docKey: 'kk',
                            title: 'Ambil Foto KK via Kamera',
                            guideType: 'document'
                          })}
                          className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-[#005DAA] border border-blue-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          Ambil via Kamera
                        </button>
                        <label className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer text-center">
                          <Upload className="w-3.5 h-3.5" />
                          Pilih File Foto
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleDocUpload('kk', e, 'file')}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* 3. PBB */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">3. Bukti PBB / Tagihan Listrik</span>
                      {formData.persyaratanFiles?.pbb && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Terlampir
                        </span>
                      )}
                    </div>

                    {formData.persyaratanFiles?.pbb ? (
                      <div className="relative group border rounded-xl overflow-hidden bg-black/5 aspect-video flex items-center justify-center">
                        <img
                          src={formData.persyaratanFiles.pbb.dataUrl}
                          alt="PBB"
                          className="max-h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc('pbb')}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => setCameraModalConfig({
                            isOpen: true,
                            targetType: 'document',
                            docKey: 'pbb',
                            title: 'Ambil Foto PBB via Kamera',
                            guideType: 'document'
                          })}
                          className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-[#005DAA] border border-blue-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          Ambil via Kamera
                        </button>
                        <label className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer text-center">
                          <Upload className="w-3.5 h-3.5" />
                          Pilih File Foto
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleDocUpload('pbb', e, 'file')}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* 4. Foto Properti / Rumah Lapangan & Titik Rencana Meter (PINDAHAN DARI PETUGAS) */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">4. Foto Tampak Depan Rumah &amp; Rencana Titik Meter</span>
                      {formData.fotoPropertiFiles && formData.fotoPropertiFiles.length > 0 && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> {formData.fotoPropertiFiles.length} Foto Terlampir
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => setCameraModalConfig({
                          isOpen: true,
                          targetType: 'property',
                          title: 'Foto Properti & Titik Meter via Kamera',
                          guideType: 'property'
                        })}
                        className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-[#005DAA] border border-blue-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        Ambil via Kamera
                      </button>

                      <label className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer text-center">
                        <Upload className="w-3.5 h-3.5" />
                        Pilih File Foto Rumah
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = e.target.files;
                            if (!files || files.length === 0) return;
                            Array.from(files).forEach((file) => {
                              const reader = new FileReader();
                              reader.onload = () => {
                                const newPhoto: PropertyPhoto = {
                                  id: 'photo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
                                  name: file.name,
                                  dataUrl: reader.result as string,
                                  source: 'file',
                                  caption: 'Foto Properti & Titik Sambung',
                                  timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                                };
                                setFormData((prev) => ({
                                  ...prev,
                                  fotoPropertiFiles: [...(prev.fotoPropertiFiles || []), newPhoto],
                                }));
                              };
                              reader.readAsDataURL(file);
                            });
                            e.target.value = '';
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Preview list */}
                    {formData.fotoPropertiFiles && formData.fotoPropertiFiles.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {formData.fotoPropertiFiles.map((photo, idx) => (
                          <div key={photo.id || idx} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video">
                            <img
                              src={photo.dataUrl}
                              alt={photo.name || `Foto Properti ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  fotoPropertiFiles: (prev.fotoPropertiFiles || []).filter((p) => p.id !== photo.id),
                                }));
                              }}
                              className="absolute top-1 right-1 p-1 bg-red-600/90 hover:bg-red-700 text-white rounded-lg transition shadow-md"
                              title="Hapus foto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* ======================================================== */}
            {/* SECTION 6: PORTAL PETUGAS (DOKUMENTASI & PERSETUJUAN)    */}
            {/* ======================================================== */}
            {currentStep === 6 && (
              <section className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#005DAA] border border-blue-200">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Section 6: Portal Petugas Lapangan &amp; Persetujuan</h2>
                    <p className="text-xs text-slate-500">Administrasi teknis, verifikasi jalur distribusi, spesifikasi pipa dinas, dan persetujuan berlangganan</p>
                  </div>
                </div>

                {/* Kolom Petugas Lapangan (Bersih, Terstruktur, Tanpa Foto Properti) */}
                <PetugasOfficerFields
                  formData={formData}
                  setFormData={setFormData}
                  errorFields={errorFields}
                />

                {/* Checkbox Pernyataan Persetujuan Berlangganan */}
                <div className="pt-2">
                  <label className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition ${
                    formData.persetujuan ? 'bg-blue-50/70 border border-blue-200' : 'bg-slate-100/70 hover:bg-slate-100 border border-transparent'
                  } ${errorFields.persetujuan ? 'border-2 border-red-500 bg-red-50' : ''}`}>
                    <input
                      type="checkbox"
                      required
                      checked={Boolean(formData.persetujuan)}
                      onChange={(e) => {
                        setFormData({ ...formData, persetujuan: e.target.checked });
                        if (e.target.checked) {
                          setErrorFields((prev) => ({ ...prev, persetujuan: false }));
                        }
                      }}
                      className="mt-0.5 rounded text-[#005DAA] focus:ring-[#005DAA] w-4 h-4 cursor-pointer shrink-0"
                    />
                    <span className="text-xs text-slate-800 leading-relaxed">
                      "Dengan menandatangani/mengirim formulir ini, Pelanggan menyatakan setuju dan tunduk kepada Syarat dan Ketentuan Berlangganan yang berlaku dan merupakan hubungan kepelangganan yang sah menurut hukum dengan <strong>PT Aetra Air Tangerang</strong>." <span className="text-red-500">*</span>
                    </span>
                  </label>
                </div>
              </section>
            )}

            {/* ======================================================== */}
            {/* BOTTOM NAVIGATION ACTIONS                                */}
            {/* ======================================================== */}
            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Sebelumnya</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold transition cursor-pointer"
                >
                  Kosongkan Form
                </button>

                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#005DAA] hover:bg-[#004A88] text-white text-xs font-bold shadow-md shadow-blue-600/20 transition transform active:scale-98 cursor-pointer"
                  >
                    <span>Selanjutnya</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!isAllRequiredFieldsFilled}
                    className={`inline-flex items-center gap-2 px-7 py-3 rounded-xl text-xs font-black transition transform shadow-lg cursor-pointer ${
                      isAllRequiredFieldsFilled
                        ? 'bg-[#005DAA] hover:bg-[#004A88] text-white shadow-blue-600/30 active:scale-98'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none opacity-70'
                    }`}
                    title={
                      isAllRequiredFieldsFilled
                        ? 'Klik untuk mendaftarkan sambungan baru'
                        : 'Semua isian bertanda bintang (*) wajib dilengkapi terlebih dahulu'
                    }
                  >
                    <CheckCheck className="w-4 h-4 text-emerald-300" />
                    <span>Daftarkan Sambungan Baru</span>
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Auto Camera Device Modal */}
      <CameraCaptureModal
        isOpen={cameraModalConfig.isOpen}
        onClose={() => setCameraModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onCapture={handleDirectCameraCapture}
        title={cameraModalConfig.title}
        guideType={cameraModalConfig.guideType === 'property' ? 'property' : 'document'}
      />
    </div>
  );
};
