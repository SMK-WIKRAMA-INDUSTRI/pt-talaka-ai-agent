export const COLOR_SWATCHES = {
  Putih: '#FFFFFF',
  Beige: '#E5D5C3',
  Krem: '#EFE6D5',
  Hitam: '#18181B',
  Sage: '#8FA394',
  Charcoal: '#334155',
  Terracotta: '#C2674A',
  Navy: '#1E3A5F',
  'Broken White': '#F7F5F0',
  Mocca: '#9E7B66',
  Espresso: '#5C4033',
  'Off-White': '#F6F5F0',
  'Cream Mist': '#E8E0D2',
  'Crimson Gold': '#B91C1C',
  'Obsidian Red': '#7F1D1D',
  // Koleksi Baru
  'Steel Blue': '#4A6FA5',
  'Slate Grey': '#6B7280',
  'Dusty Rose': '#C9A0A0',
  'Deep Purple': '#4B2367',
  'Emerald': '#065F46',
  'Rose Gold': '#B76E79',
  'Midnight Black': '#0D0D0D',
  'Lavender': '#9B8EB8',
  'Forest Green': '#2D6A4F',
  'Sand': '#D4B896',
  'Sky Blue': '#BAD0E8',
  'Warm Grey': '#9E9E8E',
  'Olive': '#6B7045',
};

