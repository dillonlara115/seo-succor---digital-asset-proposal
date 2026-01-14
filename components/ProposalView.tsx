import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProposalData, Cart, CartItem } from '../types';
import Header from './Header';
import Hero from './Hero';
import ProjectScope from './ProjectScope';
import SEOAdvantage from './SEOAdvantage';
import Timeline from './Timeline';
import Pricing from './Pricing';
import LeasePricing from './LeasePricing';
import Maintenance from './Maintenance';
import AddOns from './AddOns';
import SocialProof from './SocialProof';
import DevWork from './DevWork';
import CartComponent from './Cart';
import AcceptProposalModal from './AcceptProposalModal';

const ProposalView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<ProposalData | null>(null);
  const [cart, setCart] = useState<Cart>({
    pricingPlan: null,
    leasePlan: null,
    maintenancePlan: null,
    addons: []
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proposalId, setProposalId] = useState<string | null>(null);

  useEffect(() => {
    const loadProposal = async () => {
      if (!slug) {
        setError('Invalid proposal slug');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/proposal/${slug}`);
        if (!response.ok) {
          throw new Error('Failed to load proposal');
        }
        const proposal = await response.json();
        
        setProposalId(proposal.id);
        setData({
          clientName: proposal.client_name,
          industry: proposal.industry || '',
          coreProblem: proposal.core_problem || '',
          generatedSummary: proposal.generated_summary || ''
        });

        // Load cart state from proposal
        if (proposal.selected_services) {
          setCart(proposal.selected_services);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load proposal');
      } finally {
        setLoading(false);
      }
    };

    loadProposal();
  }, [slug]);

  const addToCart = (item: CartItem, type: 'pricing' | 'lease' | 'maintenance' | 'addon') => {
    setCart(prev => {
      const newCart = { ...prev };
      
      if (type === 'pricing') {
        newCart.pricingPlan = item;
        newCart.leasePlan = null;
      } else if (type === 'lease') {
        newCart.leasePlan = item;
        newCart.pricingPlan = null;
      } else if (type === 'maintenance') {
        newCart.maintenancePlan = item;
      } else if (type === 'addon') {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Loading proposal...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error || 'Proposal not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-32">
        <Header clientName={data.clientName} />
        
        <div id="summary">
          <Hero data={data} isGenerating={false} />
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
        proposalId={proposalId}
      />

      <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col sm:flex-row gap-3 print:hidden">
        <button 
          onClick={() => setIsAcceptModalOpen(true)}
          className="bg-slate-900 text-white px-4 sm:px-6 py-3 rounded-full font-bold shadow-xl hover:bg-slate-800 transition transform hover:scale-105 text-sm sm:text-base whitespace-nowrap"
        >
          Accept Proposal
        </button>
        <button 
          className="bg-white text-slate-900 border border-slate-200 px-4 sm:px-6 py-3 rounded-full font-bold shadow-xl hover:bg-slate-50 transition transform hover:scale-105 text-sm sm:text-base whitespace-nowrap" 
          onClick={() => window.print()}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ProposalView;
