import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FileText,
  Package,
  FileCheck,
  Phone,
  Users,
  ShieldCheck,
  LayoutDashboard,
} from 'lucide-react';
import { useGetSidebarQuery } from '../../redux/api/api';

const defaultNavItems = [
  { name: 'Invoices', link: '/dashboard/invoices', icon: FileText },
  { name: 'Products', link: '/dashboard/products', icon: Package },
  { name: 'Offers', link: '/dashboard/offers', icon: FileCheck },
  { name: 'Contact', link: '/dashboard/contact', icon: Phone },
  { name: 'Customers', link: '/dashboard/customer', icon: Users },
];

const iconMap = {
  Invoice: FileText,
  Invoices: FileText,
  invoices: FileText,
  Products: Package,
  products: Package,
  Offers: FileCheck,
  offers: FileCheck,
  Contact: Phone,
  contact: Phone,
  Customer: Users,
  Customers: Users,
  customer: Users,
};

const Sidebar = () => {
  const { data: sidebarResponse, isLoading } = useGetSidebarQuery();

  const rawSidebarData = Array.isArray(sidebarResponse)
    ? sidebarResponse
    : Array.isArray(sidebarResponse?.data)
    ? sidebarResponse.data
    : [];

  // Standardize sidebar links whether flat or nested
  let navLinks = [];
  if (rawSidebarData.length > 0) {
    rawSidebarData.forEach((item) => {
      if (item.children && Array.isArray(item.children)) {
        item.children.forEach((child) => {
          navLinks.push({
            name: child.name || child.label || 'Page',
            link: child.link || child.path || '/dashboard',
            icon: iconMap[child.name || child.key] || FileText,
          });
        });
      } else {
        navLinks.push({
          name: item.label || item.name || item.key || 'Page',
          link: item.path || item.link || `/dashboard/${(item.key || item.label || '').toLowerCase()}`,
          icon: iconMap[item.key || item.name || item.label] || FileText,
        });
      }
    });
  }

  // Fallback to default items if API yields empty or unmatched routes
  if (navLinks.length === 0) {
    navLinks = defaultNavItems;
  }

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col min-h-screen border-r border-slate-800 shrink-0">
      {/* Brand Logo & Title */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
          B
        </div>
        <div>
          <h1 className="font-bold text-white text-sm tracking-wide">Billy.dk</h1>
          <p className="text-[10px] text-slate-400 font-medium">Accounting Dashboard</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <LayoutDashboard className="w-3.5 h-3.5 text-blue-500" />
          <span>Main Navigation</span>
        </div>

        {isLoading ? (
          <div className="p-4 text-xs text-slate-500 animate-pulse">Loading navigation...</div>
        ) : (
          navLinks.map((sub) => {
            const Icon = sub.icon || FileText;
            return (
              <NavLink
                key={sub.link}
                to={sub.link}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{sub.name}</span>
              </NavLink>
            );
          })
        )}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Routes Operational</span>
        </div>
        <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">RTK Query</span>
      </div>
    </aside>
  );
};

export default Sidebar;
