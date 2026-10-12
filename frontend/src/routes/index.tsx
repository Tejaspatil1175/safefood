import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Apple,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  Leaf,
  Menu,
  Monitor,
  Play,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Sprout,
  Star,
  TriangleAlert,
  Users,
  X,
  User,
  Building2,
  ChevronDown,
  Sparkles,
  ShieldAlert,
  Award,
  HelpCircle,
  Activity,
  FileCheck,
  Store,
  Eye,
  CheckCheck,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import phones from "@/assets/safefood-phones.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SafeFood — AI Scans for Safer Choices" },
      { name: "description", content: "Discover SafeFood: packaged food checks for hidden label details, allergens, nutrition, and product authenticity." },
      { property: "og:title", content: "SafeFood — AI Scans for Safer Choices" },
      { property: "og:description", content: "Smarter scans. Safer food. Discover what is inside your packaged food." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ]
  }),
  component: Index,
});

const features = [
  { icon: ScanLine, title: "Hidden Details Scan", text: "Detects tiny fonts, missing info, wrong labels and more." },
  { icon: ShieldCheck, title: "Genuine & Legal Check", text: "Verifies Govt. mandatory info, licenses and compliance." },
  { icon: Sprout, title: "Allergens & Nutrition", text: "Know what’s inside before you eat." },
  { icon: FileText, title: "Fake Product Detection", text: "Identifies counterfeit and misbranded products." },
  { icon: Users, title: "Safe for Your Family", text: "Better food choices for a healthier tomorrow." },
];
const trust = [
  { icon: Star, label: <>Scanned<br />5M+ packets</> },
  { icon: ShieldCheck, label: <>Trusted by<br />families & retailers</> },
  { icon: Sprout, label: <>Verified<br />by experts</> },
  { icon: Clock3, label: <>Real-time<br />AI checks</> },
];

const howSteps = [
  {
    num: "01",
    title: "Scan Package or Barcode",
    desc: "Point your smartphone at any packaged food label. SafeFood instantly captures front, back, nutritional tables, and tiny legal print.",
    tag: "Instant Camera OCR"
  },
  {
    num: "02",
    title: "Multi-Vector AI Verification",
    desc: "Our model cross-references FSSAI mandatory declarations, allergen synonyms, chemical additives, and batch manufacturing dates.",
    tag: "Regulatory Cross-Check"
  },
  {
    num: "03",
    title: "Actionable Safety Scorecard",
    desc: "Get an unambiguous safety verdict within 0.4 seconds. Flag counterfeit packaging, allergen triggers, or expired shelf stock.",
    tag: "Clear Safety Verdict"
  }
];

const sampleScans = [
  {
    name: "Oats & Almond Energy Bar (40g)",
    status: "Verified Safe",
    badgeType: "safe",
    points: ["Expiry valid (8 mos left)", "FSSAI License active & genuine", "Allergen: Contains Tree Nuts & Gluten"],
    score: "94/100"
  },
  {
    name: "Classic Masala Potato Crisps (120g)",
    status: "Violation Warning",
    badgeType: "warning",
    points: ["Illegal tiny font on Net Quantity", "Missing Customer Care Email", "Excessive Saturated Fat (>35%)"],
    score: "58/100"
  },
  {
    name: "Herbal Fruit Jam (500g)",
    status: "Counterfeit Flagged",
    badgeType: "danger",
    points: ["FSSAI License does not match batch", "Missing Manufacturer Address", "Undeclared Artificial Colouring"],
    score: "18/100"
  }
];

const comparisonData = [
  {
    feature: "Tiny 4pt font reading",
    traditional: "Straining your eyes or skipped entirely",
    safefood: "AI OCR digitizes & magnifies instantly in 0.4s",
  },
  {
    feature: "Chemical & E-numbers",
    traditional: "Confusing codes like INS 621, E-211",
    safefood: "Plain English explanations of health impact",
  },
  {
    feature: "Govt Mandatory Info",
    traditional: "Hard to verify if declarations are legal",
    safefood: "Automated check for all statutory FSSAI fields",
  },
  {
    feature: "Counterfeit Detection",
    traditional: "Cannot detect duplicated packaging",
    safefood: "Cross-checks barcodes & batch registries",
  },
  {
    feature: "Allergen Warning",
    traditional: "Buried deep inside technical text",
    safefood: "High-priority personalized alerts for your family",
  }
];

