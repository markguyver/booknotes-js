import { Request, Router } from 'express';
import { FindOptions } from 'sequelize';
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

// Types
interface ContributionTypeObject {
    id?: number;
    name: string;
};

// Initialize Database Models
const ContributionTypes = sequelizeInstance.models.ContributionTypes;

// Prepare Resource-Specific Variables
const contributionTypesListWithAuthorAndBookCountsQueryOptions: FindOptions = {};
const detailedContributionTypeQueryOptions: FindOptions = {};

// Prepare Resource-Specific Data Handler Methods
const extractContributionTypeIdFromRequestData = extractIntParameterValueFromRequestData('contributionTypeId');
const extractNewContributionTypeFromRequestData = (request: Request): ContributionTypeObject => ({ name: extractStringParameterValueFromRequestData('name', request) });
const validateExtractedNewContributionTypeFromRequestData = (extractedObject: ContributionTypeObject): validationResponse => {
    const validationResult = { type: 'success', message: '' };
    if (!isNonEmptyString(extractedObject.name)) { // Verify Title (required) Parameter Is Set
        validationResult.type = 'failure';
        validationResult.message = 'Missing (required) book title';
    } // End of Verify Title (required) Parameter Is Set
    return validationResult;
};

// Prepare Resource-Specific Response HandlerMethods
export const respondWithContributionTypesPayload = respondWithResourceList('ContributionTypes');
export const respondWithContributionTypeNotFound = respondWithResource404('Contribution Type');
export const respondInvalidContributionTypeId = respondInvalidResourceId('Contribution Type');

// Prepare Resource-Specific ORM Methods
const fetchAllContributionTypesAndRespond = findAllAndRespond(ContributionTypes, respondWithContributionTypesPayload);
const fetchContributionTypeByIdAndRespond = findByPKAndRespond(ContributionTypes, respondWithContributionTypesPayload, respondWithContributionTypeNotFound, respondInvalidContributionTypeId);
const createContributionTypeRecordFromRequestData = createAndRespond(
    ContributionTypes,
    extractNewContributionTypeFromRequestData,
    validateExtractedNewContributionTypeFromRequestData,
    respondWith400,
    respondWith500,
    respondWithContributionTypesPayload
);

// Define Endpoint Handlers
const getAllContributionTypes = fetchAllContributionTypesAndRespond(contributionTypesListWithAuthorAndBookCountsQueryOptions);
const getContributionTypeById = fetchContributionTypeByIdAndRespond(extractContributionTypeIdFromRequestData, looksLikeAnId, detailedContributionTypeQueryOptions);

// Register Resource Routes
export const contributionTypesRoutes = Router();
contributionTypesRoutes.get('/', getAllContributionTypes);
contributionTypesRoutes.post('/', createContributionTypeRecordFromRequestData);

export const contributionTypeRoutes = Router();
contributionTypeRoutes.get('/:contributionTypeId', getContributionTypeById);