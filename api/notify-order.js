import {
  getServerConfig,
  sendTelegramMessage,
  sendWhatsAppFonnte,
} from './_lib/talakaServer.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      orderCode = '',
      customerPhone = '',
      telegramChatId = '',
      message = '',
      sendToAdmin = false,
    } = req.body || {};

    if (!message.trim()) {
      return res.status(400).json({ error: 'Pesan notifikasi kosong.' });
    }

    const cfg = getServerConfig();
    const results = {
      orderCode,
      telegram: { sent: false, reason: 'Tidak dikirim' },
      whatsapp: { sent: false, reason: 'Tidak dikirim' },
    };

    const targetTg =
      telegramChatId ||
      (sendToAdmin ? cfg.telegramAdminChatId : '') ||
      (/^-?\d{6,15}$/.test(String(customerPhone || '').trim()) &&
      !String(customerPhone).startsWith('08') &&
      !String(customerPhone).startsWith('62')
        ? String(customerPhone).trim()
        : '');

    if (targetTg) {
      results.telegram = await sendTelegramMessage(targetTg, message);
    }

    const targetWa =
      (sendToAdmin ? cfg.whatsappAdminPhone : '') ||
      (/^(08|62|\+62)/.test(String(customerPhone || '').trim())
        ? String(customerPhone).trim()
        : '');

    if (targetWa) {
      results.whatsapp = await sendWhatsAppFonnte(targetWa, message);
    }

    return res.status(200).json({ ok: true, results });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
