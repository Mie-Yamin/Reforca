import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  PlusCircle, 
  ArrowRight,
  ShieldCheck 
} from 'lucide-react';

export default function ContactSection({ onOpenReportModal }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    category: 'Kemitraan Instansi Pemerintah',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        organization: '',
        category: 'Kemitraan Instansi Pemerintah',
        message: ''
      });
      setTimeout(() => setSubmitted(false), 5000);
    }, 600);
  };

  return (
    <section id="kontak" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3" data-aos="fade-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#1D4ED8] text-xs font-bold uppercase tracking-wider">
            <Mail size={13} />
            <span>Kemitraan & Masukan Publik</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Kolaborasi Untuk Pesisir Nusantara
          </h2>

          <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
            Apakah Anda perwakilan Dinas Lingkungan Hidup, komunitas maritim, pegiat konservasi, atau peneliti? Sampaikan kebutuhan kerja sama dan integrasi pemantauan bersama Reforca.
          </p>
        </div>

        {/* Form Kontak Cepat & Info Kontak */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto" data-aos="fade-up">
          
          {/* Card Info Kontak Kiri */}
          <div className="lg:col-span-5 rounded-2xl p-6 sm:p-8 bg-[#F8FAFC] border border-[#E2E8F0] space-y-6">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-[#1D4ED8] uppercase tracking-wider">
                Sekretariat Nasional
              </span>
              <h3 className="text-xl font-bold text-[#0F172A]">
                Pusat Komando & Partisipasi Reforca
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Kami siap membantu instansi daerah mengintegrasikan data laporan bahari dan pendampingan lapangan.
              </p>
            </div>

            <div className="space-y-3.5 pt-2 border-t border-[#E2E8F0] text-xs sm:text-sm text-[#334155]">
              <div className="flex items-start gap-3">
                <MapPin size={17} className="text-[#1D4ED8] shrink-0 mt-0.5" />
                <span>Gedung Bahari Maritim Indonesia, Jl. Pasir Putih No. 12, Jakarta Utara 14430</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={17} className="text-[#1D4ED8] shrink-0" />
                <span>kemitraan@reforca.id</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={17} className="text-[#1D4ED8] shrink-0" />
                <span>+62 (021) 8890-4421 / Layanan Siaga</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1D4ED8]">
                <ShieldCheck size={16} />
                <span>Keamanan & Validasi Data</span>
              </div>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Data spasial dan foto laporan yang dikirimkan melalui platform diarsipkan dalam basis data terenkripsi untuk audit lingkungan dan transparansi anggaran daerah.
              </p>
            </div>
          </div>

          {/* Form Input Kanan */}
          <div className="lg:col-span-7 rounded-2xl p-6 sm:p-8 bg-white border border-[#E2E8F0] shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-3 animate-fade-in">
                <div className="w-14 h-14 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center mx-auto border border-[#BBF7D0]">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A]">
                  Pesan Berhasil Dikirimkan!
                </h3>
                <p className="text-sm text-[#64748B] max-w-sm mx-auto">
                  Terima kasih telah menghubungi Reforca. Tim sekretariat kami akan merespons melalui email dalam 1x24 jam kerja.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#334155]">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Budi Pratama"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs sm:text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1D4ED8] focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#334155]">
                      Alamat Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nama@instansi.go.id"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs sm:text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1D4ED8] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#334155]">
                      Instansi / Organisasi
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="Dinas LH / Komunitas / Kampus"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs sm:text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1D4ED8] focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#334155]">
                      Kategori Masukan
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#1D4ED8] focus:bg-white transition-colors"
                    >
                      <option value="Kemitraan Instansi Pemerintah">Kemitraan Instansi Pemerintah</option>
                      <option value="Komunitas Relawan Pesisir">Komunitas Relawan Pesisir</option>
                      <option value="Integrasi Data API & Riset">Integrasi Data API & Riset</option>
                      <option value="Masukan Publik">Masukan Publik</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#334155]">
                    Pesan / Masukan Anda *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tuliskan pesan masukan publik, usulan kemitraan wilayah pesisir, atau pertanyaan Anda di sini..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs sm:text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1D4ED8] focus:bg-white transition-colors resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  <Send size={15} />
                  <span>{loading ? 'Mengirim Pesan...' : 'Kirim Pesan Sekarang'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Banner CTA Penutup Berwarna Primary Ocean Blue Matte (#1D4ED8) */}
        <div 
          className="rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden bg-[#1D4ED8] text-white shadow-xl"
          data-aos="fade-up"
        >
          <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/15 text-white border border-white/25 uppercase tracking-wider">
              Aksi Nyata Pelestarian Bahari
            </span>

            {/* Headline Banner Penutup Sesuai Instruksi */}
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Mulai Berkontribusi untuk Laut Indonesia Today
            </h3>

            <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
              Jadikan setiap kunjungan pantai sebagai langkah proteksi ekosistem. Laporkan timbunan sampah pesisir dan kawal bersama hingga bersih tuntas.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenReportModal}
                className="px-8 py-4 rounded-full bg-white hover:bg-slate-50 text-[#1D4ED8] font-extrabold text-sm sm:text-base shadow-lg inline-flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <PlusCircle size={18} />
                <span>Laporkan Masalah Sekarang</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
