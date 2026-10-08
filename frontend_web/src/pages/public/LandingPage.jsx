import React, { useState, useEffect } from 'react';
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
  Star,
  Leaf,
  Clock,
  Play,
  Monitor,
  Share2,
  Scan as ScanIcon,
  History as HistoryIcon,
  FileText,
  User,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────── */
/*  SafeFood Landing Page – Interactive Hero Canvas with      */
/*  pure DOM verification card, sample switcher, and live API */
/* ─────────────────────────────────────────────────────────── */

const SAMPLE_INSPECTIONS = [
  {
    id: 'SF-2026-89410',
    title: 'Parle-G Gluco Biscuits',
    barcode: '8901719101038',
    status: 'PASSED',
    statusColor: '#28DF7E',
    statusBg: 'bg-[#28DF7E]/20',
    statusBorder: 'border-[#28DF7E]/40',
    statusText: 'text-[#28DF7E]',
    pulseBg: 'bg-[#28DF7E]',
    checks: [
      { label: 'Product Authenticity', value: 'Genuine & Verified Reference', status: 'pass' },
      { label: 'Mandatory Declarations', value: 'All 10 Met (Rule 6 PCR 2011)', status: 'pass' },
      { label: 'Numeral Height (Net Qty)', value: '4.0mm (Compliant for 800g band)', status: 'pass' },
      { label: 'MRP & Expiry Date', value: '₹85.00 • Best Before 07/2026', status: 'pass' },
      { label: 'FSSAI License', value: '10013022002253 (Active & Valid)', status: 'pass' },
    ],
  },
  {
    id: 'SF-2026-89411',
    title: 'Healthy Bites Oats & Almonds',
    barcode: '8906123456789',
    status: 'PASSED',
    statusColor: '#28DF7E',
    statusBg: 'bg-[#28DF7E]/20',
    statusBorder: 'border-[#28DF7E]/40',
    statusText: 'text-[#28DF7E]',
    pulseBg: 'bg-[#28DF7E]',
    checks: [
      { label: 'Product Authenticity', value: 'Genuine & Verified', status: 'pass' },
      { label: 'Mandatory Declarations', value: 'All 9 Present', status: 'pass' },
      { label: 'MRP & Expiry Date', value: 'Valid • Best Before Dec 2026', status: 'pass' },
      { label: 'FSSAI License', value: 'Active & Compliant', status: 'pass' },
      { label: 'Allergen Warning', value: 'Contains Almonds & Gluten', status: 'warning' },
    ],
  },
  {
    id: 'SF-2026-89412',
    title: 'Counterfeit Juice Pack',
    barcode: '8909876543210',
    status: 'FLAGGED',
    statusColor: '#EF4444',
    statusBg: 'bg-[#EF4444]/20',
    statusBorder: 'border-[#EF4444]/40',
    statusText: 'text-[#EF4444]',
    pulseBg: 'bg-[#EF4444]',
    checks: [
      { label: 'Product Authenticity', value: 'Unregistered Batch Code', status: 'fail' },
      { label: 'Character Height', value: '1.2mm (< 2.5mm statutory min)', status: 'fail' },
      { label: 'Unit Sale Price', value: 'MISSING (Rule 6(1)(e) Violation)', status: 'fail' },
      { label: 'FSSAI License Format', value: 'Invalid 10-digit format (14 req)', status: 'fail' },
      { label: 'Consumer Redressal', value: 'Eligible for Legal Notice filing', status: 'warning' },
    ],
  },
];

