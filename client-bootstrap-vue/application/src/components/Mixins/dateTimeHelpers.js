import moment from 'moment';

const prettyDateTime = dateTimeString => moment(dateTimeString).format('ddd MMM D, YYYY');
const timeAgo = dateTimeString => moment(dateTimeString).fromNow();

export default {
    methods: {
        prettyDateTime,
        timeAgo,
    },
};