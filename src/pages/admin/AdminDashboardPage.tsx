import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminSidebar, AdminTab } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminOverviewView } from '../../components/admin/AdminOverviewView';
import { AdminContactsView, ContactRecord } from '../../components/admin/AdminContactsView';
import { AdminLeadsView, LeadRecord } from '../../components/admin/AdminLeadsView';
import { AdminJobsView, JobAppRecord } from '../../components/admin/AdminJobsView';
import { AdminBookingsView, BookingRecord } from '../../components/admin/AdminBookingsView';
import { AdminTicketsView, TicketRecord } from '../../components/admin/AdminTicketsView';
import { AdminAiLogsView, AiLogRecord } from '../../components/admin/AdminAiLogsView';
import { AdminSettingsView } from '../../components/admin/AdminSettingsView';
import { 
  fetchContactsFromSupabase,
  fetchLeadsFromSupabase,
  fetchJobApplicationsFromSupabase,
  fetchBookingsFromSupabase,
  fetchTicketsFromSupabase,
  fetchAiLogsFromSupabase,
  fetchDashboardMetrics,
  DashboardMetricsResult
} from '../../lib/supabase';

interface Props {
  currentPath: string;
  navigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<Props> = ({ currentPath, navigate }) => {
  const { user, loading: authLoading } = useAuth();
  
  // Extract active tab from URL path
  const getTabFromPath = (path: string): AdminTab => {
    if (path.includes('/admin/contacts')) return 'contacts';
    if (path.includes('/admin/leads')) return 'leads';
    if (path.includes('/admin/jobs')) return 'jobs';
    if (path.includes('/admin/bookings')) return 'bookings';
    if (path.includes('/admin/tickets')) return 'tickets';
    if (path.includes('/admin/ai-logs')) return 'ai-logs';
    if (path.includes('/admin/settings')) return 'settings';
    return 'dashboard';
  };

  const [currentTab, setCurrentTab] = useState<AdminTab>(getTabFromPath(currentPath));
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync tab state with URL path
  useEffect(() => {
    setCurrentTab(getTabFromPath(currentPath));
  }, [currentPath]);

  // Route protection: if auth state is resolved and no user is signed in, redirect to /admin
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin');
    }
  }, [user, authLoading, navigate]);

  // Data states
  const [metrics, setMetrics] = useState<DashboardMetricsResult | null>(null);
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [jobs, setJobs] = useState<JobAppRecord[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [aiLogs, setAiLogs] = useState<AiLogRecord[]>([]);

  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load all live Supabase records
  const loadAllData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else {
      setLoadingMetrics(true);
      setLoadingData(true);
    }

    try {
      // 1. Fetch metrics summary counts in parallel
      const metricsPromise = fetchDashboardMetrics();

      // 2. Fetch full table lists in parallel
      const [
        metricsRes,
        contactsRes,
        leadsRes,
        jobsRes,
        bookingsRes,
        ticketsRes,
        aiLogsRes
      ] = await Promise.all([
        metricsPromise,
        fetchContactsFromSupabase(),
        fetchLeadsFromSupabase(),
        fetchJobApplicationsFromSupabase(),
        fetchBookingsFromSupabase(),
        fetchTicketsFromSupabase(),
        fetchAiLogsFromSupabase()
      ]);

      setMetrics(metricsRes);
      setContacts((contactsRes.data as ContactRecord[]) || []);
      setLeads((leadsRes.data as LeadRecord[]) || []);
      setJobs((jobsRes.data as JobAppRecord[]) || []);
      setBookings((bookingsRes.data as BookingRecord[]) || []);
      setTickets((ticketsRes.data as TicketRecord[]) || []);
      setAiLogs((aiLogsRes.data as AiLogRecord[]) || []);
    } catch (err) {
      console.error('[Admin Dashboard Exception] Failed to fetch data from Supabase:', err);
    } finally {
      setLoadingMetrics(false);
      setLoadingData(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user, loadAllData]);

  // Combine recent activities from fetched records for the feed
  const generateRecentActivities = () => {
    const activities: Array<{
      id: string;
      type: 'contact' | 'lead' | 'job' | 'booking' | 'ticket' | 'ai-log';
      title: string;
      subtitle: string;
      timestamp: string;
      rawDate: number;
    }> = [];

    bookings.slice(0, 5).forEach((b) => {
      activities.push({
        id: `b-${b.id}`,
        type: 'booking',
        title: `Discovery Booking: ${b.company_name}`,
        subtitle: `${b.full_name} (${b.email}) • ${b.preferred_date} @ ${b.preferred_time}`,
        timestamp: b.created_at ? new Date(b.created_at).toLocaleDateString() : 'Recent',
        rawDate: b.created_at ? new Date(b.created_at).getTime() : 0
      });
    });

    leads.slice(0, 5).forEach((l) => {
      activities.push({
        id: `l-${l.id}`,
        type: 'lead',
        title: `AI Lead: ${l.name || 'Visitor'}`,
        subtitle: `${l.company || 'Direct Contact'} • ${l.service || 'Inbound Consultation'}`,
        timestamp: l.created_at ? new Date(l.created_at).toLocaleDateString() : 'Recent',
        rawDate: l.created_at ? new Date(l.created_at).getTime() : 0
      });
    });

    jobs.slice(0, 5).forEach((j) => {
      activities.push({
        id: `j-${j.id}`,
        type: 'job',
        title: `Job Application: ${j.position}`,
        subtitle: `${j.full_name} (${j.location || 'Remote'})`,
        timestamp: j.applied_at ? new Date(j.applied_at).toLocaleDateString() : 'Recent',
        rawDate: j.applied_at ? new Date(j.applied_at).getTime() : 0
      });
    });

    contacts.slice(0, 5).forEach((c) => {
      activities.push({
        id: `c-${c.id || c.email}`,
        type: 'contact',
        title: `Contact: ${c.subject || 'Inquiry'}`,
        subtitle: `From ${c.full_name} (${c.company_name || 'Individual'})`,
        timestamp: c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Recent',
        rawDate: c.created_at ? new Date(c.created_at).getTime() : 0
      });
    });

    tickets.slice(0, 5).forEach((t) => {
      activities.push({
        id: `t-${t.id}`,
        type: 'ticket',
        title: `Support Ticket [${t.id}]: ${t.subject}`,
        subtitle: `${t.full_name} • ${t.department} (${t.priority} Priority)`,
        timestamp: t.created_at ? new Date(t.created_at).toLocaleDateString() : 'Recent',
        rawDate: t.created_at ? new Date(t.created_at).getTime() : 0
      });
    });

    aiLogs.slice(0, 5).forEach((a) => {
      activities.push({
        id: `a-${a.id}`,
        type: 'ai-log',
        title: `AI Query: ${a.user_message.slice(0, 40)}...`,
        subtitle: a.lead_email ? `Lead captured: ${a.lead_email}` : `Session ${a.session_id.slice(0, 8)}`,
        timestamp: a.created_at ? new Date(a.created_at).toLocaleDateString() : 'Recent',
        rawDate: a.created_at ? new Date(a.created_at).getTime() : 0
      });
    });

    return activities.sort((x, y) => y.rawDate - x.rawDate).slice(0, 10);
  };

  // If auth is still checking, show loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center gap-4 text-slate-200">
        <div className="w-10 h-10 border-3 border-[#ff7700] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Authenticating Supabase Session...
        </span>
      </div>
    );
  }

  // If not logged in, return null while useEffect redirects
  if (!user) {
    return null;
  }

  const counts = {
    contacts: metrics?.contacts?.count ?? contacts.length,
    leads: metrics?.leads?.count ?? leads.length,
    jobs: metrics?.jobs?.count ?? jobs.length,
    bookings: metrics?.bookings?.count ?? bookings.length,
    tickets: metrics?.tickets?.count ?? tickets.length,
    aiLogs: metrics?.aiLogs?.count ?? aiLogs.length,
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-[#ff7700] selection:text-black font-sans">
      {/* Sidebar Component */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        navigate={navigate}
        counts={counts}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area (offset by sidebar on desktop) */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        {/* Header */}
        <AdminHeader
          currentTab={currentTab}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onRefreshData={() => loadAllData(true)}
          isRefreshing={isRefreshing}
          navigate={navigate}
        />

        {/* Dynamic View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <AdminOverviewView
              metrics={metrics}
              loading={loadingMetrics}
              onSelectTab={(tab) => setCurrentTab(tab)}
              navigate={navigate}
              recentActivities={generateRecentActivities()}
              onRefresh={() => loadAllData(true)}
            />
          )}

          {currentTab === 'contacts' && (
            <AdminContactsView
              contacts={contacts}
              loading={loadingData}
              onRefresh={() => loadAllData(true)}
            />
          )}

          {currentTab === 'leads' && (
            <AdminLeadsView
              leads={leads}
              loading={loadingData}
              onRefresh={() => loadAllData(true)}
            />
          )}

          {currentTab === 'jobs' && (
            <AdminJobsView
              jobs={jobs}
              loading={loadingData}
              onRefresh={() => loadAllData(true)}
            />
          )}

          {currentTab === 'bookings' && (
            <AdminBookingsView
              bookings={bookings}
              loading={loadingData}
              onRefresh={() => loadAllData(true)}
            />
          )}

          {currentTab === 'tickets' && (
            <AdminTicketsView
              tickets={tickets}
              loading={loadingData}
              onRefresh={() => loadAllData(true)}
            />
          )}

          {currentTab === 'ai-logs' && (
            <AdminAiLogsView
              logs={aiLogs}
              loading={loadingData}
              onRefresh={() => loadAllData(true)}
            />
          )}

          {currentTab === 'settings' && (
            <AdminSettingsView
              metrics={metrics}
              onRefresh={() => loadAllData(true)}
            />
          )}
        </main>
      </div>
    </div>
  );
};
