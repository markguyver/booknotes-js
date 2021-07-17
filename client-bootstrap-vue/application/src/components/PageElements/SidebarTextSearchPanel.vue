<template>
    <nav id="sidebar-text-search" class="bg-secondary px-3 py-3 rounded text-light mb-2">
        <div class="sidebar-header">
            <div class="h5 mx-auto pb-1">Search</div>
        </div>
        <b-form class="sidebar-search">

            <div>Insert Text Search Here</div>

        </b-form>
    </nav>
</template>

<script>
import facetHelpers from '../Mixins/facetHelpers';
export default {
    name: "SidebarTextSearch",
    data: function() { return {
    }; },
    methods: {
    },
    props: {
        sidebarFacetDataset: {
            type: Array,
            required: true,
        },
    },
    mixins: [facetHelpers],
    mounted: function() {
    },
};
</script>

<style>
#sidebar-text-search .sidebar-header {
    text-align: center;
}
#sidebar-text-search .sidebar-header div.h5 {
    border-bottom: 1px solid var(--light);
}
</style>