import React from 'react';
import { TabType, UserRole, UserAccount, RegistrationStatus } from '../types';
import { AetraLogo } from './AetraLogo';
import { Menu, ShieldCheck, User, LogOut, HelpCircle, BookOpen } from 'lucide-react';

interface HeaderProps {
  activeTab: TabType;
  onOpenMobileSidebar: () => void;
  registeredCount: number;
  userRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  currentUser?: UserAccount | null;
  customerStatus?: RegistrationStatus;
  isSidebarVisible?: boolean;
  onLogout?: () => void;
  onOpenSupabaseModal?: () => void;
  onSelectTab?: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenMobileSidebar,
  registeredCount: _registeredCount,
  userRole,
  onSwitchRole: _onSwitchRole,
  currentUser,
  customerStatus,
  isSidebarVisible = true,
  onLogout,
  onOpenSupabaseModal: _onOpenSupabaseModal,
  onSelectTab,
}) => {
  const tabTitles: Record<TabType, { title: string; subtitle: string; tag: string }> = {
    registration: {
      title: 'Register Pelanggan Baru',
      subtitle: 'Formulir Pendaftaran Sambungan Rumah Tangga PT Aetra Air Tangerang',
      tag: 'Sambungan Baru',
    },
    tracking: {
      title: 'Tracking Sambungan Baru',
      subtitle: 'Pantau Real-Time Progres Pemasangan Pipa & Meter Air Layaknya Lacak Pesanan Online',
      tag: 'Pelacakan Real-Time',
    },
    survey: {
      title: 'Survey Kepuasan Pelanggan',
      subtitle: 'Evaluasi Mutu Pelayanan Air Bersih PT Aetra Air Tangerang',
      tag: 'Evaluasi Mutu',
    },
    faq: {
      title: 'Tanya Jawab (FAQ)',
      subtitle: 'Pusat Bantuan Resmi, Syarat Administrasi & Info Pemeliharaan Jaringan Pipa',
      tag: 'Pusat Informasi',
    },
    billing: {
      title: 'Pembayaran Tagihan Bulanan',
      subtitle: 'Inquiry Rekening Air, Pemakaian Kubikasi (m³) & Pelunasan Resmi PT Aetra Air Tangerang',
      tag: 'Cek & Bayar Tagihan',
    },
    admin: {
      title: 'Data Pelanggan Pendaftaran Sambungan Baru',
      subtitle: 'Pengendalian Permohonan, Verifikasi Dokumen, Ekspor/Impor Excel & Progres SPKO Lapangan',
      tag: 'Data Pelanggan & Backoffice',
    },
  };

  const current = tabTitles[activeTab] || tabTitles.registration;
  const isCustomerActive = customerStatus === 'ACTIVE_CUSTOMER';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top micro ribbon */}
      <div className="bg-linear-to-r from-[#005DAA] via-[#004B8A] to-[#003868] text-white text-[11px] px-4 sm:px-8 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F37021] animate-pulse"></span>
          <span className="font-semibold text-slate-100">
            Sistem Informasi Pelayanan Pelanggan &bull; PT Aetra Air Tangerang
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-blue-100 text-[11px]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F37021]" />
            Kualitas Teruji Laboratorium
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Hamburger + Title / Breadcrumb */}
        <div className="flex items-center gap-3">
          {isSidebarVisible && (
            <button
              onClick={onOpenMobileSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
              aria-label="Buka Menu Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Logo */}
          <div className={isSidebarVisible ? 'lg:hidden' : 'block'}>
            <AetraLogo size="sm" variant="horizontal" />
          </div>

          {/* Desktop Title & Subtitle */}
          <div className={isSidebarVisible ? 'hidden lg:block' : 'hidden md:block pl-3 border-l border-slate-200'}>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F37021] bg-orange-50 px-2 py-0.5 rounded border border-orange-200 flex items-center gap-1.5">
                {activeTab === 'tracking' && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
                {current.tag}
              </span>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                {current.title}
              </h1>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">{current.subtitle}</p>
          </div>
        </div>

        {/* Right: FAQ Quick Button & Account Info */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Top Quick FAQ Button */}
          {onSelectTab && (
            <button
              type="button"
              onClick={() => onSelectTab(activeTab === 'faq' ? 'registration' : 'faq')}
              title="Pusat Bantuan & Tanya Jawab (FAQ)"
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'faq'
                  ? 'bg-[#005DAA] text-white border-[#005DAA] shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <HelpCircle className={`w-4 h-4 ${activeTab === 'faq' ? 'text-amber-300' : 'text-[#005DAA]'}`} />
              <span className="hidden sm:inline">Pusat Bantuan (FAQ)</span>
            </button>
          )}

          {/* Role Status Badge */}
          {currentUser?.role === 'admin' ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-linear-to-r from-[#005DAA] to-[#003868] text-white text-xs font-bold shadow-2xs border border-blue-900/30">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Portal Admin</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-[#005DAA] text-xs font-bold shadow-2xs">
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Portal Pelanggan</span>
            </div>
          )}

          {/* User Account Info & Logout */}
          {currentUser && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="hidden lg:block text-right">
                <div className="text-xs font-bold text-slate-800 truncate max-w-[160px]">
                  {currentUser.nama}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {currentUser.role === 'admin' ? (
                    'Otoritas Admin'
                  ) : isCustomerActive && currentUser.idPelanggan ? (
                    `ID: #${currentUser.idPelanggan}`
                  ) : (
                    'Calon Pelanggan'
                  )}
                </div>
              </div>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  title="Keluar dari Akun"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition text-xs font-semibold flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
