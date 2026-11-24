import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export function isSupabaseConfigured() {
  return Boolean(supabase);
}

function mapDbRowToProduct(row) {
  return {
    sku: row.sku,
    name: row.name,
    category: row.category,
    badge: row.badge || '',
    image: row.image || '',
    price: row.price,
    priceFormatted: row.price_formatted,
    material: row.material,
    fit: row.fit,
    colors: Array.isArray(row.colors) ? row.colors : [],
    sizes: row.sizes && typeof row.sizes === 'object' ? row.sizes : {},
    measurements: row.measurements || '',
    care: row.care || '',
    style: row.style || '',
    occasions: row.occasions || '',
    pairWith: row.pair_with || '',
    proportionTip: row.proportion_tip || '',
    honestNote: row.honest_note || '',
    url: '#katalog-produk',
  };
}

export async function fetchLiveProducts() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.warn('Supabase fetchLiveProducts error:', error.message);
    return null;
  }
  if (!data || data.length === 0) return null;
  return data.map(mapDbRowToProduct);
}

export async function updateProductSizesInDb(sku, nextSizes) {
  if (!supabase) return;
  const { error } = await supabase
    .from('products')
    .update({
      sizes: nextSizes,
      updated_at: new Date().toISOString(),
    })
    .eq('sku', sku);

  if (error) {
    console.warn(`Supabase update stock failed for ${sku}:`, error.message);
  }
}

export async function resetProductsInDb(defaultProducts) {
  if (!supabase) return;
  await Promise.all(
    defaultProducts.map((p) => updateProductSizesInDb(p.sku, p.sizes))
  );
}

export async function saveChatMessageToDb({
  sessionId,
  username = 'guest',
  role,
  content,
  pageContext = 'beranda',
}) {
  if (!supabase || !content) return;
  const { error } = await supabase.from('chat_messages').insert({
    session_id: sessionId,
    username,
    role,
    content,
    page_context: pageContext,
  });

  if (error) {
    console.warn('Supabase saveChatMessage error:', error.message);
  }
}

export async function createHandoffTicketInDb({
  sessionId,
  username = 'guest',
  summary,
}) {
  if (!supabase) return;
  const { error } = await supabase.from('handoff_tickets').insert({
    session_id: sessionId,
    username,
    summary,
    status: 'open',
  });

  if (error) {
    console.warn('Supabase createHandoffTicket error:', error.message);
  }
}

const LOCAL_FALLBACK_ACCOUNTS = [
  {
    id: 'local-admin',
    username: 'admin',
    password_plain: 'talaka123',
    full_name: 'Admin Talaka',
    role: 'admin',
  },
  {
    id: 'local-customer',
    username: 'pelanggan',
    password_plain: 'talaka123',
    full_name: 'Pelanggan Demo',
    role: 'customer',
  },
];

