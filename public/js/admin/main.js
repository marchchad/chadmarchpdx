//Load the config, then load the app logic for this page.
require(['../config'], function(){
  // require the submodule based on the url
  if(window.location.pathname.indexOf('admin') > -1){
    require(['admin/admin']);
  }
  else if(window.location.pathname.indexOf('login') > -1){
    require(['admin/login']);
  }
});