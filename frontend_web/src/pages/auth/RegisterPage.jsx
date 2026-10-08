import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, AlertCircle, Info, ArrowRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import { useToast } from '../../components/common/Toast';
import { isValidEmail } from '../../utils/validation';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = 'Full name is required';
    }

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

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirmation password is required';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) {
      toast.warning('Please fix the validation errors.', 'Validation Error');
      return;
    }

    setIsSubmitting(true);
    try {
      // Public registration is for the Citizen/User role only
      await register({ name, email, password, role: 'user' });
      toast.success('Your citizen account has been created! Please sign in.', 'Registration Successful');
      navigate('/login', { state: { prefilledEmail: email } });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Registration failed. Please try again.';
      setGeneralError(msg);
      toast.error(msg, 'Registration Error');
    } finally {
      setIsSubmitting(false);
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
          Create Citizen Account
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-neutral-600">
          Join the platform to verify packaged goods and safeguard consumer rights
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

          {/* Officer/Admin Notice */}
          <div className="mb-5 p-3 rounded-xl bg-primary-50/60 border border-primary-200/80 flex items-start gap-2.5 text-xs text-primary-900">
            <Info className="h-4 w-4 text-primary-600 shrink-0 mt-0.5" />
            <p>
              <strong>Looking for Officer / Admin access?</strong> Enforcement officer accounts are provisioned exclusively by system administrators.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              required
              value={name}
              error={fieldErrors.name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: null }));
              }}
              placeholder="e.g. Ramesh Sharma"
              icon={User}
              autoComplete="name"
            />

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
              placeholder="Minimum 6 characters"
              icon={Lock}
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              type="password"
              required
              value={confirmPassword}
              error={fieldErrors.confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: null }));
              }}
              placeholder="Re-enter password"
              icon={Lock}
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              icon={ArrowRight}
              iconPosition="right"
              className="w-full mt-2"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-neutral-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 hover:underline">
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
