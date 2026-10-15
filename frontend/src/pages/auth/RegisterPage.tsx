import React, { useState } from "react";
import "./Auth.css";
import { ShieldCheck, ArrowRight, ChevronDown } from "lucide-react";
import { SafeFoodRole } from "@/lib/safefood-demo";
import { authApi } from "@/lib/api";

const DISTRICTS = [
  { value: "DHULE", label: "Dhule District (HQ)" },
  { value: "PUNE", label: "Pune Division" },
  { value: "MUMBAI", label: "Mumbai Metropolitan" },
  { value: "NAGPUR", label: "Nagpur Zone" },
  { value: "NASHIK", label: "Nashik Region" },
  { value: "THANE", label: "Thane District" },
  { value: "AURANGABAD", label: "Chhatrapati Sambhajinagar" },
  { value: "BENGALURU URBAN", label: "Bengaluru Urban" },
  { value: "DELHI NCR", label: "Delhi NCR Region" },
];

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [district, setDistrict] = useState("DHULE");
  const [role, setRole] = useState<SafeFoodRole>("user");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authApi.register({
        name,
        email,
        password,
        district,
        role,
      });
      window.location.href = `/app/${role}/dashboard`;
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sf-auth-page">
      <div className="sf-auth-card sf-auth-card-wide">
        <div className="sf-auth-header">
          <a href="/" className="sf-auth-logo" aria-label="SafeFood Home">
            <ShieldCheck />
          </a>
          <h1 className="sf-auth-title">Create SafeFood Account</h1>
          <p className="sf-auth-subtitle">
            Register to access automated Legal Metrology audits, OCR scanning, and portal dashboards.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="sf-auth-form">
          {error && <div className="sf-auth-error sf-auth-grid-full">{error}</div>}

          <div className="sf-auth-grid-2">
            {/* Full Name */}
            <div className="sf-auth-field">
              <label htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                required
              />
            </div>

            {/* Email Address */}
            <div className="sf-auth-field">
              <label htmlFor="reg-email">Email Address</label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>

            {/* Account Role Dropdown */}
            <div className="sf-auth-field">
              <label htmlFor="reg-role">Account Role</label>
              <div className="sf-auth-select-wrap">
                <select
                  id="reg-role"
                  className="sf-auth-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value as SafeFoodRole)}
                >
                  <option value="user">Citizen / Consumer</option>
                  <option value="officer">Food Safety Enforcement Officer</option>
                  <option value="admin">District / Supermarket Administrator</option>
                </select>
                <ChevronDown className="sf-auth-select-icon" />
              </div>
            </div>

            {/* Assigned District Dropdown */}
            <div className="sf-auth-field">
              <label htmlFor="reg-district">Assigned District / Jurisdiction</label>
              <div className="sf-auth-select-wrap">
                <select
                  id="reg-district"
                  className="sf-auth-select"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                >
                  {DISTRICTS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="sf-auth-select-icon" />
              </div>
            </div>

            {/* Password (Full Width) */}
            <div className="sf-auth-field sf-auth-grid-full">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password (min 6 characters)"
                required
              />
            </div>
          </div>

          <button type="submit" className="sf-auth-btn" disabled={loading}>
            <span>{loading ? "Creating Account..." : "Complete Registration & Enter Portal"}</span>
            <ArrowRight style={{ width: 16, height: 16 }} />
          </button>
        </form>

        <div className="sf-auth-footer">
          <div>
            Already have an account?{" "}
            <a href="/login" className="sf-auth-link">
              Sign in
            </a>
          </div>
          <div>
            <a href="/" className="sf-auth-back-link">
              &larr; Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
