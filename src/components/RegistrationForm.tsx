import React, { useState, useEffect, useMemo } from 'react';
import { RegistrationFormData, UploadedDoc, UserAccount, PaymentProofData } from '../types';
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
  Clock, 
  Copy, 
  CreditCard, 
  FileText,
  Eye,
  Store,
  Building,
  School,
  Landmark,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Wallet,
  Building as BankIcon,
  HelpCircle,
  Sparkles,
  ReceiptText,
  CheckSquare
} from 'lucide-react';
import { CameraCaptureModal } from './CameraCaptureModal';
import { InteractiveMapPicker } from './InteractiveMapPicker';
import { calculateDomesticTariff } from '../data/domesticTariffs';
import { INDONESIA_PROVINCES_DATA, AETRA_TANGERANG_INSTALLATION_REGIONS } from '../data/indonesiaRegions';
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

export const getNextFormNumber = (existingList?: RegistrationFormData[]): string => {
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
    const formNumbers = list
      .map((item) => {
        const num = parseInt(item.noForm?.replace(/\D/g, '') || '', 10);
        return isNaN(num) ? 0 : num;
      })
      .filter((n) => n >= baseNumber);
    if (formNumbers.length === 0) {
      return String(baseNumber);
    }
    const maxForm = Math.max(...formNumbers);
    return String(maxForm + 1);
  } catch {
    return '165050';
  }
};

export const getEmptyFormData = (user?: UserAccount | null, existingList?: RegistrationFormData[]): RegistrationFormData => {
  const autoNo = getNextFormNumber(existingList);
  return {
    id: 'reg-' + Date.now(),
    noSr: autoNo,
    noForm: autoNo,
    idPelanggan: '',
    tanggal: new Date().toISOString().split('T')[0],
    namaKtp: (user?.nama || '').toUpperCase(),
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
    kotaPasang: 'KABUPATEN TANGERANG',
    provinsiPasang: 'BANTEN',
    pekerjaan: '',
    statusKepemilikan: 'RUMAH SENDIRI',
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
  };
};

