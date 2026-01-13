
import React, { useState } from 'react';
import { ProposalData } from '../types';

interface CustomizerProps {
  data: ProposalData;
  setData: React.Dispatch<React.SetStateAction<ProposalData>>;
  onGenerate: () => void;
  isGenerating: boolean;
}

const Customizer: React.FC<CustomizerProps> = ({ data, setData, onGenerate, isGenerating }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-6 left-6 z-50 bg-white border border-slate-200 p-3 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105 print:hidden"
        title="Customize Proposal"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2EB14B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex justify-start">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-white h-screen shadow-2xl flex flex-col p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-black uppercase italic tracking-tight text-brand-primary">Personalize</h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-2xl">&times;</button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Client Name</label>
                <input 
                  type="text" 
                  value={data.clientName} 
                  onChange={(e) => setData(prev => ({ ...prev, clientName: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Industry</label>
                <input 
                  type="text" 
                  value={data.industry} 
                  onChange={(e) => setData(prev => ({ ...prev, industry: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">The 'Why' (Problem)</label>
                <textarea 
                  value={data.coreProblem} 
                  onChange={(e) => setData(prev => ({ ...prev, coreProblem: e.target.value }))}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>

              <button 
                onClick={onGenerate}
                disabled={isGenerating}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition shadow-lg ${
                  isGenerating ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-brand-primary text-white hover:bg-brand-primary/90'
                }`}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3 text-slate-400" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Polishing...</span>
                  </>
                ) : (
                  <span>Regenerate Summary</span>
                )}
              </button>
            </div>
            
            <div className="mt-auto pt-8">
              <div className="bg-brand-primary/5 p-4 rounded-2xl border border-brand-primary/10">
                <p className="text-[10px] uppercase font-bold text-brand-primary tracking-widest mb-1">AI Tip</p>
                <p className="text-xs text-brand-base leading-relaxed italic">
                  Provide specific details about their competitors or current SEO traffic drop to make the summary more persuasive.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Customizer;
