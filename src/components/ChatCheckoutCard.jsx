import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  Truck,
  User,
} from 'lucide-react';

function formatRupiah(num) {
  return `Rp${Number(num || 0).toLocaleString('id-ID')}`;
}

export default function ChatCheckoutCard({
  draft,
  products,
  currentUser,
  onConfirmOrder,
  onOpenMyOrders,
}) {
  const matchedProduct = useMemo(() => {
    const bySku = products.find(
      (p) => p.sku.toLowerCase() === String(draft?.sku || '').toLowerCase()
    );
    return bySku || products[0];
  }, [products, draft?.sku]);

  const availableColors = useMemo(
    () => matchedProduct?.colors || [],
    [matchedProduct]
  );

  const initialColor = useMemo(() => {
    const found = availableColors.find(
      (c) => c.toLowerCase() === String(draft?.color || '').toLowerCase()
    );
    return found || availableColors[0] || '';
  }, [availableColors, draft?.color]);

  const [color, setColor] = useState(initialColor);

  const availableSizes = useMemo(() => {
    const sizeMap = matchedProduct?.sizes?.[color] || {};
    return Object.keys(sizeMap);
  }, [matchedProduct, color]);

  const initialSize = useMemo(() => {
    const found = availableSizes.find(
      (s) => s.toLowerCase() === String(draft?.size || '').toLowerCase()
    );
    return found || availableSizes[0] || '';
  }, [availableSizes, draft?.size]);

  const [size, setSize] = useState(initialSize);
  const [qty, setQty] = useState(Math.max(1, Number(draft?.qty) || 1));
  const [customerName, setCustomerName] = useState(
    draft?.customerName || currentUser?.fullName || currentUser?.username || ''
  );
  const [customerPhone, setCustomerPhone] = useState(draft?.customerPhone || '');
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

  if (!matchedProduct) return null;

  const currentStock = matchedProduct.sizes?.[color]?.[size] ?? 0;
  const totalPrice = (matchedProduct.price || 0) * qty;

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    if (currentStock < qty) {
      setFormError(
        `Stok ${matchedProduct.name} (${color} / ${size}) tidak mencukupi (tersisa ${currentStock}).`
      );
      return;
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
      const result = await onConfirmOrder({
        sku: matchedProduct.sku,
        name: matchedProduct.name,
        image: matchedProduct.image,
        color,
        size,
        qty,
        price: matchedProduct.price,
        totalPrice,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        paymentMethod,
      });
      setCreatedOrder(result);
    } catch (err) {
      setFormError(err.message || 'Gagal membuat pesanan.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (createdOrder) {
    return (
      <div className="ml-11 max-w-lg rounded-3xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-xs space-y-3">
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
                Pesanan Berhasil Masuk ke Dashboard Admin!
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-emerald-100 p-3 text-xs space-y-1.5 text-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-500">Produk</span>
            <span className="font-bold text-slate-900">
              {matchedProduct.name} ({color}, {size}) × {qty}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Penerima &amp; Metode</span>
            <span className="font-semibold text-slate-900">
              {createdOrder.customerName} · {createdOrder.paymentMethod}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Tujuan Kirim</span>
            <span className="font-medium text-slate-800 text-right max-w-[220px] truncate">
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
      className="ml-11 max-w-lg rounded-3xl border border-[#9E7B66]/35 bg-white p-4 shadow-sm space-y-3.5"
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
        <span className="rounded-full bg-[#9E7B66]/10 border border-[#9E7B66]/25 px-2 py-0.5 text-[10px] font-mono font-bold text-[#9E7B66]">
          {matchedProduct.sku}
        </span>
      </div>

      {/* Product Preview */}
      <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200/80 p-2.5">
        {matchedProduct.image && (
          <img
            src={matchedProduct.image}
            alt={matchedProduct.name}
            className="w-14 h-14 rounded-xl object-contain bg-white border border-slate-100 p-1 shrink-0"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold text-slate-950 truncate">
            {matchedProduct.name}
          </div>
          <div className="text-xs font-extrabold text-[#9E7B66]">
            {matchedProduct.priceFormatted}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
            <Package className="w-3 h-3" />
            <span>
              {currentStock > 0
                ? `Stok varian ini siap kirim`
                : 'Stok varian ini sedang habis'}
            </span>
          </div>
        </div>
      </div>

      {/* Color, Size, Qty */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">
            WARNA
          </label>
          <select
            value={color}
            onChange={(e) => {
              const nextColor = e.target.value;
              setColor(nextColor);
              const nextSizes = Object.keys(
                matchedProduct.sizes?.[nextColor] || {}
              );
              if (!nextSizes.includes(size)) {
                setSize(nextSizes[0] || '');
              }
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
          >
            {availableColors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">
            UKURAN
          </label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
          >
            {availableSizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">
            JUMLAH
          </label>
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              −
            </button>
            <span className="flex-1 text-center text-xs font-bold text-slate-950">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(Math.max(1, currentStock), q + 1))}
              className="px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
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
          <div className="text-[10px] font-mono text-slate-500">TOTAL BAYAR</div>
          <div className="text-sm font-black text-slate-950">
            {formatRupiah(totalPrice)}
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting || currentStock < 1}
          className="rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-xs"
        >
          {isSubmitting ? 'Memproses...' : 'Konfirmasi & Buat Pesanan'}
        </button>
      </div>
    </form>
  );
}
