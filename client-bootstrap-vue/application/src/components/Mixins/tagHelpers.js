import { always } from 'ramda';

const alwaysTrue = always(true);

const filterDeletedTags = tag => !tag.deleted_at;
const showDeletedTags = alwaysTrue;

const filterTagsWithNoAuthors = tag => tag.authorCount > 0;
const showTagsWithNoAuthors = alwaysTrue;

const filterTagsWithNoBooks = tag => tag.bookCount != 0;
const showTagsWithNoBooks = alwaysTrue;

export default {
    methods: {
        filterDeletedTags,
        showDeletedTags,
        filterTagsWithNoAuthors,
        showTagsWithNoAuthors,
        filterTagsWithNoBooks,
        showTagsWithNoBooks,
    },
};