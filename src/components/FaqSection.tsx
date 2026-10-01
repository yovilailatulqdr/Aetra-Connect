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

export const FaqSection: React.FC<FaqSectionProps> = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Halo! Saya Asisten Virtual Resmi PT Aetra Air Tangerang. Silakan tanyakan hal seputar Buku Panduan Pelanggan, tata cara pasang sambungan baru, batas pipa, kualitas air, atau simulasi tarif.',
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
    scrollToBottom();
  }, [messages, isTyping]);

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
    }, 380);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Sleek Minimal Header */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Asisten Pelanggan 24 Jam
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Pusat Bantuan &amp; Panduan Aetra
          </h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Tanyakan pertanyaan Anda langsung kepada Asisten Chatbot di bawah. Seluruh informasi disinkronkan dengan <strong>Buku Panduan Pelanggan Resmi PT Aetra Air Tangerang</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveBookletPage(1);
              setIsBookletModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-[#005DAA] border border-blue-200 text-xs font-bold transition cursor-pointer shadow-2xs"
          >
            <BookOpen className="w-4 h-4 text-[#005DAA]" />
            <span>Lihat Buku Panduan (11 Hal)</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#005DAA] hover:bg-[#004A88] text-white text-xs font-bold shadow-md shadow-blue-500/15 transition cursor-pointer"
            title="Cetak atau unduh dokumen panduan resmi"
          >
            <Download className="w-4 h-4" />
            <span>Unduh PDF</span>
          </button>
        </div>
      </div>

      {/* Main Focus: Pure User-Friendly Chatbot Interface */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden flex flex-col h-[600px]">
        {/* Chatbot Top Toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-linear-to-br from-[#005DAA] to-[#003868] text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">Asisten Virtual Aetra</span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">Aktif</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Data resmi Buku Panduan Pelanggan No. 00170092031118
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
            { label: 'Cek Kebocoran', q: 'Bagaimana cara melakukan pengecekan kebocoran pipa mandiri di rumah?' },
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
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {msg.faqRef.officialQuote && (
                        <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 italic">
                          &ldquo;{msg.faqRef.officialQuote}&rdquo;
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                        <span>PT Aetra Air Tangerang</span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveBookletPage(msg.faqRef!.pageRef);
                            setIsBookletModalOpen(true);
                          }}
                          className="text-[#005DAA] font-bold underline hover:text-blue-900 cursor-pointer"
                        >
                          Buka Halaman {msg.faqRef.pageRef} &rarr;
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggested Follow-up Prompts */}
                {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="pt-1 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block">Saran Pertanyaan Lanjutan:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedQuestions.map((sug, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendMessage(sug)}
                          className="text-left px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-[#005DAA] border border-blue-200 text-xs font-medium transition cursor-pointer shadow-2xs"
                        >
                          &bull; {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <span className="text-[10px] text-slate-400 block px-1">{msg.timestamp}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 max-w-md mr-auto animate-in fade-in">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-[#005DAA] to-[#003868] flex items-center justify-center shrink-0 text-white shadow-xs">
                <Bot className="w-4 h-4 text-cyan-200" />
              </div>
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#005DAA] animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-[#005DAA] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-[#005DAA] animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-xs text-slate-500 ml-1">Mencari jawaban di Buku Panduan...</span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ketik pertanyaan Anda (misal: syarat pasang baru, batas pipa, hitung tagihan)..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#005DAA] focus:outline-hidden transition"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || isTyping}
              className="px-5 py-3 bg-[#005DAA] hover:bg-[#004A88] text-white rounded-2xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shrink-0"
            >
              <span>Kirim</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION INFO CONTACT CENTER & LAYANAN PELANGGAN 24 JAM PT AETRA */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#005DAA] flex items-center justify-center shrink-0 border border-blue-100">
              <Headphones className="w-5 h-5 text-[#005DAA]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Contact Center &amp; Layanan Pelanggan 24 Jam
                </h2>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Siaga 24/7
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Saluran komunikasi resmi PT Aetra Air Tangerang untuk pengaduan gangguan, kebocoran pipa, dan informasi kepelangganan.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Quick Action Cards: Telepon, WhatsApp, & Email */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* 1. Contact Center 24 Jam */}
          <div className="bg-slate-50 hover:bg-blue-50/50 p-4 rounded-2xl border border-slate-200 transition flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-[#005DAA] text-white flex items-center justify-center">
                <PhoneCall className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Contact Center 24 Jam
              </span>
              <span className="font-mono text-base font-black text-slate-900 block">
                (021) 598 5474
              </span>
              <span className="font-mono text-xs font-semibold text-slate-600 block">
                (021) 598 5475 (Hunting)
              </span>
              <p className="text-[11px] text-slate-500">
                Layanan telepon siaga 24 jam setiap hari (termasuk hari libur).
              </p>
            </div>
            <a
              href="tel:0215985474"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-[#005DAA] hover:bg-[#004A88] text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Telepon Langsung</span>
            </a>
          </div>

          {/* 2. WhatsApp Customer Care */}
          <div className="bg-slate-50 hover:bg-emerald-50/50 p-4 rounded-2xl border border-slate-200 transition flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                WhatsApp Customer Care
              </span>
              <span className="font-mono text-base font-black text-slate-900 block">
                0877 8822 4645
              </span>
              <span className="font-mono text-xs font-semibold text-slate-600 block">
                0812 1822 4645 (Chat Only)
              </span>
              <p className="text-[11px] text-slate-500">
                Kirim foto/video kebocoran atau kendala meter air via WhatsApp.
              </p>
            </div>
            <a
              href="https://wa.me/6287788224645"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat WhatsApp</span>
            </a>
          </div>

          {/* 3. Email Resmi */}
          <div className="bg-slate-50 hover:bg-indigo-50/50 p-4 rounded-2xl border border-slate-200 transition flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Email Pelayanan Resmi
              </span>
              <span className="text-xs font-black text-slate-900 block break-all">
                customercare@aetratangerang.co.id
              </span>
              <span className="text-[11px] font-medium text-slate-500 block break-all">
                corporate.communication@aetratangerang.co.id
              </span>
              <p className="text-[11px] text-slate-500">
                Permohonan resmi, surat menyurat, dan korespondensi korporat.
              </p>
            </div>
            <a
              href="mailto:customercare@aetratangerang.co.id"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Kirim Email</span>
            </a>
          </div>
        </div>

        {/* Kantor Pusat & Kantor Cabang Wilayah */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Building2 className="w-4 h-4 text-[#005DAA]" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Alamat Kantor Pusat &amp; Kantor Cabang Pelayanan Aetra Tangerang
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Kantor Pusat */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#005DAA]"></span>
                <strong className="text-slate-900 font-bold">Kantor Pusat PT Aetra Air Tangerang:</strong>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed pl-3.5">
                Komplek Instalasi Pengolahan Air (IPA) Sepatan, Jl. Raya Kukun – Daon Km 2, Ds. Sukamantri, Kec. Pasar Kemis, Kab. Tangerang, Banten 15560.
              </p>
              <p className="text-slate-400 text-[10px] pl-3.5">
                Telp: (021) 598 5474 &bull; Fax: (021) 598 5475
              </p>
            </div>

            {/* Cabang Sepatan */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <strong className="text-slate-900 font-bold">Kantor Cabang Pelayanan Sepatan:</strong>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed pl-3.5">
                Jl. Raya Sepatan - Pakuhaji No. 8, Sepatan, Kab. Tangerang (Melayani Wilayah Sepatan, Sepatan Timur, Pakuhaji).
              </p>
            </div>

            {/* Cabang Pasar Kemis */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <strong className="text-slate-900 font-bold">Kantor Cabang Pasar Kemis:</strong>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed pl-3.5">
                Ruko Bumi Indah Blok RA No. 15, Pasar Kemis, Kab. Tangerang (Melayani Pasar Kemis, Sindang Jaya, Rajeg).
              </p>
            </div>

            {/* Cabang Balaraja & Cikupa */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <strong className="text-slate-900 font-bold">Kantor Cabang Balaraja &amp; Cikupa:</strong>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed pl-3.5">
                Jl. Raya Serang Km. 24, Balaraja, Kab. Tangerang (Melayani Balaraja, Cikupa, Sukamulya, Jayanti).
              </p>
            </div>
          </div>
        </div>

        {/* Warning Banner Resmi: Anti Pungli Petugas */}
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs text-amber-950">
            <span className="font-bold block uppercase tracking-wide">
              Peringatan Keamanan &amp; Integritas Pelayanan
            </span>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              Petugas PT Aetra Air Tangerang <strong>TIDAK DIIZINKAN</strong> menerima pembayaran tunai atau tip dalam bentuk apa pun di lokasi pelanggan. Laporkan segala bentuk pungutan liar atau oknum mencurigakan ke <strong>Contact Center 24 Jam (021) 598 5474</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL / VIEWER: BUKU PANDUAN RESMI (11 HALAMAN PERSIS DOKUMEN ASLI) */}
      {/* ========================================================================= */}
      {isBookletModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-[#005DAA]" />
                <div>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base">
                    Buku Panduan Pelanggan PT Aetra Air Tangerang
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Dokumen Resmi &bull; Sertifikasi ISO 9001:2015 &bull; Halal MUI No. 00170092031118
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / Unduh</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsBookletModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Page Selector Bar */}
            <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between gap-2 text-xs">
              <span className="font-bold text-[#005DAA]">
                Halaman {activeBookletPage} dari 11 &bull; {
                  activeBookletPage === 1 ? 'Cover Depan' :
                  activeBookletPage === 2 ? 'Sekilas Tentang PT Aetra Air Tangerang' :
                  activeBookletPage === 3 ? 'Tata Cara Berlangganan & Fasilitas' :
                  activeBookletPage === 4 ? 'Lokasi Kantor & Batas Pipa' :
                  activeBookletPage === 5 ? 'Informasi Meter Air & Pengecekan Kebocoran' :
                  activeBookletPage === 6 ? 'Standard Air Minum Permenkes No. 492/2010' :
                  activeBookletPage === 7 ? 'Harga Pemakaian Air & Cara Menghitung Tagihan' :
                  activeBookletPage === 8 ? 'Lokasi Pembayaran Tagihan Air' :
                  activeBookletPage === 9 ? 'Pemutusan & Larangan Pembayaran di Tempat' : 'Kontak Pusat PT Aetra'
                }
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveBookletPage((p) => Math.max(1, p - 1))}
                  disabled={activeBookletPage <= 1}
                  className="p-1 rounded-lg border bg-white hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveBookletPage((p) => Math.min(11, p + 1))}
                  disabled={activeBookletPage >= 11}
                  className="p-1 rounded-lg border bg-white hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: 100% Exact Text & Layout of the 11-page Booklet */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto text-xs leading-relaxed space-y-4">
              {/* PAGE 1 */}
              {activeBookletPage === 1 && (
                <div className="bg-gradient-to-b from-[#003868] via-[#005DAA] to-[#002f5a] text-white rounded-2xl p-10 text-center space-y-6 shadow-inner">
                  <div className="bg-white p-3 rounded-2xl inline-block shadow-lg">
                    <AetraLogo size="md" variant="horizontal" />
                  </div>
                  <div className="space-y-2 pt-4">
                    <h4 className="text-3xl font-serif italic text-cyan-200">Buku</h4>
                    <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">
                      PANDUAN PELANGGAN
                    </h2>
                  </div>
                  <div className="pt-8 border-t border-white/20 flex items-center justify-center gap-6 text-[11px] text-blue-200 flex-wrap">
                    <span>Certified ISO 9001:2015 No. 16 00 C 18046</span>
                    <span>KAN (Komite Akreditasi Nasional)</span>
                    <span>Halal MUI No. 00170092031118</span>
                  </div>
                </div>
              )}

              {/* PAGE 2 */}
              {activeBookletPage === 2 && (
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <span className="text-[#005DAA] font-bold text-xs">Sekilas Tentang</span>
                    <h3 className="text-lg font-black text-slate-900">PT AETRA AIR TANGERANG</h3>
                  </div>
                  <p className="text-slate-700">
                    Terima kasih karena telah bergabung dengan PT Aetra Air Tangerang. Kami adalah perusahaan air minum swasta yang bermitra dengan Pemerintah Kabupaten Tangerang dalam penyediaan dan pelayanan air minum di wilayah Kabupaten Tangerang. Proyek penyediaan dan pelayanan air minum ini merupakan proyek Kerjasama Pemerintah Swasta (KPS).
                  </p>
                  <p className="text-slate-700">
                    KPS yang dijalankan Aetra Tangerang bukanlah bentuk privatisasi pelayanan air minum. Aetra Tangerang tidak menguasai sumber daya yang ada, melainkan menyediakan layanan untuk mengolah sumber daya tersebut untuk kemudian disalurkan kembali kepada masyarakat yang membutuhkan. Seluruh asset yang dimiliki oleh Aetra Tangerang akan diserahkan kepada Pemerintah Kabupaten Tangerang setelah masa konsesi berakhir beserta segenap teknologi dan manajemen pelayanan.
                  </p>
                  <p className="text-slate-700">
                    Aetra Tangerang berkomitmen untuk memaksimalkan penyediaan dan pelayanan air minum bagi masyarakat di wilayah konsesi sebagaimana diamanahkan oleh Pemerintah Kabupaten Tangerang dalam Perjanjian Kerjasama agar dapat meningkatkan kualitas hidup masyarakat yang dilayani melalui penggunaan air yang lebih bersih dan sehat.
                  </p>
                </div>
              )}

              {/* PAGE 3 */}
              {activeBookletPage === 3 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-3 bg-blue-50/70 p-4 rounded-2xl border border-blue-200">
                      <h4 className="font-bold text-[#005DAA] text-sm">Tata Cara Berlangganan</h4>
                      <p className="font-semibold text-slate-800">3 Langkah mudah berlangganan Aetra Air Tangerang:</p>
                      <div className="space-y-2">
                        <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                          <strong>1. Isi Formulir &amp; Lengkapi Persyaratan:</strong> Fotocopy KTP, KK, PBB tahun terakhir atau Dokumen pendukung.
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                          <strong>2. Survei:</strong> Petugas AAT akan melakukan survei ke rumah calon pelanggan untuk menentukan golongan tarif &amp; memberikan tanda bukti telah disurvei.
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                          <strong>3. Bayar &amp; Pasang:</strong> Petugas AAT akan melakukan pemasangan meter setelah pelanggan membayar biaya sambungan baru.
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <h4 className="font-bold text-slate-900 text-sm">Fasilitas Pelayanan Pelanggan</h4>
                      <p className="text-slate-600 text-[11px]">
                        Untuk memberikan kemudahan dan kenyamanan bagi pelanggan, PT Aetra Air Tangerang telah menyiapkan berbagai fasilitas:
                      </p>
                      <ul className="space-y-1.5 text-slate-700">
                        <li>&bull; <strong>Contact Center 24 Jam:</strong> Siaga setiap saat melayani informasi dan keluhan.</li>
                        <li>&bull; <strong>Unit Reaksi Cepat:</strong> Penanganan keluhan pelanggan serta pemeliharaan dan perbaikan jaringan pipa distribusi maupun sambungan pelanggan.</li>
                        <li>&bull; <strong>Layanan Pembayaran:</strong> Kantor Pelayanan, ATM &amp; Mobile Banking BCA &amp; Mandiri, Kantor Pos, Alfamart, Indomaret.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 4 */}
              {activeBookletPage === 4 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <h4 className="font-bold text-slate-900 text-sm">Lokasi Kantor Pelayanan Pelanggan</h4>
                      <div className="space-y-2 text-[11px]">
                        <div className="p-2 bg-white rounded-lg border">
                          <strong>Kantor Pelayanan Pelanggan 1:</strong><br />
                          RUKO Perumahan PURI JAYA Blok AA No. 30, Sukamantri – Pasar Kemis Kab. Tangerang 15560
                        </div>
                        <div className="p-2 bg-white rounded-lg border">
                          <strong>Kantor Pelayanan Pelanggan 2:</strong><br />
                          Jl. Raya Curug No. 27 Kab. Tangerang 15810
                        </div>
                        <div className="p-2 bg-white rounded-lg border">
                          <strong>Kantor Perwakilan Jayanti:</strong><br />
                          Komplek Taman Mutiara Blok A No.15, Jl. Raya Serang Km.33 Kel. Sumur Bandung, Kec. Jayanti
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 bg-blue-50/80 p-4 rounded-2xl border border-blue-200">
                      <h4 className="font-bold text-[#005DAA] text-sm">Sambungan Pipa dan Meter di Pelanggan</h4>
                      <div className="space-y-2">
                        <div className="p-3 bg-blue-100 rounded-xl text-blue-950 font-medium">
                          <strong>Tanggung Jawab Aetra Tangerang:</strong><br />
                          Sambungan dari pipa Aetra Tangerang s/d Kran Meteran Air dan Penutup Meteran.
                        </div>
                        <div className="p-3 bg-emerald-100 rounded-xl text-emerald-950 font-medium">
                          <strong>Tanggung Jawab Pelanggan:</strong><br />
                          Sambungan ke Pipa Pelanggan setelah meteran air ke dalam rumah.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 5 */}
              {activeBookletPage === 5 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2.5 bg-red-50 p-4 rounded-2xl border border-red-200 text-red-950">
                      <h4 className="font-bold text-red-700 text-sm">Informasi Meter Air di Pelanggan</h4>
                      <p className="text-[11px]">1. Pelanggan harus memastikan agar meter air dapat terjangkau dan terbaca jelas oleh Petugas Pencatat Meter.</p>
                      <p className="font-bold text-[11px]">2. Pelanggan dilarang:</p>
                      <ul className="text-[11px] list-disc pl-4 space-y-0.5">
                        <li>Melepas, merusak dan menyebabkan hilangnya segel meter air;</li>
                        <li>Membalik arah dan menimbun meter air;</li>
                        <li>Mengubah ukuran dan letak pipa air / memindahkan meter air;</li>
                        <li>Menyadap air langsung dari pipa tanpa melalui meter air;</li>
                        <li>Menggunakan pompa air listrik untuk menyedot air melalui meter air;</li>
                        <li>Menjual air kepada pihak lain;</li>
                        <li>Memasukkan zat apapun yang dapat mencemari kualitas air.</li>
                      </ul>
                      <p className="text-[10px] font-bold text-red-700">3. Sanksi: Denda sesuai ketentuan dan/atau pemutusan sambungan.</p>
                    </div>

                    <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <h4 className="font-bold text-slate-900 text-sm">Pengecekan Kebocoran Mandiri</h4>
                      <ol className="list-decimal pl-4 space-y-1.5 text-slate-700">
                        <li>Tutup semua kran dalam rumah Anda.</li>
                        <li>Buka semua kran pada meter air.</li>
                        <li>Lihat posisi angka di meter air, tunggu 1 menit. Jika angka bergerak maka instalasi pipa di rumah Anda ada kebocoran.</li>
                      </ol>
                      <div className="p-3 bg-amber-100 rounded-xl text-amber-950 font-bold text-[11px]">
                        JIKA TERJADI KEBOCORAN PADA INSTALASI PIPA DI RUMAH ANDA, DAN TELAH TERCATAT PADA METER AIR, MENJADI TANGGUNG JAWAB PELANGGAN DAN HARUS DIBAYARKAN SESUAI TAGIHAN AIR ANDA.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 6 */}
              {activeBookletPage === 6 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm border-b pb-2">Standard Air Minum Sesuai PERMENKES No. 492/2010</h4>
                  <p className="text-slate-700 leading-relaxed">
                    Untuk membunuh bakteri penyebab penyakit di dalam air kita memerlukan Chlorine. Bau Kaporit dalam Air Aetra berasal dari gas Chlorine yang berfungsi membunuh kuman. PERMENKES mensyaratkan harus masih ada sisa gas Chlorine dalam air di sambungan pelanggan untuk memastikan air bebas dari kuman.
                  </p>
                  <p className="text-slate-700">
                    Karena Chlorine berbentuk gas, untuk menghilangkan baunya cukup diamkan air di wadah terbuka selama ±10 hingga 30 menit sebelum digunakan, gas Chlorine akan menguap.
                  </p>
                  <div className="bg-slate-50 p-3 rounded-xl border">
                    <strong className="block text-slate-900 mb-1">Standar Permenkes No. 492/2010:</strong>
                    <p className="text-[11px] text-slate-600">
                      E. Coli = 0 &bull; Koliform = 0 &bull; pH = 6.5 - 8.5 &bull; Kekeruhan maks 5 NTU &bull; Besi maks 0.3 mg/l &bull; Sisa Chlorine 0.2 - 5.0 mg/l
                    </p>
                  </div>
                </div>
              )}

              {/* PAGE 7 */}
              {activeBookletPage === 7 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm border-b pb-2">Harga Pemakaian Air Berdasarkan Blok Konsumsi &amp; Simulasi</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl border">
                      <strong className="block text-slate-900 mb-1">Tabel Tarif Air:</strong>
                      <p className="text-[11px] text-slate-700 font-mono">
                        R1: Rp 2.170/m³ (semua blok) &bull; Abn: Rp 9.466<br />
                        R2: 0-10m³ (Rp 4.840), 11-20m³ (Rp 5.716), &gt;20m³ (Rp 6.881)<br />
                        R3: 0-10m³ (Rp 7.928), 11-20m³ (Rp 9.515), &gt;20m³ (Rp 11.128)<br />
                        R4: 0-10m³ (Rp 11.112), 11-20m³ (Rp 12.833), &gt;20m³ (Rp 14.371)
                      </p>
                    </div>

                    <div className="bg-orange-50 p-3 rounded-xl border border-orange-200 text-orange-950 space-y-1.5">
                      <strong className="block">Simulasi Tagihan (15.000 Liter / 15 m³):</strong>
                      <p className="text-[11px]">
                        <strong>R2:</strong> (10 x 4.840) + (5 x 5.716) + 9.466 = <strong>Rp 86.446,-</strong> (cuma Rp 5,8 per liter!)
                      </p>
                      <p className="text-[11px]">
                        <strong>R3:</strong> (10 x 7.928) + (5 x 9.515) + 9.466 = <strong>Rp 136.321,-</strong> (cuma Rp 9,0 per liter!)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 8 */}
              {activeBookletPage === 8 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm border-b pb-2">Lokasi &amp; Ketentuan Pembayaran Tagihan Air</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                    <div className="p-2.5 bg-slate-50 rounded-lg border"><strong>Bank Mandiri</strong><br />ATM, Mobile, Internet</div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border"><strong>Bank BCA</strong><br />ATM, KlikBCA, m-BCA</div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border"><strong>Kantor Pos</strong><br />Loket Tunai</div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border"><strong>Indomaret &amp; Alfamart</strong><br />Kasir Gerai</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-[11px] text-slate-700 space-y-1">
                    <p>1. Bayar tagihan sebelum tanggal <strong>JATUH TEMPO</strong> untuk menghindari denda dan pemutusan.</p>
                    <p>2. Jika jatuh tempo di hari libur, bayar 1 hari kerja sebelumnya.</p>
                    <p>3. Simpan resi pembayaran sebagai tanda bukti sah.</p>
                  </div>
                </div>
              )}

              {/* PAGE 9 */}
              {activeBookletPage === 9 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm border-b pb-2">Pemutusan dan Penyambungan Meter Air</h4>
                  <p className="text-slate-700 text-[11px]">
                    1. Pembayaran tagihan sesudah jatuh tempo dikenakan denda per bulan keterlambatan.<br />
                    2. Aliran air diputus sementara jika belum dibayar sampai tanggal jatuh tempo.<br />
                    3. Pemutusan PERMANEN dilakukan jika tagihan tidak dibayar dalam 60 hari kerja.<br />
                    4. Penyambungan kembali permanen memerlukan pelunasan tunggakan, denda, dan biaya sambungan baru.
                  </p>
                  <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-4 text-red-950 text-center space-y-1">
                    <strong className="block text-red-700 uppercase tracking-wide">
                      PERINGATAN ANTI PUNGLI
                    </strong>
                    <p className="font-bold text-xs">
                      SELURUH PETUGAS AETRA TANGERANG TIDAK DIPERBOLEHKAN MENERIMA PEMBAYARAN SECARA LANGSUNG DI RUMAH / PROPERTI PELANGGAN.
                    </p>
                    <p className="text-[11px] text-red-800">
                      Jika menemui petugas yang meminta uang di tempat, segera laporkan ke Contact Center 24 Jam: <strong>(021) 598 5474</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* PAGE 11 */}
              {activeBookletPage >= 10 && (
                <div className="bg-gradient-to-b from-[#005DAA] to-[#002f5a] text-white rounded-2xl p-8 text-center space-y-4 shadow-inner">
                  <div className="bg-white p-3 rounded-xl inline-block">
                    <AetraLogo size="sm" variant="horizontal" />
                  </div>
                  <h3 className="text-xl font-black">PT AETRA AIR TANGERANG</h3>
                  <p className="text-xs text-blue-100">
                    Jalan Raya STPI Curug No. 27, Kabupaten Tangerang 15810
                  </p>
                  <p className="text-xs text-cyan-200 font-mono">
                    Telp: (021) 598 5477 &bull; Fax: (021) 598 5479 &bull; Website: www.aat.co.id
                  </p>
                  <div className="pt-4 border-t border-white/20 text-xs text-amber-300">
                    Contact Center 24 Jam: <strong>(021) 598 5474</strong> &bull; WA: <strong>0877 8822 4645</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
