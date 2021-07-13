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
const patchAuthorTagById = (authorId, tagId) => axios.patch(getFullApiUrl('/author/' + authorId + '/tag/' + tagId)).then(getImmutableFirstAuthorResult);
const deleteAuthorTagById = (authorId, tagId) => axios.delete(getFullApiUrl('/author/' + authorId + '/tag/' + tagId)).then(getImmutableFirstAuthorResult);

// Books API Helpers
const getImmutableBookResults = getImmutableApiResults('Books');
const getImmutableFirstBookResult = compose(getFirstResult, getImmutableBookResults);
const getAllBooks = () => axios.get(getFullApiUrl('/books')).then(getImmutableBookResults);
const getBookById = bookId => axios.get(getFullApiUrl('/book/' + bookId)).then(getImmutableFirstBookResult);
const patchBookTagById = (bookId, tagId) => axios.patch(getFullApiUrl('/book/' + bookId + '/tag/' + tagId)).then(getImmutableFirstBookResult);
const deleteBookTagById = (bookId, tagId) => axios.delete(getFullApiUrl('/book/' + bookId + '/tag/' + tagId)).then(getImmutableFirstBookResult);

// Notes API Helpers
const getImmutableNoteResults = getImmutableApiResults('Notes');
const getImmutableFirstNoteResult = compose(getFirstResult, getImmutableNoteResults);
const getNotesByBookId = bookId => axios.get(getFullApiUrl('/notes/book/' + bookId)).then(getImmutableNoteResults);
const getNoteById = noteId => axios.get(getFullApiUrl('/note/' + noteId)).then(getImmutableFirstNoteResult);
const deleteNoteById = noteId => axios.delete(getFullApiUrl('/note/' + noteId));
const postNoteByBookId = (bookId, note) => axios.post(getFullApiUrl('/notes/book/' + bookId), { note, bookId });

// Tags API Helpers
const getImmutableTagResults = getImmutableApiResults('Tags');
const getImmutableFirstTagResult = compose(getFirstResult, getImmutableTagResults);
const getAllTags = () => axios.get(getFullApiUrl('/tags')).then(getImmutableTagResults);
const getTagById = tagId => axios.get(getFullApiUrl('/tag/' + tagId)).then(getImmutableFirstTagResult);

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
        patchAuthorTagById,
        deleteAuthorTagById,

        getAllBooks,
        getBookById,
        patchBookTagById,
        deleteBookTagById,

        getNotesByBookId,
        getNoteById,
        deleteNoteById,
        postNoteByBookId,

        getAllTags,
        getTagById,

        filterDeleted,
        filterNull,

        validateIdValue,
    },
};