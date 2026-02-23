import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  StickyNote,
  LogOut,
  Home,
  Users,
  Calendar,
} from "lucide-react";
import type { ReactNode } from "react";
import api from "../services/api";
import type { Employee } from "../types";
import { useNotification } from "../context/NotificationContext";
import { DashboardHeader } from "./DashboardHeader";

interface DashboardLayoutProps {
  children: ReactNode;
  isAdmin: boolean;
}

export function DashboardLayout({
  children,
  isAdmin,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);

  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    if (!user?.id) return;

    const loadEmployee = async () => {
      try {
        setLoading(true);

        const employeeData = await api.getEmployeeById(user.id);

        setEmployee(employeeData);
      } catch (error) {
        console.error("Failed to load employee data", error);
        addNotification("Failed to load employee data", "error");
      } finally {
        setLoading(false);
      }
    };

    loadEmployee();
  }, [user?.id, addNotification]);

  const menuItems = isAdmin
    ? [
        { label: "Dashboard", icon: Home, href: "#dashboard" },
        { label: "Task Board", icon: StickyNote, href: "#tasks" },
        { label: "Employees", icon: Users, href: "#employees" },
        { label: "Calendar", icon: Calendar, href: "#calendar" },
      ]
    : [{ label: "My Tasks", icon: Home, href: "#tasks" }];

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-transparent m-8 border rounded-xl flex flex-col transition-all duration-300 shrink-0`}
      >
        {/* Logo */}
        <div className="p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary flex bg-black items-center justify-center">
            <span className="text-primary-foreground font-bold text-white text-sm">
              ◆
            </span>
          </div>

          {!collapsed && (
            <span className="text-xl font-bold tracking-tight">
              Task Manager
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                index === 0
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </a>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 space-y-1 border-t border-border">
          {/* User */}
          <div
            className={`flex items-center gap-3 px-3 py-2.5 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
              {employee?.name?.charAt(0).toUpperCase() ||
                user?.email?.charAt(0).toUpperCase()}
            </div>

            {!collapsed && (
              <div className="flex-1 truncate">
                {/* ✅ FIX 3: show employee name */}
                <p className="text-sm font-medium truncate">
                  {employee?.name || user?.email}
                </p>
              </div>
            )}
          </div>

          {/* Settings */}
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Settings className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Settings</span>}
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>

          {/* Collapse */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 shrink-0" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <DashboardHeader>
          {isAdmin
            ? employee?.name || "Admin Dashboard"
            : "My Tasks"}
        </DashboardHeader>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}