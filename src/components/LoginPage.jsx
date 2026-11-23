import React, { useState, useEffect, useRef } from 'react';
import {
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  User,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  LogIn,
  UserPlus,
} from 'lucide-react';
import gsap from 'gsap';
import {
  loginWithUsernamePassword,
  registerCustomerAccount,
} from '../services/supabase';
import talaLoginGif from '../assets/t/tala-login.gif';
import talaRegisterGif from '../assets/t/tala-register.gif';

/* ─────────────────────────────────────────────
   Color palette — exact landing page match:
   #9E7B66  = Mocca (primary accent)
   #0F172A  = Slate-900 (deep dark text)
   #FDF8F5 / #F5EDE7 / #EDD9CC = warm light mocca
───────────────────────────────────────────── */

export default function LoginPage({ onClose, onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  // Refs for GSAP animations
  const mascotRef = useRef(null);
  const formRef = useRef(null);
  const waveStrokeRef = useRef(null);
  const registerBtnRef = useRef(null);
  const loginBtnRef = useRef(null);
  const registerPathRef = useRef(null);
  const loginPathRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const switchMode = (signUpMode) => {
    setIsSignUp(signUpMode);
    setError('');
    if (signUpMode) {
      setUsername('');
      setPassword('');
      setFullName('');
    }
  };

  const fillDemoAccount = (demoUser, demoPass) => {
    setIsSignUp(false);
    setUsername(demoUser);
    setPassword(demoPass);
    setError('');
  };

  // GSAP animation when switching between Login and Register
  useEffect(() => {
    // 1. Animate form fields transition
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' }
      );
    }

    // 2. Animate mascot change
    if (mascotRef.current) {
      gsap.fromTo(
        mascotRef.current,
        { opacity: 0.5, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.5)' }
      );
    }

    // 3. Smooth elastic GSAP transition for liquid-fillet tabs (anchored directly on wave seam)
    if (registerPathRef.current && loginPathRef.current) {
      gsap.to(registerPathRef.current, {
        fill: isSignUp ? '#9E7B66' : '#FFFFFF',
        strokeOpacity: isSignUp ? 1 : 0.55,
        duration: 0.42,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(loginPathRef.current, {
        fill: !isSignUp ? '#9E7B66' : '#FDF8F5',
        strokeOpacity: !isSignUp ? 1 : 0.55,
        duration: 0.42,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }

    const activeBtn = isSignUp ? registerBtnRef.current : loginBtnRef.current;
    if (activeBtn) {
      gsap.fromTo(
        activeBtn,
        { scaleX: 0.94 },
        { scaleX: 1, duration: 0.42, ease: 'back.out(1.7)', overwrite: 'auto' }
      );
    }

    // 4. Subtle wave reaction
    if (waveStrokeRef.current) {
      gsap.fromTo(
        waveStrokeRef.current,
        { strokeWidth: 3, strokeOpacity: 0.85 },
        { strokeWidth: 2, strokeOpacity: 0.55, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, [isSignUp]);

  // GSAP hover handlers: elastic liquid stretch anchored ON the wave line (zero detachment!)
  const handleRegisterEnter = () => {
    if (registerBtnRef.current) {
      gsap.to(registerBtnRef.current, {
        scaleX: 1.05,
        duration: 0.28,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    if (!isSignUp && registerPathRef.current) {
      gsap.to(registerPathRef.current, {
        fill: '#F7ECE4',
        strokeOpacity: 0.85,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const handleRegisterLeave = () => {
    if (registerBtnRef.current) {
      gsap.to(registerBtnRef.current, {
        scaleX: 1,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    if (!isSignUp && registerPathRef.current) {
      gsap.to(registerPathRef.current, {
        fill: '#FFFFFF',
        strokeOpacity: 0.55,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const handleLoginEnter = () => {
    if (loginBtnRef.current) {
      gsap.to(loginBtnRef.current, {
        scaleX: 1.05,
        duration: 0.28,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    if (isSignUp && loginPathRef.current) {
      gsap.to(loginPathRef.current, {
        fill: '#F3E4D9',
        strokeOpacity: 0.85,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const handleLoginLeave = () => {
    if (loginBtnRef.current) {
      gsap.to(loginBtnRef.current, {
        scaleX: 1,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    if (isSignUp && loginPathRef.current) {
      gsap.to(loginPathRef.current, {
        fill: '#FDF8F5',
        strokeOpacity: 0.55,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    setIsLoading(true);

    try {
      const user = isSignUp
        ? await registerCustomerAccount({ username, password, fullName })
        : await loginWithUsernamePassword({ username, password });

      showToast(
        isSignUp
          ? `Akun ${user.fullName || user.username} berhasil dibuat! Selamat datang ✨`
          : `Berhasil masuk sebagai ${user.fullName || user.username} ✨`
      );

      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(user);
        else if (onClose) onClose();
      }, 900);
    } catch (err) {
      setError(err.message || 'Gagal memproses autentikasi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex font-sans selection:bg-[#9E7B66] selection:text-white">

      {/* ── Toast Notification ── */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-full bg-[#0F172A]/95 text-white px-5 py-3 text-xs font-semibold shadow-2xl backdrop-blur-md border border-slate-700 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          FULL-SCREEN BACKGROUND & SEAMLESS WAVE DIVIDER
          Layer 0: Warm Mocca gradient on whole screen
          Layer 1: Right pure-white fill + 3-segment C1-smooth S-wave divider
                   (360px fixed-pixel divider band so curve & liquid fillet tabs
                    align to 0.00px at EVERY screen resolution!)
          ════════════════════════════════════════════════════════════ */}
      {/* Layer 0: Warm background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FDF8F5] via-[#F5EDE7] to-[#EDD9CC] pointer-events-none" />

      {/* Ambient soft glows */}
      <div className="absolute top-16 left-16 w-96 h-96 rounded-full bg-white/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-40 w-80 h-80 rounded-full bg-[#9E7B66]/15 blur-3xl pointer-events-none" />

      {/* Solid pure white right background extending from right edge of the 360px wave band */}
      <div
        className="hidden lg:block absolute inset-y-0 right-0 bg-white pointer-events-none z-10"
        style={{ left: 'calc(46% + 178px)' }}
      />

      {/* Layer 1: Seamless 3-Part Wave Divider Band (360px wide, centered at left: 46%) */}
      <div
        className="hidden lg:flex flex-col absolute inset-y-0 pointer-events-none z-10"
        style={{ left: '46%', transform: 'translateX(-50%)', width: '360px' }}
      >
        {/* Top flexible wave — arrives at (180, 280) with vertical tangent */}
        <svg
          className="flex-1 w-[360px] min-h-0 block -mb-px"
          viewBox="0 0 360 280"
          preserveAspectRatio="none"
        >
          <path
            d="M 180 0 C 235 60, 125 160, 180 230 C 196 250, 180 266, 180 280 L 360 280 L 360 0 Z"
            fill="#ffffff"
          />
          <path
            d="M 180 0 C 235 60, 125 160, 180 230 C 196 250, 180 266, 180 280"
            stroke="#9E7B66"
            strokeWidth="2"
            strokeOpacity="0.55"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Centerpiece wave (1:1 CSS pixels: 360x340 — exact curve behind the liquid fillet tabs) */}
        <svg
          className="w-[360px] h-[340px] shrink-0 block"
          viewBox="0 0 360 340"
        >
          <path
            d="M 180 0 C 180 50, 156 115, 180 170 C 204 225, 180 290, 180 340 L 360 340 L 360 0 Z"
            fill="#ffffff"
          />
          <path
            ref={waveStrokeRef}
            d="M 180 0 C 180 50, 156 115, 180 170 C 204 225, 180 290, 180 340"
            stroke="#9E7B66"
            strokeWidth="2"
            strokeOpacity="0.55"
            fill="none"
          />
        </svg>

        {/* Bottom flexible wave — leaves (180, 0) with vertical tangent */}
        <svg
          className="flex-1 w-[360px] min-h-0 block -mt-px"
          viewBox="0 0 360 280"
          preserveAspectRatio="none"
        >
          <path
            d="M 180 0 C 180 22, 130 92, 184 162 C 232 222, 154 256, 180 280 L 360 280 L 360 0 Z"
            fill="#ffffff"
          />
          <path
            d="M 180 0 C 180 22, 130 92, 184 162 C 232 222, 154 256, 180 280"
            stroke="#9E7B66"
            strokeWidth="2"
            strokeOpacity="0.55"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* ════════════════════════════════════════════════════════════
          LIQUID / FILLET TOGGLE TABS (Desktop, z-30)
          Exact 1:1 360x340 SVG grid aligned over the centerpiece wave:
          - Pangkal atas & bawah setiap tombol melengkung cair (concave fillet)
            menyatu tangensial langsung ke garis kurva pembatas (0px gap, tanpa sudut 90°)
          - Sisi dalam mengikuti 100% lekukan kurva garis pembatas
          - Ujung luar membulat oval lembut (semicircle radius 22px)
          - Login (kanan, lebih tinggi) & Register (kiri, lebih rendah)
          - Aktif = Mocca (#9E7B66) teks putih · Inaktif = putih/krem border Mocca
          ════════════════════════════════════════════════════════════ */}
      <svg
        className="hidden lg:block absolute z-30 pointer-events-none overflow-visible"
        style={{
          left: '46%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '360px',
          height: '340px',
        }}
        viewBox="0 0 360 340"
      >
        <defs>
          <filter id="liquid-tab-shadow-active" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#9E7B66" floodOpacity="0.32" />
          </filter>
          <filter id="liquid-tab-shadow-idle" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.07" />
          </filter>
        </defs>

        {/* LOGIN LIQUID TAB — Right side of wave, higher (y: 80..124, fillet y: 48.4..153.2) */}
        <g
          ref={loginBtnRef}
          role="button"
          tabIndex={0}
          aria-label="Halaman Login"
          onClick={() => switchMode(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              switchMode(false);
            }
          }}
          onMouseEnter={handleLoginEnter}
          onMouseLeave={handleLoginLeave}
          className="pointer-events-auto cursor-pointer outline-none"
          style={{ transformOrigin: '172px 102px' }}
          filter={!isSignUp ? 'url(#liquid-tab-shadow-active)' : 'url(#liquid-tab-shadow-idle)'}
        >
          {/* Liquid fillet silhouette hugging exact wave sub-curve */}
          <path
            ref={loginPathRef}
            d="M 175.5 48.4 C 172.5 70, 180 80, 206 80 L 280 80 A 22 22 0 0 1 280 124 L 206 124 C 180 124, 170 134, 174.2 153.2 C 165.1 119.2, 170.7 82.4, 175.5 48.4 Z"
            fill={!isSignUp ? '#9E7B66' : '#FDF8F5'}
            stroke="#9E7B66"
            strokeWidth="1.75"
            strokeOpacity={!isSignUp ? 1 : 0.55}
            strokeLinejoin="round"
          />
          {/* LogIn icon + Label */}
          <g
            transform="translate(212, 95)"
            fill="none"
            stroke={!isSignUp ? '#FFFFFF' : '#9E7B66'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 9 2 H 12 A 1.5 1.5 0 0 1 13.5 3.5 V 10.5 A 1.5 1.5 0 0 1 12 12 H 9" />
            <polyline points="6 10 9 7 6 4" />
            <line x1="9" y1="7" x2="1.5" y2="7" />
          </g>
          <text
            x="233"
            y="106.5"
            fill={!isSignUp ? '#FFFFFF' : '#9E7B66'}
            fontSize="12.5"
            fontWeight="700"
            letterSpacing="0.03em"
            style={{ fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif', userSelect: 'none' }}
          >
            Login
          </text>
        </g>

        {/* REGISTER LIQUID TAB — Left side of wave, lower (y: 216..260, fillet y: 186.8..291.6) */}
        <g
          ref={registerBtnRef}
          role="button"
          tabIndex={0}
          aria-label="Halaman Register"
          onClick={() => switchMode(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              switchMode(true);
            }
          }}
          onMouseEnter={handleRegisterEnter}
          onMouseLeave={handleRegisterLeave}
          className="pointer-events-auto cursor-pointer outline-none"
          style={{ transformOrigin: '188px 238px' }}
          filter={isSignUp ? 'url(#liquid-tab-shadow-active)' : 'url(#liquid-tab-shadow-idle)'}
        >
          {/* Liquid fillet silhouette hugging exact wave sub-curve */}
          <path
            ref={registerPathRef}
            d="M 185.8 186.8 C 190 206, 180 216, 154 216 L 74 216 A 22 22 0 0 0 74 260 L 154 260 C 180 260, 188 272, 184.5 291.6 C 189.3 257.6, 194.9 220.8, 185.8 186.8 Z"
            fill={isSignUp ? '#9E7B66' : '#FFFFFF'}
            stroke="#9E7B66"
            strokeWidth="1.75"
            strokeOpacity={isSignUp ? 1 : 0.55}
            strokeLinejoin="round"
          />
          {/* UserPlus icon + Label */}
          <g
            transform="translate(76, 231)"
            fill="none"
            stroke={isSignUp ? '#FFFFFF' : '#9E7B66'}
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 9.5 12.5 V 11 A 2.5 2.5 0 0 0 7 8.5 H 3.5 A 2.5 2.5 0 0 0 1 11 V 12.5" />
            <circle cx="5.25" cy="4.2" r="2.3" />
            <line x1="12" y1="5" x2="12" y2="9.5" />
            <line x1="9.75" y1="7.25" x2="14.25" y2="7.25" />
          </g>
          <text
            x="96"
            y="242.5"
            fill={isSignUp ? '#FFFFFF' : '#9E7B66'}
            fontSize="12.5"
            fontWeight="700"
            letterSpacing="0.03em"
            style={{ fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif', userSelect: 'none' }}
          >
            Register
          </text>
        </g>

        {/* Continuous seamless wave stroke overlay right over the seam so the curve reads cleanly */}
        <path
          d="M 180 0 C 180 50, 156 115, 180 170 C 204 225, 180 290, 180 340"
          stroke="#9E7B66"
          strokeWidth="2"
          strokeOpacity="0.65"
          fill="none"
          className="pointer-events-none"
        />
      </svg>

      {/* ════════════════════════════════════════════════════════════
          FOREGROUND LAYOUT
          Left panel (46% width) & Right panel (54% width)
          ════════════════════════════════════════════════════════════ */}

      {/* LEFT PANEL · Mascot */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] relative z-20 min-h-screen overflow-hidden">

        {/* Mascot Area — Docked right at the bottom-left corner ("di ujung"), significantly bigger */}
        <div
          ref={mascotRef}
          className="absolute bottom-0 left-0 z-10 flex flex-col items-start pointer-events-auto"
        >
          {/* Clean speech bubble above mascot — clear and independent */}
          <div className="ml-10 xl:ml-14 mb-2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl rounded-bl-sm border border-[#9E7B66]/25 shadow-lg text-xs font-bold text-slate-800 flex items-center gap-2 whitespace-nowrap">
            <Sparkles className="w-4 h-4 text-[#9E7B66]" />
            <span>{isSignUp ? 'Yuk bikin akun baru, Kak! ✨' : 'Hai! Senang melihatmu lagi ✨'}</span>
          </div>

          {/* Huge Mascot GIF — anchored flush to the bottom-left edge */}
          <div className="relative group cursor-pointer">
            <img
              src={isSignUp ? talaRegisterGif : talaLoginGif}
              alt="Tala Mascot"
              className="w-[450px] xl:w-[530px] 2xl:w-[590px] h-auto object-contain object-left-bottom drop-shadow-[0_20px_45px_rgba(158,123,102,0.32)] group-hover:scale-[1.02] origin-bottom-left transition-transform duration-300 select-none block"
            />
          </div>
        </div>

      </div>

      {/* RIGHT PANEL · Pure White Form Area */}
      <div className="flex flex-col w-full lg:w-[54%] lg:ml-auto min-h-screen relative z-20">

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between p-5 border-b border-slate-100 bg-white">
          <span className="font-extrabold text-xl text-[#9E7B66]">
            Talaka<span className="text-[#0F172A]">.</span>
          </span>
          <div className="flex items-center rounded-full border border-slate-200 overflow-hidden text-xs font-bold">
            <button
              type="button"
              onClick={() => switchMode(false)}
              className={`flex items-center gap-1 px-4 py-2 cursor-pointer transition-all ${
                !isSignUp ? 'bg-[#9E7B66] text-white' : 'bg-white text-[#9E7B66]'
              }`}
            >
              <LogIn className="w-3 h-3" /> Login
            </button>
            <div className="w-px h-5 bg-slate-200" />
            <button
              type="button"
              onClick={() => switchMode(true)}
              className={`flex items-center gap-1 px-4 py-2 cursor-pointer transition-all ${
                isSignUp ? 'bg-[#9E7B66] text-white' : 'bg-white text-[#9E7B66]'
              }`}
            >
              <UserPlus className="w-3 h-3" /> Register
            </button>
          </div>
        </div>

        {/* Back Link */}
        <div className="p-6 sm:p-8 lg:p-10 pb-0">
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0F172A] hover:bg-slate-100 px-3 py-1.5 rounded-full transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Beranda
            </button>
          ) : (
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0F172A] hover:bg-slate-100 px-3 py-1.5 rounded-full transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Beranda
            </a>
          )}
        </div>

        {/* Center Form */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-8">
          <div ref={formRef} className="w-full max-w-sm">

            {/* Title */}
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                {isSignUp ? 'Buat Akun' : 'Login'}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {isSignUp
                  ? 'Daftar akun pelanggan yang terhubung ke Supabase Talaka'
                  : 'Masuk untuk melanjutkan ke Fashion AI Concierge-mu'}
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name (Sign-up only) */}
              {isSignUp && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label htmlFor="login-fullname" className="block text-xs font-bold text-slate-700">
                    Nama Lengkap
                  </label>
                  <div className="relative rounded-xl border border-slate-200 focus-within:border-[#9E7B66] focus-within:ring-2 focus-within:ring-[#9E7B66]/15 bg-white transition-all">
                    <UserPlus className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="login-fullname"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Contoh: Dinda Kirana"
                      className="w-full pl-10 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* Username (Supabase Profiles Auth) */}
              <div className="space-y-1.5">
                <label htmlFor="login-username" className="block text-xs font-bold text-slate-700">
                  Username
                </label>
                <div className="relative rounded-xl border border-slate-200 focus-within:border-[#9E7B66] focus-within:ring-2 focus-within:ring-[#9E7B66]/15 bg-white transition-all">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="login-username"
                    type="text"
                    required
                    autoComplete={isSignUp ? 'off' : 'username'}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={
                      isSignUp
                        ? 'Buat username unik, misal: hannan01'
                        : 'admin atau pelanggan'
                    }
                    className="w-full pl-10 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="login-password" className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <div className="relative rounded-xl border border-slate-200 focus-within:border-[#9E7B66] focus-within:ring-2 focus-within:ring-[#9E7B66]/15 bg-white transition-all">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full pl-10 pr-10 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Tampilkan password"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#9E7B66] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-1 rounded-xl bg-[#9E7B66] hover:bg-[#8a6a57] active:scale-[0.99] text-white font-extrabold py-3.5 text-sm shadow-md shadow-[#9E7B66]/30 hover:shadow-lg hover:shadow-[#9E7B66]/40 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </span>
                ) : isSignUp ? (
                  'Buat Akun Pelanggan'
                ) : (
                  'Masuk Sekarang'
                )}
              </button>

              {/* Quick Demo Credentials (Supabase RBAC) */}
              {!isSignUp && (
                <div className="rounded-2xl border border-[#9E7B66]/20 bg-[#FDF8F5] p-3.5 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#9E7B66]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#9E7B66]" />
                    AKUN DEMO CEPAT (KLIK UNTUK ISI)
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => fillDemoAccount('admin', 'talaka123')}
                      className="rounded-xl border border-[#9E7B66]/20 bg-white px-3 py-2 text-left hover:border-[#9E7B66] hover:shadow-xs transition cursor-pointer"
                    >
                      <div className="text-[11px] font-bold text-[#0F172A]">
                        Admin Toko
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        admin / talaka123
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoAccount('pelanggan', 'talaka123')}
                      className="rounded-xl border border-[#9E7B66]/20 bg-white px-3 py-2 text-left hover:border-[#9E7B66] hover:shadow-xs transition cursor-pointer"
                    >
                      <div className="text-[11px] font-bold text-[#0F172A]">
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

            {/* Mobile Switcher Footer */}
            <div className="mt-8 text-center text-xs text-slate-500 lg:hidden">
              {isSignUp ? (
                <span>
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode(false)}
                    className="font-bold text-[#9E7B66] underline hover:text-[#7a5f4f] cursor-pointer"
                  >
                    Masuk di sini
                  </button>
                </span>
              ) : (
                <span>
                  Belum punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode(true)}
                    className="font-bold text-[#9E7B66] underline hover:text-[#7a5f4f] cursor-pointer"
                  >
                    Daftar di sini
                  </button>
                </span>
              )}
            </div>

          </div>
        </div>

        {/* Security Footer */}
        <div className="text-center text-[11px] text-slate-400 py-5 border-t border-slate-100">
          Dilindungi oleh Talaka Core AI Shield &bull; Supabase RBAC Auth
        </div>

      </div>
    </div>
  );
}