export const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);

  const currentSample = SAMPLE_INSPECTIONS[activeSampleIndex];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 90);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased bg-white">
      {/* ══════════════════════════════════════════════════════ */}
      {/*  NAVBAR                                               */}
      {/* ══════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-[#072418] border-b border-white/10">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-[#28DF7E] flex items-center justify-center shadow-sm">
              <ShieldCheck className="h-5 w-5 text-[#072418] stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-[22px] tracking-tight text-white">
              Safe<span className="text-[#28DF7E]">Food</span>
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

          {/* Download App Button (Vibrant Yellow as in reference) */}
          <div className="hidden sm:block">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FFBA08] hover:bg-[#E5A807] text-[#1A1A1A] text-sm font-extrabold shadow-sm transition-all hover:scale-105 active:scale-95"
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
          <div className="lg:hidden bg-[#072418] border-t border-white/10 px-5 py-5 space-y-4">
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
                className="w-full py-3 rounded-full bg-[#FFBA08] text-[#1A1A1A] font-extrabold text-sm text-center shadow-sm"
              >
                Download App
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════════════════════ */}
      {/*  HERO SECTION                                         */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="relative bg-[#072418] overflow-hidden pt-6 pb-20 lg:pb-28">
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#28DF7E]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">

            {/* ── Left Column: Copy & Actions ── */}
            <div className="lg:col-span-6 space-y-5 text-center lg:text-left max-w-[560px] mx-auto lg:mx-0">
              
              {/* AI-Powered Food Safety Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E3D27] border border-[#28DF7E]/40 text-[#28DF7E] text-[13px] font-semibold">
                <span className="h-4 w-4 rounded-full bg-[#28DF7E] flex items-center justify-center text-[#072418]">
                  <Check className="h-2.5 w-2.5 stroke-[3.5]" />
                </span>
                <span>AI-Powered Food Safety</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-[40px] sm:text-[48px] lg:text-[54px] font-black text-white leading-[1.12] tracking-tight">
                Is Your Food Pack<br />
                Genuine, Safe &amp; Legal?<br />
                Find Out <span className="text-[#28DF7E]">Instantly.</span>
              </h1>

              {/* Subhead Paragraph */}
              <p className="text-[14.5px] sm:text-[15.5px] text-[#A7C8B6] leading-relaxed max-w-[500px] mx-auto lg:mx-0">
                SafeFood uses advanced AI to scan packaged foods instantly,
                checking for hidden details, illegal tiny fonts, missing Govt mandatory
                info, and fake products, along with new features like allergens,
                nutrition, and licenses.
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
                {/* Get the Free App button */}
                <Link
                  to="/login"
                  className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#28DF7E] hover:bg-[#22C55E] text-[#072418] font-black text-[14px] shadow-lg shadow-[#28DF7E]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Get the Free App</span>
                  <div className="flex items-center gap-1.5 pl-2.5 border-l border-[#072418]/30">
                    <svg className="h-3.5 w-3.5 fill-[#072418]" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.35.22-10.33-1.93-14.94-6.46-3.35-3.17-7.2-7.91-11.56-14.22-5.74-8.37-10.35-17.96-13.82-28.77-3.48-10.81-5.21-21.36-5.21-31.65 0-14.89 3.83-27.18 11.49-36.88 7.66-9.7 17.1-14.65 28.32-14.86 4.93 0 10.38 1.25 16.36 3.75 5.98 2.5 9.87 3.81 11.66 3.93 1.57-.12 5.69-1.54 12.37-4.25 6.68-2.72 12.31-3.9 16.89-3.55 12.7.99 22.78 5.76 30.23 14.32-11.05 6.74-16.47 16.03-16.27 27.88.2 9.27 3.86 17.06 10.98 23.36 7.12 6.3 15.35 9.77 24.68 10.42-2.12 6.32-4.78 12.63-7.98 18.94zM119.22 33.15c0-7.23 2.65-13.97 7.95-20.21 5.3-6.24 11.83-10.15 19.59-11.74.85 7.12-1.39 13.89-6.72 20.3-5.33 6.41-11.97 10.46-19.92 12.16-.3-.18-.6-.35-.9-.51z" />
                    </svg>
                    <svg className="h-3 w-3 fill-[#072418]" viewBox="0 0 512 512">
                      <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                    </svg>
                  </div>
                </Link>

                {/* See How It Works button */}
                <a
                  href="#how-it-works"
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-transparent border border-white/35 hover:border-white text-white font-semibold text-[14px] transition-all hover:bg-white/10 active:scale-95"
                >
                  <Play className="h-3.5 w-3.5 fill-[#28DF7E] text-[#28DF7E]" />
                  <span>See How It Works</span>
                </a>
              </div>

              {/* 4 Circular Trust Badges with 2-line labels below */}
              <div className="pt-4 grid grid-cols-4 gap-3 max-w-[460px] mx-auto lg:mx-0">
                {/* Badge 1: Scanned 5M+ packets */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center shadow-md mb-2">
                    <Star className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                  </div>
                  <span className="text-[11.5px] font-semibold text-white leading-tight">Scanned</span>
                  <span className="text-[11px] text-[#A7C8B6] leading-tight">5M+ packets</span>
                </div>

                {/* Badge 2: Trusted by families & retailers */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center shadow-md mb-2">
                    <ShieldCheck className="h-4 w-4 text-[#16A34A] stroke-[2.5]" />
                  </div>
                  <span className="text-[11.5px] font-semibold text-white leading-tight">Trusted by</span>
                  <span className="text-[11px] text-[#A7C8B6] leading-tight">families &amp; retailers</span>
                </div>

                {/* Badge 3: Verified by experts */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center shadow-md mb-2">
                    <Leaf className="h-4 w-4 text-[#16A34A] fill-[#16A34A]" />
                  </div>
                  <span className="text-[11.5px] font-semibold text-white leading-tight">Verified</span>
                  <span className="text-[11px] text-[#A7C8B6] leading-tight">by experts</span>
                </div>

                {/* Badge 4: Real-time AI checks */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center shadow-md mb-2">
                    <Clock className="h-4 w-4 text-[#16A34A] stroke-[2.5]" />
                  </div>
                  <span className="text-[11.5px] font-semibold text-white leading-tight">Real-time</span>
                  <span className="text-[11px] text-[#A7C8B6] leading-tight">AI checks</span>
                </div>
              </div>
            </div>

            {/* ── Right Column: Interactive Pure DOM Verification Card (No images, no mobile mockups) ── */}
            <div className="lg:col-span-6 w-full max-w-[520px] mx-auto lg:mx-0 lg:ml-auto">
              
              {/* Sample Selector Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0E3D27]/90 border border-white/10 mb-3.5 backdrop-blur-md">
                {SAMPLE_INSPECTIONS.map((sample, idx) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => setActiveSampleIndex(idx)}
                    className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                      activeSampleIndex === idx
                        ? 'bg-[#28DF7E] text-[#072418] shadow-md shadow-[#28DF7E]/20 scale-100 font-black'
                        : 'text-[#A7C8B6] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {idx === 0 ? 'Parle-G (Verified)' : idx === 1 ? 'Healthy Oats' : 'Flagged Pack'}
                  </button>
                ))}
              </div>

              <div className="bg-[#0B3322]/90 backdrop-blur-xl rounded-3xl border border-[#28DF7E]/30 p-6 sm:p-7 shadow-2xl relative overflow-hidden group hover:border-[#28DF7E]/50 transition-all">
                {/* Ambient Inner Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#28DF7E]/10 rounded-full blur-2xl pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#28DF7E]/20 border border-[#28DF7E]/40 flex items-center justify-center text-[#28DF7E]">
                      <ShieldCheck className="h-5 w-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-white font-extrabold text-[15px] leading-tight">AI Compliance Scan</h3>
                      <span className="text-[#A7C8B6] text-xs font-mono">ID: {currentSample.id}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full ${currentSample.statusBg} border ${currentSample.statusBorder} ${currentSample.statusText} text-xs font-black tracking-wide flex items-center gap-1.5`}>
                    <span className={`h-2 w-2 rounded-full ${currentSample.pulseBg} animate-pulse`} />
                    {currentSample.badgeText}
                  </span>
                </div>

                {/* Scanned Product Banner */}
                <div className="mt-4 p-3.5 rounded-2xl bg-[#072418]/80 border border-white/5 flex items-center justify-between relative z-10">
                  <div>
                    <span className="text-[11px] font-bold text-[#A7C8B6] uppercase tracking-wider block">Inspected Item</span>
                    <span className="text-[14px] font-bold text-white block mt-0.5">{currentSample.title}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-[#A7C8B6] uppercase tracking-wider block">Barcode</span>
                    <span className="text-[13px] font-mono text-[#28DF7E] font-semibold">{currentSample.barcode}</span>
                  </div>
                </div>

                {/* Compliance Checklist Items */}
                <div className="mt-4 space-y-2.5 relative z-10">
                  {currentSample.checks.map((check, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                        check.status === 'fail'
                          ? 'bg-[#EF4444]/10 border-[#EF4444]/30'
                          : check.status === 'warning'
                          ? 'bg-[#F97316]/10 border-[#F97316]/30'
                          : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                            check.status === 'fail'
                              ? 'bg-[#EF4444]/20 text-[#EF4444]'
                              : check.status === 'warning'
                              ? 'bg-[#F97316]/20 text-[#F97316]'
                              : 'bg-[#28DF7E]/20 text-[#28DF7E]'
                          }`}
                        >
                          {check.status === 'fail' ? (
                            <X className="h-3.5 w-3.5 stroke-[3]" />
                          ) : check.status === 'warning' ? (
                            <AlertTriangle className="h-3.5 w-3.5 stroke-[2.5]" />
                          ) : (
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                          )}
                        </div>
                        <span className="text-[13px] font-medium text-white">{check.label}</span>
                      </div>
                      <span
                        className={`text-[12px] font-semibold ${
                          check.status === 'fail'
                            ? 'text-[#FCA5A5]'
                            : check.status === 'warning'
                            ? 'text-[#FDBA74]'
                            : 'text-[#28DF7E]'
                        }`}
                      >
                        {check.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Card Action Link */}
                <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between relative z-10">
                  <span className="text-xs text-[#A7C8B6] flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#28DF7E]" />
                    Backend API Active &bull; &lt;1.2s OCR
                  </span>
                  <Link
                    to="/login"
                    className="text-xs font-bold text-[#28DF7E] hover:underline flex items-center gap-1"
                  >
                    <span>Launch Live Scan</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ─── Organic Curved Wave Divider dividing Hero from Features ─── */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-10 pointer-events-none">
          <svg
            viewBox="0 0 1440 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-[70px] sm:h-[100px] lg:h-[135px]"
            preserveAspectRatio="none"
          >
            <path
              d="M0,75 C240,145 620,135 960,105 C1220,80 1370,105 1440,90 L1440,140 L0,140 Z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/*  KEY FEATURES SECTION (5 WHITE CLEAN CARDS + BAR)      */}
      {/* ══════════════════════════════════════════════════════ */}
      <section id="features" className="pt-8 pb-16 sm:pb-20 bg-white relative z-20">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block text-[12px] font-black uppercase tracking-wider text-[#16A34A] mb-2">
              KEY FEATURES
            </span>
            <h2 className="text-[32px] sm:text-[38px] font-black text-[#0A2B1D] tracking-tight leading-tight">
              Smarter Scans. Safer Food.
            </h2>
            <p className="text-[15px] text-[#4B5563] mt-2">
              From barcode to batch details — SafeFood checks it all.
            </p>
          </div>

          {/* 5 Clean White Feature Cards in 1 Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-12">

            {/* Card 1: Hidden Details Scan */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#22C55E]/60 p-4.5 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all group">
              <div className="h-10 w-10 rounded-xl bg-[#EBFBF2] flex items-center justify-center text-[#22C55E] mb-3 group-hover:scale-105 transition-transform">
                <ScanIcon className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-[14px] font-extrabold text-[#0F172A] mb-1 leading-snug">
                  Hidden Details Scan
                </h3>
                <p className="text-[12px] text-[#64748B] leading-relaxed">
                  Detects tiny fonts, missing info, wrong labels and more.
                </p>
              </div>
            </div>

            {/* Card 2: Genuine & Legal Check */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#22C55E]/60 p-4.5 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all group">
              <div className="h-10 w-10 rounded-xl bg-[#EBFBF2] flex items-center justify-center text-[#22C55E] mb-3 group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-[14px] font-extrabold text-[#0F172A] mb-1 leading-snug">
                  Genuine &amp; Legal Check
                </h3>
                <p className="text-[12px] text-[#64748B] leading-relaxed">
                  Verifies Govt. mandatory info, licenses and compliance.
                </p>
              </div>
            </div>

            {/* Card 3: Allergens & Nutrition */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#22C55E]/60 p-4.5 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all group">
              <div className="h-10 w-10 rounded-xl bg-[#EBFBF2] flex items-center justify-center text-[#22C55E] mb-3 group-hover:scale-105 transition-transform">
                <Leaf className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-[14px] font-extrabold text-[#0F172A] mb-1 leading-snug">
                  Allergens &amp; Nutrition
                </h3>
                <p className="text-[12px] text-[#64748B] leading-relaxed">
                  Know what&apos;s inside before you eat.
                </p>
              </div>
            </div>

            {/* Card 4: Fake Product Detection */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#22C55E]/60 p-4.5 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all group">
              <div className="h-10 w-10 rounded-xl bg-[#EBFBF2] flex items-center justify-center text-[#22C55E] mb-3 group-hover:scale-105 transition-transform">
                <FileText className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-[14px] font-extrabold text-[#0F172A] mb-1 leading-snug">
                  Fake Product Detection
                </h3>
                <p className="text-[12px] text-[#64748B] leading-relaxed">
                  Identifies counterfeit and misbranded products.
                </p>
              </div>
            </div>

            {/* Card 5: Safe for Your Family */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#22C55E]/60 p-4.5 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all group">
              <div className="h-10 w-10 rounded-xl bg-[#EBFBF2] flex items-center justify-center text-[#22C55E] mb-3 group-hover:scale-105 transition-transform">
                <Users className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-[14px] font-extrabold text-[#0F172A] mb-1 leading-snug">
                  Safe for Your Family
                </h3>
                <p className="text-[12px] text-[#64748B] leading-relaxed">
                  Better food choices for a healthier tomorrow.
                </p>
              </div>
            </div>

          </div>

          {/* ─── Bottom Store Badges & Explore Web App Row ─── */}
          <div className="relative flex items-center justify-center pt-2">
            {/* Left Decorative Botanical Leaves Sketch */}
            <div className="hidden lg:block absolute left-4 bottom-1 pointer-events-none opacity-70">
              <svg width="42" height="42" viewBox="0 0 50 50" fill="none" stroke="#22C55E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 40C10 40 12 25 25 15C35 7 42 8 42 8C42 8 43 15 35 25C25 38 10 40 10 40Z" />
                <path d="M10 40C18 30 25 22 35 15" />
                <path d="M18 28C22 24 26 23 26 23" />
                <path d="M24 33C28 29 31 28 31 28" />
              </svg>
            </div>

            {/* Store Badges Bar */}
            <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-xs">
              <div className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500 pr-1">
                <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
                <span>Available on</span>
              </div>

              {/* App Store button */}
              <a
                href="#app-store"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors shadow-xs"
              >
                <svg className="h-4 w-4 fill-white" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.35.22-10.33-1.93-14.94-6.46-3.35-3.17-7.2-7.91-11.56-14.22-5.74-8.37-10.35-17.96-13.82-28.77-3.48-10.81-5.21-21.36-5.21-31.65 0-14.89 3.83-27.18 11.49-36.88 7.66-9.7 17.1-14.65 28.32-14.86 4.93 0 10.38 1.25 16.36 3.75 5.98 2.5 9.87 3.81 11.66 3.93 1.57-.12 5.69-1.54 12.37-4.25 6.68-2.72 12.31-3.9 16.89-3.55 12.7.99 22.78 5.76 30.23 14.32-11.05 6.74-16.47 16.03-16.27 27.88.2 9.27 3.86 17.06 10.98 23.36 7.12 6.3 15.35 9.77 24.68 10.42-2.12 6.32-4.78 12.63-7.98 18.94zM119.22 33.15c0-7.23 2.65-13.97 7.95-20.21 5.3-6.24 11.83-10.15 19.59-11.74.85 7.12-1.39 13.89-6.72 20.3-5.33 6.41-11.97 10.46-19.92 12.16-.3-.18-.6-.35-.9-.51z" />
                </svg>
                <div className="text-left leading-none">
                  <span className="block text-[8px] text-gray-300 font-normal">Download on the</span>
                  <span className="block text-[11px] font-bold text-white tracking-tight">App Store</span>
                </div>
              </a>

              {/* Google Play button */}
              <a
                href="#google-play"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors shadow-xs"
              >
                <svg className="h-4 w-4 fill-white" viewBox="0 0 512 512">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                </svg>
                <div className="text-left leading-none">
                  <span className="block text-[8px] text-gray-300 font-normal">GET IT ON</span>
                  <span className="block text-[11px] font-bold text-white tracking-tight">Google Play</span>
                </div>
              </a>

              <div className="h-6 w-px bg-gray-200 hidden sm:block mx-1" />

              {/* Explore Web App button */}
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#22C55E] text-[#15803D] hover:bg-[#EBFBF2] transition-colors text-[13px] font-bold shadow-xs"
              >
                <Monitor className="w-4 h-4 text-[#15803D]" />
                <span>Explore Web App</span>
              </Link>
            </div>

            {/* Right Decorative Botanical Leaves Sketch */}
            <div className="hidden lg:block absolute right-4 bottom-1 pointer-events-none opacity-70 transform scale-x-[-1]">
              <svg width="42" height="42" viewBox="0 0 50 50" fill="none" stroke="#22C55E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 40C10 40 12 25 25 15C35 7 42 8 42 8C42 8 43 15 35 25C25 38 10 40 10 40Z" />
                <path d="M10 40C18 30 25 22 35 15" />
                <path d="M18 28C22 24 26 23 26 23" />
                <path d="M24 33C28 29 31 28 31 28" />
              </svg>
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
