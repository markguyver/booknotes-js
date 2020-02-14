import {Request, Response, Router} from 'express';
import {sequelize} from './databaseController';

const getAllAuthors = (request: Request, response: Response): Response => {
    sequelize.models.Authors.findAll({
        order: [['last_name', 'ASC'], ['first_name', 'ASC'], ['middle_name', 'ASC']],
        paranoid: false,
    }).then(results => {
        response.type('json');
        response.send({ Authors: results });
    });
    return response;
};

const createNewAuthor = (request: Request, response: Response): Response => {

    // TODO Parse Request Body into Author Object

    sequelize.models.Authors.create(request.body).then(() => {
        sequelize.models.Authors.findOne({where: request.body}).then(result => {
            response.type('json');
            response.status(201);
            response.send({ Authors: [result] });
        });
    });
    return response;
};

const getAuthorById = (request: Request, response: Response): Response => {
    const authorId = request.params.authorId;
    sequelize.models.Authors.findByPk(authorId).then(result => {
        console.log('Get Author by ID results:', result);
        response.type('json');
        response.send({ Authors: [result] });
    }).catch(error => {
        console.error('Get Author by ID error:', error);
        response.status(500).send();
    });
    return response;
};

export const authorsRoutes = Router();
authorsRoutes.get('/', getAllAuthors);
authorsRoutes.post('/', createNewAuthor);

export const authorRoutes = Router();
authorRoutes.get('/:authorId', getAuthorById);