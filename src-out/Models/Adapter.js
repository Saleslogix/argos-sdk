define('argos/Models/Adapter', ['module', 'exports', './Manager', './Types'], function (module, exports, _Manager, _Types) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Manager2 = _interopRequireDefault(_Manager);

  var _Types2 = _interopRequireDefault(_Types);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    getModel: function getModel(entityName) {
      var Ctor = void 0;
      if (App.onLine) {
        Ctor = _Manager2.default.get(entityName, _Types2.default.SDATA);
      } else {
        Ctor = _Manager2.default.get(entityName, _Types2.default.OFFLINE);
      }

      return typeof Ctor === 'function' ? new Ctor() : false;
    }
  };
  module.exports = exports['default'];
});