import { List, Map } from 'immutable';
import { compose, curry } from 'ramda';

const getImmutableApiResults = curry((resultResourceType, apiResults) => List(apiResults.data[resultResourceType].map(Map)));
const getImmutableAuthorResults = getImmutableApiResults('Authors');
const getImmutableBookResults = getImmutableApiResults('Books');
const getImmutableNoteResults = getImmutableApiResults('Notes');
const getImmutableTagResults = getImmutableApiResults('Tags');

const getFirstResult = resultList => resultList.first();
const getImmutableFirstAuthorResult = compose(getFirstResult, getImmutableAuthorResults);
const getImmutableFirstBookResult = compose(getFirstResult, getImmutableBookResults);
const getImmutableFirstNoteResult = compose(getFirstResult, getImmutableNoteResults);
const getImmutableFirstTagResult = compose(getFirstResult, getImmutableTagResults);

const filterDeleted = item => !item.get('deleted_at');
const filterNull = item => null != item;

export default {
    methods: {
        getImmutableAuthorResults,
        getImmutableBookResults,
        getImmutableNoteResults,
        getImmutableTagResults,

        getImmutableFirstAuthorResult,
        getImmutableFirstBookResult,
        getImmutableFirstNoteResult,
        getImmutableFirstTagResult,

        filterDeleted,
        filterNull,
    },
};