const testimonials = [
  {
    quote: "SafeFood saved my son from a severe peanut allergic reaction. The snack label concealed peanut flour in tiny 3pt print, but SafeFood flashed an immediate alert.",
    author: "Dr. Ananya Sharma",
    role: "Pediatrician & Mother, Mumbai",
    scans: "140+ scans"
  },
  {
    quote: "As a supermarket store manager, we use the SafeFood portal to audit batches from new FMCG suppliers. It has helped us keep fake and misbranded goods off our shelves.",
    author: "Rajesh Varma",
    role: "Retail Inventory Lead, Bengaluru",
    scans: "1,200+ scans"
  },
  {
    quote: "The speed and OCR accuracy of SafeFood are unmatched. It validates license numbers and legal declarations faster than manual field inspections.",
    author: "Pooja Deshmukh",
    role: "Food Safety & Quality Auditor, Pune",
    scans: "850+ scans"
  }
];

const faqs = [
  {
    q: "How does SafeFood detect fake or counterfeit food packets?",
    a: "SafeFood inspects multiple packaging indicators including barcode parity, batch numbering format, mandatory manufacturer credentials, and official license databases to flag counterfeit duplicates and misbranded products."
  },
  {
    q: "Can SafeFood alert me about specific allergens my family has?",
    a: "Yes! You can configure allergen profiles (such as gluten, lactose, peanuts, soy, or shellfish). Whenever a scanned product contains that allergen or derived synonyms, SafeFood warns you with an unmistakable red alert."
  },
  {
    q: "How can retailers and enforcement officers use the SafeFood Portal?",
    a: "We have dedicated web portals for enforcement officers to conduct field batch audits and log violations, as well as retail inventory consoles for high-throughput shelf monitoring. You can access them via the Sign In portal."
  },
  {
    q: "Is the SafeFood consumer app free to use?",
    a: "Yes! The core SafeFood scanning app is free for families and consumers to scan everyday groceries and ensure what they eat is genuine, safe, and legal."
  }
];

type Panel = "download" | "how" | "business" | "stories" | "contact" | "web" | null;

