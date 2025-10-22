import Task from "../models/task.js";
import validation from "../services/validation.js";
import { v4 as uuidv4 } from 'uuid';
import {TaskStorage} from "./taskStorage.js";
import {CliView} from "../views/cliView.js";

const storage = new TaskStorage();

export class CliService {
    constructor(taskStorage, cliView) {
        this.taskStorage = taskStorage;
        this.cliView = cliView;
    }

    // Internal method to parse create new tasks
    #newTask(title, desc, isCompleted, deadline) {
        const task = new Task(uuidv4(), title, desc, isCompleted, deadline);
            storage.addTask(task)
                .then(resolve => {

                }).catch( error => {
                    console.log("[cliService.js Line 21 - ERROR] Error adding task: ", error);
            });
    }

    async addTask(options) {
        const {title, desc, priority, rawDeadline} = options;
        const deadline = validation.parseDateOrNow(rawDeadline);

        console.log(`Adding task: Title:"${title}", 
                    Description:"${desc}", 
                    Priority:${priority}, 
                    Deadline:${deadline.toISOString().substring(0, 10)}`);

        const tasks = await storage.loadTasks(); // Wait for promise
        if (!title) {
            console.log("Error: Title is required.");
            return;
        }
        if (tasks.some(task => task.title === title)) {
            console.log("Error: A task with this title already exists.");
            return;
        }
        this.#newTask(title, desc, false, deadline);
        console.log("Task added successfully.");
    }

    async removeTask(options) {
        const {title} = options;
        if (!title) {
            console.log("Error: Title is required.");
            return;
        }

        const tasks = await storage.loadTasks(); // Wait for promise
        const task = tasks.find(task => task.title === title);
        if (!task) {
            console.log("Error: No task found with this title.");
            return;
        }
        await storage.removeTask(task.id);
        console.log(`Task "${title}" removed successfully.`);
    }

    async markTaskAsDone(options) {
        const {title} = options;
        if (!title) {
            console.log("Error: Title is required.");
            return;
        }

        const tasks = await storage.loadTasks(); // Wait for promise
        const task = tasks.find(task => task.title === title);
        if (!task) {
            console.log("Error: No task found with this title.");
            return;
        }
        task.setCompleted(true);
        await storage.saveTasks(tasks); // Wait for promise
        console.log(`Task "${title}" marked as done successfully.`);
    }

    async listTasks(options) {
        let tasks = await storage.loadTasks(); // Wait for promise

        const dateFlagCount = [options.deadline, options.today, options.tomorrow].filter(Boolean).length;
        if (dateFlagCount > 1) {
            console.log("Error: Please use only one of --deadline, --today, or --tomorrow flags at a time.");
            return;
        }

        // Handle date filtering flags
        if (options.deadline) {
            const deadline = parseDate(options.deadline).toISOString().substring(0, 10);
            tasks = tasks.filter(task => task.deadline.toISOString().substring(0, 10) === deadline);
        } else if (options.today) {
            const today = new Date().toISOString().substring(0, 10);
            tasks = tasks.filter(task => task.deadline.toISOString().substring(0, 10) === today);
        } else if (options.tomorrow) {
            // 86400000 milliseconds is 1 day
            const tomorrow = new Date(Date.now() + 86400000).toISOString().substring(0, 10);
            tasks = tasks.filter(task => task.deadline.toISOString().substring(0, 10) === tomorrow);
        }

        if (options.done) {
            tasks = tasks.filter(task => task.completed);
        }

        CliView.listTasks(tasks);
    }


}

