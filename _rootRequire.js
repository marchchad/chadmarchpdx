/**
 * Pass in the file path as a string of the module you  
 * wish to report inreference to the root of the project
 * @param  {String}
 * @return {Object}
 */
var rootRequire = function(module) {
  module = module.indexOf("\\") === -1 ? "\\" + module : module;
  return require(__dirname + module);
}
module.exports = GLOBAL._rootRequire = rootRequire;