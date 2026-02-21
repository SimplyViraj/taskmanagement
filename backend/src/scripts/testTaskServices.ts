import { TaskService } from "../services/taskService";
const service = new TaskService();

async function test() {
    const newTask = await service.getAllTasks();
    console.log("All tasks:", newTask);
}
test();