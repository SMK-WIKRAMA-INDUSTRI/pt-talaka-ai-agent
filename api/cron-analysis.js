import {
  askKakTalaServer,
  getServerConfig,
  sendTelegramMessage,
  sendWhatsAppFonnte,
  supabaseRest,
} from './_lib/talakaServer.js';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const [products, orders, chats, trends] = await Promise.all([
      supabaseRest('products?select=sku,name,price,sizes&order=sort_order.asc'),
      supabaseRest('orders?select=order_code,total_price,status,items,created_at&order=created_at.desc&limit=30'),
      supabaseRest('chat_messages?select=role,content,created_at&order=created_at.desc&limit=40'),
      supabaseRest('social_trends?select=platform,topic,hashtag,sentiment,engagement_score,insight&order=scraped_at.desc&limit=15'),
    ]);

    const promptPayload = {
      productsCount: Array.isArray(products) ? products.length : 0,
      recentOrdersCount: Array.isArray(orders) ? orders.length : 0,
      recentChatsSample: Array.isArray(chats)
        ? chats.slice(0, 15).map((c) => `${c.role}: ${String(c.content || '').slice(0, 140)}`)
        : [],
      socialTrends: Array.isArray(trends) ? trends : [],
    };

    const systemPrompt = [
      'Kamu adalah AI Commerce Strategist untuk PT Talaka Sinar Rekayasa (brand fashion Talaka.ai).',
      'Kembalikan HANYA JSON valid (tanpa markdown codefence) dengan skema:',
      '{"reportTitle":"string","periodLabel":"Laporan Otomatis 3 Harian","summary":"string 2-3 kalimat","trendingHighlights":[{"platform":"tiktok|instagram|threads|x","topic":"string","growth":"+XX%","keyFinding":"string"}],"storeInsights":[{"type":"stock|demand|conversion","title":"string","detail":"string","action":"string"}],"targetAudience":{"primarySegment":"string","ageRange":"string","peakHours":"string","keyPainPoints":["string"]},"promoRecommendations":[{"campaignName":"string","bundleItems":"string","offer":"string","hookContent":"string","channel":"string"}]}',
    ].join('\n');

    const rawReply = await askKakTalaServer({
      systemPrompt,
      userMessage: `Buatkan laporan analisis 3 harian berdasarkan data live toko & sosmed berikut:\n${JSON.stringify(promptPayload)}`,
      maxTokens: 1200,
    });

    const cleaned = rawReply
      .replace(/^```json\s*/i, '')
      .replace(/```$/i, '')
      .trim();
    const parsed = JSON.parse(cleaned);

    await supabaseRest('ai_reports', {
      method: 'POST',
      body: {
        report_title: parsed.reportTitle || 'Laporan Analisis AI 3 Harian Talaka',
        period_label: parsed.periodLabel || 'Otomatis 3 Hari Sekali',
        summary: parsed.summary || '',
        trending_highlights: parsed.trendingHighlights || [],
        store_insights: parsed.storeInsights || [],
        target_audience: parsed.targetAudience || {},
        promo_recommendations: parsed.promoRecommendations || [],
        triggered_by: 'cron_3d',
      },
    });

    const cfg = getServerConfig();
    const adminDigest = [
      `📊 *${parsed.reportTitle || 'Laporan AI 3 Harian Talaka.ai'}*`,
      '',
      parsed.summary || '',
      '',
      `🎯 *Target Utama:* ${parsed.targetAudience?.primarySegment || 'Gen Z & Milenial Urban'}`,
      parsed.promoRecommendations?.[0]
        ? `💡 *Ide Promo Utama:* ${parsed.promoRecommendations[0].campaignName} — ${parsed.promoRecommendations[0].offer}`
        : null,
      '',
      'Buka Dashboard Admin `/admin` → Tab *Analisis AI & Tren* untuk laporan lengkap.',
    ]
      .filter(Boolean)
      .join('\n');

    const notifStatus = {
      telegram: cfg.telegramAdminChatId
        ? await sendTelegramMessage(cfg.telegramAdminChatId, adminDigest)
        : { sent: false, reason: 'TELEGRAM_ADMIN_CHAT_ID belum diset' },
      whatsapp: cfg.whatsappAdminPhone
        ? await sendWhatsAppFonnte(cfg.whatsappAdminPhone, adminDigest)
        : { sent: false, reason: 'WHATSAPP_ADMIN_PHONE belum diset' },
    };

    return res.status(200).json({
      ok: true,
      reportTitle: parsed.reportTitle,
      notifications: notifStatus,
    });
  } catch (err) {
    console.error('Cron analysis error:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
