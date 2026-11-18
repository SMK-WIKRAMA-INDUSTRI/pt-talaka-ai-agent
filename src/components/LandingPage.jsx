import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import {
  Sparkles,
  ArrowRight,
  MessageCircle,
  Ruler,
  Package,
  ShieldCheck,
  Zap,
  Bot,
  Heart,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Shirt,
  ShoppingBag,
  TrendingUp,
  CreditCard,
  Truck,
  Check,
  ChevronRight,
  Store,
  Sliders,
  Terminal,
  Cpu,
  Activity,
  Layers,
} from 'lucide-react';
import ShoeShowcase from './ShoeShowcase';
import talaKedip from '../assets/ekspresi/tala-kedip.svg';

/* ─────────────────────────────────────────────────────────────
   20 CALIBRATED NODE CABLES (High-Tech Color Palette with Mocca Accents)
   ───────────────────────────────────────────────────────────── */
const cablesData = [
  { id: 'pdf',      name: 'Invoice & Resi Transaksi',  color: '#9E7B66', origIndex: 4,  bx: 188,  by: 454.8, r: 18, tx: 275,   ty: 472.2, phi_t: -2.9322, ampX: 2,   ampY: 3,   freqX: 1.1,  freqY: 0.9,  phase: 0,    },
  { id: 'sheets',   name: 'Grafik Omset & Stok',       color: '#10B981', origIndex: 3,  bx: 120,  by: 384,   r: 20, tx: 284.2, ty: 440.5, phi_t: -2.7889, ampX: 2.8, ampY: 3.9, freqX: 1.25, freqY: 1.1,  phase: 0.45, },
  { id: 'd2l',      name: 'Toko Retail & Butik',       color: '#0F172A', origIndex: 2,  bx: 46,   by: 275.6, r: 26, tx: 297.7, ty: 410.5, phi_t: -2.6456, ampX: 3.6, ampY: 4.8, freqX: 1.4,  freqY: 1.3,  phase: 0.9,  },
  { id: 'health',   name: 'Garansi & UU PDP',          color: '#6366F1', origIndex: 5,  bx: 226,  by: 286.4, r: 16, tx: 315.4, ty: 382.8, phi_t: -2.5023, ampX: 2,   ampY: 5.7, freqX: 1.55, freqY: 1.5,  phase: 1.35, },
  { id: 'gmail',    name: 'Customer Support 24/7',     color: '#0EA5E9', origIndex: 0,  bx: 72,   by: 136.4, r: 22, tx: 336.9, ty: 357.8, phi_t: -2.359,  ampX: 2.8, ampY: 3,   freqX: 1.7,  freqY: 0.9,  phase: 1.8,  },
  { id: 'drive',    name: 'Manajemen Bisnis',          color: '#9E7B66', origIndex: 1,  bx: 140,  by: 61.6,  r: 20, tx: 361.8, ty: 336.2, phi_t: -2.2156, ampX: 3.6, ampY: 3.9, freqX: 1.1,  freqY: 1.1,  phase: 2.25, },
  { id: 'canvas',   name: 'Keranjang & Checkout',      color: '#F59E0B', origIndex: 6,  bx: 224,  by: 96.8,  r: 24, tx: 389.4, ty: 318.3, phi_t: -2.0723, ampX: 2,   ampY: 4.8, freqX: 1.25, freqY: 1.3,  phase: 2.7,  },
  { id: 'code',     name: 'Pesanan Mobile',            color: '#0F172A', origIndex: 8,  bx: 376,  by: 161.6, r: 16, tx: 419.4, ty: 304.6, phi_t: -1.929,  ampX: 2.8, ampY: 5.7, freqX: 1.4,  freqY: 1.5,  phase: 3.15, },
  { id: 'notion',   name: 'Basis Pengetahuan FAQ',     color: '#64748B', origIndex: 7,  bx: 340,  by: 40.8,  r: 20, tx: 450.9, ty: 295.3, phi_t: -1.7857, ampX: 3.6, ampY: 3,   freqX: 1.55, freqY: 0.9,  phase: 3.6,  },
  { id: 'sparkle',  name: 'Fitur Pintar Fashion',      color: '#9E7B66', origIndex: 10, bx: 446,  by: 88.8,  r: 16, tx: 483.5, ty: 290.6, phi_t: -1.6424, ampX: 2,   ampY: 3.9, freqX: 1.7,  freqY: 1.1,  phase: 4.05, },
  { id: 'gpt',      name: 'AI Brain Talaka',           color: '#0F172A', origIndex: 9,  bx: 498,  by: 38.4,  r: 28, tx: 516.5, ty: 290.6, phi_t: -1.4991, ampX: 2.8, ampY: 4.8, freqX: 1.1,  freqY: 1.3,  phase: 4.5,  },
  { id: 'gemini',   name: 'Panduan Ukuran TB/BB',      color: '#2563EB', origIndex: 11, bx: 602,  by: 63.6,  r: 22, tx: 549.1, ty: 295.3, phi_t: -1.3558, ampX: 3.6, ampY: 5.7, freqX: 1.25, freqY: 1.5,  phase: 4.95, },
  { id: 'claude',   name: 'Rating Bintang 5',          color: '#D97706', origIndex: 12, bx: 704,  by: 55.2,  r: 24, tx: 580.6, ty: 304.6, phi_t: -1.2125, ampX: 2,   ampY: 3,   freqX: 1.4,  freqY: 0.9,  phase: 5.4,  },
  { id: 'discord',  name: 'Teman Ngobrol Gaya',        color: '#8B5CF6', origIndex: 13, bx: 658,  by: 184.4, r: 18, tx: 610.6, ty: 318.3, phi_t: -1.0692, ampX: 2.8, ampY: 3.9, freqX: 1.55, freqY: 1.1,  phase: 5.85, },
  { id: 'teams',    name: 'Kebijakan Tukar Ukuran',    color: '#059669', origIndex: 14, bx: 792,  by: 115.6, r: 22, tx: 638.2, ty: 336.2, phi_t: -0.9259, ampX: 3.6, ampY: 4.8, freqX: 1.7,  freqY: 1.3,  phase: 6.3,  },
  { id: 'deepseek', name: 'Rekomendasi Akurat',        color: '#0F172A', origIndex: 15, bx: 902,  by: 63.6,  r: 22, tx: 663.1, ty: 357.8, phi_t: -0.7826, ampX: 2,   ampY: 5.7, freqX: 1.1,  freqY: 1.5,  phase: 6.75, },
  { id: 'slack',    name: 'Ekspedisi Kilat & COD',     color: '#EA580C', origIndex: 16, bx: 850,  by: 248.8, r: 20, tx: 684.6, ty: 382.8, phi_t: -0.6393, ampX: 2.8, ampY: 3,   freqX: 1.25, freqY: 0.9,  phase: 7.2,  },
  { id: 'hubspot',  name: 'Voucher & Diskon Promo',    color: '#9E7B66', origIndex: 17, bx: 942,  by: 323.6, r: 22, tx: 702.3, ty: 410.5, phi_t: -0.496,  ampX: 3.6, ampY: 3.9, freqX: 1.4,  freqY: 1.1,  phase: 7.65, },
  { id: 'figma',    name: 'Katalog Koleksi Busana',    color: '#A855F7', origIndex: 18, bx: 768,  by: 413.2, r: 18, tx: 715.8, ty: 440.5, phi_t: -0.3527, ampX: 2,   ampY: 4.8, freqX: 1.55, freqY: 1.3,  phase: 8.1,  },
  { id: 'web',      name: 'Website Toko Fashion',      color: '#0F172A', origIndex: 19, bx: 888,  by: 444.4, r: 18, tx: 725,   ty: 472.2, phi_t: -0.2094, ampX: 2.8, ampY: 5.7, freqX: 1.7,  freqY: 1.5,  phase: 8.55, },
];

