import { Request } from 'express';
import { sequelizeInstance } from '../../Database/Relational/database-sequelize';
import {
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

// Types
export interface SubmittedTagCandidate {
    id?:    number;
    tag?:   string;
};

// Initialize Database Models
const Tag = sequelizeInstance.models.Tag;

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