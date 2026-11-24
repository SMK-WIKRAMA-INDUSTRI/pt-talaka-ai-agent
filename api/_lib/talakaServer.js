const NETRA_API_URL = 'https://api.netra.sh/v1/chat/completions';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const DEFAULT_MODEL = 'deepseek/deepseek-v4.1-flash';

export function getServerConfig() {
  return {
    deepseekKey: (
      process.env.DEEPSEEK_API_KEY ||
      process.env.VITE_DEEPSEEK_API_KEY ||
      ''
    ).trim(),
    supabaseUrl: (
      process.env.SUPABASE_URL ||
      process.env.VITE_SUPABASE_URL ||
      ''
    )
      .trim()
      .replace(/\/+$/, ''),
    supabaseKey: (
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      ''
    ).trim(),
    telegramBotToken: (process.env.TELEGRAM_BOT_TOKEN || '').trim(),
    telegramAdminChatId: (process.env.TELEGRAM_ADMIN_CHAT_ID || '').trim(),
    fonnteToken: (process.env.FONNTE_TOKEN || '').trim(),
    whatsappAdminPhone: (process.env.WHATSAPP_ADMIN_PHONE || '').trim(),
  };
}

export async function supabaseRest(path, { method = 'GET', body } = {}) {
  const { supabaseUrl, supabaseKey } = getServerConfig();
  if (!supabaseUrl || !supabaseKey) return null;

  const res = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: method === 'POST' ? 'return=representation' : 'return=minimal',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errText = await res.text();
    console.warn(`Supabase REST ${method} ${path} failed (${res.status}):`, errText);
    return null;
  }

  const text = await res.text();
  if (!text) return true;
  try {
    return JSON.parse(text);
  } catch {
    return true;
  }
}

export async function fetchCatalogSummaryText() {
  const rows = await supabaseRest('products?select=*&order=sort_order.asc');
  if (!Array.isArray(rows) || rows.length === 0) {
    return 'Katalog Talaka meliputi Sepatu (SNK-006, SNK-007, SNK-008) dan Apparel (KMJ-001, CLN-002, OUT-003, DRS-004, TSH-005).';
  }
  return rows
    .map((p) => {
      const sizeStatus = Object.entries(p.sizes || {})
        .map(([color, map]) => {
          const items = Object.entries(map || {})
            .map(([sz, qty]) =>
              qty <= 0 ? `${sz}:Habis` : qty <= 3 ? `${sz}:Sedikit` : `${sz}:Ready`
            )
            .join(', ');
          return `${color} (${items})`;
        })
        .join(' | ');
      return `- ${p.name} [${p.sku}] ${p.price_formatted} | ${p.material} | Fit: ${p.fit} | Stok: ${sizeStatus} | Catatan Jujur: ${p.honest_note || '-'}`;
    })
    .join('\n');
}

export async function askKakTalaServer({ systemPrompt, userMessage, maxTokens = 450 }) {
  const { deepseekKey } = getServerConfig();
  if (!deepseekKey) {
    throw new Error('DEEPSEEK_API_KEY belum diatur di environment server.');
  }

  const endpoint = deepseekKey.startsWith('sk_live_')
    ? NETRA_API_URL
    : DEEPSEEK_API_URL;
  const model = deepseekKey.startsWith('sk_live_')
    ? DEFAULT_MODEL
    : 'deepseek-chat';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${deepseekKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`LLM API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() || '';
}

export async function lookupOrderStatusMessage(orderCodeRaw) {
  const code = String(orderCodeRaw || '').trim().toUpperCase();
  if (!code) return null;

  const rows = await supabaseRest(
    `orders?order_code=eq.${encodeURIComponent(code)}&select=*`
  );
  if (!Array.isArray(rows) || rows.length === 0) {
    return `Pesanan dengan kode *${code}* belum ditemukan ya Kak. Coba cek kembali kode pesanannya (contoh: TLK-1234).`;
  }

  const ord = rows[0];
  const statusMap = {
    diproses: 'Sedang Diproses',
    dikemas: 'Sedang Dikemas',
    dikirim: 'Dalam Pengiriman Kurir',
    selesai: 'Sudah Sampai / Selesai',
  };
  return [
    `📦 *Status Pesanan ${ord.order_code}*`,
    `• Penerima: ${ord.customer_name}`,
    `• Status: *${statusMap[ord.status] || ord.status}*`,
    `• Posisi Terakhir: ${ord.last_location || 'Gudang Talaka Bogor'}`,
    ord.courier || ord.tracking_number
      ? `• Kurir / Resi: ${ord.courier || '-'} (${ord.tracking_number || '-'})`
      : null,
    `• Tujuan: ${ord.shipping_address}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export async function sendTelegramMessage(chatId, text, overrideToken = '') {
  const token = (overrideToken || getServerConfig().telegramBotToken || '').trim();
  if (!token || !chatId || !text) {
    return { sent: false, reason: 'TELEGRAM_BOT_TOKEN atau chatId belum diatur.' };
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: String(chatId).trim(),
      text,
      parse_mode: 'Markdown',
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return { sent: false, reason: `Telegram error (${res.status}): ${errText}` };
  }
  return { sent: true };
}

export async function sendWhatsAppFonnte(targetPhone, message, overrideToken = '') {
  const token = (overrideToken || getServerConfig().fonnteToken || '').trim();
  if (!token || !targetPhone || !message) {
    return { sent: false, reason: 'FONNTE_TOKEN atau nomor tujuan belum diatur.' };
  }

  const cleanPhone = String(targetPhone).replace(/[^0-9]/g, '');
  if (!cleanPhone) {
    return { sent: false, reason: 'Format nomor WhatsApp tidak valid.' };
  }

  const form = new URLSearchParams();
  form.set('target', cleanPhone);
  form.set('message', message);
  form.set('countryCode', '62');

  const res = await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  });

  if (!res.ok) {
    const errText = await res.text();
    return { sent: false, reason: `Fonnte error (${res.status}): ${errText}` };
  }
  return { sent: true };
}
