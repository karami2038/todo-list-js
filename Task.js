export class Task {
    constructor(id, title, description = '', completed = false) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.completed = completed;
    }

    setCompleted(status) {
        this.completed = status;
    }

    updateDetails(title, description) {
        this.title = title;
        this.description = description;
    }
}