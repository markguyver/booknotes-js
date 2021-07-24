<template><div id="create-book">
    <b-card header="Create a Book"><b-form @submit="handleSubmit" @reset="handleReset" autocomplete="off">
        <b-input-group>
            <b-form-input id="book-title-input" v-model="createBookFormData.title" required placeholder="Title (required)" autocomplete="off"></b-form-input>
            <b-input-group-append><b-button size="sm" type="submit" variant="primary" title="Create Book"><b-icon icon="plus"></b-icon></b-button></b-input-group-append>
        </b-input-group>
    </b-form></b-card>
</div></template>

<script>
import apiResultsHelpers from '../Mixins/apiResultsHelpers';
import pageHelpers from '../Mixins/pageHelpers';
export default {
    name: 'CreateBookElement',
    data: function() { return {
        createBookFormData: {
            title: null,
        },
    }; },
    methods: {
        handleSubmit: function() {
            this.postNewBook(this.createBookFormData).then(response => {
                if (201 == response.status) { // Check for Successful Status
                    this.popInfo('A book has been created: ' + response.data.Books[0].title); // TODO Add Link to View Book Page
                    this.handleReset();
                } else { // Middle of Check for Successful Status
                    this.popError('Unexpected error while creating book.');
                } // End of Check for Successful Status
            }).catch(() => this.popError('Could not create book.'));
        },
        handleReset: function() {
            this.createBookFormData.title = null;
        },
    },
    mixins: [apiResultsHelpers, pageHelpers],
};
</script>

<style>
</style>