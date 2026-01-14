import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import { PortfolioItem } from '../../types';
import { supabase } from '../../lib/supabase';

const PortfolioList: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/admin/portfolio', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPortfolio(data);
      }
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/admin/portfolio?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        loadPortfolio();
      }
    } catch (error) {
      console.error('Failed to delete portfolio item:', error);
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Portfolio</h1>
            <p className="text-slate-600">Manage dev work showcase items</p>
          </div>
          <button
            onClick={() => navigate('/admin/portfolio/new')}
            className="bg-brand-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-primary/90 transition"
          >
            + Add Portfolio Item
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition">
              <div className="aspect-video bg-slate-100 overflow-hidden">
                {item.image_url && (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-6">
                <h3 className="font-bold text-slate-900 mb-2">{item.name}</h3>
                {item.category && (
                  <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded mb-2">
                    {item.category}
                  </span>
                )}
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => navigate(`/admin/portfolio/${item.id}`)}
                    className="text-brand-primary hover:text-brand-primary/80 font-medium text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {portfolio.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            No portfolio items yet. Create your first one!
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PortfolioList;
