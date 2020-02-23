import {Request, Response, Router} from 'express';
import {sequelize} from './databaseController';

export const getAllNotesByBookId = (request: Request, response: Response): Response => {
    const bookId = request.params.bookId;
    return response;
};

export const notesRoutes = Router();