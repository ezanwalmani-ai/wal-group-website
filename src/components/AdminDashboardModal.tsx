import React, { useState, useEffect } from 'react';
import ExcelJS from 'exceljs';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Calendar, 
  User, 
  Building2, 
  X, 
  RefreshCw,
  FileText,
  Mail,
  Phone,
  Video,
  ExternalLink,
  Bot,
  BarChart2,
  Sparkles,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  Tag,
  Folder,
  Send,
  Lock,
  Briefcase,
  Paperclip,
  Check,
  AlertCircle,
  Database,
  Copy,
  ChevronLeft,
  ChevronRight,
  Clock
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { WorkspaceHub } from './WorkspaceHub';
import { 
  fetchContactsFromSupabase, 
  fetchJobApplicationsFromSupabase,
  updateBookingInSupabase,
  deleteBookingFromSupabase,
  updateLeadInSupabase,
  deleteLeadFromSupabase,
  updateContactInSupabase,
  deleteContactFromSupabase,
  updateJobAppInSupabase,
  deleteJobAppFromSupabase
} from '../lib/supabase';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BookingRecord {
  id: string;
  companyName: string;
  industry: string;
  country: string;
  companySize: string;
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  selectedServices: string[];
  preferredDate: string;
  preferredTime: string;
  timezone: string;
  meetingType: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Canceled' | 'Rescheduled';
  createdAt: string;
  meetLink: string;
  notes?: string;
  clientName?: string;
}

interface LeadRecord {
  id: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  country?: string;
  industry?: string;
  fleetSize?: string;
  teamSize?: string;
  challenges?: string;
  servicesOfInterest?: string[];
  score?: 'Hot' | 'Warm' | 'Cold';
  scoreReason?: string;
  sessionId?: string;
  status?: 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Closed';
  createdAt: string;
  routedTo?: string;
  notes?: string;
}

interface ContactRecord {
  id?: string;
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  subject: string;
  message: string;
  created_at: string;
  target_email?: string;
}

interface JobAppRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  location?: string;
  linkedin_url?: string;
  position: string;
  experience_years?: number;
  current_company?: string;
  notice_period?: string;
  expected_salary?: string;
  resume_file_name?: string;
  resume_url?: string;
  cover_letter?: string;
  applied_at: string;
  status?: string;
}

interface ChatTranscriptSession {
  sessionId: string;
  createdAt: string;
  updatedAt: string;
  pageVisited: string;
  userBehaviorSummary: string;
  messages: Array<{ sender: string; text: string; timestamp: string }>;
  leadDetails: Record<string, any>;
}

