import React from 'react';
import { Bell, Search, LogOut } from 'lucide-react';

const Header = ({ userSession, onLogout }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Search Input */}
      <div className="relative w-72">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search invoices, datasets..."
          className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        />
      </div>

      {/* User Profile & Actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center">
            {userSession?.name ? userSession.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-slate-800 leading-tight">
              {userSession?.name || 'Direct Session'}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">{userSession?.email || 'user@billy.dk'}</p>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              title="Log out session"
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
