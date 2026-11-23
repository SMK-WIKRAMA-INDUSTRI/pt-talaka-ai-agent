import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  ChevronRight,
  Heart,
  Package,
  Ruler,
  Sparkles,
} from 'lucide-react';
import { gsap } from 'gsap';
import talakaLogo from '../assets/talaka-logo.svg';

const PHONE_FEATURES = [
  {
    id: 'sizing',
    num: '01',
    shortLabel: 'Ukuran',
    title: 'Panduan Ukuran TB & BB',
    summary:
      'Cukup sebutkan tinggi dan berat badan. Talaka mencocokkan ukuran paling pas dengan potongan tiap baju agar tidak salah beli.',
    ctaLabel: 'Coba hitung ukuran saya',
    prompt: 'TB saya 160 cm, BB 52 kg. Cocok ukuran apa untuk Kemeja Linen Talaka?',
    icon: Ruler,
  },
  {
    id: 'honest',
    num: '02',
    shortLabel: 'Gaya Jujur',
    title: 'Evaluasi Gaya yang Jujur',
    summary:
      'Tidak asal memuji semua pilihan. Talaka memberi catatan proporsi tubuh dan saran styling yang realistis sebelum Anda checkout.',
    ctaLabel: 'Minta saran padu padan',
    prompt: 'Kalau aku pakai Kemeja Linen dengan Celana Kulot High-Waist cocok nggak? TB 155 cm.',
    icon: Heart,
  },
  {
    id: 'stock',
    num: '03',
    shortLabel: 'Stok Live',
    title: 'Cek Stok Langsung Etalase',
    summary:
      'Tersambung langsung dengan data stok toko. Pelanggan langsung tahu warna dan ukuran apa yang tersisa tanpa perlu menunggu admin.',
    ctaLabel: 'Tanya stok tersedia',
    prompt: 'Outer Cardigan atau Kemeja Linen ukuran M masih ready stok nggak kak?',
    icon: Package,
  },
  {
    id: 'tryon',
    num: '04',
    shortLabel: 'Try-On',
    title: 'Virtual Try-On & Lookbook',
    summary:
      'Unggah foto baju atau lihat rekomendasi padu padan lengkap yang bisa langsung diunduh menjadi lookbook PDF pribadi.',
    ctaLabel: 'Buka Virtual Try-On',
    prompt: 'Buatkan rekomendasi OOTD santai tapi rapi buat ngampus pakai koleksi Talaka dong!',
    icon: Camera,
  },
];

