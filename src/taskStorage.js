#!/usr/bin/env node
/*
 * Copyright 2025 karami
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import {fileURLToPath} from 'node:url';
import fs from 'node:fs/promises';
import path from 'node:path';
import Task from "./task.js";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'); // PROJECT_ROOT/
const DATA_DIR = path.join(ROOT_DIR, 'data'); // PROJECT_ROOT/data/
const DATA_FILE = path.join(DATA_DIR, 'tasks.json'); // PROJECT_ROOT/data/tasks.json

export class TaskStorage {
    constructor(filePath = DATA_FILE) {
        this.path = filePath;
    }

    async _ensureFile() { // Return promise
        try {
            // Wait for promise
            await fs.access(this.path);
        } catch {
            // Wait for promise
            await fs.writeFile(this.path, '[]', 'utf8');
        }
    }

    async loadTasks() { // Return promise
        await this._ensureFile();
        const data = await fs.readFile(this.path, 'utf8');
        const rawTasks = JSON.parse(data);
        return rawTasks.map(
            task => new Task(task.id, task.title, task.description, task.completed, new Date(task.deadline))
        );
    }

    async saveTasks(tasks) { // Return promise
        const plainTasks = tasks.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            completed: task.completed,
            deadline: task.deadline.toISOString()
        }));
        // Wait for promise
        await fs.writeFile(this.path, JSON.stringify(plainTasks, null, 2), 'utf8');
    }

    async addTask(task) { // Return promise
        const tasks = await this.loadTasks(); // Wait for promise
        const newTask = task instanceof Task ? task : new Task(
            task.id, task.title, task.description, task.completed, task.deadline
        );
        tasks.push(newTask);
        // Wait for promise
        await this.saveTasks(tasks);
    }

    async removeTask(taskId) { // Return promise
        let tasks = await this.loadTasks();
        tasks = tasks.filter(task => task.id !== taskId);
        await this.saveTasks(tasks); // Wait for promise
    }
}