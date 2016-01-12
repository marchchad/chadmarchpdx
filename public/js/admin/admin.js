"use strict"

define(['common', 'domReady'], function (common, domReady) {

  // Private variables and functions
  var _populateSibling = function(e){
    var _target = e.target;
    if(_target.type === 'range'){
      _target.nextSibling.value = _target.value;
    }
    else{
      _target.previousSibling.value = _target.value;
    }
  };

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

  var _setupInputs = function(){
    var inputs = document.getElementsByTagName('input');
    for(var i = 0; i < inputs.length; i++){
      var _input = inputs[i];
      if(_input.type == 'range'){
        var _sibling = common.CreateElement('input', {
          'type': 'number',
          'min': '1',
          'max': '15.5',
          'step': '0.5',
          'class': 'range-input'
        });
        common.InsertAfter(_input, _sibling);
        _input.oninput = _populateSibling;
      }
    }
  };

  var _init = function() {
    _setupInputs();
    _bindForms();
  };

  // Public object for reference to functions and properties
  var adminObj = {}

  // When the document is loaded, apply formatting, and bind events
  domReady(_init);

  return adminObj;
});