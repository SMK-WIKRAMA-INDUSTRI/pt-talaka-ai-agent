import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { jsPDF } from 'jspdf';
import { findMentionedProducts } from '../data/talakaCatalog';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const MAX_PDF_BYTES = 15 * 1024 * 1024;
const MAX_EXTRACTED_CHARS = 24000;

/**
 * Ekstrak teks dari file PDF (undangan kerja/acara, itinerary harian, atau setlist outfit)
 * langsung di sisi browser menggunakan pdfjs-dist.
 */
export async function extractTextFromPdfFile(file) {
  if (!file) {
    throw new Error('File PDF tidak ditemukan.');
  }

  const isPdf =
    file.type === 'application/pdf' ||
    file.name.toLowerCase().endsWith('.pdf');
  if (!isPdf) {
    throw new Error('File harus berformat PDF (.pdf).');
  }
  if (file.size > MAX_PDF_BYTES) {
    throw new Error('Ukuran file PDF maksimal 15 MB.');
  }

  const arrayBuffer = await file.arrayBuffer();
  let pdfDoc;
  try {
    pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  } catch (err) {
    if (err?.name === 'PasswordException') {
      throw new Error(
        'File PDF dikunci dengan password. Buka kunci PDF terlebih dahulu sebelum diunggah.'
      );
    }
    throw new Error('Gagal membaca struktur file PDF. Pastikan file tidak rusak.');
  }

  const pageTexts = [];
  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum += 1) {
    const page = await pdfDoc.getPage(pageNum);
    const content = await page.getTextContent();
    const lines = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (lines) {
      pageTexts.push(`[Halaman ${pageNum}]\n${lines}`);
    }
  }

  const combined = pageTexts.join('\n\n').trim();
  if (!combined) {
    throw new Error(
      'PDF tidak berisi teks yang bisa dibaca (kemungkinan hasil scan gambar). Gunakan PDF berbasis teks atau unggah sebagai foto.'
    );
  }

  const trimmed = combined.slice(0, MAX_EXTRACTED_CHARS);
  return {
    fileName: file.name,
    pageCount: pdfDoc.numPages,
    text: trimmed,
    preview: trimmed.replace(/\s+/g, ' ').slice(0, 140),
  };
}

/**
 * Bersihkan karakter non-Latin/emoji agar jsPDF standar tidak menghasilkan karakter aneh,
 * sambil mempertahankan tanda baca Bahasa Indonesia dan merapikan format markdown.
 */
