import { Request, Response } from 'express';
import { Map } from 'immutable';
import { allPass, curry, has, is, propEq } from 'ramda';
import { Model, ModelCtor, FindOptions, Includeable, WhereOptions, WhereAttributeHash } from 'sequelize';
import { insertWhereEqualsToQueryOptionsAsFindOptions, insertWhereEqualsToQueryOptionsAsIncludeable } from '../Database/Relational/database-sequelize';
import { logger } from '../logger';

// Data Types
export type responseHandler = (response: Response) => Response;
export interface operationResult {
    statusCode: number;     // The HTTP Status Code to Respond With
    message: string;        // The HTTP Message (i.e. Body) to Respond With
    boolean: boolean;       // Was the Operation Successful or Not?
}
export interface queryOptionsProviderError {
    message: string;
    handler: responseHandler;
}
export interface validationResponse {
    boolean:    boolean;
    type:       string;
    message?:   string;
}
type deleteModelOptions = {
    force: boolean;
    where: WhereAttributeHash;
}

// Prepare General Helpers (like validation)
export const getOperationResult = (boolean: boolean, statusCode: number, message: string): operationResult => ({ boolean, statusCode, message });
export const getQueryOptionsProviderError = (handler: (response:Response) => Response, message: string = '') => ({ message: message, handler: handler });
const isQueryOptionsProviderError = (errorToTest: any): errorToTest is queryOptionsProviderError => ('function' == typeof errorToTest.handler);
export const validationResponseBaseFail = (message: string = ''): validationResponse => ({ boolean: false, type: 'failure', message: message });
export const validationResponseBaseSuccess = (): validationResponse => ({ boolean: true, type: 'success' });
export const looksLikeAnId = (idSuspect: number): validationResponse => (!isNaN(idSuspect) && idSuspect > 0) ? validationResponseBaseSuccess() : validationResponseBaseFail();
const emptyValuesAsStrings = ['', 'NaN', 'null', 'undefined'];
export const isNonEmptyString = (value?: string): validationResponse => ( ('string' == typeof value) && (value.length > 0) && (-1 == emptyValuesAsStrings.indexOf(value)) ) ? validationResponseBaseSuccess() : validationResponseBaseFail();
export const removeEmptyValuesAsStrings = (valueToCheck: any): boolean => -1 == emptyValuesAsStrings.indexOf(String(valueToCheck).toString());

// Prepare Data Handler Methods
export const extractIntParameterValueFromRequestData = curry((
    parameterName: string,
    request: Request
): number =>
    parseInt(request.body[parameterName]) ||
    parseInt(request.params[parameterName]) ||
    NaN
);
export const extractIntQueryValueFromRequestData = curry((
    parameterName: string,
    request: Request
): number =>
    parseInt(String(request.query[parameterName]).toString()) ||
    NaN
);
export const extractStringParameterValueFromRequestData = curry((
    parameterName: string,
    request: Request
): string => 
    String(request.params[parameterName] || request.body[parameterName] || '').toString()
);
export const extractStringQueryValueFromRequestData = curry((
    parameterName: string,
    request: Request
): string =>
    String(request.query[parameterName]).toString()
);
export const provideFindOptionsUnmodified = curry((findOptions: FindOptions, request: Request): FindOptions => findOptions);
export const provideFindOptionsModified = curry((
    findOptions: FindOptions,
    findOptionsModifier: (findOptions: FindOptions, request: Request) => FindOptions,
    request: Request
): FindOptions =>
    findOptionsModifier(findOptions, request)
);
export const provideDestroyOptions = curry((primaryKeyName: string, usesHardDeletes: boolean, primaryKeyValue: number): deleteModelOptions => {
    const whereClause: WhereOptions = {};
    whereClause[primaryKeyName] = primaryKeyValue;
    return {
        force: usesHardDeletes,
        where: whereClause,
    };
});

// Prepare HTTP Response Error Helpers
export const respondWith204 = (response: Response): Response => response.status(204).send();
export const respondWith400 = (response: Response, message: string = 'Bad Request'): Response => response.status(400).send(message);
export const respondWith404 = (response: Response, message: string = 'Not found'): Response => response.status(404).send(message);
export const respondWith500 = (response: Response, message: string = 'Internal Server Error'): Response => response.status(500).send(message);

// Prepare HTTP Resource Response Helpers
export const respondWithResourceList = curry((
    resourceName: string,
    response: Response,
    resourceData: Array<Model>,
    statusCode: number = 200
): Response => 
    response
        .status(statusCode)
        .type('json')
        .send(Map().set(resourceName, resourceData).toJSON())
);
export const respondWithResourceNotFound = curry((resourceName: string, response: Response): Response => respondWith404(response, resourceName + ' not found'));
export const respondInvalidResourceId = curry((resourceName: string, response: Response): Response => respondWith400(response, 'Invalid ' + resourceName + ' ID'));
export const addWhereForeignIdClauseToResourceListQueryOptions = curry((
    sequelizeModelToAddForeignIdWhereClauseTo: ModelCtor<Model<any, any>>,
    foreignIdExtrator: (request: Request) => number,
    invalidForeignIdResponseHandler: (response: Response) => Response,
    foreignKeyName: string,
    queryOptions: FindOptions | { include: Includeable[] },
    request: Request
): FindOptions => {
    const foreignId = foreignIdExtrator(request);
    if (looksLikeAnId(foreignId).boolean) { // Validate Extracted Foreign ID
        const clonedQueryOptions = Object.assign({}, queryOptions);
        if (clonedQueryOptions.include && 'object' == typeof clonedQueryOptions.include && Array.isArray(clonedQueryOptions.include)) { // Check for Include Array
            const isThisTheModelWereLookingFor = allPass([
                is(Object),
                has('model'),
                propEq('model', sequelizeModelToAddForeignIdWhereClauseTo),
            ]);
            clonedQueryOptions.include = clonedQueryOptions.include.map(item => isThisTheModelWereLookingFor(item) ? insertWhereEqualsToQueryOptionsAsIncludeable(foreignKeyName, foreignId, item) : item);
        } // End of Check for Include Array
        return clonedQueryOptions;
    } else { // Middle of Validate Extracted Foreign ID
        throw getQueryOptionsProviderError(invalidForeignIdResponseHandler);
    } // End of Validate Extracted Foreign ID
});

