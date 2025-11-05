#!/usr/bin/env node
/*
 * Copyright 2025 karami
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

// CLI Entry Point

// NOTE: This is technically a controller but since it is the CLI entry point,
// it won't be placed in the 'controllers' folder.

// Potentil Vulnerability: Command Injection
// Mitigation: Using commander library, which handles argument parsing safely.

// Import dependencies
import {Command} from "commander";
import {TaskService} from "./src/services/taskService.js";

// Initialize taskService handler & commander library
const taskService = new TaskService();
const command = new Command();

// Add command
command
    .command('add')
    .description('Add a new task')
    .requiredOption('-t, --title <title>', 'Title of the task')
    .option('--desc <description>', 'Description of the task', '')
    .option('-p, --priority <priority>', 'Priority of the task', '5')
    .option('-d, --deadline <rawDeadline>', 'Deadline of the task in YYYY-MM-DD format', null)
    .action(taskService.addTask.bind(taskService));

// Remove command
command
    .command('remove')
    .description('Remove a task')
    .requiredOption('-t, --title <title>', 'Title of the task')
    .action(taskService.removeTaskByTitle.bind(taskService));

// Done command
command
    .command('done')
    .description('Mark a task as completed')
    .requiredOption('-t, --title <title>', 'Title of the task')
    .action(taskService.markTaskAsDoneByTitle.bind(taskService));

// List command
command
    .command('list')
    .description('List all tasks')
    .option('--done', 'List only completed tasks')
    .option('--deadline <deadline>', 'List tasks by deadline')
    .option('--today', 'List tasks due today')
    .option('--tomorrow', 'List tasks due tomorrow')
    .action(taskService.listTasksInCli.bind(taskService));

// Help command
command
    .command('-h, --help, help')
    .description('Display help information')
    .action(() => {
        command.outputHelp();
    });

// Parse the commands using commander
command.parse()