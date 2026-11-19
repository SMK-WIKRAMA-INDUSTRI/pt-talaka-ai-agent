import { TALAKA_PRODUCTS, TALAKA_SIZE_CHART } from '../data/talakaCatalog';

export default function CatalogModal({
  isOpen,
  onClose,
  onAskProduct,
  onSelectProductPage,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Katalog &amp; Panduan Ukuran Talaka
            </h3>
            <p className="text-xs text-slate-500">
              Pilih produk untuk langsung ditanyakan atau disimulasikan di chat
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-800 flex items-center justify-center text-lg cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TALAKA_PRODUCTS.map((product) => (
              <div
                key={product.sku}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-600">
                    {product.sku} • {product.category}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {product.priceFormatted}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {product.name}
                </div>
                <p className="text-xs text-slate-600">
                  {product.material} • {product.fit}
                </p>
                <p className="text-[11px] text-slate-500">
                  Warna: {product.colors.join(', ')}
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectProductPage(`${product.name} (${product.sku})`);
                      onAskProduct(
                        `Ceritain detail ${product.name} (${product.sku}) dan cek stoknya dong`
                      );
                      onClose();
                    }}
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 cursor-pointer"
                  >
                    Tanya Produk Ini
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Acuan Size Chart Atasan (Regular Fit)
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Ukuran</th>
                    <th className="px-3 py-2 font-semibold">Tinggi Badan</th>
                    <th className="px-3 py-2 font-semibold">Berat Badan</th>
                    <th className="px-3 py-2 font-semibold">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {TALAKA_SIZE_CHART.map((row) => (
                    <tr key={row.size}>
                      <td className="px-3 py-2 font-bold text-slate-900">
                        {row.size}
                      </td>
                      <td className="px-3 py-2">{row.tb}</td>
                      <td className="px-3 py-2">{row.bb}</td>
                      <td className="px-3 py-2 text-slate-500">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
