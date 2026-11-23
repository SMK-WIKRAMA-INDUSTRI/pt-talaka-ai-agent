import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  Database,
  Eye,
  EyeOff,
  FileDown,
  FileText,
  Maximize2,
  Mic,
  Music,
  Pause,
  Play,
  RotateCcw,
  Ruler,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  XCircle,
} from 'lucide-react';
import talaKedip from '../assets/ekspresi/tala-kedip.svg';
import talaSenang from '../assets/ekspresi/tala-senang.svg';
import talaJatuhCinta from '../assets/ekspresi/tala-jatuh-cinta.svg';
import {
  hasDeepgramApiKey,
  synthesizeSpeechWithDeepgram,
} from '../services/deepgram';

const PROMO_SCENES = [
  {
    id: 'problem',
    tag: '01 · THE PROBLEM',
    title: 'Kenapa 38% Belanja Baju Online Berujung Retur?',
    durationMs: 7000,
    narration:
      'Tahukah kamu? Tiga puluh delapan persen belanja fashion online berakhir kecewa karena salah ukuran, dan chatbot toko biasa hanya menjawab template kaku.',
    subtitle:
      '“38% belanja fashion online berujung retur karena salah ukuran & chatbot toko biasa cuma jawab template kaku.”',
  },
  {
    id: 'showcase',
    tag: '02 · 3D & LIVE INVENTORY',
    title: 'Eksplorasi 3D 360° & Katalog Real-Time Supabase',
    durationMs: 7500,
    narration:
      'Kenalkan Talaka A I. Etalase fashion masa depan dengan visual tiga dimensi interaktif dan stok katalog yang tersinkron langsung secara real time di database Supabase.',
    subtitle:
      '“Kenalkan Talaka.ai — Etalase fashion 3D interaktif 360° dengan sinkronisasi stok real-time di database Supabase.”',
  },
  {
    id: 'honest-ai',
    tag: '03 · AUTO-ADAPTIVE HONESTY',
    title: 'Kak Tala: Teman Gaya AI yang Berani Jujur',
    durationMs: 8500,
    narration:
      'Bukan sekadar C S. Kak Tala menghitung proporsi tinggi dan berat badanmu secara presisi. Berani jujur kalau celana kepanjangan, lalu memberi alternatif yang paling pas.',
    subtitle:
      '“Kak Tala menghitung proporsi TB & BB secara presisi — berani jujur kalau baju kurang pas dan memberi solusi terbaik.”',
  },
  {
    id: 'smart-pdf',
    tag: '04 · SMART 2-WAY PDF & TRY-ON',
    title: 'Upload PDF Undangan Acara → Jadi Lookbook PDF!',
    durationMs: 8000,
    narration:
      'Punya undangan acara atau jadwal kerja tiga hari? Upload saja file P D F kamu. Kak Tala otomatis menyusun setlist outfit harian lengkap dengan foto katalog dan Lookbook P D F.',
    subtitle:
      '“Upload PDF undangan kerja atau jadwal acara — otomatis dianalisis jadi Lookbook PDF lengkap dengan foto produk & Virtual Try-On.”',
  },
  {
    id: 'voice-ai',
    tag: '05 · 2-WAY VOICE DEEPGRAM',
    title: 'Malas Ngetik? Ngobrol Suara 2 Arah Real-Time',
    durationMs: 7500,
    narration:
      'Malas mengetik panjang? Cukup bicara lewat mikrofon. Dengan teknologi Deepgram Voice dua arah, Kak Tala langsung mendengar dan menjawab konsultasi gayamu dengan suara natural.',
    subtitle:
      '“Malas mengetik? Bicara langsung lewat mikrofon — Deepgram Voice 2 arah mendengar dan menjawab dengan suara natural.”',
  },
  {
    id: 'finale',
    tag: '06 · THE FUTURE OF FASHION COMMERCE',
    title: 'Talaka.ai — Teman Gaya Jujur, Belanja Tanpa Ragu',
    durationMs: 7500,
    narration:
      'Talaka A I oleh P T Talaka Sinar Rekayasa. Pangkas retur ukuran hingga empat puluh persen dan tingkatkan kepercayaan pelanggan. Coba live demonya sekarang!',
    subtitle:
      '“Talaka.ai · PT Talaka Sinar Rekayasa — Pangkas retur ukuran 40% & tingkatkan konversi toko 24/7. Coba sekarang!”',
  },
];

