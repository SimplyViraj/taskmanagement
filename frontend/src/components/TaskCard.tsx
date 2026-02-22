import type { Task } from '../types';
import { Trash2, Edit2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: Task['status']) => void;
  isAdmin?: boolean;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange, isAdmin }: TaskCardProps) {
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${isOverdue ? 'border-l-4 border-red-500' : ''}`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 flex-1 break-words">{task.title}</h3>
        {isAdmin && (
          <div className="flex gap-2 ml-2">
            {onEdit && (
              <button
                onClick={() => onEdit(task)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(task.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
        {task.due_date && (
          <span className={`px-2 py-1 rounded text-xs font-medium ${isOverdue ? 'bg-red-100 text-red-800' : ''}`}>
            {new Date(task.due_date).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <select
          value={task.status}
          onChange={(e) => onStatusChange?.(task.id, e.target.value as Task['status'])}
          className={`px-3 py-1 rounded text-sm font-medium cursor-pointer ${statusColors[task.status]}`}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {task.due_date && (
          <span className={`text-xs ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
            {isOverdue ? 'Overdue' : `Due: ${new Date(task.due_date).toLocaleDateString()}`}
          </span>
        )}
      </div>
    </div>
  );
}
