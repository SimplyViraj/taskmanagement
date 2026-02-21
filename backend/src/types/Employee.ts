export interface Employee {
  id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
  department?: string;
  created_at: string;
  updated_at: string;
}