function sanitizeForPdf(raw) {
  return String(raw || '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/`([^`\n]+)`/g, '$1')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/^\s*[-*]\s+/gm, '• ')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/→/g, '->')
    .replace(/[^\x20-\x7E\xA0-\xFF\n•]/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function loadImageAsJpegDataUrl(src) {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const maxSide = 600;
        const ratio = Math.min(1, maxSide / Math.max(img.width, img.height, 1));
        canvas.width = Math.max(1, Math.round(img.width * ratio));
        canvas.height = Math.max(1, Math.round(img.height * ratio));
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve({
          dataUrl: canvas.toDataURL('image/jpeg', 0.88),
          width: canvas.width,
          height: canvas.height,
        });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function isDayOrSectionHeading(line) {
  return /^(hari\s*\d+|day\s*\d+|sesi\s*\d+|acara|undangan|setlist|outfit\s*\d+)/i.test(
    line.trim()
  );
}

/**
 * Export hasil rekomendasi outfit, setlist per hari/acara, foto produk Talaka,
 * dan foto Virtual Try-On (jika ada) menjadi file PDF Lookbook siap unduh.
 */
export async function exportLookbookPdf({
  messages = [],
  products = [],
  customerName = 'Pelanggan Talaka',
  botName = 'Kak Tala',
}) {
  const assistantMessages = messages.filter(
    (m) => m.role === 'assistant' && m.content?.trim()
  );
  if (assistantMessages.length === 0) {
    throw new Error(
      'Belum ada rekomendasi outfit dari Kak Tala untuk di-export ke PDF.'
    );
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const marginX = 16;
  const contentW = pageW - marginX * 2;
  let y = 16;

  const ensureSpace = (neededMm) => {
    if (y + neededMm > pageH - 18) {
      doc.addPage();
      y = 18;
    }
  };

  // 1. Editorial Header Banner
  doc.setFillColor(15, 23, 42); // slate-950
  doc.roundedRect(marginX, y, contentW, 28, 3, 3, 'F');
  doc.setFillColor(158, 123, 102); // mocca #9E7B66
  doc.rect(marginX, y + 25.5, contentW, 2.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('TALAKA.ai', marginX + 6, y + 10.5);

  doc.setFontSize(9);
  doc.setTextColor(214, 194, 180);
  doc.text('PERSONAL STYLE & OUTFIT LOOKBOOK', marginX + 6, y + 16.5);

  const dateLabel = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(226, 232, 240);
  doc.text(
    sanitizeForPdf(`Pelanggan: ${customerName}  |  Kurator: ${botName}  |  ${dateLabel}`),
    marginX + 6,
    y + 22.5
  );

  y += 35;

  // Cek jika user sempat mengunggah PDF dokumen acara/setlist
  const uploadedPdfMsg = messages.find((m) => m.pdfAttachment?.fileName);
  if (uploadedPdfMsg) {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(marginX, y, contentW, 11, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(158, 123, 102);
    doc.text('DOKUMEN ACARA / SETLIST:', marginX + 4, y + 7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text(
      sanitizeForPdf(
        `${uploadedPdfMsg.pdfAttachment.fileName} (${uploadedPdfMsg.pdfAttachment.pageCount} halaman)`
      ),
      marginX + 50,
      y + 7
    );
    y += 16;
  }

  // 2. Section: Rekomendasi Outfit & Jadwal Harian
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Rekomendasi Outfit & Rencana Harian', marginX, y);
  y += 2.5;
  doc.setDrawColor(226, 232, 240);
  doc.line(marginX, y, pageW - marginX, y);
  y += 5;

  for (let i = 0; i < messages.length; i += 1) {
    const msg = messages[i];
    const cleanText = sanitizeForPdf(msg.content);
    if (!cleanText) continue;

    if (msg.role === 'user') {
      const userLines = doc.splitTextToSize(cleanText, contentW - 8);
      const boxH = Math.max(9, userLines.length * 4.4 + 4.5);
      ensureSpace(boxH + 3);
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(marginX, y, contentW, boxH, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('PERTANYAAN / KONTEKS:', marginX + 4, y + 4.5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(userLines, marginX + 4, y + 9);
      y += boxH + 4;
      continue;
    }

    // Assistant recommendation block (highlight Day / Hari headings)
    const paragraphs = cleanText.split('\n');
    for (const para of paragraphs) {
      const trimmed = para.trim();
      if (!trimmed) {
        y += 2;
        continue;
      }

      const heading = isDayOrSectionHeading(trimmed);
      doc.setFont('helvetica', heading ? 'bold' : 'normal');
      doc.setFontSize(heading ? 10 : 9.2);
      doc.setTextColor(heading ? 158 : 30, heading ? 123 : 41, heading ? 102 : 59);

      const wrapped = doc.splitTextToSize(trimmed, contentW - 2);
      const lineStep = heading ? 5 : 4.6;
      ensureSpace(wrapped.length * lineStep + 2);
      doc.text(wrapped, marginX + 1, y + 3.5);
      y += wrapped.length * lineStep + (heading ? 1.5 : 1);
    }
    y += 4;
  }

  // 3. Section: Galeri Foto Produk Rekomendasi Talaka
  const combinedAssistantText = assistantMessages.map((m) => m.content).join('\n');
  const mentionedProducts = findMentionedProducts(combinedAssistantText, products);

  if (mentionedProducts.length > 0) {
    ensureSpace(24);
    y += 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(
      `2. Galeri Foto Produk Rekomendasi (${mentionedProducts.length} Item)`,
      marginX,
      y
    );
    y += 2.5;
    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, y, pageW - marginX, y);
    y += 6;

    const loadedImages = await Promise.all(
      mentionedProducts.map((p) => loadImageAsJpegDataUrl(p.image))
    );

    for (let idx = 0; idx < mentionedProducts.length; idx += 1) {
      const prod = mentionedProducts[idx];
      const imgData = loadedImages[idx];
      const cardH = 38;
      ensureSpace(cardH + 4);

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(marginX, y, contentW, cardH, 3, 3, 'FD');

      const imgBoxX = marginX + 3;
      const imgBoxY = y + 3;
      const imgBoxSize = 32;

      doc.setFillColor(248, 250, 252);
      doc.roundedRect(imgBoxX, imgBoxY, imgBoxSize, imgBoxSize, 2, 2, 'F');

      if (imgData?.dataUrl) {
        const aspect = imgData.width / imgData.height;
        let drawW = imgBoxSize - 2;
        let drawH = drawW / aspect;
        if (drawH > imgBoxSize - 2) {
          drawH = imgBoxSize - 2;
          drawW = drawH * aspect;
        }
        const offsetX = imgBoxX + (imgBoxSize - drawW) / 2;
        const offsetY = imgBoxY + (imgBoxSize - drawH) / 2;
        doc.addImage(imgData.dataUrl, 'JPEG', offsetX, offsetY, drawW, drawH);
      }

      const textX = imgBoxX + imgBoxSize + 5;
      const textMaxW = contentW - imgBoxSize - 12;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(158, 123, 102);
      doc.text(`${prod.sku}  |  ${prod.category.toUpperCase()}`, textX, y + 7);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42);
      doc.text(sanitizeForPdf(prod.name), textX, y + 12.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(158, 123, 102);
      doc.text(sanitizeForPdf(prod.priceFormatted), pageW - marginX - 4, y + 12.5, {
        align: 'right',
      });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.2);
      doc.setTextColor(71, 85, 105);
      const specLine = sanitizeForPdf(
        `Bahan: ${prod.material} | Warna: ${prod.colors.join(', ')}`
      );
      const specWrapped = doc.splitTextToSize(specLine, textMaxW).slice(0, 2);
      doc.text(specWrapped, textX, y + 17.5);

      const noteLine = sanitizeForPdf(`Catatan Jujur: ${prod.honestNote}`);
      const noteWrapped = doc.splitTextToSize(noteLine, textMaxW).slice(0, 2);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.8);
      doc.setTextColor(100, 116, 139);
      doc.text(noteWrapped, textX, y + 27);

      y += cardH + 4;
    }
  }

  // 4. Section: Lampiran Foto Virtual Try-On / Referensi Outfit (jika ada)
  const visualAttachments = [];
  messages.forEach((m) => {
    if (m.generatedImageUrl) {
      visualAttachments.push({
        label: 'Hasil Virtual Try-On Talaka',
        src: m.generatedImageUrl,
      });
    }
    if (m.image?.previewUrl) {
      visualAttachments.push({
        label: `Referensi Outfit (${m.image.name || 'Foto'})`,
        src: m.image.previewUrl,
      });
    }
  });

  if (visualAttachments.length > 0) {
    ensureSpace(58);
    y += 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('3. Lampiran Visual Try-On & Referensi', marginX, y);
    y += 2.5;
    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, y, pageW - marginX, y);
    y += 6;

    const loadedVisuals = await Promise.all(
      visualAttachments.slice(0, 4).map((v) => loadImageAsJpegDataUrl(v.src))
    );

    for (let i = 0; i < loadedVisuals.length; i += 1) {
      const imgData = loadedVisuals[i];
      if (!imgData?.dataUrl) continue;
      const boxH = 54;
      ensureSpace(boxH + 6);

      const aspect = imgData.width / imgData.height;
      let drawH = 44;
      let drawW = drawH * aspect;
      if (drawW > contentW - 10) {
        drawW = contentW - 10;
        drawH = drawW / aspect;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text(sanitizeForPdf(visualAttachments[i].label), marginX, y + 4);
      doc.addImage(imgData.dataUrl, 'JPEG', marginX, y + 6.5, drawW, drawH);
      y += drawH + 12;
    }
  }

  // Footer nomor halaman di semua halaman
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p += 1) {
    doc.setPage(p);
    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, pageH - 12, pageW - marginX, pageH - 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Talaka.ai · PT Talaka Sinar Rekayasa · Lookbook Rekomendasi Outfit Personal',
      marginX,
      pageH - 7.5
    );
    doc.text(`Halaman ${p} / ${totalPages}`, pageW - marginX, pageH - 7.5, {
      align: 'right',
    });
  }

  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  doc.save(`Talaka-Lookbook-${stamp}.pdf`);
}
