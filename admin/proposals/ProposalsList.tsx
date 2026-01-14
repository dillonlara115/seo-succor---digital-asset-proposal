import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import { Proposal } from '../../types';
import { supabase } from '../../lib/supabase';

const ProposalsList: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadProposals();
  }, [statusFilter]);

  const loadProposals = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/admin/proposals', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        let filtered = data;
        if (statusFilter !== 'all') {
          filtered = data.filter((p: Proposal) => p.status === statusFilter);
        }
        setProposals(filtered);
      }
    } catch (error) {
      console.error('Failed to load proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this proposal?')) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`/api/admin/proposals?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        loadProposals();
      }
    } catch (error) {
      console.error('Failed to delete proposal:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-slate-100 text-slate-700',
      sent: 'bg-blue-100 text-blue-700',
      accepted: 'bg-green-100 text-green-700',
      declined: 'bg-red-100 text-red-700',
      archived: 'bg-slate-100 text-slate-500',
    };
    return colors[status] || colors.draft;
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Proposals</h1>
            <p className="text-slate-600">Create and manage client proposals</p>
          </div>
          <button
            onClick={() => navigate('/admin/proposals/new')}
            className="bg-brand-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-primary/90 transition"
          >
            + Create Proposal
          </button>
        </div>

        <div className="mb-6">
          <div className="flex space-x-2">
            {['all', 'draft', 'sent', 'accepted', 'declined', 'archived'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  statusFilter === status
                    ? 'bg-brand-primary text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Client</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Slug</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Created</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {proposals.map((proposal) => (
                <tr key={proposal.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{proposal.client_name}</div>
                    {proposal.industry && (
                      <div className="text-sm text-slate-500">{proposal.industry}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`/proposal/${proposal.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-primary hover:text-brand-primary/80 text-sm font-mono"
                    >
                      {proposal.slug}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(proposal.status)}`}>
                      {proposal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(proposal.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <a
                        href={`/proposal/${proposal.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-primary hover:text-brand-primary/80 font-medium text-sm"
                      >
                        View
                      </a>
                      <button
                        onClick={() => navigate(`/admin/proposals/${proposal.id}`)}
                        className="text-brand-primary hover:text-brand-primary/80 font-medium text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(proposal.id)}
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
          {proposals.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              No proposals found. Create your first one!
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProposalsList;
