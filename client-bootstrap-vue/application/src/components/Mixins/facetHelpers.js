import { allPass } from 'ramda';

export default {
    data: function() { return {
        sidebarItems: [],
        displayApply: false,
    }; },
    methods: {
        defaultFilterChecked: function () { return false; },
        defaultFilterUnchecked: function() { return true; },
        getCheckboxFacetItem: function (label, filterChecked = this.defaultFilterChecked, filterUnchecked = this.defaultFilterUnchecked) { return {
            label: label,
            type: 'checkbox',
            // filterChecked: filterChecked,
            // filterUnchecked: filterUnchecked,
            checked: false,
            filterFunction: function() {
                return this.checked ? filterChecked : filterUnchecked;
            },

        }; },
        parseFacetItem: function (facetItem, facetItemIndex) {
            if (this.validateFacetItem(facetItem)) { // Validate Facet Item
                const sidebarItem = {
                    id: facetItemIndex,
                    label: facetItem.label,
                    type: facetItem.type,
                    applyFilter: null,
                    filterOn: null,
                    filterOff: null,
                };
                if (this.verifyIsCheckboxOption(facetItem)) {// Handle Checkbox Sidebar Items
                    sidebarItem.applyFilter = facetItem.checked;
                    sidebarItem.filterOn = facetItem.filterChecked;
                    sidebarItem.filterOff = facetItem.filterUnchecked;
                } // End of Handle Checkbox Sidebar Items
                this.sidebarItems.push(sidebarItem);
            } // End of Validate Facet Item
        },
        validateFacetItem: facetItem => facetItem.type && -1 !== ['checkbox'].indexOf(facetItem.type),
        verifyIsCheckboxOption: facetItem => facetItem.type && 'checkbox' == facetItem.type,
        createFilterFunctionFromFacetItems: facetItems => allPass(facetItems.map(facetItem => facetItem.filterFunction())),
    },
};