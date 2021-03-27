import { Request, Response, Router } from 'express';
import { Sequelize, FindOptions } from 'sequelize';
import { sequelizeInstance } from '../../database';
import {
    validationResponse,
    looksLikeAnId,
    isNonEmptyString,
    respondWith400,
    respondWith500,
    respondWithResourceList,
    respondWithResource404,
    respondInvalidResourceId,
    extractIntParameterValueFromRequestData,
    extractStringParameterValueFromRequestData,
    findAllAndRespond,
    findByPKAndRespond,
    createAndRespond
} from '../helpers';
import { respondInvalidAuthorId, extractAuthorIdFromRequestData } from './authorsController';

// Types
interface BookObject {
    id?: number;
    title: string;
};

// Initialize Database Models
const Authors = sequelizeInstance.models.Authors;
const BookAuthors = sequelizeInstance.models.BookAuthors;
const Books = sequelizeInstance.models.Books;
const ContributionTypes = sequelizeInstance.models.ContributionTypes;
const Notes = sequelizeInstance.models.Notes;
const Tags = sequelizeInstance.models.Tags;

// Prepare Resource-Specific Variables
const bookListWithNoteCountQueryOptions: FindOptions = {
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
};
const detailedBookQueryOptions: FindOptions = {
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
};

// Prepare Resource-Specific Data Handler Methods
export const extractBookIdFromRequestData = (request: Request): number => extractIntParameterValueFromRequestData('book_id', request) || extractIntParameterValueFromRequestData('bookId', request);
const extractNewBookFromRequestData = (request: Request): BookObject => ({ title: extractStringParameterValueFromRequestData('title', request) });
const validateExtractedNewBookFromRequestData = (extractedBook: BookObject): validationResponse => {
    const validationResult = { type: 'success', message: '' };
    if (!isNonEmptyString(extractedBook.title)) { // Verify Title (required) Parameter Is Set
        validationResult.type = 'failure';
        validationResult.message = 'Missing (required) book title';
    } // End of Verify Title (required) Parameter Is Set
    return validationResult;
};

// Prepare Resource-Specific Response HandlerMethods
export const respondWithBooksPayload = respondWithResourceList('Books');
export const respondWithBookNotFound = respondWithResource404('Book');
export const respondWithBooksNotFound = respondWithResource404('Books');
export const respondInvalidBookId = respondInvalidResourceId('Book');

// Prepare Resource-Specific ORM Methods
export const fetchAllBooksAndRespond = findAllAndRespond(Books, respondWithBooksPayload);
const fetchBookByIdAndRespond = findByPKAndRespond(Books, respondWithBooksPayload, respondWithBookNotFound, respondInvalidBookId);
// const fetchBooksByAuthorIdAndRespond = fetchResourceByForeignIdAsManyAndRespond();
const createBookRecordFromRequestData = createAndRespond(
    Books,
    extractNewBookFromRequestData,
    validateExtractedNewBookFromRequestData,
    respondWith400,
    respondWith500,
    respondWithBooksPayload
);

// Define Endpoint Handlers
const getAllBooks = fetchAllBooksAndRespond(bookListWithNoteCountQueryOptions);
const getAllBooksByAuthorId = (request: Request, response: Response): Response => {
    const authorId = request.params.authorId;
    response.send({coming:'soon',authorId:authorId});
    return response;
};
const getBookById = fetchBookByIdAndRespond(extractBookIdFromRequestData, looksLikeAnId, detailedBookQueryOptions);

// Register Resource Routes
export const booksRoutes = Router();
booksRoutes.get('/', getAllBooks);
booksRoutes.post('/', createBookRecordFromRequestData);
booksRoutes.get('/author/:authorId', getAllBooksByAuthorId);

export const bookRoutes = Router();
bookRoutes.get('/:bookId', getBookById);