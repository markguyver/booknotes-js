import {Request, Response, Router} from 'express';
import {Sequelize} from 'sequelize';
import {sequelizeInstance} from '../../database';
import {
    looksLikeAnId,
    respondWith400,
    respondWith500,
    respondWithResourceList,
    respondWithResource404,
    respondInvalidResourceId,
    fetchAllAndRespond,
    fetchByIdAndRespond,
    insertNewResourceAndRespond
} from '../helpers';

// Types
interface AuthorObject {
    id?: number;
    first_name?: string;
    middle_name?: string;
    last_name: string;
    parent_author_id?: number;
};

// Initialize Database Models
const Authors = sequelizeInstance.models.Authors;
const BookAuthors = sequelizeInstance.models.BookAuthors;
const Books = sequelizeInstance.models.Books;
const ContributionTypes = sequelizeInstance.models.ContributionTypes;
const Tags = sequelizeInstance.models.Tags;

// Prepare Resource-Specific (i.e. Exported) Methods
export const respondWithAuthorsPayload = respondWithResourceList('Authors');
export const respondWithAuthorNotFound = respondWithResource404('Author');
export const respondInvalidAuthorId = respondInvalidResourceId('Author');
export const fetchAllAuthorsAndRespond = fetchAllAndRespond(Authors, respondWithAuthorsPayload);
const fetchAuthorByIdAndRespond = fetchByIdAndRespond(Authors, respondWithAuthorsPayload, respondWithAuthorNotFound, respondInvalidAuthorId);
// const fetchAuthorsByBookIdAndRespond = fetchResourceByForeignIdAsManyAndRespond();
const extractNewAuthorFromRequestData = (request: Request): AuthorObject => ({
    first_name:         request.body.first_name           || null,
    middle_name:        request.body.middle_name          || null,
    last_name:          request.body.last_name            || null,
    parent_author_id:   request.body.parent_author_id     || null,
});
const validateExtractedNewAuthorFromRequestData = (extractedAuthor: AuthorObject) => {
    const validationResult = { type: 'success', message: '' };
    if ((null == extractedAuthor.last_name) || ('string' != typeof extractedAuthor.last_name) || (extractedAuthor.last_name.length < 1)) { // Verify Last Name (required) Parameter Is Set
        validationResult.type = 'failure';
        validationResult.message = 'Missing (required) author last name';
    } // End of Verify Last Name (required) Parameter Is Set
    if (extractedAuthor.parent_author_id && !looksLikeAnId(extractedAuthor.parent_author_id)) { // Validate Parent Author ID (i.e. pseudonym)
        validationResult.type = 'failure';
        validationResult.message = 'Invalid parent author id';
    } // End of Validate Parent Author ID (i.e. pseudonym)
    return validationResult;
};
const createAuthorRecordFromRequestData = insertNewResourceAndRespond(
    Authors,
    extractNewAuthorFromRequestData,
    validateExtractedNewAuthorFromRequestData,
    respondWith400,
    respondWith500,
    respondWithAuthorsPayload
);

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

    Authors.create(request.body).then(() => {
        Authors.findOne({where: request.body})
            .then(result => respondWithAuthorsPayload(response, result ? [result] : [], 201))
            .catch(error => respondWith500(response));
    });
    return response;
};
const getAuthorById = (request: Request, response: Response): Response => fetchAuthorByIdAndRespond(parseInt(request.params.authorId), {
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

// Register Resource Routes
export const authorsRoutes = Router();
authorsRoutes.get('/', getAllAuthors);
authorsRoutes.post('/', createAuthorRecordFromRequestData);

export const authorRoutes = Router();
authorRoutes.get('/:authorId', getAuthorById);