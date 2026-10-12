import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  CheckCircle2,
  ShieldCheck,
  User,
  ShieldAlert,
  ArrowRight,
  Info,
} from "lucide-react";
import { SafeFoodRole } from "@/lib/safefood-demo";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — SafeFood Account" },
      { name: "description", content: "Create a SafeFood account for citizen food scanning or officer enforcement." },
    ],
  }),
  component: RegisterPage,
});

const DISTRICTS = [
  "DHULE",
  "PUNE",
  "MUMBAI",
  "NAGPUR",
  "NASHIK",
  "THANE",
  "AURANGABAD",
  "BENGALURU URBAN",
  "DELHI NCR",
];

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [district, setDistrict] = useState("DHULE");
  const [role, setRole] = useState<SafeFoodRole>("user");
  const [password, setPassword] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    navigate({ to: `/app/${role}/dashboard` });
  };

  return (
    <div className="sf-demo sf-demo-public">
      {/* Left Branding Aside */}
      <aside className="sf-demo-aside">
        <Link to="/" className="sf-demo-brand" aria-label="SafeFood Home">
          <span className="sf-demo-brand-mark">
            <ShieldCheck />
          </span>
          <span>SafeFood</span>
        </Link>

        <div className="sf-demo-aside-copy">
          <div className="sf-demo-kicker">
            <ShieldCheck />
            <span>JOIN THE SAFE FOOD MOVEMENT</span>
          </div>
          <h1>Empowering citizens and officers for safer food standards.</h1>
          <p>
            Create an account to report non-compliant packaged goods, inspect food declarations against statutory rules, or enforce legal metrology standards.
          </p>

          <ul className="sf-demo-points">
            <li>
              <CheckCircle2 />
              <span>Full compliance checks for Legal Metrology (PCR 2011)</span>
            </li>
            <li>
              <CheckCircle2 />
              <span>Direct grievance escalation to district safety officers</span>
            </li>
            <li>
              <CheckCircle2 />
              <span>Tamper-evident statutory audit records & exports</span>
            </li>
          </ul>
        </div>

        <div className="sf-demo-aside-foot">
          SafeFood Regulatory Audit Platform · Demonstration Workspace
        </div>
      </aside>

      {/* Right Registration Form */}
      <main className="sf-demo-auth-pane">
        <div className="sf-demo-auth-form">
          <Link to="/" className="sf-demo-brand sf-demo-mobile-brand">
            <span className="sf-demo-brand-mark">
              <ShieldCheck />
            </span>
            <span>SafeFood</span>
          </Link>

          <h2>Create your SafeFood account</h2>
          <p className="sf-demo-subtitle">
            Register as a citizen consumer or register an enforcement officer account.
          </p>

          <div className="sf-demo-demo-note">
            <Info />
            <div>
              <strong>Instant demo setup.</strong> Submitting this registration form instantly configures your demo workspace profile.
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="sf-demo-form-fields">
              <div className="sf-demo-field">
                <label htmlFor="reg-name">Full name</label>
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Patil"
                  required
                />
              </div>

              <div className="sf-demo-field">
                <label htmlFor="reg-email">Email address</label>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="sf-demo-field">
                <label htmlFor="reg-role">Account role</label>
                <select
                  id="reg-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as SafeFoodRole)}
                >
                  <option value="user">Citizen / Consumer Account</option>
                  <option value="officer">Food Safety Enforcement Officer</option>
                </select>
              </div>

              {role === "officer" && (
                <div className="sf-demo-field">
                  <label htmlFor="reg-badge">Officer Badge Number</label>
                  <input
                    id="reg-badge"
                    type="text"
                    value={badgeNumber}
                    onChange={(e) => setBadgeNumber(e.target.value)}
                    placeholder="e.g. OFF-DHU-4921"
                  />
                </div>
              )}

              <div className="sf-demo-field">
                <label htmlFor="reg-district">Assigned District</label>
                <select
                  id="reg-district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sf-demo-field">
                <label htmlFor="reg-password">Password</label>
                <input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                />
              </div>

              {error && <div className="sf-demo-form-error">{error}</div>}

              <button type="submit" className="sf-demo-primary-action">
                Create Account & Enter Workspace <ArrowRight style={{ display: "inline", width: 14, height: 14, marginLeft: 6, verticalAlign: "middle" }} />
              </button>
            </div>
          </form>

          <div className="sf-demo-auth-bottom">
            <span>
              Already have an account?{" "}
              <Link to="/login" className="sf-demo-text-link">
                Sign in here
              </Link>
            </span>
            <Link to="/" className="sf-demo-text-link">
              &larr; Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
