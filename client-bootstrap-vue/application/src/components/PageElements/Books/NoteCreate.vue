<template><div class="note-create">
    <b-form>
        <ckeditor v-model="editorData" :config="editorConfig"></ckeditor>
        <b-button class="mt-2" v-on:click="saveNote">Save Note</b-button>
    </b-form>
</div></template>

<script>
import axios from 'axios';
import CKEditor from 'ckeditor4-vue';
export default {
    components: { 'ckeditor': CKEditor.component },
    data: function() { return {
        editorData: '<p>Put your note here</p>',
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
            axios.post('/notes/book/' + this.bookId, {
                note: this.editorData,
                book_id: this.bookId,
            }).then(() => {
                this.editorData = '';
                this.$emit('noteCreated');
            }).catch(() => {
                this.$bvToast.toast('Note could not be saved.', {
                    title: 'Saving Error',
                    variant: 'danger',
                    solid: true,
                });
            });

        },
    },
    name: "NoteCreate",
    props: {
        bookId: Number,
    },
}
</script>

<style>
</style>