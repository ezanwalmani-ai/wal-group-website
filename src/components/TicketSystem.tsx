import React, { useState } from 'react';
import { Ticket, TicketMessage } from '../types';
import { saveTicketToSupabase } from '../lib/supabase';
import { 
  PlusCircle, 
  Search, 
  CheckCircle2, 
  Send, 
  HelpCircle, 
  AlertCircle,
  Laptop,
  Truck,
  Calculator,
  Users,
  Headphones,
  User,
  Building2,
  Phone,
  Mail,
  Loader2
} from 'lucide-react';

export const TicketSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'open' | 'check'>('open');
  const [submittedTicket, setSubmittedTicket] = useState<Ticket | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    department: 'Technical Support',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    subject: '',
    message: ''
  });

  // Check Status State
  const [searchTicketId, setSearchTicketId] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [foundTicket, setFoundTicket] = useState<Ticket | null>(null);
  const [searchError, setSearchError] = useState('');
  const [replyText, setReplyText] = useState('');

  // Local storage tickets state helper
  const getStoredTickets = (): Ticket[] => {
    const data = localStorage.getItem('wal_groups_tickets') || localStorage.getItem('walmani_tickets');
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  };

  const saveTicketToStorage = (newTicket: Ticket) => {
    const existing = getStoredTickets();
    existing.unshift(newTicket);
    localStorage.setItem('wal_groups_tickets', JSON.stringify(existing));
  };

  const generateTicketId = () => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `WM-${dateStr}-${randomNum}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setSubmitError('Please complete all required fields (Name, Email, Subject, Description).');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    const newTicketId = generateTicketId();
    const nowISO = new Date().toLocaleString();

    const newTicket: Ticket = {
      id: newTicketId,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      companyName: formData.companyName,
      department: formData.department,
      subject: formData.subject,
      priority: formData.priority,
      message: formData.message,
      status: 'Open',
      createdAt: nowISO,
      lastUpdated: nowISO,
      messages: [
        {
          id: 'msg-1',
          sender: 'user',
          senderName: formData.fullName || 'Requester',
          text: formData.message,
          timestamp: nowISO,
          attachments: []
        },
        {
          id: 'msg-2',
          sender: 'agent',
          senderName: 'Wal Group Support Operations',
          text: `Hello ${formData.fullName}, thank you for contacting Wal Group. Your ticket ${newTicketId} has been logged in our ${formData.department} queue with ${formData.priority} priority. Our team is reviewing your request and will respond shortly.`,
          timestamp: nowISO
        }
      ]
    };

    try {
      saveTicketToStorage(newTicket);
      fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicket)
      }).catch(err => console.error('Ticket API submission error:', err));

      await saveTicketToSupabase(newTicket);
      setSubmittedTicket(newTicket);
    } catch (err: any) {
      console.error('Supabase ticket save error:', err);
      // Even if remote fails, ticket is cached in local storage
      setSubmittedTicket(newTicket);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckStatus = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setFoundTicket(null);

    const tickets = getStoredTickets();
    const match = tickets.find(
      (t) => t.id.trim().toUpperCase() === searchTicketId.trim().toUpperCase() &&
             t.email.trim().toLowerCase() === searchEmail.trim().toLowerCase()
    );

    if (match) {
      setFoundTicket(match);
    } else {
      setSearchError(`No ticket found matching ID "${searchTicketId}" and email "${searchEmail}". Please verify your details.`);
    }
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !foundTicket) return;

    const nowISO = new Date().toLocaleString();
    const newMsg: TicketMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      senderName: foundTicket.fullName,
      text: replyText,
      timestamp: nowISO
    };

    const updatedTicket: Ticket = {
      ...foundTicket,
      lastUpdated: nowISO,
      messages: [...foundTicket.messages, newMsg]
    };

    const all = getStoredTickets();
    const updatedList = all.map((t) => (t.id === updatedTicket.id ? updatedTicket : t));
    localStorage.setItem('wal_groups_tickets', JSON.stringify(updatedList));

    setFoundTicket(updatedTicket);
    setReplyText('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#0a0a0f] rounded-3xl shadow-2xl border border-white/10 overflow-hidden font-sans text-white">
      
      {/* Top Banner Navigation */}
      <div className="bg-[#050508] p-6 sm:p-8 border-b border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <div className="text-[#ff7700] font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-[#ff7700]" />
            <span>24×7 Operations Center</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">Support Ticket Portal</h2>
        </div>

        <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => { setActiveTab('open'); setSubmittedTicket(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'open' 
                ? 'bg-[#ff7700] text-black font-extrabold shadow-[0_0_15px_rgba(255,119,0,0.4)]' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Open New Ticket</span>
          </button>

          <button
            onClick={() => setActiveTab('check')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'check' 
                ? 'bg-[#ff7700] text-black font-extrabold shadow-[0_0_15px_rgba(255,119,0,0.4)]' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Check Ticket Status</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-8">

        {/* TAB 1: OPEN NEW TICKET */}
        {activeTab === 'open' && (
          <div>
            {submittedTicket ? (
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">Support Ticket Created Successfully!</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  Your ticket has been logged into our operational queue. Please save your Ticket ID for tracking.
                </p>

                <div className="bg-black/60 border border-white/10 rounded-xl p-5 inline-block text-left shadow-sm max-w-sm w-full space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Ticket ID:</span>
                    <span className="font-mono font-extrabold text-[#ff7700]">{submittedTicket.id}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Department:</span>
                    <span className="font-semibold text-white">{submittedTicket.department}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Priority:</span>
                    <span className={`font-bold ${submittedTicket.priority === 'High' ? 'text-red-400' : 'text-amber-400'}`}>
                      {submittedTicket.priority}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Submitted:</span>
                    <span className="text-slate-300">{submittedTicket.createdAt}</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => {
                      setSearchTicketId(submittedTicket.id);
                      setSearchEmail(submittedTicket.email);
                      setFoundTicket(submittedTicket);
                      setActiveTab('check');
                    }}
                    className="bg-[#ff7700] hover:bg-[#ff8800] text-black text-xs font-extrabold py-3 px-6 rounded-xl transition-all cursor-pointer shadow-lg"
                  >
                    View / Track Ticket Status
                  </button>
                  <button
                    onClick={() => {
                      setSubmittedTicket(null);
                      setFormData({
                        department: 'Technical Support',
                        priority: 'Medium',
                        fullName: '',
                        email: '',
                        phone: '',
                        companyName: '',
                        subject: '',
                        message: ''
                      });
                    }}
                    className="bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-3 px-6 rounded-xl border border-white/10 transition-all cursor-pointer"
                  >
                    Open Another Ticket
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateTicket} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-[#ff7700]" />
                    Submit a New Support Ticket
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Direct dispatch disruptions are monitored 24/7. High priority tickets receive response within 15 minutes.
                  </p>
                </div>

                {submitError && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-xs">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Department and Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Assigned Department <span className="text-[#ff7700]">*</span>
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-white/10 text-white text-sm focus:outline-none focus:border-[#ff7700] transition-colors"
                    >
                      <option value="Technical Support">Technical &amp; Platform Support</option>
                      <option value="Amazon DSP Dispatch">Amazon DSP &amp; Fleet Dispatch</option>
                      <option value="Payroll & Accounting">Payroll &amp; Accounting Operations</option>
                      <option value="HR & Driver Recruiting">HR &amp; Driver Recruiting</option>
                      <option value="Client Services & Billing">Client Services &amp; Account Management</option>
                      <option value="General Assistance">General Assistance</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Priority Level <span className="text-[#ff7700]">*</span>
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-white/10 text-white text-sm focus:outline-none focus:border-[#ff7700] transition-colors"
                    >
                      <option value="Low">Low — General Guidance</option>
                      <option value="Medium">Medium — Routine Support</option>
                      <option value="High">High — Urgent / Time-Sensitive (Live Route Issue)</option>
                    </select>
                  </div>
                </div>

                {/* Requester Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#ff7700]" />
                      Full Name <span className="text-[#ff7700]">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ff7700] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#ff7700]" />
                      Email Address <span className="text-[#ff7700]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. alex@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ff7700] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#ff7700]" />
                      Direct Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +1 (555) 345-6789"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ff7700] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#ff7700]" />
                      Company / DSP Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="e.g. Blue Ridge Logistics / DSP Station DFW7"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ff7700] transition-colors"
                    />
                  </div>
                </div>

                {/* Subject & Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Subject / Summary <span className="text-[#ff7700]">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Route exception at Hub DFW7 / Payroll adjustment for Week 42"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ff7700] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Detailed Description <span className="text-[#ff7700]">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Include route numbers, driver names, timestamps, or system error messages..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ff7700] transition-colors resize-y"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#ff8800] to-[#ff5500] hover:from-[#ff9911] hover:to-[#ff6611] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,119,0,0.3)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Logging Support Ticket...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Submit Support Ticket</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: CHECK TICKET STATUS */}
        {activeTab === 'check' && (
          <div className="space-y-6">
            <form onSubmit={handleCheckStatus} className="bg-black/40 p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-lg font-bold text-white">Find Existing Support Ticket</h3>
              <p className="text-xs text-slate-400">Enter the Ticket ID provided at submission along with your email address.</p>

              {searchError && (
                <div className="p-3 bg-red-950/50 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{searchError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Ticket ID <span className="text-[#ff7700]">*</span></label>
                  <input
                    type="text"
                    required
                    value={searchTicketId}
                    onChange={(e) => setSearchTicketId(e.target.value)}
                    placeholder="e.g. WM-20260902-1234"
                    className="w-full px-4 py-2.5 text-sm bg-black/60 border border-white/15 focus:border-[#ff7700] rounded-xl outline-none text-white font-mono placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Email Address <span className="text-[#ff7700]">*</span></label>
                  <input
                    type="email"
                    required
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-4 py-2.5 text-sm bg-black/60 border border-white/15 focus:border-[#ff7700] rounded-xl outline-none text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-[#ff7700] hover:bg-[#ff8800] text-black font-extrabold text-xs py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Ticket</span>
                </button>
              </div>
            </form>

            {/* Display Found Ticket */}
            {foundTicket && (
              <div className="bg-black/50 border border-white/10 rounded-2xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#ff7700]">{foundTicket.id}</span>
                    <h3 className="text-xl font-bold text-white">{foundTicket.subject}</h3>
                    <div className="text-xs text-slate-400 mt-1">
                      <span>Created: {foundTicket.createdAt}</span> • <span>Department: {foundTicket.department}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      foundTicket.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      foundTicket.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {foundTicket.status}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-slate-300">
                      {foundTicket.priority} Priority
                    </span>
                  </div>
                </div>

                {/* Conversation Message History */}
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {foundTicket.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-xl text-xs space-y-1 ${
                        msg.sender === 'user'
                          ? 'bg-[#ff7700]/10 border border-[#ff7700]/20 ml-6 text-white'
                          : 'bg-white/5 border border-white/10 mr-6 text-slate-200'
                      }`}
                    >
                      <div className="flex justify-between font-bold text-slate-400 text-[11px]">
                        <span className={msg.sender === 'user' ? 'text-[#ff7700]' : 'text-blue-400'}>
                          {msg.senderName} ({msg.sender === 'user' ? 'You' : 'Wal Group Support Desk'})
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                {/* Add Reply Form */}
                <form onSubmit={handleAddReply} className="pt-4 border-t border-white/10 space-y-3">
                  <label className="block text-xs font-bold text-slate-300">Send a Reply to the Support Team</label>
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply or additional details here..."
                    className="w-full px-4 py-3 text-sm bg-black/60 border border-white/15 focus:border-[#ff7700] rounded-xl outline-none text-white placeholder-slate-500"
                  />
                  <button
                    type="submit"
                    className="bg-[#ff7700] hover:bg-[#ff8800] text-black font-extrabold text-xs py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Post Reply</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
