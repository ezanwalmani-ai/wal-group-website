import React, { useState } from 'react';
import { 
  Menu, 
  RefreshCw, 
  Database, 
  ShieldCheck, 
  Bell, 
  ExternalLink,
  ChevronRight,
  LogOut,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminTab } from './AdminSidebar';

interface HeaderProps {
  currentTab: AdminTab;
  onOpenMobileSidebar: () => void;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
  navigate: (path: string) => void;
}

const TAB_TITLES: Record<AdminTab, { title: string; subtitle: string }> = {
  dashboard: { title: 'Executive Overview', subtitle: 'Live activity and database counts across all operations' },
  contacts: { title: 'Contact Submissions', subtitle: 'Manage inquiries received from the public contact forms' },
  leads: { title: 'AI Business Leads', subtitle: 'Visitor captures and consultation pipeline from AI assistant' },
  jobs: { title: 'Job Applications & Resumes', subtitle: 'Candidate profiles, experience records and resume storage' },
  bookings: { title: 'Discovery Call Bookings', subtitle: 'Scheduled client consultations and Google Meet sessions' },
  tickets: { title: 'Client Support Tickets', subtitle: 'Support requests, status workflows and message threads' },
  'ai-logs': { title: 'AI Assistant Transcripts', subtitle: 'Real-time conversation logs and lead extraction traces' },
  settings: { title: 'Supabase & System Settings', subtitle: 'Database configuration, SQL schema verification and RLS' }
};

export const AdminHeader: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobileSidebar,
  onRefreshData,
  isRefreshing = false,
  navigate
}) => {
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const currentInfo = TAB_TITLES[currentTab] || { title: 'Admin Panel', subtitle: 'Wal Group Management' };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } catch (err) {
      console.error('[Supabase Auth] Failed to sign out session:', err);
    } finally {
      setSigningOut(false);
      navigate('/admin');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#080d19]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3.5 flex items-center justify-between">
      {/* Left Section: Mobile Menu + Breadcrumb & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
            <span>Wal Group Admin</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-[#ff7700] font-semibold capitalize">{currentTab.replace('-', ' ')}</span>
          </div>
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight truncate">
            {currentInfo.title}
          </h1>
        </div>
      </div>

      {/* Right Section: Database Status, Actions & Sign Out */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Status indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Live Sync Online</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Refresh Button */}
        {onRefreshData && (
          <button
            onClick={onRefreshData}
            disabled={isRefreshing || signingOut}
            title="Refresh live Supabase data"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#ff7700]' : ''}`} />
            <span className="hidden md:inline">Refresh</span>
          </button>
        )}

        {/* User Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-[#ff7700]" />
          <span className="font-mono text-[11px] text-slate-400 truncate max-w-[150px]">
            {user?.email || 'admin'}
          </span>
        </div>

        {/* Secure Sign Out Button */}
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          title="Sign out of Supabase Session and return to Login"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 hover:text-red-300 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
        >
          {signingOut ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <LogOut className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">{signingOut ? 'Signing out...' : 'Sign Out'}</span>
        </button>
      </div>
    </header>
  );
};
