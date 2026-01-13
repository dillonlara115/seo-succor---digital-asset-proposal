
import React from 'react';
import { Cart, CartItem } from '../types';

interface LeasePricingProps {
  cart: Cart;
  onAddToCart: (item: CartItem, type: 'pricing' | 'lease' | 'maintenance' | 'addon') => void;
}

const leasePlans = [
  { name: 'Starter', price: '$199/mo' },
  { name: 'Growth', price: '$299/mo' },
  { name: 'Pro', price: '$499/mo' }
];

const LeasePricing: React.FC<LeasePricingProps> = ({ cart, onAddToCart }) => {
  const handleSelectPlan = (planName: string, price: string) => {
    const cartItem: CartItem = {
      id: `lease-${planName.toLowerCase()}`,
      name: `${planName} Lease`,
      price: price,
      type: 'lease',
      recurring: true,
      recurringPeriod: 'monthly'
    };
    onAddToCart(cartItem, 'lease');
  };

  return (
    <section>
      <div className="mb-12 text-center">
        <span className="inline-block px-3 py-1 bg-brand-secondary/10 text-brand-secondary rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          05. Option B: Managed Lease
        </span>
        <h2 className="text-4xl font-bold serif text-slate-900">Need a Website? Professional Sites Without Big Upfront Costs.</h2>
        <p className="mt-4 text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Get a modern, mobile-friendly website built for your business with everything included — design, hosting, and care. Pay monthly, keep it as long as you need, and grow on your own terms.
        </p>
        <div className="mt-6 max-w-3xl mx-auto">
          <p className="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
            <span className="font-bold text-slate-700">Note:</span> All lease plans require an additional <span className="font-bold">$50/month hosting fee</span> (non-negotiable) on top of the lease price. This ensures optimal performance, security, and uptime.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-5 text-sm font-black uppercase tracking-widest text-slate-400">Plan</th>
              {leasePlans.map((plan) => {
                const itemId = `lease-${plan.name.toLowerCase()}`;
                const isSelected = cart.leasePlan?.id === itemId;
                return (
                  <th key={plan.name} className={`px-6 py-5 text-sm font-black text-slate-900 ${isSelected ? 'bg-brand-primary/10' : ''}`}>
                    {plan.name} ({plan.price})
                    {isSelected && <span className="block text-xs text-brand-primary font-bold mt-1">✓ Selected</span>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-6 py-4 font-bold text-slate-500">Pages</td>
              <td className="px-6 py-4 text-sm">1–10 custom pages</td>
              <td className="px-6 py-4 text-sm">Up to 20 pages + blog</td>
              <td className="px-6 py-4 text-sm">20+ pages + e-commerce (up to 25 products)</td>
            </tr>
            <tr className="bg-slate-50/50">
              <td className="px-6 py-4 font-bold text-slate-500">Term</td>
              <td className="px-6 py-4 text-sm">12-month lease</td>
              <td className="px-6 py-4 text-sm">12-month lease</td>
              <td className="px-6 py-4 text-sm">12-month lease</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-bold text-slate-500">Hosting</td>
              <td className="px-6 py-4 text-sm">Included + SSL</td>
              <td className="px-6 py-4 text-sm">Included + SSL</td>
              <td className="px-6 py-4 text-sm">Included + SSL</td>
            </tr>
            <tr className="bg-slate-50/50">
              <td className="px-6 py-4 font-bold text-slate-500">Features</td>
              <td className="px-6 py-4 text-sm">Mobile responsive, basic SEO setup</td>
              <td className="px-6 py-4 text-sm">+ Integrations (email opt-in, calendar, etc.)</td>
              <td className="px-6 py-4 text-sm">+ Landing pages, eCom, quarterly strategy calls</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-bold text-slate-500">Maintenance</td>
              <td className="px-6 py-4 text-sm">Basic Care Plan</td>
              <td className="px-6 py-4 text-sm">Growth Care Plan</td>
              <td className="px-6 py-4 text-sm">Pro Care Plan</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {leasePlans.map((plan) => {
          const itemId = `lease-${plan.name.toLowerCase()}`;
          const isSelected = cart.leasePlan?.id === itemId;
          
          return (
            <button
              key={plan.name}
              onClick={() => handleSelectPlan(plan.name, plan.price)}
              className={`p-6 rounded-2xl border-2 transition-all ${
                isSelected
                  ? 'bg-brand-primary/5 border-brand-primary shadow-lg'
                  : 'bg-white border-slate-200 hover:border-brand-secondary hover:shadow-md'
              }`}
            >
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-2xl font-black text-brand-primary mb-4">{plan.price}</p>
                <span className={`text-sm font-bold px-4 py-2 rounded-full ${
                  isSelected
                    ? 'bg-brand-primary text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {isSelected ? 'Selected' : 'Select Plan'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default LeasePricing;
