import { Request } from 'express';
import { Note } from '../../Database/Relational/database-sequelize';
import {
    responseHandler,
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
    findByFKAndRespond,
    createAndRespond,
    deleteAndRespond
} from '../helpers';

// Types
export interface SubmittedNoteCandidate {
    id?:        number;
    note?:      string;
    book_id?:   number;
}

// Prepare Resource-Specific Response Handler Methods
export const respondWithNotesPayload = respondWithResourceList('Notes');
export const respondWithNoteNotFound: responseHandler = respondWithResourceNotFound('Note');
export const respondWithNotesNotFound: responseHandler = respondWithResourceNotFound('Notes');
export const respondWithInvalidNoteId: responseHandler = respondInvalidResourceId('Note');

// Prepare Resource-Specific Data Handler Methods
export const extractNoteIdFromRequestData = (request: Request): number => extractIntParameterValueFromRequestData('note_id', request) || extractIntParameterValueFromRequestData('noteId', request);
export const validateExtractedNote = (extractedNote: SubmittedNoteCandidate): validationResponse => {
    if (false == isNonEmptyString(extractedNote.note).boolean) { // Verify Note (required) Parameter Is Set
        return validationResponseBaseFail('Missing (required) note');
    } // End of Verify Note (required) Parameter Is Set
    if (false == looksLikeAnId(extractedNote.book_id || NaN).boolean) { // Verify Book ID (required) Parameter Is Set
        return validationResponseBaseFail('Missing (required) book ID');
    } // End of Verify Book ID (required) Parameter Is Set
    return validationResponseBaseSuccess();
};

// Prepare Resource-Specific ORM Methods
export const fetchAllNotes = findAllAndRespond(
    Note,
    respondWithNotesPayload
);
export const fetchNoteById = findByPKAndRespond(
    Note,
    respondWithNotesPayload,
    respondWithNoteNotFound,
    respondWithInvalidNoteId,
    looksLikeAnId
);
export const fetchNoteByBookId = findByFKAndRespond(
    Note,
    respondWithNotesPayload,
    respondWithInvalidNoteId,
    'book_id', // Note.book_id
    looksLikeAnId
);
export const createNoteRecord = createAndRespond(
    Note,
    respondWith400,
    respondWith500,
    respondWithNotesPayload,
    validateExtractedNote
);
export const deleteNoteRecord = deleteAndRespond(
    Note,
    respondWithNoteNotFound,
    respondWithInvalidNoteId,
    looksLikeAnId
);