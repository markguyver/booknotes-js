import { Request, Response, Router } from 'express';
import { Sequelize, FindOptions } from 'sequelize';
import {
    Author,
    BookAuthor,
    Book,
    Note
} from '../../Database/Relational/database-sequelize';
import { provideFindOptionsUnmodified } from '../helpers';
import { fetchAllAuthors } from '../Models/authorsModel';
import { fetchAllBooks } from '../Models/booksModel';
import { fetchAllTags } from '../Models/tagsModel';

// Prepare Resource-Specific Variables
const authorListWithBookCountDescending: FindOptions = {
    attributes: [
        'id',
        'first_name',
        'middle_name',
        'last_name',
        'parent_author_id',
        'deleted_at',
        [Sequelize.fn('COUNT', Sequelize.col('BookAuthor.author_id')), 'bookCount'],
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
        model: BookAuthor,
        required: true,
        attributes: [],
    }],
};
const bookListWithNoteCountDescending: FindOptions = {
    attributes: [
        'id',
        'title',
        'deleted_at',
        [Sequelize.fn('COUNT', Sequelize.col('Note.book_id')), 'noteCount'],
    ],
    group: [
        'id',
        'title',
        'deleted_at',
    ],
    order: [[Sequelize.col('noteCount'), 'DESC'], ['title', 'ASC']],
    paranoid: false,
    include: [{
        model: Note,
        required: true,
        attributes: [],
    }],
};
const tagListWithAuthorAndBookCountsInAlphabeticalOrder: FindOptions = {
    attributes: [
        'id',
        'tag',
        'deleted_at',
        [Sequelize.fn('COUNT', Sequelize.col('Author.id')), 'authorCount'],
        [Sequelize.fn('COUNT', Sequelize.col('Book.id')), 'bookCount'],
    ],
    group: [
        'id',
        'tag',
        'deleted_at',
    ],
    order: [['tag', 'ASC']],
    paranoid: false,
    include: [{
        model: Author,
        required: false,
        attributes: [],
    },{
        model: Book,
        required: false,
        attributes: [],
    }],
};

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
const getAuthorLeaderboard = fetchAllAuthors(provideFindOptionsUnmodified(authorListWithBookCountDescending));
const getBookLeaderboard = fetchAllBooks(provideFindOptionsUnmodified(bookListWithNoteCountDescending));
const getTagLeaderboard = fetchAllTags(provideFindOptionsUnmodified(tagListWithAuthorAndBookCountsInAlphabeticalOrder));

// Register Resource Routes
export const dashboardRoutes = Router();
dashboardRoutes.get('/', getResourceCounts);
dashboardRoutes.get('/leaderboard/authors', getAuthorLeaderboard);
dashboardRoutes.get('/leaderboard/books', getBookLeaderboard);
dashboardRoutes.get('/leaderboard/tags', getTagLeaderboard);