<template>
    <nav id="sidebar-facets" class="bg-secondary px-3 py-3 rounded text-light mb-2">
        <div class="sidebar-header">
            <div class="h5 mx-auto pb-1">{{ sidebarHeaderText }}</div>
        </div>
        <b-form class="sidebar-facet-items">
            <div v-for="sidebarItem in sidebarItems" v-bind:key="sidebarItem.id">

                <b-form-checkbox v-if="verifyIsCheckboxOption(sidebarItem)" v-on:change="showApply" size="sm" v-model="sidebarItems[sidebarItem.id].applyFilter">{{ sidebarItem.label }}</b-form-checkbox>

            </div>
        </b-form>
        <b-button class="mt-2" variant="primary" size="sm" block v-if="displayApply" v-on:click="applyFilters">Apply</b-button>
    </nav>
</template>

<script>
import facetHelpers from '../Mixins/facetHelpers';
import {allPass} from 'ramda';
export default {
    name: "SidebarFacets",
    data: function() { return {
        lastDataState: [],
    }; },
    methods: {
        showApply: function() {
            setTimeout(() => this.displayApply = JSON.stringify(this.lastDataState) != JSON.stringify(this.getCurrentDataState()), 100);
        },
        applyFilters: function() {
            setTimeout(() => {
                this.$emit('resultsUpdated', this.filterDataset());
                this.displayApply = false;
                this.setCurrentDataState();
            }, 100);
        },
        filterDataset: function() {
            return this.sidebarFacetDataset.filter(this.createFilterFunctionFromFacetItems(this.sidebarItems));
        },
        createFilterFunctionFromFacetItems: function(facets) {
            return allPass(facets.map(currentFacet => currentFacet.currentFilterFunction()));
        },
        getCurrentDataState: function() {
            const currentDataState = [];
            this.sidebarItems.forEach(facet => currentDataState.push(facet.applyFilter));
            return currentDataState;
        },
        setCurrentDataState: function() {
            this.lastDataState = this.getCurrentDataState();
        }
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
        this.sidebarFacets.map(this.parseFacetItem);
        this.setCurrentDataState();
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