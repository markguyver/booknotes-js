import { Router } from 'express';
import { sequelizeInstance } from '../../database';
import {
    looksLikeAnId,
    respondWithResourceList,
    respondWithResource404,
    respondInvalidResourceId,
    extractIdParameterFromRequestData,
    fetchAllAndRespond,
    fetchByIdAndRespond
} from '../helpers';

// Initialize Database Models
const ContributionTypes = sequelizeInstance.models.ContributionTypes;

// Prepare Resource-Specific (i.e. Exported) Methods
export const respondWithContributionTypesPayload = respondWithResourceList('ContributionTypes');
export const respondWithContributionTypeNotFound = respondWithResource404('Contribution Type');
export const respondInvalidContributionTypeId = respondInvalidResourceId('Contribution Type');
const fetchAllContributionTypesAndRespond = fetchAllAndRespond(ContributionTypes, respondWithContributionTypesPayload);
const fetchContributionTypeByIdAndRespond = fetchByIdAndRespond(ContributionTypes, respondWithContributionTypesPayload, respondWithContributionTypeNotFound, respondInvalidContributionTypeId);
const extractContributionTypeIdFromRequestData = extractIdParameterFromRequestData('contributionTypeId');

// Define Endpoint Handlers
const getAllContributionTypes = fetchAllContributionTypesAndRespond({});
const getContributionTypeById = fetchContributionTypeByIdAndRespond(extractContributionTypeIdFromRequestData, looksLikeAnId, {});

// Register Resource Routes
export const contributionTypesRoutes = Router();
contributionTypesRoutes.get('/', getAllContributionTypes);

export const contributionTypeRoutes = Router();
contributionTypeRoutes.get('/:contributionTypeId', getContributionTypeById);