import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Globe,
  Megaphone,
  RefreshCw,
  Save,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Wand2,
} from 'lucide-react';
import {
  formatReportDigestForMessenger,
  generateThreeDayAiReport,
  simulateProductPrediction,
} from '../services/analyticsAi';
import {
  APIFY_ACTOR_CATALOG,
  loadApifyConfig,
  saveApifyConfig,
  syncSocialTrendsFromApify,
} from '../services/apifyTrends';
import { dispatchOmnichannelMessage } from '../services/omnichannel';
import {
  fetchAiReportsFromDb,
  fetchRecentChatMessagesFromDb,
  fetchSocialTrendsFromDb,
  saveAiReportToDb,
} from '../services/supabase';

const PLATFORM_BADGES = {
  tiktok: 'bg-slate-900 text-white',
  instagram: 'bg-pink-600 text-white',
  threads: 'bg-neutral-800 text-white',
  x: 'bg-sky-600 text-white',
};

function formatDateTime(iso) {
  try {
    return new Date(iso).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '-';
  }
}

export default function AdminAnalyticsTab({ products, orders }) {
  const [subView, setSubView] = useState('reports');
  const [reports, setReports] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState('');
  const [socialTrends, setSocialTrends] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingDigest, setIsSendingDigest] = useState(false);
  const [feedbackBanner, setFeedbackBanner] = useState('');

  // Simulator Prediksi Produk State
  const [simName, setSimName] = useState('');
  const [simCategory, setSimCategory] = useState('Outer');
  const [simPrice, setSimPrice] = useState('329000');
  const [simNotes, setSimNotes] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState(null);

  // Apify Social Radar State (Tahap D)
  const [apifyCfg, setApifyCfg] = useState(() => loadApifyConfig());
  const [isSyncingApify, setIsSyncingApify] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([fetchAiReportsFromDb(), fetchSocialTrendsFromDb()]).then(
      ([repList, trendList]) => {
        if (!active) return;
        setReports(repList);
        if (repList[0]) setSelectedReportId(repList[0].id);
        setSocialTrends(trendList);
      }
    );
    return () => {
      active = false;
    };
  }, []);

  const activeReport =
    reports.find((r) => r.id === selectedReportId) || reports[0] || null;

  async function handleGenerateReportNow() {
    if (isGenerating) return;
    setIsGenerating(true);
    setFeedbackBanner('');
    try {
      const [recentChats, trends] = await Promise.all([
        fetchRecentChatMessagesFromDb(40),
        fetchSocialTrendsFromDb(),
      ]);
      setSocialTrends(trends);

      const generated = await generateThreeDayAiReport({
        products,
        orders,
        chatMessages: recentChats,
        socialTrends: trends,
        triggeredBy: 'manual',
      });

      const { report } = await saveAiReportToDb(generated);
      setReports((prev) => [report, ...prev]);
      setSelectedReportId(report.id);
      setFeedbackBanner(
        `Laporan "${report.reportTitle}" berhasil dibuat dan disimpan!`
      );
    } catch (err) {
      setFeedbackBanner(err.message || 'Gagal menjalankan analisis AI.');
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSendDigestToAdmin() {
    if (!activeReport || isSendingDigest) return;
    setIsSendingDigest(true);
    setFeedbackBanner('');
    try {
      const digestText = formatReportDigestForMessenger(activeReport);
      const res = await dispatchOmnichannelMessage({
        message: digestText,
        sendToAdmin: true,
      });
      if (res.telegramSent || res.whatsappSent) {
        setFeedbackBanner(
          `Ringkasan laporan terkirim ke Admin (${[
            res.telegramSent ? 'Telegram' : null,
            res.whatsappSent ? 'WhatsApp' : null,
          ]
            .filter(Boolean)
            .join(' & ')})!`
        );
      } else {
        setFeedbackBanner(
          res.notes.join(' · ') ||
            'Isi token Bot Telegram / Fonnte WA di tab "Bot Telegram & WA" dulu untuk kirim ringkasan.'
        );
      }
    } finally {
      setIsSendingDigest(false);
    }
  }

  async function handleRunSimulation(e) {
    e.preventDefault();
    if (!simName.trim() || isSimulating) return;
    setIsSimulating(true);
    try {
      const result = await simulateProductPrediction({
        productName: simName.trim(),
        category: simCategory,
        price: Number(simPrice) || 250000,
        targetNotes: simNotes.trim(),
        products,
        socialTrends,
      });
      setSimResult(result);
    } finally {
      setIsSimulating(false);
    }
  }

  function handleTogglePlatform(platformId) {
    setApifyCfg((prev) => {
      const exists = prev.platforms.includes(platformId);
      const nextPlatforms = exists
        ? prev.platforms.filter((p) => p !== platformId)
        : [...prev.platforms, platformId];
      return {
        ...prev,
        platforms: nextPlatforms.length > 0 ? nextPlatforms : [platformId],
      };
    });
  }

  async function handleSyncApifyNow(e) {
    e?.preventDefault?.();
    if (isSyncingApify) return;
    setIsSyncingApify(true);
    setFeedbackBanner('');
    saveApifyConfig(apifyCfg);

    try {
      const result = await syncSocialTrendsFromApify(apifyCfg);
      const refreshed = await fetchSocialTrendsFromDb();
      setSocialTrends(refreshed);
      const warnText =
        result.errors?.length > 0
          ? ` (Catatan: ${result.errors.join('; ')})`
          : '';
      setFeedbackBanner(
        `Berhasil menarik ${result.rawCount} konten sosmed via Apify → diringkas menjadi ${result.trends.length} tren baru & tersimpan!${warnText}`
      );
    } catch (err) {
      setFeedbackBanner(err.message || 'Gagal sinkronisasi data Apify.');
    } finally {
      setIsSyncingApify(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Top Schedule & Mode Switcher */}
      <div className="rounded-3xl bg-white border border-[#E6DDD4] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0">
            <CalendarClock className="w-5 h-5 text-[#D6B7A5]" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-950 flex items-center gap-2">
              <span>Jadwal Laporan Otomatis: Setiap 3 Hari Sekali</span>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-700">
                CRON 0 2 */3 * *
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Menggabungkan {socialTrends.length} sinyal tren sosmed (TikTok, IG,
              Threads, X) + {orders.length} order + data stok &amp; chat live.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-2xl bg-[#FAF7F4] border border-[#E6DDD4] p-1">
            <button
              type="button"
              onClick={() => setSubView('reports')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                subView === 'reports'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Laporan 3 Harian</span>
            </button>
            <button
              type="button"
              onClick={() => setSubView('simulator')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                subView === 'simulator'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Prediksi Produk</span>
            </button>
            <button
              type="button"
              onClick={() => setSubView('apify')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                subView === 'apify'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Radar Sosmed (Apify)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleGenerateReportNow}
            disabled={isGenerating}
            className="rounded-2xl bg-[#9E7B66] hover:bg-[#8a6854] text-white px-4 py-2 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shadow-xs"
          >
            {isGenerating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>
              {isGenerating
                ? 'AI Sedang Menganalisis...'
                : 'Jalankan Analisis Sekarang'}
            </span>
          </button>
        </div>
      </div>

      {feedbackBanner && (
        <div className="rounded-2xl border border-[#9E7B66]/30 bg-[#9E7B66]/10 px-4 py-3 text-xs font-semibold text-slate-900 flex items-center justify-between gap-2">
          <span>{feedbackBanner}</span>
          <button
            type="button"
            onClick={() => setFeedbackBanner('')}
            className="font-bold text-slate-600 hover:text-slate-950 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* ═══════════════════ SUB-VIEW 1: LAPORAN 3 HARIAN ═══════════════════ */}
      {subView === 'reports' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* History List */}
          <div className="xl:col-span-4 space-y-2.5">
            <div className="text-[11px] font-mono font-bold text-slate-500 px-1">
              RIWAYAT LAPORAN ({reports.length})
            </div>
            {reports.length === 0 ? (
              <div className="rounded-3xl bg-white border border-[#E6DDD4] p-6 text-center space-y-2">
                <Sparkles className="w-7 h-7 text-[#9E7B66] mx-auto" />
                <div className="text-xs font-bold text-slate-900">
                  Belum ada laporan tersimpan
                </div>
                <p className="text-[11px] text-slate-500">
                  Klik tombol <strong>Jalankan Analisis Sekarang</strong> di
                  kanan atas untuk langsung melihat hasil analisis AI tanpa
                  menunggu 3 hari!
                </p>
              </div>
            ) : (
              reports.map((rep) => (
                <button
                  key={rep.id}
                  type="button"
                  onClick={() => setSelectedReportId(rep.id)}
                  className={`w-full text-left rounded-3xl border p-4 transition cursor-pointer space-y-1.5 ${
                    activeReport?.id === rep.id
                      ? 'bg-white border-slate-900 ring-2 ring-slate-900/10 shadow-sm'
                      : 'bg-white border-[#E6DDD4] hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-mono font-bold text-slate-700">
                      {rep.triggeredBy === 'cron_3d' ? 'AUTO 3 HARI' : 'MANUAL'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {formatDateTime(rep.createdAt)}
                    </span>
                  </div>
                  <div className="text-xs font-extrabold text-slate-950">
                    {rep.reportTitle}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {rep.summary}
                  </p>
                </button>
              ))
            )}

            {/* Social Trend Feed Box */}
            <div className="rounded-3xl bg-white border border-[#E6DDD4] p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#9E7B66]">
                  SINYAL TREN SOSMED AKTIF
                </span>
                <button
                  type="button"
                  onClick={() => setSubView('apify')}
                  className="text-[10px] font-mono font-bold text-slate-700 underline hover:text-slate-950 cursor-pointer"
                >
                  Sync Apify →
                </button>
              </div>
              <div className="space-y-2">
                {socialTrends.slice(0, 4).map((t) => (
                  <div
                    key={t.id}
                    className="rounded-2xl bg-[#FAF7F4] border border-[#E6DDD4]/80 p-2.5 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase ${
                          PLATFORM_BADGES[t.platform] || 'bg-slate-800 text-white'
                        }`}
                      >
                        {t.platform}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-700">
                        Score {t.engagementScore}
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-slate-900">
                      {t.topic}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Report Viewer */}
          <div className="xl:col-span-8">
            {activeReport ? (
              <div className="rounded-3xl bg-white border border-[#E6DDD4] p-5 sm:p-6 shadow-xs space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="inline-block rounded-full bg-[#9E7B66]/10 border border-[#9E7B66]/25 px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#9E7B66]">
                      {activeReport.periodLabel || 'LAPORAN ANALISIS AI'}
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-slate-950 mt-1">
                      {activeReport.reportTitle}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendDigestToAdmin}
                    disabled={isSendingDigest}
                    className="rounded-xl bg-slate-900 text-white px-3.5 py-2 text-xs font-bold hover:bg-black transition cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5 text-[#D6B7A5]" />
                    <span>
                      {isSendingDigest
                        ? 'Mengirim...'
                        : 'Kirim ke Telegram / WA'}
                    </span>
                  </button>
                </div>

                {/* Executive Summary */}
                <div className="rounded-2xl bg-[#FAF7F4] border border-[#E6DDD4] p-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {activeReport.summary}
                </div>

                {/* Trending Highlights */}
                {activeReport.trendingHighlights?.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="text-xs font-extrabold text-slate-950 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-[#9E7B66]" />
                      <span>Sorotan Tren Media Sosial</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activeReport.trendingHighlights.map((item, i) => (
                        <div
                          key={i}
                          className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
                                PLATFORM_BADGES[
                                  String(item.platform || '').toLowerCase()
                                ] || 'bg-slate-800 text-white'
                              }`}
                            >
                              {item.platform}
                            </span>
                            <span className="text-xs font-mono font-black text-emerald-600">
                              {item.growth}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-slate-950">
                            {item.topic}
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {item.keyFinding}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Target Audience & Store Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-200 p-4 space-y-2">
                    <div className="text-xs font-extrabold text-slate-950 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-[#9E7B66]" />
                      <span>Target Penjualan Optimal</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">
                      {activeReport.targetAudience?.primarySegment || '-'}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Usia:{' '}
                      <strong>
                        {activeReport.targetAudience?.ageRange || '-'}
                      </strong>{' '}
                      · Jam Ramai:{' '}
                      <strong>
                        {activeReport.targetAudience?.peakHours || '-'}
                      </strong>
                    </div>
                    <ul className="list-disc pl-4 text-[11px] text-slate-600 space-y-1 pt-1">
                      {(activeReport.targetAudience?.keyPainPoints || []).map(
                        (pt, i) => (
                          <li key={i}>{pt}</li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 space-y-2.5">
                    <div className="text-xs font-extrabold text-slate-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Insight Internal Toko &amp; Stok</span>
                    </div>
                    {(activeReport.storeInsights || []).map((ins, i) => (
                      <div
                        key={i}
                        className="rounded-xl bg-[#FAF7F4] border border-[#E6DDD4] p-2.5 text-[11px] space-y-1"
                      >
                        <div className="font-bold text-slate-950">
                          {ins.title}
                        </div>
                        <p className="text-slate-600">{ins.detail}</p>
                        <div className="font-semibold text-[#9E7B66]">
                          Aksi: {ins.action}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Promo Recommendations */}
                {activeReport.promoRecommendations?.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="text-xs font-extrabold text-slate-950 flex items-center gap-1.5">
                      <Megaphone className="w-4 h-4 text-[#9E7B66]" />
                      <span>Rekomendasi Strategi Promosi &amp; Bundling</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activeReport.promoRecommendations.map((promo, i) => (
                        <div
                          key={i}
                          className="rounded-2xl bg-slate-900 text-white p-4 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-extrabold text-[#D6B7A5]">
                              {promo.campaignName}
                            </span>
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-mono">
                              {promo.channel}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-200">
                            <strong>Produk:</strong> {promo.bundleItems}
                          </div>
                          <div className="text-[11px] text-emerald-300 font-semibold">
                            Promo: {promo.offer}
                          </div>
                          <div className="rounded-xl bg-white/10 p-2.5 text-[11px] italic text-slate-200">
                            Hook Konten: {promo.hookContent}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-3xl bg-white border border-[#E6DDD4] p-10 text-center space-y-3">
                <BarChart3 className="w-10 h-10 text-slate-300 mx-auto" />
                <div className="text-sm font-extrabold text-slate-900">
                  Siap Membuat Laporan Analisis AI Pertama!
                </div>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Klik tombol <strong>Jalankan Analisis Sekarang</strong> di atas
                  untuk menguji output laporan 3 harian (tren sosmed, target
                  pembeli, stok kritis, dan ide promosi).
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════ SUB-VIEW 2: SIMULATOR PREDIKSI PRODUK ═══════════════════ */}
      {subView === 'simulator' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* Input Form */}
          <form
            onSubmit={handleRunSimulation}
            className="xl:col-span-5 rounded-3xl bg-white border border-[#E6DDD4] p-5 space-y-4 shadow-xs"
          >
            <div>
              <span className="inline-block rounded-full bg-[#9E7B66]/10 border border-[#9E7B66]/25 px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#9E7B66]">
                WHAT-IF PRODUCT FORECAST
              </span>
              <h3 className="text-base font-black text-slate-950 mt-1">
                Simulasi Prediksi Penjualan Produk Baru
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Uji rencana produk sebelum produksi — AI memprediksi skor laku,
                estimasi omset, risiko retur, dan strategi promosinya.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">
                  NAMA PRODUK YANG INGIN DIJUAL
                </label>
                <input
                  type="text"
                  required
                  value={simName}
                  onChange={(e) => setSimName(e.target.value)}
                  placeholder="Contoh: Jaket Denim Oversize Vintage Wash"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">
                    KATEGORI
                  </label>
                  <select
                    value={simCategory}
                    onChange={(e) => setSimCategory(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
                  >
                    <option value="Atasan">Atasan</option>
                    <option value="Bawahan">Bawahan</option>
                    <option value="Outer">Outer / Jaket</option>
                    <option value="Dress">Dress</option>
                    <option value="Sepatu">Sepatu / Sneaker</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">
                    RENCANA HARGA (RP)
                  </label>
                  <input
                    type="number"
                    min={50000}
                    step={1000}
                    value={simPrice}
                    onChange={(e) => setSimPrice(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">
                  DETAIL BAHAN / TARGET / KEUNGGULAN (OPSIONAL)
                </label>
                <textarea
                  rows={3}
                  value={simNotes}
                  onChange={(e) => setSimNotes(e.target.value)}
                  placeholder="Contoh: Bahan denim 12oz adem, unisex, warna earth-tone mocca & charcoal, target mahasiswa..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSimulating || !simName.trim()}
              className="w-full rounded-2xl bg-slate-900 hover:bg-black text-white py-3 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {isSimulating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4 text-[#D6B7A5]" />
              )}
              <span>
                {isSimulating
                  ? 'AI Sedang Menghitung Prediksi...'
                  : 'Prediksi Hasil Penjualan'}
              </span>
            </button>
          </form>

          {/* Forecast Output */}
          <div className="xl:col-span-7">
            {simResult ? (
              <div className="rounded-3xl bg-white border border-[#E6DDD4] p-5 sm:p-6 shadow-xs space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="text-[10px] font-mono font-bold text-[#9E7B66]">
                      HASIL SIMULASI AI FORECAST
                    </div>
                    <h3 className="text-lg font-black text-slate-950">
                      {simResult.productName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-600">
                      {simResult.demandScore}
                      <span className="text-xs text-slate-400 font-mono">
                        /100
                      </span>
                    </div>
                    <span className="inline-block rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      {simResult.verdict}
                    </span>
                  </div>
                </div>

                {/* Score Bar */}
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${simResult.demandScore}%` }}
                  />
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-[#FAF7F4] border border-[#E6DDD4] p-3.5">
                    <div className="text-[10px] font-mono font-bold text-slate-500">
                      ESTIMASI TERJUAL
                    </div>
                    <div className="text-sm font-black text-slate-950 mt-1">
                      {simResult.estimatedMonthlyUnits}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[#FAF7F4] border border-[#E6DDD4] p-3.5">
                    <div className="text-[10px] font-mono font-bold text-slate-500">
                      ESTIMASI OMSET / BLN
                    </div>
                    <div className="text-sm font-black text-[#9E7B66] mt-1">
                      {simResult.estimatedMonthlyRevenue}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[#FAF7F4] border border-[#E6DDD4] p-3.5">
                    <div className="text-[10px] font-mono font-bold text-slate-500">
                      HARGA IDEAL AI
                    </div>
                    <div className="text-sm font-black text-slate-950 mt-1">
                      {simResult.recommendedPriceRange}
                    </div>
                  </div>
                </div>

                {/* Target & Return Risk */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl border border-slate-200 p-4 space-y-1.5">
                    <div className="font-extrabold text-slate-950 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-[#9E7B66]" />
                      <span>Target Pembeli Paling Cocok</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {simResult.targetBuyerPersona}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-1.5">
                    <div className="font-extrabold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Risiko Retur: {simResult.returnRiskLevel}</span>
                    </div>
                    <p className="text-amber-900/80 leading-relaxed">
                      {simResult.returnRiskReason}
                    </p>
                  </div>
                </div>

                {/* Promo Angles */}
                <div className="rounded-2xl bg-slate-900 text-white p-4 space-y-2">
                  <div className="text-xs font-extrabold text-[#D6B7A5] flex items-center gap-1.5">
                    <Megaphone className="w-4 h-4" />
                    <span>3 Ide Strategi Promosi Siap Pakai</span>
                  </div>
                  <ul className="list-disc pl-4 text-xs text-slate-200 space-y-1.5">
                    {(simResult.promoAngles || []).map((ang, i) => (
                      <li key={i}>{ang}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl bg-white border border-[#E6DDD4] p-10 text-center space-y-3">
                <Wand2 className="w-10 h-10 text-slate-300 mx-auto" />
                <div className="text-sm font-extrabold text-slate-900">
                  Masukkan Rencana Produk di Sebelah Kiri
                </div>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Contoh: ketik <strong>Jaket Denim Oversize</strong> harga{' '}
                  <strong>Rp329.000</strong> lalu klik{' '}
                  <strong>Prediksi Hasil Penjualan</strong> untuk melihat
                  simulasi AI secara instan.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════ SUB-VIEW 3: RADAR SOSMED APIFY (TAHAP D) ═══════════════════ */}
      {subView === 'apify' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* Apify Config & Trigger Form */}
          <form
            onSubmit={handleSyncApifyNow}
            className="xl:col-span-5 rounded-3xl bg-white border border-[#E6DDD4] p-5 space-y-4 shadow-xs"
          >
            <div>
              <span className="inline-block rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-700">
                BACKEND APIFY SCRAPER · TOKEN AMAN DI SERVER
              </span>
              <h3 className="text-base font-black text-slate-950 mt-1">
                Tarik Tren TikTok, IG, Threads &amp; X
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Menjalankan Actor Apify lewat backend{' '}
                <code className="rounded bg-slate-100 px-1 font-mono">
                  /api/sync-trends
                </code>{' '}
                (token disimpan aman di{' '}
                <code className="rounded bg-slate-100 px-1 font-mono">
                  .env
                </code>{' '}
                server), lalu diringkas otomatis oleh AI ke{' '}
                <code className="rounded bg-slate-100 px-1 font-mono">
                  social_trends
                </code>
                .
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1.5">
                  PILIH PLATFORM SOSMED
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'tiktok', label: 'TikTok' },
                    { id: 'instagram', label: 'Instagram' },
                    { id: 'threads', label: 'Threads' },
                    { id: 'x', label: 'X (Twitter)' },
                  ].map((plat) => {
                    const active = apifyCfg.platforms.includes(plat.id);
                    return (
                      <button
                        key={plat.id}
                        type="button"
                        onClick={() => handleTogglePlatform(plat.id)}
                        className={`rounded-xl px-3 py-2 text-xs font-bold border transition cursor-pointer text-left flex items-center justify-between ${
                          active
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{plat.label}</span>
                        <span className="text-[10px] font-mono">
                          {active ? 'ON' : 'OFF'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">
                  HASHTAG FASHION TARGET (PISAHKAN KOMA, MAKS 3)
                </label>
                <input
                  type="text"
                  value={apifyCfg.hashtagsText}
                  onChange={(e) =>
                    setApifyCfg((prev) => ({
                      ...prev,
                      hashtagsText: e.target.value,
                    }))
                  }
                  placeholder="ootdindonesia, fashionlokal, kemejalinen"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">
                    LIMIT ITEM / PLATFORM
                  </label>
                  <select
                    value={apifyCfg.limitPerPlatform}
                    onChange={(e) =>
                      setApifyCfg((prev) => ({
                        ...prev,
                        limitPerPlatform: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
                  >
                    <option value={5}>5 item (Super Hemat)</option>
                    <option value={10}>10 item (Disarankan)</option>
                    <option value={15}>15 item (Detail)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">
                    IG REELS USERNAME (OPSIONAL)
                  </label>
                  <input
                    type="text"
                    value={apifyCfg.instagramUsername}
                    onChange={(e) =>
                      setApifyCfg((prev) => ({
                        ...prev,
                        instagramUsername: e.target.value,
                      }))
                    }
                    placeholder="Kosongkan = Hashtag"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 rounded-2xl bg-[#FAF7F4] border border-[#E6DDD4] px-3 py-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(apifyCfg.includeTikTokComments)}
                  onChange={(e) =>
                    setApifyCfg((prev) => ({
                      ...prev,
                      includeTikTokComments: e.target.checked,
                    }))
                  }
                  className="rounded border-slate-300"
                />
                <span>
                  Ikut tarik 15 komentar video TikTok teratas (sentimen sizing)
                </span>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="submit"
                disabled={isSyncingApify}
                className="flex-1 rounded-2xl bg-slate-900 hover:bg-black text-white py-2.5 px-4 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                {isSyncingApify ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Globe className="w-3.5 h-3.5 text-[#D6B7A5]" />
                )}
                <span>
                  {isSyncingApify
                    ? 'Menarik Data dari Apify...'
                    : 'Tarik Tren Sekarang (Apify)'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  saveApifyConfig(apifyCfg);
                  setFeedbackBanner('Pengaturan Apify tersimpan di browser.');
                }}
                className="rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3.5 py-2.5 text-xs font-bold cursor-pointer flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan</span>
              </button>
            </div>
          </form>

          {/* Right Side: Live Trend Cards + Actor Directory */}
          <div className="xl:col-span-7 space-y-4">
            <div className="rounded-3xl bg-white border border-[#E6DDD4] p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="text-xs font-extrabold text-slate-950 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#9E7B66]" />
                  <span>
                    Dataset Tren Sosmed Aktif ({socialTrends.length} Item)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  ENDPOINT: /api/sync-trends
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {socialTrends.slice(0, 6).map((t) => (
                  <div
                    key={t.id}
                    className="rounded-2xl bg-[#FAF7F4] border border-[#E6DDD4] p-3.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[9px] font-mono font-bold uppercase ${
                          PLATFORM_BADGES[t.platform] ||
                          'bg-slate-800 text-white'
                        }`}
                      >
                        {t.platform}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-700">
                        Score {t.engagementScore} · {t.sentiment}
                      </span>
                    </div>
                    <div className="text-xs font-extrabold text-slate-950">
                      {t.topic}
                    </div>
                    {t.hashtag && (
                      <div className="text-[10px] font-mono text-[#9E7B66]">
                        {t.hashtag}
                      </div>
                    )}
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {t.insight || t.sampleCaption}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Connected Apify Actors & MCP Reference */}
            <div className="rounded-3xl bg-white border border-[#E6DDD4] p-5 space-y-3 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-extrabold text-slate-950">
                  Arsitektur Apify Actors &amp; MCP Ready
                </div>
                <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-mono font-bold text-slate-700">
                  MCP: https://mcp.apify.com
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {APIFY_ACTOR_CATALOG.map((actor) => (
                  <div
                    key={actor.actorId}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 space-y-0.5"
                  >
                    <div className="text-[11px] font-bold text-slate-950">
                      {actor.label}
                    </div>
                    <div className="text-[10px] font-mono text-[#9E7B66]">
                      {actor.actorId}
                    </div>
                    <p className="text-[10px] text-slate-500">{actor.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
