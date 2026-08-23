import React, { useState } from 'react';
import { 
  Mail, 
  Search, 
  Trash2, 
  Building2, 
  Phone, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Download,
  Filter,
  Eye,
  X
} from 'lucide-react';
import { updateContactInSupabase, deleteContactFromSupabase } from '../../lib/supabase';

export interface ContactRecord {
  id?: string;
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  subject: string;
  message: string;
  status?: string;
  notes?: string;
  created_at: string;
  target_email?: string;
}

interface ContactsViewProps {
  contacts: ContactRecord[];
  loading: boolean;
  onRefresh: () => void;
}

export const AdminContactsView: React.FC<ContactsViewProps> = ({
  contacts,
  loading,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedContact, setSelectedContact] = useState<ContactRecord | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = contacts.filter((c) => {
    const matchesSearch = 
      (c.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.subject || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || (c.status || 'New') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setActionLoading(true);
    await updateContactInSupabase(id, { status: newStatus });
    setActionLoading(false);
    onRefresh();
    if (selectedContact && selectedContact.id === id) {
      setSelectedContact({ ...selectedContact, status: newStatus });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this contact submission from Supabase?')) return;
    setActionLoading(true);
    await deleteContactFromSupabase(id);
    setActionLoading(false);
    if (selectedContact?.id === id) setSelectedContact(null);
    onRefresh();
  };

  const exportCSV = () => {
    if (contacts.length === 0) return;
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Company', 'Subject', 'Message', 'Status', 'Date'];
    const rows = contacts.map(c => [
      c.id || '',
      `"${(c.full_name || '').replace(/"/g, '""')}"`,
      c.email,
      c.phone || '',
      `"${(c.company_name || '').replace(/"/g, '""')}"`,
      `"${(c.subject || '').replace(/"/g, '""')}"`,
      `"${(c.message || '').replace(/"/g, '""')}"`,
      c.status || 'New',
      c.created_at
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wal_group_contacts_${new Date().toISOString().slice(0, 10)}.csv`);
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
            placeholder="Search contacts by name, email, company, subject..."
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
              <option value="In Progress" className="bg-[#09101d]">In Progress</option>
              <option value="Resolved" className="bg-[#09101d]">Resolved</option>
              <option value="Closed" className="bg-[#09101d]">Closed</option>
            </select>
          </div>

          <button
            onClick={exportCSV}
            disabled={contacts.length === 0}
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
            <span className="text-xs text-slate-400 font-medium">Loading contact submissions from Supabase...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            <Mail className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-slate-400">No contact submissions found.</p>
            <p className="text-[11px] text-slate-500 mt-1">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Inquiries submitted via the Contact page will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-black/40 border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Company & Phone</th>
                  <th className="py-3.5 px-4">Subject & Message</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                {filtered.map((item) => {
                  const statusColors: Record<string, string> = {
                    New: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                    'In Progress': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                    Resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                    Closed: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
                  };

                  return (
                    <tr key={item.id || item.email + item.created_at} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{item.full_name}</div>
                        <a href={`mailto:${item.email}`} className="text-slate-400 hover:text-[#ff7700] text-[11px]">
                          {item.email}
                        </a>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-200">{item.company_name || 'N/A'}</div>
                        <div className="text-slate-500 text-[11px]">{item.phone || 'N/A'}</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-slate-200 truncate">{item.subject}</div>
                        <div className="text-slate-400 text-[11px] truncate">{item.message}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={item.status || 'New'}
                          onChange={(e) => item.id && handleUpdateStatus(item.id, e.target.value)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-black/40 focus:outline-none cursor-pointer ${statusColors[item.status || 'New'] || statusColors.New}`}
                        >
                          <option value="New" className="bg-[#09101d]">New</option>
                          <option value="In Progress" className="bg-[#09101d]">In Progress</option>
                          <option value="Resolved" className="bg-[#09101d]">Resolved</option>
                          <option value="Closed" className="bg-[#09101d]">Closed</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedContact(item)}
                            title="View Full Message"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {item.id && (
                            <button
                              onClick={() => handleDelete(item.id!)}
                              title="Delete Submission"
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
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
      {selectedContact && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0b1220] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white">{selectedContact.subject}</h3>
                <span className="text-xs text-slate-400">From {selectedContact.full_name} ({selectedContact.company_name || 'Individual'})</span>
              </div>
              <button 
                onClick={() => setSelectedContact(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-black/40 p-3.5 rounded-xl border border-white/5">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Email Address</span>
                <a href={`mailto:${selectedContact.email}`} className="text-[#ff7700] hover:underline font-mono">
                  {selectedContact.email}
                </a>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Phone Number</span>
                <span className="text-slate-200 font-mono">{selectedContact.phone || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Target Route</span>
                <span className="text-slate-400">{selectedContact.target_email || 'thewalgroupinfo@gmail.com'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Timestamp</span>
                <span className="text-slate-400 font-mono">{selectedContact.created_at ? new Date(selectedContact.created_at).toLocaleString() : 'N/A'}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-xs font-bold uppercase mb-2">Message Body</span>
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {selectedContact.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <a
                href={`mailto:${selectedContact.email}?subject=Re: ${encodeURIComponent(selectedContact.subject)}`}
                className="px-4 py-2 rounded-xl bg-[#ff7700] hover:bg-[#ff8811] text-black font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Reply via Email</span>
              </a>

              <button
                onClick={() => setSelectedContact(null)}
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
