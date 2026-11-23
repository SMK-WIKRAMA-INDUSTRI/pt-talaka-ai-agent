import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Camera,
  Database,
  FileText,
  Globe,
  MessageCircle,
  Mic,
  Send,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { gsap } from 'gsap';
import talakaLogo from '../assets/talaka-logo.svg';

const CHANNELS = [
  {
    id: 'web',
    name: 'Website Talaka',
    subtitle: 'Studio Web & Katalog Live',
    status: 'Aktif sekarang',
    isActive: true,
    description:
      'Sudah berjalan penuh di halaman ini: konsultasi ukuran TB/BB, saran gaya jujur, cek stok Supabase real-time, 3D showcase, suara Deepgram, & Virtual Try-On.',
    icon: Globe,
    color: 'text-[#141210]',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    subtitle: 'Meta Cloud / Fonnte API',
    status: 'Segera hadir',
    isActive: false,
    description:
      'Balas pesan pelanggan 24/7 langsung di WhatsApp bisnis tanpa admin lembur, terhubung langsung ke data stok & keranjang toko.',
    icon: MessageCircle,
    color: 'text-emerald-600',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    subtitle: 'Telegram Bot API',
    status: 'Segera hadir',
    isActive: false,
    description:
      'Konsultasi kilat dengan tombol pilihan warna, ukuran, serta kirim lookbook PDF otomatis langsung di aplikasi Telegram.',
    icon: Send,
    color: 'text-sky-500',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 'tiktok',
    name: 'TikTok Shop',
    subtitle: 'Integrasi MCP Fase 2',
    status: 'Fase 2 · MCP',
    isActive: false,
    description:
      'Menjawab pertanyaan penonton saat sesi live jualan dan menyinkronkan sisa stok etalase TikTok Shop secara otomatis.',
    icon: ShoppingBag,
    color: 'text-rose-500',
    badgeBg: 'bg-[#F5EFE9] text-[#7A6A5E] border-[#E6DDD4]',
  },
];

// 3 curved emitter lanes rising smoothly from inside the open folder pocket (440x440 coordinate space)
const STREAM_PATHS = {
  left: {
    p0: [194, 332],
    p1: [172, 238],
    p2: [112, 162],
    p3: [76, 18],
    rotStart: -3,
    rotEnd: -18,
  },
  center: {
    p0: [220, 332],
    p1: [208, 232],
    p2: [232, 132],
    p3: [216, 6],
    rotStart: 0,
    rotEnd: 9,
  },
  right: {
    p0: [246, 332],
    p1: [272, 238],
    p2: [328, 162],
    p3: [364, 18],
    rotStart: 3,
    rotEnd: 18,
  },
};

// 9 evenly phased icon tiles continuously emerging out of the folder, floating up & fading seamlessly
const EMITTED_TILES = [
  { id: 'wa-1', channelId: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'text-emerald-600', lane: 'left', phase: 0 },
  { id: 'web-1', channelId: 'web', label: 'Website', icon: Globe, color: 'text-[#141210]', lane: 'center', phase: 1 / 9 },
  { id: 'tt-1', channelId: 'tiktok', label: 'TikTok Shop', icon: ShoppingBag, color: 'text-rose-500', lane: 'right', phase: 2 / 9 },
  { id: 'tg-1', channelId: 'telegram', label: 'Telegram', icon: Send, color: 'text-sky-500', lane: 'left', phase: 3 / 9 },
  { id: 'ai-1', channelId: 'web', label: 'Talaka AI', icon: Sparkles, color: 'text-[#9E7B66]', lane: 'center', phase: 4 / 9 },
  { id: 'db-1', channelId: 'web', label: 'Supabase', icon: Database, color: 'text-emerald-600', lane: 'right', phase: 5 / 9 },
  { id: 'try-1', channelId: 'web', label: 'Try-On', icon: Camera, color: 'text-violet-600', lane: 'left', phase: 6 / 9 },
  { id: 'mic-1', channelId: 'web', label: 'Voice AI', icon: Mic, color: 'text-[#9E7B66]', lane: 'center', phase: 7 / 9 },
  { id: 'pdf-1', channelId: 'web', label: 'Lookbook PDF', icon: FileText, color: 'text-amber-600', lane: 'right', phase: 8 / 9 },
];

function cubicVal(a, b, c, d, t) {
  const mt = 1 - t;
  return mt * mt * mt * a + 3 * mt * mt * t * b + 3 * mt * t * t * c + t * t * t * d;
}

