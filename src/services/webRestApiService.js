// import {TaskStorage} from "./taskStorage.js";
// import {TaskService} from "./taskService.js";
import {Task} from "../models/task.js";
import {v4 as uuidv4} from "uuid";

// const storage = new TaskStorage();
// const cliService = new TaskService();

export class WebRestApiService {
    constructor(taskStorage, cliService, taskService) {
        this.taskStorage = taskStorage;
        this.cliService = cliService;
        this.taskService = taskService;
    }

    async createTask(data) {
        const { title, description = '', completed = false, deadline = null } = data;

        if (!title) {
            throw new Error("Title is required.");
        }

        const tasks = await this.taskStorage.loadTasks();
        if (tasks.some(task => task.title === title)) {
            throw new Error("A task with this title already exists.");
        }

        const newTask = Task.create({
            id: uuidv4(),
            title,
            description,
            completed,
            deadline
        });

        await this.taskStorage.addTask(newTask);
        return newTask;
    }
}
