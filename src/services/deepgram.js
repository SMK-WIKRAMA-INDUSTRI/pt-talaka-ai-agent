const DEEPGRAM_LISTEN_URL =
  'https://api.deepgram.com/v1/listen?model=nova-2&language=id&smart_format=true&punctuate=true';
const DEEPGRAM_SPEAK_URL =
  'https://api.deepgram.com/v1/speak?model=aura-2-thalia-en';

export function getDeepgramApiKey() {
  return (import.meta.env.VITE_DEEPGRAM_API_KEY || '').trim();
}

export function hasDeepgramApiKey() {
  return Boolean(getDeepgramApiKey());
}

function cleanTextForSpeech(raw) {
  return String(raw || '')
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

  const contentType = audioBlob.type || 'audio/webm';
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
