import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  Trash2,
  Truck,
  User,
} from 'lucide-react';

function formatRupiah(num) {
  return `Rp${Number(num || 0).toLocaleString('id-ID')}`;
}

function buildInitialLineItems(draft, products) {
  const rawList =
    Array.isArray(draft?.items) && draft.items.length > 0
      ? draft.items
      : draft?.sku
        ? [
            {
              sku: draft.sku,
              color: draft.color,
              size: draft.size,
              qty: draft.qty || 1,
            },
          ]
        : [];

  const resolved = [];
  rawList.forEach((raw, idx) => {
    const matched = products.find(
      (p) => p.sku.toLowerCase() === String(raw?.sku || '').toLowerCase()
    );
    if (!matched) return;

    const colors = matched.colors || [];
    const matchedColor =
      colors.find(
        (c) => c.toLowerCase() === String(raw?.color || '').toLowerCase()
      ) ||
      colors.find((c) => {
        const sm = matched.sizes?.[c] || {};
        return Object.values(sm).some((v) => Number(v) > 0);
      }) ||
      colors[0] ||
      '';

    const sizeMap = matched.sizes?.[matchedColor] || {};
    const sizeKeys = Object.keys(sizeMap);
    const matchedSize =
      sizeKeys.find(
        (s) => s.toLowerCase() === String(raw?.size || '').toLowerCase()
      ) ||
      sizeKeys.find((s) => Number(sizeMap[s] || 0) > 0) ||
      sizeKeys[0] ||
      '';

    resolved.push({
      lineId: `${matched.sku}-${idx}-${Date.now()}`,
      sku: matched.sku,
      color: matchedColor,
      size: matchedSize,
      qty: Math.max(1, Number(raw?.qty) || 1),
    });
  });

  if (resolved.length === 0 && products[0]) {
    const first = products[0];
    const defaultColor = first.colors?.[0] || '';
    const sizeKeys = Object.keys(first.sizes?.[defaultColor] || {});
    resolved.push({
      lineId: `${first.sku}-0-${Date.now()}`,
      sku: first.sku,
      color: defaultColor,
      size: sizeKeys[0] || '',
      qty: 1,
    });
  }

  return resolved;
}

