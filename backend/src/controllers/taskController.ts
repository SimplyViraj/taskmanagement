import { Request,Response } from "express";
import { TaskService } from "../services/taskService";

const taskService = new TaskService();

// Get all tasks
export const getAllTasks = async (
  req: Request,
  res: Response
) => {

  try {

    const tasks = await taskService.getAllTasks();

    res.status(200).json({
      success: true,
      data: tasks
    });

  } catch (error: any) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const getTaskById = async (
  req: Request,
  res: Response
) => {

  try {

    const { id } = req.params as { id: string };

    const task = await taskService.getTaskById(id);

    res.status(200).json({
      success: true,
      data: task
    });

  } catch (error: any) {

    res.status(404).json({
      success: false,
      message: error.message
    });

  }

};


export const createTask = async (
  req: Request,
  res: Response
) => {

  try {

    const task = await taskService.createTask(req.body);

    res.status(201).json({
      success: true,
      data: task
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};


export const updateTask = async (
  req: Request,
  res: Response
) => {

  try {

    const { id } = req.params as { id: string };

    const updatedTask =
      await taskService.updateTask(id, req.body);

    res.status(200).json({
      success: true,
      data: updatedTask
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};


export const deleteTask = async (
  req: Request,
  res: Response
) => {

  try {

    const { id } = req.params as { id: string };

    await taskService.deleteTask(id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};



// Update task status
export const updateTaskStatus = async (
  req: Request,
  res: Response
) => {

  try {

    const { id } = req.params as { id: string };

    const { status } = req.body;

    const updatedTask =
      await taskService.updateTaskStatus(id, status);

    res.status(200).json({
      success: true,
      data: updatedTask
    });

  } catch (error: any) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};