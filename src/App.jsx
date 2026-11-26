import { useCallback, useEffect, useRef, useState } from 'react';
import AdminDashboardPage from './components/AdminDashboardPage';
import ChatCheckoutCard from './components/ChatCheckoutCard';
import CustomerOrdersDrawer from './components/CustomerOrdersDrawer';
import FormattedMessage from './components/FormattedMessage';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import PresentationPage from './components/PresentationPage';
import PromoVideoPage from './components/PromoVideoPage';
import TalaMascot from './components/TalaMascot';
import VoiceCallModal from './components/VoiceCallModal';
import talakaLogo from './assets/talaka-logo.svg';
import {
  DEFAULT_BOT_NAME,
  DEFAULT_HONESTY_LEVEL,
  DEFAULT_MODEL,
  parseCheckoutDraftFromText,
} from './config/botPrompt';
import {
  buildTalakaKnowledgeFromProducts,
  cloneInitialProducts,
  findMentionedProducts,
} from './data/talakaCatalog';
import { askDeepSeek, hasDeepSeekApiKey } from './services/deepseek';
import {
  hasDeepgramApiKey,
  speakIndonesianAuto,
  stopBrowserIndonesianSpeech,
  transcribeAudioWithDeepgram,
} from './services/deepgram';
import { playCallSoundEffect } from './services/callSound';
import {
  hasGeminiApiKey,
  runVirtualTryOn,
  searchCatalogByPhoto,
} from './services/gemini';
import {
  exportLookbookPdf,
  extractTextFromPdfFile,
} from './services/pdfService';
import {
  createHandoffTicketInDb,
  createOrderInDb,
  fetchLiveProducts,
  fetchNotificationsFromDb,
  fetchOrdersFromDb,
  isSupabaseConfigured,
  lookupOrderByCodeOrTracking,
  markNotificationsReadInDb,
  resetProductsInDb,
  saveChatMessageToDb,
  updateProductSizesInDb,
} from './services/supabase';
import {
  Sparkles,
  Send,
  Trash2,
  Phone,
  PhoneCall,
  Copy,
  Check,
  Image as ImageIcon,
  Shirt,
  Ruler,
  ShoppingBag,
  RefreshCw,
  Tag,
  AlertCircle,
  Store,
  Camera,
  Activity,
  FileText,
  FileDown,
  Mic,
  Square,
  Volume2,
  VolumeX,
  Lock,
  Package,
  LayoutDashboard,
  Truck,
  Search,
} from 'lucide-react';

const GUEST_CHAT_LIMIT = 3;

const STORAGE_KEYS = {
  products: 'talaka_live_products_v8',
  authUser: 'talaka_auth_user_v1',
  guestChatCount: 'talaka_guest_chat_count_v1',
};

function loadGuestChatCount() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.guestChatCount);
    const parsed = Number.parseInt(raw || '0', 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

function loadInitialUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.authUser);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.username) return parsed;
  } catch {
    // Abaikan jika rusak
  }
  return null;
}

function loadInitialProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.products);
    const initial = cloneInitialProducts();
    if (!raw) return initial;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.sku) {
      // Selalu sinkronkan path gambar dari master catalog agar perubahan aset gambar langsung aktif
      return parsed.map((p) => {
        const found = initial.find((item) => item.sku === p.sku);
        return found ? { ...p, image: found.image } : p;
      });
    }
  } catch {
    // Gunakan default jika localStorage rusak
  }
  return cloneInitialProducts();
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Abaikan jika localStorage diblokir
  }
}

