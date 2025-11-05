import swaggerJSDoc from 'swagger-jsdoc';
import fs from 'node:fs';

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
            { url: 'http://localhost:1220' }
        ],
    },
    // Point this to your annotated route files
    apis: ['./src/controllers/tasksApi.js'], // adjust a path to match where your routes live
};

// Generate the OpenAPI spec
const openapiSpecification = swaggerJSDoc(options);

// Write the file to disk
fs.writeFileSync('./openapi.json', JSON.stringify(openapiSpecification, null, 2));

console.log('✅ OpenAPI specification generated: openapi.json');
