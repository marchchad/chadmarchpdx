"use strict";

define(['common', 'domReady'], function (C, domReady) {

  var configure = null;
  var deactivate = null;

  // Private variables and functions
  var _populateSibling = function(e){
    var _target = e ? e.target : this;
    if(_target.type === 'range'){
      _target.nextSibling.value = _target.value;
    }
    else{
      _target.previousSibling.value = _target.value;
    }
  };

  var submitForm = function(form){
    var params = C.SerializeForm(form);
    var post = C.Request(form.action, form.method, params, 'JSON');
    console.log('post response: ', post);
  };

  var _setupRangeInputs = function(){
    var inputs = document.getElementsByTagName('input');
    for(var i = 0; i < inputs.length; i++){
      var _input = inputs[i];
      if(_input.type == 'range'){
        var _sibling = C.CreateElement('input', {
          'type': 'number',
          'min': _input.min,
          'max': _input.max,
          'step': _input.step,
          'class': 'range-input keginfo',
          'value': _input.value
        });
        // onchange is for programmatic changes, oninput is to change once user changes the value
        _sibling.onchange = _populateSibling;
        _sibling.oninput = _populateSibling;
        C.InsertAfter(_input, _sibling);
        _input.onchange = _populateSibling;
        _input.oninput = _populateSibling;
      }
    }
  };

  var _toggleButtonState = function(value){
    configure = configure || C.GetElem('configure');
    configure.disabled = !value ? true : false;

    deactivate = deactivate || C.GetElem('deactivate');
    deactivate.disabled = !value ? true : false;
  };
  
  var updateKegInfo = function (e) {
    var kegid = e.target.value;
    _toggleButtonState(kegid);
    if (kegid) {
      var req = C.Request(window.location.origin + '/api/keg/' + kegid, 'GET', null, 'json');
      req.then(function (keginfo) {
        keginfo = keginfo && typeof keginfo === 'string' ? JSON.parse(keginfo) : keginfo;
        console.log(keginfo);
        if (keginfo) {
          var keys = Object.keys(keginfo);
          for (var i = 0; i < keys.length; i++) {
            var prop = keys[i];
            var value = keginfo[prop];
            C.SetElemValue(prop, value);
          }
        }
      });
    } else {
      var elems = C.GetElements('keginfo');
      for (var i = 0; i < elems.length; i++){
        var elem = elems[i];
        if (elem.nodeName === 'SELECT') {
          elem.value = '';
          continue;
        }
        else if (elem.type === 'date') {
          elem.valueAsDate = '';
          continue;
        }
        elem.value = '-';
        elem.innerHTML = '-';
      }
    }
  }

  var _bindFormRules = function(){
    // Get references to the keg configuration buttons
    configure = C.GetElem('configure');
    deactivate = C.GetElem('deactivate');

    // Get the keglist so we can toggle the button states
    var keglist = C.GetElem('keglist');
    keglist.onchange = updateKegInfo;

    // Bind their click events
    configure.onclick = function(e){
      e.preventDefault();
      e.stopPropagation();
      var form = e.target.parentNode.parentNode;
      submitForm(form);
    };

    deactivate.onclick = function(e){
      e.preventDefault();
      e.stopPropagation();

      var resp = C.Confirm("Are you sure you want to deactivate this keg?");
      resp.then(function(deactivate){
        if (deactivate) {
          var finished = C.GetElem('finished');
          if (finished) {
            C.SetElemValue(finished, C.FormatDate(new Date()));
          }
          var form = C.SerializeForm(e.target.parentNode.parentNode);
          //submitForm(form);
          console.log('form: ', form);
        }
      });
    }
  };
  
  function _formatTables() {
    var tables = document.getElementsByTagName('table');
    for (var i = 0; i < tables.length; i++){
      var cells = tables[i].querySelectorAll('td');
      var cellCount = cells.length;
      var cellWidth = 100 / cellCount;
      for (var j = 0; j < cellCount; j++){
        cells[j].style.width = cellWidth + "%";
      }
    }
  }

  var _init = function() {
    _setupRangeInputs();
    _bindFormRules();
    _formatTables();
  };

  // Public object for reference to functions and properties
  var adminObj = {};

  // When the document is loaded, apply formatting, and bind events
  domReady(_init);

  return adminObj;
});