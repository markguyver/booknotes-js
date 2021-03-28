import { Request, Response, Router } from 'express';
import { Sequelize, FindOptions } from 'sequelize';
import { sequelizeInstance } from '../../database';
import {
    validationResponseBaseFail,
    validationResponseBaseSuccess,
    validationResponse,
    looksLikeAnId,
    isNonEmptyString,
    respondWith400,
    respondWith500,
    respondWithResourceList,
    respondWithResourceNotFound,
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
    id?:        number | undefined;
    title?:     string;
};

// Initialize Database Models
const Authors = sequelizeInstance.models.Authors;
const BookAuthors = sequelizeInstance.models.BookAuthors;
const Books = sequelizeInstance.models.Books;
const ContributionTypes = sequelizeInstance.models.ContributionTypes;
const Notes = sequelizeInstance.models.Notes;
const Tags = sequelizeInstance.models.Tags;

// Prepare Resource-Specific Variables
const listBooksWithNoteCountQueryOptions: FindOptions = {
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
const displayBookQueryOptions: FindOptions = {
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
export const validateExtractedBook = (extractedBook: BookObject): validationResponse => {
    if (!isNonEmptyString(extractedBook.title)) { // Verify Title (required) Parameter Is Set
        return validationResponseBaseFail('Missing (required) book title');
    } // End of Verify Title (required) Parameter Is Set
    return validationResponseBaseSuccess();
};

// Prepare Resource-Specific Response Handler Methods
export const respondWithBooksPayload = respondWithResourceList('Books');
export const respondWithBookNotFound = respondWithResourceNotFound('Book');
export const respondWithBooksNotFound = respondWithResourceNotFound('Books');
export const respondInvalidBookId = respondInvalidResourceId('Book');

// Prepare Resource-Specific ORM Methods
const fetchAllBooks = findAllAndRespond(Books, respondWithBooksPayload);
export const fetchBookById = findByPKAndRespond(Books, respondWithBooksPayload, respondWithBookNotFound, respondInvalidBookId, looksLikeAnId);
const fetchBookByIdFromRequestData = fetchBookById(extractBookIdFromRequestData);
// const fetchBooksByAuthorIdAndRespond = fetchResourceByForeignIdAsManyAndRespond();
export const createBookRecord = createAndRespond(
    Books,
    respondWith400,
    respondWith500,
    respondWithBooksPayload,
    validateExtractedBook
);
const createBookRecordFromRequestData = createBookRecord(extractNewBookFromRequestData);

// Define Endpoint Handlers
const listAllBooks = fetchAllBooks(listBooksWithNoteCountQueryOptions);
const listAllBooksByAuthorId = (request: Request, response: Response): Response => {
    const authorId = request.params.authorId;
    response.send({coming:'soon',authorId:authorId});
    return response;
};
const displayBookById = fetchBookByIdFromRequestData(displayBookQueryOptions);

// Register Resource Routes
export const booksRoutes = Router();
booksRoutes.get('/', listAllBooks);
booksRoutes.post('/', createBookRecordFromRequestData);
booksRoutes.get('/author/:authorId', listAllBooksByAuthorId);

export const bookRoutes = Router();
bookRoutes.get('/:bookId', displayBookById);