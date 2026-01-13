
import React from 'react';

interface HeaderProps {
  clientName: string;
}

const Header: React.FC<HeaderProps> = ({ clientName }) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-10">
      <div>
        <div className="flex items-center">
          <img 
            src="/SEO_Succor-Logo_Horizontal-Color.eps_.svg" 
            alt="SEO Succor Logo" 
            className="h-8 w-auto"
          />
        </div>
        <p className="mt-2 text-slate-500 font-medium">Strategic Proposal</p>
      </div>
      <div className="bg-white border border-slate-200 px-5 py-4 rounded-xl flex items-center space-x-4 shadow-sm">
        <div className="text-right">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Prepared For</p>
          <p className="text-lg font-bold text-slate-900">{clientName}</p>
        </div>
        <div className="w-px h-8 bg-slate-200"></div>
        <div className="text-right">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Date</p>
          <p className="text-sm font-semibold">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
