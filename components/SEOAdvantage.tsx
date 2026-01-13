
import React from 'react';

const SEOAdvantage: React.FC = () => {
  return (
    <section className="bg-brand-base rounded-[3rem] p-12 lg:p-20 text-white overflow-hidden relative shadow-2xl">
      <div className="absolute top-0 right-0 p-20 opacity-10">
        <svg width="400" height="400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
          <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.5" />
          <path d="M50 10V90M10 50H90" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl">
        <span className="inline-block px-3 py-1 bg-white/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-white/20">
          03. The SEO Advantage
        </span>
        <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-8 serif">
          Why our build is better than a generic design agency's.
        </h2>
        
        <div className="grid md:grid-cols-3 gap-10 mt-16">
          <div className="space-y-4">
            <div className="text-brand-primary text-3xl font-bold italic">01.</div>
            <h4 className="text-xl font-bold">Intent-First Architecture</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              Generic agencies build for aesthetics. We structure your URLs, categories, and tags based on how Google understands topical authority.
            </p>
          </div>
          <div className="space-y-4">
            <div className="text-brand-primary text-3xl font-bold italic">02.</div>
            <h4 className="text-xl font-bold">The No-Bloat Promise</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              The average WordPress site has 30+ plugins. We use custom code and server-side caching to ensure you pass Core Web Vitals from day one.
            </p>
          </div>
          <div className="space-y-4">
            <div className="text-brand-primary text-3xl font-bold italic">03.</div>
            <h4 className="text-xl font-bold">Crawl Efficiency</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              We don't just "submit a sitemap." We configure robots.txt, canonicals, and internal linking to ensure Google crawls your most profitable pages first.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SEOAdvantage;
