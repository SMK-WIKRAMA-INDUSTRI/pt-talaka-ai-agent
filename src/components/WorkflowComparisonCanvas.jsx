import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Database,
  Image as ImageIcon,
  Info,
  MessageSquare,
  Mic,
  Sparkles,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import { gsap } from 'gsap';

const STACK_GROUPS = [
  {
    id: 'trigger',
    step: '01',
    name: 'Trigger',
    countLabel: '2 pemicu input',
    footerNote: 'Pesan teks, suara, foto & PDF',
    badgeIcon: Zap,
    // Warm Amber-Sand folder tones
    backBg: 'bg-[#D6B06C]',
    frontGradient: 'from-[#E8C88B]/92 via-[#DFB975]/95 to-[#C99F58]/98',
    frontText: 'text-[#3B2A0D]',
    frontSub: 'text-[#5C4319]/85',
    ringActive: 'ring-2 ring-[#C99F58] shadow-[0_22px_45px_-12px_rgba(201,159,88,0.45)]',
    explanationTalaka:
      'Begitu pelanggan mengirim pertanyaan—baik lewat teks santai, rekaman suara, foto baju, maupun PDF—Talaka langsung menangkap konteks kebutuhan ukuran, warna, dan gaya tanpa format kaku.',
    explanationStandard:
      'Chatbot biasa hanya merespons tombol menu atau kata kunci yang persis sama. Pesan suara, foto outfit, dan pertanyaan bahasa sehari-hari sering gagal terbaca.',
    nodes: [
      {
        id: 'chat-in',
        icon: MessageSquare,
        iconColor: 'text-[#9E7B66]',
        title: 'Pesan Pelanggan Masuk',
        chip: 'CHAT',
        chipStyle: 'bg-slate-200/80 text-slate-700',
        talakaText: '“TB 160 BB 52, Kemeja Linen cocok size apa?”',
        standardText: '“TB 160 BB 52, Kemeja Linen cocok size apa?”',
        talakaTime: '0.1 sec',
        standardTime: '0.1 sec',
        talakaStatus: 'Diterima natural',
        standardWarn: 'Kata kunci tidak cocok',
      },
      {
        id: 'multi-in',
        icon: Mic,
        iconColor: 'text-rose-500',
        title: 'Input Suara, Foto & PDF',
        chip: 'MULTI',
        chipStyle: 'bg-rose-50 border border-rose-200 text-rose-600',
        talakaText: 'Deepgram STT · Upload Foto Baju · Ekstrak PDF',
        standardText: 'Hanya mendukung teks statis',
        talakaTime: '0.2 sec',
        standardTime: '—',
        talakaStatus: 'Multimodal aktif',
        standardWarn: 'Tidak didukung',
      },
    ],
  },
  {
    id: 'action',
    step: '02',
    name: 'Action',
    countLabel: '2 mesin proses',
    footerNote: 'Supabase live & Stylist AI',
    badgeIcon: Sparkles,
    // Rich Slate-Blue / Dusty Denim folder tones (echoing Photo 2!)
    backBg: 'bg-[#466C91]',
    frontGradient: 'from-[#638BB2]/92 via-[#527AA1]/95 to-[#3F658A]/98',
    frontText: 'text-white',
    frontSub: 'text-white/80',
    ringActive: 'ring-2 ring-[#527AA1] shadow-[0_22px_45px_-12px_rgba(63,101,138,0.45)]',
    explanationTalaka:
      'Talaka langsung mengecek ketersediaan stok ukuran di database Supabase secara real-time, lalu menghitung kecocokan TB/BB terhadap potongan baju untuk memberi saran jujur.',
    explanationStandard:
      'Bot biasa tidak tersambung ke database stok maupun pemetaan proporsi tubuh—hasilnya pelanggan hanya diberi gambar tabel ukuran umum yang membingungkan.',
    nodes: [
      {
        id: 'supabase-sync',
        icon: Database,
        iconColor: 'text-emerald-600',
        title: 'Sinkronisasi Stok Etalase',
        chip: 'DB',
        chipStyle: 'bg-emerald-50 border border-emerald-200 text-emerald-700',
        talakaText: '✓ Terhubung ke Supabase Live Inventory (S/M/L/XL)',
        standardText: 'Database stok toko belum terhubung',
        talakaTime: '0.1 sec',
        standardTime: '0.0 sec',
        talakaStatus: 'Stok akurat 24/7',
        standardWarn: 'Stok tidak terhubung',
      },
      {
        id: 'stylist-ai',
        icon: Sparkles,
        iconColor: 'text-[#9E7B66]',
        title: 'Talaka Stylist AI',
        chip: 'AI',
        chipStyle: 'bg-amber-50 border border-amber-200 text-amber-800',
        talakaText: 'Evaluasi {TB 160 · BB 52} vs pola {Kemeja Linen} + saran proporsi',
        standardText: 'Balasan template: “Silakan cek tabel ukuran di etalase ya kak.”',
        talakaTime: '0.6 sec',
        standardTime: '0.1 sec',
        talakaStatus: 'Analisis jujur',
        standardWarn: 'Tanpa analisis tubuh',
      },
    ],
  },
  {
    id: 'output',
    step: '03',
    name: 'Output',
    countLabel: '2 hasil ke pembeli',
    footerNote: 'Suara, Try-On & Lookbook PDF',
    badgeIcon: CheckCircle2,
    // Warm Signature Mocca folder tones
    backBg: 'bg-[#86634E]',
    frontGradient: 'from-[#B38E77]/92 via-[#9E7B66]/95 to-[#84624E]/98',
    frontText: 'text-white',
    frontSub: 'text-white/80',
    ringActive: 'ring-2 ring-[#9E7B66] shadow-[0_22px_45px_-12px_rgba(158,123,102,0.45)]',
    explanationTalaka:
      'Pelanggan menerima rekomendasi personal dalam bentuk teks & balasan suara natural, bahkan bisa mencoba Visual Virtual Try-On dan mengunduh Lookbook PDF dalam 1 klik.',
    explanationStandard:
      'Hasil akhir hanya berupa teks kaku tanpa suara, tanpa pratinjau pemakaian baju, dan tetap memaksa pelanggan menunggu balasan admin manusia.',
    nodes: [
      {
        id: 'voice-out',
        icon: Volume2,
        iconColor: 'text-slate-800',
        title: 'Balasan Suara & Teks',
        chip: 'VOICE',
        chipStyle: 'bg-[#FAF7F4] border border-[#E6DDD4] text-[#7D5B45]',
        talakaText: 'Deepgram Voice · Gaya bicara Kak Tala ramah & solutif',
        standardText: 'Teks statis berulang & menunggu admin',
        talakaTime: '< 3.0 sec',
        standardTime: 'Manual',
        talakaStatus: 'Siap diputar',
        standardWarn: 'Tanpa audio natural',
      },
      {
        id: 'tryon-out',
        icon: ImageIcon,
        iconColor: 'text-violet-600',
        title: 'Visual Try-On & Lookbook PDF',
        chip: 'PDF',
        chipStyle: 'bg-violet-50 border border-violet-200 text-violet-700',
        talakaText: 'Pratinjau Virtual Try-On + 1 klik Export Lookbook PDF',
        standardText: 'Tidak ada Try-On maupun dokumen lookbook',
        talakaTime: '1 klik unduh',
        standardTime: '—',
        talakaStatus: 'Siap pakai',
        standardWarn: 'Fitur tidak tersedia',
      },
    ],
  },
];

