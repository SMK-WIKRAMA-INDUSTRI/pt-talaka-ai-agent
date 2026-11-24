import React, { useEffect, useState } from 'react';
import {
  Bot,
  Check,
  Copy,
  MessageCircle,
  RefreshCw,
  Send,
  Server,
  ShieldCheck,
} from 'lucide-react';
import { dispatchOmnichannelMessage } from '../services/omnichannel';
import { fetchRecentChatMessagesFromDb } from '../services/supabase';

export default function AdminBotsTab() {
  const [copiedKey, setCopiedKey] = useState('');
  const [testResult, setTestResult] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [botLogs, setBotLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);

  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://your-vercel-app.vercel.app';

  const telegramWebhookUrl = `${origin}/api/telegram-webhook`;
  const whatsappWebhookUrl = `${origin}/api/whatsapp-webhook`;

  useEffect(() => {
    let active = true;
    fetchRecentChatMessagesFromDb(25)
      .then((rows) => {
        if (!active) return;
        setBotLogs(rows);
      })
      .finally(() => {
        if (active) setIsLoadingLogs(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleCopy(text, key) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 1500);
    } catch {
      // Abaikan
    }
  }

  async function handleSendTestMessage() {
    if (isTesting) return;
    setIsTesting(true);
    setTestResult('');
    try {
      const res = await dispatchOmnichannelMessage({
        message:
          '🔔 *Tes Koneksi Talaka.ai Berhasil!*\nBot Kak Tala sudah terhubung lewat backend untuk mengirim notifikasi pesanan sampai & laporan analisis 3 harian.',
        sendToAdmin: true,
      });
      if (res.telegramSent || res.whatsappSent) {
        setTestResult(
          `Berhasil terkirim via backend ke: ${[
            res.telegramSent ? 'Telegram' : null,
            res.whatsappSent ? 'WhatsApp' : null,
          ]
            .filter(Boolean)
            .join(' & ')}!`
        );
      } else {
        setTestResult(
          res.notes.join(' · ') ||
            'Belum terkirim. Pastikan TELEGRAM_BOT_TOKEN & TELEGRAM_ADMIN_CHAT_ID (atau FONNTE_TOKEN) sudah diisi di file .env backend / Vercel.'
        );
      }
    } finally {
      setIsTesting(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Webhook Endpoints Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-white border border-[#E6DDD4] p-5 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-sky-500 text-white flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-950">
                Telegram Bot (@BotFather)
              </div>
              <div className="text-[10px] font-mono text-emerald-700 font-bold">
                BACKEND WEBHOOK · /api/telegram-webhook
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mendukung chat Kak Tala 2 arah, cek stok live Supabase, perintah{' '}
            <code className="rounded bg-slate-100 px-1 font-mono">
              /status TLK-XXXX
            </code>
            , serta auto-notif pesanan sampai &amp; laporan 3 harian.
          </p>
          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200 px-3 py-2 text-[11px] font-mono text-slate-700">
            <span className="truncate flex-1">{telegramWebhookUrl}</span>
            <button
              type="button"
              onClick={() => handleCopy(telegramWebhookUrl, 'tg')}
              className="text-slate-500 hover:text-slate-950 cursor-pointer shrink-0 flex items-center gap-1 font-bold"
            >
              {copiedKey === 'tg' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedKey === 'tg' ? 'Disalin' : 'Salin'}</span>
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-[#E6DDD4] p-5 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-950">
                WhatsApp Gateway (Fonnte)
              </div>
              <div className="text-[10px] font-mono text-emerald-700 font-bold">
                BACKEND WEBHOOK · /api/whatsapp-webhook
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tempel URL di bawah ke Dashboard Fonnte → Webhook untuk balasan
            otomatis Kak Tala di WhatsApp + notifikasi saat admin klik{' '}
            <strong>Sudah Sampai / Selesai</strong>.
          </p>
          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200 px-3 py-2 text-[11px] font-mono text-slate-700">
            <span className="truncate flex-1">{whatsappWebhookUrl}</span>
            <button
              type="button"
              onClick={() => handleCopy(whatsappWebhookUrl, 'wa')}
              className="text-slate-500 hover:text-slate-950 cursor-pointer shrink-0 flex items-center gap-1 font-bold"
            >
              {copiedKey === 'wa' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedKey === 'wa' ? 'Disalin' : 'Salin'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Backend Env Security Notice + Live Test Trigger */}
      <div className="rounded-3xl bg-white border border-[#E6DDD4] p-5 sm:p-6 space-y-4 shadow-2xs">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-slate-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Kredensial Bot Disimpan Aman di Backend (.env / Vercel)</span>
            </h3>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Demi keamanan, token API tidak ditampilkan di antarmuka browser.
              Cukup isi variabel berikut di file{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-900">
                .env
              </code>{' '}
              server atau <strong>Vercel Environment Variables</strong>:
            </p>
          </div>

          <button
            type="button"
            onClick={handleSendTestMessage}
            disabled={isTesting}
            className="rounded-2xl bg-slate-900 hover:bg-black text-white px-4 py-2.5 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 disabled:opacity-40 shrink-0"
          >
            {isTesting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D6B7A5]" />
            ) : (
              <Send className="w-3.5 h-3.5 text-[#D6B7A5]" />
            )}
            <span>Tes Kirim Pesan ke Admin</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-[11px] font-mono">
          {[
            { name: 'TELEGRAM_BOT_TOKEN', desc: 'Token dari @BotFather' },
            { name: 'TELEGRAM_ADMIN_CHAT_ID', desc: 'Chat ID Telegram Admin' },
            { name: 'FONNTE_TOKEN', desc: 'API Token WhatsApp Fonnte' },
            { name: 'WHATSAPP_ADMIN_PHONE', desc: 'Nomor WA Admin (08...)' },
          ].map((env) => (
            <div
              key={env.name}
              className="rounded-2xl bg-[#FAF7F4] border border-[#E6DDD4] p-3 space-y-0.5"
            >
              <div className="font-bold text-slate-900 flex items-center gap-1 truncate">
                <Server className="w-3 h-3 text-[#9E7B66] shrink-0" />
                <span className="truncate">{env.name}</span>
              </div>
              <div className="text-[10px] font-sans text-slate-500">
                {env.desc}
              </div>
            </div>
          ))}
        </div>

        {testResult && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-xs font-semibold text-emerald-900">
            {testResult}
          </div>
        )}
      </div>

      {/* Recent Omnichannel Chat Logs */}
      <div className="rounded-3xl bg-white border border-[#E6DDD4] p-5 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="text-xs font-extrabold text-slate-950 flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-[#9E7B66]" />
            <span>Log Percakapan Terbaru (Web / Telegram / WhatsApp)</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            SUPABASE chat_messages
          </span>
        </div>

        {isLoadingLogs ? (
          <div className="text-xs text-slate-500 py-4 text-center">
            Memuat log percakapan...
          </div>
        ) : botLogs.length === 0 ? (
          <div className="text-xs text-slate-500 py-4 text-center">
            Belum ada log chat tersimpan di Supabase.
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {botLogs.slice(0, 15).map((log) => (
              <div
                key={log.id}
                className="rounded-2xl bg-[#FAF7F4] border border-[#E6DDD4]/80 p-3 text-xs flex items-start justify-between gap-3"
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase text-[#9E7B66]">
                      {log.page_context || 'web'}
                    </span>
                    <span className="font-bold text-slate-900">
                      {log.role === 'user' ? `@${log.username}` : 'Kak Tala'}
                    </span>
                  </div>
                  <p className="text-slate-700 line-clamp-2">{log.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
