import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  Trash2, 
  Building2, 
  Phone, 
  Mail, 
  Download, 
  Filter, 
  Eye, 
  X,
  ExternalLink,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Tag,
  Layers,
  Palette,
  FileText,
  MessageSquare,
  Lock,
  RefreshCw
} from 'lucide-react';
import { WebsiteProjectRequestRecord, updateWebsiteProjectRequestStatusInSupabase, deleteWebsiteProjectRequestFromSupabase } from '../../lib/supabase';

interface WebsiteProjectsViewProps {
  requests: WebsiteProjectRequestRecord[];
  loading: boolean;
  onRefresh: () => void;
}

export const ADMIN_PROJECT_STATUSES = [
  'New',
  'Reviewing',
  'Contacted',
  'Proposal Sent',
  'In Progress',
  'Completed',
  'Closed'
] as const;

export const AdminWebsiteProjectsView: React.FC<WebsiteProjectsViewProps> = ({
  requests,
  loading,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState<WebsiteProjectRequestRecord | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusSuccessMsg, setStatusSuccessMsg] = useState<string | null>(null);

  const filtered = requests.filter((r) => {
    const matchesSearch = 
      (r.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.business_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.package_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.industry || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.id || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || (r.status || 'New') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setActionLoading(true);
    setStatusSuccessMsg(null);
    const res = await updateWebsiteProjectRequestStatusInSupabase(id, newStatus);
    setActionLoading(false);

    if (res.success) {
      setStatusSuccessMsg(`Status updated to "${newStatus}"`);
      setTimeout(() => setStatusSuccessMsg(null), 3500);
      onRefresh();
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest({ ...selectedRequest, status: newStatus });
      }
    } else {
      alert(`Could not update status: ${res.error || 'Server error'}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this website project request? This action cannot be undone.')) return;
    setActionLoading(true);
    await deleteWebsiteProjectRequestFromSupabase(id);
    setActionLoading(false);
    if (selectedRequest?.id === id) setSelectedRequest(null);
    onRefresh();
  };

  const exportCSV = () => {
    if (requests.length === 0) return;
    const headers = [
      'Request ID',
      'Date',
      'Customer Name',
      'Business Name',
      'Package',
      'Price',
      'Industry',
      'Email',
      'Phone',
      'Country',
      'City/State',
      'Status',
      'Timeline',
      'Existing Website',
      'Current Website URL',
      'Logo',
      'Content',
      'Design Style',
      'Goals',
      'Pages',
      'Inspiration',
      'Specific Requirements'
    ];

    const rows = requests.map(r => [
      r.id,
      r.created_at || '',
      `"${(r.full_name || '').replace(/"/g, '""')}"`,
      `"${(r.business_name || '').replace(/"/g, '""')}"`,
      `"${(r.package_name || '').replace(/"/g, '""')}"`,
      `"${(r.package_price || '').replace(/"/g, '""')}"`,
      `"${(r.industry || '').replace(/"/g, '""')}"`,
      r.email || '',
      r.phone || '',
      `"${(r.country || '').replace(/"/g, '""')}"`,
      `"${(r.city_state || '').replace(/"/g, '""')}"`,
      r.status || 'New',
      `"${(r.project_timeline || '').replace(/"/g, '""')}"`,
      r.has_existing_website ? 'Yes' : 'No',
      `"${(r.current_website_url || '').replace(/"/g, '""')}"`,
      r.has_logo || '',
      r.has_content || '',
      `"${(r.design_style || '').replace(/"/g, '""')}"`,
      `"${(Array.isArray(r.website_goals) ? r.website_goals.join(', ') : '').replace(/"/g, '""')}"`,
      `"${(Array.isArray(r.required_pages) ? r.required_pages.join(', ') : '').replace(/"/g, '""')}"`,
      `"${(r.inspiration_url || '').replace(/"/g, '""')}"`,
      `"${(r.additional_requirements || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wal_groups_website_projects_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string = 'New') => {
    switch (status) {
      case 'New':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">New</span>;
      case 'Reviewing':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">Reviewing</span>;
      case 'Contacted':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">Contacted</span>;
      case 'Proposal Sent':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">Proposal Sent</span>;
      case 'In Progress':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ff6600]/20 text-[#ff8533] border border-[#ff6600]/40">In Progress</span>;
      case 'Completed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Completed</span>;
      case 'Closed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-500/20 text-slate-300 border border-slate-500/40">Closed</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-500/20 text-slate-300 border border-slate-500/40">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-[#0a0f1d] p-4 rounded-2xl border border-white/10">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search customer, business, email, package..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#121929] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#ff6600]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#121929] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6600]"
            >
              <option value="All">All Statuses</option>
              {ADMIN_PROJECT_STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-3 py-2 bg-[#121929] hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Refresh database records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={exportCSV}
            disabled={requests.length === 0}
            className="px-3.5 py-2 bg-[#ff6600] hover:bg-[#e65c00] text-black rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-[#0a0f1d] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e1628] text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4 font-bold">Request ID</th>
                <th className="py-3.5 px-4 font-bold">Date</th>
                <th className="py-3.5 px-4 font-bold">Customer Name</th>
                <th className="py-3.5 px-4 font-bold">Business Name</th>
                <th className="py-3.5 px-4 font-bold">Package</th>
                <th className="py-3.5 px-4 font-bold">Industry</th>
                <th className="py-3.5 px-4 font-bold">Email</th>
                <th className="py-3.5 px-4 font-bold">Phone</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold">Timeline</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {loading && requests.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-[#ff6600]" />
                      <span>Loading website project requests...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <Globe className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-slate-300">No website project requests found</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {searchTerm || statusFilter !== 'All' 
                        ? 'Try clearing your search or status filter.'
                        : 'Submissions from the Website Project Form will appear here.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr 
                    key={r.id}
                    onClick={() => setSelectedRequest(r)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    {/* Request ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#ff8533] whitespace-nowrap">
                      {String(r.id).substring(0, 14)}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-400">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A'}
                    </td>

                    {/* Customer Name */}
                    <td className="py-3.5 px-4 font-semibold text-white whitespace-nowrap">
                      {r.full_name}
                    </td>

                    {/* Business Name */}
                    <td className="py-3.5 px-4 font-medium text-slate-200 whitespace-nowrap">
                      {r.business_name}
                    </td>

                    {/* Package */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-white block">{r.package_name}</span>
                      <span className="text-[10px] text-[#ff8533] font-semibold">{r.package_price}</span>
                    </td>

                    {/* Industry */}
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      {r.industry}
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      <a 
                        href={`mailto:${r.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-[#ff8533] transition-colors underline-offset-2 hover:underline"
                      >
                        {r.email}
                      </a>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      <a 
                        href={`tel:${r.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-[#ff8533] transition-colors"
                      >
                        {r.phone}
                      </a>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(r.status)}
                    </td>

                    {/* Timeline */}
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {r.project_timeline || 'Flexible'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedRequest(r)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="View Full Submission"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          title="Delete Request"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Status */}
        <div className="p-3.5 bg-[#0e1628] border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span>
            Showing <strong className="text-white">{filtered.length}</strong> of <strong className="text-white">{requests.length}</strong> website requests
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Supabase Live Sync</span>
          </span>
        </div>
      </div>

      {/* =====================================================================
          DETAIL MODAL: COMPLETE WEBSITE SUBMISSION
          Clicking any request opens this complete view
          ===================================================================== */}
      {selectedRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedRequest(null)}
          />

          <div 
            className="relative z-10 w-full max-w-3xl bg-[#0a0f1d] border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[92vh] flex flex-col text-slate-200 overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#ff6600] uppercase tracking-wider">
                    WEBSITE PROJECT ENQUIRY
                  </span>
                  <span className="font-mono text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                    {selectedRequest.id}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {selectedRequest.business_name}
                </h3>
                <p className="text-xs text-slate-400">
                  Submitted by <strong className="text-white">{selectedRequest.full_name}</strong> on {selectedRequest.created_at ? new Date(selectedRequest.created_at).toLocaleString() : 'N/A'}
                </p>
              </div>

              <button
                onClick={() => setSelectedRequest(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status Update Strip (Requirement 8: Status Management) */}
            <div className="py-3 px-4 my-4 rounded-2xl bg-[#121929] border border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300">Status:</span>
                {getStatusBadge(selectedRequest.status)}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Update Status:</span>
                <select
                  value={selectedRequest.status || 'New'}
                  disabled={actionLoading}
                  onChange={(e) => handleUpdateStatus(selectedRequest.id, e.target.value)}
                  className="bg-[#0a0f1d] border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-[#ff6600] cursor-pointer"
                >
                  {ADMIN_PROJECT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {statusSuccessMsg && (
                <div className="w-full text-xs text-emerald-400 font-semibold flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{statusSuccessMsg}</span>
                </div>
              )}
            </div>

            {/* Modal Body (Scrollable Details) */}
            <div className="overflow-y-auto space-y-6 flex-1 pr-1">
              
              {/* Package & Timeline Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Package</span>
                  <span className="text-base font-extrabold text-[#ff8533] mt-0.5 block">{selectedRequest.package_name}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Price</span>
                  <span className="text-base font-extrabold text-white mt-0.5 block">{selectedRequest.package_price}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Timeline</span>
                  <span className="text-base font-bold text-slate-200 mt-0.5 block">{selectedRequest.project_timeline || 'Flexible'}</span>
                </div>
              </div>

              {/* Customer & Business Profile */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#ff6600]" />
                  <span>Customer &amp; Business Profile</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Contact Person</span>
                    <span className="font-bold text-white text-sm">{selectedRequest.full_name}</span>
                  </div>

                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Business / Fleet</span>
                    <span className="font-bold text-white text-sm">{selectedRequest.business_name}</span>
                  </div>

                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Email Address</span>
                    <a href={`mailto:${selectedRequest.email}`} className="font-semibold text-[#ff8533] hover:underline">
                      {selectedRequest.email}
                    </a>
                  </div>

                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Phone / WhatsApp</span>
                    <a href={`tel:${selectedRequest.phone}`} className="font-semibold text-[#ff8533] hover:underline">
                      {selectedRequest.phone}
                    </a>
                  </div>

                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Country &amp; Region</span>
                    <span className="font-semibold text-slate-200">
                      {selectedRequest.city_state ? `${selectedRequest.city_state}, ` : ''}{selectedRequest.country}
                    </span>
                  </div>

                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Industry</span>
                    <span className="font-semibold text-slate-200">{selectedRequest.industry}</span>
                  </div>
                </div>

                {/* About Business description */}
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">About The Business</span>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedRequest.business_description}
                  </p>
                </div>
              </div>

              {/* Scope & Goals */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#ff6600]" />
                  <span>Website Goals &amp; Required Pages</span>
                </h4>

                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Primary Goals:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.isArray(selectedRequest.website_goals) && selectedRequest.website_goals.length > 0 ? (
                      selectedRequest.website_goals.map((g, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-200 font-medium">
                          {g}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">None specified</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Requested Pages:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.isArray(selectedRequest.required_pages) && selectedRequest.required_pages.length > 0 ? (
                      selectedRequest.required_pages.map((p, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-[#ff6600]/10 border border-[#ff6600]/25 text-[#ff8533] font-medium">
                          {p}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">Standard package pages</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Assets & Existing Materials */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#ff6600]" />
                  <span>Existing Website &amp; Brand Assets</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Has Existing Website</span>
                    <span className="font-bold text-white">
                      {selectedRequest.has_existing_website ? 'Yes' : 'No'}
                    </span>
                    {selectedRequest.current_website_url && (
                      <a 
                        href={selectedRequest.current_website_url.startsWith('http') ? selectedRequest.current_website_url : `https://${selectedRequest.current_website_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#ff8533] flex items-center gap-1 text-[11px] mt-1 hover:underline truncate"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{selectedRequest.current_website_url}</span>
                      </a>
                    )}
                  </div>

                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Has Business Logo</span>
                    <span className="font-bold text-white">{selectedRequest.has_logo || 'No'}</span>
                  </div>

                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Written Content &amp; Photos</span>
                    <span className="font-bold text-white">{selectedRequest.has_content || 'No'}</span>
                  </div>
                </div>
              </div>

              {/* Design & Inspiration */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#ff6600]" />
                  <span>Design Direction</span>
                </h4>

                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                  <span className="text-slate-400 block text-[10px]">Preferred Style</span>
                  <span className="font-bold text-white text-xs">{selectedRequest.design_style || 'Clean & Professional'}</span>
                </div>

                {selectedRequest.inspiration_url && (
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                    <span className="text-slate-400 block text-[10px]">Website Inspiration</span>
                    <span className="text-xs text-slate-200">{selectedRequest.inspiration_url}</span>
                  </div>
                )}

                {selectedRequest.additional_requirements && (
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                    <span className="text-slate-400 block text-[10px]">Additional Requirements</span>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {selectedRequest.additional_requirements}
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="pt-4 mt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => handleDelete(selectedRequest.id)}
                className="py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Request</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedRequest.email}?subject=${encodeURIComponent(`WAL GROUPS: Your ${selectedRequest.package_name} Project (${selectedRequest.id})`)}&body=${encodeURIComponent(`Hi ${selectedRequest.full_name},\n\nThank you for reaching out to WAL GROUPS regarding your ${selectedRequest.package_name}.\n\n`)}`}
                  className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Client</span>
                </a>

                <a
                  href={`https://wa.me/${selectedRequest.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedRequest.full_name}, this is the WAL GROUPS Web Engineering team regarding your ${selectedRequest.package_name} enquiry (${selectedRequest.id}).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4 text-black" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
