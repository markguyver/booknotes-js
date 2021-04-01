import { Request, Router } from 'express';
import { FindOptions } from 'sequelize';
import { sequelizeInstance } from '../../database';
import { extractStringParameterValueFromRequestData } from '../helpers';
import {
    NoteObject,
    extractNoteIdFromRequestData,
    fetchNoteById,
    createNoteRecord
} from '../Models/notesModel';
import { respondInvalidBookId, extractBookIdFromRequestData } from '../Models/booksModel';

// Initialize Database Models
const Notes = sequelizeInstance.models.Notes;

// Prepare Resource-Specific Variables
const listNotesQueryOptions: FindOptions = {};
const displayNoteQueryOptions: FindOptions = {};

// Prepare Resource-Specific Data Handler Methods
const extractNewNoteFromRequestData = (request: Request): NoteObject => ({ note: extractStringParameterValueFromRequestData('note', request) });

// Prepare Resource-Specific ORM Methods
const fetchNoteByIdFromRequestData = fetchNoteById(extractNoteIdFromRequestData);
// TODO: Replace fetchNotesByBookId() => fetchAllNotes = fetchAllAndRespond(Notes, respondWithNotesPayload); fetchAllNotes(listNotesQueryOptions, provideFindOptionsModified(addWhereBookIdClauseToNoteListQueryOptions));
// export const fetchNotesByBookId = FindAllByFKAndRespond(Notes, respondWithNotesPayload, respondInvalidBookId, 'book_id', looksLikeAnId);
// const fetchNotesByBookIdFromRequestData = fetchNotesByBookId(extractBookIdFromRequestData);
const createNoteRecordFromRequestData = createNoteRecord(extractNewNoteFromRequestData);

// Define Endpoint Handlers
const displayNoteById = fetchNoteByIdFromRequestData(displayNoteQueryOptions);
// const listAllNotesByBookId = fetchNotesByBookIdFromRequestData(listNotesQueryOptions);

// Register Resource Routes
export const notesRoutes = Router();
// notesRoutes.get('/book/:bookId', listAllNotesByBookId);
notesRoutes.post('/book/:bookId', createNoteRecordFromRequestData);

export const noteRoutes = Router();
noteRoutes.get('/:noteId', displayNoteById);