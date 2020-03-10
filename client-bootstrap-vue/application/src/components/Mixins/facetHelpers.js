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
            filterChecked: filterChecked,
            filterUnchecked: filterUnchecked,
            checked: false,
        }; },
        parseFacetItem: function (facetItem, facetItemIndex) {
            const sidebarItem = {
                id: facetItemIndex,
                label: facetItem.label,
            };

            // if (this.verifyIsCheckboxOption(facetItem)) {
            // }

            this.sidebarItems.push(sidebarItem);
            return true;
        },
        verifyIsCheckboxOption: facetItem => facetItem.type && 'checkbox' == facetItem.type,
    },
};