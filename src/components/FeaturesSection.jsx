import React, { useState } from 'react';
import { 
  MapPin, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  Camera, 
  Building2, 
  UserCheck,
  ArrowRight
} from 'lucide-react';

export default function FeaturesSection() {
  const [activeStep, setActiveStep] = useState(0);

  const features = [
    {
      id: 'gps-photo',
      title: 'Pelaporan GPS & Foto Bukti',
      tag: 'Geolokasi Presisi',
      description: 'Ambil foto kondisi pencemaran pesisir langsung dari ponsel Anda. Sistem otomatis membaca titik koordinat satelit akurat untuk memetakan sebaran limbah di garis pantai tanpa input manual yang rumit.',
      icon: MapPin,
      highlights: [
        'Deteksi koordinat GPS otomatis tanpa input manual',
        'Unggah foto bukti langsung beresolusi tinggi',
        'Dukungan penandaan pasang-surut air laut'
      ]
    },
    {
      id: 'ai-analysis',
      title: 'Verifikasi & Analisis AI Otomatis',
      tag: 'Computer Vision Bahari',
      description: 'Model visi komputer Reforca mengkaji foto sampah dalam hitungan detik. AI mengklasifikasi kategori limbah (plastik mikro/makro, jaring hantu, B3) dan menghitung estimasi volume serta skor kedaruratan.',
      icon: Cpu,
      highlights: [
        'Kalkulasi skor keparahan (Darurat, Tinggi, Sedang)',
        'Estimasi luasan area terdampak dalam meter persegi',
        'Rekomendasi jenis armada evakuasi yang tepat'
      ]
    },
    {
      id: 'transparency',
      title: 'Akuntabilitas & Penanganan Transparan',
      tag: 'Keterbukaan Publik',
      description: 'Pantau siapa instansi atau vendor yang ditugaskan membersihkan pantai. Warga dapat melihat rincian alokasi biaya penanganan serta dokumentasi Before & After secara terbuka dan terpercaya.',
      icon: ShieldCheck,
      highlights: [
        'Transparansi alokasi anggaran penanganan lapangan',
        'Status progres live dari pending hingga selesai',
        'Validasi akhir langsung oleh komunitas warga setempat'
      ]
    }
  ];

  const workflowSteps = [
    {
      step: 1,
      title: 'Kirim Laporan',
      subtitle: 'Foto & Koordinat Warga',
      icon: Camera,
      detail: 'Warga yang menemukan timbunan sampah pesisir mengambil foto langsung di lokasi. Sistem membaca metadata GPS koordinat untuk menentukan posisi akurat di peta perairan.'
    },
    {
      step: 2,
      title: 'Analisis AI',
      subtitle: 'Visi Mesin Mengkaji Keparahan',
      icon: Cpu,
      detail: 'Sistem AI Reforca mendeteksi jenis polutan, menghitung estimasi volume tumpukan sampah, dan menetapkan skor prioritas intervensi secara otomatis.'
    },
    {
      step: 3,
      title: 'Tindak Lanjut Instansi',
      subtitle: 'Pengerahan Tim Pembersih',
      icon: Building2,
      detail: 'Dinas Lingkungan Hidup atau mitra pengelola pesisir menerima notifikasi tugas darurat, lalu mengerahkan personel serta armada pembersih ke lokasi.'
    },
    {
      step: 4,
      title: 'Konfirmasi Warga',
      subtitle: 'Foto Hasil Pembersihan Disahkan',
      icon: UserCheck,
      detail: 'Setelah pembersihan rampung, foto Before & After dipublikasikan bersama rincian biaya. Komunitas warga sekitar memverifikasi langsung kondisi pantai yang telah bersih.'
    }
  ];

  return (
    <section id="fitur" className="py-20 lg:py-28 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3" data-aos="fade-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#1D4ED8] text-xs font-bold uppercase tracking-wider">
            Solusi Terintegrasi
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Fitur Utama Reforca
          </h2>
          <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
            Menggabungkan keakuratan teknologi geolokasi satelit, kecerdasan buatan, dan transparansi alokasi biaya demi mempercepat pemulihan ekosistem bahari.
          </p>
        </div>

        {/* Grid 3 Kartu Putih (#FFFFFF) dengan soft drop-shadow tipis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" data-aos="fade-up" data-aos-delay="100">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="rounded-2xl p-7 sm:p-8 bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-5">
                  {/* Top Icon & Tag */}
                  <div className="flex items-center justify-between">
                    <div className="w-13 h-13 p-3.5 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] text-[#1D4ED8]">
                      <Icon size={26} />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                      {item.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#0F172A] tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#64748B] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Bullet Highlights */}
                  <ul className="space-y-2.5 pt-4 border-t border-[#F1F5F9] text-xs text-[#334155]">
                    {item.highlights.map((hl, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="text-[#1D4ED8] shrink-0 mt-0.5" />
                        <span className="font-medium">{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interaktif Alur Penanganan 4 Langkah */}
        <div className="pt-8 space-y-6" data-aos="fade-up">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold text-[#1D4ED8] uppercase tracking-wider">
              Alur Kerja Terpadu
            </span>
            <h3 className="text-2xl font-extrabold text-[#0F172A]">
              Dari Laporan Warga Hingga Pesisir Kembali Bersih
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Klik tahapan di bawah untuk melihat mekanisme penanganan lapangan.
            </p>
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {workflowSteps.map((s, idx) => {
              const StepIcon = s.icon;
              const isSelected = activeStep === idx;
              return (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`p-4 sm:p-5 rounded-2xl text-left transition-all border ${
                    isSelected
                      ? 'bg-white border-[#1D4ED8] shadow-md ring-1 ring-[#1D4ED8]'
                      : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1] shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold ${
                      isSelected ? 'bg-[#1D4ED8] text-white' : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}>
                      {s.step}
                    </span>
                    <StepIcon size={18} className={isSelected ? 'text-[#1D4ED8]' : 'text-[#94A3B8]'} />
                  </div>
                  <div className="font-bold text-sm text-[#0F172A]">
                    {s.title}
                  </div>
                  <div className="text-xs text-[#64748B] mt-0.5">
                    {s.subtitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail Langkah Terpilih */}
          <div className="rounded-2xl p-6 sm:p-7 bg-white border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#1D4ED8] text-xs font-bold border border-[#DBEAFE]">
                Tahap {workflowSteps[activeStep].step}
              </span>
              <h4 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                {workflowSteps[activeStep].title}: {workflowSteps[activeStep].subtitle}
              </h4>
              <p className="text-sm text-[#475569] leading-relaxed">
                {workflowSteps[activeStep].detail}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : 3))}
                className="px-4 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#334155] text-xs font-bold transition-colors"
              >
                Sebelumnya
              </button>
              <button
                type="button"
                onClick={() => setActiveStep((prev) => (prev < 3 ? prev + 1 : 0))}
                className="px-4 py-2 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>Selanjutnya</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
