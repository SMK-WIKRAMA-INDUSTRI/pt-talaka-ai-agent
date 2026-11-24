import { askDeepSeek, hasDeepSeekApiKey } from './deepseek';

function safeParseJsonObject(rawText) {
  const cleaned = String(rawText || '')
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

function summarizeLowStock(products = []) {
  const alerts = [];
  products.forEach((p) => {
    Object.entries(p.sizes || {}).forEach(([color, sizeMap]) => {
      Object.entries(sizeMap || {}).forEach(([sz, qty]) => {
        if (qty <= 1) {
          alerts.push(`${p.name} (${p.sku}) ${color} ukuran ${sz}: sisa ${qty}`);
        }
      });
    });
  });
  return alerts.slice(0, 8);
}

/**
 * Generate Laporan Analisis AI 3 Harian (menggabungkan tren sosmed, stok, order, & chat live).
 */
export async function generateThreeDayAiReport({
  products = [],
  orders = [],
  chatMessages = [],
  socialTrends = [],
  triggeredBy = 'manual',
}) {
  const lowStockList = summarizeLowStock(products);
  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
  const dateLabel = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const fallbackReport = {
    reportTitle: `Laporan Strategi AI Talaka · ${dateLabel}`,
    periodLabel:
      triggeredBy === 'cron_3d'
        ? 'Otomatis 3 Hari Sekali'
        : `Analisis Live (${dateLabel})`,
    summary: `Berdasarkan ${socialTrends.length} sinyal tren sosmed, ${orders.length} pesanan aktif (omset Rp${totalRevenue.toLocaleString('id-ID')}), dan ${chatMessages.length} log percakapan pelanggan, segmen earth-tone linen & chunky sneaker masih menjadi pendorong konversi tertinggi di Talaka.`,
    trendingHighlights: socialTrends.slice(0, 4).map((t) => ({
      platform: t.platform,
      topic: t.topic,
      growth: `+${Math.max(15, (t.engagementScore || 78) - 45)}%`,
      keyFinding: t.insight || t.sampleCaption,
    })),
    storeInsights: [
      {
        type: 'stock',
        title: 'Prioritas Restok Varian Kritis',
        detail:
          lowStockList.length > 0
            ? `Varian yang hampir/sudah habis: ${lowStockList.slice(0, 3).join('; ')}.`
            : 'Mayoritas stok varian utama masih dalam kondisi aman.',
        action: 'Segera tambah stok ukuran M & L untuk SKU best seller.',
      },
      {
        type: 'demand',
        title: 'Kekuatan Diferensiasi Kejujuran TB/BB',
        detail:
          'Pelanggan paling aktif menanyakan kesesuaian panjang celana kulot dan ukuran kemeja berdasarkan tinggi & berat badan.',
        action: 'Tonjolkan fitur konsultasi ukuran jujur Kak Tala di konten TikTok & IG Reels.',
      },
    ],
    targetAudience: {
      primarySegment: 'Mahasiswi & Pekerja Muda Urban (Smart Casual & Earth-Tone)',
      ageRange: '19 – 28 Tahun',
      peakHours: '12.00–13.30 WIB & 19.00–21.30 WIB',
      keyPainPoints: [
        'Takut salah ukuran baju/celana kepanjangan saat beli online',
        'Ingin outfit rapi tapi tetap adem dipakai seharian',
        'Mencari paket padu-padan hemat untuk kuliah/kerja',
      ],
    },
    promoRecommendations: [
      {
        campaignName: 'Bundling Smart Ngampus Anti Salah Ukuran',
        bundleItems: 'Kemeja Linen (KMJ-001) + Celana Kulot (CLN-002)',
        offer: 'Potongan Rp35.000 + Gratis Konsultasi Ukuran AI',
        hookContent:
          '"TB 155cm takut kulot nyapu lantai? Cek cara Kak Tala hitung ukuran pas dalam 3 detik!"',
        channel: 'TikTok Reels & Instagram',
      },
      {
        campaignName: 'Earth-Tone Sneaker Combo',
        bundleItems: 'Talaka Aurora Mocca (SNK-006) + Kaos Oversize (TSH-005)',
        offer: 'Gratis Ongkir Jabodetabek + Voucher Rp25.000 Member Login',
        hookContent:
          '"1 Sepatu Mocca buat 5 gaya acara berbeda — dari ngampus sampai hangout!"',
        channel: 'WhatsApp Broadcast & Threads',
      },
    ],
    triggeredBy,
  };

  if (!hasDeepSeekApiKey()) {
    return fallbackReport;
  }

  const contextPayload = {
    tanggal: dateLabel,
    jumlahProduk: products.length,
    katalogRingkas: products.map((p) => ({
      sku: p.sku,
      name: p.name,
      category: p.category,
      price: p.price,
    })),
    stokKritis: lowStockList,
    totalOrder: orders.length,
    totalOmset: totalRevenue,
    sampleChatTerbaru: chatMessages
      .slice(0, 12)
      .map((c) => `${c.role}: ${String(c.content || '').slice(0, 110)}`),
    trenSosmed: socialTrends.slice(0, 6).map((t) => ({
      platform: t.platform,
      topic: t.topic,
      hashtag: t.hashtag,
      sentiment: t.sentiment,
      insight: t.insight,
    })),
  };

  const schemaPrompt = [
    'Kamu adalah Chief AI Commerce Strategist untuk brand fashion Talaka.ai.',
    'Analisis data toko + tren media sosial (TikTok, Instagram, Threads, X) yang diberikan.',
    'WAJIB balas HANYA berupa JSON valid (tanpa teks tambahan, tanpa ```json) sesuai format persis:',
    '{',
    '  "reportTitle": "string singkat",',
    '  "periodLabel": "string periode",',
    '  "summary": "ringkasan eksekutif 2-3 kalimat bahasa Indonesia",',
    '  "trendingHighlights": [{"platform":"tiktok|instagram|threads|x","topic":"string","growth":"+XX%","keyFinding":"string"}],',
    '  "storeInsights": [{"type":"stock|demand|conversion","title":"string","detail":"string","action":"string"}],',
    '  "targetAudience": {"primarySegment":"string","ageRange":"string","peakHours":"string","keyPainPoints":["string","string","string"]},',
    '  "promoRecommendations": [{"campaignName":"string","bundleItems":"string","offer":"string","hookContent":"string","channel":"string"}]',
    '}',
  ].join('\n');

  try {
    const raw = await askDeepSeek({
      botName: 'Talaka Strategist AI',
      honestyLevel: 'seimbang',
      showExactStock: true,
      activePageContext: 'admin-analytics',
      contextText: schemaPrompt,
      history: [
        {
          role: 'user',
          content: `Buat laporan analisis bisnis 3 harian dalam format JSON murni dari data ini:\n${JSON.stringify(contextPayload)}`,
        },
      ],
    });

    const parsed = safeParseJsonObject(raw);
    if (!parsed || !parsed.summary) return fallbackReport;

    return {
      ...fallbackReport,
      ...parsed,
      trendingHighlights:
        Array.isArray(parsed.trendingHighlights) &&
        parsed.trendingHighlights.length > 0
          ? parsed.trendingHighlights
          : fallbackReport.trendingHighlights,
      storeInsights:
        Array.isArray(parsed.storeInsights) && parsed.storeInsights.length > 0
          ? parsed.storeInsights
          : fallbackReport.storeInsights,
      targetAudience: parsed.targetAudience?.primarySegment
        ? parsed.targetAudience
        : fallbackReport.targetAudience,
      promoRecommendations:
        Array.isArray(parsed.promoRecommendations) &&
        parsed.promoRecommendations.length > 0
          ? parsed.promoRecommendations
          : fallbackReport.promoRecommendations,
      triggeredBy,
    };
  } catch {
    return fallbackReport;
  }
}

/**
 * Simulator Prediksi Produk: Prediksi potensi hasil penjualan jika Talaka meluncurkan produk baru.
 */
export async function simulateProductPrediction({
  productName,
  category = 'Atasan',
  price = 250000,
  targetNotes = '',
  products = [],
  socialTrends = [],
}) {
  const cleanName = (productName || '').trim();
  const numericPrice = Math.max(50000, Number(price) || 250000);

  const fallback = {
    productName: cleanName,
    demandScore: 81,
    verdict: 'Potensial Tinggi',
    estimatedMonthlyUnits: '40 – 65 pcs / bulan',
    estimatedMonthlyRevenue: `Rp${(numericPrice * 40).toLocaleString('id-ID')} – Rp${(numericPrice * 65).toLocaleString('id-ID')}`,
    recommendedPriceRange: `Rp${Math.round(numericPrice * 0.9).toLocaleString('id-ID')} – Rp${Math.round(numericPrice * 1.05).toLocaleString('id-ID')}`,
    returnRiskLevel: 'Sedang',
    returnRiskReason:
      'Risiko utama biasanya ada di ekspektasi fit bahu/panjang — wajib lengkapi tabel TB/BB di Kak Tala AI.',
    targetBuyerPersona:
      'Gen Z & Milenial usia 19–27 tahun pencinta gaya smart-casual Indonesia.',
    keyStrengths: [
      `Melengkapi lini kategori ${category} di katalog Talaka saat ini.`,
      'Harga masih kompetitif untuk segmen brand lokal menengah.',
    ],
    promoAngles: [
      `Konten TikTok before-after padu padan ${cleanName} dengan sepatu/bawahan Talaka.`,
      `Pre-order / early-bird diskon 10% khusus member yang login di Talaka.ai.`,
      `Broadcast WhatsApp & Telegram ke pelanggan yang pernah konsultasi kategori ${category}.`,
    ],
  };

  if (!hasDeepSeekApiKey() || !cleanName) return fallback;

  const systemGuide = [
    'Kamu adalah AI Product Forecasting & Merchandising Analyst untuk brand fashion Indonesia Talaka.ai.',
    'Prediksi kemungkinan hasil penjualan secara jujur dan realistis berdasarkan tren sosmed & katalog eksisting.',
    'WAJIB kembalikan HANYA JSON valid (tanpa ```json) dengan struktur persis:',
    '{',
    '  "demandScore": 0-100,',
    '  "verdict": "Sangat Potensial | Potensial | Perlu Penyesuaian",',
    '  "estimatedMonthlyUnits": "contoh: 45 - 70 pcs / bulan",',
    '  "estimatedMonthlyRevenue": "contoh: Rp13.500.000 - Rp21.000.000",',
    '  "recommendedPriceRange": "contoh: Rp269.000 - Rp299.000",',
    '  "returnRiskLevel": "Rendah | Sedang | Tinggi",',
    '  "returnRiskReason": "alasan jujur terkait sizing/bahan",',
    '  "targetBuyerPersona": "profil pembeli paling cocok",',
    '  "keyStrengths": ["poin 1", "poin 2"],',
    '  "promoAngles": ["ide promo 1", "ide promo 2", "ide promo 3"]',
    '}',
  ].join('\n');

  try {
    const raw = await askDeepSeek({
      botName: 'Talaka Forecast AI',
      honestyLevel: 'seimbang',
      showExactStock: true,
      activePageContext: 'product-simulator',
      contextText: systemGuide,
      history: [
        {
          role: 'user',
          content: JSON.stringify({
            rencanaProdukBaru: {
              nama: cleanName,
              kategori: category,
              hargaRencana: numericPrice,
              catatan: targetNotes,
            },
            katalogEksisting: products.map((p) => `${p.name} (${p.priceFormatted})`),
            trenSosmedAktif: socialTrends.slice(0, 5).map((t) => `${t.platform}: ${t.topic}`),
          }),
        },
      ],
    });

    const parsed = safeParseJsonObject(raw);
    if (!parsed || typeof parsed.demandScore !== 'number') return fallback;

    return {
      ...fallback,
      ...parsed,
      productName: cleanName,
      demandScore: Math.max(10, Math.min(99, Math.round(parsed.demandScore))),
    };
  } catch {
    return fallback;
  }
}

export function formatReportDigestForMessenger(report) {
  if (!report) return '';
  const topPromo = report.promoRecommendations?.[0];
  return [
    `📊 *${report.reportTitle}*`,
    `Periode: ${report.periodLabel}`,
    '',
    report.summary,
    '',
    `🎯 *Target Utama:* ${report.targetAudience?.primarySegment || '-'} (${report.targetAudience?.ageRange || '-'})`,
    `⏰ *Jam Efektif Posting:* ${report.targetAudience?.peakHours || '-'}`,
    topPromo
      ? `💡 *Rekomendasi Promo:* ${topPromo.campaignName} (${topPromo.offer})`
      : null,
    '',
    '— Dikirim otomatis oleh Talaka.ai Analytics Engine',
  ]
    .filter(Boolean)
    .join('\n');
}
