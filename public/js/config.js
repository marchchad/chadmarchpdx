//The build will inline common dependencies into this file.

//Configure loading modules from the lib directory,
//except for 'app' ones, which are in a sibling
//directory.
requirejs.config({
    baseUrl: '/js',
    paths: {
        app: '',
        common: 'lib/common',
        d3: 'lib/d3.min',
        d3Donut: 'lib/d3Donut',
        donutProps: 'lib/donutProps',
        domReady: 'lib/domReady'
    }
});