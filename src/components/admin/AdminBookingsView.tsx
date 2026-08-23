import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Trash2, 
  Building2, 
  Phone, 
  Mail, 
  Download, 
  Filter, 
  Eye, 
  X,
  Video,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { updateBookingInSupabase, deleteBookingFromSupabase } from '../../lib/supabase';

export interface BookingRecord {
  id: string;
  company_name: string;
  industry?: string;
  country?: string;
  website?: string;
  company_size?: string;
  full_name: string;
  email: string;
  phone: string;
  job_title?: string;
  linkedin?: string;
  selected_services?: any;
  preferred_date: string;
  preferred_time: string;
  timezone?: string;
  meeting_type?: string;
  project_description?: string;
  current_challenges?: string;
  expected_team_size?: string;
  budget?: string;
  timeline?: string;
  status?: string;
  meet_link?: string;
  google_calendar_url?: string;
  notes?: string;
  created_at?: string;
}

interface BookingsViewProps {
  bookings: BookingRecord[];
  loading: boolean;
  onRefresh: () => void;
}

export const AdminBookingsView: React.FC<BookingsViewProps> = ({
  bookings,
  loading,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = bookings.filter((b) => {
    const matchesSearch = 
      (b.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.preferred_date || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || (b.status || 'New') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setActionLoading(true);
    await updateBookingInSupabase(id, { status: newStatus });
    setActionLoading(false);
    onRefresh();
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking({ ...selectedBooking, status: newStatus });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this booking from Supabase?')) return;
    setActionLoading(true);
    await deleteBookingFromSupabase(id);
    setActionLoading(false);
    if (selectedBooking?.id === id) setSelectedBooking(null);
    onRefresh();
  };

  const exportCSV = () => {
    if (bookings.length === 0) return;
    const headers = ['Booking ID', 'Company', 'Contact Name', 'Email', 'Phone', 'Date', 'Time', 'Meeting Link', 'Status', 'Created At'];
    const rows = bookings.map(b => [
      b.id,
      `"${(b.company_name || '').replace(/"/g, '""')}"`,
      `"${(b.full_name || '').replace(/"/g, '""')}"`,
      b.email,
      b.phone,
      b.preferred_date,
      b.preferred_time,
      b.meet_link || '',
      b.status || 'New',
      b.created_at || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wal_group_bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search bookings by company, contact, email, or date..."
            className="w-full pl-10 pr-4 py-2 bg-[#09101d] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff7700]"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#09101d] border border-white/10 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-white focus:outline-none text-xs cursor-pointer"
            >
              <option value="All" className="bg-[#09101d]">All Statuses</option>
              <option value="New" className="bg-[#09101d]">New</option>
              <option value="Pending" className="bg-[#09101d]">Pending</option>
              <option value="Confirmed" className="bg-[#09101d]">Confirmed</option>
              <option value="Completed" className="bg-[#09101d]">Completed</option>
              <option value="Cancelled" className="bg-[#09101d]">Cancelled</option>
            </select>
          </div>

          <button
            onClick={exportCSV}
            disabled={bookings.length === 0}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl bg-[#09101d] border border-white/10 overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-7 h-7 border-2 border-[#ff7700] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-400 font-medium">Loading discovery call bookings from Supabase...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-slate-400">No discovery bookings found.</p>
            <p className="text-[11px] text-slate-500 mt-1">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Bookings scheduled through the Discovery Call flow will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-black/40 border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Company & Client</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Meeting Schedule</th>
                  <th className="py-3.5 px-4">Video Link</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Booked</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                {filtered.map((item) => {
                  const statusColors: Record<string, string> = {
                    New: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                    Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                    Confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                    Completed: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                    Cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
                  };

                  return (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{item.company_name}</div>
                        <div className="text-slate-400 text-[11px]">{item.full_name} &bull; {item.job_title || 'Executive'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <a href={`mailto:${item.email}`} className="text-slate-300 hover:text-[#ff7700] block text-[11px]">
                          {item.email}
                        </a>
                        <div className="text-slate-500 text-[11px]">{item.phone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-amber-300 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>{item.preferred_date}</span>
                        </div>
                        <div className="text-slate-400 text-[11px] font-mono">{item.preferred_time} ({item.timezone || 'EST'})</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {item.meet_link ? (
                          <a
                            href={item.meet_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:text-blue-300 text-[11px] font-semibold"
                          >
                            <Video className="w-3 h-3" />
                            <span>Launch Meet</span>
                          </a>
                        ) : (
                          <span className="text-slate-600 text-[11px]">Google Meet</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={item.status || 'New'}
                          onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-black/40 focus:outline-none cursor-pointer ${statusColors[item.status || 'New'] || statusColors.New}`}
                        >
                          <option value="New" className="bg-[#09101d]">New</option>
                          <option value="Pending" className="bg-[#09101d]">Pending</option>
                          <option value="Confirmed" className="bg-[#09101d]">Confirmed</option>
                          <option value="Completed" className="bg-[#09101d]">Completed</option>
                          <option value="Cancelled" className="bg-[#09101d]">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedBooking(item)}
                            title="View Booking Details"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            title="Delete Booking"
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Detail View */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0b1220] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white">{selectedBooking.company_name}</h3>
                <span className="text-xs text-slate-400">Scheduled by {selectedBooking.full_name} ({selectedBooking.job_title || 'Lead'})</span>
              </div>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-black/40 p-3.5 rounded-xl border border-white/5">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Email</span>
                <a href={`mailto:${selectedBooking.email}`} className="text-[#ff7700] hover:underline font-mono">
                  {selectedBooking.email}
                </a>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Phone</span>
                <span className="text-slate-200 font-mono">{selectedBooking.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Preferred Schedule</span>
                <span className="text-amber-300 font-bold">{selectedBooking.preferred_date} @ {selectedBooking.preferred_time}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Timezone</span>
                <span className="text-slate-300">{selectedBooking.timezone || 'America/New_York'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Industry / Country</span>
                <span className="text-slate-300">{selectedBooking.industry || 'Logistics & Tech'} ({selectedBooking.country || 'USA'})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Team / Fleet Size</span>
                <span className="text-slate-300">{selectedBooking.company_size || selectedBooking.expected_team_size || 'N/A'}</span>
              </div>
            </div>

            {selectedBooking.meet_link && (
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-xs font-bold text-blue-300">Google Meet Video Room</div>
                    <div className="text-[11px] text-blue-400/80 font-mono truncate max-w-xs">{selectedBooking.meet_link}</div>
                  </div>
                </div>
                <a
                  href={selectedBooking.meet_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-black text-xs font-bold transition-colors"
                >
                  Join
                </a>
              </div>
            )}

            {selectedBooking.project_description && (
              <div>
                <span className="text-slate-400 block text-xs font-bold uppercase mb-2">Project Scope / Challenge</span>
                <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {selectedBooking.project_description}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <a
                href={`mailto:${selectedBooking.email}?subject=Confirmation: Wal Group Discovery Call`}
                className="px-4 py-2 rounded-xl bg-[#ff7700] hover:bg-[#ff8811] text-black font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Client</span>
              </a>

              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
