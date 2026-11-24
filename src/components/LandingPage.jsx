import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import {
  Sparkles,
  MessageCircle,
  Ruler,
  Package,
  ShieldCheck,
  Zap,
  Bot,
  Heart,
  RefreshCw,
  Clock,
  Shirt,
  ShoppingBag,
  CreditCard,
  Truck,
  Store,
  Sliders,
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
  Flame,
} from 'lucide-react';
import ShoeShowcase from './ShoeShowcase';
import ProductCatalogSection from './ProductCatalogSection';
import FeaturePhoneShowcase from './FeaturePhoneShowcase';
import ArcBenefitsCarousel from './ArcBenefitsCarousel';
import OmnichannelSection from './OmnichannelSection';
import WorkflowComparisonCanvas from './WorkflowComparisonCanvas';
import talakaLogo from '../assets/talaka-logo.svg';
import { GlyphBackground } from './ui/backgrounds-glyph';

/* ─────────────────────────────────────────────────────────────
   4-ZONE WARM MONOCHROME HUB BLUEPRINT (29 Ordered Nodes)
   Colors strictly follow Talaka Warm Monochrome:
   Mocca (#9E7B66 / #BFA08B) + Deep Ink Slate (#334155 / #94A3B8)
   ───────────────────────────────────────────────────────────── */
const HUB_ZONES = [
  {
    id: 'z1',
    code: '01',
    label: 'Konsultasi & AI',
    count: '7 modul',
    style: { left: '2%', top: '5%', width: '30%', height: '42%' },
  },
  {
    id: 'z2',
    code: '02',
    label: 'Transaksi & Member',
    count: '7 modul',
    style: { left: '2%', top: '52%', width: '30%', height: '42%' },
  },
  {
    id: 'z3',
    code: '03',
    label: 'Katalog & Ukuran',
    count: '7 modul',
    style: { left: '68%', top: '5%', width: '30%', height: '42%' },
  },
  {
    id: 'z4',
    code: '04',
    label: 'Pengiriman & Butik',
    count: '7 modul',
    style: { left: '68%', top: '52%', width: '30%', height: '42%' },
  },
];

