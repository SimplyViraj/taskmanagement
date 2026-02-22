import { useEffect, useState } from 'react';
import type { Employee } from '../types';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Loader, Trash2, Plus } from 'lucide-react';
import { EmployeeModal } from '../components/EmployeeModal';

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addNotification } = useNotification();

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        const data = await api.getEmployees();
        setEmployees(data);
      } catch (error) {
        addNotification('Failed to load employees', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, [addNotification]);

  const handleCreateEmployee = async (employeeData: Partial<Employee> & { password?: string }) => {
    try {
      const newEmployee = await api.createEmployee(employeeData);
      setEmployees([...employees, newEmployee]);
      addNotification('Employee created successfully', 'success');
    } catch (error) {
      addNotification('Failed to create employee', 'error');
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
      await api.deleteEmployee(id);
      setEmployees(employees.filter((e) => e.id !== id));
      addNotification('Employee deleted successfully', 'success');
    } catch (error) {
      addNotification('Failed to delete employee', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Employees</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          Create Employee
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Department</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Joined</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{employee.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{employee.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      employee.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{employee.department || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(employee.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDeleteEmployee(employee.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {employees.length === 0 && (
        <div className="p-6 text-center text-gray-500">No employees found</div>
      )}

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateEmployee}
      />
    </div>
  );
}
