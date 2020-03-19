import {Response} from 'express';
import {Map} from 'immutable';
import {curry} from 'ramda';
import {Model} from 'sequelize';

const respondWithResourceList = curry((resourceName: string, response: Response, resourceData: Array<Model>, statusCode: number = 200) => {
    response
        .sendStatus(statusCode)
        .type('json')
        .send(Map().set(resourceName, resourceData).toJSON());
});
export const respondWithAuthorsPayload = respondWithResourceList('Authors');
export const respondWithBooksPayload = respondWithResourceList('Books');
export const respondWithContributionTypesPayload = respondWithResourceList('ContributionTypes');
export const respondWithNotesPayload = respondWithResourceList('Notes');
export const respondWithTagsPayload = respondWithResourceList('Tags');

export const respondWith400 = (response: Response): Response => response.sendStatus(400);
export const respondWith404 = (response: Response): Response => response.sendStatus(404);
export const respondWith500 = (response: Response): Response => response.sendStatus(500);

const respondWithResource404 = curry((resourceName: string, response: Response) => respondWith404(response).send(resourceName + ' not found'));
export const respondWithAuthorNotFound = respondWithResource404('Author');
export const respondWithBookNotFound = respondWithResource404('Book');
export const respondWithContributionTypeNotFound = respondWithResource404('Contribution Type');
export const respondWithNotesNotFound = respondWithResource404('Notes');
export const respondWithTagsNotFound = respondWithResource404('Tags');

const respondInvalidResourceId = curry((resourceName: string, response: Response) => respondWith400(response).send('Invalid ' + resourceName + ' ID'));
export const respondInvalidAuthorId = respondInvalidResourceId('Author');
export const respondInvalidBookId = respondInvalidResourceId('Book');