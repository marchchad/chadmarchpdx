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

  var submitForm = function(form){
    var params = common.SerializeForm(form);
    var post = common.Request(form.action, form.method, params, true, 'JSON');
    console.log(post);
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
          'class': 'range-input',
          'value': _input.value
        });
        common.InsertAfter(_input, _sibling);
        _input.oninput = _populateSibling;
      }
    }
  };

  var _init = function() {
    _setupInputs();
    
    var configure = document.getElementById('configure');
    configure.onclick = function(e){
      e.preventDefault();
      e.stopPropagation();
      var form = e.target.parentNode.parentNode;
      submitForm(form);
    };

    var deactivate = document.getElementById('deactivate');
    deactivate.onclick = function(e){
      e.preventDefault();
      e.stopPropagation();
      var resp = common.Confirm("Are you sure you want to deactivate this keg?");
      if(resp){
        var form = e.target.parentNode.parentNode;
        submitForm(form);
      }
    }
  };

  // Public object for reference to functions and properties
  var adminObj = {}

  // When the document is loaded, apply formatting, and bind events
  domReady(_init);

  return adminObj;
});