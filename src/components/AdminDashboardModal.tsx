import React, { useState, useEffect } from 'react';
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
  Send
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { WorkspaceHub } from './WorkspaceHub';

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

interface ChatTranscriptSession {
  sessionId: string;
  createdAt: string;
  updatedAt: string;
  pageVisited: string;
  userBehaviorSummary: string;
  messages: Array<{ sender: string; text: string; timestamp: string }>;
  leadDetails: Record<string, any>;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'leads' | 'transcripts' | 'analytics'>('bookings');
  
  // Bookings state
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  
  // Leads state
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);

  // Transcripts state
  const [transcripts, setTranscripts] = useState<ChatTranscriptSession[]>([]);
  const [selectedTranscript, setSelectedTranscript] = useState<ChatTranscriptSession | null>(null);

  // Workspace Hub modal state
  const [workspaceHubOpen, setWorkspaceHubOpen] = useState(false);
  const [workspacePrefillEmail, setWorkspacePrefillEmail] = useState('');

  // Common filters
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingNotes, setEditingNotes] = useState('');

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
      if (activeTab === 'transcripts') fetchTranscripts();
      if (activeTab === 'analytics') {
        fetchBookings();
        fetchLeads();
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

  const exportBookingsCSV = () => {
    soundFx.playClick();
    window.open('/api/bookings/export-csv', '_blank');
  };

  const exportLeadsCSV = () => {
    soundFx.playClick();
    if (leads && leads.length > 0) {
      const headers = [
        'Lead ID',
        'Prospect Name',
        'Company Name',
        'Email',
        'Phone',
        'Country',
        'Industry',
        'Fleet / Team Size',
        'Lead Score',
        'Pipeline Status',
        'Services of Interest',
        'AI Rationale & Notes',
        'Routed Executive',
        'Date Created'
      ];

      const escapeCsv = (val?: string | number | null) => {
        if (val === undefined || val === null) return '""';
        const clean = String(val).replace(/"/g, '""');
        return `"${clean}"`;
      };

      const rows = leads.map((l) => [
        l.id,
        l.name || 'N/A',
        l.company || 'N/A',
        l.email || 'N/A',
        l.phone || 'N/A',
        l.country || 'N/A',
        l.industry || 'N/A',
        l.fleetSize || l.teamSize || 'N/A',
        l.score || 'Warm',
        l.status || 'New',
        Array.isArray(l.servicesOfInterest) ? l.servicesOfInterest.join('; ') : 'N/A',
        l.scoreReason || l.notes || 'N/A',
        l.routedTo || 'thewalgroupinfo@gmail.com',
        new Date(l.createdAt).toLocaleString()
      ]);

      const csvContent = [
        headers.map(h => `"${h}"`).join(','),
        ...rows.map(r => r.map(escapeCsv).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `wal_group_leads_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      window.open('/api/leads/export-csv', '_blank');
    }
  };

  const exportLeadsJSON = () => {
    soundFx.playClick();
    window.open('/api/leads/export-json', '_blank');
  };

  if (!isOpen) return null;

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
                  setWorkspaceHubOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-950/50 hover:brightness-110 transition-all cursor-pointer"
                title="Manage Google Drive files and send emails via Gmail"
              >
                <Folder className="w-4 h-4 text-blue-200" />
                <span>Google Workspace Hub</span>
              </button>

              {activeTab === 'bookings' && (
                <button
                  onClick={exportBookingsCSV}
                  className="px-3.5 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-900 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Bookings CSV</span>
                </button>
              )}

              {activeTab === 'leads' && (
                <div className="flex gap-2">
                  <button
                    onClick={exportLeadsCSV}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer"
                    title="Export all database leads into formatted CSV for CRM import"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Leads (CSV)</span>
                  </button>
                  <button
                    onClick={exportLeadsJSON}
                    className="px-3 py-2 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-300 font-bold text-xs flex items-center gap-1.5 hover:bg-blue-900 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>JSON</span>
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

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#ff7700]" />
                <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 overflow-x-auto">
                  {['All', 'Hot', 'Warm', 'New', 'Contacted', 'Qualified'].map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        soundFx.playClick();
                        setStatusFilter(st);
                      }}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                        statusFilter === st
                          ? 'bg-[#ff7700] text-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    if (activeTab === 'bookings') fetchBookings();
                    if (activeTab === 'leads') fetchLeads();
                    if (activeTab === 'transcripts') fetchTranscripts();
                  }}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-[#ff7700]"
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
                      <span className="font-mono font-bold text-[#ff7700] text-sm">{selectedBooking.id}</span>
                      <span className="text-slate-400">{new Date(selectedBooking.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Update Status:</label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                        {(['Confirmed', 'Pending', 'Completed', 'Rescheduled', 'Cancelled'] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => updateBookingStatus(selectedBooking.id, st)}
                            className={`p-1.5 rounded-xl text-[10px] font-bold border transition-all text-center ${
                              selectedBooking.status === st
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
                      <div><span className="text-slate-400">Company:</span> <strong className="text-white">{selectedBooking.companyName}</strong> ({selectedBooking.industry})</div>
                      <div><span className="text-slate-400">Client:</span> <strong className="text-white">{selectedBooking.fullName}</strong> ({selectedBooking.jobTitle || 'Executive'})</div>
                      <div><span className="text-slate-400">Email:</span> <a href={`mailto:${selectedBooking.email}`} className="text-[#ff7700] underline ml-1">{selectedBooking.email}</a></div>
                      <div><span className="text-slate-400">Phone:</span> <a href={`tel:${selectedBooking.phone}`} className="text-white ml-1">{selectedBooking.phone}</a></div>
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
                  <button
                    onClick={exportLeadsCSV}
                    className="text-emerald-400 hover:text-emerald-300 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Leads CSV</span>
                  </button>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                    <span>Total Booked Demos</span>
                    <Calendar className="w-4 h-4 text-[#ff7700]" />
                  </div>
                  <div className="text-2xl font-black text-white">{bookings.length}</div>
                  <p className="text-[11px] text-emerald-400">100% Routed to thewalgroupinfo@gmail.com</p>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                    <span>Total AI Business Leads</span>
                    <User className="w-4 h-4 text-[#ff7700]" />
                  </div>
                  <div className="text-2xl font-black text-white">{leads.length}</div>
                  <p className="text-[11px] text-[#ff7700]">Hot & Warm Qualified Prospects</p>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                    <span>AI Chat Conversations</span>
                    <MessageSquare className="w-4 h-4 text-[#ff7700]" />
                  </div>
                  <div className="text-2xl font-black text-white">{transcripts.length}</div>
                  <p className="text-[11px] text-blue-400">24/7 Contextual Interactions</p>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                    <span>Executive Email Delivery</span>
                    <Mail className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400">Operational</div>
                  <p className="text-[11px] text-slate-400">thewalgroupinfo@gmail.com</p>
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

      <WorkspaceHub
        isOpen={workspaceHubOpen}
        onClose={() => setWorkspaceHubOpen(false)}
        leadsForExport={leads}
        prefillEmail={workspacePrefillEmail}
      />
    </AnimatePresence>
  );
};