const NODE_SPECS = [
  /* ── ZONA 01 · KIRI ATAS: KONSULTASI & AI (indices 0..6) ── */
  { id: 'cs24',     zone: 'z1', side: 'left',   xPct: 6.5,  yPct: 21, tier: 'dark',  color: '#334155', title: 'Layanan CS 24/7',         prompt: 'Kak, apakah layanan konsultasi Talaka aktif 24 jam?',                 Icon: Headphones },
  { id: 'faq',      zone: 'z1', side: 'left',   xPct: 14.0, yPct: 21, tier: 'white', color: '#94A3B8', title: 'Tanya Jawab Instan',      prompt: 'Mau tanya seputar cara pesan, bahan, dan pengiriman Talaka',         Icon: MessageCircle },
  { id: 'sparkle',  zone: 'z1', side: 'left',   xPct: 21.5, yPct: 21, tier: 'mocca', color: '#9E7B66', title: 'Stylist AI Jujur',        prompt: 'Bantu nilai gaya outfit yang cocok untuk tinggi badan saya dong',    Icon: Sparkles },
  { id: 'camera',   zone: 'z1', side: 'left',   xPct: 28.5, yPct: 21, tier: 'cream', color: '#BFA08B', title: 'Virtual Try-On',          prompt: 'Bagaimana cara mencoba fitur Virtual Try-On di Talaka?',             Icon: Camera },
  { id: 'lock',     zone: 'z1', side: 'left',   xPct: 10.0, yPct: 37, tier: 'white', color: '#94A3B8', title: 'Enkripsi Privasi',        prompt: 'Apakah data ukuran tubuh dan foto saya aman di Talaka?',             Icon: Lock },
  { id: 'shield',   zone: 'z1', side: 'left',   xPct: 17.5, yPct: 37, tier: 'cream', color: '#BFA08B', title: 'Keamanan UU PDP',         prompt: 'Bagaimana kebijakan privasi pelanggan Talaka?',                      Icon: ShieldCheck },
  { id: 'clock',    zone: 'z1', side: 'left',   xPct: 25.0, yPct: 37, tier: 'white', color: '#94A3B8', title: 'Respon < 5 Detik',        prompt: 'Saya butuh rekomendasi outfit cepat untuk acara malam ini',          Icon: Clock },

  /* ── ZONA 02 · KIRI BAWAH: TRANSAKSI & MEMBER (indices 7..13) ── */
  { id: 'cart',     zone: 'z2', side: 'left',   xPct: 10.0, yPct: 68, tier: 'dark',  color: '#334155', title: 'Keranjang & Checkout',    prompt: 'Bagaimana cara checkout dan konfirmasi pesanan di Talaka?',          Icon: ShoppingBag },
  { id: 'card',     zone: 'z2', side: 'left',   xPct: 17.5, yPct: 68, tier: 'white', color: '#94A3B8', title: 'Pembayaran Digital',      prompt: 'Metode pembayaran apa saja yang tersedia di Talaka?',                Icon: CreditCard },
  { id: 'zap',      zone: 'z2', side: 'left',   xPct: 25.0, yPct: 68, tier: 'mocca', color: '#9E7B66', title: 'Order Kilat',             prompt: 'Saya mau pesan Kemeja Linen sekarang, bagaimana langkah tercepat?',  Icon: Zap },
  { id: 'tag',      zone: 'z2', side: 'left',   xPct: 6.5,  yPct: 84, tier: 'cream', color: '#BFA08B', title: 'Voucher & Promo',         prompt: 'Ada promo atau voucher diskon aktif hari ini kak?',                  Icon: Tag },
  { id: 'gift',     zone: 'z2', side: 'left',   xPct: 14.0, yPct: 84, tier: 'white', color: '#94A3B8', title: 'Poin & Hadiah Member',    prompt: 'Apa saja keuntungan mendaftar akun member Talaka?',                  Icon: Gift },
  { id: 'heart',    zone: 'z2', side: 'left',   xPct: 21.5, yPct: 84, tier: 'cream', color: '#BFA08B', title: 'Wishlist OOTD',           prompt: 'Rekomendasikan 3 item best seller untuk masuk wishlist saya',        Icon: Heart },
  { id: 'activity', zone: 'z2', side: 'left',   xPct: 28.5, yPct: 84, tier: 'white', color: '#94A3B8', title: 'Pantau Pesanan',          prompt: 'Bagaimana cara cek status dan riwayat pesanan saya?',                Icon: Activity },

  /* ── CENTER TOP ANCHOR (index 14) ── */
  { id: 'ai',       zone: 'core', side: 'center', xPct: 50.0, yPct: 6, tier: 'core', color: '#9E7B66', title: 'Talaka AI Core',          prompt: 'Halo Kak Tala! Bisa bantu saya pilih outfit yang pas?',              Icon: Bot },

  /* ── ZONA 03 · KANAN ATAS: KATALOG & UKURAN (indices 15..21) ── */
  { id: 'ruler',    zone: 'z3', side: 'right',  xPct: 71.5, yPct: 21, tier: 'mocca', color: '#9E7B66', title: 'Panduan Ukuran TB/BB',    prompt: 'TB saya 165 cm BB 58 kg, cocok ukuran apa untuk kemeja & celana?',   Icon: Ruler },
  { id: 'shirt',    zone: 'z3', side: 'right',  xPct: 78.5, yPct: 21, tier: 'white', color: '#94A3B8', title: 'Katalog Koleksi',         prompt: 'Tampilkan koleksi pakaian terbaru yang tersedia di Talaka',          Icon: Shirt },
  { id: 'package',  zone: 'z3', side: 'right',  xPct: 86.0, yPct: 21, tier: 'dark',  color: '#334155', title: 'Stok Real-Time',          prompt: 'Cek stok Kemeja Linen dan Celana Kulot ukuran M saat ini',           Icon: Package },
  { id: 'search',   zone: 'z3', side: 'right',  xPct: 93.5, yPct: 21, tier: 'cream', color: '#BFA08B', title: 'Pencarian Cerdas',        prompt: 'Carikan outfit warna earth tone yang adem untuk dipakai seharian',   Icon: Search },
  { id: 'sliders',  zone: 'z3', side: 'right',  xPct: 75.0, yPct: 37, tier: 'white', color: '#94A3B8', title: 'Filter Bahan & Cutting',  prompt: 'Jelaskan perbedaan karakter bahan linen, katun, dan knit Talaka',    Icon: Sliders },
  { id: 'layers',   zone: 'z3', side: 'right',  xPct: 82.5, yPct: 37, tier: 'cream', color: '#BFA08B', title: 'Padu Padan Layering',     prompt: 'Buatkan ide layering outer dengan kemeja untuk gaya smart casual',   Icon: Layers },
  { id: 'flame',    zone: 'z3', side: 'right',  xPct: 90.0, yPct: 37, tier: 'white', color: '#94A3B8', title: 'Koleksi Favorit',         prompt: 'Produk apa yang paling banyak dicari pelanggan minggu ini?',         Icon: Flame },

  /* ── ZONA 04 · KANAN BAWAH: PENGIRIMAN & BUTIK (indices 22..28) ── */
  { id: 'retur',    zone: 'z4', side: 'right',  xPct: 75.0, yPct: 68, tier: 'mocca', color: '#9E7B66', title: 'Garansi Retur 7 Hari',    prompt: 'Bagaimana syarat dan cara tukar ukuran jika kebesaran?',             Icon: RefreshCw },
  { id: 'truck',    zone: 'z4', side: 'right',  xPct: 82.5, yPct: 68, tier: 'dark',  color: '#334155', title: 'Ekspedisi & COD',         prompt: 'Apakah tersedia layanan COD dan estimasi ongkir ke kota saya?',      Icon: Truck },
  { id: 'mappin',   zone: 'z4', side: 'right',  xPct: 90.0, yPct: 68, tier: 'white', color: '#94A3B8', title: 'Lacak Kurir',             prompt: 'Ekspedisi apa saja yang dipakai Talaka untuk pengiriman?',           Icon: MapPin },
  { id: 'store',    zone: 'z4', side: 'right',  xPct: 71.5, yPct: 84, tier: 'cream', color: '#BFA08B', title: 'Butik Talaka',            prompt: 'Ceritakan tentang brand Talaka dan standar kualitas jahitannya',     Icon: Store },
  { id: 'star',     zone: 'z4', side: 'right',  xPct: 78.5, yPct: 84, tier: 'white', color: '#94A3B8', title: 'Ulasan Pembeli',          prompt: 'Bagaimana penilaian pembeli tentang kenyamanan bahan Talaka?',       Icon: Star },
  { id: 'barstat',  zone: 'z4', side: 'right',  xPct: 86.0, yPct: 84, tier: 'cream', color: '#BFA08B', title: 'Analitik Stok',           prompt: 'Ukuran apa yang stoknya hampir habis di etalase Talaka?',            Icon: BarChart2 },
  { id: 'palette',  zone: 'z4', side: 'right',  xPct: 93.5, yPct: 84, tier: 'white', color: '#94A3B8', title: 'Harmoni Warna',           prompt: 'Warna baju apa yang cocok untuk kulit sawo matang?',                 Icon: Palette },
];

