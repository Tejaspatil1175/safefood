import React, { useState } from "react";
import { ShieldCheck, User, ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./Navbar.css";

interface NavbarProps {
  onOpenDownload?: () => void;
}

export function Navbar({ onOpenDownload }: NavbarProps) {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="site-header-wrap">
      <header className="site-header content-width">
        <a href="#" className="brand" aria-label="SafeFood home">
          <span className="brand-shield">
            <ShieldCheck />
          </span>
          <span className="brand-title">
            Safe<span className="text-primary">Food</span>
          </span>
          <span className="brand-pill">AI 2.0</span>
        </a>

        <nav className={mobileMenu ? "desktop-nav nav-open" : "desktop-nav"} aria-label="Main navigation">
          <a href="#how-it-works" className="nav-pill-link" onClick={() => setMobileMenu(false)}>
            How It Works
          </a>
          <a href="#features" className="nav-pill-link" onClick={() => setMobileMenu(false)}>
            App Features
          </a>
          <a href="#roles" className="nav-pill-link" onClick={() => setMobileMenu(false)}>
            Ecosystem
          </a>
          <a href="#comparison" className="nav-pill-link" onClick={() => setMobileMenu(false)}>
            Why SafeFood
          </a>
          <a href="#stories" className="nav-pill-link" onClick={() => setMobileMenu(false)}>
            Stories
          </a>
          <a href="#faq" className="nav-pill-link" onClick={() => setMobileMenu(false)}>
            FAQ
          </a>
          <div className="mobile-nav-actions">
            <a href="/login" className="mobile-portal-btn" onClick={() => setMobileMenu(false)}>
              <User style={{ width: 15, height: 15 }} />
              <span>Sign In to Role Portal</span>
            </a>
            <button
              type="button"
              className="mobile-download-btn"
              onClick={() => {
                setMobileMenu(false);
                onOpenDownload?.();
              }}
            >
              Download App <ArrowRight style={{ width: 15, height: 15 }} />
            </button>
          </div>
        </nav>

        <div className="header-actions">
          <a href="/login" className="header-portal-btn" title="Sign in to SafeFood Portal">
            <User style={{ width: 14, height: 14 }} />
            <span>Sign In</span>
          </a>
          <Button variant="download" className="header-download" onClick={onOpenDownload}>
            <span>Download App</span> <ArrowRight className="download-arrow" />
          </Button>
          <Button
            variant="heroOutline"
            size="icon"
            className="mobile-menu"
            aria-label={mobileMenu ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X /> : <Menu />}
          </Button>
        </div>
      </header>
    </div>
  );
}
