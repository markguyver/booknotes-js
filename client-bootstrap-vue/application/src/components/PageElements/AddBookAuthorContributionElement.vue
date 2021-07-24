<template><b-container id="add-book-author-contribution">

    <!-- Create Book Author Contribution Input Group: Start -->
    <b-input-group size="sm">

        <!-- Add Book to Author: Start -->
        <b-input-group-prepend v-if="addBookTextLabelVisible" :is-text="true">Add Book</b-input-group-prepend>
        <b-input-group-prepend v-if="addBookInputClearButtonVisible"><b-button @click.left="resetCreateBookAuthorContributionFormInputs()">Clear Book</b-button></b-input-group-prepend>
        <b-form-input v-if="addBookInputVisible" :debounce="updateDelay" v-model="addBookInputValue" @update="addBookInputValueChanged" :readonly="addBookInputValueLocked" />
        <!-- Add Book to Author: End -->

        <!-- Choose Contribution Type Dropdown and Submit: Start -->
        <b-input-group-append>
            <b-dropdown text="Select Contribution Type" size="sm" :variant="selectContributionDropdownVariant" :disabled="selectContributionDropdownDisabled">
                <b-dropdown-item v-for="currentContributionType in allContributionTypes" :key="currentContributionType.id" :disabled="currentContributionType.disabled" @click.left="addBookAuthorContribution(addBookInputValueId, contextId, currentContributionType.id)">
                    {{ currentContributionType.name }}
                </b-dropdown-item>
            </b-dropdown>
        </b-input-group-append>
        <!-- Choose Contribution Type Dropdown and Submit: End -->

    </b-input-group>
    <!-- Create Book Author Contribution Input Group: End -->

    <!-- Choose Book Search Results Dropdown: Start -->
    <b-collapse v-model="bookSelectionVisible">
        <b-list-group class="position-absolute">
            <b-list-group-item v-for="currentBook in bookSelection" :key="currentBook.id" :disabled="currentBook.disabled" @click.left="addBookInputValueSet(currentBook)" button>{{ currentBook.title }}</b-list-group-item>
        </b-list-group>
    </b-collapse>
    <!-- Choose Book Search Results Dropdown: End -->

</b-container></template>

<script>
import apiResultsHelpers from '../Mixins/apiResultsHelpers';
import pageHelpers from '../Mixins/pageHelpers';
export default {
    data: function() {return  {

        // Add Author Input Variables

        // Add Book Input Variables
        addBookInputValue: '',
        addBookInputValueId: null,
        addBookInputValueLocked: false,
        addBookInputVisible: false,
        addBookTextLabelVisible: false,
        addBookInputClearButtonVisible: false,
        bookSelection: [],
        bookSelectionVisible: false,

        // Add Contribution Type Input Variables
        allContributionTypes: [],
        selectContributionDropdownVariant: 'outline-primary',
        selectContributionDropdownDisabled: true,
        addBookButtonVariant: 'outline-primary',
        addBookButtonDisabled: true,

    };},
    methods: {

        // Add Author Methods

        // Add Book Methods
        addBookInputValueChanged: function(newBookSearchValue) {
            if ('' != newBookSearchValue.trim()) { // Check for New Value
                this.searchBooks(newBookSearchValue).then(results => {
                    if (results.size > 0) { // Check for Search Results
                        this.bookSelection = results.map(item => ({
                            id: item.get('id'),
                            title: item.get('title'),
                            disable: false, // TODO: Update this
                        })).toArray();
                    } else { // Middle of Check for Search Results
                        this.bookSelection = [{
                            id: 0,
                            title: '[no results]',
                            disable: true,
                        }];
                    } // End of Check for Search Results
                    this.bookSelectionVisible = true;
                    this.addBookTextLabelVisible = false;
                    this.addBookInputClearButtonVisible = true;
                }).catch(() => {
                    this.popError('Failed searching for books');
                    this.bookSelection = [];
                    this.bookSelectionVisible = false;
                    this.addBookTextLabelVisible = true;
                    this.addBookInputClearButtonVisible = false;
                });
            } else { // Middle of Check for New Value
                this.resetCreateBookAuthorContributionFormInputs();
            } // End of Check for New Value
        },
        addBookInputValueSet: function(newBookValue) {
            this.addBookInputValue = newBookValue.title;
            this.addBookInputValueId = newBookValue.id;
            this.addBookInputValueLocked = true;
            this.bookSelection = [];
            this.bookSelectionVisible = false;
            this.disableContributionTypesByBookIdAndAuthorId(newBookValue.id, this.contextId);
            this.selectContributionDropdownVariant = "primary";
            this.selectContributionDropdownDisabled = false;
        },
        resetAddBookInput: function() {
            this.addBookInputValue = '';
            this.addBookInputValueId = null;
            this.addBookInputValueLocked = false;
            this.addBookTextLabelVisible = true;
            this.addBookInputClearButtonVisible = false;
            this.bookSelection = [];
            this.bookSelectionVisible = false;
        },

        // Add Contribution Type Methods
        retrieveAllContributionTypes: function() {
            this.getAllContributionTypes()
                .then(results => this.allContributionTypes = results.map(item => Object.assign(item.toJSON(), { disabled: false })).toArray())
                .catch(() => this.popError('Failed retrieving available contribution types'));
        },
        disableContributionTypesByBookIdAndAuthorId: function(bookId, authorId) {
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
        addBookAuthorContribution: function(bookId, authorId, contributionTypeId) {
            this.putNewBookAuthorContribution(authorId, bookId, contributionTypeId)
                .then(response => {
                    this.popInfo('Book-author contribution has been added');
                    this.$emit('add-book-author-contribution', Object.assign(response.data.BookAuthorContributions, {
                        Book: {
                            id: this.addBookInputValueId,
                            title: this.addBookInputValue,
                        },
                        ContributionType: {
                            id: contributionTypeId,
                            name: this.getContributionTypeNameFromId(contributionTypeId),
                        },
                    }));
                    this.resetCreateBookAuthorContributionFormInputs();
                })
                .catch(() => this.popError('Failed to add book-author contribution.'));
        },
        resetCreateBookAuthorContributionFormInputs: function() {
            switch (this.context) { // Determine Context to Reset Correctly

                case 'author':
                    this.resetAddBookInput();
                    break;
                
                case 'book':
                    break;

            } // End of Determine Context to Reset Correctly
            this.resetContributionTypesSelectInput();
        },

    },
    mixins: [apiResultsHelpers, pageHelpers],
    mounted: function() {
        this.retrieveAllContributionTypes();
        switch (this.context) { // Determine Which Fields to Display By Context

            case 'author':
                this.addBookTextLabelVisible = true;
                this.addBookInputVisible = true;
                break;

            case 'book':
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
