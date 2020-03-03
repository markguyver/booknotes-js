import {Request, Response, Router} from 'express';
import {Sequelize} from 'sequelize';
import {sequelize} from './databaseController';

// Initialize Database Models
const Authors = sequelize.models.Authors;
const BookAuthors = sequelize.models.BookAuthors;
const Books = sequelize.models.Books;
const ContributionTypes = sequelize.models.ContributionTypes;
const Notes = sequelize.models.Notes;
const Tags = sequelize.models.Tags;

// Define Endpoint Handlers
const getResourceCounts = (request: Request, response: Response): Response => {
    response.send({ status: 'Coming Soon' }); // TODO Delete This
    return response;
};

// Register Resource Routes
export const dashboardRoutes = Router();
dashboardRoutes.get('/', getResourceCounts);