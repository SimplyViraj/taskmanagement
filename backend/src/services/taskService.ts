import { TaskRepository } from "../repositories/taskRepository";
import { Task } from "../types/Task";

export class TaskService 
{
    private repository: TaskRepository;

    constructor() {
        this.repository = new TaskRepository();
    }

    async getAllTasks(): Promise<Task[]> {
        return this.repository.getAll();
    }

    async getTaskById(id: string): Promise<Task> 
    {
        const task = await this.repository.getById(id);
        if (!task) {
            throw new Error("Task not found");
        }
        return task;
    }

    async createTask(taskData: Partial<Task>): Promise<Task> 
    {
        if(!taskData.title)
        {
            throw new Error("Title is required");
        }
        if(!taskData.created_by)
        {
            throw new Error("Created by is required");
        }
        return this.repository.create(taskData);
    }

    async updateTask(id: string, updates: Partial<Task>): Promise<Task>
    {
        await this.getTaskById(id);
        return this.repository.update(id, updates);
    }

    async deleteTask(id: string): Promise<void>
    {
        await this.getTaskById(id);
        return this.repository.delete(id);
    }

    async updateTaskStatus(id: string, status: Task["status"]): Promise<Task>
    {
        await this.getTaskById(id);
        const validStatuses = ["pending", "in-progress", "completed"];
        if (!validStatuses.includes(status)) {
            throw new Error("Invalid status");
        }
        return this.repository.updateStatus(id, status);
    }
}