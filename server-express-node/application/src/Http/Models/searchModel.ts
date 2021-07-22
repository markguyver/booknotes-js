import { Request, Response } from 'express';
import { curry } from 'ramda';
import { FindOptions } from 'sequelize';
import { extractStringQueryValueFromRequestData } from '../helpers';
import { insertWhereLikeFuzzyQueryOptionsAsFindOptions } from '../../Database/Relational/database-sequelize';

// Prepare Resource-Specific Response Handler Methods

// Prepare Resource-Specific Data Handler Methods
const extractSearchQueryFromRequest = extractStringQueryValueFromRequestData('query');
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