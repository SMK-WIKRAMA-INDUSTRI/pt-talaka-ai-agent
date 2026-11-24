import {
  buildSystemPrompt,
  DEFAULT_MODEL,
  MAX_HISTORY_MESSAGES,
} from '../config/botPrompt';

const isLocalHost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1');

const NETRA_API_URL = isLocalHost
  ? '/api/netra/v1/chat/completions'
  : 'https://api.netra.sh/v1/chat/completions';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

export function getDeepSeekApiKey() {
  return (import.meta.env.VITE_DEEPSEEK_API_KEY || '').trim();
}

export function hasDeepSeekApiKey() {
  return Boolean(getDeepSeekApiKey());
}

function resolveApiEndpoint(apiKey, model) {
  if (apiKey.startsWith('sk_live_') || (model || '').includes('/')) {
    return NETRA_API_URL;
  }
  return DEEPSEEK_API_URL;
}

function describeApiError(status, bodyText) {
  if (status === 401) {
    return 'API key / token tidak valid atau sudah kedaluwarsa (401). Periksa kembali VITE_DEEPSEEK_API_KEY di file .env.';
  }
  if (status === 402) {
    return 'Saldo / kuota API tidak mencukupi (402).';
  }
  if (status === 404) {
    return 'Model atau endpoint tidak ditemukan (404). Pastikan nama model benar, misalnya deepseek/deepseek-v4.1-flash.';
  }
  if (status === 429) {
    return 'Terlalu banyak permintaan dalam waktu singkat (429). Coba lagi beberapa saat.';
  }

  try {
    const parsed = JSON.parse(bodyText);
    const detail = parsed?.error?.message;
    if (detail) return `Gagal menghubungi API (${status}): ${detail}`;
  } catch {
    // Abaikan jika respons bukan JSON
  }

  return `Gagal menghubungi API (HTTP ${status}).`;
}

export async function askDeepSeek({
  model,
  botName,
  honestyLevel,
  showExactStock,
  activePageContext,
  contextText,
  history,
}) {
  const cleanKey = getDeepSeekApiKey();
  if (!cleanKey) {
    throw new Error(
      'API key belum diisi. Tambahkan VITE_DEEPSEEK_API_KEY di file .env lalu muat ulang halaman.'
    );
  }

  const activeModel = (model || '').trim() || DEFAULT_MODEL;
  const endpoint = resolveApiEndpoint(cleanKey, activeModel);

  const recentHistory = (history || [])
    .slice(-MAX_HISTORY_MESSAGES)
    .map(({ role, content }) => ({ role, content }));

  const messages = [
    {
      role: 'system',
      content: buildSystemPrompt({
        contextText,
        botName,
        honestyLevel,
        showExactStock,
        activePageContext,
      }),
    },
    ...recentHistory,
  ];

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cleanKey}`,
    },
    body: JSON.stringify({
      model: activeModel,
      messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(describeApiError(response.status, errorText));
  }

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    throw new Error('Respons dari API kosong. Silakan coba kirim ulang.');
  }

  return reply;
}
