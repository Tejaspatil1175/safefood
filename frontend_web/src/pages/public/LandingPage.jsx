import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Menu,
  X,
  Check,
  AlertTriangle,
  ChevronRight,
  Search,
  CheckCircle2,
  ArrowRight,
  Users,
  ShieldAlert,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────── */
/*  SafeFood Landing Page – Exact replica of the reference    */
/*  design. Clean, flat, no glow/glossy effects.              */
/* ─────────────────────────────────────────────────────────── */

export const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased">
      {/* ══════════════════════════════════════════════════════ */}
      {/*  NAVBAR                                               */}
      {/* ══════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-[#0B3D2B]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-[#28B463] flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-white stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-[22px] tracking-tight text-white">
              Safe<span className="text-[#4ADE80]">Food</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-white/85">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#features" className="hover:text-white transition-colors">App Features</a>
            <a href="#api" className="hover:text-white transition-colors">API / Businesses</a>
            <a href="#stories" className="hover:text-white transition-colors">Success Stories</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          {/* Download App Button */}
          <div className="hidden sm:block">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F5C518] hover:bg-[#e6b800] text-[#1a1a1a] text-sm font-bold transition-colors"
            >
              Download App
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white/90"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0B3D2B] border-t border-white/10 px-5 py-5 space-y-4">
            <nav className="flex flex-col gap-3 text-sm font-medium text-white/90">
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-1">How It Works</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-1">App Features</a>
              <a href="#api" onClick={() => setMobileMenuOpen(false)} className="py-1">API / Businesses</a>
              <a href="#stories" onClick={() => setMobileMenuOpen(false)} className="py-1">Success Stories</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-1">Contact</a>
            </nav>
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-full bg-[#F5C518] text-[#1a1a1a] font-bold text-sm text-center"
              >
                Download App
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-full border border-white/30 text-white font-medium text-sm text-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════════════════════ */}
      {/*  HERO SECTION                                         */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="relative bg-[#0B3D2B] overflow-hidden">
        {/* Orange circle blob — bottom right like the photo */}
        <div className="absolute bottom-[-120px] right-[-80px] w-[480px] h-[480px] rounded-full bg-[#E8632B] opacity-90 pointer-events-none" />

        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center py-12 lg:py-16">

            {/* ── Left Column: Copy ── */}
            <div className="space-y-6 text-center lg:text-left max-w-[580px] mx-auto lg:mx-0">
              <h1 className="text-[38px] sm:text-[46px] lg:text-[52px] font-extrabold text-white leading-[1.12] tracking-tight">
                Is Your Food Pack<br />
                Genuine, Safe &amp; Legal?<br />
                &amp; Find Out Instantly.
              </h1>

              <p className="text-[15px] sm:text-[16px] text-[#B0CCBA] leading-relaxed max-w-[520px] mx-auto lg:mx-0">
                SafeFood uses advanced AI to scan packaged foods, instantly
                checking for hidden details, illegal tiny fonts, missing Govt
                mandatory info, and fake products, along with new features like
                allergens, nutrition, and licenses.
              </p>

              {/* Buttons Row */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
                {/* Get the Free App button */}
                <button
                  type="button"
                  className="flex items-center gap-3 px-6 py-3 rounded-full bg-[#28B463] hover:bg-[#22994F] text-white font-bold text-[15px] transition-colors cursor-pointer"
                >
                  <span>Get the Free App</span>
                  <div className="flex items-center gap-1.5 pl-3 border-l border-white/30">
                    {/* Apple icon */}
                    <svg className="h-4 w-4 fill-white" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.35.22-10.33-1.93-14.94-6.46-3.35-3.17-7.2-7.91-11.56-14.22-5.74-8.37-10.35-17.96-13.82-28.77-3.48-10.81-5.21-21.36-5.21-31.65 0-14.89 3.83-27.18 11.49-36.88 7.66-9.7 17.1-14.65 28.32-14.86 4.93 0 10.38 1.25 16.36 3.75 5.98 2.5 9.87 3.81 11.66 3.93 1.57-.12 5.69-1.54 12.37-4.25 6.68-2.72 12.31-3.9 16.89-3.55 12.7.99 22.78 5.76 30.23 14.32-11.05 6.74-16.47 16.03-16.27 27.88.2 9.27 3.86 17.06 10.98 23.36 7.12 6.3 15.35 9.77 24.68 10.42-2.12 6.32-4.78 12.63-7.98 18.94zM119.22 33.15c0-7.23 2.65-13.97 7.95-20.21 5.3-6.24 11.83-10.15 19.59-11.74.85 7.12-1.39 13.89-6.72 20.3-5.33 6.41-11.97 10.46-19.92 12.16-.3-.18-.6-.35-.9-.51z" />
                    </svg>
                    {/* Google Play icon */}
                    <svg className="h-3.5 w-3.5 fill-white" viewBox="0 0 512 512">
                      <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                    </svg>
                  </div>
                </button>

                {/* See How It Works button */}
                <a
                  href="#how-it-works"
                  className="px-6 py-3 rounded-full border-2 border-white/50 hover:border-white text-white font-semibold text-[15px] transition-colors"
                >
                  See How It Works
                </a>
              </div>

              {/* Trust Emblems Row */}
              <div className="pt-6 space-y-2.5">
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  {/* 5 circular white badges with simple icons */}
                  {[
                    { label: '★', bg: '#FFF8E1', color: '#B8860B' },
                    { label: 'fssai', bg: '#FFFFFF', color: '#006B3F', isText: true },
                    { label: '✓', bg: '#E8F5E9', color: '#2E7D32' },
                    { label: 'fssai', bg: '#FFFFFF', color: '#006B3F', isText: true, italic: true },
                    { label: '🌿', bg: '#E8F5E9', color: '#388E3C' },
                  ].map((badge, i) => (
                    <div
                      key={i}
                      className="h-12 w-12 rounded-full flex items-center justify-center border-2 border-white/20"
                      style={{ backgroundColor: badge.bg }}
                    >
                      {badge.isText ? (
                        <span
                          className="font-black text-[11px] tracking-tighter"
                          style={{ color: badge.color, fontStyle: badge.italic ? 'italic' : 'normal' }}
                        >
                          {badge.label}
                        </span>
                      ) : (
                        <span className="text-lg" style={{ color: badge.color }}>
                          {badge.label}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-[13px] text-[#8FB89C] font-medium">
                  Scanned 5M+ packets &bull; Trusted by families &amp; retailers
                </p>
              </div>
            </div>

            {/* ── Right Column: Phone Mockup with AR Badges ── */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-[320px] sm:w-[360px]">

                {/* ─ Floating Badge: MRP & Expiry (top-left) ─ */}
                <div className="absolute -top-2 -left-8 sm:-left-16 z-20 flex items-center gap-1.5 bg-[#145A38] border border-[#28B463]/50 rounded-full px-3 py-1.5">
                  <div className="h-5 w-5 rounded-full bg-[#28B463] flex items-center justify-center">
                    <Check className="h-3 w-3 text-white stroke-[3]" />
                  </div>
                  <span className="text-[12px] font-bold text-white whitespace-nowrap">MRP &amp; Expiry</span>
                </div>

                {/* ─ Floating Badge: Missing Manufacturer (top-right) ─ */}
                <div className="absolute top-4 -right-4 sm:-right-12 z-20 bg-[#F9D4C4] rounded-xl px-3 py-2 max-w-[130px]">
                  <span className="text-[12px] font-bold text-[#1a1a1a] leading-tight block">
                    Missing<br />Manufacturer
                  </span>
                </div>

                {/* ─ Floating Badge: Font Size < 1.5mm (Illegal) (mid-left) ─ */}
                <div className="absolute top-[26%] -left-8 sm:-left-20 z-20 flex items-center gap-2 bg-[#FDE8D0] border border-[#E8A050]/40 rounded-xl px-3 py-2">
                  <div className="h-5 w-5 rounded-full bg-[#E8A050] flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-3 w-3 text-white stroke-[3]" />
                  </div>
                  <div>
                    <span className="text-[12px] font-bold text-[#1a1a1a] block leading-tight">Font Size &lt; 1.5mm</span>
                    <span className="text-[11px] font-bold text-[#7D5A2F] block">(Illegal)</span>
                  </div>
                </div>

                {/* ─ Floating Badge: Allergens Found (mid-right) ─ */}
                <div className="absolute top-[42%] -right-4 sm:-right-12 z-20 bg-[#D4F0D9] rounded-xl px-3 py-2">
                  <span className="text-[12px] font-bold text-[#1a1a1a]">Allergens Found</span>
                </div>

                {/* ─ Floating Badge: MRP & Expiry (bottom-left) ─ */}
                <div className="absolute bottom-[28%] -left-6 sm:-left-12 z-20 flex items-center gap-1.5 bg-[#145A38] border border-[#28B463]/50 rounded-full px-3 py-1.5">
                  <div className="h-5 w-5 rounded-full bg-[#28B463] flex items-center justify-center">
                    <Check className="h-3 w-3 text-white stroke-[3]" />
                  </div>
                  <span className="text-[12px] font-bold text-white whitespace-nowrap">MRP &amp; Expiry</span>
                </div>

                {/* ── Phone Frame ── */}
                <div className="relative rounded-[44px] bg-[#1a1a1a] p-[10px] shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                  <div className="relative rounded-[36px] overflow-hidden bg-[#111]">
                    {/* Dynamic Island */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 h-[22px] w-[90px] bg-black rounded-full" />

                    {/* Camera Screen Content */}
                    <div className="relative h-[520px] sm:h-[560px] w-full bg-[#0c120e] flex flex-col p-4">

                      {/* Viewfinder top bar */}
                      <div className="pt-8 flex items-center justify-between text-white/70 text-xs z-10">
                        <span>⚡</span>
                        <span className="text-[10px] font-mono tracking-wider text-[#4ADE80] bg-black/50 px-2 py-0.5 rounded-full">
                          Scanning
                        </span>
                        <span>↻</span>
                      </div>

                      {/* Center: Snack Package */}
                      <div className="flex-1 flex items-center justify-center relative my-4">
                        {/* Package illustration */}
                        <div className="relative w-[180px] sm:w-[200px] h-[260px] sm:h-[280px] rounded-xl bg-gradient-to-b from-[#D4690A] via-[#E07A1A] to-[#B85507] flex flex-col justify-between p-3 border border-white/15">

                          {/* Scan line */}
                          <div className="absolute left-0 right-0 h-[2px] bg-[#4ADE80]/80 animate-scan-line z-20 pointer-events-none" />

                          {/* Brand name */}
                          <div className="flex items-center justify-between">
                            <span className="text-[18px] font-black text-white drop-shadow-sm tracking-tight" style={{ fontFamily: 'serif' }}>
                              Spack
                            </span>
                            <span className="text-[8px] font-bold bg-white/90 text-[#D4690A] px-1.5 py-0.5 rounded uppercase">
                              Snack
                            </span>
                          </div>

                          {/* Product visual area */}
                          <div className="flex-1 flex flex-col justify-center gap-2 my-2">
                            {/* Cheese visual */}
                            <div className="text-center">
                              <div className="text-[11px] font-bold text-yellow-100 uppercase tracking-wide">
                                Pure Cheez
                              </div>
                              <div className="text-[9px] text-white/80">Crispy Cheese Puffs</div>
                            </div>

                            {/* Expiry line */}
                            <div className="bg-black/40 rounded px-2 py-1 text-center">
                              <span className="text-[10px] font-mono font-bold text-white">EXP: 12/29</span>
                            </div>

                            {/* Ingredients tiny text panel */}
                            <div className="bg-white/90 rounded p-1.5 text-[6.5px] text-neutral-700 leading-tight">
                              <span className="font-bold text-[7px] text-neutral-900 block mb-0.5">Ingredients</span>
                              <p className="text-neutral-500 line-clamp-2">
                                Corn grits, palm oil, cheese powder (milk), seasoning, edible salt, spice extracts...
                              </p>
                            </div>
                          </div>

                          {/* Barcode */}
                          <div className="h-4 bg-white/90 rounded flex items-center justify-center px-2">
                            <div className="flex items-center gap-[1.5px] h-2.5">
                              {[...Array(28)].map((_, i) => (
                                <div key={i} className={`h-full bg-neutral-900 ${i % 3 === 0 ? 'w-[1.5px]' : 'w-[1px]'}`} />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Dashed scan border around package */}
                        <div className="absolute inset-0 m-3 border-2 border-dashed border-[#4ADE80]/30 rounded-2xl pointer-events-none" />
                      </div>

                      {/* Camera bottom controls */}
                      <div className="z-10 flex flex-col items-center gap-3 pb-1">
                        {/* Scanning indicator */}
                        <div className="flex items-center gap-1.5 bg-black/50 px-3 py-1 rounded-full">
                          <span className="h-2 w-2 rounded-full bg-[#4ADE80] animate-pulse" />
                          <span className="text-[11px] text-[#4ADE80] font-medium">Scanning</span>
                        </div>

                        {/* Shutter row */}
                        <div className="flex items-center justify-around w-full">
                          <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </div>
                          <div className="h-[56px] w-[56px] rounded-full border-[3px] border-white/70 p-[3px]">
                            <div className="h-full w-full rounded-full bg-white" />
                          </div>
                          <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                              <circle cx="12" cy="13" r="4" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─ Floating Card: SafeFood Report (bottom-right) ─ */}
                <div className="absolute -bottom-6 -right-4 sm:-right-14 z-30 bg-white rounded-2xl p-4 shadow-xl w-[210px] sm:w-[230px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-[13px] text-[#1a1a1a]">SafeFood Report</span>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-[#FEE2E2] text-[#DC2626] text-[10px] font-extrabold uppercase tracking-wide">
                      FAILED
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-1.5 text-[11px] text-[#444]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444] mt-1.5 shrink-0" />
                      <span>Non-compliant tiny text font</span>
                    </li>
                    <li className="flex items-start gap-1.5 text-[11px] text-[#444]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444] mt-1.5 shrink-0" />
                      <span>Missing details and missing details</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/*  HOW SAFEFOOD PROTECTS YOU  (5 Feature Cards)         */}
      {/* ══════════════════════════════════════════════════════ */}
      <section id="features" className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <h2 className="text-center text-[28px] sm:text-[34px] font-extrabold text-[#1a1a1a] tracking-tight mb-12">
            How SafeFood Protects You
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

            {/* Card 1 – Detect Missing Details */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow">
              {/* Icon */}
              <div className="h-14 w-14 rounded-xl bg-[#EBF5EE] flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="w-7 h-8 bg-[#F97316] rounded-sm flex flex-col justify-between p-0.5">
                    <div className="h-[3px] bg-white/70 rounded-full w-3" />
                    <div className="h-[3px] bg-white/70 rounded-full w-4" />
                    <div className="h-[3px] bg-white/70 rounded-full w-2.5" />
                  </div>
                  <Search className="h-4 w-4 text-[#28B463] absolute -bottom-1 -right-1.5 stroke-[2.5]" />
                </div>
              </div>
              <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-1.5">
                Detect Missing<br />Details
              </h3>
              <p className="text-[12px] text-[#6B7280] leading-relaxed">
                Checking MRP, expiry, weight, snack, and manufacturer.
              </p>
            </div>

            {/* Card 2 – Measure Text Readability */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-xl bg-[#EBF5EE] flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="w-7 h-9 bg-white border border-[#D1D5DB] rounded-sm p-1 flex flex-col gap-0.5">
                    <span className="text-[7px] font-black text-[#1a1a1a] block">AI</span>
                    <div className="h-[2px] bg-[#D1D5DB] rounded-full w-full" />
                    <div className="h-[2px] bg-[#D1D5DB] rounded-full w-3/4" />
                    <div className="h-[2px] bg-[#D1D5DB] rounded-full w-full" />
                  </div>
                  <Search className="h-4 w-4 text-[#28B463] absolute -bottom-1 -right-1.5 stroke-[2.5]" />
                </div>
              </div>
              <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-1.5">
                Measure Text<br />Readability
              </h3>
              <p className="text-[12px] text-[#6B7280] leading-relaxed">
                AI scan detects illegal font text used to hide info access folxuce.
              </p>
            </div>

            {/* Card 3 – Verify Authenticity */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-xl bg-[#EBF5EE] flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="w-7 h-9 bg-white border border-[#D1D5DB] rounded-sm p-1 flex flex-col justify-between">
                    <div className="h-[3px] bg-[#28B463] rounded-full w-3" />
                    <div className="space-y-0.5">
                      <div className="h-[2px] bg-[#D1D5DB] rounded-full w-full" />
                      <div className="h-[2px] bg-[#D1D5DB] rounded-full w-3/4" />
                    </div>
                    <CheckCircle2 className="h-3 w-3 text-[#28B463] self-end" />
                  </div>
                </div>
              </div>
              <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-1.5">
                Verify<br />Authenticity
              </h3>
              <p className="text-[12px] text-[#6B7280] leading-relaxed">
                Matches with official databases to spot fake/misleading.
              </p>
            </div>

            {/* Card 4 – Allergen & Nutrition Decoder (NEW) */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow relative">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#E8632B] text-white text-[10px] font-bold uppercase tracking-wide">
                NEW
              </div>
              <div className="h-14 w-14 rounded-xl bg-[#FFF3E0] flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="w-7 h-9 bg-white border border-[#D1D5DB] rounded-sm p-1 flex flex-col justify-between">
                    <div className="h-[3px] bg-[#F97316] rounded-full w-3" />
                    <div className="space-y-0.5">
                      <div className="h-[2px] bg-[#D1D5DB] rounded-full w-full" />
                      <div className="h-[2px] bg-[#FBBF24] rounded-full w-3/4" />
                    </div>
                    <AlertTriangle className="h-3 w-3 text-[#F97316] self-end" />
                  </div>
                </div>
              </div>
              <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-1.5">
                Allergen &amp;<br />Nutrition Decoder
              </h3>
              <p className="text-[12px] text-[#6B7280] leading-relaxed">
                Flags allergens and hidden ingredients.
              </p>
            </div>

            {/* Card 5 – FSSAI License Validator (NEW) */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow relative">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#E8632B] text-white text-[10px] font-bold uppercase tracking-wide">
                NEW
              </div>
              <div className="h-14 w-14 rounded-xl bg-[#FFF3E0] flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="w-7 h-9 bg-white border border-[#D1D5DB] rounded-sm p-1 flex flex-col justify-between">
                    <span className="text-[6px] font-black text-[#006B3F] font-mono leading-none">fssai</span>
                    <div className="h-[3px] bg-[#28B463] rounded-full w-3" />
                    <Check className="h-3 w-3 text-[#28B463] self-end stroke-[3]" />
                  </div>
                </div>
              </div>
              <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-1.5">
                FSSAI License<br />Validator
              </h3>
              <p className="text-[12px] text-[#6B7280] leading-relaxed">
                Scans and validates government licenses.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/*  HOW IT WORKS – 3 STEPS                               */}
      {/* ══════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-[#F8FAF9]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-[#0B3D2B]/10 text-[#0B3D2B] text-xs font-bold uppercase tracking-wider mb-3">
              How It Works
            </span>
            <h2 className="text-[28px] sm:text-[34px] font-extrabold text-[#1a1a1a] tracking-tight">
              Three Steps to Food Safety
            </h2>
            <p className="text-[#6B7280] text-[15px] mt-2">
              Get instant Legal Metrology compliance reports in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Scan the Package',
                desc: 'Point your camera at the food package label. Our AI captures front, back and side panel information automatically.',
                color: '#28B463',
                bg: '#EBF5EE',
              },
              {
                step: '02',
                title: 'AI Analyzes Everything',
                desc: 'Advanced OCR and vision models extract MRP, dates, manufacturer info, allergens, font sizes, and FSSAI numbers.',
                color: '#E8632B',
                bg: '#FFF3E0',
              },
              {
                step: '03',
                title: 'Get Your Report',
                desc: 'Receive a compliance verdict instantly — PASSED, WARNING, or FAILED — with all issues clearly highlighted.',
                color: '#0B3D2B',
                bg: '#E8F0EC',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-[#E5E7EB] p-8 text-center shadow-sm">
                <span className="text-[40px] font-extrabold block mb-3" style={{ color: `${item.color}30` }}>
                  {item.step}
                </span>
                <div
                  className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: item.bg }}
                >
                  <span className="text-2xl font-bold" style={{ color: item.color }}>
                    {idx === 0 ? '📸' : idx === 1 ? '🤖' : '✅'}
                  </span>
                </div>
                <h3 className="text-[17px] font-bold text-[#1a1a1a] mb-2">{item.title}</h3>
                <p className="text-[13px] text-[#6B7280] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/*  DUAL ECOSYSTEM – Citizens & Officers                 */}
      {/* ══════════════════════════════════════════════════════ */}
      <section id="api" className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <span className="inline-block px-3 py-1 rounded-full bg-[#EBF5EE] text-[#0B3D2B] text-xs font-bold uppercase tracking-wider">
                For Consumers &amp; Authorities
              </span>
              <h2 className="text-[28px] sm:text-[34px] font-extrabold text-[#1a1a1a] tracking-tight leading-tight">
                Citizens Report.<br />Officers Investigate.
              </h2>
              <p className="text-[15px] text-[#6B7280] leading-relaxed max-w-lg">
                SafeFood connects everyday consumers with enforcement officers.
                File instant grievances from store shelves and track statutory
                action in real-time.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-[#EBF5EE] text-[#28B463] flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#1a1a1a]">Consumer Grievance Portal</h4>
                    <p className="text-[12px] text-[#6B7280] mt-0.5">
                      Scan, verify, and file complaints with photo evidence in one tap.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-[#FFF3E0] text-[#E8632B] flex items-center justify-center shrink-0">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#1a1a1a]">Officer Investigation Desk</h4>
                    <p className="text-[12px] text-[#6B7280] mt-0.5">
                      Review grievance queues, inspect evidence, and issue statutory notices.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-3">
                <Link
                  to="/login"
                  className="px-6 py-2.5 rounded-full bg-[#0B3D2B] text-white font-bold text-[13px] hover:bg-[#145A38] transition-colors flex items-center gap-2"
                >
                  <span>Enter Citizen Portal</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-2.5 rounded-full bg-[#F3F4F6] text-[#1a1a1a] font-bold text-[13px] hover:bg-[#E5E7EB] transition-colors border border-[#E5E7EB] flex items-center gap-2"
                >
                  <span>Officer Verification Cell</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Ecosystem cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-[#0B3D2B] text-white border border-[#145A38]">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#28B463]/20 text-[#4ADE80] text-[10px] font-bold uppercase mb-3">
                  Mobile &amp; Web
                </span>
                <h3 className="text-[17px] font-bold text-white mb-2">Consumer App</h3>
                <p className="text-[12px] text-[#B0CCBA] leading-relaxed mb-4">
                  Instant scanning, allergen warnings, and 1-click grievance logging.
                </p>
                <div className="flex items-center justify-between text-[12px] font-bold text-[#4ADE80] pt-3 border-t border-white/10">
                  <span>Free for Public</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-[#F8FAF9] border border-[#E5E7EB]">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#E8632B]/10 text-[#E8632B] text-[10px] font-bold uppercase mb-3">
                  Statutory Desk
                </span>
                <h3 className="text-[17px] font-bold text-[#1a1a1a] mb-2">Enforcement Inspector</h3>
                <p className="text-[12px] text-[#6B7280] leading-relaxed mb-4">
                  District triage, Legal Metrology notices, and audit evidence.
                </p>
                <div className="flex items-center justify-between text-[12px] font-bold text-[#E8632B] pt-3 border-t border-[#E5E7EB]">
                  <span>Authorized Access</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/*  STATS / SUCCESS STORIES                               */}
      {/* ══════════════════════════════════════════════════════ */}
      <section id="stories" className="py-16 sm:py-20 bg-[#0B3D2B] text-white">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight">
              Trusted by Consumers &amp; Authorities
            </h2>
            <p className="text-[#B0CCBA] text-[15px] mt-2">
              Transforming food safety compliance across India.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { value: '5.2M+', label: 'Packets Scanned', color: '#4ADE80' },
              { value: '99.4%', label: 'OCR Accuracy', color: '#4ADE80' },
              { value: '14,200+', label: 'Violations Flagged', color: '#E8632B' },
              { value: '28 States', label: 'Coverage', color: '#4ADE80' },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#145A38] border border-[#1E7A4F]/40 text-center">
                <span className="text-[30px] sm:text-[36px] font-black block" style={{ color: stat.color }}>
                  {stat.value}
                </span>
                <span className="text-[13px] text-[#B0CCBA] mt-1 block">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/*  FINAL CTA                                             */}
      {/* ══════════════════════════════════════════════════════ */}
      <section id="contact" className="py-16 sm:py-20 bg-[#082E1F]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center space-y-6">
          <div className="h-14 w-14 rounded-2xl bg-[#28B463]/15 flex items-center justify-center mx-auto">
            <ShieldCheck className="h-8 w-8 text-[#4ADE80] stroke-[2]" />
          </div>
          <h2 className="text-[28px] sm:text-[38px] font-extrabold text-white tracking-tight">
            Protect Your Food Today
          </h2>
          <p className="text-[15px] text-[#B0CCBA] max-w-xl mx-auto">
            Download the free app or sign in to the statutory verification portal.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-full bg-[#28B463] hover:bg-[#22994F] text-white font-bold text-[15px] transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-full border-2 border-white/40 hover:border-white text-white font-semibold text-[15px] transition-colors"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/*  FOOTER                                                */}
      {/* ══════════════════════════════════════════════════════ */}
      <footer className="bg-[#041D12] border-t border-white/10 py-10">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-5 text-[13px] text-[#8FB89C]">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-[#28B463] flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-white stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-[17px] text-white">
              Safe<span className="text-[#4ADE80]">Food</span>
            </span>
          </div>
          <p className="text-center md:text-left">
            Compliant with Legal Metrology (PCR 2011) &amp; FSSAI Standards.
          </p>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <span>&bull;</span>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
            <span>&bull;</span>
            <span>&copy; {new Date().getFullYear()} SafeFood</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
