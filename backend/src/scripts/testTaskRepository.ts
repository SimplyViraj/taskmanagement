import { TaskRepository } from "../repositories/taskRepository";

const repo= new TaskRepository();

async function test() {
    const newTask = await repo.getAll();
    console.log("All tasks:", newTask);
}

test();