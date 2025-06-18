/*
 * Interop for AMD modules to return the direct AMD binding instead of a
 * `{ default: amdModule }` object from `PentaSystem.import`
 * 
 * Note: This extra is deprecated and will be removed in the next major.
 */
(function (global) {
  var systemJSPrototype = global.PentaSystem.constructor.prototype;
  var originalImport = systemJSPrototype.import;

  systemJSPrototype.import = function () {
    return originalImport.apply(this, arguments).then(function (ns) {
      return ns.__useDefault ? ns.default : ns;
    });
  };
})(typeof self !== 'undefined' ? self : global);
