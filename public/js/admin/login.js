"use strict"

define(['common', 'domReady'], function (common, domReady) {

  var _init = function() {
    console.log('works');
  };

  // Public object for reference to functions and properties
  var loginObj = {}

  // When the document is loaded, apply formatting, and bind events
  domReady(_init);

  return loginObj;
});