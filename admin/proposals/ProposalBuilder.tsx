import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import { Proposal, Service, Cart, CartItem } from '../../types';
import { supabase } from '../../lib/supabase';

const ProposalBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState<Partial<Proposal>>({
    client_name: '',
    industry: '',
    core_problem: '',
    generated_summary: '',
    status: 'draft',
    selected_services: {
      pricingPlan: null,
      leasePlan: null,
      maintenancePlan: null,
      addons: [],
    },
  });
  const [cart, setCart] = useState<Cart>({
    pricingPlan: null,
    leasePlan: null,
    maintenancePlan: null,
    addons: [],
  });

  useEffect(() => {
    loadServices();
    if (id && id !== 'new') {
      loadProposal();
    }
  }, [id]);

  const loadServices = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/admin/services', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setServices(data.filter((s: Service) => s.is_active));
      }
    } catch (error) {
      console.error('Failed to load services:', error);
    }
  };

  const loadProposal = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/admin/proposals?id=${id}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(data);
        if (data.selected_services) {
          setCart(data.selected_services);
        }
      }
    } catch (error) {
      console.error('Failed to load proposal:', error);
    }
  };

  const toggleService = (service: Service) => {
    const cartItem: CartItem = {
      id: service.id,
      name: service.name,
      price: service.base_price,
      type: service.type,
      recurring: service.type !== 'pricing',
      recurringPeriod: service.type !== 'pricing' ? 'monthly' : undefined,
    };

    setCart((prev) => {
      const newCart = { ...prev };

      if (service.type === 'pricing') {
        if (newCart.pricingPlan?.id === service.id) {
          newCart.pricingPlan = null;
        } else {
          newCart.pricingPlan = cartItem;
          newCart.leasePlan = null; // Mutually exclusive
        }
      } else if (service.type === 'lease') {
        if (newCart.leasePlan?.id === service.id) {
          newCart.leasePlan = null;
        } else {
          newCart.leasePlan = cartItem;
          newCart.pricingPlan = null; // Mutually exclusive
        }
      } else if (service.type === 'maintenance') {
        if (newCart.maintenancePlan?.id === service.id) {
          newCart.maintenancePlan = null;
        } else {
          newCart.maintenancePlan = cartItem;
        }
      } else if (service.type === 'addon') {
        const existingIndex = newCart.addons.findIndex((a) => a.id === service.id);
        if (existingIndex >= 0) {
          newCart.addons = newCart.addons.filter((a) => a.id !== service.id);
        } else {
          newCart.addons = [...newCart.addons, cartItem];
        }
      }

      return newCart;
    });
  };

  const isServiceSelected = (service: Service): boolean => {
    if (service.type === 'pricing') return cart.pricingPlan?.id === service.id;
    if (service.type === 'lease') return cart.leasePlan?.id === service.id;
    if (service.type === 'maintenance') return cart.maintenancePlan?.id === service.id;
    if (service.type === 'addon') return cart.addons.some((a) => a.id === service.id);
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const proposalData = {
        ...formData,
        selected_services: cart,
      };

      const url = id && id !== 'new' 
        ? `/api/admin/proposals?id=${id}`
        : '/api/admin/proposals';
      
      const method = id && id !== 'new' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(proposalData),
      });

      if (response.ok) {
        navigate('/admin/proposals');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save proposal');
      }
    } catch (error) {
      console.error('Failed to save proposal:', error);
      alert('Failed to save proposal');
    } finally {
      setLoading(false);
    }
  };

  const groupedServices = {
    pricing: services.filter((s) => s.type === 'pricing'),
    lease: services.filter((s) => s.type === 'lease'),
    maintenance: services.filter((s) => s.type === 'maintenance'),
    addon: services.filter((s) => s.type === 'addon'),
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {id && id !== 'new' ? 'Edit Proposal' : 'Create Proposal'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Client Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Client Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  value={formData.industry || ''}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Core Problem
              </label>
              <textarea
                rows={4}
                value={formData.core_problem || ''}
                onChange={(e) => setFormData({ ...formData, core_problem: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
              />
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Proposal['status'] })}
                className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Service Selection */}
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Select Services</h2>

            {/* Pricing Plans */}
            {groupedServices.pricing.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Pricing Plans (Select One)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupedServices.pricing.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => toggleService(service)}
                      className={`p-6 border-2 rounded-lg cursor-pointer transition ${
                        isServiceSelected(service)
                          ? 'border-brand-primary bg-brand-primary/5'
                          : 'border-slate-200 hover:border-brand-primary/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 mb-2">{service.name}</h4>
                          <p className="text-lg font-black text-brand-primary mb-2">{service.base_price}</p>
                          {service.description && (
                            <p className="text-sm text-slate-600 mb-3">{service.description}</p>
                          )}
                          {Array.isArray(service.features) && service.features.length > 0 && (
                            <ul className="text-sm text-slate-600 space-y-1">
                              {service.features.slice(0, 3).map((feature, idx) => (
                                <li key={idx}>• {feature}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <input
                          type="checkbox"
                          checked={isServiceSelected(service)}
                          onChange={() => {}}
                          className="w-5 h-5 text-brand-primary border-slate-300 rounded focus:ring-brand-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lease Plans */}
            {groupedServices.lease.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Lease Plans (Select One)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {groupedServices.lease.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => toggleService(service)}
                      className={`p-6 border-2 rounded-lg cursor-pointer transition ${
                        isServiceSelected(service)
                          ? 'border-brand-primary bg-brand-primary/5'
                          : 'border-slate-200 hover:border-brand-primary/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 mb-2">{service.name}</h4>
                          <p className="text-lg font-black text-brand-primary">{service.base_price}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={isServiceSelected(service)}
                          onChange={() => {}}
                          className="w-5 h-5 text-brand-primary border-slate-300 rounded focus:ring-brand-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Maintenance Plans */}
            {groupedServices.maintenance.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Maintenance Plans (Select One)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {groupedServices.maintenance.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => toggleService(service)}
                      className={`p-6 border-2 rounded-lg cursor-pointer transition ${
                        isServiceSelected(service)
                          ? 'border-brand-primary bg-brand-primary/5'
                          : 'border-slate-200 hover:border-brand-primary/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 mb-2">{service.name}</h4>
                          <p className="text-lg font-black text-brand-primary">{service.base_price}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={isServiceSelected(service)}
                          onChange={() => {}}
                          className="w-5 h-5 text-brand-primary border-slate-300 rounded focus:ring-brand-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add-ons */}
            {groupedServices.addon.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Add-ons (Select Multiple)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedServices.addon.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => toggleService(service)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                        isServiceSelected(service)
                          ? 'border-brand-primary bg-brand-primary/5'
                          : 'border-slate-200 hover:border-brand-primary/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 mb-1">{service.name}</h4>
                          <p className="text-sm font-medium text-brand-primary">{service.base_price}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={isServiceSelected(service)}
                          onChange={() => {}}
                          className="w-5 h-5 text-brand-primary border-slate-300 rounded focus:ring-brand-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/proposals')}
              className="px-6 py-3 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-primary/90 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Proposal'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ProposalBuilder;
