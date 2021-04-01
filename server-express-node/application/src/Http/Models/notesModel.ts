import { Request } from 'express';
import { sequelizeInstance } from '../../database';
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
    findByPKAndRespond,
    createAndRespond
} from '../helpers';

// Types
export interface NoteObject {
    id?:    number | undefined;
    note?:   string;
};

// Initialize Database Models
const Notes = sequelizeInstance.models.Notes;

// Prepare Resource-Specific Response Handler Methods
export const respondWithNotesPayload = respondWithResourceList('Notes');
export const respondWithNoteNotFound = respondWithResourceNotFound('Note');
export const respondWithNotesNotFound = respondWithResourceNotFound('Notes');
export const respondWithInvalidNoteId = respondInvalidResourceId('Note');

// Prepare Resource-Specific Data Handler Methods
export const extractNoteIdFromRequestData = (request: Request): number => extractIntParameterValueFromRequestData('note_id', request) || extractIntParameterValueFromRequestData('noteId', request);
export const validateExtractedNote = (extractedNote: NoteObject): validationResponse => {
    if (false == isNonEmptyString(extractedNote.note).boolean) { // Verify Note (required) Parameter Is Set
        return validationResponseBaseFail('Missing (required) note');
    } // End of Verify Note (required) Parameter Is Set
    return validationResponseBaseSuccess();
};

// Prepare Resource-Specific ORM Methods
export const fetchNoteById = findByPKAndRespond(Notes, respondWithNotesPayload, respondWithNoteNotFound, respondWithInvalidNoteId, looksLikeAnId);
export const createNoteRecord = createAndRespond(
    Notes,
    respondWith400,
    respondWith500,
    respondWithNotesPayload,
    validateExtractedNote
);