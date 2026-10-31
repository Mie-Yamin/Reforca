import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  Info,
  CheckCircle2,
  Building2
} from 'lucide-react';
import OrcaLogo from './OrcaLogo';
import {
  loginAdmin,
  getAllowedAdminEmails,
  getAdminDefaultPassword
} from '../services/adminAuthService';

export default function AdminLogin({ onLoginSuccess, onBackHome }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showHint, setShowHint] = useState(false);

  const allowedEmails = getAllowedAdminEmails();
  const defaultPassword = getAdminDefaultPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const session = await loginAdmin(email, password);
      if (onLoginSuccess) {
        onLoginSuccess(session);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat verifikasi admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseDefaultCredentials = () => {
    const primaryEmail = allowedEmails[0] || 'admin@reforca.id';
    setEmail(primaryEmail);
    setPassword(defaultPassword);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-[#0F172A]">
      {/* Background Ambience Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/10 via-blue-600/15 to-transparent rounded-full blur-3xl opacity-70"></div>
      </div>

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Tombol Kembali ke Beranda */}
        <div>
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors group px-3 py-1.5 rounded-xl hover:bg-slate-800/60"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Halaman Beranda</span>
          </button>
        </div>

        {/* Card Form Login Admin */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-950/50 relative overflow-hidden">
          {/* Top glowing accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"></div>

          {/* Header Brand & Title */}
          <div className="text-center space-y-3 mb-6">
            <div className="flex justify-center">
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-inner">
                <OrcaLogo invert={true} className="h-10 w-auto object-contain" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-bold tracking-wider uppercase">
              <Building2 size={13} />
              <span>Portal Internal Kedinasan</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Ruang Komando Instansi
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Dinas Lingkungan Hidup & Satgas Restorasi Pesisir. Masuk untuk mengelola verifikasi laporan, penugasan vendor, dan alokasi anggaran publik.
            </p>
          </div>

          {/* Alert Error */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3 animate-shake">
              <ShieldAlert size={18} className="shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1 leading-snug">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Email */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Alamat Email Administrator
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@reforca.id"
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Kata Sandi Portal
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Memverifikasi Akses...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Masuk ke Ruang Komando</span>
                </>
              )}
            </button>
          </form>

          {/* Quick-Credential Helper Box */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-cyan-400 transition-colors py-1 font-medium"
            >
              <span className="flex items-center gap-1.5">
                <KeyRound size={13} className="text-cyan-400" />
                <span>Informasi Kredensial Akses Admin</span>
              </span>
              <span className="text-[10px] underline">{showHint ? 'Tutup' : 'Lihat'}</span>
            </button>

            {showHint && (
              <div className="mt-2.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 space-y-2 animate-fade-in">
                <div className="flex items-start gap-2">
                  <Info size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="leading-snug text-slate-300">
                      Email yang diizinkan saat ini dikonfigurasi melalui file <code className="text-cyan-300">.env.local</code> (variabel <code>VITE_ADMIN_EMAILS</code>):
                    </p>
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-300 space-y-1">
                      <div><span className="text-slate-500">Email:</span> <span className="text-emerald-400 font-bold">{allowedEmails.join(', ')}</span></div>
                      <div><span className="text-slate-500">Kata Sandi:</span> <span className="text-amber-400 font-bold">{defaultPassword}</span></div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleUseDefaultCredentials}
                  className="w-full py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold text-[11px] transition-colors flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 size={13} />
                  <span>Gunakan Kredensial Ini Otomatis</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Security badge at bottom */}
        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck size={13} className="text-emerald-500" />
          <span>Sesi terenkripsi & dilindungi protokol verifikasi bertingkat.</span>
        </div>
      </div>
    </div>
  );
}