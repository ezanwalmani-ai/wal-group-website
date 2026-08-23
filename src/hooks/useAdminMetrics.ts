import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

export interface MetricItem {
  count: number;
  loading: boolean;
  error: string | null;
  table: string;
}

export interface AdminMetricsData {
  contacts: MetricItem;
  leads: MetricItem;
  jobs: MetricItem;
  bookings: MetricItem;
  tickets: MetricItem;
  aiLogs: MetricItem;
  totalInbound: number;
}

export interface UseAdminMetricsOptions {
  /**
   * Cache Time-To-Live in milliseconds.
   * Default: 60,000 ms (1 minute).
   */
  ttlMs?: number;
  /**
   * Whether to automatically fetch metrics on hook mount.
   * Default: true
   */
  autoFetch?: boolean;
  /**
   * Whether in-memory and local caching is enabled.
   * Default: true
   */
  enableCache?: boolean;
}

export interface UseAdminMetricsReturn {
  metrics: AdminMetricsData;
  loading: boolean;
  isRefetching: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: (force?: boolean) => Promise<AdminMetricsData>;
  clearCache: () => void;
}

// In-memory cache singleton to avoid duplicate network calls across component mounts
interface CachedMetricsEntry {
  data: AdminMetricsData;
  timestamp: number;
}

let memoryCache: CachedMetricsEntry | null = null;
const CACHE_KEY = 'wal_group_admin_metrics_cache_v1';

const INITIAL_METRICS_DATA: AdminMetricsData = {
  contacts: { count: 0, loading: true, error: null, table: 'contact_submissions' },
  leads: { count: 0, loading: true, error: null, table: 'leads' },
  jobs: { count: 0, loading: true, error: null, table: 'job_applications' },
  bookings: { count: 0, loading: true, error: null, table: 'bookings' },
  tickets: { count: 0, loading: true, error: null, table: 'tickets' },
  aiLogs: { count: 0, loading: true, error: null, table: 'ai_logs' },
  totalInbound: 0
};

/**
 * Load cached data from SessionStorage or in-memory
 */
const getStoredCache = (ttlMs: number): CachedMetricsEntry | null => {
  const now = Date.now();

  // 1. Check in-memory cache
  if (memoryCache && now - memoryCache.timestamp < ttlMs) {
    return memoryCache;
  }

  // 2. Check sessionStorage fallback
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const stored = sessionStorage.getItem(CACHE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CachedMetricsEntry;
        if (parsed && typeof parsed.timestamp === 'number' && now - parsed.timestamp < ttlMs) {
          memoryCache = parsed;
          return parsed;
        }
      }
    } catch {
      // Ignore sessionStorage read errors
    }
  }

  return null;
};

/**
 * Persist cache to memory and SessionStorage
 */
const setStoredCache = (data: AdminMetricsData): void => {
  const entry: CachedMetricsEntry = {
    data,
    timestamp: Date.now()
  };
  memoryCache = entry;

  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry));
    } catch {
      // Ignore quota exceeded or storage disabled
    }
  }
};

/**
 * Custom React hook `useAdminMetrics`
 * 
 * Fetches and caches counts for contacts, leads, job applications, bookings, tickets, and AI logs from Supabase.
 * Provides robust error handling, caching with configurable TTL, and granular loading states.
 */
