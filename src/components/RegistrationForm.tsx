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
  ReceiptText,
  FileText,
  Eye,
  Store,
  Building,
  School,
  Landmark,
  Image as ImageIcon,
  CheckSquare
} from 'lucide-react';
import { CameraCaptureModal } from './CameraCaptureModal';
import { InteractiveMapPicker } from './InteractiveMapPicker';
import { calculateDomesticTariff } from '../data/domesticTariffs';
import { INDONESIA_PROVINCES_DATA, AETRA_TANGERANG_INSTALLATION_REGIONS } from '../data/indonesiaRegions';
import { BuildingEnvironmentFields } from './BuildingEnvironmentFields';
import { PetugasOfficerFields } from './PetugasOfficerFields';
import { DomesticTariffResultCard } from './DomesticTariffResultCard';
import { saveRegistrationToDb } from '../services/supabaseService';
import { TermsAndConditionsModal } from './TermsAndConditionsModal';
import { DocumentImageViewerModal } from './DocumentImageViewerModal';

export const SOSIAL_INSTANSI_OPTIONS = [
  'Tempat Ibadah (Masjid / Gereja / Pura / Vihara)',
  'Asrama Badan Sosial / Panti Asuhan',
  'Rumah Yatim Piatu & Lembaga Kesejahteraan',
  'Kantor Instansi Pemerintah / Balai Desa',
  'Kantor Perwakilan Lembaga Asing / Konsulat',
  'Lembaga Pendidikan Swasta / Yayasan Non Komersial',
  'Instansi Perguruan Tinggi / Kursus Terdaftar',
  'Fasilitas TNI / POLRI / Pos Keamanan',
];

export const USAHA_OPTIONS = [
  'Kios / Warung Kelontong',
  'Bengkel Motor / Mobil Kecil',
  'Usaha Kecil Mandiri',
  'Pergudangan / Ekspedisi Logistik',
  'Usaha Mikro Dalam Rumah Tangga (UMKM)',
  'Tempat Pangkas Rambut / Salon Kecantikan',
  'Bengkel Bubut / Mesin Menengah',
  'Usaha Dagang & Toko Grosir Menengah',
  'Konveksi / Industri Pakaian Rumah Tangga',
  'Rumah Makan / Cafe / Restoran',
  'RS. Swasta / Poliklinik / Laboratorium Medis',
  'Praktek Dokter / Klinik Bersalin',
  'Kantor Pengacara / Notaris / Konsultan',
  'Perusahaan Perdagangan / Niaga / Ruko',
  'Pusat Kebugaran / Gym / Sarana Olahraga',
  'Laundromat / Jasa Cuci Kiloan',
];

export const getDraftKey = (user?: UserAccount | null) => {
  if (!user) return 'aetra_draft_guest';
  return `aetra_draft_${user.id || user.idPelanggan || user.email}`;
};

export const getNextSrNumber = (existingList?: RegistrationFormData[]): string => {
  try {
    let list = existingList;
    if (!list || list.length === 0) {
      const saved = localStorage.getItem('aetra_registrations');
      if (saved) {
        list = JSON.parse(saved);
      }
    }
    const baseNumber = 165050;
    if (!list || list.length === 0) {
      return String(baseNumber);
    }
    const srNumbers = list
      .map((item) => {
        const num = parseInt(item.noSr?.replace(/\D/g, '') || '', 10);
        return isNaN(num) ? 0 : num;
      })
      .filter((n) => n >= baseNumber);
    if (srNumbers.length === 0) {
      return String(baseNumber);
    }
    const maxSr = Math.max(...srNumbers);
    return String(maxSr + 1);
  } catch {
    return '165050';
  }
};

