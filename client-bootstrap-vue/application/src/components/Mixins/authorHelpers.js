import { allPass, always, compose, filter, join, props } from 'ramda';

const getAuthorFullName = compose(
    join(' '),
    filter(item => null != item),
    props(['first_name', 'middle_name', 'last_name'])
);
const getAuthorNameLastFirstMiddle = authorObject => authorObject.last_name + (authorObject.first_name ? ', ' + authorObject.first_name + (authorObject.middle_name ? ' ' + authorObject.middle_name : '') : '');

const convertBookAuthorsToAuthorsList = bookAuthorsArray => bookAuthorsArray.map(currentBookAuthor => {
    const author = currentBookAuthor.Author;
    if (currentBookAuthor.ContributionType) {// Add Contribution Type (If Present)
        author.ContributionType = currentBookAuthor.ContributionType;
    } // End of Add Contribution Type (If Present)
    return author;
});

const alwaysTrue = always(true);

const filterDeletedAuthors = currentAuthor => !currentAuthor.deleted_at;
const showDeletedAuthors = alwaysTrue;
const filterPseudonymAuthors = currentAuthor => !currentAuthor.parent_author_id;
const showPseudonymAuthors = alwaysTrue;

const filterDeletedAndPseudonymAuthors = allPass([filterDeletedAuthors, filterPseudonymAuthors]);

export default {
    methods: {
        getAuthorFullName,
        getAuthorNameLastFirstMiddle,
        convertBookAuthorsToAuthorsList,
        filterDeletedAuthors,
        showDeletedAuthors,
        filterPseudonymAuthors,
        showPseudonymAuthors,
        filterDeletedAndPseudonymAuthors,
    },
};