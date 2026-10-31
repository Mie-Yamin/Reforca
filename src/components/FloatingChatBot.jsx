import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

export default function FloatingChatBot({ reports = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Halo! Saya Asisten Virtual Reforca 🌊. Tanyakan apa saja tentang laporan sampah pesisir, lokasi kotor, atau cara pelaporan.'
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const defaultReports = [
    {
      locationName: 'Pantai Marunda (Ujung Pesisir Cilincing, Jakarta Utara)',
      status: 'Pending',
      severity: 'Darurat',
      votesCount: 389
    },
    {
      locationName: 'Muara Kamal (Penjaringan, Jakarta Utara)',
      status: 'Sedang Dikerjakan',
      severity: 'Tinggi',
      votesCount: 215
    },
    {
      locationName: 'Pantai Indah Dadap (Tangerang)',
      status: 'Selesai Dibersihkan',
      severity: 'Sedang',
      votesCount: 142
    }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setInputValue('');

    setTimeout(() => {
      let botReply = "Terima kasih atas pertanyaannya! Anda bisa menjelajahi peta interaktif atau menu Laporan Warga untuk melihat data lengkapnya.";

      const lower = userText.toLowerCase();
      const activeReports = reports && reports.length > 0 ? reports : defaultReports;

      // 1. Jika bertanya PENYEBAB / ALASAN (kenapa/mengapa)
      if (lower.includes('kenapa') || lower.includes('mengapa') || lower.includes('sebab') || lower.includes('alasan')) {
        botReply = "Penyebab utama pencemaran dan sampah di pesisir pantai meliputi:\n\n" +
          "1. Buangan Sampah Domestik: Sampah plastik rumah tangga yang terbawa arus sungai menuju laut.\n" +
          "2. Aktivitas Pesisir & Nelayan: Sisa jaring, styrofoam, dan pembuangan limbah secara langsung.\n" +
          "3. Arus Laut & Musim Angin: Arus pasang surut yang membawa kiriman sampah dari perairan lain ke bibir pantai.";
      }
      // 2. Jika bertanya LOKASI / DAFTAR PANTAI (mana/lokasi/daftar)
      else if (lower.includes('mana') || lower.includes('lokasi') || lower.includes('daftar') || lower.includes('titik')) {
        const topReports = activeReports.slice(0, 3);
        const reportListText = topReports
          .map((r, idx) => `${idx + 1}. ${r.locationName}\n   Status: ${r.status || 'Pending'} | Urgensi: ${r.severity || 'Normal'} | Dukungan: ${r.votesCount || 0} suara`)
          .join('\n\n');

        botReply = `Berikut titik laporan sampah pesisir aktif di sistem:\n\n${reportListText}\n\nDetail selengkapnya dapat dilihat pada Peta Interaktif di beranda.`;
      }
      // 3. Jika hanya menyebut kata pantai / kotor tanpa kata tanya khusus
      else if (lower.includes('kotor') || lower.includes('pantai') || lower.includes('sampah')) {
        botReply = "Apakah Anda ingin mengetahui lokasi pantai yang kotor atau ingin melaporkan timbulan sampah pesisir baru?";
      }
      // 4. Cara melapor
      else if (lower.includes('lapor') || lower.includes('cara') || lower.includes('buat')) {
        botReply = "Untuk melaporkan sampah pesisir, pastikan Anda sudah masuk (login) sebagai warga, lalu klik tombol 'Buat Laporan' di menu navigasi atas dan unggah foto kondisi lokasinya!";
      }
      // 5. Admin & Kedinasan
      else if (lower.includes('admin') || lower.includes('darurat') || lower.includes('dinas')) {
        botReply = "Laporan dengan tingkat urgensi tinggi akan otomatis masuk ke algoritma AI Priority Matrix untuk segera diproses oleh Dinas Lingkungan Hidup.";
      }
      // 6. Sapaan
      else if (lower.includes('halo') || lower.includes('hai')) {
        botReply = "Halo juga! Ada yang ingin Anda tanyakan atau laporkan mengenai kebersihan pesisir hari ini?";
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[450]">
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-slate-900 border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-950/50 flex flex-col overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider">Asisten Virtual Reforca</h3>
                <span className="text-[10px] text-cyan-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Terhubung ke Database Live
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-4 h-72 overflow-y-auto space-y-3 bg-slate-950/70 text-xs">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-cyan-950 text-cyan-400 border border-cyan-500/30'
                  }`}>
                  {msg.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
                </div>
                {/* Tambahkan whitespace-pre-line agar baris baru (\n) terbaca dengan rapi */}
                <div className={`p-3 rounded-2xl max-w-[75%] leading-relaxed whitespace-pre-line ${msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tanya soal pantai kotor, laporan, dll..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-md"
              aria-label="Kirim pesan"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative p-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-xl shadow-cyan-500/30 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
        style={{
          animation: 'antigravityFloat 3.5s ease-in-out infinite'
        }}
        title="Buka Chatbot Asisten Reforca"
        aria-label="Buka Chatbot Asisten Reforca"
      >
        <MessageSquare size={24} />
        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse"></span>
      </button>

      <style>{`
        @keyframes antigravityFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }
      `}</style>
    </div>
  );
}