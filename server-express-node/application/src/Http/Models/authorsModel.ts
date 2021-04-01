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
export interface AuthorObject {
    id?:                number | undefined;
    first_name?:        string | undefined;
    middle_name?:       string | undefined;
    last_name?:         string;
    parent_author_id?:  number | undefined;
};

// Initialize Database Models
const Authors = sequelizeInstance.models.Authors;

// Prepare Resource-Specific Response Handler Methods
export const respondWithAuthorsPayload = respondWithResourceList('Authors');
export const respondWithAuthorsNotFound = respondWithResourceNotFound('Authors');
export const respondWithAuthorNotFound = respondWithResourceNotFound('Author');
export const respondInvalidAuthorId = respondInvalidResourceId('Author');

// Prepare Resource-Specific Data Handler Methods
export const extractAuthorIdFromRequestData = (request: Request): number => extractIntParameterValueFromRequestData('author_id', request) || extractIntParameterValueFromRequestData('authorId', request);
export const validateExtractedAuthor = (extractedAuthor: AuthorObject): validationResponse => {
    if (false == isNonEmptyString(extractedAuthor.last_name).boolean) { // Verify Last Name (required) Parameter Is Set
        return validationResponseBaseFail('Missing (required) author last name');
    } // End of Verify Last Name (required) Parameter Is Set
    if (extractedAuthor.parent_author_id && false == looksLikeAnId(extractedAuthor.parent_author_id).boolean) { // Validate Parent Author ID (i.e. pseudonym)
        validationResponseBaseFail('Invalid parent author id');
    } // End of Validate Parent Author ID (i.e. pseudonym)
    return validationResponseBaseSuccess();
};

// Prepare Resource-Specific ORM Methods
export const fetchAllAuthors = findAllAndRespond(Authors, respondWithAuthorsPayload);
export const fetchAuthorById = findByPKAndRespond(Authors, respondWithAuthorsPayload, respondWithAuthorNotFound, respondInvalidAuthorId, looksLikeAnId);
export const createAuthorRecord = createAndRespond(
    Authors,
    respondWith400,
    respondWith500,
    respondWithAuthorsPayload,
    validateExtractedAuthor
);