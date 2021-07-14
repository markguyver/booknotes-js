import { always } from 'ramda';

const convertBookAuthorsToBooksList = bookAuthorsArray => bookAuthorsArray.map(currentBookAuthor => {
    const book = currentBookAuthor.Book;
    if (currentBookAuthor.ContributionType.name) { // Add Contribution Type (If Present)
        book.ContributionType = currentBookAuthor.ContributionType;
    } // End of Add Contribution Type (If Present)
    return book;
});

const alwaysTrue = always(true);

const filterDeletedBooks = currentBook => !currentBook.deleted_at;
const showDeletedBooks = alwaysTrue;

export default {
    methods: {
        convertBookAuthorsToBooksList,
        filterDeletedBooks,
        showDeletedBooks,
    },
};