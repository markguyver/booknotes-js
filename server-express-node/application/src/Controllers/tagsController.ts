import {Request, Response, Router} from 'express';
import {Sequelize} from 'sequelize';
import {sequelize} from './databaseController';

// Initialize Database Models
const Authors = sequelize.models.Authors;
const Books = sequelize.models.Books;
const Notes = sequelize.models.Notes;
const Tags = sequelize.models.Tags;

// Define Endpoint Handlers
const getAllTags = (request: Request, response: Response): Response => {
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

// Register Resource Routes
export const tagsRoutes = Router();
tagsRoutes.get('/', getAllTags);

export const tagRoutes = Router();
tagRoutes.get('/:tagId', getTagById);