import {Request, Response, Router} from 'express';
import {Sequelize} from 'sequelize';
import {sequelizeInstance} from '../../database';
import {fetchAllAuthorsAndRespond, fetchAllBooksAndRespond, fetchAllTagsAndRespond} from '../helpers';

// Initialize Database Models
const Authors = sequelizeInstance.models.Authors;
const BookAuthors = sequelizeInstance.models.BookAuthors;
const Books = sequelizeInstance.models.Books;
const ContributionTypes = sequelizeInstance.models.ContributionTypes;
const Notes = sequelizeInstance.models.Notes;
const Tags = sequelizeInstance.models.Tags;

// Define Endpoint Handlers
const getResourceCounts = (request: Request, response: Response): Response => {
    response.send({ status: 'Coming Soon' }); // TODO Delete This

    // TODO Get Author Count
    // TODO Get Book Count
    // TODO Get Note Count
    // TODO Use PromiseAll to Manage Queries

    return response;
};
const getAuthorLeaderboard = (request: Request, response: Response): Response => fetchAllAuthorsAndRespond({
    attributes: [
        'id',
        'first_name',
        'middle_name',
        'last_name',
        'parent_author_id',
        'deleted_at',
        [Sequelize.fn('COUNT', Sequelize.col('BookAuthors.author_id')), 'bookCount'],
    ],
    group: [
        'id',
        'first_name',
        'middle_name',
        'last_name',
        'parent_author_id',
        'deleted_at',
    ],
    order: [[Sequelize.col('bookCount'), 'DESC'], ['last_name', 'ASC'], ['first_name', 'ASC'], ['middle_name', 'ASC']],
    paranoid: false,
    include: [{
        model: BookAuthors,
        required: true,
        attributes: [],
    }],
}, response);
const getBookLeaderboard = (request: Request, response: Response): Response => fetchAllBooksAndRespond({
    attributes: [
        'id',
        'title',
        'deleted_at',
        [Sequelize.fn('COUNT', Sequelize.col('Notes.book_id')), 'noteCount'],
    ],
    group: [
        'id',
        'title',
        'deleted_at',
    ],
    order: [[Sequelize.col('noteCount'), 'DESC'], ['title', 'ASC']],
    paranoid: false,
    include: [{
        model: Notes,
        required: true,
        attributes: [],
    }],
}, response);
const getTagLeaderboard = (request: Request, response: Response): Response => fetchAllTagsAndRespond({
    attributes: [
        'id',
        'tag',
        'deleted_at',
        [Sequelize.fn('COUNT', Sequelize.col('Authors.id')), 'authorCount'],
        [Sequelize.fn('COUNT', Sequelize.col('Books.id')), 'bookCount'],
    ],
    group: [
        'id',
        'tag',
        'deleted_at',
    ],
    order: [['tag', 'ASC']],
    paranoid: false,
    include: [{
        model: Authors,
        required: false,
        attributes: [],
    },{
        model: Books,
        required: false,
        attributes: [],
    }],
}, response);

// Register Resource Routes
export const dashboardRoutes = Router();
dashboardRoutes.get('/', getResourceCounts);
dashboardRoutes.get('/leaderboard/authors', getAuthorLeaderboard);
dashboardRoutes.get('/leaderboard/books', getBookLeaderboard);
dashboardRoutes.get('/leaderboard/tags', getTagLeaderboard);