export default function FeaturePhoneShowcase({ onSelectSamplePrompt, onScrollToChat }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const screenRef = useRef(null);
  const directionRef = useRef(1);

  const selectFeature = (nextIdx) => {
    if (nextIdx === activeIdx) return;
    directionRef.current = nextIdx > activeIdx ? 1 : -1;
    setActiveIdx(nextIdx);
  };

  const handlePrev = () => {
    directionRef.current = -1;
    setActiveIdx((prev) => (prev - 1 + PHONE_FEATURES.length) % PHONE_FEATURES.length);
  };

  const handleNext = () => {
    directionRef.current = 1;
    setActiveIdx((prev) => (prev + 1) % PHONE_FEATURES.length);
  };

  useEffect(() => {
    if (!screenRef.current) return;
    const dir = directionRef.current;
    gsap.fromTo(
      screenRef.current,
      { opacity: 0, x: dir * 24 },
      { opacity: 1, x: 0, duration: 0.42, ease: 'power3.out', overwrite: 'auto' }
    );
  }, [activeIdx]);

  const current = PHONE_FEATURES[activeIdx];

  return (
    <section id="fitur-utama" className="relative py-24 sm:py-28 bg-[#FAF7F4]">
      {/* Soft feathered transition from white catalog */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white via-white/75 to-transparent blur-sm"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* ─── LEFT: Editorial Copy & Interactive Feature Switcher ─── */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9E7B66]">
                Pengalaman Konsultasi
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-tight text-[#141210] leading-[1.14]">
                Bukan sekadar balasan otomatis.{' '}
                <span className="italic font-normal text-[#8E6B56]">
                  Stylist pribadi di layar Anda.
                </span>
              </h2>
              <p className="text-sm text-[#5C544E] leading-relaxed max-w-md">
                Pilih salah satu fitur di bawah atau geser langsung di pratinjau ponsel untuk melihat cara Talaka membantu pembeli memilih baju.
              </p>
            </div>

            {/* Clean Hairline Feature Selector (No Slop Cards) */}
            <div className="border-t border-[#E6DDD4] divide-y divide-[#E6DDD4]">
              {PHONE_FEATURES.map((feat, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={feat.id}
                    type="button"
                    onClick={() => selectFeature(idx)}
                    className={`w-full text-left py-4 transition-all cursor-pointer group ${
                      isActive ? 'opacity-100' : 'opacity-65 hover:opacity-95'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-baseline gap-4">
                        <span
                          className={`text-xs font-medium tabular-nums transition-colors ${
                            isActive ? 'text-[#9E7B66]' : 'text-[#A3988E]'
                          }`}
                        >
                          {feat.num}
                        </span>
                        <div className="space-y-1.5">
                          <h3 className="text-base font-semibold text-[#141210] tracking-tight">
                            {feat.title}
                          </h3>
                          {isActive && (
                            <p className="text-[13px] text-[#5C544E] leading-relaxed pr-4">
                              {feat.summary}
                            </p>
                          )}
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 mt-1 shrink-0 transition-transform duration-300 ${
                          isActive
                            ? 'text-[#9E7B66] translate-x-1'
                            : 'text-[#B5AAA0] group-hover:translate-x-0.5'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Direct CTA into Live Studio */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                type="button"
                onClick={() => {
                  onSelectSamplePrompt?.(current.prompt);
                  onScrollToChat?.();
                }}
                className="inline-flex items-center gap-2.5 rounded-full bg-[#161412] px-6 py-3 text-xs font-semibold text-white hover:bg-[#9E7B66] transition-colors cursor-pointer"
              >
                <span>{current.ctaLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Prev / Next Feature Switcher Controls */}
              <div className="inline-flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Fitur sebelumnya"
                  className="h-10 w-10 rounded-full border border-[#DED4CA] bg-white/80 text-[#161412] hover:border-[#9E7B66] hover:text-[#9E7B66] transition-colors flex items-center justify-center cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Fitur berikutnya"
                  className="h-10 w-10 rounded-full border border-[#DED4CA] bg-white/80 text-[#161412] hover:border-[#9E7B66] hover:text-[#9E7B66] transition-colors flex items-center justify-center cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Sculpted Interactive Phone Mockup ─── */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative">
              {/* Soft warm shadow behind phone */}
              <div
                aria-hidden="true"
                className="absolute -inset-6 rounded-[60px] bg-[#9E7B66]/12 blur-3xl pointer-events-none"
              />

              {/* Phone Body */}
              <div className="relative w-[308px] sm:w-[330px] rounded-[48px] bg-[#181615] p-[11px] shadow-[0_32px_70px_-15px_rgba(20,18,16,0.32)] ring-1 ring-white/15">
                {/* Side hardware buttons */}
                <div className="absolute -left-[3px] top-24 h-8 w-[3px] rounded-l bg-[#2B2725]" />
                <div className="absolute -left-[3px] top-36 h-12 w-[3px] rounded-l bg-[#2B2725]" />
                <div className="absolute -right-[3px] top-32 h-16 w-[3px] rounded-r bg-[#2B2725]" />

                {/* Inner Screen */}
                <div className="relative h-[590px] w-full rounded-[38px] bg-[#FAF8F5] overflow-hidden flex flex-col">
                  {/* Status Bar + Dynamic Island */}
                  <div className="relative flex items-center justify-between px-6 pt-3.5 pb-2 text-[11px] font-semibold text-[#181615] shrink-0">
                    <span>9:41</span>
                    <div className="h-[22px] w-[84px] rounded-full bg-[#141210]" />
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-[#181615]" />
                      <span className="h-2.5 w-4 rounded-[3px] border border-[#181615] p-[1.5px] flex">
                        <span className="w-full h-full bg-[#181615] rounded-[1px]" />
                      </span>
                    </div>
                  </div>

                  {/* App Header inside Phone */}
                  <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#EAE2D9] shrink-0">
                    <div className="flex items-center gap-2.5">
                      <img src={talakaLogo} alt="Talaka" className="h-6 w-auto object-contain" />
                      <div>
                        <p className="text-xs font-bold text-[#181615] leading-tight">Kak Tala</p>
                        <p className="text-[10px] text-[#8E6B56]">Fashion Concierge</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-[#7A6F67] bg-white px-2.5 py-0.5 rounded-full border border-[#E6DDD4]">
                      {current.num} / 04
                    </span>
                  </div>

                  {/* Animated Feature Screen Body */}
                  <div className="flex-1 overflow-hidden px-4 py-4 flex flex-col justify-between">
                    <div ref={screenRef} className="space-y-3">
                      {activeIdx === 0 && (
                        <>
                          {/* User bubble */}
                          <div className="ml-auto max-w-[82%] rounded-2xl rounded-br-sm bg-[#181615] px-3.5 py-2.5 text-[11.5px] leading-relaxed text-white">
                            Kak, TB aku 160 cm BB 52 kg. Kemeja Linen ambil ukuran apa ya?
                          </div>
                          {/* AI Sizing Card */}
                          <div className="rounded-2xl bg-white border border-[#E7DFD7] p-3.5 space-y-3 shadow-[0_6px_18px_rgba(20,18,16,0.04)]">
                            <div className="flex items-center gap-3">
                              <img
                                src="/images/kemeja-linen.jpg"
                                alt="Kemeja Linen"
                                className="h-12 w-12 rounded-xl object-cover shrink-0"
                              />
                              <div>
                                <p className="text-[11px] font-semibold text-[#181615]">
                                  Kemeja Linen Talaka
                                </p>
                                <p className="text-[10px] text-[#7A6F67]">
                                  Potongan relaxed · katun linen
                                </p>
                              </div>
                            </div>
                            <div className="rounded-xl bg-[#FAF7F4] p-2.5 flex items-center justify-between">
                              <div>
                                <p className="text-[10px] text-[#7A6F67]">Rekomendasi pas</p>
                                <p className="text-sm font-bold text-[#181615]">Ukuran M</p>
                              </div>
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#9E7B66] px-2.5 py-1 text-[10px] font-semibold text-white">
                                <Check className="w-3 h-3" /> Pas di bahu
                              </span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-[#524B45]">
                              Untuk TB 160 / BB 52, ukuran <strong>M</strong> memberi ruang gerak lega di dada (LD 102 cm) tanpa terlihat kebesaran.
                            </p>
                          </div>
                        </>
                      )}

                      {activeIdx === 1 && (
                        <>
                          <div className="ml-auto max-w-[84%] rounded-2xl rounded-br-sm bg-[#181615] px-3.5 py-2.5 text-[11.5px] leading-relaxed text-white">
                            Kalau Kemeja Linen dipadukan dengan Kulot High-Waist kelihatan pendek gak?
                          </div>
                          <div className="rounded-2xl bg-white border border-[#E7DFD7] p-3.5 space-y-3 shadow-[0_6px_18px_rgba(20,18,16,0.04)]">
                            <div className="flex items-center gap-2.5">
                              <img
                                src="/images/celana-kulot.jpg"
                                alt="Celana Kulot"
                                className="h-12 w-12 rounded-xl object-cover shrink-0"
                              />
                              <div>
                                <p className="text-[11px] font-semibold text-[#181615]">
                                  Catatan Jujur Proporsi
                                </p>
                                <p className="text-[10px] text-[#9E7B66]">
                                  Saran styling untuk TB 155–162 cm
                                </p>
                              </div>
                            </div>
                            <p className="text-[11.5px] leading-relaxed text-[#463F3A]">
                              Jujur, kalau kemejanya dibiarkan keluar penuh memang bisa bikin siluet tampak turun.
                            </p>
                            <div className="rounded-xl bg-[#FAF7F4] border-l-2 border-[#9E7B66] px-3 py-2 text-[11px] text-[#181615] leading-relaxed">
                              <strong>Solusi:</strong> Masukkan bagian depan kemeja (<em>French tuck</em>) ke pinggang kulot high-waist supaya kaki langsung terlihat lebih jenjang.
                            </div>
                          </div>
                        </>
                      )}

                      {activeIdx === 2 && (
                        <>
                          <div className="ml-auto max-w-[82%] rounded-2xl rounded-br-sm bg-[#181615] px-3.5 py-2.5 text-[11.5px] leading-relaxed text-white">
                            Outer Cardigan warna Mocca ukuran M masih ada stok nggak?
                          </div>
                          <div className="rounded-2xl bg-white border border-[#E7DFD7] p-3.5 space-y-3 shadow-[0_6px_18px_rgba(20,18,16,0.04)]">
                            <div className="flex items-center gap-3">
                              <img
                                src="/images/outer-cardigan.jpg"
                                alt="Outer Cardigan"
                                className="h-12 w-12 rounded-xl object-cover shrink-0"
                              />
                              <div>
                                <p className="text-[11px] font-semibold text-[#181615]">
                                  Outer Boxy Cardigan
                                </p>
                                <p className="text-[10px] text-[#7A6F67]">Rp 279.000 · Mocca</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-1.5 text-center">
                              {[
                                { s: 'S', avail: true },
                                { s: 'M', avail: true, pick: true },
                                { s: 'L', avail: true },
                                { s: 'XL', avail: false },
                              ].map((sz) => (
                                <div
                                  key={sz.s}
                                  className={`rounded-lg py-2 text-[11px] font-semibold border ${
                                    sz.pick
                                      ? 'bg-[#9E7B66] text-white border-[#9E7B66]'
                                      : sz.avail
                                        ? 'bg-[#FAF7F4] text-[#181615] border-[#E7DFD7]'
                                        : 'bg-slate-100 text-slate-400 border-transparent line-through'
                                  }`}
                                >
                                  {sz.s}
                                </div>
                              ))}
                            </div>
                            <p className="text-[11px] leading-relaxed text-[#524B45]">
                              Ukuran <strong>M</strong> masih tersedia di etalase saat ini dan siap dikirim hari ini juga.
                            </p>
                          </div>
                        </>
                      )}

                      {activeIdx === 3 && (
                        <>
                          <div className="rounded-2xl overflow-hidden bg-white border border-[#E7DFD7] shadow-[0_6px_18px_rgba(20,18,16,0.04)]">
                            <div className="relative h-40 w-full overflow-hidden">
                              <img
                                src="/images/midi-dress.jpg"
                                alt="Virtual Try-On Preview"
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />
                              <span className="absolute bottom-2.5 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold text-[#181615]">
                                <Sparkles className="w-3 h-3 text-[#9E7B66]" />
                                Pratinjau Virtual Try-On
                              </span>
                            </div>
                            <div className="p-3.5 space-y-2">
                              <p className="text-xs font-semibold text-[#181615]">
                                Midi Dress Linen + Sneaker Mocca
                              </p>
                              <p className="text-[11px] text-[#5C544E] leading-relaxed">
                                Unggah foto tubuh &amp; pilihan baju untuk melihat hasil padu padan, lalu simpan langsung sebagai Lookbook PDF.
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Quick Hint + Inside-Phone Switcher Hint */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectSamplePrompt?.(current.prompt);
                          onScrollToChat?.();
                        }}
                        className="w-full rounded-xl bg-[#181615] py-2.5 text-[11px] font-semibold text-white hover:bg-[#9E7B66] transition-colors cursor-pointer"
                      >
                        Coba langsung di chat →
                      </button>
                    </div>
                  </div>

                  {/* Inside-Phone Feature Tab Bar (Tap to switch features!) */}
                  <div className="px-3 pb-3 pt-2 bg-white border-t border-[#EAE2D9] shrink-0">
                    <div className="grid grid-cols-4 gap-1">
                      {PHONE_FEATURES.map((feat, idx) => {
                        const Icon = feat.icon;
                        const isActive = idx === activeIdx;
                        return (
                          <button
                            key={feat.id}
                            type="button"
                            onClick={() => selectFeature(idx)}
                            className={`flex flex-col items-center gap-1 rounded-xl py-1.5 transition-all cursor-pointer ${
                              isActive
                                ? 'bg-[#FAF7F4] text-[#9E7B66]'
                                : 'text-[#8C8279] hover:text-[#181615]'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-[9.5px] font-semibold leading-none">
                              {feat.shortLabel}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {/* Home Indicator */}
                    <div className="mx-auto mt-2.5 h-1 w-24 rounded-full bg-[#181615]/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
