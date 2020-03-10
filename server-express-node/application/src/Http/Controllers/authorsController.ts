import {Request, Response, Router} from 'express';
import {Sequelize} from 'sequelize';
import {sequelize} from '../../database';

// Initialize Database Models
const Authors = sequelize.models.Authors;
const BookAuthors = sequelize.models.BookAuthors;
const Books = sequelize.models.Books;
const ContributionTypes = sequelize.models.ContributionTypes;
const Tags = sequelize.models.Tags;

// Define Endpoint Handlers
const getAllAuthors = (request: Request, response: Response): Response => {
    Authors.findAll({
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
    }).then(results => {
        response.type('json');
        response.send({ Authors: results });
    });
    return response;
};
const createNewAuthor = (request: Request, response: Response): Response => {

    // TODO Parse Request Body into Author Object

    Authors.create(request.body).then(() => {
        Authors.findOne({where: request.body}).then(result => {
            response.type('json');
            response.status(201);
            response.send({ Authors: [result] });
        });
    });
    return response;
};
const getAuthorById = (request: Request, response: Response): Response => {
    const authorId = parseInt(request.params.authorId);
    if (!isNaN(authorId) && authorId > 0) { // Validate ID Parameter
        Authors.findByPk(authorId, { // Perform Author Retrieval Query
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
        }).then(result => { // Middle of Perform Author Retrieval Query
            if (result) { // Check for Results
                response.type('json');
                response.send({ Authors: [result] });
            } else { // Middle of Check for Results
                response.status(404).send();
            } // End of Check for Results
        }).catch(error => { // Middle of Perform Author Retrieval Query
            response.status(500).send();
        }); // End of Perform Author Retrieval Query
    } else { // Middle of Validate ID Parameter
        response.status(400).send('Invalid Author ID');
    } // End of Validate ID Parameter
    return response;
};

// Register Resource Routes
export const authorsRoutes = Router();
authorsRoutes.get('/', getAllAuthors);
authorsRoutes.post('/', createNewAuthor);

export const authorRoutes = Router();
authorRoutes.get('/:authorId', getAuthorById);