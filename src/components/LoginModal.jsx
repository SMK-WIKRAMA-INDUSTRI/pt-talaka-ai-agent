import React, { useState } from 'react';
import {
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  User,
  UserPlus,
  X,
} from 'lucide-react';
import {
  loginWithUsernamePassword,
  registerCustomerAccount,
} from '../services/supabase';
import talaKedip from '../assets/ekspresi/tala-kedip.svg';

export default function LoginModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;
    setError('');
    setIsSubmitting(true);

    try {
      const user =
        mode === 'login'
          ? await loginWithUsernamePassword({ username, password })
          : await registerCustomerAccount({ username, password, fullName });

      onAuthSuccess(user);
      setUsername('');
      setPassword('');
      setFullName('');
      onClose();
    } catch (err) {
      setError(err.message || 'Gagal memproses autentikasi.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function fillDemoAccount(demoUser, demoPass) {
    setMode('login');
    setUsername(demoUser);
    setPassword(demoPass);
    setError('');
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 p-0.5 flex items-center justify-center">
              <img
                src={talaKedip}
                alt="Talaka"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-950">
                {mode === 'login' ? 'Masuk ke Talaka.ai' : 'Daftar Akun Pelanggan'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Autentikasi dasar terhubung ke Supabase
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal login"
            className="h-8 w-8 rounded-full text-slate-400 hover:bg-slate-200/70 hover:text-slate-800 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="px-6 pt-5">
          <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`rounded-xl py-2 transition cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-slate-950 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setUsername('');
                setPassword('');
                setFullName('');
                setError('');
              }}
              className={`rounded-xl py-2 transition cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-slate-950 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Daftar Baru
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'register' && (
            <div className="space-y-1">
              <label
                htmlFor="login-fullname"
                className="block text-xs font-bold text-slate-700"
              >
                Nama Lengkap
              </label>
              <div className="relative">
                <UserPlus className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Misal: Budi Santoso"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label
              htmlFor="login-username"
              className="block text-xs font-bold text-slate-700"
            >
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="login-username"
                type="text"
                autoComplete={mode === 'login' ? 'username' : 'off'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={
                  mode === 'login'
                    ? 'admin atau pelanggan'
                    : 'Buat username unik, misal: hannan01'
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="login-password"
              className="block text-xs font-bold text-slate-700"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={
                  mode === 'login' ? 'current-password' : 'new-password'
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-10 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                aria-label="Tampilkan password"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-black disabled:bg-slate-300 transition cursor-pointer shadow-xs"
          >
            {isSubmitting
              ? 'Memproses...'
              : mode === 'login'
                ? 'Masuk Sekarang'
                : 'Buat Akun Pelanggan'}
          </button>

          {/* Quick Demo Credentials for Presentation */}
          {mode === 'login' && (
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-[#9E7B66]" />
                AKUN DEMO CEPAT (KLIK UNTUK ISI)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('admin', 'talaka123')}
                  className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-left hover:border-slate-900 transition cursor-pointer"
                >
                  <div className="text-[11px] font-bold text-slate-900">
                    Admin Toko
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    admin / talaka123
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('pelanggan', 'talaka123')}
                  className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-left hover:border-slate-900 transition cursor-pointer"
                >
                  <div className="text-[11px] font-bold text-slate-900">
                    Pelanggan
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    pelanggan / talaka123
                  </div>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
