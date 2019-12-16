define("argos/Scene", ["module", "exports"], function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Scene = function Scene(store) {
    _classCallCheck(this, Scene);

    this.viewset = [];
    this.store = store;
  };

  exports.default = Scene;
  module.exports = exports["default"];
});