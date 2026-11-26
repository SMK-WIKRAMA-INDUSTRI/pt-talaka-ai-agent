import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Package, Cpu } from 'lucide-react';
import ShoeShowcase from './ShoeShowcase';
import ProductCatalogSection from './ProductCatalogSection';
import FeaturePhoneShowcase from './FeaturePhoneShowcase';
import ArcBenefitsCarousel from './ArcBenefitsCarousel';
import OmnichannelSection from './OmnichannelSection';
import WorkflowComparisonCanvas from './WorkflowComparisonCanvas';
import talakaLogo from '../assets/talaka-logo.svg';
import { GlyphBackground } from './ui/backgrounds-glyph';

export default function LandingPage({
  onScrollToChat,
  onSelectSamplePrompt,
  onOpenPresentation,
  onOpenAdmin,
  onOpenMyOrders,
  unreadNotifCount = 0,
  currentUser,
  onOpenLogin,
  onLogout,
  products,
  showExactStock,
  onUpdateStock,
  onResetProducts,
  onAskProduct,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const rootRef          = useRef(null);
  const navRef           = useRef(null);
  const navLogoRef       = useRef(null);
  const hasMountedNavRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── GSAP Morph Animation: Snug Flush Top Bar → Compact Floating Glass Pill on Scroll ── */
  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    const targetVars = isScrolled
      ? {
          y: 14,
          columnGap: 14,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          paddingTop: 7,
          paddingBottom: 7,
          paddingLeft: 14,
          paddingRight: 14,
          backgroundColor: 'rgba(255, 255, 255, 0.60)',
          borderColor: 'rgba(255, 255, 255, 0.78)',
          boxShadow:
            '0 14px 36px rgba(15, 23, 42, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
        }
      : {
          y: -1,
          columnGap: 24,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 22,
          borderBottomRightRadius: 22,
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 18,
          paddingRight: 18,
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          borderColor: 'rgba(226, 232, 240, 0.88)',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
        };

    if (!hasMountedNavRef.current) {
      hasMountedNavRef.current = true;
      gsap.set(navEl, targetVars);
      if (navLogoRef.current) {
        gsap.set(navLogoRef.current, { scale: isScrolled ? 0.9 : 1 });
      }
      return;
    }

    gsap.to(navEl, {
      ...targetVars,
      duration: 0.5,
      ease: 'power3.out',
      overwrite: 'auto',
    });

    if (navLogoRef.current) {
      gsap.to(navLogoRef.current, {
        scale: isScrolled ? 0.9 : 1,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
  }, [isScrolled]);

  return (
    <div ref={rootRef} className="relative w-full bg-white text-slate-900 selection:bg-slate-900 selection:text-white overflow-x-clip">
      
      {/* Subtle High-Tech Background Grid & Radial Glows */}
      <div className="absolute inset-0 bg-tech-grid opacity-70 pointer-events-none -z-10" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-blue-50/50 via-slate-50/30 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-[#9E7B66]/5 blur-3xl rounded-full pointer-events-none -z-10" />

      {/* ═══════════════════════════ 1. NAVBAR (GSAP Morph: Snug Flush Top → Compact Floating Glass Pill) ═══════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 pointer-events-none">
        <nav
          ref={navRef}
          className="pointer-events-auto inline-flex w-fit max-w-full items-center gap-6 border backdrop-blur-2xl backdrop-saturate-150 will-change-transform"
        >
          {/* Brand Logo (Khusus Logo Saja) */}
          <a
            href="#koleksi-3d"
            aria-label="Talaka Home"
            className="flex items-center shrink-0 group"
          >
            <img
              ref={navLogoRef}
              src={talakaLogo}
              alt="Talaka Logo"
              className="h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </a>

          {/* Concise Links (Hanya beberapa bagian utama) */}
          <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-slate-600">
            <a href="#katalog-produk" className="whitespace-nowrap hover:text-slate-950 transition-colors">
              Katalog
            </a>
            <a href="#fitur-utama" className="whitespace-nowrap hover:text-slate-950 transition-colors">
              Fitur AI
            </a>
            <a href="#manfaat-toko" className="whitespace-nowrap hover:text-slate-950 transition-colors">
              Keunggulan
            </a>
          </div>

          {/* CTA Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenMyOrders && (
              <button
                type="button"
                onClick={onOpenMyOrders}
                className="relative hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-slate-900 hover:text-slate-950 transition-all cursor-pointer whitespace-nowrap"
                title="Lacak progres paket & notifikasi AI"
              >
                <Package className="h-3.5 w-3.5 text-[#9E7B66]" />
                <span>Pesanan</span>
                {unreadNotifCount > 0 && (
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>
            )}

            {currentUser?.role === 'admin' && onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1 rounded-full bg-[#9E7B66] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#8a6854] transition-all cursor-pointer whitespace-nowrap shadow-xs"
                title="Buka Dashboard Admin"
              >
                <span>Dashboard</span>
              </button>
            )}

            {onOpenPresentation && (
              <button
                type="button"
                onClick={onOpenPresentation}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-slate-400 hover:text-slate-950 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Presentasi</span>
              </button>
            )}

            {currentUser ? (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-slate-50/90 pl-2.5 pr-1.5 py-1 text-xs whitespace-nowrap">
                <span className="font-bold text-slate-900 max-w-[90px] truncate">
                  {currentUser.username}
                </span>
                {currentUser.role === 'admin' && (
                  <span className="rounded-full bg-[#9E7B66]/15 text-[#9E7B66] px-1.5 py-0.5 text-[9px] font-mono font-bold">
                    ADMIN
                  </span>
                )}
                <button
                  type="button"
                  onClick={onLogout}
                  className="rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition cursor-pointer"
                >
                  Keluar
                </button>
              </div>
            ) : (
              onOpenLogin && (
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200/90 bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-slate-900 hover:text-slate-950 transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Masuk</span>
                </button>
              )
            )}

            <button
              type="button"
              onClick={onScrollToChat}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-black transition-all cursor-pointer whitespace-nowrap"
            >
              <Cpu className="h-3.5 w-3.5 text-[#9E7B66]" />
              <span className="hidden sm:inline">Chatbot</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Spacer for fixed top navbar so hero content starts cleanly below it */}
      <div className="h-16" aria-hidden="true" />

      {/* ═══════════════════════════ 2. HERO SECTION (100% RESTORED ROTATING HUB + CABLES + GLYPH BG) ═══════════════════════════ */}
      <section id="koleksi-3d" className="relative overflow-hidden">
        <GlyphBackground
          className="relative pt-12 pb-24 md:pt-16 md:pb-32 w-full"
          glowColor="#94a3b8"
          shapeColor="#9E7B66"
          fontSize={10}
          interactive={true}
        >
          {/* 3D Rotating Shoe Showcase (Persis Foto 2) */}
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 flex flex-col items-center text-center">
            <ShoeShowcase
              onSelectSamplePrompt={onSelectSamplePrompt}
              onScrollToChat={onScrollToChat}
            />
          </div>

          {/* Soft feathered blur transition at bottom of Hero section (no harsh cutoff line!) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-white/75 to-white backdrop-blur-[2px] z-20"
          />
        </GlyphBackground>
      </section>

      {/* ═══════════════════════════ 2.5 LIVE PRODUCT CATALOG (SYNCED WITH AI) ═══════════════════════════ */}
      <ProductCatalogSection
        products={products}
        showExactStock={showExactStock}
        isAdmin={currentUser?.role === 'admin'}
        onOpenLogin={onOpenLogin}
        onUpdateStock={onUpdateStock}
        onResetProducts={onResetProducts}
        onAskProduct={onAskProduct}
      />

      {/* ═══════════════════════════ 3. INTERACTIVE PHONE FEATURE SHOWCASE ═══════════════════════════ */}
      <FeaturePhoneShowcase
        onSelectSamplePrompt={onSelectSamplePrompt}
        onScrollToChat={onScrollToChat}
      />

      {/* ═══════════════════════════ 4. CURVED ARC CAROUSEL (Photo 2 Inspired) ═══════════════════════════ */}
      <ArcBenefitsCarousel
        onSelectSamplePrompt={onSelectSamplePrompt}
        onScrollToChat={onScrollToChat}
      />

      {/* ═══════════════════════════ 4.5 INTERACTIVE FOLDER & FLOATING TILES (Photo 3 Inspired) ═══════════════════════════ */}
      <OmnichannelSection onScrollToChat={onScrollToChat} />

      {/* ═══════════════════════════ 5. DOTTED WORKFLOW NODE CANVAS (Photo 1 Inspired) ═══════════════════════════ */}
      <WorkflowComparisonCanvas onScrollToChat={onScrollToChat} />

    </div>
  );
}
