import { supabase } from "../config/supabase";
import { Employee } from "../types/Employee";

export class EmployeeRepository {

  async getAll(): Promise<Employee[]> {

    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return data || [];

  }

  async getById(id: string): Promise<Employee | null> {

    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);

    return data;

  }


  async create(
    employee: Partial<Employee>
  ): Promise<Employee> {

    const { data, error } = await supabase
      .from("employees")
      .insert(employee)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;

  }

  async update(
    id: string,
    updates: Partial<Employee>
  ): Promise<Employee> {

    const { data, error } = await supabase
      .from("employees")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;

  }

  async delete(id: string): Promise<void> {

    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

  }


  async getEmployeeTasks(id: string) {

    const { data, error } = await supabase
      .from("employees")
      .select(`
        *,
        tasks (*)
      `)
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);

    return data;

  }

}