import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FileText,
  ChevronDown,
  ChevronRight,
  Package,
  FileCheck,
  Phone,
  Users,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';
import { useGetSidebarQuery } from '../../redux/api/api';

const iconMap = {
  Invoice: FileText,
  Products: Package,
  Offers: FileCheck,
  contact: Phone,
  Customer: Users,
};

const Sidebar = () => {
  const location = useLocation();
  const { data: sidebarResponse, isLoading } = useGetSidebarQuery();
  const sidebarData = Array.isArray(sidebarResponse)
    ? sidebarResponse
    : sidebarResponse?.data || [];

  const [openAccordions, setOpenAccordions] = useState({ 1: true });

  const toggleAccordion = (id) => {
    setOpenAccordions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col min-h-screen border-r border-slate-800 shrink-0">
      {/* Brand Logo & Title */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
          B
        </div>
        <div>
          <h1 className="font-bold text-white text-sm tracking-wide">Billy.dk</h1>
          <p className="text-[10px] text-slate-400 font-medium">RTK Query API</p>
        </div>
      </div>

      {/* Navigation Tree */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Main Menu
        </div>

        {isLoading ? (
          <div className="p-4 text-xs text-slate-500 animate-pulse">Loading navigation...</div>
        ) : (
          sidebarData.map((group) => {
            const isOpen = openAccordions[group.id];
            const isChildActive = group.children?.some((child) => location.pathname === child.link);

            return (
              <div key={group.id} className="space-y-1">
                {/* Accordion Header */}
                <button
                  onClick={() => toggleAccordion(group.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors duration-150 ${
                    isChildActive
                      ? 'text-white bg-slate-800/80'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4 text-blue-500" />
                    <span>{group.label}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </button>

                {/* Sub-items list */}
                {isOpen && group.children && (
                  <div className="pl-4 pr-1 space-y-1 pt-1 border-l-2 border-slate-800 ml-5">
                    {group.children.map((sub) => {
                      const Icon = iconMap[sub.name] || FileText;
                      return (
                        <NavLink
                          key={sub.link}
                          to={sub.link}
                          className={({ isActive }) =>
                            `flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 ${
                              isActive
                                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                            }`
                          }
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{sub.name}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>API Active</span>
        </div>
        <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">RTK Query</span>
      </div>
    </aside>
  );
};

export default Sidebar;
