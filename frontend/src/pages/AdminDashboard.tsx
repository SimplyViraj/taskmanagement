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
  <div className="min-h-screen bg-gradient-to-br from-white to-gray-100  space-y-6">


    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col justify-between">

        <div>
          <p className="text-gray-500 text-sm font-medium mb-4">
            Overall Information
          </p>

          <div className="flex gap-10">

            <div>
              <p className="text-4xl font-bold text-gray-900">
                {stats.completed}
              </p>
              <p className="text-gray-400 text-sm">
                Tasks done
              </p>
            </div>

            <div>
              <p className="text-4xl font-bold text-gray-900">
                {stats.pending}
              </p>
              <p className="text-gray-400 text-sm">
                Tasks pending
              </p>
            </div>

          </div>
        </div>


        <div className="flex justify-between mt-6">

          <div className="bg-gray-100 rounded-xl p-4 text-center flex-1 mr-2">
            <p className="text-xl font-semibold">{stats.total}</p>
            <p className="text-gray-400 text-xs">Total</p>
          </div>

          <div className="bg-gray-100 rounded-xl p-4 text-center flex-1 mx-2">
            <p className="text-xl font-semibold">{stats.inProgress}</p>
            <p className="text-gray-400 text-xs">In Progress</p>
          </div>

          <div className="bg-gray-100 rounded-xl p-4 text-center flex-1 ml-2">
            <p className="text-xl font-semibold">{stats.completed}</p>
            <p className="text-gray-400 text-xs">Completed</p>
          </div>

        </div>

      </div>



      <div className="bg-white rounded-2xl shadow-sm p-6">

        <p className="text-gray-500 text-sm font-medium mb-4">
          Weekly Progress
        </p>

        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={employeeTasksData}>
            <Line
              type="monotone"
              dataKey="tasks"
              stroke="#111"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>

      </div>


      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-sm p-6 text-white flex flex-col justify-between">

        <div>

          <p className="text-sm text-gray-300 mb-2">
            Month Progress
          </p>

          <p className="text-3xl font-bold">
            {Math.round(
              (stats.completed / Math.max(stats.total, 1)) * 100
            )}%
          </p>

        </div>


        <div className="mt-4">

          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                innerRadius={40}
                outerRadius={55}
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill="#fff" opacity={0.7} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>


    <div>

      <div className="flex justify-between items-center mb-4">

        <p className="text-lg font-semibold text-gray-800">
          Task in process ({stats.inProgress})
        </p>

      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {tasks
          .filter((t) => t.status === "in-progress")
          .slice(0, 2)
          .map((task) => (

            <div
              key={task.id}
              className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition"
            >
              <TaskCard
                task={task}
                isAdmin
                onEdit={(t) => {
                  setSelectedTask(t);
                  setShowModal(true);
                }}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            </div>

          ))}


        <div
          onClick={() => {
            setSelectedTask(undefined);
            setShowModal(true);
          }}
          className="min-h-48 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-gray-400 transition text-gray-400"
        >
          + Add task
        </div>


      </div>

    </div>

    <div className="bg-white rounded-2xl shadow-sm p-6">

      <div className="flex justify-between items-center mb-6">

        <p className="text-xl font-semibold">
          All Tasks
        </p>

        <button
          onClick={() => {
            setSelectedTask(undefined);
            setShowModal(true);
          }}
          className="bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition"
        >
          Create Task
        </button>

      </div>


      {filteredTasks.length > 0 ? (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {filteredTasks.map((task) => (

            <div
              key={task.id}
              className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition"
            >

              <TaskCard
                task={task}
                isAdmin
                onEdit={(t) => {
                  setSelectedTask(t);
                  setShowModal(true);
                }}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />

            </div>

          ))}

        </div>

      ) : (

        <p className="text-gray-400 text-center py-10">
          No tasks found
        </p>

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
