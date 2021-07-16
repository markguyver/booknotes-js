<template><b-container class="create-note mt-3">
    <b-overlay :show="showOverlay"><div class="note-create-form">
        <b-form>
            <ckeditor v-model="editorData" :config="editorConfig"></ckeditor>
            <b-button class="mt-3" @click="saveNote" variant="primary">Save Note</b-button>
        </b-form>
    </div></b-overlay>
</b-container></template>

<script>
import CKEditor from 'ckeditor4-vue';
import apiResultsHelpers from '../Mixins/apiResultsHelpers';
import pageHelpers from '../Mixins/pageHelpers';
export default {
    components: { 'ckeditor': CKEditor.component },
    data: function() { return {
        editorData: '',
        editorConfig: {
            toolbar: [
                { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Strike', 'Underline', '-', 'RemoveFormat' ] },
                { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote' ] },
                { name: 'styles', items: [ 'Styles', 'Format' ] },
                '/',
                { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
                { name: 'editing', items: [ 'Scayt' ] },
                { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
                { name: 'insert', items: [ 'Image', 'Table', 'HorizontalRule', 'SpecialChar' ] },
                { name: 'tools', items: [ 'Maximize' ] },
                { name: 'document', items: [ 'Source' ] },
            ],
            removeButtons: 'Image,Table,Source',
        },
        showOverlay: false,
    }; },
    methods: {
        clearNoteContent: function() {
            this.editorData = '';
        },
        saveNote: function() {
            if (this.editorData) { // Check for Note Content
                this.showOverlay = true;
                this.postNoteByBookId(this.bookId, this.editorData.trim()).then(() => {
                    this.clearNoteContent();
                    this.$emit('noteCreated');
                }).catch(() => this.popError('Note could not be saved.', 'Saving Error'))
                .finally(() => this.showOverlay = false);
            } else { // Middle of Check for Note Content
                this.popError('Cannot create an empty note.', 'Create Note Error');
            } // End of Check for Note Content
        },
    },
    mixins: [apiResultsHelpers, pageHelpers],
    name: "NoteCreate",
    props: {
        bookId: Number,
    },
}
</script>

<style>
div.create-note {
    padding-left: 0;
    padding-right: 0;
}
div.create-note div.note-create-form {
    padding: 1em;
    border: 1px solid #999999;
    background-color: #aeaeae;
    border-radius: 0.25rem;
}
</style>