import React from 'react';
import { TicketSystem } from '../components/TicketSystem';

interface Props {
  navigate: (path: string) => void;
}

export const RaiseTicketPage: React.FC<Props> = () => {
  return (
    <div className="font-sans text-slate-800 bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-[#2271B1] text-xs font-bold uppercase tracking-wider">
            Client Support Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A2647]">Welcome to the Support Center</h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            To streamline support requests and serve you better, we use a ticket-based support system. Each request is assigned a unique ticket number that you can use to track progress and responses online.
          </p>
        </div>

        <TicketSystem />
      </div>
    </div>
  );
};
