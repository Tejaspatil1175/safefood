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
/*  SafeFood Landing Page – Exact replica of the reference    */
/*  design with dual-phone mockup and clean SaaS aesthetic.   */
/* ─────────────────────────────────────────────────────────── */

export const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased">
      {/* ══════════════════════════════════════════════════════ */}
      {/*  NAVBAR                                               */}
      {/* ══════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-[#072418]">
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

          {/* Download App Button (Vibrant Green as in reference) */}
          <div className="hidden sm:block">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#28DF7E] hover:bg-[#22C55E] text-[#072418] text-sm font-extrabold shadow-sm transition-all hover:scale-105 active:scale-95"
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
                className="w-full py-3 rounded-full bg-[#28DF7E] text-[#072418] font-extrabold text-sm text-center shadow-sm"
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
      <section className="relative bg-[#072418] overflow-hidden">
        {/* Top-Right Emerald/Teal Organic Blob behind phone */}
        <div
          className="absolute -top-10 right-4 sm:right-16 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #0F7E4E 0%, #0B5C38 55%, transparent 75%)',
            opacity: 0.85,
          }}
        />

        {/* Bottom-Right Large Vibrant Warm Orange Organic Blob */}
        <div
          className="absolute -bottom-8 -right-8 w-[380px] sm:w-[440px] h-[380px] sm:h-[440px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #FF7033 0%, #F97316 45%, #EA580C 70%, transparent 85%)',
            opacity: 0.95,
          }}
        />

        {/* Ambient Subtle Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#28DF7E]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center pt-8 pb-16 sm:pt-10 sm:pb-20 lg:pt-12 lg:pb-24">

            {/* ── Left Column: Copy ── */}
            <div className="lg:col-span-6 space-y-5 text-center lg:text-left max-w-[540px] mx-auto lg:mx-0">
              
              {/* Main Headline */}
              <h1 className="text-[38px] sm:text-[46px] lg:text-[52px] font-black text-white leading-[1.12] tracking-tight">
                Is Your Food Pack<br />
                Genuine, Safe &amp; Legal?<br />
                &amp; Find Out Instantly.
              </h1>

              {/* Subhead Paragraph */}
              <p className="text-[14px] sm:text-[15px] text-[#A7C8B6] leading-relaxed max-w-[480px] mx-auto lg:mx-0">
                SafeFood uses advanced AI to scan packaged foods, instantly
                checking for hidden details, illegal tiny fonts, missing Govt mandatory
                info, and fake products, along with new features like allergens,
                nutrition, and licenses.
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
                {/* Get the Free App button */}
                <Link
                  to="/login"
                  className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#28DF7E] hover:bg-[#22C55E] text-[#072418] font-black text-[14px] shadow-lg shadow-[#28DF7E]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Get the Free App</span>
                  <div className="flex items-center gap-1.5 pl-2.5 border-l border-[#072418]/30">
                    {/* Apple icon */}
                    <svg className="h-3.5 w-3.5 fill-[#072418]" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.35.22-10.33-1.93-14.94-6.46-3.35-3.17-7.2-7.91-11.56-14.22-5.74-8.37-10.35-17.96-13.82-28.77-3.48-10.81-5.21-21.36-5.21-31.65 0-14.89 3.83-27.18 11.49-36.88 7.66-9.7 17.1-14.65 28.32-14.86 4.93 0 10.38 1.25 16.36 3.75 5.98 2.5 9.87 3.81 11.66 3.93 1.57-.12 5.69-1.54 12.37-4.25 6.68-2.72 12.31-3.9 16.89-3.55 12.7.99 22.78 5.76 30.23 14.32-11.05 6.74-16.47 16.03-16.27 27.88.2 9.27 3.86 17.06 10.98 23.36 7.12 6.3 15.35 9.77 24.68 10.42-2.12 6.32-4.78 12.63-7.98 18.94zM119.22 33.15c0-7.23 2.65-13.97 7.95-20.21 5.3-6.24 11.83-10.15 19.59-11.74.85 7.12-1.39 13.89-6.72 20.3-5.33 6.41-11.97 10.46-19.92 12.16-.3-.18-.6-.35-.9-.51z" />
                    </svg>
                    {/* Google Play icon */}
                    <svg className="h-3 w-3 fill-[#072418]" viewBox="0 0 512 512">
                      <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                    </svg>
                  </div>
                </Link>

                {/* See How It Works button */}
                <a
                  href="#how-it-works"
                  className="px-6 py-2.5 rounded-full bg-transparent border border-white/40 hover:border-white text-white font-semibold text-[14px] transition-all hover:bg-white/10"
                >
                  See How It Works
                </a>
              </div>

              {/* 5 Circular Official Trust Badges */}
              <div className="pt-4">
                <div className="flex items-center justify-center lg:justify-start gap-2.5 flex-wrap">
                  {/* Badge 1: Govt of India Emblem */}
                  <div className="h-11 w-11 rounded-full bg-white flex items-center justify-center shadow-md p-1.5 border border-white/80">
                    <svg viewBox="0 0 100 100" className="h-full w-full fill-[#1E293B]">
                      <path d="M50 10 L56 26 L72 26 L59 36 L64 52 L50 42 L36 52 L41 36 L28 26 L44 26 Z" />
                      <circle cx="50" cy="72" r="16" fill="none" stroke="#1E293B" strokeWidth="4" />
                      <circle cx="50" cy="72" r="3" fill="#1E293B" />
                    </svg>
                  </div>

                  {/* Badge 2: FSSAI Official Logo */}
                  <div className="h-11 w-11 rounded-full bg-white flex items-center justify-center shadow-md p-1 border border-white/80">
                    <div className="text-center">
                      <span className="block text-[11px] font-black tracking-tighter text-[#EA580C] leading-none">fssai</span>
                      <span className="block text-[5.5px] font-bold text-[#16A34A] leading-none tracking-widest mt-0.5">FOOD SAFETY</span>
                    </div>
                  </div>

                  {/* Badge 3: Legal Metrology Crest */}
                  <div className="h-11 w-11 rounded-full bg-white flex items-center justify-center shadow-md p-1.5 border border-white/80">
                    <svg viewBox="0 0 100 100" className="h-full w-full stroke-[#072418] fill-none" strokeWidth="6">
                      <circle cx="50" cy="50" r="42" stroke="#072418" strokeWidth="4" />
                      <line x1="50" y1="20" x2="50" y2="80" strokeWidth="5" />
                      <line x1="28" y1="36" x2="72" y2="36" strokeWidth="4" />
                      <path d="M28 36 L22 55 L34 55 Z" fill="#072418" />
                      <path d="M72 36 L66 55 L78 55 Z" fill="#072418" />
                    </svg>
                  </div>

                  {/* Badge 4: FSSAI Verified */}
                  <div className="h-11 w-11 rounded-full bg-white flex items-center justify-center shadow-md p-1 border border-white/80">
                    <div className="text-center">
                      <span className="block text-[10px] font-black text-[#1E3A8A] leading-none">fssai</span>
                      <span className="block text-[6px] font-extrabold text-[#EA580C] leading-none mt-0.5">STANDARD</span>
                    </div>
                  </div>

                  {/* Badge 5: Jaivik Bharat / Green Organic Leaf */}
                  <div className="h-11 w-11 rounded-full bg-white flex items-center justify-center shadow-md p-1.5 border border-white/80">
                    <svg viewBox="0 0 60 60" className="h-full w-full fill-[#16A34A]">
                      <path d="M15,48 C22,25 45,15 50,12 C42,28 32,42 15,48 Z" />
                      <path d="M15,48 C12,38 18,28 30,22 C26,32 22,40 15,48 Z" fill="#22C55E" />
                    </svg>
                  </div>
                </div>

                <p className="text-[12px] text-[#A7C8B6] font-medium mt-2 text-center lg:text-left">
                  Scanned 5M+ packets &bull; Trusted by families &amp; retailers
                </p>
              </div>
            </div>

            {/* ── Right Column: Single 3D Perspective iPhone (/mobile.png) + AR Badges ── */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-center py-4">
              <div className="relative select-none w-full max-w-[480px] flex justify-center items-center">

                {/* ── Floating AR Badge 1: MRP & Expiry (Top Left) ── */}
                <div
                  className="absolute z-30 flex items-center gap-2 rounded-full shadow-lg animate-float-gentle"
                  style={{
                    top: '2%',
                    left: '8%',
                    background: '#0D3823',
                    border: '1.5px solid #28DF7E',
                    padding: '6px 14px 6px 8px',
                  }}
                >
                  <div className="h-4 w-4 rounded-full bg-[#28DF7E] flex items-center justify-center text-[#072418] shrink-0">
                    <Check className="h-2.5 w-2.5 stroke-[3.5]" />
                  </div>
                  <span className="text-[11.5px] font-bold text-white whitespace-nowrap">
                    MRP &amp; Expiry
                  </span>
                </div>

                {/* ── Floating AR Badge 2: Font Size < 1.5mm (Illegal) (Mid Left, glowing coral/peach) ── */}
                <div
                  className="absolute z-30 flex items-center gap-2 rounded-2xl animate-float-gentle"
                  style={{
                    top: '24%',
                    left: '-2%',
                    background: '#FFEFEA',
                    border: '2px solid #F97316',
                    boxShadow: '0 0 22px rgba(249, 115, 22, 0.45), 0 10px 25px rgba(0, 0, 0, 0.4)',
                    padding: '8px 14px 8px 10px',
                  }}
                >
                  <div className="h-5 w-5 rounded-full bg-[#EA580C] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <AlertTriangle className="h-3 w-3 stroke-[2.5]" />
                  </div>
                  <span className="text-[11px] font-black text-[#1E293B] leading-tight block">
                    Font Size &lt; 1.5mm<br />
                    <span className="text-[#EA580C] font-extrabold">(Illegal)</span>
                  </span>
                </div>

                {/* ── Floating AR Badge 3: MRP & Expiry (Bottom Left) ── */}
                <div
                  className="absolute z-30 flex items-center gap-2 rounded-full shadow-lg animate-float-opposite"
                  style={{
                    bottom: '22%',
                    left: '0%',
                    background: '#0D3823',
                    border: '1.5px solid #28DF7E',
                    padding: '6px 14px 6px 8px',
                  }}
                >
                  <div className="h-4 w-4 rounded-full bg-[#28DF7E] flex items-center justify-center text-[#072418] shrink-0">
                    <Check className="h-2.5 w-2.5 stroke-[3.5]" />
                  </div>
                  <span className="text-[11.5px] font-bold text-white whitespace-nowrap">
                    MRP &amp; Expiry
                  </span>
                </div>

                {/* ── Floating AR Badge 4: Missing Manufacturer (Top Right) ── */}
                <div
                  className="absolute z-30 flex items-center gap-2 rounded-2xl shadow-xl animate-float-gentle"
                  style={{
                    top: '8%',
                    right: '2%',
                    background: '#FFEFEA',
                    border: '1.5px solid #FDBA74',
                    padding: '8px 14px 8px 10px',
                  }}
                >
                  <div className="h-5 w-5 rounded-full bg-[#EA580C] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <AlertTriangle className="h-3 w-3 stroke-[2.5]" />
                  </div>
                  <span className="text-[11px] font-black text-[#1E293B] leading-tight block">
                    Missing<br />Manufacturer
                  </span>
                </div>

                {/* ── Floating AR Badge 5: Allergens Found (Mid Right) ── */}
                <div
                  className="absolute z-30 flex items-center gap-2 rounded-full shadow-xl animate-float-opposite"
                  style={{
                    top: '38%',
                    right: '-2%',
                    background: '#FFF4ED',
                    border: '1.5px solid #FB923C',
                    padding: '6px 14px 6px 8px',
                  }}
                >
                  <div className="h-4 w-4 rounded-full bg-[#F97316] text-white flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                  <span className="text-[11.5px] font-bold text-[#7C2D12] whitespace-nowrap">
                    Allergens Found
                  </span>
                </div>

                {/* ════ 3D MOBILE MOCKUP IMAGE (/mobile.png) ════ */}
                <div className="relative z-10 w-full flex justify-center items-center py-2">
                  <img
                    src="/mobile.png"
                    alt="SafeFood Mobile Scanner"
                    className="w-full max-w-[420px] sm:max-w-[450px] h-auto object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.85)] filter pointer-events-none select-none"
                  />
                </div>

                {/* ── Floating Report Card (Overlapping Phone on Bottom Right) ── */}
                <div
                  className="absolute z-30 bg-white rounded-2xl p-3.5 shadow-2xl border border-gray-200/90"
                  style={{
                    bottom: '8%',
                    right: '4%',
                    width: '185px',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-extrabold text-[#0F172A]">SafeFood Report</span>
                  </div>

                  {/* FAILED Status Pill */}
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 border border-red-300 text-red-600 font-black text-[10px] mb-2.5">
                    <span className="text-[10px]">✕</span>
                    <span>FAILED</span>
                  </div>

                  {/* Red Dot Checklist */}
                  <div className="space-y-1.5 text-[10px] text-gray-700 font-medium">
                    <div className="flex items-start gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1 shrink-0" />
                      <span className="leading-tight">Non-compliant tiny text</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1 shrink-0" />
                      <span className="leading-tight">Missing details and missing details</span>
                    </div>
                  </div>
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
      {/*  HOW SAFECFOOD PROTECTS YOU (5 DARK GREEN CARDS)       */}
      {/* ══════════════════════════════════════════════════════ */}
      <section id="features" className="pt-10 pb-16 sm:pb-24 bg-white relative z-20">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          
          {/* Section Heading */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-[30px] sm:text-[36px] font-black text-[#0F172A] tracking-tight">
              How SafeFood Protects You
            </h2>
          </div>

          {/* 5 Dark Green Feature Cards in 1 Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">

            {/* Card 1: Detect Missing Details */}
            <div className="bg-[#0B3322] rounded-2xl border border-[#185338] hover:border-[#28DF7E]/60 p-4.5 flex flex-col justify-between shadow-md hover:shadow-xl transition-all group">
              <div className="flex items-center gap-3 mb-3">
                {/* Snack pouch with zoom lens icon */}
                <div className="h-11 w-11 rounded-xl bg-[#072418] border border-[#28DF7E]/30 flex items-center justify-center shrink-0">
                  <div className="relative">
                    <span className="text-base">🍿</span>
                    <span className="absolute -bottom-1 -right-1 text-[10px]">🔍</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-[14px] font-extrabold text-white mb-1.5 leading-snug">
                  Detect Missing Details
                </h3>
                <p className="text-[11.5px] text-[#A3CBB5] leading-relaxed">
                  Checking MRP, expiry, weight, weight, snack, and manufacturer.
                </p>
              </div>
            </div>

            {/* Card 2: Measure Text Readability */}
            <div className="bg-[#0B3322] rounded-2xl border border-[#185338] hover:border-[#28DF7E]/60 p-4.5 flex flex-col justify-between shadow-md hover:shadow-xl transition-all group">
              <div className="flex items-center gap-3 mb-3">
                {/* Document with AI font scan */}
                <div className="h-11 w-11 rounded-xl bg-[#072418] border border-[#28DF7E]/30 flex items-center justify-center shrink-0">
                  <div className="relative">
                    <span className="text-base">📄</span>
                    <span className="absolute -bottom-1 -right-1 text-[10px]">🔎</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-[14px] font-extrabold text-white mb-1.5 leading-snug">
                  Measure Text Readability
                </h3>
                <p className="text-[11.5px] text-[#A3CBB5] leading-relaxed">
                  AI scan detects illegal font text used to hide info access folxuce.
                </p>
              </div>
            </div>

            {/* Card 3: Verify Authenticity */}
            <div className="bg-[#0B3322] rounded-2xl border border-[#185338] hover:border-[#28DF7E]/60 p-4.5 flex flex-col justify-between shadow-md hover:shadow-xl transition-all group">
              <div className="flex items-center gap-3 mb-3">
                {/* Verified certificate icon */}
                <div className="h-11 w-11 rounded-xl bg-[#072418] border border-[#28DF7E]/30 flex items-center justify-center shrink-0">
                  <span className="text-lg">📋</span>
                </div>
              </div>
              <div>
                <h3 className="text-[14px] font-extrabold text-white mb-1.5 leading-snug">
                  Verify Authenticity
                </h3>
                <p className="text-[11.5px] text-[#A3CBB5] leading-relaxed">
                  Matches with official databases to spot fake/misleading.
                </p>
              </div>
            </div>

            {/* Card 4: Allergen & Nutrition Decoder (NEW) */}
            <div className="bg-[#0B3322] rounded-2xl border border-[#185338] hover:border-[#28DF7E]/60 p-4.5 flex flex-col justify-between shadow-md hover:shadow-xl transition-all relative group">
              {/* NEW Badge */}
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#FF6B35] text-white text-[9px] font-black tracking-wider">
                NEW
              </div>
              <div className="flex items-center gap-3 mb-3">
                {/* Allergen seeds/nuts icon */}
                <div className="h-11 w-11 rounded-xl bg-[#072418] border border-[#28DF7E]/30 flex items-center justify-center shrink-0">
                  <span className="text-lg">🥜</span>
                </div>
              </div>
              <div>
                <h3 className="text-[14px] font-extrabold text-white mb-1.5 leading-snug">
                  Allergen &amp; Nutrition Decoder
                </h3>
                <p className="text-[11.5px] text-[#A3CBB5] leading-relaxed">
                  Flags allergens and hidden ingredients.
                </p>
              </div>
            </div>

            {/* Card 5: FSSAI License Validator (NEW) */}
            <div className="bg-[#0B3322] rounded-2xl border border-[#185338] hover:border-[#28DF7E]/60 p-4.5 flex flex-col justify-between shadow-md hover:shadow-xl transition-all relative group">
              {/* NEW Badge */}
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#FF6B35] text-white text-[9px] font-black tracking-wider">
                NEW
              </div>
              <div className="flex items-center gap-3 mb-3">
                {/* Government license icon */}
                <div className="h-11 w-11 rounded-xl bg-[#072418] border border-[#28DF7E]/30 flex items-center justify-center shrink-0">
                  <span className="text-lg">🏛️</span>
                </div>
              </div>
              <div>
                <h3 className="text-[14px] font-extrabold text-white mb-1.5 leading-snug">
                  FSSAI License Validator
                </h3>
                <p className="text-[11.5px] text-[#A3CBB5] leading-relaxed">
                  Scans and validates government licenses.
                </p>
              </div>
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
