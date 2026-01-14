import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/testimonials', label: 'Testimonials', icon: '💬' },
    { path: '/admin/portfolio', label: 'Portfolio', icon: '💼' },
    { path: '/admin/services', label: 'Services', icon: '⚙️' },
    { path: '/admin/proposals', label: 'Proposals', icon: '📄' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-900">SEO Succor Admin</h1>
          <p className="text-sm text-slate-500 mt-1">Proposal Management</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              location.pathname.startsWith(item.path)
                ? 'bg-brand-primary/10 text-brand-primary font-medium'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="px-4 py-2 mb-2">
            <p className="text-sm font-medium text-slate-900">{user?.email}</p>
            <p className="text-xs text-slate-500">Admin User</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
