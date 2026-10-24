import React, { useState, useEffect } from 'react';
import { 
  X, 
  PlusCircle, 
  LogIn, 
  UserPlus, 
  CheckCircle2, 
  ShieldAlert, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Sparkles,
  LogOut
} from 'lucide-react';
import PublicReportForm from './PublicReportForm';

export default function CreateReportModal({ 
  isOpen, 
  onClose, 
  onSubmitReport, 
  currentUser, 
  onLoginSuccess,
  onLogout,
  initialTab = 'report'
}) {
  // Tabs: 'report' | 'login' | 'register'
  const [activeTab, setActiveTab] = useState(() => {
    if (!currentUser) {
      return initialTab === 'register' ? 'register' : 'login';
    }
    return initialTab === 'login' ? 'login' : 'report';
  });

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (!currentUser) {
      setActiveTab(initialTab === 'register' ? 'register' : 'login');
    } else {
      setActiveTab(initialTab === 'login' ? 'login' : 'report');
    }
  }
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Register Form State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');

  const [authSuccessMessage, setAuthSuccessMessage] = useState('');

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail || !loginPassword) {
      setLoginError('Silakan isi email dan kata sandi Anda.');
      return;
    }

    // Check stored registered users
    const registeredUsers = JSON.parse(localStorage.getItem('reforca_registered_users') || '[]');
    const foundUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === loginEmail.toLowerCase() && u.password === loginPassword
    );

    let loggedInUser = null;

    if (foundUser) {
      loggedInUser = foundUser;
    } else {
      // Default citizen login
      const fallbackName = loginEmail.split('@')[0].replace(/[._]/g, ' ') || 'Warga Pesisir';
      const capitalizedName = fallbackName
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      loggedInUser = {
        id: `usr_${Date.now()}`,
        name: capitalizedName,
        email: loginEmail,
        phone: '+62 812-8871-3321',
        role: 'warga',
      };
    }

    setAuthSuccessMessage(`Selamat datang kembali, ${loggedInUser.name}!`);

    setTimeout(() => {
      if (onLoginSuccess) {
        onLoginSuccess(loggedInUser);
      }
      setActiveTab('report');
      setAuthSuccessMessage('');
    }, 700);
  };

  // Handle Registration
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError('Lengkapi semua data pendaftaran dengan benar.');
      return;
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: regName.trim(),
      phone: regPhone.trim() || '+62 812-0000-0000',
      email: regEmail.trim(),
      password: regPassword,
      role: 'warga',
      createdAt: new Date().toISOString()
    };

    // Save to localStorage registered users
    const existing = JSON.parse(localStorage.getItem('reforca_registered_users') || '[]');
    existing.push(newUser);
    localStorage.setItem('reforca_registered_users', JSON.stringify(existing));

    setAuthSuccessMessage(`Pendaftaran akun "${newUser.name}" berhasil! Membuka formulir laporan...`);

    setTimeout(() => {
      if (onLoginSuccess) {
        onLoginSuccess(newUser);
      }
      setActiveTab('report');
      setAuthSuccessMessage('');
    }, 800);
  };

  // Quick autofill demo citizen account
  const autofillDemoWarga = () => {
    setLoginEmail('bambang@gmail.com');
    setLoginPassword('password123');
  };

  const handleFormSubmit = (newReport) => {
    onSubmitReport(newReport);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[650] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white border border-[#E2E8F0] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between p-4 sm:p-5 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            {currentUser ? (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('report')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'report'
                      ? 'bg-white text-[#1D4ED8] shadow-xs border border-[#CBD5E1]'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  <PlusCircle size={14} className={activeTab === 'report' ? 'text-[#1D4ED8]' : 'text-[#64748B]'} />
                  <span>Buat Laporan Bahari</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'login'
                      ? 'bg-white text-[#1D4ED8] shadow-xs border border-[#CBD5E1]'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  <User size={14} className="text-[#1D4ED8]" />
                  <span>Profil Akun</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'login'
                      ? 'bg-white text-[#1D4ED8] shadow-xs border border-[#CBD5E1]'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  <LogIn size={14} className={activeTab === 'login' ? 'text-[#1D4ED8]' : 'text-[#64748B]'} />
                  <span>Masuk Akun</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'register'
                      ? 'bg-white text-[#1D4ED8] shadow-xs border border-[#CBD5E1]'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  <UserPlus size={14} className={activeTab === 'register' ? 'text-[#1D4ED8]' : 'text-[#64748B]'} />
                  <span>Daftar Akun Baru</span>
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-[#334155] bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                <span className="font-semibold text-[#0F172A]">{currentUser.name}</span>
                <button
                  type="button"
                  onClick={onLogout}
                  className="text-slate-400 hover:text-rose-600 transition-colors ml-1 p-0.5"
                  title="Keluar dari akun"
                >
                  <LogOut size={13} />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
              aria-label="Tutup jendela"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6">
          
          {/* JIKA BELUM LOGIN DAN MEMILIH TAB REPORT: TAMPILKAN GATEWAY LOGIN WAJIB */}
          {activeTab === 'report' && !currentUser && (
            <div className="max-w-md mx-auto py-6 space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] space-y-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#DBEAFE] text-[#1D4ED8] shrink-0 mt-0.5">
                    <ShieldAlert size={20} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-[#1E3A8A]">
                      Akun Diperlukan untuk Mengirim Laporan
                    </h4>
                    <p className="text-xs text-[#1E40AF] leading-relaxed">
                      Untuk menjamin keaslian bukti visual dan akuntabilitas penanganan pantai oleh Dinas Lingkungan Hidup, Anda harus masuk atau memiliki akun Reforca terlebih dahulu.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="py-3 px-4 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <LogIn size={15} />
                  <span>Masuk Akun</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="py-3 px-4 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <UserPlus size={15} className="text-[#1D4ED8]" />
                  <span>Daftar Akun Baru</span>
                </button>
              </div>

              {/* Demo Quick Login Helper */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs">
                <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#1D4ED8]" />
                  <span>Pintasan Masuk Instan (Demo Testing):</span>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      autofillDemoWarga();
                      setActiveTab('login');
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-white border border-[#CBD5E1] hover:border-[#1D4ED8] text-[#0F172A] text-xs font-semibold text-center transition-colors shadow-xs"
                  >
                    👤 Gunakan Demo Akun Warga (Bambang)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* JIKA SUDAH LOGIN & TAB REPORT: TAMPILKAN FORMULIR PELAPORAN */}
          {activeTab === 'report' && currentUser && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center space-y-1 mb-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">
                  Kirim Laporan Sampah Pesisir Baru
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B]">
                  Pilih lokasi koordinat pantai, unggah bukti visual, dan jalankan analisis AI seketika.
                </p>
              </div>

              {/* Form Laporan Lengkap dengan currentUser */}
              <PublicReportForm 
                onSubmitReport={handleFormSubmit} 
                currentUser={currentUser}
              />
            </div>
          )}

          {/* TAB MASUK AKUN (LOGIN) */}
          {activeTab === 'login' && (
            <div className="max-w-md mx-auto py-4 space-y-6 animate-fade-in">
              
              {/* Profile Overview if already logged in */}
              {currentUser ? (
                <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#0F172A]">{currentUser.name}</h3>
                    <p className="text-xs text-[#64748B]">{currentUser.email}</p>
                    <span className="inline-block mt-2 text-[11px] font-bold px-3 py-1 rounded-full bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                      Akun Warga Pelapor Bahari
                    </span>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('report')}
                      className="flex-1 py-2.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs transition-colors"
                    >
                      Lanjut Buat Laporan
                    </button>
                    <button
                      type="button"
                      onClick={onLogout}
                      className="py-2.5 px-4 rounded-xl bg-white hover:bg-rose-50 border border-[#CBD5E1] hover:border-rose-300 text-rose-600 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <LogOut size={14} />
                      <span>Keluar</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Form Login Warga */
                <>
                  <div className="text-center space-y-1.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center mx-auto shadow-xs">
                      <LogIn size={22} />
                    </div>
                    <h3 className="text-xl font-extrabold text-[#0F172A]">
                      Masuk ke Akun Reforca
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Akses pelaporan bahari dan verifikasi kebersihan pesisir warga.
                    </p>
                  </div>

                  {authSuccessMessage ? (
                    <div className="p-4 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] text-center space-y-2 animate-fade-in">
                      <CheckCircle2 size={24} className="text-[#16A34A] mx-auto" />
                      <div className="text-xs sm:text-sm font-bold text-[#16A34A]">
                        {authSuccessMessage}
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      
                      {loginError && (
                        <div className="p-3 rounded-xl bg-[#FEE2E2] border border-[#FECACA] text-xs font-semibold text-[#DC2626]">
                          {loginError}
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[#334155] flex items-center gap-1.5">
                          <Mail size={13} className="text-[#1D4ED8]" />
                          <span>Alamat Email</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="warga@gmail.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1D4ED8] focus:bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[#334155] flex items-center gap-1.5">
                          <Lock size={13} className="text-[#1D4ED8]" />
                          <span>Kata Sandi</span>
                        </label>
                        <input
                          type="password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1D4ED8] focus:bg-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99]"
                      >
                        Masuk & Lanjutkan
                      </button>

                      {/* Demo Quickfill */}
                      <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
                        <span>Demo Cepat:</span>
                        <button
                          type="button"
                          onClick={autofillDemoWarga}
                          className="text-[#1D4ED8] hover:underline font-semibold text-xs"
                        >
                          👤 Isi Akun Warga (Bambang)
                        </button>
                      </div>

                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab('register')}
                          className="text-xs text-[#1D4ED8] hover:underline font-bold"
                        >
                          Belum punya akun? Daftar Akun Baru Sekarang &rarr;
                        </button>
                      </div>

                    </form>
                  )}
                </>
              )}

            </div>
          )}

          {/* TAB DAFTAR AKUN BARU (REGISTER) */}
          {activeTab === 'register' && (
            <div className="max-w-md mx-auto py-4 space-y-6 animate-fade-in">
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center mx-auto shadow-xs">
                  <UserPlus size={22} />
                </div>
                <h3 className="text-xl font-extrabold text-[#0F172A]">
                  Daftar Akun Baru Reforca
                </h3>
                <p className="text-xs text-[#64748B]">
                  Daftarkan diri Anda untuk berpartisipasi dalam pemantauan kebersihan pesisir.
                </p>
              </div>

              {authSuccessMessage ? (
                <div className="p-4 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] text-center space-y-2 animate-fade-in">
                  <CheckCircle2 size={24} className="text-[#16A34A] mx-auto" />
                  <div className="text-xs sm:text-sm font-bold text-[#16A34A]">
                    {authSuccessMessage}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  
                  {regError && (
                    <div className="p-3 rounded-xl bg-[#FEE2E2] border border-[#FECACA] text-xs font-semibold text-[#DC2626]">
                      {regError}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#334155] flex items-center gap-1.5">
                      <User size={13} className="text-[#1D4ED8]" />
                      <span>Nama Lengkap Pelapor</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Contoh: Rian Saputra"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1D4ED8] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#334155] flex items-center gap-1.5">
                      <Phone size={13} className="text-[#1D4ED8]" />
                      <span>Nomor WhatsApp / HP</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="Contoh: +62 813-9876-5432"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1D4ED8] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#334155] flex items-center gap-1.5">
                      <Mail size={13} className="text-[#1D4ED8]" />
                      <span>Alamat Email</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="rian@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1D4ED8] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#334155] flex items-center gap-1.5">
                      <Lock size={13} className="text-[#1D4ED8]" />
                      <span>Kata Sandi</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1D4ED8] focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 mt-2 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    Daftar & Lanjut Kirim Laporan
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="text-xs text-[#1D4ED8] hover:underline font-bold"
                    >
                      Sudah punya akun? Masuk di sini &rarr;
                    </button>
                  </div>

                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
