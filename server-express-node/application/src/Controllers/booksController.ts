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
const getAllBooks = (request: Request, response: Response): Response => {
    Books.findAll({
        attributes: [
            'id',
            'title',
            'deleted_at',
            [Sequelize.fn('COUNT', Sequelize.col('Notes.book_id')), 'noteCount'],
        ],
        group: ['id', 'title', 'deleted_at'],
        order: [['title', 'ASC']],
        paranoid: false,
        include: [{
            model: Notes,
            required: false,
            attributes: [],
        }],
    }).then(results => {
        response.type('json');
        response.send({ Books: results });
    });
    return response;
};
const getAllBooksByAuthorId = (request: Request, response: Response): Response => {
    const authorId = request.params.authorId;
    response.send({coming:'soon',authorId:authorId});
    return response;
};
const getBookById = (request: Request, response: Response): Response => {
    const bookId = parseInt(request.params.bookId);
    if (!isNaN(bookId) && bookId > 0) { // Validate ID Parameter
        Books.findByPk(bookId, {
            paranoid: false,
            include: [{
                model: Notes,
                required: false,
            },{
                model: BookAuthors,
                required: false,
                include: [{
                    model: Authors,
                    required: false,
                    paranoid: false,
                },{
                    model: ContributionTypes,
                    required: false,
                }],
            },{
                model: Tags,
                required: false,
            }],
        }).then(result => {
            if (result) { // Check for Results
                response.type('json');
                response.send({ Books: [result] });
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
export const booksRoutes = Router();
booksRoutes.get('/', getAllBooks);
booksRoutes.get('/author/:authorId', getAllBooksByAuthorId);

export const bookRoutes = Router();
bookRoutes.get('/:bookId', getBookById);