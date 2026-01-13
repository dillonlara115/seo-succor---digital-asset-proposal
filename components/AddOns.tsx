
import React from 'react';
import { Cart, CartItem } from '../types';

interface AddOnsProps {
  cart: Cart;
  onAddToCart: (item: CartItem, type: 'pricing' | 'lease' | 'maintenance' | 'addon') => void;
  onRemoveFromCart: (itemId: string, type: 'pricing' | 'lease' | 'maintenance' | 'addon') => void;
}

const addons = [
  { id: 'addon-design-time', name: "Additional design time", price: "$75/hr", desc: "For layout modifications or new visual assets." },
  { id: 'addon-copywriting', name: "Copywriting", price: "$100/page", desc: "Expert, patient-centric copy optimized for Baltimore therapy searches." },
  { id: 'addon-seo-boost', name: "Local SEO Boost", price: "$150/month", desc: "Continuous citations and Google Business Profile management." },
  { id: 'addon-setup-fee', name: "Initial setup fee", price: "$250–$500", desc: "One-time technical onboarding (based on scope)." }
];

const AddOns: React.FC<AddOnsProps> = ({ cart, onAddToCart, onRemoveFromCart }) => {
  const handleToggleAddon = (addon: typeof addons[0]) => {
    const isSelected = cart.addons.some(a => a.id === addon.id);
    
    if (isSelected) {
      // Remove from cart
      onRemoveFromCart(addon.id, 'addon');
    } else {
      // Add to cart
      const cartItem: CartItem = {
        id: addon.id,
        name: addon.name,
        price: addon.price,
        type: 'addon',
        recurring: addon.price.includes('/month') || addon.price.includes('/mo'),
        recurringPeriod: (addon.price.includes('/month') || addon.price.includes('/mo')) ? 'monthly' : undefined
      };
      onAddToCart(cartItem, 'addon');
    }
  };

  return (
    <section className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-200">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold serif text-slate-900">Customize Your Plan With Add-Ons.</h2>
          <p className="mt-2 text-slate-600">Need something extra? We offer flexible add-ons to fit your business needs.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {addons.map((addon) => {
          const isSelected = cart.addons.some(a => a.id === addon.id);
          
          return (
            <div 
              key={addon.id} 
              className={`bg-white p-6 rounded-2xl border-2 flex flex-col justify-between shadow-sm transition ${
                isSelected
                  ? 'border-brand-primary bg-brand-primary/5'
                  : 'border-slate-200 hover:border-brand-secondary/30'
              }`}
            >
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-brand-secondary mb-2">{addon.price}</p>
                <h4 className="font-bold text-slate-900 mb-2">{addon.name}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{addon.desc}</p>
              </div>
              <button 
                onClick={() => handleToggleAddon(addon)}
                className={`mt-6 text-xs font-black uppercase tracking-widest flex items-center gap-1 transition-colors ${
                  isSelected
                    ? 'text-red-600 hover:text-red-700'
                    : 'text-brand-accent hover:text-brand-secondary'
                }`}
              >
                {isSelected ? 'Remove from plan' : 'Add to plan'} <span>{isSelected ? '×' : '+'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AddOns;
