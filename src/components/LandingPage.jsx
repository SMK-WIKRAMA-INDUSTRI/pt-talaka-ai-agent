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
  Star,
  Tag,
  Camera,
  Palette,
  Search,
  Gift,
  MapPin,
  Headphones,
  BarChart2,
  Lock,
  Bell,
  Compass,
  Flame,
} from 'lucide-react';
import ShoeShowcase from './ShoeShowcase';
import ProductCatalogSection from './ProductCatalogSection';
import OmnichannelSection from './OmnichannelSection';
import talaKedip from '../assets/ekspresi/tala-kedip.svg';
import { GlyphBackground } from './ui/backgrounds-glyph';

/* ─────────────────────────────────────────────────────────────
   45 CALIBRATED HIGH-TECH VIBRANT NODE CABLES (Full-Canvas Edge-to-Edge)
   ───────────────────────────────────────────────────────────── */
const cablesData = [
  /* ── LEFT SIDE (From bottom to top, phi_t from -3.08 to -1.60) ── */
  { id: 'truck',    name: 'Ekspedisi Kilat & COD',     color: '#F97316', origIndex: 19, bx: 70,   by: 442, r: 20, tx: 471, ty: 506, phi_t: -3.08, ampX: 2.5, ampY: 3.1, freqX: 1.3, freqY: 1.0, phase: 0.1, },
  { id: 'mappin',   name: 'Lokasi Kurir Pengiriman',   color: '#EF4444', origIndex: 15, bx: 28,   by: 343, r: 18, tx: 472, ty: 499, phi_t: -3.05, ampX: 2.2, ampY: 3.5, freqX: 1.5, freqY: 1.2, phase: 0.3, },
  { id: 'compass',  name: 'Panduan Rekomendasi Gaya',  color: '#2563EB', origIndex: 20, bx: 238,  by: 432, r: 18, tx: 473, ty: 483, phi_t: -2.98, ampX: 2.8, ampY: 3.2, freqX: 1.4, freqY: 1.1, phase: 0.6, },
  { id: 'bell',     name: 'Notifikasi Pesanan Kilat',  color: '#F59E0B', origIndex: 0,  bx: 14,   by: 31,  r: 18, tx: 475, ty: 476, phi_t: -2.95, ampX: 2.6, ampY: 3.6, freqX: 1.4, freqY: 1.1, phase: 0.8, },
  { id: 'palette',  name: 'Padu Padan Warna Outfit',   color: '#EC4899', origIndex: 16, bx: 154,  by: 338, r: 18, tx: 475, ty: 476, phi_t: -2.95, ampX: 2.4, ampY: 3.4, freqX: 1.2, freqY: 1.3, phase: 1.0, },
  { id: 'gift',     name: 'Hadiah & Poin Member',      color: '#F43F5E', origIndex: 21, bx: 392,  by: 416, r: 18, tx: 478, ty: 461, phi_t: -2.88, ampX: 2.8, ampY: 3.4, freqX: 1.2, freqY: 1.3, phase: 1.3, },
  { id: 'store',    name: 'Manajemen Butik Talaka',    color: '#9E7B66', origIndex: 1,  bx: 112,  by: 21,  r: 20, tx: 480, ty: 454, phi_t: -2.85, ampX: 3.0, ampY: 3.5, freqX: 1.1, freqY: 1.4, phase: 1.5, },
  { id: 'heart',    name: 'Wishlist & Favorit OOTD',   color: '#EC4899', origIndex: 17, bx: 280,  by: 333, r: 20, tx: 480, ty: 454, phi_t: -2.85, ampX: 2.2, ampY: 3.2, freqX: 1.5, freqY: 1.0, phase: 1.8, },
  { id: 'cs24',     name: 'Layanan CS 24/7 Support',   color: '#0EA5E9', origIndex: 2,  bx: 238,  by: 42,  r: 22, tx: 488, ty: 432, phi_t: -2.75, ampX: 2.8, ampY: 3.2, freqX: 1.4, freqY: 1.1, phase: 2.0, },
  { id: 'clock',    name: 'Respon Cepat < 5 Detik',    color: '#64748B', origIndex: 18, bx: 420,  by: 317, r: 18, tx: 488, ty: 432, phi_t: -2.75, ampX: 2.0, ampY: 3.0, freqX: 1.3, freqY: 1.2, phase: 2.3, },
  { id: 'cart',     name: 'Keranjang & Checkout',      color: '#F59E0B', origIndex: 3,  bx: 364,  by: 21,  r: 22, tx: 498, ty: 411, phi_t: -2.65, ampX: 2.8, ampY: 4.0, freqX: 1.2, freqY: 1.3, phase: 2.5, },
  { id: 'faq',      name: 'Pusat Bantuan FAQ',         color: '#06B6D4', origIndex: 4,  bx: 476,  by: 42,  r: 20, tx: 509, ty: 392, phi_t: -2.55, ampX: 3.2, ampY: 3.2, freqX: 1.5, freqY: 1.1, phase: 2.8, },
  { id: 'lock',     name: 'Privasi & Enkripsi Data',   color: '#8B5CF6', origIndex: 5,  bx: 14,   by: 125, r: 18, tx: 523, ty: 374, phi_t: -2.45, ampX: 2.2, ampY: 3.8, freqX: 1.2, freqY: 1.3, phase: 3.1, },
  { id: 'shield',   name: 'Keamanan Transaksi UU PDP', color: '#6366F1', origIndex: 6,  bx: 126,  by: 114, r: 18, tx: 537, ty: 358, phi_t: -2.36, ampX: 2.4, ampY: 4.2, freqX: 1.6, freqY: 1.5, phase: 3.4, },
  { id: 'sparkle',  name: 'Fitur Pintar Fashion AI',   color: '#9E7B66', origIndex: 7,  bx: 252,  by: 135, r: 18, tx: 554, ty: 342, phi_t: -2.26, ampX: 2.0, ampY: 3.6, freqX: 1.6, freqY: 1.1, phase: 3.7, },
  { id: 'card',     name: 'Faktur & Struk Digital',    color: '#9E7B66', origIndex: 8,  bx: 378,  by: 120, r: 18, tx: 572, ty: 329, phi_t: -2.16, ampX: 2.0, ampY: 3.0, freqX: 1.2, freqY: 0.9, phase: 4.0, },
  { id: 'zap',      name: 'Pesanan Kilat E-Wallet',    color: '#EAB308', origIndex: 9,  bx: 504,  by: 94,  r: 18, tx: 592, ty: 317, phi_t: -2.06, ampX: 2.2, ampY: 4.8, freqX: 1.4, freqY: 1.5, phase: 4.3, },
  { id: 'bag',      name: 'Koleksi Retail Talaka',     color: '#6366F1', origIndex: 10, bx: 14,   by: 229, r: 24, tx: 613, ty: 307, phi_t: -1.96, ampX: 3.2, ampY: 4.5, freqX: 1.3, freqY: 1.0, phase: 4.6, },
  { id: 'chart',    name: 'Grafik Omset & Stok',       color: '#10B981', origIndex: 11, bx: 126,  by: 218, r: 20, tx: 635, ty: 299, phi_t: -1.86, ampX: 2.6, ampY: 3.6, freqX: 1.4, freqY: 1.1, phase: 4.9, },
  { id: 'tag',      name: 'Voucher & Diskon Promo',    color: '#84CC16', origIndex: 12, bx: 252,  by: 234, r: 18, tx: 657, ty: 294, phi_t: -1.76, ampX: 2.8, ampY: 3.4, freqX: 1.2, freqY: 1.3, phase: 5.2, },
  { id: 'activity', name: 'Monitor Transaksi',         color: '#0891B2', origIndex: 13, bx: 378,  by: 218, r: 18, tx: 675, ty: 291, phi_t: -1.68, ampX: 2.3, ampY: 3.8, freqX: 1.6, freqY: 1.4, phase: 5.5, },
  { id: 'camera',   name: 'Virtual Try-On AI',         color: '#8B5CF6', origIndex: 14, bx: 504,  by: 198, r: 20, tx: 693, ty: 290, phi_t: -1.60, ampX: 2.8, ampY: 3.9, freqX: 1.4, freqY: 1.2, phase: 5.8, },

  /* ── CENTER TOP ── */
  { id: 'ai',       name: 'AI Brain Talaka Core',      color: '#3B82F6', origIndex: 22, bx: 686,  by: 5,   r: 26, tx: 700, ty: 290, phi_t: -1.57, ampX: 2.6, ampY: 4.2, freqX: 1.1, freqY: 1.2, phase: 6.0, },

  /* ── RIGHT SIDE (From top to bottom, phi_t from -1.48 to -0.06) ── */
  { id: 'search',   name: 'Pencarian Produk Cerdas',   color: '#2563EB', origIndex: 23, bx: 882,  by: 73,  r: 18, tx: 721, ty: 291, phi_t: -1.48, ampX: 2.4, ampY: 3.8, freqX: 1.3, freqY: 1.4, phase: 6.3, },
  { id: 'check2',   name: 'Stok Real-Time',            color: '#0D9488', origIndex: 28, bx: 882,  by: 198, r: 20, tx: 739, ty: 293, phi_t: -1.40, ampX: 2.6, ampY: 4.5, freqX: 1.4, freqY: 1.4, phase: 6.6, },
  { id: 'ruler',    name: 'Panduan Ukuran TB/BB',      color: '#3B82F6', origIndex: 24, bx: 994,  by: 21,  r: 22, tx: 743, ty: 294, phi_t: -1.38, ampX: 3.4, ampY: 4.6, freqX: 1.2, freqY: 1.3, phase: 6.9, },
  { id: 'retur',    name: 'Garansi Retur 7 Hari',      color: '#10B981', origIndex: 25, bx: 1120, by: 42,  r: 22, tx: 766, ty: 300, phi_t: -1.28, ampX: 3.2, ampY: 4.2, freqX: 1.6, freqY: 1.3, phase: 7.2, },
  { id: 'check',    name: 'Rekomendasi Akurat',        color: '#16A34A', origIndex: 26, bx: 1246, by: 21,  r: 22, tx: 788, ty: 308, phi_t: -1.18, ampX: 2.5, ampY: 4.0, freqX: 1.2, freqY: 1.3, phase: 7.5, },
  { id: 'star',     name: 'Ulasan Kepuasan CSAT',      color: '#F59E0B', origIndex: 27, bx: 1358, by: 31,  r: 22, tx: 809, ty: 318, phi_t: -1.08, ampX: 2.2, ampY: 3.2, freqX: 1.5, freqY: 1.0, phase: 7.8, },
  { id: 'shirt',    name: 'Katalog Koleksi Lengkap',   color: '#A855F7', origIndex: 29, bx: 1008, by: 120, r: 20, tx: 828, ty: 329, phi_t: -0.98, ampX: 2.2, ampY: 4.4, freqX: 1.5, freqY: 1.2, phase: 8.1, },
  { id: 'flame',    name: 'Tren Busana Viral 2026',    color: '#EA580C', origIndex: 30, bx: 1134, by: 135, r: 18, tx: 847, ty: 343, phi_t: -0.88, ampX: 2.8, ampY: 3.6, freqX: 1.4, freqY: 1.4, phase: 8.4, },
  { id: 'sliders',  name: 'Filter Bahan & Potongan',   color: '#2563EB', origIndex: 31, bx: 1260, by: 114, r: 18, tx: 864, ty: 358, phi_t: -0.78, ampX: 2.8, ampY: 3.6, freqX: 1.3, freqY: 1.2, phase: 8.7, },
  { id: 'barstat',  name: 'Statistik & Laporan Toko',  color: '#14B8A6', origIndex: 32, bx: 1372, by: 125, r: 18, tx: 880, ty: 375, phi_t: -0.68, ampX: 2.6, ampY: 3.5, freqX: 1.3, freqY: 1.5, phase: 9.0, },
  { id: 'web',      name: 'Toko Web & Omnichannel',    color: '#64748B', origIndex: 33, bx: 994,  by: 218, r: 18, tx: 893, ty: 394, phi_t: -0.58, ampX: 2.8, ampY: 3.8, freqX: 1.3, freqY: 1.5, phase: 9.3, },
  { id: 'activity2',name: 'Padu Padan Koleksi Baru',   color: '#D946EF', origIndex: 34, bx: 1120, by: 234, r: 18, tx: 904, ty: 414, phi_t: -0.48, ampX: 2.4, ampY: 3.4, freqX: 1.5, freqY: 1.1, phase: 9.6, },
  { id: 'cpu',      name: 'Algoritma Talaka Engine',   color: '#475569', origIndex: 37, bx: 952,  by: 317, r: 18, tx: 912, ty: 431, phi_t: -0.40, ampX: 2.2, ampY: 3.2, freqX: 1.2, freqY: 1.4, phase: 9.9, },
  { id: 'chart2',   name: 'Performa Analitik Bisnis',  color: '#D97706', origIndex: 35, bx: 1246, by: 218, r: 20, tx: 914, ty: 435, phi_t: -0.38, ampX: 3.0, ampY: 3.2, freqX: 1.5, freqY: 1.1, phase: 10.2, },
  { id: 'layers',   name: 'Mix & Match Layering',      color: '#8B5CF6', origIndex: 36, bx: 1372, by: 229, r: 18, tx: 921, ty: 457, phi_t: -0.28, ampX: 2.5, ampY: 3.5, freqX: 1.4, freqY: 1.2, phase: 10.5, },
  { id: 'gift2',    name: 'Gratis Ongkir Se-Indonesia',color: '#F43F5E', origIndex: 41, bx: 980,  by: 416, r: 18, tx: 923, ty: 461, phi_t: -0.26, ampX: 2.6, ampY: 3.4, freqX: 1.3, freqY: 1.1, phase: 10.8, },
  { id: 'store2',   name: 'Outlet Mitra Butik',        color: '#9E7B66', origIndex: 38, bx: 1078, by: 338, r: 18, tx: 919, ty: 452, phi_t: -0.30, ampX: 2.8, ampY: 3.2, freqX: 1.1, freqY: 1.3, phase: 11.1, },
  { id: 'tag2',     name: 'Flash Sale & Promo Kilat',  color: '#84CC16', origIndex: 39, bx: 1218, by: 343, r: 18, tx: 925, ty: 474, phi_t: -0.20, ampX: 2.4, ampY: 3.6, freqX: 1.4, freqY: 1.2, phase: 11.4, },
  { id: 'truck2',   name: 'Tracking Paket Real-Time',  color: '#F97316', origIndex: 42, bx: 1134, by: 437, r: 18, tx: 927, ty: 483, phi_t: -0.16, ampX: 2.8, ampY: 3.2, freqX: 1.5, freqY: 1.0, phase: 11.7, },
  { id: 'heart2',   name: 'Pilihan Editor Fashion',    color: '#EC4899', origIndex: 40, bx: 1358, by: 354, r: 18, tx: 929, ty: 497, phi_t: -0.10, ampX: 2.6, ampY: 3.4, freqX: 1.2, freqY: 1.3, phase: 12.0, },
  { id: 'card2',    name: 'Metode Pembayaran Digital', color: '#0284C7', origIndex: 43, bx: 1316, by: 447, r: 18, tx: 930, ty: 506, phi_t: -0.06, ampX: 2.5, ampY: 3.0, freqX: 1.4, freqY: 1.1, phase: 12.3, },
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

export default function LandingPage({
  onScrollToChat,
  onSelectSamplePrompt,
  onOpenPresentation,
  currentUser,
  onOpenLogin,
  onLogout,
  products,
  showExactStock,
  onUpdateStock,
  onResetProducts,
  onAskProduct,
}) {
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

  /* ── 44 High-Tech Vector Nodes — Edge-to-Edge Full Canvas (Zero Empty Margins) ── */
  const abstractNodes = [
    /* ── LEFT SIDE (Row 1 Top) ── */
    { id: 'bell',     title: 'Notifikasi Pesanan Kilat',         className: 'w-10 h-10', style: { left: '1%',   top: '6%'  }, bg: 'bg-amber-500 shadow-md shadow-amber-200 border-2 border-amber-400',     content: <Bell className="h-5 w-5 text-white" /> },
    { id: 'store',    title: 'Manajemen Butik Talaka',           className: 'w-11 h-11', style: { left: '8%',   top: '4%'  }, bg: 'bg-[#9E7B66] shadow-lg shadow-[#9E7B66]/30 border-2 border-[#b8957c]', content: <Store className="h-5 w-5 text-white" /> },
    { id: 'cs24',     title: 'Layanan CS 24/7 Support',          className: 'w-12 h-12', style: { left: '17%',  top: '8%'  }, bg: 'bg-blue-500 shadow-lg shadow-blue-200 border-2 border-blue-400',       content: <Headphones className="h-6 w-6 text-white" /> },
    { id: 'cart',     title: 'Keranjang & Checkout Cepat',       className: 'w-12 h-12', style: { left: '26%',  top: '4%'  }, bg: 'bg-amber-500 shadow-lg shadow-amber-200 border-2 border-amber-400',     content: <ShoppingBag className="h-6 w-6 text-white" /> },
    { id: 'faq',      title: 'Pusat Bantuan FAQ',                className: 'w-11 h-11', style: { left: '34%',  top: '8%'  }, bg: 'bg-cyan-500 shadow-lg shadow-cyan-200 border-2 border-cyan-400',       content: <MessageCircle className="h-5 w-5 text-white" /> },

    /* ── LEFT SIDE (Row 2 Upper-Mid) ── */
    { id: 'lock',     title: 'Privasi & Enkripsi Data',          className: 'w-9 h-9',   style: { left: '1%',   top: '24%' }, bg: 'bg-purple-500 shadow-md shadow-purple-200 border-2 border-purple-400',  content: <Lock className="h-4 w-4 text-white" /> },
    { id: 'shield',   title: 'Keamanan Transaksi UU PDP',        className: 'w-10 h-10', style: { left: '9%',   top: '22%' }, bg: 'bg-indigo-500 shadow-lg shadow-indigo-200 border-2 border-indigo-400',  content: <ShieldCheck className="h-5 w-5 text-white" /> },
    { id: 'sparkle',  title: 'Fitur Pintar Fashion AI',          className: 'w-9 h-9',   style: { left: '18%',  top: '26%' }, bg: 'bg-[#9E7B66] shadow-md shadow-[#9E7B66]/30 border-2 border-[#b8957c]', content: <Sparkles className="h-5 w-5 text-white" /> },
    { id: 'card',     title: 'Faktur & Struk Digital',           className: 'w-10 h-10', style: { left: '27%',  top: '23%' }, bg: 'bg-[#9E7B66] shadow-md shadow-[#9E7B66]/30 border-2 border-[#b8957c]',  content: <CreditCard className="h-5 w-5 text-white" /> },
    { id: 'zap',      title: 'Pesanan Kilat E-Wallet',           className: 'w-9 h-9',   style: { left: '36%',  top: '18%' }, bg: 'bg-slate-900 shadow-md border-2 border-slate-700',                      content: <Zap className="h-5 w-5 text-amber-400" /> },

    /* ── LEFT SIDE (Row 3 Mid) ── */
    { id: 'bag',      title: 'Koleksi Retail Talaka',            className: 'w-13 h-13', style: { left: '1%',   top: '44%' }, bg: 'bg-slate-900 shadow-xl shadow-slate-900/30 border-2 border-slate-700',  content: <ShoppingBag className="h-6 w-6 text-white" /> },
    { id: 'chart',    title: 'Grafik Omset & Stok',              className: 'w-11 h-11', style: { left: '9%',   top: '42%' }, bg: 'bg-emerald-500 shadow-lg shadow-emerald-200 border-2 border-emerald-400', content: <TrendingUp className="h-5 w-5 text-white" /> },
    { id: 'tag',      title: 'Voucher & Diskon Promo',           className: 'w-9 h-9',   style: { left: '18%',  top: '45%' }, bg: 'bg-lime-500 shadow-md shadow-lime-200 border-2 border-lime-400',       content: <Tag className="h-4 w-4 text-white" /> },
    { id: 'activity', title: 'Monitor Transaksi Real-Time',      className: 'w-9 h-9',   style: { left: '27%',  top: '42%' }, bg: 'bg-cyan-600 shadow-md shadow-cyan-200 border-2 border-cyan-500',       content: <Activity className="h-4 w-4 text-white" /> },
    { id: 'camera',   title: 'Virtual Try-On AI Preview',        className: 'w-10 h-10', style: { left: '36%',  top: '38%' }, bg: 'bg-violet-500 shadow-md shadow-violet-200 border-2 border-violet-400', content: <Camera className="h-5 w-5 text-white" /> },

    /* ── LEFT SIDE (Row 4 Lower-Mid) ── */
    { id: 'mappin',   title: 'Lokasi Kurir Pengiriman',          className: 'w-10 h-10', style: { left: '2%',   top: '66%' }, bg: 'bg-red-500 shadow-md shadow-red-200 border-2 border-red-400',          content: <MapPin className="h-5 w-5 text-white" /> },
    { id: 'palette',  title: 'Padu Padan Warna Outfit',          className: 'w-10 h-10', style: { left: '11%',  top: '65%' }, bg: 'bg-pink-500 shadow-md shadow-pink-200 border-2 border-pink-400',       content: <Palette className="h-5 w-5 text-white" /> },
    { id: 'heart',    title: 'Wishlist & Favorit OOTD',          className: 'w-10 h-10', style: { left: '20%',  top: '64%' }, bg: 'bg-pink-500 shadow-md shadow-pink-200 border-2 border-pink-400',       content: <Heart className="h-5 w-5 text-white fill-white" /> },
    { id: 'clock',    title: 'Respon Cepat < 5 Detik',           className: 'w-9 h-9',   style: { left: '30%',  top: '61%' }, bg: 'bg-slate-700 shadow-md border-2 border-slate-500',                     content: <Clock className="h-4 w-4 text-white" /> },

    /* ── LEFT SIDE (Row 5 Bottom) ── */
    { id: 'truck',    title: 'Ekspedisi Kilat & COD',            className: 'w-11 h-11', style: { left: '5%',   top: '85%' }, bg: 'bg-orange-500 shadow-lg shadow-orange-200 border-2 border-orange-400', content: <Truck className="h-5 w-5 text-white" /> },
    { id: 'compass',  title: 'Panduan Gaya & Rekomendasi',       className: 'w-9 h-9',   style: { left: '17%',  top: '83%' }, bg: 'bg-blue-600 shadow-md border-2 border-blue-500',                       content: <Compass className="h-4 w-4 text-white" /> },
    { id: 'gift',     title: 'Hadiah & Poin Member',             className: 'w-10 h-10', style: { left: '28%',  top: '80%' }, bg: 'bg-rose-500 shadow-md shadow-rose-200 border-2 border-rose-400',       content: <Gift className="h-5 w-5 text-white" /> },

    /* ── CENTER TOP ── */
    { id: 'ai',       title: 'AI Brain Talaka Core',             className: 'w-15 h-15', style: { left: '49%',  top: '1%'  }, bg: 'bg-slate-900 shadow-2xl shadow-slate-900/40 ring-4 ring-slate-100 border-2 border-slate-700', content: <Bot className="h-7 w-7 text-white" /> },

    /* ── RIGHT SIDE (Row 1 Top) ── */
    { id: 'search',   title: 'Pencarian Produk Cerdas',          className: 'w-9 h-9',   style: { left: '63%',  top: '14%' }, bg: 'bg-blue-50 shadow-sm border-2 border-blue-200',                        content: <Search className="h-4 w-4 text-blue-600" /> },
    { id: 'ruler',    title: 'Panduan Ukuran Presisi TB/BB',     className: 'w-12 h-12', style: { left: '71%',  top: '4%'  }, bg: 'bg-blue-500 shadow-lg shadow-blue-200 border-2 border-blue-400',       content: <Ruler className="h-6 w-6 text-white" /> },
    { id: 'retur',    title: 'Garansi Retur 7 Hari',             className: 'w-12 h-12', style: { left: '80%',  top: '8%'  }, bg: 'bg-emerald-500 shadow-lg shadow-emerald-200 border-2 border-emerald-400', content: <RefreshCw className="h-6 w-6 text-white" /> },
    { id: 'check',    title: 'Rekomendasi Outfit Akurat',        className: 'w-12 h-12', style: { left: '89%',  top: '4%'  }, bg: 'bg-green-600 shadow-lg shadow-green-200 border-2 border-green-500',    content: <CheckCircle2 className="h-6 w-6 text-white" /> },
    { id: 'star',     title: 'Ulasan Kepuasan Bintang 5',        className: 'w-13 h-13', style: { left: '97%',  top: '6%'  }, bg: 'bg-amber-400 shadow-lg shadow-amber-200 border-2 border-amber-300',    content: <Star className="h-6 w-6 text-white fill-white" /> },

    /* ── RIGHT SIDE (Row 2 Upper-Mid) ── */
    { id: 'check2',   title: 'Stok Real-Time Seluruh Toko',      className: 'w-10 h-10', style: { left: '63%',  top: '38%' }, bg: 'bg-teal-600 shadow-md border-2 border-teal-500',                       content: <Package className="h-5 w-5 text-white" /> },
    { id: 'shirt',    title: 'Katalog Koleksi Lengkap',          className: 'w-10 h-10', style: { left: '72%',  top: '23%' }, bg: 'bg-purple-500 shadow-md shadow-purple-200 border-2 border-purple-400', content: <Shirt className="h-5 w-5 text-white" /> },
    { id: 'flame',    title: 'Tren Busana Viral 2026',           className: 'w-9 h-9',   style: { left: '81%',  top: '26%' }, bg: 'bg-orange-500 shadow-md shadow-orange-200 border-2 border-orange-400', content: <Flame className="h-5 w-5 text-white" /> },
    { id: 'sliders',  title: 'Filter Bahan & Potongan',          className: 'w-9 h-9',   style: { left: '90%',  top: '22%' }, bg: 'bg-blue-600 shadow-md border-2 border-blue-500',                       content: <Sliders className="h-4 w-4 text-white" /> },
    { id: 'barstat',  title: 'Statistik & Laporan Toko',         className: 'w-9 h-9',   style: { left: '98%',  top: '24%' }, bg: 'bg-teal-500 shadow-md shadow-teal-200 border-2 border-teal-400',       content: <BarChart2 className="h-5 w-5 text-white" /> },

    /* ── RIGHT SIDE (Row 3 Mid) ── */
    { id: 'web',      title: 'Toko Web & Omnichannel',           className: 'w-9 h-9',   style: { left: '71%',  top: '42%' }, bg: 'bg-slate-800 shadow-md border-2 border-slate-600',                     content: <Store className="h-5 w-5 text-white" /> },
    { id: 'activity2',title: 'Padu Padan Koleksi Baru',          className: 'w-9 h-9',   style: { left: '80%',  top: '45%' }, bg: 'bg-fuchsia-500 shadow-md border-2 border-fuchsia-400',                 content: <Layers className="h-4 w-4 text-white" /> },
    { id: 'chart2',   title: 'Performa Analitik Bisnis',         className: 'w-10 h-10', style: { left: '89%',  top: '42%' }, bg: 'bg-amber-600 shadow-md border-2 border-amber-500',                     content: <BarChart2 className="h-5 w-5 text-white" /> },
    { id: 'layers',   title: 'Mix & Match Layering',             className: 'w-9 h-9',   style: { left: '98%',  top: '44%' }, bg: 'bg-indigo-600 shadow-md border-2 border-indigo-400',                   content: <Layers className="h-4 w-4 text-white" /> },

    /* ── RIGHT SIDE (Row 4 Lower-Mid) ── */
    { id: 'cpu',      title: 'Algoritma Talaka Engine',          className: 'w-9 h-9',   style: { left: '68%',  top: '61%' }, bg: 'bg-slate-700 shadow-md border-2 border-slate-500',                     content: <Cpu className="h-4 w-4 text-white" /> },
    { id: 'store2',   title: 'Outlet Mitra Butik',               className: 'w-9 h-9',   style: { left: '77%',  top: '65%' }, bg: 'bg-[#9E7B66] shadow-md border-2 border-[#b8957c]',                     content: <Store className="h-4 w-4 text-white" /> },
    { id: 'tag2',     title: 'Flash Sale & Promo Kilat',         className: 'w-9 h-9',   style: { left: '87%',  top: '66%' }, bg: 'bg-lime-500 shadow-md border-2 border-lime-400',                       content: <Tag className="h-4 w-4 text-white" /> },
    { id: 'heart2',   title: 'Pilihan Editor Fashion',           className: 'w-9 h-9',   style: { left: '97%',  top: '68%' }, bg: 'bg-pink-500 shadow-md border-2 border-pink-400',                       content: <Heart className="h-4 w-4 text-white fill-white" /> },

    /* ── RIGHT SIDE (Row 5 Bottom) ── */
    { id: 'gift2',    title: 'Gratis Ongkir Se-Indonesia',       className: 'w-9 h-9',   style: { left: '70%',  top: '80%' }, bg: 'bg-rose-500 shadow-md border-2 border-rose-400',                       content: <Gift className="h-4 w-4 text-white" /> },
    { id: 'truck2',   title: 'Tracking Paket Real-Time',         className: 'w-10 h-10', style: { left: '81%',  top: '84%' }, bg: 'bg-orange-500 shadow-md border-2 border-orange-400',                   content: <Truck className="h-4 w-4 text-white" /> },
    { id: 'card2',    title: 'Metode Pembayaran Digital',        className: 'w-10 h-10', style: { left: '94%',  top: '86%' }, bg: 'bg-blue-600 shadow-md border-2 border-blue-400',                       content: <CreditCard className="h-4 w-4 text-white" /> },
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

      // 3. Stagger pulse cables (Smooth continuous multi-pulse flow)
      streamPathsRef.current.forEach((path, i) => {
        if (!path) return;
        path.style.animationDuration = `${2.6 + (i % 7) * 0.22}s`;
        path.style.animationDelay   = `${-((i * 0.4) % 2.6).toFixed(2)}s`;
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
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#koleksi-3d" className="hover:text-slate-900 transition-colors">Koleksi 3D</a>
            <a href="#katalog-produk" className="hover:text-slate-900 transition-colors">Produk &amp; Stok</a>
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
          <div className="flex items-center gap-2">
            {onOpenPresentation && (
              <button
                type="button"
                onClick={onOpenPresentation}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-slate-400 hover:text-slate-950 transition-all cursor-pointer"
              >
                <span>Presentasi</span>
              </button>
            )}

            {currentUser ? (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 pl-2.5 pr-1.5 py-1 text-xs">
                <span className="font-bold text-slate-900 max-w-[90px] truncate">
                  {currentUser.username}
                </span>
                {currentUser.role === 'admin' && (
                  <span className="rounded-full bg-[#9E7B66]/15 text-[#9E7B66] px-1.5 py-0.5 text-[9px] font-mono font-bold">
                    ADMIN
                  </span>
                )}
                <button
                  type="button"
                  onClick={onLogout}
                  className="rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition cursor-pointer"
                >
                  Keluar
                </button>
              </div>
            ) : (
              onOpenLogin && (
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-slate-900 hover:text-slate-950 transition-all cursor-pointer"
                >
                  <span>Masuk</span>
                </button>
              )
            )}

            <button
              type="button"
              onClick={onScrollToChat}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-black transition-all cursor-pointer"
            >
              <Cpu className="h-3.5 w-3.5 text-[#9E7B66]" />
              <span className="hidden sm:inline">Chatbot</span>
            </button>
          </div>
        </nav>
      </header>

      {/* ═══════════════════════════ 2. HERO SECTION (100% RESTORED ROTATING HUB + CABLES + GLYPH BG) ═══════════════════════════ */}
      <section id="koleksi-3d" className="relative overflow-hidden">
        <GlyphBackground
          className="relative pt-12 pb-24 md:pt-16 md:pb-32 w-full"
          glowColor="#94a3b8"
          shapeColor="#9E7B66"
          fontSize={10}
          interactive={true}
        >
          {/* 3D Rotating Shoe Showcase (Persis Foto 2) */}
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 flex flex-col items-center text-center">
            <ShoeShowcase
              onSelectSamplePrompt={onSelectSamplePrompt}
              onScrollToChat={onScrollToChat}
            />
          </div>

          {/* ═══════════════════════════ CENTRAL ROTATING HUB (Full-Width Edge-to-Edge) ═══════════════════════════ */}
          <div
            ref={hubRef}
            className="relative mt-8 w-full max-w-[1720px] mx-auto h-[530px] sm:h-[580px] flex items-center justify-center select-none px-2 sm:px-4"
          >
            {/* Background Arch SVG with S-Cable Connectors */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
              viewBox="0 0 1400 520"
              preserveAspectRatio="none"
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

              {/* Concentric Tech HUD Rings — menyebar luas hingga tepi layar */}
              <circle cx="700" cy="520" r="180" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" opacity="0.7" />
              <circle cx="700" cy="520" r="230" className="arch-line" />
              <circle cx="700" cy="520" r="290" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="6 5" opacity="0.8" />
              <circle cx="700" cy="520" r="360" className="ring-dashed" />
              <circle cx="700" cy="520" r="440" className="arch-line" opacity="0.6" />
              <circle cx="700" cy="520" r="530" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="8 6" opacity="0.7" />
              <circle cx="700" cy="520" r="630" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 8" opacity="0.5" />
              <circle cx="700" cy="520" r="740" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="6 10" opacity="0.5" />
              <circle cx="700" cy="520" r="860" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 7" opacity="0.4" />
              <circle cx="700" cy="520" r="990" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="5 9" opacity="0.35" />
              <circle cx="700" cy="520" r="1140" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 8" opacity="0.25" />

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
                  {/* Concentric inner rings — lebih banyak putus-putus */}
                  <div className="absolute w-[90%] h-[90%] rounded-full border border-dashed border-slate-200/70" />
                  <div className="absolute w-[80%] h-[80%] rounded-full border border-dashed border-slate-300/80" />
                  <div className="absolute w-[70%] h-[70%] rounded-full border border-slate-200/60" />
                  <div className="absolute w-[60%] h-[60%] rounded-full border border-dashed border-slate-300/70" />
                  <div className="absolute w-[50%] h-[50%] rounded-full border border-slate-200/80" />
                  <div className="absolute w-[40%] h-[40%] rounded-full border border-dashed border-slate-200/60" />
                  <div className="absolute w-[30%] h-[30%] rounded-full border border-dashed border-slate-300/50" />

                  {/* Radial Divider Spokes — lebih banyak */}
                  <div className="absolute w-full h-[1px] bg-slate-200/70" />
                  <div className="absolute w-full h-[1px] bg-slate-200/70 rotate-30" />
                  <div className="absolute w-full h-[1px] bg-slate-200/70 rotate-60" />
                  <div className="absolute w-full h-[1px] bg-slate-200/70 rotate-90" />
                  <div className="absolute w-full h-[1px] bg-slate-200/70 rotate-120" />
                  <div className="absolute w-full h-[1px] bg-slate-200/70 rotate-150" />

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
        </GlyphBackground>
      </section>

      {/* ═══════════════════════════ 2.5 LIVE PRODUCT CATALOG (SYNCED WITH AI) ═══════════════════════════ */}
      <ProductCatalogSection
        products={products}
        showExactStock={showExactStock}
        isAdmin={currentUser?.role === 'admin'}
        onOpenLogin={onOpenLogin}
        onUpdateStock={onUpdateStock}
        onResetProducts={onResetProducts}
        onAskProduct={onAskProduct}
      />

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

      {/* ═══════════════════════════ 4.5 OMNICHANNEL MCP ROADMAP ═══════════════════════════ */}
      <OmnichannelSection onScrollToChat={onScrollToChat} />

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
