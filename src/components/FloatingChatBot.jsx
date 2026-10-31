import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  ChevronDown
} from 'lucide-react';

const INITIAL_MESSAGES = [
  {
    id: 'init-1',
    sender: 'bot',
    text: 'Halo Sahabat Bahari! 👋 Saya Asisten Virtual Reforca. Ada yang bisa saya bantu terkait pelaporan timbulan sampah pesisir, pemindaian AI Vision, atau transparansi anggaran restorasi pantai?',
    timestamp: 'Baru saja'
  }
];

const SUGGESTED_QUESTIONS = [
  'Cara buat laporan sampah pantai',
  'Bagaimana AI Vision mendeteksi sampah?',
  'Apa itu AI Priority Matrix & Darurat?',
  'Cara pantau transparansi anggaran APBD',
  'Akses Ruang Komando DLH (/admin)'
];

export default function FloatingChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages, isTyping]);

  // Logika simulasi jawaban otomatis asisten Reforca
  const generateBotReply = (userQuery) => {
    const q = userQuery.toLowerCase();

    if (q.includes('cara') || q.includes('buat') || q.includes('lapor') || q.includes('kirim')) {
      return (
        '📌 **Cara Membuat Laporan di Reforca:**\n\n' +
        '1. Klik tombol **"+ Buat Laporan"** pada menu navigasi atas.\n' +
        '2. Unggah foto sampah pesisir yang Anda temukan di pantai.\n' +
        '3. Sistem AI Vision Groq LLaMA 3.2 akan otomatis mengidentifikasi estimasi volume m², kategori limbah, dan tingkat keparahan.\n' +
        '4. Tentukan titik lokasi di peta interaktif dan kirim laporan Anda.\n\n' +
        'Laporan langsung diterbitkan ke Cloud Firestore untuk ditindaklanjuti warga dan Dinas Lingkungan Hidup!'
      );
    }

    if (q.includes('ai') || q.includes('vision') || q.includes('llama') || q.includes('scan') || q.includes('kamera')) {
      return (
        '🤖 **Teknologi AI Vision Reforca:**\n\n' +
        'Reforca ditenagai model **Groq LLaMA 3.2 11B Vision** berkecepatan tinggi. AI ini secara otomatis menganalisis citra pantai untuk:\n\n' +
        '• Mengestimasi luas sebaran sampah ($m^2$)\n' +
        '• Mengklasifikasikan jenis limbah (mikro/makro plastik, jaring hantu, styrofoam, kayu gelondongan)\n' +
        '• Menentukan tingkat urgensi: *Darurat, Tinggi, Sedang, atau Rendah* secara objektif dan instan.'
      );
    }

    if (q.includes('darurat') || q.includes('urgensi') || q.includes('matrix') || q.includes('prioritas') || q.includes('upvote')) {
      return (
        '🚨 **Status Darurat & AI Priority Matrix:**\n\n' +
        'Untuk mencegah penanganan yang bias, Reforca menggunakan algoritma bobot intervensi:\n\n' +
        'Formula: `(Keparahan AI × Bobot) + (Dukungan Upvote × 1.5) + (Volume m² × 0.2)`\n\n' +
        'Laporan bertanda **"Darurat"** dengan dukungan upvote terbanyak dari warga sekitar akan ditempatkan di puncak antrean penugasan Satgas Dinas Lingkungan Hidup.'
      );
    }

    if (q.includes('anggaran') || q.includes('apbd') || q.includes('biaya') || q.includes('dana') || q.includes('transparansi') || q.includes('uang')) {
      return (
        '💰 **Transparansi Anggaran Publik Reforca:**\n\n' +
        'Melalui fitur **Hub Transparansi**, masyarakat dapat mengaudit aliran dana restorasi pesisir secara gamblang:\n\n' +
        '• Total alokasi APBD/CSR per titik pantai\n' +
        '• Rincian pengeluaran (*cost breakdown* operasional armada & kantong limbah)\n' +
        '• Mitra vendor resmi yang ditugaskan\n' +
        '• Bukti dokumentasi sebelum (*Before*) dan sesudah (*After*) pembersihan.'
      );
    }

    if (q.includes('admin') || q.includes('ruang komando') || q.includes('dlh') || q.includes('kedinasan') || q.includes('login')) {
      return (
        '🏛️ **Ruang Komando Instansi (`/admin`):**\n\n' +
        'Portal internal khusus petugas Dinas Lingkungan Hidup untuk verifikasi laporan, penugasan vendor kapal/relawan, dan input biaya APBD.\n\n' +
        'Akses diproteksi dengan verifikasi whitelist email resmi (default: `admin@reforca.id`). Anda dapat mengaksesnya lewat tautan di footer atau URL `/admin`.'
      );
    }

    if (q.includes('halo') || q.includes('hai') || q.includes('selamat') || q.includes('pagi') || q.includes('siang') || q.includes('malam') || q.includes('assalam')) {
      return 'Halo! Senang bisa menyapa Anda. Silakan tanyakan apa saja terkait penanganan sampah pantai, peta pesisir, atau alur pelaporan di Reforca. Ada yang bisa saya bantu hari ini? 🌊';
    }

    if (q.includes('terima kasih') || q.includes('makasih') || q.includes('thanks')) {
      return 'Sama-sama! Terima kasih telah peduli pada kelestarian ekosistem laut dan pesisir Indonesia bersama Reforca. Salam lestari! 🌊🐬';
    }

    // Default Fallback Response
    return (
      'Pertanyaan Anda telah kami catat. Anda dapat menanyakan topik-topik berikut:\n\n' +
      '• **Cara membuat laporan** timbulan sampah pantai\n' +
      '• **Cara kerja AI Vision** LLaMA 3.2 pemindai limbah\n' +
      '• **Tingkat urgensi darurat** & sistem upvote warga\n' +
      '• **Hub Transparansi Anggaran** APBD & vendor\n' +
      '• **Portal Ruang Komando** Dinas Lingkungan Hidup\n\n' +
      'Ketik salah satu kata kunci di atas atau klik opsi saran cepat di bawah!'
    );
  };

  const handleSendMessage = (textToSend = null) => {
    const text = typeof textToSend === 'string' ? textToSend : inputValue;
    if (!text || !text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulasi delay respons berpikir AI
    setTimeout(() => {
      const replyText = generateBotReply(text);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setIsTyping(false);
  };

  return (
    <>
      {/* 1. JENDELA CHAT (CHAT WINDOW POPUP) */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 z-[450] w-[calc(100vw-2rem)] sm:w-[390px] md:w-[410px] h-[540px] max-h-[82vh] bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-2xl shadow-cyan-950/40 flex flex-col overflow-hidden animate-fade-in"
          style={{ transformOrigin: 'bottom right' }}
          role="dialog"
          aria-label="Jendela Chatbot Reforca"
        >
          {/* Glowing Top Line Accent */}
          <div className="h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 shrink-0"></div>

          {/* Header Chatbot */}
          <div className="px-4 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-0.5 shadow-md flex items-center justify-center text-white">
                  <Bot size={20} />
                </div>
                {/* Breathing Online Dot */}
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-slate-900"></span>
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white leading-tight">
                    Asisten Virtual Reforca
                  </h3>
                  <Sparkles size={13} className="text-cyan-400" />
                </div>
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 leading-tight mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Online &bull; AI Konsultan Pesisir
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
                title="Mulai ulang percakapan"
                aria-label="Mulai ulang percakapan"
              >
                <RotateCcw size={15} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
                title="Tutup jendela chat"
                aria-label="Tutup jendela chat"
              >
                <ChevronDown size={18} />
              </button>
            </div>
          </div>

          {/* Body Histori Percakapan */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot size={13} />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 shadow-sm whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-tr-xs'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-xs'
                  }`}
                >
                  <p className="text-xs">{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <User size={13} />
                  </div>
                )}
              </div>
            ))}

            {/* Indikator Animasi AI Sedang Mengetik */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center shrink-0">
                  <Bot size={13} />
                </div>
                <div className="bg-slate-800 border border-slate-700 px-3.5 py-2.5 rounded-2xl rounded-tl-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            {/* Quick Chips / Rekomendasi Pertanyaan (Muncul jika hanya ada pesan pembuka) */}
            {messages.length === 1 && (
              <div className="pt-2">
                <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1">
                  <Sparkles size={12} className="text-cyan-400" />
                  <span>Topik Cepat yang Sering Ditanyakan:</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(q)}
                      className="px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-cyan-500/15 hover:border-cyan-500/40 border border-slate-700 text-cyan-300 text-[11px] font-medium transition-all text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Form Input Chat */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ketik pertanyaan sampah pantai..."
              className="flex-1 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-md shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
              title="Kirim pesan"
              aria-label="Kirim pesan"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {/* 2. TOMBOL PEMICU MELAYANG (ANTIGRAVITY FLOATING BUTTON) */}
      <div className="fixed bottom-6 right-6 z-[450] animate-antigravity">
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setHasUnread(false);
            }
          }}
          className={`relative p-3.5 sm:p-4 rounded-full text-white font-bold transition-all transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-cyan-400/40 ${
            isOpen
              ? 'bg-slate-800 border-2 border-slate-600 shadow-xl text-slate-300 hover:text-white'
              : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 shadow-2xl animate-aura-glow'
          }`}
          title={isOpen ? 'Tutup Asisten Virtual' : 'Tanya Asisten AI Reforca'}
          aria-label={isOpen ? 'Tutup Asisten Virtual' : 'Buka Asisten AI Reforca'}
        >
          {isOpen ? (
            <X size={22} className="stroke-[2.5]" />
          ) : (
            <MessageSquare size={22} className="stroke-[2.5]" />
          )}

          {/* Breathing Online Dot (Hijau Pulse) */}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#0F172A]"></span>
            </span>
          )}

          {/* Badge Unread Notification Teaser */}
          {!isOpen && hasUnread && (
            <span className="hidden md:flex absolute -left-36 top-1/2 -translate-y-1/2 bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-[11px] font-bold px-3 py-1 rounded-full shadow-lg pointer-events-none whitespace-nowrap items-center gap-1.5 animate-pulse">
              <Sparkles size={12} className="text-cyan-400" />
              <span>Tanya AI Reforca</span>
            </span>
          )}
        </button>
      </div>
    </>
  );
}
