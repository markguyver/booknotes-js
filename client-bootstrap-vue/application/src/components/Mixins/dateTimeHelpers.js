const prettyDateTime = dateTimeString => {
    const dateObject = new Date(dateTimeString);
    return dateObject.toDateString() + ' ' + dateObject.toTimeString();
};

export default {
    methods: {
        prettyDateTime,
    },
};