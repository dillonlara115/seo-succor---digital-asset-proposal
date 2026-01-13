import React, { useState } from 'react';
import { Cart } from '../types';

interface AcceptProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Cart;
  clientName: string;
}

const AcceptProposalModal: React.FC<AcceptProposalModalProps> = ({ 
  isOpen, 
  onClose, 
  cart,
  clientName 
}) => {
  const [formData, setFormData] = useState({
    contactName: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const calculateTotals = () => {
    const parsePrice = (price: string): number => {
      const cleaned = price.replace(/[$,]/g, '').trim();
      const match = cleaned.match(/(\d+)/);
      return match ? parseFloat(match[1]) : 0;
    };

    let oneTimeTotal = 0;
    let monthlyTotal = 0;

    const hasPlan = cart.pricingPlan || cart.leasePlan;
    if (hasPlan) monthlyTotal += 50; // Required hosting

    if (cart.pricingPlan) {
      oneTimeTotal += parsePrice(cart.pricingPlan.price);
    }
    if (cart.leasePlan) {
      monthlyTotal += parsePrice(cart.leasePlan.price);
    }
    if (cart.maintenancePlan) {
      monthlyTotal += parsePrice(cart.maintenancePlan.price);
    }

    cart.addons.forEach(addon => {
      const price = parsePrice(addon.price);
      if (addon.price.includes('/mo') || addon.price.includes('/month')) {
        monthlyTotal += price;
      } else if (!addon.price.includes('/hr') && !addon.price.includes('/page')) {
        oneTimeTotal += price;
      }
    });

    return {
      oneTimeTotal,
      monthlyTotal,
      annualTotal: monthlyTotal * 12,
      grandTotal: oneTimeTotal + (monthlyTotal * 12)
    };
  };

  const totals = calculateTotals();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    const proposalSummary = {
      pricingPlan: cart.pricingPlan,
      leasePlan: cart.leasePlan,
      maintenancePlan: cart.maintenancePlan,
      addons: cart.addons,
      totals
    };

    try {
      // Determine API URL based on environment
      // In production: use relative URL (Vercel handles routing)
      // In development: try Vercel dev first, then fallback to relative
      const isDevelopment = import.meta.env.DEV;
      let apiUrl = '/api/submit-proposal';  // Default to relative URL
      
      if (isDevelopment) {
        // In dev mode, try Vercel dev server first
        apiUrl = 'http://localhost:3001/api/submit-proposal';
      }
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientName,
          ...formData,
          proposalSummary
        }),
      }).catch(async (fetchError) => {
        // If fetch fails (CORS, network error, etc.), try relative URL as fallback
        if (isDevelopment && fetchError.name === 'TypeError') {
          console.warn('Vercel dev server not running, trying relative URL...');
          const fallbackResponse = await fetch('/api/submit-proposal', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              clientName,
              ...formData,
              proposalSummary
            }),
          });
          return fallbackResponse;
        }
        throw fetchError;
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit proposal');
      }

      setSubmitStatus('success');
      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        setFormData({ contactName: '', email: '', phone: '', notes: '' });
        setSubmitStatus('idle');
        onClose();
      }, 3000);
    } catch (error: any) {
      setSubmitStatus('error');
      
      // Provide helpful error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        if (import.meta.env.DEV) {
          setErrorMessage('API server not running. Please run `vercel dev` instead of `npm run dev` to test form submission locally.');
        } else {
          setErrorMessage('Network error. Please check your connection and try again.');
        }
      } else {
        setErrorMessage(error.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 print:hidden">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-slate-900">Accept Proposal</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {submitStatus === 'success' ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Proposal Accepted!</h3>
              <p className="text-slate-600">We've received your acceptance and will be in touch within 24-48 hours.</p>
            </div>
          ) : (
            <>
              {/* Proposal Summary */}
              <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-3">Proposal Summary</h3>
                <div className="space-y-2 text-sm">
                  {cart.pricingPlan && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">{cart.pricingPlan.name}</span>
                      <span className="font-medium">{cart.pricingPlan.price}</span>
                    </div>
                  )}
                  {cart.leasePlan && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">{cart.leasePlan.name}</span>
                      <span className="font-medium">{cart.leasePlan.price}</span>
                    </div>
                  )}
                  {cart.maintenancePlan && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">{cart.maintenancePlan.name}</span>
                      <span className="font-medium">{cart.maintenancePlan.price}</span>
                    </div>
                  )}
                  {cart.addons.length > 0 && (
                    <>
                      {cart.addons.map(addon => (
                        <div key={addon.id} className="flex justify-between">
                          <span className="text-slate-600">{addon.name}</span>
                          <span className="font-medium">{addon.price}</span>
                        </div>
                      ))}
                    </>
                  )}
                  {(cart.pricingPlan || cart.leasePlan) && (
                    <div className="flex justify-between pt-2 border-t border-slate-200">
                      <span className="text-slate-600">Required Hosting</span>
                      <span className="font-medium">$50/mo</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-slate-300 font-bold">
                    <span className="text-slate-900">Grand Total (First Year)</span>
                    <span className="text-brand-primary">${totals.grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-slate-700 mb-1">
                    Contact Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">
                    Additional Notes or Questions
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    placeholder="Any questions or special requirements?"
                  />
                </div>

                {submitStatus === 'error' && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {errorMessage}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Accept & Submit'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcceptProposalModal;
