//Load the config, then load the app logic for this page.
require(['../config'], function(){
  // require the submodule based on the url
  if(window.location.pathname.indexOf('login') > -1
    || window.location.pathname.indexOf('signup') > -1){
    require(['/js/admin/login_signup.js']);
  }
  else{
    require(['/js/admin/admin.js']);
  }
});