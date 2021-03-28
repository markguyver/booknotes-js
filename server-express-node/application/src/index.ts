import bodyParser from 'body-parser';
import express from 'express';
import { logger, expressLogger } from './logger';

import { authorsRoutes, authorRoutes } from './Http/Controllers/authorsController';
import { booksRoutes, bookRoutes } from './Http/Controllers/booksController';
import { contributionTypesRoutes, contributionTypeRoutes } from './Http/Controllers/contributionTypesController';
import { dashboardRoutes } from './Http/Controllers/dashboardController';
import { notesRoutes, noteRoutes } from './Http/Controllers/notesController';
import { tagsRoutes, tagRoutes } from './Http/Controllers/tagsController';

const expressServerInstance = express();
const port = process.env.APP_PORT || 5000;

// Server Settings
expressServerInstance.disable('x-powered-by');

// Server Middleware
expressServerInstance.use(expressLogger);
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

// Contribution Types Resource Requests
expressServerInstance.use('/contribution-types', contributionTypesRoutes);
expressServerInstance.use('/contribution-type', contributionTypeRoutes);

// Dashboard Requests
expressServerInstance.use('/dashboard', dashboardRoutes);

// Notes Resource Requests
expressServerInstance.use('/notes', notesRoutes);
expressServerInstance.use('/note', noteRoutes);

// Tags Resource Requests
expressServerInstance.use('/tags', tagsRoutes);
expressServerInstance.use('/tag', tagRoutes);

// Start the Server
expressServerInstance.listen(port, () => logger.info(`Booknotes API Server started on ${process.env.HOSTNAME}:${port}`));