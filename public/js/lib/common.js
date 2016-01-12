define([], function () {

  var returnObj = {};

  returnObj['Request'] = function(url, method, params, async, type){
    var _req = new XMLHttpRequest();
    _req.onload = function(e) {
      return { response: e, success: true, message: 'POST succeeded!' };
    };
    _req.onerror = function(e){
      return { response: e, success: false, message: 'POST failed!' };
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
    return _req;
  };

  returnObj['SerializeForm'] = function(form){
    var data = {};
    var kids = form.children;
    for(var i = 0; i < kids.length; i++){
      var kid = kids[i];
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

  returnObj['CreateElement'] = function(type, options){
    var elem = document.createElement(type);
    var keys = Object.keys(options);
    for(var i = 0; i < keys.length; i++){
      elem.setAttribute(keys[i], options[keys[i]]);
    }
    return elem;
  };

  returnObj['InsertAfter'] = function(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  };

  return returnObj;
});