interface RegistrationFormProps {
  currentUser?: UserAccount | null;
  existingRegistrations?: RegistrationFormData[];
  onRegisterSuccess: (record: RegistrationFormData) => void;
  onNavigateToTracking?: (noForm: string) => void;
  onNavigateToBilling?: (idPelanggan: string) => void;
  onViewReceipt?: (record: RegistrationFormData) => void;
  onLogout?: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  currentUser,
  existingRegistrations = [],
  onRegisterSuccess,
  onNavigateToTracking,
  onNavigateToBilling,
  onLogout,
}) => {
  const [forceShowForm, setForceShowForm] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [highestStepReached, setHighestStepReached] = useState<number>(1);
  const [formData, setFormData] = useState<RegistrationFormData>(() => {
    return getEmptyFormData(currentUser, existingRegistrations);
  });
  const [submittedRecord, setSubmittedRecord] = useState<RegistrationFormData | null>(null);

  // Modals
  const [isTermsModalOpen, setIsTermsModalOpen] = useState<boolean>(false);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [cameraConfig, setCameraConfig] = useState<{
    targetDocKey?: 'ktp' | 'kk' | 'pbb' | 'suratDomisili' | 'suratKuasaSewa' | 'lainnya' | 'payment';
    title: string;
  }>({ title: 'Ambil Foto Dokumen' });

  // Lightbox Image Viewer
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

  // UI States
  const [notification, setNotification] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedChannel, setSelectedChannel] = useState<string>('mandiri');
  const [expandedGuide, setExpandedGuide] = useState<string | null>('mandiri');
  const [copiedVa, setCopiedVa] = useState(false);

  // Active customer registration check
  const [registrationsList, setRegistrationsList] = useState<RegistrationFormData[]>(existingRegistrations);

  useEffect(() => {
    setRegistrationsList(existingRegistrations);
  }, [existingRegistrations]);

  // Listen for background sync updates
  useEffect(() => {
    const handleSync = (e: any) => {
      try {
        const saved = localStorage.getItem('aetra_registrations');
        if (saved) {
          const list: RegistrationFormData[] = JSON.parse(saved);
          setRegistrationsList(list);
        }
      } catch (err) {
        console.warn('Sync read warning', err);
      }
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('aetra_sync_event', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('aetra_sync_event', handleSync);
    };
  }, []);

  const activeExistingRegistration = useMemo(() => {
    if (submittedRecord) return submittedRecord;
    if (!currentUser || currentUser.role === 'admin') return null;

    return (
      registrationsList.find(
        (r) =>
          (currentUser.idPelanggan && r.idPelanggan === currentUser.idPelanggan) ||
          (currentUser.id && (r as any).userId === currentUser.id) ||
          (currentUser.email && r.email && r.email.toLowerCase() === currentUser.email.toLowerCase())
      ) || null
    );
  }, [submittedRecord, currentUser, registrationsList]);

  // Synchronize when active registration exists
  useEffect(() => {
    if (activeExistingRegistration && !forceShowForm) {
      setSubmittedRecord(activeExistingRegistration);
    }
  }, [activeExistingRegistration, forceShowForm]);

  // Cascading Address options
  const [ktpCityOptions, setKtpCityOptions] = useState<string[]>([]);
  const [ktpDistrictOptions, setKtpDistrictOptions] = useState<string[]>([]);
  const [ktpSubdistrictOptions, setKtpSubdistrictOptions] = useState<string[]>([]);

  const [installDistrictOptions, setInstallDistrictOptions] = useState<string[]>([]);
  const [installSubdistrictOptions, setInstallSubdistrictOptions] = useState<string[]>([]);

  // Initialize province cascades
  useEffect(() => {
    if (formData.provinsiKtp) {
      const provObj = INDONESIA_PROVINCES_DATA.find((p) => p.name.toUpperCase() === formData.provinsiKtp?.toUpperCase());
      if (provObj) {
        setKtpCityOptions(provObj.cities.map((c) => c.name));
      } else {
        setKtpCityOptions([]);
      }
    } else {
      setKtpCityOptions([]);
    }
  }, [formData.provinsiKtp]);

  useEffect(() => {
    if (formData.provinsiKtp && formData.kotaKtp) {
      const provObj = INDONESIA_PROVINCES_DATA.find((p) => p.name.toUpperCase() === formData.provinsiKtp?.toUpperCase());
      const cityObj = provObj?.cities.find((c) => c.name.toUpperCase() === formData.kotaKtp?.toUpperCase());
      if (cityObj) {
        setKtpDistrictOptions(cityObj.districts.map((d) => d.name));
      } else {
        setKtpDistrictOptions([]);
      }
    } else {
      setKtpDistrictOptions([]);
    }
  }, [formData.provinsiKtp, formData.kotaKtp]);

  useEffect(() => {
    if (formData.provinsiKtp && formData.kotaKtp && formData.kecamatanKtp) {
      const provObj = INDONESIA_PROVINCES_DATA.find((p) => p.name.toUpperCase() === formData.provinsiKtp?.toUpperCase());
      const cityObj = provObj?.cities.find((c) => c.name.toUpperCase() === formData.kotaKtp?.toUpperCase());
      const distObj = cityObj?.districts.find((d) => d.name.toUpperCase() === formData.kecamatanKtp?.toUpperCase());
      if (distObj) {
        setKtpSubdistrictOptions(distObj.villages);
      } else {
        setKtpSubdistrictOptions([]);
      }
    } else {
      setKtpSubdistrictOptions([]);
    }
  }, [formData.provinsiKtp, formData.kotaKtp, formData.kecamatanKtp]);

  // Installation region cascade (Tangerang default)
  useEffect(() => {
    setInstallDistrictOptions(AETRA_TANGERANG_INSTALLATION_REGIONS.map((r) => r.name));
  }, []);

  useEffect(() => {
    if (formData.kecamatanPasang) {
      const kecObj = AETRA_TANGERANG_INSTALLATION_REGIONS.find(
        (r) => r.name.toUpperCase() === formData.kecamatanPasang?.toUpperCase()
      );
      if (kecObj) {
        setInstallSubdistrictOptions(kecObj.villages);
      } else {
        setInstallSubdistrictOptions([]);
      }
    } else {
      setInstallSubdistrictOptions([]);
    }
  }, [formData.kecamatanPasang]);

  // Building Function Category State
  const [kategoriFungsi, setKategoriFungsi] = useState<'rumah_tangga' | 'sosial_instansi' | 'usaha_bisnis'>(() => {
    if (formData.fungsiBangunan?.includes('Sosial') || formData.fungsiBangunan?.includes('Instansi')) return 'sosial_instansi';
    if (formData.fungsiBangunan?.includes('Usaha') || formData.fungsiBangunan?.includes('Komersial')) return 'usaha_bisnis';
    return 'rumah_tangga';
  });

  // Uppercase Text Updater Helper
  const handleUppercaseChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value.toUpperCase(),
    }));
  };

  // Upload handler for admin docs
  const handleDocFileUpload = (key: 'ktp' | 'kk' | 'pbb' | 'suratDomisili' | 'suratKuasaSewa' | 'lainnya', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const uploadedDoc: UploadedDoc = {
        id: 'doc-' + Date.now(),
        name: file.name,
        dataUrl,
        source: 'file',
        type: file.type,
        size: (file.size / 1024).toFixed(1) + ' KB',
        uploadedAt: new Date().toISOString(),
      };

      setFormData((prev) => ({
        ...prev,
        persyaratan: {
          ...prev.persyaratan,
          [key]: true,
        },
        persyaratanFiles: {
          ...prev.persyaratanFiles,
          [key]: uploadedDoc,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDocCameraCapture = (key: 'ktp' | 'kk' | 'pbb' | 'suratDomisili' | 'suratKuasaSewa' | 'lainnya') => {
    const titles = {
      ktp: 'Foto e-KTP Pemohon',
      kk: 'Foto Kartu Keluarga (KK)',
      pbb: 'Foto Pajak Bumi dan Bangunan (PBB)',
      suratDomisili: 'Foto Surat Keterangan Domisili',
      suratKuasaSewa: 'Foto Surat Perjanjian Sewa / Kuasa',
      lainnya: 'Foto Dokumen Pendukung Lainnya',
    };
    setCameraConfig({
      targetDocKey: key,
      title: titles[key] || 'Kamera Foto Dokumen',
    });
    setIsCameraOpen(true);
  };

  const handleRemoveDoc = (key: 'ktp' | 'kk' | 'pbb' | 'suratDomisili' | 'suratKuasaSewa' | 'lainnya') => {
    setFormData((prev) => {
      const nextFiles = { ...prev.persyaratanFiles };
      delete nextFiles[key];
      return {
        ...prev,
        persyaratan: {
          ...prev.persyaratan,
          [key]: false,
        },
        persyaratanFiles: nextFiles,
      };
    });
  };

  // Payment proof upload state (for customer payment stage)
  const [paymentProofData, setPaymentProofData] = useState<PaymentProofData>({
    dataUrl: '',
    bank: 'Bank Mandiri Virtual Account',
    tanggalBayar: new Date().toISOString().split('T')[0],
    uploadedAt: new Date().toISOString(),
  });

  const handlePaymentProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPaymentProofData((prev) => ({
        ...prev,
        dataUrl,
        uploadedAt: new Date().toISOString(),
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitCustomerPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentProofData.dataUrl) {
      alert('Silakan upload foto struk/bukti transfer pembayaran terlebih dahulu.');
      return;
    }

    if (!activeExistingRegistration) return;

    const updatedRecord: RegistrationFormData = {
      ...activeExistingRegistration,
      statusPendaftaran: 'PAYMENT_CONFIRMED',
      status_pendaftaran: 'PAYMENT_CONFIRMED',
      statusPembayaran: 'Menunggu Verifikasi Kasir',
      paymentProof: paymentProofData,
      trackingStep: 2,
    };

    onRegisterSuccess(updatedRecord);
    setSubmittedRecord(updatedRecord);
    setNotification('Bukti pembayaran berhasil dikirim! Kasir Aetra sedang memverifikasi pembayaran Anda.');
    setTimeout(() => setNotification(null), 5000);
  };

  // Validate current step
  const validateStep = (stepNumber: number): boolean => {
    const errs: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.namaKtp.trim()) errs.namaKtp = 'Nama pemohon wajib diisi';
      if (!formData.noKtp.trim() || formData.noKtp.length < 16) errs.noKtp = 'No. KTP harus 16 digit angka';
      if (!formData.telpHp.trim()) errs.telpHp = 'Nomor HP/WhatsApp aktif wajib diisi';
      if (!formData.email.trim()) errs.email = 'Alamat email wajib diisi';
      if (!formData.alamatKtp.trim()) errs.alamatKtp = 'Alamat KTP wajib diisi';
    }

    if (stepNumber === 2) {
      if (!formData.alamatPasang.trim()) errs.alamatPasang = 'Alamat jalan pemasangan wajib diisi';
      if (!formData.kecamatanPasang) errs.kecamatanPasang = 'Kecamatan wajib dipilih';
      if (!formData.desaPasang && !formData.kelurahanPasang) errs.desaPasang = 'Kelurahan / Desa wajib dipilih';
    }

    if (stepNumber === 3) {
      if (!formData.persyaratanFiles?.ktp && !formData.persyaratan?.ktp) {
        errs.ktp = 'Wajib mengunggah foto e-KTP Asli';
      }
      if (!formData.persyaratanFiles?.pbb && !formData.persyaratan?.pbb) {
        errs.pbb = 'Wajib mengunggah foto Pajak Bumi dan Bangunan (PBB)';
      }
    }

    if (stepNumber === 4) {
      if (!formData.luasBangunan) errs.luasBangunan = 'Luas bangunan wajib diisi';
    }

    if (stepNumber === 5) {
      if (!formData.persetujuan) {
        errs.persetujuan = 'Anda wajib menyetujui pernyataan kebenaran data & S&K.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (!validateStep(currentStep)) return;
    const next = currentStep + 1;
    setCurrentStep(next);
    if (next > highestStepReached) {
      setHighestStepReached(next);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // When clicking "Daftar Sambungan Baru" at final step, open the S&K modal (Requirement 9)
  const handleTriggerFinalRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;
    setIsTermsModalOpen(true);
  };

  const handleAcceptTermsAndSubmit = () => {
    setIsTermsModalOpen(false);
    const newRecord: RegistrationFormData = {
      ...formData,
      statusPendaftaran: 'REGISTERED',
      status_pendaftaran: 'REGISTERED',
      trackingStep: 1,
      statusPembayaran: 'Menunggu Verifikasi Berkas',
      isSkAccepted: true,
      is_sk_accepted: true,
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
     activeExistingRegistration.status_pendaftaran === 'ACTIVE_CUSTOMER' ||
     activeExistingRegistration.status_pendaftaran === 'COMPLETED' ||
     activeExistingRegistration.status_pendaftaran === 'PAYMENT_VERIFIED')
  );

  // 9 Official Aetra Payment Channels (Requirement 4)
  const OFFICIAL_PAYMENT_CHANNELS = [
    {
      id: 'mandiri',
      name: 'Bank Mandiri',
      category: 'ATM & Mobile Banking',
      code: '88290 + No. Pembayaran',
      badge: 'Otomatis',
      instructions: [
        'Buka aplikasi Livin’ by Mandiri atau ATM Mandiri.',
        'Pilih menu Bayar > Air Minum / PDAM.',
        'Pilih penyedia jasa: PT Aetra Air Tangerang (Kode 88290).',
        'Masukkan Nomor Pembayaran Anda.',
        'Periksa nama dan jumlah tagihan, lalu konfirmasi pembayaran.',
      ],
    },
    {
      id: 'bca',
      name: 'Bank BCA',
      category: 'm-BCA & KlikBCA',
      code: '88290 + No. Pembayaran',
      badge: 'Instan',
      instructions: [
        'Buka BCA Mobile (m-BCA) atau ATM BCA.',
        'Pilih menu m-Transfer > BCA Virtual Account.',
        'Masukkan Kode Perusahaan (88290) diikuti Nomor Pembayaran Anda.',
        'Pastikan detail nama dan nominal sesuai, lalu masukkan PIN m-BCA.',
        'Simpan struk / tangkapan layar bukti pembayaran.',
      ],
    },
    {
      id: 'bri',
      name: 'Bank BRI',
      category: 'BRImo & ATM BRI',
      code: 'BRIVA Aetra',
      badge: 'Online',
      instructions: [
        'Buka aplikasi BRImo > Pilih Tagihan / BRIVA.',
        'Pilih PT Aetra Air Tangerang.',
        'Masukkan Nomor Pembayaran Anda.',
        'Periksa rincian biaya pasang sambungan baru.',
        'Konfirmasi pembayaran dan masukkan PIN BRImo.',
      ],
    },
    {
      id: 'bni',
      name: 'Bank BNI',
      category: 'BNI Mobile Banking',
      code: 'BNI Virtual Account',
      badge: 'Online',
      instructions: [
        'Buka BNI Mobile Banking > Pilih Menu Pembayaran.',
        'Pilih menu Air Minum / PDAM > AETRA TANGERANG.',
        'Masukkan Nomor Pembayaran Anda.',
        'Konfirmasi dan selesaikan transaksi dengan password transaksi.',
      ],
    },
    {
      id: 'cimb',
      name: 'Bank Danamon & CIMB Niaga',
      category: 'OCTO Mobile / D-Bank',
      code: 'Tagihan Air Aetra',
      badge: 'Online',
      instructions: [
        'Buka aplikasi OCTO Mobile (CIMB) atau D-Bank PRO (Danamon).',
        'Pilih menu Bill Payment / Pembayaran Tagihan Air.',
        'Cari institusi: PT Aetra Air Tangerang.',
        'Input Nomor Pembayaran dan bayar sesuai nominal tertera.',
      ],
    },
    {
      id: 'indomaret',
      name: 'Indomaret & Ceriamart',
      category: 'Kasir Minimarket',
      code: 'Tunjukkan No. Pembayaran',
      badge: 'Kasir',
      instructions: [
        'Kunjungi gerai Indomaret atau Ceriamart terdekat.',
        'Sampaikan ke kasir untuk melakukan pembayaran "AETRA AIR TANGERANG".',
        'Tunjukkan Nomor Pembayaran resmi Anda kepada kasir.',
        'Lakukan pembayaran tunai / debit dan simpan struk kasir sebagai bukti sah.',
      ],
    },
    {
      id: 'alfamart',
      name: 'Alfamart, Alfamidi & Dan+Dan',
      category: 'Kasir Minimarket',
      code: 'Tunjukkan No. Pembayaran',
      badge: 'Kasir',
      instructions: [
        'Kunjungi kasir Alfamart, Alfamidi, atau Dan+Dan terdekat.',
        'Informasikan ingin membayar Tagihan Pasang Sambungan Baru Aetra Tangerang.',
        'Berikan Nomor Pembayaran kepada kasir.',
        'Bayar sesuai tagihan yang disebutkan kasir dan simpan struk bukti.',
      ],
    },
    {
      id: 'pos',
      name: 'Kantor Pos Indonesia & Pospay',
      category: 'Loket Pos & Aplikasi',
      code: 'Layanan Giro Pos',
      badge: 'Nasional',
      instructions: [
        'Datang ke loket Kantor Pos seluruh Indonesia atau buka aplikasi Pospay.',
        'Pilih menu Tagihan Air PDAM / Aetra Air Tangerang.',
        'Masukkan Nomor Pembayaran Anda.',
        'Simpan resi pembayaran kantor pos.',
      ],
    },
    {
      id: 'ewallet',
      name: 'E-Wallet & QRIS (GoPay, OVO, ShopeePay, DANA)',
      category: 'Dompet Digital',
      code: 'Menu Tagihan Air',
      badge: 'QRIS / Apps',
      instructions: [
        'Buka aplikasi GoPay / OVO / ShopeePay / DANA.',
        'Pilih menu Tagihan > Air PDAM.',
        'Pilih wilayah: PT Aetra Air Tangerang.',
        'Masukkan Nomor Pembayaran Anda dan lakukan pembayaran.',
      ],
    },
  ];

  // If customer is already registered & active (Air Mengalir) -> Show Minimal Clean Profile (Requirement)
  if (isFullyConnectedStage && !forceShowForm) {
    const finalIdPelanggan = activeExistingRegistration?.idPelanggan || currentUser?.idPelanggan || '10884920';
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-[#005DAA] via-[#004884] to-[#003868] text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>SAMBUNGAN AKTIF - AIR BERSIH MENGALIR</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Profil Pelanggan Resmi Aetra
              </h2>
              <p className="text-blue-100 text-sm max-w-xl">
                Layanan air bersih PT Aetra Air Tangerang telah aktif di persil Anda. Informasi profil resmi Anda tertera di bawah ini.
              </p>
            </div>

            <div className="shrink-0 flex flex-col items-end gap-2">
              <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">
                ID Pelanggan Resmi
              </span>
              <div className="font-mono text-2xl font-black bg-white/10 px-4 py-2 rounded-2xl border border-white/20 backdrop-blur-xs">
                {finalIdPelanggan}
              </div>
            </div>
          </div>

          {/* Minimal Clean Profile Columns */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#005DAA]" />
                  ID Pelanggan (Nomor Pembayaran Tagihan Bulanan)
                </span>
                <p className="text-base font-black text-slate-900 font-mono">
                  {finalIdPelanggan}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#005DAA]" />
                  Nama Lengkap Pelanggan
                </span>
                <p className="text-base font-bold text-slate-900 uppercase">
                  {activeExistingRegistration?.namaKtp || currentUser?.nama}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#005DAA]" />
                  Nomor Telepon / WhatsApp
                </span>
                <p className="text-base font-bold text-slate-900 font-mono">
                  {activeExistingRegistration?.telpHp || currentUser?.telp || '-'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#005DAA]" />
                  Alamat Email Terdaftar
                </span>
                <p className="text-base font-bold text-slate-900">
                  {activeExistingRegistration?.email || currentUser?.email || '-'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#005DAA]" />
                Alamat Lengkap Titik Pemasangan Water Meter
              </span>
              <p className="text-sm font-bold text-slate-900 uppercase">
                {activeExistingRegistration?.alamatPasang}, RT/RW {activeExistingRegistration?.rtRwPasang}, Desa/Kel. {activeExistingRegistration?.desaPasang || activeExistingRegistration?.kelurahanPasang}, Kec. {activeExistingRegistration?.kecamatanPasang}, {activeExistingRegistration?.kotaPasang}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigateToBilling?.(finalIdPelanggan)}
                  className="px-5 py-2.5 rounded-xl bg-[#005DAA] hover:bg-[#004884] text-white text-xs font-bold shadow-md shadow-blue-600/20 transition cursor-pointer flex items-center gap-2"
                >
                  <ReceiptText className="w-4 h-4" />
                  <span>Cek Tagihan Bulanan</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateToTracking?.(activeExistingRegistration?.noForm || '')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>Riwayat Sambungan</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setForceShowForm(true)}
                className="text-xs text-slate-500 hover:text-[#005DAA] font-semibold underline underline-offset-4 cursor-pointer"
              >
                + Formulir Pendaftaran Sambungan Baru Lainnya
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If customer is at payment stage (Waiting Payment / Upload Payment Proof)
  if (isApprovedPaymentStage && !forceShowForm) {
    const reg = activeExistingRegistration!;
    const paymentCode = reg.nomorPembayaran || reg.nomor_pembayaran || '88290' + reg.noForm;
    const biayaSambungan = reg.biayaSambungan || 1371545;

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-[#005DAA] to-[#003868] text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-900 inline-flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                TAHAP 2: PEMBAYARAN BIAYA SAMBUNGAN BARU
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Instruksi Pembayaran &amp; Upload Bukti
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm">
                Berkas pendaftaran Anda telah disetujui. Silakan selesaikan pembayaran biaya sambungan baru di salah satu kanal resmi Aetra.
              </p>
            </div>

            <div className="shrink-0 text-left md:text-right">
              <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider block">
                Total Biaya Sambungan
              </span>
              <div className="font-mono text-2xl sm:text-3xl font-black text-amber-300">
                Rp {biayaSambungan.toLocaleString('id-ID')},-
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Nomor Pembayaran Banner */}
            <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Nomor Pembayaran Resmi (Virtual Account)
                </span>
                <div className="font-mono text-2xl sm:text-3xl font-black text-slate-900 tracking-wider">
                  {paymentCode}
                </div>
                <p className="text-xs text-slate-600">
                  Gunakan kode di atas sebagai kode bayar / virtual account di seluruh kanal pembayaran resmi.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(paymentCode);
                  setCopiedVa(true);
                  setTimeout(() => setCopiedVa(false), 2000);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                {copiedVa ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedVa ? 'Tersalin!' : 'Salin Nomor Bayar'}</span>
              </button>
            </div>

            {/* 9 Official Payment Channels with Step-by-Step Instructions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#005DAA]" />
                    <span>9 Kanal Pembayaran Resmi PT Aetra Air Tangerang</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pilih kanal pembayaran untuk melihat panduan langkah demi langkah cara transfer &amp; pembayaran:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {OFFICIAL_PAYMENT_CHANNELS.map((ch) => {
                  const isSelected = selectedChannel === ch.id;
                  return (
                    <div
                      key={ch.id}
                      onClick={() => setSelectedChannel(ch.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#005DAA] bg-blue-50/70 shadow-sm ring-1 ring-[#005DAA]'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <strong className="text-xs font-bold text-slate-900">{ch.name}</strong>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#005DAA]">
                          {ch.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{ch.category}</p>
                    </div>
                  );
                })}
              </div>

              {/* Selected Channel Guide Details */}
              {selectedChannel && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-200">
                  {(() => {
                    const ch = OFFICIAL_PAYMENT_CHANNELS.find((c) => c.id === selectedChannel)!;
                    return (
                      <>
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#005DAA]" />
                            <span className="text-xs font-bold text-slate-900">
                              Cara Pembayaran via {ch.name}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-[#005DAA]">
                            Kode: {ch.code}
                          </span>
                        </div>
                        <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700">
                          {ch.instructions.map((inst, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {inst}
                            </li>
                          ))}
                        </ol>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Upload Bukti Pembayaran Form (No sender name/account needed) */}
            <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-emerald-600" />
                    <span>Upload Bukti Pembayaran Sambungan Baru</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Foto struk ATM, kasir minimarket, atau tangkapan layar m-banking Anda.
                  </p>
                </div>

                {paymentProofData.dataUrl && (
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Bukti Terpasang
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kanal Pembayaran Yang Digunakan
                  </label>
                  <select
                    value={paymentProofData.bank}
                    onChange={(e) => setPaymentProofData((prev) => ({ ...prev, bank: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#005DAA]"
                  >
                    <option value="Bank Mandiri Virtual Account">Bank Mandiri (ATM / Livin)</option>
                    <option value="Bank BCA Virtual Account">Bank BCA (m-BCA / KlikBCA)</option>
                    <option value="Bank BRI (BRIVA)">Bank BRI (BRImo / BRIVA)</option>
                    <option value="Bank BNI Virtual Account">Bank BNI (Mobile / ATM)</option>
                    <option value="Bank Danamon & CIMB Niaga">Bank Danamon / CIMB Niaga</option>
                    <option value="Indomaret / Ceriamart">Kasir Indomaret / Ceriamart</option>
                    <option value="Alfamart / Alfamidi / Dan+Dan">Kasir Alfamart / Alfamidi</option>
                    <option value="Kantor Pos Indonesia">Kantor Pos / Pospay</option>
                    <option value="E-Wallet (GoPay/OVO/ShopeePay/DANA)">E-Wallet &amp; QRIS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Pembayaran
                  </label>
                  <input
                    type="date"
                    value={paymentProofData.tanggalBayar}
                    onChange={(e) => setPaymentProofData((prev) => ({ ...prev, tanggalBayar: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#005DAA]"
                  />
                </div>
              </div>

              {/* Upload Dropzone & Camera Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <label className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#005DAA] bg-white hover:bg-blue-50/50 text-slate-700 text-xs font-bold transition cursor-pointer">
                  <Upload className="w-4 h-4 text-[#005DAA]" />
                  <span>Pilih File Gambar Bukti (Galeri)</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={handlePaymentProofUpload}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setCameraConfig({
                      targetDocKey: 'payment',
                      title: 'Foto Struk Pembayaran',
                    });
                    setIsCameraOpen(true);
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition shadow-xs"
                >
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Buka Kamera Ponsel</span>
                </button>
              </div>

              {/* Preview Uploaded Proof */}
              {paymentProofData.dataUrl && (
                <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={paymentProofData.dataUrl}
                      alt="Bukti Bayar"
                      className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Struk Pembayaran Terlampir
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {paymentProofData.bank} • {paymentProofData.tanggalBayar}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveViewer({
                          isOpen: true,
                          imageUrl: paymentProofData.dataUrl,
                          title: 'Bukti Pembayaran Sambungan Baru',
                          description: `${paymentProofData.bank} • ${paymentProofData.tanggalBayar}`,
                        })
                      }
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      title="Lihat Gambar Penuh"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentProofData((prev) => ({ ...prev, dataUrl: '' }))}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition"
                      title="Hapus Bukti"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm & Submit Payment Proof */}
              <button
                type="button"
                onClick={handleSubmitCustomerPayment}
                disabled={!paymentProofData.dataUrl}
                className={`w-full py-4 rounded-2xl text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  paymentProofData.dataUrl
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Kirim &amp; Konfirmasi Pembayaran Ke Kasir Aetra</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Multi-step Registration Form (5 Steps)
  const steps = [
    { number: 1, title: 'Identitas Pemohon', icon: <User className="w-4 h-4" /> },
    { number: 2, title: 'Alamat Pemasangan', icon: <MapPin className="w-4 h-4" /> },
    { number: 3, title: 'Persyaratan Administrasi', icon: <FileText className="w-4 h-4" /> },
    { number: 4, title: 'Kondisi Bangunan & Tarif', icon: <Building2 className="w-4 h-4" /> },
    { number: 5, title: 'Konfirmasi & Pengiriman', icon: <CheckSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-between shadow-lg animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-white/80 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Main Registration Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Title Header with Auto Form Badge (Requirement 9 & 10) */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#005DAA] via-[#004884] to-[#003868] text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#F37021] text-white shadow-xs">
                PT AETRA AIR TANGERANG
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/20 text-white border border-white/30">
                No. Form: #{formData.noForm} (Otomatis)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Formulir Pendaftaran Sambungan Baru
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm">
              Lengkapi formulir permohonan pasang baru air bersih resmi berstandar Permenkes No. 2 Tahun 2023.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition cursor-pointer"
            >
              Reset Isian
            </button>
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[550px] gap-2">
            {steps.map((st) => {
              const isCurrent = currentStep === st.number;
              const isDone = currentStep > st.number;
              return (
                <button
                  key={st.number}
                  type="button"
                  onClick={() => {
                    if (st.number <= highestStepReached) {
                      setCurrentStep(st.number);
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isCurrent
                      ? 'bg-[#005DAA] text-white shadow-sm'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'text-slate-400 opacity-60'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isCurrent
                        ? 'bg-white text-[#005DAA]'
                        : isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isDone ? '✓' : st.number}
                  </span>
                  <span>{st.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {/* STEP 1: IDENTITAS PEMOHON */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#005DAA]" />
                  <span>1. Identitas Pemohon</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  No. SR: #{formData.noSr}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap Pemohon (Sesuai KTP) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.namaKtp}
                    onChange={(e) => handleUppercaseChange('namaKtp', e.target.value)}
                    placeholder="CONTOH: LAILATUL YOVI"
                    className="w-full uppercase px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#005DAA] text-xs font-semibold"
                  />
                  {errors.namaKtp && <p className="text-[11px] text-red-500 mt-1">{errors.namaKtp}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor Induk Kependudukan (NIK / e-KTP 16 Digit) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    required
                    value={formData.noKtp}
                    onChange={(e) => setFormData((prev) => ({ ...prev, noKtp: e.target.value.replace(/\D/g, '') }))}
                    placeholder="367101XXXXXXXXXX"
                    className="w-full font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#005DAA] text-xs font-semibold"
                  />
                  {errors.noKtp && <p className="text-[11px] text-red-500 mt-1">{errors.noKtp}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp / Telepon Aktif <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telpHp}
                    onChange={(e) => setFormData((prev) => ({ ...prev, telpHp: e.target.value }))}
                    placeholder="087788224645"
                    className="w-full font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#005DAA] text-xs font-semibold"
                  />
                  {errors.telpHp && <p className="text-[11px] text-red-500 mt-1">{errors.telpHp}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat Email Pemohon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value.toLowerCase() }))}
                    placeholder="nama@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#005DAA] text-xs font-semibold"
                  />
                  {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat Lengkap Sesuai KTP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.alamatKtp}
                    onChange={(e) => handleUppercaseChange('alamatKtp', e.target.value)}
                    placeholder="JL. RAYA SERPONG NO. 12, RT 002 / RW 005"
                    className="w-full uppercase px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#005DAA] text-xs font-semibold"
                  />
                  {errors.alamatKtp && <p className="text-[11px] text-red-500 mt-1">{errors.alamatKtp}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Provinsi (KTP)
                  </label>
                  <select
                    value={formData.provinsiKtp}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        provinsiKtp: e.target.value,
                        kotaKtp: '',
                        kecamatanKtp: '',
                        kelurahanKtp: '',
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold"
                  >
                    <option value="">Pilih Provinsi...</option>
                    {INDONESIA_PROVINCES_DATA.map((prov) => (
                      <option key={prov.name} value={prov.name}>
                        {prov.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kota / Kabupaten (KTP)
                  </label>
                  <select
                    value={formData.kotaKtp}
                    disabled={!formData.provinsiKtp}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        kotaKtp: e.target.value,
                        kecamatanKtp: '',
                        kelurahanKtp: '',
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold disabled:bg-slate-100"
                  >
                    <option value="">Pilih Kota / Kabupaten...</option>
                    {ktpCityOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kecamatan (KTP)
                  </label>
                  <select
                    value={formData.kecamatanKtp}
                    disabled={!formData.kotaKtp}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        kecamatanKtp: e.target.value,
                        kelurahanKtp: '',
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold disabled:bg-slate-100"
                  >
                    <option value="">Pilih Kecamatan...</option>
                    {ktpDistrictOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kelurahan / Desa (KTP)
                  </label>
                  <input
                    type="text"
                    value={formData.kelurahanKtp}
                    onChange={(e) => handleUppercaseChange('kelurahanKtp', e.target.value)}
                    placeholder="KELURAHAN / DESA"
                    className="w-full uppercase px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pekerjaan Pemohon
                  </label>
                  <input
                    type="text"
                    value={formData.pekerjaan}
                    onChange={(e) => handleUppercaseChange('pekerjaan', e.target.value)}
                    placeholder="KARYAWAN SWASTA / WIRAUSAHA / PNS"
                    className="w-full uppercase px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status Kepemilikan Bangunan
                  </label>
                  <select
                    value={formData.statusKepemilikan}
                    onChange={(e) => setFormData((prev) => ({ ...prev, statusKepemilikan: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold"
                  >
                    <option value="RUMAH SENDIRI">Rumah Sendiri (Milik Pribadi)</option>
                    <option value="SEWA / KONTRAK">Sewa / Kontrak (Perlu Surat Kuasa)</option>
                    <option value="RUMAH DINAS">Rumah Dinas Instansi</option>
                    <option value="MILIK KELUARGA">Milik Keluarga / Waris</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ALAMAT PEMASANGAN */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#005DAA]" />
                  <span>2. Alamat Pemasangan</span>
                </h3>
                <span className="text-xs text-slate-400">
                  Titik Fisik Sambungan Air
                </span>
              </div>

              {/* Interactive Google Maps Pin Locator */}
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
                      alamatPasang: address ? address.toUpperCase() : prev.alamatPasang,
                    }));
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat Jalan / No. Rumah (Titik Pasang) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.alamatPasang}
                    onChange={(e) => handleUppercaseChange('alamatPasang', e.target.value)}
                    placeholder="JL. BOULEVARD RAYA BLOK A NO. 15"
                    className="w-full uppercase px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#005DAA] text-xs font-semibold"
                  />
                  {errors.alamatPasang && <p className="text-[11px] text-red-500 mt-1">{errors.alamatPasang}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    RT / RW (Titik Pasang)
                  </label>
                  <input
                    type="text"
                    value={formData.rtRwPasang}
                    onChange={(e) => handleUppercaseChange('rtRwPasang', e.target.value)}
                    placeholder="RT 003 / RW 008"
                    className="w-full uppercase px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    value={formData.kodePosPasang}
                    onChange={(e) => setFormData((prev) => ({ ...prev, kodePosPasang: e.target.value.replace(/\D/g, '') }))}
                    placeholder="15810"
                    className="w-full font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kecamatan (Wilayah Kerja Aetra) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.kecamatanPasang}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        kecamatanPasang: e.target.value,
                        desaPasang: '',
                        kelurahanPasang: '',
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold"
                  >
                    <option value="">Pilih Kecamatan...</option>
                    {installDistrictOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  {errors.kecamatanPasang && <p className="text-[11px] text-red-500 mt-1">{errors.kecamatanPasang}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kelurahan / Desa <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.desaPasang || formData.kelurahanPasang}
                    disabled={!formData.kecamatanPasang}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        desaPasang: e.target.value,
                        kelurahanPasang: e.target.value,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold disabled:bg-slate-100"
                  >
                    <option value="">Pilih Kelurahan / Desa...</option>
                    {installSubdistrictOptions.map((sd) => (
                      <option key={sd} value={sd}>
                        {sd}
                      </option>
                    ))}
                  </select>
                  {errors.desaPasang && <p className="text-[11px] text-red-500 mt-1">{errors.desaPasang}</p>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PERSYARATAN ADMINISTRASI */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#005DAA]" />
                  <span>3. Persyaratan Administrasi</span>
                </h3>
                <span className="text-xs text-slate-400">
                  Upload Dokumen Syarat Sah
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. e-KTP */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-[#005DAA]" />
                      <span>Foto e-KTP Asli <strong className="text-red-500">*</strong></span>
                    </span>
                    {formData.persyaratanFiles?.ktp && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        ✓ Terupload
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 hover:border-[#005DAA] text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleDocFileUpload('ktp', e)} />
                    </label>
                    <button
                      type="button"
                      onClick={() => handleDocCameraCapture('ktp')}
                      className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800 transition cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Kamera</span>
                    </button>
                  </div>

                  {formData.persyaratanFiles?.ktp && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 text-xs">
                      <span className="text-slate-600 truncate max-w-[150px]">{formData.persyaratanFiles.ktp.name}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveViewer({
                              isOpen: true,
                              imageUrl: formData.persyaratanFiles!.ktp!.dataUrl,
                              title: 'Foto e-KTP Pemohon',
                            })
                          }
                          className="p-1 text-[#005DAA] hover:bg-blue-50 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc('ktp')}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                  {errors.ktp && <p className="text-[11px] text-red-500">{errors.ktp}</p>}
                </div>

                {/* 2. Kartu Keluarga (KK) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#005DAA]" />
                      <span>Foto Kartu Keluarga (KK)</span>
                    </span>
                    {formData.persyaratanFiles?.kk && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        ✓ Terupload
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 hover:border-[#005DAA] text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleDocFileUpload('kk', e)} />
                    </label>
                    <button
                      type="button"
                      onClick={() => handleDocCameraCapture('kk')}
                      className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800 transition cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Kamera</span>
                    </button>
                  </div>

                  {formData.persyaratanFiles?.kk && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 text-xs">
                      <span className="text-slate-600 truncate max-w-[150px]">{formData.persyaratanFiles.kk.name}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveViewer({
                              isOpen: true,
                              imageUrl: formData.persyaratanFiles!.kk!.dataUrl,
                              title: 'Foto Kartu Keluarga (KK)',
                            })
                          }
                          className="p-1 text-[#005DAA] hover:bg-blue-50 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc('kk')}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Pajak Bumi dan Bangunan (PBB) - Requirement 12 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Home className="w-4 h-4 text-[#005DAA]" />
                      <span>Pajak Bumi dan Bangunan (PBB) <strong className="text-red-500">*</strong></span>
                    </span>
                    {formData.persyaratanFiles?.pbb && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        ✓ Terupload
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 hover:border-[#005DAA] text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File PBB</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleDocFileUpload('pbb', e)} />
                    </label>
                    <button
                      type="button"
                      onClick={() => handleDocCameraCapture('pbb')}
                      className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800 transition cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Kamera</span>
                    </button>
                  </div>

                  {formData.persyaratanFiles?.pbb && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 text-xs">
                      <span className="text-slate-600 truncate max-w-[250px]">{formData.persyaratanFiles.pbb.name}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveViewer({
                              isOpen: true,
                              imageUrl: formData.persyaratanFiles!.pbb!.dataUrl,
                              title: 'Foto Pajak Bumi dan Bangunan (PBB)',
                            })
                          }
                          className="p-1 text-[#005DAA] hover:bg-blue-50 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc('pbb')}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                  {errors.pbb && <p className="text-[11px] text-red-500">{errors.pbb}</p>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: KONDISI BANGUNAN & TARIF (Requirement 14 & 15) */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#005DAA]" />
                  <span>4. Kondisi Bangunan &amp; Tarif</span>
                </h3>
                <span className="text-xs text-slate-400">
                  Peruntukan Persil
                </span>
              </div>

              {/* 3 Main Categories (Sosial, Rumah Tangga, Usaha) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Pilih Kategori Peruntukan Bangunan:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setKategoriFungsi('rumah_tangga');
                      setFormData((prev) => ({ ...prev, fungsiBangunan: 'Rumah Tangga', golonganTarif: 'R2 = Rumah Tangga 2' }));
                    }}
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col gap-2 ${
                      kategoriFungsi === 'rumah_tangga'
                        ? 'border-[#005DAA] bg-blue-50/80 ring-2 ring-[#005DAA]/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#005DAA] flex items-center justify-center">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">1. Rumah Tangga</h4>
                      <p className="text-[11px] text-slate-500">Hunian tempat tinggal keluarga (R1 - R4)</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setKategoriFungsi('sosial_instansi');
                      setFormData((prev) => ({ ...prev, fungsiBangunan: SOSIAL_INSTANSI_OPTIONS[0], golonganTarif: 'Sosial & Instansi' }));
                    }}
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col gap-2 ${
                      kategoriFungsi === 'sosial_instansi'
                        ? 'border-[#005DAA] bg-blue-50/80 ring-2 ring-[#005DAA]/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">2. Sosial &amp; Instansi</h4>
                      <p className="text-[11px] text-slate-500">Tempat ibadah, yayasan, panti, kantor dinas</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setKategoriFungsi('usaha_bisnis');
                      setFormData((prev) => ({ ...prev, fungsiBangunan: USAHA_OPTIONS[0], golonganTarif: 'Niaga & Industri' }));
                    }}
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col gap-2 ${
                      kategoriFungsi === 'usaha_bisnis'
                        ? 'border-[#005DAA] bg-blue-50/80 ring-2 ring-[#005DAA]/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">3. Usaha &amp; Bisnis</h4>
                      <p className="text-[11px] text-slate-500">Kios, ruko, restoran, UMKM, niaga</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Sub-Category Selectors */}
              {kategoriFungsi === 'sosial_instansi' && (
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2 animate-in fade-in duration-200">
                  <label className="block text-xs font-bold text-emerald-950">
                    Opsi Jenis Bangunan Sosial / Instansi:
                  </label>
                  <select
                    value={formData.fungsiBangunan}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fungsiBangunan: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white text-xs font-semibold"
                  >
                    {SOSIAL_INSTANSI_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {kategoriFungsi === 'usaha_bisnis' && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2 animate-in fade-in duration-200">
                  <label className="block text-xs font-bold text-amber-950">
                    Opsi Jenis Usaha / Komersial:
                  </label>
                  <select
                    value={formData.fungsiBangunan}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fungsiBangunan: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-xs font-semibold"
                  >
                    {USAHA_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* GOLONGAN TARIF HANYA DITAMPILKAN PADA OPSI RUMAH TANGGA (Requirement 14) */}
              {kategoriFungsi === 'rumah_tangga' && (
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2 animate-in fade-in duration-200">
                  <label className="block text-xs font-bold text-[#005DAA]">
                    Golongan Tarif Rumah Tangga:
                  </label>
                  <select
                    value={formData.golonganTarif}
                    onChange={(e) => setFormData((prev) => ({ ...prev, golonganTarif: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-blue-300 bg-white text-xs font-semibold"
                  >
                    <option value="R1 = Rumah Tangga 1 (Sederhana)">R1 - Rumah Tangga 1 (Sederhana s/d 36m²)</option>
                    <option value="R2 = Rumah Tangga 2 (Menengah)">R2 - Rumah Tangga 2 (Menengah 37 - 70m²)</option>
                    <option value="R3 = Rumah Tangga 3 (Atas)">R3 - Rumah Tangga 3 (Atas 71 - 120m²)</option>
                    <option value="R4 = Rumah Tangga 4 (Mewah)">R4 - Rumah Tangga 4 (Mewah &gt; 120m²)</option>
                  </select>
                </div>
              )}

              {/* Metrik Luas Bangunan & Penghuni */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Luas Bangunan (m²) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.luasBangunan}
                    onChange={(e) => setFormData((prev) => ({ ...prev, luasBangunan: e.target.value }))}
                    placeholder="45"
                    className="w-full font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                  {errors.luasBangunan && <p className="text-[11px] text-red-500 mt-1">{errors.luasBangunan}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jumlah Lantai
                  </label>
                  <select
                    value={formData.kondisiBangunan.jumlahLantai}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        kondisiBangunan: { ...prev.kondisiBangunan, jumlahLantai: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold"
                  >
                    <option value="1">1 Lantai</option>
                    <option value="2">2 Lantai</option>
                    <option value="3">3 Lantai atau Lebih</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jumlah Penghuni (Jiwa)
                  </label>
                  <input
                    type="number"
                    value={formData.kondisiBangunan.jumlahPenghuni}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        kondisiBangunan: { ...prev.kondisiBangunan, jumlahPenghuni: e.target.value },
                      }))
                    }
                    placeholder="4"
                    className="w-full font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: KONFIRMASI & PENGIRIMAN */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-[#005DAA]" />
                  <span>5. Konfirmasi &amp; Pengiriman</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  No. Form: #{formData.noForm}
                </span>
              </div>

              {/* Summary Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Ringkasan Data Permohonan Sambungan Baru:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Nama Pemohon:</span>
                    <strong className="text-slate-900 uppercase">{formData.namaKtp || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">NIK / No. KTP:</span>
                    <strong className="text-slate-900 font-mono">{formData.noKtp || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">No. Telepon / WhatsApp:</span>
                    <strong className="text-slate-900 font-mono">{formData.telpHp || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Alamat Email:</span>
                    <strong className="text-slate-900">{formData.email || '-'}</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block">Alamat Pemasangan:</span>
                    <strong className="text-slate-900 uppercase">
                      {formData.alamatPasang}, RT/RW {formData.rtRwPasang}, Desa {formData.desaPasang || formData.kelurahanPasang}, Kec. {formData.kecamatanPasang}, {formData.kotaPasang}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Peruntukan &amp; Tarif:</span>
                    <strong className="text-[#005DAA] font-bold">
                      {formData.fungsiBangunan} ({formData.golonganTarif})
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Kelengkapan Dokumen:</span>
                    <strong className="text-emerald-700">
                      e-KTP {formData.persyaratanFiles?.ktp ? '✓' : '-'}, PBB {formData.persyaratanFiles?.pbb ? '✓' : '-'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="persetujuanCheck"
                  checked={formData.persetujuan}
                  onChange={(e) => setFormData((prev) => ({ ...prev, persetujuan: e.target.checked }))}
                  className="mt-1 w-4 h-4 text-[#005DAA] rounded-md border-slate-300 focus:ring-[#005DAA]"
                />
                <label htmlFor="persetujuanCheck" className="text-xs text-slate-700 leading-relaxed cursor-pointer">
                  Saya menyatakan bahwa seluruh data yang diisikan adalah benar dan sah. Saya bersedia mematuhi seluruh Syarat dan Ketentuan Berlangganan resmi PT Aetra Air Tangerang.
                </label>
              </div>
              {errors.persetujuan && <p className="text-[11px] text-red-500">{errors.persetujuan}</p>}

              {/* Trigger S&K Modal & Submit Button (Requirement 9) */}
              <button
                type="button"
                onClick={handleTriggerFinalRegistration}
                className="w-full py-4 rounded-2xl bg-[#005DAA] hover:bg-[#004884] text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Daftar Sambungan Baru &amp; Baca S&amp;K</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Navigation Controls (Back / Next) */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 && (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-xl bg-[#005DAA] hover:bg-[#004884] text-white text-xs font-bold shadow-md shadow-blue-600/20 transition flex items-center gap-2 cursor-pointer"
              >
                <span>Lanjut ke Langkah {currentStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal Syarat & Ketentuan (Opens at Final Step upon clicking Daftar Sambungan Baru) */}
      <TermsAndConditionsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={handleAcceptTermsAndSubmit}
      />

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        title={cameraConfig.title}
        guideType={cameraConfig.targetDocKey === 'payment' ? 'payment' : 'document'}
        onCapture={(dataUrl, fileName) => {
          if (cameraConfig.targetDocKey === 'payment') {
            setPaymentProofData((prev) => ({
              ...prev,
              dataUrl,
              uploadedAt: new Date().toISOString(),
            }));
          } else if (cameraConfig.targetDocKey) {
            const key = cameraConfig.targetDocKey as 'ktp' | 'kk' | 'pbb' | 'suratDomisili' | 'suratKuasaSewa' | 'lainnya';
            const uploadedDoc: UploadedDoc = {
              id: 'doc-' + Date.now(),
              name: fileName || `Foto_${key.toUpperCase()}.jpg`,
              dataUrl,
              source: 'camera',
              type: 'image/jpeg',
              uploadedAt: new Date().toISOString(),
            };
            setFormData((prev) => ({
              ...prev,
              persyaratan: { ...prev.persyaratan, [key]: true },
              persyaratanFiles: { ...prev.persyaratanFiles, [key]: uploadedDoc },
            }));
          }
          setIsCameraOpen(false);
        }}
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
