import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, UserPlus } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { validateSignupForm } from '../utils/validation';
import { registerWithEmail } from '../firebase/config';
import {
  setAuthLoading,
  loginSuccess,
  loginFailure,
  clearAuthError,
} from '../redux/slices/authSlice';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const handleSignup = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    // 1. Client-Side Validation Layer
    const { isValid, errors } = validateSignupForm({
      email,
      password,
      displayName,
      phone,
    });

    if (!isValid) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    // 2. Dispatch Auth & Firebase Register
    dispatch(setAuthLoading(true));
    try {
      const user = await registerWithEmail(email, password, displayName, phone);
      dispatch(loginSuccess(user));
      navigate('/dashboard/invoices');
    } catch (err) {
      dispatch(loginFailure(err.message || 'Registration failed. Try again.'));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-8 animate-modal">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
            B
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">Create Billy.dk Account</h1>
          <p className="text-xs text-slate-500 mt-1">Start issuing invoices in seconds</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            label="Full Name / Display Name"
            placeholder="John Doe"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            error={formErrors.displayName}
            icon={User}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={formErrors.email}
            icon={Mail}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="+45 12 34 56 78"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={formErrors.phone}
            icon={Phone}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={formErrors.password}
            icon={Lock}
            required
          />

          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading} icon={UserPlus}>
            Create Account
          </Button>
        </form>

        {/* Footer Link to Login */}
        <div className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
