import React, { useState, useEffect } from 'react';
import { X, PlusCircle, LogIn, CheckCircle2 } from 'lucide-react';
import PublicReportForm from './PublicReportForm';

export default function CreateReportModal({ isOpen, onClose, onSubmitReport, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('report'); // 'report' | 'login'
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState('warga'); // 'warga' | 'admin'
  const [loginSuccess, setLoginSuccess] = useState(false);

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

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginSuccess(true);
    setTimeout(() => {
      setLoginSuccess(false);
      onClose();
      if (onLoginSuccess) {
        onLoginSuccess(loginRole);
      }
    }, 1000);
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
        <div className="sticky top-0 z-30 flex items-center justify-between p-4 sm:p-6 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setActiveTab('report')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
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
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-white text-[#1D4ED8] shadow-xs border border-[#CBD5E1]'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <LogIn size={14} className={activeTab === 'login' ? 'text-[#1D4ED8]' : 'text-[#64748B]'} />
              <span>Masuk Akun</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
            aria-label="Tutup jendela"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6">
          {activeTab === 'report' ? (
            <div className="space-y-4">
              <div className="text-center space-y-1 mb-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">
                  Kirim Laporan Sampah Pesisir Baru
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B]">
                  Pilih lokasi koordinat pantai, unggah bukti visual, dan jalankan analisis AI seketika.
                </p>
              </div>

              {/* Form Laporan Lengkap */}
              <PublicReportForm onSubmitReport={handleFormSubmit} />
            </div>
          ) : (
            <div className="max-w-md mx-auto py-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center mx-auto shadow-xs">
                  <LogIn size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A]">
                  Masuk ke Portal Reforca
                </h3>
                <p className="text-xs text-[#64748B]">
                  Masuk sebagai Warga Pesisir atau Petugas Instansi Kebersihan (DLH).
                </p>
              </div>

              {loginSuccess ? (
                <div className="p-4 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] text-center space-y-2 animate-fade-in">
                  <CheckCircle2 size={24} className="text-[#16A34A] mx-auto" />
                  <div className="text-sm font-bold text-[#16A34A]">
                    Berhasil masuk sebagai {loginRole === 'admin' ? 'Petugas Instansi DLH' : 'Warga Pelapor'}!
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Role Switcher */}
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <button
                      type="button"
                      onClick={() => setLoginRole('warga')}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        loginRole === 'warga'
                          ? 'bg-white text-[#1D4ED8] shadow-xs border border-[#CBD5E1]'
                          : 'text-[#64748B] hover:text-[#0F172A]'
                      }`}
                    >
                      Warga Pelapor
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginRole('admin')}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        loginRole === 'admin'
                          ? 'bg-white text-[#1D4ED8] shadow-xs border border-[#CBD5E1]'
                          : 'text-[#64748B] hover:text-[#0F172A]'
                      }`}
                    >
                      Instansi Pemerintah (DLH)
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#334155]">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder={loginRole === 'admin' ? 'petugas@dlh.jakarta.go.id' : 'warga@gmail.com'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1D4ED8] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#334155]">
                      Kata Sandi
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
                    Masuk Sekarang
                  </button>

                  <p className="text-[11px] text-center text-[#64748B]">
                    Belum punya akun? Pelaporan sampah pesisir tetap dapat dilakukan tanpa login.
                  </p>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
