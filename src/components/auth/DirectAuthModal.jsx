import React, { useState } from 'react';
import { Mail, Lock, LogIn, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';

/**
 * Direct Authentication component (No Redux auth slice overhead)
 * Directly manages user authentication session.
 */
const DirectAuthModal = ({ onAuthenticate }) => {
  const [email, setEmail] = useState('user@billy.dk');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  const handleDirectAuth = (e) => {
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
    // Direct authentication callback
    const userSession = {
      email,
      name: email.split('@')[0],
      authenticatedAt: new Date().toISOString(),
    };

    localStorage.setItem('direct_user_session', JSON.stringify(userSession));
    onAuthenticate(userSession);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-8 animate-modal">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
            B
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Direct Authentication</h2>
          <p className="text-xs text-slate-500 mt-1">Sign in directly to Billy.dk Mock Server</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleDirectAuth} className="space-y-4">
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

          <Button type="submit" variant="primary" className="w-full" icon={LogIn}>
            Authenticate & Access Dashboard
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Direct Auth Session (No Redux Slice Overhead)</span>
        </div>
      </div>
    </div>
  );
};

export default DirectAuthModal;
