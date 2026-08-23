import React, { useState } from 'react';
import { 
  LifeBuoy, 
  Search, 
  Trash2, 
  Building2, 
  Phone, 
  Mail, 
  Download, 
  Filter, 
  Eye, 
  X,
  MessageSquare,
  Clock,
  Send,
  User,
  Shield,
  Tag
} from 'lucide-react';
import { updateTicketInSupabase, deleteTicketFromSupabase } from '../../lib/supabase';

export interface TicketRecord {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  department: string;
  subject: string;
  priority: string;
  message: string;
  status: string;
  messages?: any[];
  created_at?: string;
}

interface TicketsViewProps {
  tickets: TicketRecord[];
  loading: boolean;
  onRefresh: () => void;
}

export const AdminTicketsView: React.FC<TicketsViewProps> = ({
  tickets,
  loading,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState<TicketRecord | null>(null);
  const [replyText, setReplyText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = tickets.filter((t) => {
    const matchesSearch = 
      (t.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.department || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || (t.status || 'Open') === statusFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setActionLoading(true);
    await updateTicketInSupabase(id, { status: newStatus });
    setActionLoading(false);
    onRefresh();
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyText.trim()) return;
    setActionLoading(true);

    const now = new Date().toLocaleString();
    const existingMessages = Array.isArray(selectedTicket.messages) ? [...selectedTicket.messages] : [];
    
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'agent',
      senderName: 'Wal Group Administrator',
      text: replyText.trim(),
      timestamp: now
    };

    existingMessages.push(newMsg);

    await updateTicketInSupabase(selectedTicket.id, {
      messages: existingMessages,
      status: 'In Progress'
    });

    setActionLoading(false);
    setSelectedTicket({ ...selectedTicket, messages: existingMessages, status: 'In Progress' });
    setReplyText('');
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this ticket from Supabase?')) return;
    setActionLoading(true);
    await deleteTicketFromSupabase(id);
    setActionLoading(false);
    if (selectedTicket?.id === id) setSelectedTicket(null);
    onRefresh();
  };

  const exportCSV = () => {
    if (tickets.length === 0) return;
    const headers = ['Ticket ID', 'Client Name', 'Email', 'Company', 'Department', 'Subject', 'Priority', 'Status', 'Date'];
    const rows = tickets.map(t => [
      t.id,
      `"${(t.full_name || '').replace(/"/g, '""')}"`,
      t.email,
      `"${(t.company_name || '').replace(/"/g, '""')}"`,
      `"${(t.department || '').replace(/"/g, '""')}"`,
      `"${(t.subject || '').replace(/"/g, '""')}"`,
      t.priority || 'Medium',
      t.status || 'Open',
      t.created_at || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wal_group_tickets_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tickets by ID, name, email, department, subject..."
            className="w-full pl-10 pr-4 py-2 bg-[#09101d] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff7700]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#09101d] border border-white/10 text-xs text-slate-300">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-white focus:outline-none text-xs cursor-pointer"
            >
              <option value="All" className="bg-[#09101d]">All Priorities</option>
              <option value="High" className="bg-[#09101d]">High</option>
              <option value="Medium" className="bg-[#09101d]">Medium</option>
              <option value="Low" className="bg-[#09101d]">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#09101d] border border-white/10 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-white focus:outline-none text-xs cursor-pointer"
            >
              <option value="All" className="bg-[#09101d]">All Statuses</option>
              <option value="Open" className="bg-[#09101d]">Open</option>
              <option value="In Progress" className="bg-[#09101d]">In Progress</option>
              <option value="On Hold" className="bg-[#09101d]">On Hold</option>
              <option value="Resolved" className="bg-[#09101d]">Resolved</option>
              <option value="Closed" className="bg-[#09101d]">Closed</option>
            </select>
          </div>

          <button
            onClick={exportCSV}
            disabled={tickets.length === 0}
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
            <span className="text-xs text-slate-400 font-medium">Loading support tickets from Supabase...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            <LifeBuoy className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-slate-400">No support tickets found.</p>
            <p className="text-[11px] text-slate-500 mt-1">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Support tickets raised via the Support Center will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-black/40 border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Ticket ID & Subject</th>
                  <th className="py-3.5 px-4">Client Contact</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Logged</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                {filtered.map((item) => {
                  const statusColors: Record<string, string> = {
                    Open: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                    'In Progress': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                    'On Hold': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                    Resolved: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                    Closed: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
                  };

                  const priorityColors: Record<string, string> = {
                    High: 'bg-red-500/10 text-red-400 border-red-500/20',
                    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                    Low: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
                  };

                  return (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-amber-300 font-bold text-[11px]">{item.id}</div>
                        <div className="font-bold text-white max-w-xs truncate">{item.subject}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-200">{item.full_name}</div>
                        <a href={`mailto:${item.email}`} className="text-slate-400 hover:text-[#ff7700] text-[11px]">
                          {item.email}
                        </a>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-[11px]">
                          {item.department || 'Support'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${priorityColors[item.priority] || priorityColors.Medium}`}>
                          {item.priority || 'Medium'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={item.status || 'Open'}
                          onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-black/40 focus:outline-none cursor-pointer ${statusColors[item.status || 'Open'] || statusColors.Open}`}
                        >
                          <option value="Open" className="bg-[#09101d]">Open</option>
                          <option value="In Progress" className="bg-[#09101d]">In Progress</option>
                          <option value="On Hold" className="bg-[#09101d]">On Hold</option>
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
                            onClick={() => setSelectedTicket(item)}
                            title="Open Thread"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            title="Delete Ticket"
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

      {/* Modal Detail & Thread View */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0b1220] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-amber-300 font-bold text-xs bg-amber-500/10 px-2 py-0.5 rounded">
                    {selectedTicket.id}
                  </span>
                  <span className="text-xs text-slate-400">&bull; {selectedTicket.department}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{selectedTicket.subject}</h3>
              </div>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Thread */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-2 custom-scrollbar">
              {/* Original Message */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-slate-200">{selectedTicket.full_name} ({selectedTicket.email})</span>
                  <span className="text-[10px] font-mono">{selectedTicket.created_at ? new Date(selectedTicket.created_at).toLocaleString() : ''}</span>
                </div>
                <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {selectedTicket.message}
                </p>
              </div>

              {/* Replies */}
              {Array.isArray(selectedTicket.messages) && selectedTicket.messages.map((m: any, idx: number) => {
                const isAgent = m.sender === 'agent';
                return (
                  <div 
                    key={m.id || idx}
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                      isAgent 
                        ? 'bg-[#ff7700]/10 border-[#ff7700]/30 ml-6 text-slate-100' 
                        : 'bg-black/40 border-white/10 mr-6 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className={`font-bold ${isAgent ? 'text-amber-300' : 'text-slate-300'}`}>
                        {m.senderName || (isAgent ? 'Wal Group Agent' : selectedTicket.full_name)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{m.timestamp}</span>
                    </div>
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                );
              })}
            </div>

            {/* Reply Input Area */}
            <div className="pt-3 border-t border-white/10 space-y-2 shrink-0">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type response to client... (saves in Supabase tickets thread)"
                rows={2}
                className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff7700] resize-none"
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || actionLoading}
                  className="px-4 py-2 rounded-xl bg-[#ff7700] hover:bg-[#ff8811] text-black font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Ticket Reply</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
