import { Request, Router } from 'express';
import { FindOptions } from 'sequelize';
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
import { respondInvalidBookId, extractBookIdFromRequestData } from './booksController';

// Types
interface ContributionTypeObject {
    id?:    number | undefined;
    name?:  string;
};

// Initialize Database Models
const BookAuthors = sequelizeInstance.models.BookAuthors;
const ContributionTypes = sequelizeInstance.models.ContributionTypes;

// Prepare Resource-Specific Variables
const listContributionTypesWithAuthorAndBookCountsQueryOptions: FindOptions = {
    order: [['name', 'ASC']],    
};
const displayContributionTypeQueryOptions: FindOptions = {};
const listContributionTypesByAuthorIdQueryOptions: FindOptions = {
    order: [['name', 'ASC']],
    include: [{
        model: BookAuthors,
        required: true,
    }],
};
const listContributionTypesByBookIdQueryOptions: FindOptions = {
    order: [['name', 'ASC']],
    include: [{
        model: BookAuthors,
        required: true,
    }],
};

// Prepare Resource-Specific Response Handler Methods
export const respondWithContributionTypesPayload = respondWithResourceList('ContributionTypes');
export const respondWithContributionTypeNotFound = respondWithResourceNotFound('Contribution Type');
export const respondInvalidContributionTypeId = respondInvalidResourceId('Contribution Type');

// Prepare Resource-Specific Data Handler Methods
export const extractContributionTypeIdFromRequestData = extractIntParameterValueFromRequestData('contributionTypeId');
const extractNewContributionTypeFromRequestData = (request: Request): ContributionTypeObject => ({ name: extractStringParameterValueFromRequestData('name', request) });
export const validateExtractedContributionType = (extractedObject: ContributionTypeObject): validationResponse => {
    if (false == isNonEmptyString(extractedObject.name).boolean) { // Verify Title (required) Parameter Is Set
        return validationResponseBaseFail('Missing (required) book title');
    } // End of Verify Title (required) Parameter Is Set
    return validationResponseBaseSuccess();
};
const addWhereAuthorIdClauseToContributionTypesListQueryOptions = addWhereForeignIdClauseToResourceListQueryOptions(
    BookAuthors,
    extractAuthorIdFromRequestData,
    respondInvalidAuthorId,
    'author_id' // BookAuthors.author_id
);
const addWhereBookIdClauseToContributionTypesListQueryOptions = addWhereForeignIdClauseToResourceListQueryOptions(
    BookAuthors,
    extractBookIdFromRequestData,
    respondInvalidBookId,
    'book_id' // BookAuthors.book_id
);

// Prepare Resource-Specific ORM Methods
const fetchAllContributionTypes = findAllAndRespond(ContributionTypes, respondWithContributionTypesPayload);
export const fetchContributionTypeById = findByPKAndRespond(ContributionTypes, respondWithContributionTypesPayload, respondWithContributionTypeNotFound, respondInvalidContributionTypeId, looksLikeAnId);
const fetchContributionTypeByIdFromRequestData = fetchContributionTypeById(extractContributionTypeIdFromRequestData);
export const createContributionTypeRecord = createAndRespond(
    ContributionTypes,
    respondWith400,
    respondWith500,
    respondWithContributionTypesPayload,
    validateExtractedContributionType
);
const createContributionTypeRecordFromRequestData = createContributionTypeRecord(extractNewContributionTypeFromRequestData);

// Define Endpoint Handlers
const listAllContributionTypes = fetchAllContributionTypes(provideFindOptionsUnmodified(listContributionTypesWithAuthorAndBookCountsQueryOptions));
const displayContributionTypeById = fetchContributionTypeByIdFromRequestData(displayContributionTypeQueryOptions);
const listContributionTypesByAuthorIdFromRequestData = fetchAllContributionTypes(provideFindOptionsModified(listContributionTypesByAuthorIdQueryOptions, addWhereAuthorIdClauseToContributionTypesListQueryOptions));
const listContributionTypesByBookIdFromRequestData = fetchAllContributionTypes(provideFindOptionsModified(listContributionTypesByBookIdQueryOptions, addWhereBookIdClauseToContributionTypesListQueryOptions));

// Register Resource Routes
export const contributionTypesRoutes = Router();
contributionTypesRoutes.get('/', listAllContributionTypes);
contributionTypesRoutes.post('/', createContributionTypeRecordFromRequestData);
contributionTypesRoutes.get('/author/:authorId', listContributionTypesByAuthorIdFromRequestData);
contributionTypesRoutes.get('/book/:bookId', listContributionTypesByBookIdFromRequestData);

export const contributionTypeRoutes = Router();
contributionTypeRoutes.get('/:contributionTypeId', displayContributionTypeById);