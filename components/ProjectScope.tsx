
import React from 'react';
import { Phase } from '../types';

const phases: Phase[] = [
  {
    title: "Phase 1: Discovery & Strategy",
    items: [
      "Competitor keyword gap analysis",
      "Sitemap architecture based on search intent",
      "Tech stack selection (Ultra-lightweight CMS focus)",
      "Technical SEO audit of current assets"
    ]
  },
  {
    title: "Phase 2: Design & UX",
    items: [
      "Mobile-first wireframing",
      "UI Design focused on conversion paths (CRO)",
      "Accessibility & readability standard checks",
      "Brand-aligned visual storytelling"
    ]
  },
  {
    title: "Phase 3: The 'SEO Succor' Special Build",
    items: [
      "Core Web Vital Optimization (Fast Load Guarantee)",
      "Advanced Schema Markup (LocalBusiness, Article, Organization)",
      "Multi-device responsive stress testing",
      "Strict Plugin Audit (Zero bloat policy)"
    ]
  },
  {
    title: "Phase 4: Content & On-Page SEO",
    items: [
      "Strategic content migration (X number of pages)",
      "H1-H6, Meta Title & Description optimization",
      "301 Redirect Mapping (Critical for preserving link equity)",
      "Automated XML Sitemap & Robots.txt configuration"
    ]
  }
];

const ProjectScope: React.FC = () => {
  return (
    <section>
      <div className="mb-12">
        <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          02. Scope & Deliverables
        </span>
        <h2 className="text-4xl font-bold serif text-slate-900">A Methodical Approach to Excellence.</h2>
        <p className="mt-4 text-slate-600 max-w-2xl">We break our build into four distinct phases to ensure transparency and precision in execution.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {phases.map((phase, idx) => (
          <div key={idx} className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs mr-3 font-bold">{idx + 1}</span>
              {phase.title}
            </h3>
            <ul className="space-y-4">
              {phase.items.map((item, i) => (
                <li key={i} className="flex items-start text-slate-600">
                  <span className="text-brand-primary mr-2 mt-1 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-amber-50 border border-amber-200 p-6 rounded-2xl flex items-start space-x-4">
        <div className="text-2xl">⚠️</div>
        <div>
          <p className="font-bold text-amber-900 uppercase text-xs tracking-widest mb-1">The 301 Redirect Clause</p>
          <p className="text-sm text-amber-800 leading-relaxed">Most agencies ignore this. We include a comprehensive 301 redirect map as a core deliverable. This prevents your current organic traffic from crashing post-launch by mapping old URLs to the new architecture.</p>
        </div>
      </div>
    </section>
  );
};

export default ProjectScope;
