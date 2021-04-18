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
    findByPKAndRespond,
    createAndRespond
} from '../helpers';

// Types
export interface ContributionTypeObject {
    id?:    number | undefined;
    name?:  string;
};

// Initialize Database Models
const BookAuthors = sequelizeInstance.models.BookAuthors;
const ContributionTypes = sequelizeInstance.models.ContributionTypes;

// Prepare Resource-Specific Response Handler Methods
export const respondWithContributionTypesPayload = respondWithResourceList('ContributionTypes');
export const respondWithContributionTypeNotFound = respondWithResourceNotFound('Contribution Type');
export const respondInvalidContributionTypeId = respondInvalidResourceId('Contribution Type');

// Prepare Resource-Specific Data Handler Methods
export const extractContributionTypeIdFromRequestData = extractIntParameterValueFromRequestData('contributionTypeId');
export const validateExtractedContributionType = (extractedObject: ContributionTypeObject): validationResponse => {
    if (false == isNonEmptyString(extractedObject.name).boolean) { // Verify Name (required) Parameter Is Set
        return validationResponseBaseFail('Missing (required) contribution type name');
    } // End of Verify Name (required) Parameter Is Set
    return validationResponseBaseSuccess();
};

// Prepare Resource-Specific ORM Methods
export const fetchContributionTypeById = findByPKAndRespond(ContributionTypes, respondWithContributionTypesPayload, respondWithContributionTypeNotFound, respondInvalidContributionTypeId, looksLikeAnId);
export const createContributionTypeRecord = createAndRespond(
    ContributionTypes,
    respondWith400,
    respondWith500,
    respondWithContributionTypesPayload,
    validateExtractedContributionType
);