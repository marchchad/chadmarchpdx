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
    var errors = document.getElementById('errors');
    if(post.then){
      post.then(function(resp){
        resp = JSON.parse(resp);
        console.log(resp);
        if(resp.success){
          if(resp.redirectUrl){
            window.location = [window.origin, resp.redirectUrl].join("/");
          }
          else{
            window.location = [window.origin, "admin"].join("/");
          }
        }
        else{
          console.error(resp);
          errors.innerHTML = resp.error;
        }
      }
      ,function(err){
        console.error(err);
        errors.innerHTML = err.error;
      }
      );
    }
  };

  var _bindForms = function(){
    var forms = document.getElementsByTagName('form');
    for(var i = 0; i < forms.length; i++){
      forms[i].onsubmit = _onSubmit;
    }
  };

  var _init = function() {
    _bindForms();
  };

  // Public object for reference to functions and properties
  var loginObj = {}

  // When the document is loaded, apply formatting, and bind events
  domReady(_init);

  return loginObj;
});