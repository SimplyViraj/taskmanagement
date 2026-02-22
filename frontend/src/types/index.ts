export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assigned_to?: string;
  created_by: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  department?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  access_token: string;
  user: AuthUser;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
