"use strict"

define(['/js/lib/common.js', '/js/lib/domReady.js'], function (common, domReady) {
  /**
   * Serializes then posts form to configured action and method.
   * @param  {HTMLFormElement} form
   * @return {undefined}
   */

  var _onSubmit = function(e){
    e.preventDefault();
    e.stopPropagation();
    var params = common.SerializeForm(e.target);
    var post = common.Request(e.target.action, e.target.method, params, true, 'JSON');
    console.log(post);
  };

  var _bindForms = function(){
    var forms = document.getElementsByTagName('form');
    for(var i = 0; i < forms.length; i++){
      forms[i].onsubmit = _onSubmit;
    }
  };

  var _init = function() {
    _bindForms();
    if(Error){
      console.error(Error);
    }
  };

  // Public object for reference to functions and properties
  var loginObj = {}

  // When the document is loaded, apply formatting, and bind events
  domReady(_init);

  return loginObj;
});