export default function App() {
  const [pathname, setPathname] = useState(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (targetPath) => {
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
      setPathname(targetPath);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  // Konfigurasi AI dikunci di code (AI otomatis menganalisis nada respons user)
  const model = DEFAULT_MODEL;
  const botName = DEFAULT_BOT_NAME;
  const honestyLevel = DEFAULT_HONESTY_LEVEL;
  const showExactStock = false;

  const [products, setProducts] = useState(() => loadInitialProducts());
  const [currentUser, setCurrentUser] = useState(() => loadInitialUser());
  const [guestChatCount, setGuestChatCount] = useState(() =>
    loadGuestChatCount()
  );
  const [showLoginLimitModal, setShowLoginLimitModal] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [sessionId, setSessionId] = useState(() => `sess-${Date.now()}`);
  const contextText = buildTalakaKnowledgeFromProducts(products, showExactStock);
  const [activePageContext, setActivePageContext] = useState('beranda');
  const [maxPriceFilter, setMaxPriceFilter] = useState(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [cursorPos, setCursorPos] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSlowLoading, setIsSlowLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [handoffSent, setHandoffSent] = useState(false);
  const [showFashionMenu, setShowFashionMenu] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const [attachedPdf, setAttachedPdf] = useState(null);
  const [isReadingPdf, setIsReadingPdf] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [speakingMessageIdx, setSpeakingMessageIdx] = useState(null);
  const [isSynthesizingSpeech, setIsSynthesizingSpeech] = useState(false);
  const [showVoiceCallModal, setShowVoiceCallModal] = useState(false);
  const [showOrdersDrawer, setShowOrdersDrawer] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [userNotifications, setUserNotifications] = useState([]);
  const [isLoadingUserOrders, setIsLoadingUserOrders] = useState(false);
  const [showTryOnModal, setShowTryOnModal] = useState(false);
  const [tryOnBodyImage, setTryOnBodyImage] = useState(null);
  const [tryOnOutfitImage, setTryOnOutfitImage] = useState(null);
  const [tryOnNote, setTryOnNote] = useState('');

  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const chatInputRef = useRef(null);
  const fashionMenuRef = useRef(null);
  const chatWorkspaceRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const activeAudioRef = useRef(null);
  const activeAudioUrlRef = useRef(null);
  const speechSessionRef = useRef(0);
  const messagesRef = useRef(messages);
  const hasApiKey = hasDeepSeekApiKey();

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!isSending) {
      setIsSlowLoading(false);
      return;
    }
    const timer = setTimeout(() => {
      setIsSlowLoading(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [isSending]);
  const hasDeepgramKey = hasDeepgramApiKey();

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

  const handleAskProductFromCatalog = (product, color, size) => {
    const nextPageCtx = `${product.name} (${product.sku})`;
    setActivePageContext(nextPageCtx);
    scrollToChat();
    const prompt = `Kak, cek stok dan kasih saran ukuran/gaya untuk ${product.name} (${product.sku}) warna ${color} ukuran ${size} dong!`;
    setTimeout(() => {
      sendQuestion(prompt, nextPageCtx);
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
    writeStorage(STORAGE_KEYS.products, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.guestChatCount, String(guestChatCount));
  }, [guestChatCount]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.authUser);
      }
    } catch {
      // Abaikan
    }
  }, [currentUser]);

  function handleLogout() {
    setCurrentUser(null);
  }

  const loadCustomerOrdersAndNotifs = useCallback(async () => {
    const activeUser = currentUser?.username || 'guest';
    setIsLoadingUserOrders(true);
    try {
      const [ordList, notifList] = await Promise.all([
        fetchOrdersFromDb({
          username: activeUser,
          isAdmin: currentUser?.role === 'admin',
        }),
        fetchNotificationsFromDb(activeUser),
      ]);
      setUserOrders(ordList);
      setUserNotifications(notifList);
    } finally {
      setIsLoadingUserOrders(false);
    }
  }, [currentUser]);

  useEffect(() => {
    let active = true;
    const activeUser = currentUser?.username || 'guest';
    Promise.all([
      fetchOrdersFromDb({
        username: activeUser,
        isAdmin: currentUser?.role === 'admin',
      }),
      fetchNotificationsFromDb(activeUser),
    ]).then(([ordList, notifList]) => {
      if (!active) return;
      setUserOrders(ordList);
      setUserNotifications(notifList);
    });
    return () => {
      active = false;
    };
  }, [currentUser]);

  async function handleOpenOrdersDrawer() {
    setShowOrdersDrawer(true);
    await loadCustomerOrdersAndNotifs();
    const activeUser = currentUser?.username || 'guest';
    await markNotificationsReadInDb(activeUser);
    setUserNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  async function handleConfirmChatCheckout(payload) {
    const activeUsername = currentUser?.username || 'guest';
    const orderItems =
      Array.isArray(payload.items) && payload.items.length > 0
        ? payload.items
        : [
            {
              sku: payload.sku,
              name: payload.name,
              image: payload.image || '',
              color: payload.color,
              size: payload.size,
              qty: payload.qty,
              price: payload.price,
            },
          ];

    const { order } = await createOrderInDb({
      customerUsername: activeUsername,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      shippingAddress: payload.shippingAddress,
      paymentMethod: payload.paymentMethod,
      items: orderItems,
      totalPrice: payload.totalPrice,
    });

    for (const item of orderItems) {
      handleUpdateProductStock(item.sku, item.color, item.size, -item.qty);
    }
    await loadCustomerOrdersAndNotifs();
    return order;
  }

  function handleQuickCheckoutFromCard(product) {
    const defaultColor =
      product.colors?.find((c) => {
        const sm = product.sizes?.[c] || {};
        return Object.values(sm).some((v) => Number(v) > 0);
      }) ||
      product.colors?.[0] ||
      '';
    const sizeMap = product.sizes?.[defaultColor] || {};
    const readySize =
      Object.keys(sizeMap).find((sz) => (sizeMap[sz] || 0) > 0) ||
      Object.keys(sizeMap)[0] ||
      '';
    const draft = {
      items: [
        {
          sku: product.sku,
          color: defaultColor,
          size: readySize,
          qty: 1,
        },
      ],
      customerName: currentUser?.fullName || '',
      customerPhone: '',
      shippingAddress: '',
      paymentMethod: 'COD',
    };
    const msgText = `Siap Kak! Aku sudah siapkan kartu checkout untuk **${product.name} (${product.sku})**. Silakan cek warna, ukuran, dan lengkapi alamat pengiriman di bawah lalu klik **Konfirmasi & Buat Pesanan** ya! ✨\n[TALAKA_CHECKOUT]${JSON.stringify(draft)}[/TALAKA_CHECKOUT]`;
    setMessages((prev) => [...prev, { role: 'assistant', content: msgText }]);
  }

  function handleQuickCheckoutAllFromCards(productList) {
    if (!Array.isArray(productList) || productList.length === 0) return;
    const items = productList.map((product) => {
      const defaultColor =
        product.colors?.find((c) => {
          const sm = product.sizes?.[c] || {};
          return Object.values(sm).some((v) => Number(v) > 0);
        }) ||
        product.colors?.[0] ||
        '';
      const sizeMap = product.sizes?.[defaultColor] || {};
      const readySize =
        Object.keys(sizeMap).find((sz) => (sizeMap[sz] || 0) > 0) ||
        Object.keys(sizeMap)[0] ||
        '';
      return {
        sku: product.sku,
        color: defaultColor,
        size: readySize,
        qty: 1,
      };
    });
    const draft = {
      items,
      customerName: currentUser?.fullName || '',
      customerPhone: '',
      shippingAddress: '',
      paymentMethod: 'COD',
    };
    const msgText = `Siap Kak! Semua **${items.length} produk** sudah langsung masuk ke 1 kartu checkout di bawah ini. Silakan atur warna, ukuran, jumlah (atau hapus item yang tidak jadi), lalu lengkapi alamat pengiriman dan klik **Checkout Semua** ya! ✨\n[TALAKA_CHECKOUT]${JSON.stringify(draft)}[/TALAKA_CHECKOUT]`;
    setMessages((prev) => [...prev, { role: 'assistant', content: msgText }]);
  }

  // Sinkronisasi awal produk & stok live dari Supabase (jika .env sudah diisi)
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let active = true;
    fetchLiveProducts().then((dbProducts) => {
      if (!active) return;
      if (dbProducts && dbProducts.length > 0) {
        setProducts(dbProducts);
        setIsDbConnected(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Scroll hanya di dalam kotak chat (tidak menarik scroll halaman luar)
  useEffect(() => {
    if (messages.length > 0 && chatContainerRef.current) {
      const box = chatContainerRef.current;
      box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
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

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }
      if (activeAudioUrlRef.current) {
        URL.revokeObjectURL(activeAudioUrlRef.current);
        activeAudioUrlRef.current = null;
      }
    };
  }, []);

  function stopAiSpeech() {
    speechSessionRef.current += 1;
    if (activeAudioRef.current) {
      if (typeof activeAudioRef.current.cancel === 'function') {
        activeAudioRef.current.cancel();
      } else if (typeof activeAudioRef.current.pause === 'function') {
        activeAudioRef.current.pause();
      }
      activeAudioRef.current = null;
    }
    if (activeAudioUrlRef.current) {
      URL.revokeObjectURL(activeAudioUrlRef.current);
      activeAudioUrlRef.current = null;
    }
    stopBrowserIndonesianSpeech();
    setSpeakingMessageIdx(null);
    setIsSynthesizingSpeech(false);
  }

  async function playAiSpeech(text, messageIdx) {
    if (speakingMessageIdx === messageIdx) {
      stopAiSpeech();
      return;
    }

    stopAiSpeech();
    const sessionToken = speechSessionRef.current;
    setSpeakingMessageIdx(messageIdx);
    setIsSynthesizingSpeech(true);

    try {
      const controller = await speakIndonesianAuto(text, {
        onReady: () => {
          if (speechSessionRef.current === sessionToken) {
            setIsSynthesizingSpeech(false);
          }
        },
        onEnd: () => {
          if (speechSessionRef.current === sessionToken) {
            stopAiSpeech();
          }
        },
        onError: () => {
          if (speechSessionRef.current === sessionToken) {
            stopAiSpeech();
          }
        },
      });

      if (speechSessionRef.current !== sessionToken) {
        controller.cancel();
        return;
      }

      activeAudioRef.current = controller;
    } catch (err) {
      if (speechSessionRef.current === sessionToken) {
        stopAiSpeech();
      }
      if (err?.name !== 'NotAllowedError') {
        setError(err.message || 'Gagal memutar suara balasan.');
      }
    }
  }

  async function handleToggleRecording() {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      return;
    }

    if (!currentUser && guestChatCount >= GUEST_CHAT_LIMIT) {
      setShowLoginLimitModal(true);
      return;
    }

    if (!hasDeepgramKey) {
      setError(
        'API key Deepgram belum diisi. Tambahkan VITE_DEEPGRAM_API_KEY di file .env.'
      );
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Browser ini tidak mendukung perekaman mikrofon.');
      return;
    }

    stopAiSpeech();
    setError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferredMime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : '';
      const recorder = preferredMime
        ? new MediaRecorder(stream, { mimeType: preferredMime })
        : new MediaRecorder(stream);

      audioChunksRef.current = [];
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) {
          audioChunksRef.current.push(ev.data);
        }
      };

      recorder.onstop = async () => {
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
        setRecordingSeconds(0);

        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });

        if (audioBlob.size === 0) return;

        setIsTranscribing(true);
        try {
          const transcript = await transcribeAudioWithDeepgram(audioBlob);
          setIsTranscribing(false);
          sendQuestion(transcript, undefined, { fromVoice: true });
        } catch (err) {
          setIsTranscribing(false);
          setError(err.message || 'Gagal menerjemahkan suara lewat Deepgram.');
        }
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      setError(
        'Akses mikrofon ditolak atau tidak tersedia. Izinkan mikrofon di browser untuk fitur voice.'
      );
    }
  }

  function handleResetProducts() {
    const fresh = cloneInitialProducts();
    setProducts(fresh);
    resetProductsInDb(fresh);
  }

  function handleUpdateProductStock(sku, color, size, delta) {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.sku !== sku) return prod;
        const currentQty = prod.sizes?.[color]?.[size] ?? 0;
        const nextQty = Math.max(0, currentQty + delta);
        const nextSizes = {
          ...prod.sizes,
          [color]: {
            ...prod.sizes[color],
            [size]: nextQty,
          },
        };
        updateProductSizesInDb(sku, nextSizes);
        return {
          ...prod,
          sizes: nextSizes,
        };
      })
    );
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

  async function handleSelectPdfFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    setShowFashionMenu(false);
    if (!file) return;

    setIsReadingPdf(true);
    setError('');
    try {
      const parsed = await extractTextFromPdfFile(file);
      setAttachedPdf(parsed);
      chatInputRef.current?.focus();
    } catch (err) {
      setError(err.message || 'Gagal membaca file PDF.');
    } finally {
      setIsReadingPdf(false);
    }
  }

  async function handleExportLookbook() {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    setError('');
    try {
      await exportLookbookPdf({
        messages,
        products,
        customerName:
          currentUser?.fullName || currentUser?.username || 'Pelanggan Talaka',
        botName: displayBotName,
      });
    } catch (err) {
      setError(err.message || 'Gagal membuat file PDF Lookbook.');
    } finally {
      setIsExportingPdf(false);
    }
  }

  async function handleRunVirtualTryOn(e) {
    e.preventDefault();
    if (!currentUser && guestChatCount >= GUEST_CHAT_LIMIT) {
      setShowTryOnModal(false);
      setShowLoginLimitModal(true);
      return;
    }
    if (!tryOnBodyImage || !tryOnOutfitImage) {
      setError('Lengkapi foto tubuh dan foto baju terlebih dahulu.');
      return;
    }
    if (!currentUser) {
      setGuestChatCount((prev) => prev + 1);
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

  async function resolveLiveTrackingContext(rawText) {
    const text = String(rawText || '');
    const hasTrackingIntent =
      /\b(resi|paket|lacak|sampai mana|sampe mana|pengiriman|kurir|pesanan|order|dikirim|status|tlk-)\b/i.test(
        text
      );
    const codeMatch = /\b(TLK-\d{3,6})\b/i.exec(text);
    const resiMatch =
      /\b((?:JNE|JNT|JP|SICEPAT|ANTERAJA|SPX|ID|POS|NINJA)[A-Z0-9-]{4,})\b/i.exec(
        text
      ) || /\b([A-Z]{2,5}\d{5,14})\b/i.exec(text);

    const lookupToken = codeMatch?.[1] || resiMatch?.[1] || '';

    if (lookupToken) {
      const found = await lookupOrderByCodeOrTracking(lookupToken);
      if (found) {
        const latestLog = found.trackingLogs?.[0];
        const summary = [
          `[DATA TRACKING & PESANAN LIVE (COCOK DENGAN KODE/RESI ${lookupToken.toUpperCase()})]`,
          `- Kode Pesanan: ${found.orderCode}`,
          `- Penerima: ${found.customerName} (${found.shippingAddress})`,
          `- Status Saat Ini: ${found.status.toUpperCase()}`,
          `- Kurir: ${found.courier || 'Belum ditugaskan'} | Nomor Resi: ${found.trackingNumber || 'Belum diterbitkan (masih diproses gudang)'}`,
          `- Lokasi Terakhir: ${found.lastLocation || 'Gudang Talaka Bogor'}`,
          latestLog ? `- Update Terakhir: ${latestLog.note}` : '',
        ]
          .filter(Boolean)
          .join('\n');
        return { contextString: summary, matchedOrder: found };
      }
      return {
        contextString: `[DATA TRACKING & PESANAN LIVE: Kode/Resi "${lookupToken.toUpperCase()}" TIDAK DITEMUKAN di sistem Talaka. Minta pelanggan periksa kembali nomor resi atau kode pesanannya dengan sopan.]`,
        matchedOrder: null,
      };
    }

    if (hasTrackingIntent && userOrders.length > 0) {
      const latest = userOrders[0];
      const latestLog = latest.trackingLogs?.[0];
      const summary = [
        `[DATA TRACKING & PESANAN LIVE MILIK AKUN PELANGGAN (${userOrders.length} pesanan ditemukan, terbaru: ${latest.orderCode})]`,
        `- Kode Pesanan: ${latest.orderCode}`,
        `- Status Saat Ini: ${latest.status.toUpperCase()}`,
        `- Kurir: ${latest.courier || 'Belum ditugaskan'} | Nomor Resi: ${latest.trackingNumber || 'Belum diterbitkan (masih diproses gudang)'}`,
        `- Lokasi Terakhir: ${latest.lastLocation || 'Gudang Talaka Bogor'}`,
        latestLog ? `- Update Terakhir: ${latestLog.note}` : '',
        `(Jika pelanggan menanyakan pesanan lain, minta konfirmasi nomor resi atau kode pesanannya.)`,
      ]
        .filter(Boolean)
        .join('\n');
      return { contextString: summary, matchedOrder: latest };
    }

    return { contextString: '', matchedOrder: null };
  }

  async function sendQuestion(questionText, overridePageContext, options = {}) {
    const rawText = (questionText ?? input).trim();
    const currentImage = questionText === undefined ? attachedImage : null;
    const currentPdf = questionText === undefined ? attachedPdf : null;
    if ((!rawText && !currentImage && !currentPdf) || isSending) return;

    if (!currentUser && guestChatCount >= GUEST_CHAT_LIMIT) {
      setShowLoginLimitModal(true);
      return;
    }

    if (!hasApiKey) {
      setError('API key belum diisi di file .env.');
      return;
    }

    if (!currentUser) {
      setGuestChatCount((prev) => prev + 1);
    }

    const displayContent =
      rawText ||
      (currentPdf
        ? `Tolong analisis file PDF "${currentPdf.fileName}" ini (acara / jadwal / setlist) dan kasih rekomendasi outfit Talaka per hari atau sesinya ya!`
        : 'Cari baju atau sepatu Talaka yang paling mirip dengan foto ini dong Kak!');

    const extraParts = [];
    if (maxPriceFilter) {
      extraParts.push(
        `[FILTER HARGA AKTIF: Maksimal Rp${maxPriceFilter.toLocaleString('id-ID')}. Wajib prioritaskan/rekomendasikan produk Talaka dengan harga <= Rp${maxPriceFilter.toLocaleString('id-ID')}.]`
      );
    }
    if (currentImage) {
      extraParts.push(
        `[Pelanggan mengunggah foto pakaian/outfit ("${currentImage.name}") untuk Search Baju by Foto.]`
      );
    }
    if (currentPdf) {
      extraParts.push(
        `[DOKUMEN PDF TERLAMPIR: "${currentPdf.fileName}" (${currentPdf.pageCount} halaman)]\n${currentPdf.text}\n[INSTRUKSI ANALISIS PDF: Baca acara, dresscode, jadwal per hari (Hari 1, Hari 2, dst.), atau setlist dari dokumen di atas. Susun rekomendasi outfit lengkap per hari/acara memakai produk nyata dari katalog Talaka beserta SKU-nya agar foto produk otomatis tampil di kartu & Lookbook PDF.]`
      );
    }

    const { contextString: trackingContext, matchedOrder } =
      await resolveLiveTrackingContext(displayContent);
    if (trackingContext) {
      extraParts.push(trackingContext);
    }

    const apiContent =
      extraParts.length > 0
        ? `${displayContent}\n\n${extraParts.join('\n\n')}`
        : displayContent;

    const userMessage = {
      role: 'user',
      content: displayContent,
      apiContent,
      fromVoice: Boolean(options.fromVoice),
      image: currentImage,
      pdfAttachment: currentPdf
        ? {
            fileName: currentPdf.fileName,
            pageCount: currentPdf.pageCount,
            preview: currentPdf.preview,
          }
        : null,
    };

    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    if (questionText === undefined) {
      setInput('');
      setAttachedImage(null);
      setAttachedPdf(null);
    }
    setShowFashionMenu(false);
    setError('');
    setIsSending(true);

    const effectivePageContext = overridePageContext ?? activePageContext;
    const activeUsername = currentUser?.username || 'guest';
    saveChatMessageToDb({
      sessionId,
      username: activeUsername,
      role: 'user',
      content: displayContent,
      pageContext: effectivePageContext,
    });

    try {
      let reply = '';

      // Jika ada 1 foto baju diupload dan Gemini aktif -> gunakan Search Baju by Foto (Gemini Vision)
      if (currentImage?.dataUrl && hasGeminiApiKey()) {
        reply = await searchCatalogByPhoto({
          imageDataUrl: currentImage.dataUrl,
          products,
          maxBudget: maxPriceFilter,
          userNote: rawText,
        });
      } else {
        const apiHistory = nextHistory.map((m) => ({
          role: m.role,
          content: m.apiContent || m.content,
        }));
        reply = await askDeepSeek({
          model,
          botName,
          honestyLevel,
          showExactStock,
          activePageContext: effectivePageContext,
          contextText,
          history: apiHistory,
        });
      }

      const assistantIdx = nextHistory.length;
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: reply,
          trackingOrder: matchedOrder || null,
        },
      ]);
      saveChatMessageToDb({
        sessionId,
        username: activeUsername,
        role: 'assistant',
        content: reply,
        pageContext: effectivePageContext,
      });

      if (voiceFeedbackEnabled && hasDeepgramKey) {
        playAiSpeech(reply, assistantIdx);
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menghubungi API.');
    } finally {
      setIsSending(false);
    }
  }

  async function handleVoiceCallTurn(transcriptText) {
    const cleanText = (transcriptText || '').trim();
    if (!cleanText) return '';

    if (!currentUser && guestChatCount >= GUEST_CHAT_LIMIT) {
      setShowVoiceCallModal(false);
      setShowLoginLimitModal(true);
      return 'Batas 3 kali percobaan tamu sudah tercapai ya Kak. Silakan login dulu supaya bisa lanjut mengobrol lebih luas dengan Kak Tala.';
    }
    if (!currentUser) {
      setGuestChatCount((prev) => prev + 1);
    }

    const { contextString: trackingContext, matchedOrder } =
      await resolveLiveTrackingContext(cleanText);
    const budgetContext = maxPriceFilter
      ? `\n[FILTER HARGA AKTIF: Maksimal Rp${maxPriceFilter.toLocaleString('id-ID')}.]`
      : '';

    const userMessage = {
      role: 'user',
      content: cleanText,
      apiContent: `${cleanText}${budgetContext}${trackingContext ? `\n\n${trackingContext}` : ''}\n\n[KONTEKS PANGGILAN SUARA: Jawab ringkas, natural, imersif, dan ramah layaknya percakapan telepon langsung maksimal 2-4 kalimat, tanpa format tabel/heading.]`,
      fromVoice: true,
    };

    const baseHistory = messagesRef.current;
    const nextHistory = [...baseHistory, userMessage];
    messagesRef.current = nextHistory;
    setMessages(nextHistory);

    const activeUsername = currentUser?.username || 'guest';
    saveChatMessageToDb({
      sessionId,
      username: activeUsername,
      role: 'user',
      content: cleanText,
      pageContext: activePageContext,
    });

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

    const withReply = [
      ...messagesRef.current,
      { role: 'assistant', content: reply, trackingOrder: matchedOrder || null },
    ];
    messagesRef.current = withReply;
    setMessages(withReply);

    saveChatMessageToDb({
      sessionId,
      username: activeUsername,
      role: 'assistant',
      content: reply,
      pageContext: activePageContext,
    });

    return reply;
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
    stopAiSpeech();
    setMessages([]);
    setError('');
    setHandoffSent(false);
    setSessionId(`sess-${Date.now()}`);
  }

  function handleManualHandoff() {
    setHandoffSent(true);
    const recentSummary =
      messages
        .slice(-4)
        .map((m) => `${m.role}: ${m.content.slice(0, 120)}`)
        .join(' | ') || 'Pelanggan meminta terhubung langsung dengan admin.';
    createHandoffTicketInDb({
      sessionId,
      username: currentUser?.username || 'guest',
      summary: `[${activePageContext}] ${recentSummary}`,
    });
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
  const unreadNotifCount = userNotifications.filter((n) => !n.isRead).length;

  const normalizedPath = pathname.replace(/\/+$/, '');
  if (normalizedPath === '/admin') {
    return (
      <AdminDashboardPage
        currentUser={currentUser}
        products={products}
        onUpdateStock={handleUpdateProductStock}
        onResetProducts={handleResetProducts}
        onGoHome={() => navigateTo('/')}
        onOpenLogin={() => navigateTo('/login')}
        onOrdersChanged={loadCustomerOrdersAndNotifs}
      />
    );
  }
  if (normalizedPath === '/presentasi') {
    return <PresentationPage onGoHome={() => navigateTo('/')} />;
  }
  if (normalizedPath === '/promo') {
    return (
      <PromoVideoPage
        onGoHome={() => navigateTo('/')}
        onOpenPresentation={() => navigateTo('/presentasi')}
      />
    );
  }
  if (normalizedPath === '/login') {
    return (
      <LoginPage
        onClose={() => navigateTo('/')}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          navigateTo('/');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* 1. Landing Page Section */}
      <LandingPage
        onScrollToChat={scrollToChat}
        onSelectSamplePrompt={handleSelectPromptFromLanding}
        onOpenPresentation={() => navigateTo('/presentasi')}
        onOpenAdmin={() => navigateTo('/admin')}
        onOpenMyOrders={handleOpenOrdersDrawer}
        unreadNotifCount={unreadNotifCount}
        currentUser={currentUser}
        onOpenLogin={() => navigateTo('/login')}
        onLogout={handleLogout}
        products={products}
        showExactStock={showExactStock}
        onUpdateStock={handleUpdateProductStock}
        onResetProducts={handleResetProducts}
        onAskProduct={handleAskProductFromCatalog}
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
        <div className="mx-auto max-w-5xl px-4 sm:px-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-4 sm:p-5 border border-slate-200/90 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="h-11 w-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-md shadow-slate-900/5 p-1.5">
                  <img src={talakaLogo} alt="Talaka AI Logo" className="w-full h-full object-contain" />
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
                    {isDbConnected ? 'SUPABASE_LIVE' : 'LOCAL_MODE'}
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
                  {products.map((p) => (
                    <option key={p.sku} value={`${p.name} (${p.sku})`}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>

              {/* Lacak Pesanan & Notif AI */}
              <button
                type="button"
                onClick={handleOpenOrdersDrawer}
                className="relative rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 hover:border-slate-900 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Pantau progres paket & notifikasi AI"
              >
                <Package className="w-3.5 h-3.5 text-[#9E7B66]" />
                <span>Pesanan ({userOrders.length})</span>
                {unreadNotifCount > 0 && (
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>

              {currentUser?.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => navigateTo('/admin')}
                  className="rounded-2xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-black transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  title="Buka Dashboard Admin"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#D6B7A5]" />
                  <span>Admin</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleManualHandoff}
                disabled={isSending}
                className="rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition flex items-center gap-1.5 disabled:opacity-40 cursor-pointer shadow-2xs"
                title="Hubungi Admin Manusia via WhatsApp"
              >
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>Admin WA</span>
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

        {/* Main Centered Chat Studio */}
        <main className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* Chat Sandbox Playground */}
          <section className="bg-white rounded-3xl border border-slate-200/90 shadow-md flex flex-col h-[740px] max-h-[85vh] overflow-hidden relative">
            {/* Header Ruang Konsultasi */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 px-5 py-3.5 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-xs p-1.5">
                    <img src={talakaLogo} alt="Kak Tala Avatar" className="w-full h-full object-contain" />
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
                {hasDeepgramKey && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!currentUser && guestChatCount >= GUEST_CHAT_LIMIT) {
                        setShowLoginLimitModal(true);
                        return;
                      }
                      stopAiSpeech();
                      playCallSoundEffect('connect');
                      setShowVoiceCallModal(true);
                    }}
                    disabled={isSending}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition flex items-center gap-1.5 disabled:opacity-40 cursor-pointer shadow-2xs"
                    title="Hubungi Admin melalui Telepon AI"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
                    <span>Hubungi Admin</span>
                  </button>
                )}
                {hasDeepgramKey && (
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceFeedbackEnabled((prev) => {
                        const next = !prev;
                        if (!next) stopAiSpeech();
                        return next;
                      });
                    }}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                      voiceFeedbackEnabled
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                    title={
                      voiceFeedbackEnabled
                        ? 'Balasan suara otomatis Kak Tala aktif (klik untuk matikan)'
                        : 'Balasan suara otomatis nonaktif (klik untuk aktifkan)'
                    }
                  >
                    {voiceFeedbackEnabled ? (
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span className="hidden md:inline">
                      {voiceFeedbackEnabled ? 'Suara ON' : 'Suara OFF'}
                    </span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleExportLookbook}
                  disabled={
                    isExportingPdf ||
                    !messages.some((m) => m.role === 'assistant')
                  }
                  className="rounded-xl border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black transition flex items-center gap-1.5 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                  title="Export rekomendasi outfit & foto produk ke Lookbook PDF"
                >
                  {isExportingPdf ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#9E7B66]" />
                  ) : (
                    <FileDown className="w-3.5 h-3.5 text-[#9E7B66]" />
                  )}
                  <span className="hidden sm:inline">
                    {isExportingPdf ? 'Membuat PDF...' : 'Export PDF'}
                  </span>
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

            {/* Banner Kuota Percobaan Tamu (Jika Belum Login) */}
            {!currentUser && (
              <div
                className={`border-b px-5 py-2 text-xs flex flex-wrap items-center justify-between gap-2 ${
                  guestChatCount >= GUEST_CHAT_LIMIT
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-slate-50/90 border-slate-200/80 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Lock
                    className={`w-3.5 h-3.5 shrink-0 ${
                      guestChatCount >= GUEST_CHAT_LIMIT
                        ? 'text-amber-600'
                        : 'text-[#9E7B66]'
                    }`}
                  />
                  <span>
                    {guestChatCount >= GUEST_CHAT_LIMIT ? (
                      <>
                        <strong>Batas {GUEST_CHAT_LIMIT}x percobaan tamu tercapai.</strong>{' '}
                        Login untuk menggunakan Kak Tala lebih luas tanpa batas.
                      </>
                    ) : (
                      <>
                        Mode Tamu · Sisa{' '}
                        <strong className="text-slate-900">
                          {Math.max(0, GUEST_CHAT_LIMIT - guestChatCount)} dari{' '}
                          {GUEST_CHAT_LIMIT}
                        </strong>{' '}
                        percobaan chat gratis.
                      </>
                    )}
                  </span>
                </div>
              </div>
            )}

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
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 sm:pb-24 space-y-5 bg-slate-50/40"
            >
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
                      <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-xs p-1.5">
                        <img src={talakaLogo} alt="Kak Tala" className="w-full h-full object-contain" />
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

                  {/* 4 Interactive Quick Prompt Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        sendQuestion(
                          'Halo Kak Tala, ada promo atau diskon menarik apa saja yang sedang berlangsung hari ini?'
                        )
                      }
                      disabled={isSending}
                      className="group text-left rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-slate-900 hover:shadow-xs transition cursor-pointer flex flex-col gap-1.5"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900 group-hover:text-blue-600">
                        <Tag className="w-3.5 h-3.5 text-rose-500" />
                        <span>Promo</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        “Ada promo atau diskon menarik apa hari ini?”
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        sendQuestion(
                          'Kak Tala, apa saja rekomendasi produk yang lagi tren fashion dan paling hits bulan ini?'
                        )
                      }
                      disabled={isSending}
                      className="group text-left rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-slate-900 hover:shadow-xs transition cursor-pointer flex flex-col gap-1.5"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900 group-hover:text-blue-600">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Rekomendasi Bulan Ini</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        “Produk apa yang lagi tren fashion bulan ini?”
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        sendQuestion(
                          'Kak Tala, boleh minta saran inspirasi padu padan OOTD yang stylish dan kekinian?'
                        )
                      }
                      disabled={isSending}
                      className="group text-left rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-slate-900 hover:shadow-xs transition cursor-pointer flex flex-col gap-1.5"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900 group-hover:text-blue-600">
                        <Shirt className="w-3.5 h-3.5 text-[#9E7B66]" />
                        <span>Saran OOTD</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        “Ide padu padan OOTD yang stylish dan kekinian”
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        sendQuestion(
                          'Kak Tala, aku mau cek ukuran. Kalau TB 160 cm dan BB 52 kg, ukuran baju yang paling pas apa ya?'
                        )
                      }
                      disabled={isSending}
                      className="group text-left rounded-2xl border border-slate-200 bg-white p-3.5 hover:border-slate-900 hover:shadow-xs transition cursor-pointer flex flex-col gap-1.5"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900 group-hover:text-blue-600">
                        <Ruler className="w-3.5 h-3.5 text-blue-600" />
                        <span>Cek Ukuran BB &amp; TB</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        “TB 160cm BB 52kg ukuran apa yang paling pas?”
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* Message List */}
              {messages.map((msg, idx) => {
                const isUser = msg.role === 'user';
                const checkoutDraft = !isUser
                  ? parseCheckoutDraftFromText(msg.content)
                  : null;
                const rawMentioned =
                  !isUser && !checkoutDraft
                    ? findMentionedProducts(msg.content, products)
                    : [];
                const mentionedProducts = maxPriceFilter
                  ? rawMentioned.filter(
                      (p) => Number(p.price) <= maxPriceFilter
                    ).length > 0
                    ? rawMentioned.filter(
                        (p) => Number(p.price) <= maxPriceFilter
                      )
                    : rawMentioned
                  : rawMentioned;

                return (
                  <div key={idx} className="space-y-3">
                    <div
                      className={`flex gap-3 items-end ${
                        isUser ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {!isUser && (
                        <div className="w-8 h-8 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 mb-1 shadow-2xs p-1">
                          <img src={talakaLogo} alt="Kak Tala" className="w-full h-full object-contain" />
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

                        {/* Attached PDF Badge */}
                        {msg.pdfAttachment && (
                          <div className="mb-2.5 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 flex items-center gap-2.5 text-xs">
                            <FileText className="w-4 h-4 text-[#D6B7A5] shrink-0" />
                            <div className="min-w-0">
                              <div className="font-bold truncate">
                                {msg.pdfAttachment.fileName}
                              </div>
                              <div className="text-[10px] opacity-80 font-mono">
                                PDF · {msg.pdfAttachment.pageCount} halaman dianalisis
                              </div>
                            </div>
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

                        {/* Voice Input Indicator */}
                        {isUser && msg.fromVoice && (
                          <div className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-mono font-semibold text-white/90">
                            <Mic className="w-2.5 h-2.5 text-[#D6B7A5]" />
                            <span>Pesan Suara</span>
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
                          <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-between gap-3 text-[11px] text-slate-400 font-mono">
                            <span className="text-[10px]">
                              {displayBotName} · TALAKA_AI
                            </span>
                            <div className="flex items-center gap-3">
                              {hasDeepgramKey && (
                                <button
                                  type="button"
                                  onClick={() => playAiSpeech(msg.content, idx)}
                                  className={`flex items-center gap-1 font-semibold transition cursor-pointer ${
                                    speakingMessageIdx === idx
                                      ? 'text-rose-600 hover:text-rose-700'
                                      : 'text-slate-500 hover:text-slate-900'
                                  }`}
                                  title={
                                    speakingMessageIdx === idx
                                      ? 'Hentikan suara'
                                      : 'Dengarkan balasan ini'
                                  }
                                >
                                  {speakingMessageIdx === idx &&
                                  isSynthesizingSpeech ? (
                                    <>
                                      <RefreshCw className="w-3 h-3 animate-spin" />
                                      <span>MEMUAT</span>
                                    </>
                                  ) : speakingMessageIdx === idx ? (
                                    <>
                                      <Square className="w-2.5 h-2.5 fill-current" />
                                      <span>STOP</span>
                                    </>
                                  ) : (
                                    <>
                                      <Volume2 className="w-3 h-3" />
                                      <span>DENGAR</span>
                                    </>
                                  )}
                                </button>
                              )}
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
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Interactive Product Cards inside Chat Stream */}
                    {mentionedProducts.length > 0 && (
                      <div className="pl-11 space-y-2.5">
                        {mentionedProducts.length > 1 && (
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[11px] font-mono font-bold text-slate-500">
                              MENAMPILKAN SEMUA {mentionedProducts.length} PRODUK
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleQuickCheckoutAllFromCards(mentionedProducts)
                              }
                              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-black transition cursor-pointer shadow-xs"
                            >
                              <ShoppingBag className="w-3.5 h-3.5 text-[#D6B7A5]" />
                              <span>
                                Checkout Semua ({mentionedProducts.length} Produk)
                              </span>
                            </button>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-3">
                        {mentionedProducts.map((product) => (
                          <div
                            key={product.sku}
                            className="w-68 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs space-y-2 hover:border-slate-400 transition"
                          >
                            {product.image && (
                              <div className="h-28 w-full rounded-xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center overflow-hidden">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-full w-full object-contain"
                                />
                              </div>
                            )}
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
                                  onClick={() =>
                                    handleQuickCheckoutFromCard(product)
                                  }
                                  className="rounded-xl border border-[#9E7B66]/40 bg-[#9E7B66]/10 px-2.5 py-1 text-[10px] font-bold text-[#9E7B66] hover:bg-[#9E7B66] hover:text-white transition cursor-pointer"
                                >
                                  Checkout
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextCtx = `${product.name} (${product.sku})`;
                                    setActivePageContext(nextCtx);
                                    sendQuestion(
                                      product.category === 'Sepatu'
                                        ? `Untuk ${product.name} (${product.sku}), kalau panjang kaki 25.5 cm ukuran EU berapa yang pas ya?`
                                        : `Untuk ${product.name} (${product.sku}), kalau TB 160 BB 50 ukuran apa yang pas ya?`,
                                      nextCtx
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
                      </div>
                    )}

                    {/* Interactive Checkout Card inside Chat Stream */}
                    {checkoutDraft && (
                      <ChatCheckoutCard
                        draft={checkoutDraft}
                        products={products}
                        currentUser={currentUser}
                        onConfirmOrder={handleConfirmChatCheckout}
                        onOpenMyOrders={handleOpenOrdersDrawer}
                      />
                    )}

                    {/* Live Tracking Status Card inside Chat Stream */}
                    {!isUser && msg.trackingOrder && (
                      <div className="ml-11 max-w-md rounded-2xl border border-blue-200 bg-white p-3.5 shadow-xs space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-mono font-bold text-slate-900">
                              {msg.trackingOrder.orderCode}
                            </span>
                          </div>
                          <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase text-blue-700">
                            {msg.trackingOrder.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                          {['diproses', 'dikemas', 'dikirim', 'selesai'].map(
                            (step, sIdx) => {
                              const currentIdx = [
                                'diproses',
                                'dikemas',
                                'dikirim',
                                'selesai',
                              ].indexOf(msg.trackingOrder.status);
                              const active = sIdx <= currentIdx;
                              return (
                                <div key={step} className="space-y-1">
                                  <div
                                    className={`h-1.5 rounded-full ${
                                      active ? 'bg-blue-600' : 'bg-slate-200'
                                    }`}
                                  />
                                  <div
                                    className={`text-[9px] font-mono uppercase truncate ${
                                      active
                                        ? 'text-blue-700 font-bold'
                                        : 'text-slate-400'
                                    }`}
                                  >
                                    {step}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                        <div className="text-[11px] text-slate-600 space-y-0.5">
                          <div>
                            <strong className="text-slate-800">Kurir / Resi:</strong>{' '}
                            {msg.trackingOrder.courier || 'Menunggu kurir'} ·{' '}
                            <span className="font-mono">
                              {msg.trackingOrder.trackingNumber || '-'}
                            </span>
                          </div>
                          <div>
                            <strong className="text-slate-800">Posisi Terakhir:</strong>{' '}
                            {msg.trackingOrder.lastLocation || 'Gudang Talaka Bogor'}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleOpenOrdersDrawer}
                          className="w-full rounded-xl bg-slate-900 text-white py-1.5 text-[11px] font-bold hover:bg-black transition cursor-pointer"
                        >
                          Lihat Timeline Lengkap di Pesanan ↗
                        </button>
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
                  <div className="w-8 h-8 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs p-1">
                    <img src={talakaLogo} alt="Kak Tala" className="w-full h-full object-contain" />
                  </div>
                  <div className="rounded-3xl rounded-bl-xs border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 shadow-xs flex items-center gap-2.5">
                    <span className="inline-flex gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-slate-900 animate-bounce" />
                      <span className="h-2 w-2 rounded-full bg-slate-900 animate-bounce [animation-delay:150ms]" />
                      <span className="h-2 w-2 rounded-full bg-slate-900 animate-bounce [animation-delay:300ms]" />
                    </span>
                    <span className="font-mono text-slate-800 text-[11px]">
                      {isSlowLoading
                        ? 'Sebentar, akan segera kami jawab...'
                        : `${displayBotName} sedang menganalisis proporsi pakaian...`}
                    </span>
                  </div>
                </div>
              )}

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

                      {/* 2. Upload PDF Acara / Undangan / Setlist */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowFashionMenu(false);
                          pdfInputRef.current?.click();
                        }}
                        className="w-full flex items-center gap-2.5 rounded-2xl border border-[#9E7B66]/40 bg-[#9E7B66]/5 px-3.5 py-2 text-left text-xs font-semibold text-slate-900 hover:bg-[#9E7B66]/10 transition cursor-pointer"
                      >
                        <FileText className="h-4 w-4 text-[#9E7B66] shrink-0" />
                        <div>
                          <div className="font-bold">
                            Upload PDF Acara / Setlist
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Undangan kerja, itinerary harian, dll.
                          </div>
                        </div>
                      </button>

                      {/* 3. Search Baju by Foto (AI Visual Search) */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowFashionMenu(false);
                          fileInputRef.current?.click();
                        }}
                        className="w-full flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-left text-xs font-semibold text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                      >
                        <ImageIcon className="h-4 w-4 text-slate-600 shrink-0" />
                        <div>
                          <div className="font-bold">Cari Baju by Foto</div>
                          <div className="text-[10px] text-slate-500">
                            Upload foto → cari produk mirip di Talaka
                          </div>
                        </div>
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

              {(attachedImage ||
                attachedPdf ||
                isReadingPdf ||
                isRecording ||
                isTranscribing ||
                speakingMessageIdx !== null) && (
                <div className="mb-2.5 flex flex-wrap items-center gap-2">
                  {isRecording && (
                    <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-ping" />
                      <span className="font-mono">
                        Merekam {String(Math.floor(recordingSeconds / 60)).padStart(1, '0')}:
                        {String(recordingSeconds % 60).padStart(2, '0')}
                      </span>
                      <span className="text-[11px] font-normal text-rose-600 hidden sm:inline">
                        · klik Stop untuk kirim ke {displayBotName}
                      </span>
                    </div>
                  )}

                  {isTranscribing && (
                    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#9E7B66]" />
                      <span>Deepgram mengubah suara ke teks...</span>
                    </div>
                  )}

                  {speakingMessageIdx !== null && (
                    <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                      {isSynthesizingSpeech ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                      )}
                      <span>
                        {isSynthesizingSpeech
                          ? 'Menyiapkan suara Kak Tala...'
                          : `${displayBotName} sedang berbicara...`}
                      </span>
                      <button
                        type="button"
                        onClick={stopAiSpeech}
                        className="ml-1 rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-emerald-900 cursor-pointer transition"
                      >
                        Stop
                      </button>
                    </div>
                  )}

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

                  {isReadingPdf && (
                    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#9E7B66]" />
                      <span>Mengekstrak teks PDF...</span>
                    </div>
                  )}

                  {attachedPdf && (
                    <div className="flex items-center gap-2.5 rounded-2xl border border-[#9E7B66]/40 bg-[#9E7B66]/5 px-3 py-1.5 w-fit">
                      <FileText className="w-4 h-4 text-[#9E7B66] shrink-0" />
                      <div className="text-xs">
                        <div className="font-bold text-slate-900 max-w-[200px] truncate">
                          {attachedPdf.fileName}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {attachedPdf.pageCount} hal · siap dianalisis AI
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachedPdf(null)}
                        className="rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold text-slate-500 hover:bg-slate-200 hover:text-slate-900 cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Hidden file inputs for image & PDF attachment */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleSelectOutfitFile}
                className="hidden"
              />
              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleSelectPdfFile}
                className="hidden"
              />

              <div className="flex items-end gap-2.5">
                <div className="relative flex-1 flex items-end rounded-2xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-slate-900 transition">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSending}
                    className="ml-2 mb-2 h-8 w-8 rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-slate-900 hover:text-slate-950 flex items-center justify-center shrink-0 transition cursor-pointer disabled:opacity-40"
                    title="Search Baju by Foto (upload foto baju/sepatu untuk cari yang mirip di Talaka)"
                    aria-label="Cari baju dengan foto"
                  >
                    <ImageIcon className="w-4 h-4 text-slate-700" />
                  </button>
                  <button
                    type="button"
                    onClick={() => pdfInputRef.current?.click()}
                    disabled={isReadingPdf || isSending}
                    className="ml-1 mb-2 h-8 w-8 rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-slate-900 hover:text-slate-950 flex items-center justify-center shrink-0 transition cursor-pointer disabled:opacity-40"
                    title="Upload PDF undangan acara, kerja, atau setlist outfit"
                    aria-label="Upload PDF"
                  >
                    <FileText className="w-4 h-4 text-[#9E7B66]" />
                  </button>
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
                    placeholder={`Tanya ${displayBotName} soal ukuran, gaya, atau upload PDF undangan/setlist...`}
                    className="w-full bg-transparent py-2.5 pr-4 pl-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleToggleRecording}
                  disabled={isSending || isTranscribing}
                  className={`shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center transition-all shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    isRecording
                      ? 'bg-rose-600 text-white hover:bg-rose-700 ring-4 ring-rose-200'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-900 hover:text-slate-950'
                  }`}
                  title={
                    isRecording
                      ? 'Hentikan rekaman & kirim suara'
                      : 'Bicara ke Kak Tala (Deepgram Voice)'
                  }
                  aria-label={isRecording ? 'Hentikan rekaman' : 'Rekam suara'}
                >
                  {isTranscribing ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-[#9E7B66]" />
                  ) : isRecording ? (
                    <Square className="w-4 h-4 fill-current text-white" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>

                <button
                  type="submit"
                  disabled={
                    isSending ||
                    isReadingPdf ||
                    isRecording ||
                    isTranscribing ||
                    (!input.trim() && !attachedImage && !attachedPdf)
                  }
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
      {/* Modal Telepon Suara Real-Time 2 Arah (Deepgram Nova-2 + Aura-2) */}
      <VoiceCallModal
        isOpen={showVoiceCallModal}
        onClose={() => setShowVoiceCallModal(false)}
        botName={displayBotName}
        onCallTurn={handleVoiceCallTurn}
      />

      {/* Drawer Samping: Lacak Pesanan & Notifikasi AI untuk Pembeli */}
      <CustomerOrdersDrawer
        isOpen={showOrdersDrawer}
        onClose={() => setShowOrdersDrawer(false)}
        orders={userOrders}
        notifications={userNotifications}
        isLoading={isLoadingUserOrders}
        onRefresh={loadCustomerOrdersAndNotifs}
        currentUser={currentUser}
        onOpenAdmin={() => navigateTo('/admin')}
      />

      {/* Alert Modal: Wajib Login Setelah 3x Percobaan Chat Tamu */}
      {showLoginLimitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <Lock className="w-7 h-7 text-amber-600" />
            </div>
            <div className="space-y-1.5">
              <span className="inline-block rounded-full bg-amber-100 px-3 py-0.5 text-[10px] font-mono font-bold text-amber-800">
                BATAS PERCOBAAN TAMU (3 / 3)
              </span>
              <h3 className="text-lg font-extrabold text-slate-950">
                Yuk Login untuk Akses Lebih Luas!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Kamu sudah memakai <strong>3 kali percobaan gratis</strong> bersama{' '}
                {displayBotName}. Silakan <strong>Masuk atau Daftar Akun</strong>{' '}
                terlebih dahulu jika ingin terus menggunakan konsultasi AI,
                Virtual Try-On, Lookbook PDF, dan fitur Telepon secara lebih luas
                tanpa batas.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowLoginLimitModal(false)}
                className="w-full sm:w-auto rounded-2xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
              >
                Nanti Dulu
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLoginLimitModal(false);
                  navigateTo('/login');
                }}
                className="w-full sm:w-auto rounded-2xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-black transition cursor-pointer shadow-sm"
              >
                Masuk / Daftar Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
