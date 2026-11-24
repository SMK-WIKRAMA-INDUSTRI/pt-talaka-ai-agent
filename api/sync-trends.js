import { askKakTalaServer, supabaseRest } from './_lib/talakaServer.js';

const APIFY_BASE = 'https://api.apify.com/v2/acts';

async function runApifyActorSync(actorSlug, input, token, timeoutSec = 55) {
  const safeActor = actorSlug.replace('/', '~');
  const url = `${APIFY_BASE}/${encodeURIComponent(safeActor)}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}&timeout=${timeoutSec}&memory=512`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Apify ${actorSlug} gagal (${res.status}): ${errText.slice(0, 160)}`);
  }

  const items = await res.json();
  return Array.isArray(items) ? items : [];
}

function compactRawItems(platform, items = []) {
  return items.slice(0, 12).map((item) => {
    const caption =
      item.text ||
      item.caption ||
      item.desc ||
      item.full_text ||
      item.title ||
      '';
    const likes =
      item.diggCount ||
      item.likesCount ||
      item.favorite_count ||
      item.likeCount ||
      0;
    const views = item.playCount || item.videoViewCount || item.viewsCount || 0;
    const comments =
      item.commentCount || item.commentsCount || item.reply_count || 0;
    const url = item.webVideoUrl || item.url || item.shortCode || '';
    return {
      platform,
      caption: String(caption).slice(0, 200),
      likes: Number(likes) || 0,
      views: Number(views) || 0,
      comments: Number(comments) || 0,
      url: String(url),
    };
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = req.method === 'POST' ? req.body || {} : {};
    const apifyToken = (process.env.APIFY_API_TOKEN || '').trim();

    if (!apifyToken) {
      return res.status(400).json({
        ok: false,
        error:
          'APIFY_API_TOKEN belum diatur di backend (.env lokal atau Vercel Environment Variables).',
      });
    }

    const hashtags = Array.isArray(body.hashtags) && body.hashtags.length > 0
      ? body.hashtags.slice(0, 3)
      : ['ootdindonesia', 'fashionlokal', 'kemejalinen'];
    const limitPerPlatform = Math.max(
      5,
      Math.min(20, Number(body.limitPerPlatform) || 10)
    );
    const platforms = Array.isArray(body.platforms) && body.platforms.length > 0
      ? body.platforms
      : ['tiktok', 'instagram'];

    const collected = [];
    const errors = [];

    if (platforms.includes('tiktok')) {
      try {
        const ttItems = await runApifyActorSync(
          'clockworks/tiktok-scraper',
          {
            hashtags,
            resultsPerPage: limitPerPlatform,
            maxFollowersPerProfile: 0,
            maxFollowingPerProfile: 0,
            commentsPerPost: 0,
            topLevelCommentsPerPost: 0,
            maxRepliesPerComment: 0,
            proxyCountryCode: 'None',
          },
          apifyToken
        );
        const compacted = compactRawItems('tiktok', ttItems);
        collected.push(...compacted);

        // Opsional tarik komentar dari 1 video TikTok paling ramai jika diminta
        if (body.includeTikTokComments && compacted[0]?.url?.includes('tiktok.com')) {
          try {
            const commentItems = await runApifyActorSync(
              'clockworks/tiktok-comments-scraper',
              {
                postURLs: [compacted[0].url],
                commentsPerPost: 15,
                maxRepliesPerComment: 0,
                resultsPerPage: 15,
              },
              apifyToken,
              40
            );
            collected.push(
              ...commentItems.slice(0, 10).map((c) => ({
                platform: 'tiktok',
                caption: `[KOMENTAR NETIZEN] ${String(c.text || '').slice(0, 160)}`,
                likes: Number(c.diggCount) || 0,
                views: 0,
                comments: 0,
                url: '',
              }))
            );
          } catch (cErr) {
            errors.push(cErr.message);
          }
        }
      } catch (err) {
        errors.push(err.message);
      }
    }

    if (platforms.includes('instagram')) {
      try {
        const igUsername = String(body.instagramUsername || '').trim();
        const igItems = igUsername
          ? await runApifyActorSync(
              'apify/instagram-reel-scraper',
              {
                username: [igUsername],
                resultsLimit: limitPerPlatform,
              },
              apifyToken
            )
          : await runApifyActorSync(
              'apify/instagram-scraper',
              {
                search: hashtags[0] || 'ootdindonesia',
                searchType: 'hashtag',
                searchLimit: 1,
                resultsType: 'posts',
                resultsLimit: limitPerPlatform,
                addParentData: false,
              },
              apifyToken
            );
        collected.push(...compactRawItems('instagram', igItems));
      } catch (err) {
        errors.push(err.message);
      }
    }

    if (platforms.includes('x')) {
      try {
        const xActor = String(body.xActorId || 'apidojo/tweet-scraper').trim();
        const xItems = await runApifyActorSync(
          xActor,
          {
            searchTerms: hashtags.map((h) => `#${h.replace(/^#/, '')}`),
            maxItems: limitPerPlatform,
            sort: 'Top',
          },
          apifyToken
        );
        collected.push(...compactRawItems('x', xItems));
      } catch (err) {
        errors.push(err.message);
      }
    }

    if (platforms.includes('threads')) {
      try {
        const thActor = String(
          body.threadsActorId || 'apify/threads-scraper'
        ).trim();
        const thItems = await runApifyActorSync(
          thActor,
          {
            searchQueries: hashtags,
            maxItems: limitPerPlatform,
          },
          apifyToken
        );
        collected.push(...compactRawItems('threads', thItems));
      } catch (err) {
        errors.push(err.message);
      }
    }

    if (collected.length === 0) {
      return res.status(200).json({
        ok: false,
        trends: [],
        errors:
          errors.length > 0
            ? errors
            : ['Tidak ada item yang berhasil ditarik dari Apify.'],
      });
    }

    const systemPrompt = [
      'Kamu adalah AI Social Trend Analyst untuk brand fashion Indonesia Talaka.ai.',
      'Rangkum dataset mentah hasil scraping Apify di bawah ini menjadi 4-6 temuan tren fashion bersih.',
      'WAJIB balas HANYA JSON array valid (tanpa markdown codefence):',
      '[{"platform":"tiktok|instagram|threads|x","topic":"string singkat","hashtag":"#tag1 #tag2","sentiment":"positif|netral|kritis","engagementScore":60-99,"sampleCaption":"cuplikan singkat","insight":"insight bisnis & peluang produk untuk Talaka"}]',
    ].join('\n');

    const rawAi = await askKakTalaServer({
      systemPrompt,
      userMessage: JSON.stringify(collected.slice(0, 30)),
      maxTokens: 1100,
    });

    const cleaned = rawAi
      .replace(/^```json\s*/i, '')
      .replace(/```$/i, '')
      .trim();
    const parsedTrends = JSON.parse(cleaned);
    const nowIso = new Date().toISOString();

    const rows = (Array.isArray(parsedTrends) ? parsedTrends : []).map((t) => ({
      platform: ['tiktok', 'instagram', 'threads', 'x'].includes(
        String(t.platform || '').toLowerCase()
      )
        ? String(t.platform).toLowerCase()
        : 'tiktok',
      topic: String(t.topic || 'Tren Fashion Lokal').slice(0, 160),
      hashtag: String(t.hashtag || '').slice(0, 160),
      sentiment: String(t.sentiment || 'positif').slice(0, 40),
      engagement_score: Math.max(
        10,
        Math.min(100, Math.round(Number(t.engagementScore) || 80))
      ),
      sample_caption: String(t.sampleCaption || '').slice(0, 260),
      insight: String(t.insight || '').slice(0, 300),
      scraped_at: nowIso,
    }));

    if (rows.length > 0) {
      await supabaseRest('social_trends', { method: 'POST', body: rows });
    }

    return res.status(200).json({
      ok: true,
      rawCount: collected.length,
      trends: rows.map((r, i) => ({
        id: `apify-${Date.now()}-${i}`,
        platform: r.platform,
        topic: r.topic,
        hashtag: r.hashtag,
        sentiment: r.sentiment,
        engagementScore: r.engagement_score,
        sampleCaption: r.sample_caption,
        insight: r.insight,
        scrapedAt: r.scraped_at,
      })),
      errors,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
