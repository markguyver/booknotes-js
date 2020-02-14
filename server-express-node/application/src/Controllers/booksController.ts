import {Request, Response, Router} from 'express';
import {sequelize} from './databaseController';

const getAllBooks = (request: Request, response: Response): Response => {
    // sequelize.models.books.findAll();
    response.send({coming:'soon'});
    return response;
};

const getAllBooksByAuthorId = (request: Request, response: Response): Response => {
    const authorId = request.params.authorId;
    response.send({coming:'soon',authorId:authorId});
    return response;
};

export const booksRoutes = Router();
booksRoutes.get('/', getAllBooks);
booksRoutes.get('/author/:authorId', getAllBooksByAuthorId);

export const bookRoutes = Router();