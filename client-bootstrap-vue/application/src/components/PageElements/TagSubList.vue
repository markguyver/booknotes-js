<template><div id="tag-sub-list">
    <b-list-group v-if="tags.length" flush>
        <b-list-group-item><b-badge v-for="tag in tags" variant="tags" v-bind:key="tag.id" v-bind:to="'/tag/' + tag.id" class="ml-1">{{ tag.tag }}</b-badge></b-list-group-item>
    </b-list-group>
</div></template>

<script>
export default {
    name: "TagSubList",
    props: {
        tags: {
            required: true,
            type: Array,
        },
    },
};
</script>

<style>
#tag-sub-list .list-group {
    font-size: 0.85rem;
}
#tag-sub-list .list-group .list-group-item .list-group .list-group-item span {
    font-size: 0.7rem;
}
</style>