export default function PromoVideoPage({ onGoHome, onOpenPresentation }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [sceneElapsedMs, setSceneElapsedMs] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [bgmEnabled, setBgmEnabled] = useState(true);
  const [cleanHud, setCleanHud] = useState(false);

  const audioCacheRef = useRef(new Map());
  const activeAudioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const bgmIntervalRef = useRef(null);
  const containerRef = useRef(null);
  const hasDeepgram = hasDeepgramApiKey();

  const currentScene = PROMO_SCENES[sceneIdx] || PROMO_SCENES[0];

  const stopVoiceAudio = useCallback(() => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
  }, []);

  const stopAmbientBgm = useCallback(() => {
    if (bgmIntervalRef.current) {
      clearInterval(bgmIntervalRef.current);
      bgmIntervalRef.current = null;
    }
  }, []);

  // Sintesis musik ambient sinematik lembut via Web Audio API (tanpa file mp3 eksternal)
  const playAmbientChord = useCallback(
    (chordIndex = 0) => {
      if (!bgmEnabled) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const chords = [
          [220.0, 277.18, 329.63, 440.0], // A major 7 warm
          [196.0, 246.94, 293.66, 392.0], // G major
          [174.61, 220.0, 261.63, 349.23], // F major 7
          [164.81, 207.65, 246.94, 329.63], // E major
        ];
        const notes = chords[chordIndex % chords.length];
        const now = ctx.currentTime;

        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = i % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.exponentialRampToValueAtTime(0.018 / notes.length, now + 0.6);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.4);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 3.5);
        });
      } catch {
        // Abaikan jika Web Audio diblokir
      }
    },
    [bgmEnabled]
  );

  // Pre-fetch dan putar voiceover Deepgram per scene
  const speakSceneNarration = useCallback(
    async (targetIdx) => {
      stopVoiceAudio();
      if (!voiceEnabled || !hasDeepgram) return;

      const scene = PROMO_SCENES[targetIdx];
      if (!scene) return;

      try {
        let blobUrl = audioCacheRef.current.get(scene.id);
        if (!blobUrl) {
          blobUrl = await synthesizeSpeechWithDeepgram(scene.narration);
          audioCacheRef.current.set(scene.id, blobUrl);
        }

        // Pre-fetch scene berikutnya di background agar transisi mulus
        const nextScene = PROMO_SCENES[targetIdx + 1];
        if (nextScene && !audioCacheRef.current.has(nextScene.id)) {
          synthesizeSpeechWithDeepgram(nextScene.narration)
            .then((nextUrl) => {
              audioCacheRef.current.set(nextScene.id, nextUrl);
            })
            .catch(() => {});
        }

        const audio = new Audio(blobUrl);
        activeAudioRef.current = audio;
        await audio.play();
      } catch {
        // Lanjut animasi visual meskipun voice gagal
      }
    },
    [voiceEnabled, hasDeepgram, stopVoiceAudio]
  );

  // Cleanup saat keluar halaman
  useEffect(() => {
    const cache = audioCacheRef.current;
    return () => {
      stopVoiceAudio();
      stopAmbientBgm();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
      cache.forEach((url) => URL.revokeObjectURL(url));
      cache.clear();
    };
  }, [stopVoiceAudio, stopAmbientBgm]);

  // Trigger voiceover & chord saat scene berubah dalam kondisi playing
  useEffect(() => {
    if (!isPlaying) return;
    speakSceneNarration(sceneIdx);
    playAmbientChord(sceneIdx);
  }, [sceneIdx, isPlaying, speakSceneNarration, playAmbientChord]);

  // Loop ambient chord lembut selama playing
  useEffect(() => {
    stopAmbientBgm();
    if (!isPlaying || !bgmEnabled) return;
    bgmIntervalRef.current = setInterval(() => {
      playAmbientChord(sceneIdx);
    }, 3500);
    return () => stopAmbientBgm();
  }, [isPlaying, bgmEnabled, sceneIdx, playAmbientChord, stopAmbientBgm]);

  // Timer progres per scene (60fps tick via 50ms interval)
  useEffect(() => {
    if (!isPlaying) return;
    const tickMs = 50;
    const timer = setInterval(() => {
      setSceneElapsedMs((prev) => {
        const next = prev + tickMs;
        if (next >= currentScene.durationMs) {
          if (sceneIdx < PROMO_SCENES.length - 1) {
            setSceneIdx((s) => s + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return currentScene.durationMs;
          }
        }
        return next;
      });
    }, tickMs);

    return () => clearInterval(timer);
  }, [isPlaying, sceneIdx, currentScene.durationMs]);

  // Keyboard shortcuts (Space: Play/Pause, ArrowLeft/Right: Scene, H: Clean HUD, F: Fullscreen)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (!hasStarted) {
          setHasStarted(true);
          setIsPlaying(true);
        } else {
          setIsPlaying((p) => {
            if (p) stopVoiceAudio();
            return !p;
          });
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSceneIdx((s) => Math.min(PROMO_SCENES.length - 1, s + 1));
        setSceneElapsedMs(0);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSceneIdx((s) => Math.max(0, s - 1));
        setSceneElapsedMs(0);
      } else if (e.key.toLowerCase() === 'h') {
        setCleanHud((c) => !c);
      } else if (e.key === 'Escape' && cleanHud) {
        setCleanHud(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hasStarted, cleanHud, stopVoiceAudio]);

  const handleStartShow = () => {
    setHasStarted(true);
    setSceneIdx(0);
    setSceneElapsedMs(0);
    setIsPlaying(true);
  };

  const handleRestart = () => {
    stopVoiceAudio();
    setHasStarted(true);
    setSceneIdx(0);
    setSceneElapsedMs(0);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (!hasStarted) {
      handleStartShow();
      return;
    }
    if (
      !isPlaying &&
      sceneIdx === PROMO_SCENES.length - 1 &&
      sceneElapsedMs >= currentScene.durationMs
    ) {
      handleRestart();
      return;
    }
    setIsPlaying((prev) => {
      const next = !prev;
      if (!next) stopVoiceAudio();
      return next;
    });
  };

  const handleSelectScene = (idx) => {
    setHasStarted(true);
    setSceneIdx(idx);
    setSceneElapsedMs(0);
    setIsPlaying(true);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const totalDurationMs = PROMO_SCENES.reduce((acc, s) => acc + s.durationMs, 0);
  const completedBeforeCurrentMs = PROMO_SCENES.slice(0, sceneIdx).reduce(
    (acc, s) => acc + s.durationMs,
    0
  );
  const overallProgressPct = Math.min(
    100,
    ((completedBeforeCurrentMs + sceneElapsedMs) / totalDurationMs) * 100
  );
  const sceneProgressPct = Math.min(
    100,
    (sceneElapsedMs / currentScene.durationMs) * 100
  );

  return (
    <div
      ref={containerRef}
      className="h-screen w-full bg-slate-950 text-white flex flex-col overflow-hidden select-none relative"
    >
      {/* Ambient Background Glows */}
      <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-[#9E7B66]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Top Studio Director Bar (Hidden in Clean HUD Recording Mode) */}
      {!cleanHud && (
        <header className="mx-auto w-full max-w-6xl shrink-0 flex flex-wrap items-center justify-between gap-3 px-4 pt-3 pb-2 z-30">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-white p-0.5 flex items-center justify-center overflow-hidden shadow-xs">
              <img
                src={talaKedip}
                alt="Talaka"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-white">
                  TALAKA.AI · CINEMATIC PROMO VIDEO
                </span>
                <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-rose-300 flex items-center gap-1">
                  <span
                    className={`h-1.5 w-1.5 rounded-full bg-rose-400 ${
                      isPlaying ? 'animate-ping' : ''
                    }`}
                  />
                  60FPS_SHOWCASE
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Voiceover Toggle */}
            <button
              type="button"
              onClick={() => {
                setVoiceEnabled((v) => {
                  const next = !v;
                  if (!next) stopVoiceAudio();
                  return next;
                });
              }}
              className={`rounded-full border px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                voiceEnabled
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                  : 'border-white/15 bg-white/5 text-white/50'
              }`}
              title="Toggle Voiceover Narasi AI (Deepgram TTS)"
            >
              {voiceEnabled ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">
                {voiceEnabled ? 'Voiceover ON' : 'Voiceover OFF'}
              </span>
            </button>

            {/* Ambient BGM Toggle */}
            <button
              type="button"
              onClick={() => setBgmEnabled((b) => !b)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                bgmEnabled
                  ? 'border-[#9E7B66]/50 bg-[#9E7B66]/20 text-[#E6C9B8]'
                  : 'border-white/15 bg-white/5 text-white/50'
              }`}
              title="Toggle Musik Ambient Latar"
            >
              <Music className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {bgmEnabled ? 'Musik ON' : 'Musik OFF'}
              </span>
            </button>

            {/* Clean Screen-Record Mode */}
            <button
              type="button"
              onClick={() => setCleanHud(true)}
              className="rounded-full border border-white/15 bg-white/5 hover:bg-white/15 px-3 py-1 text-xs font-semibold text-white/80 flex items-center gap-1.5 transition cursor-pointer"
              title="Sembunyikan tombol kontrol untuk Screen Recording bersih (Tekan H untuk kembali)"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mode Rekam (H)</span>
            </button>

            {/* Fullscreen */}
            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="rounded-full border border-white/15 bg-white/5 hover:bg-white/15 p-1.5 text-white/80 transition cursor-pointer"
              title="Fullscreen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onGoHome}
              className="inline-flex items-center gap-1.5 rounded-full bg-white text-slate-950 px-3.5 py-1 text-xs font-bold hover:bg-slate-200 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ke Web Utama</span>
            </button>
          </div>
        </header>
      )}

      {/* Floating button to exit Clean HUD mode */}
      {cleanHud && (
        <button
          type="button"
          onClick={() => setCleanHud(false)}
          className="fixed top-3 right-3 z-50 rounded-full bg-slate-900/70 border border-white/15 px-3 py-1 text-[11px] font-mono text-white/60 hover:text-white hover:bg-slate-900 transition cursor-pointer flex items-center gap-1.5 opacity-25 hover:opacity-100"
        >
          <Eye className="w-3 h-3" />
          <span>Tampilkan Kontrol (H)</span>
        </button>
      )}

      {/* ═══════════════════ MAIN 16:9 CINEMA STAGE ═══════════════════ */}
      <div className="mx-auto w-full max-w-6xl flex-1 min-h-0 flex items-stretch px-3 sm:px-4 py-2">
        <div className="relative w-full h-full rounded-3xl bg-[#faf9f6] text-slate-900 border border-white/20 shadow-2xl overflow-hidden flex flex-col justify-between">
          {/* Tech grid & ambient accents */}
          <div className="absolute inset-0 bg-tech-grid opacity-55 pointer-events-none" />
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[#9E7B66]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          {/* Top Watermark Inside Video Frame */}
          <div className="relative z-20 flex items-center justify-between px-6 pt-5">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-white border border-slate-200 p-0.5 flex items-center justify-center shadow-2xs">
                <img
                  src={talaKedip}
                  alt="Talaka.ai"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900">
                Talaka<span className="text-[#9E7B66]">.ai</span>
              </span>
              <span className="rounded-full bg-slate-900 text-white px-2.5 py-0.5 text-[10px] font-mono font-bold">
                {currentScene.tag}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/90 border border-slate-200 px-3 py-1 text-[11px] font-mono font-bold text-slate-700 shadow-2xs flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                PT TALAKA SINAR REKAYASA
              </span>
            </div>
          </div>

          {/* ═══════════════════ PRE-START OVERLAY (Click to Launch Show with Audio) ═══════════════════ */}
          {!hasStarted && (
            <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white">
              <div className="w-20 h-20 rounded-3xl bg-white p-2 shadow-2xl mb-5 animate-bounce">
                <img
                  src={talaSenang}
                  alt="Kak Tala"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="rounded-full border border-[#9E7B66]/50 bg-[#9E7B66]/20 px-3.5 py-1 text-xs font-mono font-bold text-[#E6C9B8] mb-3">
                OFFICIAL PRODUCT LAUNCH VIDEO · 46 DETIK
              </span>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight max-w-2xl mb-3">
                Video Promosi Interaktif{' '}
                <span className="text-[#D6B7A5]">Talaka.ai</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mb-7 leading-relaxed">
                Dilengkapi animasi 6 scene otomatis, simulasi kejujuran Kak Tala,
                konversi PDF Undangan → Lookbook PDF, dan{' '}
                <strong>Voiceover Narasi AI Otomatis (Deepgram TTS)</strong>.
              </p>
              <button
                type="button"
                onClick={handleStartShow}
                className="group inline-flex items-center gap-3 rounded-full bg-white text-slate-950 px-7 py-3.5 text-sm font-black shadow-2xl hover:bg-[#E6C9B8] transition-all cursor-pointer scale-100 hover:scale-105"
              >
                <span className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </span>
                <span>PUTAR VIDEO PROMOSI SEKARANG</span>
              </button>
              <p className="text-[11px] font-mono text-slate-400 mt-4">
                Tips: Tekan tombol <strong>H</strong> di keyboard untuk
                menyembunyikan panel bawah saat mau Screen Record (Win + Alt + R)
              </p>
            </div>
          )}

          {/* ═══════════════════ SCENE CONTENT STAGE ═══════════════════ */}
          <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-center px-6 sm:px-12 py-3 overflow-hidden">
            {/* ─────────── SCENE 1: THE PROBLEM ─────────── */}
            {sceneIdx === 0 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="text-center max-w-3xl mx-auto space-y-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 border border-rose-200 px-3.5 py-1 text-xs font-mono font-bold text-rose-800">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    MASALAH UTAMA E-COMMERCE FASHION
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950">
                    Kenapa <span className="text-rose-600">38% Belanja Baju Online</span>{' '}
                    Berakhir Retur &amp; Kecewa?
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  <div className="rounded-3xl border border-rose-200 bg-white p-5 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="rounded-xl bg-rose-50 px-2.5 py-1 text-xs font-mono font-bold text-rose-700">
                        PAIN #01
                      </span>
                      <span className="text-2xl font-black text-rose-600">38%</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Salah Ukuran &amp; Proporsi Tubuh
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Tabel size chart S/M/L membingungkan. Baju kekecilan di bahu atau
                      celana kulot kepanjangan menyapu lantai.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-amber-200 bg-white p-5 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="rounded-xl bg-amber-50 px-2.5 py-1 text-xs font-mono font-bold text-amber-700">
                        PAIN #02
                      </span>
                      <span className="text-2xl font-black text-amber-600">Asal Puji</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Chatbot Kaku &amp; Asal Jualan
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Bot biasa selalu bilang &ldquo;Cocok kak!&rdquo; demi barang laku,
                      padahal potongan baju tidak cocok dengan TB/BB pembeli.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-slate-900 bg-slate-900 text-white p-5 shadow-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="rounded-xl bg-[#9E7B66]/30 px-2.5 py-1 text-xs font-mono font-bold text-[#E6C9B8]">
                        SOLUSI TALAKA
                      </span>
                      <Sparkles className="w-5 h-5 text-[#D6B7A5]" />
                    </div>
                    <h3 className="text-sm font-bold text-white">
                      Hadirnya Kak Tala (Teman Gaya AI)
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      AI Stylist jujur berbasis proporsi nyata, 3D Showcase, Smart PDF
                      Lookbook, &amp; Voice 2 Arah!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ─────────── SCENE 2: 3D SHOWCASE & LIVE SUPABASE ─────────── */}
            {sceneIdx === 1 && (
              <div className="space-y-5 animate-in fade-in duration-500">
                <div className="text-center max-w-3xl mx-auto space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-200 px-3.5 py-1 text-xs font-mono font-bold text-emerald-800">
                    <Database className="w-3.5 h-3.5 text-emerald-600" />
                    THREE.JS 3D 360° + SUPABASE REAL-TIME DB
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950">
                    Etalase 3D Interaktif &amp; Stok Live{' '}
                    <span className="text-[#9E7B66]">100% Tersinkron</span>
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-5xl mx-auto">
                  {[
                    {
                      sku: 'SNK-006',
                      name: 'Talaka Retro Suede Mocca',
                      price: 'Rp 389.000',
                      img: '/images/sneaker-mocca.jpg',
                      badge: '3D 360° READY',
                    },
                    {
                      sku: 'KMJ-001',
                      name: 'Kemeja Linen Oversize',
                      price: 'Rp 189.000',
                      img: '/images/kemeja-linen.jpg',
                      badge: 'BEST SELLER',
                    },
                    {
                      sku: 'CLN-002',
                      name: 'Celana Kulot High-Waist',
                      price: 'Rp 219.000',
                      img: '/images/celana-kulot.jpg',
                      badge: 'HIGH-WAIST',
                    },
                    {
                      sku: 'DRS-004',
                      name: 'Midi Dress Satin Silk',
                      price: 'Rp 279.000',
                      img: '/images/midi-dress.jpg',
                      badge: 'GALA EDITION',
                    },
                  ].map((item) => (
                    <div
                      key={item.sku}
                      className="rounded-3xl border border-slate-200 bg-white p-3.5 shadow-sm flex flex-col justify-between space-y-2.5"
                    >
                      <div className="relative h-32 rounded-2xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center overflow-hidden">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="h-full w-full object-contain hover:scale-105 transition-transform"
                        />
                        <span className="absolute top-2 left-2 rounded-full bg-slate-900 text-white px-2 py-0.5 text-[9px] font-mono font-bold">
                          {item.badge}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="font-bold text-[#9E7B66]">{item.sku}</span>
                          <span className="text-emerald-600 font-bold">● LIVE_DB</span>
                        </div>
                        <div className="text-xs font-bold text-slate-900 truncate mt-0.5">
                          {item.name}
                        </div>
                        <div className="text-xs font-black text-slate-900 mt-1">
                          {item.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─────────── SCENE 3: KAK TALA HONEST AI STYLIST ─────────── */}
            {sceneIdx === 2 && (
              <div className="max-w-4xl mx-auto w-full space-y-4 animate-in fade-in duration-500">
                <div className="text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#9E7B66]/15 border border-[#9E7B66]/30 px-3.5 py-1 text-xs font-mono font-bold text-[#9E7B66]">
                    <Ruler className="w-3.5 h-3.5" />
                    AI AUTO-ADAPTIVE HONESTY · KALKULASI TB/BB PRESISI
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                    Bukan Chatbot Asal Puji —{' '}
                    <span className="text-[#9E7B66]">Kak Tala Berani Jujur!</span>
                  </h2>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md space-y-4">
                  {/* User Bubble */}
                  <div className="flex justify-end">
                    <div className="rounded-3xl rounded-br-xs bg-slate-900 text-white px-4 py-3 text-xs sm:text-sm max-w-xl shadow-xs">
                      “Kak, TB aku <strong>154 cm</strong> BB <strong>48 kg</strong>.
                      Kalau pakai <strong>Celana Kulot High-Waist (CLN-002)</strong>{' '}
                      kepanjangan nyapu lantai nggak? Jujur ya.”
                    </div>
                  </div>

                  {/* Kak Tala Honest Reply */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 p-1 shrink-0 shadow-xs">
                      <img
                        src={talaSenang}
                        alt="Kak Tala"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 rounded-3xl rounded-bl-xs border border-slate-200 bg-slate-50/80 p-4 text-xs sm:text-sm text-slate-800 space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-950">Kak Tala</span>
                        <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-mono font-bold">
                          HONEST_STYLING_ENGINE
                        </span>
                      </div>
                      <p className="leading-relaxed">
                        <strong>Jujur ya Kak:</strong> Panjang Celana Kulot{' '}
                        <strong>CLN-002 (Size S)</strong> itu <strong>100 cm</strong>. Di
                        TB 154 cm, bagian bawahnya <strong>bakal menyapu lantai</strong>{' '}
                        kalau Kakak pakai flat shoes.
                      </p>
                      <p className="leading-relaxed">
                        💡 <strong>Solusi Paling Pas:</strong> Padukan dengan{' '}
                        <strong>Talaka Chunky White (SNK-007)</strong> yang punya sol
                        4.5 cm biar jenjang, atau pilih{' '}
                        <strong>Midi Dress Satin (DRS-004) Size S</strong> (panjang 114
                        cm, jatuh anggun pas di betis tanpa permak!).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─────────── SCENE 4: SMART 2-WAY PDF & VIRTUAL TRY-ON ─────────── */}
            {sceneIdx === 3 && (
              <div className="max-w-5xl mx-auto w-full space-y-4 animate-in fade-in duration-500">
                <div className="text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 border border-blue-200 px-3.5 py-1 text-xs font-mono font-bold text-blue-800">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    SMART 2-WAY PDF PIPELINE + VIRTUAL TRY-ON AI
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                    Upload PDF Undangan Acara →{' '}
                    <span className="text-[#9E7B66]">Otomatis Jadi Lookbook PDF!</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                  {/* Left: Uploaded Event PDF */}
                  <div className="md:col-span-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#9E7B66]/15 text-[#9E7B66] flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Undangan_Summit_Bali_3Hari.pdf
                        </div>
                        <div className="text-[10px] font-mono text-emerald-600 font-bold">
                          ✓ DIEKSTRAK OTOMATIS (TANPA KETIK MANUAL)
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3 text-[11px] font-mono text-slate-700 space-y-1.5">
                      <div>• Hari 1: Business Casual Conference (Indoor AC)</div>
                      <div>• Hari 2: Sunset Networking Dinner (Semi-Formal)</div>
                      <div>• Hari 3: Creative Workshop &amp; City Tour</div>
                    </div>
                  </div>

                  {/* Center Arrow */}
                  <div className="md:col-span-1 flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Right: Generated Visual Lookbook PDF */}
                  <div className="md:col-span-5 rounded-3xl border-2 border-slate-900 bg-white p-5 shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileDown className="w-4 h-4 text-[#9E7B66]" />
                        <span className="text-xs font-black text-slate-950">
                          Talaka-Lookbook-3Hari.pdf
                        </span>
                      </div>
                      <span className="rounded-full bg-slate-900 text-white px-2.5 py-0.5 text-[9px] font-mono font-bold">
                        AUTO_GENERATED
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          day: 'HARI 1',
                          item: 'KMJ-001 + CLN-002',
                          img: '/images/kemeja-linen.jpg',
                        },
                        {
                          day: 'HARI 2',
                          item: 'DRS-004 Satin',
                          img: '/images/midi-dress.jpg',
                        },
                        {
                          day: 'HARI 3',
                          item: 'TSH-005 + SNK-006',
                          img: '/images/sneaker-mocca.jpg',
                        },
                      ].map((d) => (
                        <div
                          key={d.day}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-2 text-center space-y-1"
                        >
                          <div className="text-[9px] font-mono font-bold text-[#9E7B66]">
                            {d.day}
                          </div>
                          <img
                            src={d.img}
                            alt={d.item}
                            className="h-14 w-full object-contain mx-auto"
                          />
                          <div className="text-[10px] font-bold text-slate-900 truncate">
                            {d.item}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─────────── SCENE 5: 2-WAY VOICE DEEPGRAM ─────────── */}
            {sceneIdx === 4 && (
              <div className="max-w-4xl mx-auto w-full space-y-5 animate-in fade-in duration-500">
                <div className="text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 border border-rose-200 px-3.5 py-1 text-xs font-mono font-bold text-rose-800">
                    <Mic className="w-3.5 h-3.5 text-rose-600" />
                    DEEPGRAM NOVA-2 (STT) + AURA-2 (TTS)
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950">
                    Interaksi Suara 2 Arah{' '}
                    <span className="text-[#9E7B66]">Hands-Free &amp; Natural</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: User Speaking */}
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-[11px] font-mono font-bold text-rose-700">
                        <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />
                        USER MIC · DEEPGRAM NOVA-2 (ID)
                      </span>
                      <Mic className="w-4 h-4 text-rose-600" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900">
                      “Kak Tala, untuk kemeja linen putih ukuran M masih ready? Cocok
                      nggak dipadu sama sneaker mocca?”
                    </p>
                    {/* Animated Audio Bars */}
                    <div className="flex items-end gap-1.5 h-8 pt-1">
                      {[45, 85, 60, 100, 70, 90, 50, 80, 65, 95, 55, 75].map(
                        (h, i) => (
                          <div
                            key={i}
                            style={{ height: `${h}%` }}
                            className="flex-1 rounded-full bg-rose-500/80 animate-pulse"
                          />
                        )
                      )}
                    </div>
                  </div>

                  {/* Card 2: Kak Tala Speaking Back */}
                  <div className="rounded-3xl border border-slate-900 bg-slate-900 text-white p-5 shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 text-[11px] font-mono font-bold text-emerald-300">
                        <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                        KAK TALA VOICE · DEEPGRAM AURA-2
                      </span>
                      <Bot className="w-4 h-4 text-[#D6B7A5]" />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200">
                      “Ready banget Kak! Kemeja Linen Putih ukuran M sangat masuk
                      dipadukan dengan Sneaker Retro Suede Mocca untuk gaya Earth-Tone
                      Smart Casual!”
                    </p>
                    <div className="flex items-end gap-1.5 h-8 pt-1">
                      {[60, 95, 75, 55, 100, 80, 65, 90, 70, 85, 50, 95].map(
                        (h, i) => (
                          <div
                            key={i}
                            style={{ height: `${h}%` }}
                            className="flex-1 rounded-full bg-emerald-400 animate-pulse"
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─────────── SCENE 6: GRAND FINALE & CTA ─────────── */}
            {sceneIdx === 5 && (
              <div className="max-w-4xl mx-auto w-full text-center space-y-5 animate-in fade-in duration-500">
                <div className="w-20 h-20 rounded-3xl bg-white border border-slate-200 p-2 shadow-lg mx-auto">
                  <img
                    src={talaJatuhCinta}
                    alt="Talaka AI"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 text-white px-4 py-1 text-xs font-mono font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-[#D6B7A5]" />
                    READY FOR PRODUCTION · PT TALAKA SINAR REKAYASA
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950">
                    Talaka<span className="text-[#9E7B66]">.ai</span> — Belanja Fashion{' '}
                    <span className="underline decoration-[#9E7B66]">Tanpa Ragu</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
                    Menggabungkan 3D Showcase, Kejujuran AI Auto-Adaptive, Database
                    Real-Time Supabase, Smart 2-Way PDF Lookbook, dan Deepgram Voice 2
                    Arah dalam satu ekosistem.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto">
                  {[
                    { val: '-40%', label: 'Angka Retur Ukuran' },
                    { val: '< 3 dtk', label: 'Respon AI 24/7' },
                    { val: '2-Way', label: 'Smart PDF & Voice' },
                    { val: '100%', label: 'Stok Live Supabase' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-2xs"
                    >
                      <div className="text-lg sm:text-xl font-black text-slate-950">
                        {stat.val}
                      </div>
                      <div className="text-[11px] font-medium text-slate-500">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={onGoHome}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-6 py-3 text-xs sm:text-sm font-bold hover:bg-black transition shadow-lg cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Coba Live Demo Sekarang</span>
                  </button>
                  {onOpenPresentation && (
                    <button
                      type="button"
                      onClick={onOpenPresentation}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white text-slate-900 px-5 py-3 text-xs sm:text-sm font-bold hover:bg-slate-100 transition cursor-pointer"
                    >
                      <Activity className="w-4 h-4 text-[#9E7B66]" />
                      <span>Buka Pitch Deck</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 text-slate-700 px-4 py-3 text-xs font-bold hover:bg-slate-200 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Putar Ulang</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ═══════════════════ CINEMA SUBTITLE / CAPTION BAR ═══════════════════ */}
          <div className="relative z-20 px-6 pb-5 pt-2 flex flex-col items-center">
            <div className="w-full max-w-4xl rounded-2xl bg-slate-950/90 backdrop-blur-md text-white px-5 py-2.5 text-center shadow-lg border border-white/10">
              <p className="text-xs sm:text-sm font-medium tracking-wide text-slate-100">
                {currentScene.subtitle}
              </p>
            </div>
          </div>

          {/* Per-scene thin progress line at very bottom of video frame */}
          <div className="relative z-20 h-1.5 w-full bg-slate-200">
            <div
              className="h-full bg-slate-900 transition-all duration-75"
              style={{ width: `${overallProgressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════ BOTTOM TIMELINE & CHAPTER CONTROLS ═══════════════════ */}
      {!cleanHud && (
        <footer className="mx-auto w-full max-w-6xl shrink-0 px-4 pb-3 pt-1 flex flex-col gap-2 z-30">
          {/* Scene Chapter Pills */}
          <div className="grid grid-cols-6 gap-1.5">
            {PROMO_SCENES.map((scene, idx) => {
              const isActive = idx === sceneIdx;
              const isDone = idx < sceneIdx;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => handleSelectScene(idx)}
                  className={`group text-left rounded-xl p-2 border transition cursor-pointer relative overflow-hidden ${
                    isActive
                      ? 'border-white/40 bg-white/15 text-white'
                      : isDone
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                        : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
                  }`}
                >
                  {isActive && (
                    <div
                      className="absolute bottom-0 left-0 h-0.5 bg-[#D6B7A5] transition-all duration-75"
                      style={{ width: `${sceneProgressPct}%` }}
                    />
                  )}
                  <div className="text-[10px] font-mono font-bold truncate">
                    {scene.tag}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Playback Controls Row */}
          <div className="flex items-center justify-between text-xs text-white/70">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="inline-flex items-center gap-1.5 rounded-full bg-white text-slate-950 px-4 py-1.5 text-xs font-bold hover:bg-slate-200 transition cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 px-3 py-1.5 text-xs font-semibold text-white/80 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi</span>
              </button>
            </div>

            <div className="text-[11px] font-mono text-white/60 hidden sm:flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                SCENE 0{sceneIdx + 1} / 0{PROMO_SCENES.length} · Spasi: Play/Pause ·
                Panah ←/→: Pindah Scene · H: Mode Rekam Bersih
              </span>
            </div>

            <div className="text-xs font-mono font-bold text-[#D6B7A5]">
              {Math.round(overallProgressPct)}%
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
