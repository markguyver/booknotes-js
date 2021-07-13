<template><div id="tag-sub-list">
    <b-list-group v-if="tags.length" flush>
        <b-list-group-item>
            <b-badge v-for="tag in tags" variant="tags" v-bind:key="tag.id" v-bind:to="'/tag/' + tag.id" class="ml-1">
                {{ tag.tag }}
                <span class="tag-delete-button" href="#"><IconButton href="#" v-on:button-push="deleteTag(tag.id)" activeColorName="warning" activeIconName="x-circle-fill" inactiveColorName="white" inactiveIconName="x" /></span>
            </b-badge>
        </b-list-group-item>
    </b-list-group>
</div></template>

<script>
import IconButton from './IconButton.vue';
export default {
    components: { IconButton },
    methods: {
        deleteTag: function(tagId) {
            this.$emit('remove-tag', tagId);
        },
    },
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
#tag-sub-list .list-group .list-group-item a span.tag-delete-button {
    padding-left: 0.3rem;
}
</style>