
import React, { useState, useEffect } from 'react';
import { Testimonial } from '../types';

interface SocialProofProps {
  clientName: string;
}

const SocialProof: React.FC<SocialProofProps> = ({ clientName }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const response = await fetch('/api/admin/testimonials');
        if (response.ok) {
          const data = await response.json();
          const active = data.filter((t: Testimonial) => t.is_active);
          setTestimonials(active);
        }
      } catch (error) {
        console.error('Failed to load testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  // Fallback testimonial if API fails or no testimonials
  const defaultTestimonial = {
    name: 'Josh Traeger',
    role: 'Founder',
    company: 'The Military Defense Firm',
    quote: "I have trusted SEO Succor to help me build two different businesses, both of which have thrived under their guidance. Most recently, my legal business -- which operates worldwide -- has seen an increase in web traffic by at least 1000%, an overwhelming increase in leads, and significantly more qualified leads than we've ever had before. All of this in just twelve months of work! The team at SEO Succor is honest, dependable, organized, and highly knowledgeable. If your business depends on web traffic for lead generation, look no further -- this is the team for you.",
    rating: 5,
  };

  const displayTestimonials = testimonials.length > 0 ? testimonials : [defaultTestimonial as Testimonial];
  const firstTestimonial = displayTestimonials[0];

  return (
    <section className="space-y-24">
      {/* Testimonial Section */}
      <div>
        <div className="mb-12">
          <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            09. Testimonials
          </span>
          <h2 className="text-4xl font-bold serif text-slate-900">Trusted Partnerships.</h2>
        </div>

        <div className="bg-white border border-slate-200 p-10 lg:p-16 rounded-[3rem] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017V14C19.017 11.7909 17.2261 10 15.017 10H14.017V7H15.017C18.883 7 22.017 10.134 22.017 14V21H14.017ZM2.017 21L2.017 18C2.017 16.8954 2.91243 16 4.017 16H7.017V14C7.017 11.7909 5.2261 10 3.017 10H2.017V7H3.017C6.883 7 10.017 10.134 10.017 14V21H2.017Z"/></svg>
          </div>
          
          <div className="relative z-10">
            <div className="flex space-x-1 mb-8">
              {Array.from({ length: firstTestimonial.rating || 5 }).map((_, s) => (
                <span key={s} className="text-yellow-400 text-xl">★</span>
              ))}
            </div>
            <p className="text-2xl font-medium text-slate-700 italic leading-relaxed mb-10 max-w-4xl">
              "{firstTestimonial.quote}"
            </p>
            <div className="flex items-center space-x-6 border-t border-slate-100 pt-8">
              {firstTestimonial.image_url ? (
                <img 
                  src={firstTestimonial.image_url} 
                  alt={firstTestimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-brand-primary"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-brand-primary/20">
                  {firstTestimonial.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-bold text-xl text-slate-900">{firstTestimonial.name}</p>
                <p className="text-sm text-slate-500 uppercase font-black tracking-widest mt-1">
                  {firstTestimonial.role}{firstTestimonial.company ? `, ${firstTestimonial.company}` : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Case Study Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-[3rem] p-12 lg:p-20 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div>
              <span className="inline-block px-3 py-1 bg-brand-secondary/10 text-brand-secondary rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                Featured Case Study
              </span>
              <h3 className="text-4xl font-bold serif text-slate-900 leading-tight">The Military Defense Firm: Global Reach from Zero Authority</h3>
            </div>
            
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <p>
                TMDF turned to us after we helped founder Josh Traeger scale a previous venture. This time, the mission was different: build traction fast for a new law practice defending active-duty service members—starting with courts-martial.
              </p>
              <p>
                We built a full-funnel strategy spanning SEO and PPC to drive qualified leads at every stage:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="w-6 h-6 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center text-xs font-bold mr-3 mt-1 flex-shrink-0">1</span>
                  <span><strong className="text-slate-900">PPC Launch:</strong> Our campaigns delivered qualified leads in under two weeks using a mix of formats to capture top-of-funnel attention and strategic retargeting.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center text-xs font-bold mr-3 mt-1 flex-shrink-0">2</span>
                  <span><strong className="text-slate-900">SEO Content Clusters:</strong> We deployed a tightly structured strategy that positioned TMDF as the go-to resource for military trial defense.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 text-center">
            <div className="bg-brand-secondary/10 -mx-10 -mt-10 mb-10 py-6 rounded-t-[2.5rem]">
              <h4 className="text-2xl font-bold serif text-slate-900">The Impact</h4>
            </div>
            
            <div className="space-y-10">
              <div className="group">
                <p className="text-5xl font-black text-brand-primary mb-2 transition-transform group-hover:scale-110 duration-300">1,200 <span className="text-3xl">%</span></p>
                <p className="text-sm font-medium text-slate-500 max-w-[240px] mx-auto">increase in market-qualified leads via PPC</p>
              </div>
              
              <div className="w-1/2 h-px bg-slate-100 mx-auto"></div>

              <div className="group">
                <p className="text-5xl font-black text-brand-primary mb-2 transition-transform group-hover:scale-110 duration-300">1,100 <span className="text-3xl">%</span></p>
                <p className="text-sm font-medium text-slate-500 max-w-[240px] mx-auto">increase in organic-qualified leads</p>
              </div>

              <div className="w-1/2 h-px bg-slate-100 mx-auto"></div>

              <div className="group">
                <p className="text-5xl font-black text-brand-primary mb-2 transition-transform group-hover:scale-110 duration-300">36,666 <span className="text-3xl">%</span></p>
                <p className="text-sm font-medium text-slate-500 max-w-[240px] mx-auto">growth in national organic keyword coverage</p>
              </div>

              <div className="w-1/2 h-px bg-slate-100 mx-auto"></div>

              <div className="group">
                <p className="text-5xl font-black text-brand-primary mb-2 transition-transform group-hover:scale-110 duration-300"><span className="text-4xl">#</span> 4</p>
                <p className="text-sm font-medium text-slate-500 max-w-[240px] mx-auto">national ranking for "court-martial defense"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action Footer - Temporarily hidden */}
      {/* <div className="mt-16 bg-brand-base p-10 lg:p-12 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <h4 className="text-white text-2xl font-bold mb-6">Ready for similar results at {clientName}?</h4>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
             <a href="#" className="bg-brand-primary text-white px-8 py-4 rounded-full font-bold hover:bg-brand-primary/90 transition shadow-lg shadow-brand-primary/20 transform hover:scale-105">
               Watch Proposal Walkthrough
             </a>
             <div className="flex items-center space-x-2 text-slate-300 font-medium">
               <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
               <span className="text-sm uppercase tracking-widest">2:30 min video</span>
             </div>
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default SocialProof;
