const getAuthorFullName = authorObject => (authorObject.first_name ? authorObject.first_name + ' ' : '') + (authorObject.middle_name ? authorObject.middle_name + ' ' : '') + authorObject.last_name;

export default {
    methods: {
        getAuthorFullName,
    },
};