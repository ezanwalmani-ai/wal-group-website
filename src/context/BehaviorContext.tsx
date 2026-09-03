import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export interface UserBehaviorEvent {
  timestamp: string;
  type: 'page_view' | 'service_view' | 'cta_click' | 'form_start' | 'scroll_depth' | 'custom_action';
  path: string;
  details?: string;
}

export type ContactMethod = 'whatsapp' | 'email' | 'phone' | 'linkedin' | 'instagram';

export interface ContactPreferenceStats {
  whatsappClicks: number;
  emailClicks: number;
  phoneClicks: number;
  linkedinClicks: number;
  instagramClicks: number;
  totalContactClicks: number;
  preferredMethod: ContactMethod | 'none';
  lastClickedMethod?: ContactMethod;
  lastClickedTimestamp?: string;
  detailsHistory: Array<{
    method: ContactMethod;
    target: string;
    source: string;
    timestamp: string;
  }>;
}

export interface UserBehaviorState {
  pagesVisited: string[];
  servicesViewed: string[];
  ctaClicks: number;
  timeSpentSeconds: number;
  maxScrollDepth: number;
  events: UserBehaviorEvent[];
  lastPageVisited: string;
  contactPreferences: ContactPreferenceStats;
}

interface BehaviorContextType {
  behavior: UserBehaviorState;
  trackPageView: (path: string) => void;
  trackServiceView: (serviceName: string) => void;
  trackCtaClick: (ctaName: string) => void;
  trackFormStart: (formName: string) => void;
  trackAction: (actionName: string, data?: any) => void;
  trackContactClick: (
    method: ContactMethod,
    details?: { source?: string; target?: string; label?: string } | string
  ) => void;
  getPreferredContactMethod: () => ContactMethod | 'none';
  resetContactPreferences: () => void;
  getPersonalizedGreeting: () => string;
}

export const initialContactPreferences: ContactPreferenceStats = {
  whatsappClicks: 0,
  emailClicks: 0,
  phoneClicks: 0,
  linkedinClicks: 0,
  instagramClicks: 0,
  totalContactClicks: 0,
  preferredMethod: 'none',
  detailsHistory: []
};

const initialBehavior: UserBehaviorState = {
  pagesVisited: [],
  servicesViewed: [],
  ctaClicks: 0,
  timeSpentSeconds: 0,
  maxScrollDepth: 0,
  events: [],
  lastPageVisited: '/',
  contactPreferences: initialContactPreferences
};

const BehaviorContext = createContext<BehaviorContextType>({
  behavior: initialBehavior,
  trackPageView: () => {},
  trackServiceView: () => {},
  trackCtaClick: () => {},
  trackFormStart: () => {},
  trackAction: () => {},
  trackContactClick: () => {},
  getPreferredContactMethod: () => 'none',
  resetContactPreferences: () => {},
  getPersonalizedGreeting: () => "Welcome to Wal Group! I'm your AI Business Consultant. How can I assist your logistics or backend operations today?"
});

