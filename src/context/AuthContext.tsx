import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.warn('[Supabase Auth Warning] Error getting session:', error.message);
        setSession(null);
        setUser(null);
      } else {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      }
    } catch (err) {
      console.error('[Supabase Auth Exception] Session error:', err);
      setSession(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial session retrieval
    refreshSession();

    // Listen for auth state changes across tabs/windows
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const trimmedEmail = email.trim();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: password
      });

      if (error) {
        // User-friendly error messaging without leaking sensitive credentials
        let friendlyMessage = error.message;
        if (error.message.includes('Invalid login credentials')) {
          friendlyMessage = 'Invalid email or password. Please verify your administrator credentials.';
        } else if (error.message.includes('Email not confirmed')) {
          friendlyMessage = 'Email address has not been confirmed. Check your inbox or Supabase dashboard.';
        } else if (error.message.includes('Too many requests')) {
          friendlyMessage = 'Too many failed login attempts. Please wait a few minutes before trying again.';
        }
        return { success: false, error: friendlyMessage };
      }

      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        return { success: true };
      }

      return { success: false, error: 'Authentication could not be established. Please try again.' };
    } catch (err: any) {
      console.error('[Supabase Auth Exception] Login failure:', err);
      return { 
        success: false, 
        error: err?.message || 'A network error occurred while contacting the authentication service.' 
      };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[Supabase Auth Warning] Sign out error:', err);
    } finally {
      setSession(null);
      setUser(null);
    }
  };

  // Robust Admin Authorization Verification
  // Verifies if the authenticated user has administrative privileges via role metadata or authorized admin email/domain
  const isAdmin = Boolean(
    user && (
      user.app_metadata?.role === 'admin' ||
      user.user_metadata?.role === 'admin' ||
      user.app_metadata?.is_admin === true ||
      user.user_metadata?.is_admin === true ||
      (user.email && (
        user.email.toLowerCase().endsWith('@walgroup.com') ||
        user.email.toLowerCase() === 'thewalgroupinfo@gmail.com' ||
        user.email.toLowerCase() === 'thewalgroups@gmail.com' ||
        user.email.toLowerCase().includes('admin')
      ))
    )
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAdmin,
        signIn,
        signOut,
        refreshSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
