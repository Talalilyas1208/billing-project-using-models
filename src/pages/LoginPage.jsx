import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ShieldCheck, Chrome, Facebook } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import {
  loginWithEmail,
  loginWithGoogle,
  loginWithFacebook,
} from '../firebase/config';

const LoginPage = ({ onAuthenticate }) => {
  const navigate = useNavigate();

  // Prefilled email and password as requested by user
  const [email, setEmail] = useState('user@billy.dk');
  const [password, setPassword] = useState('123456');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Firebase Authentication Login
      const user = await loginWithEmail(email, password);

      // Extract user email and password into user session
      const userSession = {
        uid: user.uid || `user-${Date.now()}`,
        email: user.email || email,
        password: password,
        name: user.displayName || email.split('@')[0],
        photoURL: user.photoURL || null,
        authenticatedAt: new Date().toISOString(),
      };

      localStorage.setItem('direct_user_session', JSON.stringify(userSession));
      onAuthenticate(userSession);
      navigate('/dashboard/invoices', { replace: true });
    } catch (err) {
      setError(err.message || 'Firebase Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const user = await loginWithGoogle();
      const userSession = {
        uid: user.uid,
        email: user.email,
        password: password || '123456',
        name: user.displayName || 'Google User',
        photoURL: user.photoURL || null,
        authenticatedAt: new Date().toISOString(),
      };

      localStorage.setItem('direct_user_session', JSON.stringify(userSession));
      onAuthenticate(userSession);
      navigate('/dashboard/invoices', { replace: true });
    } catch (err) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const user = await loginWithFacebook();
      const userSession = {
        uid: user.uid,
        email: user.email,
        password: password || '123456',
        name: user.displayName || 'Facebook User',
        photoURL: user.photoURL || null,
        authenticatedAt: new Date().toISOString(),
      };

      localStorage.setItem('direct_user_session', JSON.stringify(userSession));
      onAuthenticate(userSession);
      navigate('/dashboard/invoices', { replace: true });
    } catch (err) {
      setError(err.message || 'Facebook sign-in failed.');
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
          <h2 className="text-xl font-extrabold text-slate-900">Sign in to Billy.dk</h2>
          <p className="text-xs text-slate-500 mt-1">Firebase Authentication Enabled</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            required
          />

          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading} icon={LogIn}>
            Sign In with Firebase
          </Button>
        </form>

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
          <span>Active Credentials: user@billy.dk</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
