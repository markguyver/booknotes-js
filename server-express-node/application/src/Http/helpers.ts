import { Request, Response } from 'express';
import { Map } from 'immutable';
import { curry } from 'ramda';
import { Model, ModelCtor, FindOptions } from 'sequelize';
import { insertWhereEqualsToQueryOptions } from '../database';
import { logger } from '../logger';

// Data Types
export interface validationResponse {
    type: string;
    message: string;
};

// Prepare General Helpers (like validation)
export const looksLikeAnId = (idSuspect: number): boolean => !isNaN(idSuspect) && idSuspect > 0; // TODO: Convert Return Value to <validationResponse>
export const isNonEmptyString = (value: string): boolean => 'string' == typeof value && value.length > 0; // TODO: Convert Return Value to <validationResponse>

// Prepare Data Handler Methods
export const extractIntParameterValueFromRequestData = curry((parameterName: string, request: Request): number => parseInt(request.body[parameterName]) || parseInt(request.params[parameterName]) || NaN);
export const extractStringParameterValueFromRequestData = curry((parameterName: string, request: Request): string => String(request.body[parameterName]).toString() || String(request.params[parameterName]).toString());

// Prepare HTTP Response Error Helpers
export const respondWith400 = (response: Response, message: string = ''): Response => response.status(400).send(message);
export const respondWith404 = (response: Response, message: string = ''): Response => response.status(404).send(message);
export const respondWith500 = (response: Response, message: string = ''): Response => response.status(500).send(message);

// Prepare HTTP Resource Response Helpers
export const respondWithResourceList = curry((resourceName: string, response: Response, resourceData: Array<Model>, statusCode: number = 200): Response => 
    response
        .status(statusCode)
        .type('json')
        .send(Map().set(resourceName, resourceData).toJSON())
);
export const respondWithResource404 = curry((resourceName: string, response: Response): Response => respondWith404(response, resourceName + ' not found'));
export const respondInvalidResourceId = curry((resourceName: string, response: Response): Response => respondWith400(response, 'Invalid ' + resourceName + ' ID'));

// Prepare HTTP Resource ORM Helpers
export const findAllAndRespond = curry((
    sequelizeModel: ModelCtor<Model<any, any>>,
    queryResultsHandler: Function,
    queryOptions: FindOptions,
    request: Request,
    response: Response
): Response => {
    sequelizeModel.findAll(queryOptions)
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
    sequelizeModel: ModelCtor<Model<any, any>>,
    queryResultsHandler: Function,
    notFoundHandler: Function,
    invalidIdHandler: Function,
    idExtractor: Function,
    extractedIdValidator: Function,
    queryOptions: FindOptions,
    request: Request,
    response: Response
): Response => {
    const id = idExtractor(request);
    if (extractedIdValidator(id)) { // Validate ID Parameter
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
export const createAndRespond = curry((
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
export const FindAllByFKAndRespond = curry((
    sequelizeModel: ModelCtor<Model<any, any>>,
    queryResultsHandler: Function,
    invalidIdHandler: Function,
    foreignKeyName: string,
    foreignIdExtractor: Function,
    extractedForeignIdValidator: Function,
    queryOptions: FindOptions,
    request: Request,
    response: Response
): Response => {
    const foreignId = foreignIdExtractor(request);
    if (extractedForeignIdValidator(foreignId)) { // Validate Foreign ID Parameter
        findAllAndRespond(
            sequelizeModel,
            queryResultsHandler,
            insertWhereEqualsToQueryOptions(foreignKeyName, foreignId, queryOptions),
            request,
            response
        );
    } else { // Middle of Validate Foreign ID Parameter
        invalidIdHandler(response);
    } // End of Validate Foreign ID Parameter
    return response;
});