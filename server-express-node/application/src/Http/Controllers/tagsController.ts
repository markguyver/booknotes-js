import { Request,  Router } from 'express';
import { Sequelize, FindOptions } from 'sequelize';
import { sequelizeInstance } from '../../Database/Relational/database-sequelize';
import {
    addWhereForeignIdClauseToResourceListQueryOptions,
    extractStringParameterValueFromRequestData,
    provideFindOptionsUnmodified,
    provideFindOptionsModified,
    provideDestroyOptions
} from '../helpers';
import {
    SubmittedTagCandidate,
    extractTagIdFromRequestData,
    fetchAllTags,
    fetchTagById,
    createTagRecord,
    deleteTagRecord
} from '../Models/tagsModel';
import { respondInvalidAuthorId, extractAuthorIdFromRequestData } from '../Models/authorsModel';
import { respondInvalidBookId, extractBookIdFromRequestData } from '../Models/booksModel';

// Initialize Database Models
const Author = sequelizeInstance.models.Author;
const Book = sequelizeInstance.models.Book;
const Note = sequelizeInstance.models.Note;

// Prepare Resource-Specific Variables
const listTagsWithAuthorBookAndNoteCountsQueryOptions: FindOptions = {
    attributes: [
        'id',
        'tag',
        'deleted_at',
        [Sequelize.fn('COUNT', Sequelize.col('Authors.id')), 'authorCount'],
        [Sequelize.fn('COUNT', Sequelize.col('Books.id')), 'bookCount'],
        [Sequelize.fn('COUNT', Sequelize.col('Notes.id')), 'noteCount'],
    ],
    group: ['id', 'tag', 'deleted_at'],
    order: [['tag', 'ASC']],
    paranoid: false,
    include: [{
        model: Author,
        required: false,
        attributes: [],
    },{
        model: Book,
        required: false,
        attributes: [],
    },{
        model: Note,
        required: false,
        attributes: [],
    }],
};
const displayTagWithAuthorsBooksAndNotes: FindOptions = {
    paranoid: false,
    include: [{
        model: Author,
        required: false,
        paranoid: true,
    },{
        model: Book,
        required: false,
        paranoid: true,
    },{
        model: Note,
        required: false,
        include: [{
            model: Book,
            required: true,
            paranoid: true,
        }],
    }],
};
const listTagsByAuthorIdQueryOptions: FindOptions = {
    order: [['tag', 'ASC']],
    include: [{
        model: Author,
        required: true,
        paranoid: false,
    }],
};
const listTagsByBookIdQueryOptions: FindOptions = {
    order: [['tag', 'ASC']],
    include: [{
        model: Book,
        required: true,
        paranoid: false,
    }],
};

// Prepare Resource-Specific Data Handler Methods
const extractNewTagFromRequestData = (request: Request): SubmittedTagCandidate => ({ tag: extractStringParameterValueFromRequestData('tag', request) });
const addWhereAuthorIdClauseToTagListQueryOptions = addWhereForeignIdClauseToResourceListQueryOptions(
    Author,
    extractAuthorIdFromRequestData,
    respondInvalidAuthorId,
    'id' // Author.id
);
const addWhereBookIdClauseToTagListQueryOptions = addWhereForeignIdClauseToResourceListQueryOptions(
    Book,
    extractBookIdFromRequestData,
    respondInvalidBookId,
    'id' // Book.id
);

// Prepare Resource-Specific ORM Methods
const fetchTagByIdFromRequestData = fetchTagById(extractTagIdFromRequestData);
const createTagRecordFromRequestData = createTagRecord(extractNewTagFromRequestData);
const deleteTagRecordFromRequestData = deleteTagRecord(extractTagIdFromRequestData, provideDestroyOptions('id', false));

// Define Endpoint Handlers
const listAllTags = fetchAllTags(
    provideFindOptionsUnmodified(listTagsWithAuthorBookAndNoteCountsQueryOptions)
);
const displayTagById = fetchTagByIdFromRequestData(displayTagWithAuthorsBooksAndNotes);
const listTagsByAuthorIdFromRequestData = fetchAllTags(
    provideFindOptionsModified(
        listTagsByAuthorIdQueryOptions,
        addWhereAuthorIdClauseToTagListQueryOptions
    )
);
const listTagsByBookIdFromRequestData = fetchAllTags(
    provideFindOptionsModified(
        listTagsByBookIdQueryOptions,
        addWhereBookIdClauseToTagListQueryOptions
    )
);

// Register Resource Routes
export const tagsRoutes = Router();
tagsRoutes.get('/', listAllTags);
tagsRoutes.post('/', createTagRecordFromRequestData);
tagsRoutes.get('/author/:authorId', listTagsByAuthorIdFromRequestData);
tagsRoutes.get('/book/:bookId', listTagsByBookIdFromRequestData);

export const tagRoutes = Router();
tagRoutes.get('/:tagId', displayTagById);
tagRoutes.delete('/:tagId', deleteTagRecordFromRequestData);
// TODO: Remove Author From Tag Endpoint
// TODO: Add Author To Tag Endpoint
// TODO: Remove Book From Tag Endpoint
// TODO: Add Book To Tag Endpoint