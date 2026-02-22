import { EmployeeRepository } from "../repositories/employeeRepository";
import { Employee } from "../types/Employee";

export class EmployeeService {

  private repository = new EmployeeRepository();


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
    data: Partial<Employee>
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

    return await this.repository.create(data);

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