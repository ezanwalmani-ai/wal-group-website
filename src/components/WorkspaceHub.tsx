import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Folder,
  Mail,
  Search,
  Upload,
  Trash2,
  ExternalLink,
  Send,
  RefreshCw,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Plus,
  LogOut,
  Download
} from 'lucide-react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, googleLogout, getAccessToken } from '../lib/googleAuth';
import { listDriveFiles, uploadFileToDrive, deleteDriveFile, DriveFile } from '../lib/googleDriveApi';
import { listGmailMessages, sendGmailMessage, GmailMessage } from '../lib/googleGmailApi';
import { soundFx } from '../utils/audio';

interface WorkspaceHubProps {
  isOpen: boolean;
  onClose: () => void;
  leadsForExport?: any[];
  prefillEmail?: string;
}

export const WorkspaceHub: React.FC<WorkspaceHubProps> = ({
  isOpen,
  onClose,
  leadsForExport = [],
  prefillEmail = ''
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(getAccessToken());
  const [needsAuth, setNeedsAuth] = useState<boolean>(!getAccessToken());
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'drive' | 'gmail'>('drive');

  // Drive state
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [driveSearch, setDriveSearch] = useState<string>('');
  const [loadingDrive, setLoadingDrive] = useState<boolean>(false);
  const [uploadingToDrive, setUploadingToDrive] = useState<boolean>(false);
  const [driveSuccessMsg, setDriveSuccessMsg] = useState<string | null>(null);
  const [fileToDelete, setFileToDelete] = useState<DriveFile | null>(null);

  // Gmail state
  const [gmailMessages, setGmailMessages] = useState<GmailMessage[]>([]);
  const [gmailSearch, setGmailSearch] = useState<string>('');
  const [loadingGmail, setLoadingGmail] = useState<boolean>(false);
  const [showCompose, setShowCompose] = useState<boolean>(false);
  const [emailTo, setEmailTo] = useState<string>(prefillEmail);
  const [emailSubject, setEmailSubject] = useState<string>('Wal Group Executive Follow-Up');
  const [emailBody, setEmailBody] = useState<string>('');
  const [confirmingSend, setConfirmingSend] = useState<boolean>(false);
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (prefillEmail) {
      setEmailTo(prefillEmail);
    }
  }, [prefillEmail]);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch Drive Files when tab or token changes
  useEffect(() => {
    if (isOpen && accessToken && !needsAuth) {
      if (activeTab === 'drive') {
        fetchDriveFiles();
      } else if (activeTab === 'gmail') {
        fetchGmailMessages();
      }
    }
  }, [isOpen, accessToken, needsAuth, activeTab]);

  const handleGoogleSignIn = async () => {
    soundFx.playClick();
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Failed to authenticate with Google');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    soundFx.playClick();
    await googleLogout();
    setUser(null);
    setAccessToken(null);
    setNeedsAuth(true);
    setDriveFiles([]);
    setGmailMessages([]);
  };

  const fetchDriveFiles = async () => {
    if (!accessToken) return;
    setLoadingDrive(true);
    try {
      const files = await listDriveFiles(accessToken, driveSearch);
      setDriveFiles(files);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('401') || err.message?.includes('token')) {
        setNeedsAuth(true);
      }
    } finally {
      setLoadingDrive(false);
    }
  };

  const fetchGmailMessages = async () => {
    if (!accessToken) return;
    setLoadingGmail(true);
    try {
      const msgs = await listGmailMessages(accessToken, gmailSearch);
      setGmailMessages(msgs);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('401') || err.message?.includes('token')) {
        setNeedsAuth(true);
      }
    } finally {
      setLoadingGmail(false);
    }
  };

  // Export Leads directly to Google Drive
  const handleExportLeadsToDrive = async () => {
    if (!accessToken) return;
    soundFx.playClick();
    setUploadingToDrive(true);
    setDriveSuccessMsg(null);

    try {
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

      const rows = (leadsForExport.length > 0 ? leadsForExport : []).map((l) => [
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
        new Date(l.createdAt || Date.now()).toLocaleString()
      ]);

      const csvContent = [
        headers.map((h) => `"${h}"`).join(','),
        ...rows.map((r) => r.map(escapeCsv).join(','))
      ].join('\n');

      const fileName = `wal_group_leads_${new Date().toISOString().split('T')[0]}.csv`;
      const uploaded = await uploadFileToDrive(accessToken, fileName, csvContent, 'text/csv');

      setDriveSuccessMsg(`Leads exported successfully to Google Drive: "${uploaded.name}"`);
      fetchDriveFiles();
    } catch (err: any) {
      alert(`Failed to save to Drive: ${err.message}`);
    } finally {
      setUploadingToDrive(false);
    }
  };

  // Custom File Upload to Drive
  const handleFileUploadInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !accessToken) return;
    soundFx.playClick();
    setUploadingToDrive(true);
    setDriveSuccessMsg(null);

    try {
      const uploaded = await uploadFileToDrive(accessToken, file.name, file, file.type);
      setDriveSuccessMsg(`File "${uploaded.name}" uploaded to Google Drive!`);
      fetchDriveFiles();
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingToDrive(false);
      e.target.value = '';
    }
  };

  // Delete Drive File Handler (after user confirms)
  const confirmDeleteDriveFile = async () => {
    if (!fileToDelete || !accessToken) return;
    soundFx.playClick();
    try {
      await deleteDriveFile(accessToken, fileToDelete.id);
      setDriveFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      setDriveSuccessMsg(`Deleted "${fileToDelete.name}" from Google Drive.`);
    } catch (err: any) {
      alert(`Deletion failed: ${err.message}`);
    } finally {
      setFileToDelete(null);
    }
  };

  // Send Email Handler (after user confirms)
  const executeSendEmail = async () => {
    if (!accessToken || !emailTo || !emailSubject || !emailBody) return;
    soundFx.playClick();
    setSendingEmail(true);
    setEmailSuccessMsg(null);

    try {
      await sendGmailMessage(accessToken, emailTo, emailSubject, emailBody);
      setEmailSuccessMsg(`Email dispatched successfully to ${emailTo} via Gmail!`);
      setShowCompose(false);
      setEmailTo('');
      setEmailSubject('Wal Group Executive Follow-Up');
      setEmailBody('');
      setConfirmingSend(false);
      fetchGmailMessages();
    } catch (err: any) {
      alert(`Failed to send email: ${err.message}`);
    } finally {
      setSendingEmail(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
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
          className="relative z-10 w-full max-w-5xl bg-[#0b0c10] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#ff7700] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#ff7700]" />
                <span>Google Workspace Operations Integration</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
                <span>Google Drive & Gmail</span>
                <span className="text-xs bg-[#ff7700]/20 text-[#ff7700] border border-[#ff7700]/30 px-2.5 py-0.5 rounded-full font-bold">
                  Workspace Connected
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {user && !needsAuth && (
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-2 px-3">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      loading="lazy" 
                      decoding="async" 
                      className="w-7 h-7 rounded-full" 
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#ff7700] text-black font-extrabold flex items-center justify-center text-xs">
                      {(user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="text-left hidden md:block">
                    <div className="text-xs font-bold text-white truncate max-w-[140px]">{user.displayName || 'Executive User'}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{user.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-1 transition-all cursor-pointer"
                    title="Sign Out of Google Workspace"
                  >
                    <LogOut className="w-3.5 h-3.5" />
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

          {/* AUTH PROMPT IF NOT SIGNED IN */}
          {needsAuth ? (
            <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff7700]/20 to-blue-500/20 border border-white/20 flex items-center justify-center shadow-xl">
                <Folder className="w-8 h-8 text-[#ff7700]" />
              </div>

              <div className="max-w-md space-y-2">
                <h3 className="text-lg font-bold text-white">Connect Your Google Workspace Account</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sign in with your Google account to grant the Wal Group Executive Control Center secure access to Google Drive and Gmail. You will be able to export CRM leads directly to Drive and dispatch client emails from Gmail with explicit user permission.
                </p>
              </div>

              {/* Standard Material Sign in with Google Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isAuthenticating}
                className="cursor-pointer group relative inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-white text-slate-900 font-bold text-xs shadow-xl hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>{isAuthenticating ? 'Connecting Workspace...' : 'Sign in with Google Workspace'}</span>
                </div>
              </button>

              {authError && (
                <div className="p-3 bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs rounded-xl max-w-md">
                  {authError}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Tabs Bar */}
              <div className="flex items-center justify-between pt-4 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setActiveTab('drive');
                    }}
                    className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                      activeTab === 'drive'
                        ? 'bg-[#ff7700] text-black shadow-lg shadow-[#ff7700]/20'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    <Folder className="w-4 h-4" />
                    <span>Google Drive Files</span>
                  </button>

                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setActiveTab('gmail');
                    }}
                    className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                      activeTab === 'gmail'
                        ? 'bg-[#ff7700] text-black shadow-lg shadow-[#ff7700]/20'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Gmail Operations</span>
                  </button>
                </div>

                {activeTab === 'drive' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportLeadsToDrive}
                      disabled={uploadingToDrive}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer disabled:opacity-50"
                      title="Save all leads CSV to Google Drive"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{uploadingToDrive ? 'Exporting...' : 'Save Leads to Drive'}</span>
                    </button>

                    <label className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all">
                      <Upload className="w-3.5 h-3.5 text-[#ff7700]" />
                      <span>Upload File</span>
                      <input type="file" onChange={handleFileUploadInput} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setShowCompose(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Compose Email</span>
                  </button>
                )}
              </div>

              {/* Status Message Banners */}
              {driveSuccessMsg && (
                <div className="mt-3 p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{driveSuccessMsg}</span>
                  </div>
                  <button onClick={() => setDriveSuccessMsg(null)} className="text-emerald-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {emailSuccessMsg && (
                <div className="mt-3 p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{emailSuccessMsg}</span>
                  </div>
                  <button onClick={() => setEmailSuccessMsg(null)} className="text-emerald-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* GOOGLE DRIVE TAB CONTENT */}
              {activeTab === 'drive' && (
                <div className="pt-3 space-y-3 flex-1 flex flex-col overflow-hidden">
                  <div className="flex items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-[#ff7700] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search files in Google Drive..."
                        value={driveSearch}
                        onChange={(e) => setDriveSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchDriveFiles()}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff7700]"
                      />
                    </div>
                    <button
                      onClick={fetchDriveFiles}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-[#ff7700]"
                    >
                      <RefreshCw className={`w-4 h-4 ${loadingDrive ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-2xl p-3 overflow-y-auto max-h-[420px]">
                    {loadingDrive ? (
                      <div className="p-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#ff7700]" />
                        <span>Loading files from Google Drive...</span>
                      </div>
                    ) : driveFiles.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                        <p>No Google Drive files found matching search.</p>
                        <p className="text-slate-500 text-[11px]">Click "Save Leads to Drive" above to create your first leads export file directly in Drive.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {driveFiles.map((f) => (
                          <div key={f.id} className="p-3 hover:bg-white/5 rounded-xl transition-all flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 truncate">
                              <FileText className="w-5 h-5 text-[#ff7700] shrink-0" />
                              <div className="truncate">
                                <div className="text-xs font-bold text-white truncate">{f.name}</div>
                                <div className="text-[10px] text-slate-400">
                                  {f.modifiedTime ? new Date(f.modifiedTime).toLocaleDateString() : 'Drive File'} &bull; {f.mimeType}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {f.webViewLink && (
                                <a
                                  href={f.webViewLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-blue-950/80 border border-blue-500/40 text-blue-300 hover:bg-blue-900 transition-all text-xs flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Open in Drive</span>
                                </a>
                              )}

                              {/* Delete button triggers MANDATORY confirmation dialog */}
                              <button
                                onClick={() => setFileToDelete(f)}
                                className="p-1.5 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:bg-rose-900 transition-all text-xs cursor-pointer"
                                title="Delete file from Google Drive"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* GMAIL TAB CONTENT */}
              {activeTab === 'gmail' && (
                <div className="pt-3 space-y-3 flex-1 flex flex-col overflow-hidden">
                  <div className="flex items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-[#ff7700] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search Gmail inbox or contacts..."
                        value={gmailSearch}
                        onChange={(e) => setGmailSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchGmailMessages()}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff7700]"
                      />
                    </div>
                    <button
                      onClick={fetchGmailMessages}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-[#ff7700]"
                    >
                      <RefreshCw className={`w-4 h-4 ${loadingGmail ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-2xl p-3 overflow-y-auto max-h-[420px]">
                    {loadingGmail ? (
                      <div className="p-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#ff7700]" />
                        <span>Loading messages from Gmail...</span>
                      </div>
                    ) : gmailMessages.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                        <p>No messages found in Gmail inbox matching criteria.</p>
                        <p className="text-slate-500 text-[11px]">Click "Compose Email" above to dispatch emails directly through Gmail.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {gmailMessages.map((m) => (
                          <div key={m.id} className="p-3 hover:bg-white/5 rounded-xl transition-all space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-xs font-bold text-white truncate">{m.from}</div>
                              <div className="text-[10px] text-slate-400 shrink-0">{m.date ? new Date(m.date).toLocaleDateString() : ''}</div>
                            </div>
                            <div className="text-xs font-semibold text-[#ff7700] truncate">{m.subject}</div>
                            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{m.snippet}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* DELETE DRIVE FILE MANDATORY CONFIRMATION DIALOG */}
          {fileToDelete && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="bg-[#12131a] border border-rose-500/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
                <div className="flex items-center gap-3 text-rose-400 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                  <span>Confirm Google Drive Deletion</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Are you sure you want to delete <strong className="text-white">"{fileToDelete.name}"</strong> from your Google Drive? This action will permanently modify your Workspace data.
                </p>
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
                  <button
                    onClick={() => setFileToDelete(null)}
                    className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 font-bold text-xs hover:bg-white/20 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteDriveFile}
                    className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition-all cursor-pointer shadow-lg shadow-rose-950/50"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* GMAIL COMPOSE FORM MODAL */}
          {showCompose && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="bg-[#12131a] border border-white/20 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <Mail className="w-4 h-4 text-[#ff7700]" />
                    <span>Compose Email (Gmail API)</span>
                  </div>
                  <button onClick={() => setShowCompose(false)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">To (Recipient Email):</label>
                    <input
                      type="email"
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      placeholder="prospect@company.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff7700]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Subject:</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ff7700]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Email Body Message:</label>
                    <textarea
                      rows={5}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Dear Client, thank you for reaching out to Wal Group. We would like to schedule our operational strategy consultation..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#ff7700]"
                    />
                  </div>
                </div>

                {/* MANDATORY CONFIRMATION STEP BEFORE DISPATCH */}
                {confirmingSend ? (
                  <div className="p-3 bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs rounded-xl space-y-2">
                    <div className="flex items-center gap-2 font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Confirm Email Dispatch</span>
                    </div>
                    <p>
                      Are you sure you want to send this email to <strong className="text-white">{emailTo}</strong> via your connected Gmail account?
                    </p>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setConfirmingSend(false)}
                        className="px-3 py-1.5 rounded-lg bg-white/10 text-slate-300 font-bold text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={executeSendEmail}
                        disabled={sendingEmail}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{sendingEmail ? 'Sending...' : 'Yes, Send Email'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowCompose(false)}
                      className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 font-bold text-xs hover:bg-white/20 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (!emailTo || !emailSubject || !emailBody) {
                          alert('Please complete all fields before sending.');
                          return;
                        }
                        setConfirmingSend(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#ff7700] text-black font-extrabold text-xs hover:bg-[#ff8811] transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Proceed to Send</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
