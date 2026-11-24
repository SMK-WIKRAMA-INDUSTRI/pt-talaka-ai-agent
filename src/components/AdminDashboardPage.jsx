import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Bell,
  Box,
  CheckCircle2,
  Clock,
  Lock,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  RefreshCw,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
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

const STATUS_META = {
  diproses: {
    label: 'Diproses',
    step: 1,
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  dikemas: {
    label: 'Dikemas',
    step: 2,
    badge: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  dikirim: {
    label: 'Dikirim',
    step: 3,
    badge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  },
  selesai: {
    label: 'Sudah Sampai',
    step: 4,
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
};

function formatRupiah(num) {
  return `Rp${Number(num || 0).toLocaleString('id-ID')}`;
}

function formatDateTime(iso) {
  try {
    return new Date(iso).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '-';
  }
}

export default function AdminDashboardPage({
  currentUser,
  products,
  onUpdateStock,
  onResetProducts,
  onGoHome,
  onOpenLogin,
  onOrdersChanged,
}) {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrderCode, setSelectedOrderCode] = useState('');

  // Form update tracking di panel kanan
  const [courierInput, setCourierInput] = useState('J&T Express');
  const [trackingInput, setTrackingInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const [actionToast, setActionToast] = useState('');

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
        const matched =
          (prev && list.find((o) => o.orderCode === prev)) || list[0] || null;
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
            const matched =
              (prev && list.find((o) => o.orderCode === prev)) || list[0];
            syncFormWithOrder(matched);
            return matched.orderCode;
          });
        }
      })
      .finally(() => {
        if (active) setIsLoadingOrders(false);
      });
    return () => {
      active = false;
    };
  }, [currentUser, syncFormWithOrder]);

  const selectedOrder = useMemo(
    () => orders.find((o) => o.orderCode === selectedOrderCode) || null,
    [orders, selectedOrderCode]
  );

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(
      (o) => o.status === 'diproses' || o.status === 'dikemas'
    ).length;
    const shipping = orders.filter((o) => o.status === 'dikirim').length;
    const done = orders.filter((o) => o.status === 'selesai').length;
    const revenue = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
    return { total, pending, shipping, done, revenue };
  }, [orders]);

  async function generateAiArrivalMessage(order) {
    const itemSummary = (order.items || [])
      .map((i) => `${i.name} (${i.color}, ${i.size}) ×${i.qty}`)
      .join(', ');

    const fallbackMsg = `Halo Kak ${order.customerName}! ✨ Pesanan Talaka kamu (${order.orderCode}: ${itemSummary}) sudah sampai di alamat tujuan ya! Semoga potongan dan ukurannya pas & nyaman dipakai. Kalau butuh tips padu padan atau tukar ukuran (garansi 7 hari), langsung chat Kak Tala aja ya!`;

    if (!hasDeepSeekApiKey()) return fallbackMsg;

    try {
      const reply = await askDeepSeek({
        botName: 'Kak Tala',
        honestyLevel: 'seimbang',
        showExactStock: false,
        activePageContext: 'notifikasi-pesanan-sampai',
        contextText:
          'Tugas khusus: Buat 1 pesan notifikasi singkat (maksimal 3 kalimat, hangat & ramah, 1 emoji) untuk mengabari pelanggan bahwa pesanan fashion Talaka mereka baru saja sampai / selesai dikirim. Ingatkan juga garansi tukar ukuran 7 hari jika ada kendala ukuran.',
        history: [
          {
            role: 'user',
            content: `Buat notifikasi pesanan sudah sampai untuk Kak ${order.customerName}, kode pesanan ${order.orderCode}, item: ${itemSummary}, alamat: ${order.shippingAddress}.`,
          },
        ],
      });
      return reply || fallbackMsg;
    } catch {
      return fallbackMsg;
    }
  }

  async function handleUpdateStatus(nextStatus) {
    if (!selectedOrder || isUpdatingOrder) return;
    setIsUpdatingOrder(true);
    setActionToast('');

    try {
      let aiMessage = '';
      const effectiveLocation =
        locationInput.trim() ||
        (nextStatus === 'dikemas'
          ? 'Gudang Packing Talaka Bogor'
          : nextStatus === 'dikirim'
            ? `Transit Kurir ${courierInput || 'Ekspedisi'}`
            : nextStatus === 'selesai'
              ? `Diterima di ${selectedOrder.shippingAddress}`
              : selectedOrder.lastLocation);

      if (nextStatus === 'selesai') {
        aiMessage = await generateAiArrivalMessage(selectedOrder);
      }

      await updateOrderStatusInDb({
        orderCode: selectedOrder.orderCode,
        status: nextStatus,
        courier: courierInput.trim(),
        trackingNumber: trackingInput.trim(),
        lastLocation: effectiveLocation,
        note: noteInput.trim(),
        aiCompletionNote: aiMessage,
      });

      if (nextStatus === 'selesai') {
        await createNotificationInDb({
          recipientUsername: selectedOrder.customerUsername || 'guest',
          orderCode: selectedOrder.orderCode,
          title: `Pesanan ${selectedOrder.orderCode} Sudah Sampai!`,
          message: aiMessage,
          channel: 'web',
        });

        const omniRes = await dispatchOmnichannelMessage({
          orderCode: selectedOrder.orderCode,
          customerPhone: selectedOrder.customerPhone,
          message: `📦 *Pesanan ${selectedOrder.orderCode} Sudah Sampai!*\n\n${aiMessage}`,
        });

        const sentChannels = ['Web'];
        if (omniRes.telegramSent) sentChannels.push('Telegram');
        if (omniRes.whatsappSent) sentChannels.push('WhatsApp');

        setActionToast(
          `Pesanan ${selectedOrder.orderCode} ditandai Selesai & Notifikasi AI Kak Tala terkirim via ${sentChannels.join(' + ')} ke ${selectedOrder.customerName}!`
        );
      } else {
        setActionToast(
          `Status pesanan ${selectedOrder.orderCode} diperbarui ke "${STATUS_META[nextStatus]?.label || nextStatus}".`
        );
      }

      await loadOrders();
      onOrdersChanged?.();
    } finally {
      setIsUpdatingOrder(false);
    }
  }

  // Gate jika belum login sebagai admin
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
            <h1 className="text-xl font-extrabold text-slate-950">
              Khusus Dashboard Admin Talaka
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Silakan masuk menggunakan akun <strong>Admin</strong> (demo:{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-900">
                admin / talaka123
              </code>
              ) untuk mengelola pesanan, tracking pengiriman, stok live, dan
              notifikasi AI.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
            <button
              type="button"
              onClick={onGoHome}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              ← Kembali ke Toko
            </button>
            <button
              type="button"
              onClick={onOpenLogin}
              className="rounded-2xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-black transition cursor-pointer"
            >
              Masuk sebagai Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F4] text-slate-900 flex flex-col lg:flex-row">
      {/* ═══════════════════ LEFT SIDEBAR (SIDE TAB NAVIGATION) ═══════════════════ */}
      <aside className="w-full lg:w-64 shrink-0 bg-[#181615] text-white flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
        <div className="p-5 space-y-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center">
                <img
                  src={talakaLogo}
                  alt="Talaka"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-sm font-extrabold tracking-tight">
                  Talaka<span className="text-[#D6B7A5]">.admin</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  COMMERCE_OS · v2.5
                </div>
              </div>
            </div>
          </div>

          <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`flex items-center justify-between gap-2.5 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-[#9E7B66] text-white shadow-md'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 shrink-0" />
                <span>Pesanan &amp; Tracking</span>
              </span>
              {stats.pending > 0 && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-mono">
                  {stats.pending}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === 'inventory'
                  ? 'bg-[#9E7B66] text-white shadow-md'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Box className="w-4 h-4 shrink-0" />
              <span>Kelola Stok Live</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center justify-between gap-2.5 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-[#9E7B66] text-white shadow-md'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4 shrink-0" />
                <span>Analisis AI &amp; Tren</span>
              </span>
              <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-mono text-emerald-300">
                LIVE
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bots')}
              className={`flex items-center justify-between gap-2.5 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === 'bots'
                  ? 'bg-[#9E7B66] text-white shadow-md'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Bot Telegram &amp; WA</span>
              </span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 space-y-2.5 hidden lg:block">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-3 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] font-bold">
              <Activity className="w-3 h-3" />
              ADMIN AKTIF
            </div>
            <div className="font-bold text-white truncate">
              {currentUser.fullName || currentUser.username}
            </div>
          </div>
          <button
            type="button"
            onClick={onGoHome}
            className="w-full flex items-center justify-center gap-1.5 rounded-2xl bg-white text-slate-950 px-4 py-2.5 text-xs font-bold hover:bg-slate-200 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Toko &amp; Chat</span>
          </button>
        </div>
      </aside>

      {/* ═══════════════════ MAIN WORKSPACE ═══════════════════ */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950">
              {activeTab === 'orders'
                ? 'Pesanan Masuk & Tracking Pengiriman'
                : activeTab === 'inventory'
                  ? 'Manajemen Stok Produk Live'
                  : activeTab === 'bots'
                    ? 'Integrasi Bot Telegram & WhatsApp'
                    : 'Page Analisis AI, Laporan 3 Harian, & Prediksi Produk'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeTab === 'orders'
                ? 'Pantau tujuan kirim, update posisi paket, dan kirim notifikasi AI otomatis saat pesanan sampai.'
                : activeTab === 'inventory'
                  ? 'Perubahan stok langsung tersinkron ke etalase web dan pengetahuan Kak Tala AI.'
                  : activeTab === 'bots'
                    ? 'Sambungkan @BotFather Telegram & Fonnte WhatsApp ke otak Kak Tala dan notifikasi paket sampai.'
                    : 'Laporan otomatis setiap 3 hari, strategi promosi, target pembeli, dan simulasi prediksi produk baru.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'orders' && (
              <button
                type="button"
                onClick={loadOrders}
                disabled={isLoadingOrders}
                className="rounded-2xl border border-[#E6DDD4] bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:border-slate-900 transition flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`}
                />
                <span>Refresh</span>
              </button>
            )}
            <button
              type="button"
              onClick={onGoHome}
              className="lg:hidden rounded-2xl bg-slate-900 text-white px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Toko</span>
            </button>
          </div>
        </div>

        {/* Toast Banner */}
        {actionToast && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-900 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionToast}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionToast('')}
              className="text-emerald-700 hover:text-emerald-950 font-bold cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* ═══════════════════ TAB 1: ORDERS & TRACKING ═══════════════════ */}
        {activeTab === 'orders' && (
          <div className="space-y-5">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-3xl bg-white border border-[#E6DDD4] p-4 shadow-2xs">
                <div className="text-[10px] font-mono font-bold text-slate-500">
                  TOTAL PESANAN
                </div>
                <div className="text-2xl font-black text-slate-950 mt-1">
                  {stats.total}
                </div>
                <div className="text-[11px] text-[#9E7B66] font-semibold mt-0.5">
                  Omset {formatRupiah(stats.revenue)}
                </div>
              </div>
              <div className="rounded-3xl bg-white border border-[#E6DDD4] p-4 shadow-2xs">
                <div className="text-[10px] font-mono font-bold text-amber-600">
                  PERLU DIPROSES
                </div>
                <div className="text-2xl font-black text-slate-950 mt-1">
                  {stats.pending}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Diproses &amp; dikemas
                </div>
              </div>
              <div className="rounded-3xl bg-white border border-[#E6DDD4] p-4 shadow-2xs">
                <div className="text-[10px] font-mono font-bold text-indigo-600">
                  DALAM PERJALANAN
                </div>
                <div className="text-2xl font-black text-slate-950 mt-1">
                  {stats.shipping}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Sedang diantar kurir
                </div>
              </div>
              <div className="rounded-3xl bg-white border border-[#E6DDD4] p-4 shadow-2xs">
                <div className="text-[10px] font-mono font-bold text-emerald-600">
                  SUDAH SAMPAI
                </div>
                <div className="text-2xl font-black text-slate-950 mt-1">
                  {stats.done}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Notif AI terkirim
                </div>
              </div>
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
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setStatusFilter(f.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold border transition cursor-pointer ${
                    statusFilter === f.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-[#E6DDD4] hover:border-slate-400'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Split View: Order List + Tracking Side Panel */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
              {/* Left List */}
              <div className="xl:col-span-5 space-y-2.5">
                {isLoadingOrders ? (
                  <div className="rounded-3xl bg-white border border-[#E6DDD4] p-8 text-center text-xs text-slate-500">
                    Memuat pesanan dari database...
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="rounded-3xl bg-white border border-[#E6DDD4] p-8 text-center space-y-2">
                    <Package className="w-8 h-8 text-slate-300 mx-auto" />
                    <div className="text-sm font-bold text-slate-800">
                      Belum ada pesanan
                    </div>
                    <p className="text-xs text-slate-500">
                      Coba pesan produk lewat chat Kak Tala (misal: &ldquo;Kak
                      mau checkout Kemeja Linen Putih M&rdquo;) maka pesanan
                      akan langsung muncul di sini!
                    </p>
                  </div>
                ) : (
                  filteredOrders.map((order) => {
                    const meta = STATUS_META[order.status] || STATUS_META.diproses;
                    const isSelected = order.orderCode === selectedOrderCode;
                    return (
                      <button
                        key={order.orderCode}
                        type="button"
                        onClick={() => {
                          setSelectedOrderCode(order.orderCode);
                          syncFormWithOrder(order);
                        }}
                        className={`w-full text-left rounded-3xl border p-4 transition cursor-pointer space-y-2 ${
                          isSelected
                            ? 'bg-white border-slate-900 ring-2 ring-slate-900/10 shadow-sm'
                            : 'bg-white border-[#E6DDD4] hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-extrabold text-slate-950">
                            {order.orderCode}
                          </span>
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${meta.badge}`}
                          >
                            {meta.label}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-900">
                          {order.customerName}{' '}
                          <span className="font-normal text-slate-500">
                            (@{order.customerUsername})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-[#9E7B66] shrink-0" />
                          <span className="truncate">{order.shippingAddress}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-xs">
                          <span className="font-extrabold text-[#9E7B66]">
                            {formatRupiah(order.totalPrice)}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {formatDateTime(order.createdAt)}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Right Detail & Tracking Update Side Panel */}
              <div className="xl:col-span-7">
                {selectedOrder ? (
                  <div className="rounded-3xl bg-white border border-[#E6DDD4] p-5 sm:p-6 shadow-xs space-y-5">
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono font-black text-slate-950">
                            {selectedOrder.orderCode}
                          </span>
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
                              (
                                STATUS_META[selectedOrder.status] ||
                                STATUS_META.diproses
                              ).badge
                            }`}
                          >
                            {
                              (
                                STATUS_META[selectedOrder.status] ||
                                STATUS_META.diproses
                              ).label
                            }
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Metode: <strong>{selectedOrder.paymentMethod}</strong>{' '}
                          · Dibuat {formatDateTime(selectedOrder.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-mono text-slate-400">
                          TOTAL PESANAN
                        </div>
                        <div className="text-lg font-black text-slate-950">
                          {formatRupiah(selectedOrder.totalPrice)}
                        </div>
                      </div>
                    </div>

                    {/* 4-Step Progress Stepper */}
                    <div className="grid grid-cols-4 gap-2">
                      {['diproses', 'dikemas', 'dikirim', 'selesai'].map(
                        (stepKey, i) => {
                          const currentStep =
                            STATUS_META[selectedOrder.status]?.step || 1;
                          const done = i + 1 <= currentStep;
                          return (
                            <div key={stepKey} className="space-y-1.5">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  done ? 'bg-slate-900' : 'bg-slate-200'
                                }`}
                              />
                              <div
                                className={`text-[10px] font-mono font-bold ${
                                  done ? 'text-slate-950' : 'text-slate-400'
                                }`}
                              >
                                {i + 1}. {STATUS_META[stepKey].label}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>

                    {/* Recipient & Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl bg-[#FAF7F4] border border-[#E6DDD4] p-4 text-xs">
                      <div className="space-y-1">
                        <div className="text-[10px] font-mono font-bold text-[#9E7B66]">
                          TUJUAN PENGIRIMAN
                        </div>
                        <div className="font-bold text-slate-950">
                          {selectedOrder.customerName}
                        </div>
                        <div className="text-slate-600 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{selectedOrder.customerPhone || '-'}</span>
                        </div>
                        <div className="text-slate-700 leading-relaxed">
                          {selectedOrder.shippingAddress}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-[10px] font-mono font-bold text-[#9E7B66]">
                          ITEM DIPESAN
                        </div>
                        {(selectedOrder.items || []).map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-2 bg-white rounded-xl border border-[#E6DDD4] px-2.5 py-2"
                          >
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 truncate">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {item.sku} · {item.color} · {item.size} ×{' '}
                                {item.qty}
                              </div>
                            </div>
                            <span className="font-bold text-slate-900 shrink-0">
                              {formatRupiah(item.price * item.qty)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Update Courier / Position / Trigger AI Completion */}
                    <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                      <div className="text-xs font-extrabold text-slate-950 flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-[#9E7B66]" />
                        <span>Update Progres &amp; Posisi Paket</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">
                            EKSPEDISI / KURIR
                          </label>
                          <input
                            type="text"
                            value={courierInput}
                            onChange={(e) => setCourierInput(e.target.value)}
                            placeholder="J&T / JNE / SiCepat"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">
                            NOMOR RESI
                          </label>
                          <input
                            type="text"
                            value={trackingInput}
                            onChange={(e) => setTrackingInput(e.target.value)}
                            placeholder="Contoh: JP883920192"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">
                            POSISI BARANG SAAT INI
                          </label>
                          <input
                            type="text"
                            value={locationInput}
                            onChange={(e) => setLocationInput(e.target.value)}
                            placeholder="Contoh: Sortation Hub Bandung / Kurir ke alamat"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">
                            CATATAN TRACKING (OPSIONAL)
                          </label>
                          <input
                            type="text"
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            placeholder="Contoh: Paket sedang dibawa kurir menuju rumah"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          disabled={isUpdatingOrder}
                          onClick={() => handleUpdateStatus('dikemas')}
                          className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                        >
                          2. Tandai Dikemas
                        </button>
                        <button
                          type="button"
                          disabled={isUpdatingOrder}
                          onClick={() => handleUpdateStatus('dikirim')}
                          className="rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-black disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5 text-[#D6B7A5]" />
                          <span>3. Kirim / Update Lokasi</span>
                        </button>
                        <button
                          type="button"
                          disabled={isUpdatingOrder}
                          onClick={() => handleUpdateStatus('selesai')}
                          className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-40 cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          {isUpdatingOrder ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )}
                          <span>4. Sudah Sampai / Selesai (+ Notif AI)</span>
                        </button>
                      </div>
                    </div>

                    {/* Preview Notifikasi AI jika sudah selesai */}
                    {selectedOrder.aiCompletionNote && (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-800">
                          <Bell className="w-3.5 h-3.5" />
                          <span>
                            NOTIFIKASI AI KAK TALA TERKIRIM KE PEMBELI
                          </span>
                        </div>
                        <p className="text-xs text-emerald-950 leading-relaxed">
                          &ldquo;{selectedOrder.aiCompletionNote}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Tracking Timeline */}
                    <div className="space-y-2.5">
                      <div className="text-[11px] font-mono font-bold text-slate-500">
                        RIWAYAT PERJALANAN PAKET
                      </div>
                      <div className="space-y-2">
                        {(selectedOrder.trackingLogs || []).map((log, idx) => (
                          <div
                            key={log.id || idx}
                            className="flex items-start gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-3 text-xs"
                          >
                            <div
                              className={`mt-0.5 w-2.5 h-2.5 rounded-full shrink-0 ${
                                idx === 0 ? 'bg-emerald-500' : 'bg-slate-300'
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-slate-900">
                                  {log.location || 'Update Status'}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDateTime(log.createdAt)}
                                </span>
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
                    Pilih salah satu pesanan di sebelah kiri untuk melihat detail
                    tujuan kirim dan memperbarui progres pengiriman.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ TAB 2: LIVE STOCK MANAGEMENT ═══════════════════ */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-600 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>
                  Stok di sini tersinkron langsung ke Katalog Web, Checkout
                  Chatbot, dan Supabase.
                </span>
              </div>
              <button
                type="button"
                onClick={onResetProducts}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Stok Default</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((prod) => (
                <div
                  key={prod.sku}
                  className="rounded-3xl bg-white border border-[#E6DDD4] p-4 shadow-2xs space-y-3"
                >
                  <div className="flex items-center gap-3">
                    {prod.image && (
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-14 h-14 rounded-2xl object-contain bg-slate-50 border border-slate-100 p-1 shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-[#9E7B66]">
                          {prod.sku}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {prod.priceFormatted}
                        </span>
                      </div>
                      <div className="text-sm font-extrabold text-slate-950 truncate">
                        {prod.name}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {Object.entries(prod.sizes || {}).map(([color, sizeMap]) => (
                      <div
                        key={color}
                        className="rounded-2xl bg-[#FAF7F4] border border-[#E6DDD4]/80 p-2.5 space-y-1.5"
                      >
                        <div className="text-[10px] font-mono font-bold text-slate-600">
                          WARNA: {color}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(sizeMap).map(([sz, qty]) => (
                            <div
                              key={sz}
                              className="inline-flex items-center gap-1 rounded-xl bg-white border border-slate-200 px-2 py-1 text-[11px]"
                            >
                              <span className="font-bold text-slate-700">
                                {sz}:
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateStock(prod.sku, color, sz, -1)
                                }
                                className="w-4 h-4 rounded bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
                              >
                                -
                              </button>
                              <span
                                className={`font-mono font-bold min-w-[16px] text-center ${
                                  qty === 0 ? 'text-rose-600' : 'text-slate-950'
                                }`}
                              >
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateStock(prod.sku, color, sz, 1)
                                }
                                className="w-4 h-4 rounded bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 cursor-pointer"
                              >
                                +
                              </button>
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

        {/* ═══════════════════ TAB 3: PAGE ANALISIS AI & PREDIKSI PRODUK ═══════════════════ */}
        {activeTab === 'analytics' && (
          <AdminAnalyticsTab products={products} orders={orders} />
        )}

        {/* ═══════════════════ TAB 4: BOT TELEGRAM & WHATSAPP ═══════════════════ */}
        {activeTab === 'bots' && <AdminBotsTab />}
      </main>
    </div>
  );
}
