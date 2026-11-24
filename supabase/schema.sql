-- ============================================================
-- TALAKA AI AGENT — SUPABASE POSTGRESQL SCHEMA & SEED DATA
-- Jalankan seluruh script ini di Supabase Dashboard -> SQL Editor
-- ============================================================

-- 1. Tabel Profil User (untuk Tahap 3: Login Dasar & Role)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_plain text not null, -- Untuk demo/tugas sekolah (produksi gunakan Supabase Auth / bcrypt)
  full_name text not null default '',
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

-- Seed 2 akun demo default (admin & customer)
insert into public.profiles (username, password_plain, full_name, role)
values
  ('admin', 'talaka123', 'Admin Talaka', 'admin'),
  ('pelanggan', 'talaka123', 'Pelanggan Demo', 'customer')
on conflict (username) do nothing;

-- 2. Tabel Produk & Stok Live (Single Source of Truth Etalase + AI)
create table if not exists public.products (
  sku text primary key,
  name text not null,
  category text not null,
  badge text,
  image text,
  price integer not null,
  price_formatted text not null,
  material text not null,
  fit text not null,
  colors jsonb not null default '[]'::jsonb,
  sizes jsonb not null default '{}'::jsonb,
  measurements text,
  care text,
  style text,
  occasions text,
  pair_with text,
  proportion_tip text,
  honest_note text,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

-- Seed 8 produk resmi Talaka (3 Sneaker + 5 Apparel)
insert into public.products (
  sku, name, category, badge, image, price, price_formatted, material, fit,
  colors, sizes, measurements, care, style, occasions, pair_with, proportion_tip, honest_note, sort_order
) values
(
  'SNK-006', 'Talaka Aurora Mocca Runner', 'Sepatu', 'Best Seller', '/images/sneaker-mocca.jpg',
  549000, 'Rp549.000', 'Breathable mesh & premium suede overlay, outsole EVA empuk', 'True to Size (Unisex)',
  '["Mocca", "Espresso"]'::jsonb,
  '{"Mocca":{"39":4,"40":6,"41":2,"42":5,"43":0,"44":3},"Espresso":{"39":2,"40":4,"41":5,"42":1,"43":3,"44":0}}'::jsonb,
  'EU 39 (24.5 cm), 40 (25 cm), 41 (26 cm), 42 (26.5 cm), 43 (27.5 cm), 44 (28 cm)',
  'Bersihkan noda dengan sikat lembut & sabun khusus suede, jangan direndam air.',
  'Earth-tone modern, smart streetwear', 'Ngampus, kerja kreatif, jalan santai seharian',
  'Celana Kulot High-Waist (CLN-002) Krem atau Kemeja Linen Talaka (KMJ-001)',
  'Sol tebal 3.5 cm membantu memberi ilusi kaki lebih jenjang tanpa terasa berat.',
  'Untuk tipe kaki yang sangat lebar (wide feet), sebaiknya naik 1 ukuran agar bagian depan tetap lega.', 1
),
(
  'SNK-007', 'Talaka Cloud Off-White Chunky', 'Sepatu', 'New Arrival', '/images/sneaker-white.jpg',
  529000, 'Rp529.000', 'Vegan leather halus & mesh sirkulasi udara, sol chunky ringan', 'True to Size (Unisex)',
  '["Off-White", "Cream Mist"]'::jsonb,
  '{"Off-White":{"39":5,"40":3,"41":7,"42":4,"43":2,"44":1},"Cream Mist":{"39":3,"40":0,"41":4,"42":6,"43":3,"44":2}}'::jsonb,
  'EU 39 (24.5 cm), 40 (25 cm), 41 (26 cm), 42 (26.5 cm), 43 (27.5 cm), 44 (28 cm)',
  'Lap bagian kulit sintetis dengan kain lembap setelah dipakai agar warna putih tetap bersih.',
  'Clean minimalist, Korean casual', 'Harian, hangout, semi-formal santai',
  'Midi Dress A-Line Flowy (DRS-004) atau Kaos Oversize Heavyweight (TSH-005)',
  'Warna off-white netral menyatu mulus dengan hampir semua warna outfit.',
  'Bagian mesh warna terang butuh perawatan lebih rutin kalau sering dipakai saat musim hujan.', 2
),
(
  'SNK-008', 'Talaka Aurum Trail Statement', 'Sepatu', 'Limited Drop', '/images/sneaker-flashtrek.jpg',
  689000, 'Rp689.000', 'Layered leather, metallic gold panel, rugged rubber lug outsole', 'Chunky Fit (Unisex)',
  '["Crimson Gold", "Obsidian Red"]'::jsonb,
  '{"Crimson Gold":{"39":1,"40":2,"41":0,"42":3,"43":2,"44":0},"Obsidian Red":{"39":2,"40":3,"41":2,"42":1,"43":0,"44":1}}'::jsonb,
  'EU 39 (24.5 cm), 40 (25 cm), 41 (26 cm), 42 (26.5 cm), 43 (27.5 cm), 44 (28 cm)',
  'Lap perlahan menggunakan kain microfiber kering terutama pada detail strap kristal.',
  'Bold streetwear, statement luxury', 'Konser, acara kreatif, photoshoot, OOTD bold',
  'Kaos Oversize Heavyweight (TSH-005) Hitam & Celana Kulot Hitam (CLN-002)',
  'Karena sepatunya sudah mencolok, padukan dengan pakaian warna polos/monokrom agar seimbang.',
  'Bobotnya sedikit lebih berat dibanding seri Cloud karena sol trail tebal—kurang cocok jika dicari untuk lari olahraga.', 3
),
(
  'KMJ-001', 'Kemeja Linen Talaka', 'Atasan', 'Essential', '/images/kemeja-linen.jpg',
  249000, 'Rp249.000', 'Linen-katun breathable', 'Regular Fit',
  '["Putih", "Beige"]'::jsonb,
  '{"Putih":{"S":6,"M":2,"L":4,"XL":0},"Beige":{"S":4,"M":5,"L":3,"XL":2}}'::jsonb,
  'S (LD 96 / P 64), M (LD 102 / P 66), L (LD 108 / P 68), XL (LD 114 / P 70)',
  'Cuci tangan atau mesin mode lembut, setrika suhu sedang.',
  'Minimalis, casual rapi', 'Kuliah, kerja santai, hangout',
  'Celana Kulot High-Waist (CLN-002)',
  'Cocok dimasukkan ke bawahan high-waist atau dibuka sebagai outer tipis.',
  'Potongannya lurus; kurang pas kalau cari siluet yang sangat ketat di pinggang.', 4
),
(
  'CLN-002', 'Celana Kulot High-Waist', 'Bawahan', 'Best Seller', '/images/celana-kulot.jpg',
  279000, 'Rp279.000', 'Twill katun lembut (non-stretch, jatuh rapi)', 'High-Waist Wide Leg',
  '["Krem", "Hitam"]'::jsonb,
  '{"Krem":{"S":5,"M":7,"L":3,"XL":2},"Hitam":{"S":2,"M":0,"L":6,"XL":4}}'::jsonb,
  'S (LP 66 / P 96), M (LP 72 / P 98), L (LP 78 / P 100), XL (LP 84 / P 101)',
  'Cuci dengan warna senada, jemur di tempat teduh.',
  'Minimalis, smart casual', 'Ngampus, kantor, semi-formal',
  'Kemeja Linen Talaka (KMJ-001) atau Talaka Aurora Mocca Runner (SNK-006)',
  'Pinggang high-waist membantu kaki terlihat lebih jenjang.',
  'Untuk TB di bawah 156 cm, panjang 98–100 cm mungkin perlu lipatan kecil atau sepatu bersol agak tebal supaya tidak nyapu lantai.', 5
),
(
  'OUT-003', 'Outer Boxy Knit Cardigan', 'Outer', 'Layering', '/images/outer-cardigan.jpg',
  299000, 'Rp299.000', 'Knit katun halus (tidak gatal, medium-weight)', 'Oversize / Boxy',
  '["Sage", "Charcoal"]'::jsonb,
  '{"Sage":{"S":3,"M":6,"L":2,"XL":1},"Charcoal":{"S":5,"M":4,"L":5,"XL":0}}'::jsonb,
  'S (LD 108 / P 54), M (LD 114 / P 56), L (LD 120 / P 58), XL (LD 126 / P 60)',
  'Lipat saat disimpan (jangan digantung agar bahu tidak melar), cuci tangan.',
  'Casual, streetwear ringan', 'Hangout, ngampus, ruang ber-AC',
  'Celana Kulot High-Waist (CLN-002) warna Hitam/Krem',
  'Panjang crop-boxy membuat bagian atas tidak menenggelamkan tinggi badan.',
  'Karena potongannya sudah boxy/oversize, kalau suka tampilan lebih rapi bisa turun 1 ukuran.', 6
),
(
  'DRS-004', 'Midi Dress A-Line Flowy', 'Dress', 'Clean Look', '/images/midi-dress.jpg',
  349000, 'Rp349.000', 'Rayon twill premium (adem & jatuh)', 'A-Line Regular',
  '["Terracotta", "Navy"]'::jsonb,
  '{"Terracotta":{"S":4,"M":3,"L":1,"XL":0},"Navy":{"S":6,"M":5,"L":4,"XL":2}}'::jsonb,
  'S (LD 92 / P 112), M (LD 98 / P 114), L (LD 104 / P 116), XL (LD 110 / P 118)',
  'Cuci lembut dengan air dingin, hindari pengering panas agar tidak menyusut.',
  'Feminin, clean', 'Kondangan santai, makan malam, acara keluarga',
  'Outer Boxy Knit Cardigan (OUT-003) atau Talaka Cloud Off-White (SNK-007)',
  'Siluet A-line memberi ruang gerak nyaman di area pinggul tanpa terlihat penuh.',
  'Bahan rayon non-stretch, jadi kalau di perbatasan ukuran sebaiknya utamakan lingkar dada atau naik 1 ukuran.', 7
),
(
  'TSH-005', 'Kaos Oversize Heavyweight', 'Atasan', 'Daily Core', '/images/kaos-oversize.jpg',
  159000, 'Rp159.000', 'Cotton combed 20s (tebal, tidak menerawang)', 'Oversize',
  '["Hitam", "Broken White"]'::jsonb,
  '{"Hitam":{"S":8,"M":10,"L":7,"XL":3},"Broken White":{"S":2,"M":4,"L":0,"XL":5}}'::jsonb,
  'S (LD 108 / P 68), M (LD 114 / P 70), L (LD 120 / P 72), XL (LD 126 / P 74)',
  'Cuci balik bagian dalam ke luar, jangan disetrika langsung di area sablon/label.',
  'Streetwear, casual harian', 'Harian, nongkrong, kuliah',
  'Celana Kulot High-Waist (CLN-002) dengan metode french-tuck (masukkan depan saja)',
  'Cocok dipadukan dengan bawahan yang lebih terstruktur agar tetap terlihat rapi.',
  'Untuk TB di bawah 158 cm, ukuran M ke atas bisa terasa cukup panjang jika tidak dimasukkan ke celana.', 8
)
on conflict (sku) do nothing;

-- 3. Tabel Riwayat Chat AI
create table if not exists public.chat_messages (
  id bigint generated always as identity primary key,
  session_id text not null,
  username text default 'guest',
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  page_context text default 'beranda',
  created_at timestamptz not null default now()
);

-- 4. Tabel Tiket Eskalasi Admin (Human Handoff)
create table if not exists public.handoff_tickets (
  id bigint generated always as identity primary key,
  session_id text not null,
  username text default 'guest',
  summary text not null,
  status text not null default 'open' check (status in ('open', 'handled', 'closed')),
  created_at timestamptz not null default now()
);

-- 5. RLS Policies (Akses terbuka khusus MVP Demo Frontend; perketat dengan Supabase Auth untuk produksi)
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.chat_messages enable row level security;
alter table public.handoff_tickets enable row level security;

drop policy if exists "Allow anon read profiles" on public.profiles;
create policy "Allow anon read profiles" on public.profiles for select using (true);
drop policy if exists "Allow anon insert profiles" on public.profiles;
create policy "Allow anon insert profiles" on public.profiles for insert with check (true);

drop policy if exists "Allow anon read products" on public.products;
create policy "Allow anon read products" on public.products for select using (true);
drop policy if exists "Allow anon update products" on public.products;
create policy "Allow anon update products" on public.products for update using (true);

drop policy if exists "Allow anon insert chat_messages" on public.chat_messages;
create policy "Allow anon insert chat_messages" on public.chat_messages for insert with check (true);
drop policy if exists "Allow anon read chat_messages" on public.chat_messages;
create policy "Allow anon read chat_messages" on public.chat_messages for select using (true);

drop policy if exists "Allow anon insert handoff_tickets" on public.handoff_tickets;
create policy "Allow anon insert handoff_tickets" on public.handoff_tickets for insert with check (true);
drop policy if exists "Allow anon read handoff_tickets" on public.handoff_tickets;
create policy "Allow anon read handoff_tickets" on public.handoff_tickets for select using (true);

-- ============================================================
-- TAHAP A: PESANAN (CHECKOUT CHATBOT), TRACKING KURIR, & NOTIF AI
-- ============================================================

-- 6. Tabel Pesanan (Orders dari Chatbot / Web)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text unique not null,
  customer_username text not null default 'guest',
  customer_name text not null,
  customer_phone text not null default '',
  shipping_address text not null,
  payment_method text not null default 'COD',
  items jsonb not null default '[]'::jsonb,
  total_price integer not null default 0,
  status text not null default 'diproses' check (status in ('diproses', 'dikemas', 'dikirim', 'selesai')),
  courier text not null default '',
  tracking_number text not null default '',
  last_location text not null default 'Gudang Talaka Bogor',
  ai_completion_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7. Tabel Riwayat Tracking Pengiriman
create table if not exists public.order_tracking_logs (
  id bigint generated always as identity primary key,
  order_code text not null,
  status text not null,
  location text not null default '',
  note text not null default '',
  created_at timestamptz not null default now()
);

-- 8. Tabel Notifikasi AI untuk Pembeli (Web + siap sinkron Telegram/WA)
create table if not exists public.notifications (
  id bigint generated always as identity primary key,
  recipient_username text not null,
  order_code text not null default '',
  title text not null,
  message text not null,
  channel text not null default 'web',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- RLS Policies untuk Orders, Tracking Logs, & Notifications (MVP Demo)
alter table public.orders enable row level security;
alter table public.order_tracking_logs enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "Allow anon read orders" on public.orders;
create policy "Allow anon read orders" on public.orders for select using (true);
drop policy if exists "Allow anon insert orders" on public.orders;
create policy "Allow anon insert orders" on public.orders for insert with check (true);
drop policy if exists "Allow anon update orders" on public.orders;
create policy "Allow anon update orders" on public.orders for update using (true);

drop policy if exists "Allow anon read tracking_logs" on public.order_tracking_logs;
create policy "Allow anon read tracking_logs" on public.order_tracking_logs for select using (true);
drop policy if exists "Allow anon insert tracking_logs" on public.order_tracking_logs;
create policy "Allow anon insert tracking_logs" on public.order_tracking_logs for insert with check (true);

drop policy if exists "Allow anon read notifications" on public.notifications;
create policy "Allow anon read notifications" on public.notifications for select using (true);
drop policy if exists "Allow anon insert notifications" on public.notifications;
create policy "Allow anon insert notifications" on public.notifications for insert with check (true);
drop policy if exists "Allow anon update notifications" on public.notifications;
create policy "Allow anon update notifications" on public.notifications for update using (true);

-- ============================================================
-- TAHAP C & D: TREN SOSMED (APIFY) & LAPORAN ANALISIS AI 3 HARIAN
-- ============================================================

-- 9. Tabel Tren Sosmed (TikTok, Instagram, Threads, X)
create table if not exists public.social_trends (
  id bigint generated always as identity primary key,
  platform text not null check (platform in ('tiktok', 'instagram', 'threads', 'x')),
  topic text not null,
  hashtag text not null default '',
  sentiment text not null default 'positif',
  engagement_score integer not null default 75,
  sample_caption text not null default '',
  insight text not null default '',
  scraped_at timestamptz not null default now()
);

-- 10. Tabel Laporan Analisis AI Otomatis (Setiap 3 Hari Sekali & Manual)
create table if not exists public.ai_reports (
  id uuid primary key default gen_random_uuid(),
  report_title text not null,
  period_label text not null default '',
  summary text not null,
  trending_highlights jsonb not null default '[]'::jsonb,
  store_insights jsonb not null default '[]'::jsonb,
  target_audience jsonb not null default '{}'::jsonb,
  promo_recommendations jsonb not null default '[]'::jsonb,
  triggered_by text not null default 'manual' check (triggered_by in ('manual', 'cron_3d')),
  created_at timestamptz not null default now()
);

alter table public.social_trends enable row level security;
alter table public.ai_reports enable row level security;

drop policy if exists "Allow anon read social_trends" on public.social_trends;
create policy "Allow anon read social_trends" on public.social_trends for select using (true);
drop policy if exists "Allow anon insert social_trends" on public.social_trends;
create policy "Allow anon insert social_trends" on public.social_trends for insert with check (true);

drop policy if exists "Allow anon read ai_reports" on public.ai_reports;
create policy "Allow anon read ai_reports" on public.ai_reports for select using (true);
drop policy if exists "Allow anon insert ai_reports" on public.ai_reports;
create policy "Allow anon insert ai_reports" on public.ai_reports for insert with check (true);
