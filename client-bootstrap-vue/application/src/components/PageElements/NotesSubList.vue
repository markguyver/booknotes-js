<template><div id="notes-list">
    <b-modal id="note-delete-confirm" centered title="Please Confirm" @ok="deleteNoteConfirm" @hidden="deleteNoteHidden">Are you sure you want to delete this note?</b-modal>
    <div class="note-item" v-for="note in notesToDisplay" :key="note.id" >
        <div class="note-item-container">
            <div class="note-item-content" v-html="note.note"></div>
        </div>
        <div class="note-item-buttons">
            <b-button size="sm" variant="secondary" @click="editNotePushed(note.id)">Edit</b-button>
            <b-button size="sm" variant="danger" @click="deleteNotePushed(note.id)">Delete</b-button>
            <b-button size="sm" variant="primary" @click="fullscreenNotePushed(note.id)" class="float-right"><b-icon-arrows-fullscreen /></b-button>
        </div>
    </div>
</div></template>

<script>
import apiResultsHelpers from '../Mixins/apiResultsHelpers';
import pageHelpers from '../Mixins/pageHelpers';
export default {
    data: function() {return {
        deleteNoteId: null,
        notesToDisplay: [],
    };},
    name: "NotesList",
    methods: {
        deleteNotePushed: function(noteId) {
            this.deleteNoteId = noteId;
            this.$bvModal.show('note-delete-confirm');
        },
        deleteNoteConfirm: function() {
            const noteToDelete = this.deleteNoteId;
            this.deleteNoteById(noteToDelete).then(() => {
                this.popInfo('The note has been deleted.');
                this.notesToDisplay = this.notesToDisplay.filter(currentNote => noteToDelete !== currentNote.id);
                this.$emit('note-deleted', noteToDelete);
            }).catch(() => this.popError('Failed to delete the note.', 'Deletion Error'));
        },
        deleteNoteHidden: function() {
            this.deleteNoteId = null;
        },
        editNotePushed: function(noteId) {
            /* eslint no-console: ["error", { allow: ["log", "error"] }] */
            console.log('Edit Note Clicked, Note ID:', noteId);
        },
        fullscreenNotePushed: function(noteId) {
            /* eslint no-console: ["error", { allow: ["log", "error"] }] */
            console.log('Fullscreen Note Clicked, Note ID:', noteId);
        },
    },
    mixins: [apiResultsHelpers, pageHelpers],
    mounted: function() {
        this.notesToDisplay = this.notes;
    },
    props: ['notes'],
};
</script>

<style>
div#notes-list div.note-item:first-child {
    border-top: none;
}
div#notes-list div.note-item {
    padding: 0.5rem;
    border: 1px solid #999999;
    background-color: #aeaeae;
    border-radius: 0.25rem;
    margin-top: 1rem;
}
div#notes-list div.note-item div.note-item-container {
    background-color: #ffffff;
    border: 1px solid #999999;
    padding: 1rem;
    border-radius: 0.25rem;
}
div#notes-list div.note-item div.note-item-container div.note-item-content {
    max-height: 20em;
    overflow: hidden;
}
div#notes-list div.note-item div.note-item-container div.note-item-content :last-child {
    margin-bottom: 0;
}
div#notes-list div.note-item div.note-item-buttons button {
    margin-top: 0.5rem;
    margin-right: 0.5rem;
}
</style>