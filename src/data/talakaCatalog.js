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
    '- Outer: Lapisan pelengkap gaya casual/modest (contoh: Outer Boxy Knit Cardigan).',
    '- Dress: Gaun siluet bersih untuk acara santai maupun semi-formal (contoh: Midi Dress A-Line Flowy).',
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
