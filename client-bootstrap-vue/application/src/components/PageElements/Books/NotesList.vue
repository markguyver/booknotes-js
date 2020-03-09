<template><div id="notes-list">
    <div class="booknotes-container"><div class="note-item" v-for="note in notes" v-bind:key="note.id" >
        <div class="note-item-content" v-html="note.note"></div>
        <div class="note-item-buttons"><b-button size="sm" variant="primary">Edit</b-button></div>
    </div></div>
</div></template>

<script>
export default {
    name: "NotesList",
    props: ['notes'],
};
</script>

<style>
div#notes-list div.booknotes-container div.note-item:first-child {
    border-top: none;
}
div#notes-list div.booknotes-container div.note-item {
    border-top: 1px solid rgba(0, 0, 0, 0.125);
}
div#notes-list div.booknotes-container div.note-item div.note-item-content {
}
div#notes-list div.booknotes-container div.note-item div.note-item-buttons {
    margin-bottom: 0.5rem;
}
</style>