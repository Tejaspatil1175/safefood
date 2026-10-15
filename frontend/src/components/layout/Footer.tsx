import React from "react";
import { ShieldCheck } from "lucide-react";
import "./Footer.css";

interface FooterProps {
  onOpenPanel?: (panel: "download" | "how" | "business" | "stories" | "contact" | "web") => void;
}

export function Footer({ onOpenPanel }: FooterProps) {
  return (
    <footer className="footer-wrap">
      <div className="content-width">
        <div className="footer-top-grid">
          <div className="footer-brand-col">
            <div className="brand footer-brand">
              <span className="brand-shield">
                <ShieldCheck />
              </span>
              <span className="brand-title">
                Safe<span className="text-primary">Food</span>
              </span>
              <span className="brand-pill">AI 2.0</span>
            </div>
            <p className="footer-mission">
              Empowering consumers, retailers, and food safety officers with real-time AI label analysis, statutory
              compliance verification, and fake product detection.
            </p>
            <div className="footer-status-pill">
              <span className="status-dot-green" /> Regulatory Engine Online
            </div>
          </div>

          <div className="footer-nav-col">
            <h4>Navigation</h4>
            <ul>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#features">Key Features</a></li>
              <li><a href="#roles">Food Ecosystem</a></li>
              <li><a href="#comparison">Why SafeFood</a></li>
              <li><a href="#stories">Success Stories</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4>Role Portals</h4>
            <ul>
              <li><a href="/app/user/dashboard">Consumer App</a></li>
              <li><a href="/app/officer/dashboard">Food Safety Officer</a></li>
              <li><a href="/app/admin/dashboard">Supermarket Admin</a></li>
              <li><a href="/login">Sign In / Switch Role</a></li>
              <li><a href="/register">Create Account</a></li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4>Compliance & Legal</h4>
            <ul>
              <li><button type="button" onClick={() => onOpenPanel?.("how")}>Verification Methodology</button></li>
              <li><button type="button" onClick={() => onOpenPanel?.("business")}>FSSAI API Integration</button></li>
              <li><button type="button" onClick={() => onOpenPanel?.("contact")}>Contact Support</button></li>
              <li><button type="button" onClick={() => onOpenPanel?.("web")}>Interactive Web Scan</button></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>&copy; {new Date().getFullYear()} SafeFood Technologies. All rights reserved. Designed for Food Transparency.</p>
          <p className="footer-disclaimer">
            Disclaimer: SafeFood provides AI-assisted label analysis and consumer information. For statutory enforcement actions,
            refer to official regulatory agencies.
          </p>
        </div>
      </div>
    </footer>
  );
}
