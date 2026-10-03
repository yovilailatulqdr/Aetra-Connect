import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { MonthlyBillRecord } from '../types';
import { cloudSyncService, INITIAL_BILLS_DATA } from '../services/cloudSyncService';
import {
  CreditCard,
  Plus,
  Upload,
  Download,
  FileSpreadsheet,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Trash2,
  Edit3,
  X,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Calendar,
  Layers,
  Sparkles,
  Info,
  DollarSign,
  Receipt,
  Eye,
  Sliders,
  ShieldCheck,
  Lock,
  Unlock
} from 'lucide-react';

interface AdminBillManagementProps {
  bills: MonthlyBillRecord[];
  onUpdateBills: (updatedBills: MonthlyBillRecord[]) => void;
}

export const AdminBillManagement: React.FC<AdminBillManagementProps> = ({
  bills,
  onUpdateBills,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'BELUM LUNAS' | 'LUNAS'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<MonthlyBillRecord | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State for Manual Add / Edit with all fee components (Requirement 7)
  const [formData, setFormData] = useState({
    idPelanggan: '',
    noSr: '',
    nama: '',
    alamat: '',
    golonganTarif: '2A1 - Rumah Tangga Standard (R2)',
    nomorMeter: '',
    periodeBulan: 'Maret 2026',
    tanggalJatuhTempo: '20 Maret 2026',
    pemakaianM3: 18,
    biayaAir: 97500,
    biayaPemeliharaanMeter: 12500,
    biayaAdministrasi: 10000,
    denda: 0,
    biayaSegel: 0,
    biayaLainnya: 0,
    totalTagihan: 120000,
    status: 'BELUM LUNAS' as 'BELUM LUNAS' | 'LUNAS',
  });

  // Recalculate total whenever individual fees change
  const calculatedTotal = useMemo(() => {
    return (
      Number(formData.biayaAir || 0) +
      Number(formData.biayaPemeliharaanMeter || 0) +
      Number(formData.biayaAdministrasi || 0) +
      Number(formData.denda || 0) +
      Number(formData.biayaSegel || 0) +
      Number(formData.biayaLainnya || 0)
    );
  }, [
    formData.biayaAir,
    formData.biayaPemeliharaanMeter,
    formData.biayaAdministrasi,
    formData.denda,
    formData.biayaSegel,
    formData.biayaLainnya,
  ]);

  // Sync total tagihan with sum
  useEffect(() => {
    setFormData((prev) => ({ ...prev, totalTagihan: calculatedTotal }));
  }, [calculatedTotal]);

  // Excel Import Preview State
  const [importPreview, setImportPreview] = useState<MonthlyBillRecord[]>([]);
  const [importFileName, setImportFileName] = useState<string>('');

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Filtered Bills
  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      const matchSearch =
        !searchTerm.trim() ||
        b.idPelanggan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.noSr && b.noSr.toLowerCase().includes(searchTerm.toLowerCase())) ||
        b.periodeBulan.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === 'all' || b.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [bills, searchTerm, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = bills.length;
    const unpaid = bills.filter((b) => b.status === 'BELUM LUNAS');
    const paid = bills.filter((b) => b.status === 'LUNAS');
    const totalAmount = bills.reduce((sum, b) => sum + (b.totalTagihan || 0), 0);
    const unpaidAmount = unpaid.reduce((sum, b) => sum + (b.totalTagihan || 0), 0);
    const paidAmount = paid.reduce((sum, b) => sum + (b.totalTagihan || 0), 0);

    return {
      total,
      unpaidCount: unpaid.length,
      paidCount: paid.length,
      totalAmount,
      unpaidAmount,
      paidAmount,
    };
  }, [bills]);

  // Copy ID Pelanggan
  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Open Edit Modal
  const handleOpenEdit = (bill: MonthlyBillRecord) => {
    setEditingBill(bill);
    setFormData({
      idPelanggan: bill.idPelanggan,
      noSr: bill.noSr || '',
      nama: bill.nama,
      alamat: bill.alamat || '',
      golonganTarif: bill.golonganTarif || '2A1 - Rumah Tangga Standard (R2)',
      nomorMeter: bill.nomorMeter || '',
      periodeBulan: bill.periodeBulan,
      tanggalJatuhTempo: bill.tanggalJatuhTempo,
      pemakaianM3: bill.pemakaianM3 || 18,
      biayaAir: bill.biayaAir || 97500,
      biayaPemeliharaanMeter: bill.biayaPemeliharaanMeter || 12500,
      biayaAdministrasi: bill.biayaAdministrasi || 10000,
      denda: bill.denda || 0,
      biayaSegel: (bill as any).biayaSegel || 0,
      biayaLainnya: (bill as any).biayaLainnya || bill.retribusi || 0,
      totalTagihan: bill.totalTagihan,
      status: bill.status,
    });
    setIsAddModalOpen(true);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingBill(null);
    setFormData({
      idPelanggan: '10' + Math.floor(100000 + Math.random() * 900000),
      noSr: '16' + Math.floor(1000 + Math.random() * 9000),
      nama: '',
      alamat: 'Jl. Pemukiman RT 001/002, Tangerang',
      golonganTarif: '2A1 - Rumah Tangga Standard (R2)',
      nomorMeter: 'AET-2609-' + Math.floor(1000 + Math.random() * 9000),
      periodeBulan: 'Maret 2026',
      tanggalJatuhTempo: '20 Maret 2026',
      pemakaianM3: 18,
      biayaAir: 97500,
      biayaPemeliharaanMeter: 12500,
      biayaAdministrasi: 10000,
      denda: 0,
      biayaSegel: 0,
      biayaLainnya: 0,
      totalTagihan: 120000,
      status: 'BELUM LUNAS',
    });
    setIsAddModalOpen(true);
  };

  // Save Add / Edit
  const handleSaveBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.idPelanggan.trim()) {
      alert('ID Pelanggan wajib diisi.');
      return;
    }
    if (!formData.nama.trim()) {
      alert('Nama Pelanggan wajib diisi.');
      return;
    }

    const newRecord: MonthlyBillRecord = {
      id: editingBill?.id || 'bill-' + Date.now(),
      idPelanggan: formData.idPelanggan.trim(),
      noSr: formData.noSr.trim(),
      nama: formData.nama.trim().toUpperCase(),
      alamat: formData.alamat.trim().toUpperCase(),
      golonganTarif: formData.golonganTarif,
      nomorMeter: formData.nomorMeter || 'AET-2609-8812',
      periodeBulan: formData.periodeBulan,
      tanggalJatuhTempo: formData.tanggalJatuhTempo,
      standLalu: editingBill?.standLalu || 184,
      standKini: (editingBill?.standLalu || 184) + Number(formData.pemakaianM3),
      pemakaianM3: Number(formData.pemakaianM3),
      rincianBlok: editingBill?.rincianBlok || {
        blok1M3: 10,
        blok1Tarif: 4500,
        blok1Total: 45000,
        blok2M3: 8,
        blok2Tarif: 6500,
        blok2Total: 52000,
        blok3M3: 0,
        blok3Tarif: 8500,
        blok3Total: 0,
      },
      biayaAir: Number(formData.biayaAir),
      biayaPemeliharaanMeter: Number(formData.biayaPemeliharaanMeter),
      biayaAdministrasi: Number(formData.biayaAdministrasi),
      retribusi: Number(formData.biayaLainnya),
      denda: Number(formData.denda),
      totalTagihan: calculatedTotal,
      status: formData.status,
      tanggalBayar: formData.status === 'LUNAS' ? (editingBill?.tanggalBayar || new Date().toISOString().split('T')[0]) : undefined,
    };

    let updatedList: MonthlyBillRecord[];
    if (editingBill) {
      updatedList = bills.map((b) => (b.id === editingBill.id ? newRecord : b));
      showToast(`Tagihan ID ${newRecord.idPelanggan} (${newRecord.nama}) berhasil diperbarui.`);
    } else {
      updatedList = [newRecord, ...bills];
      showToast(`Tagihan baru ID ${newRecord.idPelanggan} (${newRecord.nama}) berhasil ditambahkan.`);
    }

    onUpdateBills(updatedList);
    cloudSyncService.saveBills(updatedList);
    setIsAddModalOpen(false);
  };

  // Toggle Pay Status directly
  const handleToggleStatus = (bill: MonthlyBillRecord) => {
    const nextStatus: 'LUNAS' | 'BELUM LUNAS' = bill.status === 'LUNAS' ? 'BELUM LUNAS' : 'LUNAS';
    const updated = bills.map((b) =>
      b.id === bill.id
        ? {
            ...b,
            status: nextStatus,
            tanggalBayar: nextStatus === 'LUNAS' ? new Date().toISOString().split('T')[0] : undefined,
          }
        : b
    );
    onUpdateBills(updated);
    cloudSyncService.saveBills(updated);
    showToast(`Status tagihan ID ${bill.idPelanggan} diubah menjadi "${nextStatus}".`);
  };

  // Delete Bill
  const handleDeleteBill = (id: string, nama: string) => {
    if (confirm(`Hapus data tagihan untuk ${nama}?`)) {
      const updated = bills.filter((b) => b.id !== id);
      onUpdateBills(updated);
      cloudSyncService.saveBills(updated);
      showToast(`Data tagihan ${nama} berhasil dihapus.`);
    }
  };

  // Excel Export
  const handleExportExcel = () => {
    const dataToExport = filteredBills.map((b, idx) => ({
      'No': idx + 1,
      'ID Pelanggan': b.idPelanggan,
      'No. SR': b.noSr || '-',
      'Nama Pelanggan': b.nama,
      'Alamat': b.alamat,
      'Golongan Tarif': b.golonganTarif,
      'Periode': b.periodeBulan,
      'Jatuh Tempo': b.tanggalJatuhTempo,
      'Pemakaian (m³)': b.pemakaianM3,
      'Biaya Air': b.biayaAir,
      'Biaya Pemeliharaan': b.biayaPemeliharaanMeter,
      'Biaya Administrasi': b.biayaAdministrasi,
      'Denda Tunggakan': b.denda,
      'Total Tagihan': b.totalTagihan,
      'Status': b.status,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tagihan Rekening Air');
    XLSX.writeFile(wb, `Aetra_Tagihan_Rekening_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-slate-900 via-[#0d1e3d] to-[#0a382b] border border-slate-700 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5" />
              BILLING &amp; KEUANGAN AETRA
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Manajemen Tagihan Rekening Air &amp; Input Rincian Biaya
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            Kelola tagihan bulanan, input manual denda tunggakan, biaya pembukaan segel, dan pemeliharaan meter air pelanggan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider transition flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tagihan Baru</span>
          </button>
          <button
            type="button"
            onClick={handleExportExcel}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Ekspor Excel</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#111c38] border border-slate-700/80 text-white">
          <span className="text-xs text-slate-400 block font-semibold">Total Tagihan Terbit</span>
          <div className="font-mono text-2xl font-black text-amber-400 mt-1">{stats.total} Record</div>
          <span className="text-[11px] text-slate-400">Rp {stats.totalAmount.toLocaleString('id-ID')}</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#111c38] border border-slate-700/80 text-white">
          <span className="text-xs text-slate-400 block font-semibold">Tagihan Belum Lunas</span>
          <div className="font-mono text-2xl font-black text-red-400 mt-1">{stats.unpaidCount} Record</div>
          <span className="text-[11px] text-red-300">Rp {stats.unpaidAmount.toLocaleString('id-ID')}</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#111c38] border border-slate-700/80 text-white">
          <span className="text-xs text-slate-400 block font-semibold">Tagihan Lunas (Terverifikasi)</span>
          <div className="font-mono text-2xl font-black text-emerald-400 mt-1">{stats.paidCount} Record</div>
          <span className="text-[11px] text-emerald-300">Rp {stats.paidAmount.toLocaleString('id-ID')}</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#111c38] border border-slate-700/80 text-white">
          <span className="text-xs text-slate-400 block font-semibold">Periode Tagihan Aktif</span>
          <div className="font-mono text-lg font-black text-cyan-300 mt-1">Maret 2026</div>
          <span className="text-[11px] text-slate-400">Jatuh Tempo: 20 Maret 2026</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#111c38] border border-slate-700/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari ID Pelanggan, Nama, No. SR..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="BELUM LUNAS">Belum Lunas</option>
            <option value="LUNAS">Lunas</option>
          </select>
        </div>
      </div>

      {/* Bills Table */}
      <div className="rounded-2xl bg-[#111c38] border border-slate-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-[#091124] text-amber-400 font-bold border-b border-slate-700 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">ID Pelanggan</th>
                <th className="py-3.5 px-4">Nama &amp; Alamat</th>
                <th className="py-3.5 px-4">Periode</th>
                <th className="py-3.5 px-4 font-mono">Volume</th>
                <th className="py-3.5 px-4 font-mono">Denda / Segel</th>
                <th className="py-3.5 px-4 font-mono">Total Tagihan</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredBills.map((bill) => {
                const isPaid = bill.status === 'LUNAS';
                const hasPenalty = (bill.denda || 0) > 0 || ((bill as any).biayaSegel || 0) > 0;

                return (
                  <tr key={bill.id} className="hover:bg-slate-800/60 transition">
                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-sm">{bill.idPelanggan}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(bill.idPelanggan)}
                          className="p-1 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white"
                          title="Salin ID"
                        >
                          {copiedId === bill.idPelanggan ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-sans">SR: {bill.noSr || '-'}</span>
                    </td>

                    <td className="py-3 px-4">
                      <strong className="text-white block font-bold text-xs uppercase">{bill.nama}</strong>
                      <span className="text-[11px] text-slate-400 line-clamp-1">{bill.alamat}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-200 block">{bill.periodeBulan}</span>
                      <span className="text-[10px] text-slate-400">Jatuh Tempo: {bill.tanggalJatuhTempo}</span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                      {bill.pemakaianM3 || 0} m³
                    </td>

                    <td className="py-3 px-4 font-mono">
                      {hasPenalty ? (
                        <span className="text-amber-400 font-bold">
                          Rp {((bill.denda || 0) + ((bill as any).biayaSegel || 0)).toLocaleString('id-ID')}
                        </span>
                      ) : (
                        <span className="text-slate-500">Rp 0</span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-sm font-black text-amber-300">
                      Rp {bill.totalTagihan.toLocaleString('id-ID')}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(bill)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase cursor-pointer transition ${
                          isPaid
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                        }`}
                      >
                        {isPaid ? '✓ LUNAS' : '⏳ BELUM LUNAS'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(bill)}
                          className="p-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 transition"
                          title="Edit Rincian Biaya Manual"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBill(bill.id, bill.nama)}
                          className="p-2 rounded-xl bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 transition"
                          title="Hapus Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL INPUT / EDIT RINCIAN BIAYA MANUAL (REQUIREMENT 7) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#0e172e] border border-slate-700 text-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-slate-900 to-[#102446] p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">
                  {editingBill ? 'Edit Rincian Komponen Biaya Tagihan' : 'Tambah Tagihan Baru Pelanggan'}
                </h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBill} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    ID Pelanggan (8-Digit) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.idPelanggan}
                    onChange={(e) => setFormData((prev) => ({ ...prev, idPelanggan: e.target.value.replace(/\D/g, '') }))}
                    className="w-full font-mono font-bold px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    No. Sambungan Rumah (No. SR)
                  </label>
                  <input
                    type="text"
                    value={formData.noSr}
                    onChange={(e) => setFormData((prev) => ({ ...prev, noSr: e.target.value }))}
                    className="w-full font-mono px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">
                    Nama Lengkap Pelanggan <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData((prev) => ({ ...prev, nama: e.target.value.toUpperCase() }))}
                    className="w-full uppercase font-bold px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">
                    Alamat Lengkap Persil Pemasangan
                  </label>
                  <input
                    type="text"
                    value={formData.alamat}
                    onChange={(e) => setFormData((prev) => ({ ...prev, alamat: e.target.value.toUpperCase() }))}
                    className="w-full uppercase px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Periode Bulan Tagihan</label>
                  <input
                    type="text"
                    value={formData.periodeBulan}
                    onChange={(e) => setFormData((prev) => ({ ...prev, periodeBulan: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tanggal Jatuh Tempo</label>
                  <input
                    type="text"
                    value={formData.tanggalJatuhTempo}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tanggalJatuhTempo: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* KOMPONEN RINCIAN BIAYA MANUAL (REQUIREMENT 7) */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Input Manual Rincian Komponen Biaya Tagihan</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">1. Volume Pemakaian (m³):</label>
                    <input
                      type="number"
                      value={formData.pemakaianM3}
                      onChange={(e) => setFormData((prev) => ({ ...prev, pemakaianM3: Number(e.target.value) }))}
                      className="w-full font-mono px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Biaya Air Bersih (Rp):</label>
                    <input
                      type="number"
                      value={formData.biayaAir}
                      onChange={(e) => setFormData((prev) => ({ ...prev, biayaAir: Number(e.target.value) }))}
                      className="w-full font-mono px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">2. Biaya Pemeliharaan Meter (Rp):</label>
                    <input
                      type="number"
                      value={formData.biayaPemeliharaanMeter}
                      onChange={(e) => setFormData((prev) => ({ ...prev, biayaPemeliharaanMeter: Number(e.target.value) }))}
                      className="w-full font-mono px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">3. Biaya Administrasi (Rp):</label>
                    <input
                      type="number"
                      value={formData.biayaAdministrasi}
                      onChange={(e) => setFormData((prev) => ({ ...prev, biayaAdministrasi: Number(e.target.value) }))}
                      className="w-full font-mono px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">4. Denda Keterlambatan / Tunggakan (Rp):</label>
                    <input
                      type="number"
                      value={formData.denda}
                      onChange={(e) => setFormData((prev) => ({ ...prev, denda: Number(e.target.value) }))}
                      className="w-full font-mono px-3 py-2 rounded-xl bg-slate-950 border border-amber-500/50 text-amber-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">5. Biaya Pembukaan Segel (Rp):</label>
                    <input
                      type="number"
                      value={formData.biayaSegel}
                      onChange={(e) => setFormData((prev) => ({ ...prev, biayaSegel: Number(e.target.value) }))}
                      className="w-full font-mono px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 mb-1">6. Retribusi / Biaya Lainnya (Rp):</label>
                    <input
                      type="number"
                      value={formData.biayaLainnya}
                      onChange={(e) => setFormData((prev) => ({ ...prev, biayaLainnya: Number(e.target.value) }))}
                      className="w-full font-mono px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Grand Total Preview */}
                <div className="p-3.5 rounded-xl bg-blue-950/60 border border-blue-500/40 flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-200">Total Tagihan Otomatis:</span>
                  <span className="text-base font-black text-amber-300 font-mono">
                    Rp {calculatedTotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Status Pembayaran</label>
                <select
                  value={formData.status}
                  onChange={(e: any) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                >
                  <option value="BELUM LUNAS">⏳ BELUM LUNAS</option>
                  <option value="LUNAS">✓ LUNAS (TERVERIFIKASI)</option>
                </select>
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Rincian Tagihan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
