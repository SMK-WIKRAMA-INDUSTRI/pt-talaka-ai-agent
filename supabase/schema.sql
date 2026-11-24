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
),
-- Koleksi Kerja
(
  'KMJ-010', 'Kemeja Oxford Slim Premium', 'Atasan', 'Office Ready', '/images/oxford-shirt.jpg',
  289000, 'Rp289.000', 'Oxford cotton 100%', 'Slim Fit',
  '["Putih", "Steel Blue"]'::jsonb,
  '{"Putih":{"S":5,"M":8,"L":6,"XL":4},"Steel Blue":{"S":4,"M":7,"L":5,"XL":3}}'::jsonb,
  'S (LD 94 / P 73), M (LD 100 / P 75), L (LD 106 / P 77), XL (LD 112 / P 79)',
  'Setrika suhu sedang saat agak lembap, cuci mesin gentle cycle.',
  'Formal, smart casual', 'Kerja',
  'Celana Bahan Slim (CLN-011) atau Blazer Struktural Talaka (BLZ-012)',
  'Slim fit memberi kesan proporsional di tubuh ramping maupun atletis.',
  'Potongannya snug di bahu; kalau bahu lebar sebaiknya naik 1 ukuran.', 9
),
(
  'CLN-011', 'Celana Bahan Slim Kerja', 'Bawahan', 'Office Ready', '/images/celana-bahan.jpg',
  319000, 'Rp319.000', 'Tropical wool blend', 'Slim Straight',
  '["Charcoal", "Navy"]'::jsonb,
  '{"Charcoal":{"S":4,"M":6,"L":5,"XL":3},"Navy":{"S":3,"M":5,"L":4,"XL":4}}'::jsonb,
  'S (LP 70 / P 98), M (LP 76 / P 100), L (LP 82 / P 102), XL (LP 88 / P 103)',
  'Gantung setelah dipakai, setrika bagian dalam.',
  'Business formal, smart casual', 'Kerja',
  'Kemeja Oxford Slim Premium (KMJ-010) atau Blazer Struktural Talaka (BLZ-012)',
  'Potongan slim straight memperlihatkan panjang kaki secara alami.',
  'Bahan tidak stretch; utamakan lingkar pinggang pas.', 10
),
(
  'BLZ-012', 'Blazer Struktural Talaka', 'Outer', 'Power Look', '/images/blazer-talaka.jpg',
  489000, 'Rp489.000', 'Polyester-viscose woven', 'Regular Structured',
  '["Hitam", "Slate Grey"]'::jsonb,
  '{"Hitam":{"S":3,"M":5,"L":4,"XL":2},"Slate Grey":{"S":4,"M":6,"L":3,"XL":2}}'::jsonb,
  'S (LD 96 / P 68), M (LD 102 / P 70), L (LD 108 / P 72), XL (LD 114 / P 74)',
  'Gantung di hanger berbahu, setrika uap suhu sedang.',
  'Formal, power dressing', 'Kerja',
  'Kemeja Oxford Slim (KMJ-010) + Celana Bahan Slim (CLN-011)',
  'Bahu terstruktur mempertegas postur tubuh.',
  'Gerakan tangan ke atas sedikit terbatas karena konstruksi bahu tegas.', 11
),
-- Koleksi Clubbing
(
  'TOP-013', 'Satin Corset Top Talaka', 'Atasan', 'Night Out', '/images/satin-corset.jpg',
  219000, 'Rp219.000', 'Satin polyester shiny', 'Fitted Corset',
  '["Midnight Black", "Dusty Rose"]'::jsonb,
  '{"Midnight Black":{"S":4,"M":6,"L":3,"XL":2},"Dusty Rose":{"S":5,"M":4,"L":2,"XL":1}}'::jsonb,
  'S (LD 80 / P 42), M (LD 86 / P 43), L (LD 92 / P 44), XL (LD 98 / P 45)',
  'Cuci tangan perlahan, jangan diperas.',
  'Glamour, party, edgy chic', 'Clubbing',
  'Rok Mini Pleated (SKR-014) atau celana high-waist gelap.',
  'Boning mengikat pinggang secara alami untuk siluet hourglass.',
  'Pas di badan, pilih sesuai ukuran lingkar dada & pinggang aktual.', 12
),
(
  'SKR-014', 'Mini Pleated Skirt Metallic', 'Bawahan', 'Night Out', '/images/pleated-skirt.jpg',
  199000, 'Rp199.000', 'Metallic polyester pleated', 'Mini Flare',
  '["Deep Purple", "Midnight Black"]'::jsonb,
  '{"Deep Purple":{"S":4,"M":5,"L":3,"XL":1},"Midnight Black":{"S":6,"M":7,"L":4,"XL":2}}'::jsonb,
  'S (LP 62 / P 38), M (LP 68 / P 39), L (LP 74 / P 40), XL (LP 80 / P 41)',
  'Cuci tangan air dingin, jangan setrika langsung.',
  'Party, disko, retro glam', 'Clubbing',
  'Satin Corset Top Talaka (TOP-013) + boots/heels.',
  'Panjang mini memperlihatkan kaki lebih jenjang.',
  'Pleating memberi volume di pinggul.', 13
),
(
  'JKT-015', 'Jaket Kulit Faux Night Rider', 'Outer', 'Night Out', '/images/leather-jacket.jpg',
  549000, 'Rp549.000', 'Faux leather PU premium', 'Slim Moto Jacket',
  '["Midnight Black", "Rose Gold"]'::jsonb,
  '{"Midnight Black":{"S":2,"M":4,"L":3,"XL":1},"Rose Gold":{"S":3,"M":3,"L":2,"XL":1}}'::jsonb,
  'S (LD 96 / P 60), M (LD 102 / P 62), L (LD 108 / P 64), XL (LD 114 / P 66)',
  'Lap kain lembap, gunakan conditioner faux-leather.',
  'Edgy, rock glam', 'Clubbing',
  'Satin Corset Top (TOP-013) + Mini Pleated Skirt (SKR-014)',
  'Crop moto jacket mempertahankan proporsi tinggi tubuh.',
  'Kulit PU terasa hangat jika di ruangan non-AC.', 14
),
-- Koleksi Mengaji
(
  'GMS-016', 'Gamis Linen Modest Talaka', 'Dress', 'Modest Wear', '/images/gamis-linen.jpg',
  389000, 'Rp389.000', 'Linen-rayon premium', 'Loose A-Line (Syari)',
  '["Sage", "Warm Grey"]'::jsonb,
  '{"Sage":{"S":5,"M":6,"L":4,"XL":3},"Warm Grey":{"S":4,"M":7,"L":5,"XL":2}}'::jsonb,
  'S (LD 104 / P 138), M (LD 110 / P 140), L (LD 116 / P 142), XL (LD 122 / P 144)',
  'Cuci tangan deterjen lembut, jemur terbalik di tempat teduh.',
  'Modest, syari, anggun natural', 'Mengaji',
  'Khimar Chiffon Talaka (KHM-017)',
  'Panjang maxi + siluet A-line memberi kesan anggun dan menutup lekuk.',
  'Bahan linen bisa sedikit kusut setelah duduk lama.', 15
),
(
  'KHM-017', 'Khimar Chiffon Talaka', 'Outer', 'Modest Wear', '/images/khimar-chiffon.jpg',
  149000, 'Rp149.000', 'Chiffon georgette', 'Loose Drape',
  '["Putih", "Olive"]'::jsonb,
  '{"Putih":{"One Size":12},"Olive":{"One Size":9}}'::jsonb,
  'One Size — Lebar 150 cm, Panjang 110 cm',
  'Cuci tangan perlahan, setrika suhu rendah.',
  'Syari, modest, anggun', 'Mengaji',
  'Gamis Linen Modest Talaka (GMS-016)',
  'Drape chiffon menutupi dada & bahu secara nyaman.',
  'Gunakan inner ciput gelap agar tidak menerawang.', 16
),
(
  'RKU-018', 'Rok Kembang Muslimah Flowy', 'Bawahan', 'Modest Wear', '/images/rok-kembang.jpg',
  229000, 'Rp229.000', 'Rayon twill adem', 'High-Waist Maxi Flare',
  '["Forest Green", "Lavender"]'::jsonb,
  '{"Forest Green":{"S":4,"M":6,"L":3,"XL":2},"Lavender":{"S":5,"M":5,"L":4,"XL":3}}'::jsonb,
  'S (LP 66 / P 108), M (LP 72 / P 110), L (LP 78 / P 112), XL (LP 84 / P 113)',
  'Cuci lembut, jemur terbalik.',
  'Modest, feminin syari', 'Mengaji',
  'Kemeja Linen Talaka (KMJ-001) atau Khimar Chiffon (KHM-017)',
  'High-waist maxi flare memberi ilusi tubuh jenjang.',
  'Perlu alas kaki minimal 3 cm untuk TB di bawah 158 cm.', 17
),
-- Koleksi Belajar
(
  'HDI-019', 'Hoodie Fleece Soft Talaka', 'Outer', 'Study Mode', '/images/hoodie-fleece.jpg',
  279000, 'Rp279.000', 'Fleece cotton 320gsm', 'Oversize Relaxed',
  '["Lavender", "Charcoal"]'::jsonb,
  '{"Lavender":{"S":5,"M":8,"L":6,"XL":4},"Charcoal":{"S":4,"M":9,"L":7,"XL":5}}'::jsonb,
  'S (LD 110 / P 68), M (LD 116 / P 70), L (LD 122 / P 72), XL (LD 128 / P 74)',
  'Cuci balik suhu rendah, jangan gunakan pengering mesin.',
  'Cozy, minimalis casual', 'Belajar',
  'Jogger Pants Comfort Talaka (JGR-020)',
  'Oversize fit sangat nyaman untuk berjam-jam belajar di meja.',
  'Kurang cocok untuk cuaca terik di luar ruangan.', 18
),
(
  'JGR-020', 'Jogger Pants Comfort Talaka', 'Bawahan', 'Study Mode', '/images/jogger-comfort.jpg',
  199000, 'Rp199.000', 'French terry cotton', 'Tapered Relaxed',
  '["Hitam", "Sand"]'::jsonb,
  '{"Hitam":{"S":7,"M":10,"L":8,"XL":5},"Sand":{"S":4,"M":6,"L":5,"XL":3}}'::jsonb,
  'S (LP 60–74 / P 96), M (LP 66–80 / P 98), L (LP 72–86 / P 100), XL (LP 78–92 / P 101)',
  'Cuci biasa, hindari pemutih.',
  'Casual, comfy, lounge', 'Belajar',
  'Hoodie Fleece Soft Talaka (HDI-019)',
  'Pinggang elastik nyaman untuk duduk lama.',
  'Tidak untuk setelan formal.', 19
),
(
  'TSH-021', 'Kaos Grafis Study Vibes', 'Atasan', 'Study Mode', '/images/kaos-study.jpg',
  169000, 'Rp169.000', 'Cotton combed 24s', 'Regular Fit',
  '["Sky Blue", "Broken White"]'::jsonb,
  '{"Sky Blue":{"S":6,"M":8,"L":5,"XL":3},"Broken White":{"S":5,"M":7,"L":6,"XL":4}}'::jsonb,
  'S (LD 100 / P 68), M (LD 106 / P 70), L (LD 112 / P 72), XL (LD 118 / P 74)',
  'Cuci balik, jangan setrika langsung di area grafis.',
  'Casual, playful, chill', 'Belajar',
  'Jogger Pants Comfort Talaka (JGR-020)',
  'Regular fit fleksibel untuk santai maupun belajar.',
  'Bahan 24s lebih tipis dari model heavyweight.', 20
),
-- Koleksi Kampus
(
  'PLO-022', 'Polo Shirt Pique Talaka', 'Atasan', 'Campus Life', 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=700&q=80',
  209000, 'Rp209.000', 'Pique cotton 220gsm', 'Regular Slim',
  '["Navy", "Sage"]'::jsonb,
  '{"Navy":{"S":6,"M":9,"L":7,"XL":4},"Sage":{"S":5,"M":7,"L":6,"XL":3}}'::jsonb,
  'S (LD 98 / P 68), M (LD 104 / P 70), L (LD 110 / P 72), XL (LD 116 / P 74)',
  'Cuci biasa, setrika suhu sedang.',
  'Smart casual, preppy, campus chic', 'Kampus',
  'Chino Stretch Kampus Talaka (CHN-023)',
  'Kerah polo memberi kesan rapi instan untuk kuliah atau presentasi.',
  'Bahan pique berserat tekstur khas polo.', 21
),
(
  'CHN-023', 'Chino Stretch Kampus Talaka', 'Bawahan', 'Campus Life', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=80',
  259000, 'Rp259.000', 'Chino cotton-stretch 2% spandex', 'Slim Chino',
  '["Beige", "Olive"]'::jsonb,
  '{"Beige":{"S":5,"M":7,"L":5,"XL":3},"Olive":{"S":4,"M":6,"L":5,"XL":2}}'::jsonb,
  'S (LP 68 / P 97), M (LP 74 / P 99), L (LP 80 / P 101), XL (LP 86 / P 102)',
  'Cuci biasa, setrika bagian dalam.',
  'Smart casual, preppy, campus everyday', 'Kampus',
  'Polo Shirt Pique Talaka (PLO-022)',
  'Slim chino fleksibel untuk kuliah seharian.',
  'Bukan activewear untuk olahraga berat.', 22
),
(
  'BAG-024', 'Tote Canvas Kampus Talaka', 'Aksesoris', 'Campus Life', 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80',
  129000, 'Rp129.000', 'Canvas 12oz tebal', 'One Size (Tas Tote)',
  '["Hitam", "Broken White"]'::jsonb,
  '{"Hitam":{"One Size":15},"Broken White":{"One Size":10}}'::jsonb,
  'L 42 cm x T 38 cm x D 12 cm (muat laptop 14")',
  'Cuci tangan sikat lembut, jemur terbalik.',
  'Minimalis kampus, everyday carry', 'Kampus',
  'Polo Shirt Pique (PLO-022) + Chino Stretch Kampus (CHN-023)',
  'Muat buku, tablet, dan laptop 14 inch.',
  'Canvas belum dilapisi water-repellent.', 23
),
-- 67 Produk Tambahan (Total 90 Produk Talaka)
(
  'SNK-025', 'Talaka Aero Minimalist White', 'Sepatu', 'Daily Favorite', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=80',
  499000, 'Rp499.000', 'Full grain vegan leather & cushioned memory foam insole', 'True to Size (Unisex)',
  '["Putih","Off-White"]'::jsonb,
  '{"Putih":{"39":5,"40":8,"41":6,"42":4,"43":2,"44":1},"Off-White":{"39":4,"40":6,"41":5,"42":3,"43":2,"44":0}}'::jsonb,
  'EU 39 (24.5 cm), 40 (25 cm), 41 (26 cm), 42 (26.5 cm), 43 (27.5 cm), 44 (28 cm)',
  'Lap kain microfiber lembap, hindari pembersih berbahan kimia keras.',
  'Clean minimalist court sneaker', 'Kampus, Belajar, Kerja',
  'Chino Stretch Kampus (CHN-023) atau Kemeja Linen Talaka (KMJ-001)',
  'Siluet ramping mempertegas garis pergelangan kaki.',
  'Sol datar standar; jika butuh arch-support ekstra bisa tambahkan insole gel ortopedis.', 0
),
(
  'SNK-026', 'Talaka Slip-On Canvas Loafer', 'Sepatu', 'Easy Wear', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=80',
  379000, 'Rp379.000', 'Heavy canvas 14oz & vulcanized rubber sole', 'Regular Fit',
  '["Hitam","Krem"]'::jsonb,
  '{"Hitam":{"39":6,"40":7,"41":8,"42":5,"43":3,"44":2},"Krem":{"39":4,"40":5,"41":6,"42":4,"43":1,"44":1}}'::jsonb,
  'EU 39 (24.5 cm), 40 (25 cm), 41 (26 cm), 42 (26.5 cm), 43 (27.5 cm), 44 (28 cm)',
  'Cuci dengan sikat gigi halus & sabun deterjen cair, keringkan di tempat teduh.',
  'Casual relaxed, slip-and-go', 'Belajar, Kampus, Mengaji',
  'Celana Kulot High-Waist (CLN-002) atau Jogger Pants (JGR-020)',
  'Model slip-on tanpa tali praktis dilepas-pasang saat ke masjid atau ruang kelas.',
  'Kain canvas sedikit kaku pada 2–3 pemakaian pertama sebelum menyesuaikan bentuk kaki.', 0
),
(
  'SNK-027', 'Talaka City Trekker Olive', 'Sepatu', 'Outdoor Ready', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=700&q=80',
  589000, 'Rp589.000', 'Cordura water-repellent panel & rugged lug outsole', 'Chunky Trail',
  '["Olive","Charcoal"]'::jsonb,
  '{"Olive":{"39":3,"40":6,"41":4,"42":5,"43":2,"44":1},"Charcoal":{"39":4,"40":5,"41":6,"42":4,"43":3,"44":0}}'::jsonb,
  'EU 39 (24.5 cm), 40 (25 cm), 41 (26 cm), 42 (26.5 cm), 43 (27.5 cm), 44 (28 cm)',
  'Sikat kotoran tanah kering, lap permukaan cordura dengan spons basah.',
  'Gorpcore, urban outdoor streetwear', 'Kampus, Jalan Santai',
  'Hoodie Fleece (HDI-019) + Jogger Pants (JGR-020)',
  'Sol trail tebal 4 cm memberi bantalan ekstra saat berjalan kaki jauh.',
  'Grip karet tebal membuat sepatu terasa lebih berbobot dibanding running shoes biasa.', 0
),
(
  'SNK-028', 'Talaka Derby Leather Formal', 'Sepatu', 'Office Classic', 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=700&q=80',
  649000, 'Rp649.000', 'Semi-gloss polished microfibre leather & anti-slip rubber sole', 'Formal Sleek',
  '["Hitam","Espresso"]'::jsonb,
  '{"Hitam":{"39":4,"40":6,"41":7,"42":5,"43":3,"44":2},"Espresso":{"39":3,"40":5,"41":4,"42":3,"43":1,"44":1}}'::jsonb,
  'EU 39 (24.5 cm), 40 (25 cm), 41 (26 cm), 42 (26.5 cm), 43 (27.5 cm), 44 (28 cm)',
  'Semir berkala dengan wax transparan, simpan dengan shoe tree agar kulit tidak berkerut.',
  'Classic British formal dress shoe', 'Kerja',
  'Blazer Struktural (BLZ-012) + Celana Bahan Slim (CLN-011)',
  'Bentuk moncong runcing lembut memberi ilusi postur lebih tegap dan rapi.',
  'Kulit sintetis polished butuh kaus kaki katun agar tidak gerah di pemakaian seharian.', 0
),
(
  'SNK-029', 'Talaka Sandal Slide Comfort EVA', 'Sepatu', 'Summer Slide', 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=700&q=80',
  189000, 'Rp189.000', 'Molded lightweight EVA foam (tahan air & cepat kering)', 'Wide Comfort',
  '["Sand","Hitam"]'::jsonb,
  '{"Sand":{"39":8,"40":10,"41":9,"42":7,"43":5,"44":3},"Hitam":{"39":7,"40":9,"41":8,"42":6,"43":4,"44":2}}'::jsonb,
  'EU 39 (24.5 cm), 40 (25 cm), 41 (26 cm), 42 (26.5 cm), 43 (27.5 cm), 44 (28 cm)',
  'Cuci dengan air mengalir dan sabun cair, langsung lap kering.',
  'Modern recovery slide, casual home', 'Belajar, Santai, Mengaji',
  'Kaos Grafis Study Vibes (TSH-021) + Jogger Pants (JGR-020)',
  'Bantalan kaki melengkung mengikuti anatomi telapak kaki untuk mengurangi lelah.',
  'Kurang formal untuk acara kerja atau presentasi kampus.', 0
),
(
  'SNK-030', 'Talaka Platform Chunky Derby', 'Sepatu', 'Edgy Look', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=80',
  579000, 'Rp579.000', 'Polished vegan leather with 5cm platform commando sole', 'Bold Platform',
  '["Hitam"]'::jsonb,
  '{"Hitam":{"39":5,"40":6,"41":5,"42":4,"43":2,"44":1}}'::jsonb,
  'EU 39 (24.5 cm), 40 (25 cm), 41 (26 cm), 42 (26.5 cm), 43 (27.5 cm), 44 (28 cm)',
  'Lap bersih dengan kain lembap, hindari gesekan tajam pada sol platform.',
  'Goth chic, Harajuku streetwear, edgy smart', 'Clubbing, Kampus',
  'Mini Pleated Skirt (SKR-014) atau Jaket Kulit Faux (JKT-015)',
  'Sol 5 cm menambah tinggi badan secara instan tanpa membuat tumit pegal.',
  'Sol platform tebal membutuhkan sedikit adaptasi saat menaiki tangga.', 0
),
(
  'SNK-031', 'Talaka Slip-On Mule Leather', 'Sepatu', 'Effortless Chic', 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=700&q=80',
  469000, 'Rp469.000', 'Soft synthetic nappa leather & flexible rubber base', 'Slim Backless',
  '["Mocca","Krem"]'::jsonb,
  '{"Mocca":{"39":4,"40":6,"41":5,"42":3,"43":2,"44":1},"Krem":{"39":3,"40":5,"41":4,"42":2,"43":1,"44":0}}'::jsonb,
  'EU 39 (24.5 cm), 40 (25 cm), 41 (26 cm), 42 (26.5 cm), 43 (27.5 cm), 44 (28 cm)',
  'Lap kain lembut, simpan di tempat kering dan bersirkulasi baik.',
  'Modern Parisian chic, minimalist mule', 'Kerja, Hangout, Mengaji',
  'Celana Kulot High-Waist (CLN-002) atau Midi Dress Flowy (DRS-004)',
  'Desain backless terbuka di tumit memberi kesan pergelangan kaki lebih ramping.',
  'Bukan untuk aktivitas berjalan cepat atau medan jalan berbatu.', 0
),
(
  'KMJ-032', 'Kemeja Flannel Tartan Cozy', 'Atasan', 'Layering Core', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80',
  269000, 'Rp269.000', '100% Cotton brushed flannel (hangat, lembut, tidak berbulu)', 'Relaxed Fit',
  '["Forest Green","Navy"]'::jsonb,
  '{"Forest Green":{"S":5,"M":7,"L":6,"XL":3},"Navy":{"S":4,"M":8,"L":5,"XL":2}}'::jsonb,
  'S (LD 102 / P 70), M (LD 108 / P 72), L (LD 114 / P 74), XL (LD 120 / P 76)',
  'Cuci air dingin, jangan disikat kasar pada permukaan flanel.',
  'Grunge 90s, lumberjack casual', 'Kampus, Belajar',
  'Kaos Oversize (TSH-005) + Celana Bahan Slim (CLN-011)',
  'Bisa dipakai berkancing rapi atau dibuka sebagai outer santai.',
  'Bahan agak tebal, paling pas di ruangan ber-AC.', 0
),
(
  'KMJ-033', 'Kemeja Kerah Shanghai Linen', 'Atasan', 'Clean Eastern', 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=700&q=80',
  259000, 'Rp259.000', 'Linen blend breathable', 'Regular Fit',
  '["Putih","Warm Grey"]'::jsonb,
  '{"Putih":{"S":6,"M":9,"L":7,"XL":4},"Warm Grey":{"S":4,"M":6,"L":5,"XL":2}}'::jsonb,
  'S (LD 98 / P 68), M (LD 104 / P 70), L (LD 110 / P 72), XL (LD 116 / P 74)',
  'Cuci lembut, setrika suhu sedang saat agak lembap.',
  'Minimalis kerah shanghai, rapi bersahaja', 'Mengaji, Kerja',
  'Celana Kulot High-Waist (CLN-002) atau Chino Stretch (CHN-023)',
  'Kerah tegak memberi ilusi leher lebih jenjang tanpa perlu dasi.',
  'Karakter serat linen bertekstur alami khas bahan organik.', 0
),
(
  'TSH-034', 'Kaos Turtleneck Ribbed Stretch', 'Atasan', 'Smart Layer', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=80',
  189000, 'Rp189.000', 'Cotton rib 2x2 elastis & adem', 'Fitted Turtle',
  '["Hitam","Charcoal"]'::jsonb,
  '{"Hitam":{"S":6,"M":8,"L":7,"XL":3},"Charcoal":{"S":4,"M":6,"L":5,"XL":2}}'::jsonb,
  'S (LD 84–92 / P 62), M (LD 90–98 / P 64), L (LD 96–104 / P 66), XL (LD 102–110 / P 68)',
  'Cuci tangan atau laundry net, jangan digantung saat basah.',
  'Steve Jobs minimal, chic intellectual', 'Kerja, Clubbing',
  'Blazer Struktural (BLZ-012) + Celana Bahan Slim (CLN-011)',
  'Potongan leher tinggi sangat elegan bila dipadukan dengan outerwear berkerah notch.',
  'Karakter fitted pas badan; jika ingin longgar disarankan naik 1 ukuran.', 0
),
(
  'BLS-035', 'Blouse Silk Puff Sleeve', 'Atasan', 'Feminine Core', 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=700&q=80',
  279000, 'Rp279.000', 'Silk crepe de chine lembut tidak menerawang', 'Regular Feminine',
  '["Dusty Rose","Broken White"]'::jsonb,
  '{"Dusty Rose":{"S":5,"M":7,"L":4,"XL":2},"Broken White":{"S":6,"M":6,"L":5,"XL":3}}'::jsonb,
  'S (LD 94 / P 62), M (LD 100 / P 64), L (LD 106 / P 66), XL (LD 112 / P 68)',
  'Cuci tangan suhu rendah, setrika uap suhu lembut.',
  'Romantic Korean style, sweet professional', 'Kerja, Acara Keluarga',
  'Celana Kulot High-Waist (CLN-002) atau Rok Kembang (RKU-018)',
  'Detail puff sleeve di bahu menyeimbangkan proporsi tubuh berpinggul lebar.',
  'Bahan silk sintetis halus, hindari terkena benda tajam atau peniti kasar.', 0
),
(
  'TSH-036', 'Kaos Polos Boxy Heavyweight Putih', 'Atasan', 'Essential', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80',
  169000, 'Rp169.000', '100% Combed 16s Super Heavyweight (tebal 240gsm)', 'Boxy Drop Shoulder',
  '["Putih"]'::jsonb,
  '{"Putih":{"S":10,"M":12,"L":10,"XL":6}}'::jsonb,
  'S (LD 108 / P 66), M (LD 114 / P 68), L (LD 120 / P 70), XL (LD 126 / P 72)',
  'Cuci biasa, jemur terbalik, setrika suhu sedang.',
  'Modern streetwear boxy cut', 'Kampus, Belajar, Harian',
  'Chino Stretch (CHN-023) atau Jogger Pants (JGR-020)',
  'Potongan boxy lebih pendek dari oversize biasa, tidak membuat kaki tenggelam.',
  'Bahan sangat tebal dan berbobot; paling optimal untuk cuaca sedang atau ber-AC.', 0
),
(
  'KMJ-037', 'Kemeja Rayon Floral Vintage', 'Atasan', 'Weekend Vibe', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=700&q=80',
  239000, 'Rp239.000', 'Rayon viscose ultra soft & flowy', 'Camp Collar Relaxed',
  '["Terracotta","Sage"]'::jsonb,
  '{"Terracotta":{"S":4,"M":7,"L":5,"XL":2},"Sage":{"S":5,"M":6,"L":4,"XL":3}}'::jsonb,
  'S (LD 104 / P 68), M (LD 110 / P 70), L (LD 116 / P 72), XL (LD 122 / P 74)',
  'Cuci lembut dengan deterjen cair, jangan gunakan mesin pengering bersuhu tinggi.',
  'Cuban camp collar, vintage resort', 'Hangout, Santai',
  'Celana Kulot High-Waist (CLN-002) warna Krem',
  'Kerah camp collar terbuka memberi kesan santai dan leher lebih lapang.',
  'Bahan rayon mudah berkerut saat duduk, setrika sebelum dipakai.', 0
),
(
  'TOP-038', 'Crop Tank Top Seamless Knit', 'Atasan', 'Base Layer', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=700&q=80',
  139000, 'Rp139.000', 'Nylon spandex seamless elastis tinggi', 'Fitted Crop',
  '["Hitam","Beige"]'::jsonb,
  '{"Hitam":{"S":7,"M":9,"L":6,"XL":3},"Beige":{"S":6,"M":8,"L":5,"XL":2}}'::jsonb,
  'S (LD 76–86 / P 38), M (LD 82–92 / P 40), L (LD 88–98 / P 42), XL (LD 94–104 / P 44)',
  'Cuci tangan suhu biasa, jemur datar.',
  'Athleisure minimal, versatile inner', 'Clubbing, Harian',
  'Outer Boxy Knit Cardigan (OUT-003) atau Jaket Kulit (JKT-015)',
  'Crop top berpadu sempurna dengan celana atau rok high-waist.',
  'Model crop berakhir di atas pusar.', 0
),
(
  'PLO-039', 'Knit Polo Shirt Vintage Collar', 'Atasan', 'Retro Smart', 'https://images.unsplash.com/photo-1625910513413-7fc1b57f0064?auto=format&fit=crop&w=700&q=80',
  299000, 'Rp299.000', 'Fine cotton knitwear (berpori, tidak panas)', 'Classic Tailored',
  '["Mocca","Navy"]'::jsonb,
  '{"Mocca":{"S":4,"M":7,"L":5,"XL":2},"Navy":{"S":5,"M":6,"L":4,"XL":3}}'::jsonb,
  'S (LD 98 / P 66), M (LD 104 / P 68), L (LD 110 / P 70), XL (LD 116 / P 72)',
  'Simpan terlipat, jangan digantung agar tidak melar.',
  'Old-money aesthetic, retro smart casual', 'Kerja, Kampus',
  'Celana Bahan Slim (CLN-011) atau Chino Stretch (CHN-023)',
  'Tekstur rajut halus memberikan kesan mewah tanpa perlu banyak aksesoris.',
  'Gunakan deterjen tanpa pemutih agar serat rajut tetap empuk.', 0
),
(
  'BLS-040', 'Tunik Minimalis Asimetris', 'Atasan', 'Modest Modern', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=700&q=80',
  289000, 'Rp289.000', 'Katun toyobo fodu (dingin, sedikit kilau mewah, jatuh rapi)', 'Loose Tunic',
  '["Lavender","Broken White"]'::jsonb,
  '{"Lavender":{"S":5,"M":7,"L":6,"XL":3},"Broken White":{"S":4,"M":8,"L":5,"XL":2}}'::jsonb,
  'S (LD 98 / P 90), M (LD 104 / P 92), L (LD 110 / P 94), XL (LD 116 / P 96)',
  'Cuci biasa, setrika suhu sedang.',
  'Modest chic, clean architectural drape', 'Mengaji, Kerja',
  'Celana Kulot High-Waist (CLN-002) warna Hitam',
  'Panjang tunik menutupi pinggul dan paha dengan potongan hem asimetris yang dinamis.',
  'Bahan katun toyobo non-stretch; pastikan ukuran lingkar dada mencukupi.', 0
),
(
  'TSH-041', 'Kaos Striped Parisian Sailor', 'Atasan', 'Timeless Style', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80',
  179000, 'Rp179.000', '100% Cotton combed 20s motif garis tenun benang', 'Regular Fit',
  '["Navy","Hitam"]'::jsonb,
  '{"Navy":{"S":6,"M":8,"L":6,"XL":3},"Hitam":{"S":5,"M":7,"L":5,"XL":2}}'::jsonb,
  'S (LD 98 / P 68), M (LD 104 / P 70), L (LD 110 / P 72), XL (LD 116 / P 74)',
  'Cuci dengan warna senada agar garis putih tetap bersih cemerlang.',
  'French marinière, nautical casual', 'Kampus, Belajar',
  'Chino Stretch (CHN-023) warna Beige + Talaka Cloud Sneaker (SNK-007)',
  'Motif garis horizontal klasik memberi kesan dada lebih berisi dan proporsional.',
  'Garis tenun benang (yarn dyed), tidak akan luntur atau mengelupas.', 0
),
(
  'KMJ-042', 'Kemeja Corduroy Overshirt', 'Atasan', 'Autumn Texture', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80',
  329000, 'Rp329.000', 'Baby corduroy 16 whale (tekstur beludru halus)', 'Oversize Fit',
  '["Sand","Olive"]'::jsonb,
  '{"Sand":{"S":4,"M":6,"L":5,"XL":2},"Olive":{"S":5,"M":5,"L":4,"XL":2}}'::jsonb,
  'S (LD 110 / P 72), M (LD 116 / P 74), L (LD 122 / P 76), XL (LD 128 / P 78)',
  'Cuci mesin putaran lembut, jemur terbalik.',
  'Vintage workwear, casual textured', 'Kampus, Jalan Santai',
  'Kaos Heavyweight Putih (TSH-036) + Chino Kampus (CHN-023)',
  'Bahan bertekstur corduroy menambah kedalaman visual pada outfit sederhana.',
  'Cukup hangat, ideal sebagai jaket ringan saat malam hari atau ruang ber-AC.', 0
),
(
  'TOP-043', 'Top Halter Neck Knit Minimal', 'Atasan', 'Night Out', 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=700&q=80',
  189000, 'Rp189.000', 'Fine ribbed knit stretch', 'Fitted Halter',
  '["Midnight Black","Deep Purple"]'::jsonb,
  '{"Midnight Black":{"S":5,"M":7,"L":4,"XL":2},"Deep Purple":{"S":4,"M":5,"L":3,"XL":1}}'::jsonb,
  'S (LD 78–88 / P 46), M (LD 84–94 / P 48), L (LD 90–100 / P 50), XL (LD 96–106 / P 52)',
  'Cuci tangan lembut, keringkan rata di atas handuk.',
  'Modern Y2K glam, halter chic', 'Clubbing, Hangout',
  'Mini Pleated Skirt (SKR-014) + Jaket Kulit (JKT-015)',
  'Potongan halter leher terbuka menonjolkan keindahan tulang selangka dan bahu.',
  'Memerlukan strapless bra untuk tampilan tanpa tali pengait yang terlihat.', 0
),
(
  'KMJ-044', 'Kemeja Kerah Cuban Monokrom', 'Atasan', 'Smart Minimal', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80',
  249000, 'Rp249.000', 'Poly-cotton blend anti-kusut', 'Regular Relaxed',
  '["Hitam","Putih"]'::jsonb,
  '{"Hitam":{"S":6,"M":8,"L":6,"XL":3},"Putih":{"S":5,"M":7,"L":5,"XL":2}}'::jsonb,
  'S (LD 102 / P 68), M (LD 108 / P 70), L (LD 114 / P 72), XL (LD 120 / P 74)',
  'Cuci biasa, setrika suhu sedang.',
  'Monochrome smart streetwear', 'Kerja, Hangout',
  'Celana Bahan Slim (CLN-011) Charcoal',
  'Siluet bersih monokrom cocok untuk smart casual di kantor rintisan.',
  'Kerah cuban berpotongan rebah, tidak didesain untuk memakai dasi formal.', 0
),
(
  'TSH-045', 'Long Sleeve Waffle Knit Thermal', 'Atasan', 'Cozy Texture', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80',
  219000, 'Rp219.000', 'Cotton waffle knit tekstur sarang lebah', 'Regular Fit',
  '["Krem","Charcoal"]'::jsonb,
  '{"Krem":{"S":5,"M":7,"L":6,"XL":3},"Charcoal":{"S":4,"M":6,"L":5,"XL":2}}'::jsonb,
  'S (LD 100 / P 68), M (LD 106 / P 70), L (LD 112 / P 72), XL (LD 118 / P 74)',
  'Cuci balik, jemur datar.',
  'Thermal lounge, Scandinavian minimal', 'Belajar, Santai',
  'Jogger Pants Comfort (JGR-020) Sand',
  'Tekstur waffle berongga menjaga suhu tubuh tetap nyaman dan adem.',
  'Ujung lengan berserut lembut elastis, mudah dinaikkan ke lengan bawah.', 0
),
(
  'CLN-046', 'Celana Cargo Wide-Leg Street', 'Bawahan', 'Street Essential', 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=700&q=80',
  339000, 'Rp339.000', 'Twill katun ripstop kokoh & tidak mudah sobek', 'Wide Cargo Relaxed',
  '["Olive","Hitam"]'::jsonb,
  '{"Olive":{"S":4,"M":7,"L":6,"XL":3},"Hitam":{"S":5,"M":6,"L":5,"XL":2}}'::jsonb,
  'S (LP 72 / P 100), M (LP 78 / P 102), L (LP 84 / P 104), XL (LP 90 / P 105)',
  'Cuci biasa dengan air dingin, setrika bagian dalam.',
  'Utilitarian, techwear casual, skater boy/girl', 'Kampus, Jalan Santai',
  'Kaos Oversize Heavyweight (TSH-005) + Talaka Aurora Mocca (SNK-006)',
  'Saku samping 3D memberi aksen tegas pada kaki tanpa terkesan penuh.',
  'Kain ripstop bertekstur kuat dan sedikit kaku di awal sebelum dicuci 2 kali.', 0
),
(
  'CLN-047', 'Celana Linen Ankle Pant Talaka', 'Bawahan', 'Breezy Fit', 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=700&q=80',
  289000, 'Rp289.000', 'Linen rayon blend adem jatuh', 'Tapered Ankle (Karet Pinggang Belakang)',
  '["Beige","Hitam"]'::jsonb,
  '{"Beige":{"S":5,"M":8,"L":6,"XL":3},"Hitam":{"S":4,"M":7,"L":5,"XL":2}}'::jsonb,
  'S (LP 66–76 / P 92), M (LP 72–82 / P 94), L (LP 78–88 / P 96), XL (LP 84–94 / P 97)',
  'Cuci lembut, jemur terbalik di tempat teduh.',
  'Resort smart casual, minimalist traveler', 'Kerja Santai, Kampus, Mengaji',
  'Kemeja Linen Talaka (KMJ-001) atau Kemeja Oxford (KMJ-010)',
  'Potongan ankle memperlihatkan mata kaki, memberi ilusi badan lebih tinggi.',
  'Panjang 92–94 cm pas untuk TB 155–172 cm tanpa perlu dipotong.', 0
),
(
  'SKR-048', 'Rok Denim A-Line Midi Vintage', 'Bawahan', 'Retro Denim', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=700&q=80',
  299000, 'Rp299.000', 'Denim non-stretch 12oz washed', 'High-Waist A-Line Midi',
  '["Steel Blue","Hitam"]'::jsonb,
  '{"Steel Blue":{"S":4,"M":6,"L":5,"XL":2},"Hitam":{"S":5,"M":7,"L":4,"XL":2}}'::jsonb,
  'S (LP 66 / P 80), M (LP 72 / P 82), L (LP 78 / P 84), XL (LP 84 / P 85)',
  'Cuci balik terpisah untuk pencucian awal agar warna denim terjaga.',
  '90s classic denim skirt', 'Kampus, Hangout',
  'Polo Shirt Pique (PLO-022) atau Kaos Oversize (TSH-005)',
  'Belahan slit kecil di bagian depan mempermudah langkah saat berjalan aktif.',
  'Denim tebal 12oz, tidak elastis; pastikan ukuran lingkar pinggang pas.', 0
),
(
  'CLN-049', 'Celana Palazzo Pleated Flowy', 'Bawahan', 'Elegant Flow', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=80',
  329000, 'Rp329.000', 'Crepe georgette premium dengan furing lembut anti-terawang', 'High-Waist Extra Wide',
  '["Terracotta","Warm Grey"]'::jsonb,
  '{"Terracotta":{"S":4,"M":6,"L":4,"XL":2},"Warm Grey":{"S":5,"M":7,"L":5,"XL":3}}'::jsonb,
  'S (LP 66 / P 102), M (LP 72 / P 104), L (LP 78 / P 106), XL (LP 84 / P 107)',
  'Cuci dengan laundry net, setrika suhu sedang.',
  'High-fashion minimalist, power palazzo', 'Kerja, Acara Semi-Formal',
  'Satin Corset Top (TOP-013) atau Blazer Struktural (BLZ-012)',
  'Lipit depan dan potongan ekstra lebar memberi siluet seperti rok namun dengan kenyamanan celana.',
  'Sangat flowy dan panjang; cocok dipadukan heels atau sneaker chunky 4–5 cm.', 0
),
(
  'CLN-050', 'Celana Jeans Straight Raw Hem', 'Bawahan', 'Daily Denim', 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80',
  349000, 'Rp349.000', 'Denim cotton 13oz dengan 1% stretch', 'High-Rise Straight Leg',
  '["Navy","Charcoal"]'::jsonb,
  '{"Navy":{"S":5,"M":8,"L":6,"XL":3},"Charcoal":{"S":4,"M":7,"L":5,"XL":2}}'::jsonb,
  'S (LP 68 / P 98), M (LP 74 / P 100), L (LP 80 / P 102), XL (LP 86 / P 103)',
  'Cuci dengan air dingin, jangan diperas dengan mesin pengering putaran kencang.',
  'Timeless straight leg jeans', 'Kampus, Hangout, Belajar',
  'Kaos Striped Parisian (TSH-041) + Talaka Cloud Sneaker (SNK-007)',
  'Garis lurus dari pinggul ke bawah membuat kaki terlihat lebih jenjang dan seimbang.',
  'Kain denim tebal dan awet bertahun-tahun.', 0
),
(
  'SKR-051', 'Rok Span Plisket Modest', 'Bawahan', 'Work & Formal', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=700&q=80',
  249000, 'Rp249.000', 'Polyester knitted plisket tebal elastis', 'Column Straight (All Size)',
  '["Hitam","Mocca"]'::jsonb,
  '{"Hitam":{"One Size":12},"Mocca":{"One Size":10}}'::jsonb,
  'One Size — LP 64–100 cm (karet elastik penuh), Panjang 95 cm',
  'Cuci tangan perlahan, jangan disetrika langsung agar lipitan plisket tetap awet.',
  'Modest professional, elegant column', 'Kerja, Mengaji',
  'Kemeja Oxford Slim (KMJ-010) atau Tunik Asimetris (BLS-040)',
  'Lipit vertikal memberi efek visual merampingkan pinggul dan kaki.',
  'Bahan plisket rajut lentur memeluk bentuk tubuh; padukan dengan atasan panjang atau tunik.', 0
),
(
  'CLN-052', 'Shorts Bermuda Tailored Pleat', 'Bawahan', 'Chic Summer', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=700&q=80',
  219000, 'Rp219.000', 'Suiting poly-viscose halus rapi', 'High-Waist Knee Length',
  '["Beige","Charcoal"]'::jsonb,
  '{"Beige":{"S":5,"M":7,"L":4,"XL":2},"Charcoal":{"S":4,"M":6,"L":5,"XL":2}}'::jsonb,
  'S (LP 66 / P 52), M (LP 72 / P 54), L (LP 78 / P 56), XL (LP 84 / P 57)',
  'Cuci biasa, setrika suhu sedang.',
  'Resort tailoring, high fashion city shorts', 'Hangout, Santai',
  'Blazer Struktural (BLZ-012) untuk setelan blazer-shorts yang trendy',
  'Panjang tepat di atas lutut menjaga kesan sopan dan modern.',
  'Bukan celana olahraga pendek; potongan formal bersaku rapi.', 0
),
(
  'CLN-053', 'Celana Knit Wide Pants Comfy', 'Bawahan', 'All-Day Comfy', 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=700&q=80',
  269000, 'Rp269.000', 'Soft ribbed cotton knit tebal tidak menerawang', 'Straight Wide Elastic',
  '["Sand","Sage"]'::jsonb,
  '{"Sand":{"S":6,"M":8,"L":6,"XL":3},"Sage":{"S":5,"M":7,"L":5,"XL":2}}'::jsonb,
  'S (LP 64–78 / P 98), M (LP 70–84 / P 100), L (LP 76–90 / P 102), XL (LP 82–96 / P 103)',
  'Cuci mesin mode lembut, jemur mendatar di tempat teduh.',
  'Scandinavian lounge, effortless aesthetic', 'Belajar, Santai',
  'Hoodie Fleece (HDI-019) atau Kaos Boxy Putih (TSH-036)',
  'Jatuh kain rajut sangat rileks dan tidak kaku di paha.',
  'Bahan rajut lentur; simpan terlipat di lemari.', 0
),
(
  'CLN-054', 'Celana Jogger Tech Tactical', 'Bawahan', 'Urban Tech', 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=700&q=80',
  319000, 'Rp319.000', 'Matte nylon stretch water-resistant', 'Tapered Ankle Zip',
  '["Midnight Black"]'::jsonb,
  '{"Midnight Black":{"S":5,"M":8,"L":7,"XL":4}}'::jsonb,
  'S (LP 68–80 / P 96), M (LP 74–86 / P 98), L (LP 80–92 / P 100), XL (LP 86–98 / P 101)',
  'Lap bersih atau cuci air dingin, jangan gunakan pelembut pakaian kimiawi.',
  'Cyberpunk casual, techwear minimalist', 'Kampus, Night Out',
  'Jaket Kulit (JKT-015) + Talaka City Trekker (SNK-027)',
  'Ritsleting pergelangan kaki memungkinkan setelan fit disesuaikan dengan sepatu bot maupun sneaker.',
  'Bahan nilon matte sedikit bergemerisik saat berjalan cepat.', 0
),
(
  'OUT-055', 'Trench Coat Minimalist Belted', 'Outer', 'Statement Piece', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=700&q=80',
  689000, 'Rp689.000', 'Cotton-gabardine tahan angin & air ringan', 'Classic Oversize Trench',
  '["Beige","Hitam"]'::jsonb,
  '{"Beige":{"S":3,"M":5,"L":4,"XL":2},"Hitam":{"S":4,"M":5,"L":3,"XL":1}}'::jsonb,
  'S (LD 104 / P 110), M (LD 110 / P 112), L (LD 116 / P 114), XL (LD 122 / P 116)',
  'Dry clean disarankan, setrika suhu sedang dengan kain pelindung.',
  'European classic elegance, cinema chic', 'Kerja, Traveling',
  'Kemeja Oxford Slim (KMJ-010) + Celana Bahan Slim (CLN-011)',
  'Tali pinggang dapat diikat di belakang untuk siluet longgar atau di depan untuk siluet terikat ramping.',
  'Panjang coat mencapai bawah lutut; direkomendasikan untuk TB di atas 158 cm.', 0
),
(
  'OUT-056', 'Jaket Denim Trucker Vintage Washed', 'Outer', 'Heritage Layer', 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=700&q=80',
  399000, 'Rp399.000', '100% Cotton denim 13.5oz kokoh', 'Boxy Trucker',
  '["Steel Blue","Hitam"]'::jsonb,
  '{"Steel Blue":{"S":5,"M":7,"L":6,"XL":3},"Hitam":{"S":4,"M":6,"L":5,"XL":2}}'::jsonb,
  'S (LD 106 / P 62), M (LD 112 / P 64), L (LD 118 / P 66), XL (LD 124 / P 68)',
  'Cuci air dingin, balik bagian dalam ke luar.',
  'Vintage Americana, timeless casual', 'Kampus, Hangout',
  'Kaos Heavyweight Putih (TSH-036) + Chino Stretch (CHN-023)',
  'Potongan trucker crop menonjolkan garis pinggang celana.',
  'Kain denim tebal tanpa stretch; pilih ukuran longgar jika ingin dipakai di atas hoodie.', 0
),
(
  'OUT-057', 'Cardigan Cable Knit Chunky', 'Outer', 'Winter Cozy', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=700&q=80',
  369000, 'Rp369.000', 'Soft acrylic-cotton cable knit tebal & empuk', 'Oversize Slouchy',
  '["Broken White","Mocca"]'::jsonb,
  '{"Broken White":{"S":4,"M":6,"L":5,"XL":2},"Mocca":{"S":3,"M":7,"L":4,"XL":2}}'::jsonb,
  'S (LD 112 / P 64), M (LD 118 / P 66), L (LD 124 / P 68), XL (LD 130 / P 70)',
  'Cuci tangan suhu dingin, peras perlahan, jemur datar.',
  'Rory Gilmore aesthetic, academic cozy', 'Belajar, Kafe',
  'Midi Dress Flowy (DRS-004) atau Celana Kulot High-Waist (CLN-002)',
  'Rajutan motif kabel besar memberi tekstur hangat yang sangat fotogenik.',
  'Cukup tebal dan hangat; sangat nyaman untuk ruang ber-AC dingin.', 0
),
(
  'OUT-058', 'Vest Rajut Sleeveless Preppy', 'Outer', 'Preppy Vibe', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=700&q=80',
  199000, 'Rp199.000', 'Cotton blend fine knit adem berpori', 'Regular V-Neck Vest',
  '["Navy","Krem"]'::jsonb,
  '{"Navy":{"S":6,"M":8,"L":6,"XL":3},"Krem":{"S":5,"M":7,"L":5,"XL":2}}'::jsonb,
  'S (LD 96 / P 58), M (LD 102 / P 60), L (LD 108 / P 62), XL (LD 114 / P 64)',
  'Cuci mesin mode lembut dengan jaring cuci.',
  'Ivy league preppy, Korean campus aesthetic', 'Kampus, Belajar',
  'Kemeja Oxford Slim (KMJ-010) Putih + Chino Stretch (CHN-023)',
  'Potongan leher V memperlihatkan kerah kemeja bagian dalam secara rapi.',
  'Rompi ringan tanpa lengan, tidak membuat gerah saat kuliah siang hari.', 0
),
(
  'OUT-059', 'Jaket Bomber Satin Padded', 'Outer', 'Street Statement', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80',
  459000, 'Rp459.000', 'Silky nylon twill dengan furing oranye klasik', 'Oversize MA-1 Bomber',
  '["Olive","Midnight Black"]'::jsonb,
  '{"Olive":{"S":4,"M":6,"L":5,"XL":2},"Midnight Black":{"S":5,"M":7,"L":4,"XL":2}}'::jsonb,
  'S (LD 114 / P 64), M (LD 120 / P 66), L (LD 126 / P 68), XL (LD 132 / P 70)',
  'Lap kain lembap atau dry clean, hindari strika suhu tinggi langsung ke nilon.',
  'Military streetwear, pilot bomber', 'Clubbing, Hangout',
  'Satin Corset Top (TOP-013) + Mini Pleated Skirt (SKR-014)',
  'Siluet menggembung di dada menyeimbangkan bawahan pas badan di bawahnya.',
  'Dilengkapi lapisan busa tipis; hangat saat berkendara motor atau malam hari.', 0
),
(
  'OUT-060', 'Kimono Cardigan Linen Drop-Shoulder', 'Outer', 'Zen Minimal', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=700&q=80',
  279000, 'Rp279.000', 'Linen katun lembut berpori', 'Loose Kimono Cut',
  '["Charcoal","Sand"]'::jsonb,
  '{"Charcoal":{"S":5,"M":8,"L":6,"XL":3},"Sand":{"S":6,"M":7,"L":5,"XL":2}}'::jsonb,
  'S (LD 116 / P 70), M (LD 122 / P 72), L (LD 128 / P 74), XL (LD 134 / P 76)',
  'Cuci biasa, jemur terbalik di tempat teduh.',
  'Modern noragi, Japanese zen minimal', 'Santai, Belajar, Mengaji',
  'Kaos Heavyweight Putih (TSH-036) + Celana Kulot High-Waist (CLN-002)',
  'Model terbuka tanpa kancing mengalir bebas dan menutupi lekuk tubuh samping.',
  'Tanpa kancing depan; difungsikan sebagai layering terbuka.', 0
),
(
  'OUT-061', 'Windbreaker Anorak Lightweight', 'Outer', 'Weather Proof', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80',
  349000, 'Rp349.000', 'Ultra-light ripstop polyester water-repellent', 'Relaxed Half-Zip',
  '["Forest Green","Hitam"]'::jsonb,
  '{"Forest Green":{"S":5,"M":7,"L":6,"XL":3},"Hitam":{"S":4,"M":8,"L":5,"XL":2}}'::jsonb,
  'S (LD 112 / P 68), M (LD 118 / P 70), L (LD 124 / P 72), XL (LD 130 / P 74)',
  'Lap spons basah atau cuci tangan tanpa deterjen keras.',
  'Outdoor active, trail streetwear', 'Kampus, Olahraga Ringan',
  'Jogger Pants Comfort (JGR-020) + Talaka City Trekker (SNK-027)',
  'Tali serut di bagian pinggul memungkinkan jaket diubah menjadi model crop.',
  'Sangat ringan dan bisa dilipat kecil masuk ke dalam tote bag.', 0
),
(
  'OUT-062', 'Cape Cardigan Flowy Syari', 'Outer', 'Modest Elegance', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=700&q=80',
  299000, 'Rp299.000', 'Chiffon babydoll premium dua lapis', 'Loose Drape Cape',
  '["Sage","Dusty Rose"]'::jsonb,
  '{"Sage":{"One Size":10},"Dusty Rose":{"One Size":8}}'::jsonb,
  'One Size — Lebar dada bebas, Panjang 105 cm',
  'Cuci tangan perlahan, jangan gunakan sikat kasar.',
  'Modest cape, syari royal drape', 'Mengaji, Acara Resmi',
  'Gamis Linen Modest (GMS-016) atau Rok Kembang Flowy (RKU-018)',
  'Potongan cape menutupi area pundak hingga pinggul dengan keanggunan melayang.',
  'Bahan ringan melayang; gunakan bros kecil di dada jika ingin tertutup rapat.', 0
),
(
  'OUT-063', 'Blazer Linen Unstructured Summer', 'Outer', 'Breezy Formal', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=700&q=80',
  439000, 'Rp439.000', 'Linen katun alami tanpa busa bahu kaku', 'Relaxed Tailored',
  '["Krem","Steel Blue"]'::jsonb,
  '{"Krem":{"S":4,"M":7,"L":5,"XL":2},"Steel Blue":{"S":5,"M":6,"L":4,"XL":2}}'::jsonb,
  'S (LD 102 / P 70), M (LD 108 / P 72), L (LD 114 / P 74), XL (LD 120 / P 76)',
  'Setrika uap suhu sedang, gantung di hanger kayu.',
  'Italian sprezzatura, effortless office chic', 'Kerja Santai, Kampus',
  'Kemeja Oxford Slim (KMJ-010) + Chino Stretch Kampus (CHN-023)',
  'Tanpa busa bahu memberi siluet bahu alami yang rileks namun tetap formal.',
  'Linen berkarakter kusut alami yang menambah kesan santai berkelas.', 0
),
(
  'OUT-064', 'Zip-Up Hoodie Minimalist Sand', 'Outer', 'Daily Layer', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=700&q=80',
  289000, 'Rp289.000', 'Cotton terry 300gsm dengan resleting YKK metalik', 'Regular Relaxed',
  '["Sand","Hitam"]'::jsonb,
  '{"Sand":{"S":5,"M":8,"L":6,"XL":3},"Hitam":{"S":4,"M":7,"L":5,"XL":2}}'::jsonb,
  'S (LD 106 / P 66), M (LD 112 / P 68), L (LD 118 / P 70), XL (LD 124 / P 72)',
  'Cuci biasa, hindari pengering putaran panas.',
  'Clean lounge, minimal zip hoodie', 'Belajar, Kampus, Harian',
  'Kaos Grafis Study Vibes (TSH-021) + Jogger Pants (JGR-020)',
  'Resleting depan memudahkan buka-tutup sesuai suhu ruangan kelas atau perpustakaan.',
  'Bahan cotton terry tidak berbulu tebal di dalam, adem dipakai di iklim tropis.', 0
),
(
  'DRS-065', 'Shirt Dress Linen Belted', 'Dress', 'Work & Beyond', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80',
  379000, 'Rp379.000', 'Linen katun premium berstruktur lembut', 'Regular Midi with Belt',
  '["Beige","Navy"]'::jsonb,
  '{"Beige":{"S":4,"M":6,"L":5,"XL":2},"Navy":{"S":5,"M":7,"L":4,"XL":2}}'::jsonb,
  'S (LD 94 / P 110), M (LD 100 / P 112), L (LD 106 / P 114), XL (LD 112 / P 116)',
  'Cuci lembut, setrika suhu sedang saat lembap.',
  'Safari chic, smart casual dress', 'Kerja, Kampus, Hangout',
  'Talaka Slip-On Mule (SNK-031) atau Talaka Cloud Sneaker (SNK-007)',
  'Kerah kemeja dan sabuk pinggang memberi siluet formal yang tetap feminin.',
  'Kancing depan fungsional dari atas ke bawah, ramah ibu menyusui (busui friendly).', 0
),
(
  'DRS-066', 'Slip Dress Satin Bias Cut', 'Dress', 'Party Glam', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=700&q=80',
  329000, 'Rp329.000', 'Satin silk polyester dengan kilau elegan', 'Bias Cut Slim Flattering',
  '["Midnight Black","Emerald"]'::jsonb,
  '{"Midnight Black":{"S":4,"M":6,"L":4,"XL":1},"Emerald":{"S":3,"M":5,"L":3,"XL":1}}'::jsonb,
  'S (LD 86 / P 118), M (LD 92 / P 120), L (LD 98 / P 122), XL (LD 104 / P 124)',
  'Cuci tangan dingin, jangan diperas, setrika uap suhu sangat rendah.',
  '90s minimalist red carpet, cocktail glamour', 'Clubbing, Dinner Romantis',
  'Jaket Kulit Faux (JKT-015) untuk tampilan edgy atau heels anggun',
  'Potongan bias-cut mengikuti lekuk alami tubuh tanpa terasa sesak.',
  'Tali spageti tipis dapat diatur panjang-pendeknya (adjustable strap).', 0
),
(
  'DRS-067', 'Abaya Modern Pleated Cuff', 'Dress', 'Syari Modern', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=700&q=80',
  429000, 'Rp429.000', 'Arabian jetblack crepe jatuh dingin', 'Loose Abaya Cut',
  '["Midnight Black"]'::jsonb,
  '{"Midnight Black":{"S":6,"M":8,"L":6,"XL":4}}'::jsonb,
  'S (LD 108 / P 138), M (LD 114 / P 140), L (LD 120 / P 142), XL (LD 126 / P 144)',
  'Cuci dengan deterjen khusus warna hitam, jemur terbalik di tempat teduh.',
  'Dubai abaya minimalist, syari luxury', 'Mengaji, Hari Raya',
  'Khimar Chiffon Talaka (KHM-017) Putih atau Olive',
  'Warna jetblack pekat memberi kesan tubuh lebih tinggi dan ramping secara instan.',
  'Manset pergelangan tangan dilengkapi kancing wudhu friendly.', 0
),
(
  'DRS-068', 'Tiered Maxi Dress Rayon Cotton', 'Dress', 'Boho Minimal', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=700&q=80',
  369000, 'Rp369.000', 'Rayon crinkle adem flowy', 'Tiered Smocked Bust',
  '["Terracotta","Sage"]'::jsonb,
  '{"Terracotta":{"S":4,"M":6,"L":5,"XL":2},"Sage":{"S":5,"M":7,"L":4,"XL":2}}'::jsonb,
  'S (LD 88–98 / P 125), M (LD 94–104 / P 127), L (LD 100–110 / P 129), XL (LD 106–116 / P 131)',
  'Cuci lembut, jangan disikat, keringkan di tempat teduh.',
  'Cottagecore minimal, breezy bohemian', 'Piknik, Hangout Santai',
  'Outer Boxy Knit Cardigan (OUT-003) + Talaka Aurora Mocca (SNK-006)',
  'Kerutan smock elastis di dada menyesuaikan ukuran tubuh dengan nyaman.',
  'Tekstur bahan crinkle berkerut alami sehingga tidak perlu sering disetrika.', 0
),
(
  'DRS-069', 'Wrap Dress Midi Polkadot Retro', 'Dress', 'Iconic Wrap', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80',
  339000, 'Rp339.000', 'Poly-viscose twill lembut jatuh', 'True Wrap Silhouette',
  '["Hitam","Terracotta"]'::jsonb,
  '{"Hitam":{"S":4,"M":6,"L":5,"XL":2},"Terracotta":{"S":3,"M":5,"L":4,"XL":1}}'::jsonb,
  'S (LD 90 / P 112), M (LD 96 / P 114), L (LD 102 / P 116), XL (LD 108 / P 118)',
  'Cuci biasa, setrika suhu sedang.',
  'French effortless chic, classic Diane wrap', 'Kerja Santai, Acara Keluarga',
  'Talaka Slip-On Mule (SNK-031) Krem',
  'Potongan wrap menyilang di dada dan diikat di pinggang sangat menyanjung berbagai bentuk tubuh.',
  'Model wrap sejati yang dapat diatur kerapatannya dengan tali pinggang.', 0
),
(
  'DRS-070', 'Knit Bodycon Midi Dress Ribbed', 'Dress', 'Sleek Fit', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=700&q=80',
  299000, 'Rp299.000', 'Elastic ribbed knit cotton tebal elastis', 'Fitted Bodycon Midi',
  '["Charcoal","Mocca"]'::jsonb,
  '{"Charcoal":{"S":5,"M":7,"L":5,"XL":2},"Mocca":{"S":4,"M":6,"L":4,"XL":2}}'::jsonb,
  'S (LD 82–92 / P 110), M (LD 88–98 / P 112), L (LD 94–104 / P 114), XL (LD 100–110 / P 116)',
  'Cuci tangan dingin, keringkan datar agar tidak memanjang.',
  'Kardashian minimal chic, urban sleek', 'Clubbing, Dinner Santai',
  'Jaket Kulit Faux (JKT-015) + Talaka Cloud Sneaker (SNK-007)',
  'Rajutan rib elastis memeluk lekuk tubuh dengan anggun.',
  'Memiliki slit belahan samping setinggi 20 cm di betis untuk keleluasaan melangkah.', 0
),
(
  'DRS-071', 'Kaftan Silk Modern Draping', 'Dress', 'Festive Luxury', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=700&q=80',
  459000, 'Rp459.000', 'Satin silk doff dengan aksen kerut pinggang dalam', 'Loose Kaftan Flow',
  '["Warm Grey","Dusty Rose"]'::jsonb,
  '{"Warm Grey":{"One Size":10},"Dusty Rose":{"One Size":8}}'::jsonb,
  'One Size — Lingkar dada bebas hingga 130 cm, Panjang 140 cm',
  'Cuci tangan lembut tanpa peras mesin, setrika uap suhu rendah.',
  'Modern modest kaftan, Eid luxury', 'Mengaji, Acara Resmi',
  'Khimar Chiffon Talaka (KHM-017) Putih',
  'Drapery kain jatuh dari pundak memberi kesan ningrat dan agung.',
  'Dilengkapi tali serut tersembunyi di dalam untuk mengatur siluet pinggang.', 0
),
(
  'DRS-072', 'Pinafore Overall Dress Twill', 'Dress', 'Retro Student', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=700&q=80',
  289000, 'Rp289.000', 'Katun twill non-stretch berstruktur', 'Straight Overall Midi',
  '["Hitam","Sand"]'::jsonb,
  '{"Hitam":{"S":5,"M":7,"L":5,"XL":2},"Sand":{"S":4,"M":6,"L":4,"XL":2}}'::jsonb,
  'S (LP 80 / P 108), M (LP 86 / P 110), L (LP 92 / P 112), XL (LP 98 / P 114)',
  'Cuci biasa, setrika suhu sedang.',
  'Japanese mori girl, academic layered', 'Kampus, Belajar',
  'Kemeja Oxford Slim (KMJ-010) atau Kaos Turtleneck (TSH-034)',
  'Desain tanpa lengan dirancang khusus untuk dilapis di atas kaos atau kemeja favorit.',
  'Tali bahu dilengkapi 2 kancing pengatur tinggi badan.', 0
),
(
  'ACC-073', 'Topi Baseball Cap Bordir Talaka', 'Aksesoris', 'Daily Essential', 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=700&q=80',
  99000, 'Rp99.000', '100% Cotton twill dengan bordir logo minimalis', 'All Size (Strap Gesper Besi Adjustable)',
  '["Hitam","Broken White"]'::jsonb,
  '{"Hitam":{"One Size":20},"Broken White":{"One Size":15}}'::jsonb,
  'Lingkar kepala 54–60 cm, visor 7 cm',
  'Cuci tangan dengan sikat lembut di bagian kotor saja, jangan direndam mesin cuci.',
  'Streetwear cap, dad hat minimal', 'Kampus, Santai',
  'Kaos Oversize (TSH-005) + Celana Kulot (CLN-002)',
  'Visor melengkung melindungi wajah dari terik matahari saat jalan santai.',
  'Strap gesper belakang dari logam anti-karat.', 0
),
(
  'ACC-074', 'Topi Bucket Hat Reversible Dua Sisi', 'Aksesoris', '2-in-1 Style', 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=700&q=80',
  119000, 'Rp119.000', 'Cotton canvas dua sisi (Sisi A: Hitam, Sisi B: Sand)', 'Relaxed Bucket',
  '["Hitam","Sand"]'::jsonb,
  '{"Hitam":{"One Size":16},"Sand":{"One Size":14}}'::jsonb,
  'Lingkar kepala 56–58 cm, brim 6 cm',
  'Cuci tangan air dingin, setrika suhu sedang.',
  '90s skater, aesthetic bucket hat', 'Hangout, Traveling',
  'Hoodie Fleece (HDI-019) + Jogger Pants (JGR-020)',
  'Bisa dibalik untuk mengganti warna outfit seketika.',
  'Dapat dilipat kecil tanpa merusak bentuk topi.', 0
),
(
  'ACC-075', 'Sling Bag Crossbody Mini Nylon', 'Aksesoris', 'Hands Free', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80',
  149000, 'Rp149.000', 'Waterproof crinkle nylon & YKK zipper', 'Compact Crossbody',
  '["Hitam","Olive"]'::jsonb,
  '{"Hitam":{"One Size":18},"Olive":{"One Size":12}}'::jsonb,
  'P 22 cm × T 16 cm × L 6 cm (muat HP, dompet, kunci)',
  'Lap kain basah, bahan nilon anti noda.',
  'Utilitarian pouch, festival sling bag', 'Konser, Hangout, Harian',
  'Jaket Kulit (JKT-015) atau Kaos Oversize (TSH-005)',
  'Tali bahu adjustable bisa dipakai di dada atau di samping pinggang.',
  'Kapasitas ringkas untuk barang esensial harian.', 0
),
(
  'ACC-076', 'Backpack Laptop Minimalist 15.6"', 'Aksesoris', 'Campus & Office', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80',
  359000, 'Rp359.000', 'Poly-cordura tebal water-repellent dengan slot busa laptop', 'Ergonomic Backpack 20 Liter',
  '["Charcoal","Hitam"]'::jsonb,
  '{"Charcoal":{"One Size":15},"Hitam":{"One Size":20}}'::jsonb,
  'T 44 cm × L 30 cm × Tebal 14 cm (muat laptop hingga 15.6")',
  'Bersihkan noda dengan sikat gigi lembap, jangan dicuci mesin.',
  'Commuter minimal, Scandinavian carry', 'Kampus, Kerja, Belajar',
  'Polo Shirt Pique (PLO-022) + Chino Stretch (CHN-023)',
  'Bantalan punggung empuk bersirkulasi udara mencegah punggung berkeringat.',
  'Dilengkapi strap koper di bagian belakang untuk kemudahan saat traveling.', 0
),
(
  'ACC-077', 'Ikat Pinggang Kulit Reversible Minimal', 'Aksesoris', 'Formal Core', 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=700&q=80',
  139000, 'Rp139.000', 'High-grade microfibre leather dua sisi (Hitam / Espresso) & gesper putar', 'Width 3.3 cm (Universal Length 115 cm)',
  '["Hitam"]'::jsonb,
  '{"Hitam":{"One Size":25}}'::jsonb,
  'Panjang 115 cm (bisa dipotong sendiri sesuai lingkar pinggang), Lebar 3.3 cm',
  'Lap kain kering, simpan digantung lurus.',
  'Modern corporate belt, sleek leather', 'Kerja, Formal',
  'Celana Bahan Slim (CLN-011) atau Chino Stretch (CHN-023)',
  'Gesper putar otomatis mengubah warna dari Hitam ke Espresso sesuai warna sepatu.',
  'Tersedia lubang penyesuaian yang rapi dan kuat.', 0
),
(
  'ACC-078', 'Kacamata Hitam Polarized Minimalist', 'Aksesoris', 'UV400 Protected', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80',
  169000, 'Rp169.000', 'Polycarbonate frame matte & TAC polarized lens UV400', 'Universal Medium Fit',
  '["Hitam"]'::jsonb,
  '{"Hitam":{"One Size":18}}'::jsonb,
  'Lebar bingkai 142 mm, panjang tangkai 145 mm',
  'Lap hanya dengan kain microfiber kacamata yang disediakan, jangan gunakan tisu kasar.',
  'Wayfarer clean aesthetic, timeless shade', 'Hangout, Liburan',
  'Kemeja Rayon Camp Collar (KMJ-037) + Celana Kulot (CLN-002)',
  'Bentuk bingkai persegi tumpul cocok untuk hampir semua bentuk wajah.',
  'Termasuk case pelindung kulit sintetis dan kain lap microfiber.', 0
),
(
  'ACC-079', 'Kaus Kaki Crew Ribbed Cotton (3-Pack)', 'Aksesoris', 'Daily Pack', 'https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=700&q=80',
  79000, 'Rp79.000', 'Combed cotton 80% + elastane 20% (anti-bakteri, tidak mudah melar)', 'Mid-Calf Ribbed (Unisex 38–44)',
  '["Putih","Hitam"]'::jsonb,
  '{"Putih":{"One Size":30},"Hitam":{"One Size":25}}'::jsonb,
  'Panjang betis 18 cm, muat ukuran sepatu 38 hingga 44',
  'Cuci mesin putaran biasa, jangan disetrika.',
  'Streetwear crew socks, collegiate style', 'Kampus, Belajar, Kerja',
  'Talaka Cloud Off-White (SNK-007) atau Talaka Aurora Mocca (SNK-006)',
  'Rajutan rib tebal di tumit dan telapak memberi bantalan ekstra saat memakai sneaker seharian.',
  'Paket isi 3 pasang kaus kaki dengan warna senada.', 0
),
(
  'ACC-080', 'Syal Pashmina Ceruty Babydoll', 'Aksesoris', 'Hijab & Scarf', 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=700&q=80',
  69000, 'Rp69.000', 'Ceruty babydoll premium bertekstur pasir lembut', 'Flowy Pashmina 180x75 cm',
  '["Sage","Mocca"]'::jsonb,
  '{"Sage":{"One Size":25},"Mocca":{"One Size":20}}'::jsonb,
  'Panjang 180 cm × Lebar 75 cm',
  'Cuci tangan perlahan, setrika suhu rendah-sedang.',
  'Modest pashmina, flowy drape hijab', 'Mengaji, Kampus, Formal',
  'Gamis Linen Modest (GMS-016) atau Blazer Struktural (BLZ-012)',
  'Bahan ceruty babydoll jatuh anggun dan mudah dibentuk berbagai gaya hijab.',
  'Bahan agak tipis berpasir; disarankan menggunakan inner ciput.', 0
),
(
  'ACC-081', 'Scrunchie Silk Jumbo Ikat Rambut', 'Aksesoris', 'Hair Care', 'https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=700&q=80',
  39000, 'Rp39.000', 'Mulberry silk satin halus tidak merusak rambut', 'Diameter 14 cm Jumbo',
  '["Dusty Rose","Midnight Black"]'::jsonb,
  '{"Dusty Rose":{"One Size":30},"Midnight Black":{"One Size":30}}'::jsonb,
  'Diameter elastik 14 cm',
  'Cuci tangan air dingin, jemur teduh.',
  'Clean girl aesthetic, volumizing scrunchie', 'Harian, Belajar',
  'Cocok sebagai cepol hijab atau kuncir rambut harian',
  'Memberi volume cepol hijab yang proporsional tanpa terasa berat di kepala.',
  'Karet elastik berkualitas tinggi tidak mudah kendor.', 0
),
(
  'ACC-082', 'Kalung Rantai Minimalist Layered Gold', 'Aksesoris', 'Jewelry Accent', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80',
  129000, 'Rp129.000', 'Stainless steel 316L lapis 18K gold (anti-karat & hypoallergenic)', 'Dual Layer Chain (40 cm + 45 cm)',
  '["Rose Gold"]'::jsonb,
  '{"Rose Gold":{"One Size":22}}'::jsonb,
  'Rantai 1: 40 cm, Rantai 2: 45 cm + rantai ekstensi 5 cm',
  'Hindari kontak langsung dengan parfum atau lotion pekat.',
  'Dainty gold jewelry, subtle elegance', 'Clubbing, Hangout, Kerja',
  'Satin Corset Top (TOP-013) atau Kemeja Oxford (KMJ-010)',
  'Layer ganda memberi sentuhan berkilau lembut di area leher.',
  'Bahan titanium steel aman untuk kulit sensitif dan tidak menghitam terkena air.', 0
),
(
  'ACC-083', 'Anting Hoop Minimalist Chunky', 'Aksesoris', 'Everyday Jewelry', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80',
  99000, 'Rp99.000', 'Titanium steel hollow ringan lapis emas', 'Diameter 22 mm Tube',
  '["Rose Gold"]'::jsonb,
  '{"Rose Gold":{"One Size":20}}'::jsonb,
  'Diameter 22 mm, ketebalan tabung 4 mm',
  'Lap kain kering setelah pemakaian.',
  'Classic chunky hoop, Parisian chic', 'Clubbing, Kerja',
  'Blazer Struktural (BLZ-012) atau Kaos Turtleneck (TSH-034)',
  'Desain hollow berongga di dalam membuatnya sangat ringan dipakai seharian tanpa menarik cuping telinga.',
  'Kancing pengunci klik aman dan presisi.', 0
),
(
  'ACC-084', 'Gelang Tennis Bracelet Zirconia', 'Aksesoris', 'Sparkle Touch', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80',
  159000, 'Rp159.000', 'AAA cubic zirconia & rhodium-plated copper', 'Length 17 cm Box Clasp',
  '["Putih"]'::jsonb,
  '{"Putih":{"One Size":18}}'::jsonb,
  'Panjang 17 cm, lebar batu 3 mm',
  'Simpan di kotak perhiasan kedap udara, hindari terkena sabun cuci piring.',
  'Timeless tennis bracelet, subtle luxury', 'Clubbing, Dinner, Formal',
  'Satin Corset Top (TOP-013) atau Midi Dress Flowy (DRS-004)',
  'Kilau batu zirkonia memantulkan cahaya indah saat tangan bergerak.',
  'Pengait ganda model box-clasp mencegah gelang terlepas tidak sengaja.', 0
),
(
  'ACC-085', 'Dompet Kartu Cardholder Slim Leather', 'Aksesoris', 'Slim Carry', 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=80',
  89000, 'Rp89.000', 'Microfibre nappa leather dengan 6 slot kartu + 1 slot uang', 'Ultra Slim Pocket Fit',
  '["Hitam","Mocca"]'::jsonb,
  '{"Hitam":{"One Size":25},"Mocca":{"One Size":20}}'::jsonb,
  'P 10.5 cm × T 8 cm × Tebal 0.4 cm',
  'Lap kain kering, hindari menekuk secara paksa.',
  'Cashless lifestyle, minimalist wallet', 'Harian, Kampus, Kerja',
  'Muat di semua saku celana atau tas selempang mini',
  'Sangat tipis tidak menimbulkan tonjolan di saku celana slim fit.',
  'Muat 6–8 kartu debit/KTP dan beberapa lembar uang darurat.', 0
),
(
  'ACC-086', 'Tumbler Stainless Steel Termos 500ml', 'Aksesoris', 'Eco Daily', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
  149000, 'Rp149.000', 'SUS 304 food-grade double-wall vacuum insulated', 'Capacity 500 ml',
  '["Charcoal","Krem"]'::jsonb,
  '{"Charcoal":{"One Size":20},"Krem":{"One Size":20}}'::jsonb,
  'Tinggi 22 cm, diameter 6.8 cm, berat kosong 280 gram',
  'Cuci dengan spons lembut, jangan masukkan ke microwave.',
  'Nordic minimalist drinkware, zero waste', 'Kampus, Belajar, Kerja',
  'Pas di slot botol Tote Canvas Kampus (BAG-024)',
  'Menjaga suhu minuman dingin hingga 18 jam dan panas hingga 12 jam.',
  'Tutup kedap anti-bocor dengan seal silikon food-grade.', 0
),
(
  'ACC-087', 'Kaos Kaki Hidden No-Show Loafer (3-Pack)', 'Aksesoris', 'Invisible Comfort', 'https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=700&q=80',
  69000, 'Rp69.000', 'Katun combed tipis dengan silicone grip anti-slip di tumit', 'No-Show Cut (38–43)',
  '["Hitam","Beige"]'::jsonb,
  '{"Hitam":{"One Size":25},"Beige":{"One Size":25}}'::jsonb,
  'Potongan sangat rendah tersembunyi di dalam sepatu',
  'Cuci mesin putaran biasa.',
  'Ankle-free look for loafers and sneakers', 'Kerja, Harian',
  'Talaka Slip-On Mule (SNK-031) atau Talaka Derby Leather (SNK-028)',
  'Memberi tampilan tanpa kaus kaki yang rapi tanpa membuat kaki lecet atau bau.',
  'Dilengkapi gel silikon di bagian tumit agar kaus kaki tidak merosot ke telapak.', 0
),
(
  'ACC-088', 'Gantungan Kunci Lanyard Kulit Talaka', 'Aksesoris', 'Everyday Carry', 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=80',
  59000, 'Rp59.000', 'Kulit sintetis tebal & pengait karabiner logam matte', 'Length 14 cm',
  '["Hitam","Mocca"]'::jsonb,
  '{"Hitam":{"One Size":30},"Mocca":{"One Size":25}}'::jsonb,
  'Panjang 14 cm, lebar pita kulit 2 cm',
  'Lap kain bersih.',
  'Minimal key lanyard, tactile edc', 'Kampus, Kerja',
  'Tote Canvas Kampus (BAG-024) atau tas ransel',
  'Memudahkan menemukan kunci di dalam tas besar dengan sentuhan kulit yang elegan.',
  'Kait karabiner kuat dapat mengunci aman di loop celana.', 0
),
(
  'ACC-089', 'Ciput Ninja Inner Hijab Anti-Pusing', 'Aksesoris', 'Modest Base', 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=700&q=80',
  49000, 'Rp49.000', 'Rayon spandex super adem & berpori', 'Inner Ninja Full Neck',
  '["Hitam","Krem"]'::jsonb,
  '{"Hitam":{"One Size":30},"Krem":{"One Size":25}}'::jsonb,
  'One Size elastik pas di kepala dan menutup leher rapi',
  'Cuci tangan lembut, jangan disetrika suhu tinggi.',
  'Essential inner ninja hijab', 'Mengaji, Harian',
  'Khimar Chiffon (KHM-017) atau Pashmina Ceruty (ACC-080)',
  'Bahan rayon fleksibel tidak menekan daun telinga sehingga bebas pusing dipakai seharian.',
  'Kain adem menyerap keringat di bawah kerudung.', 0
),
(
  'ACC-090', 'Bros Magnet Hijab Pearl Minimalist', 'Aksesoris', 'No-Pin Hijab', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80',
  45000, 'Rp45.000', 'Neodymium magnet ultra kuat dengan hiasan mutiara sintetis halus', 'Diameter 1.2 cm Pair',
  '["Putih"]'::jsonb,
  '{"Putih":{"One Size":35}}'::jsonb,
  'Diameter 1.2 cm, daya rekat magnetik hingga 4 lapis kain',
  'Simpan terpisah dari kartu ATM atau benda bermagnet.',
  'Modern pinless hijab clip, pearl accent', 'Mengaji, Formal',
  'Khimar Chiffon (KHM-017) atau Gamis Linen Modest (GMS-016)',
  'Mengunci hijab dengan kuat tanpa merusak serat kain jilbab.',
  'Tanpa jarum tajam, 100% aman dan tidak melubangi kain sutra atau chiffon.', 0
),
(
  'ACC-091', 'Sarung Tangan Rajut Touchscreen Finger', 'Aksesoris', 'Tech Warmth', 'https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=700&q=80',
  69000, 'Rp69.000', 'Cotton-acrylic knit dengan serat konduktif di ujung jari telunjuk & jempol', 'Elastic Stretch (Unisex)',
  '["Charcoal","Hitam"]'::jsonb,
  '{"Charcoal":{"One Size":20},"Hitam":{"One Size":20}}'::jsonb,
  'Panjang 21 cm, elastis mengikuti telapak tangan',
  'Cuci tangan air dingin, jangan disikat.',
  'Winter tech minimal', 'Belajar, Berkendara Malam',
  'Hoodie Fleece (HDI-019) atau Jaket Kulit (JKT-015)',
  'Bisa mengoperasikan layar HP tanpa harus melepas sarung tangan.',
  'Sensitivitas layar sentuh responsif pada smartphone layar kapasitif.', 0
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
