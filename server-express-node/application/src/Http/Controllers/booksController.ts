import {Request, Response, Router} from 'express';
import {Sequelize} from 'sequelize';
import {sequelizeInstance} from '../../database';
import {fetchAllBooksAndRespond, respondWith500, respondWithBookNotFound, respondWithBooksPayload, respondInvalidBookId} from '../helpers';

// Initialize Database Models
const Authors = sequelizeInstance.models.Authors;
const BookAuthors = sequelizeInstance.models.BookAuthors;
const Books = sequelizeInstance.models.Books;
const ContributionTypes = sequelizeInstance.models.ContributionTypes;
const Notes = sequelizeInstance.models.Notes;
const Tags = sequelizeInstance.models.Tags;

// TODO: Use fetchAllBooksAndRespond

// Define Endpoint Handlers
const getAllBooks = (request: Request, response: Response): Response => fetchAllBooksAndRespond({
    attributes: [
        'id',
        'title',
        'deleted_at',
        [Sequelize.fn('COUNT', Sequelize.col('Notes.book_id')), 'noteCount'],
    ],
    group: [
        'id',
        'title',
        'deleted_at',
        'Tags.id',
        'Tags.tag',
        'Tags.deleted_at',
    ],
    order: [['title', 'ASC']],
    paranoid: false,
    include: [{
        model: Notes,
        required: false,
        paranoid: false,
        attributes: [],
    }, {
        model: Tags,
        required: false,
        paranoid: false,
        attributes: ['id', 'tag', 'deleted_at'],
    }],
}, response);
const getAllBooksByAuthorId = (request: Request, response: Response): Response => {
    const authorId = request.params.authorId;
    response.send({coming:'soon',authorId:authorId});
    return response;
};
const getBookById = (request: Request, response: Response): Response => {
    const respondWithBooks = respondWithBooksPayload(response);
    const bookId = parseInt(request.params.bookId);
    if (!isNaN(bookId) && bookId > 0) { // Validate ID Parameter
        Books.findByPk(bookId, {
            paranoid: false,
            include: [{
                model: Notes,
                required: false,
            },{
                model: BookAuthors,
                required: false,
                include: [{
                    model: Authors,
                    required: false,
                    paranoid: false,
                },{
                    model: ContributionTypes,
                    required: false,
                }],
            },{
                model: Tags,
                required: false,
            }],
        }).then(result => {
            if (result) { // Check for Results
                respondWithBooks([result]);
                // response.type('json');
                // response.send({ Books: [result] });
            } else { // Middle of Check for Results
                response.status(404).send();
            } // End of Check for Results
        }).catch(error => {
            response.status(500).send();
        });
    } else { // Middle of Validate ID Parameter
        response.status(400).send('Invalid Book ID');
    } // End of Validate ID Parameter
    return response;
};
const createNewBook = (request: Request, response: Response): Response => {

    // TODO Parse Request Body into Book Object

    Books.create(request.body).then(() => {
        Books.findOne({where: request.body}).then(result => {
            response.type('json');
            response.status(201);
            response.send({ Books: [result] });
        });
    });
    return response;
};

// Register Resource Routes
export const booksRoutes = Router();
booksRoutes.get('/', getAllBooks);
booksRoutes.post('/', createNewBook);
booksRoutes.get('/author/:authorId', getAllBooksByAuthorId);

export const bookRoutes = Router();
bookRoutes.get('/:bookId', getBookById);