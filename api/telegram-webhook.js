import {
  askKakTalaServer,
  fetchCatalogSummaryText,
  lookupOrderStatusMessage,
  sendTelegramMessage,
  supabaseRest,
} from './_lib/talakaServer.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      service: 'Talaka.ai Telegram Webhook (Kak Tala)',
      usage: 'Set Telegram setWebhook URL ke endpoint ini dengan TELEGRAM_BOT_TOKEN di Vercel Env.',
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const update = req.body || {};
    const msg = update.message || update.edited_message;
    const chatId = msg?.chat?.id;
    const incomingText = (msg?.text || '').trim();
    const senderName =
      msg?.from?.username || msg?.from?.first_name || `tg_${chatId || 'guest'}`;

    if (!chatId || !incomingText) {
      return res.status(200).json({ ok: true, skipped: true });
    }

    let replyText = '';

    if (incomingText === '/start') {
      replyText =
        `Halo Kak ${msg?.from?.first_name || ''}! 👋\n` +
        `Aku *Kak Tala*, AI Fashion Stylist & CS dari *Talaka.ai*.\n\n` +
        `Kamu bisa:\n` +
        `• Tanya ukuran TB/BB & cek stok live\n` +
        `• Minta rekomendasi outfit jujur sesuai acara\n` +
        `• Lacak paket dengan ketik: \`/status TLK-1234\`\n\n` +
        `Ada yang bisa Kak Tala bantu hari ini?`;
    } else if (/^\/status\s+/i.test(incomingText)) {
      const code = incomingText.replace(/^\/status\s+/i, '').trim();
      replyText = await lookupOrderStatusMessage(code);
    } else {
      const catalog = await fetchCatalogSummaryText();
      const systemPrompt = [
        'Kamu adalah Kak Tala, AI Customer Service & Teman Gaya jujur dari toko fashion Talaka.ai di Telegram.',
        'Jawab dalam Bahasa Indonesia ramah, hangat, jujur soal proporsi TB/BB, ringkas (maks 4 kalimat), tanpa menyebut angka stok persis (cukup Tersedia / Stok Sedikit / Habis).',
        'Jika pelanggan ingin checkout, arahkan untuk sebutkan Nama, Alamat, dan Metode Bayar atau klik checkout di web Talaka.ai.',
        '',
        'KATALOG LIVE TALAKA:',
        catalog,
      ].join('\n');

      replyText = await askKakTalaServer({
        systemPrompt,
        userMessage: incomingText,
      });
    }

    await supabaseRest('chat_messages', {
      method: 'POST',
      body: [
        {
          session_id: `telegram-${chatId}`,
          username: senderName,
          role: 'user',
          content: incomingText,
          page_context: 'telegram-bot',
        },
        {
          session_id: `telegram-${chatId}`,
          username: senderName,
          role: 'assistant',
          content: replyText,
          page_context: 'telegram-bot',
        },
      ],
    });

    const tgResult = await sendTelegramMessage(chatId, replyText);
    return res.status(200).json({ ok: true, telegram: tgResult });
  } catch (err) {
    console.error('Telegram webhook error:', err);
    return res.status(200).json({ ok: false, error: err.message });
  }
}
