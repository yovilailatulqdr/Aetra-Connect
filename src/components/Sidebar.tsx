import React from 'react';
import { TabType, UserRole, UserAccount, RegistrationStatus } from '../types';
import { AetraLogo } from './AetraLogo';
import { 
  FileSignature, 
  Compass, 
  ReceiptText, 
  HeartHandshake, 
  BookOpen, 
  Users, 
  CreditCard, 
  MessageSquareHeart, 
  ShieldCheck, 
  User, 
  LogOut, 
  ChevronRight, 
  Sparkles,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  adminSubTab?: 'registrations' | 'bills' | 'surveys';
  onSelectAdminSubTab?: (subTab: 'registrations' | 'bills' | 'surveys') => void;
  registeredCount: number;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  userRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  currentUser?: UserAccount | null;
  customerStatus?: RegistrationStatus;
  onLogout?: () => void;
  onOpenSupabaseModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  adminSubTab = 'registrations',
  onSelectAdminSubTab,
  registeredCount: _registeredCount,
  isOpenMobile,
  setIsOpenMobile,
  userRole,
  onSwitchRole: _onSwitchRole,
  currentUser,
  customerStatus = 'NEW_USER',
  onLogout,
  onOpenSupabaseModal: _onOpenSupabaseModal,
}) => {
  interface NavItem {
    id: TabType;
    subTab?: 'registrations' | 'bills' | 'surveys';
    label: string;
    sublabel: string;
    icon: any;
    isLiveDot?: boolean;
    isHighlight?: boolean;
  }

  // Dynamic Navigation Generator based on Customer State Workflow
  const getCustomerNavItems = (): NavItem[] => {
    if (customerStatus === 'ACTIVE_CUSTOMER') {
      return [
        {
          id: 'registration',
          label: 'Profil Anda',
          sublabel: 'ID Pelanggan & Data Sambungan',
          icon: User,
        },
        {
          id: 'tracking',
          label: 'Tracking Sambungan',
          sublabel: 'Riwayat Pemasangan Selesai',
          icon: Compass,
        },
        {
          id: 'billing',
          label: 'Cek Tagihan Bulanan',
          sublabel: 'Cek & Bayar Rekening Air',
          icon: ReceiptText,
          isHighlight: true,
        },
        {
          id: 'survey',
          label: 'Survey Kepuasan',
          sublabel: 'Evaluasi CSAT & Layanan',
          icon: HeartHandshake,
        },
        {
          id: 'faq',
          label: 'FAQ',
          sublabel: 'Pertanyaan, Tarif & Ketentuan',
          icon: BookOpen,
        },
      ];
    }

    if (customerStatus === 'INSTALLATION_TRACKING') {
      return [
        {
          id: 'registration',
          label: 'Status Pendaftaran',
          sublabel: 'Data Sambungan Disetujui',
          icon: FileSignature,
        },
        {
          id: 'tracking',
          label: 'Tracking Sambungan',
          sublabel: 'Lacak Progres Kontraktor & Meter',
          icon: Compass,
          isLiveDot: true,
          isHighlight: true,
        },
        {
          id: 'faq',
          label: 'FAQ',
          sublabel: 'Pertanyaan, Tarif & Ketentuan',
          icon: BookOpen,
        },
      ];
    }

    if (customerStatus === 'VERIFYING' || customerStatus === 'WAITING_PAYMENT') {
      return [
        {
          id: 'registration',
          label: 'Status Pendaftaran',
          sublabel: customerStatus === 'WAITING_PAYMENT' ? 'Menunggu Pembayaran' : 'Tahap Verifikasi Petugas',
          icon: FileSignature,
          isLiveDot: true,
          isHighlight: true,
        },
        {
          id: 'faq',
          label: 'FAQ',
          sublabel: 'Pertanyaan, Tarif & Ketentuan',
          icon: BookOpen,
        },
      ];
    }

    // Default / NEW_USER (Hanya Form Pendaftaran Baru & FAQ)
    return [
      {
        id: 'registration',
        label: 'Registrasi Baru',
        sublabel: 'Formulir Sambungan (SR)',
        icon: FileSignature,
        isHighlight: true,
      },
      {
        id: 'faq',
        label: 'FAQ',
        sublabel: 'Pertanyaan, Tarif & Ketentuan',
        icon: BookOpen,
      },
    ];
  };

  const adminNavItems: NavItem[] = [
    {
      id: 'admin',
      subTab: 'registrations',
      label: 'Data Registrasi Baru',
      sublabel: 'Verifikasi Berkas & SPKO',
      icon: Users,
    },
    {
      id: 'admin',
      subTab: 'bills',
      label: 'Tagihan Pelanggan',
      sublabel: 'Input Manual & Impor Excel',
      icon: ReceiptText,
      isHighlight: true,
    },
    {
      id: 'admin',
      subTab: 'surveys',
      label: 'Survey Kepuasan',
      sublabel: 'Rekapitulasi CSAT & NPS',
      icon: MessageSquareHeart,
    },
  ];

  const isAdminAccount = currentUser?.role === 'admin' || userRole === 'admin';
  const currentNavItems = isAdminAccount ? adminNavItems : getCustomerNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-250 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <AetraLogo size="sm" variant="horizontal" />
          <button
            onClick={() => setIsOpenMobile(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Portal Status Header Badge */}
        {isAdminAccount ? (
          <div className="px-3 pt-3">
            <div className="py-2.5 px-3.5 bg-linear-to-r from-slate-900 via-[#004B8A] to-[#003868] text-white rounded-2xl flex items-center justify-between shadow-xs border border-blue-900/30">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-black tracking-wide">PORTAL ADMIN</span>
              </div>
              <span className="text-[10px] bg-white/20 text-white font-mono px-2 py-0.5 rounded-md font-bold">
                BACKOFFICE
              </span>
            </div>
          </div>
        ) : (
          <div className="px-3 pt-3">
            <div className="py-2 px-3 bg-linear-to-r from-blue-50/80 to-sky-50/60 border border-blue-200/70 rounded-2xl flex items-center gap-2 text-xs font-bold text-[#005DAA]">
              <div className="w-6 h-6 rounded-lg bg-[#005DAA]/10 flex items-center justify-center text-[#005DAA]">
                <User className="w-3.5 h-3.5" />
              </div>
              <span>Portal Pelanggan Resmi</span>
            </div>
          </div>
        )}

        {/* Primary Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5">
          <div className="px-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>{isAdminAccount ? 'Menu Backoffice Admin' : 'Menu Layanan'}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">
              {isAdminAccount ? 'Admin' : 'Pelanggan'}
            </span>
          </div>

          <nav className="space-y-1">
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                isAdminAccount && item.subTab
                  ? activeTab === 'admin' && adminSubTab === item.subTab
                  : activeTab === item.id;

              return (
                <button
                  key={`${item.id}-${item.subTab || 'default'}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.subTab && onSelectAdminSubTab) {
                      onSelectAdminSubTab(item.subTab);
                    }
                    setIsOpenMobile(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-2xl flex items-center gap-3 transition-all duration-150 group cursor-pointer ${
                    isActive
                      ? 'bg-[#005DAA] text-white shadow-md shadow-blue-900/20 font-medium'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-[#005DAA]'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-800'}`}>
                        {item.label}
                      </span>
                      {item.isLiveDot && (
                        <span className="relative flex h-2 w-2 shrink-0" title="Aktif Real-time">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-[11px] truncate leading-tight mt-0.5 ${
                        isActive ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {item.sublabel}
                    </p>
                  </div>

                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                      isActive ? 'text-white translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500'
                    }`}
                  />
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Account Info & Logout */}
        {currentUser && (
          <div className="p-3 mx-3 mb-2 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {currentUser.nama}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {currentUser.email}
                </div>
                <div className="text-[10px] font-mono font-bold text-[#005DAA] mt-0.5">
                  ID: #{currentUser.idPelanggan}
                </div>
              </div>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  title="Keluar Akun"
                  className="p-2 rounded-xl bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 hover:border-red-200 transition shrink-0 cursor-pointer shadow-2xs"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Bottom Status / Copyright */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/70 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>PT Aetra Air Tangerang</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Sistem Layanan Air Bersih Terpadu</p>
        </div>
      </aside>
    </>
  );
};
