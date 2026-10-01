import React from 'react';
import { RegistrationFormData, PropertyPhoto } from '../types';
import { 
  UserCheck, 
  Activity, 
  Wrench, 
  Camera, 
  Plus, 
  Trash2, 
  ImageIcon 
} from 'lucide-react';

interface PetugasOfficerFieldsProps {
  formData: RegistrationFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegistrationFormData>>;
  errorFields?: Record<string, boolean>;
  onOpenCamera: () => void;
  onUploadPhotos: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: (photoId: string) => void;
}

export const PetugasOfficerFields: React.FC<PetugasOfficerFieldsProps> = ({
  formData,
  setFormData,
  errorFields = {},
  onOpenCamera,
  onUploadPhotos,
  onRemovePhoto,
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

  return (
    <div className="space-y-6">
      {/* 1. ADMINISTRASI & PETUGAS LAPANGAN */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <UserCheck className="w-4 h-4 text-[#005DAA]" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            1. Administrasi &amp; Petugas Lapangan
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Petugas Surveyor Lapangan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.dataPasang?.namaSales || ''}
              onChange={(e) => updateDataPasang('namaSales', e.target.value)}
              placeholder="Nama petugas survey"
              className={`w-full px-3 py-2 bg-white border rounded-xl text-xs font-medium focus:outline-hidden ${
                errorFields['dataPasang.namaSales'] ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:ring-2 focus:ring-[#005DAA]'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tanggal Survey Lapangan <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.dataPasang?.tanggalSurvey || formData.tanggal || ''}
              onChange={(e) => updateDataPasang('tanggalSurvey', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              No. Work Order / SPKO <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.dataPasang?.noWorkOrder || ''}
              onChange={(e) => updateDataPasang('noWorkOrder', e.target.value)}
              placeholder="Contoh: WO-2026-AET-8810"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              No. Kontak / WA Petugas
            </label>
            <input
              type="text"
              value={formData.dataPasang?.telpPetugas || ''}
              onChange={(e) => updateDataPasang('telpPetugas', e.target.value)}
              placeholder="Contoh: 081299887766"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mitra Kontraktor Pelaksana <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.dataPasang?.namaKontraktor || ''}
              onChange={(e) => updateDataPasang('namaKontraktor', e.target.value)}
              placeholder="Contoh: PT Mitra Tirta Tangerang"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* 2. VERIFIKASI KONDISI LAPANGAN & JARINGAN PIPA */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <Activity className="w-4 h-4 text-[#005DAA]" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            2. Verifikasi Kondisi Lapangan &amp; Jaringan Pipa
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Koreksi / Catatan Alamat Lapangan
            </label>
            <input
              type="text"
              value={formData.dataPasang?.dataAlamatKoreksi || ''}
              onChange={(e) => updateDataPasang('dataAlamatKoreksi', e.target.value)}
              placeholder="Catatan persil khusus / patokan lokasi (opsional)"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Status Jaringan Pipa Distribusi
            </label>
            <select
              value={formData.dataPasang?.dataJaringan || 'Ada Jaringan Depan Persil'}
              onChange={(e) => updateDataPasang('dataJaringan', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
            >
              <option value="Ada Jaringan Depan Persil">Ada Jaringan Depan Persil</option>
              <option value="Jaringan Seberang Jalan">Jaringan Seberang Jalan (Perlu Crossing)</option>
              <option value="Perlu Perluasan Pipa Dinas">Perlu Perluasan Pipa Dinas (&gt; 6 meter)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kualitas Bangunan Fisik
            </label>
            <select
              value={formData.dataPasang?.kualitasBangunan || 'Permanen'}
              onChange={(e) => updateDataPasang('kualitasBangunan', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
            >
              <option value="Permanen">Permanen (Tembok Cor)</option>
              <option value="Semi Permanen">Semi Permanen</option>
              <option value="Bertingkat / Ruko">Bertingkat / Ruko Komersil</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Estimasi Tekanan Air di Titik Pasang
            </label>
            <select
              value={formData.dataPasang?.materialStatus || 'Normal (0.7 - 1.0 Bar)'}
              onChange={(e) => updateDataPasang('materialStatus', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
            >
              <option value="Tinggi (> 1.0 Bar)">Tinggi (&gt; 1.0 Bar)</option>
              <option value="Normal (0.7 - 1.0 Bar)">Normal (0.7 - 1.0 Bar)</option>
              <option value="Rendah (< 0.7 Bar)">Rendah (&lt; 0.7 Bar)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. SPESIFIKASI TEKNIS METER AIR, PIPA DINAS DAN GALIAN */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <Wrench className="w-4 h-4 text-[#005DAA]" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            3. Spesifikasi Teknis Meter Air, Pipa Dinas &amp; Galian
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Diameter Pipa Dinas <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.dataPasang?.diameterPipa || '1/2" (DN 15 mm)'}
              onChange={(e) => updateDataPasang('diameterPipa', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
            >
              <option value='1/2" (DN 15 mm)'>1/2" (DN 15 mm) - Standar RT</option>
              <option value='3/4" (DN 20 mm)'>3/4" (DN 20 mm)</option>
              <option value='1" (DN 25 mm)'>1" (DN 25 mm)</option>
              <option value='1.5" (DN 40 mm)'>1.5" (DN 40 mm)</option>
              <option value='2" (DN 50 mm)'>2" (DN 50 mm) - Industri / Komersial</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Panjang Pipa Dinas (Meter)
            </label>
            <input
              type="text"
              value={formData.dataPasang?.panjangPipa || '6 Meter (Standar)'}
              onChange={(e) => updateDataPasang('panjangPipa', e.target.value)}
              placeholder="Contoh: 6 Meter"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tipe Material Pipa Dinas
            </label>
            <select
              value={formData.dataPasang?.panjangPipaTipe || 'HDPE PE-100 PN16'}
              onChange={(e) => updateDataPasang('panjangPipaTipe', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
            >
              <option value="HDPE PE-100 PN16">HDPE PE-100 PN16 (Standar Aetra)</option>
              <option value="PEX Pipeline">PEX Pipeline</option>
              <option value="GI Medium Galvanis">GI Medium Galvanis</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Teknisi Instalatur <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.dataPasang?.namaTeknisi || ''}
              onChange={(e) => updateDataPasang('namaTeknisi', e.target.value)}
              placeholder="Nama teknisi pelaksana"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nomor Seri Water Meter <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.dataPasang?.noSeriMeter || ''}
              onChange={(e) => updateDataPasang('noSeriMeter', e.target.value)}
              placeholder="Contoh: AET-2026-99120"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nomor Segel Tera Meter <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.dataPasang?.noSegel || ''}
              onChange={(e) => updateDataPasang('noSegel', e.target.value)}
              placeholder="Contoh: SGL-88412"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tanggal Pasang Meter Fisik <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.dataPasang?.tanggalPasangMeter || formData.tanggal || ''}
              onChange={(e) => updateDataPasang('tanggalPasangMeter', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Material Tambahan / Aksesoris
            </label>
            <input
              type="text"
              value={formData.dataPasang?.materialTambahan || 'Box Meter + Valve + Check Valve'}
              onChange={(e) => updateDataPasang('materialTambahan', e.target.value)}
              placeholder="Contoh: Box Meter + Valve"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Checkbox Jenis Galian */}
        <div className="pt-2 border-t border-slate-200">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Rincian Jenis Galian / Pembongkaran Lapangan:
          </label>
          <div className="flex flex-wrap gap-2.5">
            {['Tanah Biasa', 'Aspal Hotmix', 'Rabat Beton / Cor', 'Paving Block', 'Taman / Rumput'].map((galian) => {
              const isChecked = (formData.dataPasang?.dataGalian || []).includes(galian);
              return (
                <label
                  key={galian}
                  onClick={() => handleGalianToggle(galian)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition flex items-center gap-2 ${
                    isChecked
                      ? 'bg-blue-50 border-[#005DAA] text-[#005DAA]'
                      : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleGalianToggle(galian)}
                    className="text-[#005DAA] rounded focus:ring-[#005DAA]"
                  />
                  <span>{galian}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. DOKUMENTASI LAPANGAN */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#005DAA]" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                4. Dokumentasi Lapangan
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Foto tampak depan rumah, titik rencana water meter, jalur pipa persil, dan foto galian
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCamera}
              className="px-3 py-1.5 rounded-xl bg-[#005DAA] hover:bg-[#004A88] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Camera className="w-3.5 h-3.5" />
              Ambil Foto Kamera
            </button>
            <label className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-3.5 h-3.5" />
              Unggah Foto
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onUploadPhotos}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {formData.fotoPropertiFiles && formData.fotoPropertiFiles.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {formData.fotoPropertiFiles.map((photo: PropertyPhoto) => (
              <div key={photo.id} className="relative group border rounded-xl overflow-hidden bg-white shadow-2xs">
                <img src={photo.dataUrl} alt="Dokumentasi Lapangan" className="w-full aspect-video object-cover" />
                <div className="p-2">
                  <span className="text-[10px] text-slate-600 font-medium block truncate">{photo.caption || photo.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemovePhoto(photo.id)}
                  className="absolute top-1 right-1 p-1 rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer shadow-xs"
                  title="Hapus Foto"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 border border-dashed border-slate-300 rounded-xl text-center bg-white">
            <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-1" />
            <p className="text-xs font-semibold text-slate-600">Belum ada dokumentasi foto lapangan</p>
            <p className="text-[10px] text-slate-400">Gunakan tombol di atas untuk mengambil atau mengunggah foto lokasi.</p>
          </div>
        )}
      </div>
    </div>
  );
};
