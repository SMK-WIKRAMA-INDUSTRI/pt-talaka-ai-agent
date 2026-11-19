import React, { useMemo, useState } from 'react';
import {
  Activity,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Minus,
  Package,
  Plus,
  RefreshCw,
  Shirt,
  Sliders,
  Sparkles,
} from 'lucide-react';
import {
  COLOR_SWATCHES,
  formatStockStatus,
  getProductTotalStock,
} from '../data/talakaCatalog';

const CATEGORY_ORDER = ['Semua', 'Sepatu', 'Atasan', 'Bawahan', 'Outer', 'Dress'];

function ProductCard({
  product,
  showExactStock,
  isAdminSimMode,
  onUpdateStock,
  onAskProduct,
}) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const colorSizeMap = product.sizes[selectedColor] || {};
  const sizeKeys = Object.keys(colorSizeMap);

  const [selectedSize, setSelectedSize] = useState(sizeKeys[0] || '');
  const [showDetails, setShowDetails] = useState(false);

  const activeSize = sizeKeys.includes(selectedSize) ? selectedSize : sizeKeys[0];
  const activeQty = colorSizeMap[activeSize] ?? 0;
  const totalProductStock = getProductTotalStock(product);
  const activeColorHex = COLOR_SWATCHES[selectedColor] || '#E2E8F0';

  const handleSelectColor = (color) => {
    setSelectedColor(color);
    const nextSizes = Object.keys(product.sizes[color] || {});
    if (!nextSizes.includes(selectedSize)) {
      setSelectedSize(nextSizes[0] || '');
    }
  };

  const stockBadge =
    totalProductStock === 0
      ? {
          label: 'STOK HABIS',
          cls: 'bg-rose-50 text-rose-700 border-rose-200',
        }
      : totalProductStock <= 8
        ? {
            label: 'STOK MENIPIS',
            cls: 'bg-amber-50 text-amber-700 border-amber-200',
          }
        : {
            label: 'READY STOCK',
            cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          };

  return (
    <article className="group flex flex-col rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all">
      {/* Visual Stage */}
      <div className="relative h-56 w-full bg-slate-50/80 border-b border-slate-100 flex items-center justify-center overflow-hidden p-4">
        {/* Top Meta Pills */}
        <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between gap-2">
          <span className="rounded-full bg-white/95 border border-slate-200 px-2.5 py-0.5 text-[10px] font-mono font-bold text-slate-700 shadow-2xs">
            {product.sku}
          </span>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-bold ${stockBadge.cls}`}
          >
            {stockBadge.label}
          </span>
        </div>

        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="relative flex flex-col items-center justify-center w-full h-full rounded-2xl bg-gradient-to-br from-white via-slate-50 to-slate-100/80 border border-slate-200/60">
            <div
              className="w-20 h-20 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-center transition-colors duration-300"
              style={{ backgroundColor: activeColorHex }}
            >
              <Shirt
                className={`w-9 h-9 ${
                  ['Hitam', 'Charcoal', 'Navy', 'Espresso', 'Crimson Gold', 'Obsidian Red'].includes(
                    selectedColor
                  )
                    ? 'text-white/90'
                    : 'text-slate-800/80'
                }`}
              />
            </div>
            <div className="mt-3 flex items-center gap-1.5 rounded-full bg-white/90 border border-slate-200 px-3 py-0.5 text-[10px] font-mono font-semibold text-slate-600">
              <span>{product.category.toUpperCase()}</span>
              <span>·</span>
              <span>{product.fit}</span>
            </div>
          </div>
        )}

        {/* Bottom Subtle Badge */}
        {product.badge && (
          <span className="absolute bottom-3 left-3.5 rounded-full bg-slate-900/90 text-white px-2.5 py-0.5 text-[10px] font-semibold tracking-wide">
            {product.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col gap-4">
        {/* Title & Price */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-extrabold tracking-tight text-slate-950 leading-snug">
              {product.name}
            </h3>
            <span className="shrink-0 text-sm font-extrabold text-[#9E7B66]">
              {product.priceFormatted}
            </span>
          </div>
          <p className="text-xs text-slate-500 line-clamp-1">
            {product.material}
          </p>
        </div>

        {/* Color Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-mono font-semibold text-slate-500">WARNA</span>
            <span className="font-semibold text-slate-800">{selectedColor}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {product.colors.map((color) => {
              const isSelected = color === selectedColor;
              const hex = COLOR_SWATCHES[color] || '#CBD5E1';
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleSelectColor(color)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <span
                    className="h-3 w-3 rounded-full border border-black/15 shrink-0"
                    style={{ backgroundColor: hex }}
                  />
                  <span>{color}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Size & Live Stock Grid */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-mono font-semibold text-slate-500">
              UKURAN &amp; STOK LIVE
            </span>
            <span
              className={`font-semibold ${
                activeQty === 0
                  ? 'text-rose-600'
                  : activeQty <= 3
                    ? 'text-amber-600'
                    : 'text-emerald-700'
              }`}
            >
              {activeSize}: {formatStockStatus(activeQty, showExactStock)}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {sizeKeys.map((sz) => {
              const qty = colorSizeMap[sz] ?? 0;
              const isSelected = sz === activeSize;
              const isOut = qty <= 0;
              const isLow = qty > 0 && qty <= 3;

              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`relative rounded-xl border px-2.5 py-1.5 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                      : isOut
                        ? 'border-slate-200 bg-slate-50 text-slate-400 line-through hover:border-slate-300'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-slate-400'
                  }`}
                >
                  <span>{sz}</span>
                  <span
                    className={`text-[10px] font-mono font-semibold ${
                      isSelected
                        ? isOut
                          ? 'text-rose-300'
                          : isLow
                            ? 'text-amber-300'
                            : 'text-emerald-300'
                        : isOut
                          ? 'text-rose-400 no-underline'
                          : isLow
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                    }`}
                  >
                    {isOut
                      ? '0'
                      : showExactStock
                        ? `${qty}`
                        : isLow
                          ? '≤3'
                          : '✓'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Admin Stock Simulator Controls */}
        {isAdminSimMode && (
          <div className="rounded-2xl border border-[#9E7B66]/30 bg-[#9E7B66]/5 px-3 py-2.5 flex items-center justify-between gap-2">
            <div className="text-[11px] leading-tight">
              <div className="font-mono font-bold text-slate-900">
                UBAH STOK ({selectedColor} · {activeSize})
              </div>
              <div className="text-[10px] text-slate-600">
                Saat ini: <strong>{activeQty} pcs</strong> (langsung terbaca AI)
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() =>
                  onUpdateStock(product.sku, selectedColor, activeSize, -1)
                }
                disabled={activeQty <= 0}
                aria-label="Kurangi stok"
                className="h-7 w-7 rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center font-mono text-xs font-bold text-slate-900">
                {activeQty}
              </span>
              <button
                type="button"
                onClick={() =>
                  onUpdateStock(product.sku, selectedColor, activeSize, 1)
                }
                aria-label="Tambah stok"
                className="h-7 w-7 rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Expandable Specs & Honest Note */}
        <div>
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <span>Detail Ukuran, Gaya &amp; Catatan Jujur</span>
            {showDetails ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showDetails && (
            <div className="mt-2 rounded-2xl border border-slate-100 bg-slate-50/90 p-3 space-y-1.5 text-[11px] text-slate-600 leading-relaxed">
              <div>
                <strong className="text-slate-800">Ukuran Fisik:</strong>{' '}
                {product.measurements}
              </div>
              <div>
                <strong className="text-slate-800">Gaya &amp; Acara:</strong>{' '}
                {product.style} ({product.occasions})
              </div>
              <div>
                <strong className="text-slate-800">Padanan:</strong>{' '}
                {product.pairWith}
              </div>
              <div className="pt-1 border-t border-slate-200/80 text-slate-700">
                <strong className="text-[#9E7B66]">Catatan Jujur Talaka:</strong>{' '}
                {product.honestNote}
              </div>
            </div>
          )}
        </div>

        {/* Action CTA */}
        <div className="mt-auto pt-1 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onAskProduct(product, selectedColor, activeSize)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-black transition cursor-pointer shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#9E7B66]" />
            <span>Tanya Kak Tala</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ProductCatalogSection({
  products = [],
  showExactStock = false,
  onUpdateStock,
  onResetProducts,
  onAskProduct,
}) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isAdminSimMode, setIsAdminSimMode] = useState(false);

  const categories = useMemo(() => {
    const present = new Set(products.map((p) => p.category));
    return CATEGORY_ORDER.filter((c) => c === 'Semua' || present.has(c));
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Semua') return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const totalAvailableUnits = useMemo(
    () => products.reduce((sum, p) => sum + getProductTotalStock(p), 0),
    [products]
  );

  return (
    <section
      id="katalog-produk"
      className="relative py-24 bg-white border-t border-slate-200/80"
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 space-y-10">
        {/* Header & Live Sync Banner */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-mono font-semibold text-slate-700 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE_INVENTORY_SYNC</span>
              <span className="text-slate-300">|</span>
              <span className="text-[#9E7B66]">SINGLE SOURCE OF TRUTH</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
              Etalase Produk &amp; Stok Live Talaka
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Semua harga, warna, ukuran, dan ketersediaan stok di etalase ini
              dibaca langsung oleh <strong>Kak Tala AI</strong>. Tidak ada
              selisih data antara stok toko dan jawaban chatbot.
            </p>
          </div>

          {/* Live Summary & Admin Stock Sim Toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs">
              <Package className="w-4 h-4 text-[#9E7B66]" />
              <span className="font-mono font-bold text-slate-900">
                {products.length} SKU
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-600 font-medium">
                {totalAvailableUnits} pcs tersedia
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsAdminSimMode((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-2xl border px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                isAdminSimMode
                  ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>
                {isAdminSimMode ? 'Mode Admin: AKTIF' : 'Simulasi Ubah Stok'}
              </span>
            </button>

            {isAdminSimMode && (
              <button
                type="button"
                onClick={onResetProducts}
                className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                title="Kembalikan stok awal"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Notice when Admin Sim Mode Active */}
        {isAdminSimMode && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Mode Simulasi Admin Toko aktif:</strong> Klik{' '}
                <code className="font-mono font-bold">−</code> /{' '}
                <code className="font-mono font-bold">+</code> pada kartu produk
                untuk mengubah stok, lalu klik <strong>Tanya Kak Tala</strong>{' '}
                untuk membuktikan bot langsung membaca stok terbaru!
              </span>
            </div>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-700">
              <Sparkles className="w-3 h-3" />
              SYNCED_TO_AI
            </span>
          </div>
        )}

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isActive = cat === selectedCategory;
            const count =
              cat === 'Semua'
                ? products.length
                : products.filter((p) => p.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer border ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                {cat}{' '}
                <span
                  className={`ml-1 font-mono text-[10px] ${
                    isActive ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.sku}
              product={product}
              showExactStock={showExactStock}
              isAdminSimMode={isAdminSimMode}
              onUpdateStock={onUpdateStock}
              onAskProduct={onAskProduct}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
