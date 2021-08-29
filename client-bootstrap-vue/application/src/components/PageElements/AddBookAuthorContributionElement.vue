<template><b-container id="add-book-author-contribution">

    <!-- Create Book Author Contribution Input Group: Start -->
    <b-input-group size="sm">

        <!-- Add Author to Book Label & Clear Button: Start -->
        <b-input-group-prepend v-if="addAuthorTextLabelVisible" :is-text="true">Add Author</b-input-group-prepend>
        <b-input-group-prepend v-if="addAuthorInputClearButtonVisible"><b-button @click.left="resetCreateBookAuthorContributionFormInputs()">Clear Author</b-button></b-input-group-prepend>
        <!-- Add Author to Book Label & Clear Button: End -->

        <!-- Add Book to Author Label & Clear Button: Start -->
        <b-input-group-prepend v-if="addBookTextLabelVisible" :is-text="true">Add Book</b-input-group-prepend>
        <b-input-group-prepend v-if="addBookInputClearButtonVisible"><b-button @click.left="resetCreateBookAuthorContributionFormInputs()">Clear Book</b-button></b-input-group-prepend>
        <!-- Add Book to Author Label & Clear Button: End -->

        <!-- Add Book Author Contribution Form Input: Start -->
        <b-form-input :debounce="updateDelay" v-model="addResourceInputValue" @update="addResourceInputValueChanged" :readonly="addResourceInputValueLocked" ref="resourceInput" />
        <!-- Add Book Author Contribution Form Input: End -->

        <!-- Choose Contribution Type Dropdown and Submit: Start -->
        <b-input-group-append>
            <b-dropdown text="Select Contribution Type" size="sm" :variant="selectContributionDropdownVariant" :disabled="selectContributionDropdownDisabled">
                <b-dropdown-item v-for="currentContributionType in allContributionTypes" :key="currentContributionType.id" :disabled="currentContributionType.disabled" @click.left="addBookAuthorContribution(currentContributionType.id)">
                    {{ currentContributionType.name }}
                </b-dropdown-item>
            </b-dropdown>
        </b-input-group-append>
        <!-- Choose Contribution Type Dropdown and Submit: End -->

    </b-input-group>
    <!-- Create Book Author Contribution Input Group: End -->

    <!-- Choose Search Results Dropdown: Start -->
    <b-collapse v-model="searchSelectionVisible">
        <b-list-group class="position-absolute">
            <b-list-group-item v-for="currentResult in searchSelection" :key="currentResult.id" :disabled="currentResult.disabled" @click.left="searchResultValueSelected(currentResult)" button>{{ currentResult.title }}</b-list-group-item>
        </b-list-group>
    </b-collapse>
    <!-- Choose Search Results Dropdown: End -->

</b-container></template>

