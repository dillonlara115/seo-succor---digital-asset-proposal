
import React from 'react';
import { Cart as CartType, CartItem } from '../types';

interface CartProps {
  cart: CartType;
  onRemoveItem: (itemId: string, type: 'pricing' | 'lease' | 'maintenance' | 'addon') => void;
  isOpen: boolean;
  onToggle: () => void;
  onAcceptProposal: () => void;
}

const Cart: React.FC<CartProps> = ({ cart, onRemoveItem, isOpen, onToggle, onAcceptProposal }) => {
  const parsePrice = (price: string): number => {
    // Remove $, commas, and parse
    const cleaned = price.replace(/[$,]/g, '').trim();
    // Handle ranges like "$250–$500" by taking the first number
    const match = cleaned.match(/(\d+)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const calculateTotals = () => {
    let oneTimeTotal = 0;
    let monthlyTotal = 0;

    // Required hosting cost ($50/month) - always included when there's a plan
    const hasPlan = cart.pricingPlan || cart.leasePlan;
    const hostingCost = hasPlan ? 50 : 0;
    monthlyTotal += hostingCost;

    // Pricing plan (one-time)
    if (cart.pricingPlan) {
      oneTimeTotal += parsePrice(cart.pricingPlan.price);
    }

    // Lease plan (monthly)
    if (cart.leasePlan) {
      monthlyTotal += parsePrice(cart.leasePlan.price);
    }

    // Maintenance plan (monthly)
    if (cart.maintenancePlan) {
      monthlyTotal += parsePrice(cart.maintenancePlan.price);
    }

    // Add-ons
    cart.addons.forEach(addon => {
      const price = parsePrice(addon.price);
      if (addon.price.includes('/mo') || addon.price.includes('/month')) {
        monthlyTotal += price;
      } else if (addon.price.includes('/hr') || addon.price.includes('/page')) {
        // These are per-unit, not added to totals automatically
        // Could be handled differently if needed
      } else {
        // Assume one-time if no period specified
        oneTimeTotal += price;
      }
    });

    return { oneTimeTotal, monthlyTotal, annualTotal: monthlyTotal * 12, hostingCost };
  };

  const { oneTimeTotal, monthlyTotal, annualTotal, hostingCost } = calculateTotals();
  const totalItems = 
    (cart.pricingPlan ? 1 : 0) +
    (cart.leasePlan ? 1 : 0) +
    (cart.maintenancePlan ? 1 : 0) +
    cart.addons.length;

  return (
    <>
      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <button
          onClick={onToggle}
          className={`fixed bottom-6 left-4 sm:left-6 z-50 bg-brand-primary text-white px-4 sm:px-6 py-3 rounded-full font-bold shadow-xl hover:bg-brand-primary/90 transition transform hover:scale-105 flex items-center gap-2 print:hidden text-sm sm:text-base ${
            isOpen ? 'opacity-0 pointer-events-none' : ''
          }`}
        >
          <span className="hidden sm:inline">View Quote</span>
          <span className="sm:hidden">Quote</span>
          <span className="bg-white text-brand-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-black flex-shrink-0">
            {totalItems}
          </span>
        </button>
      )}

      {/* Fixed Cart Sidebar */}
      <div 
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto z-50 print:hidden transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Your Quote</h2>
          <button
            onClick={onToggle}
            className="text-slate-400 hover:text-slate-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Required Hosting */}
          {(cart.pricingPlan || cart.leasePlan) && (
            <div className="border-2 border-brand-primary/30 bg-brand-primary/5 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-bold text-slate-900">Required Hosting</p>
                  <p className="text-sm text-slate-500 mt-1">Non-negotiable monthly hosting fee</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">$50/mo</p>
                  <span className="text-xs text-slate-400">Required</span>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Plan */}
          {cart.pricingPlan && (
                <div className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{cart.pricingPlan.name}</p>
                      <p className="text-sm text-slate-500 mt-1">One-time payment</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{cart.pricingPlan.price}</p>
                      <button
                        onClick={() => onRemoveItem(cart.pricingPlan!.id, 'pricing')}
                        className="text-xs text-red-500 hover:text-red-700 mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mt-3">
                    <p className="text-xs font-semibold text-slate-700 mb-2">Payment Schedule:</p>
                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>50% Down Payment:</span>
                        <span className="font-semibold">${Math.round(parsePrice(cart.pricingPlan.price) * 0.5).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>50% Upon Completion:</span>
                        <span className="font-semibold">${Math.round(parsePrice(cart.pricingPlan.price) * 0.5).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
          )}

          {/* Lease Plan */}
          {cart.leasePlan && (
                <div className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{cart.leasePlan.name}</p>
                      <p className="text-sm text-slate-500 mt-1">Monthly lease</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{cart.leasePlan.price}</p>
                      <button
                        onClick={() => onRemoveItem(cart.leasePlan!.id, 'lease')}
                        className="text-xs text-red-500 hover:text-red-700 mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
          )}

          {/* Maintenance Plan */}
          {cart.maintenancePlan && (
                <div className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{cart.maintenancePlan.name}</p>
                      <p className="text-sm text-slate-500 mt-1">Monthly maintenance</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{cart.maintenancePlan.price}</p>
                      <button
                        onClick={() => onRemoveItem(cart.maintenancePlan!.id, 'maintenance')}
                        className="text-xs text-red-500 hover:text-red-700 mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
          )}

          {/* Add-ons */}
          {cart.addons.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-900 mb-3">Add-ons</h3>
                  <div className="space-y-3">
                    {cart.addons.map((addon) => (
                      <div key={addon.id} className="border border-slate-200 rounded-xl p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-slate-900">{addon.name}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {addon.price.includes('/mo') || addon.price.includes('/month')
                                ? 'Monthly'
                                : addon.price.includes('/hr') || addon.price.includes('/page')
                                ? 'Per unit'
                                : 'One-time'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-slate-900">{addon.price}</p>
                            <button
                              onClick={() => onRemoveItem(addon.id, 'addon')}
                              className="text-xs text-red-500 hover:text-red-700 mt-1"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
          )}

          {/* Totals */}
          <div className="border-t border-slate-200 pt-6 space-y-4">
            {oneTimeTotal > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-600">One-time Total</span>
                <span className="font-bold text-slate-900">${oneTimeTotal.toLocaleString()}</span>
              </div>
            )}
            {monthlyTotal > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-600">Monthly Recurring</span>
                  <span className="font-bold text-slate-900">${monthlyTotal.toLocaleString()}/mo</span>
                </div>
                {hostingCost > 0 && (
                  <div className="text-xs text-slate-500 pl-2">
                    (Includes required $50/mo hosting)
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-600">Annual Recurring</span>
                  <span className="font-bold text-slate-900">${annualTotal.toLocaleString()}/yr</span>
                </div>
              </>
            )}
            {(oneTimeTotal > 0 || monthlyTotal > 0) && (
              <>
                <div className="border-t border-slate-300 pt-4 flex justify-between">
                  <span className="text-lg font-bold text-slate-900">Grand Total (First Year)</span>
                  <span className="text-lg font-black text-brand-primary">
                    ${(oneTimeTotal + annualTotal).toLocaleString()}
                  </span>
                </div>
                {oneTimeTotal > 0 && cart.pricingPlan && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-4">
                    <p className="text-sm font-semibold text-slate-700 mb-2">Payment Schedule:</p>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>50% Down Payment:</span>
                        <span className="font-semibold text-slate-900">${Math.round(oneTimeTotal * 0.5).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>50% Upon Completion:</span>
                        <span className="font-semibold text-slate-900">${Math.round(oneTimeTotal * 0.5).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Accept Proposal Button */}
          {(oneTimeTotal > 0 || monthlyTotal > 0) && (
            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  onAcceptProposal();
                  onToggle(); // Close the cart when opening the accept modal
                }}
                className="w-full bg-slate-900 text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition transform hover:scale-[1.02]"
              >
                Accept Proposal
              </button>
            </div>
          )}

          {/* Empty State */}
          {totalItems === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">Your quote is empty</p>
              <p className="text-sm text-slate-400 mt-2">Select plans and add-ons to build your quote</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