export const TALAKA_PRODUCTS = [
  {
    sku: 'SNK-006',
    name: 'Talaka Aurora Mocca Runner',
    category: 'Sepatu',
    badge: 'Best Seller',
    image: '/images/sneaker-mocca.jpg',
    price: 549000,
    priceFormatted: 'Rp549.000',
    material: 'Breathable mesh & premium suede overlay, outsole EVA empuk',
    fit: 'True to Size (Unisex)',
    colors: ['Mocca', 'Espresso'],
    sizes: {
      Mocca: { 39: 4, 40: 6, 41: 2, 42: 5, 43: 0, 44: 3 },
      Espresso: { 39: 2, 40: 4, 41: 5, 42: 1, 43: 3, 44: 0 },
    },
    measurements:
      'EU 39 (24.5 cm), 40 (25 cm), 41 (26 cm), 42 (26.5 cm), 43 (27.5 cm), 44 (28 cm)',
    care: 'Bersihkan noda dengan sikat lembut & sabun khusus suede, jangan direndam air.',
    style: 'Earth-tone modern, smart streetwear',
    occasions: 'Ngampus, kerja kreatif, jalan santai seharian',
    pairWith: 'Celana Kulot High-Waist (CLN-002) Krem atau Kemeja Linen Talaka (KMJ-001)',
    proportionTip: 'Sol tebal 3.5 cm membantu memberi ilusi kaki lebih jenjang tanpa terasa berat.',
    honestNote:
      'Untuk tipe kaki yang sangat lebar (wide feet), sebaiknya naik 1 ukuran agar bagian depan tetap lega.',
    url: '#katalog-produk',
  },
  {
    sku: 'SNK-007',
    name: 'Talaka Cloud Off-White Chunky',
    category: 'Sepatu',
    badge: 'New Arrival',
    image: '/images/sneaker-white.jpg',
    price: 529000,
    priceFormatted: 'Rp529.000',
    material: 'Vegan leather halus & mesh sirkulasi udara, sol chunky ringan',
    fit: 'True to Size (Unisex)',
    colors: ['Off-White', 'Cream Mist'],
    sizes: {
      'Off-White': { 39: 5, 40: 3, 41: 7, 42: 4, 43: 2, 44: 1 },
      'Cream Mist': { 39: 3, 40: 0, 41: 4, 42: 6, 43: 3, 44: 2 },
    },
    measurements:
      'EU 39 (24.5 cm), 40 (25 cm), 41 (26 cm), 42 (26.5 cm), 43 (27.5 cm), 44 (28 cm)',
    care: 'Lap bagian kulit sintetis dengan kain lembap setelah dipakai agar warna putih tetap bersih.',
    style: 'Clean minimalist, Korean casual',
    occasions: 'Harian, hangout, semi-formal santai',
    pairWith: 'Midi Dress A-Line Flowy (DRS-004) atau Kaos Oversize Heavyweight (TSH-005)',
    proportionTip: 'Warna off-white netral menyatu mulus dengan hampir semua warna outfit.',
    honestNote:
      'Bagian mesh warna terang butuh perawatan lebih rutin kalau sering dipakai saat musim hujan.',
    url: '#katalog-produk',
  },
  {
    sku: 'SNK-008',
    name: 'Talaka Aurum Trail Statement',
    category: 'Sepatu',
    badge: 'Limited Drop',
    image: '/images/sneaker-flashtrek.jpg',
    price: 689000,
    priceFormatted: 'Rp689.000',
    material: 'Layered leather, metallic gold panel, rugged rubber lug outsole',
    fit: 'Chunky Fit (Unisex)',
    colors: ['Crimson Gold', 'Obsidian Red'],
    sizes: {
      'Crimson Gold': { 39: 1, 40: 2, 41: 0, 42: 3, 43: 2, 44: 0 },
      'Obsidian Red': { 39: 2, 40: 3, 41: 2, 42: 1, 43: 0, 44: 1 },
    },
    measurements:
      'EU 39 (24.5 cm), 40 (25 cm), 41 (26 cm), 42 (26.5 cm), 43 (27.5 cm), 44 (28 cm)',
    care: 'Lap perlahan menggunakan kain microfiber kering terutama pada detail strap kristal.',
    style: 'Bold streetwear, statement luxury',
    occasions: 'Konser, acara kreatif, photoshoot, OOTD bold',
    pairWith: 'Kaos Oversize Heavyweight (TSH-005) Hitam & Celana Kulot Hitam (CLN-002)',
    proportionTip: 'Karena sepatunya sudah mencolok, padukan dengan pakaian warna polos/monokrom agar seimbang.',
    honestNote:
      'Bobotnya sedikit lebih berat dibanding seri Cloud karena sol trail tebal—kurang cocok jika dicari untuk lari olahraga.',
    url: '#katalog-produk',
  },
  {
    sku: 'KMJ-001',
    name: 'Kemeja Linen Talaka',
    category: 'Atasan',
    badge: 'Essential',
    image: '/images/kemeja-linen.jpg',
    price: 249000,
    priceFormatted: 'Rp249.000',
    material: 'Linen-katun breathable',
    fit: 'Regular Fit',
    colors: ['Putih', 'Beige'],
    sizes: {
      Putih: { S: 6, M: 2, L: 4, XL: 0 },
      Beige: { S: 4, M: 5, L: 3, XL: 2 },
    },
    measurements:
      'S (LD 96 / P 64), M (LD 102 / P 66), L (LD 108 / P 68), XL (LD 114 / P 70)',
    care: 'Cuci tangan atau mesin mode lembut, setrika suhu sedang.',
    style: 'Minimalis, casual rapi',
    occasions: 'Kuliah, kerja santai, hangout',
    pairWith: 'Celana Kulot High-Waist (CLN-002)',
    proportionTip:
      'Cocok dimasukkan ke bawahan high-waist atau dibuka sebagai outer tipis.',
    honestNote:
      'Potongannya lurus; kurang pas kalau cari siluet yang sangat ketat di pinggang.',
    url: '#katalog-produk',
  },
  {
    sku: 'CLN-002',
    name: 'Celana Kulot High-Waist',
    category: 'Bawahan',
    badge: 'Best Seller',
    image: '/images/celana-kulot.jpg',
    price: 279000,
    priceFormatted: 'Rp279.000',
    material: 'Twill katun lembut (non-stretch, jatuh rapi)',
    fit: 'High-Waist Wide Leg',
    colors: ['Krem', 'Hitam'],
    sizes: {
      Krem: { S: 5, M: 7, L: 3, XL: 2 },
      Hitam: { S: 2, M: 0, L: 6, XL: 4 },
    },
    measurements:
      'S (LP 66 / P 96), M (LP 72 / P 98), L (LP 78 / P 100), XL (LP 84 / P 101)',
    care: 'Cuci dengan warna senada, jemur di tempat teduh.',
    style: 'Minimalis, smart casual',
    occasions: 'Ngampus, kantor, semi-formal',
    pairWith: 'Kemeja Linen Talaka (KMJ-001) atau Talaka Aurora Mocca Runner (SNK-006)',
    proportionTip: 'Pinggang high-waist membantu kaki terlihat lebih jenjang.',
    honestNote:
      'Untuk TB di bawah 156 cm, panjang 98–100 cm mungkin perlu lipatan kecil atau sepatu bersol agak tebal supaya tidak nyapu lantai.',
    url: '#katalog-produk',
  },
  {
    sku: 'OUT-003',
    name: 'Outer Boxy Knit Cardigan',
    category: 'Outer',
    badge: 'Layering',
    image: '/images/outer-cardigan.jpg',
    price: 299000,
    priceFormatted: 'Rp299.000',
    material: 'Knit katun halus (tidak gatal, medium-weight)',
    fit: 'Oversize / Boxy',
    colors: ['Sage', 'Charcoal'],
    sizes: {
      Sage: { S: 3, M: 6, L: 2, XL: 1 },
      Charcoal: { S: 5, M: 4, L: 5, XL: 0 },
    },
    measurements:
      'S (LD 108 / P 54), M (LD 114 / P 56), L (LD 120 / P 58), XL (LD 126 / P 60)',
    care: 'Lipat saat disimpan (jangan digantung agar bahu tidak melar), cuci tangan.',
    style: 'Casual, streetwear ringan',
    occasions: 'Hangout, ngampus, ruang ber-AC',
    pairWith: 'Celana Kulot High-Waist (CLN-002) warna Hitam/Krem',
    proportionTip:
      'Panjang crop-boxy membuat bagian atas tidak menenggelamkan tinggi badan.',
    honestNote:
      'Karena potongannya sudah boxy/oversize, kalau suka tampilan lebih rapi bisa turun 1 ukuran.',
    url: '#katalog-produk',
  },
  {
    sku: 'DRS-004',
    name: 'Midi Dress A-Line Flowy',
    category: 'Dress',
    badge: 'Clean Look',
    image: '/images/midi-dress.jpg',
    price: 349000,
    priceFormatted: 'Rp349.000',
    material: 'Rayon twill premium (adem & jatuh)',
    fit: 'A-Line Regular',
    colors: ['Terracotta', 'Navy'],
    sizes: {
      Terracotta: { S: 4, M: 3, L: 1, XL: 0 },
      Navy: { S: 6, M: 5, L: 4, XL: 2 },
    },
    measurements:
      'S (LD 92 / P 112), M (LD 98 / P 114), L (LD 104 / P 116), XL (LD 110 / P 118)',
    care: 'Cuci lembut dengan air dingin, hindari pengering panas agar tidak menyusut.',
    style: 'Feminin, clean',
    occasions: 'Kondangan santai, makan malam, acara keluarga',
    pairWith: 'Outer Boxy Knit Cardigan (OUT-003) atau Talaka Cloud Off-White (SNK-007)',
    proportionTip:
      'Siluet A-line memberi ruang gerak nyaman di area pinggul tanpa terlihat penuh.',
    honestNote:
      'Bahan rayon non-stretch, jadi kalau di perbatasan ukuran sebaiknya utamakan lingkar dada atau naik 1 ukuran.',
    url: '#katalog-produk',
  },
  {
    sku: 'TSH-005',
    name: 'Kaos Oversize Heavyweight',
    category: 'Atasan',
    badge: 'Daily Core',
    image: '/images/kaos-oversize.jpg',
    price: 159000,
    priceFormatted: 'Rp159.000',
    material: 'Cotton combed 20s (tebal, tidak menerawang)',
    fit: 'Oversize',
    colors: ['Hitam', 'Broken White'],
    sizes: {
      Hitam: { S: 8, M: 10, L: 7, XL: 3 },
      'Broken White': { S: 2, M: 4, L: 0, XL: 5 },
    },
    measurements:
      'S (LD 108 / P 68), M (LD 114 / P 70), L (LD 120 / P 72), XL (LD 126 / P 74)',
    care: 'Cuci balik bagian dalam ke luar, jangan disetrika langsung di area sablon/label.',
    style: 'Streetwear, casual harian',
    occasions: 'Harian, nongkrong, kuliah',
    pairWith:
      'Celana Kulot High-Waist (CLN-002) dengan metode french-tuck (masukkan depan saja)',
    proportionTip:
      'Cocok dipadukan dengan bawahan yang lebih terstruktur agar tetap terlihat rapi.',
    honestNote:
      'Untuk TB di bawah 158 cm, ukuran M ke atas bisa terasa cukup panjang jika tidak dimasukkan ke celana.',
    url: '#katalog-produk',
  },

  // ============================================================
  // KOLEKSI KERJA — Smart & Polished Office Wear
  // ============================================================
  {
    sku: 'KMJ-010',
    name: 'Kemeja Oxford Slim Premium',
    category: 'Atasan',
    badge: 'Office Ready',
    image: '/images/oxford-shirt.jpg',
    price: 289000,
    priceFormatted: 'Rp289.000',
    material: 'Oxford cotton 100% (tidak kusut mudah, adem, sirkulasi udara baik)',
    fit: 'Slim Fit',
    colors: ['Putih', 'Steel Blue'],
    occasions: 'Kerja',
    sizes: {
      Putih: { S: 5, M: 8, L: 6, XL: 4 },
      'Steel Blue': { S: 4, M: 7, L: 5, XL: 3 },
    },
    measurements: 'S (LD 94 / P 73), M (LD 100 / P 75), L (LD 106 / P 77), XL (LD 112 / P 79)',
    care: 'Setrika suhu sedang saat agak lembap untuk hasil rapih maksimal, cuci mesin gentle cycle.',
    style: 'Formal, smart casual, business professional',
    pairWith: 'Celana Bahan Slim (CLN-011) atau Blazer Struktural Talaka (BLZ-012)',
    proportionTip: 'Slim fit memberi kesan proporsional di tubuh ramping maupun atletis. Masukkan ke celana untuk tampil formal penuh.',
    honestNote: 'Potongannya snug di bahu; kalau bahu lebar sebaiknya naik 1 ukuran agar tidak menarik saat bergerak.',
    url: '#katalog-produk',
  },
  {
    sku: 'CLN-011',
    name: 'Celana Bahan Slim Kerja',
    category: 'Bawahan',
    badge: 'Office Ready',
    image: '/images/celana-bahan.jpg',
    price: 319000,
    priceFormatted: 'Rp319.000',
    material: 'Tropical wool blend (ringan, anti-kusut ringan, jatuh rapi)',
    fit: 'Slim Straight',
    colors: ['Charcoal', 'Navy'],
    occasions: 'Kerja',
    sizes: {
      Charcoal: { S: 4, M: 6, L: 5, XL: 3 },
      Navy: { S: 3, M: 5, L: 4, XL: 4 },
    },
    measurements: 'S (LP 70 / P 98), M (LP 76 / P 100), L (LP 82 / P 102), XL (LP 88 / P 103)',
    care: 'Gantung setelah dipakai, setrika bagian dalam, dry-clean jika ada noda membandel.',
    style: 'Business formal, smart casual',
    pairWith: 'Kemeja Oxford Slim Premium (KMJ-010) atau Blazer Struktural Talaka (BLZ-012)',
    proportionTip: 'Potongan slim straight memperlihatkan panjang kaki secara alami tanpa terlalu melekat.',
    honestNote: 'Bahan tidak stretch; jika BB di perbatasan ukuran, utamakan ukuran lingkar pinggang agar tetap nyaman duduk lama.',
    url: '#katalog-produk',
  },
  {
    sku: 'BLZ-012',
    name: 'Blazer Struktural Talaka',
    category: 'Outer',
    badge: 'Power Look',
    image: '/images/blazer-talaka.jpg',
    price: 489000,
    priceFormatted: 'Rp489.000',
    material: 'Polyester-viscose woven (struktur bahu tegas, ringan, tidak panas berlebih)',
    fit: 'Regular Structured',
    colors: ['Hitam', 'Slate Grey'],
    occasions: 'Kerja',
    sizes: {
      Hitam: { S: 3, M: 5, L: 4, XL: 2 },
      'Slate Grey': { S: 4, M: 6, L: 3, XL: 2 },
    },
    measurements: 'S (LD 96 / P 68), M (LD 102 / P 70), L (LD 108 / P 72), XL (LD 114 / P 74)',
    care: 'Gantung selalu di hanger berbahu, setrika uap pada suhu sedang, hindari pencucian berulang.',
    style: 'Formal, power dressing, smart elegant',
    pairWith: 'Kemeja Oxford Slim (KMJ-010) + Celana Bahan Slim (CLN-011) untuk business look penuh.',
    proportionTip: 'Bahu terstruktur mempertegas postur. Cocok dipadukan dengan bawahan high-waist untuk siluet hourglass.',
    honestNote: 'Karena strukturnya, gerakan tangan ke atas bisa sedikit terbatas—pertimbangkan jika banyak aktivitas fisik di kantor.',
    url: '#katalog-produk',
  },

  // ============================================================
  // KOLEKSI CLUBBING — Night Out & Party Vibes
  // ============================================================
  {
    sku: 'TOP-013',
    name: 'Satin Corset Top Talaka',
    category: 'Atasan',
    badge: 'Night Out',
    image: '/images/satin-corset.jpg',
    price: 219000,
    priceFormatted: 'Rp219.000',
    material: 'Satin polyester shiny (halus, berkilau, boning ringan di bagian pinggang)',
    fit: 'Fitted Corset',
    colors: ['Midnight Black', 'Dusty Rose'],
    occasions: 'Clubbing',
    sizes: {
      'Midnight Black': { S: 4, M: 6, L: 3, XL: 2 },
      'Dusty Rose': { S: 5, M: 4, L: 2, XL: 1 },
    },
    measurements: 'S (LD 80 / P 42), M (LD 86 / P 43), L (LD 92 / P 44), XL (LD 98 / P 45)',
    care: 'Cuci tangan perlahan, jangan diperas, keringkan datar agar tidak melar.',
    style: 'Glamour, party, edgy chic',
    pairWith: 'Rok Mini Pleated (SKR-014) atau high-waist wide-leg pants warna gelap.',
    proportionTip: 'Desain boning mengikat pinggang secara alami untuk ilusi hourglass yang lebih tegas.',
    honestNote: 'Pas di badan, bukan model yang bisa naik ukuran—pilih sesuai ukuran lingkar dada & pinggang aktual.',
    url: '#katalog-produk',
  },
  {
    sku: 'SKR-014',
    name: 'Mini Pleated Skirt Metallic',
    category: 'Bawahan',
    badge: 'Night Out',
    image: '/images/pleated-skirt.jpg',
    price: 199000,
    priceFormatted: 'Rp199.000',
    material: 'Metallic polyester pleated (berkilau, ringan, mengembang sempurna saat bergerak)',
    fit: 'Mini Flare',
    colors: ['Deep Purple', 'Midnight Black'],
    occasions: 'Clubbing',
    sizes: {
      'Deep Purple': { S: 4, M: 5, L: 3, XL: 1 },
      'Midnight Black': { S: 6, M: 7, L: 4, XL: 2 },
    },
    measurements: 'S (LP 62 / P 38), M (LP 68 / P 39), L (LP 74 / P 40), XL (LP 80 / P 41)',
    care: 'Cuci tangan dengan air dingin, jangan diseterika langsung di permukaan metalik.',
    style: 'Party, disko, retro glam',
    pairWith: 'Satin Corset Top Talaka (TOP-013) + heels atau boots tinggi.',
    proportionTip: 'Panjang mini di atas lutut memperlihatkan kaki lebih jenjang; cocok dipadukan body-fit top di atasnya.',
    honestNote: 'Pleating memberi volume di area pinggul—jika tidak nyaman tampil bervolume di bawah, pertimbangkan rok straight cut.',
    url: '#katalog-produk',
  },
  {
    sku: 'JKT-015',
    name: 'Jaket Kulit Faux Night Rider',
    category: 'Outer',
    badge: 'Night Out',
    image: '/images/leather-jacket.jpg',
    price: 549000,
    priceFormatted: 'Rp549.000',
    material: 'Faux leather PU premium (tidak dingin di AC, tidak kaku, fleksibel)',
    fit: 'Slim Moto Jacket',
    colors: ['Midnight Black', 'Rose Gold'],
    occasions: 'Clubbing',
    sizes: {
      'Midnight Black': { S: 2, M: 4, L: 3, XL: 1 },
      'Rose Gold': { S: 3, M: 3, L: 2, XL: 1 },
    },
    measurements: 'S (LD 96 / P 60), M (LD 102 / P 62), L (LD 108 / P 64), XL (LD 114 / P 66)',
    care: 'Lap dengan kain lembap, oleskan conditioner faux-leather setiap 3 bulan. Jangan dicuci mesin.',
    style: 'Edgy, rock glam, moto chic',
    pairWith: 'Satin Corset Top (TOP-013) + Mini Pleated Skirt (SKR-014) untuk full night-out look.',
    proportionTip: 'Jaket moto crop-length tidak memotong tinggi badan sehingga siluet tetap tinggi.',
    honestNote: 'Kulit PU tidak se-breathable bahan lain; bisa terasa hangat jika ruangan tidak ber-AC. Pas untuk spot outdoor malam.',
    url: '#katalog-produk',
  },

  // ============================================================
  // KOLEKSI MENGAJI — Modest & Syar'i Comfort Wear
  // ============================================================
  {
    sku: 'GMS-016',
    name: 'Gamis Linen Modest Talaka',
    category: 'Dress',
    badge: 'Modest Wear',
    image: '/images/gamis-linen.jpg',
    price: 389000,
    priceFormatted: 'Rp389.000',
    material: 'Linen-rayon premium (adem, anti-transparan, jatuh anggun)',
    fit: 'Loose A-Line (Syari)',
    colors: ['Sage', 'Warm Grey'],
    occasions: 'Mengaji',
    sizes: {
      Sage: { S: 5, M: 6, L: 4, XL: 3 },
      'Warm Grey': { S: 4, M: 7, L: 5, XL: 2 },
    },
    measurements: 'S (LD 104 / P 138), M (LD 110 / P 140), L (LD 116 / P 142), XL (LD 122 / P 144)',
    care: 'Cuci tangan dengan deterjen lembut, jangan diperas kasar, jemur terbalik di tempat teduh.',
    style: 'Modest, syari, anggun natural',
    pairWith: 'Khimar Chiffon Talaka (KHM-017) atau inner ciput untuk tampilan lengkap.',
    proportionTip: 'Panjang maxi + siluet A-line memberikan kesan anggun dan menutupi bentuk tubuh secara merata.',
    honestNote: 'Linen murni bisa sedikit kusut setelah duduk lama—bawa kain pelapis atau setrika cepat sebelum berangkat.',
    url: '#katalog-produk',
  },
  {
    sku: 'KHM-017',
    name: 'Khimar Chiffon Talaka',
    category: 'Outer',
    badge: 'Modest Wear',
    image: '/images/khimar-chiffon.jpg',
    price: 149000,
    priceFormatted: 'Rp149.000',
    material: 'Chiffon georgette (ringan, tidak menerawang, jatuh natural)',
    fit: 'Loose Drape (Panjang 110 cm)',
    colors: ['Putih', 'Olive'],
    occasions: 'Mengaji',
    sizes: {
      Putih: { 'One Size': 12 },
      Olive: { 'One Size': 9 },
    },
    measurements: 'One Size — Lebar 150 cm, Panjang 110 cm (menutupi dada & punggung)',
    care: 'Cuci tangan perlahan, setrika suhu rendah-sedang tanpa uap berlebih.',
    style: 'Syari, modest, anggun',
    pairWith: 'Gamis Linen Modest Talaka (GMS-016) untuk set lengkap mengaji.',
    proportionTip: 'Jatuhnya chiffon menutupi bentuk bahu dan dada secara merata tanpa terasa berat di kepala.',
    honestNote: 'Bahan chiffon tipis; di dalam ruangan terang pastikan inner ciput hitam/gelap dipakai agar tidak menerawang.',
    url: '#katalog-produk',
  },
  {
    sku: 'RKU-018',
    name: 'Rok Kembang Muslimah Flowy',
    category: 'Bawahan',
    badge: 'Modest Wear',
    image: '/images/rok-kembang.jpg',
    price: 229000,
    priceFormatted: 'Rp229.000',
    material: 'Rayon twill (adem, tidak menerawang, flowy alami)',
    fit: 'High-Waist Maxi Flare',
    colors: ['Forest Green', 'Lavender'],
    occasions: 'Mengaji',
    sizes: {
      'Forest Green': { S: 4, M: 6, L: 3, XL: 2 },
      Lavender: { S: 5, M: 5, L: 4, XL: 3 },
    },
    measurements: 'S (LP 66 / P 108), M (LP 72 / P 110), L (LP 78 / P 112), XL (LP 84 / P 113)',
    care: 'Cuci lembut, jemur terbalik di tempat teduh agar warna tidak pudar.',
    style: 'Modest, feminin syari',
    pairWith: 'Kemeja Linen Talaka (KMJ-001) sebagai atasan atau Khimar Chiffon (KHM-017).',
    proportionTip: 'High-waist dengan maxi flare menutupi pinggul dan memberikan kesan tinggi jenjang.',
    honestNote: 'Rok flare maxi butuh alas kaki minimal 3 cm agar panjang rok tidak menyapu lantai untuk TB di bawah 158 cm.',
    url: '#katalog-produk',
  },

  // ============================================================
  // KOLEKSI BELAJAR — Comfort & Focus Home/Study Wear
  // ============================================================
  {
    sku: 'HDI-019',
    name: 'Hoodie Fleece Soft Talaka',
    category: 'Outer',
    badge: 'Study Mode',
    image: '/images/hoodie-fleece.jpg',
    price: 279000,
    priceFormatted: 'Rp279.000',
    material: 'Fleece cotton 320gsm (super lembut, tidak berbulu, hangat di ruang AC)',
    fit: 'Oversize Relaxed',
    colors: ['Lavender', 'Charcoal'],
    occasions: 'Belajar',
    sizes: {
      Lavender: { S: 5, M: 8, L: 6, XL: 4 },
      Charcoal: { S: 4, M: 9, L: 7, XL: 5 },
    },
    measurements: 'S (LD 110 / P 68), M (LD 116 / P 70), L (LD 122 / P 72), XL (LD 128 / P 74)',
    care: 'Cuci balik bagian dalam, suhu rendah, jangan dikeringkan dengan pengering mesin agar fleece tidak berbulu.',
    style: 'Cozy, minimalis casual',
    pairWith: 'Jogger Pants Comfort Talaka (JGR-020) untuk full study set yang nyaman.',
    proportionTip: 'Oversize fit nyaman untuk berjam-jam di meja belajar tanpa merasa terkekang.',
    honestNote: 'Fleece tidak ideal untuk cuaca luar yang panas; paling nyaman di ruang ber-AC atau suhu malam hari.',
    url: '#katalog-produk',
  },
  {
    sku: 'JGR-020',
    name: 'Jogger Pants Comfort Talaka',
    category: 'Bawahan',
    badge: 'Study Mode',
    image: '/images/jogger-comfort.jpg',
    price: 199000,
    priceFormatted: 'Rp199.000',
    material: 'French terry cotton (tebal-sedang, elastis, tidak panas)',
    fit: 'Tapered Relaxed (Elastik Pinggang)',
    colors: ['Hitam', 'Sand'],
    occasions: 'Belajar',
    sizes: {
      Hitam: { S: 7, M: 10, L: 8, XL: 5 },
      Sand: { S: 4, M: 6, L: 5, XL: 3 },
    },
    measurements: 'S (LP 60–74 / P 96), M (LP 66–80 / P 98), L (LP 72–86 / P 100), XL (LP 78–92 / P 101)',
    care: 'Cuci biasa, hindari deterjen pemutih agar warna tidak pudar.',
    style: 'Casual, comfy, lounge',
    pairWith: 'Hoodie Fleece Soft Talaka (HDI-019) atau Kaos Oversize Heavyweight (TSH-005).',
    proportionTip: 'Pinggang elastik nyaman untuk duduk lama. Tepi kaki tapered agar tidak terlihat terlalu formal.',
    honestNote: 'Meski nyaman untuk belajar/di rumah, model ini kurang cocok untuk tampil formal di luar rumah.',
    url: '#katalog-produk',
  },
  {
    sku: 'TSH-021',
    name: 'Kaos Grafis Study Vibes',
    category: 'Atasan',
    badge: 'Study Mode',
    image: '/images/kaos-study.jpg',
    price: 169000,
    priceFormatted: 'Rp169.000',
    material: 'Cotton combed 24s (lebih tipis dari heavyweight, adem untuk belajar lama)',
    fit: 'Regular Fit',
    colors: ['Sky Blue', 'Broken White'],
    occasions: 'Belajar',
    sizes: {
      'Sky Blue': { S: 6, M: 8, L: 5, XL: 3 },
      'Broken White': { S: 5, M: 7, L: 6, XL: 4 },
    },
    measurements: 'S (LD 100 / P 68), M (LD 106 / P 70), L (LD 112 / P 72), XL (LD 118 / P 74)',
    care: 'Cuci balik untuk menjaga sablon grafis, hindari setrika langsung di area print.',
    style: 'Casual, playful, chill',
    pairWith: 'Jogger Pants Comfort Talaka (JGR-020) untuk look belajar santai.',
    proportionTip: 'Regular fit cocok untuk berbagai postur; tidak terlalu ketat untuk duduk lama.',
    honestNote: 'Bahan 24s lebih tipis, cocok untuk iklim panas. Jika lebih suka yang tebal, cek Kaos Oversize Heavyweight (TSH-005).',
    url: '#katalog-produk',
  },

  // ============================================================
  // KOLEKSI KAMPUS — Smart Casual Campus Style
  // ============================================================
  {
    sku: 'PLO-022',
    name: 'Polo Shirt Pique Talaka',
    category: 'Atasan',
    badge: 'Campus Life',
    image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=700&q=80',
    price: 209000,
    priceFormatted: 'Rp209.000',
    material: 'Pique cotton 220gsm (tekstur kaos polo klasik, tidak mudah kusut)',
    fit: 'Regular Slim',
    colors: ['Navy', 'Sage'],
    occasions: 'Kampus',
    sizes: {
      Navy: { S: 6, M: 9, L: 7, XL: 4 },
      Sage: { S: 5, M: 7, L: 6, XL: 3 },
    },
    measurements: 'S (LD 98 / P 68), M (LD 104 / P 70), L (LD 110 / P 72), XL (LD 116 / P 74)',
    care: 'Cuci biasa, setrika suhu sedang, hindari pengering mesin bersuhu tinggi.',
    style: 'Smart casual, preppy, campus chic',
    pairWith: 'Chino Stretch Kampus Talaka (CHN-023) atau Celana Kulot High-Waist (CLN-002).',
    proportionTip: 'Kerah polo memberikan kesan rapi tanpa harus full formal—ideal untuk presentasi kampus.',
    honestNote: 'Tekstur pique menyerap keringat lebih baik dari kaos biasa, cocok untuk hari kuliah penuh aktivitas.',
    url: '#katalog-produk',
  },
  {
    sku: 'CHN-023',
    name: 'Chino Stretch Kampus Talaka',
    category: 'Bawahan',
    badge: 'Campus Life',
    image: '/images/CHN-023.jpg',
    price: 259000,
    priceFormatted: 'Rp259.000',
    material: 'Chino cotton-stretch 2% spandex (nyaman bergerak, anti-kusut ringan)',
    fit: 'Slim Chino',
    colors: ['Beige', 'Olive'],
    occasions: 'Kampus',
    sizes: {
      Beige: { S: 5, M: 7, L: 5, XL: 3 },
      Olive: { S: 4, M: 6, L: 5, XL: 2 },
    },
    measurements: 'S (LP 68 / P 97), M (LP 74 / P 99), L (LP 80 / P 101), XL (LP 86 / P 102)',
    care: 'Cuci biasa, setrika bagian dalam untuk hasil rapih, jemur di tempat teduh.',
    style: 'Smart casual, preppy, campus everyday',
    pairWith: 'Polo Shirt Pique Talaka (PLO-022) atau Kemeja Linen Talaka (KMJ-001).',
    proportionTip: 'Slim chino menonjolkan kaki tanpa terlalu melekat—cocok untuk kuliah seharian + hangout setelahnya.',
    honestNote: '2% spandex memberi stretch terbatas; bukan activewear. Kalau banyak gerakan fisik, utamakan jogger atau training pants.',
    url: '#katalog-produk',
  },
  {
    sku: 'BAG-024',
    name: 'Tote Canvas Kampus Talaka',
    category: 'Aksesoris',
    badge: 'Campus Life',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80',
    price: 129000,
    priceFormatted: 'Rp129.000',
    material: 'Canvas 12oz tebal (kuat, tahan cuci, tidak mudah sobek di sudut)',
    fit: 'One Size (Tas Tote)',
    colors: ['Hitam', 'Broken White'],
    occasions: 'Kampus',
    sizes: {
      Hitam: { 'One Size': 15 },
      'Broken White': { 'One Size': 10 },
    },
    measurements: 'L 42 cm × T 38 cm × D 12 cm, Handle panjang 60 cm (muat laptop 14")',
    care: 'Cuci tangan dengan sikat lembut, jemur terbalik di tempat teduh agar warna tidak kusam.',
    style: 'Minimalis kampus, everyday carry',
    pairWith: 'Polo Shirt Pique (PLO-022) + Chino Stretch Kampus (CHN-023) untuk full campus look.',
    proportionTip: 'Desain tote polos mudah dipadukan warna apapun tanpa clash.',
    honestNote: 'Canvas tanpa lapisan waterproof; sediakan cover bag atau masukkan barang bawaan ke dalam zip-lock saat hujan.',
    url: '#katalog-produk',
  },

  // ============================================================
  // 67 PRODUK BARU LENGKAP (TOTAL 90 PRODUK TALAKA)
  // ============================================================
  {
    "sku": "SNK-025",
    "name": "Talaka Aero Minimalist White",
    "category": "Sepatu",
    "badge": "Daily Favorite",
    "image": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=80",
    "price": 499000,
    "priceFormatted": "Rp499.000",
    "material": "Full grain vegan leather & cushioned memory foam insole",
    "fit": "True to Size (Unisex)",
    "colors": [
      "Putih",
      "Off-White"
    ],
    "occasions": "Kampus, Belajar, Kerja",
    "sizes": {
      "Putih": {
        "39": 5,
        "40": 8,
        "41": 6,
        "42": 4,
        "43": 2,
        "44": 1
      },
      "Off-White": {
        "39": 4,
        "40": 6,
        "41": 5,
        "42": 3,
        "43": 2,
        "44": 0
      }
    },
    "measurements": "EU 39 (24.5 cm), 40 (25 cm), 41 (26 cm), 42 (26.5 cm), 43 (27.5 cm), 44 (28 cm)",
    "care": "Lap kain microfiber lembap, hindari pembersih berbahan kimia keras.",
    "style": "Clean minimalist court sneaker",
    "pairWith": "Chino Stretch Kampus (CHN-023) atau Kemeja Linen Talaka (KMJ-001)",
    "proportionTip": "Siluet ramping mempertegas garis pergelangan kaki.",
    "honestNote": "Sol datar standar; jika butuh arch-support ekstra bisa tambahkan insole gel ortopedis.",
    "url": "#katalog-produk"
  },
  {
    "sku": "SNK-026",
    "name": "Talaka Slip-On Canvas Loafer",
    "category": "Sepatu",
    "badge": "Easy Wear",
    "image": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=80",
    "price": 379000,
    "priceFormatted": "Rp379.000",
    "material": "Heavy canvas 14oz & vulcanized rubber sole",
    "fit": "Regular Fit",
    "colors": [
      "Hitam",
      "Krem"
    ],
    "occasions": "Belajar, Kampus, Mengaji",
    "sizes": {
      "Hitam": {
        "39": 6,
        "40": 7,
        "41": 8,
        "42": 5,
        "43": 3,
        "44": 2
      },
      "Krem": {
        "39": 4,
        "40": 5,
        "41": 6,
        "42": 4,
        "43": 1,
        "44": 1
      }
    },
    "measurements": "EU 39 (24.5 cm), 40 (25 cm), 41 (26 cm), 42 (26.5 cm), 43 (27.5 cm), 44 (28 cm)",
    "care": "Cuci dengan sikat gigi halus & sabun deterjen cair, keringkan di tempat teduh.",
    "style": "Casual relaxed, slip-and-go",
    "pairWith": "Celana Kulot High-Waist (CLN-002) atau Jogger Pants (JGR-020)",
    "proportionTip": "Model slip-on tanpa tali praktis dilepas-pasang saat ke masjid atau ruang kelas.",
    "honestNote": "Kain canvas sedikit kaku pada 2–3 pemakaian pertama sebelum menyesuaikan bentuk kaki.",
    "url": "#katalog-produk"
  },
  {
    "sku": "SNK-027",
    "name": "Talaka City Trekker Olive",
    "category": "Sepatu",
    "badge": "Outdoor Ready",
    "image": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=700&q=80",
    "price": 589000,
    "priceFormatted": "Rp589.000",
    "material": "Cordura water-repellent panel & rugged lug outsole",
    "fit": "Chunky Trail",
    "colors": [
      "Olive",
      "Charcoal"
    ],
    "occasions": "Kampus, Jalan Santai",
    "sizes": {
      "Olive": {
        "39": 3,
        "40": 6,
        "41": 4,
        "42": 5,
        "43": 2,
        "44": 1
      },
      "Charcoal": {
        "39": 4,
        "40": 5,
        "41": 6,
        "42": 4,
        "43": 3,
        "44": 0
      }
    },
    "measurements": "EU 39 (24.5 cm), 40 (25 cm), 41 (26 cm), 42 (26.5 cm), 43 (27.5 cm), 44 (28 cm)",
    "care": "Sikat kotoran tanah kering, lap permukaan cordura dengan spons basah.",
    "style": "Gorpcore, urban outdoor streetwear",
    "pairWith": "Hoodie Fleece (HDI-019) + Jogger Pants (JGR-020)",
    "proportionTip": "Sol trail tebal 4 cm memberi bantalan ekstra saat berjalan kaki jauh.",
    "honestNote": "Grip karet tebal membuat sepatu terasa lebih berbobot dibanding running shoes biasa.",
    "url": "#katalog-produk"
  },
  {
    "sku": "SNK-028",
    "name": "Talaka Derby Leather Formal",
    "category": "Sepatu",
    "badge": "Office Classic",
    "image": "/images/SNK-028.jpg",
    "price": 649000,
    "priceFormatted": "Rp649.000",
    "material": "Semi-gloss polished microfibre leather & anti-slip rubber sole",
    "fit": "Formal Sleek",
    "colors": [
      "Hitam",
      "Espresso"
    ],
    "occasions": "Kerja",
    "sizes": {
      "Hitam": {
        "39": 4,
        "40": 6,
        "41": 7,
        "42": 5,
        "43": 3,
        "44": 2
      },
      "Espresso": {
        "39": 3,
        "40": 5,
        "41": 4,
        "42": 3,
        "43": 1,
        "44": 1
      }
    },
    "measurements": "EU 39 (24.5 cm), 40 (25 cm), 41 (26 cm), 42 (26.5 cm), 43 (27.5 cm), 44 (28 cm)",
    "care": "Semir berkala dengan wax transparan, simpan dengan shoe tree agar kulit tidak berkerut.",
    "style": "Classic British formal dress shoe",
    "pairWith": "Blazer Struktural (BLZ-012) + Celana Bahan Slim (CLN-011)",
    "proportionTip": "Bentuk moncong runcing lembut memberi ilusi postur lebih tegap dan rapi.",
    "honestNote": "Kulit sintetis polished butuh kaus kaki katun agar tidak gerah di pemakaian seharian.",
    "url": "#katalog-produk"
  },
  {
    "sku": "SNK-029",
    "name": "Talaka Sandal Slide Comfort EVA",
    "category": "Sepatu",
    "badge": "Summer Slide",
    "image": "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=700&q=80",
    "price": 189000,
    "priceFormatted": "Rp189.000",
    "material": "Molded lightweight EVA foam (tahan air & cepat kering)",
    "fit": "Wide Comfort",
    "colors": [
      "Sand",
      "Hitam"
    ],
    "occasions": "Belajar, Santai, Mengaji",
    "sizes": {
      "Sand": {
        "39": 8,
        "40": 10,
        "41": 9,
        "42": 7,
        "43": 5,
        "44": 3
      },
      "Hitam": {
        "39": 7,
        "40": 9,
        "41": 8,
        "42": 6,
        "43": 4,
        "44": 2
      }
    },
    "measurements": "EU 39 (24.5 cm), 40 (25 cm), 41 (26 cm), 42 (26.5 cm), 43 (27.5 cm), 44 (28 cm)",
    "care": "Cuci dengan air mengalir dan sabun cair, langsung lap kering.",
    "style": "Modern recovery slide, casual home",
    "pairWith": "Kaos Grafis Study Vibes (TSH-021) + Jogger Pants (JGR-020)",
    "proportionTip": "Bantalan kaki melengkung mengikuti anatomi telapak kaki untuk mengurangi lelah.",
    "honestNote": "Kurang formal untuk acara kerja atau presentasi kampus.",
    "url": "#katalog-produk"
  },
  {
    "sku": "SNK-030",
    "name": "Talaka Platform Chunky Derby",
    "category": "Sepatu",
    "badge": "Edgy Look",
    "image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=80",
    "price": 579000,
    "priceFormatted": "Rp579.000",
    "material": "Polished vegan leather with 5cm platform commando sole",
    "fit": "Bold Platform",
    "colors": [
      "Hitam"
    ],
    "occasions": "Clubbing, Kampus",
    "sizes": {
      "Hitam": {
        "39": 5,
        "40": 6,
        "41": 5,
        "42": 4,
        "43": 2,
        "44": 1
      }
    },
    "measurements": "EU 39 (24.5 cm), 40 (25 cm), 41 (26 cm), 42 (26.5 cm), 43 (27.5 cm), 44 (28 cm)",
    "care": "Lap bersih dengan kain lembap, hindari gesekan tajam pada sol platform.",
    "style": "Goth chic, Harajuku streetwear, edgy smart",
    "pairWith": "Mini Pleated Skirt (SKR-014) atau Jaket Kulit Faux (JKT-015)",
    "proportionTip": "Sol 5 cm menambah tinggi badan secara instan tanpa membuat tumit pegal.",
    "honestNote": "Sol platform tebal membutuhkan sedikit adaptasi saat menaiki tangga.",
    "url": "#katalog-produk"
  },
  {
    "sku": "SNK-031",
    "name": "Talaka Slip-On Mule Leather",
    "category": "Sepatu",
    "badge": "Effortless Chic",
    "image": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=700&q=80",
    "price": 469000,
    "priceFormatted": "Rp469.000",
    "material": "Soft synthetic nappa leather & flexible rubber base",
    "fit": "Slim Backless",
    "colors": [
      "Mocca",
      "Krem"
    ],
    "occasions": "Kerja, Hangout, Mengaji",
    "sizes": {
      "Mocca": {
        "39": 4,
        "40": 6,
        "41": 5,
        "42": 3,
        "43": 2,
        "44": 1
      },
      "Krem": {
        "39": 3,
        "40": 5,
        "41": 4,
        "42": 2,
        "43": 1,
        "44": 0
      }
    },
    "measurements": "EU 39 (24.5 cm), 40 (25 cm), 41 (26 cm), 42 (26.5 cm), 43 (27.5 cm), 44 (28 cm)",
    "care": "Lap kain lembut, simpan di tempat kering dan bersirkulasi baik.",
    "style": "Modern Parisian chic, minimalist mule",
    "pairWith": "Celana Kulot High-Waist (CLN-002) atau Midi Dress Flowy (DRS-004)",
    "proportionTip": "Desain backless terbuka di tumit memberi kesan pergelangan kaki lebih ramping.",
    "honestNote": "Bukan untuk aktivitas berjalan cepat atau medan jalan berbatu.",
    "url": "#katalog-produk"
  },
  {
    "sku": "KMJ-032",
    "name": "Kemeja Flannel Tartan Cozy",
    "category": "Atasan",
    "badge": "Layering Core",
    "image": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80",
    "price": 269000,
    "priceFormatted": "Rp269.000",
    "material": "100% Cotton brushed flannel (hangat, lembut, tidak berbulu)",
    "fit": "Relaxed Fit",
    "colors": [
      "Forest Green",
      "Navy"
    ],
    "occasions": "Kampus, Belajar",
    "sizes": {
      "Forest Green": {
        "S": 5,
        "M": 7,
        "L": 6,
        "XL": 3
      },
      "Navy": {
        "S": 4,
        "M": 8,
        "L": 5,
        "XL": 2
      }
    },
    "measurements": "S (LD 102 / P 70), M (LD 108 / P 72), L (LD 114 / P 74), XL (LD 120 / P 76)",
    "care": "Cuci air dingin, jangan disikat kasar pada permukaan flanel.",
    "style": "Grunge 90s, lumberjack casual",
    "pairWith": "Kaos Oversize (TSH-005) + Celana Bahan Slim (CLN-011)",
    "proportionTip": "Bisa dipakai berkancing rapi atau dibuka sebagai outer santai.",
    "honestNote": "Bahan agak tebal, paling pas di ruangan ber-AC.",
    "url": "#katalog-produk"
  },
  {
    "sku": "KMJ-033",
    "name": "Kemeja Kerah Shanghai Linen",
    "category": "Atasan",
    "badge": "Clean Eastern",
    "image": "/images/KMJ-033.jpg",
    "price": 259000,
    "priceFormatted": "Rp259.000",
    "material": "Linen blend breathable",
    "fit": "Regular Fit",
    "colors": [
      "Putih",
      "Warm Grey"
    ],
    "occasions": "Mengaji, Kerja",
    "sizes": {
      "Putih": {
        "S": 6,
        "M": 9,
        "L": 7,
        "XL": 4
      },
      "Warm Grey": {
        "S": 4,
        "M": 6,
        "L": 5,
        "XL": 2
      }
    },
    "measurements": "S (LD 98 / P 68), M (LD 104 / P 70), L (LD 110 / P 72), XL (LD 116 / P 74)",
    "care": "Cuci lembut, setrika suhu sedang saat agak lembap.",
    "style": "Minimalis kerah shanghai, rapi bersahaja",
    "pairWith": "Celana Kulot High-Waist (CLN-002) atau Chino Stretch (CHN-023)",
    "proportionTip": "Kerah tegak memberi ilusi leher lebih jenjang tanpa perlu dasi.",
    "honestNote": "Karakter serat linen bertekstur alami khas bahan organik.",
    "url": "#katalog-produk"
  },
  {
    "sku": "TSH-034",
    "name": "Kaos Turtleneck Ribbed Stretch",
    "category": "Atasan",
    "badge": "Smart Layer",
    "image": "/images/TSH-034.jpg",
    "price": 189000,
    "priceFormatted": "Rp189.000",
    "material": "Cotton rib 2x2 elastis & adem",
    "fit": "Fitted Turtle",
    "colors": [
      "Hitam",
      "Charcoal"
    ],
    "occasions": "Kerja, Clubbing",
    "sizes": {
      "Hitam": {
        "S": 6,
        "M": 8,
        "L": 7,
        "XL": 3
      },
      "Charcoal": {
        "S": 4,
        "M": 6,
        "L": 5,
        "XL": 2
      }
    },
    "measurements": "S (LD 84–92 / P 62), M (LD 90–98 / P 64), L (LD 96–104 / P 66), XL (LD 102–110 / P 68)",
    "care": "Cuci tangan atau laundry net, jangan digantung saat basah.",
    "style": "Steve Jobs minimal, chic intellectual",
    "pairWith": "Blazer Struktural (BLZ-012) + Celana Bahan Slim (CLN-011)",
    "proportionTip": "Potongan leher tinggi sangat elegan bila dipadukan dengan outerwear berkerah notch.",
    "honestNote": "Karakter fitted pas badan; jika ingin longgar disarankan naik 1 ukuran.",
    "url": "#katalog-produk"
  },
  {
    "sku": "BLS-035",
    "name": "Blouse Silk Puff Sleeve",
    "category": "Atasan",
    "badge": "Feminine Core",
    "image": "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=700&q=80",
    "price": 279000,
    "priceFormatted": "Rp279.000",
    "material": "Silk crepe de chine lembut tidak menerawang",
    "fit": "Regular Feminine",
    "colors": [
      "Dusty Rose",
      "Broken White"
    ],
    "occasions": "Kerja, Acara Keluarga",
    "sizes": {
      "Dusty Rose": {
        "S": 5,
        "M": 7,
        "L": 4,
        "XL": 2
      },
      "Broken White": {
        "S": 6,
        "M": 6,
        "L": 5,
        "XL": 3
      }
    },
    "measurements": "S (LD 94 / P 62), M (LD 100 / P 64), L (LD 106 / P 66), XL (LD 112 / P 68)",
    "care": "Cuci tangan suhu rendah, setrika uap suhu lembut.",
    "style": "Romantic Korean style, sweet professional",
    "pairWith": "Celana Kulot High-Waist (CLN-002) atau Rok Kembang (RKU-018)",
    "proportionTip": "Detail puff sleeve di bahu menyeimbangkan proporsi tubuh berpinggul lebar.",
    "honestNote": "Bahan silk sintetis halus, hindari terkena benda tajam atau peniti kasar.",
    "url": "#katalog-produk"
  },
  {
    "sku": "TSH-036",
    "name": "Kaos Polos Boxy Heavyweight Putih",
    "category": "Atasan",
    "badge": "Essential",
    "image": "/images/tsh-036.jpg",
    "price": 169000,
    "priceFormatted": "Rp169.000",
    "material": "100% Combed 16s Super Heavyweight (tebal 240gsm)",
    "fit": "Boxy Drop Shoulder",
    "colors": [
      "Putih"
    ],
    "occasions": "Kampus, Belajar, Harian",
    "sizes": {
      "Putih": {
        "S": 10,
        "M": 12,
        "L": 10,
        "XL": 6
      }
    },
    "measurements": "S (LD 108 / P 66), M (LD 114 / P 68), L (LD 120 / P 70), XL (LD 126 / P 72)",
    "care": "Cuci biasa, jemur terbalik, setrika suhu sedang.",
    "style": "Modern streetwear boxy cut",
    "pairWith": "Chino Stretch (CHN-023) atau Jogger Pants (JGR-020)",
    "proportionTip": "Potongan boxy lebih pendek dari oversize biasa, tidak membuat kaki tenggelam.",
    "honestNote": "Bahan sangat tebal dan berbobot; paling optimal untuk cuaca sedang atau ber-AC.",
    "url": "#katalog-produk"
  },
  {
    "sku": "KMJ-037",
    "name": "Kemeja Rayon Floral Vintage",
    "category": "Atasan",
    "badge": "Weekend Vibe",
    "image": "/images/KMJ-037.jpg",
    "price": 239000,
    "priceFormatted": "Rp239.000",
    "material": "Rayon viscose ultra soft & flowy",
    "fit": "Camp Collar Relaxed",
    "colors": [
      "Terracotta",
      "Sage"
    ],
    "occasions": "Hangout, Santai",
    "sizes": {
      "Terracotta": {
        "S": 4,
        "M": 7,
        "L": 5,
        "XL": 2
      },
      "Sage": {
        "S": 5,
        "M": 6,
        "L": 4,
        "XL": 3
      }
    },
    "measurements": "S (LD 104 / P 68), M (LD 110 / P 70), L (LD 116 / P 72), XL (LD 122 / P 74)",
    "care": "Cuci lembut dengan deterjen cair, jangan gunakan mesin pengering bersuhu tinggi.",
    "style": "Cuban camp collar, vintage resort",
    "pairWith": "Celana Kulot High-Waist (CLN-002) warna Krem",
    "proportionTip": "Kerah camp collar terbuka memberi kesan santai dan leher lebih lapang.",
    "honestNote": "Bahan rayon mudah berkerut saat duduk, setrika sebelum dipakai.",
    "url": "#katalog-produk"
  },
  {
    "sku": "TOP-038",
    "name": "Crop Tank Top Seamless Knit",
    "category": "Atasan",
    "badge": "Base Layer",
    "image": "/images/TOP-038.jpg",
    "price": 139000,
    "priceFormatted": "Rp139.000",
    "material": "Nylon spandex seamless elastis tinggi",
    "fit": "Fitted Crop",
    "colors": [
      "Hitam",
      "Beige"
    ],
    "occasions": "Clubbing, Harian",
    "sizes": {
      "Hitam": {
        "S": 7,
        "M": 9,
        "L": 6,
        "XL": 3
      },
      "Beige": {
        "S": 6,
        "M": 8,
        "L": 5,
        "XL": 2
      }
    },
    "measurements": "S (LD 76–86 / P 38), M (LD 82–92 / P 40), L (LD 88–98 / P 42), XL (LD 94–104 / P 44)",
    "care": "Cuci tangan suhu biasa, jemur datar.",
    "style": "Athleisure minimal, versatile inner",
    "pairWith": "Outer Boxy Knit Cardigan (OUT-003) atau Jaket Kulit (JKT-015)",
    "proportionTip": "Crop top berpadu sempurna dengan celana atau rok high-waist.",
    "honestNote": "Model crop berakhir di atas pusar.",
    "url": "#katalog-produk"
  },
  {
    "sku": "PLO-039",
    "name": "Knit Polo Shirt Vintage Collar",
    "category": "Atasan",
    "badge": "Retro Smart",
    "image": "/images/PLO-039.jpg",
    "price": 299000,
    "priceFormatted": "Rp299.000",
    "material": "Fine cotton knitwear (berpori, tidak panas)",
    "fit": "Classic Tailored",
    "colors": [
      "Mocca",
      "Navy"
    ],
    "occasions": "Kerja, Kampus",
    "sizes": {
      "Mocca": {
        "S": 4,
        "M": 7,
        "L": 5,
        "XL": 2
      },
      "Navy": {
        "S": 5,
        "M": 6,
        "L": 4,
        "XL": 3
      }
    },
    "measurements": "S (LD 98 / P 66), M (LD 104 / P 68), L (LD 110 / P 70), XL (LD 116 / P 72)",
    "care": "Simpan terlipat, jangan digantung agar tidak melar.",
    "style": "Old-money aesthetic, retro smart casual",
    "pairWith": "Celana Bahan Slim (CLN-011) atau Chino Stretch (CHN-023)",
    "proportionTip": "Tekstur rajut halus memberikan kesan mewah tanpa perlu banyak aksesoris.",
    "honestNote": "Gunakan deterjen tanpa pemutih agar serat rajut tetap empuk.",
    "url": "#katalog-produk"
  },
  {
    "sku": "BLS-040",
    "name": "Tunik Minimalis Asimetris",
    "category": "Atasan",
    "badge": "Modest Modern",
    "image": "/images/BLS-040.png",
    "price": 289000,
    "priceFormatted": "Rp289.000",
    "material": "Katun toyobo fodu (dingin, sedikit kilau mewah, jatuh rapi)",
    "fit": "Loose Tunic",
    "colors": [
      "Lavender",
      "Broken White"
    ],
    "occasions": "Mengaji, Kerja",
    "sizes": {
      "Lavender": {
        "S": 5,
        "M": 7,
        "L": 6,
        "XL": 3
      },
      "Broken White": {
        "S": 4,
        "M": 8,
        "L": 5,
        "XL": 2
      }
    },
    "measurements": "S (LD 98 / P 90), M (LD 104 / P 92), L (LD 110 / P 94), XL (LD 116 / P 96)",
    "care": "Cuci biasa, setrika suhu sedang.",
    "style": "Modest chic, clean architectural drape",
    "pairWith": "Celana Kulot High-Waist (CLN-002) warna Hitam",
    "proportionTip": "Panjang tunik menutupi pinggul dan paha dengan potongan hem asimetris yang dinamis.",
    "honestNote": "Bahan katun toyobo non-stretch; pastikan ukuran lingkar dada mencukupi.",
    "url": "#katalog-produk"
  },
  {
    "sku": "TSH-041",
    "name": "Kaos Striped Parisian Sailor",
    "category": "Atasan",
    "badge": "Timeless Style",
    "image": "/images/TSH-041.jpg",
    "price": 179000,
    "priceFormatted": "Rp179.000",
    "material": "100% Cotton combed 20s motif garis tenun benang",
    "fit": "Regular Fit",
    "colors": [
      "Navy",
      "Hitam"
    ],
    "occasions": "Kampus, Belajar",
    "sizes": {
      "Navy": {
        "S": 6,
        "M": 8,
        "L": 6,
        "XL": 3
      },
      "Hitam": {
        "S": 5,
        "M": 7,
        "L": 5,
        "XL": 2
      }
    },
    "measurements": "S (LD 98 / P 68), M (LD 104 / P 70), L (LD 110 / P 72), XL (LD 116 / P 74)",
    "care": "Cuci dengan warna senada agar garis putih tetap bersih cemerlang.",
    "style": "French marinière, nautical casual",
    "pairWith": "Chino Stretch (CHN-023) warna Beige + Talaka Cloud Sneaker (SNK-007)",
    "proportionTip": "Motif garis horizontal klasik memberi kesan dada lebih berisi dan proporsional.",
    "honestNote": "Garis tenun benang (yarn dyed), tidak akan luntur atau mengelupas.",
    "url": "#katalog-produk"
  },
  {
    "sku": "KMJ-042",
    "name": "Kemeja Corduroy Overshirt",
    "category": "Atasan",
    "badge": "Autumn Texture",
    "image": "/images/KMJ-042.jpg",
    "price": 329000,
    "priceFormatted": "Rp329.000",
    "material": "Baby corduroy 16 whale (tekstur beludru halus)",
    "fit": "Oversize Fit",
    "colors": [
      "Sand",
      "Olive"
    ],
    "occasions": "Kampus, Jalan Santai",
    "sizes": {
      "Sand": {
        "S": 4,
        "M": 6,
        "L": 5,
        "XL": 2
      },
      "Olive": {
        "S": 5,
        "M": 5,
        "L": 4,
        "XL": 2
      }
    },
    "measurements": "S (LD 110 / P 72), M (LD 116 / P 74), L (LD 122 / P 76), XL (LD 128 / P 78)",
    "care": "Cuci mesin putaran lembut, jemur terbalik.",
    "style": "Vintage workwear, casual textured",
    "pairWith": "Kaos Heavyweight Putih (TSH-036) + Chino Kampus (CHN-023)",
    "proportionTip": "Bahan bertekstur corduroy menambah kedalaman visual pada outfit sederhana.",
    "honestNote": "Cukup hangat, ideal sebagai jaket ringan saat malam hari atau ruang ber-AC.",
    "url": "#katalog-produk"
  },
  {
    "sku": "TOP-043",
    "name": "Top Halter Neck Knit Minimal",
    "category": "Atasan",
    "badge": "Night Out",
    "image": "/images/TOP-043.jpg",
    "price": 189000,
    "priceFormatted": "Rp189.000",
    "material": "Fine ribbed knit stretch",
    "fit": "Fitted Halter",
    "colors": [
      "Midnight Black",
      "Deep Purple"
    ],
    "occasions": "Clubbing, Hangout",
    "sizes": {
      "Midnight Black": {
        "S": 5,
        "M": 7,
        "L": 4,
        "XL": 2
      },
      "Deep Purple": {
        "S": 4,
        "M": 5,
        "L": 3,
        "XL": 1
      }
    },
    "measurements": "S (LD 78–88 / P 46), M (LD 84–94 / P 48), L (LD 90–100 / P 50), XL (LD 96–106 / P 52)",
    "care": "Cuci tangan lembut, keringkan rata di atas handuk.",
    "style": "Modern Y2K glam, halter chic",
    "pairWith": "Mini Pleated Skirt (SKR-014) + Jaket Kulit (JKT-015)",
    "proportionTip": "Potongan halter leher terbuka menonjolkan keindahan tulang selangka dan bahu.",
    "honestNote": "Memerlukan strapless bra untuk tampilan tanpa tali pengait yang terlihat.",
    "url": "#katalog-produk"
  },
  {
    "sku": "KMJ-044",
    "name": "Kemeja Kerah Cuban Monokrom",
    "category": "Atasan",
    "badge": "Smart Minimal",
    "image": "/images/KMJ-044.jpg",
    "price": 249000,
    "priceFormatted": "Rp249.000",
    "material": "Poly-cotton blend anti-kusut",
    "fit": "Regular Relaxed",
    "colors": [
      "Hitam",
      "Putih"
    ],
    "occasions": "Kerja, Hangout",
    "sizes": {
      "Hitam": {
        "S": 6,
        "M": 8,
        "L": 6,
        "XL": 3
      },
      "Putih": {
        "S": 5,
        "M": 7,
        "L": 5,
        "XL": 2
      }
    },
    "measurements": "S (LD 102 / P 68), M (LD 108 / P 70), L (LD 114 / P 72), XL (LD 120 / P 74)",
    "care": "Cuci biasa, setrika suhu sedang.",
    "style": "Monochrome smart streetwear",
    "pairWith": "Celana Bahan Slim (CLN-011) Charcoal",
    "proportionTip": "Siluet bersih monokrom cocok untuk smart casual di kantor rintisan.",
    "honestNote": "Kerah cuban berpotongan rebah, tidak didesain untuk memakai dasi formal.",
    "url": "#katalog-produk"
  },
  {
    "sku": "TSH-045",
    "name": "Long Sleeve Waffle Knit Thermal",
    "category": "Atasan",
    "badge": "Cozy Texture",
    "image": "/images/TSH-045.jpg",
    "price": 219000,
    "priceFormatted": "Rp219.000",
    "material": "Cotton waffle knit tekstur sarang lebah",
    "fit": "Regular Fit",
    "colors": [
      "Krem",
      "Charcoal"
    ],
    "occasions": "Belajar, Santai",
    "sizes": {
      "Krem": {
        "S": 5,
        "M": 7,
        "L": 6,
        "XL": 3
      },
      "Charcoal": {
        "S": 4,
        "M": 6,
        "L": 5,
        "XL": 2
      }
    },
    "measurements": "S (LD 100 / P 68), M (LD 106 / P 70), L (LD 112 / P 72), XL (LD 118 / P 74)",
    "care": "Cuci balik, jemur datar.",
    "style": "Thermal lounge, Scandinavian minimal",
    "pairWith": "Jogger Pants Comfort (JGR-020) Sand",
    "proportionTip": "Tekstur waffle berongga menjaga suhu tubuh tetap nyaman dan adem.",
    "honestNote": "Ujung lengan berserut lembut elastis, mudah dinaikkan ke lengan bawah.",
    "url": "#katalog-produk"
  },
  {
    "sku": "CLN-046",
    "name": "Celana Cargo Wide-Leg Street",
    "category": "Bawahan",
    "badge": "Street Essential",
    "image": "/images/CLN-046.jpg",
    "price": 339000,
    "priceFormatted": "Rp339.000",
    "material": "Twill katun ripstop kokoh & tidak mudah sobek",
    "fit": "Wide Cargo Relaxed",
    "colors": [
      "Olive",
      "Hitam"
    ],
    "occasions": "Kampus, Jalan Santai",
    "sizes": {
      "Olive": {
        "S": 4,
        "M": 7,
        "L": 6,
        "XL": 3
      },
      "Hitam": {
        "S": 5,
        "M": 6,
        "L": 5,
        "XL": 2
      }
    },
    "measurements": "S (LP 72 / P 100), M (LP 78 / P 102), L (LP 84 / P 104), XL (LP 90 / P 105)",
    "care": "Cuci biasa dengan air dingin, setrika bagian dalam.",
    "style": "Utilitarian, techwear casual, skater boy/girl",
    "pairWith": "Kaos Oversize Heavyweight (TSH-005) + Talaka Aurora Mocca (SNK-006)",
    "proportionTip": "Saku samping 3D memberi aksen tegas pada kaki tanpa terkesan penuh.",
    "honestNote": "Kain ripstop bertekstur kuat dan sedikit kaku di awal sebelum dicuci 2 kali.",
    "url": "#katalog-produk"
  },
  {
    "sku": "CLN-047",
    "name": "Celana Linen Ankle Pant Talaka",
    "category": "Bawahan",
    "badge": "Breezy Fit",
    "image": "/images/CLN-047.jpg",
    "price": 289000,
    "priceFormatted": "Rp289.000",
    "material": "Linen rayon blend adem jatuh",
    "fit": "Tapered Ankle (Karet Pinggang Belakang)",
    "colors": [
      "Beige",
      "Hitam"
    ],
    "occasions": "Kerja Santai, Kampus, Mengaji",
    "sizes": {
      "Beige": {
        "S": 5,
        "M": 8,
        "L": 6,
        "XL": 3
      },
      "Hitam": {
        "S": 4,
        "M": 7,
        "L": 5,
        "XL": 2
      }
    },
    "measurements": "S (LP 66–76 / P 92), M (LP 72–82 / P 94), L (LP 78–88 / P 96), XL (LP 84–94 / P 97)",
    "care": "Cuci lembut, jemur terbalik di tempat teduh.",
    "style": "Resort smart casual, minimalist traveler",
    "pairWith": "Kemeja Linen Talaka (KMJ-001) atau Kemeja Oxford (KMJ-010)",
    "proportionTip": "Potongan ankle memperlihatkan mata kaki, memberi ilusi badan lebih tinggi.",
    "honestNote": "Panjang 92–94 cm pas untuk TB 155–172 cm tanpa perlu dipotong.",
    "url": "#katalog-produk"
  },
  {
    "sku": "SKR-048",
    "name": "Rok Denim A-Line Midi Vintage",
    "category": "Bawahan",
    "badge": "Retro Denim",
    "image": "/images/SKR-048.jpg",
    "price": 299000,
    "priceFormatted": "Rp299.000",
    "material": "Denim non-stretch 12oz washed",
    "fit": "High-Waist A-Line Midi",
    "colors": [
      "Steel Blue",
      "Hitam"
    ],
    "occasions": "Kampus, Hangout",
    "sizes": {
      "Steel Blue": {
        "S": 4,
        "M": 6,
        "L": 5,
        "XL": 2
      },
      "Hitam": {
        "S": 5,
        "M": 7,
        "L": 4,
        "XL": 2
      }
    },
    "measurements": "S (LP 66 / P 80), M (LP 72 / P 82), L (LP 78 / P 84), XL (LP 84 / P 85)",
    "care": "Cuci balik terpisah untuk pencucian awal agar warna denim terjaga.",
    "style": "90s classic denim skirt",
    "pairWith": "Polo Shirt Pique (PLO-022) atau Kaos Oversize (TSH-005)",
    "proportionTip": "Belahan slit kecil di bagian depan mempermudah langkah saat berjalan aktif.",
    "honestNote": "Denim tebal 12oz, tidak elastis; pastikan ukuran lingkar pinggang pas.",
    "url": "#katalog-produk"
  },
  {
    "sku": "CLN-049",
    "name": "Celana Palazzo Pleated Flowy",
    "category": "Bawahan",
    "badge": "Elegant Flow",
    "image": "/images/CLN-049.jpg",
    "price": 329000,
    "priceFormatted": "Rp329.000",
    "material": "Crepe georgette premium dengan furing lembut anti-terawang",
    "fit": "High-Waist Extra Wide",
    "colors": [
      "Terracotta",
      "Warm Grey"
    ],
    "occasions": "Kerja, Acara Semi-Formal",
    "sizes": {
      "Terracotta": {
        "S": 4,
        "M": 6,
        "L": 4,
        "XL": 2
      },
      "Warm Grey": {
        "S": 5,
        "M": 7,
        "L": 5,
        "XL": 3
      }
    },
    "measurements": "S (LP 66 / P 102), M (LP 72 / P 104), L (LP 78 / P 106), XL (LP 84 / P 107)",
    "care": "Cuci dengan laundry net, setrika suhu sedang.",
    "style": "High-fashion minimalist, power palazzo",
    "pairWith": "Satin Corset Top (TOP-013) atau Blazer Struktural (BLZ-012)",
    "proportionTip": "Lipit depan dan potongan ekstra lebar memberi siluet seperti rok namun dengan kenyamanan celana.",
    "honestNote": "Sangat flowy dan panjang; cocok dipadukan heels atau sneaker chunky 4–5 cm.",
    "url": "#katalog-produk"
  },
  {
    "sku": "CLN-050",
    "name": "Celana Jeans Straight Raw Hem",
    "category": "Bawahan",
    "badge": "Daily Denim",
    "image": "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80",
    "price": 349000,
    "priceFormatted": "Rp349.000",
    "material": "Denim cotton 13oz dengan 1% stretch",
    "fit": "High-Rise Straight Leg",
    "colors": [
      "Navy",
      "Charcoal"
    ],
    "occasions": "Kampus, Hangout, Belajar",
    "sizes": {
      "Navy": {
        "S": 5,
        "M": 8,
        "L": 6,
        "XL": 3
      },
      "Charcoal": {
        "S": 4,
        "M": 7,
        "L": 5,
        "XL": 2
      }
    },
    "measurements": "S (LP 68 / P 98), M (LP 74 / P 100), L (LP 80 / P 102), XL (LP 86 / P 103)",
    "care": "Cuci dengan air dingin, jangan diperas dengan mesin pengering putaran kencang.",
    "style": "Timeless straight leg jeans",
    "pairWith": "Kaos Striped Parisian (TSH-041) + Talaka Cloud Sneaker (SNK-007)",
    "proportionTip": "Garis lurus dari pinggul ke bawah membuat kaki terlihat lebih jenjang dan seimbang.",
    "honestNote": "Kain denim tebal dan awet bertahun-tahun.",
    "url": "#katalog-produk"
  },
  {
    "sku": "SKR-051",
    "name": "Rok Span Plisket Modest",
    "category": "Bawahan",
    "badge": "Work & Formal",
    "image": "/images/SKR-051.jpg",
    "price": 249000,
    "priceFormatted": "Rp249.000",
    "material": "Polyester knitted plisket tebal elastis",
    "fit": "Column Straight (All Size)",
    "colors": [
      "Hitam",
      "Mocca"
    ],
    "occasions": "Kerja, Mengaji",
    "sizes": {
      "Hitam": {
        "One Size": 12
      },
      "Mocca": {
        "One Size": 10
      }
    },
    "measurements": "One Size — LP 64–100 cm (karet elastik penuh), Panjang 95 cm",
    "care": "Cuci tangan perlahan, jangan disetrika langsung agar lipitan plisket tetap awet.",
    "style": "Modest professional, elegant column",
    "pairWith": "Kemeja Oxford Slim (KMJ-010) atau Tunik Asimetris (BLS-040)",
    "proportionTip": "Lipit vertikal memberi efek visual merampingkan pinggul dan kaki.",
    "honestNote": "Bahan plisket rajut lentur memeluk bentuk tubuh; padukan dengan atasan panjang atau tunik.",
    "url": "#katalog-produk"
  },
  {
    "sku": "CLN-052",
    "name": "Shorts Bermuda Tailored Pleat",
    "category": "Bawahan",
    "badge": "Chic Summer",
    "image": "/images/CLN-052.jpg",
    "price": 219000,
    "priceFormatted": "Rp219.000",
    "material": "Suiting poly-viscose halus rapi",
    "fit": "High-Waist Knee Length",
    "colors": [
      "Beige",
      "Charcoal"
    ],
    "occasions": "Hangout, Santai",
    "sizes": {
      "Beige": {
        "S": 5,
        "M": 7,
        "L": 4,
        "XL": 2
      },
      "Charcoal": {
        "S": 4,
        "M": 6,
        "L": 5,
        "XL": 2
      }
    },
    "measurements": "S (LP 66 / P 52), M (LP 72 / P 54), L (LP 78 / P 56), XL (LP 84 / P 57)",
    "care": "Cuci biasa, setrika suhu sedang.",
    "style": "Resort tailoring, high fashion city shorts",
    "pairWith": "Blazer Struktural (BLZ-012) untuk setelan blazer-shorts yang trendy",
    "proportionTip": "Panjang tepat di atas lutut menjaga kesan sopan dan modern.",
    "honestNote": "Bukan celana olahraga pendek; potongan formal bersaku rapi.",
    "url": "#katalog-produk"
  },
  {
    "sku": "CLN-053",
    "name": "Celana Knit Wide Pants Comfy",
    "category": "Bawahan",
    "badge": "All-Day Comfy",
    "image": "/images/CLN-053.avif",
    "price": 269000,
    "priceFormatted": "Rp269.000",
    "material": "Soft ribbed cotton knit tebal tidak menerawang",
    "fit": "Straight Wide Elastic",
    "colors": [
      "Sand",
      "Sage"
    ],
    "occasions": "Belajar, Santai",
    "sizes": {
      "Sand": {
        "S": 6,
        "M": 8,
        "L": 6,
        "XL": 3
      },
      "Sage": {
        "S": 5,
        "M": 7,
        "L": 5,
        "XL": 2
      }
    },
    "measurements": "S (LP 64–78 / P 98), M (LP 70–84 / P 100), L (LP 76–90 / P 102), XL (LP 82–96 / P 103)",
    "care": "Cuci mesin mode lembut, jemur mendatar di tempat teduh.",
    "style": "Scandinavian lounge, effortless aesthetic",
    "pairWith": "Hoodie Fleece (HDI-019) atau Kaos Boxy Putih (TSH-036)",
    "proportionTip": "Jatuh kain rajut sangat rileks dan tidak kaku di paha.",
    "honestNote": "Bahan rajut lentur; simpan terlipat di lemari.",
    "url": "#katalog-produk"
  },
  {
    "sku": "CLN-054",
    "name": "Celana Jogger Tech Tactical",
    "category": "Bawahan",
    "badge": "Urban Tech",
    "image": "/images/CLN-054.jpg",
    "price": 319000,
    "priceFormatted": "Rp319.000",
    "material": "Matte nylon stretch water-resistant",
    "fit": "Tapered Ankle Zip",
    "colors": [
      "Midnight Black"
    ],
    "occasions": "Kampus, Night Out",
    "sizes": {
      "Midnight Black": {
        "S": 5,
        "M": 8,
        "L": 7,
        "XL": 4
      }
    },
    "measurements": "S (LP 68–80 / P 96), M (LP 74–86 / P 98), L (LP 80–92 / P 100), XL (LP 86–98 / P 101)",
    "care": "Lap bersih atau cuci air dingin, jangan gunakan pelembut pakaian kimiawi.",
    "style": "Cyberpunk casual, techwear minimalist",
    "pairWith": "Jaket Kulit (JKT-015) + Talaka City Trekker (SNK-027)",
    "proportionTip": "Ritsleting pergelangan kaki memungkinkan setelan fit disesuaikan dengan sepatu bot maupun sneaker.",
    "honestNote": "Bahan nilon matte sedikit bergemerisik saat berjalan cepat.",
    "url": "#katalog-produk"
  },
  {
    "sku": "OUT-055",
    "name": "Trench Coat Minimalist Belted",
    "category": "Outer",
    "badge": "Statement Piece",
    "image": "/images/OUT-055.jpg",
    "price": 689000,
    "priceFormatted": "Rp689.000",
    "material": "Cotton-gabardine tahan angin & air ringan",
    "fit": "Classic Oversize Trench",
    "colors": [
      "Beige",
      "Hitam"
    ],
    "occasions": "Kerja, Traveling",
    "sizes": {
      "Beige": {
        "S": 3,
        "M": 5,
        "L": 4,
        "XL": 2
      },
      "Hitam": {
        "S": 4,
        "M": 5,
        "L": 3,
        "XL": 1
      }
    },
    "measurements": "S (LD 104 / P 110), M (LD 110 / P 112), L (LD 116 / P 114), XL (LD 122 / P 116)",
    "care": "Dry clean disarankan, setrika suhu sedang dengan kain pelindung.",
    "style": "European classic elegance, cinema chic",
    "pairWith": "Kemeja Oxford Slim (KMJ-010) + Celana Bahan Slim (CLN-011)",
    "proportionTip": "Tali pinggang dapat diikat di belakang untuk siluet longgar atau di depan untuk siluet terikat ramping.",
    "honestNote": "Panjang coat mencapai bawah lutut; direkomendasikan untuk TB di atas 158 cm.",
    "url": "#katalog-produk"
  },
  {
    "sku": "OUT-056",
    "name": "Jaket Denim Trucker Vintage Washed",
    "category": "Outer",
    "badge": "Heritage Layer",
    "image": "/images/OUT-056.jpg",
    "price": 399000,
    "priceFormatted": "Rp399.000",
    "material": "100% Cotton denim 13.5oz kokoh",
    "fit": "Boxy Trucker",
    "colors": [
      "Steel Blue",
      "Hitam"
    ],
    "occasions": "Kampus, Hangout",
    "sizes": {
      "Steel Blue": {
        "S": 5,
        "M": 7,
        "L": 6,
        "XL": 3
      },
      "Hitam": {
        "S": 4,
        "M": 6,
        "L": 5,
        "XL": 2
      }
    },
    "measurements": "S (LD 106 / P 62), M (LD 112 / P 64), L (LD 118 / P 66), XL (LD 124 / P 68)",
    "care": "Cuci air dingin, balik bagian dalam ke luar.",
    "style": "Vintage Americana, timeless casual",
    "pairWith": "Kaos Heavyweight Putih (TSH-036) + Chino Stretch (CHN-023)",
    "proportionTip": "Potongan trucker crop menonjolkan garis pinggang celana.",
    "honestNote": "Kain denim tebal tanpa stretch; pilih ukuran longgar jika ingin dipakai di atas hoodie.",
    "url": "#katalog-produk"
  },
  {
    "sku": "OUT-057",
    "name": "Cardigan Cable Knit Chunky",
    "category": "Outer",
    "badge": "Winter Cozy",
    "image": "/images/OUT-057.jpg",
    "price": 369000,
    "priceFormatted": "Rp369.000",
    "material": "Soft acrylic-cotton cable knit tebal & empuk",
    "fit": "Oversize Slouchy",
    "colors": [
      "Broken White",
      "Mocca"
    ],
    "occasions": "Belajar, Kafe",
    "sizes": {
      "Broken White": {
        "S": 4,
        "M": 6,
        "L": 5,
        "XL": 2
      },
      "Mocca": {
        "S": 3,
        "M": 7,
        "L": 4,
        "XL": 2
      }
    },
    "measurements": "S (LD 112 / P 64), M (LD 118 / P 66), L (LD 124 / P 68), XL (LD 130 / P 70)",
    "care": "Cuci tangan suhu dingin, peras perlahan, jemur datar.",
    "style": "Rory Gilmore aesthetic, academic cozy",
    "pairWith": "Midi Dress Flowy (DRS-004) atau Celana Kulot High-Waist (CLN-002)",
    "proportionTip": "Rajutan motif kabel besar memberi tekstur hangat yang sangat fotogenik.",
    "honestNote": "Cukup tebal dan hangat; sangat nyaman untuk ruang ber-AC dingin.",
    "url": "#katalog-produk"
  },
  {
    "sku": "OUT-058",
    "name": "Vest Rajut Sleeveless Preppy",
    "category": "Outer",
    "badge": "Preppy Vibe",
    "image": "/images/OUT-058.jpg",
    "price": 199000,
    "priceFormatted": "Rp199.000",
    "material": "Cotton blend fine knit adem berpori",
    "fit": "Regular V-Neck Vest",
    "colors": [
      "Navy",
      "Krem"
    ],
    "occasions": "Kampus, Belajar",
    "sizes": {
      "Navy": {
        "S": 6,
        "M": 8,
        "L": 6,
        "XL": 3
      },
      "Krem": {
        "S": 5,
        "M": 7,
        "L": 5,
        "XL": 2
      }
    },
    "measurements": "S (LD 96 / P 58), M (LD 102 / P 60), L (LD 108 / P 62), XL (LD 114 / P 64)",
    "care": "Cuci mesin mode lembut dengan jaring cuci.",
    "style": "Ivy league preppy, Korean campus aesthetic",
    "pairWith": "Kemeja Oxford Slim (KMJ-010) Putih + Chino Stretch (CHN-023)",
    "proportionTip": "Potongan leher V memperlihatkan kerah kemeja bagian dalam secara rapi.",
    "honestNote": "Rompi ringan tanpa lengan, tidak membuat gerah saat kuliah siang hari.",
    "url": "#katalog-produk"
  },
  {
    "sku": "OUT-059",
    "name": "Jaket Bomber Satin Padded",
    "category": "Outer",
    "badge": "Street Statement",
    "image": "/images/OUT-059.jpg",
    "price": 459000,
    "priceFormatted": "Rp459.000",
    "material": "Silky nylon twill dengan furing oranye klasik",
    "fit": "Oversize MA-1 Bomber",
    "colors": [
      "Olive",
      "Midnight Black"
    ],
    "occasions": "Clubbing, Hangout",
    "sizes": {
      "Olive": {
        "S": 4,
        "M": 6,
        "L": 5,
        "XL": 2
      },
      "Midnight Black": {
        "S": 5,
        "M": 7,
        "L": 4,
        "XL": 2
      }
    },
    "measurements": "S (LD 114 / P 64), M (LD 120 / P 66), L (LD 126 / P 68), XL (LD 132 / P 70)",
    "care": "Lap kain lembap atau dry clean, hindari strika suhu tinggi langsung ke nilon.",
    "style": "Military streetwear, pilot bomber",
    "pairWith": "Satin Corset Top (TOP-013) + Mini Pleated Skirt (SKR-014)",
    "proportionTip": "Siluet menggembung di dada menyeimbangkan bawahan pas badan di bawahnya.",
    "honestNote": "Dilengkapi lapisan busa tipis; hangat saat berkendara motor atau malam hari.",
    "url": "#katalog-produk"
  },
  {
    "sku": "OUT-060",
    "name": "Kimono Cardigan Linen Drop-Shoulder",
    "category": "Outer",
    "badge": "Zen Minimal",
    "image": "/images/OUT-060.jpg",
    "price": 279000,
    "priceFormatted": "Rp279.000",
    "material": "Linen katun lembut berpori",
    "fit": "Loose Kimono Cut",
    "colors": [
      "Charcoal",
      "Sand"
    ],
    "occasions": "Santai, Belajar, Mengaji",
    "sizes": {
      "Charcoal": {
        "S": 5,
        "M": 8,
        "L": 6,
        "XL": 3
      },
      "Sand": {
        "S": 6,
        "M": 7,
        "L": 5,
        "XL": 2
      }
    },
    "measurements": "S (LD 116 / P 70), M (LD 122 / P 72), L (LD 128 / P 74), XL (LD 134 / P 76)",
    "care": "Cuci biasa, jemur terbalik di tempat teduh.",
    "style": "Modern noragi, Japanese zen minimal",
    "pairWith": "Kaos Heavyweight Putih (TSH-036) + Celana Kulot High-Waist (CLN-002)",
    "proportionTip": "Model terbuka tanpa kancing mengalir bebas dan menutupi lekuk tubuh samping.",
    "honestNote": "Tanpa kancing depan; difungsikan sebagai layering terbuka.",
    "url": "#katalog-produk"
  },
  {
    "sku": "OUT-061",
    "name": "Windbreaker Anorak Lightweight",
    "category": "Outer",
    "badge": "Weather Proof",
    "image": "/images/OUT-061.jpg",
    "price": 349000,
    "priceFormatted": "Rp349.000",
    "material": "Ultra-light ripstop polyester water-repellent",
    "fit": "Relaxed Half-Zip",
    "colors": [
      "Forest Green",
      "Hitam"
    ],
    "occasions": "Kampus, Olahraga Ringan",
    "sizes": {
      "Forest Green": {
        "S": 5,
        "M": 7,
        "L": 6,
        "XL": 3
      },
      "Hitam": {
        "S": 4,
        "M": 8,
        "L": 5,
        "XL": 2
      }
    },
    "measurements": "S (LD 112 / P 68), M (LD 118 / P 70), L (LD 124 / P 72), XL (LD 130 / P 74)",
    "care": "Lap spons basah atau cuci tangan tanpa deterjen keras.",
    "style": "Outdoor active, trail streetwear",
    "pairWith": "Jogger Pants Comfort (JGR-020) + Talaka City Trekker (SNK-027)",
    "proportionTip": "Tali serut di bagian pinggul memungkinkan jaket diubah menjadi model crop.",
    "honestNote": "Sangat ringan dan bisa dilipat kecil masuk ke dalam tote bag.",
    "url": "#katalog-produk"
  },
  {
    "sku": "OUT-062",
    "name": "Cape Cardigan Flowy Syari",
    "category": "Outer",
    "badge": "Modest Elegance",
    "image": "/images/OUT-062.jpg",
    "price": 299000,
    "priceFormatted": "Rp299.000",
    "material": "Chiffon babydoll premium dua lapis",
    "fit": "Loose Drape Cape",
    "colors": [
      "Sage",
      "Dusty Rose"
    ],
    "occasions": "Mengaji, Acara Resmi",
    "sizes": {
      "Sage": {
        "One Size": 10
      },
      "Dusty Rose": {
        "One Size": 8
      }
    },
    "measurements": "One Size — Lebar dada bebas, Panjang 105 cm",
    "care": "Cuci tangan perlahan, jangan gunakan sikat kasar.",
    "style": "Modest cape, syari royal drape",
    "pairWith": "Gamis Linen Modest (GMS-016) atau Rok Kembang Flowy (RKU-018)",
    "proportionTip": "Potongan cape menutupi area pundak hingga pinggul dengan keanggunan melayang.",
    "honestNote": "Bahan ringan melayang; gunakan bros kecil di dada jika ingin tertutup rapat.",
    "url": "#katalog-produk"
  },
  {
    "sku": "OUT-063",
    "name": "Blazer Linen Unstructured Summer",
    "category": "Outer",
    "badge": "Breezy Formal",
    "image": "/images/OUT-063.avif",
    "price": 439000,
    "priceFormatted": "Rp439.000",
    "material": "Linen katun alami tanpa busa bahu kaku",
    "fit": "Relaxed Tailored",
    "colors": [
      "Krem",
      "Steel Blue"
    ],
    "occasions": "Kerja Santai, Kampus",
    "sizes": {
      "Krem": {
        "S": 4,
        "M": 7,
        "L": 5,
        "XL": 2
      },
      "Steel Blue": {
        "S": 5,
        "M": 6,
        "L": 4,
        "XL": 2
      }
    },
    "measurements": "S (LD 102 / P 70), M (LD 108 / P 72), L (LD 114 / P 74), XL (LD 120 / P 76)",
    "care": "Setrika uap suhu sedang, gantung di hanger kayu.",
    "style": "Italian sprezzatura, effortless office chic",
    "pairWith": "Kemeja Oxford Slim (KMJ-010) + Chino Stretch Kampus (CHN-023)",
    "proportionTip": "Tanpa busa bahu memberi siluet bahu alami yang rileks namun tetap formal.",
    "honestNote": "Linen berkarakter kusut alami yang menambah kesan santai berkelas.",
    "url": "#katalog-produk"
  },
  {
    "sku": "OUT-064",
    "name": "Zip-Up Hoodie Minimalist Sand",
    "category": "Outer",
    "badge": "Daily Layer",
    "image": "/images/OUT-064.avif",
    "price": 289000,
    "priceFormatted": "Rp289.000",
    "material": "Cotton terry 300gsm dengan resleting YKK metalik",
    "fit": "Regular Relaxed",
    "colors": [
      "Sand",
      "Hitam"
    ],
    "occasions": "Belajar, Kampus, Harian",
    "sizes": {
      "Sand": {
        "S": 5,
        "M": 8,
        "L": 6,
        "XL": 3
      },
      "Hitam": {
        "S": 4,
        "M": 7,
        "L": 5,
        "XL": 2
      }
    },
    "measurements": "S (LD 106 / P 66), M (LD 112 / P 68), L (LD 118 / P 70), XL (LD 124 / P 72)",
    "care": "Cuci biasa, hindari pengering putaran panas.",
    "style": "Clean lounge, minimal zip hoodie",
    "pairWith": "Kaos Grafis Study Vibes (TSH-021) + Jogger Pants (JGR-020)",
    "proportionTip": "Resleting depan memudahkan buka-tutup sesuai suhu ruangan kelas atau perpustakaan.",
    "honestNote": "Bahan cotton terry tidak berbulu tebal di dalam, adem dipakai di iklim tropis.",
    "url": "#katalog-produk"
  },
  {
    "sku": "DRS-065",
    "name": "Shirt Dress Linen Belted",
    "category": "Dress",
    "badge": "Work & Beyond",
    "image": "/images/DRS-065.jpg",
    "price": 379000,
    "priceFormatted": "Rp379.000",
    "material": "Linen katun premium berstruktur lembut",
    "fit": "Regular Midi with Belt",
    "colors": [
      "Beige",
      "Navy"
    ],
    "occasions": "Kerja, Kampus, Hangout",
    "sizes": {
      "Beige": {
        "S": 4,
        "M": 6,
        "L": 5,
        "XL": 2
      },
      "Navy": {
        "S": 5,
        "M": 7,
        "L": 4,
        "XL": 2
      }
    },
    "measurements": "S (LD 94 / P 110), M (LD 100 / P 112), L (LD 106 / P 114), XL (LD 112 / P 116)",
    "care": "Cuci lembut, setrika suhu sedang saat lembap.",
    "style": "Safari chic, smart casual dress",
    "pairWith": "Talaka Slip-On Mule (SNK-031) atau Talaka Cloud Sneaker (SNK-007)",
    "proportionTip": "Kerah kemeja dan sabuk pinggang memberi siluet formal yang tetap feminin.",
    "honestNote": "Kancing depan fungsional dari atas ke bawah, ramah ibu menyusui (busui friendly).",
    "url": "#katalog-produk"
  },
  {
    "sku": "DRS-066",
    "name": "Slip Dress Satin Bias Cut",
    "category": "Dress",
    "badge": "Party Glam",
    "image": "/images/DRS-066.jpg",
    "price": 329000,
    "priceFormatted": "Rp329.000",
    "material": "Satin silk polyester dengan kilau elegan",
    "fit": "Bias Cut Slim Flattering",
    "colors": [
      "Midnight Black",
      "Emerald"
    ],
    "occasions": "Clubbing, Dinner Romantis",
    "sizes": {
      "Midnight Black": {
        "S": 4,
        "M": 6,
        "L": 4,
        "XL": 1
      },
      "Emerald": {
        "S": 3,
        "M": 5,
        "L": 3,
        "XL": 1
      }
    },
    "measurements": "S (LD 86 / P 118), M (LD 92 / P 120), L (LD 98 / P 122), XL (LD 104 / P 124)",
    "care": "Cuci tangan dingin, jangan diperas, setrika uap suhu sangat rendah.",
    "style": "90s minimalist red carpet, cocktail glamour",
    "pairWith": "Jaket Kulit Faux (JKT-015) untuk tampilan edgy atau heels anggun",
    "proportionTip": "Potongan bias-cut mengikuti lekuk alami tubuh tanpa terasa sesak.",
    "honestNote": "Tali spageti tipis dapat diatur panjang-pendeknya (adjustable strap).",
    "url": "#katalog-produk"
  },
  {
    "sku": "DRS-067",
    "name": "Abaya Modern Pleated Cuff",
    "category": "Dress",
    "badge": "Syari Modern",
    "image": "/images/DRS-067.avif",
    "price": 429000,
    "priceFormatted": "Rp429.000",
    "material": "Arabian jetblack crepe jatuh dingin",
    "fit": "Loose Abaya Cut",
    "colors": [
      "Midnight Black"
    ],
    "occasions": "Mengaji, Hari Raya",
    "sizes": {
      "Midnight Black": {
        "S": 6,
        "M": 8,
        "L": 6,
        "XL": 4
      }
    },
    "measurements": "S (LD 108 / P 138), M (LD 114 / P 140), L (LD 120 / P 142), XL (LD 126 / P 144)",
    "care": "Cuci dengan deterjen khusus warna hitam, jemur terbalik di tempat teduh.",
    "style": "Dubai abaya minimalist, syari luxury",
    "pairWith": "Khimar Chiffon Talaka (KHM-017) Putih atau Olive",
    "proportionTip": "Warna jetblack pekat memberi kesan tubuh lebih tinggi dan ramping secara instan.",
    "honestNote": "Manset pergelangan tangan dilengkapi kancing wudhu friendly.",
    "url": "#katalog-produk"
  },
  {
    "sku": "DRS-068",
    "name": "Tiered Maxi Dress Rayon Cotton",
    "category": "Dress",
    "badge": "Boho Minimal",
    "image": "/images/DRS-068.jpg",
    "price": 369000,
    "priceFormatted": "Rp369.000",
    "material": "Rayon crinkle adem flowy",
    "fit": "Tiered Smocked Bust",
    "colors": [
      "Terracotta",
      "Sage"
    ],
    "occasions": "Piknik, Hangout Santai",
    "sizes": {
      "Terracotta": {
        "S": 4,
        "M": 6,
        "L": 5,
        "XL": 2
      },
      "Sage": {
        "S": 5,
        "M": 7,
        "L": 4,
        "XL": 2
      }
    },
    "measurements": "S (LD 88–98 / P 125), M (LD 94–104 / P 127), L (LD 100–110 / P 129), XL (LD 106–116 / P 131)",
    "care": "Cuci lembut, jangan disikat, keringkan di tempat teduh.",
    "style": "Cottagecore minimal, breezy bohemian",
    "pairWith": "Outer Boxy Knit Cardigan (OUT-003) + Talaka Aurora Mocca (SNK-006)",
    "proportionTip": "Kerutan smock elastis di dada menyesuaikan ukuran tubuh dengan nyaman.",
    "honestNote": "Tekstur bahan crinkle berkerut alami sehingga tidak perlu sering disetrika.",
    "url": "#katalog-produk"
  },
  {
    "sku": "DRS-069",
    "name": "Wrap Dress Midi Polkadot Retro",
    "category": "Dress",
    "badge": "Iconic Wrap",
    "image": "/images/DRS-069.jpg",
    "price": 339000,
    "priceFormatted": "Rp339.000",
    "material": "Poly-viscose twill lembut jatuh",
    "fit": "True Wrap Silhouette",
    "colors": [
      "Hitam",
      "Terracotta"
    ],
    "occasions": "Kerja Santai, Acara Keluarga",
    "sizes": {
      "Hitam": {
        "S": 4,
        "M": 6,
        "L": 5,
        "XL": 2
      },
      "Terracotta": {
        "S": 3,
        "M": 5,
        "L": 4,
        "XL": 1
      }
    },
    "measurements": "S (LD 90 / P 112), M (LD 96 / P 114), L (LD 102 / P 116), XL (LD 108 / P 118)",
    "care": "Cuci biasa, setrika suhu sedang.",
    "style": "French effortless chic, classic Diane wrap",
    "pairWith": "Talaka Slip-On Mule (SNK-031) Krem",
    "proportionTip": "Potongan wrap menyilang di dada dan diikat di pinggang sangat menyanjung berbagai bentuk tubuh.",
    "honestNote": "Model wrap sejati yang dapat diatur kerapatannya dengan tali pinggang.",
    "url": "#katalog-produk"
  },
  {
    "sku": "DRS-070",
    "name": "Knit Bodycon Midi Dress Ribbed",
    "category": "Dress",
    "badge": "Sleek Fit",
    "image": "/images/DRS-070.jpg",
    "price": 299000,
    "priceFormatted": "Rp299.000",
    "material": "Elastic ribbed knit cotton tebal elastis",
    "fit": "Fitted Bodycon Midi",
    "colors": [
      "Charcoal",
      "Mocca"
    ],
    "occasions": "Clubbing, Dinner Santai",
    "sizes": {
      "Charcoal": {
        "S": 5,
        "M": 7,
        "L": 5,
        "XL": 2
      },
      "Mocca": {
        "S": 4,
        "M": 6,
        "L": 4,
        "XL": 2
      }
    },
    "measurements": "S (LD 82–92 / P 110), M (LD 88–98 / P 112), L (LD 94–104 / P 114), XL (LD 100–110 / P 116)",
    "care": "Cuci tangan dingin, keringkan datar agar tidak memanjang.",
    "style": "Kardashian minimal chic, urban sleek",
    "pairWith": "Jaket Kulit Faux (JKT-015) + Talaka Cloud Sneaker (SNK-007)",
    "proportionTip": "Rajutan rib elastis memeluk lekuk tubuh dengan anggun.",
    "honestNote": "Memiliki slit belahan samping setinggi 20 cm di betis untuk keleluasaan melangkah.",
    "url": "#katalog-produk"
  },
  {
    "sku": "DRS-071",
    "name": "Kaftan Silk Modern Draping",
    "category": "Dress",
    "badge": "Festive Luxury",
    "image": "/images/DRS-071.webp",
    "price": 459000,
    "priceFormatted": "Rp459.000",
    "material": "Satin silk doff dengan aksen kerut pinggang dalam",
    "fit": "Loose Kaftan Flow",
    "colors": [
      "Warm Grey",
      "Dusty Rose"
    ],
    "occasions": "Mengaji, Acara Resmi",
    "sizes": {
      "Warm Grey": {
        "One Size": 10
      },
      "Dusty Rose": {
        "One Size": 8
      }
    },
    "measurements": "One Size — Lingkar dada bebas hingga 130 cm, Panjang 140 cm",
    "care": "Cuci tangan lembut tanpa peras mesin, setrika uap suhu rendah.",
    "style": "Modern modest kaftan, Eid luxury",
    "pairWith": "Khimar Chiffon Talaka (KHM-017) Putih",
    "proportionTip": "Drapery kain jatuh dari pundak memberi kesan ningrat dan agung.",
    "honestNote": "Dilengkapi tali serut tersembunyi di dalam untuk mengatur siluet pinggang.",
    "url": "#katalog-produk"
  },
  {
    "sku": "DRS-072",
    "name": "Pinafore Overall Dress Twill",
    "category": "Dress",
    "badge": "Retro Student",
    "image": "/images/DRS-072.webp",
    "price": 289000,
    "priceFormatted": "Rp289.000",
    "material": "Katun twill non-stretch berstruktur",
    "fit": "Straight Overall Midi",
    "colors": [
      "Hitam",
      "Sand"
    ],
    "occasions": "Kampus, Belajar",
    "sizes": {
      "Hitam": {
        "S": 5,
        "M": 7,
        "L": 5,
        "XL": 2
      },
      "Sand": {
        "S": 4,
        "M": 6,
        "L": 4,
        "XL": 2
      }
    },
    "measurements": "S (LP 80 / P 108), M (LP 86 / P 110), L (LP 92 / P 112), XL (LP 98 / P 114)",
    "care": "Cuci biasa, setrika suhu sedang.",
    "style": "Japanese mori girl, academic layered",
    "pairWith": "Kemeja Oxford Slim (KMJ-010) atau Kaos Turtleneck (TSH-034)",
    "proportionTip": "Desain tanpa lengan dirancang khusus untuk dilapis di atas kaos atau kemeja favorit.",
    "honestNote": "Tali bahu dilengkapi 2 kancing pengatur tinggi badan.",
    "url": "#katalog-produk"
  },
  {
    "sku": "ACC-073",
    "name": "Topi Baseball Cap Bordir Talaka",
    "category": "Aksesoris",
    "badge": "Daily Essential",
    "image": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=700&q=80",
    "price": 99000,
    "priceFormatted": "Rp99.000",
    "material": "100% Cotton twill dengan bordir logo minimalis",
    "fit": "All Size (Strap Gesper Besi Adjustable)",
    "colors": [
      "Hitam",
      "Broken White"
    ],
    "occasions": "Kampus, Santai",
    "sizes": {
      "Hitam": {
        "One Size": 20
      },
      "Broken White": {
        "One Size": 15
      }
    },
    "measurements": "Lingkar kepala 54–60 cm, visor 7 cm",
    "care": "Cuci tangan dengan sikat lembut di bagian kotor saja, jangan direndam mesin cuci.",
    "style": "Streetwear cap, dad hat minimal",
    "pairWith": "Kaos Oversize (TSH-005) + Celana Kulot (CLN-002)",
    "proportionTip": "Visor melengkung melindungi wajah dari terik matahari saat jalan santai.",
    "honestNote": "Strap gesper belakang dari logam anti-karat.",
    "url": "#katalog-produk"
  },
  {
    "sku": "ACC-074",
    "name": "Topi Bucket Hat Reversible Dua Sisi",
    "category": "Aksesoris",
    "badge": "2-in-1 Style",
    "image": "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=700&q=80",
    "price": 119000,
    "priceFormatted": "Rp119.000",
    "material": "Cotton canvas dua sisi (Sisi A: Hitam, Sisi B: Sand)",
    "fit": "Relaxed Bucket",
    "colors": [
      "Hitam",
      "Sand"
    ],
    "occasions": "Hangout, Traveling",
    "sizes": {
      "Hitam": {
        "One Size": 16
      },
      "Sand": {
        "One Size": 14
      }
    },
    "measurements": "Lingkar kepala 56–58 cm, brim 6 cm",
    "care": "Cuci tangan air dingin, setrika suhu sedang.",
    "style": "90s skater, aesthetic bucket hat",
    "pairWith": "Hoodie Fleece (HDI-019) + Jogger Pants (JGR-020)",
    "proportionTip": "Bisa dibalik untuk mengganti warna outfit seketika.",
    "honestNote": "Dapat dilipat kecil tanpa merusak bentuk topi.",
    "url": "#katalog-produk"
  },
  {
    "sku": "ACC-075",
    "name": "Sling Bag Crossbody Mini Nylon",
    "category": "Aksesoris",
    "badge": "Hands Free",
    "image": "/images/ACC-075.jpg",
    "price": 149000,
    "priceFormatted": "Rp149.000",
    "material": "Waterproof crinkle nylon & YKK zipper",
    "fit": "Compact Crossbody",
    "colors": [
      "Hitam",
      "Olive"
    ],
    "occasions": "Konser, Hangout, Harian",
    "sizes": {
      "Hitam": {
        "One Size": 18
      },
      "Olive": {
        "One Size": 12
      }
    },
    "measurements": "P 22 cm × T 16 cm × L 6 cm (muat HP, dompet, kunci)",
    "care": "Lap kain basah, bahan nilon anti noda.",
    "style": "Utilitarian pouch, festival sling bag",
    "pairWith": "Jaket Kulit (JKT-015) atau Kaos Oversize (TSH-005)",
    "proportionTip": "Tali bahu adjustable bisa dipakai di dada atau di samping pinggang.",
    "honestNote": "Kapasitas ringkas untuk barang esensial harian.",
    "url": "#katalog-produk"
  },
  {
    "sku": "ACC-076",
    "name": "Backpack Laptop Minimalist 15.6\"",
    "category": "Aksesoris",
    "badge": "Campus & Office",
    "image": "/images/ACC-076.jpg",
    "price": 359000,
    "priceFormatted": "Rp359.000",
    "material": "Poly-cordura tebal water-repellent dengan slot busa laptop",
    "fit": "Ergonomic Backpack 20 Liter",
    "colors": [
      "Charcoal",
      "Hitam"
    ],
    "occasions": "Kampus, Kerja, Belajar",
    "sizes": {
      "Charcoal": {
        "One Size": 15
      },
      "Hitam": {
        "One Size": 20
      }
    },
    "measurements": "T 44 cm × L 30 cm × Tebal 14 cm (muat laptop hingga 15.6\")",
    "care": "Bersihkan noda dengan sikat gigi lembap, jangan dicuci mesin.",
    "style": "Commuter minimal, Scandinavian carry",
    "pairWith": "Polo Shirt Pique (PLO-022) + Chino Stretch (CHN-023)",
    "proportionTip": "Bantalan punggung empuk bersirkulasi udara mencegah punggung berkeringat.",
    "honestNote": "Dilengkapi strap koper di bagian belakang untuk kemudahan saat traveling.",
    "url": "#katalog-produk"
  },
  {
    "sku": "ACC-077",
    "name": "Ikat Pinggang Kulit Reversible Minimal",
    "category": "Aksesoris",
    "badge": "Formal Core",
    "image": "/images/ACC-077.jpg",
    "price": 139000,
    "priceFormatted": "Rp139.000",
    "material": "High-grade microfibre leather dua sisi (Hitam / Espresso) & gesper putar",
    "fit": "Width 3.3 cm (Universal Length 115 cm)",
    "colors": [
      "Hitam"
    ],
    "occasions": "Kerja, Formal",
    "sizes": {
      "Hitam": {
        "One Size": 25
      }
    },
    "measurements": "Panjang 115 cm (bisa dipotong sendiri sesuai lingkar pinggang), Lebar 3.3 cm",
    "care": "Lap kain kering, simpan digantung lurus.",
    "style": "Modern corporate belt, sleek leather",
    "pairWith": "Celana Bahan Slim (CLN-011) atau Chino Stretch (CHN-023)",
    "proportionTip": "Gesper putar otomatis mengubah warna dari Hitam ke Espresso sesuai warna sepatu.",
    "honestNote": "Tersedia lubang penyesuaian yang rapi dan kuat.",
    "url": "#katalog-produk"
  },
  {
    "sku": "ACC-078",
    "name": "Kacamata Hitam Polarized Minimalist",
    "category": "Aksesoris",
    "badge": "UV400 Protected",
    "image": "/images/ACC-078.jpg",
    "price": 169000,
    "priceFormatted": "Rp169.000",
    "material": "Polycarbonate frame matte & TAC polarized lens UV400",
    "fit": "Universal Medium Fit",
    "colors": [
      "Hitam"
    ],
    "occasions": "Hangout, Liburan",
    "sizes": {
      "Hitam": {
        "One Size": 18
      }
    },
    "measurements": "Lebar bingkai 142 mm, panjang tangkai 145 mm",
    "care": "Lap hanya dengan kain microfiber kacamata yang disediakan, jangan gunakan tisu kasar.",
    "style": "Wayfarer clean aesthetic, timeless shade",
    "pairWith": "Kemeja Rayon Camp Collar (KMJ-037) + Celana Kulot (CLN-002)",
    "proportionTip": "Bentuk bingkai persegi tumpul cocok untuk hampir semua bentuk wajah.",
    "honestNote": "Termasuk case pelindung kulit sintetis dan kain lap microfiber.",
    "url": "#katalog-produk"
  },
  {
    "sku": "ACC-079",
    "name": "Kaus Kaki Crew Ribbed Cotton (3-Pack)",
    "category": "Aksesoris",
    "badge": "Daily Pack",
    "image": "/images/ACC-079.jpg",
    "price": 79000,
    "priceFormatted": "Rp79.000",
    "material": "Combed cotton 80% + elastane 20% (anti-bakteri, tidak mudah melar)",
    "fit": "Mid-Calf Ribbed (Unisex 38–44)",
    "colors": [
      "Putih",
      "Hitam"
    ],
    "occasions": "Kampus, Belajar, Kerja",
    "sizes": {
      "Putih": {
        "One Size": 30
      },
      "Hitam": {
        "One Size": 25
      }
    },
    "measurements": "Panjang betis 18 cm, muat ukuran sepatu 38 hingga 44",
    "care": "Cuci mesin putaran biasa, jangan disetrika.",
    "style": "Streetwear crew socks, collegiate style",
    "pairWith": "Talaka Cloud Off-White (SNK-007) atau Talaka Aurora Mocca (SNK-006)",
    "proportionTip": "Rajutan rib tebal di tumit dan telapak memberi bantalan ekstra saat memakai sneaker seharian.",
    "honestNote": "Paket isi 3 pasang kaus kaki dengan warna senada.",
    "url": "#katalog-produk"
  },
  {
    "sku": "ACC-080",
    "name": "Syal Pashmina Ceruty Babydoll",
    "category": "Aksesoris",
    "badge": "Hijab & Scarf",
    "image": "/images/ACC-080.jpg",
    "price": 69000,
    "priceFormatted": "Rp69.000",
    "material": "Ceruty babydoll premium bertekstur pasir lembut",
    "fit": "Flowy Pashmina 180x75 cm",
    "colors": [
      "Sage",
      "Mocca"
    ],
    "occasions": "Mengaji, Kampus, Formal",
    "sizes": {
      "Sage": {
        "One Size": 25
      },
      "Mocca": {
        "One Size": 20
      }
    },
    "measurements": "Panjang 180 cm × Lebar 75 cm",
    "care": "Cuci tangan perlahan, setrika suhu rendah-sedang.",
    "style": "Modest pashmina, flowy drape hijab",
    "pairWith": "Gamis Linen Modest (GMS-016) atau Blazer Struktural (BLZ-012)",
    "proportionTip": "Bahan ceruty babydoll jatuh anggun dan mudah dibentuk berbagai gaya hijab.",
    "honestNote": "Bahan agak tipis berpasir; disarankan menggunakan inner ciput.",
    "url": "#katalog-produk"
  },
  {
    "sku": "ACC-081",
    "name": "Scrunchie Silk Jumbo Ikat Rambut",
    "category": "Aksesoris",
    "badge": "Hair Care",
    "image": "/images/ACC-081.jpg",
    "price": 39000,
    "priceFormatted": "Rp39.000",
    "material": "Mulberry silk satin halus tidak merusak rambut",
    "fit": "Diameter 14 cm Jumbo",
    "colors": [
      "Dusty Rose",
      "Midnight Black"
    ],
    "occasions": "Harian, Belajar",
    "sizes": {
      "Dusty Rose": {
        "One Size": 30
      },
      "Midnight Black": {
        "One Size": 30
      }
    },
    "measurements": "Diameter elastik 14 cm",
    "care": "Cuci tangan air dingin, jemur teduh.",
    "style": "Clean girl aesthetic, volumizing scrunchie",
    "pairWith": "Cocok sebagai cepol hijab atau kuncir rambut harian",
    "proportionTip": "Memberi volume cepol hijab yang proporsional tanpa terasa berat di kepala.",
    "honestNote": "Karet elastik berkualitas tinggi tidak mudah kendor.",
    "url": "#katalog-produk"
  },
  {
    "sku": "ACC-082",
    "name": "Kalung Rantai Minimalist Layered Gold",
    "category": "Aksesoris",
    "badge": "Jewelry Accent",
    "image": "/images/ACC-082.jpg",
    "price": 129000,
    "priceFormatted": "Rp129.000",
    "material": "Stainless steel 316L lapis 18K gold (anti-karat & hypoallergenic)",
    "fit": "Dual Layer Chain (40 cm + 45 cm)",
    "colors": [
      "Rose Gold"
    ],
    "occasions": "Clubbing, Hangout, Kerja",
    "sizes": {
      "Rose Gold": {
        "One Size": 22
      }
    },
    "measurements": "Rantai 1: 40 cm, Rantai 2: 45 cm + rantai ekstensi 5 cm",
    "care": "Hindari kontak langsung dengan parfum atau lotion pekat.",
    "style": "Dainty gold jewelry, subtle elegance",
    "pairWith": "Satin Corset Top (TOP-013) atau Kemeja Oxford (KMJ-010)",
    "proportionTip": "Layer ganda memberi sentuhan berkilau lembut di area leher.",
    "honestNote": "Bahan titanium steel aman untuk kulit sensitif dan tidak menghitam terkena air.",
    "url": "#katalog-produk"
  },
  {
    "sku": "ACC-083",
    "name": "Anting Hoop Minimalist Chunky",
    "category": "Aksesoris",
    "badge": "Everyday Jewelry",
    "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80",
    "price": 99000,
    "priceFormatted": "Rp99.000",
    "material": "Titanium steel hollow ringan lapis emas",
    "fit": "Diameter 22 mm Tube",
    "colors": [
      "Rose Gold"
    ],
    "occasions": "Clubbing, Kerja",
    "sizes": {
      "Rose Gold": {
        "One Size": 20
      }
    },
    "measurements": "Diameter 22 mm, ketebalan tabung 4 mm",
    "care": "Lap kain kering setelah pemakaian.",
    "style": "Classic chunky hoop, Parisian chic",
    "pairWith": "Blazer Struktural (BLZ-012) atau Kaos Turtleneck (TSH-034)",
    "proportionTip": "Desain hollow berongga di dalam membuatnya sangat ringan dipakai seharian tanpa menarik cuping telinga.",
    "honestNote": "Kancing pengunci klik aman dan presisi.",
    "url": "#katalog-produk"
  },
  {
    "sku": "ACC-084",
    "name": "Gelang Tennis Bracelet Zirconia",
    "category": "Aksesoris",
    "badge": "Sparkle Touch",
    "image": "/images/ACC-084.jpg",
    "price": 159000,
    "priceFormatted": "Rp159.000",
    "material": "AAA cubic zirconia & rhodium-plated copper",
    "fit": "Length 17 cm Box Clasp",
    "colors": [
      "Putih"
    ],
    "occasions": "Clubbing, Dinner, Formal",
    "sizes": {
      "Putih": {
        "One Size": 18
      }
    },
    "measurements": "Panjang 17 cm, lebar batu 3 mm",
    "care": "Simpan di kotak perhiasan kedap udara, hindari terkena sabun cuci piring.",
    "style": "Timeless tennis bracelet, subtle luxury",
    "pairWith": "Satin Corset Top (TOP-013) atau Midi Dress Flowy (DRS-004)",
    "proportionTip": "Kilau batu zirkonia memantulkan cahaya indah saat tangan bergerak.",
    "honestNote": "Pengait ganda model box-clasp mencegah gelang terlepas tidak sengaja.",
    "url": "#katalog-produk"
  },
  {
    "sku": "ACC-085",
    "name": "Dompet Kartu Cardholder Slim Leather",
    "category": "Aksesoris",
    "badge": "Slim Carry",
    "image": "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=80",
    "price": 89000,
    "priceFormatted": "Rp89.000",
    "material": "Microfibre nappa leather dengan 6 slot kartu + 1 slot uang",
    "fit": "Ultra Slim Pocket Fit",
    "colors": [
      "Hitam",
      "Mocca"
    ],
    "occasions": "Harian, Kampus, Kerja",
    "sizes": {
      "Hitam": {
        "One Size": 25
      },
      "Mocca": {
        "One Size": 20
      }
    },
    "measurements": "P 10.5 cm × T 8 cm × Tebal 0.4 cm",
    "care": "Lap kain kering, hindari menekuk secara paksa.",
    "style": "Cashless lifestyle, minimalist wallet",
    "pairWith": "Muat di semua saku celana atau tas selempang mini",
    "proportionTip": "Sangat tipis tidak menimbulkan tonjolan di saku celana slim fit.",
    "honestNote": "Muat 6–8 kartu debit/KTP dan beberapa lembar uang darurat.",
    "url": "#katalog-produk"
  },
  {
    "sku": "ACC-086",
    "name": "Tumbler Stainless Steel Termos 500ml",
    "category": "Aksesoris",
    "badge": "Eco Daily",
    "image": "/images/ACC-086.webp",
    "price": 149000,
    "priceFormatted": "Rp149.000",
    "material": "SUS 304 food-grade double-wall vacuum insulated",
    "fit": "Capacity 500 ml",
    "colors": [
      "Charcoal",
      "Krem"
    ],
    "occasions": "Kampus, Belajar, Kerja",
    "sizes": {
      "Charcoal": {
        "One Size": 20
      },
      "Krem": {
        "One Size": 20
      }
    },
    "measurements": "Tinggi 22 cm, diameter 6.8 cm, berat kosong 280 gram",
    "care": "Cuci dengan spons lembut, jangan masukkan ke microwave.",
    "style": "Nordic minimalist drinkware, zero waste",
    "pairWith": "Pas di slot botol Tote Canvas Kampus (BAG-024)",
    "proportionTip": "Menjaga suhu minuman dingin hingga 18 jam dan panas hingga 12 jam.",
    "honestNote": "Tutup kedap anti-bocor dengan seal silikon food-grade.",
    "url": "#katalog-produk"
  },
  {
    "sku": "ACC-087",
    "name": "Kaos Kaki Hidden No-Show Loafer (3-Pack)",
    "category": "Aksesoris",
    "badge": "Invisible Comfort",
    "image": "/images/ACC-087.jpg",
    "price": 69000,
    "priceFormatted": "Rp69.000",
    "material": "Katun combed tipis dengan silicone grip anti-slip di tumit",
    "fit": "No-Show Cut (38–43)",
    "colors": [
      "Hitam",
      "Beige"
    ],
    "occasions": "Kerja, Harian",
    "sizes": {
      "Hitam": {
        "One Size": 25
      },
      "Beige": {
        "One Size": 25
      }
    },
    "measurements": "Potongan sangat rendah tersembunyi di dalam sepatu",
    "care": "Cuci mesin putaran biasa.",
    "style": "Ankle-free look for loafers and sneakers",
    "pairWith": "Talaka Slip-On Mule (SNK-031) atau Talaka Derby Leather (SNK-028)",
    "proportionTip": "Memberi tampilan tanpa kaus kaki yang rapi tanpa membuat kaki lecet atau bau.",
    "honestNote": "Dilengkapi gel silikon di bagian tumit agar kaus kaki tidak merosot ke telapak.",
    "url": "#katalog-produk"
  },
  {
    "sku": "ACC-088",
    "name": "Gantungan Kunci Lanyard Kulit Talaka",
    "category": "Aksesoris",
    "badge": "Everyday Carry",
    "image": "/images/ACC-088.jpg",
    "price": 59000,
    "priceFormatted": "Rp59.000",
    "material": "Kulit sintetis tebal & pengait karabiner logam matte",
    "fit": "Length 14 cm",
    "colors": [
      "Hitam",
      "Mocca"
    ],
    "occasions": "Kampus, Kerja",
    "sizes": {
      "Hitam": {
        "One Size": 30
      },
      "Mocca": {
        "One Size": 25
      }
    },
    "measurements": "Panjang 14 cm, lebar pita kulit 2 cm",
    "care": "Lap kain bersih.",
    "style": "Minimal key lanyard, tactile edc",
    "pairWith": "Tote Canvas Kampus (BAG-024) atau tas ransel",
    "proportionTip": "Memudahkan menemukan kunci di dalam tas besar dengan sentuhan kulit yang elegan.",
    "honestNote": "Kait karabiner kuat dapat mengunci aman di loop celana.",
    "url": "#katalog-produk"
  },
  {
    "sku": "ACC-089",
    "name": "Ciput Ninja Inner Hijab Anti-Pusing",
    "category": "Aksesoris",
    "badge": "Modest Base",
    "image": "/images/ACC-089.jpg",
    "price": 49000,
    "priceFormatted": "Rp49.000",
    "material": "Rayon spandex super adem & berpori",
    "fit": "Inner Ninja Full Neck",
    "colors": [
      "Hitam",
      "Krem"
    ],
    "occasions": "Mengaji, Harian",
    "sizes": {
      "Hitam": {
        "One Size": 30
      },
      "Krem": {
        "One Size": 25
      }
    },
    "measurements": "One Size elastik pas di kepala dan menutup leher rapi",
    "care": "Cuci tangan lembut, jangan disetrika suhu tinggi.",
    "style": "Essential inner ninja hijab",
    "pairWith": "Khimar Chiffon (KHM-017) atau Pashmina Ceruty (ACC-080)",
    "proportionTip": "Bahan rayon fleksibel tidak menekan daun telinga sehingga bebas pusing dipakai seharian.",
    "honestNote": "Kain adem menyerap keringat di bawah kerudung.",
    "url": "#katalog-produk"
  },
  {
    "sku": "ACC-090",
    "name": "Bros Magnet Hijab Pearl Minimalist",
    "category": "Aksesoris",
    "badge": "No-Pin Hijab",
    "image": "/images/ACC-090.jpg",
    "price": 45000,
    "priceFormatted": "Rp45.000",
    "material": "Neodymium magnet ultra kuat dengan hiasan mutiara sintetis halus",
    "fit": "Diameter 1.2 cm Pair",
    "colors": [
      "Putih"
    ],
    "occasions": "Mengaji, Formal",
    "sizes": {
      "Putih": {
        "One Size": 35
      }
    },
    "measurements": "Diameter 1.2 cm, daya rekat magnetik hingga 4 lapis kain",
    "care": "Simpan terpisah dari kartu ATM atau benda bermagnet.",
    "style": "Modern pinless hijab clip, pearl accent",
    "pairWith": "Khimar Chiffon (KHM-017) atau Gamis Linen Modest (GMS-016)",
    "proportionTip": "Mengunci hijab dengan kuat tanpa merusak serat kain jilbab.",
    "honestNote": "Tanpa jarum tajam, 100% aman dan tidak melubangi kain sutra atau chiffon.",
    "url": "#katalog-produk"
  },
  {
    "sku": "ACC-091",
    "name": "Sarung Tangan Rajut Touchscreen Finger",
    "category": "Aksesoris",
    "badge": "Tech Warmth",
    "image": "/images/ACC-091.jpg",
    "price": 69000,
    "priceFormatted": "Rp69.000",
    "material": "Cotton-acrylic knit dengan serat konduktif di ujung jari telunjuk & jempol",
    "fit": "Elastic Stretch (Unisex)",
    "colors": [
      "Charcoal",
      "Hitam"
    ],
    "occasions": "Belajar, Berkendara Malam",
    "sizes": {
      "Charcoal": {
        "One Size": 20
      },
      "Hitam": {
        "One Size": 20
      }
    },
    "measurements": "Panjang 21 cm, elastis mengikuti telapak tangan",
    "care": "Cuci tangan air dingin, jangan disikat.",
    "style": "Winter tech minimal",
    "pairWith": "Hoodie Fleece (HDI-019) atau Jaket Kulit (JKT-015)",
    "proportionTip": "Bisa mengoperasikan layar HP tanpa harus melepas sarung tangan.",
    "honestNote": "Sensitivitas layar sentuh responsif pada smartphone layar kapasitif.",
    "url": "#katalog-produk"
  }
];

