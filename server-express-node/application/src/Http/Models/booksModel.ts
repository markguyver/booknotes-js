import { Request } from 'express';
import { sequelizeInstance } from '../../Database/Relational/database-sequelize';
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
    createAndRespond,
    deleteAndRespond
} from '../helpers';

// Types
export interface SubmittedBookCandidate {
    id?:        number;
    title?:     string;
}

// Initialize Database Models
const Book = sequelizeInstance.models.Book;

// Prepare Resource-Specific Response Handler Methods
export const respondWithBooksPayload = respondWithResourceList('Books');
export const respondWithBookNotFound = respondWithResourceNotFound('Book');
export const respondWithBooksNotFound = respondWithResourceNotFound('Books');
export const respondInvalidBookId = respondInvalidResourceId('Book');

// Prepare Resource-Specific Data Handler Methods
export const extractBookIdFromRequestData = (request: Request): number => extractIntParameterValueFromRequestData('book_id', request) || extractIntParameterValueFromRequestData('bookId', request);
export const validateExtractedBook = (extractedBook: SubmittedBookCandidate): validationResponse => {
    if (!isNonEmptyString(extractedBook.title)) { // Verify Title (required) Parameter Is Set
        return validationResponseBaseFail('Missing (required) book title');
    } // End of Verify Title (required) Parameter Is Set
    return validationResponseBaseSuccess();
};

// Prepare Resource-Specific ORM Methods
export const fetchAllBooks = findAllAndRespond(
    Book,
    respondWithBooksPayload
);
export const fetchBookById = findByPKAndRespond(
    Book,
    respondWithBooksPayload,
    respondWithBookNotFound,
    respondInvalidBookId,
    looksLikeAnId
);
export const createBookRecord = createAndRespond(
    Book,
    respondWith400,
    respondWith500,
    respondWithBooksPayload,
    validateExtractedBook
);
export const deleteBookRecord = deleteAndRespond(
    Book,
    respondWithBookNotFound,
    respondInvalidBookId,
    looksLikeAnId
);