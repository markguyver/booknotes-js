import { Request, Router } from 'express';
import { FindOptions } from 'sequelize';
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

// Types
interface ContributionTypeObject {
    id?:    number | undefined;
    name?:  string;
};

// Initialize Database Models
const ContributionTypes = sequelizeInstance.models.ContributionTypes;

// Prepare Resource-Specific Variables
const listContributionTypesWithAuthorAndBookCountsQueryOptions: FindOptions = {};
const displayContributionTypeQueryOptions: FindOptions = {};

// Prepare Resource-Specific Data Handler Methods
export const extractContributionTypeIdFromRequestData = extractIntParameterValueFromRequestData('contributionTypeId');
const extractNewContributionTypeFromRequestData = (request: Request): ContributionTypeObject => ({ name: extractStringParameterValueFromRequestData('name', request) });
export const validateExtractedContributionType = (extractedObject: ContributionTypeObject): validationResponse => {
    if (false == isNonEmptyString(extractedObject.name).boolean) { // Verify Title (required) Parameter Is Set
        return validationResponseBaseFail('Missing (required) book title');
    } // End of Verify Title (required) Parameter Is Set
    return validationResponseBaseSuccess();
};

// Prepare Resource-Specific Response Handler Methods
export const respondWithContributionTypesPayload = respondWithResourceList('ContributionTypes');
export const respondWithContributionTypeNotFound = respondWithResourceNotFound('Contribution Type');
export const respondInvalidContributionTypeId = respondInvalidResourceId('Contribution Type');

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
const listAllContributionTypes = fetchAllContributionTypes(listContributionTypesWithAuthorAndBookCountsQueryOptions);
const displayContributionTypeById = fetchContributionTypeByIdFromRequestData(displayContributionTypeQueryOptions);

// Register Resource Routes
export const contributionTypesRoutes = Router();
contributionTypesRoutes.get('/', listAllContributionTypes);
contributionTypesRoutes.post('/', createContributionTypeRecordFromRequestData);

export const contributionTypeRoutes = Router();
contributionTypeRoutes.get('/:contributionTypeId', displayContributionTypeById);