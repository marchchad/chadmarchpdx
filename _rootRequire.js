/**
 * Pass in the file path as a string of the module you  
 * wish to report inreference to the root of the project
 * @param  {String}
 * @return {Object}
 */
var linuxStyle = '/';
var rootRequire = function(module) {
  // set the correct path delim
  var pathDelim = process.env.OS === undefined || process.env.OS.toLowerCase().indexOf('windows') === -1 ? '/' : '\\';
  if(pathDelim === linuxStyle){
    module = module.replace('\\', '/');
  }
  else{
    module = module.replace('/', '\\');
  }
  // If it's already prefixed, don't add another
  module = module.indexOf(pathDelim) === 0 ? module : pathDelim + module;
  return require(__dirname + module);
}
module.exports = GLOBAL._rootRequire = rootRequire;