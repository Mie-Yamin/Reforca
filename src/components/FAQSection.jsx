import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Shield, BrainCircuit, Clock, Building2, Sparkles } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Bagaimana cara AI membantu memproses laporan saya?',
      a: 'Ketika Anda mengunggah foto tumpukan sampah di pantai, model Computer Vision Reforca secara otomatis mengidentifikasi komposisi polutan (seperti mikroplastik, jaring hantu, atau limbah berbahaya), memperkirakan luas volume cemaran dalam meter persegi, dan mengkalkulasi skor kedaruratan untuk menentukan skala prioritas tindakan lapangan.',
      icon: BrainCircuit
    },
    {
      q: 'Apakah identitas pelapor dapat dirahasiakan?',
      a: 'Ya. Anda dapat memilih opsi pelaporan anonim pada formulir kirim laporan. Reforca menjamin kerahasiaan data pribadi masyarakat sesuai prinsip perlindungan pelapor (whistleblower protection), sehingga hanya data koordinat dan kondisi fisik sampah yang ditampilkan kepada publik.',
      icon: Shield
    },
    {
      q: 'Berapa lama laporan ditindaklanjuti oleh instansi terkait?',
      a: 'Laporan berkategori Darurat akan segera masuk ke antrean prioritas Ruang Komando Instansi dalam waktu kurang dari 2 jam. Rata-rata pengerahan tim lapangan dan logistik pembersihan terlaksana antara 24 hingga 72 jam tergantung cuaca pasang surut dan medan pesisir.',
      icon: Clock
    },
    {
      q: 'Bagaimana cara instansi atau komunitas pemuda terhubung ke Reforca?',
      a: 'Dinas Lingkungan Hidup kabupaten/kota, pengelola pelabuhan, serta organisasi komunitas pemuda pesisir dapat mendaftarkan akun resmi melalui Ruang Komando Instansi untuk mendapatkan akses verifikasi tugas dan validasi anggaran.',
      icon: Building2
    },
    {
      q: 'Apakah ada biaya bagi warga untuk melaporkan sampah di pantai?',
      a: 'Sama sekali tidak dipungut biaya (100% gratis). Reforca dibangun sebagai platform pelayanan publik dan advokasi lingkungan bahari untuk mendorong partisipasi aktif masyarakat dalam melindungi ekosistem laut Indonesia.',
      icon: Sparkles
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section 
      id="faq" 
      className="relative py-20 lg:py-28 bg-[#F8FAFC] border-b border-[#E2E8F0] overflow-hidden"
    >
      {/* Subtle Coastal Water Texture (Low-opacity 4% blended with #F8FAFC) */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage: `url('/images/underwater_sunrays.jpg')`,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3" data-aos="fade-up">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#1D4ED8] text-xs font-bold uppercase tracking-wider">
            <HelpCircle size={13} />
            <span>Informasi & Bantuan</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Pertanyaan Umum (FAQ)
          </h2>

          <p className="text-[#64748B] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Ketahui lebih lanjut mengenai mekanisme pemrosesan AI, perlindungan identitas pelapor, serta akuntabilitas penanganan di lapangan.
          </p>
        </div>

        {/* Clean White Accordion Cards: Clean White Elements (#FFFFFF) with shadow-sm */}
        <div className="space-y-3.5" data-aos="fade-up" data-aos-delay="100">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const Icon = faq.icon;
            return (
              <div
                key={index}
                className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-xl transition-colors ${
                      isOpen ? 'bg-[#EFF6FF] text-[#1D4ED8]' : 'bg-[#F8FAFC] text-[#64748B]'
                    }`}>
                      <Icon size={18} />
                    </div>
                    <span className="font-bold text-sm sm:text-base text-[#0F172A]">
                      {faq.q}
                    </span>
                  </div>

                  <div className={`p-1.5 rounded-full bg-[#F8FAFC] text-[#64748B] transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-[#1D4ED8] bg-[#EFF6FF]' : ''
                  }`}>
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-[#475569] leading-relaxed border-t border-[#F1F5F9] pl-14 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
