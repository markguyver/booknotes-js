import { Request } from 'express';
import { Map } from 'immutable';
import { sequelizeInstance } from '../../Database/Relational/database-sequelize';
import {
    validationResponse,
    validationResponseBaseFail,
    validationResponseBaseSuccess,
    looksLikeAnId,
    removeEmptyValuesAsStrings,
    extractIntParameterValueFromRequestData,
    respondWith400,
    respondWith500,
    respondWithResourceList,
    respondWithResourceNotFound,
    createAndRespond
} from '../helpers';
import { extractAuthorIdFromRequestData } from './authorsModel';
import { extractBookIdFromRequestData } from './booksModel';
import { extractContributionTypeIdFromRequestData } from './contributionTypesModel';

// Types
export interface SubmittedBookAuthorContributionCandidate {
    book_id?:               number;
    author_id?:             number;
    contribution_type_id?:  number;
    order?:                 number;
};

// Initialize Database Models
const BookAuthors = sequelizeInstance.models.BookAuthors;

// Prepare Resource-Specific Response Handler Methods
export const respondWithAuthorsPayload = respondWithResourceList('BookAuthorContributions');
export const respondWithBookAuthorContributionNotFound = respondWithResourceNotFound('BookAuthorContribution');
export const respondWithBookAuthorContributionsNotFound = respondWithResourceNotFound('BookAuthorContributions');

// Prepare Resource-Specific Data Handler Methods
export const extractBookAuthorContributionFromRequestData = (request: Request): SubmittedBookAuthorContributionCandidate => Map({
    book_id:                extractBookIdFromRequestData(request),
    author_id:              extractAuthorIdFromRequestData(request),
    contribution_type_id:   extractContributionTypeIdFromRequestData(request),
    order:                  extractIntParameterValueFromRequestData('order', request),
}).filter(removeEmptyValuesAsStrings).toJSON();
export const validateExtractedBookAuthorContribution = (extractedBookAuthorContribution: SubmittedBookAuthorContributionCandidate): validationResponse => {

    console.log('Submitted Book Author Contribution:', extractedBookAuthorContribution);

    if (false === looksLikeAnId(extractedBookAuthorContribution.book_id || NaN).boolean) { // Verify Book ID (Required) Parameter Is Set
        return validationResponseBaseFail('Invalid book id');
    } // End of Verify Book ID (Required) Parameter Is Set
    if (false === looksLikeAnId(extractedBookAuthorContribution.author_id || NaN).boolean) { // Verify Author ID (Required) Parameter Is Set
        return validationResponseBaseFail('Invalid author id');
    } // End of Verify Author ID (Required) Parameter Is Set
    if (false === looksLikeAnId(extractedBookAuthorContribution.contribution_type_id || NaN).boolean) { // Verify Contribution Type ID (Required) Parameter Is Set
        return validationResponseBaseFail('Invalid contribution type id');
    } // End of Verify Contribution Type ID (Required) Parameter Is Set
    if (extractedBookAuthorContribution.order && false === looksLikeAnId(extractedBookAuthorContribution.order).boolean) { // Verify Order Parameter Is Set
        return validationResponseBaseFail('Invalid order');
    } // End of Verify Contribution Order Parameter Is Set
    return validationResponseBaseSuccess();
};

// Prepare Resource-Specific ORM Methods
export const createBookAuthorContributionAndRespond = createAndRespond(
    BookAuthors,
    respondWith400,
    respondWith500,
    respondWithAuthorsPayload,
    validateExtractedBookAuthorContribution,
    extractBookAuthorContributionFromRequestData
);