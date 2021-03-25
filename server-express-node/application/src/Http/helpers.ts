import {Response} from 'express';
import {Map} from 'immutable';
import {curry} from 'ramda';
import {Model, ModelCtor, FindOptions, WhereOptions} from 'sequelize';
import {sequelizeInstance} from '../database';
import {logger} from '../logger';

enum foreignKeyNames {
    book_id = 'book_id',
    author_id = 'author_id'
};

// Define General Helpers (like validation)
const looksLikeAnId = (idSuspect: number): boolean => !isNaN(idSuspect) && idSuspect > 0;
const makeForeignKeyWhereQuery = (foreignId: number, foreignKeyName: foreignKeyNames, options: FindOptions): FindOptions => {
    const whereClause: WhereOptions = {};
    whereClause[foreignKeyName] = foreignId;
    return Object.assign({ where: whereClause }, options);
};

// Prepare HTTP Request Payload Helpers
export const respondWith400 = (response: Response, message: string = ''): Response => response.status(400).send(message);
export const respondWith404 = (response: Response, message: string = ''): Response => response.status(404).send(message);
export const respondWith500 = (response: Response, message: string = ''): Response => response.status(500).send(message);

// Prepare HTTP Resource Response Payload Helpers
const respondWithResourceList = curry((resourceName: string, response: Response, resourceData: Array<Model>, statusCode: number = 200) => 
    response
        .status(statusCode)
        .type('json')
        .send(Map().set(resourceName, resourceData).toJSON())
);
const respondWithResource404 = curry((resourceName: string, response: Response) => respondWith404(response, resourceName + ' not found'));
const respondInvalidResourceId = curry((resourceName: string, response: Response) => respondWith400(response, 'Invalid ' + resourceName + ' ID'));
const fetchAllAndRespond = curry((
    sequelizeModel: ModelCtor<Model<any, any>>,
    queryResultsHandler: Function,
    queryOptions: FindOptions,
    response: Response
): Response => {
    sequelizeModel.findAll(queryOptions)
        .then(results => queryResultsHandler(response, results))
        .catch(error => respondWith500(response)); // TODO: Add Error Logging?
    return response;
});
const fetchByIdAndRespond = curry((
    sequelizeModel: ModelCtor<Model<any, any>>,
    queryResultsHandler: Function,
    notFoundHandler: Function,
    invalidIdHandler: Function,
    id: number,
    options: FindOptions,
    response: Response
): Response => {
    const respondWithResults = queryResultsHandler(response);
    if (looksLikeAnId(id)) { // Validate ID Parameter
        sequelizeModel.findByPk(id, options).then(result => {
            if (result) { // Check for Results
                respondWithResults([result]);
            } else { // Middle of Check for Results
                notFoundHandler(response);
            } // End of Check for Results
        }).catch(error => respondWith500(response)); // TODO: Add Error Logging
    } else { // Middle of Validate ID Parameter
        invalidIdHandler(response);
    } // End of Validate ID Parameter
    return response;
});
const fetchResourceByForeignIdAndRespond = curry((
    sequelizeModel: ModelCtor<Model<any, any>>,
    queryResultsHandler: Function,
    notFoundHandler: Function,
    invalidIdHandler: Function,
    foreignKeyName: foreignKeyNames,
    foreignId: number,
    options: FindOptions,
    response: Response
): Response => {
    if (looksLikeAnId(foreignId)) { // Validate Foreign ID Parameter
        sequelizeModel.findAll(makeForeignKeyWhereQuery(foreignId, foreignKeyName, options)).then(result => {
            if (result) {// Check for Results
                queryResultsHandler(response, result);
            } else { // Middle of Check for Results
                notFoundHandler(response);
            } // End of Check for Results
        }).catch(error => respondWith500(response)); // TODO: Add Error Logging
    } else { // Middle of Validate Foreign ID Parameter
        invalidIdHandler(response);
    } // End of Validate Foreign ID Parameter
    return response;
});

// Initialize Database Models
const Authors = sequelizeInstance.models.Authors;
const BookAuthors = sequelizeInstance.models.BookAuthors;
const Books = sequelizeInstance.models.Books;
const ContributionTypes = sequelizeInstance.models.ContributionTypes;
const Notes = sequelizeInstance.models.Notes;
const Tags = sequelizeInstance.models.Tags;


// Prepare Resource-Specific (i.e. Exported) Methods

// Authors
export const respondWithAuthorsPayload = respondWithResourceList('Authors');
export const respondWithAuthorNotFound = respondWithResource404('Author');
export const respondInvalidAuthorId = respondInvalidResourceId('Author');
export const fetchAllAuthorsAndRespond = fetchAllAndRespond(Authors, respondWithAuthorsPayload);
export const fetchAuthorByIdAndRespond = fetchByIdAndRespond(Authors, respondWithAuthorsPayload, respondWithAuthorNotFound, respondInvalidAuthorId);

// Books
export const respondWithBooksPayload = respondWithResourceList('Books');
export const respondWithBookNotFound = respondWithResource404('Book');
export const respondWithBooksNotFound = respondWithResource404('Books');
export const respondInvalidBookId = respondInvalidResourceId('Book');
export const fetchAllBooksAndRespond = fetchAllAndRespond(Books, respondWithBooksPayload);
export const fetchBookByIdAndRespond = fetchByIdAndRespond(Books, respondWithBooksPayload, respondWithBookNotFound, respondInvalidBookId);

// Contribution Types
export const respondWithContributionTypesPayload = respondWithResourceList('ContributionTypes');
export const respondWithContributionTypeNotFound = respondWithResource404('Contribution Type');
export const respondInvalidContributionTypeId = respondInvalidResourceId('Contribution Type');
export const fetchAllContributionTypesAndRespond = fetchAllAndRespond(ContributionTypes, respondWithContributionTypesPayload);
export const fetchContributionTypeByIdAndRespond = fetchByIdAndRespond(ContributionTypes, respondWithContributionTypesPayload, respondWithContributionTypeNotFound, respondInvalidContributionTypeId);

// Notes
export const respondWithNotesPayload = respondWithResourceList('Notes');
export const respondWithNotesNotFound = respondWithResource404('Notes');
export const fetchNotesByBookIdAndRespond = fetchResourceByForeignIdAndRespond(Notes, respondWithNotesPayload, respondWithNotesNotFound, respondInvalidBookId, foreignKeyNames.book_id);

// Tags
export const respondWithTagsPayload = respondWithResourceList('Tags');
export const respondWithTagNotFound = respondWithResource404('Tag');
export const respondWithTagsNotFound = respondWithResource404('Tags');
export const respondInvalidTagId = respondInvalidResourceId('Tag');
export const fetchAllTagsAndRespond = fetchAllAndRespond(Tags, respondWithTagsPayload);
export const fetchTagByIdAndRespond = fetchByIdAndRespond(Tags, respondWithTagsPayload, respondWithTagNotFound);