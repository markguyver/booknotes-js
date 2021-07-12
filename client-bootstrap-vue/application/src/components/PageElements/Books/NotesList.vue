<template><div id="notes-list">
    <div class="booknotes-container"><div class="note-item" v-for="note in notes" v-bind:key="note.id" >
        <div class="note-item-container">
            <div class="note-item-content" v-html="note.note"></div>
        </div>
        <div class="note-item-buttons">
            <b-button size="sm" variant="secondary" v-on:click="editNote(note.id)">Edit</b-button>
            <b-button size="sm" variant="danger" v-on:click="deleteNote(note.id)">Delete</b-button>
        </div>
    </div></div>
</div></template>

<script>
export default {
    name: "NotesList",
    methods: {
        deleteNote: function(noteId) {
            /* eslint no-console: ["error", { allow: ["log", "error"] }] */
            console.log('Delete Note Clicked, Note ID:', noteId); // TODO: Delete This
        },
        editNote: function(noteId) {
            /* eslint no-console: ["error", { allow: ["log", "error"] }] */
            console.log('Edit Note Clicked, Note ID:', noteId);
        },
    },
    props: ['notes'],
};
</script>

<style>
div#notes-list div.booknotes-container div.note-item:first-child {
    border-top: none;
}
div#notes-list div.booknotes-container div.note-item {
    padding: 0.5rem;
    border: 1px solid #999999;
    background-color: #aeaeae;
    border-radius: 0.25rem;
    margin-top: 1rem;
}
div#notes-list div.booknotes-container div.note-item div.note-item-container {
    background-color: #ffffff;
    border: 1px solid #999999;
    padding: 1rem;
    border-radius: 0.25rem;
}
div#notes-list div.booknotes-container div.note-item div.note-item-container div.note-item-content :last-child {
    margin-bottom: 0;
}
div#notes-list div.booknotes-container div.note-item div.note-item-buttons button {
    margin-top: 0.5rem;
    margin-right: 0.5rem;
}
</style>