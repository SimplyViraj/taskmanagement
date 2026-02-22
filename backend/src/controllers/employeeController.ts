import { Request, Response } from "express";
import { EmployeeService } from "../services/employeeServices";

const employeeService = new EmployeeService();


// GET all employees
export const getAllEmployees = async (
  req: Request,
  res: Response
) => {

  try {

    const employees =
      await employeeService.getAllEmployees();

    res.status(200).json({
      success: true,
      data: employees
    });

  } catch (error: any) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



// GET employee by id
export const getEmployeeById = async (
  req: Request,
  res: Response
) => {

  try {

    const employee =
      await employeeService.getEmployeeById(
        req.params.id as string
      );

    res.status(200).json({
      success: true,
      data: employee
    });

  } catch (error: any) {

    res.status(404).json({
      success: false,
      message: error.message
    });

  }

};



// CREATE employee
export const createEmployee = async (
  req: Request,
  res: Response
) => {

  try {

    const employee =
      await employeeService.createEmployee(
        req.body
      );

    res.status(201).json({
      success: true,
      data: employee
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};



// UPDATE employee
export const updateEmployee = async (
  req: Request,
  res: Response
) => {

  try {

    const employee =
      await employeeService.updateEmployee(
        req.params.id as string,
        req.body
      );

    res.status(200).json({
      success: true,
      data: employee
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};



// DELETE employee
export const deleteEmployee = async (
  req: Request,
  res: Response
) => {

  try {

    await employeeService.deleteEmployee(
      req.params.id as string
    );

    res.status(200).json({
      success: true,
      message: "Employee deleted"
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};