export default function ChatCheckoutCard({
  draft,
  products,
  currentUser,
  onConfirmOrder,
  onOpenMyOrders,
}) {
  const [lineItems, setLineItems] = useState(() =>
    buildInitialLineItems(draft, products)
  );
  const [customerName, setCustomerName] = useState(
    draft?.customerName || currentUser?.fullName || currentUser?.username || ''
  );
  const [customerPhone, setCustomerPhone] = useState(
    draft?.customerPhone || ''
  );
  const [shippingAddress, setShippingAddress] = useState(
    draft?.shippingAddress || ''
  );
  const [paymentMethod, setPaymentMethod] = useState(
    ['COD', 'Transfer Bank', 'QRIS'].includes(draft?.paymentMethod)
      ? draft.paymentMethod
      : 'COD'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);

  const enrichedItems = useMemo(() => {
    return lineItems
      .map((item) => {
        const product = products.find(
          (p) => p.sku.toLowerCase() === item.sku.toLowerCase()
        );
        if (!product) return null;
        const availableColors = product.colors || [];
        const activeColor = availableColors.includes(item.color)
          ? item.color
          : availableColors[0] || '';
        const sizeMap = product.sizes?.[activeColor] || {};
        const availableSizes = Object.keys(sizeMap);
        const activeSize = availableSizes.includes(item.size)
          ? item.size
          : availableSizes[0] || '';
        const currentStock = sizeMap[activeSize] ?? 0;
        return {
          ...item,
          product,
          availableColors,
          color: activeColor,
          availableSizes,
          size: activeSize,
          currentStock,
          subtotal: (product.price || 0) * item.qty,
        };
      })
      .filter(Boolean);
  }, [lineItems, products]);

  if (enrichedItems.length === 0) return null;

  const totalPrice = enrichedItems.reduce((sum, it) => sum + it.subtotal, 0);
  const totalQty = enrichedItems.reduce((sum, it) => sum + it.qty, 0);
  const hasOutOfStock = enrichedItems.some(
    (it) => it.currentStock < it.qty || it.currentStock < 1
  );

  function updateItem(lineId, updater) {
    setLineItems((prev) =>
      prev.map((it) => (it.lineId === lineId ? updater(it) : it))
    );
  }

  function removeItem(lineId) {
    setLineItems((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((it) => it.lineId !== lineId);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    for (const it of enrichedItems) {
      if (it.currentStock < it.qty) {
        setFormError(
          `Stok ${it.product.name} (${it.color} / ${it.size}) tidak mencukupi (tersisa ${it.currentStock}).`
        );
        return;
      }
    }
    if (!customerName.trim()) {
      setFormError('Nama penerima wajib diisi.');
      return;
    }
    if (!customerPhone.trim()) {
      setFormError('Nomor WhatsApp / Telegram wajib diisi untuk notif kiriman.');
      return;
    }
    if (!shippingAddress.trim()) {
      setFormError('Alamat lengkap tujuan kirim wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = enrichedItems.map((it) => ({
        sku: it.product.sku,
        name: it.product.name,
        image: it.product.image || '',
        color: it.color,
        size: it.size,
        qty: it.qty,
        price: it.product.price,
      }));
      const first = orderItems[0];

      const result = await onConfirmOrder({
        sku: first.sku,
        name: first.name,
        image: first.image,
        color: first.color,
        size: first.size,
        qty: first.qty,
        price: first.price,
        items: orderItems,
        totalPrice,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        paymentMethod,
      });
      setCreatedOrder({
        ...result,
        items: result?.items?.length ? result.items : orderItems,
      });
    } catch (err) {
      setFormError(err.message || 'Gagal membuat pesanan.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (createdOrder) {
    const confirmedItems = createdOrder.items || [];
    return (
      <div className="ml-11 max-w-xl rounded-3xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-xs space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-emerald-700">
                ORDER_CONFIRMED · {createdOrder.orderCode}
              </div>
              <div className="text-sm font-extrabold text-slate-950">
                Pesanan ({confirmedItems.length} Produk) Berhasil Masuk!
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-emerald-100 p-3 text-xs space-y-2 text-slate-700">
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono font-bold text-slate-400">
              RINCIAN PRODUK ({confirmedItems.reduce((s, i) => s + (i.qty || 1), 0)} PCS)
            </div>
            {confirmedItems.map((it, i) => (
              <div
                key={`${it.sku}-${i}`}
                className="flex items-center justify-between gap-2 text-[11px]"
              >
                <span className="font-bold text-slate-900 truncate">
                  {it.name} ({it.color}, {it.size}) × {it.qty}
                </span>
                <span className="font-semibold text-slate-700 shrink-0">
                  {formatRupiah((it.price || 0) * (it.qty || 1))}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-1.5 border-t border-slate-100">
            <span className="text-slate-500">Penerima &amp; Metode</span>
            <span className="font-semibold text-slate-900">
              {createdOrder.customerName} · {createdOrder.paymentMethod}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Tujuan Kirim</span>
            <span className="font-medium text-slate-800 text-right max-w-[240px] truncate">
              {createdOrder.shippingAddress}
            </span>
          </div>
          <div className="flex justify-between pt-1.5 border-t border-slate-100">
            <span className="font-bold text-slate-700">Total Bayar</span>
            <span className="font-extrabold text-emerald-700">
              {formatRupiah(createdOrder.totalPrice)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-emerald-800 flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" />
            Status awal: <strong>Diproses · Gudang Talaka Bogor</strong>
          </span>
          {onOpenMyOrders && (
            <button
              type="button"
              onClick={onOpenMyOrders}
              className="rounded-xl bg-slate-900 text-white px-3.5 py-1.5 text-[11px] font-bold hover:bg-black transition cursor-pointer shrink-0"
            >
              Lacak Pesanan →
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="ml-11 max-w-xl rounded-3xl border border-[#9E7B66]/35 bg-white p-4 shadow-sm space-y-3.5"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <ShoppingBag className="w-3.5 h-3.5 text-[#D6B7A5]" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-950">
              Checkout Cepat via Kak Tala
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              STOK OTOMATIS TERPOTONG · LANGSUNG MASUK ADMIN
            </div>
          </div>
        </div>
        <span className="rounded-full bg-[#9E7B66]/10 border border-[#9E7B66]/25 px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#9E7B66]">
          {enrichedItems.length} PRODUK · {totalQty} PCS
        </span>
      </div>

      {/* Daftar Item Produk (Single atau Multi-Item) */}
      <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
        {enrichedItems.map((it) => (
          <div
            key={it.lineId}
            className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3 space-y-2.5"
          >
            <div className="flex items-center gap-3">
              {it.product.image && (
                <img
                  src={it.product.image}
                  alt={it.product.name}
                  className="w-13 h-13 rounded-xl object-contain bg-white border border-slate-100 p-1 shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-bold text-slate-950 truncate">
                    {it.product.name}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#9E7B66] shrink-0">
                    {it.product.sku}
                  </span>
                </div>
                <div className="text-xs font-extrabold text-[#9E7B66]">
                  {formatRupiah(it.subtotal)}
                  {it.qty > 1 && (
                    <span className="text-[10px] font-normal text-slate-400 ml-1">
                      ({it.product.priceFormatted} × {it.qty})
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  <span
                    className={
                      it.currentStock < it.qty ? 'text-rose-600 font-semibold' : ''
                    }
                  >
                    {it.currentStock >= it.qty
                      ? 'Stok varian ini siap kirim'
                      : it.currentStock > 0
                        ? `Stok varian ini tersisa ${it.currentStock}`
                        : 'Stok varian ini sedang habis'}
                  </span>
                </div>
              </div>
              {enrichedItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(it.lineId)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0"
                  title="Hapus produk ini dari checkout"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Color, Size, Qty per item */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[9px] font-mono font-bold text-slate-500 mb-0.5">
                  WARNA
                </label>
                <select
                  value={it.color}
                  onChange={(e) => {
                    const nextColor = e.target.value;
                    const nextSizes = Object.keys(
                      it.product.sizes?.[nextColor] || {}
                    );
                    const readyNextSize =
                      nextSizes.find(
                        (s) => Number(it.product.sizes?.[nextColor]?.[s] || 0) > 0
                      ) ||
                      nextSizes[0] ||
                      '';
                    updateItem(it.lineId, (curr) => ({
                      ...curr,
                      color: nextColor,
                      size: nextSizes.includes(curr.size)
                        ? curr.size
                        : readyNextSize,
                    }));
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-900 focus:border-slate-900 focus:outline-none"
                >
                  {it.availableColors.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-mono font-bold text-slate-500 mb-0.5">
                  UKURAN
                </label>
                <select
                  value={it.size}
                  onChange={(e) =>
                    updateItem(it.lineId, (curr) => ({
                      ...curr,
                      size: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-900 focus:border-slate-900 focus:outline-none"
                >
                  {it.availableSizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-mono font-bold text-slate-500 mb-0.5">
                  JUMLAH
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      updateItem(it.lineId, (curr) => ({
                        ...curr,
                        qty: Math.max(1, curr.qty - 1),
                      }))
                    }
                    className="px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center text-[11px] font-bold text-slate-950">
                    {it.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateItem(it.lineId, (curr) => ({
                        ...curr,
                        qty: Math.min(Math.max(1, it.currentStock), curr.qty + 1),
                      }))
                    }
                    className="px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recipient & Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="relative">
          <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nama penerima"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
          />
        </div>
        <div className="relative">
          <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="No. WA / Telegram"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      <div className="relative">
        <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          placeholder="Alamat lengkap kirim (Jalan, Kecamatan, Kota, Kode Pos)"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
        />
      </div>

      {/* Payment Method */}
      <div className="flex flex-wrap items-center gap-1.5">
        {['COD', 'Transfer Bank', 'QRIS'].map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => setPaymentMethod(method)}
            className={`rounded-xl px-3 py-1.5 text-[11px] font-bold border transition cursor-pointer ${
              paymentMethod === method
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {method}
          </button>
        ))}
      </div>

      {formError && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-[11px] font-semibold text-rose-700">
          {formError}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-100">
        <div>
          <div className="text-[10px] font-mono text-slate-500">
            TOTAL BAYAR ({totalQty} PCS)
          </div>
          <div className="text-sm font-black text-slate-950">
            {formatRupiah(totalPrice)}
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting || hasOutOfStock}
          className="rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-xs"
        >
          {isSubmitting
            ? 'Memproses...'
            : enrichedItems.length > 1
              ? `Checkout Semua (${enrichedItems.length} Produk)`
              : 'Konfirmasi & Buat Pesanan'}
        </button>
      </div>
    </form>
  );
}
