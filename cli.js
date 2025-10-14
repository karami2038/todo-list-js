import {Command} from "commander";
import {TaskStorage} from "./taskStorage.js";

const command = new Command();

// Parse date utility function for deadLine (dueDate)
function parseDate(dateString) {
    if (dateString == null || dateString === true) return new Date();
    const date = new Date(dateString);
    return Number.isNaN(date.getTime()) ? new Date() : date;
}

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
                    Deadline:${deadline.toISOString().substring(0, 16)}`);
        // Here you would add the logic to save the task
    });

command
    .command('remove')
    .description('Remove a task')
    .requiredOption('-t, --title <title>', 'Title of the task')
    .action((options) => {
        const {title} = options;

        console.log(`Removing task with Title:"${title}"`);
        // Here you would add the logic to remove the task
    });

command
    .command('done')
    .description('Mark a task as completed')
    .requiredOption('-t, --title <title>', 'Title of the task')
    .action((options) => {
        const {title} = options;

        console.log(`Marking task with Title:"${title}" as completed`);
        // Here you would add the logic to mark the task as done
    });

command
    .command('list')
    .description('List all tasks')
    .option('--done', 'List only completed tasks')
    .option('--deadline <deadline>', 'List tasks by deadline')
    .option('--today', 'List tasks due today')
    .option('--tomorrow', 'List tasks due tomorrow')
    .action(() => {
        console.log('Listing all tasks');
        // Here you would add the logic to list all tasks
    });

command
    .command('-h, --help, help')
    .description('Display help information')
    .action(() => {
        command.outputHelp();
    });

command.parse()