import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { EmployeeManagement } from './pages/EmployeeManagement';
import { DashboardLayout } from './components/DashboardLayout';
import { NotificationContainer } from './components/NotificationContainer';
import { Loader } from 'lucide-react';
import api from './services/api';
import { TaskDashboard } from './pages/TaskDashboard';
import { AdminCalendar } from './pages/AdminCalendar';
type CurrentPage = 'dashboard' | 'tasks' | 'employees' | 'calendar';

function App() {
  const { isAuthenticated, loading, user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState<CurrentPage>('dashboard');
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (isAuthenticated && user) {
        try {
          const employees = await api.getEmployees();
          const currentEmployee = employees.find((e) => e.email === user.email);
          setIsAdmin(currentEmployee?.role === 'admin');
        } catch {
          setIsAdmin(false);
        }
      }
      setCheckingRole(false);
    };

    checkRole();
  }, [isAuthenticated, user]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'dashboard';
      if (['dashboard', 'tasks', 'employees','calendar'].includes(hash)) {
        setCurrentPage(hash as CurrentPage);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (loading || checkingRole) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <NotificationContainer />
      </>
    );
  }

  const renderContent = () => {
    if (isAdmin) {
      switch (currentPage) {
        case 'employees':
          return <EmployeeManagement />;
        case 'tasks':
          return <TaskDashboard />;
        case 'calendar':
          return <AdminCalendar />;
        default:
          return <AdminDashboard />;
      }
    } else {
      return <EmployeeDashboard />;
    }
  };

  return (
    <div className="glasscard bg-white">
    <DashboardLayout isAdmin={isAdmin}>
      {renderContent()}
      <NotificationContainer />
    </DashboardLayout>
    </div>
  );
}

export default App;
