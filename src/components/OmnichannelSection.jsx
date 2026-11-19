import React from 'react';
import {
  Cpu,
  Globe,
  MessageCircle,
  Send,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

const CHANNELS = [
  {
    id: 'web',
    name: 'Website Talaka',
    protocol: 'Web Widget & Studio',
    status: 'AKTIF SEKARANG',
    isActive: true,
    description:
      'Sudah berjalan penuh: konsultasi gaya jujur, panduan ukuran TB/BB, stok live etalase, 3D showcase, & Virtual Try-On.',
    icon: Globe,
    accent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconBg: 'bg-slate-900 text-white',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    protocol: 'Fonnte / Meta Cloud API',
    status: 'SEGERA HADIR',
    isActive: false,
    description:
      'Balas chat pelanggan 24/7 di WhatsApp tanpa admin lembur, langsung terhubung ke stok & keranjang toko.',
    icon: MessageCircle,
    accent: 'bg-amber-50 text-amber-700 border-amber-200',
    iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    protocol: 'Telegram Bot API',
    status: 'SEGERA HADIR',
    isActive: false,
    description:
      'Konsultasi cepat dengan tombol interaktif pilih warna & ukuran langsung dari aplikasi Telegram.',
    icon: Send,
    accent: 'bg-amber-50 text-amber-700 border-amber-200',
    iconBg: 'bg-sky-50 text-sky-700 border border-sky-200',
  },
  {
    id: 'tiktok',
    name: 'TikTok Shop',
    protocol: 'TikTok Partner API',
    status: 'FASE 2 · MCP',
    isActive: false,
    description:
      'Menjawab pertanyaan pembeli saat live & sinkronisasi stok otomatis dengan etalase TikTok Shop.',
    icon: ShoppingBag,
    accent: 'bg-slate-100 text-slate-600 border-slate-200',
    iconBg: 'bg-slate-100 text-slate-800 border border-slate-200',
  },
];

export default function OmnichannelSection({ onScrollToChat }) {
  return (
    <section
      id="omnichannel-roadmap"
      className="relative py-24 bg-white border-t border-slate-200/80"
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-mono font-semibold text-slate-700 shadow-2xs">
              <Cpu className="w-3.5 h-3.5 text-[#9E7B66]" />
              OMNICHANNEL_MCP_ROADMAP
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
              Satu Otak Agent, Siap Terhubung ke Banyak Channel
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Saat ini Talaka sudah aktif penuh di <strong>Website</strong>.
              Integrasi ke <strong>WhatsApp, Telegram, dan TikTok</strong>{' '}
              disiapkan sebagai pengembangan fase berikutnya menggunakan{' '}
              <strong>MCP (Model Context Protocol)</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={onScrollToChat}
            className="self-start md:self-auto inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-black transition cursor-pointer shadow-xs shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#9E7B66]" />
            <span>Coba yang Aktif (Web)</span>
          </button>
        </div>

        {/* 4 Channel Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CHANNELS.map((ch) => {
            const Icon = ch.icon;
            return (
              <div
                key={ch.id}
                className={`rounded-3xl border p-6 flex flex-col justify-between gap-5 transition-all ${
                  ch.isActive
                    ? 'border-slate-900 bg-slate-50/70 shadow-sm'
                    : 'border-slate-200/90 bg-white hover:border-slate-300'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`h-11 w-11 rounded-2xl flex items-center justify-center ${ch.iconBg}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-bold ${ch.accent}`}
                    >
                      {ch.isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                      {ch.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-slate-950">
                      {ch.name}
                    </h3>
                    <div className="text-[11px] font-mono font-semibold text-[#9E7B66]">
                      {ch.protocol}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {ch.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">
                    {ch.isActive ? 'STATUS: LIVE' : 'STATUS: PLANNED'}
                  </span>
                  <span
                    className={
                      ch.isActive
                        ? 'font-bold text-emerald-700'
                        : 'font-semibold text-slate-500'
                    }
                  >
                    {ch.isActive ? '● Ready' : '○ Next Phase'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
