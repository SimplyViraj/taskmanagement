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
  <div className="min-h-screen bg-gradient-to-br from-[#f6f8fb] via-[#f3f6fa] to-[#eef2f7] p-6 space-y-6">


    {/* ================= TOP GRID ================= */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


      {/* OVERALL INFO CARD */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7 flex flex-col justify-between">

        <div>

          <p className="text-gray-400 text-sm font-medium mb-6">
            Your Task Summary
          </p>

          <div className="flex gap-12">

            <div>
              <p className="text-5xl font-bold text-gray-900 tracking-tight">
                {stats.completed}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Completed
              </p>
            </div>

            <div>
              <p className="text-5xl font-bold text-gray-900 tracking-tight">
                {stats.pending}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Pending
              </p>
            </div>

          </div>

        </div>


        {/* bottom mini cards */}
        <div className="grid grid-cols-3 gap-3 mt-8">

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-lg font-semibold text-gray-900">
              {stats.total}
            </p>
            <p className="text-xs text-gray-400">
              Total
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-lg font-semibold text-blue-600">
              {stats.inProgress}
            </p>
            <p className="text-xs text-gray-400">
              Active
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className={`text-lg font-semibold ${
              stats.overdue > 0
                ? "text-red-600"
                : "text-green-600"
            }`}>
              {stats.overdue}
            </p>
            <p className="text-xs text-gray-400">
              Overdue
            </p>
          </div>

        </div>

      </div>



      {/* TASK ACTIVITY CHART */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">

        <div className="mb-5">

          <p className="text-gray-400 text-sm font-medium">
            Task Activity
          </p>

          <p className="text-gray-900 font-semibold mt-1">
            Current distribution
          </p>

        </div>

        <ResponsiveContainer width="100%" height={180}>

          <BarChart data={chartData}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
            />

            <XAxis
              dataKey="name"
              tick={{ fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip />

            <Bar
              dataKey="tasks"
              fill="#6366f1"
              radius={[8, 8, 0, 0]}
              barSize={40}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>



      {/* DARK PROGRESS CARD */}
      <div className="rounded-3xl p-7 text-white shadow-sm relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #111827 0%, #1f2937 100%)"
        }}
      >

        <p className="text-gray-300 text-sm mb-3">
          Completion Progress
        </p>

        <p className="text-4xl font-bold mb-6">

          {Math.round(
            (stats.completed /
              Math.max(stats.total, 1)) *
              100
          )}%

        </p>


        {/* progress bar */}
        <div className="w-full bg-gray-700 rounded-full h-2">

          <div
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{
              width: `${
                (stats.completed /
                  Math.max(stats.total, 1)) *
                100
              }%`
            }}
          />

        </div>

      </div>

    </div>



    {/* ================= TASK SECTION ================= */}
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">


      {/* Header */}
      <div className="mb-6">

        <p className="text-gray-400 text-sm font-medium">
          Your Tasks
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-1">
          Assigned Tasks
        </h2>

      </div>



      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">

        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as any)
          }
          className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">
            In Progress
          </option>
          <option value="completed">
            Completed
          </option>
        </select>


        <select
          value={filterPriority}
          onChange={(e) =>
            setFilterPriority(e.target.value as any)
          }
          className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">
            Medium
          </option>
          <option value="high">
            High
          </option>
        </select>

      </div>



      {/* Tasks grid */}
      {filteredTasks.length > 0 ? (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {filteredTasks.map(task => (

            <div
              key={task.id}
              className="bg-gray-50 hover:bg-gray-100 transition rounded-2xl p-5 border border-gray-100"
            >

              <TaskCard
                task={task}
                isAdmin={false}
                onStatusChange={handleStatusChange}
              />

            </div>

          ))}

        </div>

      ) : (

        <div className="text-center py-14 text-gray-400">

          {tasks.length === 0
            ? "No tasks assigned yet"
            : "No tasks match filters"}

        </div>

      )}

    </div>

  </div>
);
}
