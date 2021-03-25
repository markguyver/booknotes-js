import {Request, Response, Router} from 'express';
import {sequelizeInstance} from '../../database';
import {fetchNotesByBookIdAndRespond, respondWith500, respondWithNotesNotFound, respondWithNotesPayload} from '../helpers';

// Initialize Database Models
const Books = sequelizeInstance.models.Books;
const Notes = sequelizeInstance.models.Notes;

// Define Endpoint Handlers
const getAllNotesByBookId = (request: Request, response: Response): Response => fetchNotesByBookIdAndRespond(parseInt(request.params.bookId), {}, response);
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