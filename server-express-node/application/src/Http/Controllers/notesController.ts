import { Request, Router } from 'express';
import { FindOptions } from 'sequelize';
import { sequelizeInstance } from '../../Database/Relational/database-sequelize';
import { extractStringParameterValueFromRequestData, provideDestroyOptions } from '../helpers';
import {
    SubmittedNoteCandidate,
    extractNoteIdFromRequestData,
    fetchNoteById,
    fetchNoteByBookId,
    createNoteRecord,
    deleteNoteRecord
} from '../Models/notesModel';
import { extractBookIdFromRequestData } from '../Models/booksModel';

// Initialize Database Models
const Book = sequelizeInstance.models.Book;

// Prepare Resource-Specific Variables
const listNotesQueryOptions: FindOptions = { order: [['id', 'desc']] };
const displayNoteQueryOptions: FindOptions = {
    include: [{
        model: Book,
        required: true,
        paranoid: false,
    }],
};

// Prepare Resource-Specific Data Handler Methods
const extractNewNoteFromRequestData = (request: Request): SubmittedNoteCandidate => ({
    note: extractStringParameterValueFromRequestData('note', request),
    book_id: extractBookIdFromRequestData(request),
});

// Prepare Resource-Specific ORM Methods
const fetchNoteByIdFromRequestData = fetchNoteById(extractNoteIdFromRequestData);
const fetchNotesByBookIdFromRequestData = fetchNoteByBookId(extractBookIdFromRequestData);
const createNoteRecordFromRequestData = createNoteRecord(extractNewNoteFromRequestData);
const deleteNoteRecordFromRequestData = deleteNoteRecord(
    extractNoteIdFromRequestData,
    provideDestroyOptions('id', false)
);

// Define Endpoint Handlers
const displayNoteById = fetchNoteByIdFromRequestData(displayNoteQueryOptions);
const listAllNotesByBookId = fetchNotesByBookIdFromRequestData(listNotesQueryOptions);

// Register Resource Routes
export const notesRoutes = Router();
notesRoutes.get('/book/:bookId', listAllNotesByBookId);
notesRoutes.post('/book/:bookId', createNoteRecordFromRequestData);

export const noteRoutes = Router();
noteRoutes.get('/:noteId', displayNoteById);
noteRoutes.delete('/:noteId', deleteNoteRecordFromRequestData);