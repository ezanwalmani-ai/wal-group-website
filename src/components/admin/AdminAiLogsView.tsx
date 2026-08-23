import React, { useState } from 'react';
import { 
  Bot, 
  Search, 
  Trash2, 
  Mail, 
  Phone, 
  Download, 
  Filter, 
  Eye, 
  X,
  MessageSquare,
  Clock,
  Sparkles,
  User,
  Layers
} from 'lucide-react';

export interface AiLogRecord {
  id: string;
  session_id: string;
  provider: string;
  model?: string;
  user_message: string;
  ai_response: string;
  lead_email?: string;
  lead_phone?: string;
  created_at: string;
}

interface AiLogsViewProps {
  logs: AiLogRecord[];
  loading: boolean;
  onRefresh: () => void;
}

export const AdminAiLogsView: React.FC<AiLogsViewProps> = ({
  logs,
  loading,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<AiLogRecord | null>(null);

  const filtered = logs.filter((l) => {
    return (
      (l.user_message || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.ai_response || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.session_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.lead_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.lead_phone || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const exportCSV = () => {
    if (logs.length === 0) return;
    const headers = ['Log ID', 'Session ID', 'User Message', 'AI Response', 'Captured Email', 'Captured Phone', 'Timestamp'];
    const rows = logs.map(l => [
      l.id,
      l.session_id,
      `"${(l.user_message || '').replace(/"/g, '""')}"`,
      `"${(l.ai_response || '').replace(/"/g, '""')}"`,
      l.lead_email || '',
      l.lead_phone || '',
      l.created_at
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wal_group_ai_transcripts_${new Date().toISOString().slice(0, 10)}.csv`);
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
            placeholder="Search AI conversation logs by message, session ID, or captured lead info..."
            className="w-full pl-10 pr-4 py-2 bg-[#09101d] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff7700]"
          />
        </div>

        <button
          onClick={exportCSV}
          disabled={logs.length === 0}
          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Logs</span>
        </button>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl bg-[#09101d] border border-white/10 overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-7 h-7 border-2 border-[#ff7700] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-400 font-medium">Loading AI conversation logs from Supabase...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            <Bot className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-slate-400">No AI transcripts logged yet.</p>
            <p className="text-[11px] text-slate-500 mt-1">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Live interactions with the Wal Group AI Consultant will be recorded here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-black/40 border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Session ID</th>
                  <th className="py-3.5 px-4">User Query</th>
                  <th className="py-3.5 px-4">AI Response Summary</th>
                  <th className="py-3.5 px-4">Captured Lead</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-amber-300">
                      {item.session_id ? item.session_id.slice(0, 12) + '...' : 'Direct Session'}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs font-bold text-white truncate">
                      {item.user_message}
                    </td>
                    <td className="py-3.5 px-4 max-w-md text-slate-400 truncate text-[11px]">
                      {item.ai_response}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.lead_email ? (
                        <div className="text-[11px]">
                          <span className="text-[#ff7700] font-semibold">{item.lead_email}</span>
                          {item.lead_phone && <span className="text-slate-500 block">{item.lead_phone}</span>}
                        </div>
                      ) : (
                        <span className="text-slate-600 text-[11px]">Anonymous</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(item)}
                        title="View Full Exchange"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Detail View */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0b1220] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white">AI Conversation Turn</h3>
                <span className="text-xs text-slate-400 font-mono">Session: {selectedLog.session_id}</span>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Captured Lead banner */}
            {selectedLog.lead_email && (
              <div className="p-3 rounded-xl bg-[#ff7700]/10 border border-[#ff7700]/20 flex items-center gap-3 text-xs">
                <Sparkles className="w-4 h-4 text-[#ff7700] shrink-0" />
                <div>
                  <span className="font-bold text-amber-300">Lead Contact Info Extracted:</span>
                  <div className="text-slate-300 mt-0.5 font-mono">{selectedLog.lead_email} {selectedLog.lead_phone && `• ${selectedLog.lead_phone}`}</div>
                </div>
              </div>
            )}

            {/* User prompt */}
            <div>
              <span className="text-slate-400 block text-xs font-bold uppercase mb-1.5">User Prompt</span>
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white leading-relaxed whitespace-pre-wrap">
                {selectedLog.user_message}
              </div>
            </div>

            {/* AI response */}
            <div>
              <span className="text-slate-400 block text-xs font-bold uppercase mb-1.5">AI Consultant Response</span>
              <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {selectedLog.ai_response}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-white/10">
              <button
                onClick={() => setSelectedLog(null)}
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
