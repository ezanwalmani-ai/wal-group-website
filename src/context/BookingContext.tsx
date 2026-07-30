import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface BookingContextType {
  isBookDemoOpen: boolean;
  openBookDemo: () => void;
  closeBookDemo: () => void;
  isAdminOpen: boolean;
  openAdmin: () => void;
  closeAdmin: () => void;
}

const BookingContext = createContext<BookingContextType>({
  isBookDemoOpen: false,
  openBookDemo: () => {},
  closeBookDemo: () => {},
  isAdminOpen: false,
  openAdmin: () => {},
  closeAdmin: () => {},
});

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBookDemoOpen, setIsBookDemoOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const openBookDemo = useCallback(() => setIsBookDemoOpen(true), []);
  const closeBookDemo = useCallback(() => setIsBookDemoOpen(false), []);
  
  const openAdmin = useCallback(() => setIsAdminOpen(true), []);
  const closeAdmin = useCallback(() => setIsAdminOpen(false), []);

  const value = useMemo(() => ({
    isBookDemoOpen,
    openBookDemo,
    closeBookDemo,
    isAdminOpen,
    openAdmin,
    closeAdmin,
  }), [isBookDemoOpen, openBookDemo, closeBookDemo, isAdminOpen, openAdmin, closeAdmin]);

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
