import React, { useState, useEffect, useMemo, useRef } from 'react';

// Ekspresi
import talaBerpikir from '../assets/ekspresi/tala-berpikir.svg';
import talaJatuhCinta from '../assets/ekspresi/tala-jatuh-cinta.svg';
import talaKedip from '../assets/ekspresi/tala-kedip.svg';
import talaSapa from '../assets/ekspresi/tala-sapa.svg';
import talaSenang from '../assets/ekspresi/tala-senang.svg';

// Lirikan (mata mengikuti teks dari kiri ke kanan)
import talaLirikKiriBawah from '../assets/lirikan/tala-lirik-kiri-bawah.svg';
import talaLirikBawah from '../assets/lirikan/tala-lirik-bawah.svg';
import talaLirikKananBawah from '../assets/lirikan/tala-lirik-kanan-bawah.svg';
import talaLirikKanan from '../assets/lirikan/tala-lirik-kanan.svg';

/**
 * Komponen Maskot Interaktif Kak Tala
 *
 * Sesuai instruksi:
 * 1. "tala-sapa": ketika user baru saja datang / chat awal
 * 2. "tala-berpikir": ketika sistem sedang memproses pesan (isSending)
 * 3. "tala-senang": ketika outfit cocok / rekomendasi pas di badan
 * 4. Folder "lirikan": ketika user sedang mengetik teks di input prompt,
 *    maskot melirik mengikuti posisi akhir teks yang sedang diketik.
 */
