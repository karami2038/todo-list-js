
export class CliView {
    static addTask(title, desc, priority, deadline) {
        console.log(`Added task: Title:"${title}", 
                    Description:"${desc}", 
                    Priority:${priority}, 
                    Deadline:${deadline.toISOString().substring(0, 10)}`);
    }

    static removeTask(title) {
        console.log(`Removed task: Title:"${title}"`);
    }

    static markTaskAsDone(title) {
        console.log(`Marked task as done: Title:"${title}"`);
    }

    static listTasks(tasks) {
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
    }
}