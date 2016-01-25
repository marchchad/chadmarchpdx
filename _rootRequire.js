/**
 * Pass in the file path as a string of the module you  
 * wish to report inreference to the root of the project
 * @param  {String}
 * @return {Object}
 */
var rootRequire = function(module) {
  // production env is linux, dev env is windows.
  var pathDelim = process.env.NODE_ENV !== 'development' ? '/' : '\\';
  module = module.indexOf(pathDelim) === -1 ? pathDelim + module : module;
  return require(__dirname + module);
}
module.exports = GLOBAL._rootRequire = rootRequire;