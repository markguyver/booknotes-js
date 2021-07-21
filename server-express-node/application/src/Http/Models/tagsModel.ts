import { Request } from 'express';
import { curry } from 'ramda';
import { ModelCtor } from 'sequelize/types';
import {
    Author,
    Book,
    Note,
    Tag
} from '../../Database/Relational/database-sequelize';
import {
    operationResult,
    getOperationResult,
    validationResponse,
    validationResponseBaseFail,
    validationResponseBaseSuccess,
    looksLikeAnId,
    isNonEmptyString,
    respondWith400,
    respondWith500,
    respondWithResourceList,
    respondWithResourceNotFound,
    respondInvalidResourceId,
    extractIntParameterValueFromRequestData,
    findAllAndRespond,
    findByPKAndRespond,
    createAndRespond,
    deleteAndRespond
} from '../helpers';
import { logger } from '../../logger';

// Types
export interface SubmittedTagCandidate {
    id?:    number;
    tag?:   string;
}

// Prepare Resource-Specific Response Handler Methods
export const respondWithTagsPayload = respondWithResourceList('Tags');
export const respondWithTagNotFound = respondWithResourceNotFound('Tag');
export const respondWithTagsNotFound = respondWithResourceNotFound('Tags');
export const respondInvalidTagId = respondInvalidResourceId('Tag');