export async function loginWithUsernamePassword({ username, password }) {
  const cleanUser = (username || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  if (!cleanUser || !cleanPass) {
    throw new Error('Username dan password wajib diisi.');
  }

  if (!supabase) {
    const found = LOCAL_FALLBACK_ACCOUNTS.find(
      (a) => a.username === cleanUser && a.password_plain === cleanPass
    );
    if (!found) {
      throw new Error('Username atau password salah.');
    }
    return {
      id: found.id,
      username: found.username,
      fullName: found.full_name,
      role: found.role,
    };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, password_plain, full_name, role')
    .eq('username', cleanUser)
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal memeriksa akun di Supabase: ${error.message}`);
  }
  if (!data || data.password_plain !== cleanPass) {
    throw new Error('Username atau password salah.');
  }

  return {
    id: data.id,
    username: data.username,
    fullName: data.full_name || data.username,
    role: data.role || 'customer',
  };
}

export async function registerCustomerAccount({
  username,
  password,
  fullName,
}) {
  const cleanUser = (username || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();
  const cleanName = (fullName || '').trim() || cleanUser;

  if (!cleanUser || cleanUser.length < 3) {
    throw new Error('Username minimal 3 karakter.');
  }
  if (!/^[a-z0-9._-]+$/.test(cleanUser)) {
    throw new Error(
      'Username hanya boleh huruf kecil, angka, titik, strip, atau underscore.'
    );
  }
  if (!cleanPass || cleanPass.length < 4) {
    throw new Error('Password minimal 4 karakter.');
  }

  if (!supabase) {
    return {
      id: `local-${Date.now()}`,
      username: cleanUser,
      fullName: cleanName,
      role: 'customer',
    };
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      username: cleanUser,
      password_plain: cleanPass,
      full_name: cleanName,
      role: 'customer',
    })
    .select('id, username, full_name, role')
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('Username sudah dipakai. Pilih username lain.');
    }
    throw new Error(`Gagal mendaftar akun: ${error.message}`);
  }

  return {
    id: data.id,
    username: data.username,
    fullName: data.full_name || data.username,
    role: data.role || 'customer',
  };
}

// ============================================================
// TAHAP A: ORDERS, TRACKING LOGS, & NOTIFICATIONS (SUPABASE + LOCAL FALLBACK)
// ============================================================

const LOCAL_ORDER_KEYS = {
  orders: 'talaka_orders_v1',
  tracking: 'talaka_order_tracking_v1',
  notifications: 'talaka_notifications_v1',
};

function readLocalJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeLocalJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Abaikan jika localStorage penuh/diblokir
  }
}

function mapDbOrder(row, logs = []) {
  return {
    id: row.id,
    orderCode: row.order_code,
    customerUsername: row.customer_username || 'guest',
    customerName: row.customer_name || 'Pelanggan',
    customerPhone: row.customer_phone || '',
    shippingAddress: row.shipping_address || '',
    paymentMethod: row.payment_method || 'COD',
    items: Array.isArray(row.items) ? row.items : [],
    totalPrice: Number(row.total_price) || 0,
    status: row.status || 'diproses',
    courier: row.courier || '',
    trackingNumber: row.tracking_number || '',
    lastLocation: row.last_location || 'Gudang Talaka Bogor',
    aiCompletionNote: row.ai_completion_note || '',
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || row.created_at || new Date().toISOString(),
    trackingLogs: logs,
  };
}

export function generateOrderCode() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `TLK-${num}`;
}

export async function createOrderInDb({
  customerUsername = 'guest',
  customerName,
  customerPhone = '',
  shippingAddress,
  paymentMethod = 'COD',
  items = [],
  totalPrice = 0,
}) {
  const nowIso = new Date().toISOString();
  const orderCode = generateOrderCode();
  const initialLocation = 'Gudang Talaka Bogor';
  const initialLog = {
    id: Date.now(),
    orderCode,
    status: 'diproses',
    location: initialLocation,
    note: `Pesanan dibuat via Kak Tala AI (${paymentMethod}). Menunggu verifikasi admin.`,
    createdAt: nowIso,
  };

  const localOrder = {
    id: `local-ord-${Date.now()}`,
    orderCode,
    customerUsername,
    customerName: (customerName || '').trim() || customerUsername,
    customerPhone: (customerPhone || '').trim(),
    shippingAddress: (shippingAddress || '').trim(),
    paymentMethod,
    items,
    totalPrice: Number(totalPrice) || 0,
    status: 'diproses',
    courier: '',
    trackingNumber: '',
    lastLocation: initialLocation,
    aiCompletionNote: '',
    createdAt: nowIso,
    updatedAt: nowIso,
    trackingLogs: [initialLog],
  };

  const localOrders = readLocalJson(LOCAL_ORDER_KEYS.orders, []);
  writeLocalJson(LOCAL_ORDER_KEYS.orders, [localOrder, ...localOrders]);
  const localTracking = readLocalJson(LOCAL_ORDER_KEYS.tracking, []);
  writeLocalJson(LOCAL_ORDER_KEYS.tracking, [initialLog, ...localTracking]);

  if (!supabase) {
    return { order: localOrder, syncedToDb: false };
  }

  const { data, error } = await supabase
    .from('orders')
    .insert({
      order_code: orderCode,
      customer_username: localOrder.customerUsername,
      customer_name: localOrder.customerName,
      customer_phone: localOrder.customerPhone,
      shipping_address: localOrder.shippingAddress,
      payment_method: localOrder.paymentMethod,
      items: localOrder.items,
      total_price: localOrder.totalPrice,
      status: 'diproses',
      last_location: initialLocation,
    })
    .select('*')
    .single();

  if (error) {
    console.warn('Supabase createOrder fallback to local:', error.message);
    return { order: localOrder, syncedToDb: false };
  }

  await supabase.from('order_tracking_logs').insert({
    order_code: orderCode,
    status: 'diproses',
    location: initialLocation,
    note: initialLog.note,
  });

  return { order: mapDbOrder(data, [initialLog]), syncedToDb: true };
}

export async function fetchOrdersFromDb({ username = '', isAdmin = false } = {}) {
  const localOrders = readLocalJson(LOCAL_ORDER_KEYS.orders, []);

  if (!supabase) {
    if (isAdmin) return localOrders;
    return localOrders.filter(
      (o) => !username || o.customerUsername === username
    );
  }

  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (!isAdmin && username) {
    query = query.eq('customer_username', username);
  }

  const { data: ordersData, error } = await query;
  if (error) {
    console.warn('Supabase fetchOrders fallback to local:', error.message);
    if (isAdmin) return localOrders;
    return localOrders.filter(
      (o) => !username || o.customerUsername === username
    );
  }

  const orderCodes = (ordersData || []).map((o) => o.order_code);
  const logsByCode = {};
  if (orderCodes.length > 0) {
    const { data: logsData } = await supabase
      .from('order_tracking_logs')
      .select('*')
      .in('order_code', orderCodes)
      .order('created_at', { ascending: false });

    (logsData || []).forEach((log) => {
      if (!logsByCode[log.order_code]) logsByCode[log.order_code] = [];
      logsByCode[log.order_code].push({
        id: log.id,
        orderCode: log.order_code,
        status: log.status,
        location: log.location || '',
        note: log.note || '',
        createdAt: log.created_at,
      });
    });
  }

  const dbMapped = (ordersData || []).map((row) =>
    mapDbOrder(row, logsByCode[row.order_code] || [])
  );

  const dbCodes = new Set(dbMapped.map((o) => o.orderCode));
  const extraLocal = localOrders.filter((o) => {
    if (dbCodes.has(o.orderCode)) return false;
    return isAdmin || !username || o.customerUsername === username;
  });

  return [...dbMapped, ...extraLocal];
}

/**
 * Cari 1 pesanan berdasarkan Kode Order (misal TLK-1234) atau Nomor Resi (misal JNE/JP...)
 * di Supabase maupun fallback localStorage untuk fitur Cek Resi langsung dari chat Kak Tala.
 */
export async function lookupOrderByCodeOrTracking(queryToken) {
  const clean = String(queryToken || '').trim().toUpperCase();
  if (!clean) return null;

  const localOrders = readLocalJson(LOCAL_ORDER_KEYS.orders, []);
  const localMatch =
    localOrders.find(
      (o) =>
        (o.orderCode || '').toUpperCase() === clean ||
        (o.trackingNumber || '').toUpperCase() === clean
    ) || null;

  if (!supabase) return localMatch;

  const { data: orderRows, error } = await supabase
    .from('orders')
    .select('*')
    .or(`order_code.ilike.${clean},tracking_number.ilike.${clean}`)
    .limit(1);

  if (error || !orderRows || orderRows.length === 0) {
    return localMatch;
  }

  const row = orderRows[0];
  const { data: logsData } = await supabase
    .from('order_tracking_logs')
    .select('*')
    .eq('order_code', row.order_code)
    .order('created_at', { ascending: false });

  const mappedLogs = (logsData || []).map((log) => ({
    id: log.id,
    orderCode: log.order_code,
    status: log.status,
    location: log.location || '',
    note: log.note || '',
    createdAt: log.created_at,
  }));

  return mapDbOrder(row, mappedLogs);
}

export async function updateOrderStatusInDb({
  orderCode,
  status,
  courier = '',
  trackingNumber = '',
  lastLocation = '',
  note = '',
  aiCompletionNote = '',
}) {
  const nowIso = new Date().toISOString();
  const logEntry = {
    id: Date.now(),
    orderCode,
    status,
    location: lastLocation || 'Update Admin Talaka',
    note:
      note ||
      (status === 'dikemas'
        ? 'Pesanan sedang dikemas rapi oleh tim gudang Talaka.'
        : status === 'dikirim'
          ? `Paket diserahkan ke kurir ${courier || 'ekspedisi'} (Resi: ${trackingNumber || '-'}).`
          : status === 'selesai'
            ? 'Pesanan telah sampai di alamat tujuan & dikonfirmasi selesai.'
            : 'Status pesanan diperbarui.'),
    createdAt: nowIso,
  };

  const localOrders = readLocalJson(LOCAL_ORDER_KEYS.orders, []);
  const nextLocal = localOrders.map((ord) => {
    if (ord.orderCode !== orderCode) return ord;
    return {
      ...ord,
      status,
      courier: courier || ord.courier,
      trackingNumber: trackingNumber || ord.trackingNumber,
      lastLocation: lastLocation || ord.lastLocation,
      aiCompletionNote: aiCompletionNote || ord.aiCompletionNote,
      updatedAt: nowIso,
      trackingLogs: [logEntry, ...(ord.trackingLogs || [])],
    };
  });
  writeLocalJson(LOCAL_ORDER_KEYS.orders, nextLocal);

  if (!supabase) return { ok: true, syncedToDb: false, logEntry };

  const updatePayload = {
    status,
    updated_at: nowIso,
  };
  if (courier) updatePayload.courier = courier;
  if (trackingNumber) updatePayload.tracking_number = trackingNumber;
  if (lastLocation) updatePayload.last_location = lastLocation;
  if (aiCompletionNote) updatePayload.ai_completion_note = aiCompletionNote;

  const { error } = await supabase
    .from('orders')
    .update(updatePayload)
    .eq('order_code', orderCode);

  if (error) {
    console.warn('Supabase updateOrderStatus fallback:', error.message);
    return { ok: true, syncedToDb: false, logEntry };
  }

  await supabase.from('order_tracking_logs').insert({
    order_code: orderCode,
    status,
    location: logEntry.location,
    note: logEntry.note,
  });

  return { ok: true, syncedToDb: true, logEntry };
}

export async function createNotificationInDb({
  recipientUsername,
  orderCode = '',
  title,
  message,
  channel = 'web',
}) {
  const nowIso = new Date().toISOString();
  const localNotif = {
    id: Date.now(),
    recipientUsername: recipientUsername || 'guest',
    orderCode,
    title,
    message,
    channel,
    isRead: false,
    createdAt: nowIso,
  };

  const existing = readLocalJson(LOCAL_ORDER_KEYS.notifications, []);
  writeLocalJson(LOCAL_ORDER_KEYS.notifications, [localNotif, ...existing]);

  if (!supabase) return localNotif;

  const { data, error } = await supabase
    .from('notifications')
    .insert({
      recipient_username: localNotif.recipientUsername,
      order_code: orderCode,
      title,
      message,
      channel,
      is_read: false,
    })
    .select('*')
    .single();

  if (error) {
    console.warn('Supabase createNotification fallback:', error.message);
    return localNotif;
  }

  return {
    id: data.id,
    recipientUsername: data.recipient_username,
    orderCode: data.order_code,
    title: data.title,
    message: data.message,
    channel: data.channel,
    isRead: Boolean(data.is_read),
    createdAt: data.created_at,
  };
}

export async function fetchNotificationsFromDb(username) {
  if (!username) return [];
  const localList = readLocalJson(LOCAL_ORDER_KEYS.notifications, []).filter(
    (n) => n.recipientUsername === username
  );

  if (!supabase) return localList;

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('recipient_username', username)
    .order('created_at', { ascending: false })
    .limit(30);

  if (error) {
    console.warn('Supabase fetchNotifications fallback:', error.message);
    return localList;
  }

  const dbMapped = (data || []).map((row) => ({
    id: row.id,
    recipientUsername: row.recipient_username,
    orderCode: row.order_code || '',
    title: row.title,
    message: row.message,
    channel: row.channel || 'web',
    isRead: Boolean(row.is_read),
    createdAt: row.created_at,
  }));

  return dbMapped.length > 0 ? dbMapped : localList;
}

export async function markNotificationsReadInDb(username) {
  if (!username) return;
  const localList = readLocalJson(LOCAL_ORDER_KEYS.notifications, []).map((n) =>
    n.recipientUsername === username ? { ...n, isRead: true } : n
  );
  writeLocalJson(LOCAL_ORDER_KEYS.notifications, localList);

  if (!supabase) return;
  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('recipient_username', username)
    .eq('is_read', false);
}

// ============================================================
// TAHAP C: AI REPORTS, SOCIAL TRENDS, & RECENT CHAT INSIGHTS
// ============================================================

const LOCAL_ANALYTICS_KEYS = {
  reports: 'talaka_ai_reports_v1',
  trends: 'talaka_social_trends_v1',
};

export const DEFAULT_BASELINE_TRENDS = [
  {
    id: 'seed-tt-1',
    platform: 'tiktok',
    topic: 'Earth-Tone Smart Casual & Linen Breathable',
    hashtag: '#ootdindonesia #kemejalinen',
    sentiment: 'positif',
    engagementScore: 92,
    sampleCaption: 'Outfit ngampus & kerja anti gerah pakai linen putih + kulot krem.',
    insight: 'Netizen banyak mencari kemeja linen yang tidak terlalu menerawang dan mudah dipadukan.',
    scrapedAt: new Date().toISOString(),
  },
  {
    id: 'seed-ig-1',
    platform: 'instagram',
    topic: 'Petite Friendly High-Waist & Chunky Sneaker',
    hashtag: '#petiteoutfit #sneakerslokal',
    sentiment: 'kritis',
    engagementScore: 87,
    sampleCaption: 'Tips TB 153–158 cm biar kulot nggak nyapu lantai tanpa permak.',
    insight: 'Keluhan utama di komentar IG Reels: panjang celana kulot dan kebutuhan sepatu bersol 3–4 cm.',
    scrapedAt: new Date().toISOString(),
  },
  {
    id: 'seed-th-1',
    platform: 'threads',
    topic: 'Diskusi Kejujuran Sizing Brand Lokal',
    hashtag: '#brandlokal #fashionindo',
    sentiment: 'netral',
    engagementScore: 81,
    sampleCaption: 'Capek beli baju online asal dibilang muat, ujung-ujungnya retur.',
    insight: 'Konsumen makin menghargai brand yang jujur soal potongan & panduan TB/BB presisi.',
    scrapedAt: new Date().toISOString(),
  },
  {
    id: 'seed-x-1',
    platform: 'x',
    topic: 'Bundling Outfit Kantor & Kuliah Hemat',
    hashtag: '#outfitkantor #rekomendasioutfit',
    sentiment: 'positif',
    engagementScore: 79,
    sampleCaption: 'Cari satu set atasan + sepatu nyaman dipakai jalan seharian di bawah 800rb.',
    insight: 'Minat tinggi pada paket bundling 2–3 item dengan potongan harga khusus.',
    scrapedAt: new Date().toISOString(),
  },
];

export async function fetchSocialTrendsFromDb() {
  const localTrends = readLocalJson(
    LOCAL_ANALYTICS_KEYS.trends,
    DEFAULT_BASELINE_TRENDS
  );

  if (!supabase) return localTrends;

  const { data, error } = await supabase
    .from('social_trends')
    .select('*')
    .order('scraped_at', { ascending: false })
    .limit(20);

  if (error || !data || data.length === 0) {
    return localTrends;
  }

  return data.map((row) => ({
    id: row.id,
    platform: row.platform,
    topic: row.topic,
    hashtag: row.hashtag || '',
    sentiment: row.sentiment || 'positif',
    engagementScore: Number(row.engagement_score) || 75,
    sampleCaption: row.sample_caption || '',
    insight: row.insight || '',
    scrapedAt: row.scraped_at,
  }));
}

export async function saveSocialTrendsToDb(newTrends = []) {
  if (!Array.isArray(newTrends) || newTrends.length === 0) {
    return { trends: [], syncedToDb: false };
  }

  const nowIso = new Date().toISOString();
  const normalized = newTrends.map((t, idx) => ({
    id: t.id || `apify-${Date.now()}-${idx}`,
    platform: ['tiktok', 'instagram', 'threads', 'x'].includes(
      String(t.platform || '').toLowerCase()
    )
      ? String(t.platform).toLowerCase()
      : 'tiktok',
    topic: String(t.topic || 'Tren Fashion Lokal').slice(0, 160),
    hashtag: String(t.hashtag || '').slice(0, 160),
    sentiment: String(t.sentiment || 'positif').slice(0, 40),
    engagementScore: Math.max(
      10,
      Math.min(100, Math.round(Number(t.engagementScore) || 80))
    ),
    sampleCaption: String(t.sampleCaption || '').slice(0, 260),
    insight: String(t.insight || '').slice(0, 300),
    scrapedAt: t.scrapedAt || nowIso,
  }));

  const existingLocal = readLocalJson(LOCAL_ANALYTICS_KEYS.trends, []);
  const mergedLocal = [...normalized, ...existingLocal].slice(0, 24);
  writeLocalJson(LOCAL_ANALYTICS_KEYS.trends, mergedLocal);

  if (!supabase) return { trends: normalized, syncedToDb: false };

  const rowsToInsert = normalized.map((t) => ({
    platform: t.platform,
    topic: t.topic,
    hashtag: t.hashtag,
    sentiment: t.sentiment,
    engagement_score: t.engagementScore,
    sample_caption: t.sampleCaption,
    insight: t.insight,
    scraped_at: t.scrapedAt,
  }));

  const { error } = await supabase.from('social_trends').insert(rowsToInsert);
  if (error) {
    console.warn('Supabase saveSocialTrends fallback:', error.message);
    return { trends: normalized, syncedToDb: false };
  }

  return { trends: normalized, syncedToDb: true };
}

export async function fetchAiReportsFromDb() {
  const localReports = readLocalJson(LOCAL_ANALYTICS_KEYS.reports, []);

  if (!supabase) return localReports;

  const { data, error } = await supabase
    .from('ai_reports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(15);

  if (error) {
    console.warn('Supabase fetchAiReports fallback:', error.message);
    return localReports;
  }

  const dbMapped = (data || []).map((row) => ({
    id: row.id,
    reportTitle: row.report_title,
    periodLabel: row.period_label || '',
    summary: row.summary,
    trendingHighlights: Array.isArray(row.trending_highlights)
      ? row.trending_highlights
      : [],
    storeInsights: Array.isArray(row.store_insights) ? row.store_insights : [],
    targetAudience:
      row.target_audience && typeof row.target_audience === 'object'
        ? row.target_audience
        : {},
    promoRecommendations: Array.isArray(row.promo_recommendations)
      ? row.promo_recommendations
      : [],
    triggeredBy: row.triggered_by || 'manual',
    createdAt: row.created_at,
  }));

  return dbMapped.length > 0 ? dbMapped : localReports;
}

export async function saveAiReportToDb(report) {
  const nowIso = new Date().toISOString();
  const localEntry = {
    id: `rep-${Date.now()}`,
    reportTitle: report.reportTitle || 'Laporan Analisis AI Talaka',
    periodLabel: report.periodLabel || 'Periode 3 Hari Terakhir',
    summary: report.summary || '',
    trendingHighlights: report.trendingHighlights || [],
    storeInsights: report.storeInsights || [],
    targetAudience: report.targetAudience || {},
    promoRecommendations: report.promoRecommendations || [],
    triggeredBy: report.triggeredBy || 'manual',
    createdAt: nowIso,
  };

  const existing = readLocalJson(LOCAL_ANALYTICS_KEYS.reports, []);
  writeLocalJson(LOCAL_ANALYTICS_KEYS.reports, [localEntry, ...existing].slice(0, 20));

  if (!supabase) return { report: localEntry, syncedToDb: false };

  const { data, error } = await supabase
    .from('ai_reports')
    .insert({
      report_title: localEntry.reportTitle,
      period_label: localEntry.periodLabel,
      summary: localEntry.summary,
      trending_highlights: localEntry.trendingHighlights,
      store_insights: localEntry.storeInsights,
      target_audience: localEntry.targetAudience,
      promo_recommendations: localEntry.promoRecommendations,
      triggered_by: localEntry.triggeredBy,
    })
    .select('*')
    .single();

  if (error) {
    console.warn('Supabase saveAiReport fallback:', error.message);
    return { report: localEntry, syncedToDb: false };
  }

  return {
    report: {
      ...localEntry,
      id: data.id,
      createdAt: data.created_at,
    },
    syncedToDb: true,
  };
}

export async function fetchRecentChatMessagesFromDb(limit = 40) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('chat_messages')
    .select('id, session_id, username, role, content, page_context, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('Supabase fetchRecentChatMessages error:', error.message);
    return [];
  }
  return data || [];
}
