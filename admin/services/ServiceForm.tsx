import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import { Service } from '../../types';
import { supabase } from '../../lib/supabase';

const ServiceForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Service>>({
    name: '',
    type: 'pricing',
    base_price: '',
    description: '',
    features: [],
    category: '',
    display_order: 0,
    is_active: true,
    metadata: {},
  });
  const [featuresText, setFeaturesText] = useState('');

  useEffect(() => {
    if (id && id !== 'new') {
      loadService();
    }
  }, [id]);

  const loadService = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/admin/services?id=${id}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(data);
        setFeaturesText(Array.isArray(data.features) ? data.features.join('\n') : '');
      }
    } catch (error) {
      console.error('Failed to load service:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const features = featuresText.split('\n').filter(f => f.trim()).map(f => f.trim());

      const submitData = {
        ...formData,
        features,
      };

      const url = id && id !== 'new' 
        ? `/api/admin/services?id=${id}`
        : '/api/admin/services';
      
      const method = id && id !== 'new' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        navigate('/admin/services');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save service');
      }
    } catch (error) {
      console.error('Failed to save service:', error);
      alert('Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {id && id !== 'new' ? 'Edit Service' : 'New Service'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Service['type'] })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
              >
                <option value="pricing">Pricing</option>
                <option value="lease">Lease</option>
                <option value="maintenance">Maintenance</option>
                <option value="addon">Add-on</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Base Price *
            </label>
            <input
              type="text"
              required
              value={formData.base_price}
              onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
              placeholder="$3,000 or $199/mo"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Features (one per line)
            </label>
            <textarea
              rows={6}
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={formData.display_order || 0}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-brand-primary border-slate-300 rounded focus:ring-brand-primary"
            />
            <label htmlFor="is_active" className="ml-2 text-sm font-medium text-slate-700">
              Active (visible on proposals)
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/admin/services')}
              className="px-6 py-3 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-primary/90 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ServiceForm;
