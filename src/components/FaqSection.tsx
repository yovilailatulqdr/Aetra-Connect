import React, { useState, useRef, useEffect } from 'react';
import { BOOKLET_FAQ_DATABASE, BOOKLET_CATEGORIES, BookletFAQ } from '../data/bookletFaqData';
import { AetraLogo } from './AetraLogo';
import { 
  Search, 
  ThumbsUp, 
  HelpCircle, 
  PhoneCall, 
  MessageCircle, 
  Mail, 
  CheckCircle, 
  Clock, 
  FileText, 
  CreditCard, 
  Droplets, 
  Gauge, 
  Building2, 
  RotateCcw, 
  Sparkles, 
  Download, 
  Bot, 
  Send, 
  User, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  ExternalLink,
  Printer,
  X,
  MapPin,
  Phone,
  Headphones,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Copy,
  Info,
  Layers,
  ArrowRight,
  ShieldAlert,
  Wrench,
  FileCheck2,
  CheckCircle2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
  faqRef?: BookletFAQ;
}

interface FaqSectionProps {
  faqItems?: any[];
}

// 2 Official Branch & Main Office Locations Only
const OFFICIAL_OFFICES = [
  {
    id: 'pusat',
    name: 'Kantor Pusat PT Aetra Air Tangerang',
    badge: 'Kantor Pusat & Operasional',
    badgeColor: 'bg-blue-100 text-[#005DAA] border-blue-200',
    address: 'Jl. Raya Curug No. 27, Kadu Jaya, Kec. Curug, Kabupaten Tangerang, Banten 15810',
    phone: '(021) 598 5474',
    hours: 'Senin – Jumat: 08.00 – 16.00 WIB (Sabtu/Minggu/Libur Nasional: Tutup)',
    gmapsUrl: 'https://www.google.com/maps?q=-6.2625,106.5647',
    coords: '-6.2625, 106.5647',
  },
  {
    id: 'pasarkemis',
    name: 'Kantor Cabang Pelayanan Pasar Kemis',
    badge: 'Kantor Pelayanan Pelanggan',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    address: 'RUKO Perumahan PURI JAYA Blok AA No. 30, Sukamantri, Kec. Pasar Kemis, Kabupaten Tangerang, Banten 15560',
    phone: '(021) 598 5474',
    hours: 'Senin – Jumat: 08.00 – 16.00 WIB (Loket Kas & Customer Care)',
    gmapsUrl: 'https://www.google.com/maps?q=-6.1558,106.5369',
    coords: '-6.1558, 106.5369',
  },
];

