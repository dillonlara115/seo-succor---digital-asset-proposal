import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import { Testimonial } from '../../types';
import { supabase } from '../../lib/supabase';

const TestimonialsList: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/admin/testimonials', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Failed to load testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        loadTestimonials();
      }
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Testimonials</h1>
            <p className="text-slate-600">Manage client testimonials</p>
          </div>
          <button
            onClick={() => navigate('/admin/testimonials/new')}
            className="bg-brand-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-primary/90 transition"
          >
            + Add Testimonial
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Company</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Rating</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Status</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {testimonials.map((testimonial) => (
                <tr key={testimonial.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{testimonial.name}</div>
                    {testimonial.role && (
                      <div className="text-sm text-slate-500">{testimonial.role}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{testimonial.company || '-'}</td>
                  <td className="px-6 py-4">
                    {testimonial.rating && (
                      <div className="flex items-center">
                        {'★'.repeat(testimonial.rating)}
                        <span className="text-slate-400 ml-1">{'★'.repeat(5 - testimonial.rating)}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      testimonial.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {testimonial.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => navigate(`/admin/testimonials/${testimonial.id}`)}
                        className="text-brand-primary hover:text-brand-primary/80 font-medium text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial.id)}
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
          {testimonials.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              No testimonials yet. Create your first one!
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default TestimonialsList;
