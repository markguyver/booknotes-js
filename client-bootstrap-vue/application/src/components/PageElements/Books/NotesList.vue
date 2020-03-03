<template><div id="notes-list">

    <div class="booknotes-container"><div v-for="note in notes" v-bind:key="note.id">
        {{ note.note }}
    </div></div>

</div></template>

<script>
// import compiler from 'vue-template-compiler';
export default {
    name: "NotesList",
    props: ['notes'],
};
</script>

<style>
</style>