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
        {/* Top-Right Emerald Organic Wave/Blob */}
        <div className="absolute -top-16 -right-10 w-[480px] h-[480px] rounded-full bg-[#0E7A4E] opacity-90 blur-sm pointer-events-none" />

        {/* Ambient Center Glow */}
        <div className="absolute top-1/2 right-[20%] -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-[#28DF7E]/15 blur-3xl pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center pt-8 pb-16 sm:pt-10 sm:pb-20 lg:pt-12 lg:pb-24">

            {/* ── Left Column: Copy (5 cols) ── */}
            <div className="lg:col-span-6 space-y-5 text-center lg:text-left max-w-[540px] mx-auto lg:mx-0">
              
              {/* AI-Powered Food Safety Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#113824] border border-[#28DF7E]/30 text-[#4ADE80] text-[12px] font-semibold">
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#28DF7E] text-[#072418]">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </span>
                <span>AI-Powered Food Safety</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-[36px] sm:text-[44px] lg:text-[50px] font-extrabold text-white leading-[1.12] tracking-tight">
                Is Your Food Pack<br />
                Genuine, Safe &amp; Legal?<br />
                Find Out <span className="text-[#28DF7E]">Instantly.</span>
              </h1>

              {/* Subhead Paragraph */}
              <p className="text-[14px] sm:text-[15px] text-[#A7C8B6] leading-relaxed max-w-[480px] mx-auto lg:mx-0">
                SafeFood uses advanced AI to scan packaged foods instantly,
                checking for hidden details, illegal tiny fonts, missing Govt mandatory
                info, and fake products, along with new features like allergens,
                nutrition, and licenses.
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
                {/* Get the Free App button */}
                <Link
                  to="/login"
                  className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#28DF7E] hover:bg-[#22C55E] text-[#072418] font-extrabold text-[14px] shadow-lg shadow-[#28DF7E]/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
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
                  className="px-5 py-2.5 rounded-full bg-[#0A2E1D]/80 border border-white/20 hover:border-white text-white font-semibold text-[14px] transition-all hover:bg-white/10 flex items-center gap-2"
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#28DF7E] text-[#072418] text-[9px] pl-0.5">
                    ▶
                  </span>
                  <span>See How It Works</span>
                </a>
              </div>

              {/* 4 Trust Badges Row (with icons on white circles & 2-line labels below) */}
              <div className="pt-3">
                <div className="grid grid-cols-4 gap-2 text-center lg:text-left">
                  {/* Badge 1: Scanned 5M+ packets */}
                  <div className="flex flex-col items-center lg:items-start gap-1.5">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md">
                      <Star className="h-4.5 w-4.5 fill-[#EAB308] text-[#EAB308]" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-white leading-tight">Scanned</span>
                      <span className="block text-[10.5px] text-[#8FB89C] leading-tight">5M+ packets</span>
                    </div>
                  </div>

                  {/* Badge 2: Trusted by families & retailers */}
                  <div className="flex flex-col items-center lg:items-start gap-1.5">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md">
                      <ShieldCheck className="h-5 w-5 text-[#28DF7E]" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-white leading-tight">Trusted by</span>
                      <span className="block text-[10.5px] text-[#8FB89C] leading-tight">families &amp; retailers</span>
                    </div>
                  </div>

                  {/* Badge 3: Verified by experts */}
                  <div className="flex flex-col items-center lg:items-start gap-1.5">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md">
                      <Leaf className="h-5 w-5 text-[#28DF7E]" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-white leading-tight">Verified</span>
                      <span className="block text-[10.5px] text-[#8FB89C] leading-tight">by experts</span>
                    </div>
                  </div>

                  {/* Badge 4: Real-time AI checks */}
                  <div className="flex flex-col items-center lg:items-start gap-1.5">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md">
                      <Clock className="h-5 w-5 text-[#28DF7E]" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-white leading-tight">Real-time</span>
                      <span className="block text-[10.5px] text-[#8FB89C] leading-tight">AI checks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Column: Dual Phones (Scanner Phone + Report Phone) (6 cols) ── */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-center py-4">
              <div className="relative flex items-center justify-center select-none">

                {/* ── Realistic 3D Peeking Yellow Cereal / Snack Box behind Phone 1 ── */}
                <div
                  className="absolute -left-12 sm:-left-16 top-10 w-32 sm:w-36 h-56 sm:h-64 rounded-2xl shadow-2xl pointer-events-none hidden sm:block z-10"
                  style={{
                    transform: 'rotate(-13deg) skewY(3deg)',
                    background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 45%, #D97706 100%)',
                    boxShadow: '-15px 25px 35px -10px rgba(0, 0, 0, 0.7), inset 2px 2px 6px rgba(255, 255, 255, 0.4)',
                    border: '1px solid rgba(254, 240, 138, 0.4)',
                  }}
                >
                  {/* Box Front Label Graphics */}
                  <div className="p-3.5 h-full flex flex-col justify-between text-neutral-900 opacity-90">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black tracking-wider uppercase bg-black text-[#FBBF24] px-1.5 py-0.5 rounded">
                          ORGANIC
                        </span>
                        <div className="h-2 w-2 rounded-full bg-emerald-600 border border-white" />
                      </div>
                      <div className="mt-2 text-[14px] font-black leading-tight text-white drop-shadow-sm">
                        Healthy<br />Bites
                      </div>
                      <div className="text-[8px] font-semibold text-yellow-100 mt-0.5">
                        Oats &amp; Almonds
                      </div>
                    </div>

                    {/* Wheat / Snack Bar Art Silhouette */}
                    <div className="my-2 p-1.5 rounded-lg bg-white/20 backdrop-blur-xs flex items-center gap-1.5">
                      <div className="h-6 w-6 rounded-full bg-amber-200/80 flex items-center justify-center text-xs">
                        🌾
                      </div>
                      <div className="text-[7.5px] font-bold text-neutral-900 leading-tight">
                        100% Real<br />Whole Grains
                      </div>
                    </div>

                    {/* Bottom barcode on side of box */}
                    <div className="bg-white/90 p-1 rounded flex flex-col items-center">
                      <div className="flex items-center gap-[1px] h-3 w-full justify-center">
                        {[...Array(18)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-full bg-black ${i % 3 === 0 ? 'w-[1.5px]' : 'w-[0.8px]'}`}
                          />
                        ))}
                      </div>
                      <span className="text-[5.5px] font-mono tracking-widest text-neutral-800">890612345</span>
                    </div>
                  </div>
                </div>

                {/* ── Lush Botanical Fresh Green Leaves ── */}
                {/* Leaf Group 1 (Left, between box and Phone 1) */}
                <div className="absolute -left-10 sm:-left-12 bottom-14 z-25 pointer-events-none animate-float-gentle">
                  <svg width="68" height="68" viewBox="0 0 100 100" fill="none" className="filter drop-shadow-lg">
                    <path
                      d="M20,80 C30,40 60,30 90,20 C80,50 65,80 20,80 Z"
                      fill="url(#leafGrad1)"
                    />
                    <path
                      d="M20,80 Q55,50 90,20"
                      stroke="#86EFAC"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M40,65 Q50,60 60,62"
                      stroke="#86EFAC"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M55,50 Q65,46 75,49"
                      stroke="#86EFAC"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                    {/* Small secondary leaf */}
                    <path
                      d="M20,80 C15,60 25,45 45,40 C40,55 35,70 20,80 Z"
                      fill="url(#leafGrad2)"
                    />
                    <defs>
                      <linearGradient id="leafGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0E623B" />
                        <stop offset="50%" stopColor="#15803D" />
                        <stop offset="100%" stopColor="#22C55E" />
                      </linearGradient>
                      <linearGradient id="leafGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0B4D2D" />
                        <stop offset="100%" stopColor="#16A34A" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Leaf Group 2 (Right, beside Phone 2) */}
                <div className="absolute -right-8 sm:-right-12 top-20 z-15 pointer-events-none animate-float-opposite">
                  <svg width="85" height="85" viewBox="0 0 120 120" fill="none" className="filter drop-shadow-xl">
                    <path
                      d="M10,100 C30,70 60,50 110,40 C95,80 65,105 10,100 Z"
                      fill="url(#leafGradRight1)"
                    />
                    <path
                      d="M10,100 Q60,70 110,40"
                      stroke="#A7F3D0"
                      strokeWidth="2"
                    />
                    <path
                      d="M25,110 C45,95 70,85 100,85 C85,110 55,120 25,110 Z"
                      fill="url(#leafGradRight2)"
                    />
                    <defs>
                      <linearGradient id="leafGradRight1" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#064E3B" />
                        <stop offset="60%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#34D399" />
                      </linearGradient>
                      <linearGradient id="leafGradRight2" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#065F46" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* ── Illustrated Almonds / Hazelnuts (Bottom-Right) ── */}
                <div className="absolute -right-6 sm:-right-10 bottom-10 z-25 pointer-events-none">
                  <svg width="70" height="70" viewBox="0 0 100 100" fill="none" className="filter drop-shadow-lg">
                    {/* Whole Almond */}
                    <path
                      d="M30,70 C15,55 20,35 40,25 C55,20 65,35 55,55 C48,70 38,75 30,70 Z"
                      fill="url(#almondGrad)"
                    />
                    <path
                      d="M32,60 C25,48 30,35 42,28"
                      stroke="#78350F"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                    {/* Cut Hazelnut / Half Almond */}
                    <path
                      d="M50,85 C40,75 45,60 60,55 C75,50 85,65 75,80 C68,90 58,90 50,85 Z"
                      fill="#D97706"
                    />
                    <ellipse cx="62" cy="70" rx="10" ry="12" fill="#FEF3C7" transform="rotate(-15 62 70)" />
                    <circle cx="62" cy="70" r="4" fill="#FDE68A" />
                    <defs>
                      <linearGradient id="almondGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#78350F" />
                        <stop offset="50%" stopColor="#92400E" />
                        <stop offset="100%" stopColor="#B45309" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* ── Top-Right Sparkle Rays Doodle \ | / ── */}
                <div className="absolute -top-6 right-6 z-20 pointer-events-none">
                  <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
                    <line x1="8" y1="12" x2="20" y2="28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.85" />
                    <line x1="25" y1="5" x2="25" y2="25" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.85" />
                    <line x1="42" y1="12" x2="30" y2="28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.85" />
                  </svg>
                </div>

                {/* ─── Floating AR Badge 1: MRP & Expiry (Top Left above Phone 1) ─── */}
                <div className="absolute -top-3 left-2 sm:left-4 z-40 flex items-center gap-2 bg-[#0E3A24] border border-[#28DF7E]/60 rounded-full px-3.5 py-1.5 shadow-xl animate-float-gentle">
                  <div className="h-4 w-4 rounded-full bg-[#28DF7E] flex items-center justify-center text-[#072418] shrink-0">
                    <Check className="h-2.5 w-2.5 stroke-[3.5]" />
                  </div>
                  <span className="text-[11.5px] font-bold text-white whitespace-nowrap tracking-tight">
                    MRP &amp; Expiry
                  </span>
                </div>

                {/* ─── Floating AR Badge 2: Missing Manufacturer (Top Right above Phone 2) ─── */}
                <div className="absolute -top-4 right-0 sm:-right-4 z-40 flex items-center gap-2 bg-[#FFF0E8] border border-[#FDBA74] rounded-2xl px-3 py-2 shadow-xl animate-float-gentle">
                  <div className="h-5 w-5 rounded-full bg-[#EA580C] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <AlertTriangle className="h-3 w-3 stroke-[2.5]" />
                  </div>
                  <span className="text-[10.5px] font-extrabold text-[#1E293B] leading-tight block">
                    Missing<br />Manufacturer
                  </span>
                </div>

                {/* ─── Floating AR Badge 3: MRP & Expiry (Bottom Left below Phone 1) ─── */}
                <div className="absolute bottom-6 -left-6 sm:-left-10 z-40 flex items-center gap-2 bg-[#0E3A24] border border-[#28DF7E]/60 rounded-full px-3.5 py-1.5 shadow-xl animate-float-opposite">
                  <div className="h-4 w-4 rounded-full bg-[#28DF7E] flex items-center justify-center text-[#072418] shrink-0">
                    <Check className="h-2.5 w-2.5 stroke-[3.5]" />
                  </div>
                  <span className="text-[11.5px] font-bold text-white whitespace-nowrap tracking-tight">
                    MRP &amp; Expiry
                  </span>
                </div>

                {/* ─── Floating AR Badge 4: Allergens Found (Mid Right of Phone 2) ─── */}
                <div className="absolute bottom-32 -right-4 sm:-right-10 z-40 flex items-center gap-2 bg-[#E8F8EE] border border-[#28DF7E] rounded-full px-3.5 py-1.5 shadow-xl animate-float-opposite">
                  <div className="h-4 w-4 rounded-full bg-[#28DF7E] flex items-center justify-center text-[#072418] shrink-0">
                    <Check className="h-2.5 w-2.5 stroke-[3.5]" />
                  </div>
                  <span className="text-[11.5px] font-bold text-[#064E3B] whitespace-nowrap tracking-tight">
                    Allergens Found
                  </span>
                </div>

                {/* ══════════════════════════════════════════════════ */}
                {/*  PHONE 1: The Scanner Phone (Left)                 */}
                {/* ══════════════════════════════════════════════════ */}
                <div className="relative z-20 w-[225px] sm:w-[245px] lg:w-[255px] h-[465px] sm:h-[495px] lg:h-[515px] rounded-[40px] bg-[#1c1c1e] p-[4px] shadow-[0_30px_60px_rgba(0,0,0,0.85)] border border-neutral-700/80">
                  <div className="relative rounded-[36px] overflow-hidden bg-[#07130C] h-full flex flex-col justify-between">
                    
                    {/* Top Status Bar & Dynamic Island */}
                    <div className="pt-2 px-3.5 flex items-center justify-between text-white/75 text-[9px] font-medium">
                      <span>9:41</span>
                      <div className="h-[15px] w-[58px] bg-black rounded-full flex items-center justify-end pr-2">
                        <div className="h-2 w-2 rounded-full bg-[#112419] border border-white/20" />
                      </div>
                      <div className="flex items-center gap-1 text-[8.5px]">
                        <span>5G</span>
                        <div className="w-3.5 h-2 border border-white/60 rounded-xs flex items-center p-0.5">
                          <div className="h-full w-full bg-white/90 rounded-2xs" />
                        </div>
                      </div>
                    </div>

                    {/* App Header */}
                    <div className="px-3.5 py-1 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="h-4 w-4 rounded bg-[#28DF7E] flex items-center justify-center">
                          <ShieldCheck className="h-2.5 w-2.5 text-[#072418] stroke-[3]" />
                        </div>
                        <span className="font-extrabold text-[11.5px] tracking-tight text-white">
                          Safe<span className="text-[#28DF7E]">Food</span>
                        </span>
                      </div>
                      <Menu className="h-4 w-4 text-white/80" />
                    </div>

                    {/* Scanner Title */}
                    <div className="text-center px-2">
                      <div className="text-[11.5px] font-bold text-white tracking-tight">
                        Scan Food Package
                      </div>
                      <div className="text-[8px] text-[#A7C8B6] mt-0.5">
                        Point your camera at the barcode or label
                      </div>
                    </div>

                    {/* Camera Viewfinder with Target Reticle & Product */}
                    <div className="flex-1 flex items-center justify-center relative my-1.5 px-3">
                      
                      {/* 4 Green Corner Reticles */}
                      <div className="absolute inset-2.5 pointer-events-none z-20">
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-[2.5px] border-l-[2.5px] border-[#28DF7E] rounded-tl-sm shadow-[0_0_8px_#28DF7E]" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-[2.5px] border-r-[2.5px] border-[#28DF7E] rounded-tr-sm shadow-[0_0_8px_#28DF7E]" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-[2.5px] border-l-[2.5px] border-[#28DF7E] rounded-bl-sm shadow-[0_0_8px_#28DF7E]" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-[2.5px] border-r-[2.5px] border-[#28DF7E] rounded-br-sm shadow-[0_0_8px_#28DF7E]" />
                      </div>

                      {/* Animated Neon Laser Scan Line */}
                      <div className="absolute left-2.5 right-2.5 h-[2px] bg-[#28DF7E] shadow-[0_0_12px_#28DF7E] animate-scan-line z-20 pointer-events-none" />

                      {/* Product Package: Healthy Bites Snack Bar */}
                      <div className="w-[145px] sm:w-[160px] rounded-xl bg-gradient-to-b from-[#EA580C] via-[#C2410C] to-[#9A3412] p-2.5 flex flex-col justify-between shadow-lg border border-amber-400/30">
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] font-black text-white tracking-tight">Healthy Bites</span>
                          {/* Veg Dot Symbol */}
                          <div className="h-3 w-3 border border-emerald-400 bg-white/10 rounded-xs flex items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          </div>
                        </div>
                        <div className="text-[8px] text-amber-200 font-semibold mt-0.5">Oats &amp; Almonds</div>
                        <div className="text-[7px] text-white/80">Energy Bar</div>

                        {/* Barcode Rectangle with numbers */}
                        <div className="bg-white rounded p-1 mt-2 flex flex-col items-center shadow-xs">
                          <div className="flex items-center gap-[1px] h-4 w-full justify-center">
                            {[
                              2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 2, 1, 3, 1, 2, 1, 1, 2, 3, 1, 2,
                            ].map((w, i) => (
                              <div
                                key={i}
                                className="h-full bg-black"
                                style={{ width: `${w * 0.8}px` }}
                              />
                            ))}
                          </div>
                          <span className="text-[6.5px] font-mono font-bold text-neutral-800 tracking-wider mt-0.5">
                            8 906123 456789
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Scanning Status Indicator */}
                    <div className="flex justify-center pb-1">
                      <div className="flex items-center gap-1.5 bg-[#0F3520] px-3 py-0.5 rounded-full border border-[#28DF7E]/50 shadow-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#28DF7E] animate-pulse" />
                        <span className="text-[9.5px] text-[#4ADE80] font-semibold">Scanning</span>
                      </div>
                    </div>

                    {/* Bottom App Navigation Bar */}
                    <div className="bg-[#05110B] border-t border-white/10 px-3.5 py-2 flex items-center justify-around text-white/60 text-[7.5px] font-medium">
                      <div className="flex flex-col items-center text-[#28DF7E]">
                        <ScanIcon className="h-3.5 w-3.5" />
                        <span className="mt-0.5 font-bold">Scan</span>
                      </div>
                      <div className="flex flex-col items-center hover:text-white transition-colors">
                        <HistoryIcon className="h-3.5 w-3.5" />
                        <span className="mt-0.5">History</span>
                      </div>
                      <div className="flex flex-col items-center hover:text-white transition-colors">
                        <FileText className="h-3.5 w-3.5" />
                        <span className="mt-0.5">Reports</span>
                      </div>
                      <div className="flex flex-col items-center hover:text-white transition-colors">
                        <User className="h-3.5 w-3.5" />
                        <span className="mt-0.5">Profile</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* ══════════════════════════════════════════════════ */}
                {/*  PHONE 2: The Report Dossier Phone (Right)         */}
                {/* ══════════════════════════════════════════════════ */}
                <div className="relative z-30 -ml-10 sm:-ml-14 mt-4 lg:mt-6 w-[225px] sm:w-[245px] lg:w-[255px] h-[465px] sm:h-[495px] lg:h-[515px] rounded-[40px] bg-[#1c1c1e] p-[4px] shadow-[0_35px_70px_rgba(0,0,0,0.92)] border border-neutral-700/80">
                  <div className="relative rounded-[36px] overflow-hidden bg-[#07130C] h-full flex flex-col justify-between p-3">
                    
                    {/* Status Bar */}
                    <div className="pt-0.5 flex items-center justify-between text-white/75 text-[9px] font-medium">
                      <span>9:41</span>
                      <div className="h-[15px] w-[58px] bg-black rounded-full" />
                      <span>100%</span>
                    </div>

                    {/* Screen Header */}
                    <div className="text-white text-[11px] font-bold flex items-center gap-1.5 pt-1">
                      <ChevronRight className="h-3.5 w-3.5 rotate-180 text-white/80" />
                      <span>SafeFood Report</span>
                    </div>

                    {/* Product is Safe Banner */}
                    <div className="bg-[#113B26] rounded-xl p-2.5 border border-[#28DF7E]/50 text-center my-1 shadow-sm">
                      <div className="h-6 w-6 rounded-full bg-[#28DF7E] flex items-center justify-center mx-auto text-[#072418] mb-1 shadow-sm">
                        <ShieldCheck className="h-4 w-4 stroke-[3]" />
                      </div>
                      <div className="text-[12px] font-black text-white tracking-tight">Product is Safe</div>
                      <div className="text-[7.5px] text-[#A7C8B6] mt-0.5 font-medium">
                        No counterfeit or illegal issues detected!
                      </div>
                    </div>

                    {/* Compliance Checklist Items */}
                    <div className="space-y-1 my-0.5">
                      {[
                        { title: 'Product Authenticity', sub: 'Genuine product', pass: true },
                        { title: 'Mandatory Details', sub: 'All required info present', pass: true },
                        { title: 'MRP & Expiry', sub: 'Valid & clearly mentioned', pass: true },
                        { title: 'Nutrition Information', sub: 'Available & accurate', pass: true },
                        { title: 'Allergens', sub: 'Contains allergens (see details)', pass: false },
                        { title: 'Legal Compliance', sub: 'FSSAI license missing', pass: false },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-white/[0.05] px-2 py-1.5 rounded-lg text-[8px] border border-white/5"
                        >
                          <div className="flex items-center gap-1.5 text-white">
                            <span
                              className={`flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-black shrink-0 ${
                                item.pass
                                  ? 'bg-[#28DF7E]/20 text-[#28DF7E]'
                                  : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                              }`}
                            >
                              {item.pass ? '✓' : '⚠️'}
                            </span>
                            <div>
                              <div className="font-bold leading-none text-white/95">{item.title}</div>
                              <div className="text-[6.5px] text-white/50 leading-none mt-0.5">{item.sub}</div>
                            </div>
                          </div>
                          <span
                            className={`font-black text-[9px] ${
                              item.pass ? 'text-[#28DF7E]' : 'text-[#F59E0B]'
                            }`}
                          >
                            {item.pass ? '✓' : '>'}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Share Report Button */}
                    <button
                      type="button"
                      className="w-full py-2 rounded-xl bg-[#28DF7E] hover:bg-[#22C55E] text-[#072418] font-black text-[10px] flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <Share2 className="h-3 w-3 stroke-[2.5]" />
                      <span>Share Report</span>
                    </button>

                  </div>
                </div>

                {/* ─── Bottom-Right Handwriting Cursive Signature ─── */}
                <div
                  className="absolute -bottom-7 -right-4 sm:-right-8 lg:-right-12 z-35 font-caveat text-[#28DF7E] text-[28px] sm:text-[34px] font-bold leading-[0.95] pointer-events-none transform -rotate-[7deg] select-none filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                >
                  Real Food.<br />
                  Real Safety.
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
      {/*  KEY FEATURES: Smarter Scans. Safer Food.              */}
      {/* ══════════════════════════════════════════════════════ */}
      <section id="features" className="pt-8 pb-14 sm:pb-20 bg-white relative z-20 overflow-hidden">
        
        {/* Subtle Decorative Botanical Green Line Leaf in Top Left Corner */}
        <div className="absolute top-2 left-6 lg:left-12 pointer-events-none opacity-80">
          <svg width="45" height="45" viewBox="0 0 60 60" fill="none">
            <path
              d="M10,50 C20,25 45,15 55,10 C45,30 35,45 10,50 Z"
              stroke="#28DF7E"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M10,50 Q32,32 55,10"
              stroke="#28DF7E"
              strokeWidth="1.5"
            />
            <path
              d="M10,50 C8,38 15,28 28,24 C24,34 20,44 10,50 Z"
              stroke="#28DF7E"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Subtle Decorative Botanical Green Line Leaf in Top Right Corner */}
        <div className="absolute top-2 right-6 lg:right-12 pointer-events-none opacity-80">
          <svg width="45" height="45" viewBox="0 0 60 60" fill="none">
            <path
              d="M50,50 C40,25 15,15 5,10 C15,30 25,45 50,50 Z"
              stroke="#28DF7E"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M50,50 Q28,32 5,10"
              stroke="#28DF7E"
              strokeWidth="1.5"
            />
            <path
              d="M50,50 C52,38 45,28 32,24 C36,34 40,44 50,50 Z"
              stroke="#28DF7E"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          
          {/* Section Heading */}
          <div className="text-center max-w-xl mx-auto mb-9">
            <span className="text-[#16A34A] text-xs font-black uppercase tracking-widest block mb-1.5">
              KEY FEATURES
            </span>
            <h2 className="text-[28px] sm:text-[34px] font-extrabold text-[#111827] tracking-tight">
              Smarter Scans. Safer Food.
            </h2>
            <p className="text-[#6B7280] text-sm mt-1.5">
              From barcode to batch details &mdash; SafeFood checks it all.
            </p>
          </div>

          {/* 5 Clean White Cards in 1 Row on Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">

            {/* Card 1: Hidden Details Scan */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#28DF7E]/60 p-5 flex flex-col shadow-xs hover:shadow-md transition-all group">
              <div className="h-11 w-11 rounded-xl bg-[#EBFBF2] group-hover:bg-[#D8F8E5] flex items-center justify-center mb-3.5 text-[#22C55E] transition-colors">
                <ScanIcon className="h-5 w-5" />
              </div>
              <h3 className="text-[14px] font-bold text-[#111827] mb-1">
                Hidden Details Scan
              </h3>
              <p className="text-[12px] text-[#6B7280] leading-relaxed">
                Detects tiny fonts, missing info, wrong labels and more.
              </p>
            </div>

            {/* Card 2: Genuine & Legal Check */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#28DF7E]/60 p-5 flex flex-col shadow-xs hover:shadow-md transition-all group">
              <div className="h-11 w-11 rounded-xl bg-[#EBFBF2] group-hover:bg-[#D8F8E5] flex items-center justify-center mb-3.5 text-[#22C55E] transition-colors">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-[14px] font-bold text-[#111827] mb-1">
                Genuine &amp; Legal Check
              </h3>
              <p className="text-[12px] text-[#6B7280] leading-relaxed">
                Verifies Govt. mandatory info, licenses and compliance.
              </p>
            </div>

            {/* Card 3: Allergens & Nutrition */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#28DF7E]/60 p-5 flex flex-col shadow-xs hover:shadow-md transition-all group">
              <div className="h-11 w-11 rounded-xl bg-[#EBFBF2] group-hover:bg-[#D8F8E5] flex items-center justify-center mb-3.5 text-[#22C55E] transition-colors">
                <Leaf className="h-5 w-5" />
              </div>
              <h3 className="text-[14px] font-bold text-[#111827] mb-1">
                Allergens &amp; Nutrition
              </h3>
              <p className="text-[12px] text-[#6B7280] leading-relaxed">
                Know what&apos;s inside before you eat.
              </p>
            </div>

            {/* Card 4: Fake Product Detection */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#28DF7E]/60 p-5 flex flex-col shadow-xs hover:shadow-md transition-all group">
              <div className="h-11 w-11 rounded-xl bg-[#EBFBF2] group-hover:bg-[#D8F8E5] flex items-center justify-center mb-3.5 text-[#22C55E] transition-colors">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-[14px] font-bold text-[#111827] mb-1">
                Fake Product Detection
              </h3>
              <p className="text-[12px] text-[#6B7280] leading-relaxed">
                Identifies counterfeit and misbranded products.
              </p>
            </div>

            {/* Card 5: Safe for Your Family */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#28DF7E]/60 p-5 flex flex-col shadow-xs hover:shadow-md transition-all group">
              <div className="h-11 w-11 rounded-xl bg-[#EBFBF2] group-hover:bg-[#D8F8E5] flex items-center justify-center mb-3.5 text-[#22C55E] transition-colors">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-[14px] font-bold text-[#111827] mb-1">
                Safe for Your Family
              </h3>
              <p className="text-[12px] text-[#6B7280] leading-relaxed">
                Better food choices for a healthier tomorrow.
              </p>
            </div>

          </div>

          {/* Bottom Store Badges & Web App Bar */}
          <div className="mt-10 pt-6 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4">
            
            {/* Left Botanical line leaf icon */}
            <div className="hidden lg:block text-[#28DF7E]">
              <svg width="32" height="32" viewBox="0 0 50 50" fill="none">
                <path d="M8,42 C16,20 38,12 45,8 C38,24 30,36 8,42 Z" stroke="#28DF7E" strokeWidth="2" strokeLinecap="round" />
                <path d="M8,42 Q26,26 45,8" stroke="#28DF7E" strokeWidth="1.6" />
              </svg>
            </div>

            {/* Center Store Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mx-auto">
              <span className="text-xs font-bold text-[#4B5563] flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#28DF7E]" />
                Available on
              </span>

              {/* App Store Badge */}
              <a
                href="#download"
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#111827] text-white hover:bg-black transition-all hover:scale-102 active:scale-98 shadow-sm"
              >
                <svg className="h-4.5 w-4.5 fill-white" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.35.22-10.33-1.93-14.94-6.46-3.35-3.17-7.2-7.91-11.56-14.22-5.74-8.37-10.35-17.96-13.82-28.77-3.48-10.81-5.21-21.36-5.21-31.65 0-14.89 3.83-27.18 11.49-36.88 7.66-9.7 17.1-14.65 28.32-14.86 4.93 0 10.38 1.25 16.36 3.75 5.98 2.5 9.87 3.81 11.66 3.93 1.57-.12 5.69-1.54 12.37-4.25 6.68-2.72 12.31-3.9 16.89-3.55 12.7.99 22.78 5.76 30.23 14.32-11.05 6.74-16.47 16.03-16.27 27.88.2 9.27 3.86 17.06 10.98 23.36 7.12 6.3 15.35 9.77 24.68 10.42-2.12 6.32-4.78 12.63-7.98 18.94zM119.22 33.15c0-7.23 2.65-13.97 7.95-20.21 5.3-6.24 11.83-10.15 19.59-11.74.85 7.12-1.39 13.89-6.72 20.3-5.33 6.41-11.97 10.46-19.92 12.16-.3-.18-.6-.35-.9-.51z" />
                </svg>
                <div className="text-left">
                  <div className="text-[7.5px] uppercase tracking-wider text-white/70 leading-none">Download on the</div>
                  <div className="text-[11.5px] font-bold leading-none mt-0.5">App Store</div>
                </div>
              </a>

              {/* Google Play Badge */}
              <a
                href="#download"
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#111827] text-white hover:bg-black transition-all hover:scale-102 active:scale-98 shadow-sm"
              >
                <svg className="h-4 w-4 fill-white" viewBox="0 0 512 512">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                </svg>
                <div className="text-left">
                  <div className="text-[7.5px] uppercase tracking-wider text-white/70 leading-none">GET IT ON</div>
                  <div className="text-[11.5px] font-bold leading-none mt-0.5">Google Play</div>
                </div>
              </a>

              {/* Explore Web App Button */}
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#EBFBF2] border border-[#28DF7E] text-[#111827] hover:bg-[#D4F5E2] font-extrabold text-xs transition-all hover:scale-102 active:scale-98 shadow-xs"
              >
                <Monitor className="h-4 w-4 text-[#16A34A]" />
                <span>Explore Web App</span>
              </Link>
            </div>

            {/* Right Botanical line leaf icon */}
            <div className="hidden lg:block text-[#28DF7E]">
              <svg width="32" height="32" viewBox="0 0 50 50" fill="none">
                <path d="M42,42 C34,20 12,12 5,8 C12,24 20,36 42,42 Z" stroke="#28DF7E" strokeWidth="2" strokeLinecap="round" />
                <path d="M42,42 Q24,26 5,8" stroke="#28DF7E" strokeWidth="1.6" />
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
