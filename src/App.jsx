import { useEffect, useRef, useState } from 'react';
import CatalogModal from './components/CatalogModal';
import FormattedMessage from './components/FormattedMessage';
import SettingsModal from './components/SettingsModal';
import {
  DEFAULT_BOT_NAME,
  DEFAULT_HONESTY_LEVEL,
  DEFAULT_MODEL,
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
  chatHistoryList: 'talaka_fashion_sessions_v1',
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

function ShirtIcon({ className = 'h-4 w-4' }) {
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

function SendArrowIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
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
  const [sessions, setSessions] = useState(() => {
    try {
      const raw = readStorage(STORAGE_KEYS.chatHistoryList);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [searchHistory, setSearchHistory] = useState('');
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
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCatalogModal, setShowCatalogModal] = useState(false);

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
    writeStorage(STORAGE_KEYS.chatHistoryList, JSON.stringify(sessions));
  }, [sessions]);

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

  function persistCurrentSession(updatedMessages) {
    if (!updatedMessages || updatedMessages.length === 0) return;
    const firstUserMsg = updatedMessages.find((m) => m.role === 'user');
    const title = (firstUserMsg?.content || 'Percakapan Talaka').slice(0, 42);
    const id = activeSessionId || `session-${Date.now()}`;
    if (!activeSessionId) setActiveSessionId(id);

    const compactMessages = updatedMessages.map((m) => ({
      role: m.role,
      content: m.content,
      apiContent: m.apiContent,
    }));

    setSessions((prev) => {
      const existing = prev.filter((s) => s.id !== id);
      return [
        { id, title, updatedAt: Date.now(), messages: compactMessages },
        ...existing,
      ].slice(0, 15);
    });
  }

  function handleNewChat() {
    setMessages([]);
    setActiveSessionId(null);
    setError('');
    setHandoffSent(false);
    setAttachedImage(null);
    chatInputRef.current?.focus();
  }

  function handleSelectSession(session) {
    setActiveSessionId(session.id);
    setMessages(session.messages || []);
    setError('');
    setHandoffSent(false);
  }

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

    const withUser = [...messages, userMessage];
    setMessages(withUser);
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

      const finalMessages = [
        ...withUser,
        {
          role: 'assistant',
          content: result.text,
          generatedImageUrl: result.generatedImageUrl,
        },
      ];
      setMessages(finalMessages);
      persistCurrentSession(finalMessages);
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
      const finalMessages = [
        ...nextHistory,
        { role: 'assistant', content: reply },
      ];
      setMessages(finalMessages);
      persistCurrentSession(finalMessages);
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
  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchHistory.trim().toLowerCase())
  );

  function renderComposerCard(isCenteredHero) {
    return (
      <form onSubmit={handleSubmit} className="w-full">
        {attachedImage && (
          <div className="mb-2.5 flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2 w-fit shadow-xs">
            <img
              src={attachedImage.previewUrl}
              alt={attachedImage.name}
              className="h-9 w-9 rounded-lg object-cover border border-slate-200"
            />
            <span className="text-xs font-medium text-slate-800 max-w-[180px] truncate">
              {attachedImage.name}
            </span>
            <button
              type="button"
              onClick={() => setAttachedImage(null)}
              className="rounded-full px-1.5 py-0.5 text-xs font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        <div className="relative rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-[0_12px_40px_-12px_rgba(99,102,241,0.22)] focus-within:border-indigo-300 focus-within:shadow-[0_14px_44px_-10px_rgba(99,102,241,0.28)] transition-shadow">
          <textarea
            ref={chatInputRef}
            id="chat-input"
            rows={isCenteredHero ? 3 : 2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Tanya ${displayBotName} soal stok, ukuran TB/BB, atau saran gaya...`}
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
          />

          <div className="mt-2 pt-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Tombol Icon Baju */}
              <div ref={fashionMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setShowFashionMenu((prev) => !prev)}
                  title="Menu Fashion & Lampiran"
                  aria-label="Menu Fashion"
                  className={`h-8 w-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                    showFashionMenu
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <ShirtIcon className="h-4 w-4" />
                </button>

                {showFashionMenu && (
                  <div className="absolute bottom-10 left-0 z-30 w-68 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowFashionMenu(false);
                        setShowTryOnModal(true);
                      }}
                      className="w-full flex items-center gap-2.5 rounded-xl bg-indigo-600 text-white px-3 py-2 text-left text-xs font-semibold hover:bg-indigo-700 cursor-pointer"
                    >
                      <ShirtIcon className="h-4 w-4 shrink-0" />
                      <span>Virtual Try-On (Foto Tubuh + Baju)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      <ShirtIcon className="h-4 w-4 text-slate-500 shrink-0" />
                      <span>Upload 1 Foto Outfit</span>
                    </button>

                    <div className="border-t border-slate-100 my-1 pt-1">
                      {TALAKA_PRODUCTS.map((product) => (
                        <button
                          key={product.sku}
                          type="button"
                          onClick={() =>
                            handleInsertTemplate(
                              `Mau tanya soal ${product.name} (${product.sku}): `
                            )
                          }
                          className="w-full flex items-center justify-between rounded-xl px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          <span className="truncate font-medium">
                            {product.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 ml-2 shrink-0">
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

              {/* Quick Mode Chips Ala Referensi */}
              <button
                type="button"
                onClick={() =>
                  handleInsertTemplate(
                    'TB saya ... cm, BB ... kg, suka fit standar. Cocok ukuran apa?'
                  )
                }
                className="rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 cursor-pointer transition-colors"
              >
                📏 Cek Ukuran TB/BB
              </button>

              <button
                type="button"
                onClick={() => setShowTryOnModal(true)}
                className="rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 cursor-pointer transition-colors"
              >
                👕 Virtual Try-On
              </button>

              <button
                type="button"
                onClick={() =>
                  handleInsertTemplate(
                    'Aku mau cari outfit untuk acara ..., gayaku lebih ke ...'
                  )
                }
                className="hidden sm:inline-flex rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 cursor-pointer transition-colors"
              >
                ✨ Saran Gaya
              </button>
            </div>

            <button
              type="submit"
              disabled={isSending || (!input.trim() && !attachedImage)}
              aria-label="Kirim pesan"
              className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-xs hover:from-indigo-600 hover:to-violet-700 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              <SendArrowIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className="h-screen w-full flex bg-white text-slate-900 overflow-hidden">
      {/* Sidebar Kiri Minimalis Ala Referensi */}
      <aside className="hidden md:flex w-64 shrink-0 bg-[#fafafe] border-r border-slate-200/80 flex-col justify-between p-4">
        <div className="space-y-4 overflow-y-auto pr-1">
          {/* Brand */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                T
              </div>
              <span className="text-base font-bold tracking-tight text-slate-900">
                Talaka
              </span>
            </div>
            <span
              className={`h-2 w-2 rounded-full ${
                hasApiKey ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              title={hasApiKey ? 'API Online' : 'API Belum Diisi'}
            />
          </div>

          {/* Search Riwayat */}
          <div className="relative">
            <input
              type="text"
              value={searchHistory}
              onChange={(e) => setSearchHistory(e.target.value)}
              placeholder="Cari percakapan..."
              className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none shadow-2xs"
            />
          </div>

          {/* Menu Utama */}
          <nav className="space-y-1">
            <button
              type="button"
              onClick={handleNewChat}
              className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                messages.length === 0
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/70'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              <span>💬</span>
              <span>Chat Utama</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCatalogModal(true)}
              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 hover:bg-white hover:text-slate-900 cursor-pointer transition-colors"
            >
              <span>🛍️</span>
              <span>Katalog &amp; Size Chart</span>
            </button>

            <button
              type="button"
              onClick={() => setShowTryOnModal(true)}
              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 hover:bg-white hover:text-slate-900 cursor-pointer transition-colors"
            >
              <span>👕</span>
              <span>Virtual Try-On</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 hover:bg-white hover:text-slate-900 cursor-pointer transition-colors"
            >
              <span>⚙️</span>
              <span>Pengaturan AI</span>
            </button>
          </nav>

          {/* Riwayat Chat */}
          <div className="pt-2 space-y-2">
            <div className="px-2 text-[11px] font-semibold text-slate-400">
              Riwayat Chat
            </div>
            {filteredSessions.length === 0 ? (
              <p className="px-2 text-[11px] text-slate-400">
                Belum ada riwayat tersimpan.
              </p>
            ) : (
              <div className="space-y-0.5">
                {filteredSessions.map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => handleSelectSession(session)}
                    className={`w-full text-left truncate rounded-lg px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
                      activeSessionId === session.id
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:bg-white hover:text-slate-900'
                    }`}
                  >
                    {session.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Profil Toko di Bawah Sidebar */}
        <div className="pt-3 border-t border-slate-200/80">
          <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-7 w-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                KT
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {displayBotName}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  PT Talaka Sinar Rekayasa
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
              title="Pengaturan"
            >
              ⋮
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-white">
        {/* Ambient Soft Glow */}
        <div className="pointer-events-none absolute inset-x-0 top-1/3 mx-auto h-72 w-[540px] rounded-full bg-gradient-to-r from-indigo-100/50 via-violet-100/45 to-sky-100/40 blur-3xl" />

        {/* Top Bar */}
        <header className="relative z-10 flex items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-100/80">
          <div className="flex items-center gap-2">
            <select
              aria-label="Konteks halaman website"
              value={activePageContext}
              onChange={(e) => setActivePageContext(e.target.value)}
              className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs focus:outline-none cursor-pointer hover:border-slate-300"
            >
              <option value="beranda">{displayBotName} • Beranda</option>
              {TALAKA_PRODUCTS.map((p) => (
                <option key={p.sku} value={`${p.name} (${p.sku})`}>
                  Produk: {p.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowCatalogModal(true)}
              className="md:hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 cursor-pointer"
            >
              Katalog
            </button>
            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              className="md:hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 cursor-pointer"
            >
              ⚙️
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleManualHandoff}
              disabled={isSending}
              className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              Hubungi Admin
            </button>
            <button
              type="button"
              onClick={handleNewChat}
              className="rounded-full bg-slate-950 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer shadow-2xs"
            >
              + Chat Baru
            </button>
          </div>
        </header>

        {/* Konten Tengah */}
        {messages.length === 0 ? (
          <div className="relative z-10 flex-1 overflow-y-auto px-4 py-8 flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl flex flex-col items-center space-y-6">
              {/* Orb Glow Ala Referensi */}
              <div className="relative flex items-center justify-center">
                <div className="absolute h-20 w-20 rounded-full bg-indigo-400/25 blur-xl" />
                <div className="relative h-14 w-14 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffffff_0%,#dbeafe_38%,#a5b4fc_72%,#7c3aed_100%)] shadow-lg ring-1 ring-white/80" />
              </div>

              {/* Greeting */}
              <div className="text-center space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Hai Kak, Aku {displayBotName}
                </h1>
                <p className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Mau Cari Gaya atau{' '}
                  <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    Cek Ukuran Hari Ini?
                  </span>
                </p>
              </div>

              {error && (
                <div className="w-full rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
                  {error}
                </div>
              )}

              {/* Centered Composer */}
              {renderComposerCard(true)}

              {/* Skenario Cepat */}
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                {QUICK_PROMPTS.slice(0, 4).map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendQuestion(prompt)}
                    disabled={isSending}
                    className="rounded-full border border-slate-200/90 bg-white/90 px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/70 hover:text-indigo-700 disabled:opacity-50 cursor-pointer transition-colors shadow-2xs"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Thread Chat Aktif */}
            <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6">
              <div className="mx-auto max-w-3xl space-y-5">
                {error && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
                    {error}
                  </div>
                )}

                {messages.map((msg, idx) => {
                  const isUser = msg.role === 'user';
                  const mentionedProducts = !isUser
                    ? findMentionedProducts(msg.content)
                    : [];

                  return (
                    <div key={idx} className="space-y-2.5">
                      <div
                        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`group relative max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                            isUser
                              ? 'bg-slate-900 text-white rounded-br-sm shadow-xs'
                              : 'bg-slate-50/90 border border-slate-200/80 text-slate-800 rounded-bl-sm'
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
                                  <div className="px-2 py-1 text-[10px] font-medium text-slate-200 truncate">
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
                                className="max-h-80 rounded-xl border border-slate-200 object-cover"
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
                                className="text-[11px] font-medium text-slate-400 hover:text-indigo-600 cursor-pointer"
                              >
                                {copiedIndex === idx ? 'Tersalin ✓' : 'Salin'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {mentionedProducts.length > 0 && (
                        <div className="flex flex-wrap gap-2.5 pl-1">
                          {mentionedProducts.slice(0, 3).map((product) => (
                            <div
                              key={product.sku}
                              className="w-60 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs space-y-1.5"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-mono font-semibold text-slate-500">
                                  {product.sku}
                                </span>
                                <span className="text-xs font-bold text-slate-900">
                                  {product.priceFormatted}
                                </span>
                              </div>
                              <div className="text-xs font-bold text-slate-900">
                                {product.name}
                              </div>
                              <p className="text-[11px] text-slate-500">
                                {product.material}
                              </p>
                              <div className="pt-1 flex items-center justify-between gap-2">
                                <span className="text-[11px] text-slate-500">
                                  {product.colors.join(', ')}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setActivePageContext(
                                      `${product.name} (${product.sku})`
                                    )
                                  }
                                  className="rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-indigo-600 cursor-pointer transition-colors"
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
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
                    Percakapan diteruskan ke admin (Senin–Sabtu 09.00–20.00 WIB,
                    Minggu 10.00–17.00 WIB).
                  </div>
                )}

                {isSending && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-sm border border-slate-200/80 bg-slate-50 px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
                      <span className="inline-flex gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" />
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:150ms]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:300ms]" />
                      </span>
                      <span>{displayBotName} sedang mengetik...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Composer Pinned di Bawah */}
            <div className="relative z-10 px-4 pb-5 pt-2 bg-gradient-to-t from-white via-white to-white/80">
              <div className="mx-auto max-w-3xl">{renderComposerCard(false)}</div>
            </div>
          </>
        )}
      </main>

      {/* Modals */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        botName={botName}
        setBotName={setBotName}
        honestyLevel={honestyLevel}
        setHonestyLevel={setHonestyLevel}
        showExactStock={showExactStock}
        onToggleExactStock={handleToggleExactStock}
        model={model}
        setModel={setModel}
        contextText={contextText}
        setContextText={setContextText}
        onResetContext={handleResetContext}
      />

      <CatalogModal
        isOpen={showCatalogModal}
        onClose={() => setShowCatalogModal(false)}
        onSelectProductPage={setActivePageContext}
        onAskProduct={(q) => sendQuestion(q)}
      />

      {showTryOnModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleRunVirtualTryOn}
            className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Virtual Try-On Talaka
              </h3>
              <button
                type="button"
                onClick={() => setShowTryOnModal(false)}
                className="rounded-lg px-2 py-1 text-sm font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-3 text-center cursor-pointer hover:border-indigo-400 min-h-[150px] transition-colors">
                {tryOnBodyImage ? (
                  <img
                    src={tryOnBodyImage.previewUrl}
                    alt="Foto tubuh"
                    className="h-32 w-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-800">
                      1. Foto Tubuh
                    </div>
                    <p className="text-[11px] text-slate-500">Pilih gambar</p>
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

              <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-3 text-center cursor-pointer hover:border-indigo-400 min-h-[150px] transition-colors">
                {tryOnOutfitImage ? (
                  <img
                    src={tryOnOutfitImage.previewUrl}
                    alt="Foto baju"
                    className="h-32 w-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-800">
                      2. Foto Baju
                    </div>
                    <p className="text-[11px] text-slate-500">Pilih gambar</p>
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
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowTryOnModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!tryOnBodyImage || !tryOnOutfitImage || isSending}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
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
