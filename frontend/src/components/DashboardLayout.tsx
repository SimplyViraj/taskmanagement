import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, Home, Users } from 'lucide-react';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  isAdmin: boolean;
}

export function DashboardLayout({ children, isAdmin }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout, user } = useAuth();

  const menuItems = isAdmin
    ? [
        { label: 'Dashboard', icon: Home, href: '#dashboard' },
        { label: 'Task Board', icon: Users, href: '#tasks' },
        { label: 'Employees', icon: Users, href: '#employees' },
      ]
    : [{ label: 'My Tasks', icon: Home, href: '#tasks' }];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h2 className="text-xl font-bold">Task Manager</h2>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </a>
          ))}
        </nav>

        <div className="border-t border-gray-700 p-4">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
              {user?.email.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="flex-1 truncate">
                <p className="text-sm font-medium truncate">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className="w-full mt-4 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {isAdmin ? 'Admin Dashboard' : 'My Tasks'}
            </h1>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