export default function WorkflowComparisonCanvas({ onScrollToChat }) {
  const [viewMode, setViewMode] = useState('talaka'); // 'talaka' | 'standard'
  const [openStackId, setOpenStackId] = useState(null); // null = semua tertumpuk rapi; klik untuk membuka penjelasan
  const expandedPanelRef = useRef(null);
  const stackCardRefs = useRef({});

  const isTalaka = viewMode === 'talaka';
  const activeGroup = STACK_GROUPS.find((g) => g.id === openStackId) || null;

  // Smooth GSAP expand animation whenever a stacked folder is opened or viewMode toggles
  useEffect(() => {
    if (!expandedPanelRef.current) return;
    gsap.fromTo(
      expandedPanelRef.current,
      { opacity: 0, y: 18, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.48, ease: 'power3.out', overwrite: 'auto' }
    );
  }, [openStackId, viewMode]);

  const handleFolderHover = (id, hovering) => {
    const els = stackCardRefs.current[id];
    if (!els) return;
    const isOpen = openStackId === id;
    if (els.sheetBack) {
      gsap.to(els.sheetBack, {
        y: hovering || isOpen ? -16 : 0,
        rotation: hovering || isOpen ? -3 : -1.5,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    if (els.sheetFront) {
      gsap.to(els.sheetFront, {
        y: hovering || isOpen ? -10 : 0,
        rotation: hovering || isOpen ? 2 : 1,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    if (els.pocket) {
      gsap.to(els.pocket, {
        y: hovering || isOpen ? 3 : 0,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  return (
    <section id="perbandingan" className="relative py-24 sm:py-28 bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FAF7F4] via-white/75 to-transparent blur-sm"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 space-y-10">
        {/* Header + Interactive Mode Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9E7B66]">
              Perbandingan Alur Kerja
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[#141210] leading-[1.15]">
              Buka tumpukan alur{' '}
              <span className="italic font-normal text-[#8E6B56]">
                Talaka AI vs bot biasa.
              </span>
            </h2>
            <p className="text-sm text-[#5C544E] leading-relaxed">
              Setiap tahap tersusun rapat di dalam tumpukan folder. Klik salah satu folder untuk membuka kartu proses serta penjelasannya.
            </p>
          </div>

          {/* Toggle Switcher: Talaka AI vs Chatbot Biasa */}
          <div className="inline-flex items-center rounded-full border border-[#E6DDD4] bg-[#FAF7F4] p-1 self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('talaka')}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                isTalaka
                  ? 'bg-[#161412] text-white shadow-xs'
                  : 'text-[#6E645C] hover:text-[#141210]'
              }`}
            >
              Alur Talaka AI
            </button>
            <button
              type="button"
              onClick={() => setViewMode('standard')}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                !isTalaka
                  ? 'bg-[#161412] text-white shadow-xs'
                  : 'text-[#6E645C] hover:text-[#141210]'
              }`}
            >
              Chatbot Biasa
            </button>
          </div>
        </div>

        {/* Dotted Canvas Containing Tightly Stacked Interactive Folders (Photo 2 Inspired) */}
        <div
          className="relative rounded-[32px] border border-[#EAE2D9] p-6 sm:p-10 shadow-[0_20px_50px_-24px_rgba(20,18,16,0.10)] space-y-8"
          style={{
            backgroundColor: '#FAF9F7',
            backgroundImage: 'radial-gradient(#DDD5CC 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        >
          {/* 3 Tightly-Packed Stacked Folders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 max-w-4xl mx-auto pt-4">
            {STACK_GROUPS.map((group) => {
              const isOpen = openStackId === group.id;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() =>
                    setOpenStackId((prev) => (prev === group.id ? null : group.id))
                  }
                  onMouseEnter={() => handleFolderHover(group.id, true)}
                  onMouseLeave={() => handleFolderHover(group.id, false)}
                  aria-expanded={isOpen}
                  className="group relative mx-auto w-full max-w-[260px] h-[225px] text-left cursor-pointer focus:outline-none"
                >
                  {/* Folder Back Tab + Back Wall */}
                  <div
                    className={`absolute top-0 left-0 w-[112px] h-9 rounded-t-[18px] ${group.backBg} transition-transform duration-300`}
                  />
                  <div
                    className={`absolute top-5 inset-x-0 bottom-0 rounded-[22px] ${group.backBg} shadow-inner`}
                  />

                  {/* Stacked White Sheet 2 (Backmost card inside folder) */}
                  <div
                    ref={(el) => {
                      stackCardRefs.current[group.id] = {
                        ...stackCardRefs.current[group.id],
                        sheetBack: el,
                      };
                    }}
                    className="absolute top-[22px] inset-x-5 h-24 rounded-2xl bg-white/85 border border-black/5 shadow-sm px-3.5 py-2.5 flex items-start justify-between -rotate-1"
                  >
                    <span className="text-[10px] font-bold text-slate-500 truncate">
                      {group.nodes[1].title}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">#{group.step}B</span>
                  </div>

                  {/* Stacked White Sheet 1 (Front peeking card inside folder — Photo 2 stacked look!) */}
                  <div
                    ref={(el) => {
                      stackCardRefs.current[group.id] = {
                        ...stackCardRefs.current[group.id],
                        sheetFront: el,
                      };
                    }}
                    className="absolute top-[34px] inset-x-3.5 h-24 rounded-2xl bg-white border border-black/5 shadow-md px-3.5 py-2.5 flex items-start justify-between rotate-1"
                  >
                    <span className="text-[10.5px] font-bold text-slate-800 truncate">
                      {group.nodes[0].title}
                    </span>
                    <span className="text-[9px] font-mono text-[#9E7B66] font-bold">
                      {group.nodes[0].chip}
                    </span>
                  </div>

                  {/* Translucent Sculpted Front Folder Pocket (Photo 2 Signature Shape) */}
                  <div
                    ref={(el) => {
                      stackCardRefs.current[group.id] = {
                        ...stackCardRefs.current[group.id],
                        pocket: el,
                      };
                    }}
                    className={`absolute bottom-0 inset-x-0 h-[156px] rounded-[22px] bg-gradient-to-br ${group.frontGradient} backdrop-blur-md border-t border-white/45 p-5 flex flex-col justify-between transition-shadow duration-300 ${
                      isOpen
                        ? group.ringActive
                        : 'shadow-[0_18px_36px_-14px_rgba(20,18,16,0.28)] group-hover:shadow-[0_22px_42px_-12px_rgba(20,18,16,0.34)]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-xl font-extrabold tracking-tight leading-tight ${group.frontText}`}>
                          {group.name}
                        </p>
                        <p className={`text-xs font-medium mt-0.5 ${group.frontSub}`}>
                          {group.countLabel}
                        </p>
                      </div>
                      <span
                        className={`h-7 w-7 rounded-full border border-current/30 flex items-center justify-center ${group.frontText} opacity-80 group-hover:opacity-100 transition`}
                      >
                        <Info className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <div className={`flex items-center justify-between text-[10.5px] font-medium ${group.frontSub}`}>
                      <span className="truncate">{group.footerNote}</span>
                      <span className={`font-bold shrink-0 ml-2 ${group.frontText}`}>
                        {isOpen ? 'Terbuka ↑' : 'Buka →'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Prompt Hint when all stacks are closed */}
          {!activeGroup && (
            <div className="text-center pt-1 pb-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#E6DDD4] bg-white/90 px-4 py-1.5 text-xs font-medium text-[#6E645C] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#9E7B66]" />
                Klik salah satu tumpukan folder di atas untuk membuka isi &amp; penjelasannya
              </span>
            </div>
          )}

          {/* ── EXPANDED STACK CONTENT & EXPLANATION (Appears smoothly when a folder is opened!) ── */}
          {activeGroup && (
            <div
              ref={expandedPanelRef}
              className="rounded-3xl bg-white border border-[#E6DDD4] p-5 sm:p-7 shadow-[0_16px_40px_-16px_rgba(20,18,16,0.10)] space-y-6"
            >
              {/* Opened Folder Header + Explanation */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#EFE8E0]">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#FAF7F4] border border-[#E6DDD4] px-2.5 py-0.5 text-[10.5px] font-bold text-[#9E7B66]">
                      Tahap {activeGroup.step} · {activeGroup.name}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {isTalaka ? 'Mode: Talaka AI' : 'Mode: Chatbot Biasa'}
                    </span>
                  </div>
                  <p className="text-sm text-[#3F3833] leading-relaxed">
                    {isTalaka
                      ? activeGroup.explanationTalaka
                      : activeGroup.explanationStandard}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOpenStackId(null)}
                  className="self-start inline-flex items-center gap-1.5 rounded-full border border-[#E6DDD4] bg-[#FAF7F4] px-3 py-1.5 text-xs font-semibold text-[#5C544E] hover:bg-[#161412] hover:text-white hover:border-[#161412] transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Tutup</span>
                </button>
              </div>

              {/* 2 Unstacked Workflow Cards Inside the Opened Folder */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeGroup.nodes.map((node) => {
                  const NodeIcon = node.icon;
                  return (
                    <div
                      key={node.id}
                      className="rounded-2xl bg-[#FAF9F7] border border-[#EAE2D9] p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                          <NodeIcon className={`w-4 h-4 ${node.iconColor}`} />
                          <span>{node.title}</span>
                        </div>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${node.chipStyle}`}
                        >
                          {node.chip}
                        </span>
                      </div>

                      <div className="rounded-xl bg-white border border-slate-200/80 px-3 py-2.5 text-xs text-slate-700 leading-relaxed">
                        {isTalaka ? node.talakaText : node.standardText}
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="inline-flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3" />
                          {isTalaka ? node.talakaTime : node.standardTime}
                        </span>
                        {isTalaka ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {node.talakaStatus}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 text-[10.5px] font-semibold text-rose-600">
                            <AlertTriangle className="w-3 h-3" />
                            {node.standardWarn}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Subtle Bottom Studio CTA */}
          <div className="pt-4 border-t border-[#E6DDD4] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#6E645C]">
              {isTalaka
                ? 'Seluruh tumpukan alur di atas sudah aktif penuh di Studio Konsultasi di bawah.'
                : 'Bandingkan dengan mengklik tombol Alur Talaka AI atau coba langsung di studio.'}
            </p>
            <button
              type="button"
              onClick={onScrollToChat}
              className="inline-flex items-center gap-2 rounded-full bg-[#161412] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#9E7B66] transition-colors cursor-pointer shrink-0"
            >
              <span>Buka Studio Konsultasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
