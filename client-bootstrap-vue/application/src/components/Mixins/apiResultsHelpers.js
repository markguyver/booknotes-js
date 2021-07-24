import axios from 'axios';
import { List, Map } from 'immutable';
import { compose, curry } from 'ramda';

// API URL Variables
const API_HOST = process.env.VUE_APP_API_HOST || '/';
const API_PORT = process.env.VUE_APP_API_PORT || 5000;
const API_PROTOCOL = process.env.VUE_APP_API_PROTOCOL || 'http';

// API URL Helper Methods
const getApiBaseUrl = () => API_PROTOCOL + '://' + API_HOST + ':' + API_PORT;
const getFullApiUrl = apiEndpointUrl => getApiBaseUrl() + ('/' == apiEndpointUrl.substring(0,1) ? '' : '/') + apiEndpointUrl;

// API Response Payload Helpers
const getImmutableApiResults = curry((resultResourceType, apiResults) => List(apiResults.data[resultResourceType].map(Map)));
const getFirstResult = resultList => resultList.first();

// Authors API Helpers
const getImmutableAuthorResults = getImmutableApiResults('Authors');
const getImmutableFirstAuthorResult = compose(getFirstResult, getImmutableAuthorResults);
const getAllAuthors = () => axios.get(getFullApiUrl('/authors')).then(getImmutableAuthorResults);
const getAuthorById = authorId => axios.get(getFullApiUrl('/author/' + authorId)).then(getImmutableFirstAuthorResult);
const postNewAuthor = newAuthorData => axios.post(getFullApiUrl('/authors'), newAuthorData);
const putAuthorTagById = (authorId, tagId) => axios.put(getFullApiUrl('/author/' + authorId + '/tag/' + tagId)).then(getImmutableFirstAuthorResult);
const deleteAuthorTagById = (authorId, tagId) => axios.delete(getFullApiUrl('/author/' + authorId + '/tag/' + tagId));
const searchAuthors = searchQuery => axios.get(getFullApiUrl('/search/authors?query=' + searchQuery.trim())).then(getImmutableAuthorResults);

// Books API Helpers
const getImmutableBookResults = getImmutableApiResults('Books');
const getImmutableFirstBookResult = compose(getFirstResult, getImmutableBookResults);
const getAllBooks = () => axios.get(getFullApiUrl('/books')).then(getImmutableBookResults);
const getBookById = bookId => axios.get(getFullApiUrl('/book/' + bookId)).then(getImmutableFirstBookResult);
const postNewBook = newBookData => axios.post(getFullApiUrl('/books'), newBookData);
const putBookTagById = (bookId, tagId) => axios.put(getFullApiUrl('/book/' + bookId + '/tag/' + tagId)).then(getImmutableFirstBookResult);
const deleteBookTagById = (bookId, tagId) => axios.delete(getFullApiUrl('/book/' + bookId + '/tag/' + tagId));
const searchBooks = searchQuery => axios.get(getFullApiUrl('/search/books?query=' + searchQuery.trim())).then(getImmutableBookResults);

// Book Authors Contribution Helpers
const putNewBookAuthorContribution = (authorId, bookId, contributionTypeId) => axios.put(getFullApiUrl('/author/' + authorId + '/book/' + bookId), { contributionTypeId });

// Contribution Types API Helpers
const getImmutableContributionTypeResults = getImmutableApiResults('ContributionTypes');
const getAllContributionTypes = () => axios.get(getFullApiUrl('/contribution-types')).then(getImmutableContributionTypeResults);

// Notes API Helpers
const getImmutableNoteResults = getImmutableApiResults('Notes');
const getImmutableFirstNoteResult = compose(getFirstResult, getImmutableNoteResults);
const getNotesByBookId = bookId => axios.get(getFullApiUrl('/notes/book/' + bookId)).then(getImmutableNoteResults);
const getNoteById = noteId => axios.get(getFullApiUrl('/note/' + noteId)).then(getImmutableFirstNoteResult);
const deleteNoteById = noteId => axios.delete(getFullApiUrl('/note/' + noteId));
const postNewNoteByBookId = (bookId, newNoteData) => axios.post(getFullApiUrl('/notes/book/' + bookId), { note: newNoteData, book_id: bookId });

// Tags API Helpers
const getImmutableTagResults = getImmutableApiResults('Tags');
const getImmutableFirstTagResult = compose(getFirstResult, getImmutableTagResults);
const getAllTags = () => axios.get(getFullApiUrl('/tags')).then(getImmutableTagResults);
const getTagById = tagId => axios.get(getFullApiUrl('/tag/' + tagId)).then(getImmutableFirstTagResult);
const postNewTag = newTagData => axios.post(getFullApiUrl('/tags'), newTagData);
const searchTags = searchQuery => axios.get(getFullApiUrl('/search/tags?query=' + searchQuery.trim())).then(getImmutableTagResults);
const putTagToAuthor = (tagId, authorId) => axios.put(getFullApiUrl('/author/' + authorId + '/tag/' + tagId));
const putTagToBook = (tagId, bookId) => axios.put(getFullApiUrl('/book/' + bookId + '/tag/' + tagId));

// Validation Helpers
const validateIdValue = idValueToValidate => {
    const idValueAsInteger = parseInt(idValueToValidate);
    if (!isNaN(idValueAsInteger)) { // Verify ID is Integer
        if (idValueAsInteger > 0) { // Verify ID is Greater-Than Zero
            return idValueAsInteger;
        } // End of Verify ID is Greater-Than Zero
    } // End of Verify ID is Integer
    return false;
};

// Browse Resource Sidebar Helpers
const filterDeleted = item => !item.get('deleted_at');
const filterNull = item => null != item;

export default {
    methods: {
        getFullApiUrl,

        getAllAuthors,
        getAuthorById,
        postNewAuthor,
        putAuthorTagById,
        deleteAuthorTagById,
        searchAuthors,

        getAllBooks,
        getBookById,
        postNewBook,
        putBookTagById,
        deleteBookTagById,
        searchBooks,

        getAllContributionTypes,

        putNewBookAuthorContribution,

        getNotesByBookId,
        getNoteById,
        deleteNoteById,
        postNewNoteByBookId,

        getAllTags,
        getTagById,
        postNewTag,
        searchTags,
        putTagToAuthor,
        putTagToBook,

        filterDeleted,
        filterNull,

        validateIdValue,
    },
};