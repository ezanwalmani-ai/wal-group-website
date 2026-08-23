import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
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
  Database,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  navigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<Props> = ({ navigate }) => {
  const { user, loading: authLoading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/admin/dashboard');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your administrator email and password.');
      return;
    }

    setSubmitting(true);
    const res = await signIn(email, password);
    setSubmitting(false);

    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setErrorMessage(res.error || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-[#ff7700] selection:text-black">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#ff7700]/15 to-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-orange-600/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header Branding */}
        <div className="text-center mb-8">
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all text-xs font-semibold text-slate-300 hover:text-white mb-6 group cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#ff7700] group-hover:scale-125 transition-transform" />
            <span>Wal Group Operational Portal</span>
            <span className="text-slate-500">&larr; Public Site</span>
          </button>

          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ff7700] to-amber-500 p-0.5 shadow-xl shadow-orange-500/20">
              <div className="w-full h-full bg-[#070b14] rounded-[14px] flex items-center justify-center text-white font-black text-xl">
                W
              </div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Executive Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs mx-auto">
            Supabase Authenticated Control Center for Leads, Bookings, Resumes & Support
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-[#0b1220]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative shadow-black/80">
          <div className="flex items-center justify-between pb-5 border-b border-white/5 mb-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#ff7700]" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Supabase Auth Protected
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Direct Postgres Link</span>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-xs text-red-300"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{errorMessage}</p>
                <p className="text-[11px] text-red-400/80 mt-0.5">
                  Verify the email and password in your Supabase project's Authentication &gt; Users table.
                </p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@walgroup.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 focus:border-[#ff7700] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#ff7700] transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/10 focus:border-[#ff7700] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#ff7700] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || authLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff7700] to-amber-500 hover:from-[#ff8811] hover:to-amber-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Executive Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Supabase Information / Quick Setup Tip */}
          <div className="mt-6 pt-5 border-t border-white/5 space-y-3">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 leading-relaxed">
              <div className="flex items-center gap-1.5 font-semibold text-slate-300 mb-1">
                <Database className="w-3.5 h-3.5 text-[#ff7700]" />
                <span>Supabase Auth Project Connected</span>
              </div>
              <p>
                Sign in with any user registered in your Supabase Auth project (<code className="text-amber-300 font-mono text-[10px]">yzkjivknyalgfnpklxgr</code>). If you haven't created an admin user yet, create one in the Supabase Dashboard under <strong>Authentication &gt; Users &gt; Add User</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <span>&copy; {new Date().getFullYear()} Wal Group Operations</span>
          <span>&bull;</span>
          <span>End-to-End Encrypted Session</span>
        </div>
      </motion.div>
    </div>
  );
};
