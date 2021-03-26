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

// Types
interface BookObject {
    title: string;
};

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
const extractNewBookFromRequestData = (request: Request): BookObject => ({ title: request.body.title || '' });
const validateExtractedNewBookFromRequestData = (extractedBook: BookObject) => {
    const validationResult = { type: 'success', message: '' };
    if ((null == extractedBook.title) || ('string' != typeof extractedBook.title) || (extractedBook.title.length < 1)) { // Verify Title (required) Parameter Is Set
        validationResult.type = 'failure';
        validationResult.message = 'Missing (required) book title';
    } // End of Verify Title (required) Parameter Is Set
    return validationResult;
};
const createBookRecordFromRequestData = insertNewResourceAndRespond(
    Books,
    extractNewBookFromRequestData,
    validateExtractedNewBookFromRequestData,
    respondWith400,
    respondWith500,
    respondWithBooksPayload
);

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

// Register Resource Routes
export const booksRoutes = Router();
booksRoutes.get('/', getAllBooks);
booksRoutes.post('/', createBookRecordFromRequestData);
booksRoutes.get('/author/:authorId', getAllBooksByAuthorId);

export const bookRoutes = Router();
bookRoutes.get('/:bookId', getBookById);