const DEEPGRAM_LISTEN_URL =
  'https://api.deepgram.com/v1/listen?model=nova-2&language=id&smart_format=true&punctuate=true';
const DEEPGRAM_SPEAK_URL =
  'https://api.deepgram.com/v2/speak?model=flux-dewi-id';

export function getDeepgramApiKey() {
  return (import.meta.env.VITE_DEEPGRAM_API_KEY || '').trim();
}

export function hasDeepgramApiKey() {
  return Boolean(getDeepgramApiKey());
}

function cleanTextForSpeech(raw) {
  return String(raw || '')
    .replace(/\[TALAKA_CHECKOUT\][\s\S]*?\[\/TALAKA_CHECKOUT\]/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/`([^`\n]+)`/g, '$1')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\[[^\]]+\]/g, '')
    .replace(/[^\p{L}\p{N}\s.,!?%:/-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 950);
}

/**
 * Speech-to-Text (STT): Ubah rekaman suara dari browser menjadi teks Bahasa Indonesia
 * menggunakan Deepgram Listen API (model nova-2, language=id).
 */
export async function transcribeAudioWithDeepgram(audioBlob) {
  const apiKey = getDeepgramApiKey();
  if (!apiKey) {
    throw new Error(
      'API key Deepgram belum diisi. Tambahkan VITE_DEEPGRAM_API_KEY di file .env.'
    );
  }
  if (!audioBlob || audioBlob.size === 0) {
    throw new Error('Rekaman suara kosong. Coba bicara lebih dekat ke mikrofon.');
  }

  const rawType = audioBlob.type || 'audio/webm';
  const contentType = rawType.split(';')[0].trim() || 'audio/webm';
  const response = await fetch(DEEPGRAM_LISTEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': contentType,
    },
    body: audioBlob,
  });

  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 401 || response.status === 403) {
      throw new Error('Token Deepgram tidak valid atau kedaluwarsa (401).');
    }
    if (response.status === 402) {
      throw new Error('Kuota / saldo Deepgram habis (402).');
    }
    throw new Error(`Deepgram STT gagal (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const transcript =
    data?.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim() || '';

  if (!transcript) {
    throw new Error(
      'Suara tidak terdeteksi atau kurang jelas. Coba rekam ulang ya.'
    );
  }

  return transcript;
}

/**
 * Text-to-Speech (TTS): Ubah balasan teks AI menjadi audio MP3 menggunakan Deepgram Speak API.
 * Mengembalikan Blob URL audio (audio/mpeg).
 */
export async function synthesizeSpeechWithDeepgram(text) {
  const apiKey = getDeepgramApiKey();
  if (!apiKey) {
    throw new Error(
      'API key Deepgram belum diisi. Tambahkan VITE_DEEPGRAM_API_KEY di file .env.'
    );
  }

  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) {
    throw new Error('Tidak ada teks yang bisa dibacakan.');
  }

  const response = await fetch(DEEPGRAM_SPEAK_URL, {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: cleaned }),
  });

  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 401 || response.status === 403) {
      throw new Error('Token Deepgram tidak valid untuk TTS (401).');
    }
    throw new Error(`Deepgram TTS gagal (${response.status}): ${errText}`);
  }

  const audioBlob = await response.blob();
  return URL.createObjectURL(audioBlob);
}

function pickIndonesianBrowserVoice(voices) {
  const idVoices = (voices || []).filter((v) =>
    (v.lang || '').toLowerCase().startsWith('id')
  );
  if (idVoices.length === 0) return null;

  return (
    idVoices.find((v) => /gadis|google bahasa indonesia|natural/i.test(v.name)) ||
    idVoices.find((v) => /female|wanita|damayanti/i.test(v.name)) ||
    idVoices[0]
  );
}

function loadBrowserVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return Promise.resolve([]);
  }
  const existing = window.speechSynthesis.getVoices();
  if (existing && existing.length > 0) {
    return Promise.resolve(existing);
  }
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve(window.speechSynthesis.getVoices() || []);
    }, 300);
    window.speechSynthesis.onvoiceschanged = () => {
      clearTimeout(timer);
      resolve(window.speechSynthesis.getVoices() || []);
    };
  });
}

export function stopBrowserIndonesianSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Putar suara AI dengan aksen Bahasa Indonesia asli (Browser id-ID: Google Bahasa Indonesia /
 * Microsoft Gadis) dan otomatis fallback ke Deepgram Aura-2 jika voice id-ID tidak tersedia.
 */
export async function speakIndonesianAuto(
  text,
  { onReady, onEnd, onError, preferBrowserId = false } = {}
) {
  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) {
    throw new Error('Tidak ada teks yang bisa dibacakan.');
  }

  // Prioritaskan suara Deepgram Aura-2 yang halus & natural (tidak kaku)
  if (!preferBrowserId && hasDeepgramApiKey()) {
    try {
      const audioUrl = await synthesizeSpeechWithDeepgram(cleaned);
      const audio = new Audio(audioUrl);
      let stopped = false;

      const cleanup = () => {
        URL.revokeObjectURL(audioUrl);
      };

      audio.onended = () => {
        if (stopped) return;
        stopped = true;
        cleanup();
        onEnd?.();
      };
      audio.onerror = () => {
        if (stopped) return;
        stopped = true;
        cleanup();
        onError?.(new Error('Gagal memutar audio Deepgram.'));
      };

      onReady?.();
      await audio.play();

      return {
        mode: 'deepgram',
        cancel: () => {
          stopped = true;
          audio.pause();
          cleanup();
        },
      };
    } catch {
      // Lanjut fallback ke voice browser id-ID jika Deepgram gagal
    }
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const voices = await loadBrowserVoices();
    const idVoice = pickIndonesianBrowserVoice(voices);
    if (idVoice) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.voice = idVoice;
      utterance.lang = idVoice.lang || 'id-ID';
      utterance.rate = 1.03;
      utterance.pitch = 1.04;

      let finished = false;
      utterance.onend = () => {
        if (finished) return;
        finished = true;
        onEnd?.();
      };
      utterance.onerror = (ev) => {
        if (finished) return;
        finished = true;
        if (ev?.error === 'interrupted' || ev?.error === 'canceled') {
          onEnd?.();
          return;
        }
        onError?.(new Error('Gagal memutar suara Bahasa Indonesia.'));
      };

      onReady?.();
      window.speechSynthesis.speak(utterance);
      return {
        mode: 'browser-id',
        cancel: () => {
          finished = true;
          window.speechSynthesis.cancel();
        },
      };
    }
  }

  throw new Error('Tidak ada layanan suara yang tersedia.');
}
