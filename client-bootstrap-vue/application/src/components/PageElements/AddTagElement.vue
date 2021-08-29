<template><b-container id="add-tags">
    <b-input-group prepend="Add Tags" size="sm">
        <b-form-input :debounce="updateDelay" v-model="addTagInputValue" @update="addTagInputValueChanged" ref="addTag" />
        <b-input-group-append v-if="tagSelectionVisible">
            <b-button @click.left="clearAddTagInput()">Clear</b-button>
        </b-input-group-append>
    </b-input-group>
    <b-collapse v-model="tagSelectionVisible">
        <b-list-group class="position-absolute">
            <b-list-group-item v-for="currentTag in tagSelection" :key="currentTag.id" :disabled="currentTag.disable" @click.left="addSelectedTag(currentTag)" button>{{ currentTag.tag }}</b-list-group-item>
        </b-list-group>
    </b-collapse>
</b-container></template>

<script>
import apiResultsHelpers from '../Mixins/apiResultsHelpers';
import pageHelpers from '../Mixins/pageHelpers';
export default {
    name: "AddTagElement",
    data: function() {return {
        addTagInputValue: '',
        tagsToIgnore: [],
        tagSelection: [],
        tagSelectionVisible: false,
    };},
    methods: {
        addTagInputValueChanged: function(newValue) {
            if ('' != newValue.trim()) { // Check for New Value
                this.searchTags(newValue.trim()).then(results => {
                    if (results.size > 0) { // Check for Search Results
                        this.tagSelection = results.map(item => ({
                            id: item.get('id'),
                            tag: item.get('tag'),
                            disable: -1 !== this.tagsToIgnore.indexOf(item.get('id'))
                        })).toArray();
                    } else { // Middle of Check for Search Results
                        this.tagSelection = [{
                            id: 0,
                            tag: '[no results]',
                            disable: true,
                        }];
                    } // End of Check for Search Results
                    this.tagSelectionVisible = true;
                }).catch(() => {
                    this.popError('Failed searching for tags'); 
                    this.tagSelection = [];
                    this.tagSelectionVisible = false;
                });
            } else { // Middle of Check for New Value
                this.clearAddTagInput();
            } // End of Check for New Value
        },
        clearAddTagInput: function() {
            this.addTagInputValue = '';
            this.tagSelection = [];
            this.tagSelectionVisible = false;
            this.$refs.addTag.focus();
        },
        addSelectedTag: function(selectedTag) {
            this.$emit('add-tag', selectedTag);
        },
    },
    mixins: [apiResultsHelpers, pageHelpers],
    mounted: function() {
        this.tagsToIgnore = this.existingTags.map(item => item.id);
    },
    props: {
        existingTags: {
            type: Array,
            required: true,
        },
        updateDelay: {
            type: Number,
            default: 400,
        },
    },
};
</script>

<style>
div#add-tags div.collapse div.list-group {
    z-index: 1000;
}
</style>