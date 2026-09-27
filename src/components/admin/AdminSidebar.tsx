import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Mail, 
  UserCheck, 
  Briefcase, 
  Calendar, 
  LifeBuoy, 
  Bot, 
  Settings, 
  LogOut, 
  ExternalLink,
  ChevronRight,
  Shield,
  Loader2,
  X,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type AdminTab = 
  | 'dashboard'
  | 'contacts'
  | 'leads'
  | 'website-projects'
  | 'jobs'
  | 'bookings'
  | 'tickets'
  | 'ai-logs'
  | 'settings';

interface SidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  navigate: (path: string) => void;
  counts?: {
    contacts?: number;
    leads?: number;
    websiteProjects?: number;
    jobs?: number;
    bookings?: number;
    tickets?: number;
    aiLogs?: number;
  };
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  navigate,
  counts,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { id: 'contacts' as AdminTab, label: 'Contacts', path: '/admin/contacts', icon: Mail, count: counts?.contacts },
    { id: 'leads' as AdminTab, label: 'Leads', path: '/admin/leads', icon: UserCheck, count: counts?.leads },
    { id: 'website-projects' as AdminTab, label: 'Website Projects', path: '/admin/website-projects', icon: Globe, count: counts?.websiteProjects },
    { id: 'jobs' as AdminTab, label: 'Job Applications', path: '/admin/jobs', icon: Briefcase, count: counts?.jobs },
    { id: 'bookings' as AdminTab, label: 'Bookings', path: '/admin/bookings', icon: Calendar, count: counts?.bookings },
    { id: 'tickets' as AdminTab, label: 'Tickets', path: '/admin/tickets', icon: LifeBuoy, count: counts?.tickets },
    { id: 'ai-logs' as AdminTab, label: 'AI Logs', path: '/admin/ai-logs', icon: Bot, count: counts?.aiLogs },
    { id: 'settings' as AdminTab, label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleItemClick = (item: typeof navItems[0]) => {
    onSelectTab(item.id);
    navigate(item.path);
    if (onCloseMobile) onCloseMobile();
  };

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } catch (err) {
      console.error('[Supabase Auth] Sign out error:', err);
    } finally {
      setSigningOut(false);
      navigate('/admin');
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#080d19] border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div 
            onClick={() => { onSelectTab('dashboard'); navigate('/admin/dashboard'); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff7700] to-amber-500 p-0.5 shadow-md shadow-orange-500/20">
              <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center text-white font-black text-lg">
                W
              </div>
            </div>
            <div>
              <div className="text-sm font-black text-white tracking-tight group-hover:text-[#ff7700] transition-colors">
                WAL GROUP
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-[#ff7700]" />
                <span>Admin Panel</span>
              </div>
            </div>
          </div>

          {/* Close button for mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* User Info Bar */}
        <div className="px-5 py-3.5 bg-black/30 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ff7700]/30 to-amber-500/20 border border-[#ff7700]/40 flex items-center justify-center text-xs font-bold text-amber-300 shrink-0">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Administrator
              </div>
              <div className="text-xs font-semibold text-slate-200 truncate" title={user?.email || 'Admin User'}>
                {user?.email || 'admin@walgroup.com'}
              </div>
            </div>
          </div>
        </div>

        {/* Nav Items List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Core Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer
                  ${isActive 
                    ? 'bg-gradient-to-r from-[#ff7700] to-amber-500 text-black shadow-lg shadow-orange-500/20 font-bold' 
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                  }
                `}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-slate-400 group-hover:text-[#ff7700]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.count !== undefined && (
                  <span className={`
                    text-[10px] px-2 py-0.5 rounded-full font-bold
                    ${isActive 
                      ? 'bg-black/30 text-black' 
                      : 'bg-white/10 text-slate-300 group-hover:bg-white/20'
                    }
                  `}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="p-3 border-t border-white/5 space-y-1">
          {/* Link to public website */}
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/[0.03] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>Public Website</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={signingOut}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {signingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span>{signingOut ? 'Signing out...' : 'Sign Out Session'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
