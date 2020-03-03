const convertBookAuthorsToBooksList = bookAuthorsArray => bookAuthorsArray.map(currentBookAuthor => {
    const book = currentBookAuthor.Book;
    if (currentBookAuthor.ContributionType.name) {
        book.ContributionType = currentBookAuthor.ContributionType.name;
    }
    return book;
});

export default {
    methods: {
        convertBookAuthorsToBooksList,
    },
};