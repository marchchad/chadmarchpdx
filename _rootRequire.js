module.exports = GLOBAL._rootRequire = function(module) {
  module = module.indexOf("/") === -1 ? "/" + module : module;
  return require(__dirname + module);
}