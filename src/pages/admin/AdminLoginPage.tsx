import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TextRoll } from '@/components/core/text-roll';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound,
  ArrowLeft,
  Server,
  Activity,
  Truck,
  Layers,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/Logo';
import { supabase } from '../../lib/supabase';
import { soundFx } from '../../utils/audio';

interface Props {
  navigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<Props> = ({ navigate }) => {
  const { user, loading: authLoading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot password modal state
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);
  const [resetErrorMessage, setResetErrorMessage] = useState<string | null>(null);

  // Auto redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/admin/dashboard');
    }
  }, [user, authLoading, navigate]);

  // Load saved email if remembered
  useEffect(() => {
    const savedEmail = localStorage.getItem('wal_admin_saved_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your administrator email and password.');
      return;
    }

    if (rememberMe) {
      localStorage.setItem('wal_admin_saved_email', email.trim());
    } else {
      localStorage.removeItem('wal_admin_saved_email');
    }

    soundFx.playClick();
    setSubmitting(true);
    const res = await signIn(email, password);
    setSubmitting(false);

    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setErrorMessage(res.error || 'Unable to sign in. Please check your email and password.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetErrorMessage(null);
    setResetSuccessMessage(null);

    if (!resetEmail.trim()) {
      setResetErrorMessage('Please enter your administrator email address.');
      return;
    }

    soundFx.playClick();
    setResetSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: `${window.location.origin}/admin`
      });

      if (error) {
        setResetErrorMessage(error.message || 'Failed to send recovery instructions.');
      } else {
        setResetSuccessMessage('Password recovery instructions have been sent to your email.');
      }
    } catch (err: any) {
      setResetErrorMessage(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setResetSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative overflow-hidden selection:bg-[#ff7700] selection:text-black">
      
      {/* Background Architectural Atmosphere & Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle radial ambient glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#ff7700]/[0.07] blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-[450px] h-[350px] bg-blue-900/[0.08] blur-[140px] rounded-full" />
        
        {/* Fine background grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />

        {/* Subtle geometric linear accents */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#ff7700]/20 to-transparent" />
      </div>

      {/* Top Bar Navigation (Return to Public Site) */}
      <div className="w-full max-w-5xl mb-6 flex items-center justify-between z-10">
        <button
          onClick={() => {
            soundFx.playNav();
            navigate('/');
          }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#ff7700] group-hover:-translate-x-0.5 transition-transform" />
          <span>Return to Public Site</span>
        </button>

        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">Operations System:</span>
          <span className="text-slate-200">Online</span>
        </div>
      </div>

      {/* Master Login Card (Reference Split Composition) */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl bg-[#0b101b]/90 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] relative z-10 overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
          
          {/* ========================================================================= */}
          {/* LEFT SIDE: Operations Showcase & Brand Panel (Inspired by reference visual) */}
          {/* ========================================================================= */}
          <div className="hidden md:flex md:col-span-6 lg:col-span-6 bg-gradient-to-br from-[#0c1424] via-[#090f1b] to-[#070b13] p-8 lg:p-12 border-r border-white/5 flex-col justify-between relative overflow-hidden">
            
            {/* Subtle background ambient mesh */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#ff7700]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-bold text-slate-300 uppercase tracking-widest mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff7700]" />
                Executive Operations Control
              </div>

              <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                Wal Group <br />
                <span className="text-[#ff7700]">Admin Panel</span>
              </h2>

              <p className="text-sm text-slate-300/80 mt-3.5 leading-relaxed max-w-md font-normal">
                Manage your logistics operations, Amazon DSP/AFP dispatch, dedicated lane fleets, drivers, payroll, and client services from one centralized system.
              </p>
            </div>

            {/* Central Operations Vector Illustration / Command Workstation Graphic */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="w-full max-w-sm relative">
                {/* SVG Visual Graphic inspired by high-end operations workstation */}
                <svg
                  viewBox="0 0 420 280"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto drop-shadow-2xl"
                >
                  <defs>
                    <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#131e33" />
                      <stop offset="100%" stopColor="#0a0f1d" />
                    </linearGradient>
                    <linearGradient id="accentOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff8800" />
                      <stop offset="100%" stopColor="#e64400" />
                    </linearGradient>
                    <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ff7700" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>

                  {/* Architectural Background Office / City Grid Lines */}
                  <g opacity="0.25" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3">
                    <line x1="40" y1="40" x2="40" y2="220" />
                    <line x1="120" y1="20" x2="120" y2="220" />
                    <line x1="200" y1="30" x2="200" y2="220" />
                    <line x1="280" y1="20" x2="280" y2="220" />
                    <line x1="360" y1="50" x2="360" y2="220" />
                    <line x1="20" y1="180" x2="400" y2="180" />
                  </g>

                  {/* Skyline / Logistics Hub Silhouette in background */}
                  <rect x="50" y="70" width="35" height="110" rx="3" fill="#152238" opacity="0.6" />
                  <rect x="95" y="45" width="45" height="135" rx="3" fill="#1a2b47" opacity="0.7" />
                  <rect x="150" y="85" width="40" height="95" rx="3" fill="#132036" opacity="0.5" />
                  <rect x="250" y="60" width="50" height="120" rx="3" fill="#182944" opacity="0.65" />
                  <rect x="310" y="75" width="45" height="105" rx="3" fill="#152238" opacity="0.55" />

                  {/* Workstation Desk Table */}
                  <path
                    d="M 30 220 L 390 220 L 380 236 L 40 236 Z"
                    fill="#1e293b"
                    stroke="#334155"
                    strokeWidth="1.5"
                  />
                  <line x1="60" y1="236" x2="60" y2="275" stroke="#334155" strokeWidth="3" />
                  <line x1="360" y1="236" x2="360" y2="275" stroke="#334155" strokeWidth="3" />

                  {/* Central Main Command Monitor */}
                  <rect x="130" y="90" width="160" height="105" rx="6" fill="url(#screenGrad)" stroke="#475569" strokeWidth="2" />
                  <rect x="136" y="96" width="148" height="93" rx="4" fill="#070b14" />
                  
                  {/* Monitor Stand */}
                  <path d="M 200 195 L 220 195 L 225 220 L 195 220 Z" fill="#334155" />
                  <rect x="180" y="218" width="60" height="4" rx="2" fill="#64748b" />

                  {/* Monitor Content UI Elements (Charts, Metrics, Fleet telemetry) */}
                  {/* Top Bar on monitor */}
                  <rect x="142" y="102" width="136" height="8" rx="2" fill="#1e293b" />
                  <circle cx="148" cy="106" r="2" fill="#ef4444" />
                  <circle cx="155" cy="106" r="2" fill="#eab308" />
                  <circle cx="162" cy="106" r="2" fill="#22c55e" />
                  
                  {/* Mini graph lines & metric cards on screen */}
                  <rect x="142" y="116" width="40" height="30" rx="3" fill="#0f172a" stroke="#ff7700" strokeWidth="1" />
                  <path d="M 146 138 L 155 130 L 165 134 L 176 122" fill="none" stroke="#ff7700" strokeWidth="1.5" strokeLinecap="round" />
                  
                  <rect x="188" y="116" width="42" height="30" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                  <rect x="193" y="122" width="20" height="4" rx="1" fill="#38bdf8" />
                  <rect x="193" y="130" width="30" height="3" rx="1" fill="#64748b" />
                  <rect x="193" y="136" width="24" height="3" rx="1" fill="#64748b" />

                  <rect x="236" y="116" width="42" height="30" rx="3" fill="#0f172a" stroke="#22c55e" strokeWidth="1" />
                  <circle cx="257" cy="131" r="7" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="30 15" fill="none" />

                  {/* Bottom table rows on screen */}
                  <rect x="142" y="152" width="136" height="5" rx="1" fill="#1e293b" />
                  <rect x="142" y="161" width="136" height="5" rx="1" fill="#1e293b" opacity="0.6" />
                  <rect x="142" y="170" width="136" height="5" rx="1" fill="#1e293b" opacity="0.4" />
                  <rect x="142" y="179" width="80" height="4" rx="1" fill="#ff7700" opacity="0.8" />

                  {/* Side Secondary Screen (Tablet / Vertical Monitor) */}
                  <rect x="305" y="115" width="55" height="80" rx="4" fill="url(#screenGrad)" stroke="#334155" strokeWidth="1.5" />
                  <rect x="310" y="120" width="45" height="70" rx="2" fill="#070b14" />
                  <rect x="314" y="126" width="37" height="6" rx="1" fill="#ff7700" opacity="0.4" />
                  <rect x="314" y="136" width="37" height="4" rx="1" fill="#1e293b" />
                  <rect x="314" y="144" width="37" height="4" rx="1" fill="#1e293b" />
                  <rect x="314" y="152" width="37" height="4" rx="1" fill="#1e293b" />
                  <rect x="314" y="160" width="37" height="4" rx="1" fill="#1e293b" />
                  <circle cx="332" cy="177" r="4" fill="#ff7700" />

                  {/* Keyboard & Mouse on Desk */}
                  <rect x="165" y="224" width="90" height="8" rx="2" fill="#334155" stroke="#475569" strokeWidth="0.8" />
                  <rect x="270" y="225" width="12" height="7" rx="3" fill="#475569" />

                  {/* Operations Specialist Silhouette / Line Drawing at Desk (Reference-inspired) */}
                  {/* Subtle office plant */}
                  <path d="M 65 220 L 75 220 L 73 205 L 67 205 Z" fill="#334155" />
                  <path d="M 70 205 Q 60 185 55 180 Q 65 190 70 205" fill="#10b981" opacity="0.7" />
                  <path d="M 70 205 Q 75 175 80 170 Q 77 190 70 205" fill="#10b981" opacity="0.8" />
                  <path d="M 70 205 Q 85 190 90 188 Q 80 198 70 205" fill="#10b981" opacity="0.6" />

                  {/* Connecting telemetry pulse lines */}
                  <path d="M 90 120 Q 110 100 130 110" fill="none" stroke="url(#lineGlow)" strokeWidth="1.5" strokeDasharray="3 3" />
                  <path d="M 290 140 Q 300 130 305 135" fill="none" stroke="url(#lineGlow)" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>
              </div>
            </div>

            {/* Bottom Telemetry Badges */}
            <div className="relative z-10 pt-4 border-t border-white/5 grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] text-slate-400 font-medium">Uptime SLA</p>
                <p className="text-xs font-bold text-emerald-400 mt-0.5">99.98%</p>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] text-slate-400 font-medium">Encryption</p>
                <p className="text-xs font-bold text-white mt-0.5">256-Bit TLS</p>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] text-slate-400 font-medium">Access Tier</p>
                <p className="text-xs font-bold text-[#ff7700] mt-0.5">Executive</p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT SIDE: Authentication Form (Clean, Classic, Executive)               */}
          {/* ========================================================================= */}
          <div className="md:col-span-6 lg:col-span-6 p-7 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#0b101b]">
            
            {/* Top Brand Logo */}
            <div className="mb-6 flex flex-col items-center sm:items-start">
              <Logo size="md" onClick={() => navigate('/')} />
              
              <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-[#ff7700]" />
                <span className="text-[10px] font-bold tracking-wider uppercase">
                  Secure Admin Access
                </span>
              </div>
            </div>

            {/* Heading & Subtitle */}
            <div className="mb-6 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                <TextRoll className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Administrator Login
                </TextRoll>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                Enter your credentials to access the system.
              </p>
            </div>

            {/* Error Message Alert */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-xs text-red-300 overflow-hidden"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">{errorMessage}</p>
                    <p className="text-[11px] text-red-400/80 mt-0.5">
                      Ensure your email and password match your authorized account.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Address Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#ff7700] transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email Address"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 bg-[#060912] border border-white/10 hover:border-white/20 focus:border-[#ff7700] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#ff7700] transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setResetSuccessMessage(null);
                      setResetErrorMessage(null);
                      setForgotPasswordOpen(true);
                    }}
                    className="text-xs font-medium text-[#ff7700] hover:text-[#ff8800] hover:underline cursor-pointer transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#ff7700] transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-11 py-3 bg-[#060912] border border-white/10 hover:border-white/20 focus:border-[#ff7700] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#ff7700] transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-200 cursor-pointer transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Toggle */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-black/40 text-[#ff7700] focus:ring-[#ff7700] focus:ring-offset-0 focus:ring-opacity-50 cursor-pointer accent-[#ff7700]"
                  />
                  <span className="text-xs text-slate-400 hover:text-slate-300 transition-colors">
                    Remember this device
                  </span>
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={submitting || authLoading}
                className="w-full mt-3 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#ff7700] to-[#ea580c] hover:from-[#ff8800] hover:to-[#f97316] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Security Notice Footer */}
            <div className="mt-8 pt-5 border-t border-white/5">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  <span>Authorized Personnel Only</span>
                </div>
                <span>TLS 256-bit Encrypted</span>
              </div>
            </div>
          </div>

        </div>
      </motion.div>

      {/* Forgot Password Modal Dialog */}
      <AnimatePresence>
        {forgotPasswordOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-[#0c1220] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#ff7700]/10 border border-[#ff7700]/20 text-[#ff7700]">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Reset Password</h3>
                    <p className="text-xs text-slate-400">Admin Account Recovery</p>
                  </div>
                </div>
                <button
                  onClick={() => setForgotPasswordOpen(false)}
                  className="text-slate-400 hover:text-white text-xs font-semibold p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
                >
                  Close
                </button>
              </div>

              {resetSuccessMessage ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Instructions Sent</span>
                  </div>
                  <p>{resetSuccessMessage}</p>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(false)}
                    className="w-full mt-3 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Enter the administrator email associated with your account. A secure password reset link will be dispatched to your inbox.
                  </p>

                  {resetErrorMessage && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{resetErrorMessage}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Administrator Email
                    </label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="admin@walgroup.com"
                      className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 focus:border-[#ff7700] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#ff7700]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={resetSubmitting}
                      className="px-5 py-2.5 rounded-xl bg-[#ff7700] hover:bg-[#ff8800] text-white font-bold text-xs transition-all shadow-md shadow-orange-500/20 disabled:opacity-50 cursor-pointer"
                    >
                      {resetSubmitting ? 'Sending...' : 'Send Recovery Link'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Subtle Copyright & Security Line */}
      <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <span>&copy; {new Date().getFullYear()} The Wal Group Inc.</span>
        <span>&bull;</span>
        <span>Operational Administration Portal</span>
      </div>
    </div>
  );
};

