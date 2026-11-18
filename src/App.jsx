import { useEffect, useRef, useState } from 'react';
import FormattedMessage from './components/FormattedMessage';
import LandingPage from './components/LandingPage';
import TalaMascot from './components/TalaMascot';
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
import {
  Sparkles,
  Bot,
  Send,
  Trash2,
  Phone,
  Copy,
  Check,
  Image as ImageIcon,
  Shirt,
  Ruler,
  ShoppingBag,
  Sliders,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  RefreshCw,
  Eye,
  Tag,
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
  Store,
  Layers,
  Camera,
  CheckCircle2,
  Terminal,
  Cpu,
  Activity,
} from 'lucide-react';

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
  const [cursorPos, setCursorPos] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showFaqEditor, setShowFaqEditor] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatInputRef = useRef(null);
  const fashionMenuRef = useRef(null);
  const chatWorkspaceRef = useRef(null);
  const hasApiKey = hasDeepSeekApiKey();

  const scrollToChat = () => {
    if (chatWorkspaceRef.current) {
      chatWorkspaceRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPromptFromLanding = (promptText) => {
    scrollToChat();
    setTimeout(() => {
      sendQuestion(promptText);
    }, 450);
  };

  // Pastikan saat awal masuk web atau relog selalu di posisi atas (landing page), bukan langsung ke chatbot
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

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

  // Hanya auto-scroll ke bawah saat pengguna/bot benar-benar mengirim pesan baru, bukan saat awal render
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSending]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        fashionMenuRef.current &&
        !fashionMenuRef.current.contains(e.target)
      ) {
        setShowFashionMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleResetContext() {
    const fresh = buildDefaultTalakaKnowledge(showExactStock);
    setContextText(fresh);
  }

  function handleToggleExactStock(nextChecked) {
    setShowExactStock(nextChecked);
    setContextText(buildDefaultTalakaKnowledge(nextChecked));
  }

  function readImageAsAttachment(file, onReady) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa format gambar (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 8MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onReady({
        name: file.name,
        type: file.type,
        dataUrl: reader.result,
        previewUrl: reader.result,
      });
    };
    reader.onerror = () => {
      setError('Gagal membaca file gambar.');
    };
    reader.readAsDataURL(file);
  }

  function handleSelectOutfitFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    readImageAsAttachment(file, (img) => {
      setAttachedImage(img);
      setError('');
    });
    e.target.value = '';
    setShowFashionMenu(false);
  }

  async function handleRunVirtualTryOn(e) {
    e.preventDefault();
    if (!tryOnBodyImage || !tryOnOutfitImage) {
      setError('Lengkapi foto tubuh dan foto baju terlebih dahulu.');
      return;
    }
    const bodyUrl = tryOnBodyImage.dataUrl;
    const outfitUrl = tryOnOutfitImage.dataUrl;
    const noteText = tryOnNote.trim();

    const tryOnUserMessage = {
      role: 'user',
      content:
        `Virtual Try-On: Coba padukan foto pakaian ini ke foto tubuh saya.` +
        (noteText ? `\nCatatan: "${noteText}"` : ''),
      images: [
        { ...tryOnBodyImage, label: 'Foto Tubuh' },
        { ...tryOnOutfitImage, label: 'Foto Pakaian' },
      ],
    };

    setMessages((prev) => [...prev, tryOnUserMessage]);
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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* 1. Landing Page Section */}
      <LandingPage
        onScrollToChat={scrollToChat}
        onSelectSamplePrompt={handleSelectPromptFromLanding}
      />

      {/* 2. Interactive CS Agent Workspace Section (High-Tech Studio) */}
      <section
        ref={chatWorkspaceRef}
        id="live-cs-agent"
        className="w-full bg-slate-50/60 border-t border-slate-200 py-12 relative overflow-hidden"
      >
        {/* Subtle Tech Grid in Studio */}
        <div className="absolute inset-0 bg-tech-grid opacity-50 pointer-events-none -z-10" />

        {/* Top Control Bar / High-Tech Console Banner */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-4 sm:p-5 border border-slate-200/90 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="h-11 w-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-md shadow-slate-900/15">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                    {displayBotName} · Fashion AI Concierge
                  </h2>
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-mono font-bold text-slate-700">
                    <Activity className="w-3 h-3 text-emerald-500" />
                    ENGINE_LIVE
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-normal">
                  Studio konsultasi ukuran TB/BB, kurasi gaya objektif, &amp; Virtual Try-On
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Product Simulation Picker */}
              <div className="flex items-center gap-1.5 rounded-2xl bg-slate-50 border border-slate-200 px-3 py-1.5">
                <Store className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px] font-mono font-semibold text-slate-500 hidden md:inline">
                  PAGE_CONTEXT:
                </span>
                <select
                  aria-label="Simulasi halaman toko"
                  value={activePageContext}
                  onChange={(e) => setActivePageContext(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="beranda">Beranda Toko</option>
                  {TALAKA_PRODUCTS.map((p) => (
                    <option key={p.sku} value={`${p.name} (${p.sku})`}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>

              {/* Toggle Sidebar Button */}
              <button
                type="button"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 rounded-2xl border px-3.5 py-2 text-xs font-semibold transition cursor-pointer ${
                  isSidebarOpen
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                }`}
                title="Tampilkan / Sembunyikan Panel Studio"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {isSidebarOpen ? 'Tutup Panel Studio' : 'Buka Parameter'}
                </span>
              </button>

              {/* Scroll to Top Button */}
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                title="Kembali ke atas"
              >
                <span>↑</span>
                <span className="hidden sm:inline">Landing Page</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main 2-Column Workspace */}
        <main
          className={`mx-auto max-w-7xl px-4 sm:px-6 grid gap-6 items-start transition-all ${
            isSidebarOpen
              ? 'grid-cols-1 lg:grid-cols-[340px_1fr]'
              : 'grid-cols-1'
          }`}
        >
          {/* Left Panel: High-Tech Studio & Parameter Console */}
          {isSidebarOpen && (
            <aside className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-950 font-mono">
                      AI_STUDIO_PARAMS
                    </h3>
                    <p className="text-[10px] text-slate-500 font-normal">
                      Konfigurasi karakter &amp; respons
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-600">
                  GYA-13
                </span>
              </div>

              {/* 1. Nama Chatbot */}
              <div className="space-y-1.5">
                <label
                  htmlFor="bot-name"
                  className="block text-xs font-bold text-slate-800 font-mono"
                >
                  BOT_NAME
                </label>
                <div className="relative">
                  <input
                    id="bot-name"
                    type="text"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    placeholder={DEFAULT_BOT_NAME}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none transition"
                  />
                  <Bot className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 2. Gaya Kejujuran (Honesty Level) - Sleek Tech Segmented Cards */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 font-mono">
                    HONESTY_MODE
                  </label>
                  <span className="text-[10px] font-mono text-[#9E7B66]">
                    GYA-13 SPEC
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {HONESTY_OPTIONS.map((opt) => {
                    const isSelected = honestyLevel === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setHonestyLevel(opt.value)}
                        className={`text-left rounded-2xl p-3 border transition cursor-pointer flex flex-col gap-1 ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-slate-50/80 text-slate-800 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold flex items-center gap-1.5">
                            {opt.value === 'terus-terang' && '🌟'}
                            {opt.value === 'seimbang' && '⚖️'}
                            {opt.value === 'lembut' && '🌸'}
                            {opt.label}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </div>
                        <p
                          className={`text-[11px] leading-tight ${
                            isSelected ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {opt.instruction}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Tampilkan Angka Stok Persis Toggle */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-900 font-mono">
                    EXACT_STOCK_METRIC
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {showExactStock
                      ? 'Menyebutkan sisa angka stok persis (cth: "Sisa 2 pcs")'
                      : 'Status aman/menipis (cth: "Tersedia", "Stok menipis")'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={showExactStock}
                    onChange={(e) => handleToggleExactStock(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900" />
                </label>
              </div>

              {/* 4. Quick Product Showcase Chips */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 font-mono">
                    CATALOG_REGISTRY
                  </label>
                  <span className="text-[10px] font-mono font-bold text-[#9E7B66]">
                    5_ITEMS
                  </span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {TALAKA_PRODUCTS.map((prod) => (
                    <div
                      key={prod.sku}
                      className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs hover:border-slate-400 transition"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[9px] font-bold text-[#9E7B66] bg-[#9E7B66]/10 px-1 rounded border border-[#9E7B66]/20">
                            {prod.sku}
                          </span>
                          <span className="font-bold text-slate-900 truncate">
                            {prod.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">
                          {prod.priceFormatted} · {prod.material}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setActivePageContext(`${prod.name} (${prod.sku})`);
                          sendQuestion(
                            `Mau tanya soal ${prod.name} (${prod.sku}). Untuk tinggi dan berat badan segini cocoknya ukuran apa ya?`
                          );
                        }}
                        className="shrink-0 rounded-lg bg-slate-900 text-white px-2 py-1 text-[10px] font-semibold hover:bg-black transition cursor-pointer"
                        title="Tanya produk ini"
                      >
                        Tanya
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Model & Knowledge Accordion */}
              <div className="border-t border-slate-100 pt-3 space-y-2">
                <button
                  type="button"
                  onClick={() => setShowFaqEditor((prev) => !prev)}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-800 hover:text-slate-950 cursor-pointer font-mono"
                >
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-slate-500" />
                    KNOWLEDGE_BASE_CONFIG
                  </span>
                  {showFaqEditor ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {showFaqEditor && (
                  <div className="space-y-2 pt-1">
                    <div className="space-y-1">
                      <label
                        htmlFor="model-input"
                        className="block text-[11px] font-mono font-semibold text-slate-500"
                      >
                        ENGINE_MODEL
                      </label>
                      <input
                        id="model-input"
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder={DEFAULT_MODEL}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:border-slate-900 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="context-text"
                          className="block text-[11px] font-mono font-semibold text-slate-500"
                        >
                          FAQ_&amp;_PROMPT_CONTEXT
                        </label>
                        <button
                          type="button"
                          onClick={handleResetContext}
                          className="text-[10px] font-mono font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-2.5 h-2.5" /> RESET
                        </button>
                      </div>
                      <textarea
                        id="context-text"
                        rows={6}
                        maxLength={MAX_CONTEXT_CHARS}
                        value={contextText}
                        onChange={(e) => setContextText(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-[11px] font-mono leading-relaxed text-slate-800 focus:bg-white focus:border-slate-900 focus:outline-none resize-y"
                      />
                    </div>
                  </div>
                )}
              </div>
            </aside>
          )}

          {/* Right Panel: High-Tech Chat Sandbox Playground */}
          <section className="bg-white rounded-3xl border border-slate-200/90 shadow-md flex flex-col h-[740px] max-h-[85vh] overflow-hidden relative">
            {/* Header Ruang Konsultasi */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 px-5 py-3.5 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {displayBotName.charAt(0) || 'K'}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-950">
                      {displayBotName}
                    </h3>
                    <span className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700">
                      AI_STYLIST
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    ONLINE · Rekomendasi Ukuran Presisi TB/BB
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleManualHandoff}
                  disabled={isSending}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                  title="Hubungi Admin Manusia via WhatsApp"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Admin WA</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearChat}
                  disabled={messages.length === 0 && !error}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200 transition flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Bersihkan riwayat percakapan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Hapus</span>
                </button>
              </div>
            </div>

            {/* Banner Konteks Halaman Produk Aktif */}
            {activePageContext !== 'beranda' && (
              <div className="bg-slate-50 border-b border-slate-200/80 px-5 py-2.5 text-xs text-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-[#9E7B66]" />
                  <span>
                    Sedang melihat: <strong>{activePageContext}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    sendQuestion(
                      `Lagi lihat ${activePageContext}. Kira-kira cocok nggak ya buat aku, dan detail ukurannya gimana?`
                    )
                  }
                  disabled={isSending}
                  className="font-bold text-slate-900 underline hover:text-blue-600 cursor-pointer text-xs"
                >
                  Tanya produk ini ↗
                </button>
              </div>
            )}

            {/* Area Pesan Chat */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 sm:pb-24 space-y-5 bg-slate-50/40">
              {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-3.5 text-xs font-semibold text-rose-800 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">SYSTEM_ALERT:</div>
                    <div>{error}</div>
                  </div>
                </div>
              )}

              {/* Empty State: Sapaan Awal & Kartu Skenario Percakapan */}
              {messages.length === 0 && (
                <div className="space-y-5 py-2">
                  <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs relative overflow-hidden">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
                        {displayBotName.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-950">
                            Halo! Aku {displayBotName}, Teman Gaya Jujurmu ✨
                          </h4>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          Aku bukan chatbot e-commerce biasa yang asal puji semua baju. Kalau suatu baju kurang cocok dengan tinggi/berat badan atau acara kamu, aku akan kasih tahu secara jujur dan berikan alternatif yang lebih pas!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 4 Interactive Scenario Cards */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                        TEST_SCENARIO_PROMPTS:
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Klik untuk simulasi instan
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          sendQuestion(
                            'Aku tinggi 160 cm berat 52 kg, kemeja linen putih ukuran apa yang pas biar rapi dan nggak kedodoran?'
                          )
                        }
                        disabled={isSending}
                        className="group text-left rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-slate-900 hover:shadow-xs transition cursor-pointer flex flex-col gap-1.5"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 group-hover:text-blue-600">
                          <Ruler className="w-3.5 h-3.5 text-blue-600" />
                          <span>Rekomendasi Ukuran TB &amp; BB</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          “TB 160cm BB 52kg kemeja linen ukuran apa yang pas?”
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          sendQuestion(
                            'Celana kulot high-waist krem cocoknya dipadu sama atasan apa ya buat ngampus casual?'
                          )
                        }
                        disabled={isSending}
                        className="group text-left rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-slate-900 hover:shadow-xs transition cursor-pointer flex flex-col gap-1.5"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 group-hover:text-blue-600">
                          <Shirt className="w-3.5 h-3.5 text-[#9E7B66]" />
                          <span>Padu Padan OOTD Mahasiswa</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          “Celana kulot krem cocok dipadu sama apa buat ngampus?”
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          sendQuestion(
                            'Kemeja linen putih ukuran M masih ada stoknya? Bisa COD ke Bandung?'
                          )
                        }
                        disabled={isSending}
                        className="group text-left rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-slate-900 hover:shadow-xs transition cursor-pointer flex flex-col gap-1.5"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 group-hover:text-blue-600">
                          <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Cek Stok &amp; Opsi Pengiriman COD</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          “Kemeja linen putih M masih ada? Bisa COD?”
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          sendQuestion(
                            'Kalau TB aku 154 cm pakai celana kulot high-waist kepanjangan nyapu lantai nggak kak? Jujur ya.'
                          )
                        }
                        disabled={isSending}
                        className="group text-left rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-slate-900 hover:shadow-xs transition cursor-pointer flex flex-col gap-1.5"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 group-hover:text-blue-600">
                          <Sparkles className="w-3.5 h-3.5 text-[#9E7B66]" />
                          <span>Uji Kejujuran Suportif PRD</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          “TB 154 cm pakai kulot nyapu lantai nggak? Tolong jujur ya.”
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Message List */}
              {messages.map((msg, idx) => {
                const isUser = msg.role === 'user';
                const mentionedProducts = !isUser
                  ? findMentionedProducts(msg.content)
                  : [];

                return (
                  <div key={idx} className="space-y-3">
                    <div
                      className={`flex gap-3 items-end ${
                        isUser ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {!isUser && (
                        <div className="w-8 h-8 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mb-1 shadow-xs">
                          {displayBotName.charAt(0)}
                        </div>
                      )}

                      <div
                        className={`group relative max-w-[85%] sm:max-w-[78%] rounded-3xl px-4 sm:px-5 py-3.5 text-sm shadow-xs ${
                          isUser
                            ? 'bg-slate-900 text-white rounded-br-xs'
                            : 'bg-white border border-slate-200/90 text-slate-900 rounded-bl-xs'
                        }`}
                      >
                        {/* Single Attached Image */}
                        {msg.image?.previewUrl && (
                          <div className="mb-2.5">
                            <img
                              src={msg.image.previewUrl}
                              alt={msg.image.name || 'Foto outfit'}
                              className="max-h-48 rounded-2xl object-cover border border-slate-200 shadow-xs"
                            />
                          </div>
                        )}

                        {/* Multiple Images (e.g. Virtual Try-On Inputs) */}
                        {msg.images?.length > 0 && (
                          <div className="mb-3 grid grid-cols-2 gap-2.5">
                            {msg.images.map((img, i) => (
                              <div
                                key={i}
                                className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs"
                              >
                                <img
                                  src={img.previewUrl}
                                  alt={img.label || img.name}
                                  className="h-32 w-full object-cover"
                                />
                                <div className="px-2.5 py-1 text-[10px] font-mono font-bold text-slate-700 truncate bg-slate-50">
                                  {img.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Generated Virtual Try-On Image */}
                        {msg.generatedImageUrl && (
                          <div className="mb-3">
                            <div className="text-[11px] font-mono font-bold text-[#9E7B66] mb-1 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              OUTPUT_NEURAL_SYNTHESIS:
                            </div>
                            <img
                              src={msg.generatedImageUrl}
                              alt="Hasil Virtual Try-On Talaka"
                              className="max-h-80 w-full rounded-2xl border border-slate-200 object-cover shadow-sm"
                            />
                          </div>
                        )}

                        {/* Text Message Content */}
                        {isUser ? (
                          <div className="whitespace-pre-wrap leading-relaxed text-sm">
                            {msg.content}
                          </div>
                        ) : (
                          <FormattedMessage content={msg.content} />
                        )}

                        {/* Bot Message Action Toolbar */}
                        {!isUser && (
                          <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                            <span className="text-[10px]">
                              {displayBotName} · TALAKA_AI
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(msg.content, idx)}
                              className="flex items-center gap-1 font-semibold text-slate-500 hover:text-slate-900 transition cursor-pointer"
                              title="Salin jawaban"
                            >
                              {copiedIndex === idx ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-700 font-bold">
                                    COPIED
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>COPY</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Interactive Product Cards inside Chat Stream */}
                    {mentionedProducts.length > 0 && (
                      <div className="flex flex-wrap gap-3 pl-11">
                        {mentionedProducts.slice(0, 3).map((product) => (
                          <div
                            key={product.sku}
                            className="w-68 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs space-y-2 hover:border-slate-400 transition"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-mono font-bold text-[#9E7B66] bg-[#9E7B66]/10 px-1.5 py-0.5 rounded border border-[#9E7B66]/20">
                                {product.sku}
                              </span>
                              <span className="text-xs font-bold text-slate-900">
                                {product.priceFormatted}
                              </span>
                            </div>
                            <div className="text-xs font-bold text-slate-900">
                              {product.name}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {product.material}
                            </p>
                            <div className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                              <span className="font-mono font-bold text-[#9E7B66]">
                                [TIPS]:
                              </span>{' '}
                              {product.honestNote}
                            </div>
                            <div className="pt-1 flex items-center justify-between gap-2">
                              <span className="text-[10px] font-medium text-slate-500">
                                {product.colors.join(', ')}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActivePageContext(
                                      `${product.name} (${product.sku})`
                                    );
                                    sendQuestion(
                                      `Untuk ${product.name} (${product.sku}), kalau TB 160 BB 50 ukuran apa yang pas ya?`
                                    );
                                  }}
                                  className="rounded-xl bg-slate-900 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-black transition cursor-pointer"
                                >
                                  Tanya Ukuran
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Handoff Notice */}
              {handoffSent && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-600 flex items-center gap-3 shadow-xs">
                  <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900 font-mono">
                      ESCALATION_STATUS: HANDOFF_SENT
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Jam operasional CS manusia: Senin–Sabtu 09.00–20.00 WIB, Minggu 10.00–17.00 WIB. Chatbot AI tetap siaga menjawab konsultasi ukuranmu 24/7.
                    </p>
                  </div>
                </div>
              )}

              {/* Typing Bounce Indicator */}
              {isSending && (
                <div className="flex gap-3 items-end justify-start">
                  <div className="w-8 h-8 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    {displayBotName.charAt(0)}
                  </div>
                  <div className="rounded-3xl rounded-bl-xs border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 shadow-xs flex items-center gap-2.5">
                    <span className="inline-flex gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-slate-900 animate-bounce" />
                      <span className="h-2 w-2 rounded-full bg-slate-900 animate-bounce [animation-delay:150ms]" />
                      <span className="h-2 w-2 rounded-full bg-slate-900 animate-bounce [animation-delay:300ms]" />
                    </span>
                    <span className="font-mono text-slate-800 text-[11px]">
                      {displayBotName} sedang menganalisis proporsi pakaian...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Area Input Percakapan dengan Maskot Mengambang Langsung di Atasnya */}
            <form
              onSubmit={handleSubmit}
              className="p-3.5 sm:p-4 bg-white border-t border-slate-200/80 relative"
            >
              {/* Maskot Kak Tala Langsung di Atas Input (Belakangnya langsung area chat, tanpa section putih lebar) */}
              <div
                ref={fashionMenuRef}
                className="absolute -top-16 sm:-top-20 left-4 z-30"
              >
                <div className="relative">
                  <TalaMascot
                    inputText={input}
                    cursorPos={cursorPos}
                    isTyping={isTyping}
                    isSending={isSending}
                    lastMessage={messages[messages.length - 1]}
                    textareaRef={chatInputRef}
                    onMascotClick={() => setShowFashionMenu((prev) => !prev)}
                  />

                  {/* Popover Menu saat Maskot Dipencet -> Muncul KE ATAS (bottom-full), tidak terpotong ke bawah */}
                  {showFashionMenu && (
                    <div className="absolute bottom-full left-0 mb-3 z-50 w-72 sm:w-80 rounded-3xl border border-slate-200 bg-white p-3.5 shadow-2xl space-y-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
                      <div className="flex items-center justify-between px-2 pb-1.5 border-b border-slate-100">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9E7B66]">
                          MENU_FITUR_TALA
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowFashionMenu(false)}
                          className="text-xs text-slate-400 hover:text-slate-800 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      {/* 1. Virtual Try-On */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowFashionMenu(false);
                          setShowTryOnModal(true);
                        }}
                        className="w-full flex items-center gap-2.5 rounded-2xl bg-slate-900 text-white px-3.5 py-2.5 text-left text-xs font-semibold hover:bg-black transition cursor-pointer shadow-xs"
                      >
                        <Camera className="h-4 w-4 text-[#9E7B66] shrink-0" />
                        <div>
                          <div className="font-bold">Virtual Try-On AI</div>
                          <div className="text-[10px] text-slate-300">
                            Upload foto tubuh + foto baju
                          </div>
                        </div>
                      </button>

                      {/* 2. Lampirkan 1 Foto Outfit */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowFashionMenu(false);
                          fileInputRef.current?.click();
                        }}
                        className="w-full flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-left text-xs font-semibold text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                      >
                        <ImageIcon className="h-4 w-4 text-slate-600 shrink-0" />
                        <span>Lampirkan 1 Foto Outfit</span>
                      </button>

                      {/* 3. Isi Ukuran TB & BB */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowFashionMenu(false);
                          handleInsertTemplate(
                            'TB saya ... cm, BB ... kg, suka fit santai. Cocok ukuran apa?'
                          );
                        }}
                        className="w-full flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-left text-xs font-semibold text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                      >
                        <Ruler className="h-4 w-4 text-blue-600 shrink-0" />
                        <span>Isi Format TB &amp; BB</span>
                      </button>

                      {/* 4. Katalog Produk */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowFashionMenu(false);
                          sendQuestion(
                            'Bisa sebutkan daftar produk Talaka beserta pilihan warna dan harganya?'
                          );
                        }}
                        className="w-full flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-left text-xs font-semibold text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                      >
                        <Shirt className="h-4 w-4 text-[#9E7B66] shrink-0" />
                        <span>Katalog Koleksi Busana</span>
                      </button>

                      {/* 5. Kebijakan Retur 7 Hari */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowFashionMenu(false);
                          sendQuestion(
                            'Bagaimana syarat dan cara retur atau tukar ukuran 7 hari di Talaka?'
                          );
                        }}
                        className="w-full flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-left text-xs font-semibold text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                      >
                        <RefreshCw className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>Kebijakan Retur 7 Hari</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {attachedImage && (
                <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1.5 w-fit">
                  <img
                    src={attachedImage.previewUrl}
                    alt={attachedImage.name}
                    className="h-9 w-9 rounded-xl object-cover border border-slate-200"
                  />
                  <span className="text-xs font-semibold text-slate-800 max-w-[180px] truncate">
                    {attachedImage.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAttachedImage(null)}
                    className="rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold text-slate-500 hover:bg-slate-200 hover:text-slate-900 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Hidden file input for attachment */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleSelectOutfitFile}
                className="hidden"
              />

              <div className="flex items-end gap-2.5">
                <div className="relative flex-1 flex items-end rounded-2xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-slate-900 transition">
                  <textarea
                    ref={chatInputRef}
                    id="chat-input"
                    rows={2}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      setCursorPos(e.target.selectionEnd || e.target.value.length);
                      setIsTyping(true);
                    }}
                    onFocus={() => {
                      setIsTyping(true);
                      setCursorPos(chatInputRef.current?.selectionEnd || input.length);
                    }}
                    onBlur={() => {
                      setIsTyping(false);
                    }}
                    onSelect={(e) => {
                      setCursorPos(e.target.selectionEnd || 0);
                    }}
                    onKeyUp={(e) => {
                      setCursorPos(e.target.selectionEnd || 0);
                    }}
                    onClick={(e) => {
                      setCursorPos(e.target.selectionEnd || 0);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={`Tanyakan pada ${displayBotName} soal ukuran TB/BB, padu-padan OOTD, atau stok...`}
                    className="w-full bg-transparent py-2.5 px-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending || (!input.trim() && !attachedImage)}
                  className="shrink-0 h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer transition-all shadow-xs"
                  title="Kirim pesan"
                >
                  {isSending ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Send className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </form>
          </section>
        </main>
      </section>

      {/* Modal Virtual Try-On (High-Tech Fitting Room) */}
      {showTryOnModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleRunVirtualTryOn}
            className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <Camera className="w-4 h-4 text-[#9E7B66]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-950 font-mono">
                    VIRTUAL_TRY_ON_SYNTHESIS
                  </h3>
                  <p className="text-[10px] text-slate-500 font-normal">
                    Simulasi pakaian ke foto tubuh via Neural Model
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTryOnModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-4 text-center cursor-pointer hover:border-slate-900 min-h-[170px] transition">
                {tryOnBodyImage ? (
                  <img
                    src={tryOnBodyImage.previewUrl}
                    alt="Foto tubuh"
                    className="h-36 w-full object-cover rounded-xl border border-slate-200"
                  />
                ) : (
                  <div className="space-y-1.5 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
                      <Shirt className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-slate-900 font-mono">
                      1. FOTO_TUBUH
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Upload foto seluruh badan atau setengah badan
                    </p>
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

              <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-4 text-center cursor-pointer hover:border-slate-900 min-h-[170px] transition">
                {tryOnOutfitImage ? (
                  <img
                    src={tryOnOutfitImage.previewUrl}
                    alt="Foto baju"
                    className="h-36 w-full object-cover rounded-xl border border-slate-200"
                  />
                ) : (
                  <div className="space-y-1.5 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-slate-900 font-mono">
                      2. FOTO_PAKAIAN
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Pilih foto baju atau katalog yang ingin dicoba
                    </p>
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

            <div className="space-y-1">
              <label
                htmlFor="tryon-note"
                className="block text-[11px] font-mono font-bold text-slate-700"
              >
                PROMPT_NOTES (OPSIONAL)
              </label>
              <input
                id="tryon-note"
                type="text"
                value={tryOnNote}
                onChange={(e) => setTryOnNote(e.target.value)}
                placeholder="Contoh: Buat acara kuliah formal, fit agak longgar..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowTryOnModal(false)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!tryOnBodyImage || !tryOnOutfitImage || isSending}
                className="rounded-2xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#9E7B66]" />
                <span>Mulai Virtual Try-On</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
