const getBrowseBreadcrumb = (resourceName, routerPath, isActive) => ({ text: 'Browse ' + resourceName, to: routerPath, active: !!isActive });
const getViewBreadcrumb = resourceName => ({ text: 'View '+ resourceName, active: true });
const getCreateBreadcrumb = (resourceName, routerPath, isActive) => ({ text: 'Create ' + resourceName + '(s)', to: '/make' + routerPath, active: !!isActive });

const breadcrumbData = {};
const breadcrumbGenerator = {
    getHomeBreadcrumb: () => ({ text: 'Dashboard', to: '/' }),
};
const resourcesToGenerateBreadcrumbsFor = [{
    singular: 'Author',
    plural: 'Authors',
},{
    singular: 'Book',
    plural: 'Books',
},{
    singular: 'Tag',
    plural: 'Tags',
}];
const getResourcePages = () => [{
    name: 'Browse',
    generator: getBrowseBreadcrumb,
},{
    name: 'View',
    generator: getViewBreadcrumb,
},{
    name: 'Create',
    generator: getCreateBreadcrumb,
}];
const generateGetBreadcrumbFunctionName = (resourceNameSingular, resourcePage) => 'get' + resourceNameSingular + resourcePage + 'Breadcrumb';

const generateBreadcrumbsForResource = resource => {
    breadcrumbData[resource.singular] = {};
    getResourcePages().map(resourcePage => {

        const resourcePageFunctionName = generateGetBreadcrumbFunctionName(resource.singular, resourcePage.name);
        const resourcePageFunction = (isActive = false) => resourcePage.generator(resource.plural, '/' + resource.plural.toLowerCase(), isActive)

        breadcrumbGenerator[resourcePageFunctionName] = resourcePageFunction;

        breadcrumbData[resource.singular][resourcePage.name] = [breadcrumbGenerator.getHomeBreadcrumb()];
        // if ('Browse' != resourcePage.name) { // Add Browse Before Page on Non-Browse Pages
        //     breadcrumbData[resource.singular][resourcePage.name].push( (generateGetBreadcrumbFunctionName(resource.singular, 'Browse'))() );
        // } // End of Add Browse Before Page on Non-Browse Pages
        breadcrumbData[resource.singular][resourcePage.name].push(resourcePageFunction(true));

    });
};

resourcesToGenerateBreadcrumbsFor.map(generateBreadcrumbsForResource);

/* eslint no-console: ["error", { allow: ["log"] }] */
console.log('Breadcrumb Generated Data:', breadcrumbData); // TODO Delete This

export default {
    data: () => breadcrumbData,
    methods: breadcrumbGenerator,
};