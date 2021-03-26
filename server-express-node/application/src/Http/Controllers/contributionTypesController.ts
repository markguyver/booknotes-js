import {DataTypes, Model} from 'sequelize';
import {Request, Response, Router} from 'express';
import {sequelizeInstance} from '../../database';
import {
    looksLikeAnId,
    respondWith400,
    respondWith500,
    respondWithResourceList,
    respondWithResource404,
    respondInvalidResourceId,
    fetchAllAndRespond,
    fetchByIdAndRespond,
    insertNewResourceAndRespond
} from '../helpers';

// Initialize Database Models
const ContributionTypes = sequelizeInstance.models.ContributionTypes;

// Prepare Resource-Specific (i.e. Exported) Methods
export const respondWithContributionTypesPayload = respondWithResourceList('ContributionTypes');
export const respondWithContributionTypeNotFound = respondWithResource404('Contribution Type');
export const respondInvalidContributionTypeId = respondInvalidResourceId('Contribution Type');
const fetchAllContributionTypesAndRespond = fetchAllAndRespond(ContributionTypes, respondWithContributionTypesPayload);
const fetchContributionTypeByIdAndRespond = fetchByIdAndRespond(ContributionTypes, respondWithContributionTypesPayload, respondWithContributionTypeNotFound, respondInvalidContributionTypeId);

// Define Endpoint Handlers
const getAllContributionTypes = (request: Request, response: Response): Response => fetchAllContributionTypesAndRespond({}, response);
const getContributionTypeById = (request: Request, response: Response): Response => fetchContributionTypeByIdAndRespond(parseInt(request.params.contributionTypeId), {}, response);

// Register Resource Routes
export const contributionTypesRoutes = Router();
contributionTypesRoutes.get('/', getAllContributionTypes);

export const contributionTypeRoutes = Router();
contributionTypeRoutes.get('/:contributionTypeId', getContributionTypeById);