import { supabase } from "../config/supabase";
import { Task } from "../types/Task";

export class TaskRepository {
    async getAll(): Promise<Task[]> {
        const { data, error } = await supabase
            .from("tasks").select("*").order("created_at", { ascending: false });
        if (error) {
            throw new Error(error.message);
        }
        return data || [];
    }

    async getById(id: string): Promise<Task | null> {
        const { data, error } = await supabase
            .from("tasks").select("*").eq("id", id).single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async create(task:Partial<Task>): Promise<Task> {
        const { data, error } = await supabase
            .from("tasks").insert(task).select().single();
        if (error) {
            throw new Error(error.message);
        }   
        return data;
    }

    async update(id: string, updates: Partial<Task>): Promise<Task> {
        const { data, error } = await supabase
            .from("tasks").update(updates).eq("id", id).select().single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from("tasks").delete().eq("id", id);
        if (error) {
            throw new Error(error.message);
        }
    }

    async updateStatus(id: string, status: Task["status"]): Promise<Task> {
        const { data, error } = await supabase
            .from("tasks").update({ status }).eq("id", id).select().single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }

    async updatePriority(id: string, priority: Task["priority"]): Promise<Task> {
        const { data, error } = await supabase
            .from("tasks").update({ priority }).eq("id", id).select().single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }

    // async getAllWithEmployee()
    // {
    //     const { data, error } = await supabase
    //         .from("tasks")
    //         .select(`*,employees(id,name,email)`);
    //     if (error) {
    //         throw new Error(error.message);
    //     }
    //     return data || [];
    // }
}