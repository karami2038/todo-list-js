export class Task {
    constructor(id, title, description = '', completed = false, deadline) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.completed = completed;
        this.deadline = deadline;
    }

    setCompleted(status) {
        this.completed = status;
    }

    updateDetails(title, description) {
        this.title = title;
        this.description = description;
    }

    toString() {
        return `ID: ${this.id}\n
                Title:${this.title}\n
                Description:${this.description}\n
                Completed:${this.completed}\n
                Due Date:${this.deadline}\n`;
    }
}