function getInitialPath(c) {
  const dir  = Math.atan2(c.ty - c.by, c.tx - c.bx);
  const sx   = c.bx + (c.r - 1) * Math.cos(dir);
  const sy   = c.by + (c.r - 1) * Math.sin(dir);
  const dist = Math.hypot(c.tx - sx, c.ty - sy);
  const nx   = -(c.ty - sy) / dist;
  const ny   =  (c.tx - sx) / dist;
  const bias = Math.sin(c.origIndex * 1.4) * 18;
  const c1x  = sx  + Math.cos(dir)    * (dist * 0.55) + nx * bias;
  const c1y  = sy  + Math.sin(dir)    * (dist * 0.55) + ny * bias;
  const c2x  = c.tx + Math.cos(c.phi_t) * (dist * 0.55) - nx * bias * 0.5;
  const c2y  = c.ty + Math.sin(c.phi_t) * (dist * 0.55) - ny * bias * 0.5;
  return `M ${sx.toFixed(1)} ${sy.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${c.tx.toFixed(1)} ${c.ty.toFixed(1)}`;
}

export default function LandingPage({ onScrollToChat, onSelectSamplePrompt }) {
  const rootRef          = useRef(null);
  const headlineRef      = useRef(null);
  const subtextRef       = useRef(null);
  const ctaButtonsRef    = useRef(null);
  const badgeRef         = useRef(null);
  const hubRef           = useRef(null);
  const rotatingWheelRef = useRef(null);
  const allNodesRef      = useRef([]);
  const basePathsRef     = useRef([]);
  const streamPathsRef   = useRef([]);

  /* ── 20 High-Tech Vector Illustration Icons ── */
  const abstractNodes = [
    { id: 'gmail',    title: 'Layanan CS 24/7 & Support',        className: 'w-11 h-11', style: { left: '5%',  top: '22%' }, bg: 'bg-white shadow-md border border-slate-200', content: <Shirt className="h-5 w-5 text-slate-800" /> },
    { id: 'drive',    title: 'Manajemen Bisnis & Katalog',       className: 'w-10 h-10', style: { left: '12%', top: '8%'  }, bg: 'bg-white shadow-md border border-slate-200', content: <Store className="h-5 w-5 text-[#9E7B66]" /> },
    { id: 'd2l',      title: 'Toko Retail & Butik Talaka',       className: 'w-13 h-13', style: { left: '2%',  top: '48%' }, bg: 'bg-slate-900 shadow-xl border border-slate-800', content: <ShoppingBag className="h-6 w-6 text-white" /> },
    { id: 'sheets',   title: 'Grafik Penjualan & Performa Stok', className: 'w-10 h-10', style: { left: '10%', top: '70%' }, bg: 'bg-white shadow-md border border-slate-200', content: <TrendingUp className="h-5 w-5 text-emerald-600" /> },
    { id: 'pdf',      title: 'Faktur & Struk Transaksi',         className: 'w-9 h-9',   style: { left: '17%', top: '84%' }, bg: 'bg-white shadow-sm border border-slate-200', content: <CreditCard className="h-4 w-4 text-[#9E7B66]" /> },
    { id: 'health',   title: 'Keamanan Transaksi & UU PDP',      className: 'w-8 h-8',   style: { left: '21%', top: '52%' }, bg: 'bg-white shadow-sm border border-slate-200', content: <ShieldCheck className="h-4 w-4 text-indigo-600" /> },
    { id: 'canvas',   title: 'Keranjang Belanja & Checkout',     className: 'w-12 h-12', style: { left: '20%', top: '14%' }, bg: 'bg-white shadow-md border border-slate-200', content: <ShoppingBag className="h-6 w-6 text-slate-800" /> },
    { id: 'notion',   title: 'Pusat Bantuan FAQ Toko',           className: 'w-10 h-10', style: { left: '32%', top: '4%'  }, bg: 'bg-white shadow-md border border-slate-200', content: <MessageCircle className="h-5 w-5 text-slate-800" /> },
    { id: 'code',     title: 'Pesanan Smartphone & E-Wallet',    className: 'w-8 h-8',   style: { left: '36%', top: '28%' }, bg: 'bg-slate-900 shadow-md', content: <Zap className="h-4 w-4 text-amber-400" /> },
    { id: 'gpt',      title: 'AI Brain Talaka — Teman Gaya',     className: 'w-14 h-14', style: { left: '47%', top: '2%'  }, bg: 'bg-slate-900 shadow-2xl ring-4 ring-slate-100', content: <Bot className="h-7 w-7 text-white" /> },
    { id: 'sparkle',  title: 'Fitur Pintar Fashion',             className: 'w-8 h-8',   style: { left: '43%', top: '14%' }, bg: 'bg-slate-50 shadow-sm border border-slate-200', content: <Sparkles className="h-4 w-4 text-[#9E7B66]" /> },
    { id: 'gemini',   title: 'Panduan Ukuran Presisi TB/BB',     className: 'w-11 h-11', style: { left: '58%', top: '8%'  }, bg: 'bg-white shadow-md border border-slate-200', content: <Ruler className="h-5 w-5 text-blue-600" /> },
    { id: 'claude',   title: 'Ulasan Kepuasan CSAT ≥ 4.2',       className: 'w-12 h-12', style: { left: '68%', top: '6%'  }, bg: 'bg-white shadow-md border border-slate-200', content: <Heart className="h-6 w-6 text-[#9E7B66]" /> },
    { id: 'discord',  title: 'Diskusi Gaya & Teman Ngobrol',     className: 'w-9 h-9',   style: { left: '64%', top: '32%' }, bg: 'bg-white shadow-sm border border-slate-200', content: <MessageCircle className="h-4 w-4 text-purple-600" /> },
    { id: 'teams',    title: 'Garansi Retur 7 Hari',             className: 'w-11 h-11', style: { left: '77%', top: '18%' }, bg: 'bg-white shadow-md border border-slate-200', content: <RefreshCw className="h-5 w-5 text-emerald-600" /> },
    { id: 'deepseek', title: 'Rekomendasi Akurat',        className: 'w-11 h-11', style: { left: '88%', top: '8%'  }, bg: 'bg-white shadow-md border border-slate-200', content: <CheckCircle2 className="h-5 w-5 text-slate-800" /> },
    { id: 'slack',    title: 'Pengiriman Kilat & COD',           className: 'w-10 h-10', style: { left: '83%', top: '44%' }, bg: 'bg-white shadow-md border border-slate-200', content: <Truck className="h-5 w-5 text-orange-600" /> },
    { id: 'hubspot',  title: 'Voucher Promo & Diskon',           className: 'w-11 h-11', style: { left: '92%', top: '58%' }, bg: 'bg-white shadow-md border border-slate-200', content: <Zap className="h-5 w-5 text-[#9E7B66]" /> },
    { id: 'figma',    title: 'Katalog Koleksi Busana',    className: 'w-9 h-9',   style: { left: '75%', top: '76%' }, bg: 'bg-white shadow-sm border border-slate-200', content: <Shirt className="h-4 w-4 text-purple-600" /> },
    { id: 'web',      title: 'Toko Web & Omnichannel',           className: 'w-9 h-9',   style: { left: '87%', top: '82%' }, bg: 'bg-white shadow-sm border border-slate-200', content: <Store className="h-4 w-4 text-slate-800" /> },
  ];

  /* ── GSAP Animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (hubRef.current) {
        tl.from(hubRef.current, { scale: 0.94, opacity: 0, y: 30, duration: 1.1, ease: 'back.out(1.15)' });
      }

      // 2. Rotating wheel (smooth continuous 34s rotation)
      if (rotatingWheelRef.current) {
        gsap.to(rotatingWheelRef.current, {
          rotation: 360, duration: 34, repeat: -1, ease: 'none', transformOrigin: '50% 50%',
        });
      }

      // 3. Stagger pulse cables
      streamPathsRef.current.forEach((path, i) => {
        if (!path) return;
        path.style.animationDuration = `${4.5 + (i % 9) * 0.4}s`;
        path.style.animationDelay   = `${-((i * 0.35) % 4.0).toFixed(2)}s`;
      });

      // 4. Live ticker for floating nodes + curved cables
      const updateCablesTick = () => {
        const t = gsap.ticker.time;
        for (let i = 0; i < cablesData.length; i++) {
          const c  = cablesData[i];
          const dx = Math.sin(t * c.freqX * 0.5 + c.phase) * c.ampX;
          const dy = Math.cos(t * c.freqY * 0.5 + c.phase) * c.ampY;

          const nodeEl = allNodesRef.current[c.origIndex];
          if (nodeEl) nodeEl.style.transform = `translate3d(${(dx * 0.65).toFixed(2)}px, ${(dy * 0.65).toFixed(2)}px, 0)`;

          const cx   = c.bx + dx * 0.65;
          const cy   = c.by + dy * 0.65;
          const dir  = Math.atan2(c.ty - cy, c.tx - cx);
          const sx   = cx + (c.r - 1) * Math.cos(dir);
          const sy   = cy + (c.r - 1) * Math.sin(dir);
          const dist = Math.hypot(c.tx - sx, c.ty - sy);
          const nx   = -(c.ty - sy) / dist;
          const ny   =  (c.tx - sx) / dist;
          const arcBias  = Math.sin(c.origIndex * 1.4) * 18;
          const liveW1   = Math.sin(t * 0.25 + i * 0.7) * 3.5;
          const liveW2   = Math.cos(t * 0.2  + i * 0.9) * 2.8;

          const c1x = sx  + Math.cos(dir)    * (dist * 0.55) + nx * (arcBias + liveW1);
          const c1y = sy  + Math.sin(dir)    * (dist * 0.55) + ny * (arcBias + liveW1);
          const c2x = c.tx + Math.cos(c.phi_t) * (dist * 0.55) - nx * ((arcBias + liveW2) * 0.5);
          const c2y = c.ty + Math.sin(c.phi_t) * (dist * 0.55) - ny * ((arcBias + liveW2) * 0.5);

          const dStr = `M ${sx.toFixed(1)} ${sy.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${c.tx.toFixed(1)} ${c.ty.toFixed(1)}`;
          if (basePathsRef.current[i])   basePathsRef.current[i].setAttribute('d', dStr);
          if (streamPathsRef.current[i]) streamPathsRef.current[i].setAttribute('d', dStr);
        }
      };

      gsap.ticker.add(updateCablesTick);
      return () => gsap.ticker.remove(updateCablesTick);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative w-full bg-white text-slate-900 selection:bg-slate-900 selection:text-white overflow-hidden">
      
      {/* Subtle High-Tech Background Grid & Radial Glows */}
      <div className="absolute inset-0 bg-tech-grid opacity-70 pointer-events-none -z-10" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-blue-50/50 via-slate-50/30 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-[#9E7B66]/5 blur-3xl rounded-full pointer-events-none -z-10" />

      {/* ═══════════════════════════ 1. NAVBAR (High-Tech Floating Pill) ═══════════════════════════ */}
      <header className="sticky top-4 z-50 mx-auto max-w-5xl px-4 sm:px-6">
        <nav className="flex items-center justify-between rounded-full border border-slate-200/90 bg-white/85 px-4 py-2.5 shadow-sm backdrop-blur-xl">
          {/* Brand Logo with Tala Kedip */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200/90 overflow-hidden shadow-xs p-0.5">
              <img src={talaKedip} alt="Talaka Mascot Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-slate-900">
                Talaka<span className="text-[#9E7B66]">.ai</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-600 border border-slate-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                v2.4
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#koleksi-3d" className="hover:text-slate-900 transition-colors">Koleksi 3D</a>
            <a href="#fitur-utama" className="hover:text-slate-900 transition-colors">Fitur AI</a>
            <a href="#manfaat-toko" className="hover:text-slate-900 transition-colors">Keunggulan</a>
            <a href="#perbandingan" className="hover:text-slate-900 transition-colors">Komparasi</a>
            <button
              type="button"
              onClick={onScrollToChat}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Demo Konsultasi
            </button>
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onScrollToChat}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-black transition-all cursor-pointer"
            >
              <Cpu className="h-3.5 w-3.5 text-[#9E7B66]" />
              <span>Mulai Chatbot</span>
            </button>
          </div>
        </nav>
      </header>

      {/* ═══════════════════════════ 2. HERO SECTION (100% RESTORED ROTATING HUB + CABLES) ═══════════════════════════ */}
      <section className="relative pt-12 pb-24 md:pt-16 md:pb-32 overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 flex flex-col items-center text-center">

          {/* 3D Rotating Shoe Showcase (Persis Foto 2) */}
          <ShoeShowcase
            onSelectSamplePrompt={onSelectSamplePrompt}
            onScrollToChat={onScrollToChat}
          />

          {/* ═══════════════════════════ CENTRAL ROTATING HUB (100% INTACT & RESTORED) ═══════════════════════════ */}
          <div
            ref={hubRef}
            className="relative mt-12 w-full max-w-[1000px] h-[520px] sm:h-[560px] flex items-center justify-center select-none"
          >
            {/* Background Arch SVG with S-Cable Connectors */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
              viewBox="0 0 1000 520"
              fill="none"
            >
              <defs>
                {/* Tech Radar Guides */}
                <radialGradient id="techCenterGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#9E7B66" stopOpacity="0.12" />
                  <stop offset="70%" stopColor="#0F172A" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Concentric Tech HUD Rings */}
              <circle cx="500" cy="520" r="230" className="arch-line" />
              <circle cx="500" cy="520" r="260" className="ring-dashed" />
              <circle cx="500" cy="520" r="290" className="arch-line" opacity="0.6" />
              <circle cx="500" cy="520" r="330" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="6 6" />

              {/* 20 Live S-Curve Guide Tracks */}
              {cablesData.map((c, i) => (
                <path
                  key={`base-${c.id}`}
                  ref={(el) => { basePathsRef.current[i] = el; }}
                  d={getInitialPath(c)}
                  className="connector-track"
                />
              ))}

              {/* 20 Animated Pulse Flows */}
              {cablesData.map((c, i) => (
                <path
                  key={`pulse-${c.id}`}
                  ref={(el) => { streamPathsRef.current[i] = el; }}
                  d={getInitialPath(c)}
                  className="connector-pulse"
                  stroke={c.color}
                />
              ))}
            </svg>

            {/* 20 High-Tech Vector Floating Nodes */}
            {abstractNodes.map((node, i) => (
              <div
                key={node.id}
                ref={(el) => { allNodesRef.current[i] = el; }}
                style={node.style}
                title={node.title}
                onClick={() => {
                  onSelectSamplePrompt?.(`Mau tanya soal ${node.title}`);
                  onScrollToChat();
                }}
                className={`node-card ${node.className} ${node.bg}`}
              >
                {node.content}
              </div>
            ))}

            {/* Rotating Wheel Hub at Center Bottom */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col items-center pointer-events-auto">
              <div className="relative w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] flex items-center justify-center">
                
                {/* Tech Radar Pulse Disk */}
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(241,245,249,0.8)_0%,rgba(255,255,255,0)_70%)] pointer-events-none" />

                {/* Rotating segmented wheel (34s smooth rotation) */}
                <div
                  ref={rotatingWheelRef}
                  className="absolute inset-0 rounded-full border border-slate-200/90 shadow-lg shadow-slate-900/5 bg-white/70 backdrop-blur-xs flex items-center justify-center will-change-transform"
                >
                  {/* Concentric inner rings */}
                  <div className="absolute w-[82%] h-[82%] rounded-full border border-dashed border-slate-300/80" />
                  <div className="absolute w-[64%] h-[64%] rounded-full border border-slate-200" />
                  <div className="absolute w-[46%] h-[46%] rounded-full border border-dashed border-slate-200" />

                  {/* Radial Divider Spokes */}
                  <div className="absolute w-full h-[1px] bg-slate-200/80" />
                  <div className="absolute w-full h-[1px] bg-slate-200/80 rotate-60" />
                  <div className="absolute w-full h-[1px] bg-slate-200/80 rotate-120" />

                  {/* 6 Feature Badges on Rotating Disk */}
                  {/* Seg 1 Top: Ukuran TB/BB */}
                  <div onClick={() => { onSelectSamplePrompt?.('TB saya 160 cm BB 52 kg, cocok kemeja ukuran apa ya?'); onScrollToChat(); }}
                    className="absolute left-1/2 -translate-x-1/2 top-3 flex flex-col items-center cursor-pointer hover:scale-110 transition-transform group"
                    title="Konsultasi ukuran dari TB/BB">
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white shadow-sm border border-slate-200 group-hover:border-slate-900 transition-colors">
                      <Ruler className="h-3 w-3 text-blue-600" />
                      <span className="text-[9.5px] font-extrabold text-slate-900">Ukuran TB/BB</span>
                    </div>
                    <span className="mt-0.5 text-[8.5px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 rounded-full">Anti-Salah Size</span>
                  </div>

                  {/* Seg 2 Top-Right: Gaya Jujur */}
                  <div onClick={() => { onSelectSamplePrompt?.('Kalau aku pakai celana kulot high-waist krem cocok nggak? TB 155'); onScrollToChat(); }}
                    className="absolute right-5 top-20 flex flex-col items-center rotate-45 cursor-pointer hover:scale-110 transition-transform group"
                    title="Penilaian gaya jujur">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white shadow-sm border border-slate-200 group-hover:border-slate-900 transition-colors">
                      <Heart className="h-3 w-3 text-[#9E7B66]" />
                      <span className="text-[9.5px] font-extrabold text-slate-900">Gaya Jujur</span>
                    </div>
                    <span className="mt-0.5 text-[8.5px] font-mono font-bold text-[#9E7B66] bg-slate-100 px-1.5 rounded-full">Bukan Asal Puji</span>
                  </div>

                  {/* Seg 3 Bottom-Right: Cek Stok */}
                  <div onClick={() => { onSelectSamplePrompt?.('Kemeja linen putih ukuran M masih ada? Cek stok dong kak!'); onScrollToChat(); }}
                    className="absolute right-5 bottom-20 flex flex-col items-center rotate-135 cursor-pointer hover:scale-110 transition-transform group"
                    title="Cek ketersediaan stok">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white shadow-sm border border-slate-200 group-hover:border-slate-900 transition-colors">
                      <Package className="h-3 w-3 text-emerald-600" />
                      <span className="text-[9.5px] font-extrabold text-slate-900">Cek Stok</span>
                    </div>
                    <span className="mt-0.5 text-[8.5px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 rounded-full">Real-Time</span>
                  </div>

                  {/* Seg 4 Bottom: FAQ 24/7 */}
                  <div onClick={() => { onSelectSamplePrompt?.('Bisa COD gak? Berapa ongkir pengiriman ke kotaku?'); onScrollToChat(); }}
                    className="absolute left-1/2 -translate-x-1/2 bottom-3 flex flex-col items-center rotate-180 cursor-pointer hover:scale-110 transition-transform group"
                    title="FAQ &amp; ongkir 24/7">
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white shadow-sm border border-slate-200 group-hover:border-slate-900 transition-colors">
                      <MessageCircle className="h-3 w-3 text-slate-800" />
                      <span className="text-[9.5px] font-extrabold text-slate-900">FAQ 24/7</span>
                    </div>
                    <span className="mt-0.5 text-[8.5px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 rounded-full">&lt; 5 Detik</span>
                  </div>

                  {/* Seg 5 Bottom-Left: Padu Padan */}
                  <div onClick={() => { onSelectSamplePrompt?.('Tolong buatin padu padan OOTD yang cocok buat acara kondangan semi-formal!'); onScrollToChat(); }}
                    className="absolute left-5 bottom-20 flex flex-col items-center -rotate-135 cursor-pointer hover:scale-110 transition-transform group"
                    title="Padu padan outfit">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white shadow-sm border border-slate-200 group-hover:border-slate-900 transition-colors">
                      <Sparkles className="h-3 w-3 text-[#9E7B66]" />
                      <span className="text-[9.5px] font-extrabold text-slate-900">Padu Padan</span>
                    </div>
                    <span className="mt-0.5 text-[8.5px] font-mono font-bold text-[#9E7B66] bg-slate-100 px-1.5 rounded-full">OOTD Lengkap</span>
                  </div>

                  {/* Seg 6 Top-Left: Detail Produk */}
                  <div onClick={() => { onSelectSamplePrompt?.('Kain kemeja linen Talaka bahannya adem dan lembut gak? Cara perawatannya gimana?'); onScrollToChat(); }}
                    className="absolute left-5 top-20 flex flex-col items-center -rotate-45 cursor-pointer hover:scale-110 transition-transform group"
                    title="Detail bahan &amp; produk">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white shadow-sm border border-slate-200 group-hover:border-slate-900 transition-colors">
                      <Shirt className="h-3 w-3 text-slate-800" />
                      <span className="text-[9.5px] font-extrabold text-slate-900">Detail Produk</span>
                    </div>
                    <span className="mt-0.5 text-[8.5px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 rounded-full">Jujur &amp; Rinci</span>
                  </div>
                </div>

                {/* Static center Talaka Neural Core (Tepat di Tengah Lingkaran Roda) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30 pointer-events-auto">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-white shadow-2xl shadow-slate-900/10 border-2 border-slate-200 ring-4 ring-slate-100 hover:scale-110 transition-transform overflow-hidden p-1.5">
                      <img src={talaKedip} alt="Tala Core Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[10px] font-black tracking-wider text-slate-900 bg-white/95 backdrop-blur-md px-3 py-0.5 rounded-full border border-slate-200 shadow-xs flex items-center gap-1 font-mono">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      TALAKA_CORE
                    </span>
                  </div>
                </div>
              </div>

              {/* Fade gradient at bottom in Pure White */}
              <div className="w-[400px] sm:w-[540px] h-16 sm:h-20 -mt-8 bg-gradient-to-b from-transparent via-white/80 to-white pointer-events-none z-30" />
            </div>

            {/* Quick hook ticker */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-40 hidden sm:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-md text-xs font-semibold text-slate-800">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-slate-900 font-bold">[INTERACTIVE]:</span>
              <span className="text-slate-600 hover:text-slate-900 cursor-pointer">Ukuran TB/BB</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 hover:text-slate-900 cursor-pointer">Gaya Jujur</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 hover:text-slate-900 cursor-pointer">Cek Stok</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 hover:text-slate-900 cursor-pointer">Padu Padan</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ 3. FEATURES (High-Tech 3 Bento Cards) ═══════════════════════════ */}
      <section id="fitur-utama" className="relative py-24 bg-slate-50/70 border-t border-slate-200/80">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          {/* Section Pill */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-mono font-semibold text-slate-700 shadow-2xs">
              <Cpu className="w-3.5 h-3.5 text-[#9E7B66]" />
              CORE_CAPABILITIES
            </span>
          </div>
          <h2 className="mt-4 text-center text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Infrastruktur Fashion AI Tercanggih<br />
            <span className="text-[#9E7B66]">Cegah Retur &amp; Bangun Loyalitas Nyata</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-slate-600 leading-relaxed font-normal">
            Kombinasi algoritma pemetaan proporsi tubuh, review objektivitas bahan, dan sinkronisasi stok real-time.
          </p>

          {/* 3 Bento Cards Layout */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Biometric Sizing Matrix */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                    MATRIX_TB_BB
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-600">
                    99.4% ACCURACY
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-2">Panduan Ukuran TB &amp; BB</h3>
                <p className="text-xs text-slate-600 mt-1">Cegah salah ukuran sejak sebelum checkout dengan evaluasi size chart presisi.</p>
              </div>

              {/* Telemetry Match Mockup */}
              <div className="space-y-2 rounded-2xl bg-slate-50 border border-slate-200/80 p-3 text-xs">
                <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200/60 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 text-[11px] font-bold text-white">S</span>
                    <div>
                      <p className="font-bold text-slate-900">Kemeja Linen Talaka</p>
                      <p className="text-[10px] font-mono text-slate-500">TB 154cm · BB 47kg</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">MATCH_FIT</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200/60 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 text-[11px] font-bold text-white">M</span>
                    <div>
                      <p className="font-bold text-slate-900">Celana Kulot High-Waist</p>
                      <p className="text-[10px] font-mono text-slate-500">TB 162cm · BB 54kg</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">OPTIMAL</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200/60 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 text-[11px] font-bold text-white">L</span>
                    <div>
                      <p className="font-bold text-slate-900">Outer Boxy Knit</p>
                      <p className="text-[10px] font-mono text-slate-500">TB 168cm · BB 62kg</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">PERFECT_FIT</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { onSelectSamplePrompt?.('TB saya 160 cm, BB 52 kg. Cocok ukuran apa ya?'); onScrollToChat(); }}
                  className="text-xs font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Cek Ukuran Tubuhmu</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2: Stylist Neural Engine (Gaya & Kejujuran) */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                    HONEST_EVALUATOR
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#9E7B66]">
                    GYA-13 PROTOCOL
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-2">Konsultasi Gaya &amp; Kejujuran</h3>
                <p className="text-xs text-slate-600 mt-1">Bukan sekadar memuji semua bagus, tapi memberi evaluasi proporsi pakaian yang solutif.</p>
              </div>

              {/* Diagnostic Telemetry Mockup */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 text-xs space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center">
                    <Shirt className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Kemeja Linen + Kulot High-Waist</p>
                    <p className="text-[10px] font-mono text-slate-500">Kombinasi Casual Kuliah / Kantor</p>
                  </div>
                </div>

                <div className="rounded-xl bg-white p-3 border border-slate-200/80 text-[11px] leading-relaxed text-slate-800 shadow-2xs">
                  <span className="font-mono font-bold text-[#9E7B66]">[DIAGNOSTIK]: </span>
                  Kemeja berpotongan lurus; masukkan ke celana high-waist agar proporsi kaki tampak jenjang dan tidak terlihat kedodoran.
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { onSelectSamplePrompt?.('Aku mau tampil rapi tapi santai buat ngampus. Gaya apa yang pas?'); onScrollToChat(); }}
                  className="text-xs font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Minta Saran Padu Padan</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Card 3: Telemetry & Return Reduction (-24%) */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                    STOCK_TELEMETRY
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-600">
                    LIVE_SYNC
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-2">Retur Turun &amp; Stok Akurat</h3>
                <p className="text-xs text-slate-600 mt-1">Data stok varian terhubung langsung ke mesin inferensi 24/7 tanpa delay.</p>
              </div>

              {/* High-Tech Telemetry Chart */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 text-xs">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-900 mb-2">
                  <span className="font-mono text-slate-600">TINGKAT_RETUR</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-mono font-bold">-24.0% DROP</span>
                </div>

                <svg className="w-full h-20 overflow-visible" viewBox="0 0 200 60" fill="none">
                  <line x1="0" y1="50" x2="200" y2="50" stroke="#E2E8F0" strokeDasharray="3 3" />
                  <line x1="0" y1="25" x2="200" y2="25" stroke="#E2E8F0" strokeDasharray="3 3" />
                  <path d="M 0 45 Q 50 40 100 20 T 200 10" stroke="#0F172A" strokeWidth="2.5" />
                  <path d="M 0 52 Q 60 48 110 32 T 200 22" stroke="#9E7B66" strokeWidth="2" strokeDasharray="4 3" />
                </svg>

                <div className="flex justify-between font-mono text-[9px] text-slate-400 pt-1.5 border-t border-slate-200">
                  <span>BASELINE</span>
                  <span>30_DAYS</span>
                  <span>AI_ACTIVE</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { onSelectSamplePrompt?.('Kemeja linen putih ukuran M masih ready stok gak?'); onScrollToChat(); }}
                  className="text-xs font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Cek Ketersediaan Stok</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════ 4. BENEFITS (High-Tech Bento Grid) ═══════════════════════════ */}
      <section id="manfaat-toko" className="relative py-24 bg-white border-t border-slate-200/80">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-mono font-semibold text-slate-700">
              <Terminal className="w-3.5 h-3.5 text-[#9E7B66]" />
              SYSTEM_ADVANTAGES
            </span>
          </div>
          <h2 className="mt-4 text-center text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Arsitektur Otomasi yang Mendorong Konversi Toko
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-slate-600 leading-relaxed font-normal">
            Menghemat beban kerja tim operasional hingga 80% sembari memberikan pengalaman belanja VIP bagi setiap pengunjung.
          </p>

          {/* 6 Bento Grid Cards */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* Card 1: Funnel Resolution */}
            <div className="rounded-3xl border border-slate-200/90 bg-slate-50/70 p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="rounded-2xl bg-white border border-slate-200/80 p-4 flex flex-col items-center shadow-2xs">
                  <div className="w-36 h-2 rounded-full bg-slate-200" />
                  <div className="w-24 h-2 rounded-full bg-[#9E7B66] mt-1.5" />
                  <div className="w-14 h-2 rounded-full bg-slate-900 mt-1.5" />
                  <div className="flex items-center gap-1.5 mt-3 text-xs font-mono font-bold text-slate-900">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>≥ 70% AUTO_RESOLVED</span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900">Pertanyaan Berulang Terjawab Instan</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Pertanyaan FAQ ongkir, bahan, COD, jam operasional, dan ketersediaan stok selesai langsung tanpa membuat admin kewalahan.
                </p>
              </div>
            </div>

            {/* Card 2: Low-Latency Soundwave */}
            <div className="rounded-3xl border border-slate-200/90 bg-slate-50/70 p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-900 mb-2">
                    <span className="text-slate-500">INFERENCE_SPEED</span>
                    <span className="text-emerald-600">&lt; 5 DETIK</span>
                  </div>
                  {/* Equalizer bars */}
                  <div className="flex items-end justify-center gap-1.5 h-12">
                    {[30, 65, 45, 95, 75, 100, 80, 55, 70, 90, 40, 65, 85].map((h, i) => (
                      <span
                        key={i}
                        style={{ height: `${h}%` }}
                        className="w-1.5 rounded-full bg-slate-900"
                      />
                    ))}
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900">Pelayanan Kilat Tanpa Antre</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Pelanggan tidak kabur ke toko sebelah karena pertanyaan dijawab seketika bahkan saat jam tengah malam.
                </p>
              </div>
            </div>

            {/* Card 3: Cryptographic Privacy UU PDP */}
            <div className="rounded-3xl border border-slate-200/90 bg-slate-50/70 p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="rounded-2xl bg-white border border-slate-200/80 p-4 flex flex-col items-center justify-center text-center shadow-2xs">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white mb-2 shadow-xs">
                    <ShieldCheck className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-900">UU_PDP_2022 COMPLIANT</span>
                  <span className="text-[10px] text-slate-500">Data biometrik ukuran tubuh terenkripsi</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Privasi &amp; Keamanan Terjamin</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Pelanggan merasa aman membagikan tinggi badan, berat badan, atau foto outfit karena data dijaga ketat.
                </p>
              </div>
            </div>

            {/* Card 4: High Conversion Checkout */}
            <div className="rounded-3xl border border-slate-200/90 bg-slate-50/70 p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="rounded-2xl bg-white border border-slate-200/80 p-3 text-xs space-y-1.5 shadow-2xs">
                  <div className="flex justify-between text-slate-900 font-bold">
                    <span>Keranjang Belanja</span>
                    <span className="font-mono text-[11px] text-[#9E7B66]">1_ITEM</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>Kemeja Linen (M / Beige)</span>
                    <span className="font-mono font-bold text-slate-900">Rp249.000</span>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ✓ UKURAN_M VALIDATED (TB/BB)
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900">Konversi Belanja Lebih Mantap</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Pelanggan tidak lagi ragu klik checkout karena rekomendasi ukuran sudah divalidasi dan pas di badan.
                </p>
              </div>
            </div>

            {/* Card 5: High-Tech Callout Terminal Card */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 text-white p-7 shadow-xl flex flex-col justify-between md:col-span-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold bg-white/10 text-emerald-400 border border-white/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE_SANDBOX
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">READY</span>
                </div>
                <h3 className="text-lg font-bold text-white">Buktikan Sendiri Chatbot Talaka AI</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Eksplorasi simulasi percakapan interaktif, konsultasi ukuran, hingga fitur Virtual Try-On langsung di studio bawah.
                </p>
              </div>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={onScrollToChat}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-bold text-slate-950 hover:bg-slate-100 transition-all cursor-pointer shadow-md"
                >
                  <Cpu className="h-4 w-4 text-[#9E7B66]" />
                  <span>Buka Studio Konsultasi</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════ 5. HIGH-TECH COMPARISON TABLE ═══════════════════════════ */}
      <section id="perbandingan" className="relative py-24 bg-slate-50/70 border-t border-slate-200/80">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 items-start">
            
            {/* Left side: Heading */}
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-mono font-semibold text-slate-700 shadow-2xs">
                BENCHMARK_MATRIX
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">
                Kenapa Talaka Jauh Lebih Unggul dari Chatbot Standar
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Chatbot tradisional hanya mengirimkan jawaban teks kaku atau PDF tabel ukuran yang membingungkan. Talaka AI dirancang dengan pemahaman siluet busana dan empati pakaian yang presisi.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onScrollToChat}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-black transition-all cursor-pointer shadow-sm"
                >
                  <span>Coba di Interactive Demo</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right side: High-Tech Comparison Table Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 font-mono">
                    <th className="pb-3.5 font-bold text-slate-900">FITUR &amp; SPESIFIKASI</th>
                    <th className="pb-3.5 font-bold text-slate-500 text-center w-28">BOT_STANDAR</th>
                    <th className="pb-3.5 font-bold text-slate-900 text-center w-36 bg-slate-100 rounded-t-xl">TALAKA_AI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3.5 font-medium text-slate-800">Rekomendasi Ukuran Presisi TB/BB</td>
                    <td className="py-3.5 text-center"><XCircle className="h-4 w-4 text-rose-500 inline-block" /></td>
                    <td className="py-3.5 text-center bg-slate-100"><CheckCircle2 className="h-4 w-4 text-emerald-600 inline-block" /></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-medium text-slate-800">Kejujuran Karakter Bahan &amp; Siluet</td>
                    <td className="py-3.5 text-center"><XCircle className="h-4 w-4 text-rose-500 inline-block" /></td>
                    <td className="py-3.5 text-center bg-slate-100"><CheckCircle2 className="h-4 w-4 text-emerald-600 inline-block" /></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-medium text-slate-800">Cek Ketersediaan Stok Real-Time</td>
                    <td className="py-3.5 text-center"><XCircle className="h-4 w-4 text-rose-500 inline-block" /></td>
                    <td className="py-3.5 text-center bg-slate-100"><CheckCircle2 className="h-4 w-4 text-emerald-600 inline-block" /></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-medium text-slate-800">Fitur Virtual Try-On Foto Baju</td>
                    <td className="py-3.5 text-center"><XCircle className="h-4 w-4 text-rose-500 inline-block" /></td>
                    <td className="py-3.5 text-center bg-slate-100"><CheckCircle2 className="h-4 w-4 text-emerald-600 inline-block" /></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-medium text-slate-800">Eskalasi Mulus ke Admin Manusia</td>
                    <td className="py-3.5 text-center"><XCircle className="h-4 w-4 text-rose-500 inline-block" /></td>
                    <td className="py-3.5 text-center bg-slate-100"><CheckCircle2 className="h-4 w-4 text-emerald-600 inline-block" /></td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-medium text-slate-800">Garansi Retur 7 Hari &amp; Panduan Toko</td>
                    <td className="py-3.5 text-center text-slate-500 font-mono">MANUAL</td>
                    <td className="py-3.5 text-center bg-slate-100 font-bold text-emerald-700 rounded-b-xl font-mono">DIPANDU_PENUH</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
