<template>
    <nav id="sidebar-facets" class="bg-secondary px-3 py-3 rounded text-light mb-2">
        <div class="sidebar-header">
            <div class="h5 mx-auto pb-1">{{ sidebarHeaderText }}</div>
        </div>
        <b-form class="sidebar-facet-items">
            <b-form-checkbox v-for="sidebarItem in sidebarItems" v-bind:key="sidebarItem.id" v-on:change="showApply" size="sm">{{ sidebarItem.label }}</b-form-checkbox>
        </b-form>
        <b-button class="mt-2" variant="primary" size="sm" block v-if="displayApply" v-on:click="applyFilters">Apply</b-button>
    </nav>
</template>

<script>
import facetHelpers from '../Mixins/facetHelpers';
// import compiler from 'vue-template-compiler';
// const processSidebarItemFacetConfiguration = sidebarItemFacetConfiguration => {
// };
export default {
    name: "SidebarFacets",
    methods: {
        showApply: function() {
            this.displayApply = true;
        },
        applyFilters: function() {

            this.sidebarItems.map(sidebarItem => {
                /* eslint no-console: ["error", { allow: ["log"] }] */
                console.log('Apply Filters Sidebar Item:', sidebarItem);
            });

            this.$emit('resultsUpdated', this.filterDataset());
            this.displayApply = false;
        },
        filterDataset: function() {
            // TODO Loop through form elements and apply filters
            return this.sidebarFacetDataset;
        },
    },
    props: {
        sidebarHeaderText: {
            type: String,
            default: 'Refine Results',
            required: false,
        },
        sidebarFacets: {
            type: Array,
            required: true,
        },
        sidebarFacetDataset: {
            type: Array,
            required: true,
        },
    },
    mixins: [facetHelpers],
    mounted: function() {
        this.sidebarFacets.map(this.parseFacetItemOption);
    },
};
</script>

<style>
#sidebar-facets {
}
#sidebar-facets .sidebar-header {
    text-align: center;
}
#sidebar-facets .sidebar-header div.h5 {
    border-bottom: 1px solid var(--light);
}
#sidebar-facets .sidebar-facet-items {
}
#sidebar-facets .sidebar-facet-items li {
}
</style>