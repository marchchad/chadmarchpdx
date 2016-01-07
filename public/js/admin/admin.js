define(['common', 'domReady'], function (common, domReady) {

  this.onSubmit = function(e){
    e.preventDefault();
    e.stopPropagation();
    var params = common.SerializeForm(e.target);
    var post = common.Request(e.target.action, e.target.method, params, true, 'JSON');
    console.log(post);
  };

  this.bindForms = function(){
    var forms = document.getElementsByTagName('form');
    for(var i = 0; i < forms.length; i++){
      forms[i].onsubmit = this.onSubmit;
    }
  };

  domReady(function() {
    this.bindForms();
  }).bind(this);
});