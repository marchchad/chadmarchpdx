define(['domReady'], function (domReady) {
  
  function AsArray(nodeList) {
    /**
     * This will take in a nodeList and return the elements as an array.
     * @param: NodeList
     * @returns: Array<NodeList>
     */
    return Array.prototype.slice.call(nodeList);
  }

  var Common = {};
  
  Common['genericError'] = 'An error occurred with your request.';

  Common['Request'] = function(url, method, params, type, async){
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

      _req.open(method.toUpperCase(), url, (async || true));
      
      type = type.toLowerCase() === 'json' ? 'application/json;charset=UTF-8' : 
             type.toLowerCase() === 'form' ? 'application/x-www-form-urlencoded' :
             'text/plain';

      _req.setRequestHeader('Content-type', type);

      if(typeof params === 'string'){
        _req.send(params);
      }
      else if(typeof params === 'object'){
        _req.send(JSON.stringify(params));
      }
      else {
        _req.send();
      }
    });
  };

  Common['SerializeForm'] = function(form){
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

  Common['Confirm'] = function(message){
    return new Promise(function(resolve, reject){

      var confirm = document.getElementById('confirm');
      confirm.style.opacity = '1';
      confirm.style['pointer-events']= 'all';

      var backgroundShadow = document.getElementById('background-shadow');
      backgroundShadow.style.opacity = '1';
      
      var content = document.getElementById('confirm-content');
      var msg = Common.CreateElement('p', { 'innerHTML': message });
      content.innerHTML = msg.outerHTML;

      var no = document.getElementById('confirm-no');
      no.onclick = function(e){
        e.preventDefault();
        e.stopPropagation();

        confirm.style.opacity = '0';
        confirm.style['pointer-events']= 'none';
        
        backgroundShadow.style.opacity = '0';

        resolve(false);
      };

      var yes = document.getElementById('confirm-yes');
      yes.onclick = function(e){
        e.preventDefault();
        e.stopPropagation();

        confirm.style.opacity = '0';
        confirm.style['pointer-events']= 'none';
        
        backgroundShadow.style.opacity = '0';
        
        resolve(true);
      }
    });
  };

  Common['CreateElement'] = function (type, options) {
    /**
     * Creates an element of the provided type and sets attributes based on the options provided.
     * @param type <String> The type of element you want to create provided as a string.
     * @param options <Object> Any values and/or attributes to be set for the elemen.
     * @return elem <DomElement> The created dom element.
     */
    var elem = document.createElement(type);
    var keys = Object.keys(options);
    for (var i = 0; i < keys.length; i++){
      var attr = keys[i];
      if (attr === 'innerHTML') {
        elem[attr] = options[attr];
        continue;
      }
      elem.setAttribute(keys[i], options[keys[i]]);
    }
    return elem;
  };

  Common['InsertAfter'] = function (referenceNode, newNode) {
    /**
     * Inserts a dom element/node after a provided reference node.
     * @param referenceNode <DomElement/Node> The reference node to insert after
     * @param newNode <DomElement/Node> The node to be inserted
     * @returns None
     */
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  };
  
  Common['SetElemValue'] = function (elem, value, disabled) {
    /**
     * Sets the value of the given element.
     * @param elem <DomElement/Node|String> Element to set the value for
     * @param value <String|Integer|Float|Date> Value to set
     * @returns None 
     */
    disabled = !!disabled;
    var els = [];
    elem = typeof elem === "string" ? document.getElementById(elem) : elem;
    if (elem) {
      els.push(elem);
    }
    if(els.length === 0){
      els = Array.prototype.slice.call(document.getElementsByClassName(elem));
    }
    for (var i = 0; i < els.length; i++){
      var el = els[i];
      if (el.type === 'range') {
        el = el.nextElementSibling;
      }
      var type = el.type;
      if (type === 'number') {
        var step = el.step;
        if (step < 1) {
          value = parseFloat(value);
        }
        else {
          value = parseInt(value);
        }
        
        if(typeof value && isNaN(value)){
          value = 0;
        }
      }
      el.value = value;
      if(el.nodeName !== 'SELECT'){
        el.innerHTML = value;
      }
      el.disabled = disabled;
      if (el.onchange != null) {
        el.onchange();
      }
    }
  };
  
  Common['PopulateForm'] = function (data) {
    /**
     * Populates a form based on the properties of the data object passed in.
     */
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++){
      var key = keys[i];
      var target = Common.GetElem(key);
      if(target){
        target.value = data[key];
      }
    }
  };
  
  Common['GetElem'] = function (id) {
    return document.getElementById(id);
  };
  
  Common['GetElements'] = function (className) {
    /**
     * Gets DOM elements by the given class name and returns them as an Array<DOMElements>.
     * @param className <String> Class name used to query the DOM for matching elements.
     * @returns Array<DOMElements>
     */
    return AsArray(document.getElementsByClassName(className));
  };
  
  Common['FormatDate'] = function (value) {
    if (!value) {
      return;
    }
    var date = new Date(value);
    var day = date.getDate().toString();
    var month = (date.getMonth() + 1).toString();
    return [date.getFullYear(), (month.length === 1 ? "0" + month : month), (day.length === 1 ? "0" + day : day)].join("-");
  };

  /*var counter = 0;
  // TODO: Finish custom tooltip
  var _showHoverTip = function(e){
    var top = e.offsetTop;
    var left = e.offsetLeft;
    var height = e.offsetHeight;
    var width = e.offsetWidth;

    var hoverTip = Common._createElement('div', {
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

  return Common;
});