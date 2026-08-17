import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, UserPlus, ShieldCheck, Chrome, Facebook } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  loginWithFacebook,
  formatFirebaseError,
} from '../firebase/config';

const LoginPage = ({ onAuthenticate }) => {
  const navigate = useNavigate();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Clear any existing stale session whenever landing on the login page
  useEffect(() => {
    localStorage.removeItem('direct_user_session');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      if (isRegisterMode) {
        // Real Firebase Account Creation
        const user = await registerWithEmail(trimmedEmail, password, displayName);
        const userSession = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || trimmedEmail.split('@')[0],
          photoURL: user.photoURL || null,
          authenticatedAt: new Date().toISOString(),
        };

        localStorage.setItem('direct_user_session', JSON.stringify(userSession));
        onAuthenticate(userSession);
        navigate('/dashboard/invoices', { replace: true });
      } else {
        // Real Firebase Email/Password Sign In
        // Will THROW Firebase error if email is not registered or password is incorrect
        const user = await loginWithEmail(trimmedEmail, password);

        const userSession = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || trimmedEmail.split('@')[0],
          photoURL: user.photoURL || null,
          authenticatedAt: new Date().toISOString(),
        };

        localStorage.setItem('direct_user_session', JSON.stringify(userSession));
        onAuthenticate(userSession);
        navigate('/dashboard/invoices', { replace: true });
      }
    } catch (err) {
      console.error('Firebase Auth error:', err);
      // Wipe session and block login if Firebase authentication fails
      localStorage.removeItem('direct_user_session');
      setError(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      const user = await loginWithGoogle();
      const userSession = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'Google User',
        photoURL: user.photoURL || null,
        authenticatedAt: new Date().toISOString(),
      };

      localStorage.setItem('direct_user_session', JSON.stringify(userSession));
      onAuthenticate(userSession);
      navigate('/dashboard/invoices', { replace: true });
    } catch (err) {
      localStorage.removeItem('direct_user_session');
      setError(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setError('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      const user = await loginWithFacebook();
      const userSession = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'Facebook User',
        photoURL: user.photoURL || null,
        authenticatedAt: new Date().toISOString(),
      };

      localStorage.setItem('direct_user_session', JSON.stringify(userSession));
      onAuthenticate(userSession);
      navigate('/dashboard/invoices', { replace: true });
    } catch (err) {
      localStorage.removeItem('direct_user_session');
      setError(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-8 animate-modal">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
            B
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {isRegisterMode ? 'Create Billy.dk Account' : 'Sign in to Billy.dk'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isRegisterMode
              ? 'Register a new account in Firebase Authentication'
              : 'Sign in with your registered Firebase account'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-600 font-medium">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <Input
              label="Full Name / Display Name"
              type="text"
              placeholder="John Doe"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="user@billy.dk"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            icon={isRegisterMode ? UserPlus : LogIn}
          >
            {isRegisterMode ? 'Register Account in Firebase' : 'Sign In with Firebase'}
          </Button>
        </form>

        {/* Toggle between Sign In and Register Mode */}
        <div className="mt-4 text-center text-xs text-slate-500">
          {isRegisterMode ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(false);
                  setError('');
                }}
                className="font-bold text-blue-600 hover:text-blue-700 underline"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(true);
                  setError('');
                }}
                className="font-bold text-blue-600 hover:text-blue-700 underline"
              >
                Register / Sign Up
              </button>
            </>
          )}
        </div>

        {/* Social Authentication */}
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

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Strict Firebase Auth (Project: billing-project-1-c6b55)</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