export function useAdminMetrics(options: UseAdminMetricsOptions = {}): UseAdminMetricsReturn {
  const {
    ttlMs = 60000, // 1 minute default TTL
    autoFetch = true,
    enableCache = true
  } = options;

  const cachedEntry = enableCache ? getStoredCache(ttlMs) : null;

  const [metrics, setMetrics] = useState<AdminMetricsData>(() => {
    if (cachedEntry) {
      return {
        ...cachedEntry.data,
        contacts: { ...cachedEntry.data.contacts, loading: false },
        leads: { ...cachedEntry.data.leads, loading: false },
        jobs: { ...cachedEntry.data.jobs, loading: false },
        bookings: { ...cachedEntry.data.bookings, loading: false },
        tickets: { ...cachedEntry.data.tickets, loading: false },
        aiLogs: { ...cachedEntry.data.aiLogs, loading: false }
      };
    }
    return INITIAL_METRICS_DATA;
  });

  const [loading, setLoading] = useState<boolean>(!cachedEntry);
  const [isRefetching, setIsRefetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(
    cachedEntry ? new Date(cachedEntry.timestamp) : null
  );

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Core fetch handler querying counts across Supabase tables in parallel
   */
  const fetchMetrics = useCallback(async (force = false): Promise<AdminMetricsData> => {
    // Check if cache is still fresh when force is false
    if (!force && enableCache) {
      const freshCache = getStoredCache(ttlMs);
      if (freshCache) {
        if (isMountedRef.current) {
          setMetrics(freshCache.data);
          setLoading(false);
          setIsRefetching(false);
          setLastUpdated(new Date(freshCache.timestamp));
        }
        return freshCache.data;
      }
    }

    if (isMountedRef.current) {
      if (metrics.contacts.count > 0 || metrics.leads.count > 0 || metrics.jobs.count > 0) {
        setIsRefetching(true);
      } else {
        setLoading(true);
      }
      setError(null);
    }

    const nextMetrics: AdminMetricsData = {
      contacts: { count: 0, loading: false, error: null, table: 'contact_submissions' },
      leads: { count: 0, loading: false, error: null, table: 'leads' },
      jobs: { count: 0, loading: false, error: null, table: 'job_applications' },
      bookings: { count: 0, loading: false, error: null, table: 'bookings' },
      tickets: { count: 0, loading: false, error: null, table: 'tickets' },
      aiLogs: { count: 0, loading: false, error: null, table: 'ai_logs' },
      totalInbound: 0
    };

    let overallError: string | null = null;

    try {
      // Run queries with head: true to retrieve exact count efficiently without transferring row data
      const [
        contactsRes,
        leadsRes,
        jobsRes,
        bookingsRes,
        ticketsRes,
        aiLogsRes
      ] = await Promise.allSettled([
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('job_applications').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('tickets').select('*', { count: 'exact', head: true }),
        supabase.from('ai_logs').select('*', { count: 'exact', head: true })
      ]);

      // 1. Process Contacts
      if (contactsRes.status === 'fulfilled') {
        if (contactsRes.value.error) {
          nextMetrics.contacts.error = contactsRes.value.error.message;
        } else {
          nextMetrics.contacts.count = contactsRes.value.count ?? 0;
        }
      } else {
        nextMetrics.contacts.error = contactsRes.reason?.message || 'Failed to query contact submissions';
      }

      // 2. Process Leads
      if (leadsRes.status === 'fulfilled') {
        if (leadsRes.value.error) {
          nextMetrics.leads.error = leadsRes.value.error.message;
        } else {
          nextMetrics.leads.count = leadsRes.value.count ?? 0;
        }
      } else {
        nextMetrics.leads.error = leadsRes.reason?.message || 'Failed to query leads';
      }

      // 3. Process Jobs
      if (jobsRes.status === 'fulfilled') {
        if (jobsRes.value.error) {
          nextMetrics.jobs.error = jobsRes.value.error.message;
        } else {
          nextMetrics.jobs.count = jobsRes.value.count ?? 0;
        }
      } else {
        nextMetrics.jobs.error = jobsRes.reason?.message || 'Failed to query job applications';
      }

      // 4. Process Bookings
      if (bookingsRes.status === 'fulfilled') {
        if (bookingsRes.value.error) {
          nextMetrics.bookings.error = bookingsRes.value.error.message;
        } else {
          nextMetrics.bookings.count = bookingsRes.value.count ?? 0;
        }
      } else {
        nextMetrics.bookings.error = bookingsRes.reason?.message || 'Failed to query bookings';
      }

      // 5. Process Tickets
      if (ticketsRes.status === 'fulfilled') {
        if (ticketsRes.value.error) {
          nextMetrics.tickets.error = ticketsRes.value.error.message;
        } else {
          nextMetrics.tickets.count = ticketsRes.value.count ?? 0;
        }
      } else {
        nextMetrics.tickets.error = ticketsRes.reason?.message || 'Failed to query support tickets';
      }

      // 6. Process AI Logs
      if (aiLogsRes.status === 'fulfilled') {
        if (aiLogsRes.value.error) {
          nextMetrics.aiLogs.error = aiLogsRes.value.error.message;
        } else {
          nextMetrics.aiLogs.count = aiLogsRes.value.count ?? 0;
        }
      } else {
        nextMetrics.aiLogs.error = aiLogsRes.reason?.message || 'Failed to query AI logs';
      }

      // Calculate Total Inbound Volume
      nextMetrics.totalInbound =
        nextMetrics.contacts.count +
        nextMetrics.leads.count +
        nextMetrics.jobs.count +
        nextMetrics.bookings.count;

      // Check if all queries failed
      const allErrors = [
        nextMetrics.contacts.error,
        nextMetrics.leads.error,
        nextMetrics.jobs.error,
        nextMetrics.bookings.error,
        nextMetrics.tickets.error,
        nextMetrics.aiLogs.error
      ].filter(Boolean);

      if (allErrors.length === 6) {
        overallError = 'Unable to reach Supabase database tables. Please check credentials or SQL schema.';
      }

      // Update cache
      if (enableCache) {
        setStoredCache(nextMetrics);
      }
    } catch (err: any) {
      overallError = err?.message || 'An unexpected error occurred while fetching metrics';
    } finally {
      if (isMountedRef.current) {
        setMetrics(nextMetrics);
        setError(overallError);
        setLoading(false);
        setIsRefetching(false);
        setLastUpdated(new Date());
      }
    }

    return nextMetrics;
  }, [enableCache, ttlMs, metrics.contacts.count, metrics.leads.count, metrics.jobs.count]);

  const clearCache = useCallback(() => {
    memoryCache = null;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.removeItem(CACHE_KEY);
      } catch {
        // Ignore
      }
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchMetrics(false);
    }
  }, [autoFetch, fetchMetrics]);

  return {
    metrics,
    loading,
    isRefetching,
    error,
    lastUpdated,
    refetch: fetchMetrics,
    clearCache
  };
}
