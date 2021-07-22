import { Request, Response } from 'express';
import { curry } from 'ramda';
import { FindOptions } from 'sequelize';
import { extractStringQueryValueFromRequestData } from '../helpers';
import {
    insertWhereLikeFuzzyQueryOptionsAsFindOptions,
    insertListOfOrWhereLikeFuzzyQueryOptionsAsFindOptions
} from '../../Database/Relational/database-sequelize';

// Prepare Resource-Specific Response Handler Methods

// Prepare Resource-Specific Data Handler Methods
const extractSearchQueryFromRequest = extractStringQueryValueFromRequestData('query');
export const searchAuthorsQueryOptionsProvider = curry((
    queryOptionsToModify: FindOptions,
    request: Request
): FindOptions => insertListOfOrWhereLikeFuzzyQueryOptionsAsFindOptions(
    ['last_name', 'first_name', 'middle_name'],
    extractSearchQueryFromRequest(request),
    queryOptionsToModify
));
export const searchBooksQueryOptionsProvider = curry((
    queryOptionsToModify: FindOptions,
    request: Request
): FindOptions => insertWhereLikeFuzzyQueryOptionsAsFindOptions(
    'title',
    extractSearchQueryFromRequest(request),
    queryOptionsToModify
));
export const searchTagsQueryOptionsProvider = curry((
    queryOptionsToModify: FindOptions,
    request: Request
): FindOptions => insertWhereLikeFuzzyQueryOptionsAsFindOptions(
    'tag',
    extractSearchQueryFromRequest(request),
    queryOptionsToModify
));

// Prepare Resource-Specific ORM Methods
export const debugEndpoint = (request: Request, response: Response): Response => response.send({ 'query': extractSearchQueryFromRequest(request) });