export default function OmnichannelSection({ onScrollToChat }) {
  const [selectedId, setSelectedId] = useState('web');
  const cardStageRef = useRef(null);
  const tilesRef = useRef([]);
  const folderRef = useRef(null);
  const detailRef = useRef(null);
  const emitterRef = useRef({ elapsed: 0, speedFactor: 1 });

  const activeChannel = CHANNELS.find((c) => c.id === selectedId) || CHANNELS[0];

  // Continuous smooth fountain loop: icons rise from inside folder → float up curves → fade out → repeat forever
  useEffect(() => {
    const CYCLE_SECONDS = 5.6;

    const tick = (_time, deltaMs) => {
      const stage = cardStageRef.current;
      if (!stage) return;

      const dt = Math.min(deltaMs / 1000, 0.05);
      const em = emitterRef.current;
      em.elapsed += dt * em.speedFactor;

      const stageW = stage.clientWidth || 440;
      const stageH = stage.clientHeight || 440;
      const sx = stageW / 440;
      const sy = stageH / 440;

      for (let i = 0; i < EMITTED_TILES.length; i++) {
        const el = tilesRef.current[i];
        if (!el) continue;

        const tile = EMITTED_TILES[i];
        const lane = STREAM_PATHS[tile.lane];
        const rawT = (em.elapsed / CYCLE_SECONDS + tile.phase) % 1;

        // Gentle ease-out progression so tiles burst smoothly from folder and drift softly near top
        const moveT = 1 - Math.pow(1 - rawT, 1.35);

        const x = cubicVal(lane.p0[0], lane.p1[0], lane.p2[0], lane.p3[0], moveT) * sx;
        const y = cubicVal(lane.p0[1], lane.p1[1], lane.p2[1], lane.p3[1], moveT) * sy;
        const rot = lane.rotStart + (lane.rotEnd - lane.rotStart) * moveT;

        // Smooth scale & opacity envelope: emerge from folder (0..0.18) → crisp glide (0.18..0.72) → fade out (0.72..1.0)
        let opacity = 1;
        let scale = 1;
        if (rawT < 0.16) {
          const u = rawT / 0.16;
          opacity = u;
          scale = 0.58 + 0.42 * u;
        } else if (rawT > 0.72) {
          const u = (rawT - 0.72) / 0.28;
          opacity = Math.max(0, 1 - u * u);
          scale = 1 - 0.22 * u;
        }

        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${rot.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.pointerEvents = opacity > 0.35 && rawT > 0.18 ? 'auto' : 'none';
      }
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, []);

  // Smooth detail transition when clicking a tile or channel tab
  useEffect(() => {
    if (!detailRef.current) return;
    gsap.fromTo(
      detailRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' }
    );
  }, [selectedId]);

  const handleStageHover = (hovering) => {
    gsap.to(emitterRef.current, {
      speedFactor: hovering ? 0.32 : 1,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleFolderHover = (hovering) => {
    if (!folderRef.current) return;
    gsap.to(folderRef.current, {
      scale: hovering ? 1.03 : 1,
      y: hovering ? -3 : 0,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  return (
    <section id="omnichannel-roadmap" className="relative py-24 sm:py-28 bg-[#FAF7F4]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white via-white/70 to-transparent blur-sm"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* ─── LEFT: Interactive Warm Folder + Continuous Emerging Icon Stream (Photo 3 Style) ─── */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div
              ref={cardStageRef}
              onMouseEnter={() => handleStageHover(true)}
              onMouseLeave={() => handleStageHover(false)}
              className="relative w-full max-w-[440px] h-[440px] rounded-[36px] bg-gradient-to-b from-[#FDFBF9] via-[#FAF6F1] to-[#F4ECE4] border border-[#EAE0D5] overflow-hidden shadow-[0_24px_60px_-20px_rgba(158,123,102,0.18)]"
            >
              {/* Soft radiating light trails rising from the folder */}
              <svg
                aria-hidden="true"
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 440 440"
                fill="none"
              >
                <path d="M 194 332 C 172 238, 112 162, 76 18" stroke="#E9D6C7" strokeWidth="18" strokeOpacity="0.32" strokeLinecap="round" />
                <path d="M 220 332 C 208 232, 232 132, 216 6" stroke="#E9D6C7" strokeWidth="22" strokeOpacity="0.35" strokeLinecap="round" />
                <path d="M 246 332 C 272 238, 328 162, 364 18" stroke="#E9D6C7" strokeWidth="18" strokeOpacity="0.32" strokeLinecap="round" />
                <path d="M 380 440 C 340 310, 355 150, 440 60" stroke="#EAD9CA" strokeWidth="1.5" strokeOpacity="0.7" />
              </svg>

              {/* Folder Back Layer (z-10) — sits behind emerging icons */}
              <div className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 z-10 w-[240px] h-[165px]">
                <div className="absolute top-0 left-0 w-[108px] h-8 rounded-t-2xl bg-[#D9B69E]" />
                <div className="absolute top-4 inset-x-0 bottom-0 rounded-2xl bg-[#DFBEA7] shadow-inner" />

                {/* 3 Peeking Mini Cards tucked inside the folder */}
                <div className="absolute -top-3 left-5 w-16 h-20 rounded-xl bg-white border border-slate-100 shadow-md -rotate-6 flex items-center justify-center">
                  <Mic className="w-6 h-6 text-[#9E7B66]" />
                </div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 w-[86px] h-24 rounded-2xl bg-white border border-slate-100 shadow-lg flex items-center justify-center p-3">
                  <img src={talakaLogo} alt="Talaka Core" className="w-11 h-11 object-contain" />
                </div>
                <div className="absolute -top-2 right-5 w-16 h-20 rounded-xl bg-white border border-slate-100 shadow-md rotate-6 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-emerald-600" />
                </div>
              </div>

              {/* Continuously Emerging Glossy White App Tiles (z-15: start behind front pocket, rise into view!) */}
              {EMITTED_TILES.map((tile, i) => {
                const Icon = tile.icon;
                const isHighlighted = selectedId === tile.channelId;
                return (
                  <button
                    key={tile.id}
                    ref={(el) => {
                      tilesRef.current[i] = el;
                    }}
                    type="button"
                    onClick={() => setSelectedId(tile.channelId)}
                    title={tile.label}
                    className={`absolute top-0 left-0 z-15 h-14 w-14 sm:h-[58px] sm:w-[58px] rounded-2xl bg-white flex items-center justify-center cursor-pointer will-change-transform ${
                      isHighlighted
                        ? 'ring-2 ring-[#9E7B66] shadow-[0_14px_28px_rgba(158,123,102,0.28)]'
                        : 'border border-slate-100 shadow-[0_10px_24px_rgba(15,23,42,0.08)] hover:ring-2 hover:ring-[#9E7B66]/50'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${tile.color}`} />
                  </button>
                );
              })}

              {/* Front Translucent Warm Peach-Mocca Folder Pocket (z-20: masks icons as they emerge!) */}
              <div
                ref={folderRef}
                onMouseEnter={() => handleFolderHover(true)}
                onMouseLeave={() => handleFolderHover(false)}
                onClick={onScrollToChat}
                className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 w-[240px] h-[120px] rounded-2xl rounded-tr-[22px] bg-gradient-to-br from-[#F0CDB5] via-[#E5B89B] to-[#D4A081] border-t border-white/60 shadow-[0_18px_36px_-10px_rgba(158,123,102,0.45)] flex items-end justify-between px-5 pb-4 cursor-pointer"
              >
                <span className="text-xs font-bold tracking-wide text-[#734E39]">
                  Talaka Channels
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/60 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-[#6A4733]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  4 Saluran
                </span>
              </div>

              {/* Subtle top fade mask so exiting icons dissolve effortlessly */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[#FDFBF9] to-transparent z-30"
              />
            </div>
          </div>

          {/* ─── RIGHT: Editorial Copy & Interactive Channel Switcher ─── */}
          <div className="lg:col-span-6 space-y-7">
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9E7B66]">
                Satu Folder · Semua Saluran
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[#141210] leading-[1.15]">
                Satu otak agent,{' '}
                <span className="italic font-normal text-[#8E6B56]">
                  siap terhubung ke banyak channel.
                </span>
              </h2>
              <p className="text-sm text-[#5C544E] leading-relaxed">
                Klik ikon yang keluar dari folder atau pilih tab channel di bawah untuk melihat status integrasi MCP Talaka.
              </p>
            </div>

            {/* Channel Selector Pills */}
            <div className="flex flex-wrap gap-2">
              {CHANNELS.map((ch) => {
                const Icon = ch.icon;
                const isSelected = ch.id === selectedId;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setSelectedId(ch.id)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#161412] text-white border-[#161412] shadow-sm'
                        : 'bg-white text-[#5C544E] border-[#E6DDD4] hover:border-[#9E7B66] hover:text-[#141210]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{ch.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Live Selected Channel Detail Panel */}
            <div
              ref={detailRef}
              className="rounded-3xl bg-white border border-[#EAE0D5] p-6 shadow-[0_12px_32px_-16px_rgba(20,18,16,0.08)] space-y-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-[#FAF7F4] border border-[#EAE0D5] flex items-center justify-center">
                    <activeChannel.icon className={`w-5 h-5 ${activeChannel.color}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#141210]">
                      {activeChannel.name}
                    </h3>
                    <p className="text-xs text-[#8C8076]">{activeChannel.subtitle}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold ${activeChannel.badgeBg}`}
                >
                  {activeChannel.isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                  {activeChannel.status}
                </span>
              </div>

              <p className="text-[13px] text-[#5C544E] leading-relaxed">
                {activeChannel.description}
              </p>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={onScrollToChat}
                  className="inline-flex items-center gap-2 rounded-full bg-[#161412] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#9E7B66] transition-colors cursor-pointer"
                >
                  <span>
                    {activeChannel.isActive
                      ? 'Coba Website Sekarang'
                      : 'Coba versi aktif di Website'}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
