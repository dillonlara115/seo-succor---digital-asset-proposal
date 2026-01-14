
import React from 'react';
import { ProposalData } from '../types';

interface HeroProps {
  data: ProposalData;
  isGenerating: boolean;
}

const Hero: React.FC<HeroProps> = ({ data, isGenerating }) => {
  return (
    <section>
      <div className="mb-8">
        <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          01. Executive Summary
        </span>
        <h1 className="text-5xl lg:text-7xl font-bold leading-tight serif text-slate-900">
          Scaling Trust & Visibility for <span className="text-brand-primary">{data.clientName}</span>.
        </h1>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-6">
          {isGenerating ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3 mt-8"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
            </div>
          ) : (
            <div className="prose prose-lg text-slate-600 max-w-none whitespace-pre-line leading-relaxed italic">
              {data.generatedSummary || `Your current online presence is a cost center, not an engine. Specifically, ${data.coreProblem}. 

              We aren't just "building a website." We are constructing improved CRO that amplifies local SEO wins. 

              The outcome? Faster load times, bug fixes that eliminate user friction, and other conversion optimization improvements that ensure your local SEO victories translate into actual patient bookings.`}
            </div>
          )}
          
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex items-center space-x-2 text-sm font-semibold text-slate-700 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
              <span className="text-brand-primary">✓</span>
              <span>Local SEO Strategy</span>
            </div>
            <div className="flex items-center space-x-2 text-sm font-semibold text-slate-700 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
              <span className="text-brand-primary">✓</span>
              <span>HIPAA-Ready Intake Flow</span>
            </div>
            <div className="flex items-center space-x-2 text-sm font-semibold text-slate-700 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
              <span className="text-brand-primary">✓</span>
              <span>Patient-First UX</span>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-4">
          <div className="bg-brand-base rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            <h3 className="text-xl font-bold mb-4 relative z-10 italic">"Therapy sites must provide immediate calm and clear direction."</h3>
            <p className="text-slate-200 text-sm relative z-10 leading-relaxed">Generic agencies miss the psychological nuances of your industry. Our build for CBT Baltimore balances technical SEO power with patient empathy.</p>
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center space-x-4">
                <img src="/Austin-Lewis-768x745.avif" alt="Austin Lewis headshot" className="w-12 h-12 rounded-full object-cover border-2 border-brand-primary" />
                <div>
                  <p className="font-bold text-sm">Austin Lewis</p>
                  <p className="text-xs text-slate-300">Head of Strategy, SEO Succor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
