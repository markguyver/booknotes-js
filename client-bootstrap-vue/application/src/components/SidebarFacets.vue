<template>
    <nav id="sidebar-facets" class="bg-secondary px-3 py-3 rounded text-light mb-2">
        <div class="sidebar-header">
            <div class="h4 mx-auto">{{ sidebarHeaderActiveText }}</div>
        </div>
        <ul class="sidebar-items">
            <li v-for="sidebarItem in sidebarItems" v-bind:key="sidebarItem.id">{{ sidebarItem.text }}</li>
        </ul>
    </nav>
</template>

<script>
// const sampleSidebarItem = {
//     id: 1,
//     text: 'Item 1',
//     link: '',
// };

export default {
    name: "SidebarFacets",
    data: function() {return {
        sidebarItems: [],
    };},
    methods: {
    },
    props: {
        sidebarHeaderActiveText: {
            type: String,
            default: 'Refine Results',
            required: false,
        },
    },
};
</script>

<style>
#sidebar-facets {
}
#sidebar-facets .sidebar-header {
    text-align: center;
}
#sidebar-facets .sidebar-header div.h4 {
}
#sidebar-facets .sidebar-items {
}
#sidebar-facets .sidebar-items li {
}
</style>