<script>
import apiResultsHelpers from '../Mixins/apiResultsHelpers';
import authorHelpers  from '../Mixins/authorHelpers';
import pageHelpers from '../Mixins/pageHelpers';
export default {
    data: function() {return  {

        // Add Author Input Variables
        addAuthorTextLabelVisible: false,
        addAuthorInputClearButtonVisible: false,

        // Add Book Input Variables
        addBookTextLabelVisible: false,
        addBookInputClearButtonVisible: false,

        // Add Contribution Type Input Variables
        allContributionTypes: [],
        selectContributionDropdownVariant: 'outline-primary',
        selectContributionDropdownDisabled: true,
        addBookButtonVariant: 'outline-primary',
        addBookButtonDisabled: true,

        // Component Universal Variables
        addResourceInputValue: '',
        addResourceInputValueId: null,
        addResourceInputValueLocked: false,
        searchSelection: [],
        searchSelectionVisible: false,

    };},
    methods: {

        // Add Author Methods
        processSearchAuthorsResults: function(authorSearchResults) {
            if (authorSearchResults.size > 0) { // Check for Search Results
                this.searchSelection = authorSearchResults.map(item => ({
                    id: item.get('id'),
                    title: this.getAuthorFullName(item.toJSON()),
                    disabled: false,
                })).toArray();
            } else { // Middle of Check for Search Results
                this.searchSelection = [{
                    id: 0,
                    title: '[no results]',
                    disabled: true,
                }];
            } // End of Check for Search Results
            this.addAuthorTextLabelVisible = false;
            this.addAuthorInputClearButtonVisible = true;
            this.processSearchResults(); // Call the Search Results Handler for All Resource Types
        },
        processSearchAuthorsError: function() {
            this.popError('Failed searching for authors');
            this.processSearchError(); // Call the Search Error Handler for All Resource Types
        },

        // Add Book Methods
        processSearchBooksResults: function(bookSearchResults) {
            if (bookSearchResults.size > 0) { // Check for Search Results
                this.searchSelection = bookSearchResults.map(item => ({
                    id: item.get('id'),
                    title: item.get('title'),
                    disabled: false,
                })).toArray();
            } else { // Middle of Check for Search Results
                this.searchSelection = [{
                    id: 0,
                    title: '[no results]',
                    disabled: true,
                }];
            } // End of Check for Search Results
            this.addBookTextLabelVisible = false;
            this.addBookInputClearButtonVisible = true;
            this.processSearchResults(); // Call the Search Results Handler for All Resource Types
        },
        processSearchBooksError: function() {
            this.popError('Failed searching for books');
            this.processSearchError(); // Call the Search Error Handler for All Resource Types
        },

        // Add Contribution Type Methods
        retrieveAllContributionTypes: function() {
            this.getAllContributionTypes()
                .then(results => this.allContributionTypes = results.map(item => Object.assign(item.toJSON(), { disabled: false })).toArray())
                .catch(() => this.popError('Failed retrieving available contribution types'));
        },
        disableContributionTypesByBookIdAndAuthorId: function() {
            let bookId;
            let authorId;
            switch (this.context) { // Determine Context to Set ID Variables

                case 'author':
                    bookId = this.addResourceInputValueId;
                    authorId = this.contextId;
                    break;
                
                case 'book':
                    bookId = this.contextId;
                    authorId = this.addResourceInputValueId;
                    break;

            } // End of Determine Context to Set ID Variables
            this.allContributionTypes = this.allContributionTypes.map(item => {
                for (let i = 0; i < this.existingResources.length; i++) { // Loop through Existing Contribution Types
                    if ((this.existingResources[i].AuthorId == authorId) &&
                        (this.existingResources[i].BookId == bookId) &&
                        (this.existingResources[i].ContributionTypeId == item.id)
                    ) { // Check if Contribution Type Has Already Been Used for Author and Book
                        item.disabled = true;
                    } // End of Check if Contribution Type Has Already Been Used for Author and Book
                } // End of Loop through Existing Contribution Types
                return item;
            });
        },
        getContributionTypeNameFromId: function(contributionTypeId) {
            for (let i = 0; i < this.allContributionTypes.length; i++) { // Loop through Contribution Types to Find ID/Name
                if (this.allContributionTypes[i].id == contributionTypeId) { // Compare Passed ID Parameter to Current Contribution Type ID
                    return this.allContributionTypes[i].name;
                } // End of Compare Passed ID Parameter to Current Contribution Type ID
            } // End of Loop through Contribution Types to Find ID/Name
        },
        resetContributionTypesSelectInput: function() {
            this.resetContributionTypesDisabledValues();
            this.selectContributionDropdownVariant = "outline-primary";
            this.selectContributionDropdownDisabled = true;
        },
        resetContributionTypesDisabledValues: function() {
            this.allContributionTypes = this.allContributionTypes.map(item => {
                item.disabled = false;
                return item;
            });
        },

        // Component Universal Methods
        processSearchResults: function() {
            this.searchSelectionVisible = true;
        },
        processSearchError: function() {
            this.searchSelection = [];
            this.searchSelectionVisible = false;
        },
        addResourceInputValueChanged: function(newResourceValue) {
            if ('' != newResourceValue.trim()) { // Check for New Value
                switch (this.context) {

                    case 'author':
                        this.searchBooks(newResourceValue)
                            .then(this.processSearchBooksResults)
                            .catch(this.processSearchBooksError);
                        break;

                    case 'book':
                        this.searchAuthors(newResourceValue)
                            .then(this.processSearchAuthorsResults)
                            .catch(this.processSearchAuthorsError);
                        break;

                }
            } else { // Middle of Check for New Value
                this.resetCreateBookAuthorContributionFormInputs();
            } // End of Check for New Value
        },
        resetResourceInput: function() {
            this.addResourceInputValue = '';
            this.addResourceInputValueId = null;
            this.addResourceInputValueLocked = false;
            this.searchSelection = [];
            this.searchSelectionVisible = false;
            switch (this.context) {

                case 'author':
                    this.addBookTextLabelVisible = true;
                    this.addBookInputClearButtonVisible = false;
                    break;

                case 'book':
                    this.addAuthorTextLabelVisible = true;
                    this.addAuthorInputClearButtonVisible = false;
                    break;

            }
            this.setFocusToResourceInput();
        },
        searchResultValueSelected: function(selectedSearchResult) {
            this.addResourceInputValue = selectedSearchResult.title;
            this.addResourceInputValueId = selectedSearchResult.id;
            this.addResourceInputValueLocked = true;
            this.searchSelection = [];
            this.searchSelectionVisible = false;
            this.disableContributionTypesByBookIdAndAuthorId();
            this.selectContributionDropdownVariant = "primary";
            this.selectContributionDropdownDisabled = false;
        },
        addBookAuthorContribution: function(contributionTypeId) {
            let authorId;
            let bookId;
            let emitObject = { ContributionType: {
                id: contributionTypeId,
                name: this.getContributionTypeNameFromId(contributionTypeId),
            } };
            switch (this.context) {

                case 'author':
                    authorId = this.contextId;
                    bookId = this.addResourceInputValueId;
                    emitObject.Book = {
                        id: this.addResourceInputValueId,
                        title: this.addResourceInputValue,
                    };
                    break;

                case 'book':
                    authorId = this.addResourceInputValueId;
                    bookId = this.contextId;
                    emitObject.Author = {
                        id: this.addResourceInputValueId,
                        first_name: '',
                        middle_name: '',
                        last_name: this.addResourceInputValue, // This isn't exactly true but will suffice until a refresh
                    };
                    break;

            }
            this.putNewBookAuthorContribution(authorId, bookId, contributionTypeId)
                .then(response => {
                    this.popInfo('Book-author contribution has been added');
                    this.$emit('add-book-author-contribution', Object.assign(response.data.BookAuthorContributions, emitObject));
                    this.resetCreateBookAuthorContributionFormInputs();
                })
                .catch(() => this.popError('Failed to add book-author contribution.'));
        },
        resetCreateBookAuthorContributionFormInputs: function() {
            this.resetResourceInput();
            this.resetContributionTypesSelectInput();
        },
        setFocusToResourceInput: function() {
            this.$refs.resourceInput.focus();
        }

    },
    mixins: [apiResultsHelpers, authorHelpers, pageHelpers],
    mounted: function() {
        this.retrieveAllContributionTypes();
        switch (this.context) { // Determine Which Fields to Display By Context

            case 'author':
                this.addBookTextLabelVisible = true;
                break;

            case 'book':
                this.addAuthorTextLabelVisible = true;
                break;

        } // End of Determine Which Fields to Display By Context
    },
    name: 'AddBookAuthorContributionElement',
    props: {
        context: {
            type: String,
            required: true,
            validator: function(value) {
                return -1 !== ['author', 'book'].indexOf(value);
            },
        },
        contextId: {
            type: Number,
            required: true,
            validator: function(value) {
                return value > 0;
            },
        },
        existingResources: {
            type: Array,
            default: () => [],
        },
        updateDelay: {
            type: Number,
            default: 400,
        },
    },
};
</script>

<style>
div#add-book-author-contribution div.collapse div.list-group {
    z-index: 1000;
}
</style>