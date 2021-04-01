import { Request } from 'express';
import { sequelizeInstance } from '../../database';
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
    extractIntParameterValueFromRequestData,
    findAllAndRespond,
    findByPKAndRespond,
    createAndRespond
} from '../helpers';

// Types
export interface BookObject {
    id?:        number | undefined;
    title?:     string;
};

// Initialize Database Models
const Books = sequelizeInstance.models.Books;

// Prepare Resource-Specific Response Handler Methods
export const respondWithBooksPayload = respondWithResourceList('Books');
export const respondWithBookNotFound = respondWithResourceNotFound('Book');
export const respondWithBooksNotFound = respondWithResourceNotFound('Books');
export const respondInvalidBookId = respondInvalidResourceId('Book');

// Prepare Resource-Specific Data Handler Methods
export const extractBookIdFromRequestData = (request: Request): number => extractIntParameterValueFromRequestData('book_id', request) || extractIntParameterValueFromRequestData('bookId', request);
export const validateExtractedBook = (extractedBook: BookObject): validationResponse => {
    if (!isNonEmptyString(extractedBook.title)) { // Verify Title (required) Parameter Is Set
        return validationResponseBaseFail('Missing (required) book title');
    } // End of Verify Title (required) Parameter Is Set
    return validationResponseBaseSuccess();
};

// Prepare Resource-Specific ORM Methods
export const fetchAllBooks = findAllAndRespond(Books, respondWithBooksPayload);
export const fetchBookById = findByPKAndRespond(Books, respondWithBooksPayload, respondWithBookNotFound, respondInvalidBookId, looksLikeAnId);
export const createBookRecord = createAndRespond(
    Books,
    respondWith400,
    respondWith500,
    respondWithBooksPayload,
    validateExtractedBook
);