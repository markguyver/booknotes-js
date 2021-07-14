import { Request, Router } from 'express';
import { FindOptions } from 'sequelize';
import { sequelizeInstance } from '../../Database/Relational/database-sequelize';
import {
    addWhereForeignIdClauseToResourceListQueryOptions,
    extractStringParameterValueFromRequestData,
    provideFindOptionsUnmodified,
    provideFindOptionsModified,
    findAllAndRespond
} from '../helpers';
import {
    ContributionTypeObject,
    respondWithContributionTypesPayload,
    extractContributionTypeIdFromRequestData,
    fetchContributionTypeById,
    createContributionTypeRecord
} from '../Models/contributionTypesModel';
import { respondInvalidAuthorId, extractAuthorIdFromRequestData } from '../Models/authorsModel';
import { respondInvalidBookId, extractBookIdFromRequestData } from '../Models/booksModel';

// Initialize Database Models
const BookAuthor = sequelizeInstance.models.BookAuthor;
const ContributionType = sequelizeInstance.models.ContributionType;

// Prepare Resource-Specific Variables
const listContributionTypesWithAuthorAndBookCountsQueryOptions: FindOptions = {
    order: [['name', 'ASC']],    
};
const displayContributionTypeQueryOptions: FindOptions = {};
const listContributionTypesByAuthorIdQueryOptions: FindOptions = {
    order: [['name', 'ASC']],
    include: [{
        model: BookAuthor,
        required: true,
    }],
};
const listContributionTypesByBookIdQueryOptions: FindOptions = {
    order: [['name', 'ASC']],
    include: [{
        model: BookAuthor,
        required: true,
    }],
};

// Prepare Resource-Specific Data Handler Methods
const extractNewContributionTypeFromRequestData = (request: Request): ContributionTypeObject => ({ name: extractStringParameterValueFromRequestData('name', request) });
const addWhereAuthorIdClauseToContributionTypesListQueryOptions = addWhereForeignIdClauseToResourceListQueryOptions(
    BookAuthor,
    extractAuthorIdFromRequestData,
    respondInvalidAuthorId,
    'author_id' // BookAuthors.author_id
);
const addWhereBookIdClauseToContributionTypesListQueryOptions = addWhereForeignIdClauseToResourceListQueryOptions(
    BookAuthor,
    extractBookIdFromRequestData,
    respondInvalidBookId,
    'book_id' // BookAuthors.book_id
);

// Prepare Resource-Specific ORM Methods
const fetchAllContributionTypes = findAllAndRespond(ContributionType, respondWithContributionTypesPayload);
const fetchContributionTypeByIdFromRequestData = fetchContributionTypeById(extractContributionTypeIdFromRequestData);
const createContributionTypeRecordFromRequestData = createContributionTypeRecord(extractNewContributionTypeFromRequestData);

// Define Endpoint Handlers
const listAllContributionTypes = fetchAllContributionTypes(
    provideFindOptionsUnmodified(listContributionTypesWithAuthorAndBookCountsQueryOptions)
);
const displayContributionTypeById = fetchContributionTypeByIdFromRequestData(displayContributionTypeQueryOptions);
const listContributionTypesByAuthorIdFromRequestData = fetchAllContributionTypes(
    provideFindOptionsModified(
        listContributionTypesByAuthorIdQueryOptions,
        addWhereAuthorIdClauseToContributionTypesListQueryOptions
    )
);
const listContributionTypesByBookIdFromRequestData = fetchAllContributionTypes(
    provideFindOptionsModified(
        listContributionTypesByBookIdQueryOptions,
        addWhereBookIdClauseToContributionTypesListQueryOptions
    )
);

// Register Resource Routes
export const contributionTypesRoutes = Router();
contributionTypesRoutes.get('/', listAllContributionTypes);
contributionTypesRoutes.post('/', createContributionTypeRecordFromRequestData);
contributionTypesRoutes.get('/author/:authorId', listContributionTypesByAuthorIdFromRequestData);
contributionTypesRoutes.get('/book/:bookId', listContributionTypesByBookIdFromRequestData);

export const contributionTypeRoutes = Router();
contributionTypeRoutes.get('/:contributionTypeId', displayContributionTypeById);