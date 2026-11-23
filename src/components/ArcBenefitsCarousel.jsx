import React, { useCallback, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  HeartHandshake,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrendingDown,
} from 'lucide-react';
import { gsap } from 'gsap';

const ARC_CARDS = [
  {
    id: 'speed',
    code: '01',
    title: 'Jawab < 5 Detik',
    desc: 'Pertanyaan ongkir, bahan, COD, hingga cek stok langsung terjawab seketika tanpa antre admin.',
    cta: 'Coba Sekarang',
    prompt: 'Halo Kak Tala, ongkir ke Bandung berapa dan bisa COD nggak?',
    gradient: 'from-[#F6E6B4] via-[#EFE0B0] to-[#DFCA8A]',
    textTone: 'text-[#2C2412]',
    subTone: 'text-[#544626]',
    icon: Clock,
  },
  {
    id: 'returns',
    code: '02',
    title: 'Retur Turun 24%',
    desc: 'Evaluasi tinggi & berat badan mencegah pembeli salah pilih size jauh sebelum tombol checkout.',
    cta: 'Cek Ukuran',
    prompt: 'TB saya 162 cm, BB 54 kg. Celana Kulot High-Waist cocok ukuran apa ya?',
    gradient: 'from-[#9EB5BE] via-[#B4C1C4] to-[#7D919A]',
    textTone: 'text-[#142026]',
    subTone: 'text-[#2E404A]',
    icon: TrendingDown,
  },
  {
    id: 'auto',
    code: '03',
    title: '70%+ Otomatis',
    desc: 'Chat berulang harian terselesaikan otomatis sehingga tim toko fokus mengurus pengiriman & pesanan.',
    cta: 'Buka Studio',
    prompt: 'Kemeja Linen Talaka bahannya adem dan gampang kusut nggak kak?',
    gradient: 'from-[#E5D7F4] via-[#C6BFE0] to-[#7E85A8]',
    textTone: 'text-[#1E1A2E]',
    subTone: 'text-[#3D3759]',
    icon: Sparkles,
  },
  {
    id: 'alwayson',
    code: '04',
    title: 'Aktif 24 Jam',
    desc: 'Tetap ramah melayani pengunjung lewat tengah malam agar calon pembeli tidak pindah ke toko lain.',
    cta: 'Tanya Kak Tala',
    prompt: 'Bisa bantu pilihkan outfit buat acara kondangan semi-formal?',
    gradient: 'from-[#ECDAD6] via-[#E1CAC3] to-[#C8A79D]',
    textTone: 'text-[#2A1D19]',
    subTone: 'text-[#573F38]',
    icon: HeartHandshake,
  },
  {
    id: 'privacy',
    code: '05',
    title: 'Privasi Terjaga',
    desc: 'Data ukuran tubuh dan foto Virtual Try-On dijaga aman khusus untuk sesi konsultasi pribadi.',
    cta: 'Virtual Try-On',
    prompt: 'Aku mau coba fitur Virtual Try-On buat lihat cocok tidaknya baju Talaka.',
    gradient: 'from-[#D7E4D8] via-[#BFCFC0] to-[#8EA594]',
    textTone: 'text-[#18261C]',
    subTone: 'text-[#334A3A]',
    icon: ShieldCheck,
  },
  {
    id: 'checkout',
    code: '06',
    title: 'Checkout Yakin',
    desc: 'Pembeli memahami karakter kain, ukuran pas, dan padu padan terbaik sebelum memutuskan bayar.',
    cta: 'Lihat Demo',
    prompt: 'Rekomendasikan 1 set atasan dan bawahan yang paling laris di Talaka dong!',
    gradient: 'from-[#E9D8C8] via-[#DAC2AE] to-[#B6947D]',
    textTone: 'text-[#261B14]',
    subTone: 'text-[#4F3B2E]',
    icon: ShoppingBag,
  },
];

// Duplicate ring (12 slots) so wrap-around occurs far off-screen (±1470px) for a 100% seamless infinite arc loop
const RING_ITEMS = [
  ...ARC_CARDS.map((c) => ({ ...c, ringKey: `${c.id}-a` })),
  ...ARC_CARDS.map((c) => ({ ...c, ringKey: `${c.id}-b` })),
];