// Prepare HTTP Resource ORM Helpers
export const findAllAndRespond = curry((
    sequelizeModel:                 ModelCtor<Model<any, any>>,
    queryResultsHandler:            Function,
    queryOptionsProvider:           (request: Request) => FindOptions,
    request:                        Request,
    response:                       Response
): Response => {
    try { // Call Query Options Provider Then Perform Query
        const queryOptionsFromProvider = queryOptionsProvider(request);
        sequelizeModel.findAll(queryOptionsFromProvider)
            // TODO: Use Not Found handler
            .then(results => queryResultsHandler(response, results))
            .catch(error => {
                logger.error({ application: {
                    sequelizeModel: sequelizeModel,
                    queryOptions: queryOptionsFromProvider,
                    request: request,
                    error: error,
                } }, 'findAllAndRespond() Query Failure');
                respondWith500(response);
            });
    } catch (error) { // Middle of Call Query Options Provider Then Perform Query
        if (isQueryOptionsProviderError(error)) { // Check Query Options Provider Error to Handle
            error.handler(response);
        } else { // Middle of Check Query Options Provider Error to Handle
            logger.error({ application: {
                sequelizeModel: typeof sequelizeModel,
                queryOptions: queryOptionsProvider(request),
                request: request,
                error: error,
            } }, 'findAllAndRespond() Query Options Provider Failure');
            respondWith500(response);
        } // End of Check Query Options Provider Error to Handle
    } // End of Call Query Options Provider Then Perform Query
    return response;
});
export const findByPKAndRespond = curry((
    sequelizeModel:                 ModelCtor<Model<any, any>>,
    queryResultsHandler:            Function,
    notFoundHandler:                responseHandler,
    invalidIdHandler:               responseHandler,
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
                sequelizeModel: typeof sequelizeModel,
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
export const findByFKAndRespond = curry((
    sequelizeModel:                 ModelCtor<Model<any, any>>,
    queryResultsHandler:            Function,
    invalidIdHandler:               responseHandler,
    foreignKeyName:                 string,
    extractedForeignIdValidator:    (extractedId: number) => validationResponse,
    foreignIdProvider:              (request: Request) => number,
    queryOptions:                   FindOptions,
    request:                        Request,
    response:                       Response
): Response => {
    const foreignId = foreignIdProvider(request);
    const queryOptionsProvider = (request: Request): FindOptions => insertWhereEqualsToQueryOptionsAsFindOptions(foreignKeyName, foreignId, queryOptions);
    if (extractedForeignIdValidator(foreignId).boolean) { // Validate Foreign ID Parameter
        findAllAndRespond(
            sequelizeModel,
            queryResultsHandler,
            // TODO: Add Not Found Handler
            queryOptionsProvider,
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
    validationFailureHandler:       (response: Response, message?: string) => Response,
    insertFailureHandler:           (response: Response, message: string) => Response,
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
            .then(result => insertSuccessHandler(response, [result], 201))
            .catch(error => {
                logger.error({ application: {
                    sequelizeModel: typeof sequelizeModel,
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
export const deleteAndRespond = curry((
    sequelizeModel:                 ModelCtor<Model<any, any>>,
    notFoundHandler:                responseHandler,
    invalidIdHandler:               responseHandler,
    extractedIdValidator:           (extractedId: number) => validationResponse,
    idExtractor:                    (request: Request) => number,
    queryOptionsProvider:           (primaryKeyValue: number) => deleteModelOptions,
    request:                        Request,
    response:                       Response
): Response => {
    const id = idExtractor(request);
    if (extractedIdValidator(id).boolean) { // Validate ID Parameter
        const destroyOptions = queryOptionsProvider(id);
        sequelizeModel.destroy(destroyOptions).then(result => {
            if (result) { // Check for Results
                respondWith204(response);
            } else { // Middle of Check for Results
                notFoundHandler(response);
            } // End of Check for Results
        }).catch(error => {
            logger.error({ application: {
                sequelizeModel: typeof sequelizeModel,
                queryOptions: destroyOptions,
                id: id,
                request: request,
                error: error,
            } }, 'deleteAndRespond() Query Failure');
            respondWith500(response);
        });
    } else { // Middle of Validate ID Parameter
        invalidIdHandler(response);
    } // End of Validate ID Parameter
    return response;
});
export const performOperationAndRespond = curry((
    operationToPerform:             (request: Request) => Promise<operationResult>,
    request:                        Request,
    response:                       Response
): Response => {
    operationToPerform(request)
        .then(operationOutcome => response.status(operationOutcome.statusCode).send(operationOutcome.message))
        .catch(error => {
            logger.error({ application: {
                request: request,
                error: error,
            }}, 'performOperationAndRespond() Unexpected Error');
        });
    return response;
});