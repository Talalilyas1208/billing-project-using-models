import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Chrome, Facebook } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { validateLoginForm } from '../utils/validation';
import {
  loginWithEmail,
  loginWithGoogle,
  loginWithFacebook,
} from '../firebase/config';
import {
  setAuthLoading,
  loginSuccess,
  loginFailure,
  clearAuthError,
} from '../redux/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('demo@billy.dk');
  const [password, setPassword] = useState('123456');
  const [formErrors, setFormErrors] = useState({});

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    // 1. Client-Side Validation Layer (Stops Firebase request if invalid)
    const { isValid, errors } = validateLoginForm({ email, password });
    if (!isValid) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    // 2. Dispatch Auth & Firebase Sign In
    dispatch(setAuthLoading(true));
    try {
      const user = await loginWithEmail(email, password);
      dispatch(loginSuccess(user));
      navigate('/dashboard/invoices');
    } catch (err) {
      dispatch(loginFailure(err.message || 'Failed to sign in. Check credentials.'));
    }
  };

  const handleGoogleLogin = async () => {
    dispatch(clearAuthError());
    dispatch(setAuthLoading(true));
    try {
      const user = await loginWithGoogle();
      dispatch(loginSuccess(user));
      navigate('/dashboard/invoices');
    } catch (err) {
      dispatch(loginFailure(err.message || 'Google sign in failed.'));
    }
  };

  const handleFacebookLogin = async () => {
    dispatch(clearAuthError());
    dispatch(setAuthLoading(true));
    try {
      const user = await loginWithFacebook();
      dispatch(loginSuccess(user));
      navigate('/dashboard/invoices');
    } catch (err) {
      dispatch(loginFailure(err.message || 'Facebook sign in failed.'));
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
          <h1 className="text-xl font-extrabold text-slate-900">Sign in to Billy.dk</h1>
          <p className="text-xs text-slate-500 mt-1">Manage invoices & financial reports</p>
        </div>

        {/* Global Firebase Auth Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="user@billy.dk"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={formErrors.email}
            icon={Mail}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={formErrors.password}
            icon={Lock}
            required
          />

          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading} icon={LogIn}>
            Sign In
          </Button>
        </form>

        {/* Social Auth Providers */}
        <div className="mt-6">
          <div className="relative flex items-center justify-center mb-4">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider absolute">
              Or continue with
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              icon={Chrome}
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              Google
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={Facebook}
              onClick={handleFacebookLogin}
              disabled={isLoading}
            >
              Facebook
            </Button>
          </div>
        </div>

        {/* Footer link to Signup */}
        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-700">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
