import { Request, Router } from 'express';
import { Map } from 'immutable';
import { Sequelize, FindOptions } from 'sequelize';
import { sequelizeInstance } from '../../Database/Relational/database-sequelize';
import {
    addWhereForeignIdClauseToResourceListQueryOptions,
    removeEmptyValuesAsStrings,
    extractIntParameterValueFromRequestData,
    extractStringParameterValueFromRequestData,
    provideFindOptionsUnmodified,
    provideFindOptionsModified,
    provideDestroyOptions
} from '../helpers';
import {
    SubmittedAuthorCandidate,
    extractAuthorIdFromRequestData,
    fetchAllAuthors,
    fetchAuthorById,
    createAuthorRecord,
    deleteAuthorRecord
} from '../Models/authorsModel';
import { respondInvalidBookId, extractBookIdFromRequestData } from '../Models/booksModel';
import { createBookAuthorContributionAndRespond } from '../Models/bookAuthorsModel';
import { respondInvalidTagId, extractTagIdFromRequestData } from '../Models/tagsModel';

// Initialize Database Models
const Author = sequelizeInstance.models.Author;
const BookAuthor = sequelizeInstance.models.BookAuthor;
const Book = sequelizeInstance.models.Book;
const ContributionType = sequelizeInstance.models.ContributionType;
const Tag = sequelizeInstance.models.Tag;

// Prepare Resource-Specific Variables
const listAuthorsWithBookCountQueryOptions: FindOptions = {
    attributes: [
        'id',
        'first_name',
        'middle_name',
        'last_name',
        'parent_author_id',
        'deleted_at',
        [Sequelize.fn('COUNT', Sequelize.col('BookAuthors.author_id')), 'bookCount'],
    ],
    group: [
        'id',
        'first_name',
        'middle_name',
        'last_name',
        'parent_author_id',
        'deleted_at',
        'Tags.id',
        'Tags.tag',
    ],
    order: [['last_name', 'ASC'], ['first_name', 'ASC'], ['middle_name', 'ASC']],
    paranoid: false,
    include: [{
        model: BookAuthor,
        required: false,
        attributes: [],
        include: [{
            model: Book,
            required: true,
            paranoid: true,
        }],
    },{
        model: Tag,
        required: false,
        paranoid: true,
    }],
};
const displayAuthorQueryOptions: FindOptions = {
    paranoid: false,
    include: [{
        model: Author,
        required: false,
        as: 'ActualAuthor',
        paranoid: false,
    },{
        model: Author,
        required: false,
        as: 'Pseudonym',
        paranoid: false,
    },{
        model: BookAuthor,
        required: false,
        include: [{
            model: Book,
            required: true,
            paranoid: true,
        },{
            model: ContributionType,
            required: true,
        }],
    },{
        model: Tag,
        required: false,
        paranoid: true,
    }],
};
const listAuthorsByBookIdQueryOptions: FindOptions = {
    order: [['last_name', 'ASC'], ['first_name', 'ASC'], ['middle_name', 'ASC']],
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
const listAuthorsByTagIdQueryOptions: FindOptions = {
    order: [['last_name', 'ASC'], ['first_name', 'ASC'], ['middle_name', 'ASC']],
    paranoid: false,
    include: [{
        model: Tag,
        required: true,
    }],
};

// Prepare Resource-Specific Data Handler Methods
const extractNewAuthorFromRequestData = (request: Request): SubmittedAuthorCandidate => Map({
    first_name:         extractStringParameterValueFromRequestData('first_name', request),
    middle_name:        extractStringParameterValueFromRequestData('middle_name', request),
    last_name:          extractStringParameterValueFromRequestData('last_name', request),
    parent_author_id:   extractIntParameterValueFromRequestData('parent_author_id', request),
}).filter(removeEmptyValuesAsStrings).toJSON();
const addWhereBookIdClauseToAuthorListQueryOptions = addWhereForeignIdClauseToResourceListQueryOptions(
    BookAuthor,
    extractBookIdFromRequestData,
    respondInvalidBookId,
    'book_id' // BookAuthors.book_id
);
const addWhereTagIdClauseToAuthorListQueryOptions = addWhereForeignIdClauseToResourceListQueryOptions(
    Tag,
    extractTagIdFromRequestData,
    respondInvalidTagId,
    'id' // Tags.id
);

// Prepare Resource-Specific ORM Methods
const fetchAuthorByIdFromRequestData = fetchAuthorById(extractAuthorIdFromRequestData);
const createAuthorRecordFromRequestData = createAuthorRecord(extractNewAuthorFromRequestData);
const deleteAuthorRecordFromRequestData = deleteAuthorRecord(
    extractAuthorIdFromRequestData,
    provideDestroyOptions('id', false)
);

// Define Endpoint Handlers
const listAllAuthors = fetchAllAuthors(
    provideFindOptionsUnmodified(listAuthorsWithBookCountQueryOptions)
);
const displayAuthorById = fetchAuthorByIdFromRequestData(displayAuthorQueryOptions);
const listAuthorsByBookIdFromRequestData = fetchAllAuthors(
    provideFindOptionsModified(
        listAuthorsByBookIdQueryOptions,
        addWhereBookIdClauseToAuthorListQueryOptions
    )
);
const listAuthorsByTagIdFromRequestData = fetchAllAuthors(
    provideFindOptionsModified(
        listAuthorsByTagIdQueryOptions,
        addWhereTagIdClauseToAuthorListQueryOptions
    )
);

// Register Resource Routes
export const authorsRoutes = Router();
authorsRoutes.get('/', listAllAuthors);
authorsRoutes.post('/', createAuthorRecordFromRequestData);
authorsRoutes.get('/book/:bookId', listAuthorsByBookIdFromRequestData);
authorsRoutes.get('/tag/:tagId', listAuthorsByTagIdFromRequestData);

export const authorRoutes = Router();
authorRoutes.get('/:authorId', displayAuthorById);
authorRoutes.delete('/:authorId', deleteAuthorRecordFromRequestData);
authorRoutes.put('/:authorId/book/:bookId', createBookAuthorContributionAndRespond);
// TODO: Remove Tag From Author Endpoint
// TODO: Add Tag To Author Endpoint
// TODO: Remove Book (and ContributionType) From Author Endpoint