#!/usr/bin/env node
/*
 * Copyright 2025 karami
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import { v4 as uuidv4 } from 'uuid';

export default class Task {
    constructor(id, title, description, completed, deadline) {
        if (!title) throw new Error("Title is required for a task.");
        this.id = id;
        this.title = title;
        this.description = description;
        this.completed = Boolean(completed);
        this.deadline = deadline instanceof Date ? deadline : new Date();
    }

    setCompleted(status) {
        this.completed = Boolean(status);
    }

    toString() {
        return `ID: ${this.id}\n
                Title:${this.title}\n
                Description:${this.description}\n
                Completed:${this.completed}\n
                Due Date:${this.deadline}\n`;
    }

    static create({ id = null, title, description = '', completed = false, deadline = null } = {}) {
        const safeTitle = validation.sanitizeString(title);

        const safeDescription = validation.sanitizeString(description);
        const parseDeadline = validation.parseDateOrNow(deadline);
        return new Task({
            id: id || uuidv4(),
            title: safeTitle,
            description: safeDescription,
            completed: Boolean(completed),
            deadline: parseDeadline
        });
    }
}