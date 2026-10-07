import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, AlertCircle, Sparkles } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { MOCK_USERS } from '../../services/auth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import { useToast } from '../../components/common/Toast';

export const LoginPage = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [email, setEmail] = useState('user@test.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const getRedirectPathForRole = (role) => {
    const r = (role || 'user').toLowerCase();
    if (r === 'admin') return '/app/admin/dashboard';
    if (r === 'officer') return '/app/officer/dashboard';
    return '/app/user/dashboard';
  };

  const handleFillCredentials = (mock) => {
    setEmail(mock.email);
    setPassword('password123');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      const userRole = res?.user?.role || 'user';
      toast.success(`Welcome back, ${res?.user?.name || 'User'}!`, 'Signed In');
      
      const targetPath = location.state?.from?.pathname || getRedirectPathForRole(userRole);
      navigate(targetPath, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      toast.error(msg, 'Authentication Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleLoading(true);

    try {
      const res = await googleLogin({ token: 'mock-google-id-token' });
      toast.success('Successfully authenticated with Google OAuth.', 'Google Sign In');
      navigate(getRedirectPathForRole(res?.user?.role), { replace: true });
    } catch (err) {
      const msg = err?.message || 'Google authentication failed';
      setError(msg);
      toast.error(msg, 'OAuth Failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-neutral-900">
            Trust<span className="text-primary-600">Label</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-neutral-600">
          Access the Legal Metrology PCR compliance dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-error-50 border border-error-500/20 flex items-start gap-2.5 text-error-700 text-xs sm:text-sm">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Fill Mock Credentials Switcher */}
          <div className="mb-6 p-3.5 bg-surface-muted rounded-xl border border-border">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-primary-600" />
              <span>Demo Mock Logins (Any Password)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'User', email: 'user@test.com', role: 'user' },
                { label: 'Officer', email: 'officer@test.com', role: 'officer' },
                { label: 'Admin', email: 'admin@test.com', role: 'admin' },
              ].map((m) => (
                <button
                  key={m.role}
                  type="button"
                  onClick={() => handleFillCredentials(m)}
                  className={`px-2 py-1.5 text-xs font-medium rounded-lg border transition-all text-center ${
                    email === m.email
                      ? 'bg-primary-50 border-primary-300 text-primary-700 font-semibold shadow-2xs'
                      : 'bg-surface border-border text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@test.com"
              icon={Mail}
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>

          {/* Social Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-2 text-neutral-400 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Google Login Button */}
          <Button
            type="button"
            variant="secondary"
            isLoading={isGoogleLoading}
            onClick={handleGoogleSignIn}
            className="w-full"
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Google Workspace
          </Button>

          <div className="mt-6 text-center text-xs text-neutral-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:underline">
              Create an account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
