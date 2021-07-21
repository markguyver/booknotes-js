import { Request, Router } from 'express';
import { Sequelize, FindOptions } from 'sequelize';
import {
    Author,
    BookAuthor,
    ContributionType,
    Note,
    Tag
} from '../../Database/Relational/database-sequelize';
import {
    addWhereForeignIdClauseToResourceListQueryOptions,
    extractStringParameterValueFromRequestData,
    provideFindOptionsUnmodified,
    provideFindOptionsModified,
    provideDestroyOptions
} from '../helpers';
import {
    SubmittedBookCandidate,
    extractBookIdFromRequestData,
    fetchAllBooks,
    fetchBookById,
    createBookRecord,
    deleteBookRecord
} from '../Models/booksModel';
import { respondInvalidAuthorId, extractAuthorIdFromRequestData } from '../Models/authorsModel';
import { createBookAuthorContributionAndRespond } from '../Models/bookAuthorsModel';
import { respondInvalidTagId, extractTagIdFromRequestData } from '../Models/tagsModel';

// Prepare Resource-Specific Variables
const listBooksWithNoteCountQueryOptions: FindOptions = {
    attributes: [
        'id',
        'title',
        'deleted_at',
        [Sequelize.fn('COUNT', Sequelize.col('Notes.book_id')), 'noteCount'],
    ],
    group: [
        'id',
        'title',
        'deleted_at',
        'Tags.id',
        'Tags.tag',
        'Tags.deleted_at',
    ],
    order: [['title', 'ASC']],
    paranoid: false,
    include: [{
        model: Note,
        required: false,
        paranoid: false,
        attributes: [],
    }, {
        model: Tag,
        required: false,
        paranoid: true,
        attributes: ['id', 'tag', 'deleted_at'],
    }],
};
const displayBookQueryOptions: FindOptions = {
    paranoid: false,
    include: [{
        model: Note,
        required: false,
    },{
        model: BookAuthor,
        required: false,
        include: [{
            model: Author,
            required: true,
            paranoid: true,
        },{
            model: ContributionType,
            required: false,
        }],
    },{
        model: Tag,
        required: false,
        paranoid: true,
    }],
    order: [[Note, 'id', 'desc'], [BookAuthor, Author, 'id', 'asc'], [BookAuthor, ContributionType, 'name', 'asc']],
};
const listBooksByAuthorIdQueryOptions: FindOptions = {
    order: [['title', 'ASC']],
    paranoid: false,
    include: [{
        model: BookAuthor,
        required: true,
        include: [{
            model: ContributionType,
            required: false,
        }]
    }],
};
const listBooksByTagIdQueryOptions: FindOptions = {
    order: [['title', 'ASC']],
    paranoid: false,
    include: [{
        model: Tag,
        required: true,
    }],
};

// Prepare Resource-Specific Data Handler Methods
const extractNewBookFromRequestData = (request: Request): SubmittedBookCandidate => ({ title: extractStringParameterValueFromRequestData('title', request) });
const addWhereAuthorIdClauseToBookListQueryOptions = addWhereForeignIdClauseToResourceListQueryOptions(
    BookAuthor,
    extractAuthorIdFromRequestData,
    respondInvalidAuthorId,
    'author_id' // BookAuthors.author_id
);
const addWhereTagIdClauseToBookListQueryOptions = addWhereForeignIdClauseToResourceListQueryOptions(
    Tag,
    extractTagIdFromRequestData,
    respondInvalidTagId,
    'id' // Tags.id
);

// Prepare Resource-Specific ORM Methods
const fetchBookByIdFromRequestData = fetchBookById(extractBookIdFromRequestData);
const createBookRecordFromRequestData = createBookRecord(extractNewBookFromRequestData);
const deleteBookRecordFromRequestData = deleteBookRecord(extractBookIdFromRequestData, provideDestroyOptions('id', false));

// Define Endpoint Handlers
const listAllBooks = fetchAllBooks(provideFindOptionsUnmodified(listBooksWithNoteCountQueryOptions));
const displayBookById = fetchBookByIdFromRequestData(displayBookQueryOptions);
const listBooksByAuthorIdFromRequestData = fetchAllBooks(
    provideFindOptionsModified(
        listBooksByAuthorIdQueryOptions,
        addWhereAuthorIdClauseToBookListQueryOptions
    )
);
const listBooksByTagIdFromRequestData = fetchAllBooks(
    provideFindOptionsModified(
        listBooksByTagIdQueryOptions,
        addWhereTagIdClauseToBookListQueryOptions
    )
);

// Register Resource Routes
export const booksRoutes = Router();
booksRoutes.get('/', listAllBooks);
booksRoutes.post('/', createBookRecordFromRequestData);
booksRoutes.get('/author/:authorId', listBooksByAuthorIdFromRequestData);
booksRoutes.get('/tag/:tagId', listBooksByTagIdFromRequestData);

export const bookRoutes = Router();
bookRoutes.get('/:bookId', displayBookById);
bookRoutes.delete('/:bookId', deleteBookRecordFromRequestData);
bookRoutes.put('/:bookId/author/:authorId', createBookAuthorContributionAndRespond);
// TODO: Remove Tag From Book Endpoint
// TODO: Add Tag To Book Endpoint
// TODO: Remove Author (and ContributionType) From Book Endpoint