const WHEEL_CX = 700;
const WHEEL_CY = 520;
const WHEEL_R  = 230;

/* Compute non-crossing, monotonically fanned cables from each zone into the hub rim */
function buildCleanCables() {
  const withPolar = NODE_SPECS.map((n, origIndex) => {
    const bx = n.xPct * 14;
    const by = n.yPct * 5.2;
    const angle = Math.atan2(by - WHEEL_CY, bx - WHEEL_CX);
    return { ...n, origIndex, bx, by, angle };
  });

  const leftNodes   = withPolar.filter((n) => n.side === 'left').sort((a, b) => a.angle - b.angle);
  const rightNodes  = withPolar.filter((n) => n.side === 'right').sort((a, b) => a.angle - b.angle);
  const centerNodes = withPolar.filter((n) => n.side === 'center');

  const assignFan = (items, phiStart, phiEnd) =>
    items.map((item, idx) => {
      const ratio = items.length > 1 ? idx / (items.length - 1) : 0.5;
      const phi_t = phiStart + (phiEnd - phiStart) * ratio;
      return {
        id: item.id,
        zone: item.zone,
        name: item.title,
        color: item.color,
        origIndex: item.origIndex,
        bx: item.bx,
        by: item.by,
        r: item.tier === 'core' ? 28 : 22,
        tx: WHEEL_CX + WHEEL_R * Math.cos(phi_t),
        ty: WHEEL_CY + WHEEL_R * Math.sin(phi_t),
        phi_t,
        ampX: 1.8 + (idx % 3) * 0.4,
        ampY: 2.2 + (idx % 4) * 0.4,
        freqX: 1.05 + (idx % 5) * 0.08,
        freqY: 0.95 + (idx % 4) * 0.09,
        phase: item.origIndex * 0.65,
      };
    });

  return [
    ...assignFan(leftNodes, -3.02, -1.74),
    ...assignFan(centerNodes, -1.57, -1.57),
    ...assignFan(rightNodes, -1.40, -0.12),
  ];
}

const cablesData = buildCleanCables();

function getInitialPath(c) {
  const dir  = Math.atan2(c.ty - c.by, c.tx - c.bx);
  const sx   = c.bx + (c.r - 1) * Math.cos(dir);
  const sy   = c.by + (c.r - 1) * Math.sin(dir);
  const dist = Math.hypot(c.tx - sx, c.ty - sy);
  const nx   = -(c.ty - sy) / dist;
  const ny   =  (c.tx - sx) / dist;
  const bias = Math.sin(c.origIndex * 1.1) * 6;
  const c1x  = sx  + Math.cos(dir)    * (dist * 0.48) + nx * bias;
  const c1y  = sy  + Math.sin(dir)    * (dist * 0.48) + ny * bias;
  const c2x  = c.tx + Math.cos(c.phi_t) * (dist * 0.48) - nx * bias * 0.4;
  const c2y  = c.ty + Math.sin(c.phi_t) * (dist * 0.48) - ny * bias * 0.4;
  return `M ${sx.toFixed(1)} ${sy.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${c.tx.toFixed(1)} ${c.ty.toFixed(1)}`;
}

const NODE_TIER_STYLES = {
  core: {
    size: 'w-14 h-14 sm:w-15 sm:h-15',
    surface: 'bg-[#181615] text-white border border-slate-700 ring-4 ring-[#FAF7F4] shadow-xl shadow-slate-900/20',
    iconClass: 'h-6 w-6 text-white',
  },
  dark: {
    size: 'w-10 h-10 sm:w-11 sm:h-11',
    surface: 'bg-[#181615] text-white border border-slate-700/90 shadow-md shadow-slate-900/15 hover:bg-black',
    iconClass: 'h-4.5 w-4.5 text-white',
  },
  mocca: {
    size: 'w-10 h-10 sm:w-11 sm:h-11',
    surface: 'bg-[#9E7B66] text-white border border-[#8E6B56] shadow-md shadow-[#9E7B66]/20 hover:bg-[#8A6854]',
    iconClass: 'h-4.5 w-4.5 text-white',
  },
  cream: {
    size: 'w-9 h-9 sm:w-10 sm:h-10',
    surface: 'bg-[#FAF7F4] text-[#9E7B66] border border-[#E6DDD4] shadow-xs hover:border-[#9E7B66] hover:bg-white',
    iconClass: 'h-4 w-4 text-[#9E7B66]',
  },
  white: {
    size: 'w-9 h-9 sm:w-10 sm:h-10',
    surface: 'bg-white/95 text-[#181615] border border-[#E6DDD4] shadow-xs hover:border-[#9E7B66] hover:text-[#9E7B66]',
    iconClass: 'h-4 w-4',
  },
};

