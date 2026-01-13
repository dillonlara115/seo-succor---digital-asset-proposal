
import React from 'react';
import { Cart, CartItem } from '../types';

interface MaintenanceProps {
  cart: Cart;
  onAddToCart: (item: CartItem, type: 'pricing' | 'lease' | 'maintenance' | 'addon') => void;
}

const maintenancePlans = [
  { name: 'Basic Care', price: '$75/mo' },
  { name: 'Growth Care', price: '$150/mo' },
  { name: 'Pro Care', price: '$275/mo' }
];

const Maintenance: React.FC<MaintenanceProps> = ({ cart, onAddToCart }) => {
  const handleSelectPlan = (planName: string, price: string) => {
    const cartItem: CartItem = {
      id: `maintenance-${planName.toLowerCase().replace(/\s+/g, '-')}`,
      name: planName,
      price: price,
      type: 'maintenance',
      recurring: true,
      recurringPeriod: 'monthly'
    };
    onAddToCart(cartItem, 'maintenance');
  };

  return (
    <section>
      <div className="mb-12">
        <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          06. Maintenance & Support
        </span>
        <h2 className="text-4xl font-bold serif text-slate-900">Professional Website Care Plans.</h2>
        <p className="mt-4 text-slate-600 max-w-2xl leading-relaxed">Insurance for your digital asset. We handle the technical heavylifting so you can focus on your patients.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-5 text-sm font-black uppercase tracking-widest text-slate-400">Plan</th>
              {maintenancePlans.map((plan) => {
                const itemId = `maintenance-${plan.name.toLowerCase().replace(/\s+/g, '-')}`;
                const isSelected = cart.maintenancePlan?.id === itemId;
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
              <td className="px-6 py-4 font-bold text-slate-500">Updates</td>
              <td className="px-6 py-4 text-sm">Core, plugins, themes</td>
              <td className="px-6 py-4 text-sm font-medium">+ Speed Optimization</td>
              <td className="px-6 py-4 text-sm font-medium">+ Dev/design updates (2 hrs)</td>
            </tr>
            <tr className="bg-slate-50/50">
              <td className="px-6 py-4 font-bold text-slate-500">Backups</td>
              <td className="px-6 py-4 text-sm">Daily</td>
              <td className="px-6 py-4 text-sm">Daily</td>
              <td className="px-6 py-4 text-sm">Daily</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-bold text-slate-500">Security</td>
              <td className="px-6 py-4 text-sm">Basic monitoring</td>
              <td className="px-6 py-4 text-sm font-medium">Malware scanning</td>
              <td className="px-6 py-4 text-sm font-medium">Advanced security + recovery</td>
            </tr>
            <tr className="bg-slate-50/50">
              <td className="px-6 py-4 font-bold text-slate-500">Edits</td>
              <td className="px-6 py-4 text-sm font-medium">30 mins/month</td>
              <td className="px-6 py-4 text-sm font-medium">1 hour/month</td>
              <td className="px-6 py-4 text-sm font-medium">2 hours/month + strategy call</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-bold text-slate-500">Reports</td>
              <td className="px-6 py-4 text-sm font-medium">Monthly performance report</td>
              <td className="px-6 py-4 text-sm font-medium">+ Quarterly SEO audit</td>
              <td className="px-6 py-4 text-sm font-medium">+ Conversion rate tips + GA4/Tag Manager setup</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {maintenancePlans.map((plan) => {
          const itemId = `maintenance-${plan.name.toLowerCase().replace(/\s+/g, '-')}`;
          const isSelected = cart.maintenancePlan?.id === itemId;
          
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
      
      <div className="mt-8 text-center">
        <a href="https://seosuccor.com/web-development/wordpress-maintenance-management/" target="_blank" className="text-brand-primary font-bold hover:underline text-sm uppercase tracking-widest flex items-center justify-center gap-2">
          View Full Plan Details <span>→</span>
        </a>
      </div>
    </section>
  );
};

export default Maintenance;
