import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, AlertCircle } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Card from '../../components/common/Card';
import { useToast } from '../../components/common/Toast';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getRedirectPathForRole = (r) => {
    const norm = (r || 'user').toLowerCase();
    if (norm === 'admin') return '/app/admin/dashboard';
    if (norm === 'officer') return '/app/officer/dashboard';
    return '/app/user/dashboard';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await register({ name, email, password, role });
      toast.success('Account created successfully!', 'Welcome to TrustLabel');
      navigate(getRedirectPathForRole(res?.user?.role || role), { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Registration failed.';
      setError(msg);
      toast.error(msg, 'Registration Error');
    } finally {
      setIsSubmitting(false);
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
          Create an account
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-neutral-600">
          Join the Legal Metrology compliance ecosystem
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Sharma"
              icon={User}
            />

            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              icon={Mail}
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              icon={Lock}
            />

            <Select
              label="Select User Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={[
                { value: 'user', label: 'Consumer / Citizen User' },
                { value: 'officer', label: 'Enforcement Officer' },
                { value: 'admin', label: 'System Administrator' },
              ]}
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="w-full mt-2"
            >
              Register & Proceed
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-neutral-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:underline">
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
