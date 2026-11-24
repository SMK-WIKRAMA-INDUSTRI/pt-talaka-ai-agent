import { saveSocialTrendsToDb } from './supabase';

const APIFY_PREFS_KEY = 'talaka_apify_prefs_v2';

export const APIFY_ACTOR_CATALOG = [
  {
    platform: 'tiktok',
    label: 'TikTok Video & Hashtag',
    actorId: 'clockworks/tiktok-scraper',
    desc: 'Tarik video viral, views, & caption berdasarkan hashtag fashion.',
  },
  {
    platform: 'tiktok-comments',
    label: 'TikTok Comment Sentiment',
    actorId: 'clockworks/tiktok-comments-scraper',
    desc: 'Analisis keluhan & pertanyaan netizen dari video terpopuler.',
  },
  {
    platform: 'instagram',
    label: 'Instagram Hashtag / Reels',
    actorId: 'apify/instagram-scraper',
    desc: 'Tarik post hashtag atau Reels kompetitor (apify/instagram-reel-scraper).',
  },
  {
    platform: 'x',
    label: 'X (Twitter) Fashion Buzz',
    actorId: 'apidojo/tweet-scraper',
    desc: 'Pantau percakapan & rekomendasi outfit ramai di X.',
  },
  {
    platform: 'threads',
    label: 'Threads Diskusi Brand',
    actorId: 'apify/threads-scraper',
    desc: 'Pantau opini konsumen soal sizing & brand lokal di Threads.',
  },
];

export function loadApifyConfig() {
  const defaults = {
    hashtagsText: 'ootdindonesia, fashionlokal, kemejalinen',
    instagramUsername: '',
    limitPerPlatform: 10,
    includeTikTokComments: true,
    platforms: ['tiktok', 'instagram'],
  };

  try {
    const raw = localStorage.getItem(APIFY_PREFS_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return {
      ...defaults,
      ...parsed,
      platforms:
        Array.isArray(parsed.platforms) && parsed.platforms.length > 0
          ? parsed.platforms
          : defaults.platforms,
    };
  } catch {
    return defaults;
  }
}

export function saveApifyConfig(cfg) {
  try {
    localStorage.setItem(
      APIFY_PREFS_KEY,
      JSON.stringify({
        hashtagsText: cfg.hashtagsText || '',
        instagramUsername: cfg.instagramUsername || '',
        limitPerPlatform: cfg.limitPerPlatform || 10,
        includeTikTokComments: Boolean(cfg.includeTikTokComments),
        platforms: cfg.platforms || ['tiktok', 'instagram'],
      })
    );
  } catch {
    // Abaikan jika diblokir
  }
}

/**
 * Memanggil backend `/api/sync-trends` (Node.js / Vercel Serverless) yang memegang
 * `APIFY_API_TOKEN` secara aman di server, lalu menyinkronkan hasilnya ke tampilan admin.
 */
export async function syncSocialTrendsFromApify(cfg) {
  const hashtags = String(cfg?.hashtagsText || 'ootdindonesia, fashionlokal')
    .split(',')
    .map((h) => h.trim().replace(/^#/, ''))
    .filter(Boolean)
    .slice(0, 3);

  const limitPerPlatform = Math.max(
    5,
    Math.min(15, Number(cfg?.limitPerPlatform) || 10)
  );
  const platforms =
    Array.isArray(cfg?.platforms) && cfg.platforms.length > 0
      ? cfg.platforms
      : ['tiktok'];

  const res = await fetch('/api/sync-trends', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hashtags,
      limitPerPlatform,
      platforms,
      instagramUsername: cfg?.instagramUsername || '',
      includeTikTokComments: Boolean(cfg?.includeTikTokComments),
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) {
    throw new Error(
      data?.error ||
        data?.errors?.join(' · ') ||
        'Gagal menarik tren dari backend `/api/sync-trends`. Pastikan APIFY_API_TOKEN sudah diatur di file .env backend.'
    );
  }

  const trends = Array.isArray(data.trends) ? data.trends : [];
  if (trends.length > 0) {
    await saveSocialTrendsToDb(trends);
  }

  return {
    trends,
    rawCount: data.rawCount || 0,
    errors: data.errors || [],
  };
}
