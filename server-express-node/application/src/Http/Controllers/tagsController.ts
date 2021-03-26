import {Request, Response, Router} from 'express';
import {Map} from 'immutable';
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
interface TagObject {
    tag: string;
};

// Initialize Database Models
const Authors = sequelizeInstance.models.Authors;
const Books = sequelizeInstance.models.Books;
const Notes = sequelizeInstance.models.Notes;
const Tags = sequelizeInstance.models.Tags;

// Prepare Resource-Specific (i.e. Exported) Methods
export const respondWithTagsPayload = respondWithResourceList('Tags');
export const respondWithTagNotFound = respondWithResource404('Tag');
export const respondWithTagsNotFound = respondWithResource404('Tags');
export const respondInvalidTagId = respondInvalidResourceId('Tag');
export const fetchAllTagsAndRespond = fetchAllAndRespond(Tags, respondWithTagsPayload);
const fetchTagByIdAndRespond = fetchByIdAndRespond(Tags, respondWithTagsPayload, respondWithTagNotFound);
// const fetchTagsByAuthorIdAndRespond = fetchResourceByForeignIdAsManyAndRespond();
// const fetchTagsByBookIdAndRespond = fetchResourceByForeignIdAsManyAndRespond();
const extractNewTagFromRequestData = (request: Request): TagObject => ({ tag: request.body.tag || '' });
const validateExtractedNewTagFromRequestData = (extractedBook: TagObject) => {
    const validationResult = { type: 'success', message: '' };
    if ((null == extractedBook.tag) || ('string' != typeof extractedBook.tag) || (extractedBook.tag.length < 1)) { // Verify Tag (required) Parameter Is Set
        validationResult.type = 'failure';
        validationResult.message = 'Missing (required) tag';
    } // End of Verify Tag (required) Parameter Is Set
    return validationResult;
};
const createTagRecordFromRequestData = insertNewResourceAndRespond(
    Tags,
    extractNewTagFromRequestData,
    validateExtractedNewTagFromRequestData,
    respondWith400,
    respondWith500,
    respondWithTagsPayload
);

// Define Endpoint Handlers
const getAllTags = (request: Request, response: Response): Response => fetchAllTagsAndRespond({
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
}, response);
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

    const bookId = parseInt(request.params.bookId);
    // const bookId = validateIdParameter(request.params.bookId, response);
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

    const authorId = parseInt(request.params.authorId);
    // const authorId = validateIdParameter(request.params.authorId, response);
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

// Register Resource Routes
export const tagsRoutes = Router();
tagsRoutes.get('/', getAllTags);
tagsRoutes.post('/', createTagRecordFromRequestData);
tagsRoutes.get('/author/:authorId', getTagsByAuthorId);
tagsRoutes.get('/book/:bookId', getTagsByBookId);

export const tagRoutes = Router();
tagRoutes.get('/:tagId', getTagById);