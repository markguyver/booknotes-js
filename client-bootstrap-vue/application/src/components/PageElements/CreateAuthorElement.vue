<template><div id="author-create">
    <b-card header="Create an Author"><b-form @submit="handleSubmit" @reset="handleReset">
        <b-form-group id="author-first-name-group" label="First Name" label-for="author-first-name-input">
            <b-form-input id="author-first-name-input" v-model="createAuthorFormData.first_name" placeholder="First Name" autocomplete="off"></b-form-input>
        </b-form-group>
        <b-form-group id="author-middle-name-group" label="Middle Name" label-for="author-middle-name-input" class="mt-4" description="If an author has multiple name, make the first and last names one word and put all the rest in the middle name.">
            <b-form-input id="author-middle-name-input" v-model="createAuthorFormData.middle_name" placeholder="Middle Name" autocomplete="off"></b-form-input>
        </b-form-group>
        <b-form-group id="author-last-name-group" label="Last Name" label-for="author-last-name-input" description="If an author has only one name (i.e. Proclus), use the last name field.">
            <b-form-input id="author-last-name-input" v-model="createAuthorFormData.last_name" required placeholder="Last Name (required)" autocomplete="off"></b-form-input>
        </b-form-group>
        <b-form-group id="parent-author-group" label="Actual Author" label-for="parent-author-input" description="If you are creating a pseudonym for an actual author, use this field." v-if="parentAuthorOptions.length">
            <b-form-select id="parent-author-input" v-model="createAuthorFormData.parent_author_id" :options="parentAuthorOptions"></b-form-select>
        </b-form-group>
        <b-button type="submit" variant="primary" class="mt-2">Create</b-button>
        <b-button type="reset" variant="secondary" class="mt-2 ml-2">Clear</b-button>
    </b-form></b-card>
</div></template>

<script>
import axios from 'axios';
import authorHelpers from '../Mixins/authorHelpers';
import pageHelpers from '../Mixins/pageHelpers';
export default {
    name: "CreateAuthorElement",
    data: function() {return {
        parentAuthorOptions: [],
        createAuthorFormData: {
            first_name: null,
            middle_name: null,
            last_name: null,
            parent_author_id: null,
        },
    };},
    methods: {
        populateParentAuthorSelect: function() {
            axios.get('/authors').then(response => {
                if (Array.isArray(response.data.Authors) && response.data.Authors.length) {
                    this.parentAuthorOptions = [{ value: null, text: 'Select an Author' }]
                        .concat(Array.from(response.data.Authors)
                            .filter(this.filterPseudonymAuthors)
                            .filter(this.filterDeletedAuthors)
                            .map(currentAuthor => ({
                                value: currentAuthor.id,
                                text: this.getAuthorNameLastFirstMiddle(currentAuthor),
                            }))
                        );
                }
            }).catch(() => {
                this.popError('Could not retrieve parent author options.');
                this.parentAuthorOptions = [];
            });
        },
        handleSubmit: function() {
            axios.post('/authors', this.createAuthorFormData).then(response => {
                if (201 == response.status) {
                    this.popInfo('An author has been created: ' + this.getAuthorFullName(response.data.Authors[0])); // TODO Add Link to AView Author Page
                    this.handleReset();
                    this.populateParentAuthorSelect();
                }
            }).catch(() => {
                this.popError('Could not create author.');
            });
        },
        handleReset: function() {
            this.createAuthorFormData.first_name = null;
            this.createAuthorFormData.middle_name = null;
            this.createAuthorFormData.last_name = null;
            this.createAuthorFormData.parent_author_id = null;
        },
    },
    mixins: [authorHelpers, pageHelpers],
    mounted: function() {
        this.populateParentAuthorSelect();
    },
};
</script>

<style>
</style>