// Prepare Resource-Specific Data Handler Methods
export const extractTagIdFromRequestData = (request: Request): number => extractIntParameterValueFromRequestData('tag_id', request) || extractIntParameterValueFromRequestData('tagId', request);
export const validateExtractedTag = (extractedBook: SubmittedTagCandidate): validationResponse => {
    if (false == isNonEmptyString(extractedBook.tag).boolean) { // Verify Tag (required) Parameter Is Set
        return validationResponseBaseFail('Missing (required) tag');
    } // End of Verify Tag (required) Parameter Is Set
    return validationResponseBaseSuccess();
};
export const addTagToResource = curry((
    resourceToAddTagTo: ModelCtor<Author | Book | Note>,
    resourceName: string,
    resourceIdExtractor: (request: Request) => number,
    request: Request,
): Promise<operationResult> => new Promise(resolve => {
    const resourceId = resourceIdExtractor(request);
    if (false === looksLikeAnId(resourceId).boolean) { // Validate Extracted Resource ID
        // TODO: Find a way to re-use respondWithInvalidResourceID() functions
        resolve(getOperationResult(false, 400, 'Invalid ' + resourceName + ' ID'));
    } // End of Validate Extracted Resource ID
    const tagId = extractTagIdFromRequestData(request);
    if (false === looksLikeAnId(tagId).boolean) { // Validate Extracted Tag ID
        // TODO: Find a way to re-use respondWithInvalidResourceID() functions
        resolve(getOperationResult(false, 400, 'Invalid Tag ID'));
    } // End of Validate Extracted Tag ID
    resourceToAddTagTo.findByPk(resourceId).then(resourceResult => {
        if (resourceResult) { // Check Resource Retrieval
            if (resourceResult instanceof Author ||
                resourceResult instanceof Book ||
                resourceResult instanceof Note
            ) { // Validate Retrieved Resource (Model) Type (for Typescript)
                resourceResult.addTag(tagId).then(() => {
                    resolve(getOperationResult(true, 200, 'Tag added to ' + resourceName.toLowerCase()));
                }).catch(tagError => {
                    if (tagError.parent.code && 'ER_NO_REFERENCED_ROW_2' == tagError.parent.code) { // Check Add Tag Error for Foreign Key Constraint Error (i.e. Tag Not Found)
                        // TODO: Find a way to re-use respondWithResourceNotFound() functions
                        resolve(getOperationResult(false, 404, 'Tag not found'));
                    } else { // Middle of Check Add Tag Error for Foreign Key Constraint Error (i.e. Tag Not Found)
                        logger.error({ application: {
                            resourceToAddTagTo: typeof resourceToAddTagTo,
                            resourceName: resourceName,
                            resourceId: resourceId,
                            tagId: tagId,
                            request: request,
                            error: tagError,
                        } }, 'addTagToResource() Add Tag to Resource (Insert) Failure');
                        resolve(getOperationResult(false, 500, 'An unexpected error has occurred'));
                    } // End of Check Add Tag Error for Foreign Key Constraint Error (i.e. Tag Not Found)
                });
            } else { // Middle of Validate Retrieved Resource (Model) Type (for Typescript)
                // This shouldn't happen, because we are only allowing ModelCtor's for Models that have the addTag()
                // method; but the way Sequelize typings are configured doesn't allow Typescript to deduce this.
                logger.error({ application: {
                    resourceToAddTagTo: typeof resourceToAddTagTo,
                    resourceName: resourceName,
                    resourceId: resourceId,
                    tagId: tagId,
                    request: request,
                    resourceResult: typeof resourceResult,
                } }, 'addTagToResource() Find Resource by Primary Key Succeeded with Unexpected Type');
                resolve(getOperationResult(false, 500, 'An unexpected error has occurred'));
            } // End of Validate Retrieved Resource (Model) Type (for Typescript)
        } else { // Middle of Check Resource Retrieval
            // TODO: Find a way to re-use respondWithResourceNotFound() functions
            resolve(getOperationResult(false, 404, resourceName + ' not found'));
        } // End of Check Resource Retrieval
    }).catch(resourceError => {
        logger.error({ application: {
            resourceToAddTagTo: typeof resourceToAddTagTo,
            resourceName: resourceName,
            resourceId: resourceId,
            tagId: tagId,
            request: request,
            error: resourceError,
        } }, 'addTagToResource() Find Resource by Primary Key Failure');
        resolve(getOperationResult(false, 500, 'An unexpected error has occurred'));
    });
}));
export const removeTagFromResource = curry((
    resourceToRemoveTagFrom: ModelCtor<Author | Book | Note>,
    resourceName: string,
    resourceIdExtractor: (request: Request) => number,
    request: Request,
): Promise<operationResult> => new Promise(resolve => {
    const resourceId = resourceIdExtractor(request);
    if (false === looksLikeAnId(resourceId).boolean) { // Validate Extracted Resource ID
        // TODO: Find a way to re-use respondWithInvalidResourceID() functions
        resolve(getOperationResult(false, 400, 'Invalid ' + resourceName + ' ID'));
    } // End of Validate Extracted Resource ID
    const tagId = extractTagIdFromRequestData(request);
    if (false === looksLikeAnId(tagId).boolean) { // Validate Extracted Tag ID
        // TODO: Find a way to re-use respondWithInvalidResourceID() functions
        resolve(getOperationResult(false, 400, 'Invalid Tag ID'));
    } // End of Validate Extracted Tag ID
    resourceToRemoveTagFrom.findByPk(resourceId).then(resourceResult => {
        if (resourceResult) { // Check Resource Retrieval
            if (resourceResult instanceof Author ||
                resourceResult instanceof Book ||
                resourceResult instanceof Note
            ) { // Validate Retrieved Resource (Model) Type (for Typescript)
                resourceResult.removeTag(tagId).then(() => {
                    // If the tag does not exist or was not associated with the resource (i.e. author, book, or note),
                    // then (0 === promiseResponse). If the deletion was successful, then (1 === promiseResponse). We're
                    // returning true in both instances because the Sequelize return type claims to be void.
                    resolve(getOperationResult(true, 200, 'Tag removed from ' + resourceName.toLowerCase()));
                }).catch(tagError => {
                    logger.error({ application: {
                        resourceToRemoveTagFrom: typeof resourceToRemoveTagFrom,
                        resourceName: resourceName,
                        resourceId: resourceId,
                        tagId: tagId,
                        request: request,
                        error: tagError,
                    } }, 'removeTagFromResource() Add Tag to Resource (Insert) Failure');
                    resolve(getOperationResult(false, 500, 'An unexpected error has occurred'));
                });
            } else { // Middle of Validate Retrieved Resource (Model) Type (for Typescript)
                // This shouldn't happen, because we are only allowing ModelCtor's for Models that have the addTag()
                // method; but the way Sequelize typings are configured doesn't allow Typescript to deduce this.
                logger.error({ application: {
                    resourceToRemoveTagFrom: typeof resourceToRemoveTagFrom,
                    resourceName: resourceName,
                    resourceId: resourceId,
                    tagId: tagId,
                    request: request,
                    resourceResult: typeof resourceResult,
                } }, 'removeTagFromResource() Find Resource by Primary Key Succeeded with Unexpected Type');
                resolve(getOperationResult(false, 500, 'An unexpected error has occurred'));
            } // End of Validate Retrieved Resource (Model) Type (for Typescript)
        } else { // Middle of Check Resource Retrieval
            // TODO: Find a way to re-use respondWithResourceNotFound() functions
            resolve(getOperationResult(false, 404, resourceName + ' not found'));
        } // End of Check Resource Retrieval
    }).catch(resourceError => {
        logger.error({ application: {
            resourceToRemoveTagFrom: typeof resourceToRemoveTagFrom,
            resourceName: resourceName,
            resourceId: resourceId,
            tagId: tagId,
            request: request,
            error: resourceError,
        } }, 'removeTagFromResource() Find Resource by Primary Key Failure');
        resolve(getOperationResult(false, 500, 'An unexpected error has occurred'));
    });
}));

// Prepare Resource-Specific ORM Methods
export const fetchAllTags = findAllAndRespond(
    Tag,
    respondWithTagsPayload
);
export const fetchTagById = findByPKAndRespond(
    Tag,
    respondWithTagsPayload,
    respondWithTagNotFound,
    respondInvalidTagId,
    looksLikeAnId
);
export const createTagRecord = createAndRespond(
    Tag,
    respondWith400,
    respondWith500,
    respondWithTagsPayload,
    validateExtractedTag
);
export const deleteTagRecord = deleteAndRespond(
    Tag,
    respondWithTagNotFound,
    respondInvalidTagId,
    looksLikeAnId
);