export default function TalaMascot({
  inputText = '',
  cursorPos = 0,
  isTyping = false,
  isSending = false,
  lastMessage = null,
  textareaRef: _textareaRef = null,
  onMascotClick = null,
}) {
  const [clickReaction, setClickReaction] = useState(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const clickTimeoutRef = useRef(null);

  // Efek kedip spontan saat idle (setiap 9 detik)
  useEffect(() => {
    if (isSending || isTyping || inputText.length > 0) return;

    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 240);
    }, 9000);

    return () => clearInterval(interval);
  }, [isSending, isTyping, inputText]);

  // Evaluasi ekspresi atau lirikan aktif
  const { currentSvg, moodLabel } = useMemo(() => {
    // 0. Reaksi klik manual jika baru saja diklik
    if (clickReaction) {
      return clickReaction;
    }

    // 1. Sedang proses (isSending) -> tala-berpikir
    if (isSending) {
      return {
        currentSvg: talaBerpikir,
        moodLabel: 'BERPIKIR',
        speechText: 'Tala sedang menganalisis proporsi tubuh dan kecocokan busanamu... 💭',
      };
    }

    // 2. User sedang menulis prompt di input -> lirikan mengikuti posisi presisi kursor teks
    if (isTyping || inputText.trim().length > 0) {
      const activeLength = cursorPos > 0 ? cursorPos : inputText.length;
      const textSlice = inputText.slice(0, activeLength);
      const lines = textSlice.split('\n');
      const currentLine = lines[lines.length - 1] || '';

      // Hitung posisi horizontal teks (dalam pixel) pada baris aktif
      let textPixelWidth = 0;
      if (typeof window !== 'undefined') {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.font = '14px "Plus Jakarta Sans", system-ui, sans-serif';
            textPixelWidth = ctx.measureText(currentLine).width;
          }
        } catch {
          textPixelWidth = currentLine.length * 8.2;
        }
      } else {
        textPixelWidth = currentLine.length * 8.2;
      }

      // Posisi teks relatif dari sisi kiri form (padding kiri textarea ~ 16px)
      const cursorX = 16 + textPixelWidth;

      // Maskot berada di sisi kiri atas dengan pusat di sekitar x = 48px
      const mascotCenterX = 48;
      const dx = cursorX - mascotCenterX;

      // 1) Teks berada di kiri/tepat di awal baris (hanya 1-3 huruf pertama)
      if (dx < -10) {
        return {
          currentSvg: talaLirikKiriBawah,
          moodLabel: 'LIRIK_KIRI_BAWAH',
          speechText: 'Tala menyimak awal kalimatmu... 👀',
        };
      }
      // 2) Teks berada tepat di bawah maskot (sekitar 4-8 huruf)
      else if (dx >= -10 && dx <= 38) {
        return {
          currentSvg: talaLirikBawah,
          moodLabel: 'LIRIK_BAWAH',
          speechText: 'Tala memperhatikan langsung kata-katamu di bawah... ✨',
        };
      }
      // 3) Teks bergerak ke kanan-bawah (sekitar 9-24 huruf, seperti di foto user)
      else if (dx > 38 && dx <= 170) {
        return {
          currentSvg: talaLirikKananBawah,
          moodLabel: 'LIRIK_KANAN_BAWAH',
          speechText: 'Menyimak teks yang kamu ketik ke kanan... ✍️',
        };
      }
      // 4) Teks panjang bergerak jauh ke kanan (25+ huruf)
      else {
        return {
          currentSvg: talaLirikKanan,
          moodLabel: 'LIRIK_KANAN',
          speechText: 'Wah, penjelasanmu detail sekali! 👍',
        };
      }
    }

    // 3. Respon bot terakhir menyatakan outfit cocok / rekomendasi pas -> tala-senang
    if (lastMessage && lastMessage.role === 'assistant') {
      const lower = lastMessage.content.toLowerCase();
      const isOutfitCocok =
        lower.includes('cocok') ||
        lower.includes('pas di badan') ||
        lower.includes('rekomendasi') ||
        lower.includes('sempurna') ||
        lower.includes('ideal') ||
        lower.includes('bagus') ||
        lower.includes('sangat pas');

      if (isOutfitCocok) {
        return {
          currentSvg: talaSenang,
          moodLabel: 'OUTFIT_COCOK',
          speechText: 'Outfit ini cocok banget dengan posturmu! Cantik & pas! 🎉',
        };
      }
    }

    // Kedip spontan jika idle
    if (isBlinking) {
      return {
        currentSvg: talaKedip,
        moodLabel: 'KEDIP',
        speechText: 'Ada yang ingin kamu tanyakan lagi? 😉',
      };
    }

    // 4. Default / baru saja datang ke chatbot -> tala-sapa
    return {
      currentSvg: talaSapa,
      moodLabel: 'SAPA',
      speechText: 'Hai! Aku Tala, siap bantu cek ukuran dan padu padan gayamu! ✨',
    };
  }, [
    clickReaction,
    isSending,
    isTyping,
    inputText,
    cursorPos,
    lastMessage,
    isBlinking,
  ]);

  // Interaksi klik pada maskot
  const handleMascotClick = (e) => {
    if (onMascotClick) {
      onMascotClick(e);
      return;
    }

    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);

    const randomReactions = [
      {
        currentSvg: talaSenang,
        moodLabel: 'SENANG',
        speechText: 'Terima kasih sudah ngobrol bareng Tala hari ini! 🥰',
      },
      {
        currentSvg: talaKedip,
        moodLabel: 'KEDIP',
        speechText: 'Tanya apa saja soal TB/BB, bahan, atau stok baju ya! 😉',
      },
      {
        currentSvg: talaJatuhCinta,
        moodLabel: 'JATUH_CINTA',
        speechText: 'Gaya busanamu pasti bakal keren banget! ✨',
      },
      {
        currentSvg: talaSapa,
        moodLabel: 'SAPA',
        speechText: 'Halo! Ada outfit yang lagi kamu taksir? 👗',
      },
    ];

    const pick =
      randomReactions[Math.floor(Math.random() * randomReactions.length)];
    setClickReaction(pick);

    clickTimeoutRef.current = setTimeout(() => {
      setClickReaction(null);
    }, 3200);
  };

  return (
    <div className="flex items-center select-none transition-all duration-300">
      {/* Gambar Maskot Interaktif Kak Tala */}
      <div
        onClick={handleMascotClick}
        className="relative group cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 shrink-0"
        title="Klik Kak Tala untuk membuka Menu Fitur & Virtual Try-On"
      >
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center">
          <img
            src={currentSvg}
            alt={`Maskot Tala - ${moodLabel}`}
            className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(158,123,102,0.22)] transition-all duration-200 will-change-transform"
          />

          {/* Indikator Animasi Titik saat Berpikir */}
          {isSending && (
            <span className="absolute top-1 right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9E7B66] opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#9E7B66] border-2 border-white shadow-xs" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
