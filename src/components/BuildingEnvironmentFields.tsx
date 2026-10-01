import React from 'react';
import { RegistrationFormData } from '../types';
import { Home, Layers, Users, Trees } from 'lucide-react';

interface BuildingEnvironmentFieldsProps {
  formData: RegistrationFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegistrationFormData>>;
  errorFields?: Record<string, boolean>;
}

export const BuildingEnvironmentFields: React.FC<BuildingEnvironmentFieldsProps> = ({
  formData,
  setFormData,
  errorFields = {},
}) => {
  const updateKondisi = (field: keyof RegistrationFormData['kondisiBangunan'], value: any) => {
    setFormData((prev) => {
      const updatedKondisi = {
        ...(prev.kondisiBangunan || {
          jumlahLantai: 1,
          jumlahPenghuni: 1,
        }),
        [field]: value,
      };

      // Multi-floor area calculation: Jika rumah 2 lantai atau lebih, luas dikalikan jumlah lantai
      let totalLuas = prev.luasBangunan;
      const baseLuas = parseFloat(String(prev.luasBangunan || '0'));
      const floorCount = Math.max(1, parseInt(String(field === 'jumlahLantai' ? value : updatedKondisi.jumlahLantai || 1), 10) || 1);
      
      if (baseLuas > 0) {
        totalLuas = baseLuas * floorCount;
      }

      return {
        ...prev,
        kondisiBangunan: {
          ...updatedKondisi,
          totalLuasBangunan: totalLuas,
        },
        totalLuasBangunan: totalLuas,
      };
    });
  };

  const updateLingkungan = (field: keyof RegistrationFormData['lingkungan'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      lingkungan: {
        ...(prev.lingkungan || {
          saluranPembuangan: 'Ada',
          sanitasi: 'Ada',
          halaman: 'Ada',
          lebarJalan: '> 4 m',
          lingkunganTertata: 'Ya',
          realEstate: 'Bukan',
        }),
        [field]: value,
      },
    }));
  };

  const kb = formData.kondisiBangunan || {
    jumlahLantai: 1,
    jumlahPenghuni: 1,
  };

  const ling = formData.lingkungan || {
    saluranPembuangan: 'Ada',
    sanitasi: 'Ada',
    halaman: 'Ada',
    lebarJalan: '> 4 m',
    lingkunganTertata: 'Ya',
    realEstate: 'Bukan',
  };

  return (
    <div className="bg-sky-50/70 p-4 sm:p-5 rounded-2xl border-2 border-sky-200 shadow-xs space-y-5">
      {/* Header */}
      <div className="bg-[#005DAA] text-white px-4 py-2.5 rounded-xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-amber-300" />
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide">
            Kondisi Bangunan dan Lingkungan (Pelanggan Rumah Tangga)
          </h3>
        </div>
        <span className="text-[10px] bg-white/20 text-white font-bold px-2.5 py-0.5 rounded-full">
          Data Fisik Bangunan
        </span>
      </div>

      {/* 1. Kondisi Bangunan: Cukup Jumlah Lantai & Jumlah Penghuni */}
      <div className="bg-white p-4 rounded-xl border border-sky-200 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-bold text-slate-800">
          <Layers className="w-4 h-4 text-[#005DAA]" />
          <span>Kondisi Bangunan</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Jumlah Lantai */}
          <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200 flex flex-col justify-between gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-0.5">
                Jumlah Lantai <span className="text-red-500">*</span>
              </label>
              <p className="text-[11px] text-slate-600">
                Jika ≥ 2 lantai, luas efektif dikalikan jumlah lantai untuk penentuan tarif
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="10"
                required
                value={kb.jumlahLantai ?? '1'}
                onChange={(e) => updateKondisi('jumlahLantai', e.target.value)}
                placeholder="1"
                className={`w-24 px-3 py-2 bg-white border-2 rounded-xl text-sm font-black text-center text-[#005DAA] focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden ${
                  errorFields.jumlahLantai ? 'border-red-500 bg-red-50' : 'border-blue-400'
                }`}
              />
              <span className="text-xs font-bold text-slate-700">Lantai</span>
            </div>
          </div>

          {/* Jumlah Penghuni */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-0.5">
                Jumlah Penghuni <span className="text-red-500">*</span>
              </label>
              <p className="text-[11px] text-slate-600">
                Total estimasi jumlah jiwa / anggota keluarga yang tinggal
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="100"
                required
                value={kb.jumlahPenghuni ?? '1'}
                onChange={(e) => updateKondisi('jumlahPenghuni', e.target.value)}
                placeholder="4"
                className={`w-24 px-3 py-2 bg-white border rounded-xl text-sm font-black text-center text-slate-800 focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden ${
                  errorFields.jumlahPenghuni ? 'border-red-500 bg-red-50' : 'border-slate-300'
                }`}
              />
              <span className="text-xs font-bold text-slate-700">Jiwa / Orang</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Lingkungan / Prasarana (6 Item Form Resmi) */}
      <div className="bg-white rounded-xl border border-sky-200 overflow-hidden shadow-2xs">
        <div className="bg-sky-100/80 px-4 py-2.5 border-b border-sky-200 flex items-center justify-between text-xs font-bold text-slate-800">
          <span className="flex items-center gap-1.5">
            <Trees className="w-4 h-4 text-[#005DAA]" />
            Lingkungan / Prasarana
          </span>
          <span>Keterangan</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {/* 1. Saluran Pembuangan */}
          <div className="p-3 flex items-center justify-between gap-2 hover:bg-slate-50">
            <span className="text-slate-800 font-semibold">1. Saluran Pembuangan</span>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="ling_saluranPembuangan"
                  checked={ling.saluranPembuangan === 'Ada' || ling.saluranPembuangan?.includes('Ada')}
                  onChange={() => updateLingkungan('saluranPembuangan', 'Ada')}
                  className="text-[#005DAA] focus:ring-[#005DAA] w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-800">Ada</span>
              </label>
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="ling_saluranPembuangan"
                  checked={ling.saluranPembuangan === 'Tidak Ada'}
                  onChange={() => updateLingkungan('saluranPembuangan', 'Tidak Ada')}
                  className="text-[#005DAA] focus:ring-[#005DAA] w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-800">Tidak Ada</span>
              </label>
            </div>
          </div>

          {/* 2. Sanitasi */}
          <div className="p-3 flex items-center justify-between gap-2 hover:bg-slate-50">
            <span className="text-slate-800 font-semibold">2. Sanitasi</span>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="ling_sanitasi"
                  checked={ling.sanitasi === 'Ada' || ling.sanitasi?.includes('Baik') || ling.sanitasi?.includes('Ada')}
                  onChange={() => updateLingkungan('sanitasi', 'Ada')}
                  className="text-[#005DAA] focus:ring-[#005DAA] w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-800">Ada</span>
              </label>
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="ling_sanitasi"
                  checked={ling.sanitasi === 'Tidak Ada' || ling.sanitasi?.includes('Kurang')}
                  onChange={() => updateLingkungan('sanitasi', 'Tidak Ada')}
                  className="text-[#005DAA] focus:ring-[#005DAA] w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-800">Tidak Ada</span>
              </label>
            </div>
          </div>

          {/* 3. Halaman */}
          <div className="p-3 flex items-center justify-between gap-2 hover:bg-slate-50">
            <span className="text-slate-800 font-semibold">3. Halaman</span>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="ling_halaman"
                  checked={ling.halaman === 'Ada' || ling.halaman?.includes('Ada')}
                  onChange={() => updateLingkungan('halaman', 'Ada')}
                  className="text-[#005DAA] focus:ring-[#005DAA] w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-800">Ada</span>
              </label>
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="ling_halaman"
                  checked={ling.halaman === 'Tidak Ada' || ling.halaman?.includes('Tanpa')}
                  onChange={() => updateLingkungan('halaman', 'Tidak Ada')}
                  className="text-[#005DAA] focus:ring-[#005DAA] w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-800">Tidak Ada</span>
              </label>
            </div>
          </div>

          {/* 4. Lebar Jalan (meter) */}
          <div className="p-3 space-y-2 hover:bg-slate-50">
            <span className="text-slate-800 font-semibold block">4. Lebar Jalan (meter)</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: '> 4 m', val: '> 4 m' },
                { label: '3 - 4 m', val: '3 - 4 m' },
                { label: '1 - 2 m', val: '1 - 2 m' },
                { label: '< 1 m', val: '< 1 m' },
              ].map((opt) => (
                <label
                  key={opt.val}
                  className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-bold cursor-pointer transition ${
                    ling.lebarJalan === opt.val
                      ? 'bg-blue-50 border-[#005DAA] text-[#005DAA] ring-2 ring-blue-200'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="ling_lebarJalan"
                    checked={ling.lebarJalan === opt.val}
                    onChange={() => updateLingkungan('lebarJalan', opt.val)}
                    className="text-[#005DAA] focus:ring-[#005DAA]"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 5. Lingkungan Tertata */}
          <div className="p-3 flex items-center justify-between gap-2 hover:bg-slate-50">
            <span className="text-slate-800 font-semibold">5. Lingkungan Tertata</span>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="ling_lingkunganTertata"
                  checked={ling.lingkunganTertata === 'Ya' || ling.lingkunganTertata?.includes('Tertata')}
                  onChange={() => updateLingkungan('lingkunganTertata', 'Ya')}
                  className="text-[#005DAA] focus:ring-[#005DAA] w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-800">Ya</span>
              </label>
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="ling_lingkunganTertata"
                  checked={ling.lingkunganTertata === 'Bukan' || ling.lingkunganTertata?.includes('Padat')}
                  onChange={() => updateLingkungan('lingkunganTertata', 'Bukan')}
                  className="text-[#005DAA] focus:ring-[#005DAA] w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-800">Bukan</span>
              </label>
            </div>
          </div>

          {/* 6. Real Estate */}
          <div className="p-3 flex items-center justify-between gap-2 hover:bg-slate-50">
            <span className="text-slate-800 font-semibold">6. Real Estate</span>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="ling_realEstate"
                  checked={ling.realEstate === 'Ya' || ling.realEstate?.includes('Kawasan')}
                  onChange={() => updateLingkungan('realEstate', 'Ya')}
                  className="text-[#005DAA] focus:ring-[#005DAA] w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-800">Ya</span>
              </label>
              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="ling_realEstate"
                  checked={ling.realEstate === 'Bukan' || ling.realEstate?.includes('Non')}
                  onChange={() => updateLingkungan('realEstate', 'Bukan')}
                  className="text-[#005DAA] focus:ring-[#005DAA] w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-800">Bukan</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
