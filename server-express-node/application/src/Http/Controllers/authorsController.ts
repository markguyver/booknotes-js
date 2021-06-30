import { Request, Router } from 'express';
import { Map } from 'immutable';
import { Sequelize, FindOptions } from 'sequelize';
import { sequelizeInstance } from '../../Database/Relational/database-sequelize';
import {
    addWhereForeignIdClauseToResourceListQueryOptions,
    extractIntParameterValueFromRequestData,
    extractStringParameterValueFromRequestData,
    provideFindOptionsUnmodified,
    provideFindOptionsModified
} from '../helpers';
import {
    AuthorObject,
    extractAuthorIdFromRequestData,
    fetchAllAuthors,
    fetchAuthorById,
    createAuthorRecord
} from '../Models/authorsModel';
import { respondInvalidBookId, extractBookIdFromRequestData } from '../Models/booksModel';
import { respondInvalidTagId, extractTagIdFromRequestData } from '../Models/tagsModel';

// Initialize Database Models
const Authors = sequelizeInstance.models.Authors;
const BookAuthors = sequelizeInstance.models.BookAuthors;
const Books = sequelizeInstance.models.Books;
const ContributionTypes = sequelizeInstance.models.ContributionTypes;
const Tags = sequelizeInstance.models.Tags;

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
        model: BookAuthors,
        required: false,
        attributes: [],
    },{
        model: Tags,
        required: false,
    }],
};
const displayAuthorQueryOptions: FindOptions = {
    paranoid: false,
    include: [{
        model: Authors,
        required: false,
        as: 'ActualAuthor',
        paranoid: false,
    },{
        model: Authors,
        required: false,
        as: 'Pseudonyms',
        paranoid: false,
    },{
        model: BookAuthors,
        required: false,
        include: [{
            model: Books,
            required: false,
            paranoid: false,
        },{
            model: ContributionTypes,
            required: false,
        }],
    },{
        model: Tags,
        required: false,
        paranoid: false,
    }],
};
const listAuthorsByBookIdQueryOptions: FindOptions = {
    order: [['last_name', 'ASC'], ['first_name', 'ASC'], ['middle_name', 'ASC']],
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
const listAuthorsByTagIdQueryOptions: FindOptions = {
    order: [['last_name', 'ASC'], ['first_name', 'ASC'], ['middle_name', 'ASC']],
    paranoid: false,
    include: [{
        model: Tags,
        required: true,
    }],
};

// Prepare Resource-Specific Data Handler Methods
const extractNewAuthorFromRequestData = (request: Request): AuthorObject => Map({
    first_name:         extractStringParameterValueFromRequestData('first_name', request),
    middle_name:        extractStringParameterValueFromRequestData('middle_name', request),
    last_name:          extractStringParameterValueFromRequestData('last_name', request),
    parent_author_id:   extractIntParameterValueFromRequestData('parent_author_id', request),
}).filter(value => -1 == ['', 'null', 'NaN'].indexOf(String(value).toString())).toJSON();
const addWhereBookIdClauseToAuthorListQueryOptions = addWhereForeignIdClauseToResourceListQueryOptions(
    BookAuthors,
    extractBookIdFromRequestData,
    respondInvalidBookId,
    'book_id' // BookAuthors.book_id
);
const addWhereTagIdClauseToAuthorListQueryOptions = addWhereForeignIdClauseToResourceListQueryOptions(
    Tags,
    extractTagIdFromRequestData,
    respondInvalidTagId,
    'id' // Tags.id
);

// Prepare Resource-Specific ORM Methods
const fetchAuthorByIdFromRequestData = fetchAuthorById(extractAuthorIdFromRequestData);
const createAuthorRecordFromRequestData = createAuthorRecord(extractNewAuthorFromRequestData);

// Define Endpoint Handlers
const listAllAuthors = fetchAllAuthors(provideFindOptionsUnmodified(listAuthorsWithBookCountQueryOptions));
const displayAuthorById = fetchAuthorByIdFromRequestData(displayAuthorQueryOptions);
const listAuthorsByBookIdFromRequestData = fetchAllAuthors(provideFindOptionsModified(listAuthorsByBookIdQueryOptions, addWhereBookIdClauseToAuthorListQueryOptions));
const listAuthorsByTagIdFromRequestData = fetchAllAuthors(provideFindOptionsModified(listAuthorsByTagIdQueryOptions, addWhereTagIdClauseToAuthorListQueryOptions));

// Register Resource Routes
export const authorsRoutes = Router();
authorsRoutes.get('/', listAllAuthors);
authorsRoutes.post('/', createAuthorRecordFromRequestData);
authorsRoutes.get('/book/:bookId', listAuthorsByBookIdFromRequestData);
authorsRoutes.get('/tag/:tagId', listAuthorsByTagIdFromRequestData);

export const authorRoutes = Router();
authorRoutes.get('/:authorId', displayAuthorById);