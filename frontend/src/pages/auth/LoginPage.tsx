import React, { useState } from "react";
import "./Auth.css";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await authApi.login({ email, password });
      const userRole = res?.user?.role || "user";
      const targetRole =
        userRole === "officer" ? "officer" : userRole === "admin" ? "admin" : "user";
      window.location.href = `/app/${targetRole}/dashboard`;
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error?.message ||
        err?.message ||
        "Invalid email or password. Please try again or create an account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sf-auth-page">
      <div className="sf-auth-card">
        <div className="sf-auth-header">
          <a href="/" className="sf-auth-logo" aria-label="SafeFood Home">
            <ShieldCheck />
          </a>
          <h1 className="sf-auth-title">Sign in to SafeFood</h1>
          <p className="sf-auth-subtitle">
            Enter your credentials to access your safety scanner or portal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="sf-auth-form">
          {error && <div className="sf-auth-error">{error}</div>}

          <div className="sf-auth-field">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="sf-auth-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="sf-auth-btn" disabled={loading}>
            <span>{loading ? "Signing in..." : "Sign In"}</span>
            <ArrowRight style={{ width: 16, height: 16 }} />
          </button>
        </form>

        <div className="sf-auth-footer">
          <div>
            Don't have an account?{" "}
            <a href="/register" className="sf-auth-link">
              Register here
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