export const getEmptyFormData = (user?: UserAccount | null, existingList?: RegistrationFormData[]): RegistrationFormData => ({
  id: 'reg-' + Date.now(),
  noSr: getNextSrNumber(existingList),
  noForm: String(Math.floor(100000 + Math.random() * 900000)),
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
  const [isTermsModalOpen, setIsTermsModalOpen] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  const [formData, setFormData] = useState<RegistrationFormData>(() => {
    const draftKey = getDraftKey(currentUser);
    try {
      const draftStr = localStorage.getItem(draftKey);
      if (draftStr) {
        const parsed = JSON.parse(draftStr);
        if (parsed && typeof parsed === 'object') {
          return {
            ...getEmptyFormData(currentUser, existingRegistrations),
            ...parsed,
            noSr: parsed.noSr || getNextSrNumber(existingRegistrations),
            namaKtp: parsed.namaKtp || currentUser?.nama || '',
            email: parsed.email || currentUser?.email || '',
          };
        }
      }
    } catch (e) {
      console.warn('Error reading draft:', e);
    }
    return getEmptyFormData(currentUser, existingRegistrations);
  });

  const [notification, setNotification] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<RegistrationFormData | null>(null);
  const [forceShowForm, setForceShowForm] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [errorFields, setErrorFields] = useState<Record<string, boolean>>({});

  // Payment confirmation form state (simplified without name & account number as requested)
  const [paymentProofData, setPaymentProofData] = useState<{
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
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

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

  const [cameraModalConfig, setCameraModalConfig] = useState<{
    isOpen: boolean;
    targetType: 'document' | 'property' | 'payment';
    propertySlot?: 'depan' | 'samping' | 'meter';
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
      if (SOSIAL_INSTANSI_OPTIONS.some((opt) => formData.fungsiBangunan.includes(opt.split(' ')[0])) || formData.fungsiBangunan.includes('Sosial')) {
        return 'sosial_instansi';
      }
      if (USAHA_OPTIONS.some((opt) => formData.fungsiBangunan.includes(opt.split(' ')[0])) || formData.fungsiBangunan.includes('Usaha')) {
        return 'usaha';
      }
    }
    return 'rumah_tangga';
  });

  // Calculate dynamic tariff
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
      namaPengirim: activeExistingRegistration.namaKtp,
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
    setNotification('Bukti transfer berhasil dikirim! Petugas Kasir & Verifikator Aetra akan memeriksa dan mengaktifkan ID Pelanggan Anda.');
    setTimeout(() => setNotification(null), 5000);
  };

  // Section Definitions
  const SECTIONS = [
    { number: 1, title: 'Data Diri', subtitle: 'Identitas & No. SR' },
    { number: 2, title: 'Alamat KTP', subtitle: 'Domisili Kependudukan' },
    { number: 3, title: 'Alamat Pasang', subtitle: 'Titik Sambungan Baru' },
    { number: 4, title: 'Upload Dokumen', subtitle: 'KTP, KK & Bukti PBB' },
    { number: 5, title: 'Kondisi & Tarif', subtitle: 'Peruntukan & Foto Rumah' },
    { number: 6, title: 'Petugas Lapangan', subtitle: 'Verifikasi & Persetujuan' },
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

  // Dedicated property photos slots (Tampak Depan, Tampak Samping, Rencana Titik Meter)
  const handlePropertyPhotoUpload = (slot: 'depan' | 'samping' | 'meter', file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const captions = {
        depan: 'Foto Tampak Depan Bangunan',
        samping: 'Foto Tampak Samping Bangunan',
        meter: 'Foto Rencana Titik Meter Air',
      };
      const newPhoto: PropertyPhoto = {
        id: `photo-${slot}-${Date.now()}`,
        name: file.name,
        dataUrl: reader.result as string,
        source: 'file',
        caption: captions[slot],
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setFormData((prev) => {
        const existing = (prev.fotoPropertiFiles || []).filter((p) => !p.caption?.includes(captions[slot]));
        return {
          ...prev,
          fotoPropertiFiles: [...existing, newPhoto],
        };
      });
    };
    reader.readAsDataURL(file);
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

    if (cameraModalConfig.targetType === 'property' && cameraModalConfig.propertySlot) {
      const slot = cameraModalConfig.propertySlot;
      const captions = {
        depan: 'Foto Tampak Depan Bangunan',
        samping: 'Foto Tampak Samping Bangunan',
        meter: 'Foto Rencana Titik Meter Air',
      };
      const newPhoto: PropertyPhoto = {
        id: `photo-${slot}-${Date.now()}`,
        name: `Foto Kamera ${captions[slot]}`,
        dataUrl,
        source: 'camera',
        caption: captions[slot],
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setFormData((prev) => {
        const existing = (prev.fotoPropertiFiles || []).filter((p) => !p.caption?.includes(captions[slot]));
        return {
          ...prev,
          fotoPropertiFiles: [...existing, newPhoto],
        };
      });
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
      setCameraModalConfig((prev) => ({ ...prev, isOpen: false }));
    }
  };

  // Validation
  const validateStep = (stepNum: number): boolean => {
    const errors: string[] = [];
    const fields: Record<string, boolean> = {};

    if (stepNum === 1) {
      if (!formData.noSr?.trim()) {
        errors.push('No. SR Sambungan Rumah wajib diisi');
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
      if (!formData.persyaratan?.ktp && !formData.persyaratanFiles?.ktp) {
        errors.push('Foto e-KTP Pemohon wajib diunggah');
        fields.ktpDoc = true;
      }
    } else if (stepNum === 5) {
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
      }
    } else if (stepNum === 6) {
      if (!formData.persetujuan) {
        errors.push('Persetujuan Syarat & Ketentuan Berlangganan wajib dicentang');
        fields.persetujuan = true;
      }
    }

    setValidationErrors(errors);
    setErrorFields(fields);
    return errors.length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      const next = currentStep + 1;
      setCurrentStep(next);
      if (next > highestStepReached) setHighestStepReached(next);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(6)) return;

    const newRecord: RegistrationFormData = {
      ...formData,
      statusPendaftaran: 'REGISTERED',
      status_pendaftaran: 'REGISTERED',
      trackingStep: 1,
      statusPembayaran: 'Menunggu Verifikasi Berkas',
      createdAt: new Date().toISOString(),
    };

    onRegisterSuccess(newRecord);
    setSubmittedRecord(newRecord);
    setForceShowForm(false);
    setNotification('Pendaftaran Berhasil Dikirim! Berkas Anda sedang dalam verifikasi oleh Petugas Administrasi Aetra.');
    setTimeout(() => setNotification(null), 5000);
  };

  const handleReset = () => {
    if (confirm('Kosongkan dan reset seluruh isian formulir?')) {
      const empty = getEmptyFormData(currentUser, existingRegistrations);
      setFormData(empty);
      setCurrentStep(1);
      setHighestStepReached(1);
    }
  };

  const isAllRequiredFieldsFilled = Boolean(
    formData.noSr &&
    formData.namaKtp &&
    formData.noKtp &&
    formData.alamatPasang &&
    (formData.persyaratanFiles?.ktp || formData.persyaratan?.ktp) &&
    formData.persetujuan
  );

  const isApprovedPaymentStage = Boolean(
    activeExistingRegistration &&
    (activeExistingRegistration.status_pendaftaran === 'WAITING_PAYMENT' ||
     activeExistingRegistration.status_pendaftaran === 'PAYMENT_PENDING' ||
     activeExistingRegistration.status_pendaftaran === 'PAYMENT_CONFIRMED' ||
     activeExistingRegistration.currentStep === 2)
  );

  const isFullyConnectedStage = Boolean(
    activeExistingRegistration &&
    (activeExistingRegistration.trackingStep === 5 ||
     activeExistingRegistration.currentStep === 5 ||
     activeExistingRegistration.status_pendaftaran === 'COMPLETED' ||
     activeExistingRegistration.status_pendaftaran === 'PAYMENT_VERIFIED')
  );

  const getSlotPhoto = (slot: 'depan' | 'samping' | 'meter') => {
    const captions = {
      depan: 'Foto Tampak Depan Bangunan',
      samping: 'Foto Tampak Samping Bangunan',
      meter: 'Foto Rencana Titik Meter Air',
    };
    return (formData.fotoPropertiFiles || []).find((p) => p.caption?.includes(captions[slot]));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
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

      {/* JIKA PELANGGAN TELAH SELESAI / MEMILIKI SAMBUNGAN AKTIF */}
      {activeExistingRegistration && !forceShowForm ? (
        isFullyConnectedStage ? (
          /* PROFIL PELANGGAN RESMI - HANYA 5 KOLOM SESUAI PERMINTAAN */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div className="bg-gradient-to-r from-[#005DAA] via-[#004B8A] to-[#003868] text-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-4 border-emerald-400">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300 shadow-inner">
                  <CheckCircle2 className="w-8 h-8 text-emerald-300" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 px-3 py-0.5 rounded-full">
                    Sambungan Aktif &bull; Air Mengalir 24 Jam
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                    Profil Pelanggan PT Aetra Air Tangerang
                  </h2>
                  <p className="text-xs text-blue-100 mt-0.5">
                    Data pokok identitas kepelangganan resmi Anda
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTracking(activeExistingRegistration.noForm)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#005DAA] hover:bg-blue-50 font-bold text-xs shadow-md transition cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#005DAA]" />
                <span>Lihat Status Sambungan</span>
              </button>
            </div>

            {/* 5 DATA POKOK SAJA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. ID Pelanggan */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  1. Nomor ID Pelanggan (Tetap)
                </span>
                <div className="text-lg sm:text-xl font-mono font-black text-emerald-950 flex items-center gap-2">
                  <span>{activeExistingRegistration.idPelanggan || '10842918'}</span>
                  <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                    Resmi AAT
                  </span>
                </div>
                <span className="text-[11px] text-emerald-700 block">
                  Gunakan ID ini untuk pembayaran tagihan bulanan
                </span>
              </div>

              {/* 2. Nama Lengkap */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  2. Nama Pelanggan (Sesuai KTP)
                </span>
                <div className="text-base font-bold text-slate-900 truncate">
                  {activeExistingRegistration.namaKtp || currentUser?.nama || '-'}
                </div>
                <span className="text-[11px] text-slate-500 block">
                  NIK: {activeExistingRegistration.noKtp || '-'}
                </span>
              </div>

              {/* 3. Nomor Telepon */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  3. Nomor Telepon / WhatsApp
                </span>
                <div className="text-base font-mono font-bold text-emerald-800">
                  {activeExistingRegistration.telpHp || '-'}
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Kontak resmi notifikasi billing &amp; info layanan
                </span>
              </div>

              {/* 4. Alamat Email */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  4. Alamat Email
                </span>
                <div className="text-base font-bold text-slate-900 truncate">
                  {activeExistingRegistration.email || currentUser?.email || '-'}
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Pengiriman e-billing dan bukti resmi
                </span>
              </div>

              {/* 5. Alamat Pemasangan */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 md:col-span-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  5. Alamat Pemasangan Sambungan
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                  {activeExistingRegistration.alamatPasang}, RT/RW {activeExistingRegistration.rtRwPasang}, Kel. {activeExistingRegistration.kelurahanPasang || activeExistingRegistration.desaPasang}, Kec. {activeExistingRegistration.kecamatanPasang}, {activeExistingRegistration.kotaPasang || 'Kabupaten Tangerang'} ({activeExistingRegistration.kodePosPasang || '15520'})
                </p>
                <span className="text-[11px] text-slate-500 block">
                  Titik lokasi terpasang water meter air bersih aktif
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* JIKA MASIH DALAM PROSES PENDAFTARAN / PEMBAYARAN */
          <div className="bg-white rounded-3xl border-2 border-blue-400 shadow-xl p-6 sm:p-8 space-y-6 animate-in fade-in">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-amber-50 border border-blue-200 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-13 h-13 rounded-2xl bg-[#005DAA] text-white flex items-center justify-center shadow-md shrink-0 mt-0.5">
                  {isApprovedPaymentStage ? (
                    <CreditCard className="w-7 h-7 text-amber-300 animate-bounce" />
                  ) : (
                    <Clock className="w-7 h-7 text-amber-300 animate-pulse" />
                  )}
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-black tracking-wider text-white bg-[#005DAA] px-3 py-0.5 rounded-full shadow-2xs">
                      Status Permohonan
                    </span>
                    <span className={`text-[10px] uppercase font-black tracking-wider px-3 py-0.5 rounded-full border ${
                      activeExistingRegistration.status_pendaftaran === 'WAITING_PAYMENT' || activeExistingRegistration.status_pendaftaran === 'PAYMENT_PENDING'
                        ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                        : activeExistingRegistration.status_pendaftaran === 'PAYMENT_CONFIRMED'
                        ? 'bg-purple-100 text-purple-900 border-purple-300 font-bold'
                        : 'bg-sky-100 text-[#005DAA] border-sky-300 font-bold'
                    }`}>
                      {activeExistingRegistration.status_pendaftaran === 'WAITING_PAYMENT' || activeExistingRegistration.status_pendaftaran === 'PAYMENT_PENDING'
                        ? 'Tahap 2: Permohonan Disetujui • Menunggu Pembayaran'
                        : activeExistingRegistration.status_pendaftaran === 'PAYMENT_CONFIRMED'
                        ? 'Tahap 2: Bukti Transfer Terkirim • Menunggu Aktivasi ID'
                        : 'Tahap 1: Verifikasi Berkas & Persyaratan'}
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                    {isApprovedPaymentStage
                      ? 'Permohonan Disetujui! Silakan Lakukan Pembayaran Biaya Sambungan'
                      : 'Permohonan Sambungan Baru Anda Sedang Dalam Tahap Verifikasi'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    {isApprovedPaymentStage
                      ? 'Nomor Pembayaran telah diterbitkan oleh Admin. Silakan transfer melalui kanal mitra resmi AETRA di bawah ini dan upload struk transfer Anda.'
                      : 'Berkas identitas e-KTP dan survei teknis jaringan Anda sedang diperiksa oleh Petugas AETRA. Mohon cek berkala.'}
                  </p>
                </div>
              </div>

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
            </div>

            {/* SEKSI PEMBAYARAN KETIKA NOMOR PEMBAYARAN DITERBITKAN */}
            {isApprovedPaymentStage && (
              <div className="space-y-5">
                {/* Banner Nomor Pembayaran */}
                <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-[#005DAA] text-white rounded-2xl p-6 shadow-md space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/20 pb-4">
                    <div>
                      <span className="text-xs font-bold text-emerald-200 uppercase tracking-widest block">
                        Nomor Pembayaran Pelanggan (Kode Bayar / Virtual Account)
                      </span>
                      <div className="text-2xl sm:text-3xl font-mono font-black tracking-wider text-white mt-1">
                        {activeExistingRegistration.nomorPembayaran || activeExistingRegistration.nomor_pembayaran || '88290165050'}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const noBayar = activeExistingRegistration.nomorPembayaran || activeExistingRegistration.nomor_pembayaran || '88290165050';
                        navigator.clipboard.writeText(noBayar);
                        setNotification('Nomor Pembayaran berhasil disalin ke clipboard!');
                        setTimeout(() => setNotification(null), 3000);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition shadow-xs cursor-pointer self-start sm:self-center"
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
                      <span className="text-[10px] text-emerald-200 block">Kanal Pembayaran Resmi</span>
                      <strong className="text-xs text-white">Bank Mandiri, BCA, BRI, BNI, Indomaret, Alfamart</strong>
                    </div>

                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
                      <span className="text-[10px] text-emerald-200 block">Status Saat Ini</span>
                      <strong className="text-xs text-amber-300 font-bold">
                        {activeExistingRegistration.paymentProof ? 'Menunggu Aktivasi ID Petugas' : 'Menunggu Konfirmasi Bayar'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Saluran Pembayaran AETRA Lengkap & Upload Struk Transfer */}
                <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border-2 border-sky-200 space-y-4">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <ReceiptText className="w-5 h-5 text-[#005DAA]" />
                    <span>Upload Bukti Pembayaran Biaya Sambungan Baru</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Lakukan pelunasan menggunakan Nomor Pembayaran di atas pada salah satu saluran resmi AETRA, lalu unggah struk transfer Anda:
                  </p>

                  {/* Saluran Pembayaran Info Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 font-medium text-slate-700">
                      <strong className="text-[#005DAA] block font-bold">Bank Mandiri</strong>
                      <span>ATM &bull; Livin&apos; by Mandiri</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 font-medium text-slate-700">
                      <strong className="text-[#005DAA] block font-bold">Bank BCA</strong>
                      <span>ATM &bull; KlikBCA &bull; myBCA</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 font-medium text-slate-700">
                      <strong className="text-[#005DAA] block font-bold">Bank BRI &amp; BNI</strong>
                      <span>ATM &bull; BRImo &bull; BNI Mobile</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 font-medium text-slate-700">
                      <strong className="text-[#005DAA] block font-bold">Minimarket &amp; E-Wallet</strong>
                      <span>Indomaret, Alfamart, Tokopedia</span>
                    </div>
                  </div>

                  {activeExistingRegistration.paymentProof ? (
                    <div className="bg-white p-4 rounded-xl border-2 border-emerald-400 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Bukti Struk Transfer Telah Terkirim
                        </span>
                        <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full">
                          Menunggu Input ID Pelanggan oleh Admin
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-4 text-xs">
                        {activeExistingRegistration.paymentProof.dataUrl && (
                          <div
                            onClick={() => setActiveViewer({
                              isOpen: true,
                              imageUrl: activeExistingRegistration.paymentProof!.dataUrl,
                              title: 'Bukti Transfer Pembayaran Biaya Sambungan Baru',
                              description: `Struk pembayaran melalui ${activeExistingRegistration.paymentProof?.bank} (${activeExistingRegistration.paymentProof?.tanggalBayar})`,
                            })}
                            className="group cursor-pointer rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video w-44 shrink-0 flex items-center justify-center relative shadow-xs"
                          >
                            <img
                              src={activeExistingRegistration.paymentProof.dataUrl}
                              alt="Bukti Transfer"
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 text-white text-[10px] font-bold">
                              <Eye className="w-3.5 h-3.5" /> Buka Foto
                            </div>
                          </div>
                        )}

                        <div className="space-y-1 text-slate-700">
                          <div>Saluran: <strong className="text-slate-900">{activeExistingRegistration.paymentProof.bank}</strong></div>
                          <div>Tanggal Bayar: <strong className="text-slate-900">{activeExistingRegistration.paymentProof.tanggalBayar}</strong></div>
                          {activeExistingRegistration.paymentProof.catatan && (
                            <div>Catatan: <span className="italic text-slate-600">&ldquo;{activeExistingRegistration.paymentProof.catatan}&rdquo;</span></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* FORM UPLOAD STRUK TRANSFER (TANPA NAMA PENGIRIM & NO REKENING SESUAI PERMINTAAN) */
                    <div className="bg-white p-4 sm:p-5 rounded-xl border border-sky-200 space-y-4 shadow-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            Saluran / Bank Pembayaran <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={paymentProofData.bank}
                            onChange={(e) => setPaymentProofData({ ...paymentProofData, bank: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
                          >
                            <option value="Bank BCA (Virtual Account)">Bank BCA (Virtual Account)</option>
                            <option value="Bank Mandiri (Bill Payment)">Bank Mandiri (Bill Payment)</option>
                            <option value="Bank BRI (BRIVA)">Bank BRI (BRIVA)</option>
                            <option value="Bank BNI (Virtual Account)">Bank BNI (Virtual Account)</option>
                            <option value="Bank Danamon / CIMB Niaga / Permata">Bank Danamon / CIMB Niaga / Permata</option>
                            <option value="Indomaret / Alfamart / Alfamidi">Indomaret / Alfamart / Alfamidi</option>
                            <option value="Tokopedia / Shopee / E-Commerce">Tokopedia / Shopee / E-Commerce</option>
                            <option value="Kantor Pos Indonesia">Kantor Pos Indonesia</option>
                            <option value="Loket Resmi Aetra (Curug / Pasar Kemis)">Loket Resmi Aetra (Curug / Pasar Kemis)</option>
                          </select>
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

                      {/* Upload Foto Struk */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-800">
                          Foto Struk / Tangkapan Layar (Screenshot) Transfer <span className="text-red-500">*</span>
                        </label>

                        {paymentProofData.fileUrl ? (
                          <div className="relative border rounded-xl overflow-hidden bg-slate-100 max-w-xs aspect-video flex items-center justify-center">
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

                            <label className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition cursor-pointer shadow-2xs">
                              <Upload className="w-4 h-4" />
                              <span>Pilih File Struk</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    setPaymentProofData((prev) => ({ ...prev, fileUrl: reader.result as string }));
                                  };
                                  reader.readAsDataURL(file);
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        )}
                      </div>

                      {/* Tombol Konfirmasi Pembayaran */}
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          disabled={!paymentProofData.fileUrl || isSubmittingPayment}
                          onClick={handleConfirmPayment}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md transition cursor-pointer"
                        >
                          <CheckCheck className="w-4 h-4" />
                          <span>{isSubmittingPayment ? 'Mengirim Bukti...' : 'Konfirmasi & Kirim Bukti Pembayaran'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        /* ======================================================== */
        /* FORM PENDAFTARAN SAMBUNGAN BARU (6 SECTION)              */
        /* ======================================================== */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in">
          {/* Header Banner Form */}
          <div className="bg-gradient-to-r from-[#005DAA] via-[#004B8A] to-[#003868] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-4 border-[#F37021]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-amber-400 text-slate-900 px-3 py-0.5 rounded-full">
                  Formulir Permohonan Resmi
                </span>
                <span className="text-xs text-blue-100 font-mono font-bold bg-white/10 px-2 py-0.5 rounded">
                  No. SR: {formData.noSr || '165050'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                Pendaftaran Sambungan Air Bersih Baru
              </h1>
              <p className="text-xs sm:text-sm text-blue-100">
                PT AETRA AIR TANGERANG &bull; Isi data identitas, alamat, dokumen, dan spesifikasi hunian secara lengkap
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsTermsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold backdrop-blur-md transition cursor-pointer self-start md:self-center"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>Syarat &amp; Ketentuan Berlangganan</span>
            </button>
          </div>

          {/* Stepper Navigation */}
          <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {SECTIONS.map((sec) => {
                const isCurrent = currentStep === sec.number;
                const isPassed = currentStep > sec.number;
                return (
                  <button
                    key={sec.number}
                    type="button"
                    onClick={() => {
                      if (sec.number <= highestStepReached) {
                        setCurrentStep(sec.number);
                      }
                    }}
                    className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                      isCurrent
                        ? 'bg-blue-50 border-[#005DAA] text-[#005DAA] shadow-xs ring-2 ring-[#005DAA]'
                        : isPassed
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isCurrent
                        ? 'bg-[#005DAA] text-white'
                        : isPassed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {isPassed ? <Check className="w-3.5 h-3.5" /> : sec.number}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-[11px] font-bold truncate leading-tight">{sec.title}</div>
                      <div className="text-[10px] text-slate-500 truncate">{sec.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Validation Warning Box */}
          {validationErrors.length > 0 && (
            <div className="m-6 p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Mohon lengkapi isian wajib berikut sebelum melanjutkan:</span>
              </div>
              <ul className="list-disc pl-5 text-xs text-rose-700 space-y-1 font-medium">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* FORM BODY */}
          <form onSubmit={currentStep === 6 ? handleFinalSubmit : (e) => { e.preventDefault(); handleNextStep(); }} noValidate className="p-6 sm:p-8 space-y-6">
            
            {/* ======================================================== */}
            {/* SECTION 1: DATA DIRI & NO. SR OTOMATIS                   */}
            {/* ======================================================== */}
            {currentStep === 1 && (
              <section className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#005DAA] border border-blue-200">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Section 1: Data Diri Pemohon</h2>
                    <p className="text-xs text-slate-500">Isi data identitas diri pemohon sesuai KTP resmi &amp; Nomor SR</p>
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

                  {/* NO. SR AUTO-SET DARI 165050 BERURUT */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-800">
                        No. SR (Sambungan Rumah) <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Otomatis Terbit (Mulai 165050)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3.5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300">
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
                        placeholder="165050"
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
                      placeholder="Nama lengkap pemohon sesuai e-KTP"
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
                        setFormData({ ...formData, noKtp: e.target.value.replace(/\D/g, '') });
                        setErrorFields((prev) => ({ ...prev, noKtp: false }));
                      }}
                      placeholder="16 digit NIK e-KTP"
                      className={`w-full px-3 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider focus:outline-hidden transition ${
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
                      placeholder="Karyawan Swasta, Wiraswasta, PNS, dll"
                      className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-hidden transition ${
                        errorFields.pekerjaan ? 'border-2 border-red-500 bg-red-50' : 'bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Nomor HP / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.telpHp}
                      onChange={(e) => {
                        setFormData({ ...formData, telpHp: e.target.value });
                        setErrorFields((prev) => ({ ...prev, telpHp: false }));
                      }}
                      placeholder="Contoh: 081299887766"
                      className={`w-full px-3 py-2.5 rounded-xl text-xs font-mono font-bold focus:outline-hidden transition ${
                        errorFields.telpHp ? 'border-2 border-red-500 bg-red-50' : 'bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email.pelanggan@example.com"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* ======================================================== */}
            {/* SECTION 2: ALAMAT KTP (SEMUA PROVINSI & KECAMATAN)       */}
            {/* ======================================================== */}
            {currentStep === 2 && (
              <section className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#005DAA] border border-blue-200">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Section 2: Alamat KTP Pemohon</h2>
                    <p className="text-xs text-slate-500">Pilih wilayah domisili kependudukan sesuai e-KTP (Lengkap seluruh Indonesia)</p>
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

                    {/* Provinsi Dropdown */}
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

                    {/* Kota / Kabupaten Dropdown */}
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

                    {/* Kecamatan Dropdown Lengkap */}
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

                    {/* Kelurahan / Desa Dropdown */}
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
                        ).map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Kode Pos KTP */}
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
                        placeholder="15560"
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
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#005DAA] border border-blue-200">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Section 3: Alamat Pemasangan Sambungan Baru</h2>
                    <p className="text-xs text-slate-500">Titik persil lokasi pemasangan water meter di wilayah layanan Kabupaten Tangerang</p>
                  </div>
                </div>

                {/* Google Maps Interactive Picker */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    Pilih Titik Lokasi Pemasangan via Peta Interaktif
                  </label>
                  <InteractiveMapPicker
                    initialLat={formData.dataPasang?.gpsLat || '-6.236600'}
                    initialLng={formData.dataPasang?.gpsLong || '106.562100'}
                    onLocationChange={(lat, lng) => {
                      setFormData((prev) => ({
                        ...prev,
                        dataPasang: {
                          ...prev.dataPasang,
                          gpsLat: lat,
                          gpsLong: lng,
                        },
                      }));
                    }}
                    onLocationSelect={(lat, lng, address) => {
                      const numLat = Number(lat);
                      const numLng = Number(lng);
                      setFormData((prev) => ({
                        ...prev,
                        dataPasang: {
                          ...prev.dataPasang,
                          gpsLat: isNaN(numLat) ? String(lat) : numLat.toFixed(6),
                          gpsLong: isNaN(numLng) ? String(lng) : numLng.toFixed(6),
                        },
                        alamatPasang: address || prev.alamatPasang,
                      }));
                    }}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Alamat Lengkap Jalan / No. Rumah (Titik Pasang) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.alamatPasang}
                      onChange={(e) => {
                        setFormData({ ...formData, alamatPasang: e.target.value });
                        setErrorFields((prev) => ({ ...prev, alamatPasang: false }));
                      }}
                      placeholder="Contoh: Jl. Raya Pasir Gadung No. 45, Blok C2"
                      className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-hidden ${
                        errorFields.alamatPasang ? 'border-2 border-red-500 bg-red-50' : 'bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
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
                        value={formData.rtRwPasang}
                        onChange={(e) => {
                          setFormData({ ...formData, rtRwPasang: e.target.value });
                          setErrorFields((prev) => ({ ...prev, rtRwPasang: false }));
                        }}
                        placeholder="Contoh: 002/005"
                        className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-medium focus:outline-hidden ${
                          errorFields.rtRwPasang ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                        }`}
                      />
                    </div>

                    {/* Kecamatan Pasang Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Kecamatan (Kab. Tangerang) <span className="text-red-500">*</span>
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
                          <option key={k.name} value={k.name}>
                            {k.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Kelurahan Pasang Dropdown */}
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
                      Status Kepemilikan Bangunan <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['Milik Sendiri', 'Kontrak / Sewa', 'Dinas', 'Lainnya'].map((opt) => (
                        <label
                          key={opt}
                          onClick={() => {
                            setFormData({ ...formData, statusKepemilikan: opt });
                            setErrorFields((prev) => ({ ...prev, statusKepemilikan: false }));
                          }}
                          className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition flex items-center gap-2.5 ${
                            formData.statusKepemilikan === opt
                              ? 'bg-blue-50 border-[#005DAA] text-[#005DAA] shadow-xs ring-1 ring-[#005DAA]'
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

                    {formData.statusKepemilikan === 'Lainnya' && (
                      <div className="pt-2 animate-in fade-in">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Keterangan Status Kepemilikan Properti Lainnya <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.statusKepemilikanLainnya || ''}
                          onChange={(e) => setFormData({ ...formData, statusKepemilikanLainnya: e.target.value })}
                          placeholder="Contoh: Rumah Keluarga / Warisan / Hak Guna Bangunan (HGB)..."
                          className="w-full px-3.5 py-2 bg-white border border-blue-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden shadow-2xs"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* ======================================================== */}
            {/* SECTION 4: UPLOAD DOKUMEN PERSYARATAN (KTP, KK, PBB)     */}
            {/* ======================================================== */}
            {currentStep === 4 && (
              <section className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#005DAA] border border-blue-200">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Section 4: Upload Dokumen Persyaratan</h2>
                    <p className="text-xs text-slate-500">Unggah foto dokumen e-KTP pemohon, Kartu Keluarga (KK), dan Bukti Lunas PBB / Listrik</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                      <span className="text-xs font-bold text-slate-900">3. Bukti Lunas PBB / Listrik</span>
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
                </div>
              </section>
            )}

            {/* ======================================================== */}
            {/* SECTION 5: KONDISI & TARIF + 3 FOTO PROPERTI LAPANGAN    */}
            {/* ======================================================== */}
            {currentStep === 5 && (
              <section className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#005DAA] border border-blue-200">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Section 5: Kondisi Bangunan, Golongan Tarif &amp; 3 Foto Properti</h2>
                    <p className="text-xs text-slate-500">Penentuan golongan tarif otomatis dan dokumentasi foto tampak depan, tampak samping, dan titik meter</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Kategori Utama Peruntukan */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                    <label className="block text-xs font-bold text-slate-800">
                      Kategori Peruntukan Bangunan <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'rumah_tangga', label: 'Rumah Tangga', icon: Home, desc: 'Tempat tinggal / hunian keluarga murni' },
                        { id: 'sosial_instansi', label: 'Sosial / Instansi', icon: Landmark, desc: 'Tempat ibadah, asrama & fasilitas publik' },
                        { id: 'usaha', label: 'Usaha / Bisnis', icon: Store, desc: 'Toko, ruko, warung, kantor & niaga' },
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
                                setFormData({ ...formData, fungsiBangunan: USAHA_OPTIONS[0] });
                              }
                            }}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ${
                              isSelected
                                ? 'bg-blue-50/90 border-[#005DAA] shadow-xs'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#005DAA] text-white' : 'bg-slate-100 text-slate-600'}`}>
                              <Icon className="w-5 h-5" />
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

                  {/* OPSI LENGKAP SOSIAL / INSTANSI */}
                  {kategoriFungsi === 'sosial_instansi' && (
                    <div className="bg-emerald-50/70 p-5 rounded-2xl border-2 border-emerald-300 space-y-3 animate-in fade-in">
                      <label className="block text-xs font-bold text-emerald-950">
                        Pilih Jenis Peruntukan Sosial / Instansi <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {SOSIAL_INSTANSI_OPTIONS.map((opt) => (
                          <label
                            key={opt}
                            onClick={() => setFormData({ ...formData, fungsiBangunan: opt })}
                            className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition flex items-center gap-2.5 ${
                              formData.fungsiBangunan === opt
                                ? 'bg-white border-emerald-600 text-emerald-900 shadow-xs ring-1 ring-emerald-500'
                                : 'bg-white/80 border-emerald-200 hover:bg-white text-slate-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name="fungsiBangunanSosial"
                              checked={formData.fungsiBangunan === opt}
                              onChange={() => setFormData({ ...formData, fungsiBangunan: opt })}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* OPSI LENGKAP USAHA */}
                  {kategoriFungsi === 'usaha' && (
                    <div className="bg-amber-50/70 p-5 rounded-2xl border-2 border-amber-300 space-y-3 animate-in fade-in">
                      <label className="block text-xs font-bold text-amber-950">
                        Pilih Jenis Kegiatan Usaha / Komersial <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {USAHA_OPTIONS.map((opt) => (
                          <label
                            key={opt}
                            onClick={() => setFormData({ ...formData, fungsiBangunan: opt })}
                            className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition flex items-center gap-2.5 ${
                              formData.fungsiBangunan === opt
                                ? 'bg-white border-amber-600 text-amber-900 shadow-xs ring-1 ring-amber-500'
                                : 'bg-white/80 border-amber-200 hover:bg-white text-slate-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name="fungsiBangunanUsaha"
                              checked={formData.fungsiBangunan === opt}
                              onChange={() => setFormData({ ...formData, fungsiBangunan: opt })}
                              className="text-amber-600 focus:ring-amber-500"
                            />
                            <span className="truncate">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* JIKA RUMAH TANGGA: LUAS & LINGKUNGAN */}
                  {kategoriFungsi === 'rumah_tangga' && (
                    <div className="space-y-4">
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

                      <BuildingEnvironmentFields
                        formData={formData}
                        setFormData={setFormData}
                        errorFields={errorFields}
                      />
                    </div>
                  )}

                  {/* HASIL GOLONGAN TARIF */}
                  <DomesticTariffResultCard
                    totalLuas={parseFloat(String(formData.totalLuasBangunan || formData.luasBangunan || '0'))}
                    isRealEstate={formData.lingkungan?.realEstate === 'Ya'}
                    hasUsaha={Boolean(formData.hasUsahaKomersil)}
                    luasBangunan={formData.luasBangunan || '0'}
                    jumlahLantai={formData.kondisiBangunan?.jumlahLantai || '1'}
                  />

                  {/* 3 FOTO PROPERTI LAPANGAN SESUAI PERMINTAAN NO 17 */}
                  <div className="bg-slate-50 p-5 rounded-2xl border-2 border-blue-200 space-y-4">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-[#005DAA]" />
                      <div>
                        <h3 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wide">
                          Dokumentasi Foto Properti Lapangan (3 Foto)
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Unggah 3 foto: Tampak Depan Bangunan, Tampak Samping, dan Rencana Titik Meter Air
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Slot 1: Tampak Depan */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">1. Tampak Depan</span>
                          {getSlotPhoto('depan') && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" /> Terlampir
                            </span>
                          )}
                        </div>

                        {getSlotPhoto('depan') ? (
                          <div className="relative group border rounded-xl overflow-hidden bg-black/5 aspect-video flex items-center justify-center">
                            <img
                              src={getSlotPhoto('depan')!.dataUrl}
                              alt="Tampak Depan"
                              className="max-h-full object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  fotoPropertiFiles: (prev.fotoPropertiFiles || []).filter((p) => !p.caption?.includes('Tampak Depan')),
                                }));
                              }}
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
                                targetType: 'property',
                                propertySlot: 'depan',
                                title: 'Foto Tampak Depan via Kamera',
                                guideType: 'property'
                              })}
                              className="w-full py-2 px-3 bg-[#005DAA] hover:bg-[#004A88] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              Ambil Kamera
                            </button>
                            <label className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer text-center">
                              <Upload className="w-3.5 h-3.5" />
                              Pilih File
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handlePropertyPhotoUpload('depan', f);
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        )}
                      </div>

                      {/* Slot 2: Tampak Samping */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">2. Tampak Samping</span>
                          {getSlotPhoto('samping') && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" /> Terlampir
                            </span>
                          )}
                        </div>

                        {getSlotPhoto('samping') ? (
                          <div className="relative group border rounded-xl overflow-hidden bg-black/5 aspect-video flex items-center justify-center">
                            <img
                              src={getSlotPhoto('samping')!.dataUrl}
                              alt="Tampak Samping"
                              className="max-h-full object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  fotoPropertiFiles: (prev.fotoPropertiFiles || []).filter((p) => !p.caption?.includes('Tampak Samping')),
                                }));
                              }}
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
                                targetType: 'property',
                                propertySlot: 'samping',
                                title: 'Foto Tampak Samping via Kamera',
                                guideType: 'property'
                              })}
                              className="w-full py-2 px-3 bg-[#005DAA] hover:bg-[#004A88] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              Ambil Kamera
                            </button>
                            <label className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer text-center">
                              <Upload className="w-3.5 h-3.5" />
                              Pilih File
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handlePropertyPhotoUpload('samping', f);
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        )}
                      </div>

                      {/* Slot 3: Rencana Titik Meter */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">3. Rencana Titik Meter</span>
                          {getSlotPhoto('meter') && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" /> Terlampir
                            </span>
                          )}
                        </div>

                        {getSlotPhoto('meter') ? (
                          <div className="relative group border rounded-xl overflow-hidden bg-black/5 aspect-video flex items-center justify-center">
                            <img
                              src={getSlotPhoto('meter')!.dataUrl}
                              alt="Rencana Titik Meter"
                              className="max-h-full object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  fotoPropertiFiles: (prev.fotoPropertiFiles || []).filter((p) => !p.caption?.includes('Titik Meter')),
                                }));
                              }}
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
                                targetType: 'property',
                                propertySlot: 'meter',
                                title: 'Foto Titik Rencana Meter via Kamera',
                                guideType: 'property'
                              })}
                              className="w-full py-2 px-3 bg-[#005DAA] hover:bg-[#004A88] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              Ambil Kamera
                            </button>
                            <label className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer text-center">
                              <Upload className="w-3.5 h-3.5" />
                              Pilih File
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handlePropertyPhotoUpload('meter', f);
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ======================================================== */}
            {/* SECTION 6: PETUGAS LAPANGAN & PERSETUJUAN BERLANGGANAN   */}
            {/* ======================================================== */}
            {currentStep === 6 && (
              <section className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#005DAA] border border-blue-200">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Section 6: Petugas Lapangan &amp; Persetujuan Berlangganan</h2>
                    <p className="text-xs text-slate-500">Administrasi teknis jaringan, pipa dinas, dan pernyataan persetujuan resmi</p>
                  </div>
                </div>

                <PetugasOfficerFields
                  formData={formData}
                  setFormData={setFormData}
                  errorFields={errorFields}
                />

                {/* Checkbox Persetujuan Syarat & Ketentuan */}
                <div className="pt-2">
                  <label className={`flex items-start gap-3 p-4 rounded-2xl cursor-pointer transition ${
                    formData.persetujuan ? 'bg-blue-50 border-2 border-[#005DAA]' : 'bg-slate-100/70 hover:bg-slate-100 border border-slate-200'
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
                      className="mt-0.5 rounded text-[#005DAA] focus:ring-[#005DAA] w-5 h-5 cursor-pointer shrink-0"
                    />
                    <span className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                      &ldquo;Dengan mencentang dan mengirimkan formulir ini, saya menyatakan bahwa seluruh data yang diisi adalah benar, serta menyatakan <strong>setuju dan tunduk sepenuhnya kepada Syarat dan Ketentuan Berlangganan PT Aetra Air Tangerang</strong> yang merupakan perikatan hukum yang sah.&rdquo; <span className="text-red-500 font-bold">*</span>
                    </span>
                  </label>
                </div>
              </section>
            )}

            {/* BOTTOM NAVIGATION ACTIONS */}
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

      {/* S&K Modal (Pasal 1 - 7) */}
      <TermsAndConditionsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={() => {
          setTermsAccepted(true);
          setFormData((prev) => ({ ...prev, persetujuan: true }));
        }}
      />

      {/* Lightbox Document Viewer */}
      <DocumentImageViewerModal
        isOpen={activeViewer.isOpen}
        onClose={() => setActiveViewer((prev) => ({ ...prev, isOpen: false }))}
        imageUrl={activeViewer.imageUrl}
        title={activeViewer.title}
        description={activeViewer.description}
      />

      {/* Camera Capture Modal */}
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
