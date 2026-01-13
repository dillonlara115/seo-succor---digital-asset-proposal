
import React, { useState, useEffect } from 'react';
import { ProposalData, Cart, CartItem } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectScope from './components/ProjectScope';
import SEOAdvantage from './components/SEOAdvantage';
import Timeline from './components/Timeline';
import Pricing from './components/Pricing';
import LeasePricing from './components/LeasePricing';
import Maintenance from './components/Maintenance';
import AddOns from './components/AddOns';
import SocialProof from './components/SocialProof';
import DevWork from './components/DevWork';
import Customizer from './components/Customizer';
import CartComponent from './components/Cart';
import AcceptProposalModal from './components/AcceptProposalModal';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [data, setData] = useState<ProposalData>({
    clientName: "CBT Baltimore",
    industry: "Psychology & Therapy",
    coreProblem: "Your current online presence is difficult to navigate for patients in distress and lacks the local SEO authority needed to rank for 'CBT in Baltimore'.",
    generatedSummary: ""
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [cart, setCart] = useState<Cart>({
    pricingPlan: null,
    leasePlan: null,
    maintenancePlan: null,
    addons: []
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);

  const addToCart = (item: CartItem, type: 'pricing' | 'lease' | 'maintenance' | 'addon') => {
    setCart(prev => {
      const newCart = { ...prev };
      
      if (type === 'pricing') {
        newCart.pricingPlan = item;
        // Remove lease plan if pricing is selected (mutually exclusive)
        newCart.leasePlan = null;
      } else if (type === 'lease') {
        newCart.leasePlan = item;
        // Remove pricing plan if lease is selected (mutually exclusive)
        newCart.pricingPlan = null;
      } else if (type === 'maintenance') {
        newCart.maintenancePlan = item;
      } else if (type === 'addon') {
        // Check if addon already exists
        if (!newCart.addons.find(a => a.id === item.id)) {
          newCart.addons = [...newCart.addons, item];
        }
      }
      
      return newCart;
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string, type: 'pricing' | 'lease' | 'maintenance' | 'addon') => {
    setCart(prev => {
      const newCart = { ...prev };
      
      if (type === 'pricing') {
        newCart.pricingPlan = null;
      } else if (type === 'lease') {
        newCart.leasePlan = null;
      } else if (type === 'maintenance') {
        newCart.maintenancePlan = null;
      } else if (type === 'addon') {
        newCart.addons = newCart.addons.filter(a => a.id !== itemId);
      }
      
      return newCart;
    });
  };

  const generateAIHook = async (client: string, industry: string, problem: string) => {
    // Get API key from Vite's environment variables (defined in vite.config.ts)
    const apiKey = (process.env.GEMINI_API_KEY as string) || (process.env.API_KEY as string) || '';
    
    // Skip AI generation if no API key is provided
    if (!apiKey) {
      console.warn("GEMINI_API_KEY not set. Skipping AI generation.");
      setIsGenerating(false);
      return;
    }

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Write a powerful, professional 'Executive Summary' for a high-performance SEO-first website build proposal. 
      Client: ${client}
      Industry: ${industry}
      Core Problem: ${problem}
      
      Focus on framing the website as a 'Digital Asset' that provides a sanctuary for patients and a machine for local search. 
      Format it in 3 short paragraphs: The 'Why' (The Problem), The 'What' (High performance WordPress site), and The 'Outcome' (Ranking, Speed, Patient Conversion). 
      Be persuasive, authoritative, yet empathetic given the therapy context.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setData(prev => ({ ...prev, generatedSummary: response.text || "" }));
    } catch (error) {
      console.error("AI Generation failed:", error);
      // Don't show error to user, just use default text
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    // Only generate AI content if API key is available
    const apiKey = (process.env.GEMINI_API_KEY as string) || (process.env.API_KEY as string);
    if (apiKey) {
      generateAIHook(data.clientName, data.industry, data.coreProblem);
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Customizer temporarily hidden */}
      {/* <Customizer 
        data={data} 
        setData={setData} 
        onGenerate={() => generateAIHook(data.clientName, data.industry, data.coreProblem)}
        isGenerating={isGenerating}
      /> */}
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-32">
        <Header clientName={data.clientName} />
        
        <div id="summary">
          <Hero data={data} isGenerating={isGenerating} />
        </div>

        <div id="scope">
          <ProjectScope />
        </div>

        <div id="advantage">
          <SEOAdvantage />
        </div>

        <div id="timeline">
          <Timeline />
        </div>

        <div id="investment">
          <Pricing cart={cart} onAddToCart={addToCart} />
          <div className="mt-20">
            <LeasePricing cart={cart} onAddToCart={addToCart} />
          </div>
          <div className="mt-20">
            <AddOns cart={cart} onAddToCart={addToCart} onRemoveFromCart={removeFromCart} />
          </div>
        </div>

        <div id="support">
          <Maintenance cart={cart} onAddToCart={addToCart} />
        </div>

        <div id="dev-work">
          <DevWork />
        </div>

        <div id="proof">
          <SocialProof clientName={data.clientName} />
        </div>

        <footer className="border-t border-slate-200 pt-12 text-center text-slate-500 pb-20">
          <p className="text-sm">© {new Date().getFullYear()} <a href="https://seosuccor.com/" target="_blank" className="hover:text-indigo-600 transition">SEO Succor LLC</a>. Confidential Proposal for {data.clientName}.</p>
          <div className="mt-4 flex justify-center space-x-6 text-xs font-bold uppercase tracking-widest">
            <a href="https://seosuccor.com/about/dev-work/" target="_blank" className="hover:text-indigo-600 transition">Our Dev Work</a>
            <a href="https://seosuccor.com/about/reviews/" target="_blank" className="hover:text-indigo-600 transition">Reviews</a>
            <a href="https://seosuccor.com/web-development/wordpress-maintenance-management/" target="_blank" className="hover:text-indigo-600 transition">Maintenance Details</a>
          </div>
        </footer>
      </main>

      <CartComponent 
        cart={cart} 
        onRemoveItem={removeFromCart}
        isOpen={isCartOpen}
        onToggle={() => setIsCartOpen(!isCartOpen)}
        onAcceptProposal={() => setIsAcceptModalOpen(true)}
      />

      <AcceptProposalModal
        isOpen={isAcceptModalOpen}
        onClose={() => setIsAcceptModalOpen(false)}
        cart={cart}
        clientName={data.clientName}
      />

      <div className="fixed bottom-6 right-6 z-40 flex space-x-3 print:hidden">
        <button 
          onClick={() => setIsAcceptModalOpen(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold shadow-xl hover:bg-slate-800 transition transform hover:scale-105"
        >
          Accept Proposal
        </button>
        <button className="bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-full font-bold shadow-xl hover:bg-slate-50 transition transform hover:scale-105" onClick={() => window.print()}>
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default App;
