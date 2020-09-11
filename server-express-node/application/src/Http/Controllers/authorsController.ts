import {Request, Response, Router} from 'express';
import {Sequelize} from 'sequelize';
import {sequelizeInstance} from '../../database';
import {fetchAuthorByIdAndRespond, fetchAllAuthorsAndRespond, respondWith500, respondWithAuthorsPayload} from '../helpers';

// Initialize Database Models
const Authors = sequelizeInstance.models.Authors;
const BookAuthors = sequelizeInstance.models.BookAuthors;
const Books = sequelizeInstance.models.Books;
const ContributionTypes = sequelizeInstance.models.ContributionTypes;
const Tags = sequelizeInstance.models.Tags;

// TODO Use Curried Functions

// Define Endpoint Handlers
const getAllAuthors = (request: Request, response: Response): Response => fetchAllAuthorsAndRespond({
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
        'Tags.id',
        'Tags.tag',
    ],
    order: [['last_name', 'ASC'], ['first_name', 'ASC'], ['middle_name', 'ASC']],
    paranoid: false,
    include: [{
        model: BookAuthors,
        required: false,
        attributes: [],
    },{
        model: Tags,
        required: false,
    }],
}, response);
const createNewAuthor = (request: Request, response: Response): Response => {

    // TODO Parse Request Body into Author Object

    const respondWithAuthor = respondWithAuthorsPayload(response);
    Authors.create(request.body).then(() => {
        Authors.findOne({where: request.body})
            .then(result => respondWithAuthor(result ? [result] : [], 201))
            .catch(error => respondWith500(response));
    });
    return response;
};
const getAuthorById = (request: Request, response: Response): Response => {
    fetchAuthorByIdAndRespond(parseInt(request.params.authorId), {
        paranoid: false,
        include: [{
            model: Authors,
            required: false,
            as: 'ActualAuthor',
            paranoid: false,
        },{
            model: Authors,
            required: false,
            as: 'Pseudonyms',
            paranoid: false,
        },{
            model: BookAuthors,
            required: false,
            include: [{
                model: Books,
                required: false,
                paranoid: false,
            },{
                model: ContributionTypes,
                required: false,
            }],
        },{
            model: Tags,
            required: false,
            paranoid: false,
        }],
    }, response);
    return response;
};

// Register Resource Routes
export const authorsRoutes = Router();
authorsRoutes.get('/', getAllAuthors);
authorsRoutes.post('/', createNewAuthor);

export const authorRoutes = Router();
authorRoutes.get('/:authorId', getAuthorById);