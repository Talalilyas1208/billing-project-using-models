import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ShieldCheck } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const LoginPage = ({ onAuthenticate }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('user@billy.dk');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
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
    const userSession = {
      email,
      name: email.split('@')[0],
      authenticatedAt: new Date().toISOString(),
    };

    localStorage.setItem('direct_user_session', JSON.stringify(userSession));
    onAuthenticate(userSession);
    navigate('/dashboard/invoices', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-8 animate-modal">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
            B
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Sign in to Billy.dk</h2>
          <p className="text-xs text-slate-500 mt-1">Access your invoicing dashboard & API endpoints</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
            Sign In & Access Dashboard
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Direct Authentication Session</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
