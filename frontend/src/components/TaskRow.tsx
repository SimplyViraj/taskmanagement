import { Pencil, Trash2 } from "lucide-react";
import type { Task, Employee } from "../types";

interface TaskRowProps {
  task: Task;
  employee?: Employee;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskRow({
  task,
  employee,
  onEdit,
  onDelete,
}: TaskRowProps) {
  const progress =
    task.status === "completed"
      ? 100
      : task.status === "in-progress"
      ? 60
      : 20;

  const priorityColor =
    task.priority === "high"
      ? "text-red-600 bg-red-50"
      : task.priority === "medium"
      ? "text-yellow-600 bg-yellow-50"
      : "text-gray-600 bg-gray-100";

  const formatDateTime = (date?: string) => {
    if (!date) return "-";

    const d = new Date(date);

    return (
      d.toLocaleDateString() +
      " " +
      d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  return (
    <div className="grid grid-cols-[1.2fr_2.5fr_0.8fr_1.2fr_1.2fr_0.8fr_1fr_1fr] items-center px-6 py-4 border-b border-border hover:bg-accent/40 transition-colors">

      {/* Task */}
      <div className="font-medium text-foreground">
        {task.title}
      </div>

      {/* Description */}
      <div className="text-muted-foreground text-sm truncate">
        {task.description || "-"}
      </div>

      {/* Assignee */}
      <div>
        {employee ? (
          <div className="relative group w-fit">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
              {employee.name.charAt(0).toUpperCase()}
            </div>

            <div className="absolute left-10 top-1/2 -translate-y-1/2 
              opacity-0 group-hover:opacity-100
              bg-black text-white text-xs px-2 py-1 rounded-md
              whitespace-nowrap transition-opacity">
              {employee.name}
            </div>
          </div>
        ) : (
          "-"
        )}
      </div>

      {/* Created date */}
      <div className="text-sm text-muted-foreground">
        {formatDateTime(task.created_at)}
      </div>

      {/* Due date */}
      <div className="text-sm text-muted-foreground">
        {formatDateTime(task.due_date)}
      </div>

      {/* Priority */}
      <div>
        <span
          className={`px-3 py-1 rounded-lg text-xs font-medium capitalize ${priorityColor}`}
        >
          {task.priority}
        </span>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-xs text-muted-foreground w-8">
          {progress}%
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 justify-end">

        <button
          onClick={() => onEdit(task)}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <Pencil className="w-4 h-4 text-muted-foreground" />
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="p-2 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>

      </div>
    </div>
  );
}