import bodyParser from 'body-parser';
import express from 'express';
import {getAllAuthors, createNewAuthor} from './Controllers/authorsController';

const expressServerInstance = express();
const port = process.env.APP_PORT || 5000;

// Server Settings
expressServerInstance.disable('x-powered-by');

// Server Middleware
expressServerInstance.use(bodyParser.json());
expressServerInstance.use(bodyParser.urlencoded({ extended: true }));

// Root-Level Requests
expressServerInstance.get('/', (request: express.Request, response: express.Response): express.Response => response.type('json').send({ status: 'alive' }));

// Author Resource Requests
expressServerInstance.get('/authors', getAllAuthors);
expressServerInstance.post('/authors', createNewAuthor);

// Start the Server
expressServerInstance.listen(port, () => console.log(`Booknotes API Server started on port: ${port}`));