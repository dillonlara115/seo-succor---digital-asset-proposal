import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import { Service } from '../../types';
import { supabase } from '../../lib/supabase';

const ServicesList: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadServices();
  }, [filterType]);

  const loadServices = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const url = filterType === 'all' 
        ? '/api/admin/services'
        : `/api/admin/services?type=${filterType}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/admin/services?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        loadServices();
      }
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Services</h1>
            <p className="text-slate-600">Manage pricing plans, lease plans, maintenance, and add-ons</p>
          </div>
          <button
            onClick={() => navigate('/admin/services/new')}
            className="bg-brand-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-primary/90 transition"
          >
            + Add Service
          </button>
        </div>

        <div className="mb-6">
          <div className="flex space-x-2">
            {['all', 'pricing', 'lease', 'maintenance', 'addon'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterType === type
                    ? 'bg-brand-primary text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Type</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Price</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Status</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{service.name}</div>
                    {service.description && (
                      <div className="text-sm text-slate-500 mt-1">{service.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded font-medium">
                      {service.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{service.base_price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      service.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {service.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => navigate(`/admin/services/${service.id}`)}
                        className="text-brand-primary hover:text-brand-primary/80 font-medium text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {services.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              No services found. Create your first one!
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ServicesList;
