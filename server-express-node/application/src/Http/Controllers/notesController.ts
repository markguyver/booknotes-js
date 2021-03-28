import { Request, Response, Router } from 'express';
import { FindOptions } from 'sequelize';
import { sequelizeInstance } from '../../database';
import {
    validationResponseBaseFail,
    validationResponseBaseSuccess,
    validationResponse,
    looksLikeAnId,
    isNonEmptyString,
    respondWith400,
    respondWith500,
    respondWithResourceList,
    respondWithResourceNotFound,
    respondInvalidResourceId,
    extractIntParameterValueFromRequestData,
    extractStringParameterValueFromRequestData,
    findByPKAndRespond,
    FindAllByFKAndRespond,
    createAndRespond
} from '../helpers';
import { respondInvalidBookId, extractBookIdFromRequestData } from './booksController';

// Types
interface NoteObject {
    id?:    number | undefined;
    note?:   string;
};

// Initialize Database Models
const Books = sequelizeInstance.models.Books;
const Notes = sequelizeInstance.models.Notes;

// Prepare Resource-Specific Variables
const listNotesQueryOptions: FindOptions = {};
const displayNoteQueryOptions: FindOptions = {};

// Prepare Resource-Specific Data Handler Methods
export const extractNoteIdFromRequestData = (request: Request): number => extractIntParameterValueFromRequestData('note_id', request) || extractIntParameterValueFromRequestData('noteId', request);
const extractNewNoteFromRequestData = (request: Request): NoteObject => ({ note: extractStringParameterValueFromRequestData('note', request) });
export const validateExtractedNote = (extractedNote: NoteObject): validationResponse => {
    if (false == isNonEmptyString(extractedNote.note).boolean) { // Verify Note (required) Parameter Is Set
        return validationResponseBaseFail('Missing (required) note');
    } // End of Verify Note (required) Parameter Is Set
    return validationResponseBaseSuccess();
};

// Prepare Resource-Specific Response Handler Methods
export const respondWithNotesPayload = respondWithResourceList('Notes');
export const respondWithNoteNotFound = respondWithResourceNotFound('Note');
export const respondWithNotesNotFound = respondWithResourceNotFound('Notes');
export const respondWithInvalidNoteId = respondInvalidResourceId('Note');

// Prepare Resource-Specific ORM Methods
export const fetchNoteById = findByPKAndRespond(Notes, respondWithNotesPayload, respondWithNoteNotFound, respondWithInvalidNoteId, looksLikeAnId);
const fetchNoteByIdFromRequestData = fetchNoteById(extractNoteIdFromRequestData);
export const fetchNotesByBookId = FindAllByFKAndRespond(Notes, respondWithNotesPayload, respondInvalidBookId, 'book_id', looksLikeAnId);
const fetchNotesByBookIdFromRequestData = fetchNotesByBookId(extractBookIdFromRequestData);
export const createNoteRecord = createAndRespond(
    Notes,
    respondWith400,
    respondWith500,
    respondWithNotesPayload,
    validateExtractedNote
);
const createNoteRecordFromRequestData = createNoteRecord(extractNewNoteFromRequestData);

// Define Endpoint Handlers
const displayNoteById = fetchNoteByIdFromRequestData(displayNoteQueryOptions);
const listAllNotesByBookId = fetchNotesByBookIdFromRequestData(listNotesQueryOptions);

// Register Resource Routes
export const notesRoutes = Router();
notesRoutes.get('/book/:bookId', listAllNotesByBookId);
notesRoutes.post('/book/:bookId', createNoteRecordFromRequestData);

export const noteRoutes = Router();
noteRoutes.get('/:noteId', displayNoteById);