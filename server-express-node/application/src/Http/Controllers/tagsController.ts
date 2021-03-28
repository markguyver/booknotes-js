import { Request, Response, Router } from 'express';
import { Sequelize, FindOptions } from 'sequelize';
import { sequelizeInstance } from '../../database';
import {
    validationResponseBaseFail,
    validationResponseBaseSuccess,
    validationResponse,
    looksLikeAnId,
    isNonEmptyString,
    respondWith400,
    respondWith500,
    respondWithResourceList,
    respondWithResourceNotFound,
    respondInvalidResourceId,
    extractIntParameterValueFromRequestData,
    extractStringParameterValueFromRequestData,
    findAllAndRespond,
    findByPKAndRespond,
    createAndRespond
} from '../helpers';
import { extractAuthorIdFromRequestData } from './authorsController';
import { extractBookIdFromRequestData } from './booksController';

// Types
interface TagObject {
    id?:    number | undefined;
    tag?:   string;
};

// Initialize Database Models
const Authors = sequelizeInstance.models.Authors;
const Books = sequelizeInstance.models.Books;
const Notes = sequelizeInstance.models.Notes;
const Tags = sequelizeInstance.models.Tags;

// Prepare Resource-Specific Variables
const listTagsWithAuthorBookAndNoteCountsQueryOptions: FindOptions = {
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
};
const displayTagWithAuthorsBooksAndNotes: FindOptions = {
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
};

// Prepare Resource-Specific Data Handler Methods
const extractTagIdFromRequestData = (request: Request): number => extractIntParameterValueFromRequestData('tag_id', request) || extractIntParameterValueFromRequestData('tagId', request);
const extractNewTagFromRequestData = (request: Request): TagObject => ({ tag: extractStringParameterValueFromRequestData('tag', request) });
export const validateExtractedTag = (extractedBook: TagObject): validationResponse => {
    if (false == isNonEmptyString(extractedBook.tag).boolean) { // Verify Tag (required) Parameter Is Set
        return validationResponseBaseFail('Missing (required) tag');
    } // End of Verify Tag (required) Parameter Is Set
    return validationResponseBaseSuccess();
};

// Prepare Resource-Specific Response Handler Methods
export const respondWithTagsPayload = respondWithResourceList('Tags');
export const respondWithTagNotFound = respondWithResourceNotFound('Tag');
export const respondWithTagsNotFound = respondWithResourceNotFound('Tags');
export const respondInvalidTagId = respondInvalidResourceId('Tag');

// Prepare Resource-Specific ORM Methods
const fetchAllTags = findAllAndRespond(Tags, respondWithTagsPayload);
export const fetchTagById = findByPKAndRespond(Tags, respondWithTagsPayload, respondWithTagNotFound, respondInvalidTagId, looksLikeAnId);
const fetchTagByIdFromRequestData = fetchTagById(extractTagIdFromRequestData);
// const fetchTagsByAuthorIdAndRespond = fetchResourceByForeignIdAsManyAndRespond();
// const fetchTagsByBookIdAndRespond = fetchResourceByForeignIdAsManyAndRespond();
export const createTagRecord = createAndRespond(
    Tags,
    respondWith400,
    respondWith500,
    respondWithTagsPayload,
    validateExtractedTag
);
const createTagRecordFromRequestData = createTagRecord(extractNewTagFromRequestData);

// Define Endpoint Handlers
const listAllTags = fetchAllTags(listTagsWithAuthorBookAndNoteCountsQueryOptions);
const displayTagById = fetchTagByIdFromRequestData(displayTagWithAuthorsBooksAndNotes);
const listTagsByBookId = (request: Request, response: Response): Response => {

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
const listTagsByAuthorId = (request: Request, response: Response): Response => {

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
tagsRoutes.get('/', listAllTags);
tagsRoutes.post('/', createTagRecordFromRequestData);
tagsRoutes.get('/author/:authorId', listTagsByAuthorId);
tagsRoutes.get('/book/:bookId', listTagsByBookId);

export const tagRoutes = Router();
tagRoutes.get('/:tagId', displayTagById);