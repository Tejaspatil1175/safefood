import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  Lock,
  AlertCircle,
  Sparkles,
  ArrowRight,
  User,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import { useToast } from '../../components/common/Toast';
import { isValidEmail } from '../../utils/validation';

export const LoginPage = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [email, setEmail] = useState('user@test.com');
  const [password, setPassword] = useState('password123');
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Check if Mock Auth is enabled
  const isMockEnabled = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === true;

  // Check if redirected from register with a pre-filled email
  useEffect(() => {
    if (location.state?.prefilledEmail) {
      setEmail(location.state.prefilledEmail);
      setPassword('');
    }
  }, [location.state]);

  const getRedirectPathForRole = (role) => {
    const r = (role || 'user').toLowerCase();
    if (r === 'admin') return '/app/admin/dashboard';
    if (r === 'officer') return '/app/officer/dashboard';
    return '/app/user/dashboard';
  };

  const handleQuickFill = (mockEmail, mockPass = 'password123') => {
    setEmail(mockEmail);
    setPassword(mockPass);
    setFieldErrors({});
    setGeneralError(null);
  };

  const handleDirectLogin = async (mockEmail, mockPass = 'password123') => {
    setEmail(mockEmail);
    setPassword(mockPass);
    setFieldErrors({});
    setGeneralError(null);
    setIsSubmitting(true);

    try {
      const res = await login(mockEmail, mockPass);
      const userRole = res?.user?.role || 'user';
      toast.success(`Logged in as ${res?.user?.name || userRole}!`, 'Welcome Back');
      const targetPath = location.state?.from?.pathname || getRedirectPathForRole(userRole);
      navigate(targetPath, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Login failed.';
      setGeneralError(msg);
      toast.error(msg, 'Authentication Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!isValidEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) {
      toast.warning('Please resolve the form validation errors.', 'Validation Error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      const userRole = res?.user?.role || 'user';
      toast.success(`Welcome back, ${res?.user?.name || 'User'}!`, 'Signed In Successfully');

      const targetPath = location.state?.from?.pathname || getRedirectPathForRole(userRole);
      navigate(targetPath, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Invalid credentials. Please verify your email and password.';
      setGeneralError(msg);
      toast.error(msg, 'Authentication Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGeneralError(null);
    setIsGoogleLoading(true);

    try {
      const res = await googleLogin({ token: 'mock-google-id-token' });
      toast.success('Successfully authenticated with Google Workspace.', 'Google Sign In');
      navigate(getRedirectPathForRole(res?.user?.role), { replace: true });
    } catch (err) {
      const msg = err?.message || 'Google authentication failed';
      setGeneralError(msg);
      toast.error(msg, 'Google OAuth Failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Header */}
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="h-11 w-11 rounded-2xl bg-primary flex items-center justify-center text-white shadow-card group-hover:scale-105 transition-transform">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-neutral-900">
            Trust<span className="text-primary-600">Label</span>
          </span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
          Welcome Back
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-neutral-600">
          Sign in to access your Legal Metrology compliance panel
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-6 sm:p-8 shadow-card-hover">
          {/* General Alert Banner */}
          {generalError && (
            <div className="mb-5 p-3 rounded-lg bg-error-50 border border-error-500/20 flex items-start gap-2.5 text-error-700 text-xs sm:text-sm">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Dedicated Quick Demo Credentials Helper Panel */}
          <div className="mb-6 p-4 bg-gradient-to-br from-primary-50/70 to-indigo-50/50 rounded-2xl border border-primary-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary-900">
                <Sparkles className="h-4 w-4 text-primary-600" />
                <span>Demo Quick-Fill Logins</span>
              </div>
              <span className="text-[10px] font-semibold text-primary-700 bg-primary-100/80 px-2 py-0.5 rounded-full border border-primary-300">
                Mock Mode Active
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('user@test.com')}
                onDoubleClick={() => handleDirectLogin('user@test.com')}
                className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                  email === 'user@test.com'
                    ? 'bg-primary-600 text-white border-primary-700 shadow-sm'
                    : 'bg-surface border-border text-neutral-700 hover:bg-neutral-50'
                }`}
                title="Click to fill, Double-click to sign in directly as Consumer"
              >
                <User className="h-3.5 w-3.5" />
                <span className="text-xs font-bold">Consumer</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('officer@test.com')}
                onDoubleClick={() => handleDirectLogin('officer@test.com')}
                className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                  email === 'officer@test.com'
                    ? 'bg-warning-600 text-white border-warning-700 shadow-sm'
                    : 'bg-surface border-border text-neutral-700 hover:bg-neutral-50'
                }`}
                title="Click to fill, Double-click to sign in directly as Officer"
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                <span className="text-xs font-bold">Officer</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('admin@test.com')}
                onDoubleClick={() => handleDirectLogin('admin@test.com')}
                className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                  email === 'admin@test.com'
                    ? 'bg-indigo-700 text-white border-indigo-800 shadow-sm'
                    : 'bg-surface border-border text-neutral-700 hover:bg-neutral-50'
                }`}
                title="Click to fill, Double-click to sign in directly as Admin"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span className="text-xs font-bold">Admin</span>
              </button>
            </div>

            <div className="mt-2.5 pt-2 border-t border-primary-200/60 flex items-center justify-between text-[11px] text-neutral-500">
              <span>Password: <strong className="font-mono text-neutral-800">password123</strong></span>
              <span className="text-primary-700 font-medium">Double-click role for 1-click login</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              error={fieldErrors.email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: null }));
              }}
              placeholder="e.g. user@test.com"
              icon={Mail}
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              error={fieldErrors.password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: null }));
              }}
              placeholder="••••••••"
              icon={Lock}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              icon={ArrowRight}
              iconPosition="right"
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>

          {/* OR Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-3 text-neutral-400 font-semibold tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Workspace Button */}
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
            Continue with Google
          </Button>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs text-neutral-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 hover:underline">
              Create an account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
