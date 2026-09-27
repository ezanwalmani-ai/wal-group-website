import React from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  UserCheck, 
  Briefcase, 
  Calendar, 
  LifeBuoy, 
  Bot, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Clock, 
  TrendingUp,
  Database,
  RefreshCw,
  Sparkles,
  Shield,
  Layers,
  MessageCircle,
  Activity,
  RotateCcw,
  Globe
} from 'lucide-react';
import { AdminTab } from './AdminSidebar';
import { DashboardMetricsResult } from '../../lib/supabase';
import { useBehavior } from '../../context/BehaviorContext';

interface OverviewProps {
  metrics: DashboardMetricsResult | null;
  loading: boolean;
  onSelectTab: (tab: AdminTab) => void;
  navigate: (path: string) => void;
  recentActivities: Array<{
    id: string;
    type: 'contact' | 'lead' | 'job' | 'booking' | 'ticket' | 'ai-log';
    title: string;
    subtitle: string;
    timestamp: string;
    badge?: string;
    badgeColor?: string;
  }>;
  onRefresh: () => void;
}

export const AdminOverviewView: React.FC<OverviewProps> = ({
  metrics,
  loading,
  onSelectTab,
  navigate,
  recentActivities,
  onRefresh
}) => {
  const { behavior, resetContactPreferences } = useBehavior();
  const contactPrefs = behavior.contactPreferences || {
    whatsappClicks: 0,
    emailClicks: 0,
    phoneClicks: 0,
    linkedinClicks: 0,
    instagramClicks: 0,
    totalContactClicks: 0,
    preferredMethod: 'none',
    detailsHistory: []
  };

  const totalPreferenceClicks = contactPrefs.whatsappClicks + contactPrefs.emailClicks;
  const whatsappPct = totalPreferenceClicks > 0 
    ? Math.round((contactPrefs.whatsappClicks / totalPreferenceClicks) * 100) 
    : 50;
  const emailPct = totalPreferenceClicks > 0 
    ? Math.round((contactPrefs.emailClicks / totalPreferenceClicks) * 100) 
    : 50;

  const cards = [
    {
      id: 'contacts' as AdminTab,
      label: 'Total Contacts',
      count: metrics?.contacts?.count ?? 0,
      error: metrics?.contacts?.error,
      table: 'contact_submissions',
      icon: Mail,
      gradient: 'from-blue-500/20 via-blue-500/5 to-transparent',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
      description: 'Public contact inquiries'
    },
    {
      id: 'leads' as AdminTab,
      label: 'Total Leads',
      count: metrics?.leads?.count ?? 0,
      error: metrics?.leads?.error,
      table: 'leads',
      icon: UserCheck,
      gradient: 'from-[#ff7700]/20 via-[#ff7700]/5 to-transparent',
      borderColor: 'border-[#ff7700]/30',
      iconColor: 'text-[#ff7700]',
      description: 'AI & Inbound qualified leads'
    },
    {
      id: 'website-projects' as AdminTab,
      label: 'Website Projects',
      count: metrics?.websiteProjects?.count ?? 0,
      error: metrics?.websiteProjects?.error,
      table: 'website_project_requests',
      icon: Globe,
      gradient: 'from-orange-500/20 via-orange-500/5 to-transparent',
      borderColor: 'border-orange-500/30',
      iconColor: 'text-[#ff6600]',
      description: 'Client website project requests'
    },
    {
      id: 'jobs' as AdminTab,
      label: 'Job Applications',
      count: metrics?.jobs?.count ?? 0,
      error: metrics?.jobs?.error,
      table: 'job_applications',
      icon: Briefcase,
      gradient: 'from-purple-500/20 via-purple-500/5 to-transparent',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-400',
      description: 'Candidate applications & resumes'
    },
    {
      id: 'bookings' as AdminTab,
      label: 'Total Bookings',
      count: metrics?.bookings?.count ?? 0,
      error: metrics?.bookings?.error,
      table: 'bookings',
      icon: Calendar,
      gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
      description: 'Client discovery consultations'
    },
    {
      id: 'tickets' as AdminTab,
      label: 'Total Tickets',
      count: metrics?.tickets?.count ?? 0,
      error: metrics?.tickets?.error,
      table: 'tickets',
      icon: LifeBuoy,
      gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400',
      description: 'Client support tickets'
    },
    {
      id: 'ai-logs' as AdminTab,
      label: 'Total AI Logs',
      count: metrics?.aiLogs?.count ?? 0,
      error: metrics?.aiLogs?.error,
      table: 'ai_logs',
      icon: Bot,
      gradient: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
      borderColor: 'border-cyan-500/30',
      iconColor: 'text-cyan-400',
      description: 'Consultant conversation sessions'
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1627] via-[#09101d] to-[#0d1627] border border-white/10 p-6 sm:p-8">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-[#ff7700]/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#ff7700]/15 border border-[#ff7700]/30 text-[#ff7700] text-[10px] font-extrabold uppercase tracking-wider">
                Executive Control Hub
              </span>
              <span className="text-xs text-slate-400">&bull;</span>
              <span className="text-xs text-slate-400">Live Data Stream Active</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Operational Intelligence &amp; Inbound Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Unified operational view for business leads, client discovery bookings, job applicant profiles, and client support tickets.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onRefresh}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#ff7700]' : ''}`} />
              <span>Sync Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid (6 Summary Cards) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-slate-200 tracking-wider uppercase flex items-center gap-2">
            <Database className="w-4 h-4 text-[#ff7700]" />
            <span>Operations &amp; Pipeline Overview</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Real-Time Synchronization
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, idx) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onClick={() => {
                  onSelectTab(card.id);
                  navigate(`/admin/${card.id}`);
                }}
                className={`
                  group relative overflow-hidden rounded-2xl bg-[#09101d] border ${card.borderColor} p-5
                  hover:border-white/30 hover:bg-[#0b1424] transition-all cursor-pointer shadow-lg shadow-black/40
                `}
              >
                {/* Subtle top glow */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`} />

                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${card.iconColor} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 group-hover:text-white transition-colors">
                    <span>View Section</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-slate-500 group-hover:text-[#ff7700]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {card.label}
                  </div>

                  {loading ? (
                    <div className="h-8 flex items-center">
                      <div className="w-5 h-5 border-2 border-slate-600 border-t-[#ff7700] rounded-full animate-spin" />
                    </div>
                  ) : card.error ? (
                    <div className="py-1">
                      <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Data connection notice</span>
                      </div>
                      <span className="text-[10px] text-slate-500 line-clamp-1" title={card.error}>
                        {card.error}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white tracking-tight">
                        {card.count}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        records
                      </span>
                    </div>
                  )}

                  <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between">
                    <span>{card.description}</span>
                    <span className="font-semibold text-[10px] text-slate-500 uppercase">Live Record</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Visitor Contact Preference Monitoring (BehaviorProvider Engine) */}
      <div className="rounded-2xl bg-[#09101d] border border-white/10 p-5 sm:p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ff7700]/15 border border-[#ff7700]/30 flex items-center justify-center text-[#ff7700]">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Visitor Contact Channel Preferences
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-white/10 text-slate-300">
                  BehaviorProvider Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Real-time tracking of visitor link clicks across Footer &amp; direct channels (WhatsApp vs. Email)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {contactPrefs.totalContactClicks > 0 && (
              <button
                onClick={resetContactPreferences}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5"
                title="Reset local contact preference metrics"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Telemetry</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {/* WhatsApp Card */}
          <div className="p-4 rounded-xl bg-[#25D366]/5 border border-[#25D366]/20 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#25D366] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                WhatsApp Direct Desk
              </span>
              <span className="text-[10px] font-mono text-slate-400">+91 6363698148</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{contactPrefs.whatsappClicks}</span>
              <span className="text-xs text-slate-400">clicks tracked</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              {contactPrefs.whatsappClicks > contactPrefs.emailClicks ? (
                <span className="text-[#25D366] font-semibold">★ Current Leading Channel</span>
              ) : (
                <span>Instant dispatch chat routing</span>
              )}
            </div>
          </div>

          {/* Email Card */}
          <div className="p-4 rounded-xl bg-[#ff7700]/5 border border-[#ff7700]/20 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#ff7700] flex items-center gap-1.5">
                <Mail className="w-3 h-3" />
                Email Desk Inbound
              </span>
              <span className="text-[10px] font-mono text-slate-400">thewalgroups@gmail.com</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{contactPrefs.emailClicks}</span>
              <span className="text-xs text-slate-400">clicks tracked</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              {contactPrefs.emailClicks > contactPrefs.whatsappClicks ? (
                <span className="text-[#ff7700] font-semibold">★ Current Leading Channel</span>
              ) : (
                <span>Formal business enquiries</span>
              )}
            </div>
          </div>

          {/* Overall Preference State */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
                User Preference Status
              </div>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                {contactPrefs.preferredMethod === 'whatsapp' ? (
                  <span className="text-[#25D366] flex items-center gap-1.5">
                    <span>🟢 WhatsApp Preferred</span>
                  </span>
                ) : contactPrefs.preferredMethod === 'email' ? (
                  <span className="text-[#ff7700] flex items-center gap-1.5">
                    <span>🟠 Email Preferred</span>
                  </span>
                ) : contactPrefs.totalContactClicks > 0 ? (
                  <span className="text-cyan-400 capitalize">{contactPrefs.preferredMethod} Preferred</span>
                ) : (
                  <span className="text-slate-400 font-normal text-sm">Awaiting First Interaction</span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Total Channel Events:</span>
              <span className="font-bold text-white font-mono">{contactPrefs.totalContactClicks}</span>
            </div>
          </div>
        </div>

        {/* Ratio bar if there are clicks */}
        {totalPreferenceClicks > 0 && (
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#25D366]">WhatsApp ({whatsappPct}%)</span>
              <span className="text-slate-400 text-[11px]">Channel Ratio</span>
              <span className="text-[#ff7700]">Email ({emailPct}%)</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden flex">
              <div 
                className="h-full bg-[#25D366] transition-all duration-500" 
                style={{ width: `${whatsappPct}%` }} 
                title={`WhatsApp: ${whatsappPct}%`}
              />
              <div 
                className="h-full bg-[#ff7700] transition-all duration-500" 
                style={{ width: `${emailPct}%` }} 
                title={`Email: ${emailPct}%`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity Section */}
      <div className="rounded-2xl bg-[#09101d] border border-white/10 p-5 sm:p-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#ff7700]" />
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Recent Activity Feed
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Chronological Activity Stream
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-[#ff7700] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-400 font-medium">Loading recent records...</span>
          </div>
        ) : recentActivities.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            <Database className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-slate-400">No records found in database tables yet.</p>
            <p className="text-[11px] text-slate-500 mt-1">Submit test forms on the public site or check your Supabase schema.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentActivities.map((act) => {
              const badgeColors: Record<string, string> = {
                booking: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                lead: 'bg-[#ff7700]/10 text-[#ff7700] border-[#ff7700]/20',
                job: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                contact: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                ticket: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                'ai-log': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
              };

              const tabMap: Record<string, AdminTab> = {
                booking: 'bookings',
                lead: 'leads',
                job: 'jobs',
                contact: 'contacts',
                ticket: 'tickets',
                'ai-log': 'ai-logs'
              };

              const targetTab = tabMap[act.type] || 'dashboard';

              return (
                <div
                  key={act.id}
                  onClick={() => {
                    onSelectTab(targetTab);
                    navigate(`/admin/${targetTab}`);
                  }}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white/[0.02] px-2 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${badgeColors[act.type] || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                      {act.type.toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                        {act.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {act.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <span className="text-[11px] font-mono text-slate-500">
                      {act.timestamp}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#ff7700] transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
