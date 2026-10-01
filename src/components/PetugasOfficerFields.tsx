import React from 'react';
import { RegistrationFormData } from '../types';
import { 
  Wrench, 
  MapPin, 
  Calendar, 
  UserCheck, 
  FileCheck2,
  Layers,
  Activity,
  Ruler,
  CheckCircle2,
  HardHat,
  Gauge
} from 'lucide-react';

interface PetugasOfficerFieldsProps {
  formData: RegistrationFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegistrationFormData>>;
  errorFields?: Record<string, boolean>;
}

export const PetugasOfficerFields: React.FC<PetugasOfficerFieldsProps> = ({
  formData,
  setFormData,
  errorFields = {},
}) => {
  const updateDataPasang = (field: keyof RegistrationFormData['dataPasang'], value: any) => {
    setFormData((prev) => ({
      ...prev,
      dataPasang: {
        ...prev.dataPasang,
        [field]: value,
      },
    }));
  };

  const handleGalianToggle = (item: string) => {
    const current = formData.dataPasang?.dataGalian || [];
    const updated = current.includes(item)
      ? current.filter((g) => g !== item)
      : [...current, item];
    updateDataPasang('dataGalian', updated);
  };

  const dp = formData.dataPasang || {
    namaSales: '',
    tanggalSurvey: new Date().toISOString().split('T')[0],
    noWorkOrder: '',
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
    diameterPipa: '3/4 Inch',
    panjangPipa: '6',
    panjangPipaTipe: 'HDPE PE-100 PN16',
    materialStatus: 'Standard',
    materialTambahan: 'Kran Kuningan, Stop Kran Ball Valve',
    tanggalPasangMeter: '',
    noSegel: '',
    noSeriMeter: '',
  };

  const galianOptions = [
    'Tanah',
    '< 28,8 m²',
    'Coneblock',
    'Aspal',
    'Beton',
    '1 - 2 m',
    '< 1 m',
  ];

  const luasSurveyOptions = [
    '< 28,8 m²',
    '28,9 - 70 m²',
    '71 - 120 m²',
    '>120 m²',
  ];

  const kualitasOptions = [
    'Non Permanen',
    'Semi Permanen',
    'Permanen',
  ];

  return (
    <div className="bg-sky-50/70 p-4 sm:p-6 rounded-2xl border-2 border-sky-200 shadow-xs space-y-6">
      {/* Header Form Data Pasang Meter */}
      <div className="bg-[#005DAA] text-white px-5 py-3.5 rounded-xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center text-amber-300">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black uppercase tracking-wide">
              Data Pasang Meter &amp; Verifikasi Lapangan
            </h3>
            <p className="text-[11px] text-blue-100">
              Formulir Administrasi Teknis Lapangan, Jalur Distribusi &amp; Spesifikasi Fisik Sambungan Baru
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-white/20 text-white font-bold px-3 py-1 rounded-full shrink-0">
          Portal Petugas
        </span>
      </div>

      {/* 1. Identitas Petugas & Work Order */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-sky-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 text-xs font-bold text-slate-800">
          <UserCheck className="w-4 h-4 text-[#005DAA]" />
          <span>1. Identitas Petugas Lapangan &amp; Administrasi Survey</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Nama Sales / Surveyor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={dp.namaSales || ''}
              onChange={(e) => updateDataPasang('namaSales', e.target.value)}
              placeholder="Contoh: Bpk. Hendra Gunawan"
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold focus:bg-white focus:outline-hidden ${
                errorFields['dataPasang.namaSales'] ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:ring-2 focus:ring-[#005DAA]'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Tanggal Survey <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={dp.tanggalSurvey || ''}
                onChange={(e) => updateDataPasang('tanggalSurvey', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              No. Work Order (SPK / SPKO) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={dp.noWorkOrder || ''}
              onChange={(e) => updateDataPasang('noWorkOrder', e.target.value)}
              placeholder="Contoh: WO-2026-AET-8810"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:bg-white focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* 2. Titik Lokasi, Alamat & Koordinat GPS */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-sky-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 text-xs font-bold text-slate-800">
          <MapPin className="w-4 h-4 text-[#005DAA]" />
          <span>2. Titik Lokasi Pemasangan &amp; Verifikasi Alamat Fisik</span>
        </div>

        {/* Data Alamat Benar / Koreksi */}
        <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
          <label className="block text-xs font-bold text-slate-800">
            Kesesuaian Alamat dengan Titik Lapangan:
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <label className="inline-flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded-lg border border-slate-200">
              <input
                type="radio"
                name="dp_dataAlamat"
                checked={dp.dataAlamat === 'Benar' || !dp.dataAlamatKoreksi}
                onChange={() => {
                  updateDataPasang('dataAlamat', 'Benar');
                  updateDataPasang('dataAlamatKoreksi', '');
                }}
                className="text-[#005DAA] focus:ring-[#005DAA] w-4 h-4"
              />
              <span className="text-xs font-bold text-slate-800">Alamat Benar &amp; Sesuai Berkas</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded-lg border border-slate-200">
              <input
                type="radio"
                name="dp_dataAlamat"
                checked={dp.dataAlamat === 'Koreksi' || Boolean(dp.dataAlamatKoreksi)}
                onChange={() => updateDataPasang('dataAlamat', 'Koreksi')}
                className="text-[#005DAA] focus:ring-[#005DAA] w-4 h-4"
              />
              <span className="text-xs font-bold text-slate-800">Perlu Koreksi Alamat:</span>
            </label>

            {(dp.dataAlamat === 'Koreksi' || Boolean(dp.dataAlamatKoreksi)) && (
              <input
                type="text"
                value={dp.dataAlamatKoreksi || ''}
                onChange={(e) => {
                  updateDataPasang('dataAlamat', 'Koreksi');
                  updateDataPasang('dataAlamatKoreksi', e.target.value);
                }}
                placeholder="Tuliskan koreksi nama jalan / patokan persil lokasi..."
                className="flex-1 px-3 py-2 bg-white border border-blue-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
              />
            )}
          </div>
        </div>

        {/* GPS Koordinat */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              GPS Latitude Titik Sambungan
            </label>
            <input
              type="text"
              value={dp.gpsLat || ''}
              onChange={(e) => updateDataPasang('gpsLat', e.target.value)}
              placeholder="-6.236600"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-semibold focus:bg-white focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              GPS Longitude Titik Sambungan
            </label>
            <input
              type="text"
              value={dp.gpsLong || ''}
              onChange={(e) => updateDataPasang('gpsLong', e.target.value)}
              placeholder="106.562100"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-semibold focus:bg-white focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* 3. Jaringan Pipa Distribusi & Kontraktor */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-sky-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 text-xs font-bold text-slate-800">
          <Activity className="w-4 h-4 text-[#005DAA]" />
          <span>3. Kondisi Jaringan Distribusi Air &amp; Mitra Kontraktor Pelaksana</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Ketersediaan Jaringan Pipa Aetra:
            </label>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                <input
                  type="radio"
                  name="dp_dataJaringan"
                  checked={dp.dataJaringan === 'Ada Jaringan' || dp.dataJaringan?.includes('Ada')}
                  onChange={() => updateDataPasang('dataJaringan', 'Ada Jaringan')}
                  className="text-[#005DAA] focus:ring-[#005DAA] w-4 h-4"
                />
                <span className="text-xs font-bold text-emerald-700">Ada Jaringan Pipa</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                <input
                  type="radio"
                  name="dp_dataJaringan"
                  checked={dp.dataJaringan === 'Tidak ada Jaringan' || dp.dataJaringan?.includes('Tidak')}
                  onChange={() => updateDataPasang('dataJaringan', 'Tidak ada Jaringan')}
                  className="text-[#005DAA] focus:ring-[#005DAA] w-4 h-4"
                />
                <span className="text-xs font-bold text-red-700">Tidak Ada Jaringan</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Nama Mitra Kontraktor Pelaksana <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={dp.namaKontraktor || ''}
              onChange={(e) => updateDataPasang('namaKontraktor', e.target.value)}
              placeholder="Contoh: PT Mitra Tirta Tangerang"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* 4. Data Galian & Dimensi */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-sky-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <HardHat className="w-4 h-4 text-[#005DAA]" />
            <span>4. Data Galian &amp; Karakteristik Permukaan Jalur Pipa</span>
          </div>
          <span className="text-[10px] text-slate-500 font-semibold">Pilih salah satu atau lebih</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {galianOptions.map((opt) => {
            const isChecked = (dp.dataGalian || []).includes(opt);
            return (
              <label
                key={opt}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold cursor-pointer transition ${
                  isChecked
                    ? 'bg-blue-50 border-[#005DAA] text-[#005DAA] ring-1 ring-[#005DAA]'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleGalianToggle(opt)}
                  className="rounded text-[#005DAA] focus:ring-[#005DAA] w-4 h-4"
                />
                <span>{opt}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. Hasil Survey Fisik Bangunan & Kualitas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Luas Bangunan Survey */}
        <div className="bg-white p-4 rounded-xl border border-sky-200 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 pb-1.5 border-b border-slate-100">
            <Ruler className="w-4 h-4 text-[#005DAA]" />
            <span>Luas Bangunan (Hasil Survey)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {luasSurveyOptions.map((opt) => (
              <label
                key={opt}
                className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition ${
                  dp.luasBangunanSurvey === opt
                    ? 'bg-blue-50 border-[#005DAA] text-[#005DAA] ring-2 ring-blue-200 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="dp_luasBangunanSurvey"
                  checked={dp.luasBangunanSurvey === opt}
                  onChange={() => updateDataPasang('luasBangunanSurvey', opt)}
                  className="sr-only"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Kualitas Bangunan */}
        <div className="bg-white p-4 rounded-xl border border-sky-200 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 pb-1.5 border-b border-slate-100">
            <Layers className="w-4 h-4 text-[#005DAA]" />
            <span>Kualitas Bangunan</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {kualitasOptions.map((opt) => (
              <label
                key={opt}
                className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition ${
                  dp.kualitasBangunan === opt
                    ? 'bg-blue-50 border-[#005DAA] text-[#005DAA] ring-2 ring-blue-200 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="dp_kualitasBangunan"
                  checked={dp.kualitasBangunan === opt}
                  onChange={() => updateDataPasang('kualitasBangunan', opt)}
                  className="sr-only"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Spesifikasi Pipa Dinas & Meter Air */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-sky-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 text-xs font-bold text-slate-800">
          <Gauge className="w-4 h-4 text-[#005DAA]" />
          <span>6. Spesifikasi Teknis Pipa Dinas &amp; Rencana Water Meter</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Diameter Pipa Dinas
            </label>
            <select
              value={dp.diameterPipa || '1/2 Inch'}
              onChange={(e) => updateDataPasang('diameterPipa', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
            >
              <option value="1/2 Inch">1/2 Inch (Standar Domestik)</option>
              <option value="3/4 Inch">3/4 Inch (Domestik Besar)</option>
              <option value="1 Inch">1 Inch (Usaha / Niaga)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Panjang Pipa Dinas (Meter)
            </label>
            <input
              type="text"
              value={dp.panjangPipa || '6'}
              onChange={(e) => updateDataPasang('panjangPipa', e.target.value)}
              placeholder="6"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tipe Spesifikasi Pipa
            </label>
            <input
              type="text"
              value={dp.panjangPipaTipe || 'HDPE PE-100 PN16'}
              onChange={(e) => updateDataPasang('panjangPipaTipe', e.target.value)}
              placeholder="HDPE PE-100 PN16"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Material Aksesoris Standar
            </label>
            <input
              type="text"
              value={dp.materialTambahan || 'Kran Kuningan, Stop Kran Ball Valve, Box Meter'}
              onChange={(e) => updateDataPasang('materialTambahan', e.target.value)}
              placeholder="Kran Kuningan, Stop Kran Ball Valve, Box Meter"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Status Kelayakan Teknis Lapangan
            </label>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Memenuhi Syarat Teknis Sambungan Baru</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
