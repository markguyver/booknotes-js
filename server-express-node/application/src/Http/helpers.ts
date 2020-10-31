import {Response} from 'express';
import {Map} from 'immutable';
import {curry} from 'ramda';
import {Model, ModelCtor, FindOptions} from 'sequelize';
import {sequelizeInstance} from '../database';
import {logger} from '../logger';

export const respondWithResourceList = curry((resourceName: string, response: Response, resourceData: Array<Model>, statusCode: number = 200) => {
    response
        .status(statusCode)
        .type('json')
        .send(Map().set(resourceName, resourceData).toJSON());
});
export const respondWithAuthorsPayload = respondWithResourceList('Authors');
export const respondWithBooksPayload = respondWithResourceList('Books');
export const respondWithContributionTypesPayload = respondWithResourceList('ContributionTypes');
export const respondWithNotesPayload = respondWithResourceList('Notes');
export const respondWithTagsPayload = respondWithResourceList('Tags');

export const respondWith400 = (response: Response): Response => response.status(400);
export const respondWith404 = (response: Response): Response => response.status(404);
export const respondWith500 = (response: Response): Response => response.status(500);

const respondWithResource404 = curry((resourceName: string, response: Response) => respondWith404(response).send(resourceName + ' not found'));
export const respondWithAuthorNotFound = respondWithResource404('Author');
export const respondWithBookNotFound = respondWithResource404('Book');
export const respondWithContributionTypeNotFound = respondWithResource404('Contribution Type');
export const respondWithNotesNotFound = respondWithResource404('Notes');
export const respondWithTagsNotFound = respondWithResource404('Tags');

export const validateIdParameter = (idToValidate: string, response: Response): number | null => {

    // TODO Refactor This, Use Curried respondInvalidResourceId() ?

    const filteredIdToValidate = parseInt(idToValidate);
    if (!isNaN(filteredIdToValidate) && filteredIdToValidate > 0) { // Validate ID Parameter
        return filteredIdToValidate;
    } else { // Middle of Validate ID Parameter
        response.status(400).send();
        return null;
    } // End of Validate ID Parameter
};

const respondInvalidResourceId = curry((resourceName: string, response: Response) => respondWith400(response).send('Invalid ' + resourceName + ' ID'));
export const respondInvalidAuthorId = respondInvalidResourceId('Author');
export const respondInvalidBookId = respondInvalidResourceId('Book');
export const respondInvalidTagId = respondInvalidResourceId('Tag');

// Initialize Database Models
const Authors = sequelizeInstance.models.Authors;
const BookAuthors = sequelizeInstance.models.BookAuthors;
const Books = sequelizeInstance.models.Books;
const ContributionTypes = sequelizeInstance.models.ContributionTypes;
const Tags = sequelizeInstance.models.Tags;

// TODO Define FindAllResource Curried Function
const fetchAllAndRespond = curry((sequelizeModel: ModelCtor<Model<any, any>>, queryResultsHandler: Function, queryOptions: FindOptions, response: Response): Response => {
    sequelizeModel.findAll(queryOptions)
        .then(results => queryResultsHandler(response, results))
        .catch(error => respondWith500(response)); // TODO: Add Error Logging?
    return response;
});
export const fetchAllAuthorsAndRespond = fetchAllAndRespond(Authors, respondWithAuthorsPayload);
export const fetchAllBooksAndRespond = fetchAllAndRespond(Books, respondWithBooksPayload);
export const fetchAllTagsAndRespond = fetchAllAndRespond(Tags, respondWithTagsPayload);

// TODO Define FindOneResource Curried Function
const fetchByIdAndRespond = curry((sequelizeModel: ModelCtor<Model<any, any>>, queryResultsHandler: Function, notFoundHandler: Function, invalidIdHandler: Function, id: number, options: FindOptions, response: Response) => {

    // TODO Refactor This

    const respondWithResults = queryResultsHandler(response);
    if (!isNaN(id) && id > 0) { // Validate ID Parameter
        sequelizeModel.findByPk(id, options).then(result => { // Middle of Perform Author Retrieval Query
            if (result) { // Check for Results
                respondWithResults([result]);
            } else { // Middle of Check for Results
                notFoundHandler(response);
            } // End of Check for Results
        }).catch(error => { // Middle of Perform Author Retrieval Query

            // TODO: Add Error Logging

            respondWith500(response);
        }); // End of Perform Author Retrieval Query
    } else { // Middle of Validate ID Parameter
        invalidIdHandler(response);
    } // End of Validate ID Parameter
});
export const fetchAuthorByIdAndRespond = fetchByIdAndRespond(Authors, respondWithAuthorsPayload, respondWithAuthorNotFound, respondInvalidAuthorId);