#!/usr/bin/env node
/*
 * Copyright 2025 karami
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

export default class Task {
    constructor(id, title, description, completed, deadline) {
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