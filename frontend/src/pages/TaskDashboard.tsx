import { useEffect, useState } from 'react';
import type { Task, Employee } from '../types';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Loader } from 'lucide-react';
import { TaskModal } from '../components/TaskModal';
import { TaskRow } from "../components/TaskRow";


export function TaskDashboard() {
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

 const filteredTasks = tasks
  .filter((task) => {
    const statusMatch = filterStatus === "all" || task.status === filterStatus;
    const priorityMatch =
      filterPriority === "all" || task.priority === filterPriority;
    return statusMatch && priorityMatch;
  })
  .sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );

 

 

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
        </div><div className="grid grid-cols-[1.2fr_2.5fr_0.8fr_1.2fr_1.2fr_0.8fr_1fr_1fr] items-center px-6 py-4 border-b border-border hover:bg-accent/40 transition-colors">
  <div>Task</div>
  <div>Description</div>
  <div>Assignee</div>
  <div>Created</div>
  <div>Due Date</div>
  <div>Priority</div>
  <div className='ml-20'>Status</div>
  <div className="text-right">Actions</div>
</div>
        {/* Tasks Grid */}
        {filteredTasks.length > 0 ? (
          <div className="flex flex-col gap-3">
  {filteredTasks.map((task) => {
    const employee = employees.find(
      (emp) => emp.id === task.assigned_to
    );

    return (
      <TaskRow
  key={task.id}
  task={task}
  employee={employee}
  onEdit={(task) => {
    setSelectedTask(task);
    setShowModal(true);
  }}
  onDelete={handleDeleteTask}
/>
    );
  })}
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
