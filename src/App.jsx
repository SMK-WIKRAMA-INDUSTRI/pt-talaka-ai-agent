import { useEffect, useRef, useState } from 'react';
import FormattedMessage from './components/FormattedMessage';
import {
  DEFAULT_BOT_NAME,
  DEFAULT_HONESTY_LEVEL,
  DEFAULT_MODEL,
  HONESTY_OPTIONS,
  MAX_CONTEXT_CHARS,
  QUICK_PROMPTS,
} from './config/botPrompt';
import {
  buildDefaultTalakaKnowledge,
  findMentionedProducts,
  TALAKA_PRODUCTS,
} from './data/talakaCatalog';
import { askDeepSeek, hasDeepSeekApiKey } from './services/deepseek';
import { runVirtualTryOn } from './services/gemini';

const STORAGE_KEYS = {
  model: 'talaka_cs_model_v2',
  botName: 'talaka_fashion_bot_name',
  honestyLevel: 'talaka_fashion_honesty',
  showExactStock: 'talaka_fashion_exact_stock',
  contextText: 'talaka_fashion_context_v2',
};

function readStorage(key, fallback = '') {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Abaikan jika localStorage diblokir
  }
}

function ShirtIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
    </svg>
  );
}

export default function App() {
  const [model, setModel] = useState(
    () => readStorage(STORAGE_KEYS.model) || DEFAULT_MODEL
  );
  const [botName, setBotName] = useState(
    () => readStorage(STORAGE_KEYS.botName) || DEFAULT_BOT_NAME
  );
  const [honestyLevel, setHonestyLevel] = useState(
    () => readStorage(STORAGE_KEYS.honestyLevel) || DEFAULT_HONESTY_LEVEL
  );
  const [showExactStock, setShowExactStock] = useState(
    () => readStorage(STORAGE_KEYS.showExactStock) === 'true'
  );
  const [contextText, setContextText] = useState(() => {
    const saved = readStorage(STORAGE_KEYS.contextText);
    return saved || buildDefaultTalakaKnowledge(false);
  });
  const [activePageContext, setActivePageContext] = useState('beranda');

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [handoffSent, setHandoffSent] = useState(false);
  const [showFashionMenu, setShowFashionMenu] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const [showTryOnModal, setShowTryOnModal] = useState(false);
  const [tryOnBodyImage, setTryOnBodyImage] = useState(null);
  const [tryOnOutfitImage, setTryOnOutfitImage] = useState(null);
  const [tryOnNote, setTryOnNote] = useState('');

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatInputRef = useRef(null);
  const fashionMenuRef = useRef(null);
  const hasApiKey = hasDeepSeekApiKey();

  useEffect(() => {
    writeStorage(STORAGE_KEYS.model, model);
  }, [model]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.botName, botName);
  }, [botName]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.honestyLevel, honestyLevel);
  }, [honestyLevel]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.showExactStock, String(showExactStock));
  }, [showExactStock]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.contextText, contextText);
  }, [contextText]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        fashionMenuRef.current &&
        !fashionMenuRef.current.contains(event.target)
      ) {
        setShowFashionMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleToggleExactStock(checked) {
    setShowExactStock(checked);
    setContextText(buildDefaultTalakaKnowledge(checked));
  }

  function handleResetContext() {
    setContextText(buildDefaultTalakaKnowledge(showExactStock));
  }

  function readImageAsAttachment(file, onDone) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onDone({
        name: file.name,
        previewUrl: String(reader.result || ''),
      });
    };
    reader.readAsDataURL(file);
  }

  function handleSelectOutfitFile(e) {
    const file = e.target.files?.[0];
    readImageAsAttachment(file, setAttachedImage);
    e.target.value = '';
    setShowFashionMenu(false);
    chatInputRef.current?.focus();
  }

  async function handleRunVirtualTryOn(e) {
    e.preventDefault();
    if (!tryOnBodyImage || !tryOnOutfitImage || isSending) return;

    const noteText = tryOnNote.trim();
    const userMessage = {
      role: 'user',
      content:
        noteText || 'Tolong coba pasangkan baju ini ke foto tubuh aku dong.',
      images: [
        { label: 'Foto Tubuh', ...tryOnBodyImage },
        { label: 'Foto Baju', ...tryOnOutfitImage },
      ],
    };

    const bodyUrl = tryOnBodyImage.previewUrl;
    const outfitUrl = tryOnOutfitImage.previewUrl;

    setMessages((prev) => [...prev, userMessage]);
    setShowTryOnModal(false);
    setTryOnBodyImage(null);
    setTryOnOutfitImage(null);
    setTryOnNote('');
    setError('');
    setIsSending(true);

    try {
      const result = await runVirtualTryOn({
        bodyDataUrl: bodyUrl,
        outfitDataUrl: outfitUrl,
        note: noteText,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: result.text,
          generatedImageUrl: result.generatedImageUrl,
        },
      ]);
    } catch (err) {
      setError(err.message || 'Gagal memproses Virtual Try-On.');
    } finally {
      setIsSending(false);
    }
  }

  function handleInsertTemplate(text) {
    setInput((prev) => (prev ? `${prev} ${text}` : text));
    setShowFashionMenu(false);
    chatInputRef.current?.focus();
  }

  async function sendQuestion(questionText) {
    const rawText = (questionText ?? input).trim();
    const currentImage = questionText === undefined ? attachedImage : null;
    if ((!rawText && !currentImage) || isSending) return;

    if (!hasApiKey) {
      setError('API key belum diisi di file .env.');
      return;
    }

    const displayContent =
      rawText || 'Gimana pendapat kamu soal foto outfit ini? Cocok nggak?';
    const apiContent = currentImage
      ? `${displayContent}\n\n[Pelanggan melampirkan foto outfit: "${currentImage.name}". Berikan respon sesuai prinsip kejujuran suportif PRD GYA-13.]`
      : displayContent;

    const userMessage = {
      role: 'user',
      content: displayContent,
      apiContent,
      image: currentImage,
    };

    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    if (questionText === undefined) {
      setInput('');
      setAttachedImage(null);
    }
    setShowFashionMenu(false);
    setError('');
    setIsSending(true);

    try {
      const apiHistory = nextHistory.map((m) => ({
        role: m.role,
        content: m.apiContent || m.content,
      }));
      const reply = await askDeepSeek({
        model,
        botName,
        honestyLevel,
        showExactStock,
        activePageContext,
        contextText,
        history: apiHistory,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menghubungi API.');
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendQuestion();
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendQuestion();
    }
  }

  function handleClearChat() {
    setMessages([]);
    setError('');
    setHandoffSent(false);
  }

  function handleManualHandoff() {
    setHandoffSent(true);
    sendQuestion('Saya mau bicara langsung dengan admin manusia');
  }

  async function handleCopy(text, index) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      // Abaikan jika clipboard tidak tersedia
    }
  }

  const displayBotName = botName.trim() || DEFAULT_BOT_NAME;

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col">
      {/* Header Minimal */}
      <header className="bg-white border-b border-stone-200 px-4 md:px-6 py-3">
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold text-sm">
              T
            </div>
            <span className="text-base font-bold tracking-tight text-stone-900">
              Talaka
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <select
              aria-label="Halaman yang dibuka"
              value={activePageContext}
              onChange={(e) => setActivePageContext(e.target.value)}
              className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700 border border-stone-200 focus:outline-none cursor-pointer"
            >
              <option value="beranda">Halaman: Beranda</option>
              {TALAKA_PRODUCTS.map((p) => (
                <option key={p.sku} value={`${p.name} (${p.sku})`}>
                  Produk: {p.name}
                </option>
              ))}
            </select>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${
                hasApiKey
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  hasApiKey ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              {hasApiKey ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </header>

      {/* Main 2-Column Workspace */}
      <main className="flex-1 mx-auto w-full max-w-6xl p-4 md:p-6 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 items-start">
        {/* Panel Pengaturan Ringkas */}
        <aside className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-4 space-y-4">
          <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2.5">
            Pengaturan
          </h2>

          <div className="space-y-1">
            <label
              htmlFor="bot-name"
              className="block text-xs font-semibold text-stone-600"
            >
              Nama Chatbot
            </label>
            <input
              id="bot-name"
              type="text"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              placeholder={DEFAULT_BOT_NAME}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 focus:bg-white focus:border-stone-900 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="honesty-level"
              className="block text-xs font-semibold text-stone-600"
            >
              Gaya Kejujuran
            </label>
            <select
              id="honesty-level"
              value={honestyLevel}
              onChange={(e) => setHonestyLevel(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 focus:bg-white focus:border-stone-900 focus:outline-none cursor-pointer"
            >
              {HONESTY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showExactStock}
              onChange={(e) => handleToggleExactStock(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-stone-300 accent-stone-900"
            />
            Tampilkan angka stok persis
          </label>

          <div className="space-y-1">
            <label
              htmlFor="model-input"
              className="block text-xs font-semibold text-stone-600"
            >
              Model
            </label>
            <input
              id="model-input"
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={DEFAULT_MODEL}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-800 focus:bg-white focus:border-stone-900 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="context-text"
                className="block text-xs font-semibold text-stone-600"
              >
                Data Katalog &amp; FAQ
              </label>
              <button
                type="button"
                onClick={handleResetContext}
                className="text-[11px] font-semibold text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                Reset
              </button>
            </div>
            <textarea
              id="context-text"
              rows={9}
              maxLength={MAX_CONTEXT_CHARS}
              value={contextText}
              onChange={(e) => setContextText(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs leading-relaxed text-stone-700 focus:bg-white focus:border-stone-900 focus:outline-none resize-y"
            />
          </div>
        </aside>

        {/* Panel Ruang Chat */}
        <section className="bg-white rounded-2xl border border-stone-200 shadow-2xs flex flex-col h-[calc(100vh-8rem)] min-h-[540px] overflow-hidden">
          {/* Header Chat */}
          <div className="flex items-center justify-between gap-2 border-b border-stone-200 px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <h2 className="text-sm font-bold text-stone-900">
                {displayBotName}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleManualHandoff}
                disabled={isSending}
                className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-40 cursor-pointer"
              >
                Hubungi Admin
              </button>
              <button
                type="button"
                onClick={handleClearChat}
                disabled={messages.length === 0 && !error}
                className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-500 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>

          {/* Banner Konteks Halaman Produk */}
          {activePageContext !== 'beranda' && (
            <div className="bg-stone-50 border-b border-stone-200 px-5 py-2 text-xs text-stone-700 flex items-center justify-between">
              <span>
                Sedang melihat: <strong>{activePageContext}</strong>
              </span>
              <button
                type="button"
                onClick={() =>
                  sendQuestion(
                    `Lagi lihat ${activePageContext}, cocok nggak buat aku?`
                  )
                }
                disabled={isSending}
                className="font-semibold underline hover:text-stone-900 cursor-pointer"
              >
                Tanya produk ini
              </button>
            </div>
          )}

          {/* Area Pesan */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-stone-50/40">
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
                {error}
              </div>
            )}

            {/* Sapaan Awal */}
            <div className="flex justify-start">
              <div className="max-w-[82%] rounded-2xl rounded-bl-sm border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 shadow-2xs">
                <p className="leading-relaxed">
                  Hai Kak, selamat datang di Talaka! 👋 Aku{' '}
                  <strong>{displayBotName}</strong>. Mau cek stok, cari ukuran
                  dari TB/BB, atau ngobrol soal gaya yang pas?
                </p>
              </div>
            </div>

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendQuestion(prompt)}
                    disabled={isSending}
                    className="rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-medium text-stone-700 hover:border-stone-900 hover:bg-stone-900 hover:text-white disabled:opacity-50 cursor-pointer transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              const mentionedProducts = !isUser
                ? findMentionedProducts(msg.content)
                : [];

              return (
                <div key={idx} className="space-y-2">
                  <div
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`group relative max-w-[82%] rounded-2xl px-4 py-3 text-sm shadow-2xs ${
                        isUser
                          ? 'bg-stone-900 text-white rounded-br-sm'
                          : 'bg-white border border-stone-200 text-stone-800 rounded-bl-sm'
                      }`}
                    >
                      {msg.image?.previewUrl && (
                        <div className="mb-2">
                          <img
                            src={msg.image.previewUrl}
                            alt={msg.image.name || 'Foto outfit'}
                            className="max-h-44 rounded-xl object-cover"
                          />
                        </div>
                      )}
                      {msg.images?.length > 0 && (
                        <div className="mb-2.5 grid grid-cols-2 gap-2">
                          {msg.images.map((img, i) => (
                            <div
                              key={i}
                              className="rounded-xl overflow-hidden border border-white/15 bg-black/20"
                            >
                              <img
                                src={img.previewUrl}
                                alt={img.label || img.name}
                                className="h-32 w-full object-cover"
                              />
                              <div className="px-2 py-1 text-[10px] font-medium text-stone-200 truncate">
                                {img.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {msg.generatedImageUrl && (
                        <div className="mb-2.5">
                          <img
                            src={msg.generatedImageUrl}
                            alt="Hasil Virtual Try-On Talaka"
                            className="max-h-80 rounded-xl border border-stone-200 object-cover"
                          />
                        </div>
                      )}

                      {isUser ? (
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {msg.content}
                        </div>
                      ) : (
                        <FormattedMessage content={msg.content} />
                      )}

                      {!isUser && (
                        <div className="mt-1.5 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.content, idx)}
                            className="text-[11px] font-medium text-stone-400 hover:text-stone-900 cursor-pointer"
                          >
                            {copiedIndex === idx ? 'Tersalin ✓' : 'Salin'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Kartu Produk di Dalam Chat */}
                  {mentionedProducts.length > 0 && (
                    <div className="flex flex-wrap gap-2.5 pl-1">
                      {mentionedProducts.slice(0, 3).map((product) => (
                        <div
                          key={product.sku}
                          className="w-60 rounded-xl border border-stone-200 bg-white p-3 shadow-2xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono font-semibold text-stone-500">
                              {product.sku}
                            </span>
                            <span className="text-xs font-bold text-stone-900">
                              {product.priceFormatted}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-stone-900">
                            {product.name}
                          </div>
                          <p className="text-[11px] text-stone-500">
                            {product.material}
                          </p>
                          <div className="pt-1 flex items-center justify-between gap-2">
                            <span className="text-[11px] text-stone-500">
                              {product.colors.join(', ')}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setActivePageContext(
                                  `${product.name} (${product.sku})`
                                )
                              }
                              className="rounded-lg bg-stone-900 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-stone-700 cursor-pointer"
                            >
                              Lihat
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {handoffSent && (
              <div className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-xs text-stone-600">
                Percakapan diteruskan ke admin (Senin–Sabtu 09.00–20.00 WIB,
                Minggu 10.00–17.00 WIB).
              </div>
            )}

            {isSending && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border border-stone-200 bg-white px-4 py-3 text-xs text-stone-500 shadow-2xs flex items-center gap-2">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-stone-400 animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:300ms]" />
                  </span>
                  <span>{displayBotName} sedang mengetik...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Composer Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-stone-200 p-4 bg-white space-y-2"
          >
            {attachedImage && (
              <div className="flex items-center gap-2.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 w-fit">
                <img
                  src={attachedImage.previewUrl}
                  alt={attachedImage.name}
                  className="h-10 w-10 rounded-lg object-cover border border-stone-200"
                />
                <span className="text-xs font-medium text-stone-800 max-w-[180px] truncate">
                  {attachedImage.name}
                </span>
                <button
                  type="button"
                  onClick={() => setAttachedImage(null)}
                  className="rounded-full px-1.5 py-0.5 text-xs font-bold text-stone-400 hover:bg-stone-200 hover:text-stone-800 cursor-pointer"
                >
                  ×
                </button>
              </div>
            )}

            <div className="flex items-end gap-2.5">
              <div className="relative flex-1 flex items-end rounded-xl border border-stone-300 bg-stone-50/60 focus-within:bg-white focus-within:border-stone-900">
                <div ref={fashionMenuRef} className="relative p-1.5">
                  <button
                    type="button"
                    onClick={() => setShowFashionMenu((prev) => !prev)}
                    title="Menu Fashion"
                    aria-label="Menu Fashion"
                    className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                      showFashionMenu
                        ? 'bg-stone-900 text-white'
                        : 'text-stone-500 hover:bg-stone-200/70 hover:text-stone-900'
                    }`}
                  >
                    <ShirtIcon className="h-5 w-5" />
                  </button>

                  {showFashionMenu && (
                    <div className="absolute bottom-12 left-0 z-20 w-68 rounded-2xl border border-stone-200 bg-white p-2 shadow-lg space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowFashionMenu(false);
                          setShowTryOnModal(true);
                        }}
                        className="w-full flex items-center gap-2.5 rounded-xl bg-stone-900 text-white px-3 py-2 text-left text-xs font-semibold hover:bg-stone-700 cursor-pointer"
                      >
                        <ShirtIcon className="h-4 w-4 shrink-0" />
                        <span>Virtual Try-On (Foto Tubuh + Baju)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-stone-800 hover:bg-stone-100 cursor-pointer"
                      >
                        <ShirtIcon className="h-4 w-4 text-stone-600 shrink-0" />
                        <span>Upload 1 Foto Outfit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleInsertTemplate(
                            'TB saya ... cm, BB ... kg, suka fit standar. Cocok ukuran apa?'
                          )
                        }
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-stone-800 hover:bg-stone-100 cursor-pointer"
                      >
                        <span className="w-4 text-center text-stone-500 font-bold">
                          📏
                        </span>
                        <span>Isi Ukuran (TB &amp; BB)</span>
                      </button>

                      <div className="border-t border-stone-100 my-1 pt-1">
                        {TALAKA_PRODUCTS.map((product) => (
                          <button
                            key={product.sku}
                            type="button"
                            onClick={() =>
                              handleInsertTemplate(
                                `Mau tanya soal ${product.name} (${product.sku}): `
                              )
                            }
                            className="w-full flex items-center justify-between rounded-xl px-3 py-1.5 text-left text-xs text-stone-700 hover:bg-stone-100 cursor-pointer"
                          >
                            <span className="truncate font-medium">
                              {product.name}
                            </span>
                            <span className="text-[10px] font-mono text-stone-400 ml-2 shrink-0">
                              {product.sku}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSelectOutfitFile}
                    className="hidden"
                  />
                </div>

                <textarea
                  ref={chatInputRef}
                  id="chat-input"
                  rows={2}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Tanya ${displayBotName} soal stok, ukuran TB/BB, atau gaya...`}
                  className="w-full bg-transparent py-2.5 pr-3.5 pl-1 text-sm text-stone-900 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSending || (!input.trim() && !attachedImage)}
                className="shrink-0 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-700 disabled:bg-stone-300 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                {isSending ? '...' : 'Kirim'}
              </button>
            </div>
          </form>
        </section>
      </main>

      {/* Modal Virtual Try-On */}
      {showTryOnModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleRunVirtualTryOn}
            className="w-full max-w-lg rounded-2xl bg-white border border-stone-200 shadow-xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900">
                Virtual Try-On Talaka
              </h3>
              <button
                type="button"
                onClick={() => setShowTryOnModal(false)}
                className="rounded-lg px-2 py-1 text-sm font-bold text-stone-400 hover:bg-stone-100 hover:text-stone-800 cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 p-3 text-center cursor-pointer hover:border-stone-900 min-h-[150px]">
                {tryOnBodyImage ? (
                  <img
                    src={tryOnBodyImage.previewUrl}
                    alt="Foto tubuh"
                    className="h-32 w-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-stone-800">
                      1. Foto Tubuh
                    </div>
                    <p className="text-[11px] text-stone-500">Pilih gambar</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    readImageAsAttachment(
                      e.target.files?.[0],
                      setTryOnBodyImage
                    );
                    e.target.value = '';
                  }}
                />
              </label>

              <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 p-3 text-center cursor-pointer hover:border-stone-900 min-h-[150px]">
                {tryOnOutfitImage ? (
                  <img
                    src={tryOnOutfitImage.previewUrl}
                    alt="Foto baju"
                    className="h-32 w-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-stone-800">
                      2. Foto Baju
                    </div>
                    <p className="text-[11px] text-stone-500">Pilih gambar</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    readImageAsAttachment(
                      e.target.files?.[0],
                      setTryOnOutfitImage
                    );
                    e.target.value = '';
                  }}
                />
              </label>
            </div>

            <input
              type="text"
              value={tryOnNote}
              onChange={(e) => setTryOnNote(e.target.value)}
              placeholder="Catatan gaya (opsional), misal: buat ngampus..."
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs text-stone-900 focus:border-stone-900 focus:outline-none"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowTryOnModal(false)}
                className="rounded-xl border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!tryOnBodyImage || !tryOnOutfitImage || isSending}
                className="rounded-xl bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-700 disabled:bg-stone-300 disabled:cursor-not-allowed cursor-pointer"
              >
                Coba Sekarang
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
