
import React from 'react';

const steps = [
  { label: "Weeks 1-2", title: "Discovery & Sitemap", desc: "Setting the strategic foundation and SEO hierarchy." },
  { label: "Weeks 3-5", title: "Design & UX Approval", desc: "Crafting the visual identity and conversion flows." },
  { label: "Weeks 6-8", title: "Development & Content", desc: "Code-first build and strategic content migration." },
  { label: "Week 9", title: "QA & SEO Audit", desc: "Technical stress-testing and redirect mapping verification." },
  { label: "Week 10", title: "Launch & Training", desc: "Going live with full client hand-off and tutorial videos." }
];

const Timeline: React.FC = () => {
  return (
    <section>
      <div className="mb-12">
        <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          04. Timeline
        </span>
        <h2 className="text-4xl font-bold serif text-slate-900">Roadmap to Launch.</h2>
      </div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-200 md:left-1/2 md:-translate-x-px"></div>
        
        <div className="space-y-12">
          {steps.map((step, idx) => (
            <div key={idx} className={`relative flex items-center md:justify-between ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="hidden md:block w-[45%]"></div>
              
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-brand-primary ring-4 ring-white shadow-sm"></div>
              </div>

              <div className="ml-16 md:ml-0 w-full md:w-[45%] bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:border-brand-primary/20 transition">
                <span className="text-brand-primary text-xs font-black uppercase tracking-widest mb-2 block">{step.label}</span>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <p className="text-slate-500 italic max-w-xl mx-auto">
          "A rushed build is a broken build. We prioritize 10 weeks of precision over 4 weeks of shortcuts to ensure long-term stability."
        </p>
      </div>
    </section>
  );
};

export default Timeline;