export const FaqSection: React.FC<FaqSectionProps> = () => {
  // Main view tab: 'faq-list' (Default FAQ directory) vs 'chatbot' (Interactive Assistant)
  const [activeTabMode, setActiveTabMode] = useState<'faq-list' | 'chatbot'>('faq-list');

  // FAQ Directory State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(BOOKLET_FAQ_DATABASE[0]?.id || null);
  const [helpfulFeedback, setHelpfulFeedback] = useState<Record<string, 'yes' | 'no'>>({});
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Chatbot State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Halo! Saya Asisten Virtual Resmi PT Aetra Air Tangerang. Silakan tanyakan hal seputar syarat pasang baru, batas pipa, kualitas air, pembayaran, atau tata cara pelaporan gangguan air.',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions: [
        'Bagaimana 3 langkah mudah berlangganan air?',
        'Berapa tarif air dan simulasi tagihan 15 m³?',
        'Di mana batas pipa tanggung jawab Aetra vs Pelanggan?',
        'Mengapa air berbau kaporit dan apakah aman?',
        'Apa saja larangan terkait meter air?',
      ],
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isBookletModalOpen, setIsBookletModalOpen] = useState(false);
  const [activeBookletPage, setActiveBookletPage] = useState<number>(1);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTabMode === 'chatbot') {
      scrollToBottom();
    }
  }, [messages, isTyping, activeTabMode]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputQuestion).trim();
    if (!text) return;

    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuestion('');
    setIsTyping(true);

    setTimeout(() => {
      const qLower = text.toLowerCase();
      let bestMatch = BOOKLET_FAQ_DATABASE.find((faq) =>
        faq.question.toLowerCase().includes(qLower) ||
        qLower.includes(faq.question.toLowerCase().slice(0, 15))
      );

      if (!bestMatch) {
        bestMatch = BOOKLET_FAQ_DATABASE.find((faq) =>
          faq.tags.some((t) => qLower.includes(t.toLowerCase())) ||
          faq.shortAnswer.toLowerCase().includes(qLower)
        );
      }

      let botReply: ChatMessage;

      if (bestMatch) {
        botReply = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: bestMatch.shortAnswer,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          faqRef: bestMatch,
          suggestedQuestions: BOOKLET_FAQ_DATABASE
            .filter((f) => f.id !== bestMatch!.id && f.category === bestMatch!.category)
            .slice(0, 3)
            .map((f) => f.question),
        };
      } else {
        botReply = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Pertanyaan Anda: "${text}". Berdasarkan Buku Panduan Pelanggan Aetra, silakan pilih topik terkait di bawah atau hubungi Contact Center 24 Jam kami di (021) 598 5474.`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          suggestedQuestions: [
            'Bagaimana 3 langkah mudah berlangganan air?',
            'Berapa tarif air dan simulasi tagihan 15 m³?',
            'Apa saja larangan terkait meter air?',
            'Di mana saja lokasi pembayaran resmi?',
          ],
        };
      }

      setIsTyping(false);
      setMessages((prev) => [...prev, botReply]);
    }, 350);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filtered FAQs based on category and search query
  const filteredFaqs = BOOKLET_FAQ_DATABASE.filter((faq) => {
    const matchesCategory = selectedCategory === 'ALL' || faq.category === selectedCategory;
    const qLower = searchQuery.toLowerCase().trim();
    if (!qLower) return matchesCategory;

    const matchesSearch =
      faq.question.toLowerCase().includes(qLower) ||
      faq.shortAnswer.toLowerCase().includes(qLower) ||
      faq.tags.some((t) => t.toLowerCase().includes(qLower)) ||
      faq.category.toLowerCase().includes(qLower);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* ========================================================= */}
      {/* 1. TOP HERO & MODERN CONTACT CENTER INTERFACE             */}
      {/* ========================================================= */}
      <div className="bg-linear-to-r from-[#005DAA] via-[#004B8A] to-[#003868] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border-b-4 border-[#F37021]">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-cyan-200 text-xs font-semibold border border-white/20">
              <Headphones className="w-3.5 h-3.5 text-[#F37021]" />
              <span>Layanan Pelanggan &amp; Pusat Informasi Resmi</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Pusat Bantuan, FAQ &amp; Contact Center
            </h1>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Temukan jawaban cepat atas seluruh pertanyaan seputar sambungan baru, batas pipa, tarif, dan pembayaran rekening air atau hubungi petugas kami 24 jam.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setActiveBookletPage(1);
                setIsBookletModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-[#005DAA] hover:bg-blue-50 text-xs font-black transition cursor-pointer shadow-md"
            >
              <BookOpen className="w-4 h-4 text-[#F37021]" />
              <span>Buku Panduan (11 Hal)</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition cursor-pointer"
              title="Cetak informasi bantuan"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak</span>
            </button>
          </div>
        </div>

        {/* 24/7 Contact Cards Grid */}
        <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 relative z-10">
          {/* Card 1: 24/7 Call Center */}
          <a
            href="tel:0215985474"
            className="group bg-white/10 hover:bg-white/20 p-4 rounded-2xl border border-white/15 backdrop-blur-sm transition flex items-start gap-3.5 cursor-pointer shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-orange-200 uppercase tracking-wider block">
                Contact Center 24 Jam
              </span>
              <div className="text-base font-black text-white font-mono group-hover:underline">
                (021) 598 5474
              </div>
              <span className="text-[11px] text-blue-100 block">
                Siaga 24/7 melayani informasi &amp; keluhan
              </span>
            </div>
          </a>

          {/* Card 2: WhatsApp Chatbot / Support */}
          <a
            href="https://wa.me/6287788224645?text=Halo%20Aetra%20Tangerang,%20saya%20ingin%20bertanya%20mengenai%20layanan%20air%20bersih."
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white/10 hover:bg-white/20 p-4 rounded-2xl border border-white/15 backdrop-blur-sm transition flex items-start gap-3.5 cursor-pointer shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">
                WhatsApp Customer Care
              </span>
              <div className="text-base font-black text-white font-mono group-hover:underline">
                0877 8822 4645
              </div>
              <span className="text-[11px] text-blue-100 block">
                Chat interaktif cepat &amp; info tagihan
              </span>
            </div>
          </a>

          {/* Card 3: Email Support */}
          <a
            href="mailto:pengaduan@aetratangerang.co.id"
            className="group bg-white/10 hover:bg-white/20 p-4 rounded-2xl border border-white/15 backdrop-blur-sm transition flex items-start gap-3.5 cursor-pointer shadow-xs sm:col-span-2 lg:col-span-1"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-cyan-200 uppercase tracking-wider block">
                Surel / Email Resmi
              </span>
              <div className="text-xs font-bold text-white truncate max-w-[200px] group-hover:underline">
                pengaduan@aetratangerang.co.id
              </div>
              <span className="text-[11px] text-blue-100 block">
                Respon penanganan berkas resmi
              </span>
            </div>
          </a>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. OFFICIAL OFFICES (KANTOR PUSAT & PASAR KEMIS SAJA)      */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#005DAA]" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Lokasi Kantor Pelayanan Resmi Aetra Tangerang
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-semibold">
            2 Titik Kantor Utama
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OFFICIAL_OFFICES.map((office) => (
            <div
              key={office.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${office.badgeColor}`}>
                    {office.badge}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(office.address, office.id)}
                    className="text-[11px] text-[#005DAA] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedText === office.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedText === office.id ? 'Tersalin' : 'Salin Alamat'}</span>
                  </button>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">
                  {office.name}
                </h3>

                <p className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                  <MapPin className="w-4 h-4 text-[#F37021] shrink-0 mt-0.5" />
                  <span>{office.address}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{office.hours}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-700 font-bold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#005DAA]" />
                    {office.phone}
                  </span>

                  <a
                    href={office.gmapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#005DAA] rounded-xl text-xs font-bold border border-blue-200 transition"
                  >
                    <span>Buka Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MODE SWITCHER: DAFTAR PERTANYAAN FAQ vs CHATBOT ASISTEN */}
      {/* ========================================================= */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-md mx-auto text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTabMode('faq-list')}
          className={`flex-1 py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTabMode === 'faq-list'
              ? 'bg-white text-[#005DAA] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Daftar Tanya Jawab FAQ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTabMode('chatbot')}
          className={`flex-1 py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTabMode === 'chatbot'
              ? 'bg-white text-[#005DAA] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bot className="w-4 h-4 text-[#F37021]" />
          <span>Asisten Chatbot AI</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 4. TAB A: DAFTAR PERTANYAAN FAQ INTERAKTIF (NON-CHATBOT)  */}
      {/* ========================================================= */}
      {activeTabMode === 'faq-list' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Search Bar */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400 shrink-0 ml-1" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pertanyaan, tarif, batas pipa, kualitas air, cara bayar..."
              className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-2 py-1 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Reset
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3.5 py-2 rounded-xl shrink-0 transition font-bold cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-[#005DAA] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Semua Kategori ({BOOKLET_FAQ_DATABASE.length})
            </button>

            {BOOKLET_CATEGORIES.map((cat) => {
              const count = BOOKLET_FAQ_DATABASE.filter((f) => f.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl shrink-0 transition font-medium cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#005DAA] text-white font-bold shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
                <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-700 text-sm">
                  Tidak ada pertanyaan yang sesuai dengan kata kunci "{searchQuery}"
                </h4>
                <p className="text-xs text-slate-500">
                  Coba gunakan kata kunci umum lain seperti <em>tarif</em>, <em>pipa</em>, <em>segel</em>, atau tanyakan pada tab Chatbot.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('ALL');
                  }}
                  className="px-4 py-2 bg-blue-50 text-[#005DAA] rounded-xl text-xs font-bold border border-blue-200 inline-block mt-2"
                >
                  Tampilkan Seluruh Pertanyaan
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
                      isExpanded
                        ? 'border-blue-400 ring-2 ring-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-50 text-[#005DAA] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-blue-200">
                          {index + 1}
                        </span>
                        <div>
                          <span className="text-[10px] font-bold text-[#F37021] uppercase tracking-wider block mb-0.5">
                            {faq.category} &bull; Hal. {faq.pageRef}
                          </span>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                            {faq.question}
                          </h3>
                        </div>
                      </div>

                      <div className="p-1 rounded-lg text-slate-400 shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-[#005DAA]" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </button>

                    {/* Accordion Content */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 border-t border-slate-100 text-xs space-y-4">
                        {/* Short Answer Callout */}
                        <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200/80 text-slate-800 font-medium leading-relaxed">
                          {faq.shortAnswer}
                        </div>

                        {/* Full Answer Paragraphs */}
                        <div className="space-y-2 text-slate-700 leading-relaxed">
                          {faq.fullAnswer.map((p, idx) => (
                            <p key={idx} className="whitespace-pre-line">
                              {p}
                            </p>
                          ))}
                        </div>

                        {/* Key Points */}
                        {faq.keyPoints && faq.keyPoints.length > 0 && (
                          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                              Poin-Poin Penting Buku Panduan:
                            </span>
                            <ul className="space-y-1.5">
                              {faq.keyPoints.map((pt, i) => (
                                <li key={i} className="flex items-start gap-2 text-slate-800">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                  <span className="text-[11px] font-medium">{pt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Helpful Feedback Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-[11px]">
                          <span className="text-slate-400">
                            Referensi Resmi: Buku Panduan Pelanggan No. 00170092031118
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">Apakah jawaban ini membantu?</span>
                            <button
                              type="button"
                              onClick={() => setHelpfulFeedback((prev) => ({ ...prev, [faq.id]: 'yes' }))}
                              className={`px-2.5 py-1 rounded-lg border font-bold transition flex items-center gap-1 ${
                                helpfulFeedback[faq.id] === 'yes'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>Ya</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setHelpfulFeedback((prev) => ({ ...prev, [faq.id]: 'no' }))}
                              className={`px-2.5 py-1 rounded-lg border font-bold transition flex items-center gap-1 ${
                                helpfulFeedback[faq.id] === 'no'
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                            >
                              <span>Tidak</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. TAB B: CHATBOT ASISTEN AI (INTERACTIVE)                */}
      {/* ========================================================= */}
      {activeTabMode === 'chatbot' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden flex flex-col h-[600px] animate-in fade-in duration-200">
          {/* Chatbot Top Toolbar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-linear-to-br from-[#005DAA] to-[#003868] text-white flex items-center justify-center shadow-xs">
                <Bot className="w-5 h-5 text-cyan-200" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">Asisten Virtual Aetra</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">Online</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Data Buku Panduan Pelanggan Resmi PT Aetra Air Tangerang
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setMessages([
                  {
                    id: 'welcome-reset',
                    sender: 'bot',
                    text: 'Percakapan direset. Silakan tanyakan hal seputar syarat pasang baru, batas pipa, kualitas air, atau simulasi tarif rekening!',
                    timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                    suggestedQuestions: [
                      'Bagaimana 3 langkah mudah berlangganan air?',
                      'Berapa tarif air dan simulasi tagihan 15 m³?',
                      'Di mana batas pipa tanggung jawab Aetra vs Pelanggan?',
                    ],
                  },
                ]);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs font-semibold transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset</span>
            </button>
          </div>

          {/* Quick Topic Chips */}
          <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">Topik Populer:</span>
            {[
              { label: '📞 Contact Center', q: 'Berapa nomor telepon Contact Center 24 Jam dan WhatsApp Aetra?' },
              { label: '3 Langkah Pasang', q: 'Bagaimana 3 langkah mudah berlangganan air?' },
              { label: 'Batas Pipa', q: 'Di mana batas pipa tanggung jawab Aetra vs Pelanggan?' },
              { label: 'Simulasi Tarif', q: 'Berapa tarif air dan simulasi tagihan 15 m³?' },
              { label: 'Bau Kaporit', q: 'Mengapa air berbau kaporit dan apakah aman?' },
              { label: 'Larangan Meter', q: 'Apa saja 7 larangan pelanggan terkait meter air?' },
              { label: 'Kanal Bayar', q: 'Di mana saja kanal pembayaran resmi tagihan Aetra?' },
            ].map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(item.q)}
                className="px-3 py-1 rounded-full bg-white hover:bg-blue-50 hover:text-[#005DAA] text-slate-700 text-xs font-medium border border-slate-200 hover:border-blue-300 shrink-0 transition cursor-pointer shadow-2xs"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Message Feed */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white shadow-xs ${
                    msg.sender === 'user' ? 'bg-slate-800' : 'bg-linear-to-br from-[#005DAA] to-[#003868]'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <User className="w-4 h-4 text-slate-200" />
                  ) : (
                    <Bot className="w-4 h-4 text-cyan-200" />
                  )}
                </div>

                <div className="space-y-2">
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-[#005DAA] text-white rounded-tr-xs font-medium'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs space-y-2.5'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Highlights from Booklet */}
                    {msg.faqRef && (
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <div className="bg-blue-50/80 p-2.5 rounded-xl border border-blue-200/70 space-y-1.5">
                          <span className="text-[10px] font-bold text-[#005DAA] uppercase tracking-wider block">
                            Poin Kunci (Buku Panduan Halaman {msg.faqRef.pageRef}):
                          </span>
                          <ul className="space-y-1">
                            {msg.faqRef.keyPoints.map((pt, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>{msg.timestamp}</span>
                      {msg.faqRef && (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                          Terverifikasi Resmi
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Suggested Follow-up Questions */}
                  {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="space-y-1 pl-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Pertanyaan Terkait:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedQuestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => handleSendMessage(sug)}
                            className="text-[11px] text-[#005DAA] bg-white hover:bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer text-left"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-linear-to-br from-[#005DAA] to-[#003868] text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-cyan-200" />
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 rounded-tl-xs flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ketik pertanyaan Anda seputar layanan air Aetra..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#005DAA]"
            />

            <button
              type="submit"
              disabled={!inputQuestion.trim() || isTyping}
              className="px-5 py-2.5 bg-[#005DAA] hover:bg-[#004A88] text-white rounded-2xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kirim</span>
            </button>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. BOOKLET VIEWER MODAL (11 PAGES WITH 2 OFFICES ONLY)    */}
      {/* ========================================================= */}
      {isBookletModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setIsBookletModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-blue-100 animate-in zoom-in-95 duration-200 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-linear-to-r from-[#005DAA] via-[#004B8A] to-[#003868] text-white p-4 sm:p-5 flex items-center justify-between border-b-4 border-[#F37021]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-cyan-200" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base">
                    Buku Panduan Pelanggan PT Aetra Air Tangerang
                  </h3>
                  <p className="text-xs text-blue-100">
                    Dokumen Resmi Standar Pelayanan Pelanggan (Halaman {activeBookletPage} dari 11)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsBookletModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Booklet Content Body */}
            <div className="p-6 overflow-y-auto flex-1 text-xs space-y-5 bg-slate-50/50">
              {/* PAGE 1 */}
              {activeBookletPage === 1 && (
                <div className="space-y-4 text-center max-w-lg mx-auto py-8">
                  <AetraLogo className="h-14 mx-auto" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#005DAA]">
                      Dokumen Informasi Pelanggan
                    </span>
                    <h3 className="text-xl font-black text-slate-900">
                      BUKU PANDUAN PELANGGAN
                    </h3>
                    <p className="text-xs text-slate-500">
                      Hak, Kewajiban, Batas Pipa, Tata Cara Pendaftaran Sambungan Baru, &amp; Standar Mutu Air Bersih
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-left text-xs text-blue-900 space-y-2">
                    <span className="font-bold block">Selamat Bergabung Bersama PT Aetra Air Tangerang!</span>
                    <p className="leading-relaxed">
                      Buku ini memuat panduan lengkap tata cara pendaftaran sambungan baru, batas pipa dinas dan persil, golongan tarif air minum, tips deteksi kebocoran mandiri, hingga saluran pengaduan 24 jam.
                    </p>
                  </div>
                </div>
              )}

              {/* PAGE 2 */}
              {activeBookletPage === 2 && (
                <div className="space-y-4">
                  <h4 className="font-black text-slate-900 text-sm border-b pb-2">
                    Halaman 2: Fasilitas &amp; Komitmen Layanan Pelanggan
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#005DAA] flex items-center justify-center font-bold">1</div>
                      <h5 className="font-bold text-slate-900">Contact Center 24 Jam</h5>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        Siaga 24 jam di <strong>(021) 598 5474</strong> dan WhatsApp <strong>0877 8822 4645</strong> melayani informasi &amp; keluhan.
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#F37021] flex items-center justify-center font-bold">2</div>
                      <h5 className="font-bold text-slate-900">Unit Reaksi Cepat 24 Jam</h5>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        Tim teknisi lapangan darurat yang siap menangani kebocoran pipa transmisi &amp; distribusi.
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">3</div>
                      <h5 className="font-bold text-slate-900">Layanan Pembayaran Mudah</h5>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        Melalui ATM, Mobile Banking (BCA, Mandiri, BRI, BNI), Indomaret, Alfamart, Kantor Pos &amp; Kantor Kas.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 3 */}
              {activeBookletPage === 3 && (
                <div className="space-y-4">
                  <h4 className="font-black text-slate-900 text-sm border-b pb-2">
                    Halaman 3: Tiga Langkah Mudah Menjadi Pelanggan Aetra
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-4 bg-white rounded-xl border border-blue-200 space-y-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#005DAA] font-black text-[10px]">Langkah 1</span>
                      <h5 className="font-bold text-slate-900">Pendaftaran &amp; Verifikasi</h5>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        Isi formulir online, unggah KTP dan denah lokasi. Petugas memverifikasi kelayakan jaringan distribusi.
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-orange-200 space-y-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#F37021] font-black text-[10px]">Langkah 2</span>
                      <h5 className="font-bold text-slate-900">Pembayaran Biaya Resmi</h5>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        Lakukan pembayaran biaya sambungan via Virtual Account resmi. Dilarang bayar tunai ke petugas.
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-emerald-200 space-y-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-black text-[10px]">Langkah 3</span>
                      <h5 className="font-bold text-slate-900">Pemasangan &amp; Air Mengalir</h5>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        Kontraktor memasang pipa dinas dan water meter SNI bersegel. Air bersih resmi mengalir ke rumah.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 4: KANTOR RESMI (HANYA KANTOR PUSAT & PASAR KEMIS) & BATAS PIPA */}
              {activeBookletPage === 4 && (
                <div className="space-y-4">
                  <h4 className="font-black text-slate-900 text-sm border-b pb-2">
                    Halaman 4: Lokasi Kantor Pelayanan &amp; Batas Tanggung Jawab Pipa
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                      <span className="text-[10px] font-black text-[#005DAA] uppercase block">Lokasi Kantor Pelayanan:</span>
                      <div className="space-y-2 text-[11px]">
                        <div className="p-2.5 bg-slate-50 rounded-lg border">
                          <strong className="text-slate-900 block">1. Kantor Pusat PT Aetra Air Tangerang</strong>
                          <span className="text-slate-600">Jl. Raya Curug No. 27, Kadu Jaya, Curug, Kab. Tangerang 15810</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-lg border">
                          <strong className="text-slate-900 block">2. Kantor Cabang Pasar Kemis</strong>
                          <span className="text-slate-600">RUKO Puri Jaya Blok AA No. 30, Sukamantri, Pasar Kemis 15560</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-200 space-y-2.5">
                      <span className="text-[10px] font-black text-[#005DAA] uppercase block">Batas Tanggung Jawab Pipa:</span>
                      <div className="p-2.5 bg-white rounded-lg border border-blue-200 text-[11px]">
                        <strong className="text-[#005DAA] block">Tanggung Jawab Aetra:</strong>
                        <span>Sambungan pipa utama distribusi, pipa dinas, kran meteran, dan segel resmi.</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-emerald-200 text-[11px]">
                        <strong className="text-emerald-700 block">Tanggung Jawab Pelanggan:</strong>
                        <span>Pipa instalasi dalam rumah setelah meteran air ke kran-kran rumah tangga.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 5: TARIF AIR */}
              {activeBookletPage === 5 && (
                <div className="space-y-4">
                  <h4 className="font-black text-slate-900 text-sm border-b pb-2">
                    Halaman 5: Golongan Tarif &amp; Perhitungan Rekening Air
                  </h4>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                    <p className="text-slate-700 leading-relaxed">
                      Tarif air dihitung secara <strong>Tarif Progresif Blok Konsumsi</strong> per meter kubik (m³):
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <span className="font-bold text-[#005DAA] block">Blok 1 (0 – 10 m³)</span>
                        <span className="text-[11px] text-slate-600">Tarif Subsidi Kebutuhan Pokok</span>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                        <span className="font-bold text-amber-800 block">Blok 2 (11 – 20 m³)</span>
                        <span className="text-[11px] text-slate-600">Tarif Pemakaian Sedang</span>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                        <span className="font-bold text-orange-800 block">Blok 3 (&gt; 20 m³)</span>
                        <span className="text-[11px] text-slate-600">Tarif Pemakaian Tinggi</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 6 s/d 11 Ringkasan */}
              {activeBookletPage >= 6 && (
                <div className="space-y-4">
                  <h4 className="font-black text-slate-900 text-sm border-b pb-2">
                    Halaman {activeBookletPage}: Ketentuan Teknis &amp; Layanan
                  </h4>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                    {activeBookletPage === 6 && (
                      <div className="space-y-2">
                        <h5 className="font-bold text-slate-900">Kualitas Air Minum Standar Permenkes RI</h5>
                        <p className="text-slate-600 leading-relaxed">
                          Air minum Aetra Tangerang diproses dengan teknologi modern yang memenuhi baku mutu fisik, kimia, dan bakteriologis sesuai Permenkes No. 492/2010.
                        </p>
                      </div>
                    )}
                    {activeBookletPage === 7 && (
                      <div className="space-y-2">
                        <h5 className="font-bold text-slate-900">Kewajiban &amp; Hak Pelanggan</h5>
                        <p className="text-slate-600 leading-relaxed">
                          Pelanggan berhak memperoleh pasokan air bersih yang memenuhi standar mutu dan berkewajiban membayar rekening tepat waktu sebelum tanggal 20 setiap bulannya.
                        </p>
                      </div>
                    )}
                    {activeBookletPage === 8 && (
                      <div className="space-y-2">
                        <h5 className="font-bold text-slate-900">Larangan Terkait Meter Air &amp; Segel</h5>
                        <p className="text-slate-600 leading-relaxed">
                          Dilarang merusak segel kran, membalik arah meteran air, menyambung langsung pipa dinas tanpa meter (by-pass), atau menimbun meteran dengan bangunan permanen.
                        </p>
                      </div>
                    )}
                    {activeBookletPage === 9 && (
                      <div className="space-y-2">
                        <h5 className="font-bold text-slate-900">Tata Cara Deteksi Kebocoran Mandiri</h5>
                        <p className="text-slate-600 leading-relaxed">
                          Tutup semua kran di dalam rumah. Jika jarum segitiga meter air masih berputar lambat, berarti terdapat kebocoran pada pipa persil di dalam rumah.
                        </p>
                      </div>
                    )}
                    {activeBookletPage === 10 && (
                      <div className="space-y-2">
                        <h5 className="font-bold text-slate-900">Saluran Pembayaran Resmi</h5>
                        <p className="text-slate-600 leading-relaxed">
                          ATM &amp; Mobile Banking (BCA, Mandiri, BRI, BNI), Kantor Pos Indonesia, Alfamart, Indomaret, Tokopedia, dan Loket Kas Resmi Aetra.
                        </p>
                      </div>
                    )}
                    {activeBookletPage === 11 && (
                      <div className="space-y-2">
                        <h5 className="font-bold text-slate-900">Penanganan Pengaduan &amp; Layanan 24 Jam</h5>
                        <p className="text-slate-600 leading-relaxed">
                          Hubungi Contact Center 24 Jam di (021) 598 5474 atau WhatsApp 0877 8822 4645 untuk bantuan operasional cepat.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Booklet Navigation Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={activeBookletPage <= 1}
                onClick={() => setActiveBookletPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[280px]">
                {Array.from({ length: 11 }, (_, i) => i + 1).map((pNum) => (
                  <button
                    key={pNum}
                    type="button"
                    onClick={() => setActiveBookletPage(pNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                      activeBookletPage === pNum
                        ? 'bg-[#005DAA] text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {pNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={activeBookletPage >= 11}
                onClick={() => setActiveBookletPage((p) => Math.min(11, p + 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#005DAA] hover:bg-[#004A88] disabled:opacity-40 rounded-xl text-xs font-bold text-white transition cursor-pointer"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
