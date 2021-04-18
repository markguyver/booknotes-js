import { Request, Router } from 'express';
import { Sequelize, FindOptions } from 'sequelize';
import { sequelizeInstance } from '../../Database/Relational/database-sequelize';
import {
    addWhereForeignIdClauseToResourceListQueryOptions,
    extractStringParameterValueFromRequestData,
    provideFindOptionsUnmodified,
    provideFindOptionsModified
} from '../helpers';
import {
    BookObject,
    extractBookIdFromRequestData,
    fetchAllBooks,
    fetchBookById,
    createBookRecord
} from '../Models/booksModel';
import { respondInvalidAuthorId, extractAuthorIdFromRequestData } from '../Models/authorsModel';
import { respondInvalidTagId, extractTagIdFromRequestData } from '../Models/tagsModel';

// Initialize Database Models
const Authors = sequelizeInstance.models.Authors;
const BookAuthors = sequelizeInstance.models.BookAuthors;
const ContributionTypes = sequelizeInstance.models.ContributionTypes;
const Notes = sequelizeInstance.models.Notes;
const Tags = sequelizeInstance.models.Tags;

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
        model: Notes,
        required: false,
        paranoid: false,
        attributes: [],
    }, {
        model: Tags,
        required: false,
        paranoid: false,
        attributes: ['id', 'tag', 'deleted_at'],
    }],
};
const displayBookQueryOptions: FindOptions = {
    paranoid: false,
    include: [{
        model: Notes,
        required: false,
    },{
        model: BookAuthors,
        required: false,
        include: [{
            model: Authors,
            required: false,
            paranoid: false,
        },{
            model: ContributionTypes,
            required: false,
        }],
    },{
        model: Tags,
        required: false,
    }],
};
const listBooksByAuthorIdQueryOptions: FindOptions = {
    order: [['title', 'ASC']],
    paranoid: false,
    include: [{
        model: BookAuthors,
        required: true,
        include: [{
            model: ContributionTypes,
            required: false,
        }]
    }],
};
const listBooksByTagIdQueryOptions: FindOptions = {
    order: [['title', 'ASC']],
    paranoid: false,
    include: [{
        model: Tags,
        required: true,
    }],
};

// Prepare Resource-Specific Data Handler Methods
const extractNewBookFromRequestData = (request: Request): BookObject => ({ title: extractStringParameterValueFromRequestData('title', request) });
const addWhereAuthorIdClauseToBookListQueryOptions = addWhereForeignIdClauseToResourceListQueryOptions(
    BookAuthors,
    extractAuthorIdFromRequestData,
    respondInvalidAuthorId,
    'author_id' // BookAuthors.author_id
);
const addWhereTagIdClauseToBookListQueryOptions = addWhereForeignIdClauseToResourceListQueryOptions(
    Tags,
    extractTagIdFromRequestData,
    respondInvalidTagId,
    'id' // Tags.id
);

// Prepare Resource-Specific ORM Methods
const fetchBookByIdFromRequestData = fetchBookById(extractBookIdFromRequestData);
const createBookRecordFromRequestData = createBookRecord(extractNewBookFromRequestData);

// Define Endpoint Handlers
const listAllBooks = fetchAllBooks(provideFindOptionsUnmodified(listBooksWithNoteCountQueryOptions));
const displayBookById = fetchBookByIdFromRequestData(displayBookQueryOptions);
const listBooksByAuthorIdFromRequestData = fetchAllBooks(provideFindOptionsModified(listBooksByAuthorIdQueryOptions, addWhereAuthorIdClauseToBookListQueryOptions));
const listBooksByTagIdFromRequestData = fetchAllBooks(provideFindOptionsModified(listBooksByTagIdQueryOptions, addWhereTagIdClauseToBookListQueryOptions));

// Register Resource Routes
export const booksRoutes = Router();
booksRoutes.get('/', listAllBooks);
booksRoutes.post('/', createBookRecordFromRequestData);
booksRoutes.get('/author/:authorId', listBooksByAuthorIdFromRequestData);
booksRoutes.get('/tag/:tagId', listBooksByTagIdFromRequestData);

export const bookRoutes = Router();
bookRoutes.get('/:bookId', displayBookById);