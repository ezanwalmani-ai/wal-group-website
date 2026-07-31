import React, { useState } from 'react';
import { Ticket, TicketMessage } from '../types';
import { saveTicketToSupabase } from '../lib/supabase';
import { 
  PlusCircle, 
  Search, 
  CheckCircle2, 
  Clock, 
  Send, 
  Paperclip, 
  AlertCircle,
  FileText,
  User,
  Building,
  Mail,
  Phone,
  HelpCircle,
  X
} from 'lucide-react';

export const TicketSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'open' | 'check'>('open');

  // Open Ticket State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [department, setDepartment] = useState('Technical Support');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [submittedTicket, setSubmittedTicket] = useState<Ticket | null>(null);

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

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !subject || !message) return;

    const newTicketId = generateTicketId();
    const nowISO = new Date().toLocaleString();

    const newTicket: Ticket = {
      id: newTicketId,
      fullName,
      email,
      phone,
      companyName,
      department,
      subject,
      priority,
      message,
      status: 'Open',
      createdAt: nowISO,
      lastUpdated: nowISO,
      messages: [
        {
          id: 'msg-1',
          sender: 'user',
          senderName: fullName,
          text: message,
          timestamp: nowISO,
          attachments: selectedFile ? [selectedFile.name] : []
        },
        {
          id: 'msg-2',
          sender: 'agent',
          senderName: 'Wal Group Support Operations',
          text: `Hello ${fullName}, thank you for contacting Wal Group. Your ticket ${newTicketId} has been logged in our ${department} queue with ${priority} priority. Our team is reviewing your request and will respond shortly.`,
          timestamp: nowISO
        }
      ]
    };

    saveTicketToStorage(newTicket);
    fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTicket)
    }).catch(err => console.error('Ticket API submission error:', err));
    saveTicketToSupabase(newTicket).catch((err) => console.error('Supabase ticket save error:', err));
    setSubmittedTicket(newTicket);
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

    // Update state & storage
    const all = getStoredTickets();
    const updatedList = all.map((t) => (t.id === updatedTicket.id ? updatedTicket : t));
    localStorage.setItem('wal_groups_tickets', JSON.stringify(updatedList));

    setFoundTicket(updatedTicket);
    setReplyText('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden font-sans">
      
      {/* Top Banner Navigation */}
      <div className="bg-[#0A2647] p-6 text-white flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <div className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            <span>24×7 Client Operations Center</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Support Ticket Portal</h2>
        </div>

        <div className="flex items-center gap-3 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
          <button
            onClick={() => { setActiveTab('open'); setSubmittedTicket(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'open' ? 'bg-[#2271B1] text-white shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Open New Ticket</span>
          </button>

          <button
            onClick={() => setActiveTab('check')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'check' ? 'bg-[#2271B1] text-white shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Check Ticket Status</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-10">

        {/* TAB 1: OPEN NEW TICKET */}
        {activeTab === 'open' && (
          <div>
            {submittedTicket ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-900">Support Ticket Created Successfully!</h3>
                <p className="text-sm text-emerald-800 max-w-md mx-auto">
                  Your ticket has been logged with our team. Please keep your Ticket ID for tracking progress.
                </p>

                <div className="bg-white border border-emerald-200 rounded-lg p-4 inline-block text-left shadow-sm max-w-sm w-full space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-semibold">Ticket ID:</span>
                    <span className="font-extrabold text-[#0A2647]">{submittedTicket.id}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-semibold">Department:</span>
                    <span className="font-semibold text-slate-800">{submittedTicket.department}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-semibold">Priority:</span>
                    <span className="font-bold text-amber-600">{submittedTicket.priority}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-semibold">Submitted:</span>
                    <span className="text-slate-700">{submittedTicket.createdAt}</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSearchTicketId(submittedTicket.id);
                      setSearchEmail(submittedTicket.email);
                      setFoundTicket(submittedTicket);
                      setActiveTab('check');
                    }}
                    className="bg-[#0A2647] hover:bg-[#051A30] text-white text-xs font-bold py-2.5 px-5 rounded-lg transition-all"
                  >
                    View / Track Ticket Status
                  </button>
                  <button
                    onClick={() => {
                      setSubmittedTicket(null);
                      setSubject('');
                      setMessage('');
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-5 rounded-lg transition-all"
                  >
                    Submit Another Ticket
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateTicket} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2271B1] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2271B1] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 / +1 Phone number"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2271B1] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="DSP / AFP / Company Name"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2271B1] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Department <span className="text-red-500">*</span></label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2271B1] focus:border-transparent outline-none bg-white"
                    >
                      <option value="Technical Support">Technical Support</option>
                      <option value="Dispatch Operations">Dispatch Operations</option>
                      <option value="Accounting & Payroll">Accounting &amp; Payroll</option>
                      <option value="HR & Recruitment">HR &amp; Recruitment</option>
                      <option value="Billing & Invoicing">Billing &amp; Invoicing</option>
                      <option value="Sales & General">Sales &amp; General</option>
                    </select>

                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                      <span>Routed Channel:</span>
                      <a href="mailto:thewalgroupinfo@gmail.com" className="font-mono font-bold text-[#ff6600] hover:underline">thewalgroupinfo@gmail.com</a>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Priority Level <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Low', 'Medium', 'High'] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                            priority === p
                              ? p === 'High'
                                ? 'bg-red-50 border-red-500 text-red-700'
                                : p === 'Medium'
                                ? 'bg-amber-50 border-amber-500 text-amber-800'
                                : 'bg-blue-50 border-blue-500 text-blue-800'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief summary of your issue"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2271B1] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please describe your issue in detail, including route numbers, dates, or specific error messages..."
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2271B1] focus:border-transparent outline-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Attachment (Optional)</label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg border border-slate-300 flex items-center gap-2 transition-colors">
                      <Paperclip className="w-4 h-4" />
                      <span>{selectedFile ? selectedFile.name : 'Choose File (PDF, DOC, Images up to 10MB)'}</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setSelectedFile(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                    {selectedFile && (
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="text-xs text-red-600 hover:underline flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0A2647] hover:bg-[#051A30] text-white font-extrabold text-sm py-3.5 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5 text-amber-400" />
                  <span>Submit Ticket Now</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: CHECK TICKET STATUS */}
        {activeTab === 'check' && (
          <div className="space-y-6">
            {!foundTicket ? (
              <form onSubmit={handleCheckStatus} className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                <h3 className="text-lg font-bold text-[#0A2647] flex items-center gap-2">
                  <Search className="w-5 h-5 text-[#2271B1]" />
                  <span>Look Up Support Ticket</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ticket ID <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={searchTicketId}
                      onChange={(e) => setSearchTicketId(e.target.value)}
                      placeholder="e.g. WM-20260724-1234"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2271B1] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      required
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      placeholder="Email used when submitting"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2271B1] outline-none"
                    />
                  </div>
                </div>

                {searchError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{searchError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#0A2647] hover:bg-[#051A30] text-white font-bold text-xs py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4 text-amber-400" />
                  <span>Search Ticket Records</span>
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Header Information */}
                <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-amber-400 font-extrabold text-lg">{foundTicket.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                        foundTicket.status === 'Open' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {foundTicket.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{foundTicket.subject}</h3>
                    <p className="text-xs text-slate-400 mt-1">Submitted by {foundTicket.fullName} ({foundTicket.email}) • Dept: {foundTicket.department}</p>
                  </div>

                  <div className="text-right text-xs space-y-1 text-slate-300">
                    <div><span className="text-slate-400">Priority:</span> <span className="font-bold text-amber-400">{foundTicket.priority}</span></div>
                    <div><span className="text-slate-400">Created:</span> {foundTicket.createdAt}</div>
                    <div><span className="text-slate-400">Updated:</span> {foundTicket.lastUpdated}</div>
                  </div>
                </div>

                {/* Conversation History */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Conversation History</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {foundTicket.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-4 rounded-xl text-xs space-y-1 border ${
                          msg.sender === 'user'
                            ? 'bg-blue-50/70 border-blue-200 ml-6 text-slate-800'
                            : 'bg-slate-800 text-slate-100 border-slate-700 mr-6'
                        }`}
                      >
                        <div className="flex justify-between items-center font-bold text-[11px]">
                          <span className={msg.sender === 'user' ? 'text-[#0A2647]' : 'text-amber-400'}>
                            {msg.senderName}
                          </span>
                          <span className="text-slate-400 font-normal">{msg.timestamp}</span>
                        </div>
                        <p className="whitespace-pre-wrap leading-relaxed text-xs">{msg.text}</p>
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="pt-2 flex items-center gap-1.5 text-[11px] text-blue-600">
                            <Paperclip className="w-3.5 h-3.5" />
                            <span>Attachment: {msg.attachments.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reply Form */}
                <form onSubmit={handleAddReply} className="pt-4 border-t border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-700">Add Reply to Ticket</label>
                  <textarea
                    rows={3}
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your response or additional information..."
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2271B1] outline-none"
                  ></textarea>
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setFoundTicket(null)}
                      className="text-xs text-slate-500 hover:underline"
                    >
                      &larr; Search Another Ticket
                    </button>
                    <button
                      type="submit"
                      className="bg-[#2271B1] hover:bg-[#1B5A8C] text-white text-xs font-bold py-2.5 px-5 rounded-lg flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Reply</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
