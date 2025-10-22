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
import {CliService} from "./src/services/cliService.js";

// Initialize cliService handler & commander library
const cliService = new CliService();
const command = new Command();

// Add command
command
    .command('add')
    .description('Add a new task')
    .requiredOption('-t, --title <title>', 'Title of the task')
    .option('--desc <description>', 'Description of the task', '')
    .option('-p, --priority <priority>', 'Priority of the task', '5')
    .option('-d, --deadline <rawDeadline>', 'Deadline of the task in YYYY-MM-DD format', null)
    .action(cliService.addTask.bind(cliService));

// Remove command
command
    .command('remove')
    .description('Remove a task')
    .requiredOption('-t, --title <title>', 'Title of the task')
    .action(cliService.removeTask.bind(cliService));

// Done command
command
    .command('done')
    .description('Mark a task as completed')
    .requiredOption('-t, --title <title>', 'Title of the task')
    .action(cliService.markTaskAsDone.bind(cliService));

// List command
command
    .command('list')
    .description('List all tasks')
    .option('--done', 'List only completed tasks')
    .option('--deadline <deadline>', 'List tasks by deadline')
    .option('--today', 'List tasks due today')
    .option('--tomorrow', 'List tasks due tomorrow')
    .action(cliService.listTasks.bind(cliService));

// Help command
command
    .command('-h, --help, help')
    .description('Display help information')
    .action(() => {
        command.outputHelp();
    });

// Parse the commands using commander
command.parse()