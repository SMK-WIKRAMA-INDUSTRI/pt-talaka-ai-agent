const GEMINI_BASE_URL =
  'https://generativelanguage.googleapis.com/v1beta/models';

const IMAGE_GEN_MODEL = 'gemini-2.5-flash-image';
const VISION_FALLBACK_MODEL = 'gemini-3-flash-preview';

export function getGeminiApiKey() {
  return (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
}

export function hasGeminiApiKey() {
  return Boolean(getGeminiApiKey());
}

function dataUrlToInlinePart(dataUrl) {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl || '');
  if (!match) {
    throw new Error('Format gambar tidak valid. Gunakan file JPG, PNG, atau WebP.');
  }
  return {
    inlineData: {
      mimeType: match[1],
      data: match[2],
    },
  };
}

async function analyzeTwoImagesWithVision({ apiKey, bodyPart, outfitPart, note }) {
  const prompt = [
    'Kamu adalah Kak Tala, Teman Gaya dari toko fashion Talaka.',
    'Pelanggan mengunggah 2 foto: (1) foto tubuh/diri pelanggan, dan (2) foto baju/outfit yang ingin dicoba.',
    note ? `Catatan tambahan pelanggan: "${note}"` : '',
    'Analisislah kedua foto tersebut secara visual dan jujur-suportif sesuai gaya Kak Tala:',
    '1. Jelaskan bagaimana potongan, warna, dan proporsi baju di foto kedua akan terlihat jika dipakai di postur/foto pertama.',
    '2. Berikan masukan jujur jika ada bagian yang kurang pas (misal panjang, potongan bahu, kontras warna kulit/outfit) beserta saran cara memakainya atau alternatif yang lebih cocok.',
    '3. Jangan pernah menyebut tubuh pelanggan sebagai kekurangan atau memberi saran diet.',
    'Jawab singkat dan hangat dalam Bahasa Indonesia (3-5 kalimat).',
  ]
    .filter(Boolean)
    .join('\n');

  const response = await fetch(
    `${GEMINI_BASE_URL}/${VISION_FALLBACK_MODEL}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [bodyPart, outfitPart, { text: prompt }],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gagal menganalisis gambar di Gemini (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((p) => p.text)
      .filter(Boolean)
      .join('\n')
      .trim() || '';

  return text;
}

/**
 * Mencoba Virtual Try-On (generate gambar) lewat Gemini Image model.
 * Jika akun Gemini masih Free Tier (quota generate gambar limit: 0),
 * otomatis fallback ke analisis visual 2 gambar menggunakan gemini-3-flash-preview.
 */
export async function runVirtualTryOn({ bodyDataUrl, outfitDataUrl, note = '' }) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error(
      'API key Gemini belum diisi. Tambahkan VITE_GEMINI_API_KEY di file .env.'
    );
  }

  const bodyPart = dataUrlToInlinePart(bodyDataUrl);
  const outfitPart = dataUrlToInlinePart(outfitDataUrl);

  const tryOnPrompt = [
    'Virtual try-on fashion task:',
    'Image 1 is the customer photo (person). Image 2 is the target garment/outfit.',
    'Generate a realistic photo of the person from Image 1 wearing the garment from Image 2.',
    'Preserve the person face, skin tone, pose, body proportions, and background from Image 1 as naturally as possible, while accurately transferring the garment cut, color, texture, and pattern from Image 2.',
    note ? `Customer preference/note: ${note}` : '',
    'Also add a brief friendly style comment in Indonesian (2-3 sentences) as Kak Tala from Talaka.',
  ]
    .filter(Boolean)
    .join('\n');

  const response = await fetch(
    `${GEMINI_BASE_URL}/${IMAGE_GEN_MODEL}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [bodyPart, outfitPart, { text: tryOnPrompt }],
          },
        ],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      }),
    }
  );

  if (response.ok) {
    const data = await response.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p) => p.inlineData?.data);
    const textReply = parts
      .map((p) => p.text)
      .filter(Boolean)
      .join('\n')
      .trim();

    if (imagePart?.inlineData?.data) {
      const mime = imagePart.inlineData.mimeType || 'image/png';
      return {
        mode: 'image_generated',
        generatedImageUrl: `data:${mime};base64,${imagePart.inlineData.data}`,
        text:
          textReply ||
          'Ini simulasi hasil Virtual Try-On kamu, Kak! Gimana menurutmu potongannya?',
      };
    }
  } else {
    const errBody = await response.text();
    const isFreeTierQuotaZero =
      response.status === 429 &&
      (errBody.includes('limit: 0') || errBody.includes('FreeTier'));

    if (!isFreeTierQuotaZero) {
      throw new Error(`Gemini Virtual Try-On error (${response.status}): ${errBody}`);
    }
  }

  // Fallback otomatis ke analisis visual (terbukti aktif di Free Tier)
  const visionText = await analyzeTwoImagesWithVision({
    apiKey,
    bodyPart,
    outfitPart,
    note,
  });

  return {
    mode: 'vision_fallback',
    generatedImageUrl: null,
    text: visionText,
  };
}
