define(['domReady'], function (domReady) {

  var returnObj = {};

  returnObj['Request'] = function(url, method, params, async, type){
    return new Promise(function (resolve, reject) {
      var _req = new XMLHttpRequest();

      _req.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(_req.response);
        } else {
          reject({
            status: this.status,
            statusText: _req.statusText
          });
        }
      };
      _req.onerror = function () {
        reject({
          status: this.status,
          statusText: _req.statusText
        });
      };

      _req.open(method.toUpperCase(), url, !!async);
      
      type = type.toLowerCase() === 'json' ? 'application/json;charset=UTF-8' : 
             type.toLowerCase() === 'form' ? 'application/x-www-form-urlencoded' :
             'text/plain';

      _req.setRequestHeader('Content-type', type);

      if(params !== null){
        if(typeof params === 'string'){
          _req.send(params);
        }
        else if(typeof params === 'object'){
          _req.send(JSON.stringify(params));
        }
      }
    });
  };

  returnObj['SerializeForm'] = function(form){
    var data = {};
    for(var i = 0; i < form.length; i++){
      var kid = form[i];
      var targetProp = kid.name;
      if(targetProp && targetProp.trim()){
        var value = kid.value || '';
        if(data[targetProp]){
          if(!data[targetProp].push){
            data[targetProp] = [data[value]];
          }
          else{
            data[targetProp].push(value);
          }
        }
        else{
          data[targetProp] = value;
        }
      }
    }
    return data;
  };

  returnObj['Confirm'] = function(message){
    return new Promise(function(resolve, reject){

      var confirm = document.getElementById('confirm');
      confirm.style.opacity = 1;
      confirm.style['pointer-events']= "all";

      var backgroundShadow = document.getElementById('background-shadow');
      backgroundShadow.style.opacity = 1;
      
      var content = document.getElementById('confirm-content');
      content.innerHTML = message;

      var no = document.getElementById('confirm-no');
      no.onclick = function(e){
        e.preventDefault();
        e.stopPropagation();

        confirm.style.opacity = 0;
        confirm.style['pointer-events']= "none";
        
        backgroundShadow.style.opacity = 0;

        resolve(false);
      }

      var yes = document.getElementById('confirm-yes');
      yes.onclick = function(e){
        e.preventDefault();
        e.stopPropagation();

        confirm.style.opacity = 0;
        confirm.style['pointer-events']= "none";
        
        backgroundShadow.style.opacity = 0;
        
        resolve(true);
      }
    });
  };

  var _createElement = function(type, options){
    var elem = document.createElement(type);
    var keys = Object.keys(options);
    for(var i = 0; i < keys.length; i++){
      elem.setAttribute(keys[i], options[keys[i]]);
    }
    return elem;
  };

  returnObj['CreateElement'] = _createElement;

  var _insertAfter = function(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  };

  returnObj['InsertAfter'] = _insertAfter;


  /*var counter = 0;
  // TODO: Finish custom tooltip
  var _showHoverTip = function(e){
    var top = e.offsetTop;
    var left = e.offsetLeft;
    var height = e.offsetHeight;
    var width = e.offsetWidth;

    var hoverTip = _createElement('div', {
      'id': (e.id || e.name || counter++) + '_hovertip',
      'class': 'hovertip',
      'innerHTML': e.getAttribute('data-disabled-title')
    });

    _insertAfter(e, hoverTip);
  }*/

  var _init = function() {
    var disabledElems = document.querySelectorAll('[disabled]');
    for(var i = 0; i < disabledElems.length; i++){
      var elem = disabledElems[i];
      var title = elem.getAttribute('data-disabled-title');
      if(title){
        elem.title = title;
        //elem.onhover = _showHoverTip;
      }
    }
  };

  // When the document is loaded, apply formatting, and bind events
  domReady(_init);

  return returnObj;
});