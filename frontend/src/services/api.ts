import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { Task, Employee, AuthResponse, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  }

  // Task endpoints
  async getTasks(): Promise<Task[]> {
    const response = await this.client.get<ApiResponse<Task[]>>('/tasks');
    return response.data.data || [];
  }

  async getTaskById(id: string): Promise<Task> {
    const response = await this.client.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data.data!;
  }

  async createTask(task: Partial<Task>): Promise<Task> {
    const response = await this.client.post<ApiResponse<Task>>('/tasks', task);
    return response.data.data!;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const response = await this.client.put<ApiResponse<Task>>(`/tasks/${id}`, updates);
    return response.data.data!;
  }

  async updateTaskStatus(id: string, status: Task['status']): Promise<Task> {
    const response = await this.client.patch<ApiResponse<Task>>(`/tasks/${id}/status`, { status });
    return response.data.data!;
  }

  async deleteTask(id: string): Promise<void> {
    await this.client.delete(`/tasks/${id}`);
  }

  // Employee endpoints
  async getEmployees(): Promise<Employee[]> {
    const response = await this.client.get<ApiResponse<Employee[]>>('/employees');
    return response.data.data || [];
  }

  async getEmployeeById(id: string): Promise<Employee> {
    const response = await this.client.get<ApiResponse<Employee>>(`/employees/${id}`);
    return response.data.data!;
  }

  async createEmployee(employee: Partial<Employee> & { password: string }): Promise<Employee> {
    const response = await this.client.post<ApiResponse<Employee>>('/employees', employee);
    return response.data.data!;
  }

  async updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee> {
    const response = await this.client.put<ApiResponse<Employee>>(`/employees/${id}`, updates);
    return response.data.data!;
  }

  async deleteEmployee(id: string): Promise<void> {
    await this.client.delete(`/employees/${id}`);
  }
}

export default new ApiClient();