export const TALAKA_SIZE_CHART = [
  { size: 'S', tb: '150–158 cm', bb: '42–50 kg', note: 'Regular fit' },
  { size: 'M', tb: '155–165 cm', bb: '50–58 kg', note: 'Regular fit' },
  { size: 'L', tb: '160–170 cm', bb: '58–66 kg', note: 'Regular fit' },
  { size: 'XL', tb: '165–175 cm', bb: '66–75 kg', note: 'Regular fit' },
  { size: 'XXL', tb: '170–180 cm', bb: '75–85 kg', note: 'Regular fit (cek ketersediaan model)' },
  { size: 'XXXL', tb: '172–185 cm', bb: '85–100 kg', note: 'Regular fit (cek ketersediaan model)' },
];

export const TALAKA_SHOE_SIZE_CHART = [
  { size: '39', insole: '24.5 cm', note: 'Unisex' },
  { size: '40', insole: '25.0 cm', note: 'Unisex' },
  { size: '41', insole: '26.0 cm', note: 'Unisex' },
  { size: '42', insole: '26.5 cm', note: 'Unisex' },
  { size: '43', insole: '27.5 cm', note: 'Unisex' },
  { size: '44', insole: '28.0 cm', note: 'Unisex (naik 1 size jika kaki lebar)' },
];

