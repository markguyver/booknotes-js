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
import { respondInvalidBookId, extractBookIdFromRequestData } from './booksController';
import { respondInvalidTagId, extractTagIdFromRequestData } from './tagsController';

// Types
interface AuthorObject {
    id?:                number | undefined;
    first_name?:        string | undefined;
    middle_name?:       string | undefined;
    last_name?:         string;
    parent_author_id?:  number | undefined;
};

// Initialize Database Models
const Authors = sequelizeInstance.models.Authors;
const BookAuthors = sequelizeInstance.models.BookAuthors;
const Books = sequelizeInstance.models.Books;
const ContributionTypes = sequelizeInstance.models.ContributionTypes;
const Tags = sequelizeInstance.models.Tags;

// Prepare Resource-Specific Variables
const listAuthorsWithBookCountQueryOptions: FindOptions = {
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
const displayAuthorQueryOptions: FindOptions = {
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
const listAuthorsByBookIdQueryOptions: FindOptions = {
    order: [['last_name', 'ASC'], ['first_name', 'ASC'], ['middle_name', 'ASC']],
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
const listAuthorsByTagIdQueryOptions: FindOptions = {
    order: [['last_name', 'ASC'], ['first_name', 'ASC'], ['middle_name', 'ASC']],
    paranoid: false,
    include: [{
        model: Tags,
        required: true,
    }],
};

// Prepare Resource-Specific Response Handler Methods
export const respondWithAuthorsPayload = respondWithResourceList('Authors');
export const respondWithAuthorsNotFound = respondWithResourceNotFound('Authors');
export const respondWithAuthorNotFound = respondWithResourceNotFound('Author');
export const respondInvalidAuthorId = respondInvalidResourceId('Author');

// Prepare Resource-Specific Data Handler Methods
export const extractAuthorIdFromRequestData = (request: Request): number => extractIntParameterValueFromRequestData('author_id', request) || extractIntParameterValueFromRequestData('authorId', request);
const extractNewAuthorFromRequestData = (request: Request): AuthorObject => ({
    first_name:         extractStringParameterValueFromRequestData('first_name', request) || undefined,
    middle_name:        extractStringParameterValueFromRequestData('middle_name', request) || undefined,
    last_name:          extractStringParameterValueFromRequestData('last_name', request),
    parent_author_id:   extractIntParameterValueFromRequestData('parent_author_id', request) || undefined,
});
export const validateExtractedAuthor = (extractedAuthor: AuthorObject): validationResponse => {
    if (false == isNonEmptyString(extractedAuthor.last_name).boolean) { // Verify Last Name (required) Parameter Is Set
        return validationResponseBaseFail('Missing (required) author last name');
    } // End of Verify Last Name (required) Parameter Is Set
    if (extractedAuthor.parent_author_id && false == looksLikeAnId(extractedAuthor.parent_author_id).boolean) { // Validate Parent Author ID (i.e. pseudonym)
        validationResponseBaseFail('Invalid parent author id');
    } // End of Validate Parent Author ID (i.e. pseudonym)
    return validationResponseBaseSuccess();
};

logger.info({
    extractAuthorIdFromRequestData: typeof extractAuthorIdFromRequestData,
    extractBookIdFromRequestData: typeof extractBookIdFromRequestData,
    extractTagIdFromRequestData: typeof extractTagIdFromRequestData,
}, 'Authors'); // TODO: Delete This

const addWhereBookIdClauseToAuthorListQueryOptions = addWhereForeignIdClauseToResourceListQueryOptions(
    BookAuthors,
    extractBookIdFromRequestData,
    respondInvalidBookId,
    'book_id' // BookAuthors.book_id
);
const addWhereTagIdClauseToAuthorListQueryOptions = addWhereForeignIdClauseToResourceListQueryOptions(
    Tags,
    extractTagIdFromRequestData,
    respondInvalidTagId,
    'id' // Tags.id
);

// Prepare Resource-Specific ORM Methods
export const fetchAllAuthors = findAllAndRespond(Authors, respondWithAuthorsPayload);
export const fetchAuthorById = findByPKAndRespond(Authors, respondWithAuthorsPayload, respondWithAuthorNotFound, respondInvalidAuthorId, looksLikeAnId);
const fetchAuthorByIdFromRequestData = fetchAuthorById(extractAuthorIdFromRequestData);
export const createAuthorRecord = createAndRespond(
    Authors,
    respondWith400,
    respondWith500,
    respondWithAuthorsPayload,
    validateExtractedAuthor
);
const createAuthorRecordFromRequestData = createAuthorRecord(extractNewAuthorFromRequestData);

// Define Endpoint Handlers
const listAllAuthors = fetchAllAuthors(provideFindOptionsUnmodified(listAuthorsWithBookCountQueryOptions));
const displayAuthorById = fetchAuthorByIdFromRequestData(displayAuthorQueryOptions);
const listAuthorsByBookIdFromRequestData = fetchAllAuthors(provideFindOptionsModified(listAuthorsByBookIdQueryOptions, addWhereBookIdClauseToAuthorListQueryOptions));
const listAuthorsByTagIdFromRequestData = fetchAllAuthors(provideFindOptionsModified(listAuthorsByTagIdQueryOptions, addWhereTagIdClauseToAuthorListQueryOptions));

// Register Resource Routes
export const authorsRoutes = Router();
authorsRoutes.get('/', listAllAuthors);
authorsRoutes.post('/', createAuthorRecordFromRequestData);
authorsRoutes.get('/book/:bookId', listAuthorsByBookIdFromRequestData);
authorsRoutes.get('/tag/:tagId', listAuthorsByTagIdFromRequestData);

export const authorRoutes = Router();
authorRoutes.get('/:authorId', displayAuthorById);