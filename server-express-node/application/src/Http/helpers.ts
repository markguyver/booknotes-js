import { Request, Response } from 'express';
import { Map } from 'immutable';
import { curry } from 'ramda';
import { Model, ModelCtor, FindOptions, WhereOptions } from 'sequelize';

// Prepare Types
export enum foreignKeyNames {
    author_id = 'author_id',
    book_id = 'book_id',
    tag_id = 'tag_id'
};

// Prepare General Helpers (like validation)
export const looksLikeAnId = (idSuspect: number): boolean => !isNaN(idSuspect) && idSuspect > 0;
const makeForeignKeyWhereQuery = (foreignId: number, foreignKeyName: foreignKeyNames, options: FindOptions): FindOptions => {
    const whereClause: WhereOptions = {};
    whereClause[foreignKeyName] = foreignId;
    return Object.assign({ where: whereClause }, options);
};

// Prepare HTTP Response Error Helpers
export const respondWith400 = (response: Response, message: string = ''): Response => response.status(400).send(message);
export const respondWith404 = (response: Response, message: string = ''): Response => response.status(404).send(message);
export const respondWith500 = (response: Response, message: string = ''): Response => response.status(500).send(message);

// Prepare HTTP Resource Response Helpers
export const respondWithResourceList = curry((resourceName: string, response: Response, resourceData: Array<Model>, statusCode: number = 200) => 
    response
        .status(statusCode)
        .type('json')
        .send(Map().set(resourceName, resourceData).toJSON())
);
export const respondWithResource404 = curry((resourceName: string, response: Response) => respondWith404(response, resourceName + ' not found'));
export const respondInvalidResourceId = curry((resourceName: string, response: Response) => respondWith400(response, 'Invalid ' + resourceName + ' ID'));
export const extractIdParameterFromRequestData = curry((parameterName: string, request: Request): number => parseInt(request.body[parameterName]) || parseInt(request.params[parameterName]) || NaN);

// Prepare HTTP Resource ORM Helpers
export const fetchAllAndRespond = curry((
    sequelizeModel: ModelCtor<Model<any, any>>,
    queryResultsHandler: Function,
    queryOptions: FindOptions,
    request: Request,
    response: Response
): Response => {
    sequelizeModel.findAll(queryOptions)
        .then(results => queryResultsHandler(response, results))
        .catch(error => respondWith500(response)); // TODO: Add Error Logging?
    return response;
});
export const fetchByIdAndRespond = curry((
    sequelizeModel: ModelCtor<Model<any, any>>,
    queryResultsHandler: Function,
    notFoundHandler: Function,
    invalidIdHandler: Function,
    idExtractor: Function,
    extractedIdValidator: Function,
    options: FindOptions,
    request: Request,
    response: Response
): Response => {
    const respondWithResults = queryResultsHandler(response);
    const id = idExtractor(request);
    if (extractedIdValidator(id)) { // Validate ID Parameter
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
export const fetchResourceByForeignIdAndRespond = curry((
    sequelizeModel: ModelCtor<Model<any, any>>,
    queryResultsHandler: Function,
    notFoundHandler: Function,
    invalidIdHandler: Function,
    foreignKeyName: foreignKeyNames,
    foreignIdExtractor: Function,
    extractedForeignIdValidator: Function,
    options: FindOptions,
    request: Request,
    response: Response
): Response => {
    const foreignId = foreignIdExtractor(request);
    if (extractedForeignIdValidator(foreignId)) { // Validate Foreign ID Parameter
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
export const fetchResourceByForeignIdAsManyAndRespond = curry((
    sequelizeModel: ModelCtor<Model<any, any>>,
    queryResultsHandler: Function,
    notFoundHandler: Function,
    invalidIdHandler: Function,
    foreignKeyName: foreignKeyNames,
    foreignId: number,
    options: FindOptions,
    response: Response
): Response => {

    // TODO: Put Logic Here

    return response;
});
export const insertNewResourceAndRespond = curry((
    sequelizeModel: ModelCtor<Model<any, any>>,
    extractValuesFromRequest: Function,
    validateExtractedValues: Function,
    validationFailureHandler: Function,
    insertFailureHandler: Function,
    insertSuccessHandler: Function,
    request: Request,
    response: Response
): Response => {
    const newRecord = extractValuesFromRequest(request);
    const newRecordValidation = validateExtractedValues(newRecord);
    if ('success' == newRecordValidation.type) { // Validate Extracted Values
        sequelizeModel.create(newRecord)
            .then(result => insertSuccessHandler(response, result, 201))
            .catch(error => insertFailureHandler(response, 'Failed to insert record'));
    } else { // Middle of Validate Extracted Values
        validationFailureHandler(response, newRecordValidation.message);
    } // End of Validate Extracted Values
    return response;
});