import { Request, Response, Router } from 'express';
import { Sequelize } from 'sequelize';
import { sequelizeInstance } from '../../database';
import { fetchAllAuthorsAndRespond } from './authorsController';
import { fetchAllBooksAndRespond } from './booksController';
import { fetchAllTagsAndRespond } from './tagsController';

// Initialize Database Models
const Authors = sequelizeInstance.models.Authors;
const BookAuthors = sequelizeInstance.models.BookAuthors;
const Books = sequelizeInstance.models.Books;
const Notes = sequelizeInstance.models.Notes;

// Prepare Resource-Specific (i.e. Exported) Methods

// Define Endpoint Handlers
const getResourceCounts = (request: Request, response: Response): Response => {
    response.send({ status: 'Coming Soon' }); // TODO Delete This

    // TODO Get Author Count
    // TODO Get Book Count
    // TODO Get Note Count
    // TODO Use PromiseAll to Manage Queries

    return response;
};
// const getResourceCounts = (request: Request, response: Response): Response => respondWithResourceList('Counts', response, results, statusCode);
const getAuthorLeaderboard = fetchAllAuthorsAndRespond({
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
});
const getBookLeaderboard = fetchAllBooksAndRespond({
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
});
const getTagLeaderboard = fetchAllTagsAndRespond({
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
});

// Register Resource Routes
export const dashboardRoutes = Router();
dashboardRoutes.get('/', getResourceCounts);
dashboardRoutes.get('/leaderboard/authors', getAuthorLeaderboard);
dashboardRoutes.get('/leaderboard/books', getBookLeaderboard);
dashboardRoutes.get('/leaderboard/tags', getTagLeaderboard);