export const TALAKA_FAQ_TEXT = `PROFIL & FAQ RESMI TALAKA:
- Tentang Talaka: Brand fashion & footwear lokal harian dengan gaya clean, minimalis, dan nyaman dipakai di iklim tropis.
- Jam Operasional Admin Manusia: Senin–Sabtu 09.00–20.00 WIB, Minggu 10.00–17.00 WIB. Chatbot aktif 24/7.
- Cara Pemesanan: Pilih produk, ukuran, dan warna langsung di website Talaka lalu checkout.
- Pembayaran: Transfer Bank (BCA, Mandiri, BNI), QRIS, E-Wallet (GoPay, OVO, DANA), dan COD (khusus area Jabodetabek & Bandung).
- Pengiriman: JNE, J&T, SiCepat, dan Instant/SameDay (Jabodetabek). Pesanan terkonfirmasi sebelum pukul 15.00 WIB dikirim di hari yang sama. Gratis ongkir minimal belanja Rp350.000.
- Kebijakan Retur & Tukar Ukuran: Bisa tukar ukuran maksimal 7 hari setelah barang diterima selama tag masih terpasang, belum dicuci/dipakai, dan menyertakan video unboxing. Ongkir tukar ukuran ditanggung pembeli kecuali kesalahan kirim dari Talaka.
- Kontak Admin: WhatsApp Admin Talaka / Inbox Website (eskalasi otomatis tersedia lewat chat).`;

