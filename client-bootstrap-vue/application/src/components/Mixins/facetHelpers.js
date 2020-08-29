import { allPass } from 'ramda';

export default {
    data: function() { return {
        sidebarItems: [],
        displayApply: false,
    }; },
    methods: {
        getCheckboxFacetItem: function (label, filterChecked, filterUnchecked) { return {
            label: label,
            type: 'checkbox',
            filterChecked: filterChecked,
            filterUnchecked: filterUnchecked,
            checked: false,
        }; },
        parseFacetItem: function (facetItem, facetItemIndex) {
            if (this.validateFacetItem(facetItem)) { // Validate Facet Item
                const sidebarItem = {
                    id: facetItemIndex,
                    label: facetItem.label,
                    type: facetItem.type,
                    currentFilterFunction: null,

                    applyFilter: null,  // TODO Checkbox-specific?
                    filterOn: null,     // TODO Checkbox-specific?
                    filterOff: null,    // TODO Checkbox-specific?
                };
                if (this.verifyIsCheckboxOption(facetItem)) {// Handle Checkbox Sidebar Items
                    sidebarItem.applyFilter = facetItem.checked;
                    sidebarItem.filterOn = facetItem.filterChecked;
                    sidebarItem.filterOff = facetItem.filterUnchecked;
                    sidebarItem.currentFilterFunction = function() {
                        return this.applyFilter ? this.filterOn : this.filterOff;
                    };
                } // End of Handle Checkbox Sidebar Items
                this.sidebarItems.push(sidebarItem);
            } // End of Validate Facet Item
        },
        validateFacetItem: facetItem => facetItem.type && -1 !== ['checkbox'].indexOf(facetItem.type),
        verifyIsCheckboxOption: facetItem => facetItem.type && 'checkbox' == facetItem.type,
        createFilterFunctionFromFacetItems: facetItems => allPass(facetItems.map(facetItem => facetItem.filterFunction())),
    },
};