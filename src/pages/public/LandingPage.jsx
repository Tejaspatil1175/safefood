import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, CheckCircle2, FileSearch, ShieldAlert } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-neutral-900">
            Trust<span className="text-primary-600">Label</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold mb-6">
          <ShieldCheck className="h-3.5 w-3.5" />
          Legal Metrology (Packaged Commodities) Compliance Platform
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight leading-tight">
          AI-Powered Product Label <br />
          <span className="text-primary-600">Verification & Compliance</span>
        </h1>
        <p className="mt-6 text-lg text-neutral-600 max-w-2xl">
          Automate legal metrology rule auditing, detect non-compliant packaging declarations, and streamline grievance escalation for consumers, enforcement officers, and regulatory bodies.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link to="/login">
            <Button size="lg" icon={ArrowRight}>
              Access Platform
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary" size="lg">
              Create Account
            </Button>
          </Link>
        </div>

        {/* 3 Roles overview cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <Card hover className="bg-surface">
            <div className="h-10 w-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
              <FileSearch className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-neutral-900 text-lg">Consumer Panel</h3>
            <p className="text-sm text-neutral-500 mt-2">
              Scan packaged commodities, instantly check mandatory declarations (MRP, Net Qty, Date, USP), and report violations.
            </p>
          </Card>

          <Card hover className="bg-surface">
            <div className="h-10 w-10 rounded-lg bg-warning-50 text-warning-600 flex items-center justify-center mb-4">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-neutral-900 text-lg">Officer Panel</h3>
            <p className="text-sm text-neutral-500 mt-2">
              Conduct field inspections, triage citizen grievances, review AI compliance scores, and issue statutory notices.
            </p>
          </Card>

          <Card hover className="bg-surface">
            <div className="h-10 w-10 rounded-lg bg-success-50 text-success-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-neutral-900 text-lg">Admin Panel</h3>
            <p className="text-sm text-neutral-500 mt-2">
              Configure Legal Metrology rules, oversee user permissions, monitor system-wide compliance analytics, and inspect audit logs.
            </p>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-neutral-500">
        &copy; {new Date().getFullYear()} TrustLabel Platform. Built for Legal Metrology & Packaged Commodity verification.
      </footer>
    </div>
  );
};

export default LandingPage;
