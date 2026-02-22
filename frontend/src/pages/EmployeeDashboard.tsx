import { useEffect, useState } from 'react';
import type { Task } from '../types';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { Loader } from 'lucide-react';
import { TaskCard } from '../components/TaskCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function EmployeeDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<Task['status'] | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<Task['priority'] | 'all'>('all');
  const { user } = useAuth();
  const { addNotification } = useNotification();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const allTasks = await api.getTasks();
        // Filter tasks assigned to this employee
        const myTasks = allTasks.filter((task) => task.assigned_to === user?.id);
        setTasks(myTasks);
      } catch (error) {
        addNotification('Failed to load tasks', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [user?.id, addNotification]);

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    try {
      const updated = await api.updateTaskStatus(taskId, status);
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
      addNotification('Task status updated', 'success');
    } catch (error) {
      addNotification('Failed to update task status', 'error');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filterStatus === 'all' || task.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || task.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  // Calculate statistics
  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    overdue: tasks.filter(
      (t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed'
    ).length,
  };

  const chartData = [
    { name: 'Pending', tasks: stats.pending },
    { name: 'In Progress', tasks: stats.inProgress },
    { name: 'Completed', tasks: stats.completed },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Assigned to You</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Pending</p>
          <p className="text-3xl font-bold text-gray-500 mt-2">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">In Progress</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.inProgress}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Completed</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Overdue</p>
          <p className={`text-3xl font-bold mt-2 ${stats.overdue > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {stats.overdue}
          </p>
        </div>
      </div>

      {/* Task Status Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Overview</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="tasks" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* My Tasks */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <div>
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="ml-2 px-3 py-1 border border-gray-300 rounded-lg"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Priority:</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="ml-2 px-3 py-1 border border-gray-300 rounded-lg"
            >
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Tasks Grid */}
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isAdmin={false}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            {tasks.length === 0 ? 'No tasks assigned to you yet' : 'No tasks matching your filters'}
          </p>
        )}
      </div>
    </div>
  );
}
