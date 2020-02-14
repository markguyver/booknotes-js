export default {
    methods: {
        getHomeBreadcrumb: () => ({ text: 'Dashboard', to: '/' }),
        getAuthorBrowseBreadcrumb: (isActive = false) => ({ text: 'Browse Authors', to: '/authors', active: !!isActive }),
        getAuthorViewBreadcrumb: () => ({ text: 'View Author', active: true }),
    },
};