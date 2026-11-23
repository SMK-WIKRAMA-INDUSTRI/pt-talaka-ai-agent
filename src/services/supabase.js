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
