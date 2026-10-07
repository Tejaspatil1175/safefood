import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ScanLine,
  Cpu,
  FileCheck2,
  History,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Users,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  Menu,
  X,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-neutral-900 flex flex-col scroll-smooth">
      {/* ─── Navigation Bar ─── */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-neutral-900">
              Trust<span className="text-primary-600">Label</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
            <a href="#home" className="hover:text-primary-600 transition-colors">
              Home
            </a>
            <a href="#features" className="hover:text-primary-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-primary-600 transition-colors">
              How It Works
            </a>
            <a href="#about" className="hover:text-primary-600 transition-colors">
              About
            </a>
          </nav>

          {/* Auth Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-surface-muted"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-surface px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-2 text-sm font-medium text-neutral-700">
              <a
                href="#home"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-surface-muted"
              >
                Home
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-surface-muted"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-surface-muted"
              >
                How It Works
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-surface-muted"
              >
                About
              </a>
            </nav>
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="secondary" size="md" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ─── Hero Section ─── */}
      <section id="home" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary-200/40 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Left Copy */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200/80 text-primary-700 text-xs font-semibold shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-primary-600" />
                <span>Legal Metrology (Packaged Commodities) Compliance AI</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight leading-[1.12]">
                AI-Powered Product Label{' '}
                <span className="bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-800 bg-clip-text text-transparent">
                  Verification
                </span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Detect Legal Metrology compliance issues in seconds. Verify mandatory declarations like MRP, Net Quantity, Unit Sale Price (USP), and Manufacturer details with automated OCR intelligence.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link to="/login" className="w-full sm:w-auto">
                  <Button size="lg" icon={ScanLine} className="w-full sm:w-auto shadow-md">
                    Start Scanning
                  </Button>
                </Link>
                <a href="#features" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </a>
              </div>

              {/* Trust Metrics Badge Row */}
              <div className="pt-6 border-t border-border flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-neutral-500 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success-600" />
                  <span>PCR 2011 Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success-600" />
                  <span>8 Mandatory Declarations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success-600" />
                  <span>Dual Role Support</span>
                </div>
              </div>
            </div>

            {/* Hero Right: Interactive Animated Label Scanner Visual */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Floating Compliance Shield Badge */}
                <div className="absolute -top-4 -right-4 z-20 bg-surface border border-success-500/30 rounded-2xl p-3.5 shadow-float flex items-center gap-3 animate-in fade-in zoom-in duration-500">
                  <div className="h-10 w-10 rounded-xl bg-success-50 text-success-600 flex items-center justify-center font-bold">
                    <BadgeCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-900">PCR Compliant</p>
                    <p className="text-[11px] text-success-700 font-semibold">100% Mandatory Match</p>
                  </div>
                </div>

                {/* Packaging Label Card with Scanning Line */}
                <div className="relative bg-surface rounded-2xl border-2 border-primary-500/30 p-6 shadow-float overflow-hidden animate-pulse-glow">
                  {/* Laser Scanning Line Animation */}
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent shadow-[0_0_12px_#4f46e5] animate-scan-line z-20 pointer-events-none" />

                  {/* Packaging Visual Mockup */}
                  <div className="space-y-4">
                    {/* Header with Brand & Product Name */}
                    <div className="p-3 bg-neutral-900 text-white rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-primary-300 tracking-wider">Premium Agro Product</span>
                        <h4 className="text-sm font-bold tracking-tight">Pure Organic Almond Milk 1L</h4>
                      </div>
                      <span className="text-xs font-mono bg-neutral-800 px-2 py-0.5 rounded text-neutral-300">Grade A</span>
                    </div>

                    {/* Detected Bounding Box 1: MRP & USP */}
                    <div className="p-2.5 rounded-lg border-2 border-dashed border-primary-400 bg-primary-50/50 flex items-center justify-between relative">
                      <span className="absolute -top-2.5 left-2 bg-primary-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                        MRP & USP Declaration
                      </span>
                      <span className="text-xs font-bold text-neutral-900">MRP: ₹145.00 (Incl. all taxes)</span>
                      <span className="text-[11px] font-semibold text-primary-700">USP: ₹0.15 / ml</span>
                    </div>

                    {/* Detected Bounding Box 2: Net Quantity */}
                    <div className="p-2.5 rounded-lg border-2 border-dashed border-success-400 bg-success-50/40 flex items-center justify-between relative">
                      <span className="absolute -top-2.5 left-2 bg-success-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                        Net Quantity
                      </span>
                      <span className="text-xs font-bold text-neutral-900">Net Vol: 1000 ml (1 Litre)</span>
                      <CheckCircle2 className="h-4 w-4 text-success-600" />
                    </div>

                    {/* Detected Bounding Box 3: Mfg & Expiry */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg border border-border bg-surface-muted">
                        <span className="text-[10px] text-neutral-500 block">Mfg Date</span>
                        <span className="font-semibold text-neutral-800">10 / 2026</span>
                      </div>
                      <div className="p-2 rounded-lg border border-border bg-surface-muted">
                        <span className="text-[10px] text-neutral-500 block">Country of Origin</span>
                        <span className="font-semibold text-neutral-800">India (IND)</span>
                      </div>
                    </div>

                    {/* Detected Bounding Box 4: Manufacturer */}
                    <div className="p-2.5 rounded-lg border border-border bg-surface text-[11px] text-neutral-600">
                      <span className="font-bold text-neutral-800 block">Manufacturer & Consumer Care:</span>
                      <span>NutriPure Foods Ltd., Plot 42, Food Park, Mumbai. Email: care@nutripure.in</span>
                    </div>
                  </div>
                </div>

                {/* Floating OCR Extraction Tag */}
                <div className="absolute -bottom-3 -left-3 z-20 bg-surface border border-primary-200 rounded-xl p-2.5 shadow-card flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-primary-600 animate-spin" />
                  <span className="text-xs font-semibold text-neutral-800">OCR AI Extraction Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Section (4 Cards) ─── */}
      <section id="features" className="py-20 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="primary" size="md">
              Core Capabilities
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Engineered for Complete Label Compliance
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base">
              From consumer verification to statutory enforcement, TrustLabel automates every step of Legal Metrology auditing.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Smart Label Scanning */}
            <Card hover className="flex flex-col justify-between p-6">
              <div>
                <div className="h-12 w-12 rounded-xl bg-primary-50 text-primary-600 border border-primary-200/70 flex items-center justify-center mb-5">
                  <ScanLine className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">
                  Smart Label Scanning
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Capture and upload front, back, and side packaging photos. Our high-resolution camera ingest accommodates curved bottles, foils, and pouches.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center text-xs font-semibold text-primary-600">
                <span>Multi-Image Ingest</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </Card>

            {/* Card 2: AI-Powered Analysis */}
            <Card hover className="flex flex-col justify-between p-6">
              <div>
                <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/70 flex items-center justify-center mb-5">
                  <Cpu className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">
                  AI-Powered Analysis
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Multimodal vision models instantly extract names, dates, MRP, Unit Sale Prices, net quantity units, and manufacturer information with high confidence.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center text-xs font-semibold text-primary-600">
                <span>Automated Extraction</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </Card>

            {/* Card 3: Compliance Verification */}
            <Card hover className="flex flex-col justify-between p-6">
              <div>
                <div className="h-12 w-12 rounded-xl bg-success-50 text-success-600 border border-success-500/20 flex items-center justify-center mb-5">
                  <FileCheck2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">
                  Compliance Verification
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Real-time rule evaluation rigorously checks package parameters against Legal Metrology (Packaged Commodities) Rules 2011 standards.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center text-xs font-semibold text-primary-600">
                <span>PCR 2011 Rule Engine</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </Card>

            {/* Card 4: Inspection History */}
            <Card hover className="flex flex-col justify-between p-6">
              <div>
                <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-500/20 flex items-center justify-center mb-5">
                  <History className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">
                  Inspection History
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Maintain tamper-proof historical logs of all analyzed commodities with exportable statutory inspection reports and PDF evidence dossiers.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center text-xs font-semibold text-primary-600">
                <span>Audit Logs & PDFs</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── How It Works (3 Steps) ─── */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="neutral" size="md">
              Workflow
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Three Simple Steps to Compliance
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base">
              Get comprehensive Legal Metrology reports in under ten seconds.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 01 */}
            <div className="relative bg-surface rounded-2xl border border-border p-8 shadow-card flex flex-col items-center text-center">
              <span className="text-4xl font-extrabold text-primary-600/30 mb-3">01</span>
              <div className="h-14 w-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                <UploadCloud className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Upload Label</h3>
              <p className="text-xs sm:text-sm text-neutral-600">
                Snap or upload clear photographs of the product's front, back, and nutritional declaration panels.
              </p>
            </div>

            {/* Step 02 */}
            <div className="relative bg-surface rounded-2xl border border-border p-8 shadow-card flex flex-col items-center text-center">
              <span className="text-4xl font-extrabold text-primary-600/30 mb-3">02</span>
              <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Cpu className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">AI Analysis</h3>
              <p className="text-xs sm:text-sm text-neutral-600">
                Multimodal OCR extracts declarations, validates Unit Sale Price formulas, and cross-references statutory rules.
              </p>
            </div>

            {/* Step 03 */}
            <div className="relative bg-surface rounded-2xl border border-border p-8 shadow-card flex flex-col items-center text-center">
              <span className="text-4xl font-extrabold text-primary-600/30 mb-3">03</span>
              <div className="h-14 w-14 rounded-2xl bg-success-50 text-success-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Get Compliance Result</h3>
              <p className="text-xs sm:text-sm text-neutral-600">
                Receive an immediate compliance score, missing field highlights, and one-click statutory grievance filing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Citizen & Enforcement Ecosystem ─── */}
      <section id="about" className="py-20 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning-50 text-warning-700 text-xs font-semibold border border-warning-500/20">
                <ShieldAlert className="h-3.5 w-3.5 text-warning-600" />
                <span>Bridging Citizens & Regulatory Authorities</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                Citizens Report Suspicious Products. Officers Investigate Violations.
              </h2>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                TrustLabel creates a closed-loop compliance bridge. Consumers can verify everyday goods in supermarket aisles and immediately report non-compliant packaging or misleading prices.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Empowering Everyday Consumers</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Check price gouging, dual MRP stickers, and concealed net weights on groceries, cosmetics, and packaged goods.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-warning-50 text-warning-600 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Streamlining Enforcement Operations</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Statutory officers review grievance queues, inspect sampled evidence, and issue legal metrology notices effortlessly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Panel for Dual Roles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-surface-subtle border border-border shadow-card space-y-3">
                <Badge variant="primary" size="sm">
                  Citizen Portal
                </Badge>
                <h4 className="font-bold text-neutral-900 text-base">Consumer Scanner</h4>
                <p className="text-xs text-neutral-600">
                  Instant scanning, verification results, and one-click grievance submission.
                </p>
                <div className="pt-2 text-xs font-semibold text-primary-600 flex items-center">
                  <span>Available to Public</span>
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-900 text-white shadow-card space-y-3">
                <Badge variant="warning" size="sm">
                  Enforcement Cell
                </Badge>
                <h4 className="font-bold text-white text-base">Officer Investigation</h4>
                <p className="text-xs text-neutral-300">
                  Real-time grievance queues, statutory notice generation, and evidence records.
                </p>
                <div className="pt-2 text-xs font-semibold text-warning-400 flex items-center">
                  <span>Authorized Personnel</span>
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Final CTA Section ─── */}
      <section className="py-16 bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="h-14 w-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mx-auto backdrop-blur-xs border border-white/20">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Start Verifying Product Labels Today
          </h2>
          <p className="text-primary-100 text-sm sm:text-base max-w-xl mx-auto">
            Join consumers, retailers, and enforcement officers promoting transparent and legally compliant packaging across India.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary-900 hover:bg-neutral-100 font-bold shadow-float">
                Create Free Account
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                Sign In to Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-surface border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="font-bold text-lg text-neutral-900">
              Trust<span className="text-primary-600">Label</span>
            </span>
          </div>

          <p className="text-xs text-neutral-500 text-center md:text-left">
            Built for Legal Metrology (Packaged Commodities) PCR 2011 compliance verification.
          </p>

          <div className="text-xs text-neutral-400">
            &copy; {new Date().getFullYear()} TrustLabel Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
