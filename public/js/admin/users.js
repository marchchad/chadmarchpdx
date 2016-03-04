"use strict";

define(['common', 'domReady'], function (C, domReady) {

  var deactivate = null;
  var title = "";

  var _toggleButtonState = function (value) {
    deactivate = deactivate || document.getElementById('deactivate');
    deactivate.disabled = !!value;
    if (value == false) {
      deactivate.title = "";
    }
    else {
      deactivate.title = deactivate.getAttribute("data-disabled-title");
    }
  };
  
  var _bindFormRules = function(){
    deactivate = C.GetElem('deactivate');

    deactivate.onclick = function(e){
      e.preventDefault();
      e.stopPropagation();

      var resp = C.Confirm("Are you sure you want to deactivate this keg?");
      resp.then(function(deactivate){
        if (deactivate) {
          var form = C.SerializeForm(e.target.parentNode.parentNode);
          //submitForm(form);
          console.log('form: ', form);
        }
      });
    }
  };
  
  var _setupUserSelect = function () {
    var users = C.GetElem('userlist');
    if(userdata){
      users.onchange = function (e) {
        var id = e.target.value;
        var username = C.GetElem('username');
        for (var i = 0; i < userdata.length; i++){
          var user = userdata[i];
          if (user.userid == id) {
            C.PopulateForm(user);
            username.readOnly = true;
            _toggleButtonState(false);
            break;
          }
          else {
            username.readOnly = false;
            _toggleButtonState(true);
          }
        }
      }
    }
    else {
      
    }
  }

  var _init = function () {
    _setupUserSelect();
    _bindFormRules();
  };

  // Public object for reference to functions and properties
  var adminObj = {};

  // When the document is loaded, apply formatting, and bind events
  domReady(_init);

  return adminObj;
});