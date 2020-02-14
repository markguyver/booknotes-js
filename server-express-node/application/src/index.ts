import bodyParser from 'body-parser';
import express from 'express';

import {authorsRoutes, authorRoutes} from './Controllers/authorsController';
import {booksRoutes, bookRoutes} from './Controllers/booksController';

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
expressServerInstance.use('/authors', authorsRoutes);
expressServerInstance.use('/author', authorRoutes);

// Books Resource Requests
expressServerInstance.use('/books', booksRoutes);
expressServerInstance.use('/book', bookRoutes);

// Start the Server
expressServerInstance.listen(port, () => console.log(`Booknotes API Server started on port: ${port}`));