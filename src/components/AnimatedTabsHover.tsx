import React, { useMemo } from 'react';
import { AnimatedBackground } from './core/animated-background';
import { ChevronDown } from 'lucide-react';

export interface NavTabItem {
  id: string;
  label: string;
  path: string;
  hasDropdown?: boolean;
  dropdownType?: 'services' | 'dsp' | 'afp' | 'bpo';
}

export interface AnimatedTabsHoverProps {
  currentPath?: string;
  navigate?: (path: string) => void;
  className?: string;
  onDropdownHover?: (type: 'services' | 'dsp' | 'afp' | 'bpo' | null) => void;
  activeDropdown?: 'services' | 'dsp' | 'afp' | 'bpo' | null;
}

export const WAL_NAV_TABS: NavTabItem[] = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'about', label: 'About', path: '/about' },
  { id: 'services', label: 'Services', path: '/services', hasDropdown: true, dropdownType: 'services' },
  { id: 'dsp', label: 'DSP Solutions', path: '/dsp-dispatch-support', hasDropdown: true, dropdownType: 'dsp' },
  { id: 'afp', label: 'AFP Solutions', path: '/afp-dispatch-support', hasDropdown: true, dropdownType: 'afp' },
  { id: 'bpo', label: 'BPO Services', path: '/hr-bpo-services', hasDropdown: true, dropdownType: 'bpo' },
  { id: 'webdev', label: 'Website Development', path: '/website-design-development' },
  { id: 'contact', label: 'Contact', path: '/contact' },
];

export function AnimatedTabsHover({
  currentPath = typeof window !== 'undefined' ? window.location.pathname : '/',
  navigate,
  className = '',
  onDropdownHover,
  activeDropdown = null,
}: AnimatedTabsHoverProps) {
  
  // Determine which tab matches the current path
  const activeTabId = useMemo(() => {
    if (!currentPath || currentPath === '/') return 'home';
    if (currentPath === '/about') return 'about';
    if (currentPath === '/website-design-development') return 'webdev';
    if (currentPath === '/contact') return 'contact';
    
    // DSP paths
    if (
      currentPath.includes('/dsp-') && 
      currentPath !== '/services'
    ) {
      return 'dsp';
    }

    // AFP / Dedicated Lane paths
    if (
      (currentPath.includes('/afp-') || currentPath === '/dedicated-lane-services') && 
      currentPath !== '/services'
    ) {
      return 'afp';
    }

    // BPO / VA paths
    if (
      (currentPath.includes('/hr-bpo') || currentPath.includes('/virtual-assistants')) && 
      currentPath !== '/services'
    ) {
      return 'bpo';
    }

    // Services overview or other service pages
    if (currentPath.startsWith('/services') || currentPath === '/digital-marketing') {
      return 'services';
    }

    // Fallback search
    const found = WAL_NAV_TABS.find(tab => tab.path === currentPath);
    return found ? found.id : 'home';
  }, [currentPath]);

  const handleTabClick = (item: NavTabItem) => {
    if (navigate) {
      navigate(item.path);
    } else if (typeof window !== 'undefined') {
      window.history.pushState({}, '', item.path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <nav 
      aria-label="Main Navigation" 
      className={`relative flex items-center p-1 rounded-xl bg-black/20 dark:bg-white/[0.03] border border-white/10 backdrop-blur-md ${className}`}
    >
      <AnimatedBackground
        defaultValue={activeTabId}
        value={activeTabId}
        className="rounded-lg bg-zinc-200/90 dark:bg-zinc-800/90 border border-black/5 dark:border-white/10 shadow-sm"
        transition={{
          type: 'spring',
          bounce: 0.2,
          duration: 0.3,
        }}
        enableHover
      >
        {WAL_NAV_TABS.map((tab) => {
          const isActive = activeTabId === tab.id;
          const isDropdownOpen = tab.dropdownType && activeDropdown === tab.dropdownType;

          return (
            <button
              key={tab.id}
              data-id={tab.id}
              type="button"
              onClick={() => handleTabClick(tab)}
              onMouseEnter={() => {
                if (tab.dropdownType && onDropdownHover) {
                  onDropdownHover(tab.dropdownType);
                } else if (onDropdownHover) {
                  onDropdownHover(null);
                }
              }}
              onFocus={() => {
                if (tab.dropdownType && onDropdownHover) {
                  onDropdownHover(tab.dropdownType);
                }
              }}
              aria-current={isActive ? 'page' : undefined}
              aria-haspopup={tab.hasDropdown ? 'true' : undefined}
              aria-expanded={isDropdownOpen ? 'true' : undefined}
              className={`px-3 py-1.5 text-xs lg:text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6600]/50 rounded-lg cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                isActive
                  ? 'text-[#ff6600] font-bold'
                  : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.hasDropdown && (
                <ChevronDown 
                  className={`w-3 h-3 transition-transform duration-200 ${
                    isDropdownOpen 
                      ? 'rotate-180 text-[#ff6600]' 
                      : isActive 
                      ? 'text-[#ff6600]' 
                      : 'text-zinc-400 group-hover:text-zinc-200'
                  }`} 
                />
              )}
            </button>
          );
        })}
      </AnimatedBackground>
    </nav>
  );
}
