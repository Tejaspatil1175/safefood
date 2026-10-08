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
/*  full-bleed seamless background and smart sticky navbar.   */
/* ─────────────────────────────────────────────────────────── */

export const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 90);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased bg-[#062E1E]">
      {/* ══════════════════════════════════════════════════════ */}
      {/*  SMART STICKY NAVBAR (Appears when scrolled)           */}
      {/* ══════════════════════════════════════════════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-[#072418]/95 backdrop-blur-md border-b border-white/10 transition-all duration-300 ${
          scrolled ? 'translate-y-0 shadow-xl opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#28DF7E] flex items-center justify-center shadow-sm">
              <ShieldCheck className="h-5 w-5 text-[#072418] stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-[20px] tracking-tight text-white">
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

          {/* Download App Button (Vibrant Yellow) */}
          <div className="hidden sm:block">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FFBA08] hover:bg-[#E5A807] text-[#1A1A1A] text-xs font-extrabold shadow-sm transition-all hover:scale-105 active:scale-95"
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
                className="w-full py-2.5 rounded-full bg-[#FFBA08] text-[#1A1A1A] font-extrabold text-sm text-center shadow-sm"
              >
                Download App
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════════════════════ */}
      {/*  HERO & FEATURES INTERACTIVE CANVAS (/hero.png)        */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-[#062E1E] overflow-hidden select-none">
        {/* Seamless edge blending gradients for ultra-wide monitors */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-1/5 h-full bg-gradient-to-r from-[#062E1E] to-transparent z-10 opacity-60" />
          <div className="absolute top-0 right-0 w-1/5 h-full bg-gradient-to-l from-[#062E1E] to-transparent z-10 opacity-60" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#28DF7E]/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Scaled Responsive Container */}
        <div className="relative w-full max-w-[1672px] mx-auto">
          
          {/* Main Visual Image - Non-draggable, Non-selectable so it feels like native DOM UI */}
          <img
            src="/hero.png"
            alt="SafeFood AI Packaging Scanner & Compliance Platform"
            className="w-full h-auto block select-none pointer-events-none"
            draggable="false"
            style={{ userSelect: 'none', WebkitUserDrag: 'none' }}
          />

          {/* ════════════════════════════════════════════════════════════════ */}
          {/*  INTERACTIVE OVERLAYS LAYER (Real links, hover effects & tooltips) */}
          {/* ════════════════════════════════════════════════════════════════ */}
          <div className="absolute inset-0 z-20">

            {/* ── Navbar: SafeFood Logo ── */}
            <Link
              to="/"
              className="absolute rounded-lg hover:ring-2 hover:ring-[#28DF7E]/30 transition-all cursor-pointer"
              style={{ left: '8.4%', top: '1.8%', width: '12.5%', height: '5.2%' }}
              title="SafeFood Home"
            />

            {/* ── Navbar: Navigation Links ── */}
            <a
              href="#how-it-works"
              className="absolute rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              style={{ left: '30.2%', top: '2.5%', width: '7.4%', height: '4.0%' }}
              title="How It Works"
            />
            <a
              href="#features"
              className="absolute rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              style={{ left: '38.2%', top: '2.5%', width: '7.4%', height: '4.0%' }}
              title="App Features"
            />
            <a
              href="#api"
              className="absolute rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              style={{ left: '46.2%', top: '2.5%', width: '8.4%', height: '4.0%' }}
              title="API / Businesses"
            />
            <a
              href="#stories"
              className="absolute rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              style={{ left: '55.2%', top: '2.5%', width: '8.4%', height: '4.0%' }}
              title="Success Stories"
            />
            <a
              href="#contact"
              className="absolute rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              style={{ left: '64.5%', top: '2.5%', width: '5.5%', height: '4.0%' }}
              title="Contact"
            />

            {/* ── Navbar: Download App Button (Yellow with active ripple) ── */}
            <Link
              to="/login"
              className="absolute rounded-full hover:ring-4 hover:ring-[#FFBA08]/40 hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-lg"
              style={{ left: '82.2%', top: '2.0%', width: '9.2%', height: '4.4%' }}
              title="Download SafeFood App"
            />

            {/* ── Hero CTA 1: Get the Free App (Green Pill) ── */}
            <Link
              to="/login"
              className="absolute rounded-full hover:ring-4 hover:ring-[#28DF7E]/40 hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-xl"
              style={{ left: '8.8%', top: '48.6%', width: '15.8%', height: '5.2%' }}
              title="Get the Free SafeFood App"
            />

            {/* ── Hero CTA 2: See How It Works (Outline Pill) ── */}
            <a
              href="#how-it-works"
              className="absolute rounded-full hover:bg-white/15 hover:ring-2 hover:ring-white/40 active:scale-95 transition-all cursor-pointer"
              style={{ left: '25.3%', top: '48.6%', width: '13.7%', height: '5.2%' }}
              title="See How It Works"
            />

            {/* ── 4 Circular Trust Badges with informative tooltips ── */}
            <div
              className="absolute rounded-full hover:bg-white/10 transition-all cursor-pointer"
              style={{ left: '8.5%', top: '56.8%', width: '6.5%', height: '9.2%' }}
              title="Scanned: 5M+ packaged food products"
            />
            <div
              className="absolute rounded-full hover:bg-white/10 transition-all cursor-pointer"
              style={{ left: '15.8%', top: '56.8%', width: '7.2%', height: '9.2%' }}
              title="Trusted by families & retailers across India"
            />
            <div
              className="absolute rounded-full hover:bg-white/10 transition-all cursor-pointer"
              style={{ left: '23.8%', top: '56.8%', width: '6.5%', height: '9.2%' }}
              title="Verified by food safety & legal experts"
            />
            <div
              className="absolute rounded-full hover:bg-white/10 transition-all cursor-pointer"
              style={{ left: '30.5%', top: '56.8%', width: '6.5%', height: '9.2%' }}
              title="Real-time AI Metrology & Allergen Checks"
            />

            {/* ── Active AI Scanner Laser Beam (Animates continuously across camera viewfinder) ── */}
            <div
              className="absolute pointer-events-none overflow-hidden rounded-xl"
              style={{ left: '59.8%', top: '30.8%', width: '10.5%', height: '21.5%' }}
            >
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#28DF7E] to-transparent shadow-[0_0_14px_#28DF7E] animate-scan-beam" />
            </div>

            {/* ── Floating AR Badges: Interactive Hover Responses ── */}
            <div
              className="absolute rounded-full hover:ring-2 hover:ring-[#28DF7E] hover:scale-105 transition-transform cursor-pointer"
              style={{ left: '52.0%', top: '13.2%', width: '9.8%', height: '4.4%' }}
              title="MRP & Expiry Verification: Valid & clearly mentioned"
            />
            <div
              className="absolute rounded-2xl hover:ring-2 hover:ring-[#EA580C] hover:scale-105 transition-transform cursor-pointer"
              style={{ left: '84.6%', top: '16.8%', width: '9.2%', height: '6.5%' }}
              title="Legal Metrology Alert: Missing Manufacturer Details"
            />
            <div
              className="absolute rounded-full hover:ring-2 hover:ring-[#28DF7E] hover:scale-105 transition-transform cursor-pointer"
              style={{ left: '51.3%', top: '57.0%', width: '9.8%', height: '4.4%' }}
              title="MRP & Expiry Verified"
            />
            <div
              className="absolute rounded-full hover:ring-2 hover:ring-[#22C55E] hover:scale-105 transition-transform cursor-pointer"
              style={{ left: '84.5%', top: '38.0%', width: '10.2%', height: '4.6%' }}
              title="Allergens Found: Tree nuts & dairy"
            />

            {/* ── 5 Key Feature Cards: Interactive Click & Hover ── */}
            <a
              href="#how-it-works"
              className="absolute rounded-2xl hover:ring-2 hover:ring-[#22C55E]/50 hover:bg-[#22C55E]/[0.03] transition-all cursor-pointer"
              style={{ left: '8.6%', top: '79.0%', width: '15.8%', height: '12.6%' }}
              title="Hidden Details Scan: Detects tiny fonts, missing info, wrong labels"
            />
            <a
              href="#compliance"
              className="absolute rounded-2xl hover:ring-2 hover:ring-[#22C55E]/50 hover:bg-[#22C55E]/[0.03] transition-all cursor-pointer"
              style={{ left: '25.3%', top: '79.0%', width: '15.8%', height: '12.6%' }}
              title="Genuine & Legal Check: Verifies Govt mandatory info & licenses"
            />
            <a
              href="#features"
              className="absolute rounded-2xl hover:ring-2 hover:ring-[#22C55E]/50 hover:bg-[#22C55E]/[0.03] transition-all cursor-pointer"
              style={{ left: '42.0%', top: '79.0%', width: '15.8%', height: '12.6%' }}
              title="Allergens & Nutrition: Know what's inside before you eat"
            />
            <a
              href="#features"
              className="absolute rounded-2xl hover:ring-2 hover:ring-[#22C55E]/50 hover:bg-[#22C55E]/[0.03] transition-all cursor-pointer"
              style={{ left: '58.6%', top: '79.0%', width: '15.8%', height: '12.6%' }}
              title="Fake Product Detection: Identifies counterfeit & misbranded goods"
            />
            <a
              href="#how-it-works"
              className="absolute rounded-2xl hover:ring-2 hover:ring-[#22C55E]/50 hover:bg-[#22C55E]/[0.03] transition-all cursor-pointer"
              style={{ left: '75.3%', top: '79.0%', width: '15.8%', height: '12.6%' }}
              title="Safe for Your Family: Better food choices for a healthier tomorrow"
            />

            {/* ── Bottom Store Badges: App Store, Google Play, Explore Web App ── */}
            <a
              href="#app-store"
              className="absolute rounded-lg hover:ring-2 hover:ring-black hover:scale-105 active:scale-95 transition-all cursor-pointer"
              style={{ left: '40.0%', top: '93.6%', width: '6.4%', height: '4.0%' }}
              title="Download on Apple App Store"
            />
            <a
              href="#google-play"
              className="absolute rounded-lg hover:ring-2 hover:ring-black hover:scale-105 active:scale-95 transition-all cursor-pointer"
              style={{ left: '46.8%', top: '93.6%', width: '6.8%', height: '4.0%' }}
              title="Get it on Google Play Store"
            />
            <Link
              to="/login"
              className="absolute rounded-full hover:ring-2 hover:ring-[#22C55E] hover:bg-[#22C55E]/10 active:scale-95 transition-all cursor-pointer"
              style={{ left: '57.3%', top: '93.4%', width: '10.5%', height: '4.4%' }}
              title="Launch & Explore SafeFood Web App"
            />

          </div>
        </div>

        {/* Seamless Soft Transition into the rest of the page */}
        <div className="w-full h-8 bg-gradient-to-b from-[#EAF6E7]/80 to-[#F8FAF9]" />
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
