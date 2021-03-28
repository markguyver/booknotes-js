import { Request, Response } from 'express';
import { Map } from 'immutable';
import { curry } from 'ramda';
import { Model, ModelCtor, FindOptions } from 'sequelize';
import { insertWhereEqualsToQueryOptions } from '../database';
import { logger } from '../logger';

// Data Types
export interface validationResponse {
    boolean:    boolean;
    type:       string;
    message?:   string;
};

// Prepare General Helpers (like validation)
export const validationResponseBaseFail = (message: string = ''): validationResponse => ({ boolean: false, type: 'failure', message: message });
export const validationResponseBaseSuccess = (): validationResponse => ({ boolean: true, type: 'success' });
export const looksLikeAnId = (idSuspect: number): validationResponse => (!isNaN(idSuspect) && idSuspect > 0) ? validationResponseBaseSuccess() : validationResponseBaseFail();
export const isNonEmptyString = (value: string | undefined): validationResponse => ('string' == typeof value && value.length > 0) ? validationResponseBaseSuccess() : validationResponseBaseFail();

// Prepare Data Handler Methods
export const extractIntParameterValueFromRequestData = curry((parameterName: string, request: Request): number => parseInt(request.body[parameterName]) || parseInt(request.params[parameterName]) || NaN);
export const extractStringParameterValueFromRequestData = curry((parameterName: string, request: Request): string => String(request.body[parameterName]).toString() || String(request.params[parameterName]).toString());

// Prepare HTTP Response Error Helpers
export const respondWith400 = (response: Response, message: string = 'Bad Request'): Response => response.status(400).send(message);
export const respondWith404 = (response: Response, message: string = 'Not found'): Response => response.status(404).send(message);
export const respondWith500 = (response: Response, message: string = 'Internal Server Error'): Response => response.status(500).send(message);

// Prepare HTTP Resource Response Helpers
export const respondWithResourceList = curry((resourceName: string, response: Response, resourceData: Array<Model>, statusCode: number = 200): Response => 
    response
        .status(statusCode)
        .type('json')
        .send(Map().set(resourceName, resourceData).toJSON())
);
export const respondWithResourceNotFound = curry((resourceName: string, response: Response): Response => respondWith404(response, resourceName + ' not found'));
export const respondInvalidResourceId = curry((resourceName: string, response: Response): Response => respondWith400(response, 'Invalid ' + resourceName + ' ID'));

// Prepare HTTP Resource ORM Helpers
export const findAllAndRespond = curry((
    sequelizeModel:                 ModelCtor<Model<any, any>>,
    queryResultsHandler:            Function,
    queryOptions:                   FindOptions,
    request:                        Request,
    response:                       Response
): Response => {
    sequelizeModel.findAll(queryOptions)
        // TODO: Use Not Found handler
        .then(results => queryResultsHandler(response, results))
        .catch(error => {
            logger.error({ application: {
                sequelizeModel: sequelizeModel,
                queryOptions: queryOptions,
                request: request,
                error: error,
            } }, 'findAllAndRespond() Query Failure');
            respondWith500(response);
        });
    return response;
});
export const findByPKAndRespond = curry((
    sequelizeModel:                 ModelCtor<Model<any, any>>,
    queryResultsHandler:            Function,
    notFoundHandler:                Function,
    invalidIdHandler:               Function,
    extractedIdValidator:           (extractedId: number) => validationResponse,
    idExtractor:                    (request: Request) => number,
    queryOptions:                   FindOptions,
    request:                        Request,
    response:                       Response
): Response => {
    const id = idExtractor(request);
    if (extractedIdValidator(id).boolean) { // Validate ID Parameter
        sequelizeModel.findByPk(id, queryOptions).then(result => {
            if (result) { // Check for Results
                queryResultsHandler(response, [result]);
            } else { // Middle of Check for Results
                notFoundHandler(response);
            } // End of Check for Results
        }).catch(error => {
            logger.error({ application: {
                sequelizeModel: sequelizeModel,
                queryOptions: queryOptions,
                id: id,
                request: request,
                error: error,
            } }, 'findByPKAndRespond() Query Failure');
            respondWith500(response);
        });
    } else { // Middle of Validate ID Parameter
        invalidIdHandler(response);
    } // End of Validate ID Parameter
    return response;
});
export const FindAllByFKAndRespond = curry((
    sequelizeModel:                 ModelCtor<Model<any, any>>,
    queryResultsHandler:            Function,
    invalidIdHandler:               Function,
    foreignKeyName:                 string,
    extractedForeignIdValidator:    (extractedId: number) => validationResponse,
    foreignIdExtractor:             (request: Request) => number,
    queryOptions:                   FindOptions,
    request:                        Request,
    response:                       Response
): Response => {
    const foreignId = foreignIdExtractor(request);
    if (extractedForeignIdValidator(foreignId).boolean) { // Validate Foreign ID Parameter
        findAllAndRespond(
            sequelizeModel,
            queryResultsHandler,
            // TODO: Add Not Found Handler
            insertWhereEqualsToQueryOptions(foreignKeyName, foreignId, queryOptions),
            request,
            response
        );
    } else { // Middle of Validate Foreign ID Parameter
        invalidIdHandler(response);
    } // End of Validate Foreign ID Parameter
    return response;
});
export const createAndRespond = curry((
    sequelizeModel:                 ModelCtor<Model<any, any>>,
    validationFailureHandler:       Function,
    insertFailureHandler:           Function,
    insertSuccessHandler:           Function,
    validateExtractedValues:        (extractedObject: object) => validationResponse,
    extractValuesFromRequest:       (request: Request) => object,
    request:                        Request,
    response:                       Response
): Response => {
    const newRecord = extractValuesFromRequest(request);
    const newRecordValidation = validateExtractedValues(newRecord);
    if (newRecordValidation.boolean) { // Validate Extracted Values
        sequelizeModel.create(newRecord)
            .then(result => insertSuccessHandler(response, result, 201))
            .catch(error => {
                logger.error({ application: {
                    sequelizeModel: sequelizeModel,
                    newRecord: newRecord,
                    newRecordValidation: newRecordValidation,
                    request: request,
                    error: error,
                } }, 'createAndRespond() Query Failure');
                insertFailureHandler(response, 'Failed to insert record');
            });
    } else { // Middle of Validate Extracted Values
        validationFailureHandler(response, newRecordValidation.message);
    } // End of Validate Extracted Values
    return response;
});