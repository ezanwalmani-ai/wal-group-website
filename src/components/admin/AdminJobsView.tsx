import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Trash2, 
  Building2, 
  Phone, 
  Mail, 
  Download, 
  Filter, 
  Eye, 
  X,
  FileText,
  ExternalLink,
  MapPin,
  Linkedin,
  DollarSign,
  Clock
} from 'lucide-react';
import { updateJobAppInSupabase, deleteJobAppFromSupabase } from '../../lib/supabase';

export interface JobAppRecord {
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
  notes?: string;
}

interface JobsViewProps {
  jobs: JobAppRecord[];
  loading: boolean;
  onRefresh: () => void;
}

export const AdminJobsView: React.FC<JobsViewProps> = ({
  jobs,
  loading,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [positionFilter, setPositionFilter] = useState('All');
  const [selectedJob, setSelectedJob] = useState<JobAppRecord | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const positions = Array.from(new Set(jobs.map(j => j.position).filter(Boolean)));

  const filtered = jobs.filter((j) => {
    const matchesSearch = 
      (j.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (j.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (j.position || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (j.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (j.current_company || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || (j.status || 'New') === statusFilter;
    const matchesPosition = positionFilter === 'All' || j.position === positionFilter;
    return matchesSearch && matchesStatus && matchesPosition;
  });

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setActionLoading(true);
    await updateJobAppInSupabase(id, { status: newStatus });
    setActionLoading(false);
    onRefresh();
    if (selectedJob && selectedJob.id === id) {
      setSelectedJob({ ...selectedJob, status: newStatus });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job application from Supabase?')) return;
    setActionLoading(true);
    await deleteJobAppFromSupabase(id);
    setActionLoading(false);
    if (selectedJob?.id === id) setSelectedJob(null);
    onRefresh();
  };

  const exportCSV = () => {
    if (jobs.length === 0) return;
    const headers = ['ID', 'Candidate Name', 'Position', 'Email', 'Phone', 'Location', 'Experience', 'Current Company', 'Notice Period', 'Expected Salary', 'Resume URL', 'Status', 'Date Applied'];
    const rows = jobs.map(j => [
      j.id,
      `"${(j.full_name || '').replace(/"/g, '""')}"`,
      `"${(j.position || '').replace(/"/g, '""')}"`,
      j.email,
      j.phone || '',
      `"${(j.location || '').replace(/"/g, '""')}"`,
      j.experience_years ?? '',
      `"${(j.current_company || '').replace(/"/g, '""')}"`,
      `"${(j.notice_period || '').replace(/"/g, '""')}"`,
      `"${(j.expected_salary || '').replace(/"/g, '""')}"`,
      `"${(j.resume_url || j.resume_file_name || '').replace(/"/g, '""')}"`,
      j.status || 'New',
      j.applied_at
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wal_group_job_applications_${new Date().toISOString().slice(0, 10)}.csv`);
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
            placeholder="Search candidates by name, position, email, company, or location..."
            className="w-full pl-10 pr-4 py-2 bg-[#09101d] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff7700]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {positions.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#09101d] border border-white/10 text-xs text-slate-300">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="bg-transparent text-white focus:outline-none text-xs cursor-pointer max-w-[140px]"
              >
                <option value="All" className="bg-[#09101d]">All Roles</option>
                {positions.map(p => (
                  <option key={p} value={p} className="bg-[#09101d]">{p}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#09101d] border border-white/10 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-white focus:outline-none text-xs cursor-pointer"
            >
              <option value="All" className="bg-[#09101d]">All Statuses</option>
              <option value="New" className="bg-[#09101d]">New</option>
              <option value="Reviewed" className="bg-[#09101d]">Reviewed</option>
              <option value="Interviewing" className="bg-[#09101d]">Interviewing</option>
              <option value="Hired" className="bg-[#09101d]">Hired</option>
              <option value="Rejected" className="bg-[#09101d]">Rejected</option>
            </select>
          </div>

          <button
            onClick={exportCSV}
            disabled={jobs.length === 0}
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
            <span className="text-xs text-slate-400 font-medium">Loading candidate applications from Supabase...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            <Briefcase className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-slate-400">No job applications found.</p>
            <p className="text-[11px] text-slate-500 mt-1">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Applications submitted via the Careers portal will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-black/40 border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Candidate</th>
                  <th className="py-3.5 px-4">Role & Experience</th>
                  <th className="py-3.5 px-4">Location & Company</th>
                  <th className="py-3.5 px-4">Resume</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Applied</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                {filtered.map((item) => {
                  const statusColors: Record<string, string> = {
                    New: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                    Reviewed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                    Interviewing: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                    Hired: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                    Rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
                  };

                  return (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{item.full_name}</div>
                        <div className="flex items-center gap-2 text-[11px]">
                          <a href={`mailto:${item.email}`} className="text-slate-400 hover:text-[#ff7700]">
                            {item.email}
                          </a>
                          <span className="text-slate-500">&bull; {item.phone}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-200">{item.position}</div>
                        <div className="text-slate-400 text-[11px]">
                          {item.experience_years ? `${item.experience_years} years exp` : 'Entry / Intermediate'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-200">{item.location || 'Remote'}</div>
                        <div className="text-slate-500 text-[11px]">{item.current_company || 'Independent'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {item.resume_url ? (
                          <a
                            href={item.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300 text-[11px] font-semibold transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Resume</span>
                          </a>
                        ) : item.resume_file_name ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                            <FileText className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[120px]">{item.resume_file_name}</span>
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px]">No file attached</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={item.status || 'New'}
                          onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-black/40 focus:outline-none cursor-pointer ${statusColors[item.status || 'New'] || statusColors.New}`}
                        >
                          <option value="New" className="bg-[#09101d]">New</option>
                          <option value="Reviewed" className="bg-[#09101d]">Reviewed</option>
                          <option value="Interviewing" className="bg-[#09101d]">Interviewing</option>
                          <option value="Hired" className="bg-[#09101d]">Hired</option>
                          <option value="Rejected" className="bg-[#09101d]">Rejected</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {item.applied_at ? new Date(item.applied_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedJob(item)}
                            title="View Full Profile"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            title="Delete Application"
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
      {selectedJob && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0b1220] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white">{selectedJob.full_name}</h3>
                <span className="text-xs text-[#ff7700] font-semibold">{selectedJob.position}</span>
              </div>
              <button 
                onClick={() => setSelectedJob(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-black/40 p-3.5 rounded-xl border border-white/5">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Email Address</span>
                <a href={`mailto:${selectedJob.email}`} className="text-[#ff7700] hover:underline font-mono">
                  {selectedJob.email}
                </a>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Phone Number</span>
                <span className="text-slate-200 font-mono">{selectedJob.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Location</span>
                <span className="text-slate-300">{selectedJob.location || 'Remote'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Experience</span>
                <span className="text-slate-300">{selectedJob.experience_years ? `${selectedJob.experience_years} Years` : 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Current Employer</span>
                <span className="text-slate-300">{selectedJob.current_company || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Notice Period</span>
                <span className="text-slate-300">{selectedJob.notice_period || 'Immediate'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Expected Compensation</span>
                <span className="text-slate-300">{selectedJob.expected_salary || 'Negotiable'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">LinkedIn Profile</span>
                {selectedJob.linkedin_url ? (
                  <a href={selectedJob.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1">
                    <span>Profile Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : <span className="text-slate-500">Not provided</span>}
              </div>
            </div>

            {/* Resume Button */}
            {selectedJob.resume_url && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300">Resume Stored in Supabase</span>
                </div>
                <a
                  href={selectedJob.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / View</span>
                </a>
              </div>
            )}

            {selectedJob.cover_letter && (
              <div>
                <span className="text-slate-400 block text-xs font-bold uppercase mb-2">Cover Letter / Note</span>
                <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {selectedJob.cover_letter}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <a
                href={`mailto:${selectedJob.email}?subject=Wal Group Job Application: ${encodeURIComponent(selectedJob.position)}`}
                className="px-4 py-2 rounded-xl bg-[#ff7700] hover:bg-[#ff8811] text-black font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Candidate</span>
              </a>

              <button
                onClick={() => setSelectedJob(null)}
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
