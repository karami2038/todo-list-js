import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'tasks.json');
// ! Potential path traversal vulnerability if __dirname is user-controlled

export class TaskStorage {
    constructor(filePath = DATA_FILE) {
        this.path = filePath;
    }

    async _ensureFile() {
        try {
            await fs.access(this.path);
        } catch {
            await fs.writeFile(this.path, '[]', 'utf8');
        }
    }

    async loadTasks() {
        await this._ensureFile();
        const data = await fs.readFile(this.path, 'utf8');
        return JSON.parse(data);
    }

    async saveTasks(tasks) {
        await fs.writeFile(this.path, JSON.stringify(tasks, null, 2), 'utf8');
    }

    async addTask(task) {
        const tasks = await this.loadTasks();
        tasks.push(task);
        await this.saveTasks(tasks);
    }

    async removeTask(taskId) {
        let tasks = await this.loadTasks();
        tasks = tasks.filter(task => task.id !== taskId);
        await this.saveTasks(tasks);
    }
}