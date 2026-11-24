import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  RefreshCw,
  Sparkles,
  Truck,
  X,
} from 'lucide-react';

const STEP_META = {
  diproses: { label: 'Diproses', step: 1, badge: 'bg-amber-50 text-amber-800 border-amber-200' },
  dikemas: { label: 'Dikemas', step: 2, badge: 'bg-blue-50 text-blue-800 border-blue-200' },
  dikirim: { label: 'Dikirim', step: 3, badge: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  selesai: { label: 'Sudah Sampai', step: 4, badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
};

function formatRupiah(num) {
  return `Rp${Number(num || 0).toLocaleString('id-ID')}`;
}

function formatDate(iso) {
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

export default function CustomerOrdersDrawer({
  isOpen,
  onClose,
  orders = [],
  notifications = [],
  isLoading = false,
  onRefresh,
  currentUser,
  onOpenAdmin,
}) {
  const [tab, setTab] = useState('orders');

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/55 backdrop-blur-xs">
      {/* Clickable backdrop */}
      <div className="flex-1" onClick={onClose} aria-hidden="true" />

      {/* Slide-over Side Panel */}
      <aside className="w-full max-w-md bg-[#FAF7F4] h-full shadow-2xl border-l border-[#E6DDD4] flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-[#E6DDD4] px-5 py-4 flex items-center justify-between gap-2">
          <div>
            <div className="text-sm font-black text-slate-950 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#9E7B66]" />
              <span>Pesanan &amp; Notifikasi AI</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Akun: <strong>{currentUser?.username || 'guest'}</strong> · Pantau
              paket real-time
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onRefresh}
              className="w-8 h-8 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-950 cursor-pointer"
              title="Refresh status paket"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`}
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-950 cursor-pointer"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="bg-white border-b border-[#E6DDD4] px-5 py-2.5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTab('orders')}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'orders'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Lacak Paket ({orders.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('notifications')}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'notifications'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notif Kak Tala</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-rose-500 text-white px-1.5 py-0.2 text-[10px] font-mono">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {tab === 'orders' && (
            <>
              {orders.length === 0 ? (
                <div className="rounded-3xl bg-white border border-[#E6DDD4] p-7 text-center space-y-2">
                  <Package className="w-8 h-8 text-slate-300 mx-auto" />
                  <div className="text-sm font-bold text-slate-900">
                    Belum ada pesanan
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Kamu bisa langsung checkout lewat chat Kak Tala (misal:
                    &ldquo;Kak mau pesan Kemeja Linen Putih ukuran M&rdquo;) dan
                    progres kirimnya otomatis muncul di sini!
                  </p>
                </div>
              ) : (
                orders.map((order) => {
                  const meta = STEP_META[order.status] || STEP_META.diproses;
                  return (
                    <div
                      key={order.orderCode}
                      className="rounded-3xl bg-white border border-[#E6DDD4] p-4 shadow-2xs space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-black text-slate-950">
                          {order.orderCode}
                        </span>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${meta.badge}`}
                        >
                          {meta.label}
                        </span>
                      </div>

                      {/* Visual Progress Bar */}
                      <div className="grid grid-cols-4 gap-1.5">
                        {['diproses', 'dikemas', 'dikirim', 'selesai'].map(
                          (key, idx) => (
                            <div key={key} className="space-y-1">
                              <div
                                className={`h-1.5 rounded-full ${
                                  idx + 1 <= meta.step
                                    ? 'bg-slate-900'
                                    : 'bg-slate-200'
                                }`}
                              />
                              <div className="text-[9px] font-mono text-slate-500 truncate">
                                {STEP_META[key].label}
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      {/* Posisi Terakhir */}
                      <div className="rounded-2xl bg-[#FAF7F4] border border-[#E6DDD4] p-3 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <MapPin className="w-3.5 h-3.5 text-[#9E7B66] shrink-0" />
                          <span>Posisi: {order.lastLocation}</span>
                        </div>
                        {(order.courier || order.trackingNumber) && (
                          <div className="text-[11px] font-mono text-slate-600">
                            Kurir: {order.courier || '-'} · Resi:{' '}
                            {order.trackingNumber || '-'}
                          </div>
                        )}
                        <div className="text-[11px] text-slate-500">
                          Tujuan: {order.shippingAddress}
                        </div>
                      </div>

                      {/* Item Summary */}
                      <div className="space-y-1 text-xs">
                        {(order.items || []).map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-slate-700"
                          >
                            <span className="truncate">
                              {item.name} ({item.color}, {item.size}) ×{item.qty}
                            </span>
                            <span className="font-bold text-slate-900 shrink-0">
                              {formatRupiah(item.price * item.qty)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Notifikasi Selesai AI */}
                      {order.aiCompletionNote && (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-[11px] text-emerald-950 space-y-1">
                          <div className="font-mono font-bold text-emerald-700 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>PESAN DARI KAK TALA AI</span>
                          </div>
                          <p className="leading-relaxed">
                            {order.aiCompletionNote}
                          </p>
                        </div>
                      )}

                      {/* Mini Timeline */}
                      {order.trackingLogs?.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 space-y-1.5">
                          {order.trackingLogs.slice(0, 3).map((log, i) => (
                            <div
                              key={log.id || i}
                              className="flex items-start gap-2 text-[11px] text-slate-600"
                            >
                              <Clock className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
                              <div>
                                <span className="font-semibold text-slate-800">
                                  {log.location}
                                </span>{' '}
                                — {log.note}{' '}
                                <span className="text-[10px] text-slate-400">
                                  ({formatDate(log.createdAt)})
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </>
          )}

          {tab === 'notifications' && (
            <>
              {notifications.length === 0 ? (
                <div className="rounded-3xl bg-white border border-[#E6DDD4] p-7 text-center space-y-2">
                  <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                  <div className="text-sm font-bold text-slate-900">
                    Belum ada notifikasi AI
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Ketika Admin klik tombol{' '}
                    <strong>Sudah Sampai / Selesai</strong> pada pesananmu,
                    Kak Tala otomatis mengirim notifikasi ke sini.
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`rounded-3xl border p-4 space-y-1.5 ${
                      notif.isRead
                        ? 'bg-white border-[#E6DDD4]'
                        : 'bg-emerald-50/70 border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-slate-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{notif.title}</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {formatDate(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        {/* Footer shortcut for Admin */}
        {currentUser?.role === 'admin' && onOpenAdmin && (
          <div className="bg-white border-t border-[#E6DDD4] p-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="w-full rounded-2xl bg-slate-900 text-white py-2.5 text-xs font-bold hover:bg-black transition cursor-pointer"
            >
              Buka Dashboard Admin (/admin) →
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
