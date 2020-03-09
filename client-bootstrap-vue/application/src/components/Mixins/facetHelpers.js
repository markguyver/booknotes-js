export default {
    data: function() { return {
        sidebarItems: [],
        displayApply: false,
    }; },
    methods: {
        defaultFilterChecked: function () { return false; },
        defaultFilterUnchecked: function() { return true; },
        getCheckboxFacetOption: function (label, filterChecked = defaultFilterChecked, filterUnchecked = this.defaultFilterUnchecked) { return {
            label: label,
            type: 'checkbox',
            filterChecked: filterChecked,
            filterUnchecked: filterUnchecked,
            checked: false,
        }; },
        parseFacetItemOption: function (facetConfig, facetConfigIndex) {
            const sidebarItem = {
                id: facetConfigIndex,
                label: facetConfig.label,
            };

            if (facetConfig.type && 'checkbox' == facetConfig.type) { // Determine Form Input Type
            } // End of Determine Form Input Type

            this.sidebarItems.push(sidebarItem);
        },
    },
};