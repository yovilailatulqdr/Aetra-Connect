import React, { useState, useEffect, useMemo } from 'react';
import { RegistrationFormData, UploadedDoc, PropertyPhoto, UserAccount } from '../types';
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
  FileCheck,
  CheckCheck,
  Compass,
  Landmark,
  Store,
  Clock,
  Copy
} from 'lucide-react';
import { CameraCaptureModal } from './CameraCaptureModal';
import { InteractiveMapPicker } from './InteractiveMapPicker';
import { calculateDomesticTariff } from '../data/domesticTariffs';
import { INDONESIA_PROVINCES_DATA } from '../data/indonesiaRegions';
import { BuildingEnvironmentFields } from './BuildingEnvironmentFields';
import { PetugasOfficerFields } from './PetugasOfficerFields';

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
  idPelanggan: user?.idPelanggan || '',
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
  kotaPasang: '',
  provinsiPasang: '',
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
    saluranPembuangan: 'Ada - Saluran Tertutup',
    sanitasi: 'Baik & Memenuhi Syarat',
    halaman: 'Ada Depan & Belakang',
    lebarJalan: '4 - 6 Meter',
    lingkunganTertata: 'Tertata & Teratur',
    realEstate: 'Non Real Estate (Pemukiman Umum)',
  },
  dataPasang: {
    namaSales: 'Bpk. Hendra Gunawan (Surveyor)',
    tanggalSurvey: new Date().toISOString().split('T')[0],
    noWorkOrder: 'WO-2026-AET-' + Math.floor(1000 + Math.random() * 9000),
    gpsLat: '-6.236600',
    gpsLong: '106.562100',
    namaKontraktor: 'PT Mitra Tirta Tangerang',
    dataAlamat: '',
    dataAlamatKoreksi: '',
    dataJaringan: 'Ada Jaringan Depan Persil',
    dataGalian: ['Tanah Biasa'],
    luasBangunanSurvey: '',
    kualitasBangunan: 'Permanen',
    fotoProperti: 'Ada',
    diameterPipa: '1/2" (DN 15 mm)',
    panjangPipa: '6 Meter (Standar)',
    panjangPipaTipe: 'HDPE PE-100 PN16',
    materialTambahan: 'Box Meter + Valve + Check Valve',
    materialStatus: 'Normal (0.7 - 1.0 Bar)',
    tanggalPasangMeter: new Date().toISOString().split('T')[0],
    noSegel: 'SGL-' + Math.floor(10000 + Math.random() * 90000),
    noSeriMeter: 'AET-2026-' + Math.floor(10000 + Math.random() * 90000),
    namaTeknisi: 'Ahmad Syafiq (Instalatur)',
    telpPetugas: '081299887766',
  },
  fotoPropertiFiles: [],
  skemaPembayaran: 'Lakukan Pembayaran',
  keteranganSkema: 'Lakukan Pembayaran',
  biayaSambungan: 1371545,
  golonganTarif: '2A1 - Rumah Tangga Standard',
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
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
  onRegisterSuccess, 
  onNavigateTracking,
  currentUser,
  existingRegistrations,
  onViewReceipt,
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
            idPelanggan: currentUser?.idPelanggan || parsed.idPelanggan || '',
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

  const [cameraModalConfig, setCameraModalConfig] = useState<{
    isOpen: boolean;
    targetType: 'document' | 'property';
    docKey?: 'ktp' | 'kk' | 'pbb' | 'suratDomisili' | 'suratKuasaSewa' | 'lainnya';
    title: string;
    guideType?: 'document' | 'property';
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
        idPelanggan: currentUser.idPelanggan || prev.idPelanggan,
        namaKtp: prev.namaKtp || currentUser.nama,
        email: prev.email || currentUser.email,
      }));
    }
  }, [currentUser]);

  const [kategoriFungsi, setKategoriFungsi] = useState<KategoriFungsi>(() => {
    if (formData.fungsiBangunan) {
      if (SOSIAL_INSTANSI_OPTIONS.includes(formData.fungsiBangunan)) return 'sosial_instansi';
      if (USAHA_OPTIONS.includes(formData.fungsiBangunan)) return 'usaha';
      return 'rumah_tangga';
    }
    return 'rumah_tangga';
  });

  const handleSelectKategori = (cat: KategoriFungsi) => {
    setKategoriFungsi(cat);
    if (cat === 'rumah_tangga') {
      setFormData((prev) => ({
        ...prev,
        fungsiBangunan: 'Rumah Tangga',
        golonganTarif: '2A1 - Rumah Tangga Standard',
      }));
    } else if (cat === 'sosial_instansi') {
      const selected = SOSIAL_INSTANSI_OPTIONS.includes(formData.fungsiBangunan)
        ? formData.fungsiBangunan
        : SOSIAL_INSTANSI_OPTIONS[0];
      setFormData((prev) => ({
        ...prev,
        fungsiBangunan: selected,
        golonganTarif: '1 - Sosial & Instansi',
      }));
    } else if (cat === 'usaha') {
      const selected = USAHA_OPTIONS.includes(formData.fungsiBangunan)
        ? formData.fungsiBangunan
        : USAHA_OPTIONS[0];
      setFormData((prev) => ({
        ...prev,
        fungsiBangunan: selected,
        golonganTarif: '3 - Niaga / Usaha',
      }));
    }
  };

  // Tariff calculation for Rumah Tangga
  const tariffResult = useMemo(() => {
    if (kategoriFungsi !== 'rumah_tangga') return null;
    const luas = parseFloat(String(formData.luasBangunan || '0'));
    const isRealEstate = (formData.lingkungan?.realEstate || '').toLowerCase().includes('real estate');
    const hasUsaha = false;
    return calculateDomesticTariff(luas, isRealEstate, hasUsaha);
  }, [kategoriFungsi, formData.luasBangunan, formData.lingkungan?.realEstate]);

  // Update golonganTarif when tariffResult updates
  useEffect(() => {
    if (kategoriFungsi === 'rumah_tangga' && tariffResult) {
      setFormData((prev) => ({
        ...prev,
        golonganTarif: tariffResult.name,
      }));
    }
  }, [kategoriFungsi, tariffResult]);

  const handleDocUpload = (
    docKey: 'ktp' | 'kk' | 'pbb' | 'suratDomisili' | 'suratKuasaSewa' | 'lainnya',
    e: React.ChangeEvent<HTMLInputElement>,
    source: 'camera' | 'file'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const docInfo: UploadedDoc = {
        id: 'doc-' + Date.now(),
        name: file.name || `${docKey.toUpperCase()}_${source}.jpg`,
        dataUrl,
        source,
        type: file.type,
        size: (file.size / 1024).toFixed(1) + ' KB',
        uploadedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setFormData((prev) => ({
        ...prev,
        persyaratan: { ...prev.persyaratan, [docKey]: true },
        persyaratanFiles: { ...(prev.persyaratanFiles || {}), [docKey]: docInfo },
      }));
      setNotification(`Dokumen ${docKey.toUpperCase()} berhasil diunggah.`);
      setTimeout(() => setNotification(null), 3000);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveDoc = (docKey: 'ktp' | 'kk' | 'pbb' | 'suratDomisili' | 'suratKuasaSewa' | 'lainnya') => {
    setFormData((prev) => {
      const updated = { ...(prev.persyaratanFiles || {}) };
      delete updated[docKey];
      return {
        ...prev,
        persyaratan: { ...prev.persyaratan, [docKey]: false },
        persyaratanFiles: updated,
      };
    });
  };

  const handleDirectCameraCapture = (dataUrl: string, fileName: string) => {
    if (cameraModalConfig.targetType === 'document' && cameraModalConfig.docKey) {
      const docKey = cameraModalConfig.docKey;
      const docInfo: UploadedDoc = {
        id: 'doc-' + Date.now(),
        name: fileName,
        dataUrl,
        source: 'camera',
        type: 'image/jpeg',
        size: Math.round((dataUrl.length * 3) / 4 / 1024) + ' KB',
        uploadedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setFormData((prev) => ({
        ...prev,
        persyaratan: { ...prev.persyaratan, [docKey]: true },
        persyaratanFiles: { ...(prev.persyaratanFiles || {}), [docKey]: docInfo },
      }));
      setNotification(`Foto dokumen ${docKey.toUpperCase()} berhasil diambil.`);
    } else if (cameraModalConfig.targetType === 'property') {
      const newPhoto: PropertyPhoto = {
        id: 'photo-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        name: fileName,
        dataUrl,
        source: 'camera',
        caption: 'Dokumentasi Lapangan',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setFormData((prev) => ({
        ...prev,
        dataPasang: {
          ...prev.dataPasang,
          fotoProperti: 'Ada',
        },
        fotoPropertiFiles: [...(prev.fotoPropertiFiles || []), newPhoto],
      }));
      setNotification('Dokumentasi foto lapangan berhasil ditambahkan.');
    }
    setTimeout(() => setNotification(null), 3500);
  };

  // Section Steps Configuration
  const SECTIONS = [
    { number: 1, title: 'Data Diri', subtitle: 'Identitas Pemohon', icon: User },
    { number: 2, title: 'Alamat KTP', subtitle: 'Domisili Identitas', icon: MapPin },
    { number: 3, title: 'Alamat Pemasangan', subtitle: 'Titik Sambungan Baru', icon: Home },
    { number: 4, title: 'Informasi Bangunan', subtitle: 'Fungsi & Lingkungan', icon: Building2 },
    { number: 5, title: 'Upload Dokumen', subtitle: 'KTP & Berkas', icon: Upload },
    { number: 6, title: 'Petugas Lapangan', subtitle: 'Teknis & Persetujuan', icon: ShieldCheck },
  ];

  // Comprehensive Required (*)-fields validation
  const validateCurrentSection = (stepNum: number): boolean => {
    const errors: string[] = [];
    const fields: Record<string, boolean> = {};

    if (stepNum === 1) {
      if (!formData.noSr?.trim()) {
        errors.push('No. SR (Sambungan Rumah) wajib diisi');
        fields.noSr = true;
      }
      if (!formData.namaKtp?.trim()) {
        errors.push('Nama Lengkap sesuai KTP wajib diisi');
        fields.namaKtp = true;
      }
      if (!formData.noKtp?.trim() || formData.noKtp.replace(/\D/g, '').length < 8) {
        errors.push('Nomor KTP (NIK) minimal 8-16 digit angka');
        fields.noKtp = true;
      }
      if (!formData.pekerjaan?.trim()) {
        errors.push('Pekerjaan pemohon wajib diisi');
        fields.pekerjaan = true;
      }
      if (!formData.telpHp?.trim()) {
        errors.push('No. Telepon / WhatsApp aktif wajib diisi');
        fields.telpHp = true;
      }
    } else if (stepNum === 2) {
      if (!formData.alamatKtp?.trim()) {
        errors.push('Alamat sesuai KTP wajib diisi');
        fields.alamatKtp = true;
      }
      if (!formData.rtRwKtp?.trim()) {
        errors.push('RT / RW sesuai KTP wajib diisi');
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
        errors.push('Alamat lokasi pemasangan sambungan baru wajib diisi');
        fields.alamatPasang = true;
      }
      if (!formData.rtRwPasang?.trim()) {
        errors.push('RT / RW lokasi pemasangan wajib diisi');
        fields.rtRwPasang = true;
      }
      if (!formData.provinsiPasang?.trim()) {
        errors.push('Provinsi lokasi pemasangan wajib dipilih');
        fields.provinsiPasang = true;
      }
      if (!formData.kotaPasang?.trim()) {
        errors.push('Kota / Kabupaten lokasi pemasangan wajib dipilih');
        fields.kotaPasang = true;
      }
      if (!formData.kecamatanPasang?.trim()) {
        errors.push('Kecamatan pemasangan wajib dipilih');
        fields.kecamatanPasang = true;
      }
      if (!formData.kelurahanPasang?.trim() && !formData.desaPasang?.trim()) {
        errors.push('Kelurahan / Desa pemasangan wajib dipilih');
        fields.kelurahanPasang = true;
      }
      if (!formData.kodePosPasang?.trim()) {
        errors.push('Kode Pos pemasangan wajib diisi');
        fields.kodePosPasang = true;
      }
      if (!formData.statusKepemilikan?.trim()) {
        errors.push('Status kepemilikan properti wajib dipilih');
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
      if (!formData.dataPasang?.namaTeknisi?.trim()) {
        errors.push('Teknisi Instalatur wajib diisi');
        fields['dataPasang.namaTeknisi'] = true;
      }
      if (!formData.dataPasang?.noSeriMeter?.trim()) {
        errors.push('Nomor Seri Water Meter wajib diisi');
        fields['dataPasang.noSeriMeter'] = true;
      }
      if (!formData.dataPasang?.noSegel?.trim()) {
        errors.push('Nomor Segel Tera Meter wajib diisi');
        fields['dataPasang.noSegel'] = true;
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

  // Check if all required fields across all sections are valid
  const isAllRequiredFieldsFilled = useMemo(() => {
    // Section 1
    const s1 = Boolean(formData.noSr?.trim() && formData.namaKtp?.trim() && formData.noKtp?.trim() && formData.pekerjaan?.trim() && formData.telpHp?.trim());
    // Section 2
    const s2 = Boolean(formData.alamatKtp?.trim() && formData.rtRwKtp?.trim() && formData.provinsiKtp?.trim() && formData.kotaKtp?.trim() && formData.kecamatanKtp?.trim() && (formData.kelurahanKtp?.trim() || formData.desaKtp?.trim()) && formData.kodePosKtp?.trim());
    // Section 3
    const s3 = Boolean(formData.alamatPasang?.trim() && formData.rtRwPasang?.trim() && formData.provinsiPasang?.trim() && formData.kotaPasang?.trim() && formData.kecamatanPasang?.trim() && (formData.kelurahanPasang?.trim() || formData.desaPasang?.trim()) && formData.kodePosPasang?.trim() && formData.statusKepemilikan?.trim());
    // Section 4
    let s4 = Boolean(formData.fungsiBangunan?.trim());
    if (kategoriFungsi === 'rumah_tangga') {
      s4 = s4 && Boolean(formData.luasBangunan && Number(formData.luasBangunan) > 0 && formData.luasTanah && Number(formData.luasTanah) > 0 && formData.kondisiBangunan?.jumlahLantai && formData.kondisiBangunan?.jumlahPenghuni);
    }
    // Section 5
    const s5 = Boolean(formData.persyaratan?.ktp || formData.persyaratanFiles?.ktp);
    // Section 6
    const s6 = Boolean(
      formData.dataPasang?.namaSales?.trim() &&
      formData.dataPasang?.namaKontraktor?.trim() &&
      formData.dataPasang?.namaTeknisi?.trim() &&
      formData.dataPasang?.noSeriMeter?.trim() &&
      formData.dataPasang?.noSegel?.trim() &&
      formData.persetujuan
    );

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
    const idPelVal = formData.idPelanggan || currentUser?.idPelanggan || ('10' + Math.floor(100000 + Math.random() * 900000));
    const noSrVal = formData.noSr || Math.floor(100000 + Math.random() * 900000).toString();

    const finalizedRecord: RegistrationFormData = {
      ...formData,
      noForm: noFormVal,
      idPelanggan: idPelVal,
      noSr: noSrVal,
      statusPendaftaran: 'VERIFYING',
      status_pendaftaran: 'VERIFYING',
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

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-[#005DAA] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 border border-blue-400">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span className="text-xs font-bold">{notification}</span>
        </div>
      )}

      {/* JIKA PELANGGAN SUDAH MELAKUKAN PENDAFTARAN RESMI */}
      {activeExistingRegistration && !forceShowForm ? (
        <div className="bg-white rounded-2xl border-2 border-blue-400 shadow-xl p-6 sm:p-8 space-y-6 animate-in fade-in">
          {/* Main Notice Header */}
          <div className="bg-linear-to-r from-blue-50 via-sky-50 to-amber-50 border border-blue-200 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-13 h-13 rounded-2xl bg-[#005DAA] text-white flex items-center justify-center shadow-md shrink-0 mt-0.5">
                <Clock className="w-7 h-7 text-amber-300 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase font-black tracking-wider text-white bg-[#005DAA] px-3 py-0.5 rounded-full shadow-2xs">
                    Pemberitahuan Pendaftaran
                  </span>
                  <span className={`text-[10px] uppercase font-black tracking-wider px-3 py-0.5 rounded-full border ${
                    activeExistingRegistration.status_pendaftaran === 'WAITING_PAYMENT'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : activeExistingRegistration.status_pendaftaran === 'INSTALLATION_TRACKING'
                      ? 'bg-purple-100 text-purple-800 border-purple-300'
                      : activeExistingRegistration.status_pendaftaran === 'ACTIVE_CUSTOMER'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-sky-100 text-[#005DAA] border-sky-300'
                  }`}>
                    {activeExistingRegistration.status_pendaftaran === 'WAITING_PAYMENT'
                      ? 'Disetujui Admin • Menunggu Pembayaran'
                      : activeExistingRegistration.status_pendaftaran === 'INSTALLATION_TRACKING'
                      ? 'Tahap 3 • Dalam Pengerjaan Pipa & Meter'
                      : activeExistingRegistration.status_pendaftaran === 'ACTIVE_CUSTOMER'
                      ? 'Tahap 4 • Sambungan Resmi Aktif'
                      : 'Tahap 1: Dalam Tahap Verifikasi Petugas'}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  Proses Pendaftaran Anda Sedang Dalam Tahap Verifikasi Petugas
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Berkas pendaftaran sambungan baru Anda telah tersimpan di sistem Aetra. <span className="font-bold text-[#005DAA]">Mohon dicek secara berkala</span> untuk pembaruan status persetujuan dan penerbitan nomor pembayaran.
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

          {/* Payment Number Alert if Approved by Admin */}
          {activeExistingRegistration.nomorPembayaran && (
            <div className="bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-black tracking-wider text-emerald-100 bg-white/20 px-2.5 py-0.5 rounded-full">
                  Pendaftaran Disetujui Admin!
                </span>
                <div className="text-xs text-emerald-100">Nomor Pembayaran Pelanggan:</div>
                <div className="font-mono text-2xl sm:text-3xl font-black tracking-wider text-amber-200">
                  {activeExistingRegistration.nomorPembayaran}
                </div>
                <p className="text-[11px] text-emerald-100">
                  Total Biaya Sambungan: <strong className="text-white">Rp {((activeExistingRegistration.biayaSambungan || 1371545)).toLocaleString('id-ID')}</strong>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(activeExistingRegistration.nomorPembayaran || '');
                    setNotification('Nomor Pembayaran berhasil disalin!');
                    setTimeout(() => setNotification(null), 3000);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-xs hover:bg-emerald-50 shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Salin Nomor Bayar</span>
                </button>
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
                <span className="font-mono text-sm font-black text-[#005DAA] block">{activeExistingRegistration.noSr || '-'}</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">ID Pelanggan Resmi</span>
                <span className="font-mono text-sm font-black text-emerald-700 block">{activeExistingRegistration.idPelanggan}</span>
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
                <span className="text-[11px] text-slate-500 block">NIK: {activeExistingRegistration.noKtp} • HP/WA: {activeExistingRegistration.telpHp}</span>
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
              Petugas Aetra dan Admin akan memverifikasi berkas dan menghubungi nomor telepon Anda.
            </span>
            <div className="flex flex-wrap items-center gap-2">
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
        /* WIZARD MULTI-SECTION FORM */
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
                  Surat Permohonan Sambungan Rumah (SR) PT Aetra Air Tangerang &bull; Formulir Resmi 6 Tahap
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
                    • {err}
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
                        setFormData({ ...formData, namaKtp: e.target.value.toUpperCase() });
                        setErrorFields((prev) => ({ ...prev, namaKtp: false }));
                      }}
                      placeholder="Masukkan nama lengkap sesuai KTP (HURUF BESAR)"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-900 tracking-wide focus:outline-hidden transition ${
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
                      placeholder="Contoh: 3671041908850003"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest focus:outline-hidden transition ${
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
                      placeholder="Contoh: Karyawan Swasta / Wiraswasta"
                      className={`w-full px-3 py-2.5 rounded-xl text-xs focus:outline-hidden transition ${
                        errorFields.pekerjaan ? 'border-2 border-red-500 bg-red-50' : 'bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      No. Telepon / WhatsApp / HP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.telpHp}
                      onChange={(e) => {
                        setFormData({ ...formData, telpHp: e.target.value });
                        setErrorFields((prev) => ({ ...prev, telpHp: false }));
                      }}
                      placeholder="Contoh: 081288224645"
                      className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-hidden transition ${
                        errorFields.telpHp ? 'border-2 border-red-500 bg-red-50' : 'bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Pemohon (Opsional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contoh: pelanggan@gmail.com"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* ======================================================== */}
            {/* SECTION 2: ALAMAT SESUAI KTP (38 PROVINSI LENGKAP)       */}
            {/* ======================================================== */}
            {currentStep === 2 && (
              <section className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#005DAA] border border-blue-200">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Section 2: Alamat Sesuai KTP</h2>
                    <p className="text-xs text-slate-500">Pilihan wilayah lengkap seluruh 38 Provinsi di Indonesia</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Alamat Jalan / Blok / Nomor Rumah (Sesuai KTP) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.alamatKtp}
                      onChange={(e) => {
                        setFormData({ ...formData, alamatKtp: e.target.value });
                        setErrorFields((prev) => ({ ...prev, alamatKtp: false }));
                      }}
                      placeholder="Masukkan nama jalan, nomor persil, atau blok sesuai KTP"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-hidden transition ${
                        errorFields.alamatKtp ? 'border-2 border-red-500 bg-red-50' : 'bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* RT/RW */}
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
                        placeholder="Contoh: 003/005"
                        className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs focus:outline-hidden ${
                          errorFields.rtRwKtp ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                        }`}
                      />
                    </div>

                    {/* Provinsi */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Provinsi (38 Provinsi) <span className="text-red-500">*</span>
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
                          ?.districts.map((d) => (
                            <option key={d.name} value={d.name}>
                              {d.name}
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
                        {INDONESIA_PROVINCES_DATA.find((p) => p.name === formData.provinsiKtp)
                          ?.cities.find((c) => c.name === formData.kotaKtp)
                          ?.districts.find((d) => d.name === formData.kecamatanKtp)
                          ?.villages.map((v, idx) => (
                            <option key={`ktp-${v}-${idx}`} value={v}>
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
                        placeholder="Contoh: 15520"
                        className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs focus:outline-hidden ${
                          errorFields.kodePosKtp ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ======================================================== */}
            {/* SECTION 3: ALAMAT LOKASI PEMASANGAN                      */}
            {/* ======================================================== */}
            {currentStep === 3 && (
              <section className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#005DAA] border border-blue-200">
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Section 3: Alamat Lokasi Pemasangan</h2>
                    <p className="text-xs text-slate-500">Titik persil rumah / bangunan tempat pemasangan pipa meter air</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Alamat Lengkap Lokasi Pemasangan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.alamatPasang}
                      onChange={(e) => {
                        setFormData({ ...formData, alamatPasang: e.target.value });
                        setErrorFields((prev) => ({ ...prev, alamatPasang: false }));
                      }}
                      placeholder="Masukkan alamat persil / lokasi fisik pemasangan pipa dinas"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs focus:outline-hidden transition ${
                        errorFields.alamatPasang ? 'border-2 border-red-500 bg-red-50' : 'bg-slate-50 border border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* RT/RW Pasang */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        RT / RW Pemasangan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.rtRwPasang}
                        onChange={(e) => {
                          setFormData({ ...formData, rtRwPasang: e.target.value });
                          setErrorFields((prev) => ({ ...prev, rtRwPasang: false }));
                        }}
                        placeholder="Contoh: 003/005"
                        className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs focus:outline-hidden ${
                          errorFields.rtRwPasang ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                        }`}
                      />
                    </div>

                    {/* Provinsi Pasang */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Provinsi Pemasangan <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.provinsiPasang || formData.provinsiKtp || 'Banten'}
                        onChange={(e) => {
                          const newProv = e.target.value;
                          setFormData({
                            ...formData,
                            provinsiPasang: newProv,
                            kotaPasang: '',
                            kecamatanPasang: '',
                            desaPasang: '',
                            kelurahanPasang: '',
                            kodePosPasang: '',
                          });
                          setErrorFields((prev) => ({ ...prev, provinsiPasang: false }));
                        }}
                        className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-medium focus:outline-hidden ${
                          errorFields.provinsiPasang ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#005DAA]'
                        }`}
                      >
                        <option value="">-- Pilih Provinsi --</option>
                        {INDONESIA_PROVINCES_DATA.map((prov) => (
                          <option key={`pasang-${prov.id}`} value={prov.name}>
                            {prov.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Kota / Kabupaten Pasang */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Kota / Kabupaten Pemasangan <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.kotaPasang || ''}
                        onChange={(e) => {
                          const newCity = e.target.value;
                          setFormData({
                            ...formData,
                            kotaPasang: newCity,
                            kecamatanPasang: '',
                            desaPasang: '',
                            kelurahanPasang: '',
                            kodePosPasang: '',
                          });
                          setErrorFields((prev) => ({ ...prev, kotaPasang: false }));
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
                      >
                        <option value="">-- Pilih Kota / Kab --</option>
                        {INDONESIA_PROVINCES_DATA.find((p) => p.name === (formData.provinsiPasang || 'Banten'))?.cities.map((city) => (
                          <option key={`pasang-city-${city.name}`} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Kecamatan Pasang */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Kecamatan <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.kecamatanPasang || ''}
                        onChange={(e) => {
                          const kec = e.target.value;
                          const currentProv = formData.provinsiPasang || 'Banten';
                          const currentCity = formData.kotaPasang || 'Kabupaten Tangerang';
                          const districtObj = INDONESIA_PROVINCES_DATA.find((p) => p.name === currentProv)
                            ?.cities.find((c) => c.name === currentCity)
                            ?.districts.find((d) => d.name === kec);

                          setFormData({
                            ...formData,
                            kecamatanPasang: kec,
                            kelurahanPasang: '',
                            desaPasang: '',
                            kodePosPasang: districtObj?.postalCode || formData.kodePosPasang || '',
                          });
                          setErrorFields((prev) => ({ ...prev, kecamatanPasang: false }));
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
                      >
                        <option value="">-- Pilih Kecamatan --</option>
                        {(
                          INDONESIA_PROVINCES_DATA.find((p) => p.name === (formData.provinsiPasang || 'Banten'))
                            ?.cities.find((c) => c.name === (formData.kotaPasang || 'Kabupaten Tangerang'))
                            ?.districts || []
                        ).map((d) => (
                          <option key={`pasang-kec-${d.name}`} value={d.name}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Kelurahan Pasang */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Kelurahan / Desa <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.kelurahanPasang || formData.desaPasang || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({
                            ...formData,
                            kelurahanPasang: val,
                            desaPasang: val,
                          });
                          setErrorFields((prev) => ({ ...prev, kelurahanPasang: false }));
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
                      >
                        <option value="">-- Pilih Kelurahan / Desa --</option>
                        {(
                          INDONESIA_PROVINCES_DATA.find((p) => p.name === (formData.provinsiPasang || 'Banten'))
                            ?.cities.find((c) => c.name === (formData.kotaPasang || 'Kabupaten Tangerang'))
                            ?.districts.find((d) => d.name === formData.kecamatanPasang)
                            ?.villages || []
                        ).map((kel: string, idx: number) => (
                          <option key={`pasang-vil-${kel}-${idx}`} value={kel}>
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
                        placeholder="Contoh: 15520"
                        className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs focus:outline-hidden ${
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

                    {formData.statusKepemilikan === 'Lainnya' && (
                      <input
                        type="text"
                        value={formData.statusKepemilikanLainnya || ''}
                        onChange={(e) => setFormData({ ...formData, statusKepemilikanLainnya: e.target.value })}
                        placeholder="Sebutkan status kepemilikan (mis: Rumah Dinas, Warisan, Hak Pakai)"
                        className="w-full mt-2 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
                      />
                    )}
                  </div>

                  {/* Peta Interaktif & Koordinat GPS */}
                  <div className="pt-2">
                    <InteractiveMapPicker
                      initialLat={formData.dataPasang?.gpsLat || -6.2366}
                      initialLng={formData.dataPasang?.gpsLong || 106.5621}
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
                </div>
              </section>
            )}

            {/* ======================================================== */}
            {/* SECTION 4: INFORMASI BANGUNAN & LINGKUNGAN               */}
            {/* ======================================================== */}
            {currentStep === 4 && (
              <section className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#005DAA] border border-blue-200">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Section 4: Informasi Bangunan &amp; Lingkungan</h2>
                    <p className="text-xs text-slate-500">Peruntukan fungsi bangunan dan prasarana lingkungan</p>
                  </div>
                </div>

                {/* Kategori Fungsi Bangunan */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-800">
                    Kategori Peruntukan Bangunan <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSelectKategori('rumah_tangga')}
                      className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        kategoriFungsi === 'rumah_tangga'
                          ? 'bg-blue-50 border-[#005DAA] ring-2 ring-blue-200 text-[#005DAA]'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">Rumah Tangga</span>
                        <Home className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">Rumah tinggal / perumahan non-komersial</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectKategori('sosial_instansi')}
                      className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        kategoriFungsi === 'sosial_instansi'
                          ? 'bg-blue-50 border-[#005DAA] ring-2 ring-blue-200 text-[#005DAA]'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">Sosial &amp; Instansi</span>
                        <Landmark className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">Tempat ibadah, yayasan, kantor pemerintah</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectKategori('usaha')}
                      className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        kategoriFungsi === 'usaha'
                          ? 'bg-blue-50 border-[#005DAA] ring-2 ring-blue-200 text-[#005DAA]'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">Niaga &amp; Usaha</span>
                        <Store className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">Ruko, warung, bengkel, tempat komersial</span>
                    </button>
                  </div>
                </div>

                {/* Kolom Jenis Fasilitas Sosial / Instansi (Berbentuk Kolom Form) */}
                {kategoriFungsi === 'sosial_instansi' && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Jenis Fasilitas Sosial / Instansi <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.fungsiBangunan}
                      onChange={(e) => setFormData({ ...formData, fungsiBangunan: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
                    >
                      {SOSIAL_INSTANSI_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Kolom Jenis Usaha / Komersial (Berbentuk Kolom Form) */}
                {kategoriFungsi === 'usaha' && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Jenis Bidang Usaha / Niaga Komersil <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.fungsiBangunan}
                      onChange={(e) => setFormData({ ...formData, fungsiBangunan: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
                    >
                      {USAHA_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Rincian Ukuran Fisik: HANYA MUNCUL APABILA RUMAH TANGGA */}
                {kategoriFungsi === 'rumah_tangga' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Luas Bangunan (m²) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.luasBangunan}
                          onChange={(e) => {
                            setFormData({ ...formData, luasBangunan: e.target.value });
                            setErrorFields((prev) => ({ ...prev, luasBangunan: false }));
                          }}
                          placeholder="Contoh: 72"
                          className={`w-full px-3 py-2 bg-white border rounded-xl text-xs font-semibold focus:outline-hidden ${
                            errorFields.luasBangunan ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:ring-2 focus:ring-[#005DAA]'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Luas Tanah (m²) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.luasTanah}
                          onChange={(e) => {
                            setFormData({ ...formData, luasTanah: e.target.value });
                            setErrorFields((prev) => ({ ...prev, luasTanah: false }));
                          }}
                          placeholder="Contoh: 90"
                          className={`w-full px-3 py-2 bg-white border rounded-xl text-xs font-semibold focus:outline-hidden ${
                            errorFields.luasTanah ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:ring-2 focus:ring-[#005DAA]'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Jumlah Lantai <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.kondisiBangunan?.jumlahLantai}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              kondisiBangunan: { ...formData.kondisiBangunan, jumlahLantai: e.target.value }
                            });
                            setErrorFields((prev) => ({ ...prev, jumlahLantai: false }));
                          }}
                          placeholder="Contoh: 1"
                          className={`w-full px-3 py-2 bg-white border rounded-xl text-xs font-semibold focus:outline-hidden ${
                            errorFields.jumlahLantai ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:ring-2 focus:ring-[#005DAA]'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          Jumlah Penghuni <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.kondisiBangunan?.jumlahPenghuni}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              kondisiBangunan: { ...formData.kondisiBangunan, jumlahPenghuni: e.target.value }
                            });
                            setErrorFields((prev) => ({ ...prev, jumlahPenghuni: false }));
                          }}
                          placeholder="Contoh: 4"
                          className={`w-full px-3 py-2 bg-white border rounded-xl text-xs font-semibold focus:outline-hidden ${
                            errorFields.jumlahPenghuni ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:ring-2 focus:ring-[#005DAA]'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Estimasi Golongan Tarif Air (Hanya Rumah Tangga) */}
                    {tariffResult && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] text-slate-500 font-semibold uppercase block">Estimasi Golongan Tarif Air</span>
                          <strong className="text-sm font-black text-[#005DAA]">{tariffResult.name}</strong>
                          <p className="text-[11px] text-slate-600 mt-0.5">{tariffResult.appliedClause}</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg shrink-0">
                          Tarif Resmi Aetra
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* KOLOM LINGKUNGAN DAN PRASARANA */}
                <BuildingEnvironmentFields
                  formData={formData}
                  setFormData={setFormData}
                />
              </section>
            )}

            {/* ======================================================== */}
            {/* SECTION 5: UPLOAD DOKUMEN ADMINISTRASI                   */}
            {/* ======================================================== */}
            {currentStep === 5 && (
              <section className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#005DAA] border border-blue-200">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Section 5: Upload Dokumen Persyaratan</h2>
                    <p className="text-xs text-slate-500">Unggah berkas identitas KTP pemohon, Kartu Keluarga, dan PBB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* KTP */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">1. Foto KTP Pemohon *</span>
                      {formData.persyaratan?.ktp && (
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

                  {/* KK */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">2. Foto Kartu Keluarga (KK)</span>
                      {formData.persyaratan?.kk && (
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

                  {/* PBB */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">3. Bukti PBB / Tagihan</span>
                      {formData.persyaratan?.pbb && (
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
                    <p className="text-xs text-slate-500">Administrasi teknis, spesifikasi water meter, pipa dinas, galian, dokumentasi foto, dan persetujuan</p>
                  </div>
                </div>

                {/* Kolom Petugas Lapangan, Spesifikasi Teknis, Galian, & Foto Dokumentasi */}
                <PetugasOfficerFields
                  formData={formData}
                  setFormData={setFormData}
                  errorFields={errorFields}
                  onOpenCamera={() => setCameraModalConfig({
                    isOpen: true,
                    targetType: 'property',
                    title: 'Foto Lokasi Lapangan & Titik Meter',
                    guideType: 'property'
                  })}
                  onUploadPhotos={(e) => {
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
                          caption: 'Dokumentasi Lapangan',
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
                  onRemovePhoto={(photoId) => {
                    setFormData((prev) => ({
                      ...prev,
                      fotoPropertiFiles: (prev.fotoPropertiFiles || []).filter((p) => p.id !== photoId),
                    }));
                  }}
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
                    <span>Selanjutnya: {SECTIONS[currentStep]?.title}</span>
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
        guideType={cameraModalConfig.guideType || 'document'}
      />
    </div>
  );
};
