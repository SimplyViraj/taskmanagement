import { useEffect, useState } from 'react';
import type { Task, Employee } from '../types';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Loader } from 'lucide-react';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export function AdminDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [filterStatus, setFilterStatus] = useState<Task['status'] | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<Task['priority'] | 'all'>('all');
  const { addNotification } = useNotification();

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, employeesData] = await Promise.all([api.getTasks(), api.getEmployees()]);
      setTasks(tasksData);
      setEmployees(employeesData);
    } catch (error) {
      addNotification('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      const newTask = await api.createTask({
        ...taskData,
        created_by: localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user')!).id : 'admin',
      });
      setTasks([newTask, ...tasks]);
      addNotification('Task created successfully', 'success');
    } catch (error) {
      addNotification('Failed to create task', 'error');
      throw error;
    }
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!selectedTask) return;
    try {
      const updated = await api.updateTask(selectedTask.id, taskData);
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
      addNotification('Task updated successfully', 'success');
    } catch (error) {
      addNotification('Failed to update task', 'error');
      throw error;
    }
  };

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    try {
      const updated = await api.updateTaskStatus(taskId, status);
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
      addNotification('Task status updated', 'success');
    } catch (error) {
      addNotification('Failed to update task status', 'error');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.deleteTask(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
      addNotification('Task deleted successfully', 'success');
    } catch (error) {
      addNotification('Failed to delete task', 'error');
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
  };

  const statusData = [
    { name: 'Pending', value: stats.pending, fill: '#6b7280' },
    { name: 'In Progress', value: stats.inProgress, fill: '#3b82f6' },
    { name: 'Completed', value: stats.completed, fill: '#10b981' },
  ].filter((d) => d.value > 0);

  const priorityData = [
    {
      priority: 'Low',
      count: tasks.filter((t) => t.priority === 'low').length,
    },
    {
      priority: 'Medium',
      count: tasks.filter((t) => t.priority === 'medium').length,
    },
    {
      priority: 'High',
      count: tasks.filter((t) => t.priority === 'high').length,
    },
  ];

  const employeeTasksData = employees.slice(0, 5).map((emp) => ({
    name: emp.name,
    tasks: tasks.filter((t) => t.assigned_to === emp.id).length,
  }));

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
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
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Status Distribution</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={(entry) => entry.name} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 h-32 flex items-center justify-center">No tasks yet</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Priority</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="priority" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Employees (by tasks)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={employeeTasksData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="tasks" stroke="#3b82f6" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Task Board */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Task Board</h2>
          <button
            onClick={() => {
              setSelectedTask(undefined);
              setShowModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create New Task
          </button>
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
                isAdmin
                onEdit={(t) => {
                  setSelectedTask(t);
                  setShowModal(true);
                }}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No tasks found</p>
        )}
      </div>

      <TaskModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedTask(undefined);
        }}
        onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
        task={selectedTask}
        employees={employees}
      />
    </div>
  );
}
