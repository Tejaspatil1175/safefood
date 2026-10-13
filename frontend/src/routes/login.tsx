import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CheckCircle2,
  ShieldCheck,
  User,
  ShieldAlert,
  Building2,
  ArrowRight,
  Info,
} from "lucide-react";
import {
  SafeFoodRole,
  portalRoles,
  roleForDemoEmail,
} from "@/lib/safefood-demo";
import { authApi } from "@/lib/api";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — SafeFood Portal" },
      { name: "description", content: "Access SafeFood citizen, officer, and administrative portals." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<SafeFoodRole>("user");
  const [email, setEmail] = useState("user@test.com");
  const [password, setPassword] = useState("••••••••••••");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectPersona = (role: SafeFoodRole) => {
    setSelectedRole(role);
    setEmail(portalRoles[role].email);
    setPassword("••••••••••••");
    setError(null);
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    const inferred = roleForDemoEmail(val);
    setSelectedRole(inferred);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter an email address.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const realPassword = password.includes("•") || !password ? "password123" : password;
      const res = await authApi.login({ email, password: realPassword });
      
      const userRole = res?.user?.role || selectedRole;
      const targetRole =
        userRole === "officer" ? "officer" : userRole === "admin" ? "admin" : selectedRole;
      window.location.href = `/app/${targetRole}/dashboard`;
    } catch (err: any) {
      try {
        const regRes = await authApi.register({
          email,
          password: password.includes("•") || !password ? "password123" : password,
          name: portalRoles[selectedRole]?.name || email.split("@")[0] || "SafeFood User",
          district: "DHULE",
          role: selectedRole,
        });
        const targetRole = regRes?.user?.role || selectedRole;
        window.location.href = `/app/${targetRole}/dashboard`;
      } catch (regErr: any) {
        window.location.href = `/app/${selectedRole}/dashboard`;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sf-demo sf-demo-public">
      {/* Left Branding Aside */}
      <aside className="sf-demo-aside">
        <a href="/" className="sf-demo-brand" aria-label="SafeFood Home">
          <span className="sf-demo-brand-mark">
            <ShieldCheck />
          </span>
          <span>SafeFood</span>
        </a>

        <div className="sf-demo-aside-copy">
          <div className="sf-demo-kicker">
            <ShieldCheck />
            <span>CONSUMER PROTECTION & LEGAL METROLOGY</span>
          </div>
          <h1>Safe choices start with transparent food labels.</h1>
          <p>
            Sign in to access your consumer label scanner, field enforcement inspection tools, or district regulatory grievance tracking.
          </p>

          <ul className="sf-demo-points">
            <li>
              <CheckCircle2 />
              <span>Verify MRP, net quantity, expiry & statutory declarations</span>
            </li>
            <li>
              <CheckCircle2 />
              <span>Track grievances and food safety officer inspection progress</span>
            </li>
            <li>
              <CheckCircle2 />
              <span>AI-backed Legal Metrology (PCR 2011) & FSSAI statutory checks</span>
            </li>
          </ul>
        </div>

        <div className="sf-demo-aside-foot">
          SafeFood Regulatory Audit Platform · Demonstration Workspace
        </div>
      </aside>

      {/* Right Sign-in Form Pane */}
      <main className="sf-demo-auth-pane">
        <div className="sf-demo-auth-form">
          <a href="/" className="sf-demo-brand sf-demo-mobile-brand">
            <span className="sf-demo-brand-mark">
              <ShieldCheck />
            </span>
            <span>SafeFood</span>
          </a>

          <h2>Sign in to SafeFood</h2>
          <p className="sf-demo-subtitle">
            Choose a demo persona or enter credentials to open your workspace.
          </p>

          <div className="sf-demo-demo-note">
            <Info />
            <div>
              <strong>Demonstration mode active.</strong> Select any role below to pre-populate credentials and launch with configured permissions.
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="sf-demo-form-fields">
              <div className="sf-demo-field">
                <label htmlFor="login-email">Email address</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="name@safefood.gov.in"
                  required
                />
              </div>

              <div className="sf-demo-field">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <div className="sf-demo-form-error">{error}</div>}

              <button type="submit" className="sf-demo-primary-action">
                Enter {portalRoles[selectedRole].name} Workspace <ArrowRight style={{ display: "inline", width: 14, height: 14, marginLeft: 6, verticalAlign: "middle" }} />
              </button>
            </div>
          </form>

          {/* Persona selector for quick demo access */}
          <div className="sf-demo-role-picker">
            <span className="sf-demo-role-label">OR QUICK LAUNCH AS DEMO ROLE</span>

            <button
              type="button"
              className="sf-demo-role-option"
              aria-pressed={selectedRole === "user"}
              onClick={() => selectPersona("user")}
            >
              <User />
              <span>
                <strong>Citizen / Consumer (Aarav Sharma)</strong>
                <small>Scan packaged foods, check hidden rules, file grievances</small>
              </span>
              {selectedRole === "user" && <CheckCircle2 />}
            </button>

            <button
              type="button"
              className="sf-demo-role-option"
              aria-pressed={selectedRole === "officer"}
              onClick={() => selectPersona("officer")}
            >
              <ShieldAlert />
              <span>
                <strong>Food Safety Officer (Inspector Meera Iyer)</strong>
                <small>Field inspection audits, auto-verified violations, investigations</small>
              </span>
              {selectedRole === "officer" && <CheckCircle2 />}
            </button>

            <button
              type="button"
              className="sf-demo-role-option"
              aria-pressed={selectedRole === "admin"}
              onClick={() => selectPersona("admin")}
            >
              <Building2 />
              <span>
                <strong>District & Platform Administrator</strong>
                <small>Officer fleet deployment, district complaints, compliance metrics</small>
              </span>
              {selectedRole === "admin" && <CheckCircle2 />}
            </button>
          </div>

          <div className="sf-demo-auth-bottom">
            <span>
              Don't have an account?{" "}
              <a href="/register" className="sf-demo-text-link">
                Register here
              </a>
            </span>
            <a href="/" className="sf-demo-text-link">
              &larr; Back to home
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
