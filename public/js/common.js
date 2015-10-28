//The build will inline common dependencies into this file.

//For any third party dependencies, like jQuery, place them in the lib folder.

//Configure loading modules from the lib directory,
//except for 'app' ones, which are in a sibling
//directory.
requirejs.config({
    baseUrl: 'js',
    paths: {
        app: '',
        d3: 'lib/d3.min',
        d3Donut: 'lib/d3Donut',
        domReady: 'lib/domReady'
    }
});