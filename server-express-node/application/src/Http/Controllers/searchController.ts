import { Router } from 'express';
import { FindOptions } from 'sequelize';
import { fetchAllAuthors } from '../Models/authorsModel';
import { fetchAllBooks } from '../Models/booksModel';
import { fetchAllTags } from '../Models/tagsModel';
import {
    searchBooksQueryOptionsProvider,
    searchTagsQueryOptionsProvider,
    debugEndpoint
} from '../Models/searchModel';

// Prepare Resource-Specific Variables
const searchAuthorsFindOptions: FindOptions = {
    paranoid: true,
    order: [['last_name', 'asc'], ['first_name', 'asc'], ['middle_name', 'asc']],
};
const searchBooksFindOptions: FindOptions = {
    paranoid: true,
    order: [['title', 'asc']],
};
const searchTagsFindOptions: FindOptions = {
    paranoid: true,
    order: [['tag', 'asc']],
};

// Define Endpoint Handlers
const searchBooksAndRespond = fetchAllBooks(searchBooksQueryOptionsProvider(searchBooksFindOptions));
const searchTagsAndRespond = fetchAllTags(searchTagsQueryOptionsProvider(searchTagsFindOptions));
// TODO: Instead of using findAllAndRespond(), should make a new helper function more like findByFkAndRespond() that extracts and validates query

// Register Resource Routes
export const searchRoutes = Router();
searchRoutes.get('/', debugEndpoint);
searchRoutes.get('/authors', debugEndpoint);
searchRoutes.get('/books', searchBooksAndRespond);
searchRoutes.get('/tags', searchTagsAndRespond);