const SUPABASE_SQL_SCHEMA = `-- WAL GROUP SUPABASE PRODUCTION DATABASE SCHEMA & RLS POLICIES

-- 1. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  industry TEXT,
  country TEXT,
  website TEXT,
  company_size TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  job_title TEXT,
  linkedin TEXT,
  selected_services JSONB,
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  timezone TEXT,
  meeting_type TEXT DEFAULT 'Google Meet',
  project_description TEXT,
  current_challenges TEXT,
  expected_team_size TEXT,
  budget TEXT,
  timeline TEXT,
  status TEXT DEFAULT 'New',
  meet_link TEXT,
  google_calendar_url TEXT,
  notes TEXT,
  routed_to TEXT DEFAULT 'thewalgroupinfo@gmail.com',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LEADS TABLE
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  title TEXT,
  service TEXT,
  source TEXT DEFAULT 'Website Form',
  status TEXT DEFAULT 'New',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CONTACT SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'New',
  notes TEXT,
  target_email TEXT DEFAULT 'thewalgroupinfo@gmail.com',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. JOB APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.job_applications (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT,
  linkedin_url TEXT,
  position TEXT NOT NULL,
  experience_years NUMERIC,
  current_company TEXT,
  notice_period TEXT,
  expected_salary TEXT,
  resume_file_name TEXT,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'New',
  notes TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ENABLE ROW LEVEL SECURITY (RLS) & POLICIES
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts to bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Allow update bookings" ON public.bookings FOR UPDATE USING (true);
CREATE POLICY "Allow delete bookings" ON public.bookings FOR DELETE USING (true);

CREATE POLICY "Allow public inserts to leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read leads" ON public.leads FOR SELECT USING (true);
CREATE POLICY "Allow update leads" ON public.leads FOR UPDATE USING (true);
CREATE POLICY "Allow delete leads" ON public.leads FOR DELETE USING (true);

CREATE POLICY "Allow public inserts to contact_submissions" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read contact_submissions" ON public.contact_submissions FOR SELECT USING (true);
CREATE POLICY "Allow update contact_submissions" ON public.contact_submissions FOR UPDATE USING (true);
CREATE POLICY "Allow delete contact_submissions" ON public.contact_submissions FOR DELETE USING (true);

CREATE POLICY "Allow public inserts to job_applications" ON public.job_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read job_applications" ON public.job_applications FOR SELECT USING (true);
CREATE POLICY "Allow update job_applications" ON public.job_applications FOR UPDATE USING (true);
CREATE POLICY "Allow delete job_applications" ON public.job_applications FOR DELETE USING (true);
`;

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'bookings' | 'leads' | 'contacts' | 'careers' | 'transcripts' | 'analytics'>('bookings');
  
  // Bookings state
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  
  // Leads state
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);

  // Contacts state
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactRecord | null>(null);

  // Job Applications state
  const [jobApps, setJobApps] = useState<JobAppRecord[]>([]);
  const [selectedJobApp, setSelectedJobApp] = useState<JobAppRecord | null>(null);

  // Transcripts state
  const [transcripts, setTranscripts] = useState<ChatTranscriptSession[]>([]);
  const [selectedTranscript, setSelectedTranscript] = useState<ChatTranscriptSession | null>(null);

  // Workspace Hub modal state
  const [workspaceHubOpen, setWorkspaceHubOpen] = useState(false);
  const [workspacePrefillEmail, setWorkspacePrefillEmail] = useState('');

  // Common filters & pagination
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Notes & Reschedule state
  const [editingNotes, setEditingNotes] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  // SQL Schema Modal state
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'waladmin2026' || passcode === 'admin123' || passcode === 'walgroup2026') {
      soundFx.playClick();
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid Admin Passcode. Try: waladmin2026');
    }
  };

  // Status List options
  const STATUS_OPTIONS = ['New', 'Contacted', 'Scheduled', 'In Progress', 'Completed', 'Closed', 'Rejected'];

  // Delete handlers
  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this discovery call booking?')) return;
    soundFx.playClick();
    await deleteBookingFromSupabase(id);
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' }).catch(() => {});
    setBookings(prev => prev.filter(b => b.id !== id));
    if (selectedBooking?.id === id) setSelectedBooking(null);
  };

  const handleDeleteLeadRecord = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    soundFx.playClick();
    await deleteLeadFromSupabase(id);
    await fetch(`/api/leads/${id}`, { method: 'DELETE' }).catch(() => {});
    setLeads(prev => prev.filter(l => l.id !== id));
    if (selectedLead?.id === id) setSelectedLead(null);
  };

  const handleDeleteContactRecord = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) return;
    soundFx.playClick();
    await deleteContactFromSupabase(id);
    setContacts(prev => prev.filter(c => c.id !== id));
    if (selectedContact?.id === id) setSelectedContact(null);
  };

  const handleDeleteJobAppRecord = async (id: string) => {
    if (!confirm('Are you sure you want to delete this candidate application?')) return;
    soundFx.playClick();
    await deleteJobAppFromSupabase(id);
    setJobApps(prev => prev.filter(j => j.id !== id));
    if (selectedJobApp?.id === id) setSelectedJobApp(null);
  };

  // Status Change handlers
  const handleBookingStatusChange = async (id: string, newStatus: string) => {
    soundFx.playClick();
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus as any } : b));
    if (selectedBooking?.id === id) setSelectedBooking(prev => prev ? { ...prev, status: newStatus as any } : null);
    await updateBookingInSupabase(id, { status: newStatus });
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(() => {});
  };

  const handleLeadStatusChange = async (id: string, newStatus: string) => {
    soundFx.playClick();
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus as any } : l));
    if (selectedLead?.id === id) setSelectedLead(prev => prev ? { ...prev, status: newStatus as any } : null);
    await updateLeadInSupabase(id, { status: newStatus });
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(() => {});
  };

  const handleContactStatusChange = async (id: string, newStatus: string) => {
    soundFx.playClick();
    setContacts(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    if (selectedContact?.id === id) setSelectedContact(prev => prev ? { ...prev, status: newStatus } : null);
    await updateContactInSupabase(id, { status: newStatus });
  };

  const handleJobAppStatusChange = async (id: string, newStatus: string) => {
    soundFx.playClick();
    setJobApps(prev => prev.map(j => j.id === id ? { ...j, status: newStatus } : j));
    if (selectedJobApp?.id === id) setSelectedJobApp(prev => prev ? { ...prev, status: newStatus } : null);
    await updateJobAppInSupabase(id, { status: newStatus });
  };

  // Notes save handlers
  const handleSaveNotes = async (type: 'booking' | 'lead' | 'contact' | 'jobApp', id: string) => {
    soundFx.playClick();
    if (type === 'booking') {
      await updateBookingInSupabase(id, { notes: editingNotes });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, notes: editingNotes } : b));
      if (selectedBooking) setSelectedBooking({ ...selectedBooking, notes: editingNotes });
    } else if (type === 'lead') {
      await updateLeadInSupabase(id, { notes: editingNotes });
      setLeads(prev => prev.map(l => l.id === id ? { ...l, notes: editingNotes } : l));
      if (selectedLead) setSelectedLead({ ...selectedLead, notes: editingNotes });
    } else if (type === 'contact') {
      await updateContactInSupabase(id, { notes: editingNotes });
      if (selectedContact) setSelectedContact({ ...selectedContact });
    } else if (type === 'jobApp') {
      await updateJobAppInSupabase(id, { notes: editingNotes });
      setJobApps(prev => prev.map(j => j.id === id ? { ...j, notes: editingNotes } : j));
      if (selectedJobApp) setSelectedJobApp({ ...selectedJobApp, notes: editingNotes });
    }
    alert('Notes saved successfully!');
  };

  // Reschedule Booking handler
  const handleSaveReschedule = async (id: string) => {
    if (!rescheduleDate || !rescheduleTime) {
      alert('Please select both date and time for rescheduling.');
      return;
    }
    soundFx.playClick();
    const updates = {
      preferred_date: rescheduleDate,
      preferred_time: rescheduleTime,
      status: 'Scheduled'
    };
    await updateBookingInSupabase(id, updates);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, preferredDate: rescheduleDate, preferredTime: rescheduleTime, status: 'Scheduled' } : b));
    if (selectedBooking?.id === id) {
      setSelectedBooking({ ...selectedBooking, preferredDate: rescheduleDate, preferredTime: rescheduleTime, status: 'Scheduled' });
    }
    setRescheduleDate('');
    setRescheduleTime('');
    alert('Booking rescheduled successfully!');
  };


  // Filtered lists for instant client-side search feedback
  const filteredLeads = leads.filter((l) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return (
      (l.name && l.name.toLowerCase().includes(term)) ||
      (l.email && l.email.toLowerCase().includes(term)) ||
      (l.company && l.company.toLowerCase().includes(term)) ||
      (l.phone && l.phone.toLowerCase().includes(term)) ||
      (l.id && l.id.toLowerCase().includes(term)) ||
      (l.industry && l.industry.toLowerCase().includes(term)) ||
      (l.country && l.country.toLowerCase().includes(term))
    );
  });

  const filteredBookings = bookings.filter((b) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return (
      (b.clientName && b.clientName.toLowerCase().includes(term)) ||
      (b.companyName && b.companyName.toLowerCase().includes(term)) ||
      (b.email && b.email.toLowerCase().includes(term)) ||
      (b.id && b.id.toLowerCase().includes(term)) ||
      (b.phone && b.phone.toLowerCase().includes(term))
    );
  });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/bookings', window.location.origin);
      if (statusFilter !== 'All') url.searchParams.append('status', statusFilter);
      if (searchTerm) url.searchParams.append('search', searchTerm);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/leads', window.location.origin);
      if (statusFilter !== 'All') url.searchParams.append('status', statusFilter);
      if (searchTerm) url.searchParams.append('search', searchTerm);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetchContactsFromSupabase();
      if (res.success) {
        setContacts(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCareers = async () => {
    setLoading(true);
    try {
      const res = await fetchJobApplicationsFromSupabase();
      if (res.success) {
        setJobApps(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch job applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTranscripts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai-transcripts');
      const data = await res.json();
      if (data.success) {
        setTranscripts(data.transcripts || []);
      }
    } catch (err) {
      console.error('Failed to fetch transcripts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (activeTab === 'bookings') fetchBookings();
      if (activeTab === 'leads') fetchLeads();
      if (activeTab === 'contacts') fetchContacts();
      if (activeTab === 'careers') fetchCareers();
      if (activeTab === 'transcripts') fetchTranscripts();
      if (activeTab === 'analytics') {
        fetchBookings();
        fetchLeads();
        fetchContacts();
        fetchCareers();
        fetchTranscripts();
      }
    }
  }, [isOpen, activeTab, statusFilter, searchTerm]);

  const updateBookingStatus = async (id: string, newStatus: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Canceled' | 'Rescheduled') => {
    soundFx.playClick();
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchBookings();
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking({ ...selectedBooking, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const updateLeadStatus = async (id: string, newStatus: LeadRecord['status']) => {
    soundFx.playClick();
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchLeads();
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead({ ...selectedLead, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Failed to update lead status:', err);
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead record?')) return;
    soundFx.playClick();
    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        if (selectedLead?.id === id) setSelectedLead(null);
        fetchLeads();
      }
    } catch (err) {
      console.error('Failed to delete lead:', err);
    }
  };

  // Helper to export to Excel (.xlsx) using ExcelJS
  const exportToExcelHelper = async (
    filename: string,
    sheetName: string,
    columns: { header: string; key: string; width?: number }[],
    rows: Record<string, any>[]
  ) => {
    if (!rows || rows.length === 0) {
      alert('No matching records found to export for the active filters.');
      return;
    }
    soundFx.playClick();
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Wal Group Executive Portal';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet(sheetName);
    worksheet.columns = columns.map(c => ({
      header: c.header,
      key: c.key,
      width: c.width || 22
    }));

    // Header styling
    const headerRow = worksheet.getRow(1);
    headerRow.height = 32;
    headerRow.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFD700' } }; // Gold text
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0F172A' } // Slate 900
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

    // Data rows
    rows.forEach((rowData, index) => {
      const row = worksheet.addRow(rowData);
      row.height = 24;
      row.alignment = { vertical: 'middle', wrapText: true };

      if (index % 2 === 1) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF8FAFC' }
        };
      }

      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper to export to CSV (.csv)
  const exportToCSVHelper = (
    filename: string,
    columns: { header: string; key: string }[],
    rows: Record<string, any>[]
  ) => {
    if (!rows || rows.length === 0) {
      alert('No matching records found to export for the active filters.');
      return;
    }
    soundFx.playClick();
    const escapeCsv = (val: any) => {
      if (val === undefined || val === null) return '""';
      const clean = String(val).replace(/"/g, '""').replace(/\r?\n/g, ' ');
      return `"${clean}"`;
    };

    const csvRows = [
      columns.map(c => `"${c.header}"`).join(','),
      ...rows.map(row => columns.map(c => escapeCsv(row[c.key])).join(','))
    ];

    const blob = new Blob(['\uFEFF' + csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTodayDateStr = () => new Date().toISOString().split('T')[0];

  // FILTERED EXPORT HANDLERS
  const handleExportBookings = async (format: 'xlsx' | 'csv') => {
    const filtered = bookings.filter(b => {
      if (statusFilter !== 'All' && (b.status || 'New').toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (dateFilter) {
        const bDate = b.preferredDate || (b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : '');
        if (!bDate.includes(dateFilter)) return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const match = (
          (b.id && b.id.toLowerCase().includes(q)) ||
          (b.fullName && b.fullName.toLowerCase().includes(q)) ||
          (b.clientName && b.clientName.toLowerCase().includes(q)) ||
          (b.companyName && b.companyName.toLowerCase().includes(q)) ||
          (b.email && b.email.toLowerCase().includes(q)) ||
          (b.phone && b.phone.toLowerCase().includes(q)) ||
          (b.jobTitle && b.jobTitle.toLowerCase().includes(q)) ||
          (b.industry && b.industry.toLowerCase().includes(q)) ||
          (b.projectDescription && b.projectDescription.toLowerCase().includes(q))
        );
        if (!match) return false;
      }
      return true;
    });

    const columns = [
      { header: 'ID', key: 'id', width: 16 },
      { header: 'Client Name', key: 'fullName', width: 22 },
      { header: 'Company Name', key: 'companyName', width: 22 },
      { header: 'Email', key: 'email', width: 26 },
      { header: 'Phone', key: 'phone', width: 18 },
      { header: 'Job Title', key: 'jobTitle', width: 20 },
      { header: 'LinkedIn Profile', key: 'linkedin', width: 25 },
      { header: 'Country', key: 'country', width: 16 },
      { header: 'Industry', key: 'industry', width: 18 },
      { header: 'Company Size', key: 'companySize', width: 16 },
      { header: 'Selected Services', key: 'selectedServices', width: 30 },
      { header: 'Booking Date', key: 'preferredDate', width: 15 },
      { header: 'Booking Time', key: 'preferredTime', width: 15 },
      { header: 'Timezone', key: 'timezone', width: 14 },
      { header: 'Meeting Type', key: 'meetingType', width: 16 },
      { header: 'Google Meet Link', key: 'meetLink', width: 32 },
      { header: 'Calendar Event URL', key: 'googleCalendarUrl', width: 32 },
      { header: 'Project Description', key: 'projectDescription', width: 35 },
      { header: 'Current Challenges', key: 'currentChallenges', width: 35 },
      { header: 'Team Size Needed', key: 'expectedTeamSize', width: 16 },
      { header: 'Budget', key: 'budget', width: 16 },
      { header: 'Timeline', key: 'timeline', width: 16 },
      { header: 'Status', key: 'status', width: 14 },
      { header: 'Internal Notes', key: 'notes', width: 30 },
      { header: 'Created At', key: 'createdAt', width: 22 },
      { header: 'Updated At', key: 'updatedAt', width: 22 }
    ];

    const rows = filtered.map(b => ({
      id: b.id || '',
      fullName: b.fullName || b.clientName || '',
      companyName: b.companyName || '',
      email: b.email || '',
      phone: b.phone || '',
      jobTitle: b.jobTitle || '',
      linkedin: b.linkedin || '',
      country: b.country || '',
      industry: b.industry || '',
      companySize: b.companySize || '',
      selectedServices: Array.isArray(b.selectedServices) ? b.selectedServices.join('; ') : (b.selectedServices || ''),
      preferredDate: b.preferredDate || '',
      preferredTime: b.preferredTime || '',
      timezone: b.timezone || 'UTC',
      meetingType: b.meetingType || 'Google Meet',
      meetLink: b.meetLink || '',
      googleCalendarUrl: b.googleCalendarUrl || '',
      projectDescription: b.projectDescription || '',
      currentChallenges: b.currentChallenges || '',
      expectedTeamSize: b.expectedTeamSize || '',
      budget: b.budget || '',
      timeline: b.timeline || '',
      status: b.status || 'New',
      notes: b.notes || '',
      createdAt: b.createdAt ? new Date(b.createdAt).toLocaleString() : '',
      updatedAt: b.updatedAt ? new Date(b.updatedAt).toLocaleString() : ''
    }));

    const filename = `Bookings_${getTodayDateStr()}.${format}`;
    if (format === 'xlsx') {
      await exportToExcelHelper(filename, 'Demo Bookings', columns, rows);
    } else {
      exportToCSVHelper(filename, columns, rows);
    }
  };

  const handleExportLeads = async (format: 'xlsx' | 'csv') => {
    const filtered = leads.filter(l => {
      if (statusFilter !== 'All' && (l.status || 'New').toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (dateFilter) {
        const lDate = l.createdAt ? new Date(l.createdAt).toISOString().split('T')[0] : '';
        if (!lDate.includes(dateFilter)) return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const match = (
          (l.id && l.id.toLowerCase().includes(q)) ||
          (l.name && l.name.toLowerCase().includes(q)) ||
          (l.company && l.company.toLowerCase().includes(q)) ||
          (l.email && l.email.toLowerCase().includes(q)) ||
          (l.phone && l.phone.toLowerCase().includes(q)) ||
          (l.service && l.service.toLowerCase().includes(q)) ||
          (l.industry && l.industry.toLowerCase().includes(q)) ||
          (l.country && l.country.toLowerCase().includes(q))
        );
        if (!match) return false;
      }
      return true;
    });

    const columns = [
      { header: 'ID', key: 'id', width: 16 },
      { header: 'Prospect Name', key: 'name', width: 22 },
      { header: 'Company Name', key: 'company', width: 22 },
      { header: 'Email', key: 'email', width: 26 },
      { header: 'Phone', key: 'phone', width: 18 },
      { header: 'Job Title', key: 'title', width: 20 },
      { header: 'Primary Service', key: 'service', width: 22 },
      { header: 'Services of Interest', key: 'servicesOfInterest', width: 30 },
      { header: 'Lead Source', key: 'source', width: 18 },
      { header: 'Status', key: 'status', width: 14 },
      { header: 'Industry', key: 'industry', width: 18 },
      { header: 'Country', key: 'country', width: 16 },
      { header: 'Fleet / Team Size', key: 'fleetSize', width: 18 },
      { header: 'Lead Score', key: 'score', width: 14 },
      { header: 'AI Rationale & Notes', key: 'notes', width: 35 },
      { header: 'Created Date', key: 'createdAt', width: 22 },
      { header: 'Updated Date', key: 'updatedAt', width: 22 }
    ];

    const rows = filtered.map(l => ({
      id: l.id || '',
      name: l.name || '',
      company: l.company || '',
      email: l.email || '',
      phone: l.phone || '',
      title: l.title || '',
      service: l.service || '',
      servicesOfInterest: Array.isArray(l.servicesOfInterest) ? l.servicesOfInterest.join('; ') : (l.servicesOfInterest || ''),
      source: l.source || 'Website Form',
      status: l.status || 'New',
      industry: l.industry || '',
      country: l.country || '',
      fleetSize: l.fleetSize || l.teamSize || '',
      score: l.score || 'Warm',
      notes: l.scoreReason || l.notes || '',
      createdAt: l.createdAt ? new Date(l.createdAt).toLocaleString() : '',
      updatedAt: l.updatedAt ? new Date(l.updatedAt).toLocaleString() : ''
    }));

    const filename = `Leads_${getTodayDateStr()}.${format}`;
    if (format === 'xlsx') {
      await exportToExcelHelper(filename, 'AI Business Leads', columns, rows);
    } else {
      exportToCSVHelper(filename, columns, rows);
    }
  };

  const handleExportContacts = async (format: 'xlsx' | 'csv') => {
    const filtered = contacts.filter(c => {
      if (statusFilter !== 'All' && (c.status || 'New').toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (dateFilter) {
        const cDate = c.created_at ? new Date(c.created_at).toISOString().split('T')[0] : '';
        if (!cDate.includes(dateFilter)) return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const match = (
          (c.id && c.id.toLowerCase().includes(q)) ||
          (c.full_name && c.full_name.toLowerCase().includes(q)) ||
          (c.email && c.email.toLowerCase().includes(q)) ||
          (c.company_name && c.company_name.toLowerCase().includes(q)) ||
          (c.phone && c.phone.toLowerCase().includes(q)) ||
          (c.subject && c.subject.toLowerCase().includes(q)) ||
          (c.message && c.message.toLowerCase().includes(q))
        );
        if (!match) return false;
      }
      return true;
    });

    const columns = [
      { header: 'ID', key: 'id', width: 16 },
      { header: 'Full Name', key: 'full_name', width: 22 },
      { header: 'Company Name', key: 'company_name', width: 22 },
      { header: 'Email', key: 'email', width: 26 },
      { header: 'Phone', key: 'phone', width: 18 },
      { header: 'Subject', key: 'subject', width: 25 },
      { header: 'Message', key: 'message', width: 40 },
      { header: 'Status', key: 'status', width: 14 },
      { header: 'Notes', key: 'notes', width: 30 },
      { header: 'Submitted At', key: 'created_at', width: 22 }
    ];

    const rows = filtered.map(c => ({
      id: c.id || '',
      full_name: c.full_name || '',
      company_name: c.company_name || '',
      email: c.email || '',
      phone: c.phone || '',
      subject: c.subject || '',
      message: c.message || '',
      status: c.status || 'New',
      notes: c.notes || '',
      created_at: c.created_at ? new Date(c.created_at).toLocaleString() : ''
    }));

    const filename = `Messages_${getTodayDateStr()}.${format}`;
    if (format === 'xlsx') {
      await exportToExcelHelper(filename, 'Contact Messages', columns, rows);
    } else {
      exportToCSVHelper(filename, columns, rows);
    }
  };

  const handleExportJobApps = async (format: 'xlsx' | 'csv') => {
    const filtered = jobApps.filter(j => {
      if (statusFilter !== 'All' && (j.status || 'New').toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (dateFilter) {
        const jDate = j.applied_at ? new Date(j.applied_at).toISOString().split('T')[0] : '';
        if (!jDate.includes(dateFilter)) return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const match = (
          (j.id && j.id.toLowerCase().includes(q)) ||
          (j.full_name && j.full_name.toLowerCase().includes(q)) ||
          (j.email && j.email.toLowerCase().includes(q)) ||
          (j.phone && j.phone.toLowerCase().includes(q)) ||
          (j.position && j.position.toLowerCase().includes(q)) ||
          (j.current_company && j.current_company.toLowerCase().includes(q)) ||
          (j.location && j.location.toLowerCase().includes(q))
        );
        if (!match) return false;
      }
      return true;
    });

    const columns = [
      { header: 'ID', key: 'id', width: 16 },
      { header: 'Applicant Name', key: 'full_name', width: 22 },
      { header: 'Email', key: 'email', width: 26 },
      { header: 'Phone', key: 'phone', width: 18 },
      { header: 'Position', key: 'position', width: 22 },
      { header: 'Location', key: 'location', width: 18 },
      { header: 'LinkedIn URL', key: 'linkedin_url', width: 28 },
      { header: 'Experience (Yrs)', key: 'experience_years', width: 16 },
      { header: 'Current Company', key: 'current_company', width: 22 },
      { header: 'Notice Period', key: 'notice_period', width: 16 },
      { header: 'Expected Salary', key: 'expected_salary', width: 18 },
      { header: 'Resume URL', key: 'resume_url', width: 35 },
      { header: 'Cover Letter', key: 'cover_letter', width: 40 },
      { header: 'Status', key: 'status', width: 14 },
      { header: 'Admin Notes', key: 'notes', width: 30 },
      { header: 'Applied At', key: 'applied_at', width: 22 }
    ];

    const rows = filtered.map(j => ({
      id: j.id || '',
      full_name: j.full_name || '',
      email: j.email || '',
      phone: j.phone || '',
      position: j.position || '',
      location: j.location || '',
      linkedin_url: j.linkedin_url || '',
      experience_years: j.experience_years !== undefined ? j.experience_years : '',
      current_company: j.current_company || '',
      notice_period: j.notice_period || '',
      expected_salary: j.expected_salary || '',
      resume_url: j.resume_url || j.resume_file_name || '',
      cover_letter: j.cover_letter || '',
      status: j.status || 'New',
      notes: j.notes || '',
      applied_at: j.applied_at ? new Date(j.applied_at).toLocaleString() : ''
    }));

    const filename = `JobApplications_${getTodayDateStr()}.${format}`;
    if (format === 'xlsx') {
      await exportToExcelHelper(filename, 'Job Applications', columns, rows);
    } else {
      exportToCSVHelper(filename, columns, rows);
    }
  };

  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl font-sans">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-[#0a2647] border border-amber-500/40 rounded-3xl p-8 text-white shadow-2xl relative space-y-6"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400 shadow-lg">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">Wal Group Admin Portal</h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Secure executive access for leads, bookings, contacts, and candidate resumes.
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1.5">Admin Passcode</label>
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter admin passcode (e.g. waladmin2026)"
                  className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {authError && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2.5 font-medium">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Unlock Operations Center</span>
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Default Passcode: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-300">waladmin2026</code></span>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative z-10 w-full max-w-6xl bg-[#0a0a0f] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#ff7700] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#ff7700]" />
                <span>Wal Group Executive Control Center</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Operations & <span className="text-[#ff7700]">Lead Management Dashboard</span>
              </h2>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowSqlModal(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center gap-1.5 hover:bg-purple-900 transition-all cursor-pointer"
                title="View and copy Supabase SQL setup and RLS rules"
              >
                <Database className="w-4 h-4 text-purple-400" />
                <span>Supabase SQL Setup</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setWorkspaceHubOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-950/50 hover:brightness-110 transition-all cursor-pointer"
                title="Manage Google Drive files and send emails via Gmail"
              >
                <Folder className="w-4 h-4 text-blue-200" />
                <span>Google Workspace Hub</span>
              </button>

              {activeTab === 'bookings' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExportBookings('xlsx')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-900 transition-all cursor-pointer shadow-md"
                    title="Export filtered Discovery Calls to Excel (.xlsx)"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Excel (.xlsx)</span>
                  </button>
                  <button
                    onClick={() => handleExportBookings('csv')}
                    className="px-3.5 py-2 rounded-xl bg-teal-950/90 border border-teal-500/50 text-teal-300 font-bold text-xs flex items-center gap-1.5 hover:bg-teal-900 transition-all cursor-pointer shadow-md"
                    title="Export filtered Discovery Calls to CSV (.csv)"
                  >
                    <Download className="w-4 h-4 text-teal-400" />
                    <span>CSV (.csv)</span>
                  </button>
                </div>
              )}

              {activeTab === 'leads' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExportLeads('xlsx')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-900 transition-all cursor-pointer shadow-md"
                    title="Export filtered Leads to Excel (.xlsx)"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Excel (.xlsx)</span>
                  </button>
                  <button
                    onClick={() => handleExportLeads('csv')}
                    className="px-3.5 py-2 rounded-xl bg-teal-950/90 border border-teal-500/50 text-teal-300 font-bold text-xs flex items-center gap-1.5 hover:bg-teal-900 transition-all cursor-pointer shadow-md"
                    title="Export filtered Leads to CSV (.csv)"
                  >
                    <Download className="w-4 h-4 text-teal-400" />
                    <span>CSV (.csv)</span>
                  </button>
                </div>
              )}

              {activeTab === 'contacts' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExportContacts('xlsx')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-900 transition-all cursor-pointer shadow-md"
                    title="Export filtered Contact Messages to Excel (.xlsx)"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Excel (.xlsx)</span>
                  </button>
                  <button
                    onClick={() => handleExportContacts('csv')}
                    className="px-3.5 py-2 rounded-xl bg-teal-950/90 border border-teal-500/50 text-teal-300 font-bold text-xs flex items-center gap-1.5 hover:bg-teal-900 transition-all cursor-pointer shadow-md"
                    title="Export filtered Contact Messages to CSV (.csv)"
                  >
                    <Download className="w-4 h-4 text-teal-400" />
                    <span>CSV (.csv)</span>
                  </button>
                </div>
              )}

              {activeTab === 'careers' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExportJobApps('xlsx')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-900 transition-all cursor-pointer shadow-md"
                    title="Export filtered Job Applications to Excel (.xlsx)"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Excel (.xlsx)</span>
                  </button>
                  <button
                    onClick={() => handleExportJobApps('csv')}
                    className="px-3.5 py-2 rounded-xl bg-teal-950/90 border border-teal-500/50 text-teal-300 font-bold text-xs flex items-center gap-1.5 hover:bg-teal-900 transition-all cursor-pointer shadow-md"
                    title="Export filtered Job Applications to CSV (.csv)"
                  >
                    <Download className="w-4 h-4 text-teal-400" />
                    <span>CSV (.csv)</span>
                  </button>
                </div>
              )}

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 pt-4 border-b border-white/10 overflow-x-auto pb-2">
            {[
              { id: 'bookings', label: 'Discovery Calls', icon: Calendar, count: bookings.length },
              { id: 'leads', label: 'AI Business Leads', icon: User, count: leads.length },
              { id: 'contacts', label: 'Contact Us', icon: Mail, count: contacts.length },
              { id: 'careers', label: 'Job Applications', icon: Briefcase, count: jobApps.length },
              { id: 'transcripts', label: 'AI Chat Transcripts', icon: MessageSquare, count: transcripts.length },
              { id: 'analytics', label: 'Executive Analytics', icon: BarChart2 }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveTab(tab.id as any);
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#ff7700] text-black shadow-lg shadow-[#ff7700]/20'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                      isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-slate-300'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Controls Bar for Bookings / Leads / Transcripts */}
          {activeTab !== 'analytics' && (
            <div className="pt-4 pb-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#ff7700] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder={
                    activeTab === 'leads'
                      ? 'Search leads by name, email, or company name...'
                      : activeTab === 'bookings'
                      ? 'Search discovery calls by client name, email, or company...'
                      : 'Search transcripts by user ID or keywords...'
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff7700] transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setSearchTerm('');
                    }}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white transition-colors"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <Filter className="w-4 h-4 text-[#ff7700] shrink-0" />
                <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 overflow-x-auto max-w-[320px] sm:max-w-[450px] scrollbar-none">
                  {['All', ...STATUS_OPTIONS].map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        soundFx.playClick();
                        setStatusFilter(st);
                        setCurrentPage(1);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${
                        statusFilter === st
                          ? 'bg-[#ff7700] text-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => {
                      setDateFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-transparent text-[11px] text-white focus:outline-none"
                    title="Filter by date"
                  />
                  {dateFilter && (
                    <button onClick={() => setDateFilter('')} className="text-slate-400 hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    if (activeTab === 'bookings') fetchBookings();
                    if (activeTab === 'leads') fetchLeads();
                    if (activeTab === 'contacts') fetchContacts();
                    if (activeTab === 'careers') fetchCareers();
                    if (activeTab === 'transcripts') fetchTranscripts();
                  }}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-[#ff7700] shrink-0"
                  title="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          )}

          {/* TAB CONTENT 1: DISCOVERY CALL BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
              <div className="lg:col-span-7 bg-white/[0.02] border border-white/10 rounded-2xl overflow-y-auto max-h-[480px]">
                {filteredBookings.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    {searchTerm ? `No discovery calls found matching "${searchTerm}".` : 'No bookings found matching current criteria.'}
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {filteredBookings.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => {
                          setSelectedBooking(b);
                          setEditingNotes(b.notes || '');
                        }}
                        className={`p-3.5 hover:bg-white/5 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          selectedBooking?.id === b.id ? 'bg-[#ff7700]/10 border-l-4 border-l-[#ff7700]' : ''
                        }`}
                      >
                        <div className="space-y-1 truncate">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold text-[#ff7700]">{b.id}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              b.status === 'Confirmed' || b.status === 'Completed'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                : b.status === 'Rescheduled'
                                ? 'bg-blue-950 text-blue-400 border border-blue-500/30'
                                : b.status === 'Cancelled' || b.status === 'Canceled'
                                ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                            }`}>
                              {b.status}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-white truncate">{b.companyName} &bull; <span className="text-slate-300 font-normal">{b.fullName}</span></div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-[#ff7700]" />
                            <span>{b.preferredDate} @ {b.preferredTime}</span>
                          </div>
                        </div>

                        <div className="text-right text-[11px] shrink-0 space-y-1">
                          <div className="text-slate-400">{b.meetingType}</div>
                          <div className="text-[#ff7700] font-bold">{b.selectedServices[0]}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 bg-white/[0.03] border border-white/10 rounded-2xl p-4 overflow-y-auto max-h-[480px]">
                {selectedBooking ? (
                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#ff7700] text-sm">{selectedBooking.id}</span>
                        <span className="text-slate-400">{new Date(selectedBooking.createdAt).toLocaleDateString()}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteBooking(selectedBooking.id)}
                        className="px-2.5 py-1 bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 font-bold text-[11px] rounded-lg flex items-center gap-1 transition-all"
                        title="Delete this booking permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Status Management:</label>
                      <select
                        value={selectedBooking.status || 'New'}
                        onChange={(e) => handleBookingStatusChange(selectedBooking.id, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                      >
                        {STATUS_OPTIONS.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-white/10">
                      <div><span className="text-slate-400">Company:</span> <strong className="text-white">{selectedBooking.companyName}</strong> ({selectedBooking.industry})</div>
                      <div><span className="text-slate-400">Client:</span> <strong className="text-white">{selectedBooking.fullName}</strong> ({selectedBooking.jobTitle || 'Executive'})</div>
                      <div><span className="text-slate-400">Email:</span> <a href={`mailto:${selectedBooking.email}`} className="text-[#ff7700] underline ml-1">{selectedBooking.email}</a></div>
                      <div><span className="text-slate-400">Phone:</span> <a href={`tel:${selectedBooking.phone}`} className="text-white ml-1">{selectedBooking.phone}</a></div>
                      <div><span className="text-slate-400">Scheduled:</span> <strong className="text-amber-300">{selectedBooking.preferredDate} @ {selectedBooking.preferredTime}</strong> ({selectedBooking.timezone || 'UTC'})</div>
                    </div>

                    {/* Reschedule Section */}
                    <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Reschedule Meeting</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          value={rescheduleDate}
                          onChange={(e) => setRescheduleDate(e.target.value)}
                          className="bg-black/50 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none"
                        />
                        <input
                          type="time"
                          value={rescheduleTime}
                          onChange={(e) => setRescheduleTime(e.target.value)}
                          className="bg-black/50 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={() => handleSaveReschedule(selectedBooking.id)}
                        className="w-full py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-[11px] rounded-lg transition-all"
                      >
                        Confirm Reschedule
                      </button>
                    </div>

                    {/* Admin Notes Editor */}
                    <div className="space-y-1.5">
                      <label className="block text-slate-400 font-bold text-[11px]">Internal Admin Notes:</label>
                      <textarea
                        rows={2}
                        value={editingNotes}
                        onChange={(e) => setEditingNotes(e.target.value)}
                        placeholder="Add notes about this booking, client requirements, follow-ups..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={() => handleSaveNotes('booking', selectedBooking.id)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] rounded-lg transition-all"
                      >
                        Save Notes
                      </button>
                    </div>

                    {selectedBooking.meetLink && (
                      <a
                        href={selectedBooking.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-300 font-bold text-xs flex items-center justify-between hover:bg-blue-900 transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-blue-400" />
                          <span>Launch Google Meet</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 text-xs text-center p-8">
                    Select a booking from the list to view full details.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB CONTENT 2: AI BUSINESS LEADS */}
          {activeTab === 'leads' && (
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
              <div className="lg:col-span-7 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-col max-h-[480px]">
                <div className="p-3 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs font-bold text-slate-300 flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <User className="w-4 h-4 text-[#ff7700]" />
                    <span>Captured CRM Leads ({filteredLeads.length})</span>
                    {searchTerm && (
                      <span className="text-[10px] font-normal bg-[#ff7700]/20 text-[#ff7700] border border-[#ff7700]/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                        Searching: "{searchTerm}"
                        <button
                          onClick={() => {
                            soundFx.playClick();
                            setSearchTerm('');
                          }}
                          className="hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleExportLeads('xlsx')}
                      className="text-emerald-400 hover:text-emerald-300 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      title="Export to Excel (.xlsx)"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Excel (.xlsx)</span>
                    </button>
                    <button
                      onClick={() => handleExportLeads('csv')}
                      className="text-teal-400 hover:text-teal-300 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      title="Export to CSV (.csv)"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>CSV (.csv)</span>
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                {filteredLeads.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    {searchTerm
                      ? `No leads found matching "${searchTerm}". Try adjusting your search query.`
                      : 'No captured leads found matching current filters.'}
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {filteredLeads.map((l) => (
                      <div
                        key={l.id}
                        onClick={() => {
                          soundFx.playClick();
                          setSelectedLead(l);
                        }}
                        className={`p-3.5 hover:bg-white/5 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          selectedLead?.id === l.id ? 'bg-[#ff7700]/10 border-l-4 border-l-[#ff7700]' : ''
                        }`}
                      >
                        <div className="space-y-1 truncate">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold text-[#ff7700]">{l.id}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              l.score === 'Hot'
                                ? 'bg-rose-950 text-rose-400 border border-rose-500/40'
                                : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                            }`}>
                              {l.score || 'Warm'} Lead
                            </span>
                            <span className="text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded-full">
                              {l.status || 'New'}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-white truncate">
                            {l.name || 'Anonymous Prospect'} {l.company ? `(${l.company})` : ''}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <Mail className="w-3 h-3 text-[#ff7700]" />
                            <span>{l.email || l.phone || 'No direct contact'}</span>
                          </div>
                        </div>

                        <div className="text-right text-[11px] shrink-0 space-y-1">
                          <div className="text-slate-400">{l.fleetSize || 'Fleet N/A'}</div>
                          <div className="text-[#ff7700] font-bold">{new Date(l.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                </div>
              </div>

              <div className="lg:col-span-5 bg-white/[0.03] border border-white/10 rounded-2xl p-4 overflow-y-auto max-h-[480px]">
                {selectedLead ? (
                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="font-mono font-bold text-[#ff7700] text-sm">{selectedLead.id}</span>
                      <button
                        onClick={() => deleteLead(selectedLead.id)}
                        className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Update Pipeline Status:</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed'] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => updateLeadStatus(selectedLead.id, st)}
                            className={`p-1.5 rounded-xl text-[10px] font-bold border transition-all text-center cursor-pointer ${
                              selectedLead.status === st
                                ? 'bg-[#ff7700] text-black border-[#ff7700]'
                                : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-white/10">
                      <div><span className="text-slate-400">Prospect Name:</span> <strong className="text-white">{selectedLead.name || 'Not provided'}</strong></div>
                      <div><span className="text-slate-400">Company Name:</span> <strong className="text-white">{selectedLead.company || 'Not provided'}</strong></div>
                      <div><span className="text-slate-400">Email:</span> {selectedLead.email ? <a href={`mailto:${selectedLead.email}`} className="text-[#ff7700] underline">{selectedLead.email}</a> : 'N/A'}</div>
                      <div><span className="text-slate-400">Phone:</span> {selectedLead.phone ? <a href={`tel:${selectedLead.phone}`} className="text-white underline">{selectedLead.phone}</a> : 'N/A'}</div>
                      <div><span className="text-slate-400">Fleet/Team Size:</span> <span className="text-white font-bold">{selectedLead.fleetSize || selectedLead.teamSize || 'N/A'}</span></div>
                      <div><span className="text-slate-400">Routed Executive:</span> <span className="text-emerald-400 font-mono">{selectedLead.routedTo || 'thewalgroupinfo@gmail.com'}</span></div>
                    </div>

                    {selectedLead.email && (
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setWorkspacePrefillEmail(selectedLead.email || '');
                          setWorkspaceHubOpen(true);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer"
                      >
                        <Send className="w-4 h-4 text-blue-200" />
                        <span>Compose Gmail Outreach to {selectedLead.name || 'Prospect'}</span>
                      </button>
                    )}

                    {selectedLead.scoreReason && (
                      <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-500/30">
                        <span className="text-amber-400 font-bold block mb-1">AI Lead Scoring Rationale:</span>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{selectedLead.scoreReason}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 text-xs text-center p-8">
                    Select a captured lead from the left to view qualifications and update status.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB CONTENT: CONTACT SUBMISSIONS */}
          {activeTab === 'contacts' && (
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
              <div className="lg:col-span-5 bg-white/[0.02] border border-white/10 rounded-2xl overflow-y-auto max-h-[480px]">
                {contacts.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">No contact messages received yet.</div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {contacts.map((c, idx) => (
                      <div
                        key={c.id || idx}
                        onClick={() => setSelectedContact(c)}
                        className={`p-3.5 hover:bg-white/5 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          selectedContact === c ? 'bg-[#ff7700]/10 border-l-4 border-l-[#ff7700]' : ''
                        }`}
                      >
                        <div className="space-y-1 truncate">
                          <div className="font-bold text-white text-xs truncate">{c.full_name}</div>
                          <div className="text-[11px] text-amber-400 font-medium truncate">{c.subject}</div>
                          <div className="text-[10px] text-slate-400 truncate">{c.company_name} &bull; {c.email}</div>
                        </div>
                        <div className="text-right text-[10px] text-slate-400 shrink-0">
                          {new Date(c.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-7 bg-white/[0.03] border border-white/10 rounded-2xl p-5 overflow-y-auto max-h-[480px] flex flex-col">
                {selectedContact ? (
                  <div className="space-y-4">
                    <div className="border-b border-white/10 pb-3">
                      <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">Contact Submission</div>
                      <h3 className="text-lg font-bold text-white">{selectedContact.subject}</h3>
                      <div className="text-xs text-slate-400 mt-1">Submitted on {new Date(selectedContact.created_at).toLocaleString()}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs bg-black/40 p-3.5 rounded-xl border border-white/5">
                      <div><span className="text-slate-400">Sender:</span> <strong className="text-white block">{selectedContact.full_name}</strong></div>
                      <div><span className="text-slate-400">Company:</span> <strong className="text-white block">{selectedContact.company_name}</strong></div>
                      <div><span className="text-slate-400">Email:</span> <strong className="text-amber-300 block">{selectedContact.email}</strong></div>
                      <div><span className="text-slate-400">Phone:</span> <strong className="text-white block">{selectedContact.phone}</strong></div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-400">Message Content:</span>
                      <p className="p-3.5 bg-black/50 border border-white/10 rounded-xl text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {selectedContact.message}
                      </p>
                    </div>

                    <a
                      href={`mailto:${selectedContact.email}?subject=Re: ${encodeURIComponent(selectedContact.subject)}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-lg transition-all cursor-pointer"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Reply via Email ({selectedContact.email})</span>
                    </a>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 text-xs text-center p-8">
                    Select a contact submission from the left list to view message content.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB CONTENT: JOB APPLICATIONS */}
          {activeTab === 'careers' && (
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
              <div className="lg:col-span-5 bg-white/[0.02] border border-white/10 rounded-2xl overflow-y-auto max-h-[480px]">
                {jobApps.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">No candidate applications submitted yet.</div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {jobApps.map((j) => (
                      <div
                        key={j.id}
                        onClick={() => setSelectedJobApp(j)}
                        className={`p-3.5 hover:bg-white/5 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          selectedJobApp?.id === j.id ? 'bg-[#ff7700]/10 border-l-4 border-l-[#ff7700]' : ''
                        }`}
                      >
                        <div className="space-y-1 truncate">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold text-amber-400">{j.id}</span>
                            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">{j.status || 'New'}</span>
                          </div>
                          <div className="font-bold text-white text-xs truncate">{j.full_name}</div>
                          <div className="text-[11px] text-slate-300 truncate">{j.position} ({j.experience_years || 0} yrs exp)</div>
                        </div>
                        <div className="text-right text-[10px] text-slate-400 shrink-0">
                          {new Date(j.applied_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-7 bg-white/[0.03] border border-white/10 rounded-2xl p-5 overflow-y-auto max-h-[480px] flex flex-col">
                {selectedJobApp ? (
                  <div className="space-y-4">
                    <div className="border-b border-white/10 pb-3 flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">Candidate Profile</div>
                        <h3 className="text-lg font-bold text-white">{selectedJobApp.full_name}</h3>
                        <div className="text-xs text-slate-400 mt-0.5">{selectedJobApp.position} &bull; Ref: {selectedJobApp.id}</div>
                      </div>
                      {selectedJobApp.resume_url ? (
                        <a
                          href={selectedJobApp.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg hover:brightness-110 transition-all shrink-0 cursor-pointer"
                        >
                          <Paperclip className="w-4 h-4" />
                          <span>View Resume ({selectedJobApp.resume_file_name || 'Resume.pdf'})</span>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-500 italic">No resume attachment</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-black/40 p-3.5 rounded-xl border border-white/5">
                      <div><span className="text-slate-400">Email:</span> <strong className="text-amber-300 block truncate">{selectedJobApp.email}</strong></div>
                      <div><span className="text-slate-400">Phone:</span> <strong className="text-white block">{selectedJobApp.phone}</strong></div>
                      <div><span className="text-slate-400">Location:</span> <strong className="text-white block">{selectedJobApp.location || 'N/A'}</strong></div>
                      <div><span className="text-slate-400">Experience:</span> <strong className="text-white block">{selectedJobApp.experience_years || 0} Years</strong></div>
                      <div><span className="text-slate-400">Notice Period:</span> <strong className="text-white block">{selectedJobApp.notice_period || 'N/A'}</strong></div>
                      <div><span className="text-slate-400">Expected Salary:</span> <strong className="text-emerald-400 block">{selectedJobApp.expected_salary || 'N/A'}</strong></div>
                    </div>

                    {selectedJobApp.linkedin_url && (
                      <div className="text-xs">
                        <span className="text-slate-400 mr-2">LinkedIn:</span>
                        <a href={selectedJobApp.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1">
                          <span>{selectedJobApp.linkedin_url}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {selectedJobApp.cover_letter && (
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-400">Cover Letter / Intro:</span>
                        <p className="p-3.5 bg-black/50 border border-white/10 rounded-xl text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                          {selectedJobApp.cover_letter}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 text-xs text-center p-8">
                    Select a candidate application from the left to view profile and resume attachment.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB CONTENT 3: AI CHAT TRANSCRIPTS */}
          {activeTab === 'transcripts' && (
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
              <div className="lg:col-span-5 bg-white/[0.02] border border-white/10 rounded-2xl overflow-y-auto max-h-[480px]">
                {transcripts.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">No active AI transcripts recorded yet.</div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {transcripts.map((t) => (
                      <div
                        key={t.sessionId}
                        onClick={() => setSelectedTranscript(t)}
                        className={`p-3.5 hover:bg-white/5 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          selectedTranscript?.sessionId === t.sessionId ? 'bg-[#ff7700]/10 border-l-4 border-l-[#ff7700]' : ''
                        }`}
                      >
                        <div className="space-y-1 truncate">
                          <div className="flex items-center gap-2">
                            <Bot className="w-3.5 h-3.5 text-[#ff7700]" />
                            <span className="font-mono text-[11px] font-bold text-white">{t.sessionId}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">Page: {t.pageVisited}</div>
                          <div className="text-[10px] text-slate-500">{t.messages?.length || 0} messages exchange</div>
                        </div>

                        <div className="text-right text-[10px] text-slate-400">
                          {new Date(t.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-7 bg-white/[0.03] border border-white/10 rounded-2xl p-4 overflow-y-auto max-h-[480px] flex flex-col">
                {selectedTranscript ? (
                  <div className="space-y-3 flex-1 flex flex-col">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs">
                      <div className="flex items-center gap-2 font-mono text-[#ff7700] font-bold">
                        <span>{selectedTranscript.sessionId}</span>
                      </div>
                      <span className="text-slate-400">{new Date(selectedTranscript.createdAt).toLocaleString()}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 max-h-[350px] p-2 bg-black/50 rounded-xl border border-white/10">
                      {selectedTranscript.messages.map((m, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl text-xs max-w-[85%] ${
                            m.sender === 'user'
                              ? 'ml-auto bg-[#ff7700]/20 text-white border border-[#ff7700]/30'
                              : 'mr-auto bg-white/10 text-slate-200 border border-white/10'
                          }`}
                        >
                          <div className="text-[10px] font-bold mb-1 opacity-60">
                            {m.sender === 'user' ? 'Visitor' : 'AI Consultant'} &bull; {m.timestamp}
                          </div>
                          <p className="whitespace-pre-wrap">{m.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 text-xs text-center p-8">
                    Select a conversation transcript to inspect the full turn-by-turn dialogue.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB CONTENT 4: ANALYTICS OVERVIEW */}
          {activeTab === 'analytics' && (
            <div className="p-4 space-y-6 overflow-y-auto max-h-[480px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                    <span>Booked Demos</span>
                    <Calendar className="w-4 h-4 text-[#ff7700]" />
                  </div>
                  <div className="text-2xl font-black text-white">{bookings.length}</div>
                  <p className="text-[10px] text-emerald-400">Routed to thewalgroupinfo@gmail.com</p>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                    <span>Business Leads</span>
                    <User className="w-4 h-4 text-[#ff7700]" />
                  </div>
                  <div className="text-2xl font-black text-white">{leads.length}</div>
                  <p className="text-[10px] text-[#ff7700]">Qualified Prospects</p>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                    <span>Contact Messages</span>
                    <Mail className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{contacts.length}</div>
                  <p className="text-[10px] text-amber-300">Contact Us Inquiries</p>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                    <span>Job Applications</span>
                    <Briefcase className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{jobApps.length}</div>
                  <p className="text-[10px] text-blue-300">Candidate Resumes</p>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                    <span>Email Delivery</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400">Active</div>
                  <p className="text-[10px] text-slate-400">thewalgroupinfo@gmail.com</p>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ff7700]" />
                  <span>Wal Group Lead Qualification Strategy Summary</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The AI Business Consultant engages visitors in structured dialogue: identifying operational requirements in logistics (Amazon DSP, AFP dispatch, 14-day pay statement audits, driver recruitment), BPO virtual assistants, or website development. Qualified leads and transcripts are automatically routed directly to <span className="text-[#ff7700] font-bold">thewalgroupinfo@gmail.com</span> for immediate executive follow-up.
                </p>
              </div>
            </div>
          )}

        </motion.div>
      </div>

      {/* SQL Setup Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0f172a] border border-purple-500/40 rounded-2xl p-6 max-w-3xl w-full max-h-[85vh] flex flex-col space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-400" />
                <h3 className="font-extrabold text-base text-white">Supabase SQL Schema & RLS Policies</h3>
              </div>
              <button onClick={() => setShowSqlModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Copy and execute this script in your <strong className="text-purple-300">Supabase SQL Editor</strong> to verify all database tables (<code className="text-amber-300">bookings</code>, <code className="text-amber-300">leads</code>, <code className="text-amber-300">contact_submissions</code>, <code className="text-amber-300">job_applications</code>) and Row Level Security policies are active.
            </p>
            <div className="relative flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-y-auto font-mono text-xs text-emerald-400 leading-relaxed max-h-[350px]">
              <pre>{SUPABASE_SQL_SCHEMA}</pre>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400">File path: <code className="text-amber-300">/supabase-schema.sql</code></span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
                  setCopiedSql(true);
                  setTimeout(() => setCopiedSql(false), 2000);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg transition-all"
              >
                {copiedSql ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <WorkspaceHub
        isOpen={workspaceHubOpen}
        onClose={() => setWorkspaceHubOpen(false)}
        leadsForExport={leads}
        prefillEmail={workspacePrefillEmail}
      />
    </AnimatePresence>
  );
};
