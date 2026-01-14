import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Manage your proposals, content, and services</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/admin/testimonials"
            className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition hover:border-brand-primary"
          >
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-bold text-slate-900 mb-1">Testimonials</h3>
            <p className="text-sm text-slate-600">Manage client testimonials</p>
          </Link>

          <Link
            to="/admin/portfolio"
            className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition hover:border-brand-primary"
          >
            <div className="text-3xl mb-3">💼</div>
            <h3 className="font-bold text-slate-900 mb-1">Portfolio</h3>
            <p className="text-sm text-slate-600">Manage dev work showcase</p>
          </Link>

          <Link
            to="/admin/services"
            className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition hover:border-brand-primary"
          >
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="font-bold text-slate-900 mb-1">Services</h3>
            <p className="text-sm text-slate-600">Manage pricing & services</p>
          </Link>

          <Link
            to="/admin/proposals"
            className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition hover:border-brand-primary"
          >
            <div className="text-3xl mb-3">📄</div>
            <h3 className="font-bold text-slate-900 mb-1">Proposals</h3>
            <p className="text-sm text-slate-600">Create & manage proposals</p>
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/admin/proposals/new"
              className="block w-full bg-brand-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-primary/90 transition text-center"
            >
              Create New Proposal
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
