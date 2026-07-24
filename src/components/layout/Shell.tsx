import React, { useState } from 'react';
import { 
  BarChart3, 
  Settings, 
  FlaskConical, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  LogOut,
  Menu,
  X,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button, cn } from '../ui';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'lab', label: 'Scenario Lab', icon: FlaskConical },
  { id: 'business', label: 'Business Hub', icon: Briefcase },
  { id: 'habits', label: 'Habit Log', icon: Calendar },
  { id: 'analytics', label: 'Market Analytics', icon: TrendingUp },
];

export const Shell = ({ children, activeTab, onTabChange }: { 
  children: React.ReactNode; 
  activeTab: string;
  onTabChange: (id: string) => void;
}) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="relative bg-white border-r border-slate-200 flex flex-col z-20"
      >
        <div className={cn(
          "p-6 flex items-center gap-3 transition-all",
          isSidebarOpen ? "justify-between" : "justify-center p-4 flex-col"
        )}>
          {isSidebarOpen && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center font-black text-white shrink-0 flex-shrink-0">P</div>
              <span className="font-extrabold text-lg tracking-tighter text-slate-900 whitespace-nowrap">PolicyLens <span className="text-black">AI</span></span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn(
              "p-1 hover:bg-slate-100 transition-colors",
              !isSidebarOpen && "w-10 h-10 flex items-center justify-center p-0"
            )}
          >
            {isSidebarOpen ? <X className="w-5 h-5 text-slate-500" /> : <Menu className="w-5 h-5 text-slate-500" />}
          </Button>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-black/5 text-black border border-black/10' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
              {activeTab === item.id && isSidebarOpen && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-black shadow-[0_0_8px_rgba(0,0,0,0.35)]" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 p-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="User" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon className="w-5 h-5 m-1.5 text-slate-600" />
              )}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate text-slate-900">{user?.displayName || 'User'}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          <button 
            onClick={logout}
            className="w-full mt-4 flex items-center gap-2 p-2 text-xs text-slate-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-slate-50">
        <header className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md border-b border-slate-200 p-4 flex items-center justify-end">
          <div className="flex items-center gap-4">
            <Badge variant="success">Market: Active</Badge>
          </div>
        </header>

        <div className="px-8 pb-8 pt-0 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'error' | 'severe' }) => {
  const styles = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    success: 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-700 border border-amber-500/20',
    error: 'bg-orange-500/10 text-orange-700 border border-orange-500/20',
    severe: 'bg-red-500/10 text-red-600 border border-red-500/20 animate-pulse',
  };
  return <span className={cn('px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold', styles[variant])}>{children}</span>;
};
