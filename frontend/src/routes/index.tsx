import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Apple, ArrowRight, Check, CheckCircle2, Clock3, FileText, Leaf, Menu, Monitor, Play, ScanLine, ShieldCheck, Smartphone, Sprout, Star, TriangleAlert, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import phones from "@/assets/safefood-phones.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "SafeFood — AI Scans for Safer Choices" },
    { name: "description", content: "Discover SafeFood: packaged food checks for hidden label details, allergens, nutrition, and product authenticity." },
    { property: "og:title", content: "SafeFood — AI Scans for Safer Choices" },
    { property: "og:description", content: "Smarter scans. Safer food. Discover what is inside your packaged food." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
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
type Panel = "download" | "how" | "business" | "stories" | "contact" | "web" | null;

function Index() {
  const [panel, setPanel] = useState<Panel>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [demoScanned, setDemoScanned] = useState(false);
  const open = (value: Panel) => { setPanel(value); setMobileMenu(false); setDemoScanned(false); };
  return (
    <main>
      <section className="hero-section">
        <header className="site-header content-width">
          <a href="#" className="brand" aria-label="SafeFood home"><span className="brand-shield"><ShieldCheck /></span><span>Safe<span className="text-primary">Food</span></span></a>
          <nav className={mobileMenu ? "desktop-nav nav-open" : "desktop-nav"} aria-label="Main navigation">
            <Button variant="link" onClick={() => open("how")}>How It Works</Button>
            <a href="#features" onClick={() => setMobileMenu(false)}>App Features</a>
            <Button variant="link" onClick={() => open("business")}>API / Businesses</Button>
            <Button variant="link" onClick={() => open("stories")}>Success Stories</Button>
            <Button variant="link" onClick={() => open("contact")}>Contact</Button>
          </nav>
          <Button variant="download" className="header-download" onClick={() => open("download")}>Download App <ArrowRight className="download-arrow" /></Button>
          <Button variant="heroOutline" size="icon" className="mobile-menu" aria-label={mobileMenu ? "Close menu" : "Open menu"} onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X /> : <Menu />}</Button>
        </header>
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
      <section id="features" className="features-section">
        <div className="content-width">
          <div className="section-heading"><span>KEY FEATURES</span><h2>Smarter Scans. Safer Food.</h2><p>From barcode to batch details — SafeFood checks it all.</p></div>
          <div className="feature-grid">{features.map(({ icon: Icon, title, text }) => <article className="feature-item" key={title}><span className="feature-icon"><Icon /></span><h3>{title}</h3><p>{text}</p></article>)}</div>
          <div className="availability"><span className="available-label"><Smartphone />Available on</span><Button variant="store" onClick={() => open("download")}><Apple /><span><small>Download on the</small>App Store</span></Button><Button variant="store" onClick={() => open("download")}><Play className="text-primary" /><span><small>GET IT ON</small>Google Play</span></Button><span className="availability-divider" /><Button variant="outline" className="web-button" onClick={() => open("web")}><Monitor />Explore Web App</Button></div>
        </div>
        <Leaf className="footer-leaf leaf-left" /><Sprout className="footer-leaf leaf-right" />
      </section>
      <Dialog open={panel !== null} onOpenChange={(value) => { if (!value) setPanel(null); }}><DialogContent className="safefood-dialog">
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
