import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Ticket, BookOpen, Users, MessageCircle, FileText, Clock, BarChart3, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import clsx from 'clsx';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tickets', icon: Ticket, label: 'Tickets' },
  { to: '/knowledge', icon: BookOpen, label: 'Knowledge Base' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/chat', icon: MessageCircle, label: 'Live Chat' },
  { to: '/canned-responses', icon: FileText, label: 'Canned Responses' },
  { to: '/sla', icon: Clock, label: 'SLA Config' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebar = (
    <div className="flex flex-col h-full bg-[var(--color-surface)] border-r border-[var(--color-border)]">
      <div className="px-6 py-5 border-b border-[var(--color-border)]">
        <h1 className="text-xl font-bold">
          <span className="text-rose-500">Do</span>
          <span className="text-[var(--color-text)]">Aide</span>
          <span className="text-[var(--color-text-secondary)] text-sm ml-1 font-normal">Support</span>
        </h1>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-rose-600/10 text-rose-500'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]'
            )}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar name={user?.full_name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--color-text)] truncate">{user?.full_name}</p>
            <p className="text-xs text-[var(--color-text-secondary)] truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="text-[var(--color-text-secondary)] hover:text-red-400">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setMobileOpen(true)} className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full">
            {sidebar}
          </div>
        </div>
      )}

      <div className="hidden lg:block w-64 h-screen fixed left-0 top-0">
        {sidebar}
      </div>
    </>
  );
}
