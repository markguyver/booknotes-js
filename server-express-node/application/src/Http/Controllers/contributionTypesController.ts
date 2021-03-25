import {DataTypes, Model} from 'sequelize';
import {Request, Response, Router} from 'express';
import {sequelizeInstance} from '../../database';
import {fetchAllContributionTypesAndRespond, fetchContributionTypeByIdAndRespond} from '../helpers';

// Define Endpoint Handlers
const getAllContributionTypes = (request: Request, response: Response): Response => fetchAllContributionTypesAndRespond({}, response);
const getContributionTypeById = (request: Request, response: Response): Response => fetchContributionTypeByIdAndRespond(parseInt(request.params.contributionTypeId), {}, response);

// Register Resource Routes
export const contributionTypesRoutes = Router();
contributionTypesRoutes.get('/', getAllContributionTypes);

export const contributionTypeRoutes = Router();
contributionTypeRoutes.get('/:contributionTypeId', getContributionTypeById);