import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Layers,
  Database,
  Award,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Info,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { id: 'landing', label: 'Home', icon: Compass },
  { id: 'dashboard', label: 'Dashboard', icon: Layers },
  { id: 'recognition', label: 'AI Recognition', icon: Sparkles },
  { id: 'patterns', label: 'Pattern Intelligence', icon: Layers },
  { id: 'archive', label: 'Heritage Archive', icon: Database },
  { id: 'assessment', label: 'Artisan Assessment', icon: Award },
  { id: 'gaps', label: 'Skill Gap Analysis', icon: TrendingUp },
  { id: 'recommendations', label: 'Training Paths', icon: BookOpen },
  { id: 'knowledge', label: 'Knowledge Assistant', icon: MessageSquare },
  { id: 'about', label: 'About', icon: Info },
];

export default function Navbar({ activePage, setActivePage }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#143526] text-white border-b border-[#2D6A4F] shadow-md backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div
            onClick={() => setActivePage('landing')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#F7F1E1] flex items-center justify-center shadow-lg border border-[#D4AF37]">
              <Sparkles className="w-5 h-5 text-[#143526]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#FAF7F2] font-serif">
                CraftSphere <span className="text-[#D4AF37]">AI</span>
              </span>
              <p className="text-[10px] text-[#C5A059] uppercase tracking-wider font-medium">
                Goa Heritage & Artisan Intelligence
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#D4AF37] text-[#143526] font-semibold shadow-sm'
                      : 'text-[#E5E0D5] hover:bg-[#1E4D38] hover:text-[#FAF7F2]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-[#E5E0D5] hover:bg-[#1E4D38] focus:outline-none"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0F281D] border-b border-[#2D6A4F] px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#143526] font-bold'
                    : 'text-[#E5E0D5] hover:bg-[#1E4D38]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}

