import {Request, Response, Router} from 'express';
import {Map} from 'immutable';
import {Sequelize} from 'sequelize';
import {sequelizeInstance} from '../../database';
import {fetchAllTagsAndRespond, validateIdParameter} from '../helpers';

// Initialize Database Models
const Authors = sequelizeInstance.models.Authors;
const Books = sequelizeInstance.models.Books;
const Notes = sequelizeInstance.models.Notes;
const Tags = sequelizeInstance.models.Tags;

// Define Endpoint Handlers
const getAllTags = (request: Request, response: Response): Response => {

    // TODO Fix Author Count, Book Count, and Note Count From this Query
    // TODO Refactor This to Use Curried Function: fetchAllTagsAndRespond()

    Tags.findAll({
        attributes: [
            'id',
            'tag',
            'deleted_at',
            [Sequelize.fn('COUNT', Sequelize.col('Authors.id')), 'authorCount'],
            [Sequelize.fn('COUNT', Sequelize.col('Books.id')), 'bookCount'],
            [Sequelize.fn('COUNT', Sequelize.col('Notes.id')), 'noteCount'],
        ],
        group: ['id', 'tag', 'deleted_at'],
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
        },{
            model: Notes,
            required: false,
            attributes: [],
        }],
    }).then(results => {
        response.type('json');
        response.send({ Tags: results });
    });
    return response;
};
const getTagById = (request: Request, response: Response): Response => {

    // TODO Refactor This

    const tagId = parseInt(request.params.tagId);
    if (!isNaN(tagId) && tagId > 0) { // Validate ID Parameter
        Tags.findByPk(tagId, {
            paranoid: false,
            include: [{
                model: Authors,
                required: false,
            },{
                model: Books,
                required: false,
            },{
                model: Notes,
                required: false,
                include: [{
                    model: Books,
                    required: false,
                }],
            }],
        }).then(result => {
            if (result) { // Check for Results
                response.type('json');
                response.send({ Tags: [result] });
            } else { // Middle of Check for Results
                response.status(404).send();
            } // End of Check for Results
        }).catch(error => {
            response.status(500).send();
        });
    } else { // Middle of Validate ID Parameter
        response.status(400).send();
    } // End of Validate ID Parameter
    return response;
};
const getTagsByBookId = (request: Request, response: Response): Response => {

    // TODO Refactor This

    const bookId = validateIdParameter(request.params.bookId, response);
    if (bookId) { // Check Passed ID Parameter Validation
        Tags.findAll({
            attributes: ['id', 'tag'],
            paranoid: false,
            include: [{
                model: Books,
                paranoid: false,
                required: true,
                attributes: [],
                where: { id: bookId },
            }],
        }).then(result => {
            if (result) { // Check for Results
                response.type('json');
                response.send({ Tags: result });
            } else { // Middle of Check for Results
                response.status(404).send();
            } // End of Check for Results
        }).catch(error => {
            response.status(500).send();
        });
    } // End of Check Passed ID Parameter Validation
    return response;
};
const getTagsByAuthorId = (request: Request, response: Response): Response => {

    // TODO Refactor This

    const authorId = validateIdParameter(request.params.authorId, response);
    if (authorId) { // Check Passed ID Parameter Validation
        Tags.findAll({
            attributes: ['id', 'tag'],
            paranoid: false,
            include: [{
                model: Authors,
                paranoid: false,
                required: true,
                attributes: [],
                where: { id: authorId },
            }],
        }).then(result => {
            if (result) { // Check for Results
                response.type('json');
                response.send({ Tags: result });
            } else { // Middle of Check for Results
                response.status(404).send();
            } // End of Check for Results
        }).catch(error => {
            response.status(500).send();
        });
    } // End of Check Passed ID Parameter Validation
    return response;
};
const createNewTag = (request: Request, response: Response): Response => {

    // TODO Parse Request Body into Tag Object

    Tags.create(request.body).then(() => {
        Tags.findOne({where: request.body}).then(result => {
            response.type('json');
            response.status(201);
            response.send({ Tags: [result] });
        });
    });
    return response;
};

// Register Resource Routes
export const tagsRoutes = Router();
tagsRoutes.get('/', getAllTags);
tagsRoutes.post('/', createNewTag);
tagsRoutes.get('/author/:authorId', getTagsByAuthorId);
tagsRoutes.get('/book/:bookId', getTagsByBookId);

export const tagRoutes = Router();
tagRoutes.get('/:tagId', getTagById);