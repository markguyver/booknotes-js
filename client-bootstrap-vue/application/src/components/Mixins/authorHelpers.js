const getAuthorFullName = authorObject => (authorObject.first_name ? authorObject.first_name + ' ' : '') + (authorObject.middle_name ? authorObject.middle_name + ' ' : '') + authorObject.last_name;
const getAuthorNameLastFirstMiddle = authorObject => authorObject.last_name + (authorObject.first_name ? ', ' + authorObject.first_name + (authorObject.middle_name ? ' ' + authorObject.middle_name : '') : '');

const convertBookAuthorsToAuthorsList = bookAuthorsArray => bookAuthorsArray.map(currentBookAuthor => {
    const author = currentBookAuthor.Author;
    if (currentBookAuthor.ContributionType.name) {
        author.ContributionType = currentBookAuthor.ContributionType.name;
    }
    return author;
});

export default {
    methods: {
        getAuthorFullName,
        getAuthorNameLastFirstMiddle,
        convertBookAuthorsToAuthorsList,
    },
};