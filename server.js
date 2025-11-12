import swaggerJSDoc from 'swagger-jsdoc';

import fs from 'node:fs';
import app from "./src/controllers/tasksApi.js";

const port = 80;

// Configure swagger-jsdoc
const options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'TODO List API',
            version: '0.0.0',
            description: 'OpenAPI specification for the TODO list backend',
        },
        servers: [
            { url: `http://localhost:${port}` }
        ],
    },
    // Point this to your annotated route files
    apis: ['./src/controllers/tasksApi.js'], // adjust a path to match where your routes live
};

// Generate the OpenAPI spec
const server = swaggerJSDoc(options);

// Write the file to disk
fs.writeFileSync('./openapi.json', JSON.stringify(server, null, 2));

console.log('OpenAPI specification generated: openapi.json');


app.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`);
})