export function cloneInitialProducts() {
  return TALAKA_PRODUCTS.map((p) => ({
    ...p,
    colors: [...p.colors],
    sizes: Object.fromEntries(
      Object.entries(p.sizes).map(([color, sizeMap]) => [color, { ...sizeMap }])
    ),
  }));
}

export function getProductTotalStock(product) {
  return Object.values(product.sizes || {}).reduce(
    (sum, sizeMap) =>
      sum + Object.values(sizeMap).reduce((inner, qty) => inner + qty, 0),
    0
  );
}

export function formatStockStatus(qty, showExactStock) {
  if (qty <= 0) return 'Habis';
  if (showExactStock) {
    return qty <= 3 ? `Tinggal sedikit (${qty} pcs)` : `Tersedia (${qty} pcs)`;
  }
  return qty <= 3 ? 'Stok tinggal sedikit' : 'Tersedia';
}

export function buildTalakaKnowledgeFromProducts(
  products = TALAKA_PRODUCTS,
  showExactStock = false
) {
  const sizeLines = TALAKA_SIZE_CHART.map(
    (row) => `- ${row.size}: TB ${row.tb} | BB ${row.bb} (${row.note})`
  ).join('\n');

  const shoeSizeLines = TALAKA_SHOE_SIZE_CHART.map(
    (row) => `- EU ${row.size}: Panjang kaki/insole ${row.insole} (${row.note})`
  ).join('\n');

  const productLines = products
    .map((p) => {
      const stockSummary = Object.entries(p.sizes)
        .map(([color, sizeMap]) => {
          const items = Object.entries(sizeMap)
            .map(([sz, qty]) => `${sz}: ${formatStockStatus(qty, showExactStock)}`)
            .join(', ');
          return `    * Warna ${color} -> ${items}`;
        })
        .join('\n');

      return [
        `- [${p.sku}] ${p.name} (Kategori: ${p.category}) — ${p.priceFormatted}`,
        `  Bahan: ${p.material} | Fit: ${p.fit}`,
        `  Ukuran fisik: ${p.measurements}`,
        `  Perawatan: ${p.care}`,
        `  Gaya & Acara: ${p.style} (${p.occasions})`,
        `  Padanan disarankan: ${p.pairWith}`,
        `  Tips proporsi: ${p.proportionTip}`,
        `  Catatan jujur: ${p.honestNote}`,
        `  Stok live toko saat ini (tersinkronisasi langsung dengan etalase website):`,
        stockSummary,
      ].join('\n');
    })
    .join('\n\n');

  return [
    TALAKA_FAQ_TEXT,
    '',
    'KATEGORI PRODUK TALAKA:',
    '- Sepatu: Sneaker harian & statement dengan sol empuk (contoh: Talaka Aurora Mocca Runner, Talaka Cloud Off-White Chunky, Talaka Aurum Trail Statement).',
    '- Atasan: Kemeja & kaos harian berbahan adem (contoh: Kemeja Linen Talaka, Kaos Oversize Heavyweight).',
    '- Bawahan: Celana potongan rapi dan nyaman (contoh: Celana Kulot High-Waist).',
    '- Outer: Lapisan pelengkap gaya casual/modest (contoh: Outer Boxy Knit Cardigan, Blazer Struktural, Jaket Kulit Faux, Hoodie Fleece).',
    '- Dress: Gaun siluet bersih untuk acara santai maupun semi-formal & syari (contoh: Midi Dress A-Line Flowy, Gamis Linen Modest).',
    '- Aksesoris: Pelengkap fungsional dan gaya (contoh: Tote Canvas Kampus).',
    '',
    'KOLEKSI SESUAI OCCASION / KEGIATAN:',
    '- Kerja / Kantor: Kemeja Oxford Slim (KMJ-010), Celana Bahan Slim (CLN-011), Blazer Struktural (BLZ-012).',
    '- Clubbing / Party / Night Out: Satin Corset Top (TOP-013), Mini Pleated Skirt Metallic (SKR-014), Jaket Kulit Faux (JKT-015).',
    '- Mengaji / Kajian / Syari: Gamis Linen Modest (GMS-016), Khimar Chiffon (KHM-017), Rok Kembang Muslimah (RKU-018).',
    '- Belajar / Home / Cozy: Hoodie Fleece Soft (HDI-019), Jogger Pants Comfort (JGR-020), Kaos Grafis Study Vibes (TSH-021).',
    '- Kampus / Kuliah: Polo Shirt Pique (PLO-022), Chino Stretch Kampus (CHN-023), Tote Canvas Kampus (BAG-024).',
    '',
    'PANDUAN UKURAN PAKAIAN TALAKA (ATASAN REGULAR FIT — ACUAN):',
    sizeLines,
    '',
    'PANDUAN UKURAN SEPATU TALAKA (EU — UNISEX):',
    shoeSizeLines,
    '',
    'KATALOG PRODUK & STOK LIVE TALAKA:',
    productLines,
  ].join('\n');
}

export function buildDefaultTalakaKnowledge(showExactStock = false) {
  return buildTalakaKnowledgeFromProducts(TALAKA_PRODUCTS, showExactStock);
}

export function findMentionedProducts(text, products = TALAKA_PRODUCTS) {
  if (!text) return [];
  const lower = text.toLowerCase();
  return products.filter(
    (p) =>
      lower.includes(p.sku.toLowerCase()) ||
      lower.includes(p.name.toLowerCase())
  );
}
