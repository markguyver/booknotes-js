<template><div id="create-tag">
    <b-card header="Create a Tag"><b-form @submit="handleSubmit" @reset="handleReset" autocomplete="off">
        <b-input-group id="tag-tag-group" label="Tag" label-for="tag-tag-input" description="">
            <b-form-input id="tag-tag-input" v-model="createTagFormData.tag" required placeholder="Tag (required)" autocomplete="off"></b-form-input>
            <b-input-group-append><b-button size="sm" type="submit" variant="primary" title="Create Tag"><b-icon icon="plus"></b-icon></b-button></b-input-group-append>
        </b-input-group>
    </b-form></b-card>
</div></template>

<script>
import apiResultsHelpers from '../Mixins/apiResultsHelpers';
import pageHelpers from '../Mixins/pageHelpers';
export default {
    name: 'CreateTagElement',
    data: function() { return {
        createTagFormData: {
            tag: null,
        },
    }; },
    methods: {
        handleSubmit: function() {
            this.postNewTag(this.createTagFormData).then(response => {
                if (201 == response.status) {
                    this.popInfo('A tag has been created: ' + response.data.Tags[0].tag);
                    this.handleReset();
                }
            }).catch(() => {
                this.popError('Could not create tag.');
            });
        },
        handleReset: function() {
            this.createTagFormData.tag = null;
        },
    },
    mixins: [apiResultsHelpers, pageHelpers],
};
</script>

<style>
</style>