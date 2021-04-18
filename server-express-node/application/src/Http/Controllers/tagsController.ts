import { Request, Response, Router } from 'express';
import { Sequelize, FindOptions } from 'sequelize';
import { sequelizeInstance } from '../../Database/Relational/database-sequelize';
import {
    addWhereForeignIdClauseToResourceListQueryOptions,
    extractStringParameterValueFromRequestData,
    provideFindOptionsUnmodified,
    provideFindOptionsModified
} from '../helpers';
import {
    TagObject,
    extractTagIdFromRequestData,
    fetchAllTags,
    fetchTagById,
    createTagRecord
} from '../Models/tagsModel';
import { respondInvalidAuthorId, extractAuthorIdFromRequestData } from '../Models/authorsModel';
import { respondInvalidBookId, extractBookIdFromRequestData } from '../Models/booksModel';

// Initialize Database Models
const Authors = sequelizeInstance.models.Authors;
const Books = sequelizeInstance.models.Books;
const Notes = sequelizeInstance.models.Notes;
const Tags = sequelizeInstance.models.Tags;

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
        model: Authors,
        required: false,
        attributes: [],
    },{
        model: Books,
        required: false,
        attributes: [],
    },{
        model: Notes,
        required: false,
        attributes: [],
    }],
};
const displayTagWithAuthorsBooksAndNotes: FindOptions = {
    paranoid: false,
    include: [{
        model: Authors,
        required: false,
    },{
        model: Books,
        required: false,
    },{
        model: Notes,
        required: false,
        include: [{
            model: Books,
            required: false,
        }],
    }],
};
const listTagsByAuthorIdQueryOptions: FindOptions = {
    order: [['tag', 'ASC']],
    include: [{
        model: Authors,
        required: true,
        paranoid: false,
    }],
};
const listTagsByBookIdQueryOptions: FindOptions = {
    order: [['tag', 'ASC']],
    include: [{
        model: Books,
        required: true,
        paranoid: false,
    }],
};

// Prepare Resource-Specific Data Handler Methods
const extractNewTagFromRequestData = (request: Request): TagObject => ({ tag: extractStringParameterValueFromRequestData('tag', request) });
const addWhereAuthorIdClauseToTagListQueryOptions = addWhereForeignIdClauseToResourceListQueryOptions(
    Authors,
    extractAuthorIdFromRequestData,
    respondInvalidAuthorId,
    'id' // Authors.id
);
const addWhereBookIdClauseToTagListQueryOptions = addWhereForeignIdClauseToResourceListQueryOptions(
    Books,
    extractBookIdFromRequestData,
    respondInvalidBookId,
    'id' // Books.id
);

// Prepare Resource-Specific ORM Methods
const fetchTagByIdFromRequestData = fetchTagById(extractTagIdFromRequestData);
const createTagRecordFromRequestData = createTagRecord(extractNewTagFromRequestData);

// Define Endpoint Handlers
const listAllTags = fetchAllTags(provideFindOptionsUnmodified(listTagsWithAuthorBookAndNoteCountsQueryOptions));
const displayTagById = fetchTagByIdFromRequestData(displayTagWithAuthorsBooksAndNotes);
const listTagsByAuthorIdFromRequestData = fetchAllTags(provideFindOptionsModified(listTagsByAuthorIdQueryOptions, addWhereAuthorIdClauseToTagListQueryOptions));
const listTagsByBookIdFromRequestData = fetchAllTags(provideFindOptionsModified(listTagsByBookIdQueryOptions, addWhereBookIdClauseToTagListQueryOptions));

// Register Resource Routes
export const tagsRoutes = Router();
tagsRoutes.get('/', listAllTags);
tagsRoutes.post('/', createTagRecordFromRequestData);
tagsRoutes.get('/author/:authorId', listTagsByAuthorIdFromRequestData);
tagsRoutes.get('/book/:bookId', listTagsByBookIdFromRequestData);

export const tagRoutes = Router();
tagRoutes.get('/:tagId', displayTagById);