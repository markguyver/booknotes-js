import { Request, Router } from 'express';
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
import { respondInvalidBookId, extractBookIdFromRequestData } from './booksController';

// Types
interface AuthorObject {
    id?: number;
    first_name?: string;
    middle_name?: string;
    last_name: string;
    parent_author_id?: number;
};

// Initialize Database Models
const Authors = sequelizeInstance.models.Authors;
const BookAuthors = sequelizeInstance.models.BookAuthors;
const Books = sequelizeInstance.models.Books;
const ContributionTypes = sequelizeInstance.models.ContributionTypes;
const Tags = sequelizeInstance.models.Tags;

// Prepare Resource-Specific Variables
const authorListWithBookCountQueryOptions: FindOptions = {
    attributes: [
        'id',
        'first_name',
        'middle_name',
        'last_name',
        'parent_author_id',
        'deleted_at',
        [Sequelize.fn('COUNT', Sequelize.col('BookAuthors.author_id')), 'bookCount'],
    ],
    group: [
        'id',
        'first_name',
        'middle_name',
        'last_name',
        'parent_author_id',
        'deleted_at',
        'Tags.id',
        'Tags.tag',
    ],
    order: [['last_name', 'ASC'], ['first_name', 'ASC'], ['middle_name', 'ASC']],
    paranoid: false,
    include: [{
        model: BookAuthors,
        required: false,
        attributes: [],
    },{
        model: Tags,
        required: false,
    }],
};
const detailedAuthorQueryOptions: FindOptions = {
    paranoid: false,
    include: [{
        model: Authors,
        required: false,
        as: 'ActualAuthor',
        paranoid: false,
    },{
        model: Authors,
        required: false,
        as: 'Pseudonyms',
        paranoid: false,
    },{
        model: BookAuthors,
        required: false,
        include: [{
            model: Books,
            required: false,
            paranoid: false,
        },{
            model: ContributionTypes,
            required: false,
        }],
    },{
        model: Tags,
        required: false,
        paranoid: false,
    }],
};

// Prepare Resource-Specific Data Handler Methods
export const extractAuthorIdFromRequestData = (request: Request): number => extractIntParameterValueFromRequestData('author_id', request) || extractIntParameterValueFromRequestData('authorId', request);
const extractNewAuthorFromRequestData = (request: Request): AuthorObject => ({
    first_name:         extractStringParameterValueFromRequestData('first_name', request) || undefined,
    middle_name:        extractStringParameterValueFromRequestData('middle_name', request) || undefined,
    last_name:          extractStringParameterValueFromRequestData('last_name', request),
    parent_author_id:   extractIntParameterValueFromRequestData('parent_author_id', request) || undefined,
});
const validateExtractedNewAuthorFromRequestData = (extractedAuthor: AuthorObject): validationResponse => {
    const validationResult = { type: 'success', message: '' };
    if (!isNonEmptyString(extractedAuthor.last_name)) { // Verify Last Name (required) Parameter Is Set
        validationResult.type = 'failure';
        validationResult.message = 'Missing (required) author last name';
    } // End of Verify Last Name (required) Parameter Is Set

    // TODO: Short-Circuit This Function to Avoid Further Validation When Error Already Found

    if (extractedAuthor.parent_author_id && !looksLikeAnId(extractedAuthor.parent_author_id)) { // Validate Parent Author ID (i.e. pseudonym)
        validationResult.type = 'failure';
        validationResult.message = 'Invalid parent author id';
    } // End of Validate Parent Author ID (i.e. pseudonym)
    return validationResult;
};

// Prepare Resource-Specific Response HandlerMethods
export const respondWithAuthorsPayload = respondWithResourceList('Authors');
export const respondWithAuthorsNotFound = respondWithResource404('Authors');
export const respondWithAuthorNotFound = respondWithResource404('Author');
export const respondInvalidAuthorId = respondInvalidResourceId('Author');

// Prepare Resource-Specific ORM Methods
export const fetchAllAuthorsAndRespond = findAllAndRespond(Authors, respondWithAuthorsPayload);
const fetchAuthorByIdAndRespond = findByPKAndRespond(Authors, respondWithAuthorsPayload, respondWithAuthorNotFound, respondInvalidAuthorId);
// const fetchAuthorsByBookIdAndRespond = fetchResourceByForeignIdAsManyAndRespond(Authors, respondWithAuthorsPayload, respondWithAuthorsNotFound, respondInvalidBookId, foreignKeyNames.book_id);
const createAuthorRecordFromRequestData = createAndRespond(
    Authors,
    extractNewAuthorFromRequestData,
    validateExtractedNewAuthorFromRequestData,
    respondWith400,
    respondWith500,
    respondWithAuthorsPayload
);

// Define Endpoint Handlers
const getAllAuthors = fetchAllAuthorsAndRespond(authorListWithBookCountQueryOptions);
const getAuthorById = fetchAuthorByIdAndRespond(extractAuthorIdFromRequestData, looksLikeAnId, detailedAuthorQueryOptions);

// Register Resource Routes
export const authorsRoutes = Router();
authorsRoutes.get('/', getAllAuthors);
authorsRoutes.post('/', createAuthorRecordFromRequestData);

export const authorRoutes = Router();
authorRoutes.get('/:authorId', getAuthorById);