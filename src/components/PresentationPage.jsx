import React, { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bot,
  Box,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Flame,
  Globe,
  Layers,
  MessageCircle,
  Ruler,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import talaKedip from '../assets/ekspresi/tala-kedip.svg';
import talaSenang from '../assets/ekspresi/tala-senang.svg';

const TOTAL_SLIDES = 5;

export default function PresentationPage({ onGoHome }) {
  const [slide, setSlide] = useState(0);

  const prevSlide = useCallback(() => {
    setSlide((s) => Math.max(0, s - 1));
  }, []);

  const nextSlide = useCallback(() => {
    setSlide((s) => Math.min(TOTAL_SLIDES - 1, s + 1));
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        onGoHome();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [nextSlide, prevSlide, onGoHome]);

  return (
    <div className="h-screen w-full bg-slate-950 text-slate-900 flex flex-col p-3 sm:p-5 overflow-hidden select-none">
      {/* Top Presenter Bar (Fixed height) */}
      <div className="mx-auto w-full max-w-6xl shrink-0 flex items-center justify-between gap-3 text-white/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-white p-0.5 flex items-center justify-center overflow-hidden">
            <img src={talaKedip} alt="Talaka" className="w-full h-full object-contain" />
          </div>
          <span className="text-xs font-mono font-bold tracking-wider text-white">
            TALAKA_AI · DECK_PRESENTASI
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-mono text-white/80">
            SLIDE {String(slide + 1).padStart(2, '0')} / 0{TOTAL_SLIDES}
          </span>
          <button
            type="button"
            onClick={onGoHome}
            className="inline-flex items-center gap-1.5 rounded-full bg-white text-slate-950 px-3.5 py-1.5 text-xs font-bold hover:bg-slate-200 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Live Demo</span>
          </button>
        </div>
      </div>

      {/* Main Slide Canvas (Locked 100% within viewport) */}
      <div className="mx-auto w-full max-w-6xl flex-1 min-h-0 flex items-stretch">
        <div className="relative w-full h-full rounded-3xl bg-[#faf9f6] border border-white/20 shadow-2xl overflow-hidden flex flex-col justify-between p-6 sm:p-10">
          {/* Subtle Grid & Ambient Accent */}
          <div className="absolute inset-0 bg-tech-grid opacity-55 pointer-events-none" />
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#9E7B66]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          {/* Slide Body Wrapper */}
          <div className="relative z-10 flex-1 min-h-0 overflow-y-auto flex flex-col justify-center pr-1">

          {/* ═══════════════════ SLIDE 1: COVER & POSITIONING ═══════════════════ */}
          {slide === 0 && (
            <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-mono font-bold text-slate-700 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                PT TALAKA SINAR REKAYASA · AI COMMERCE AGENT
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="h-20 w-20 rounded-3xl bg-white border border-slate-200 shadow-md p-2 flex items-center justify-center">
                  <img
                    src={talaSenang}
                    alt="Kak Tala"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left">
                  <div className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950 font-serif">
                    TALAKA<span className="text-[#9E7B66]">.ai</span>
                  </div>
                  <div className="text-xs sm:text-sm font-mono font-semibold text-slate-500">
                    CUSTOMER SERVICE · TEMAN GAYA · TREND AGENT
                  </div>
                </div>
              </div>

              <h1 className="max-w-3xl text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-snug">
                Kami Tidak Menjual Sekadar Chatbot.{' '}
                <span className="text-[#9E7B66]">
                  Kami Menjual Solusi Operasional &amp; Penjualan Toko 24/7.
                </span>
              </h1>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-2xs">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Respons Instan &lt; 5 Detik
                </span>
                <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-2xs">
                  <Ruler className="w-4 h-4 text-indigo-600" />
                  Tekan Retur Salah Ukuran
                </span>
                <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-2xs">
                  <Cpu className="w-4 h-4 text-[#9E7B66]" />
                  Siap Ekspansi Agent via MCP
                </span>
              </div>
            </div>
          )}

          {/* ═══════════════════ SLIDE 2: MASALAH & SOLUSI ═══════════════════ */}
          {slide === 1 && (
            <div className="relative z-10 flex-1 flex flex-col justify-center space-y-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-mono font-bold text-[#9E7B66]">
                  02 · PROBLEM &amp; SOLUTION
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
                  Masalah Mahal Bisnis Toko &amp; Solusi Talaka
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Masalah */}
                <div className="rounded-3xl border border-rose-200/80 bg-white p-6 space-y-4 shadow-xs">
                  <div className="text-xs font-mono font-bold text-rose-600 uppercase tracking-wider">
                    Kebocoran yang Dialami Toko Saat Ini
                  </div>
                  <ul className="space-y-3 text-sm text-slate-700">
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1 h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                      <span>
                        <strong>Lost Sales di Jam Sepi:</strong> Admin manusia
                        tidak bisa balas 24 jam → pembeli pindah ke
                        toko lain.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1 h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                      <span>
                        <strong>Rugi Ongkir Retur Salah Ukuran:</strong> Salah
                        pilih size adalah penyebab komplain dan retur terbesar
                        di fashion.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1 h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                      <span>
                        <strong>Bot Biasa Kaku &amp; Tidak Jujur:</strong> Cuma
                        jawab FAQ template atau selalu bilang{' '}
                        <em>&ldquo;bagus semua&rdquo;</em> demi terjual.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-1 h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                      <span>
                        <strong>Admin Keteteran Banyak Sosmed:</strong> Harus
                        buka chat terpisah dan tebak-tebakan barang apa yang
                        sedang ramai.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Solusi */}
                <div className="rounded-3xl border border-slate-900 bg-slate-950 text-white p-6 space-y-4 shadow-md">
                  <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    Solusi Terpadu Talaka AI
                  </div>
                  <ul className="space-y-3 text-sm text-slate-200">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Admin + Teman Gaya 24/7:</strong> Melayani
                        instan dengan empati dan kejujuran suportif soal
                        potongan &amp; proporsi.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Kalkulasi Ukuran TB/BB Presisi:</strong>{' '}
                        Validasi input dan cocokan langsung ke size chart resmi
                        toko.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Single Source of Truth:</strong> Etalase toko
                        dan otak AI membaca stok yang persis sama secara
                        real-time.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Siap Jadi Trend &amp; Channel Agent:</strong>{' '}
                        Ekspansi MCP ke TikTok, Threads, IG, WA, &amp; Telegram.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════ SLIDE 3: 6 KEUNGGULAN UTAMA WEB ═══════════════════ */}
          {slide === 2 && (
            <div className="relative z-10 flex-1 flex flex-col justify-center space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-mono font-bold text-[#9E7B66]">
                    03 · CORE ADVANTAGES (LIVE NOW)
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
                    6 Keunggulan Utama yang Sudah Berjalan
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    icon: Sparkles,
                    title: 'Kejujuran Suportif',
                    desc: 'Berani memberi saran potongan/panjang yang kurang pas tanpa merendahkan pelanggan, selalu beri alternatif.',
                  },
                  {
                    icon: Ruler,
                    title: 'Panduan Ukuran TB/BB',
                    desc: 'Validasi TB (100–220 cm) & BB (25–200 kg), hitung ukuran utama + alternatif langsung dari size chart.',
                  },
                  {
                    icon: Layers,
                    title: 'Stok Etalase Sinkron 100%',
                    desc: 'Data produk, harga, warna, dan sisa stok di etalase langsung terbaca oleh AI tanpa selisih info.',
                  },
                  {
                    icon: Box,
                    title: '3D Carousel (Three.js)',
                    desc: 'Pengunjung bisa memutar 360° dan ganti model 3D Sepatu, Kaos, & Celana langsung di halaman depan.',
                  },
                  {
                    icon: Camera,
                    title: 'Virtual Try-On (Gemini)',
                    desc: 'Unggah foto tubuh + foto baju untuk mengecek kecocokan gaya dan proporsi sebelum membeli.',
                  },
                  {
                    icon: ShieldCheck,
                    title: 'Guardrails & Human Handoff',
                    desc: 'Anti-halusinasi harga/stok, patuh privasi UU PDP, dan eskalasi otomatis ke admin beserta ringkasan.',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-2.5 shadow-2xs"
                    >
                      <div className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#9E7B66]" />
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-950">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══════════════════ SLIDE 4: PLANNING AI AGENT + MCP TREND RADAR ═══════════════════ */}
          {slide === 3 && (
            <div className="relative z-10 flex-1 flex flex-col justify-center space-y-6">
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-mono font-bold text-[#9E7B66]">
                  04 · FUTURE AI AGENT ARCHITECTURE (MCP)
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
                  Bukan Sekadar CS: AI Agent Analis Tren Viral via MCP
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                  Rencana pengembangan MCP untuk menghubungkan agen ke{' '}
                  <strong>TikTok, Threads, dan Instagram</strong> agar AI bisa
                  membaca tren pasar dan memprediksi barang yang akan laku.
                </p>
              </div>

              {/* Architecture Flow: 3 Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
                {/* Col 1: MCP Input Sources */}
                <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
                  <div className="text-xs font-mono font-bold text-slate-500">
                    1. MCP_DATA_SOURCES
                  </div>
                  <div className="space-y-2.5">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 flex items-center gap-3">
                      <Flame className="w-5 h-5 text-rose-500 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          MCP TikTok Trend &amp; Shop
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Pantau produk viral, FYP fashion, &amp; live demand
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-slate-900 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          MCP Threads &amp; Instagram
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Analisis diskusi gaya, komentar, &amp; wishlist netizen
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 flex items-center gap-3">
                      <Globe className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          MCP Chat (WA, Tele, Web)
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Data pertanyaan ukuran &amp; stok pelanggan harian
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Col 2: Talaka Agent Brain */}
                <div className="rounded-3xl border border-slate-900 bg-slate-950 text-white p-6 flex flex-col justify-center items-center text-center space-y-4 shadow-md">
                  <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <Bot className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-mono font-bold text-[#9E7B66]">
                      2. TALAKA_AGENT_ORCHESTRATOR
                    </div>
                    <h3 className="text-lg font-extrabold">
                      Analisis Tren × Stok Toko
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Menggabungkan sinyal viral dari{' '}
                    <strong>TikTok, Threads, &amp; IG</strong> dengan histori
                    pertanyaan chat dan stok gudang untuk menghasilkan keputusan
                    bisnis otomatis.
                  </p>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 px-3 py-1 text-[11px] font-mono text-emerald-300">
                    <TrendingUp className="w-3.5 h-3.5" />
                    VIRAL_SCORE &amp; DEMAND_FORECAST
                  </div>
                </div>

                {/* Col 3: Actionable Outputs */}
                <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
                  <div className="text-xs font-mono font-bold text-slate-500">
                    3. ACTIONABLE_AGENT_OUTPUT
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3 space-y-1">
                      <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <BarChart3 className="w-4 h-4 text-emerald-600" />
                        Deteksi Barang Kemungkinan Laku
                      </div>
                      <p className="text-emerald-900/80 leading-relaxed">
                        Skoring produk/warna/cutting yang sedang naik daun di
                        TikTok &amp; Threads sebelum kompetitor sadar.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 space-y-1">
                      <div className="font-bold text-slate-900">
                        Alert Restock Cerdas ke Owner
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        <em>
                          &ldquo;Kemeja Linen Putih M dicari 40x minggu ini &amp;
                          tren linen naik di IG — segera restock!&rdquo;
                        </em>
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 space-y-1">
                      <div className="font-bold text-slate-900">
                        Balas &amp; Closing Lintas Channel
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        Otomatis menawarkan produk viral yang stoknya masih
                        ready kepada pelanggan yang bertanya.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════ SLIDE 5: ROADMAP & PENUTUP ═══════════════════ */}
          {slide === 4 && (
            <div className="relative z-10 flex-1 flex flex-col justify-center space-y-6">
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-mono font-bold text-[#9E7B66]">
                  05 · ROADMAP &amp; NEXT STEP
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
                  Peta Pengembangan Menuju Full AI Agent
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="rounded-3xl border-2 border-emerald-500 bg-white p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-700">
                      FASE 1 · SEKARANG
                    </span>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold">
                      LIVE MVP
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-950">
                    Web Store &amp; Kak Tala AI
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li>• Konsultasi gaya jujur &amp; ukuran TB/BB</li>
                    <li>• Etalase produk sinkron stok live</li>
                    <li>• 3D Showcase Sepatu, Kaos, Celana</li>
                    <li>• Prototipe Virtual Try-On Gemini</li>
                  </ul>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-700">
                      FASE 2 · OMNICHANNEL
                    </span>
                    <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold">
                      MCP CHAT
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-950">
                    Koneksi WA, Tele &amp; TikTok
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li>• Gateway WA (Fonnte / Meta Cloud API)</li>
                    <li>• Telegram Bot &amp; TikTok Shop Chat</li>
                    <li>• Potong stok &amp; buat invoice otomatis</li>
                    <li>• Backend aman + database sesuai ERD</li>
                  </ul>
                </div>

                <div className="rounded-3xl border border-slate-900 bg-slate-950 text-white p-5 space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#9E7B66]">
                      FASE 3 · TREND AGENT
                    </span>
                    <span className="rounded-full bg-white/10 text-white px-2.5 py-0.5 text-[10px] font-bold">
                      MARKET AI
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold">
                    MCP Trend Hunter (TikTok/Threads/IG)
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    <li>• Scraping &amp; analisis tren viral sosmed</li>
                    <li>• Prediksi SKU &amp; warna yang akan laku</li>
                    <li>• Rekomendasi restock &amp; konten otomatis</li>
                    <li>• Dashboard analitik bisnis untuk owner</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
                <div className="space-y-0.5">
                  <div className="text-sm font-extrabold text-slate-950">
                    Siap Melihat Sistemnya Berjalan Secara Langsung?
                  </div>
                  <p className="text-xs text-slate-500">
                    Uji langsung 3D Showcase, simulasi ubah stok live, dan
                    konsultasi bersama Kak Tala.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onGoHome}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-black transition cursor-pointer shadow-sm"
                >
                  <span>Mulai Live Demo Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          </div>

          {/* Slide Bottom Controls (Fixed position & consistent buttons) */}
          <div className="relative z-10 shrink-0 pt-4 mt-3 border-t border-slate-200/80 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
              GUNAKAN PANAH KEYBOARD ← / → UNTUK PINDAH SLIDE
            </div>
            <div className="sm:hidden" />

            {/* Slide Dots */}
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: TOTAL_SLIDES }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSlide(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === slide
                      ? 'w-8 bg-slate-900'
                      : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={prevSlide}
                disabled={slide === 0}
                className="h-9 w-9 rounded-full bg-slate-900 text-white hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Slide sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                disabled={slide === TOTAL_SLIDES - 1}
                className="h-9 w-9 rounded-full bg-slate-900 text-white hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Slide berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
