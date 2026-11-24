import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  RefreshCw,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import talaKedip from '../assets/ekspresi/tala-kedip.svg';
import talaSenang from '../assets/ekspresi/tala-senang.svg';
import {
  hasDeepgramApiKey,
  speakIndonesianAuto,
  stopBrowserIndonesianSpeech,
  synthesizeSpeechWithDeepgram,
  transcribeAudioWithDeepgram,
} from '../services/deepgram';

const FILLER_PHRASES = [
  'Baik Kak, tunggu sebentar dulu ya...',
  'Oke siap Kak, sebentar ya aku cek dulu...',
  'Siap Kak, tunggu sebentar ya...',
];

function formatCallDuration(totalSec) {
  const mins = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const secs = String(totalSec % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

function VoiceCallSession({ onClose, botName, onCallTurn }) {
  const [callState, setCallState] = useState('connecting');
  const [elapsedSec, setElapsedSec] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [micLevel, setMicLevel] = useState(0);
  const [lastUserText, setLastUserText] = useState('');
  const [lastBotText, setLastBotText] = useState('');
  const [callError, setCallError] = useState('');

  const isActiveRef = useRef(false);
  const isMutedRef = useRef(false);
  const speakerOnRef = useRef(true);
  const streamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const vadRafRef = useRef(null);
  const activeAudioRef = useRef(null);
  const activeAudioUrlRef = useRef(null);
  const fillerAudioRef = useRef(null);
  const fillerUrlsRef = useRef([]);
  const fillerIndexRef = useRef(0);
  const startListeningRef = useRef(null);
  const flushOnHangUpRef = useRef(false);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    speakerOnRef.current = speakerOn;
  }, [speakerOn]);

  const stopFillerAudio = useCallback(() => {
    if (fillerAudioRef.current) {
      fillerAudioRef.current.pause();
      fillerAudioRef.current = null;
    }
  }, []);

  const playInstantFiller = useCallback(() => {
    if (!isActiveRef.current) return;
    const idx = fillerIndexRef.current % FILLER_PHRASES.length;
    fillerIndexRef.current += 1;
    const phrase = FILLER_PHRASES[idx];
    setLastBotText(phrase);

    if (!speakerOnRef.current) return;
    stopFillerAudio();

    const cachedUrl = fillerUrlsRef.current[idx] || fillerUrlsRef.current[0];
    if (cachedUrl) {
      const audio = new Audio(cachedUrl);
      fillerAudioRef.current = audio;
      audio.onended = () => {
        if (fillerAudioRef.current === audio) {
          fillerAudioRef.current = null;
        }
      };
      audio.play().catch(() => {});
    }
  }, [stopFillerAudio]);

  const stopPlayback = useCallback(() => {
    stopFillerAudio();
    if (activeAudioRef.current) {
      if (typeof activeAudioRef.current.cancel === 'function') {
        activeAudioRef.current.cancel();
      } else if (typeof activeAudioRef.current.pause === 'function') {
        activeAudioRef.current.pause();
      }
      activeAudioRef.current = null;
    }
    if (activeAudioUrlRef.current) {
      URL.revokeObjectURL(activeAudioUrlRef.current);
      activeAudioUrlRef.current = null;
    }
    stopBrowserIndonesianSpeech();
  }, [stopFillerAudio]);

  const releaseMediaResources = useCallback(() => {
    isActiveRef.current = false;
    if (vadRafRef.current) {
      cancelAnimationFrame(vadRafRef.current);
      vadRafRef.current = null;
    }
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      try {
        recorderRef.current.stop();
      } catch {
        // Abaikan jika sudah berhenti
      }
    }
    recorderRef.current = null;
    stopPlayback();

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
  }, [stopPlayback]);

  const speakAndThen = useCallback(
    async (text, nextStep) => {
      if (!isActiveRef.current) return;
      if (!speakerOnRef.current) {
        nextStep?.();
        return;
      }

      stopPlayback();
      setCallState('speaking');
      try {
        const controller = await speakIndonesianAuto(text, {
          onEnd: () => {
            stopPlayback();
            if (isActiveRef.current) nextStep?.();
          },
          onError: () => {
            stopPlayback();
            if (isActiveRef.current) nextStep?.();
          },
        });
        if (!isActiveRef.current) {
          controller.cancel();
          return;
        }
        activeAudioRef.current = controller;
      } catch {
        stopPlayback();
        if (isActiveRef.current) nextStep?.();
      }
    },
    [stopPlayback]
  );

  const startListeningTurn = useCallback(() => {
    if (!isActiveRef.current || !streamRef.current) return;

    if (isMutedRef.current) {
      setCallState('muted');
      return;
    }

    setCallState('listening');
    setCallError('');

    const preferredMime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : '';

    const recorder = preferredMime
      ? new MediaRecorder(streamRef.current, { mimeType: preferredMime })
      : new MediaRecorder(streamRef.current);

    chunksRef.current = [];
    recorderRef.current = recorder;

    let hasSpoken = false;
    let lastVoiceAt = Date.now();
    const startedAt = Date.now();
    let stoppedManually = false;

    recorder.ondataavailable = (ev) => {
      if (ev.data && ev.data.size > 0) {
        chunksRef.current.push(ev.data);
      }
    };

    recorder.onstop = async () => {
      if (vadRafRef.current) {
        cancelAnimationFrame(vadRafRef.current);
        vadRafRef.current = null;
      }
      setMicLevel(0);

      const isFinalFlush = flushOnHangUpRef.current;
      flushOnHangUpRef.current = false;

      if (!isActiveRef.current && !isFinalFlush) return;
      if (isMutedRef.current && !isFinalFlush) {
        setCallState('muted');
        return;
      }

      const blob = new Blob(chunksRef.current, {
        type: (recorder.mimeType || 'audio/webm').split(';')[0],
      });

      if ((!hasSpoken && !stoppedManually) || blob.size < 3500) {
        if (isActiveRef.current) startListeningRef.current?.();
        return;
      }

      if (isActiveRef.current) {
        setCallState('transcribing');
        playInstantFiller();
      }
      try {
        const transcript = await transcribeAudioWithDeepgram(blob);
        if (!isActiveRef.current && !isFinalFlush) return;

        if (isActiveRef.current) {
          setLastUserText(transcript);
          setCallState('thinking');
        }

        const reply = await onCallTurn(transcript);
        if (!isActiveRef.current) return;

        setLastBotText(reply);
        speakAndThen(reply, () => startListeningRef.current?.());
      } catch (err) {
        if (!isActiveRef.current) return;
        const msg = err?.message || '';
        if (
          msg.includes('tidak terdeteksi') ||
          msg.includes('Rekaman suara kosong') ||
          msg.includes('corrupt or unsupported data')
        ) {
          startListeningRef.current?.();
          return;
        }
        setCallError(msg || 'Gagal memproses suara.');
        setTimeout(() => {
          if (isActiveRef.current) startListeningRef.current?.();
        }, 1600);
      }
    };

    recorder.start();

    const analyser = analyserRef.current;
    const dataArray = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;

    const monitorSilence = () => {
      if (!isActiveRef.current || recorderRef.current !== recorder) return;
      if (recorder.state !== 'recording') return;

      if (isMutedRef.current) {
        stoppedManually = false;
        recorder.stop();
        return;
      }

      if (analyser && dataArray) {
        analyser.getByteTimeDomainData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i += 1) {
          const val = (dataArray[i] - 128) / 128;
          sum += val * val;
        }
        const rms = Math.sqrt(sum / dataArray.length) * 100;
        const normalized = Math.min(100, Math.round(rms * 5));
        setMicLevel(normalized);

        if (rms > 2.4) {
          hasSpoken = true;
          lastVoiceAt = Date.now();
        }
      }

      const now = Date.now();
      const silenceMs = now - lastVoiceAt;
      const totalMs = now - startedAt;

      if ((hasSpoken && silenceMs > 1400) || totalMs > 22000) {
        stoppedManually = hasSpoken;
        recorder.stop();
        return;
      }

      vadRafRef.current = requestAnimationFrame(monitorSilence);
    };

    vadRafRef.current = requestAnimationFrame(monitorSilence);
  }, [onCallTurn, playInstantFiller, speakAndThen]);

  useEffect(() => {
    startListeningRef.current = startListeningTurn;
  }, [startListeningTurn]);

  useEffect(() => {
    let cancelled = false;
    isActiveRef.current = true;

    async function initCall() {
      if (!hasDeepgramApiKey()) {
        setCallError('VITE_DEEPGRAM_API_KEY belum diisi di file .env.');
        setCallState('error');
        return;
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        setCallError('Browser ini tidak mendukung akses mikrofon.');
        setCallState('error');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled || !isActiveRef.current) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;

        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 512;
          source.connect(analyser);
          audioCtxRef.current = ctx;
          analyserRef.current = analyser;
        }

        // Pre-cache audio filler pendek di background agar respon "tunggu sebentar" instan 0ms
        Promise.all(
          FILLER_PHRASES.map((phrase) =>
            synthesizeSpeechWithDeepgram(phrase).catch(() => null)
          )
        ).then((urls) => {
          if (cancelled || !isActiveRef.current) {
            urls.forEach((u) => {
              if (u) URL.revokeObjectURL(u);
            });
            return;
          }
          fillerUrlsRef.current = urls;
        });

        const greeting = `Halo Kak! Aku ${botName}. Ceritain aja tinggi, berat badan, atau acara kamu hari ini ya.`;
        setLastBotText(greeting);
        speakAndThen(greeting, () => startListeningRef.current?.());
      } catch {
        if (!cancelled) {
          setCallError(
            'Akses mikrofon ditolak. Izinkan mikrofon di browser untuk mulai telepon.'
          );
          setCallState('error');
        }
      }
    }

    initCall();

    const timer = setInterval(() => {
      setElapsedSec((s) => s + 1);
    }, 1000);

    return () => {
      cancelled = true;
      clearInterval(timer);
      fillerUrlsRef.current.forEach((u) => {
        if (u) URL.revokeObjectURL(u);
      });
      fillerUrlsRef.current = [];
      releaseMediaResources();
    };
  }, [botName, releaseMediaResources, speakAndThen]);

  const handleToggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      isMutedRef.current = next;
      if (!next && callState === 'muted') {
        startListeningRef.current?.();
      }
      return next;
    });
  };

  const handleHangUp = () => {
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      flushOnHangUpRef.current = true;
    }
    releaseMediaResources();
    onClose();
  };

  const statusMeta = {
    connecting: {
      label: 'Menghubungkan ke Deepgram Voice...',
      badge: 'CONNECTING',
      ring: 'border-slate-500/40',
    },
    greeting: {
      label: `${botName} menyapa...`,
      badge: 'GREETING',
      ring: 'border-emerald-400',
    },
    listening: {
      label: 'Mendengarkan suaramu (bicara langsung)...',
      badge: 'LISTENING',
      ring: 'border-rose-400',
    },
    transcribing: {
      label: 'Deepgram menerjemahkan suaramu...',
      badge: 'STT_NOVA2',
      ring: 'border-amber-400',
    },
    thinking: {
      label: `${botName} sedang menyiapkan saran gaya...`,
      badge: 'THINKING',
      ring: 'border-blue-400',
    },
    speaking: {
      label: `${botName} sedang berbicara...`,
      badge: 'TTS_AURA2',
      ring: 'border-emerald-400',
    },
    muted: {
      label: 'Mikrofon dimatikan (Mute)',
      badge: 'MUTED',
      ring: 'border-slate-600',
    },
    error: {
      label: 'Koneksi suara bermasalah',
      badge: 'ERROR',
      ring: 'border-rose-500',
    },
  }[callState];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-white/15 text-white shadow-2xl overflow-hidden flex flex-col">
        {/* Top Call Bar */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-emerald-300">
              VOICE_CALL · {statusMeta.badge}
            </span>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-mono font-bold text-white">
            {formatCallDuration(elapsedSec)}
          </span>
        </div>

        {/* Center Avatar & Live Audio Pulse */}
        <div className="px-6 py-7 flex flex-col items-center text-center space-y-4">
          <div className="relative flex items-center justify-center">
            <div
              style={{
                transform: `scale(${
                  callState === 'listening'
                    ? 1 + Math.min(0.28, micLevel / 250)
                    : callState === 'speaking'
                      ? 1.15
                      : 1
                })`,
              }}
              className={`absolute -inset-3 rounded-full border-2 ${statusMeta.ring} transition-transform duration-150 ${
                callState === 'speaking' || callState === 'listening'
                  ? 'opacity-80 animate-pulse'
                  : 'opacity-30'
              }`}
            />
            <div className="w-24 h-24 rounded-full bg-white p-2 shadow-xl relative z-10 flex items-center justify-center overflow-hidden">
              <img
                src={callState === 'speaking' ? talaSenang : talaKedip}
                alt={botName}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black tracking-tight text-white">
              {botName}
            </h3>
            <p className="text-xs text-slate-300 mt-1 flex items-center justify-center gap-1.5">
              {(callState === 'transcribing' ||
                callState === 'thinking' ||
                callState === 'connecting') && (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D6B7A5]" />
              )}
              <span>{statusMeta.label}</span>
            </p>
          </div>

          {/* Live Transcript & Reply Preview */}
          <div className="w-full rounded-2xl bg-white/5 border border-white/10 p-3.5 text-left space-y-2 min-h-[96px]">
            {callError ? (
              <div className="text-xs text-rose-300 font-medium">{callError}</div>
            ) : (
              <>
                {lastUserText && (
                  <div className="text-[11px] text-slate-300">
                    <span className="font-mono font-bold text-rose-300">
                      KAMU:
                    </span>{' '}
                    {lastUserText}
                  </div>
                )}
                {lastBotText ? (
                  <div className="text-xs text-white leading-relaxed line-clamp-3">
                    <span className="font-mono font-bold text-emerald-300">
                      {botName.toUpperCase()}:
                    </span>{' '}
                    {lastBotText}
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D6B7A5]" />
                    <span>
                      Bicara santai seperti telepon biasa. Semua percakapan juga
                      otomatis tersimpan di chat.
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Bottom Call Controls */}
        <div className="px-6 pb-6 pt-2 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleToggleMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center border transition cursor-pointer ${
              isMuted
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-white/10 border-white/15 text-white hover:bg-white/20'
            }`}
            title={isMuted ? 'Nyalakan Mikrofon' : 'Matikan Mikrofon (Mute)'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={handleHangUp}
            className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-900/40 transition cursor-pointer"
            title="Tutup Telepon"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={() => {
              setSpeakerOn((prev) => {
                const next = !prev;
                if (!next) stopPlayback();
                return next;
              });
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center border transition cursor-pointer ${
              !speakerOn
                ? 'bg-slate-800 border-white/15 text-slate-400'
                : 'bg-white/10 border-white/15 text-white hover:bg-white/20'
            }`}
            title={speakerOn ? 'Matikan Speaker' : 'Nyalakan Speaker'}
          >
            {speakerOn ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="pb-3 text-center text-[10px] font-mono text-slate-500 flex items-center justify-center gap-1">
          <Phone className="w-3 h-3" />
          <span>POWERED BY DEEPGRAM NOVA-2 &amp; AURA-2</span>
        </div>
      </div>
    </div>
  );
}

export default function VoiceCallModal({
  isOpen,
  onClose,
  botName = 'Kak Tala',
  onCallTurn,
}) {
  if (!isOpen) return null;
  return (
    <VoiceCallSession
      onClose={onClose}
      botName={botName}
      onCallTurn={onCallTurn}
    />
  );
}
