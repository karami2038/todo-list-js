#!/usr/bin/env node
/*
 * Copyright 2025 karami
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import {Command} from "commander";
import {TaskStorage} from "./src/taskStorage.js";
import Task from "./src/task.js";
import {v4 as uuidv4} from "uuid"; // For generating unique IDs

// Initialize storage & commander CLI
const storage = new TaskStorage();
const command = new Command();

// Parse date utility function for deadLine (dueDate)
function parseDate(dateString) {
    if (!dateString || dateString === true) return new Date(); // Return current date if no date provided
    const date = new Date(dateString);
    return Number.isNaN(date.getTime()) ? new Date() : date; // Return current date if invalid
}

// Potential VULN: Command Injection if inputs are not sanitized
// However, commander.js handles basic sanitization for command-line inputs
// This is a potential attack vector that should be remedied in future versions
// by implementing input validation and sanitization mechanisms.
// 2025-10-15 by Karami

// TODO: Input sanitization for commands, flags, and options
// TODO: Make CLI logic separate from CLI entry point
// TODO: Add logging functionality
// TODO: Add unit tests

// TODO: Priority is not implemented, at all

// Add command
command
    .command('add')
    .description('Add a new task')
    .requiredOption('-t, --title <title>', 'Title of the task')
    .option('--desc <description>', 'Description of the task', '')
    .option('-p, --priority <priority>', 'Priority of the task', '5')
    .option('-d, --deadline <rawDeadline>', 'Deadline of the task in YYYY-MM-DD format', null)
    .action(async (options) => {
        const {title, desc, priority, rawDeadline} = options;
        const deadline = parseDate(rawDeadline);

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
        const newTask = new Task(uuidv4(), title, desc, false, deadline);
        await storage.addTask(newTask); // Wait for promise
        console.log("Task added successfully.");
    });

// Remove command
command
    .command('remove')
    .description('Remove a task')
    .requiredOption('-t, --title <title>', 'Title of the task')
    .action(async (options) => {
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
    });

// Done command
command
    .command('done')
    .description('Mark a task as completed')
    .requiredOption('-t, --title <title>', 'Title of the task')
    .action(async (options) => {
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
    });

// List command
command
    .command('list')
    .description('List all tasks')
    .option('--done', 'List only completed tasks')
    .option('--deadline <deadline>', 'List tasks by deadline')
    .option('--today', 'List tasks due today')
    .option('--tomorrow', 'List tasks due tomorrow')
    .action(async (options) => {
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

        if (tasks.length === 0) {
            console.log("No tasks found.");
            return;
        }

        const tableRows = tasks.map(task => ({
            ID: task.id,
            Title: task.title,
            Description: task.description,
            Completed: task.completed,
            Deadline: task.deadline.toISOString().substring(0, 10)
        }));

        console.table(tableRows);
    });

// Help command
command
    .command('-h, --help, help')
    .description('Display help information')
    .action(() => {
        command.outputHelp();
    });

// Parse the commands using commander
command.parse()