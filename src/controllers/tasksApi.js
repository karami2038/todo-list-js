import express from 'express';
import bodyParser from "express/lib/express.js";
import {TaskService} from "../services/taskService.js";
import {v4 as uuidv4} from "uuid";

const app = express();
const cliSerice = new TaskService();

app.disable("x-powered-by");

let todos = [];

try {
    // Load all tasks with top-level await
    todos = await cliService.loadAllTasks();

    // Store tasks in memory for REST API retrieval
} catch (error) {
    console.error("Error loading tasks:", error);
}

app.use(bodyParser.json());

/**
 * GET /api
 * @summary API Root Endpoint
 * @description A simple endpoint to verify that the TODO List API is running.
 * @returns {string} A message indicating that the API is operational.
 */
app.get("/api", (req, res) => {
    res.send("TODO List API is running."); // Just for debug purposes
});

/**
 * GET /api/todos
 * @summary Retrieve All TODOs
 * @description Fetches a list of all TODO items.
 * @returns {Array} An array of TODO items.
 */
app.get('/api/todos', (req, res) => {
    res.json(todos);
})

/**
 * GET /api/todos/:id
 * @summary Retrieve a Specific TODO
 * @description Fetches a specific TODO item by its ID.
 * @param {string} id - The ID of the TODO item to retrieve.
 * @returns {Object} The TODO item with the specified ID.
 * @throws {404} If the TODO item is not found.
 */
app.get('/api/todos/:id', (req, res) => {
    const todoId = req.params.id;
    const todo = todos.find(task =>
        task.id === todoId
    );

    if (todo) {
        res.json(todo);
    } else {
        res.status(404).send("Todo not found");
    }
})

/**
 * POST /api/todos
 * @summary Create a New TODO
 * @description Creates a new TODO item.
 * @param {Object} todo - The TODO item to create.
 * @returns {Object} The created TODO item.
 * @throws {400} If the request body is invalid.
 */
app.post('/api/todos', (req, res) => {
    const { title, description, completed, deadline } = req.body;

    if (!title) {
        return res.status(400).send("Title is required");
    }

    const newTodo = {
        id: uuidv4(),
        title,
        description: description || '',
        completed: Boolean(completed),
        deadline: deadline ? new Date(deadline) : new Date()
    };

    todos.push(newTodo);
    cliSerice.addTask(newTodo);
    res.status(201).json(newTodo);
})

/**
 * PUT /api/todos/:id
 * @summary Update a TODO
 * @description Updates an existing TODO item by its ID.
 * @param {string} id - The ID of the TODO item to update.
 * @param {Object} todo - The updated TODO item data.
 * @returns {Object} The updated TODO item.
 * @throws {400} If the request body is invalid.
 * @throws {404} If the TODO item is not found.
 */
app.put('/api/todos/:id', (req, res) => {

})

/**
 * PATCH /api/todos/:id
 * @summary Partially Update a TODO
 * @description Partially updates an existing TODO item by its ID.
 * @param {string} id - The ID of the TODO item to update.
 * @param {Object} todo - The fields to update in the TODO item.
 * @returns {Object} The updated TODO item.
 * @throws {400} If the request body is invalid.
 * @throws {404} If the TODO item is not found.
 */
app.patch('/api/todos/:id', (req, res) => {

})

/**
 * DELETE /api/todos/:id
 * @summary Delete a TODO
 * @description Deletes an existing TODO item by its ID.
 * @param {string} id - The ID of the TODO item to delete.
 * @returns {string} A message indicating successful deletion.
 * @throws {404} If the TODO item is not found.
 */
app.delete('/api/todos/:id', (req, res) => {

})

const port = 1220;

app.listen(port, () => {
    console.log(`Listening on  http://localhost:${port}/`);
});