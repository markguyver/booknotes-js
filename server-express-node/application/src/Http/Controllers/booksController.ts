import {Request, Response, Router} from 'express';
import {Sequelize} from 'sequelize';
import {sequelizeInstance} from '../../database';
import {
    looksLikeAnId,
    respondWith400,
    respondWith500,
    respondWithResourceList,
    respondWithResource404,
    respondInvalidResourceId,
    fetchAllAndRespond,
    fetchByIdAndRespond,
    insertNewResourceAndRespond
} from '../helpers';

// Initialize Database Models
const Authors = sequelizeInstance.models.Authors;
const BookAuthors = sequelizeInstance.models.BookAuthors;
const Books = sequelizeInstance.models.Books;
const ContributionTypes = sequelizeInstance.models.ContributionTypes;
const Notes = sequelizeInstance.models.Notes;
const Tags = sequelizeInstance.models.Tags;

// Prepare Resource-Specific (i.e. Exported) Methods
export const respondWithBooksPayload = respondWithResourceList('Books');
export const respondWithBookNotFound = respondWithResource404('Book');
export const respondWithBooksNotFound = respondWithResource404('Books');
export const respondInvalidBookId = respondInvalidResourceId('Book');
export const fetchAllBooksAndRespond = fetchAllAndRespond(Books, respondWithBooksPayload);
const fetchBookByIdAndRespond = fetchByIdAndRespond(Books, respondWithBooksPayload, respondWithBookNotFound, respondInvalidBookId);
// const fetchBooksByAuthorIdAndRespond = fetchResourceByForeignIdAsManyAndRespond();

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
const getBookById = (request: Request, response: Response): Response => fetchBookByIdAndRespond(parseInt(request.params.bookId), {
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
}, response);
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