export default function ArcBenefitsCarousel({ onSelectSamplePrompt, onScrollToChat }) {
  const stageRef = useRef(null);
  const cardRefs = useRef([]);

  // Continuous physics/scroll state driven by gsap.ticker (zero React re-renders per frame!)
  const loopStateRef = useRef({
    progress: 0, // continuously increases → cards glide right-to-left seamlessly
    speedFactor: 1, // smoothly eases down on hover so buttons are easy to click
    nudge: 0, // smooth offset added by arrows or drag
    isDragging: false,
    dragStartX: 0,
    dragStartNudge: 0,
  });

  const nudgeBy = useCallback((deltaCards) => {
    const st = loopStateRef.current;
    gsap.to(st, {
      nudge: st.nudge + deltaCards,
      duration: 0.75,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  }, []);

  useEffect(() => {
    const total = RING_ITEMS.length;
    const half = total / 2;
    const BASE_SPEED = 0.24; // cards per second (smooth, relaxed right-to-left flow)

    const tick = (_time, deltaTimeMs) => {
      const stage = stageRef.current;
      if (!stage) return;

      const st = loopStateRef.current;
      const dt = Math.min(deltaTimeMs / 1000, 0.05); // clamp dt on tab switch

      if (!st.isDragging) {
        st.progress += BASE_SPEED * st.speedFactor * dt;
      }

      const stageW = stage.clientWidth || 1200;
      const isMobile = stageW < 640;
      const spacingX = isMobile ? 215 : 254;
      const dropFactor = isMobile ? 18 : 24;
      const rotStep = isMobile ? 7.5 : 9.5;

      const currentPos = st.progress + st.nudge;

      for (let i = 0; i < total; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        // Wrap offset continuously into [-half, +half)
        let offset = (i - currentPos) % total;
        if (offset < -half) offset += total;
        if (offset >= half) offset -= total;

        const absOff = Math.abs(offset);

        // Smooth continuous circular arc trajectory
        const x = offset * spacingX;
        const y = absOff * absOff * dropFactor;
        const rotation = offset * rotStep;
        const scale = Math.max(0.84, 1 - absOff * 0.042);

        // Softly hide far off-screen cards during wrap-around
        const opacity = absOff > 3.6 ? 0 : absOff > 2.6 ? Math.max(0, 1 - (absOff - 2.6)) : 1;
        const zIndex = Math.round(40 - absOff * 6);

        el.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px), calc(-50% + ${y.toFixed(2)}px), 0) rotate(${rotation.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = String(zIndex);
        el.style.pointerEvents = opacity > 0.2 ? 'auto' : 'none';
      }
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, []);

  const handleStageHover = (hovering) => {
    gsap.to(loopStateRef.current, {
      speedFactor: hovering ? 0.14 : 1,
      duration: 0.45,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const onPointerDown = (e) => {
    // Allow normal clicks on CTA buttons without capturing drag
    if (e.target.closest('button')) return;
    const st = loopStateRef.current;
    st.isDragging = true;
    st.dragStartX = e.clientX;
    st.dragStartNudge = st.nudge;
  };

  const onPointerMove = (e) => {
    const st = loopStateRef.current;
    if (!st.isDragging) return;
    const dx = e.clientX - st.dragStartX;
    const spacingX = (stageRef.current?.clientWidth || 1200) < 640 ? 215 : 254;
    st.nudge = st.dragStartNudge - dx / spacingX;
  };

  const onPointerUp = () => {
    loopStateRef.current.isDragging = false;
  };

  return (
    <section id="manfaat-toko" className="relative py-24 sm:py-28 bg-white overflow-x-clip">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FAF7F4] via-white/75 to-transparent blur-sm"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {/* Clean Editorial Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
          <div className="space-y-3 max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9E7B66]">
              Keunggulan Talaka
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[#141210] leading-[1.15]">
              Pelayanan yang tenang, cepat,{' '}
              <span className="italic font-normal text-[#8E6B56]">
                dan membuat pembeli yakin.
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => nudgeBy(-1)}
              aria-label="Geser ke kanan"
              className="h-10 w-10 rounded-full border border-[#E2D8CE] bg-white text-[#141210] hover:border-[#9E7B66] hover:text-[#9E7B66] transition-colors flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => nudgeBy(1)}
              aria-label="Geser ke kiri"
              className="h-10 w-10 rounded-full border border-[#E2D8CE] bg-white text-[#141210] hover:border-[#9E7B66] hover:text-[#9E7B66] transition-colors flex items-center justify-center cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Endless Continuous Right-to-Left Curved Arc Stage */}
      <div
        ref={stageRef}
        onMouseEnter={() => handleStageHover(true)}
        onMouseLeave={() => {
          handleStageHover(false);
          onPointerUp();
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="relative w-full h-[430px] sm:h-[470px] select-none cursor-grab active:cursor-grabbing overflow-hidden"
      >
        {RING_ITEMS.map((card, idx) => {
          const Icon = card.icon;

          return (
            <div
              key={card.ringKey}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              className={`absolute left-1/2 top-[41%] w-[215px] sm:w-[238px] h-[285px] sm:h-[310px] rounded-[24px] bg-gradient-to-br ${card.gradient} p-6 flex flex-col items-center justify-between text-center shadow-[0_22px_45px_-14px_rgba(20,18,16,0.18)] ring-1 ring-white/50 will-change-transform`}
            >
              {/* Soft glossy top sheen */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-b from-white/40 via-transparent to-black/5"
              />

              {/* Top Icon & Code */}
              <div className="relative z-10 flex flex-col items-center gap-2 pt-1">
                <div className="h-9 w-9 rounded-full bg-white/45 backdrop-blur-xs flex items-center justify-center shadow-2xs">
                  <Icon className={`w-4 h-4 ${card.textTone}`} />
                </div>
                <span className={`text-[10px] font-bold tracking-[0.2em] uppercase opacity-65 ${card.textTone}`}>
                  Card {card.code}
                </span>
              </div>

              {/* Center Title & Copy */}
              <div className="relative z-10 space-y-2 px-1">
                <h3 className={`text-xl font-extrabold tracking-tight leading-tight ${card.textTone}`}>
                  {card.title}
                </h3>
                <p className={`text-[11.5px] leading-relaxed font-medium ${card.subTone}`}>
                  {card.desc}
                </p>
              </div>

              {/* Clean White Pill CTA */}
              <button
                type="button"
                onClick={() => {
                  onSelectSamplePrompt?.(card.prompt);
                  onScrollToChat?.();
                }}
                className="relative z-10 w-full rounded-xl bg-white/95 hover:bg-white py-2.5 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[#181615] shadow-sm transition-transform hover:scale-[1.03] cursor-pointer"
              >
                {card.cta}
              </button>
            </div>
          );
        })}

        {/* Soft side fades so cards enter/exit smoothly at screen edges */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white via-white/75 to-transparent z-50"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white via-white/75 to-transparent z-50"
        />
      </div>
    </section>
  );
}