export default function LandingPage({
  onScrollToChat,
  onSelectSamplePrompt,
  onOpenPresentation,
  onOpenAdmin,
  onOpenMyOrders,
  unreadNotifCount = 0,
  currentUser,
  onOpenLogin,
  onLogout,
  products,
  showExactStock,
  onUpdateStock,
  onResetProducts,
  onAskProduct,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeZone, setActiveZone] = useState(null);
  const rootRef          = useRef(null);
  const navRef           = useRef(null);
  const navLogoRef       = useRef(null);
  const hasMountedNavRef = useRef(false);
  const hubRef           = useRef(null);
  const rotatingWheelRef = useRef(null);
  const allNodesRef      = useRef([]);
  const basePathsRef     = useRef([]);
  const streamPathsRef   = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── GSAP Morph Animation: Snug Flush Top Bar → Compact Floating Glass Pill on Scroll ── */
  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    const targetVars = isScrolled
      ? {
          y: 14,
          columnGap: 14,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          paddingTop: 7,
          paddingBottom: 7,
          paddingLeft: 14,
          paddingRight: 14,
          backgroundColor: 'rgba(255, 255, 255, 0.60)',
          borderColor: 'rgba(255, 255, 255, 0.78)',
          boxShadow:
            '0 14px 36px rgba(15, 23, 42, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
        }
      : {
          y: -1,
          columnGap: 24,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 22,
          borderBottomRightRadius: 22,
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 18,
          paddingRight: 18,
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          borderColor: 'rgba(226, 232, 240, 0.88)',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
        };

    if (!hasMountedNavRef.current) {
      hasMountedNavRef.current = true;
      gsap.set(navEl, targetVars);
      if (navLogoRef.current) {
        gsap.set(navLogoRef.current, { scale: isScrolled ? 0.9 : 1 });
      }
      return;
    }

    gsap.to(navEl, {
      ...targetVars,
      duration: 0.5,
      ease: 'power3.out',
      overwrite: 'auto',
    });

    if (navLogoRef.current) {
      gsap.to(navLogoRef.current, {
        scale: isScrolled ? 0.9 : 1,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
  }, [isScrolled]);

  /* ── GSAP Animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (hubRef.current) {
        tl.from(hubRef.current, { scale: 0.96, opacity: 0, y: 24, duration: 1.0, ease: 'power3.out' });
      }

      // 2. Rotating wheel (smooth continuous 38s rotation)
      if (rotatingWheelRef.current) {
        gsap.to(rotatingWheelRef.current, {
          rotation: 360, duration: 38, repeat: -1, ease: 'none', transformOrigin: '50% 50%',
        });
      }

      // 3. Stagger pulse cables (Calm, synchronized pulse flow)
      streamPathsRef.current.forEach((path, i) => {
        if (!path) return;
        path.style.animationDuration = `${3.2 + (i % 6) * 0.28}s`;
        path.style.animationDelay   = `${-((i * 0.45) % 3.2).toFixed(2)}s`;
      });

      // 4. Live ticker for gently breathing nodes + non-crossing curved cables
      const updateCablesTick = () => {
        const t = gsap.ticker.time;
        for (let i = 0; i < cablesData.length; i++) {
          const c  = cablesData[i];
          const dx = Math.sin(t * c.freqX * 0.45 + c.phase) * c.ampX;
          const dy = Math.cos(t * c.freqY * 0.45 + c.phase) * c.ampY;

          const nodeEl = allNodesRef.current[c.origIndex];
          if (nodeEl) nodeEl.style.transform = `translate3d(${(dx * 0.6).toFixed(2)}px, ${(dy * 0.6).toFixed(2)}px, 0)`;

          const cx   = c.bx + dx * 0.6;
          const cy   = c.by + dy * 0.6;
          const dir  = Math.atan2(c.ty - cy, c.tx - cx);
          const sx   = cx + (c.r - 1) * Math.cos(dir);
          const sy   = cy + (c.r - 1) * Math.sin(dir);
          const dist = Math.hypot(c.tx - sx, c.ty - sy);
          const nx   = -(c.ty - sy) / dist;
          const ny   =  (c.tx - sx) / dist;
          const arcBias = Math.sin(c.origIndex * 1.1) * 6;
          const liveW1  = Math.sin(t * 0.22 + i * 0.6) * 2.0;
          const liveW2  = Math.cos(t * 0.18 + i * 0.8) * 1.5;

          const c1x = sx   + Math.cos(dir)     * (dist * 0.48) + nx * (arcBias + liveW1);
          const c1y = sy   + Math.sin(dir)     * (dist * 0.48) + ny * (arcBias + liveW1);
          const c2x = c.tx + Math.cos(c.phi_t) * (dist * 0.48) - nx * ((arcBias + liveW2) * 0.4);
          const c2y = c.ty + Math.sin(c.phi_t) * (dist * 0.48) - ny * ((arcBias + liveW2) * 0.4);

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
    <div ref={rootRef} className="relative w-full bg-white text-slate-900 selection:bg-slate-900 selection:text-white overflow-x-clip">
      
      {/* Subtle High-Tech Background Grid & Radial Glows */}
      <div className="absolute inset-0 bg-tech-grid opacity-70 pointer-events-none -z-10" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-blue-50/50 via-slate-50/30 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-[#9E7B66]/5 blur-3xl rounded-full pointer-events-none -z-10" />

      {/* ═══════════════════════════ 1. NAVBAR (GSAP Morph: Snug Flush Top → Compact Floating Glass Pill) ═══════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 pointer-events-none">
        <nav
          ref={navRef}
          className="pointer-events-auto inline-flex w-fit max-w-full items-center gap-6 border backdrop-blur-2xl backdrop-saturate-150 will-change-transform"
        >
          {/* Brand Logo (Khusus Logo Saja) */}
          <a
            href="#koleksi-3d"
            aria-label="Talaka Home"
            className="flex items-center shrink-0 group"
          >
            <img
              ref={navLogoRef}
              src={talakaLogo}
              alt="Talaka Logo"
              className="h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </a>

          {/* Concise Links (Hanya beberapa bagian utama) */}
          <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-slate-600">
            <a href="#katalog-produk" className="whitespace-nowrap hover:text-slate-950 transition-colors">
              Katalog
            </a>
            <a href="#fitur-utama" className="whitespace-nowrap hover:text-slate-950 transition-colors">
              Fitur AI
            </a>
            <a href="#manfaat-toko" className="whitespace-nowrap hover:text-slate-950 transition-colors">
              Keunggulan
            </a>
          </div>

          {/* CTA Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenMyOrders && (
              <button
                type="button"
                onClick={onOpenMyOrders}
                className="relative hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-slate-900 hover:text-slate-950 transition-all cursor-pointer whitespace-nowrap"
                title="Lacak progres paket & notifikasi AI"
              >
                <Package className="h-3.5 w-3.5 text-[#9E7B66]" />
                <span>Pesanan</span>
                {unreadNotifCount > 0 && (
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>
            )}

            {currentUser?.role === 'admin' && onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1 rounded-full bg-[#9E7B66] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#8a6854] transition-all cursor-pointer whitespace-nowrap shadow-xs"
                title="Buka Dashboard Admin"
              >
                <span>Dashboard</span>
              </button>
            )}

            {onOpenPresentation && (
              <button
                type="button"
                onClick={onOpenPresentation}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-slate-400 hover:text-slate-950 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Presentasi</span>
              </button>
            )}

            {currentUser ? (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-slate-50/90 pl-2.5 pr-1.5 py-1 text-xs whitespace-nowrap">
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
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200/90 bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-slate-900 hover:text-slate-950 transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Masuk</span>
                </button>
              )
            )}

            <button
              type="button"
              onClick={onScrollToChat}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-black transition-all cursor-pointer whitespace-nowrap"
            >
              <Cpu className="h-3.5 w-3.5 text-[#9E7B66]" />
              <span className="hidden sm:inline">Chatbot</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Spacer for fixed top navbar so hero content starts cleanly below it */}
      <div className="h-16" aria-hidden="true" />

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

          {/* ═══════════════════════════ CENTRAL ROTATING HUB (4-Zone Warm Monochrome Architecture) ═══════════════════════════ */}
          <div
            ref={hubRef}
            className="relative mt-8 w-full max-w-[1720px] mx-auto h-[540px] sm:h-[580px] flex items-center justify-center select-none px-2 sm:px-4"
          >
            {/* 4 Clean Labeled Zone Frames (Desktop/Large Screens) */}
            {HUB_ZONES.map((zone) => {
              const isHighlighted = activeZone === zone.id;
              return (
                <div
                  key={zone.id}
                  style={zone.style}
                  onMouseEnter={() => setActiveZone(zone.id)}
                  onMouseLeave={() => setActiveZone(null)}
                  className={`hidden lg:flex flex-col justify-between absolute z-0 rounded-3xl border px-5 py-3.5 transition-all duration-300 ${
                    isHighlighted
                      ? 'border-[#9E7B66]/45 bg-[#FAF7F4]/85 shadow-[0_14px_36px_rgba(158,123,102,0.08)]'
                      : 'border-[#EAE2DA]/85 bg-[#FAF7F4]/45'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider transition-colors ${
                          isHighlighted
                            ? 'bg-[#9E7B66] text-white'
                            : 'bg-white text-[#9E7B66] border border-[#E6DDD4]'
                        }`}
                      >
                        {zone.code}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#181615]/80">
                        {zone.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-[#8C7B6E]">
                      {zone.count}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Background Arch SVG with Non-Crossing Warm Monochrome Cables */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-[5]"
              viewBox="0 0 1400 520"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <radialGradient id="techCenterGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#9E7B66" stopOpacity="0.10" />
                  <stop offset="70%" stopColor="#181615" stopOpacity="0.02" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Concentric Subtle Warm HUD Rings */}
              <circle cx="700" cy="520" r="185" stroke="#EDE5DC" strokeWidth="1" strokeDasharray="4 5" opacity="0.7" />
              <circle cx="700" cy="520" r="235" className="arch-line" />
              <circle cx="700" cy="520" r="300" stroke="#E6DDD4" strokeWidth="1" strokeDasharray="5 6" opacity="0.7" />
              <circle cx="700" cy="520" r="380" className="ring-dashed" />
              <circle cx="700" cy="520" r="470" className="arch-line" opacity="0.45" />
              <circle cx="700" cy="520" r="580" stroke="#EFE8E0" strokeWidth="1" strokeDasharray="6 8" opacity="0.5" />
              <circle cx="700" cy="520" r="710" stroke="#E8DFD6" strokeWidth="1" strokeDasharray="4 9" opacity="0.35" />

              {/* 29 Clean Non-Crossing Guide Tracks */}
              {cablesData.map((c, i) => {
                const dimmed = activeZone && c.zone !== activeZone && c.zone !== 'core';
                return (
                  <path
                    key={`base-${c.id}`}
                    ref={(el) => { basePathsRef.current[i] = el; }}
                    d={getInitialPath(c)}
                    className="connector-track transition-opacity duration-300"
                    style={{ opacity: dimmed ? 0.22 : 0.72 }}
                  />
                );
              })}

              {/* 29 Subtle Warm Monochrome Pulse Flows */}
              {cablesData.map((c, i) => {
                const dimmed = activeZone && c.zone !== activeZone && c.zone !== 'core';
                const boosted = activeZone && c.zone === activeZone;
                return (
                  <path
                    key={`pulse-${c.id}`}
                    ref={(el) => { streamPathsRef.current[i] = el; }}
                    d={getInitialPath(c)}
                    className="connector-pulse transition-opacity duration-300"
                    stroke={c.color}
                    style={{ opacity: dimmed ? 0.14 : boosted ? 0.95 : 0.65 }}
                  />
                );
              })}
            </svg>

            {/* 29 Structured Warm Monochrome Nodes with Crisp Hover Labels */}
            {NODE_SPECS.map((node, i) => {
              const tierStyle = NODE_TIER_STYLES[node.tier];
              const IconComp  = node.Icon;
              const dimmed    = activeZone && node.zone !== activeZone && node.zone !== 'core';
              return (
                <div
                  key={node.id}
                  ref={(el) => { allNodesRef.current[i] = el; }}
                  style={{ left: `${node.xPct}%`, top: `${node.yPct}%` }}
                  title={node.title}
                  onMouseEnter={() => {
                    if (node.zone !== 'core') setActiveZone(node.zone);
                  }}
                  onMouseLeave={() => setActiveZone(null)}
                  onClick={() => {
                    onSelectSamplePrompt?.(node.prompt);
                    onScrollToChat();
                  }}
                  className={`group node-card z-20 ${tierStyle.size} ${tierStyle.surface} ${
                    dimmed ? 'opacity-45' : 'opacity-100'
                  }`}
                >
                  <IconComp className={tierStyle.iconClass} />
                  <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-full bg-[#181615] px-2.5 py-1 text-[10px] font-semibold text-white whitespace-nowrap shadow-lg opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                    {node.title}
                  </span>
                </div>
              );
            })}

            {/* Rotating Wheel Hub at Center Bottom */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col items-center pointer-events-auto z-20">
              <div className="relative w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] flex items-center justify-center">
                
                {/* Subtle Warm Aura Disk */}
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(250,247,244,0.92)_0%,rgba(255,255,255,0)_72%)] pointer-events-none" />

                {/* Rotating segmented wheel (38s smooth rotation) */}
                <div
                  ref={rotatingWheelRef}
                  className="absolute inset-0 rounded-full border border-[#E6DDD4] shadow-[0_14px_44px_rgba(24,22,21,0.06)] bg-white/85 backdrop-blur-xs flex items-center justify-center will-change-transform"
                >
                  {/* Concentric warm inner rings */}
                  <div className="absolute w-[90%] h-[90%] rounded-full border border-dashed border-[#E6DDD4]/80" />
                  <div className="absolute w-[78%] h-[78%] rounded-full border border-[#EFE8E0]" />
                  <div className="absolute w-[64%] h-[64%] rounded-full border border-dashed border-[#DFD4C8]/80" />
                  <div className="absolute w-[48%] h-[48%] rounded-full border border-[#EFE8E0]" />
                  <div className="absolute w-[32%] h-[32%] rounded-full border border-dashed border-[#E6DDD4]/75" />

                  {/* Subtle Radial Divider Spokes */}
                  <div className="absolute w-full h-[1px] bg-[#EFE8E0]/80" />
                  <div className="absolute w-full h-[1px] bg-[#EFE8E0]/80 rotate-30" />
                  <div className="absolute w-full h-[1px] bg-[#EFE8E0]/80 rotate-60" />
                  <div className="absolute w-full h-[1px] bg-[#EFE8E0]/80 rotate-90" />
                  <div className="absolute w-full h-[1px] bg-[#EFE8E0]/80 rotate-120" />
                  <div className="absolute w-full h-[1px] bg-[#EFE8E0]/80 rotate-150" />

                  {/* 6 Feature Badges on Rotating Disk (Harmonized Warm Monochrome) */}
                  {/* Seg 1 Top: Ukuran TB/BB */}
                  <div onClick={() => { onSelectSamplePrompt?.('TB saya 160 cm BB 52 kg, cocok kemeja ukuran apa ya?'); onScrollToChat(); }}
                    className="absolute left-1/2 -translate-x-1/2 top-3 flex flex-col items-center cursor-pointer hover:scale-110 transition-transform group"
                    title="Konsultasi ukuran dari TB/BB">
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white shadow-xs border border-[#E6DDD4] group-hover:border-[#9E7B66] transition-colors">
                      <Ruler className="h-3 w-3 text-[#9E7B66]" />
                      <span className="text-[9.5px] font-bold text-[#181615]">Ukuran TB/BB</span>
                    </div>
                    <span className="mt-0.5 text-[8.5px] font-medium text-[#7A685B] bg-[#FAF7F4] border border-[#EFE8E0] px-1.5 rounded-full">Anti-Salah Size</span>
                  </div>

                  {/* Seg 2 Top-Right: Gaya Jujur */}
                  <div onClick={() => { onSelectSamplePrompt?.('Kalau aku pakai celana kulot high-waist krem cocok nggak? TB 155'); onScrollToChat(); }}
                    className="absolute right-5 top-20 flex flex-col items-center rotate-45 cursor-pointer hover:scale-110 transition-transform group"
                    title="Penilaian gaya jujur">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white shadow-xs border border-[#E6DDD4] group-hover:border-[#9E7B66] transition-colors">
                      <Heart className="h-3 w-3 text-[#9E7B66]" />
                      <span className="text-[9.5px] font-bold text-[#181615]">Gaya Jujur</span>
                    </div>
                    <span className="mt-0.5 text-[8.5px] font-medium text-[#9E7B66] bg-[#FAF7F4] border border-[#EFE8E0] px-1.5 rounded-full">Bukan Asal Puji</span>
                  </div>

                  {/* Seg 3 Bottom-Right: Cek Stok */}
                  <div onClick={() => { onSelectSamplePrompt?.('Kemeja linen putih ukuran M masih ada? Cek stok dong kak!'); onScrollToChat(); }}
                    className="absolute right-5 bottom-20 flex flex-col items-center rotate-135 cursor-pointer hover:scale-110 transition-transform group"
                    title="Cek ketersediaan stok">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white shadow-xs border border-[#E6DDD4] group-hover:border-[#9E7B66] transition-colors">
                      <Package className="h-3 w-3 text-[#181615]" />
                      <span className="text-[9.5px] font-bold text-[#181615]">Cek Stok</span>
                    </div>
                    <span className="mt-0.5 text-[8.5px] font-medium text-[#7A685B] bg-[#FAF7F4] border border-[#EFE8E0] px-1.5 rounded-full">Real-Time</span>
                  </div>

                  {/* Seg 4 Bottom: FAQ 24/7 */}
                  <div onClick={() => { onSelectSamplePrompt?.('Bisa COD gak? Berapa ongkir pengiriman ke kotaku?'); onScrollToChat(); }}
                    className="absolute left-1/2 -translate-x-1/2 bottom-3 flex flex-col items-center rotate-180 cursor-pointer hover:scale-110 transition-transform group"
                    title="FAQ & ongkir 24/7">
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white shadow-xs border border-[#E6DDD4] group-hover:border-[#9E7B66] transition-colors">
                      <MessageCircle className="h-3 w-3 text-[#181615]" />
                      <span className="text-[9.5px] font-bold text-[#181615]">FAQ 24/7</span>
                    </div>
                    <span className="mt-0.5 text-[8.5px] font-medium text-[#7A685B] bg-[#FAF7F4] border border-[#EFE8E0] px-1.5 rounded-full">&lt; 5 Detik</span>
                  </div>

                  {/* Seg 5 Bottom-Left: Padu Padan */}
                  <div onClick={() => { onSelectSamplePrompt?.('Tolong buatin padu padan OOTD yang cocok buat acara kondangan semi-formal!'); onScrollToChat(); }}
                    className="absolute left-5 bottom-20 flex flex-col items-center -rotate-135 cursor-pointer hover:scale-110 transition-transform group"
                    title="Padu padan outfit">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white shadow-xs border border-[#E6DDD4] group-hover:border-[#9E7B66] transition-colors">
                      <Sparkles className="h-3 w-3 text-[#9E7B66]" />
                      <span className="text-[9.5px] font-bold text-[#181615]">Padu Padan</span>
                    </div>
                    <span className="mt-0.5 text-[8.5px] font-medium text-[#9E7B66] bg-[#FAF7F4] border border-[#EFE8E0] px-1.5 rounded-full">OOTD Lengkap</span>
                  </div>

                  {/* Seg 6 Top-Left: Detail Produk */}
                  <div onClick={() => { onSelectSamplePrompt?.('Kain kemeja linen Talaka bahannya adem dan lembut gak? Cara perawatannya gimana?'); onScrollToChat(); }}
                    className="absolute left-5 top-20 flex flex-col items-center -rotate-45 cursor-pointer hover:scale-110 transition-transform group"
                    title="Detail bahan & produk">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white shadow-xs border border-[#E6DDD4] group-hover:border-[#9E7B66] transition-colors">
                      <Shirt className="h-3 w-3 text-[#181615]" />
                      <span className="text-[9.5px] font-bold text-[#181615]">Detail Produk</span>
                    </div>
                    <span className="mt-0.5 text-[8.5px] font-medium text-[#7A685B] bg-[#FAF7F4] border border-[#EFE8E0] px-1.5 rounded-full">Jujur &amp; Rinci</span>
                  </div>
                </div>

                {/* Static center Talaka Core (Tepat di Tengah Lingkaran Roda) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30 pointer-events-auto">
                  <button
                    type="button"
                    onClick={onScrollToChat}
                    className="flex flex-col items-center gap-1.5 cursor-pointer group"
                    title="Mulai konsultasi bersama Talaka AI"
                  >
                    <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-white shadow-[0_14px_34px_rgba(24,22,21,0.10)] border border-[#E6DDD4] ring-4 ring-[#FAF7F4] group-hover:scale-105 group-hover:border-[#9E7B66] transition-all overflow-hidden p-2.5">
                      <img src={talakaLogo} alt="Talaka AI Core" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#181615] bg-white/95 backdrop-blur-md px-3 py-0.5 rounded-full border border-[#E6DDD4] shadow-xs flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#9E7B66] animate-pulse" />
                      Talaka AI
                    </span>
                  </button>
                </div>
              </div>

              {/* Fade gradient at bottom in Pure White */}
              <div className="w-[400px] sm:w-[540px] h-16 sm:h-20 -mt-8 bg-gradient-to-b from-transparent via-white/80 to-white pointer-events-none z-30" />
            </div>

            {/* Clean Interactive Quick-Jump Bar */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-40 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E6DDD4] shadow-[0_8px_24px_rgba(24,22,21,0.06)] text-xs font-medium text-[#64574E]">
              <span className="inline-flex items-center gap-1.5 pl-1 pr-2 text-[11px] font-bold text-[#181615]">
                <span className="flex h-1.5 w-1.5 rounded-full bg-[#9E7B66]" />
                Pilih topik:
              </span>
              {[
                { label: 'Ukuran TB/BB', prompt: 'TB saya 160 cm BB 52 kg, cocok kemeja ukuran apa ya?' },
                { label: 'Gaya Jujur',   prompt: 'Kalau aku pakai celana kulot high-waist krem cocok nggak? TB 155' },
                { label: 'Cek Stok',     prompt: 'Kemeja linen putih ukuran M masih ada? Cek stok dong kak!' },
                { label: 'Padu Padan',   prompt: 'Tolong buatin padu padan OOTD yang cocok buat acara kondangan semi-formal!' },
              ].map((item, idx) => (
                <React.Fragment key={item.label}>
                  {idx > 0 && <span className="text-[#DED3C8]">·</span>}
                  <button
                    type="button"
                    onClick={() => {
                      onSelectSamplePrompt?.(item.prompt);
                      onScrollToChat();
                    }}
                    className="rounded-full px-2 py-0.5 text-[#5E524A] hover:bg-[#FAF7F4] hover:text-[#181615] transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Soft feathered blur transition at bottom of Hero section (no harsh cutoff line!) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-white/75 to-white backdrop-blur-[2px] z-20"
          />
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

      {/* ═══════════════════════════ 3. INTERACTIVE PHONE FEATURE SHOWCASE ═══════════════════════════ */}
      <FeaturePhoneShowcase
        onSelectSamplePrompt={onSelectSamplePrompt}
        onScrollToChat={onScrollToChat}
      />

      {/* ═══════════════════════════ 4. CURVED ARC CAROUSEL (Photo 2 Inspired) ═══════════════════════════ */}
      <ArcBenefitsCarousel
        onSelectSamplePrompt={onSelectSamplePrompt}
        onScrollToChat={onScrollToChat}
      />

      {/* ═══════════════════════════ 4.5 INTERACTIVE FOLDER & FLOATING TILES (Photo 3 Inspired) ═══════════════════════════ */}
      <OmnichannelSection onScrollToChat={onScrollToChat} />

      {/* ═══════════════════════════ 5. DOTTED WORKFLOW NODE CANVAS (Photo 1 Inspired) ═══════════════════════════ */}
      <WorkflowComparisonCanvas onScrollToChat={onScrollToChat} />

    </div>
  );
}
