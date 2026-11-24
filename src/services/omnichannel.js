/**
 * Kirim notifikasi ke Telegram & WhatsApp melalui backend `/api/notify-order`.
 * Semua token (`TELEGRAM_BOT_TOKEN`, `FONNTE_TOKEN`, dll.) disimpan aman di backend `.env` / Vercel Env.
 */
export async function dispatchOmnichannelMessage({
  orderCode = '',
  customerPhone = '',
  telegramChatId = '',
  message = '',
  sendToAdmin = false,
}) {
  const summary = {
    telegramSent: false,
    whatsappSent: false,
    notes: [],
  };

  try {
    const res = await fetch('/api/notify-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderCode,
        customerPhone,
        telegramChatId,
        message,
        sendToAdmin,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.ok) {
      summary.telegramSent = Boolean(data?.results?.telegram?.sent);
      summary.whatsappSent = Boolean(data?.results?.whatsapp?.sent);
      if (data?.results?.telegram?.reason && !summary.telegramSent) {
        summary.notes.push(`Telegram: ${data.results.telegram.reason}`);
      }
      if (data?.results?.whatsapp?.reason && !summary.whatsappSent) {
        summary.notes.push(`WA: ${data.results.whatsapp.reason}`);
      }
      return summary;
    }

    summary.notes.push(
      data?.error ||
        'Endpoint backend `/api/notify-order` belum terkonfigurasi token Telegram/WA di `.env`.'
    );
  } catch {
    summary.notes.push(
      'Tidak dapat menghubungi backend `/api/notify-order` (pastikan dev server terbaru sudah dijalankan).'
    );
  }

  return summary;
}