function Index() {
  const [panel, setPanel] = useState<Panel>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [demoScanned, setDemoScanned] = useState(false);
  const [activeScanIdx, setActiveScanIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const open = (value: Panel) => { setPanel(value); setMobileMenu(false); setDemoScanned(false); };
  const activeScan = sampleScans[activeScanIdx] ?? sampleScans[0]!;

  return (
    <main>
      <section className="hero-section">
        <div className="site-header-wrap">
          <header className="site-header content-width">
            <a href="#" className="brand" aria-label="SafeFood home">
              <span className="brand-shield"><ShieldCheck /></span>
              <span className="brand-title">Safe<span className="text-primary">Food</span></span>
              <span className="brand-pill">AI 2.0</span>
            </a>
            <nav className={mobileMenu ? "desktop-nav nav-open" : "desktop-nav"} aria-label="Main navigation">
              <a href="#how-it-works" className="nav-pill-link" onClick={() => setMobileMenu(false)}>How It Works</a>
              <a href="#features" className="nav-pill-link" onClick={() => setMobileMenu(false)}>App Features</a>
              <a href="#roles" className="nav-pill-link" onClick={() => setMobileMenu(false)}>Ecosystem</a>
              <a href="#comparison" className="nav-pill-link" onClick={() => setMobileMenu(false)}>Why SafeFood</a>
              <a href="#stories" className="nav-pill-link" onClick={() => setMobileMenu(false)}>Stories</a>
              <a href="#faq" className="nav-pill-link" onClick={() => setMobileMenu(false)}>FAQ</a>
              <div className="mobile-nav-actions">
                <a href="/login" className="mobile-portal-btn" onClick={() => setMobileMenu(false)}>
                  <User style={{ width: 15, height: 15 }} />
                  <span>Sign In to Role Portal</span>
                </a>
                <button type="button" className="mobile-download-btn" onClick={() => open("download")}>
                  Download App <ArrowRight style={{ width: 15, height: 15 }} />
                </button>
              </div>
            </nav>
            <div className="header-actions">
              <a href="/login" className="header-portal-btn" title="Sign in to SafeFood Portal">
                <User style={{ width: 14, height: 14 }} />
                <span>Sign In</span>
              </a>
              <Button variant="download" className="header-download" onClick={() => open("download")}>
                <span>Download App</span> <ArrowRight className="download-arrow" />
              </Button>
              <Button variant="heroOutline" size="icon" className="mobile-menu" aria-label={mobileMenu ? "Close menu" : "Open menu"} onClick={() => setMobileMenu(!mobileMenu)}>
                {mobileMenu ? <X /> : <Menu />}
              </Button>
            </div>
          </header>
        </div>

        <div className="hero-grid content-width">
          <div className="hero-copy">
            <div className="eyebrow-pill"><CheckCircle2 /> AI-Powered Food Safety</div>
            <h1>Is Your Food Pack<br className="desktop-break" /> Genuine, Safe & Legal?<br />Find Out <span>Instantly.</span></h1>
            <p className="hero-description">SafeFood uses advanced AI to scan packaged foods instantly, checking for hidden details, illegal tiny fonts, missing Govt mandatory info, and fake products, along with new features like allergens, nutrition, and licenses.</p>
            <div className="hero-actions">
              <Button variant="hero" onClick={() => open("download")}>Get the Free App <span className="button-divider" /><Apple /><Play className="play-store" /></Button>
              <Button variant="heroOutline" onClick={() => open("how")}><Play className="text-primary" />See How It Works</Button>
            </div>
            <div className="trust-row">{trust.map(({ icon: Icon, label }, i) => <div className="trust-item" key={i}><span className={`trust-icon trust-icon-${i}`}><Icon /></span><p>{label}</p></div>)}</div>
          </div>
          <div className="hero-visual">
            <img src={phones} width={1200} height={1024} alt="SafeFood scanning a packaged snack and displaying a food safety report on two phones" />
            <span className="scan-badge badge-expiry"><CheckCircle2 />MRP & Expiry</span>
            <span className="scan-badge badge-warning"><TriangleAlert /> <span>Missing<br />Manufacturer</span></span>
            <span className="scan-badge badge-allergens"><CheckCircle2 />Allergens Found</span>
            <span className="scan-badge badge-verified"><CheckCircle2 />Label Verified</span>
            <span className="handwritten">Real Food.<br /><span>Real Safety.</span></span>
          </div>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true"><path d="M0 83C190 190 399 153 581 79C813 -15 1090 160 1280 64C1352 28 1390 8 1440 0V160H0Z" /></svg>
      </section>

      {/* KEY FEATURES SECTION */}
      <section id="features" className="features-section">
        <div className="content-width">
          <div className="section-heading"><span>KEY FEATURES</span><h2>Smarter Scans. Safer Food.</h2><p>From barcode to batch details — SafeFood checks it all.</p></div>
          <div className="feature-grid">{features.map(({ icon: Icon, title, text }) => <article className="feature-item" key={title}><span className="feature-icon"><Icon /></span><h3>{title}</h3><p>{text}</p></article>)}</div>
          <div className="availability"><span className="available-label"><Smartphone />Available on</span><Button variant="store" onClick={() => open("download")}><Apple /><span><small>Download on the</small>App Store</span></Button><Button variant="store" onClick={() => open("download")}><Play className="text-primary" /><span><small>GET IT ON</small>Google Play</span></Button><span className="availability-divider" /><Button variant="outline" className="web-button" onClick={() => open("web")}><Monitor />Explore Web App</Button></div>
        </div>
        <Leaf className="footer-leaf leaf-left" /><Sprout className="footer-leaf leaf-right" />
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="sf-section how-section">
        <div className="content-width">
          <div className="section-heading">
            <span>HOW IT WORKS</span>
            <h2>From Label Scan to Safety Verdict in 0.4s</h2>
            <p>Three effortless steps to protect what you and your family eat.</p>
          </div>

          <div className="how-workflow-grid">
            <div className="how-steps-cards">
              {howSteps.map((step, idx) => (
                <div className="how-step-card" key={step.num}>
                  <div className="how-step-num">{step.num}</div>
                  <div className="how-step-body">
                    <span className="how-step-tag">{step.tag}</span>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="how-demo-panel">
              <div className="how-demo-header">
                <span className="demo-live-dot" />
                <span>Live Interactive AI Diagnostic Sample</span>
              </div>
              <div className="sample-tab-row">
                {sampleScans.map((s, idx) => (
                  <button
                    key={s.name}
                    type="button"
                    className={activeScanIdx === idx ? "sample-tab active" : "sample-tab"}
                    onClick={() => setActiveScanIdx(idx)}
                  >
                    {s.name.split(" ")[0]} {s.name.split(" ")[1]}
                  </button>
                ))}
              </div>
              <div className="sample-card-preview">
                <div className="sample-card-title-row">
                  <div>
                    <strong>{activeScan.name}</strong>
                    <span className="sample-package-id">Batch #SF-2026-X99</span>
                  </div>
                  <span className={`sample-badge badge-${activeScan.badgeType}`}>
                    {activeScan.status}
                  </span>
                </div>
                <div className="sample-points-list">
                  {activeScan.points.map((pt, i) => (
                    <div key={i} className="sample-point">
                      <CheckCircle2 className="pt-icon" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
                <div className="sample-card-footer">
                  <div>
                    <span className="score-label">SafeFood Safety Grade:</span>
                    <strong className="score-val">{activeScan.score}</strong>
                  </div>
                  <Button variant="hero" size="sm" onClick={() => open("web")}>
                    <ScanLine style={{ width: 14, height: 14 }} /> Test Live Scan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROLES / ECOSYSTEM SECTION */}
      <section id="roles" className="sf-section roles-section">
        <div className="content-width">
          <div className="section-heading">
            <span>FOOD SAFETY ECOSYSTEM</span>
            <h2>Built for Families, Retailers & Enforcement Officers</h2>
            <p>A unified intelligence platform connecting consumer trust with regulatory standards.</p>
          </div>

          <div className="roles-grid">
            <article className="role-card">
              <div className="role-icon-pill role-consumer">
                <Users />
              </div>
              <span className="role-badge">For Families</span>
              <h3>Everyday Consumers</h3>
              <p>Instant grocery scanning, personalized allergen alerts for your kids, and immediate fake product detection in your palm.</p>
              <ul className="role-feature-list">
                <li><CheckCheck /> Instant barcode & tiny font OCR</li>
                <li><CheckCheck /> Family allergen danger alerts</li>
                <li><CheckCheck /> Nutritional balance scorecard</li>
              </ul>
              <a href="/app/user/dashboard" className="role-action-link">
                Launch Consumer Portal <ArrowRight style={{ width: 14, height: 14 }} />
              </a>
            </article>

            <article className="role-card role-card-featured">
              <div className="role-featured-tag">Statutory Authority</div>
              <div className="role-icon-pill role-officer">
                <ShieldAlert />
              </div>
              <span className="role-badge">For Regulators</span>
              <h3>Food Safety Officers</h3>
              <p>Mobile audit console for on-ground market inspections, license validity lookup, batch seizure logs, and statutory misbranding tracking.</p>
              <ul className="role-feature-list">
                <li><CheckCheck /> Live FSSAI regulatory database cross-check</li>
                <li><CheckCheck /> Mandatory packaging compliance audit</li>
                <li><CheckCheck /> Violation report & digital seizure logging</li>
              </ul>
              <a href="/app/officer/dashboard" className="role-action-link">
                Launch Officer Portal <ArrowRight style={{ width: 14, height: 14 }} />
              </a>
            </article>

            <article className="role-card">
              <div className="role-icon-pill role-admin">
                <Building2 />
              </div>
              <span className="role-badge">For Supermarkets</span>
              <h3>Retailers & Enterprises</h3>
              <p>Bulk shelf verification, supplier compliance vetting, and inventory management to prevent expired or non-compliant shelf stock.</p>
              <ul className="role-feature-list">
                <li><CheckCheck /> Bulk SKU batch verification API</li>
                <li><CheckCheck /> Supplier authenticity certificates</li>
                <li><CheckCheck /> Counterfeit incidence alerts</li>
              </ul>
              <a href="/app/admin/dashboard" className="role-action-link">
                Launch Admin Console <ArrowRight style={{ width: 14, height: 14 }} />
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* COMPARISON SECTION */}
      <section id="comparison" className="sf-section comparison-section">
        <div className="content-width">
          <div className="section-heading">
            <span>THE SAFEST CHOICE</span>
            <h2>Why Traditional Label Reading Fails</h2>
            <p>See the breakthrough difference SafeFood AI brings to everyday food transparency.</p>
          </div>

          <div className="comparison-table-wrap">
            <div className="comparison-table">
              <div className="comp-row comp-header">
                <div>Food Safety Aspect</div>
                <div>Manual Reading With Naked Eye</div>
                <div className="comp-col-highlight">SafeFood AI Scan</div>
              </div>
              {comparisonData.map((row, i) => (
                <div className="comp-row" key={i}>
                  <div className="comp-feat"><strong>{row.feature}</strong></div>
                  <div className="comp-trad"><span className="comp-x">&#10005;</span> {row.traditional}</div>
                  <div className="comp-sf comp-col-highlight"><CheckCircle2 className="comp-check" /> {row.safefood}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT & TESTIMONIALS SECTION */}
      <section id="stories" className="sf-section stories-section">
        <div className="content-width">
          <div className="section-heading">
            <span>PROVEN IMPACT</span>
            <h2>Protecting Over 5 Million Meals</h2>
            <p>Trusted across households, supermarkets, and quality compliance labs.</p>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-number">5.2M+</span>
              <span className="stat-label">Packets Scanned & Verified</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">99.4%</span>
              <span className="stat-label">AI Label OCR Accuracy</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">12,400+</span>
              <span className="stat-label">Non-Compliant Batches Flagged</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">4.9 / 5</span>
              <span className="stat-label">Average App Store Rating</span>
            </div>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, s) => <Star key={s} className="star-icon" />)}
                </div>
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-author">
                  <strong>{t.author}</strong>
                  <span>{t.role}</span>
                  <small className="testimonial-scans"><Activity style={{ width: 12, height: 12 }} /> {t.scans}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="sf-section faq-section">
        <div className="content-width">
          <div className="section-heading">
            <span>FREQUENTLY ASKED QUESTIONS</span>
            <h2>Everything You Need to Know</h2>
            <p>Answers to common questions about SafeFood AI scanning and compliance.</p>
          </div>

          <div className="faq-list">
            {faqs.map((f, i) => (
              <div
                key={i}
                className={openFaq === i ? "faq-item faq-open" : "faq-item"}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <button type="button" className="faq-question">
                  <span>{f.q}</span>
                  <ChevronDown className="faq-chevron" />
                </button>
                {openFaq === i && (
                  <div className="faq-answer">
                    <p>{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner-section">
        <div className="content-width">
          <div className="cta-banner-card">
            <div className="cta-banner-copy">
              <h2>Ready to scan before you eat?</h2>
              <p>Download the free SafeFood app or launch the role portal for your supermarket or inspection team.</p>
              <div className="cta-banner-actions">
                <Button variant="download" onClick={() => open("download")}>
                  Download App <ArrowRight style={{ width: 15, height: 15 }} />
                </Button>
                <a href="/login" className="cta-portal-btn">
                  Open Role Portal <ArrowRight style={{ width: 15, height: 15 }} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RICH FOOTER */}
      <footer className="site-footer">
        <div className="content-width">
          <div className="footer-top-grid">
            <div className="footer-brand-col">
              <div className="brand footer-brand">
                <span className="brand-shield"><ShieldCheck /></span>
                <span className="brand-title">Safe<span className="text-primary">Food</span></span>
                <span className="brand-pill">AI 2.0</span>
              </div>
              <p className="footer-mission">
                Empowering consumers, retailers, and food safety officers with real-time AI label analysis, statutory compliance verification, and fake product detection.
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
                <li><button type="button" onClick={() => open("how")}>Verification Methodology</button></li>
                <li><button type="button" onClick={() => open("business")}>FSSAI API Integration</button></li>
                <li><button type="button" onClick={() => open("contact")}>Contact Support</button></li>
                <li><button type="button" onClick={() => open("web")}>Interactive Web Scan</button></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <p>&copy; {new Date().getFullYear()} SafeFood Technologies. All rights reserved. Designed for Food Transparency.</p>
            <p className="footer-disclaimer">Disclaimer: SafeFood provides AI-assisted label analysis and consumer information. For statutory enforcement actions, refer to official regulatory agencies.</p>
          </div>
        </div>
      </footer>

      {/* DIALOG MODAL */}
      <Dialog open={panel !== null} onOpenChange={(value: boolean) => { if (!value) setPanel(null); }}><DialogContent className="safefood-dialog">
        <span className="dialog-icon"><ShieldCheck /></span>
        <DialogTitle>{panel === "how" ? "A closer look at every label" : panel === "business" ? "Safer shelves. More confidence." : panel === "stories" ? "Everyday choices, made safer" : panel === "contact" ? "Let’s talk food safety" : panel === "web" ? "Try a SafeFood scan" : "Take SafeFood with you"}</DialogTitle>
        <DialogDescription>{panel === "download" ? "The SafeFood app is coming soon. App Store and Google Play links will be available here when it launches." : panel === "how" ? "From a packaged food label to a clearer picture of what you eat." : panel === "web" ? "Preview a sample food label check. This demo does not verify a real product." : panel === "business" ? "Food safety checks for retailers, manufacturers, and your own applications." : panel === "stories" ? "Real customer stories will appear here after launch." : "Our contact details will be available here soon."}</DialogDescription>
        {panel === "how" && <div className="how-steps">{[["01", "Scan the package", "Capture the barcode and food label."], ["02", "Check the details", "Review ingredients, expiry dates, and mandatory information."], ["03", "Make a safer choice", "See a clear report with potential concerns."]].map(([n, title, text]) => <div key={n}><span>{n}</span><section><h3>{title}</h3><p>{text}</p></section></div>)}<Button onClick={() => open("web")}>Try a sample scan <ArrowRight /></Button></div>}
        {panel === "business" && <div className="business-list"><p><Check />Product label screening</p><p><Check />Allergen and nutrition information</p><p><Check />Food safety API integration</p><Button onClick={() => open("contact")}>Contact the team <ArrowRight /></Button></div>}
        {panel === "web" && <div className="demo-scan"><div className="sample-product"><ScanLine /><div><strong>Oats & Almonds Energy Bar</strong><span>Sample package · 40 g</span></div></div>{demoScanned ? <div className="demo-results"><p><CheckCircle2 />Nutrition information present</p><p><CheckCircle2 />Expiry date present</p><p><TriangleAlert />Contains almonds and oats</p><small>Illustrative results only. Not a food safety certification.</small><div style={{ marginTop: 10, textAlign: "center" }}><a href="/login" className="sf-demo-text-link" style={{ fontSize: "12px" }}>Open Full SafeFood Portal &rarr;</a></div></div> : <div style={{ display: "grid", gap: 8 }}><Button onClick={() => setDemoScanned(true)}><ScanLine />Scan sample package</Button><a href="/login" className="sf-demo-text-link" style={{ textAlign: "center", fontSize: "11px", marginTop: 4 }}>Or launch role portal directly &rarr;</a></div>}</div>}
      </DialogContent></Dialog>
    </main>
  );
}
