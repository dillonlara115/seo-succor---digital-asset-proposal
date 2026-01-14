
import React from 'react';
import { PricingTier, Cart, CartItem } from '../types';

interface PricingProps {
  cart: Cart;
  onAddToCart: (item: CartItem, type: 'pricing' | 'lease' | 'maintenance' | 'addon') => void;
}

const tiers: PricingTier[] = [
  {
    name: "The Foundation",
    price: "$3,000",
    description: "The essential 'Digital Asset' build. High speed, local SEO ready, and fully accessible for patients.",
    features: [
      "Custom WordPress Theme (No Bloat)",
      "Essential On-Page SEO (10 Pages)",
      "301 Redirect Mapping (Preserve Authority)",
      "HIPAA-Compliant Contact Forms",
      "Core Web Vital Optimization"
    ]
  },
  {
    name: "The Growth Engine",
    price: "$4,000",
    description: "Strategic build for practices looking to dominate the Baltimore area search landscape.",
    recommended: true,
    features: [
      "Everything in Foundation",
      "Full Content Migration (30 Pages)",
      "Speed Optimization Guarantee (Grade A)"
    ]
  }
];

const Pricing: React.FC<PricingProps> = ({ cart, onAddToCart }) => {
  // Calculate discounted price (10% off for current clients)
  const getDiscountedPrice = (originalPrice: string): { original: number; discounted: number; discountedPrice: string } => {
    const price = parseFloat(originalPrice.replace(/[$,]/g, ''));
    const discounted = price * 0.9; // 10% discount
    return {
      original: price,
      discounted: discounted,
      discountedPrice: `$${Math.round(discounted).toLocaleString()}`
    };
  };

  const handleSelectPlan = (tier: PricingTier) => {
    const pricing = getDiscountedPrice(tier.price);
    const cartItem: CartItem = {
      id: `pricing-${tier.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: tier.name,
      price: pricing.discountedPrice, // Use discounted price
      type: 'pricing',
      recurring: false
    };
    onAddToCart(cartItem, 'pricing');
  };

  return (
    <section>
      <div className="mb-12 text-center">
        <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          05. Option A: The Strategic Build
        </span>
        <h2 className="text-4xl font-bold serif text-slate-900 leading-tight">Investment for Longevity.</h2>
        <p className="mt-4 text-slate-600 max-w-2xl mx-auto italic font-medium">Owned, non-depreciating digital infrastructure for CBT Baltimore.</p>
        <div className="mt-6 max-w-2xl mx-auto">
          <p className="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
            <span className="font-bold text-slate-700">Note:</span> All plans require a <span className="font-bold">$50/month hosting fee</span> (non-negotiable). This ensures optimal performance, security, and uptime for your digital asset.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mt-16">
        {tiers.map((tier, idx) => {
          const itemId = `pricing-${tier.name.toLowerCase().replace(/\s+/g, '-')}`;
          const isSelected = cart.pricingPlan?.id === itemId;
          const pricing = getDiscountedPrice(tier.price);
          
          return (
            <div 
              key={idx} 
              className={`relative flex flex-col p-8 rounded-[2.5rem] transition-all duration-300 ${
                isSelected
                  ? 'bg-brand-primary/5 border-2 border-brand-primary shadow-xl'
                  : tier.recommended 
                  ? 'bg-white border-2 border-brand-primary shadow-2xl scale-105 z-10' 
                  : 'bg-white border border-slate-200 shadow-sm hover:shadow-lg'
              }`}
            >
              {tier.recommended && !isSelected && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-md">
                  Best for most practices
                </span>
              )}
              {isSelected && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-md">
                  Selected
                </span>
              )}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{tier.name}</h3>
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-4xl font-black text-slate-900">{pricing.discountedPrice}</span>
                  <span className="text-slate-400 font-medium italic">USD</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-slate-400 line-through">{tier.price}</span>
                  <span className="text-xs bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-full font-bold">10% Current Client Discount</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4">
                  <p className="text-xs font-semibold text-slate-700 mb-1">Payment Terms:</p>
                  <p className="text-xs text-slate-600">50% down payment • 50% due upon completion</p>
                </div>
                <p className="mt-2 text-slate-500 text-sm leading-relaxed">{tier.description}</p>
              </div>
              
              <ul className="flex-grow space-y-4 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-sm font-medium text-slate-700">
                    <span className="text-brand-primary mr-2 font-bold">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleSelectPlan(tier)}
                className={`w-full py-4 rounded-2xl font-bold transition shadow-sm ${
                  isSelected
                    ? 'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20'
                    : tier.recommended 
                    ? 'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20' 
                    : 'bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {isSelected ? 'Selected' : 'Select Plan'}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Pricing;
