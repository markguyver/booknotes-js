import { Request, Response, Router } from 'express';
import { FindOptions } from 'sequelize';
import { sequelizeInstance } from '../../database';
import {
    looksLikeAnId,
    respondWithResourceList,
    respondWithResource404,
    FindAllByFKAndRespond,
    createAndRespond
} from '../helpers';
import { respondInvalidBookId, extractBookIdFromRequestData } from './booksController';

// Initialize Database Models
const Books = sequelizeInstance.models.Books;
const Notes = sequelizeInstance.models.Notes;

// Prepare Resource-Specific Variables
const notesListQueryOptions: FindOptions = {};

// Prepare Resource-Specific Response HandlerMethods
export const respondWithNotesPayload = respondWithResourceList('Notes');
export const respondWithNotesNotFound = respondWithResource404('Notes');

// Define Endpoint Handlers
const getAllNotesByBookId = FindAllByFKAndRespond(
    Notes,
    respondWithNotesPayload,
    respondInvalidBookId,
    'book_id',
    extractBookIdFromRequestData,
    looksLikeAnId,
    notesListQueryOptions
);
const addNoteByBookId = (request: Request, response: Response): Response => {
    const bookId = parseInt(request.params.bookId);
    if (!isNaN(bookId) && bookId > 0) { // Validate ID Parameter

        // TODO Parse Request Body into Notes Object

        Notes.create(request.body).then(() => {
            Notes.findOne({where: request.body}).then(result => {
                response.type('json');
                response.status(201);
                response.send({ Notes: [result] });
            });
        });
    } else { // Middle of Validate ID Parameter
        response.status(400).send('Invalid Book ID');
    } // End of Validate ID Parameter
    return response;
};

// Register Resource Routes
export const notesRoutes = Router();
notesRoutes.get('/book/:bookId', getAllNotesByBookId);
notesRoutes.post('/book/:bookId', addNoteByBookId);