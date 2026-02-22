import { EmployeeRepository } from "../repositories/employeeRepository";
import { AuthService } from "./authService";
import { Employee } from "../types/Employee";

export class EmployeeService {

  private repository = new EmployeeRepository();
  private authService = new AuthService();

  async getAllEmployees(): Promise<Employee[]> {

    return await this.repository.getAll();

  }

  async getEmployeeById(id: string) {

    const employee = await this.repository.getById(id);

    if (!employee) {
      throw new Error("Employee not found");
    }

    return employee;

  }

  async createEmployee(
    data: Partial<Employee> & { password: string }
  ): Promise<Employee> {

    if (!data.name) {
      throw new Error("Name required");
    }

    if (!data.email) {
      throw new Error("Email required");
    }

    if (!data.role) {
      throw new Error("Role required");
    }

    if (!data.password) {
      throw new Error("Password required");
    }

    const authUser = await this.authService.createAuthUser(
      data.email,
      data.password
    );

    const employeeData: Partial<Employee> = {
      id: authUser.id,
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department || "General"
    };

    return await this.repository.create(employeeData);

  }

  async updateEmployee(
    id: string,
    updates: Partial<Employee>
  ): Promise<Employee> {

    await this.getEmployeeById(id);

    return await this.repository.update(id, updates);

  }

  async deleteEmployee(id: string): Promise<void> {

    await this.getEmployeeById(id);

    await this.repository.delete(id);

  }

  async getEmployeeTasks(id: string) {

    return await this.repository.getEmployeeTasks(id);

  }

}