export const BehaviorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [behavior, setBehavior] = useState<UserBehaviorState>(() => {
    try {
      const savedStr = sessionStorage.getItem('wal_behavior_state');
      if (savedStr) {
        const saved = JSON.parse(savedStr);
        return {
          ...initialBehavior,
          ...saved,
          contactPreferences: saved.contactPreferences 
            ? { ...initialContactPreferences, ...saved.contactPreferences }
            : initialContactPreferences
        };
      }
      return initialBehavior;
    } catch {
      return initialBehavior;
    }
  });

  // Save behavior to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('wal_behavior_state', JSON.stringify(behavior));
    } catch {
      // ignore
    }
  }, [behavior]);

  // Track timer spent
  useEffect(() => {
    const timer = setInterval(() => {
      setBehavior((prev) => ({
        ...prev,
        timeSpentSeconds: prev.timeSpentSeconds + 1
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const depth = Math.round((window.scrollY / scrollHeight) * 100);
        setBehavior((prev) => {
          if (depth > prev.maxScrollDepth) {
            return { ...prev, maxScrollDepth: depth };
          }
          return prev;
        });
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const trackPageView = useCallback((path: string) => {
    setBehavior((prev) => {
      const isAlreadyVisited = prev.pagesVisited.includes(path);
      const isSameLastPage = prev.lastPageVisited === path;

      if (isAlreadyVisited && isSameLastPage && prev.events.length > 0 && prev.events[0].type === 'page_view' && prev.events[0].path === path) {
        return prev;
      }

      const updatedPages = isAlreadyVisited 
        ? prev.pagesVisited 
        : [...prev.pagesVisited, path];

      const newEvent: UserBehaviorEvent = {
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'page_view',
        path,
      };

      return {
        ...prev,
        pagesVisited: updatedPages,
        lastPageVisited: path,
        events: [newEvent, ...prev.events].slice(0, 30)
      };
    });
  }, []);

  const trackServiceView = useCallback((serviceName: string) => {
    setBehavior((prev) => {
      const updatedServices = prev.servicesViewed.includes(serviceName)
        ? prev.servicesViewed
        : [...prev.servicesViewed, serviceName];

      const newEvent: UserBehaviorEvent = {
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'service_view',
        path: prev.lastPageVisited,
        details: serviceName
      };

      return {
        ...prev,
        servicesViewed: updatedServices,
        events: [newEvent, ...prev.events].slice(0, 30)
      };
    });
  }, []);

  const trackCtaClick = useCallback((ctaName: string) => {
    setBehavior((prev) => ({
      ...prev,
      ctaClicks: prev.ctaClicks + 1,
      events: [{
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'cta_click',
        path: prev.lastPageVisited,
        details: ctaName
      }, ...prev.events].slice(0, 30)
    }));
  }, []);

  const trackFormStart = useCallback((formName: string) => {
    setBehavior((prev) => ({
      ...prev,
      events: [{
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'form_start',
        path: prev.lastPageVisited,
        details: formName
      }, ...prev.events].slice(0, 30)
    }));
  }, []);

  const trackAction = useCallback((actionName: string, data?: any) => {
    setBehavior((prev) => ({
      ...prev,
      events: [{
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'custom_action',
        path: prev.lastPageVisited,
        details: typeof data === 'string' ? `${actionName}: ${data}` : `${actionName}${data ? `: ${JSON.stringify(data)}` : ''}`
      }, ...prev.events].slice(0, 30)
    }));
  }, []);

  const trackContactClick = useCallback((
    method: ContactMethod,
    detailsInput?: { source?: string; target?: string; label?: string } | string
  ) => {
    const source = typeof detailsInput === 'object' ? detailsInput.source || 'footer' : 'footer';
    const target = typeof detailsInput === 'object' ? detailsInput.target || '' : (detailsInput || '');
    const label = typeof detailsInput === 'object' ? detailsInput.label || '' : '';

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fullTimestamp = new Date().toISOString();

    setBehavior((prev) => {
      const currentPrefs = prev.contactPreferences || { ...initialContactPreferences };

      const whatsappClicks = method === 'whatsapp' ? currentPrefs.whatsappClicks + 1 : currentPrefs.whatsappClicks;
      const emailClicks = method === 'email' ? currentPrefs.emailClicks + 1 : currentPrefs.emailClicks;
      const phoneClicks = method === 'phone' ? currentPrefs.phoneClicks + 1 : currentPrefs.phoneClicks;
      const linkedinClicks = method === 'linkedin' ? currentPrefs.linkedinClicks + 1 : currentPrefs.linkedinClicks;
      const instagramClicks = method === 'instagram' ? currentPrefs.instagramClicks + 1 : currentPrefs.instagramClicks;
      const totalContactClicks = currentPrefs.totalContactClicks + 1;

      // Determine preferred method: prioritize comparing WhatsApp vs Email preference
      let preferredMethod: ContactMethod = method;
      if (whatsappClicks > emailClicks) {
        preferredMethod = 'whatsapp';
      } else if (emailClicks > whatsappClicks) {
        preferredMethod = 'email';
      } else {
        // Equal counts - the most recently clicked method takes precedence
        preferredMethod = method;
      }

      const newHistoryItem = {
        method,
        target,
        source,
        timestamp: fullTimestamp
      };

      const updatedPrefs: ContactPreferenceStats = {
        whatsappClicks,
        emailClicks,
        phoneClicks,
        linkedinClicks,
        instagramClicks,
        totalContactClicks,
        preferredMethod,
        lastClickedMethod: method,
        lastClickedTimestamp: fullTimestamp,
        detailsHistory: [newHistoryItem, ...(currentPrefs.detailsHistory || [])].slice(0, 50)
      };

      const descriptor = target || label || 'direct';
      const eventDetails = `Contact Preference [${method.toUpperCase()}]: ${descriptor} via ${source} (Preferred: ${preferredMethod})`;

      const newEvent: UserBehaviorEvent = {
        timestamp,
        type: 'cta_click',
        path: prev.lastPageVisited,
        details: eventDetails
      };

      // Persist to localStorage for cross-session insight
      try {
        localStorage.setItem('wal_preferred_contact_method', preferredMethod);
        localStorage.setItem('wal_contact_stats', JSON.stringify({
          whatsappClicks,
          emailClicks,
          preferredMethod,
          lastClickedMethod: method,
          updatedAt: fullTimestamp
        }));
      } catch {
        // ignore
      }

      return {
        ...prev,
        ctaClicks: prev.ctaClicks + 1,
        contactPreferences: updatedPrefs,
        events: [newEvent, ...prev.events].slice(0, 30)
      };
    });
  }, []);

  const getPreferredContactMethod = useCallback((): ContactMethod | 'none' => {
    return behavior.contactPreferences?.preferredMethod || 'none';
  }, [behavior.contactPreferences]);

  const resetContactPreferences = useCallback(() => {
    setBehavior((prev) => ({
      ...prev,
      contactPreferences: { ...initialContactPreferences }
    }));
    try {
      localStorage.removeItem('wal_preferred_contact_method');
      localStorage.removeItem('wal_contact_stats');
    } catch {
      // ignore
    }
  }, []);

  const getPersonalizedGreeting = useCallback((): string => {
    const { lastPageVisited, servicesViewed, contactPreferences } = behavior;

    if (contactPreferences?.preferredMethod === 'whatsapp') {
      return "Welcome back to Wal Group! We noted your preference for WhatsApp dispatch updates. Reach our active desk anytime at +91 6363698148, or let me know how I can assist your operations today!";
    }
    if (contactPreferences?.preferredMethod === 'email') {
      return "Welcome back to Wal Group! We noted your preference for direct email correspondence. Send inquiries directly to thewalgroups@gmail.com, or ask me any question right now!";
    }

    if (lastPageVisited.includes('/services/dsp-dispatch') || servicesViewed.includes('Amazon DSP Dispatch')) {
      return "I noticed you're exploring our Amazon DSP Dispatch & Route Optimization solutions. Are you currently operating a DSP fleet or scaling routes? I'd be glad to share how our 24/7 dispatch unit operates.";
    }
    if (lastPageVisited.includes('/services/dsp-accounting') || servicesViewed.includes('DSP Accounting & Payroll')) {
      return "I see you're viewing our Amazon DSP Accounting & Payroll service. We specialize in 14-day Amazon scorecard reconciliations and automated driver payroll. What fleet size are you managing?";
    }
    if (lastPageVisited.includes('/services/afp-dispatch') || lastPageVisited.includes('/services/dedicated-lane')) {
      return "Looking to scale your Freight / AFP Linehaul or Dedicated Lanes? Our 12-Step POD management and 24/7 HOS monitoring ensure zero Amazon safety infractions. How can I help today?";
    }
    if (lastPageVisited.includes('/services/website-design') || servicesViewed.includes('Website Development')) {
      return "Hi there! Building an enterprise website for your logistics company or corporate brand? We build ultra-fast, high-converting digital platforms tailored for your market.";
    }
    if (lastPageVisited.includes('/careers')) {
      return "Welcome! Looking to join the Wal Group remote operations or tech team? I can help guide you through open positions and our interview process.";
    }
    return "Welcome to Wal Group! I am your AI Business Consultant. Whether you need 24/7 Amazon DSP dispatch, payroll reconciliation, web development, or BPO Virtual Assistants, I'm here to assist!";
  }, [behavior]);

  const value = useMemo(() => ({
    behavior,
    trackPageView,
    trackServiceView,
    trackCtaClick,
    trackFormStart,
    trackAction,
    trackContactClick,
    getPreferredContactMethod,
    resetContactPreferences,
    getPersonalizedGreeting
  }), [
    behavior,
    trackPageView,
    trackServiceView,
    trackCtaClick,
    trackFormStart,
    trackAction,
    trackContactClick,
    getPreferredContactMethod,
    resetContactPreferences,
    getPersonalizedGreeting
  ]);

  return (
    <BehaviorContext.Provider value={value}>
      {children}
    </BehaviorContext.Provider>
  );
};

export const useBehavior = () => useContext(BehaviorContext);
