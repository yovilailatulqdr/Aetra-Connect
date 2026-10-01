import React from 'react';
import { RegistrationFormData } from '../types';
import { Trees, Compass, ShieldCheck } from 'lucide-react';

interface BuildingEnvironmentFieldsProps {
  formData: RegistrationFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegistrationFormData>>;
}

export const BuildingEnvironmentFields: React.FC<BuildingEnvironmentFieldsProps> = ({
  formData,
  setFormData,
}) => {
  const updateLingkungan = (field: keyof RegistrationFormData['lingkungan'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      lingkungan: {
        ...(prev.lingkungan || {
          saluranPembuangan: '',
          sanitasi: '',
          halaman: '',
          lebarJalan: '',
          lingkunganTertata: '',
          realEstate: '',
        }),
        [field]: value,
      },
    }));
  };

  return (
    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
        <Trees className="w-4 h-4 text-[#005DAA]" />
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
          Lingkungan dan Prasarana
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Saluran Pembuangan */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Saluran Pembuangan Air Limbah
          </label>
          <select
            value={formData.lingkungan?.saluranPembuangan || ''}
            onChange={(e) => updateLingkungan('saluranPembuangan', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
          >
            <option value="">-- Pilih Saluran Air --</option>
            <option value="Ada - Saluran Tertutup">Ada - Saluran Tertutup / Gorong-gorong</option>
            <option value="Ada - Saluran Terbuka">Ada - Saluran Terbuka (Got / Parit)</option>
            <option value="Tidak Ada">Tidak Ada Saluran Pembuangan</option>
          </select>
        </div>

        {/* 2. Sanitasi & Septic Tank */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Kondisi Sanitasi &amp; Septic Tank
          </label>
          <select
            value={formData.lingkungan?.sanitasi || ''}
            onChange={(e) => updateLingkungan('sanitasi', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
          >
            <option value="">-- Pilih Kondisi Sanitasi --</option>
            <option value="Baik & Memenuhi Syarat">Baik &amp; Memenuhi Syarat Kesehatan</option>
            <option value="Sederhana">Sederhana / Standar</option>
            <option value="Kurang Memadai">Kurang Memadai</option>
          </select>
        </div>

        {/* 3. Halaman */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Kondisi Halaman Properti
          </label>
          <select
            value={formData.lingkungan?.halaman || ''}
            onChange={(e) => updateLingkungan('halaman', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
          >
            <option value="">-- Pilih Kondisi Halaman --</option>
            <option value="Ada Depan & Belakang">Ada Halaman Depan &amp; Belakang</option>
            <option value="Ada Halaman Sempit">Ada Halaman Sempit / Terbatas</option>
            <option value="Tanpa Halaman">Tanpa Halaman (Langsung Jalan)</option>
          </select>
        </div>

        {/* 4. Lebar Jalan Depan Rumah */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Lebar Jalan Depan Rumah
          </label>
          <select
            value={formData.lingkungan?.lebarJalan || ''}
            onChange={(e) => updateLingkungan('lebarJalan', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
          >
            <option value="">-- Pilih Lebar Jalan --</option>
            <option value="< 2 Meter">&lt; 2 Meter (Gang Sempit / Motor)</option>
            <option value="2 - 4 Meter">2 - 4 Meter (Akses 1 Mobil)</option>
            <option value="4 - 6 Meter">4 - 6 Meter (Akses 2 Mobil)</option>
            <option value="> 6 Meter">&gt; 6 Meter (Jalan Utama / Boulevard)</option>
          </select>
        </div>

        {/* 5. Lingkungan Tertata */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Kondisi Lingkungan Pemukiman
          </label>
          <select
            value={formData.lingkungan?.lingkunganTertata || ''}
            onChange={(e) => updateLingkungan('lingkunganTertata', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
          >
            <option value="">-- Pilih Tata Lingkungan --</option>
            <option value="Tertata & Teratur">Lingkungan Tertata &amp; Teratur</option>
            <option value="Semi Teratur">Semi Teratur</option>
            <option value="Padat Penduduk">Padat Penduduk / Kampung</option>
          </select>
        </div>

        {/* 6. Kawasan Real Estate */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Status Kawasan Perumahan / Real Estate
          </label>
          <select
            value={formData.lingkungan?.realEstate || ''}
            onChange={(e) => updateLingkungan('realEstate', e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden"
          >
            <option value="">-- Pilih Kawasan --</option>
            <option value="Non Real Estate (Pemukiman Umum)">Non Real Estate (Pemukiman Umum)</option>
            <option value="Kawasan Real Estate / Cluster">Kawasan Real Estate / Cluster / Komplek</option>
          </select>
        </div>
      </div>
    </div>
  );
};
