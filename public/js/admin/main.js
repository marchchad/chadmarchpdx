//Load the config, then load the app logic for this page.
require(['../config'], function () {
  var url = window.location.pathname;
  // require the submodule based on the url
  if(url.indexOf('login') > -1
    || url.indexOf('signup') > -1){
    require(['/js/admin/login_signup.js']);
  }
  else if (url.indexOf('users') > -1) {
    require(['/js/admin/users.js']);
  }
  else if (url.indexOf('recipes') > -1) {
    require(['/js/admin/recipes.js']);
  }
  else{
    require(['/js/admin/admin.js']);
  }
});