import {
  DEFAULT_BOT_NAME,
  DEFAULT_MODEL,
  HONESTY_OPTIONS,
  MAX_CONTEXT_CHARS,
} from '../config/botPrompt';

export default function SettingsModal({
  isOpen,
  onClose,
  botName,
  setBotName,
  honestyLevel,
  setHonestyLevel,
  showExactStock,
  onToggleExactStock,
  model,
  setModel,
  contextText,
  setContextText,
  onResetContext,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Pengaturan Talaka AI
            </h3>
            <p className="text-xs text-slate-500">
              Atur persona, kejujuran gaya, model, dan basis pengetahuan
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

        <div className="p-5 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label
                htmlFor="modal-bot-name"
                className="block text-xs font-semibold text-slate-700"
              >
                Nama Chatbot
              </label>
              <input
                id="modal-bot-name"
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder={DEFAULT_BOT_NAME}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="modal-honesty"
                className="block text-xs font-semibold text-slate-700"
              >
                Gaya Kejujuran
              </label>
              <select
                id="modal-honesty"
                value={honestyLevel}
                onChange={(e) => setHonestyLevel(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none cursor-pointer"
              >
                {HONESTY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
            <div className="space-y-1">
              <label
                htmlFor="modal-model"
                className="block text-xs font-semibold text-slate-700"
              >
                Model AI
              </label>
              <input
                id="modal-model"
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder={DEFAULT_MODEL}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 cursor-pointer select-none sm:mt-5">
              <input
                type="checkbox"
                checked={showExactStock}
                onChange={(e) => onToggleExactStock(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
              />
              Tampilkan angka stok persis
            </label>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="modal-context"
                className="block text-xs font-semibold text-slate-700"
              >
                Basis Pengetahuan (FAQ, Katalog, Size Chart)
              </label>
              <button
                type="button"
                onClick={onResetContext}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                Reset Data Default
              </button>
            </div>
            <textarea
              id="modal-context"
              rows={9}
              maxLength={MAX_CONTEXT_CHARS}
              value={contextText}
              onChange={(e) => setContextText(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs leading-relaxed text-slate-700 focus:bg-white focus:border-indigo-500 focus:outline-none resize-y"
            />
          </div>
        </div>

        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
