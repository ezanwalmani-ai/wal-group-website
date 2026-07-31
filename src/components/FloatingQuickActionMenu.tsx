import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBooking } from '../context/BookingContext';
import { useBehavior } from '../context/BehaviorContext';
import { 
  X, 
  Sparkles, 
  Send, 
  Calendar, 
  MessageSquare, 
  Mail, 
  Bot, 
  User, 
  ArrowRight,
  ChevronLeft,
  ExternalLink,
  PhoneCall
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface FloatingQuickActionMenuProps {
  navigate: (path: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestBooking?: boolean;
}

export const FloatingQuickActionMenu: React.FC<FloatingQuickActionMenuProps> = () => {
  const { openBookDemo } = useBooking();
  const { behavior, getPersonalizedGreeting, trackCtaClick } = useBehavior();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeView, setActiveView] = useState<'menu' | 'chat'>('menu');
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [preferredEngine, setPreferredEngine] = useState<'openai' | 'gemini' | 'auto'>('openai');
  const [currentProviderBadge, setCurrentProviderBadge] = useState<string>('OpenAI GPT-4o-mini');
  
  // Lead quick capture fields inside chat
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadFleet, setLeadFleet] = useState('');
  const [showLeadForm, setShowLeadForm] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize chat greeting on session start
  useEffect(() => {
    if (activeView === 'chat' && messages.length === 0) {
      const greeting = getPersonalizedGreeting();
      const newSession = `SESS-${Date.now().toString(36).toUpperCase()}`;
      setSessionId(newSession);
      setMessages([
        {
          id: 'welcome-1',
          sender: 'assistant',
          text: greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [activeView, getPersonalizedGreeting, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (streamingIntervalRef.current) clearInterval(streamingIntervalRef.current);
    };
  }, []);

  const toggleWidget = () => {
    soundFx.playClick();
    trackCtaClick('Floating Support Widget Toggle');
    setIsOpen(!isOpen);
  };

  const handleOpenAiAssistant = () => {
    soundFx.playNav();
    trackCtaClick('Open AI Assistant Option');
    setActiveView('chat');
  };

  const handleOpenWhatsApp = () => {
    soundFx.playClick();
    trackCtaClick('WhatsApp Support Option');
    const text = encodeURIComponent("Hello Wal Group, I'd like to learn more about your services.");
    window.open(`https://api.whatsapp.com/send?phone=916363698148&text=${text}`, '_blank');
  };

  const handleOpenEmail = () => {
    soundFx.playClick();
    trackCtaClick('Email Support Option');
    const subject = encodeURIComponent('Business Enquiry');
    window.location.href = `mailto:thewalgroupinfo@gmail.com?subject=${subject}`;
  };

  // Streaming response text character by character for natural AI feel
  const streamResponse = (fullText: string, shouldSuggestBooking?: boolean) => {
    const messageId = `ast-${Date.now()}`;
    let currentIndex = 0;

    // Add empty message placeholder
    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        sender: 'assistant',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestBooking: shouldSuggestBooking
      }
    ]);

    if (streamingIntervalRef.current) clearInterval(streamingIntervalRef.current);

    streamingIntervalRef.current = setInterval(() => {
      currentIndex += Math.floor(Math.random() * 3) + 3; // reveal 3-5 chars per tick
      if (currentIndex >= fullText.length) {
        currentIndex = fullText.length;
        if (streamingIntervalRef.current) clearInterval(streamingIntervalRef.current);
        setIsTyping(false);
      }
      
      const currentChunk = fullText.slice(0, currentIndex);
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, text: currentChunk } : m))
      );
    }, 16);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || isTyping) return;

    soundFx.playNav();
    setInputValue('');

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          sessionId,
          behavior,
          preferredProvider: preferredEngine,
          history: updatedMessages.map((m) => ({ sender: m.sender, text: m.text }))
        })
      });

      const data = await response.json();

      if (data.success && data.response) {
        if (data.provider) {
          const providerStr = data.provider === 'OpenAI' ? `OpenAI ${data.model || 'GPT-4o-mini'}` : (data.provider === 'Gemini' ? `Gemini ${data.model || '3.6-flash'}` : 'Wal Group AI');
          setCurrentProviderBadge(providerStr);
        }
        streamResponse(data.response, data.shouldSuggestBooking);

        if (data.shouldSuggestBooking && !leadCaptured) {
          setShowLeadForm(true);
        }
      } else {
        throw new Error('Fallback required');
      }
    } catch {
      // Fallback assistant response
      setTimeout(() => {
        const fallback = `We can certainly assist you with that! Wal Group provides end-to-end backend operations, 24/7 Amazon DSP & AFP dispatch, payroll reconciliation, BPO Virtual Assistants, and custom web development. To recommend the exact solution, approximately how many drivers, vehicles, or team members are you currently managing?`;
        streamResponse(fallback, true);
        setShowLeadForm(true);
      }, 500);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail && !leadPhone) return;

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: leadEmail,
          phone: leadPhone,
          fleetSize: leadFleet,
          industry: behavior.servicesViewed.length > 0 ? behavior.servicesViewed[0] : 'Logistics / Fleet',
          challenges: `AI Assistant Chat Session ${sessionId}`
        })
      });
    } catch {
      // ignore
    }

    setLeadCaptured(true);
    setShowLeadForm(false);
    soundFx.playClick();

    const confirmationText = `Thank you! I've received your details (${leadEmail || leadPhone}). Our leadership team at thewalgroupinfo@gmail.com has been notified. Would you like to pick a time for your executive Discovery Call?`;
    streamResponse(confirmationText, true);
  };

  const suggestedTopics = [
    "We have problems hiring dispatchers.",
    "Tell me about Amazon DSP Dispatch.",
    "Help me with DSP Payroll & Scorecard Reconciliation.",
    "I need Dedicated Virtual Assistants.",
    "Book a Discovery Call."
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-auto select-none">
      
      {/* COMPACT WIDGET PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="mb-3.5 w-[285px] sm:w-[310px] bg-[#090912]/95 backdrop-blur-2xl rounded-[20px] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-white relative group"
          >
            {/* Top Glass Orange Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e65c00] via-[#ff7700] to-[#ff8512]" />
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#ff7700]/12 rounded-full blur-3xl pointer-events-none" />

            {/* PANEL HEADER */}
            <div className="p-3 pb-2.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02] shrink-0">
              <div className="flex items-center gap-2">
                {activeView === 'chat' ? (
                  <button
                    onClick={() => setActiveView('menu')}
                    className="w-6.5 h-6.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer mr-0.5"
                    title="Back to menu"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ff7700] to-[#e65c00] flex items-center justify-center text-slate-950 font-bold shadow-md relative shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white tracking-tight">
                      {activeView === 'chat' ? 'Wal Group AI Assistant' : 'Wal Group Support'}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-[9.5px] text-slate-400">
                      {activeView === 'chat' ? 'Operations Consultant' : 'Select a support channel below'}
                    </p>
                    {activeView === 'chat' && (
                      <span className="text-[8.5px] px-1.5 py-0.5 rounded bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 font-semibold tracking-wide flex items-center gap-1 shadow-sm">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        <span>{currentProviderBadge}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-6.5 h-6.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* VIEW 1: 3 COMPACT OPTIONS MENU */}
            {activeView === 'menu' && (
              <div className="p-3 space-y-2">
                
                {/* Option 1: AI Business Assistant */}
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={handleOpenAiAssistant}
                  className="w-full text-left bg-gradient-to-br from-white/[0.07] to-white/[0.03] hover:from-[#ff7700]/20 hover:to-[#ff7700]/05 border border-white/12 hover:border-[#ff7700]/50 rounded-xl p-2.5 transition-all cursor-pointer shadow-sm group/card relative overflow-hidden"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff7700] to-[#e65c00] text-slate-950 flex items-center justify-center shrink-0 shadow-md group-hover/card:scale-105 transition-transform">
                      <Bot className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white group-hover/card:text-[#ff7700] transition-colors flex items-center gap-1">
                          💬 AI Business Assistant
                        </span>
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-[#ff7700]/20 text-[#ff7700] border border-[#ff7700]/30">
                          Instant
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        Ask about services, dispatch & pricing
                      </p>
                    </div>
                  </div>
                </motion.button>

                {/* Option 2: WhatsApp Support */}
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={handleOpenWhatsApp}
                  className="w-full text-left bg-gradient-to-br from-white/[0.07] to-white/[0.03] hover:from-emerald-500/20 hover:to-emerald-500/05 border border-white/12 hover:border-emerald-500/50 rounded-xl p-2.5 transition-all cursor-pointer shadow-sm group/card relative overflow-hidden"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 flex items-center justify-center shrink-0 shadow-md group-hover/card:scale-105 transition-transform">
                      <MessageSquare className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white group-hover/card:text-emerald-400 transition-colors flex items-center gap-1">
                          📱 WhatsApp Support
                        </span>
                        <ExternalLink className="w-3 h-3 text-emerald-400 opacity-80" />
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        Chat live with our operations team
                      </p>
                    </div>
                  </div>
                </motion.button>

                {/* Option 3: Email Support */}
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={handleOpenEmail}
                  className="w-full text-left bg-gradient-to-br from-white/[0.07] to-white/[0.03] hover:from-blue-500/20 hover:to-blue-500/05 border border-white/12 hover:border-blue-500/50 rounded-xl p-2.5 transition-all cursor-pointer shadow-sm group/card relative overflow-hidden"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 text-slate-950 flex items-center justify-center shrink-0 shadow-md group-hover/card:scale-105 transition-transform">
                      <Mail className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white group-hover/card:text-blue-400 transition-colors flex items-center gap-1">
                          📧 Email Support
                        </span>
                        <ExternalLink className="w-3 h-3 text-blue-400 opacity-80" />
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        thewalgroupinfo@gmail.com
                      </p>
                    </div>
                  </div>
                </motion.button>

                {/* Footer Note */}
                <div className="pt-1 text-center">
                  <p className="text-[9.5px] text-slate-500 flex items-center justify-center gap-1">
                    <span>Available 24/7 Global Fleet Operations</span>
                  </p>
                </div>

              </div>
            )}

            {/* VIEW 2: AI BUSINESS ASSISTANT CHAT */}
            {activeView === 'chat' && (
              <div className="flex flex-col h-[380px]">
                
                {/* Chat Conversation Body */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar text-xs">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center shrink-0 text-[9px] ${
                        msg.sender === 'user' ? 'bg-[#ff7700] text-slate-950 font-bold' : 'bg-white/10 text-[#ff7700]'
                      }`}>
                        {msg.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                      </div>

                      <div className={`max-w-[85%] rounded-2xl px-2.5 py-2 leading-relaxed text-[11px] ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-[#e65c00] to-[#ff7700] text-slate-950 font-medium rounded-tr-none shadow-md'
                          : 'bg-white/8 border border-white/10 text-slate-200 rounded-tl-none backdrop-blur-md'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.text}</p>

                        {/* Discovery Call Trigger Button directly in message */}
                        {msg.suggestBooking && msg.text && (
                          <div className="mt-2 pt-2 border-t border-white/10">
                            <button
                              onClick={() => {
                                trackCtaClick('AI Chat Message - Discovery Call Button');
                                openBookDemo();
                                setIsOpen(false);
                              }}
                              className="w-full bg-gradient-to-r from-[#e65c00] via-[#ff7700] to-[#ff8512] text-slate-950 font-bold py-1.5 px-2.5 rounded-lg text-[10.5px] flex items-center justify-center gap-1 shadow-md hover:brightness-110 transition-all cursor-pointer"
                            >
                              <Calendar className="w-3 h-3" />
                              <span>Book Discovery Call</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        )}

                        <span className={`text-[8.5px] mt-1 block opacity-60 text-right ${msg.sender === 'user' ? 'text-slate-900' : 'text-slate-400'}`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-5.5 h-5.5 rounded-lg bg-white/10 text-[#ff7700] flex items-center justify-center shrink-0">
                        <Bot className="w-3 h-3" />
                      </div>
                      <div className="bg-white/8 border border-white/10 px-2.5 py-1.5 rounded-2xl rounded-tl-none flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff7700] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff7700] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff7700] animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}

                  {/* Inline Lead Qualification Form */}
                  {showLeadForm && !leadCaptured && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      onSubmit={handleLeadSubmit}
                      className="bg-white/5 border border-[#ff7700]/30 rounded-xl p-2.5 space-y-1.5 mt-1.5"
                    >
                      <p className="text-[9.5px] font-bold text-[#ff7700] flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Instant Proposal & Consultation</span>
                      </p>
                      <div className="space-y-1">
                        <input
                          type="email"
                          placeholder="Work Email..."
                          value={leadEmail}
                          onChange={(e) => setLeadEmail(e.target.value)}
                          className="w-full bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-[10.5px] text-white placeholder-slate-500 focus:outline-none focus:border-[#ff7700]"
                        />
                        <div className="grid grid-cols-2 gap-1">
                          <input
                            type="tel"
                            placeholder="Phone..."
                            value={leadPhone}
                            onChange={(e) => setLeadPhone(e.target.value)}
                            className="w-full bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-[10.5px] text-white placeholder-slate-500 focus:outline-none focus:border-[#ff7700]"
                          />
                          <input
                            type="text"
                            placeholder="Fleet / Team Size..."
                            value={leadFleet}
                            onChange={(e) => setLeadFleet(e.target.value)}
                            className="w-full bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-[10.5px] text-white placeholder-slate-500 focus:outline-none focus:border-[#ff7700]"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-white/10 hover:bg-[#ff7700] hover:text-slate-950 border border-white/20 text-white font-semibold py-1 rounded-lg text-[10px] transition-all cursor-pointer"
                      >
                        Submit Contact Info
                      </button>
                    </motion.form>
                  )}

                  {/* Suggested Topic Chips */}
                  {messages.length < 4 && !isTyping && (
                    <div className="pt-1 space-y-1">
                      <p className="text-[9px] font-medium text-slate-400 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-[#ff7700]" />
                        <span>Suggested Queries:</span>
                      </p>
                      <div className="flex flex-col gap-1">
                        {suggestedTopics.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(q)}
                            className="text-[10px] bg-white/5 hover:bg-white/12 border border-white/10 hover:border-[#ff7700]/50 text-slate-300 hover:text-white px-2 py-1 rounded-lg transition-all text-left truncate cursor-pointer"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Bar */}
                <div className="p-2 border-t border-white/10 bg-black/60 shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-1"
                  >
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask AI Business Consultant..."
                      className="flex-1 bg-white/5 border border-white/15 focus:border-[#ff7700] rounded-xl px-2.5 py-1.5 text-[11px] text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isTyping}
                      className="w-7 h-7 rounded-xl bg-gradient-to-r from-[#e65c00] to-[#ff7700] disabled:opacity-40 text-slate-950 flex items-center justify-center font-bold transition-all cursor-pointer shrink-0 hover:scale-105 active:scale-95"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </form>
                </div>

              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN FLOATING TRIGGER BUTTON */}
      <motion.div
        animate={{
          y: isOpen ? 0 : [0, -3, 0],
        }}
        transition={{
          y: {
            duration: 4,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }
        }}
        className="relative"
      >
        {/* Subtle orange ambient pulse ring */}
        <div className="absolute -inset-1 rounded-full bg-[#ff7700]/25 blur-md pointer-events-none animate-pulse opacity-70" />

        <motion.button
          layout
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          onClick={toggleWidget}
          className={`relative overflow-hidden h-11 sm:h-12 flex items-center justify-center backdrop-blur-2xl transition-all duration-300 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.85)] border ${
            isOpen 
              ? 'bg-black/90 border-[#ff7700] text-[#ff7700] shadow-[0_0_20px_rgba(255,119,0,0.45)] px-3.5 rounded-full' 
              : isHovered
                ? 'bg-[#0f0f18]/90 border-[#ff7700]/70 text-white shadow-[0_0_25px_rgba(255,119,0,0.35)] px-4 rounded-full'
                : 'bg-[#080810]/85 border-[#ff7700]/35 text-white hover:border-[#ff7700]/60 w-11 sm:w-12 rounded-full'
          }`}
        >
          {/* Light reflection sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

          {isOpen ? (
            <div className="flex items-center gap-1.5">
              <X className="w-4.5 h-4.5 stroke-[2.5]" />
              <span className="text-[11.5px] font-bold tracking-tight text-[#ff7700]">Close</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1.5">
              <div className="relative flex items-center justify-center shrink-0">
                <Sparkles className="w-4.5 h-4.5 text-white stroke-[2.2] transition-colors group-hover:text-[#ff7700]" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 border border-black animate-pulse" />
              </div>

              {/* Morph Text Reveal on Hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="overflow-hidden whitespace-nowrap flex items-center gap-1"
                  >
                    <span className="text-[11.5px] font-bold text-white tracking-tight">💬 Support</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.button>
      </motion.div>

    </div>
  );
};
