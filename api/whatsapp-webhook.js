import {
  askKakTalaServer,
  fetchCatalogSummaryText,
  lookupOrderStatusMessage,
  sendWhatsAppFonnte,
  supabaseRest,
} from './_lib/talakaServer.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      service: 'Talaka.ai WhatsApp Webhook (Fonnte + Kak Tala)',
      usage: 'Tempel URL endpoint ini ke Dashboard Fonnte -> Webhook dengan FONNTE_TOKEN di Vercel Env.',
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = req.body || {};
    const sender = String(body.sender || body.from || '').trim();
    const incomingText = String(body.message || body.text || '').trim();

    if (!sender || !incomingText) {
      return res.status(200).json({ ok: true, skipped: true });
    }

    let replyText = '';
    const statusMatch = /^(?:\/status|cek resi|lacak)\s+(TLK-\d+)/i.exec(
      incomingText
    );
    if (statusMatch) {
      replyText = await lookupOrderStatusMessage(statusMatch[1]);
    } else {
      const catalog = await fetchCatalogSummaryText();
      const systemPrompt = [
        'Kamu adalah Kak Tala, AI Customer Service & Teman Gaya jujur dari toko fashion Talaka.ai di WhatsApp.',
        'Jawab santai, hangat, jujur soal proporsi TB/BB, singkat (2-4 kalimat), tanpa menyebut angka stok persis (cukup Tersedia / Stok Sedikit / Habis).',
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
          session_id: `whatsapp-${sender}`,
          username: sender,
          role: 'user',
          content: incomingText,
          page_context: 'whatsapp-bot',
        },
        {
          session_id: `whatsapp-${sender}`,
          username: sender,
          role: 'assistant',
          content: replyText,
          page_context: 'whatsapp-bot',
        },
      ],
    });

    const waResult = await sendWhatsAppFonnte(sender, replyText);
    return res.status(200).json({ ok: true, whatsapp: waResult });
  } catch (err) {
    console.error('WhatsApp webhook error:', err);
    return res.status(200).json({ ok: false, error: err.message });
  }
}
