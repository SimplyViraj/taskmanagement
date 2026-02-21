export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  assigned_to?: string; 
  created_by: string; 
  due_date?: string;
  created_at: string; 
  updated_at: string; 
}