<template><div class="note-create">
    <b-form>
        <ckeditor v-model="editorData" :config="editorConfig"></ckeditor>
        <b-button class="mt-3" v-on:click="saveNote" variant="primary">Save Note</b-button>
    </b-form>
</div></template>

<script>
import axios from 'axios';
import CKEditor from 'ckeditor4-vue';
import pageHelpers from '../../Mixins/pageHelpers';
const notePlaceholder = '<p>Put your note here</p>';
export default {
    components: { 'ckeditor': CKEditor.component },
    data: function() { return {
        editorData: notePlaceholder,
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
    }; },
    methods: {
        saveNote: function() {
            if (this.editorData) { // Check for Note Content
                if (this.editorData.trim() != notePlaceholder) { // Verify Note Content is Not Placeholder Text
                    axios.post('/notes/book/' + this.bookId, {
                        note: this.editorData.trim(),
                        book_id: this.bookId,
                    }).then(() => {
                        this.editorData = notePlaceholder;
                        this.$emit('noteCreated');
                    }).catch(() => {
                        this.$bvToast.toast('Note could not be saved.', {
                            title: 'Saving Error',
                            variant: 'danger',
                            solid: true,
                        });
                    });
                } else { // Middle of Verify Note Content is Not Placeholder Text
                    this.popError('Cannot create note using placeholder text.', 'Create Note Error');
                } // End of Verify Note Content is Not Placeholder Text
            } else { // Middle of Check for Note Content
                this.popError('Cannot create an empty note.', 'Create Note Error');
            } // End of Check for Note Content
        },
    },
    mixins: [pageHelpers],
    name: "NoteCreate",
    props: {
        bookId: Number,
    },
}
</script>

<style>
div.note-create {
    padding: 1em;
    border: 1px solid #999999;
    background-color: #aeaeae;
    border-radius: 0.25rem;
}
</style>