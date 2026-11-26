import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Box,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Lock,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Pin,
  RefreshCw,
  RotateCcw,
  Send,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Truck,
} from 'lucide-react';
import { gsap } from 'gsap';
import talakaLogo from '../assets/talaka-logo.svg';
import AdminAnalyticsTab from './AdminAnalyticsTab';
import AdminBotsTab from './AdminBotsTab';
import { askDeepSeek, hasDeepSeekApiKey } from '../services/deepseek';
import { dispatchOmnichannelMessage } from '../services/omnichannel';
import {
  createNotificationInDb,
  fetchOrdersFromDb,
  updateOrderStatusInDb,
} from '../services/supabase';

/* ─── Status metadata ─── */
const STATUS_META = {
  diproses: { label: 'Diproses', step: 1, badge: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  dikemas:  { label: 'Dikemas',  step: 2, badge: 'bg-blue-50 text-blue-800 border-blue-200',   dot: 'bg-blue-500' },
  dikirim:  { label: 'Dikirim',  step: 3, badge: 'bg-indigo-50 text-indigo-800 border-indigo-200', dot: 'bg-indigo-500' },
  selesai:  { label: 'Sudah Sampai', step: 4, badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
};

function formatRupiah(num) {
  return `Rp${Number(num || 0).toLocaleString('id-ID')}`;
}
function formatDateTime(iso) {
  try {
    return new Date(iso).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch { return '-'; }
}
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Selamat Pagi';
  if (h < 17) return 'Selamat Siang';
  return 'Selamat Malam';
}

/* ─── Top navigation tabs ─── */
const NAV_TABS = [
  { id: 'overview',   label: 'Dashboard',    icon: BarChart3 },
  { id: 'orders',     label: 'Pesanan',      icon: Truck },
  { id: 'inventory',  label: 'Stok',         icon: Box },
  { id: 'analytics',  label: 'Analisis AI',  icon: Sparkles },
  { id: 'bots',       label: 'Bot & Channel', icon: MessageCircle },
];

/* ─── Semi-circular gauge (SVG) ─── */
function SemiGauge({ value, max, label, sublabel }) {
  const pct = Math.min(value / max, 1);
  const r = 68;
  const circ = Math.PI * r;
  const offset = circ * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="180" height="100" viewBox="0 0 180 100" className="overflow-visible">
        <path d="M 10 90 A 68 68 0 0 1 170 90" fill="none" stroke="#EDE5DC" strokeWidth="10" strokeLinecap="round" />
        <path
          d="M 10 90 A 68 68 0 0 1 170 90"
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C4A997" />
            <stop offset="100%" stopColor="#9E7B66" />
          </linearGradient>
        </defs>
        {/* Needle dot */}
        <circle
          cx={90 + 68 * Math.cos(Math.PI * (1 - pct))}
          cy={90 - 68 * Math.sin(Math.PI * pct)}
          r="6" fill="white" stroke="#9E7B66" strokeWidth="3"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="text-center -mt-3">
        <div className="text-2xl sm:text-3xl font-black text-[#181615] tracking-tight">{value}</div>
        <div className="text-xs font-bold text-[#9E7B66] mt-0.5">{label}</div>
        {sublabel && <div className="text-[11px] text-slate-500">{sublabel}</div>}
      </div>
    </div>
  );
}

/* ─── Glossy Store Card ─── */
function StoreCard({ currentUser, productCount }) {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const el = cardRef.current;
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
      gsap.to(el, { rotateY: x, rotateX: y, duration: 0.4, ease: 'power2.out' });
    };
    const handleLeave = () => gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => { el.removeEventListener('mousemove', handleMove); el.removeEventListener('mouseleave', handleLeave); };
  }, []);

  return (
    <div className="perspective-[800px]">
      <div
        ref={cardRef}
        className="relative w-full max-w-[280px] aspect-[1.6/1] rounded-3xl overflow-hidden shadow-xl will-change-transform"
        style={{ background: 'linear-gradient(135deg, #9E7B66 0%, #7C5F4D 55%, #5C4033 100%)' }}
      >
        {/* Glossy overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-md pointer-events-none" />

        <div className="relative h-full p-5 flex flex-col justify-between text-white">
          <div className="flex items-center justify-between">
            <img src={talakaLogo} alt="Talaka" className="h-7 brightness-0 invert opacity-90" />
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-wider opacity-80">AKTIF</span>
            </div>
          </div>

          <div>
            <div className="text-lg font-black tracking-widest opacity-95 font-mono">
              {productCount} <span className="text-sm font-semibold tracking-normal">Produk</span>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] opacity-70 font-medium">ADMIN TOKO</div>
              <div className="text-sm font-bold tracking-wide">
                {currentUser?.fullName || currentUser?.username || 'Admin'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] opacity-70 font-medium">VERSI</div>
              <div className="text-xs font-bold font-mono">v2.5</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Mini sparkline (SVG) ─── */
function MiniSparkline({ data, color = '#9E7B66', width = 80, height = 28 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 4) - 2}`).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN ADMIN DASHBOARD COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function AdminDashboardPage({
  currentUser,
  products,
  onUpdateStock,
  onResetProducts,
  onGoHome,
  onOpenLogin,
  onOrdersChanged,
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const isSidebarOpen = isSidebarPinned || isSidebarHovered;
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrderCode, setSelectedOrderCode] = useState('');
  const [courierInput, setCourierInput] = useState('J&T Express');
  const [trackingInput, setTrackingInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const [actionToast, setActionToast] = useState('');
  const gaugeRef = useRef(null);

  const syncFormWithOrder = useCallback((order) => {
    if (!order) return;
    setCourierInput(order.courier || 'J&T Express');
    setTrackingInput(order.trackingNumber || '');
    setLocationInput(order.lastLocation || '');
    setNoteInput('');
  }, []);

  const loadOrders = useCallback(async () => {
    setIsLoadingOrders(true);
    try {
      const list = await fetchOrdersFromDb({ isAdmin: true });
      setOrders(list);
      setSelectedOrderCode((prev) => {
        const matched = (prev && list.find((o) => o.orderCode === prev)) || list[0] || null;
        if (matched) syncFormWithOrder(matched);
        return matched?.orderCode || '';
      });
    } finally {
      setIsLoadingOrders(false);
    }
  }, [syncFormWithOrder]);

  useEffect(() => {
    if (currentUser?.role !== 'admin') return;
    let active = true;
    fetchOrdersFromDb({ isAdmin: true })
      .then((list) => {
        if (!active) return;
        setOrders(list);
        if (list[0]) {
          setSelectedOrderCode((prev) => {
            const matched = (prev && list.find((o) => o.orderCode === prev)) || list[0];
            syncFormWithOrder(matched);
            return matched.orderCode;
          });
        }
      })
      .finally(() => { if (active) setIsLoadingOrders(false); });
    return () => { active = false; };
  }, [currentUser, syncFormWithOrder]);

  /* Gauge entrance animation */
  useEffect(() => {
    if (gaugeRef.current && activeTab === 'overview') {
      gsap.fromTo(gaugeRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.4)' });
    }
  }, [activeTab]);

  const selectedOrder = useMemo(
    () => orders.find((o) => o.orderCode === selectedOrderCode) || null,
    [orders, selectedOrderCode]
  );
  const filteredOrders = useMemo(
    () => (statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter)),
    [orders, statusFilter]
  );

  const periodOrders = useMemo(() => {
    if (periodFilter === 'all') return orders;
    const days = periodFilter === '7d' ? 7 : 30;
    const cutoff = nowMs - days * 24 * 60 * 60 * 1000;
    return orders.filter((o) => {
      const ts = new Date(o.createdAt).getTime();
      return Number.isFinite(ts) && ts >= cutoff;
    });
  }, [orders, periodFilter, nowMs]);

  const stats = useMemo(() => {
    const total = periodOrders.length;
    const pending = periodOrders.filter((o) => o.status === 'diproses' || o.status === 'dikemas').length;
    const shipping = periodOrders.filter((o) => o.status === 'dikirim').length;
    const done = periodOrders.filter((o) => o.status === 'selesai').length;
    const revenue = periodOrders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
    return { total, pending, shipping, done, revenue };
  }, [periodOrders]);

  /* Compute top selling products & total sold qty from period orders */
  const { topProducts, totalSoldQty } = useMemo(() => {
    const map = {};
    let sold = 0;
    for (const order of periodOrders) {
      for (const item of (order.items || [])) {
        const qty = item.qty || 1;
        sold += qty;
        const key = item.sku || item.name;
        if (!map[key]) map[key] = { name: item.name, sku: item.sku, qty: 0, revenue: 0 };
        map[key].qty += qty;
        map[key].revenue += (item.price || 0) * qty;
      }
    }
    return {
      topProducts: Object.values(map).sort((a, b) => b.qty - a.qty).slice(0, 5),
      totalSoldQty: sold,
    };
  }, [periodOrders]);

  /* Best seller for the gauge */
  const bestSeller = topProducts[0] || null;

  /* Stock summary by category */
  const stockSummary = useMemo(() => {
    const cats = {};
    for (const p of products) {
      const cat = p.category || 'Lainnya';
      if (!cats[cat]) cats[cat] = { total: 0, low: 0, products: 0 };
      cats[cat].products += 1;
      for (const sizeMap of Object.values(p.sizes || {})) {
        for (const qty of Object.values(sizeMap)) {
          cats[cat].total += qty;
          if (qty <= 3) cats[cat].low += 1;
        }
      }
    }
    return Object.entries(cats).map(([name, data]) => ({ name, ...data }));
  }, [products]);

  /* AI message generator for order completion */
  async function generateAiArrivalMessage(order) {
    const itemSummary = (order.items || []).map((i) => `${i.name} (${i.color}, ${i.size}) ×${i.qty}`).join(', ');
    const fallbackMsg = `Halo Kak ${order.customerName}! ✨ Pesanan Talaka kamu (${order.orderCode}: ${itemSummary}) sudah sampai di alamat tujuan ya! Semoga potongan dan ukurannya pas & nyaman dipakai. Kalau butuh tips padu padan atau tukar ukuran (garansi 7 hari), langsung chat Kak Tala aja ya!`;
    if (!hasDeepSeekApiKey()) return fallbackMsg;
    try {
      const reply = await askDeepSeek({
        botName: 'Kak Tala', honestyLevel: 'seimbang', showExactStock: false,
        activePageContext: 'notifikasi-pesanan-sampai',
        contextText: 'Tugas khusus: Buat 1 pesan notifikasi singkat (maksimal 3 kalimat, hangat & ramah, 1 emoji) untuk mengabari pelanggan bahwa pesanan fashion Talaka mereka baru saja sampai / selesai dikirim. Ingatkan juga garansi tukar ukuran 7 hari jika ada kendala ukuran.',
        history: [{ role: 'user', content: `Buat notifikasi pesanan sudah sampai untuk Kak ${order.customerName}, kode pesanan ${order.orderCode}, item: ${itemSummary}, alamat: ${order.shippingAddress}.` }],
      });
      return reply || fallbackMsg;
    } catch { return fallbackMsg; }
  }

  async function handleUpdateStatus(nextStatus) {
    if (!selectedOrder || isUpdatingOrder) return;
    setIsUpdatingOrder(true);
    setActionToast('');
    try {
      let aiMessage = '';
      const effectiveLocation = locationInput.trim() ||
        (nextStatus === 'dikemas' ? 'Gudang Packing Talaka Bogor' :
         nextStatus === 'dikirim' ? `Transit Kurir ${courierInput || 'Ekspedisi'}` :
         nextStatus === 'selesai' ? `Diterima di ${selectedOrder.shippingAddress}` :
         selectedOrder.lastLocation);

      if (nextStatus === 'selesai') aiMessage = await generateAiArrivalMessage(selectedOrder);

      await updateOrderStatusInDb({
        orderCode: selectedOrder.orderCode, status: nextStatus,
        courier: courierInput.trim(), trackingNumber: trackingInput.trim(),
        lastLocation: effectiveLocation, note: noteInput.trim(), aiCompletionNote: aiMessage,
      });

      if (nextStatus === 'selesai') {
        await createNotificationInDb({
          recipientUsername: selectedOrder.customerUsername || 'guest',
          orderCode: selectedOrder.orderCode,
          title: `Pesanan ${selectedOrder.orderCode} Sudah Sampai!`,
          message: aiMessage, channel: 'web',
        });
        const omniRes = await dispatchOmnichannelMessage({
          orderCode: selectedOrder.orderCode,
          customerPhone: selectedOrder.customerPhone,
          message: `📦 *Pesanan ${selectedOrder.orderCode} Sudah Sampai!*\n\n${aiMessage}`,
        });
        const sentChannels = ['Web'];
        if (omniRes.telegramSent) sentChannels.push('Telegram');
        if (omniRes.whatsappSent) sentChannels.push('WhatsApp');
        setActionToast(`Pesanan ${selectedOrder.orderCode} ditandai Selesai & Notifikasi AI Kak Tala terkirim via ${sentChannels.join(' + ')} ke ${selectedOrder.customerName}!`);
      } else {
        setActionToast(`Status pesanan ${selectedOrder.orderCode} diperbarui ke "${STATUS_META[nextStatus]?.label || nextStatus}".`);
      }
      await loadOrders();
      onOrdersChanged?.();
    } finally { setIsUpdatingOrder(false); }
  }

  /* ─── Gate: not admin ─── */
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#FAF7F4] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-white border border-[#E6DDD4] shadow-xl p-7 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
            <Lock className="w-6 h-6 text-[#D6B7A5]" />
          </div>
          <div className="space-y-1.5">
            <span className="inline-block rounded-full bg-[#9E7B66]/10 border border-[#9E7B66]/25 px-3 py-0.5 text-[10px] font-mono font-bold text-[#9E7B66]">
              ADMIN_ACCESS_ONLY
            </span>
            <h1 className="text-xl font-extrabold text-slate-950">Khusus Dashboard Admin Talaka</h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Silakan masuk menggunakan akun <strong>Admin</strong> (demo:{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-900">admin / talaka123</code>
              ) untuk mengelola pesanan, tracking pengiriman, stok live, dan notifikasi AI.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
            <button type="button" onClick={onGoHome} className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer">← Kembali ke Toko</button>
            <button type="button" onClick={onOpenLogin} className="rounded-2xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-black transition cursor-pointer">Masuk sebagai Admin</button>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     MAIN RENDER
     ═══════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#FAF7F4] text-slate-900 flex flex-col md:flex-row">
      {/* ═══════════════════ MOBILE COMPACT TOP BAR ═══════════════════ */}
      <header className="md:hidden sticky top-0 z-50 px-3 pt-3">
        <div
          className="rounded-3xl px-4 py-2.5 shadow-[0_8px_28px_rgba(61,44,34,0.22)] flex items-center justify-between gap-2"
          style={{ background: 'linear-gradient(90deg, #9E7B66 0%, #6E5140 55%, #3D2C22 100%)' }}
        >
          <div className="w-8 h-8 rounded-full bg-white/20 p-1.5 flex items-center justify-center shrink-0">
            <img src={talakaLogo} alt="Talaka" className="w-full h-full object-contain brightness-0 invert" />
          </div>
          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {NAV_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#FAF7F4] text-[#181615] shadow-sm'
                      : 'text-white/80 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={onGoHome}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white shrink-0 cursor-pointer"
            title="Kembali ke Toko"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ═══════════════════ DESKTOP SIDEBAR (Hover-Expand + Pin + Liquid Cutout) ═══════════════════ */}
      <aside
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        className="hidden md:flex sticky top-0 h-screen py-3 pl-3 shrink-0 z-40"
      >
        <div
          className={`relative h-full rounded-[32px] flex flex-col justify-between py-5 shadow-[0_16px_42px_rgba(61,44,34,0.24)] transition-all duration-300 ease-out ${
            isSidebarOpen ? 'w-[228px]' : 'w-[74px]'
          }`}
          style={{ background: 'linear-gradient(180deg, #9E7B66 0%, #6E5140 48%, #3D2C22 100%)' }}
        >
          {/* Top: Brand Emblem + Pin/Lock Button */}
          <div className={`flex items-center ${isSidebarOpen ? 'justify-between px-4' : 'justify-center px-2'}`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-full bg-white/20 border border-white/25 p-2 flex items-center justify-center backdrop-blur-sm shadow-inner shrink-0">
                <img src={talakaLogo} alt="Talaka" className="w-full h-full object-contain brightness-0 invert" />
              </div>
              {isSidebarOpen && (
                <div className="truncate">
                  <div className="text-sm font-extrabold text-white tracking-tight">
                    Talaka<span className="text-white/60">.admin</span>
                  </div>
                </div>
              )}
            </div>

            {isSidebarOpen && (
              <button
                type="button"
                onClick={() => setIsSidebarPinned((prev) => !prev)}
                title={isSidebarPinned ? 'Lepas kunci sidebar' : 'Kunci sidebar terbuka'}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer shrink-0 ${
                  isSidebarPinned
                    ? 'bg-white text-[#3D2C22] shadow-sm'
                    : 'bg-white/15 text-white/85 hover:bg-white/25 hover:text-white'
                }`}
              >
                {isSidebarPinned ? <Pin className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          {/* Center: Navigation Tabs */}
          <nav className="flex-1 flex flex-col justify-center gap-2.5 py-6">
            {NAV_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const TabIcon = tab.icon;

              if (!isSidebarOpen) {
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    title={tab.label}
                    className={`mx-auto w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#FAF7F4] text-[#181615] shadow-md scale-105'
                        : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                  </button>
                );
              }

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-3 text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'ml-3 pl-4 pr-5 py-3 rounded-l-full bg-[#FAF7F4] text-[#181615] font-extrabold'
                      : 'mx-3 px-4 py-2.5 rounded-full bg-white/10 text-white/85 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {/* Concave Inverted-Corner Cutouts on Active Tab (Matches Reference Photo) */}
                  {isActive && (
                    <>
                      <svg
                        className="pointer-events-none absolute right-0 -top-4 w-4 h-4"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path d="M16 0 L16 16 L0 16 A16 16 0 0 0 16 0 Z" fill="#FAF7F4" />
                      </svg>
                      <svg
                        className="pointer-events-none absolute right-0 -bottom-4 w-4 h-4"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path d="M0 0 L16 0 L16 16 A16 16 0 0 0 0 0 Z" fill="#FAF7F4" />
                      </svg>
                    </>
                  )}
                  <TabIcon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#9E7B66]' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom: Back to Store */}
          <div className="px-3">
            <button
              type="button"
              onClick={onGoHome}
              title="Kembali ke Toko"
              className={`flex items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white/90 transition cursor-pointer ${
                isSidebarOpen ? 'w-full px-4 py-2.5' : 'mx-auto w-11 h-11'
              }`}
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Kembali ke Toko</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* ═══════════════════ CONTENT ═══════════════════ */}
      <main className="flex-1 min-w-0 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Toast Banner */}
        {actionToast && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-900 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionToast}</span>
            </div>
            <button type="button" onClick={() => setActionToast('')} className="text-emerald-700 hover:text-emerald-950 font-bold cursor-pointer">×</button>
          </div>
        )}

        {/* ═══════════════════ TAB: OVERVIEW DASHBOARD ═══════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Period Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-1 rounded-full bg-white border border-[#E6DDD4] p-1 shadow-xs">
                {[
                  { id: 'all', label: 'Semua' },
                  { id: '7d', label: '7 Hari' },
                  { id: '30d', label: '30 Hari' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setPeriodFilter(opt.id);
                      setNowMs(Date.now());
                    }}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                      periodFilter === opt.id
                        ? 'bg-[#9E7B66] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#181615]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={loadOrders}
                disabled={isLoadingOrders}
                className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#E6DDD4] px-3.5 py-1.5 text-xs font-bold text-[#181615] hover:border-[#9E7B66] transition cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#9E7B66] ${isLoadingOrders ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
              </button>
            </div>

            {/* Top Row: Greeting + KPIs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Greeting + Store Card + Categories */}
              <div className="lg:col-span-4 space-y-5">
                {/* Greeting */}
                <div>
                  <div className="text-sm text-[#9E7B66] font-semibold">{getGreeting()},</div>
                  <h1 className="text-2xl font-black text-[#181615] tracking-tight">
                    {currentUser.fullName || currentUser.username}
                  </h1>
                </div>

                {/* Store Card */}
                <StoreCard currentUser={currentUser} productCount={products.length} />

                {/* Quick Category Stats */}
                <div className="grid grid-cols-3 gap-2.5">
                  {stockSummary.slice(0, 3).map((cat) => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setActiveTab('inventory')}
                      className="flex flex-col items-center gap-1.5 rounded-2xl bg-white border border-[#E6DDD4] p-3 hover:border-[#9E7B66] hover:shadow-sm transition cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#FAF7F4] border border-[#EDE5DC] flex items-center justify-center group-hover:bg-[#9E7B66]/10 transition">
                        <ShoppingBag className="w-4 h-4 text-[#9E7B66]" />
                      </div>
                      <div className="text-[11px] font-bold text-[#181615] text-center truncate w-full">{cat.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{cat.total} pcs</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Center Column: Gauge + Revenue Chart + Transactions */}
              <div className="lg:col-span-4 space-y-5">
                {/* Gauge: Produk Paling Banyak Dibeli */}
                <div ref={gaugeRef} className="rounded-3xl bg-white border border-[#E6DDD4] p-5 shadow-xs flex flex-col items-center">
                  <SemiGauge
                    value={bestSeller?.qty || 0}
                    max={Math.max(totalSoldQty, 1)}
                    label={bestSeller?.name || 'Belum ada data'}
                    sublabel={
                      totalSoldQty > 0 && bestSeller
                        ? `Produk Paling Laris • ${Math.round((bestSeller.qty / totalSoldQty) * 100)}% dari ${totalSoldQty} terjual`
                        : 'Produk Paling Laris'
                    }
                  />
                </div>

                {/* Omset Card */}
                <div className="rounded-3xl bg-white border border-[#E6DDD4] p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Total Omset</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="flex items-end gap-3">
                    <span className="text-2xl font-black text-[#181615]">{formatRupiah(stats.revenue)}</span>
                  </div>
                  <MiniSparkline
                    data={periodOrders.slice(0, 12).map((o) => o.totalPrice || 0).reverse()}
                    color="#9E7B66"
                    width={240}
                    height={36}
                  />
                </div>

                {/* Recent Transactions */}
                <div className="rounded-3xl bg-white border border-[#E6DDD4] p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Transaksi Terbaru</span>
                    <button type="button" onClick={() => setActiveTab('orders')} className="text-[11px] font-bold text-[#9E7B66] hover:underline cursor-pointer">
                      Lihat Semua →
                    </button>
                  </div>
                  <div className="space-y-2">
                    {periodOrders.slice(0, 3).map((order) => {
                      const meta = STATUS_META[order.status] || STATUS_META.diproses;
                      return (
                        <div key={order.orderCode} className="flex items-center gap-3 rounded-2xl bg-[#FAF7F4] border border-[#EDE5DC] p-3">
                          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${meta.dot}`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-[#181615] truncate">{order.customerName}</div>
                            <div className="text-[10px] text-slate-500">{formatDateTime(order.createdAt)}</div>
                          </div>
                          <span className="text-xs font-black text-[#9E7B66] shrink-0">
                            {order.totalPrice > 0 ? formatRupiah(order.totalPrice) : '-'}
                          </span>
                        </div>
                      );
                    })}
                    {periodOrders.length === 0 && (
                      <div className="text-xs text-slate-500 text-center py-3">Belum ada transaksi pada periode ini.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Wallet/KPIs + Top Products + Stock Radar */}
              <div className="lg:col-span-4 space-y-5">
                {/* Wallet-style KPI */}
                <div className="rounded-3xl bg-white border border-[#E6DDD4] p-5 shadow-xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Pesanan</div>
                  <div className="text-3xl font-black text-[#181615] mt-1">{stats.total}</div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-amber-50 border border-amber-100 py-2">
                      <div className="text-sm font-black text-amber-700">{stats.pending}</div>
                      <div className="text-[10px] text-amber-600 font-medium">Proses</div>
                    </div>
                    <div className="rounded-xl bg-indigo-50 border border-indigo-100 py-2">
                      <div className="text-sm font-black text-indigo-700">{stats.shipping}</div>
                      <div className="text-[10px] text-indigo-600 font-medium">Kirim</div>
                    </div>
                    <div className="rounded-xl bg-emerald-50 border border-emerald-100 py-2">
                      <div className="text-sm font-black text-emerald-700">{stats.done}</div>
                      <div className="text-[10px] text-emerald-600 font-medium">Sampai</div>
                    </div>
                  </div>
                </div>

                {/* Ringkasan Stok per Kategori */}
                <div className="rounded-3xl bg-white border border-[#E6DDD4] p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Ringkasan Stok</span>
                    <button type="button" onClick={() => setActiveTab('inventory')} className="text-[11px] font-bold text-[#9E7B66] hover:underline cursor-pointer">
                      Kelola →
                    </button>
                  </div>
                  <div className="space-y-2">
                    {stockSummary.map((cat) => {
                      const pct = cat.total > 0 ? Math.round((1 - cat.low / Math.max(cat.total, 1)) * 100) : 0;
                      return (
                        <div key={cat.name} className="flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-bold text-[#181615]">{cat.name}</span>
                              <span className="text-[10px] font-mono text-slate-500">{cat.total} pcs</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${pct > 60 ? 'bg-[#9E7B66]' : pct > 30 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Produk Terlaris */}
                <div className="rounded-3xl bg-white border border-[#E6DDD4] p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Produk Terlaris</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="space-y-2.5">
                    {topProducts.map((p, idx) => (
                      <div key={p.sku || idx} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${
                          idx === 0 ? 'bg-[#9E7B66] text-white' : idx === 1 ? 'bg-[#C4A997] text-white' : 'bg-[#FAF7F4] text-[#9E7B66] border border-[#E6DDD4]'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-bold text-[#181615] truncate">{p.name}</div>
                          <div className="text-[10px] text-slate-500">{p.sku}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[11px] font-black text-[#181615]">{p.qty}x</div>
                          <div className="text-[10px] font-medium text-emerald-600 flex items-center gap-0.5 justify-end">
                            <TrendingUp className="w-3 h-3" />
                            <span>{formatRupiah(p.revenue)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {topProducts.length === 0 && (
                      <div className="text-xs text-slate-500 text-center py-3">Belum ada data penjualan.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ TAB: PESANAN & TRACKING ═══════════════════ */}
        {activeTab === 'orders' && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-[#181615]">Pesanan Masuk & Tracking</h2>
                <p className="text-xs text-slate-500 mt-0.5">Pantau tujuan kirim, update posisi paket, dan kirim notifikasi AI otomatis saat pesanan sampai.</p>
              </div>
              <button type="button" onClick={loadOrders} disabled={isLoadingOrders} className="rounded-2xl border border-[#E6DDD4] bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:border-[#9E7B66] transition flex items-center gap-1.5 cursor-pointer">
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'TOTAL PESANAN', value: stats.total, sub: `Omset ${formatRupiah(stats.revenue)}`, color: 'text-[#9E7B66]' },
                { label: 'PERLU DIPROSES', value: stats.pending, sub: 'Diproses & dikemas', color: 'text-amber-600' },
                { label: 'DALAM PERJALANAN', value: stats.shipping, sub: 'Sedang diantar kurir', color: 'text-indigo-600' },
                { label: 'SUDAH SAMPAI', value: stats.done, sub: 'Notif AI terkirim', color: 'text-emerald-600' },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-3xl bg-white border border-[#E6DDD4] p-4 shadow-2xs">
                  <div className={`text-[10px] font-mono font-bold ${kpi.color}`}>{kpi.label}</div>
                  <div className="text-2xl font-black text-[#181615] mt-1">{kpi.value}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{kpi.sub}</div>
                </div>
              ))}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'diproses', label: 'Diproses' },
                { id: 'dikemas', label: 'Dikemas' },
                { id: 'dikirim', label: 'Dikirim' },
                { id: 'selesai', label: 'Sudah Sampai' },
              ].map((f) => (
                <button key={f.id} type="button" onClick={() => setStatusFilter(f.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold border transition cursor-pointer ${
                    statusFilter === f.id ? 'bg-[#181615] text-white border-[#181615]' : 'bg-white text-slate-600 border-[#E6DDD4] hover:border-[#9E7B66]'
                  }`}
                >{f.label}</button>
              ))}
            </div>

            {/* Split View: Order List + Tracking Side Panel */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
              {/* Left List */}
              <div className="xl:col-span-5 space-y-2.5">
                {isLoadingOrders ? (
                  <div className="rounded-3xl bg-white border border-[#E6DDD4] p-8 text-center text-xs text-slate-500">Memuat pesanan dari database...</div>
                ) : filteredOrders.length === 0 ? (
                  <div className="rounded-3xl bg-white border border-[#E6DDD4] p-8 text-center space-y-2">
                    <Package className="w-8 h-8 text-slate-300 mx-auto" />
                    <div className="text-sm font-bold text-slate-800">Belum ada pesanan</div>
                    <p className="text-xs text-slate-500">Coba pesan produk lewat chat Kak Tala (misal: &ldquo;Kak mau checkout Kemeja Linen Putih M&rdquo;) maka pesanan akan langsung muncul di sini!</p>
                  </div>
                ) : (
                  filteredOrders.map((order) => {
                    const meta = STATUS_META[order.status] || STATUS_META.diproses;
                    const isSelected = order.orderCode === selectedOrderCode;
                    return (
                      <button key={order.orderCode} type="button"
                        onClick={() => { setSelectedOrderCode(order.orderCode); syncFormWithOrder(order); }}
                        className={`w-full text-left rounded-3xl border p-4 transition cursor-pointer space-y-2 ${
                          isSelected ? 'bg-white border-[#9E7B66] ring-2 ring-[#9E7B66]/15 shadow-sm' : 'bg-white border-[#E6DDD4] hover:border-[#9E7B66]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-extrabold text-[#181615]">{order.orderCode}</span>
                          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${meta.badge}`}>{meta.label}</span>
                        </div>
                        <div className="text-xs font-bold text-[#181615]">{order.customerName} <span className="font-normal text-slate-500">(@{order.customerUsername})</span></div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-[#9E7B66] shrink-0" />
                          <span className="truncate">{order.shippingAddress}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1.5 border-t border-[#EDE5DC] text-xs">
                          <span className="font-extrabold text-[#9E7B66]">{formatRupiah(order.totalPrice)}</span>
                          <span className="text-[10px] font-mono text-slate-400">{formatDateTime(order.createdAt)}</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Right Detail & Tracking Panel */}
              <div className="xl:col-span-7">
                {selectedOrder ? (
                  <div className="rounded-3xl bg-white border border-[#E6DDD4] p-5 sm:p-6 shadow-xs space-y-5">
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#EDE5DC] pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono font-black text-[#181615]">{selectedOrder.orderCode}</span>
                          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${(STATUS_META[selectedOrder.status] || STATUS_META.diproses).badge}`}>
                            {(STATUS_META[selectedOrder.status] || STATUS_META.diproses).label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Metode: <strong>{selectedOrder.paymentMethod}</strong> · Dibuat {formatDateTime(selectedOrder.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-mono text-slate-400">TOTAL PESANAN</div>
                        <div className="text-lg font-black text-[#181615]">{formatRupiah(selectedOrder.totalPrice)}</div>
                      </div>
                    </div>

                    {/* 4-Step Progress Stepper */}
                    <div className="grid grid-cols-4 gap-2">
                      {['diproses', 'dikemas', 'dikirim', 'selesai'].map((stepKey, i) => {
                        const currentStep = STATUS_META[selectedOrder.status]?.step || 1;
                        const done = i + 1 <= currentStep;
                        return (
                          <div key={stepKey} className="space-y-1.5">
                            <div className={`h-2 rounded-full transition-all ${done ? 'bg-[#9E7B66]' : 'bg-[#EDE5DC]'}`} />
                            <div className={`text-[10px] font-mono font-bold ${done ? 'text-[#181615]' : 'text-slate-400'}`}>
                              {i + 1}. {STATUS_META[stepKey].label}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Recipient & Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl bg-[#FAF7F4] border border-[#E6DDD4] p-4 text-xs">
                      <div className="space-y-1">
                        <div className="text-[10px] font-mono font-bold text-[#9E7B66]">TUJUAN PENGIRIMAN</div>
                        <div className="font-bold text-[#181615]">{selectedOrder.customerName}</div>
                        <div className="text-slate-600 flex items-center gap-1"><Phone className="w-3 h-3" /><span>{selectedOrder.customerPhone || '-'}</span></div>
                        <div className="text-slate-700 leading-relaxed">{selectedOrder.shippingAddress}</div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-mono font-bold text-[#9E7B66]">ITEM DIPESAN</div>
                        {(selectedOrder.items || []).map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-2 bg-white rounded-xl border border-[#E6DDD4] px-2.5 py-2">
                            <div className="min-w-0">
                              <div className="font-bold text-[#181615] truncate">{item.name}</div>
                              <div className="text-[10px] text-slate-500">{item.sku} · {item.color} · {item.size} × {item.qty}</div>
                            </div>
                            <span className="font-bold text-[#181615] shrink-0">{formatRupiah(item.price * item.qty)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Update Courier / Position */}
                    <div className="rounded-2xl border border-[#E6DDD4] p-4 space-y-3">
                      <div className="text-xs font-extrabold text-[#181615] flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-[#9E7B66]" />
                        <span>Update Progres &amp; Posisi Paket</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">EKSPEDISI / KURIR</label>
                          <input type="text" value={courierInput} onChange={(e) => setCourierInput(e.target.value)} placeholder="J&T / JNE / SiCepat" className="w-full rounded-xl border border-[#E6DDD4] bg-[#FAF7F4] px-3 py-2 text-xs text-[#181615] focus:border-[#9E7B66] focus:bg-white focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">NOMOR RESI</label>
                          <input type="text" value={trackingInput} onChange={(e) => setTrackingInput(e.target.value)} placeholder="Contoh: JP883920192" className="w-full rounded-xl border border-[#E6DDD4] bg-[#FAF7F4] px-3 py-2 text-xs text-[#181615] focus:border-[#9E7B66] focus:bg-white focus:outline-none" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">POSISI BARANG SAAT INI</label>
                          <input type="text" value={locationInput} onChange={(e) => setLocationInput(e.target.value)} placeholder="Sortation Hub Bandung / Kurir ke alamat" className="w-full rounded-xl border border-[#E6DDD4] bg-[#FAF7F4] px-3 py-2 text-xs text-[#181615] focus:border-[#9E7B66] focus:bg-white focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">CATATAN TRACKING (OPSIONAL)</label>
                          <input type="text" value={noteInput} onChange={(e) => setNoteInput(e.target.value)} placeholder="Paket sedang dibawa kurir menuju rumah" className="w-full rounded-xl border border-[#E6DDD4] bg-[#FAF7F4] px-3 py-2 text-xs text-[#181615] focus:border-[#9E7B66] focus:bg-white focus:outline-none" />
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button type="button" disabled={isUpdatingOrder} onClick={() => handleUpdateStatus('dikemas')} className="rounded-xl border border-[#E6DDD4] bg-white px-3.5 py-2 text-xs font-bold text-[#181615] hover:bg-[#FAF7F4] disabled:opacity-40 cursor-pointer">2. Tandai Dikemas</button>
                        <button type="button" disabled={isUpdatingOrder} onClick={() => handleUpdateStatus('dikirim')} className="rounded-xl bg-[#181615] px-3.5 py-2 text-xs font-bold text-white hover:bg-black disabled:opacity-40 cursor-pointer flex items-center gap-1.5">
                          <Send className="w-3.5 h-3.5 text-[#D6B7A5]" /><span>3. Kirim / Update Lokasi</span>
                        </button>
                        <button type="button" disabled={isUpdatingOrder} onClick={() => handleUpdateStatus('selesai')} className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-40 cursor-pointer flex items-center gap-1.5 shadow-sm">
                          {isUpdatingOrder ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                          <span>4. Sudah Sampai (+ Notif AI)</span>
                        </button>
                      </div>
                    </div>

                    {/* AI Completion Note */}
                    {selectedOrder.aiCompletionNote && (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-800">
                          <Bell className="w-3.5 h-3.5" /><span>NOTIFIKASI AI KAK TALA TERKIRIM KE PEMBELI</span>
                        </div>
                        <p className="text-xs text-emerald-950 leading-relaxed">&ldquo;{selectedOrder.aiCompletionNote}&rdquo;</p>
                      </div>
                    )}

                    {/* Tracking Timeline */}
                    <div className="space-y-2.5">
                      <div className="text-[11px] font-mono font-bold text-slate-500">RIWAYAT PERJALANAN PAKET</div>
                      <div className="space-y-2">
                        {(selectedOrder.trackingLogs || []).map((log, idx) => (
                          <div key={log.id || idx} className="flex items-start gap-3 rounded-2xl bg-[#FAF7F4] border border-[#EDE5DC] p-3 text-xs">
                            <div className={`mt-0.5 w-2.5 h-2.5 rounded-full shrink-0 ${idx === 0 ? 'bg-[#9E7B66]' : 'bg-slate-300'}`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-[#181615]">{log.location || 'Update Status'}</span>
                                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{formatDateTime(log.createdAt)}</span>
                              </div>
                              <p className="text-slate-600 mt-0.5">{log.note}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl bg-white border border-[#E6DDD4] p-10 text-center text-xs text-slate-500">
                    Pilih salah satu pesanan di sebelah kiri untuk melihat detail tujuan kirim dan memperbarui progres pengiriman.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ TAB: KELOLA STOK ═══════════════════ */}
        {activeTab === 'inventory' && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-[#181615]">Manajemen Stok Produk Live</h2>
                <p className="text-xs text-slate-500 mt-0.5">Perubahan stok langsung tersinkron ke etalase web dan pengetahuan Kak Tala AI.</p>
              </div>
              <button type="button" onClick={onResetProducts} className="rounded-2xl border border-[#E6DDD4] bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:border-[#9E7B66] flex items-center gap-1.5 cursor-pointer">
                <RotateCcw className="w-3.5 h-3.5" /><span>Reset Stok Default</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((prod) => (
                <div key={prod.sku} className="rounded-3xl bg-white border border-[#E6DDD4] p-4 shadow-2xs space-y-3">
                  <div className="flex items-center gap-3">
                    {prod.image && (
                      <img src={prod.image} alt={prod.name} className="w-14 h-14 rounded-2xl object-contain bg-[#FAF7F4] border border-[#EDE5DC] p-1 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-[#9E7B66]">{prod.sku}</span>
                        <span className="text-xs font-bold text-[#181615]">{prod.priceFormatted}</span>
                      </div>
                      <div className="text-sm font-extrabold text-[#181615] truncate">{prod.name}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(prod.sizes || {}).map(([color, sizeMap]) => (
                      <div key={color} className="rounded-2xl bg-[#FAF7F4] border border-[#E6DDD4]/80 p-2.5 space-y-1.5">
                        <div className="text-[10px] font-mono font-bold text-slate-600">WARNA: {color}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(sizeMap).map(([sz, qty]) => (
                            <div key={sz} className="inline-flex items-center gap-1 rounded-xl bg-white border border-[#E6DDD4] px-2 py-1 text-[11px]">
                              <span className="font-bold text-slate-700">{sz}:</span>
                              <button type="button" onClick={() => onUpdateStock(prod.sku, color, sz, -1)} className="w-4 h-4 rounded bg-[#FAF7F4] hover:bg-[#E6DDD4] font-bold text-slate-700 cursor-pointer">-</button>
                              <span className={`font-mono font-bold min-w-[16px] text-center ${qty === 0 ? 'text-rose-600' : 'text-[#181615]'}`}>{qty}</span>
                              <button type="button" onClick={() => onUpdateStock(prod.sku, color, sz, 1)} className="w-4 h-4 rounded bg-[#FAF7F4] hover:bg-[#E6DDD4] font-bold text-slate-700 cursor-pointer">+</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════ TAB: ANALISIS AI ═══════════════════ */}
        {activeTab === 'analytics' && (
          <AdminAnalyticsTab products={products} orders={orders} />
        )}

        {/* ═══════════════════ TAB: BOT TELEGRAM & WA ═══════════════════ */}
        {activeTab === 'bots' && <AdminBotsTab />}
      </main>
    </div>
  );
}
