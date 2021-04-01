import { Request, Router } from 'express';
import { Sequelize, FindOptions } from 'sequelize';
import { sequelizeInstance } from '../../database';
import { logger } from '../../logger';
import {
    validationResponse,
    validationResponseBaseFail,
    validationResponseBaseSuccess,
    looksLikeAnId,
    isNonEmptyString,
    respondWith400,
    respondWith500,
    respondWithResourceList,
    respondWithResourceNotFound,
    respondInvalidResourceId,
    addWhereForeignIdClauseToResourceListQueryOptions,
    extractIntParameterValueFromRequestData,
    extractStringParameterValueFromRequestData,
    provideFindOptionsUnmodified,
    provideFindOptionsModified,
    findAllAndRespond,
    findByPKAndRespond,
    createAndRespond
} from '../helpers';
import { respondInvalidAuthorId, extractAuthorIdFromRequestData } from './authorsController';
import { respondInvalidTagId, extractTagIdFromRequestData } from './tagsController';

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
const listBooksByAuthorIdQueryOptions: FindOptions = {
    order: [['title', 'ASC']],
    paranoid: false,
    include: [{
        model: BookAuthors,
        required: true,
        include: [{
            model: ContributionTypes,
            required: false,
        }]
    }],
};
const listBooksByTagIdQueryOptions: FindOptions = {
    order: [['title', 'ASC']],
    paranoid: false,
    include: [{
        model: Tags,
        required: true,
    }],
};

// Prepare Resource-Specific Response Handler Methods
export const respondWithBooksPayload = respondWithResourceList('Books');
export const respondWithBookNotFound = respondWithResourceNotFound('Book');
export const respondWithBooksNotFound = respondWithResourceNotFound('Books');
export const respondInvalidBookId = respondInvalidResourceId('Book');

// Prepare Resource-Specific Data Handler Methods
export const extractBookIdFromRequestData = (request: Request): number => extractIntParameterValueFromRequestData('book_id', request) || extractIntParameterValueFromRequestData('bookId', request);
const extractNewBookFromRequestData = (request: Request): BookObject => ({ title: extractStringParameterValueFromRequestData('title', request) });
export const validateExtractedBook = (extractedBook: BookObject): validationResponse => {
    if (!isNonEmptyString(extractedBook.title)) { // Verify Title (required) Parameter Is Set
        return validationResponseBaseFail('Missing (required) book title');
    } // End of Verify Title (required) Parameter Is Set
    return validationResponseBaseSuccess();
};

logger.info({
    extractAuthorIdFromRequestData: typeof extractAuthorIdFromRequestData,
    extractBookIdFromRequestData: typeof extractBookIdFromRequestData,
    extractTagIdFromRequestData: typeof extractTagIdFromRequestData,
    respondInvalidAuthorId: typeof respondInvalidAuthorId,
}, 'Books'); // TODO: Delete This

const addWhereAuthorIdClauseToBookListQueryOptions = addWhereForeignIdClauseToResourceListQueryOptions(
    BookAuthors,
    extractAuthorIdFromRequestData,
    respondInvalidAuthorId,
    'author_id' // BookAuthors.author_id
);
const addWhereTagIdClauseToBookListQueryOptions = addWhereForeignIdClauseToResourceListQueryOptions(
    Tags,
    extractTagIdFromRequestData,
    respondInvalidTagId,
    'id' // Tags.id
);

// Prepare Resource-Specific ORM Methods
export const fetchAllBooks = findAllAndRespond(Books, respondWithBooksPayload);
export const fetchBookById = findByPKAndRespond(Books, respondWithBooksPayload, respondWithBookNotFound, respondInvalidBookId, looksLikeAnId);
const fetchBookByIdFromRequestData = fetchBookById(extractBookIdFromRequestData);
export const createBookRecord = createAndRespond(
    Books,
    respondWith400,
    respondWith500,
    respondWithBooksPayload,
    validateExtractedBook
);
const createBookRecordFromRequestData = createBookRecord(extractNewBookFromRequestData);

// Define Endpoint Handlers
const listAllBooks = fetchAllBooks(provideFindOptionsUnmodified(listBooksWithNoteCountQueryOptions));
const displayBookById = fetchBookByIdFromRequestData(displayBookQueryOptions);
const listBooksByAuthorIdFromRequestData = fetchAllBooks(provideFindOptionsModified(listBooksByAuthorIdQueryOptions, addWhereAuthorIdClauseToBookListQueryOptions));
const listBooksByTagIdFromRequestData = fetchAllBooks(provideFindOptionsModified(listBooksByTagIdQueryOptions, addWhereTagIdClauseToBookListQueryOptions));

// Register Resource Routes
export const booksRoutes = Router();
booksRoutes.get('/', listAllBooks);
booksRoutes.post('/', createBookRecordFromRequestData);
booksRoutes.get('/author/:authorId', listBooksByAuthorIdFromRequestData);
booksRoutes.get('/tag/:tagId', listBooksByTagIdFromRequestData);

export const bookRoutes = Router();
bookRoutes.get('/:bookId', displayBookById);