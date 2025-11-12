import express from 'express';
import bodyParser from "express/lib/express.js";
import {TaskService} from "../services/taskService.js";
import {v4 as uuidv4} from "uuid";

const app = express();
const taskService = new TaskService();

app.disable("x-powered-by"); // Security best practice to hide server info

app.use(bodyParser.json());

/**
 * @openapi
 * /api:
 *   get:
 *     summary: API Status Check
 *     description: Returns a simple message indicating that the TODO List API is running.
 *     responses:
 *       200:
 *         description: A message indicating the API is running.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
app.get("/api", (req, res) => {
    res.send("TODO List API is running."); // Just for debug purposes
});

/**
 * @openapi
 * /api/todos:
 *   get:
 *     summary: Retrieve All TODOs
 *     description: Fetches all TODO items.
 *     responses:
 *       200:
 *         description: A list of TODO items.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The TODO item ID.
 *                   title:
 *                     type: string
 *                     description: The title of the TODO item.
 *                   description:
 *                     type: string
 *                     description: The description of the TODO item.
 *                   completed:
 *                     type: boolean
 *                     description: The completion status of the TODO item.
 *                   deadline:
 *                     type: string
 *                     format: date-time
 *                     description: The deadline of the TODO item.
 */
app.get('/api/todos', async (req, res) => {
    res.json(await taskService.loadAllTasks());
})

/**
 * @openapi
 * /api/todos/{id}:
 *   get:
 *     summary: Retrieve a Specific TODO
 *     description: Fetches a specific TODO item by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the TODO item to retrieve.
 *     responses:
 *       200:
 *         description: The requested TODO item.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The TODO item ID.
 *                 title:
 *                   type: string
 *                   description: The title of the TODO item.
 *                 description:
 *                   type: string
 *                   description: The description of the TODO item.
 *                 completed:
 *                   type: boolean
 *                   description: The completion status of the TODO item.
 *                 deadline:
 *                   type: string
 *                   format: date-time
 *                   description: The deadline of the TODO item.
 *       404:
 *         description: TODO item not found.
 */
app.get('/api/todos/:id', async (req, res) => {
    const todoId = req.params.id;
    const todo = await taskService.findTaskById(todoId);

    if (todo) {
        res.json(todo);
    } else {
        res.status(404).send("Todo not found");
    }
})

/**
 * @openapi
 * /api/todos:
 *   post:
 *     summary: Create a New TODO
 *     description: Creates a new TODO item.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the TODO item.
 *               description:
 *                 type: string
 *                 description: The description of the TODO item.
 *               completed:
 *                 type: boolean
 *                 description: The completion status of the TODO item.
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 description: The deadline of the TODO item.
 *     responses:
 *       201:
 *         description: The created TODO item.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The TODO item ID.
 *                 title:
 *                   type: string
 *                   description: The title of the TODO item.
 *                 description:
 *                   type: string
 *                   description: The description of the TODO item.
 *                 completed:
 *                   type: boolean
 *                   description: The completion status of the TODO item.
 *                 deadline:
 *                   type: string
 *                   format: date-time
 *                   description: The deadline of the TODO item.
 *       400:
 *         description: Invalid request body.
 *       500:
 *         description: Error creating TODO item.
 */
app.post('/api/todos', async (req, res) => {
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

    try {
        await taskService.addTask(newTodo);
        return res.status(201).json(newTodo);
    } catch (error) {
        console.log("[tasksApi.js Line 123 - ERROR] Error creating todo: ", error);
        return res.status(500).send("Error creating todo");
    }
})

/**
 * @openapi
 * /api/todos/{id}:
 *   put:
 *     summary: Update a TODO
 *     description: Updates an existing TODO item by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the TODO item to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the TODO item.
 *               description:
 *                 type: string
 *                 description: The description of the TODO item.
 *               completed:
 *                 type: boolean
 *                 description: The completion status of the TODO item.
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 description: The deadline of the TODO item.
 *     responses:
 *       200:
 *         description: The updated TODO item.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The TODO item ID.
 *                 title:
 *                   type: string
 *                   description: The title of the TODO item.
 *                 description:
 *                   type: string
 *                   description: The description of the TODO item.
 *                 completed:
 *                   type: boolean
 *                   description: The completion status of the TODO item.
 *                 deadline:
 *                   type: string
 *                   format: date-time
 *                   description: The deadline of the TODO item.
 *       400:
 *         description: Invalid request body.
 *       404:
 *         description: TODO item not found.
 *       500:
 *         description: Error updating TODO item.
 */
await app.put('/api/todos/:id', async (req, res) => {
    const todoId = req.params.id;
    const { title, description, isCompleted, deadline } = req.body;

    const todo = await taskService.findTaskById(todoId);

    if (!todo) {
        return res.status(404).send("Todo not found");
    }

    if (!title) {
        return res.status(400).send("Title is required");
    }

    todo.title = title;
    todo.description = description || '';
    todo.completed = Boolean(isCompleted);
    todo.deadline = deadline ? new Date(deadline) : new Date();

    try {
        await taskService.updateTaskById(todo);
        res.json(todo);
    } catch (error) {
        console.log("[tasksApi.js Line 157 - ERROR] Error updating todo: ", error);
        return res.status(500).send("Error updating todo");
    }
})

/**
 * @openapi
 * /api/todos/{id}:
 *   patch:
 *     summary: Partially Update a TODO
 *     description: Partially updates an existing TODO item by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the TODO item to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the TODO item.
 *               description:
 *                 type: string
 *                 description: The description of the TODO item.
 *               completed:
 *                 type: boolean
 *                 description: The completion status of the TODO item.
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 description: The deadline of the TODO item.
 *     responses:
 *       200:
 *         description: The updated TODO item.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The TODO item ID.
 *                 title:
 *                   type: string
 *                   description: The title of the TODO item.
 *                 description:
 *                   type: string
 *                   description: The description of the TODO item.
 *                 completed:
 *                   type: boolean
 *                   description: The completion status of the TODO item.
 *                 deadline:
 *                   type: string
 *                   format: date-time
 *                   description: The deadline of the TODO item.
 *       404:
 *         description: TODO item not found.
 *       500:
 *         description: Error updating TODO item.
 */
app.patch('/api/todos/:id', async (req, res) => {
    const todoId = req.params.id;
    const { title, description, isCompleted, deadline } = req.body;

    const todo = await taskService.findTaskById(todoId);

    if (!todo) {
        return res.status(404).send("Todo not found");
    }

    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (isCompleted !== undefined) todo.completed = Boolean(isCompleted);
    if (deadline !== undefined) todo.deadline = new Date(deadline);

    try {
        await taskService.updateTaskById(todo);
        res.json(todo);
    } catch (error) {
        console.log("[tasksApi.js Line 200 - ERROR] Error patching todo: ", error);
        return res.status(500).send("Error patching todo");
    }
})

/**
 * @openapi
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a TODO
 *     description: Deletes an existing TODO item by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the TODO item to delete.
 *     responses:
 *       200:
 *         description: A message indicating successful deletion.
 *       404:
 *         description: TODO item not found.
 *       500:
 *         description: Error deleting TODO item.
 */
app.delete('/api/todos/:id', async (req, res) => {
    const todoId = req.params.id;
    const todo = await taskService.findTaskById(todoId);

    if (!todo) {
        return res.status(404).send("Todo not found");
    }

    try {
        await taskService.removeTaskById(todoId);

        res.send("Todo deleted successfully");
    } catch (error) {
        console.log("[tasksApi.js Line 204 - ERROR] Error deleting todo: ", error);
        return res.status(500).send("Error deleting todo");
    }
})

export default app;