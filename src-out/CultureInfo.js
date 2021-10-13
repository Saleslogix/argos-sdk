define('argos/CultureInfo', ['module', 'exports', 'dojo/_base/lang'], function (module, exports, _lang) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function () {
    // eslint-disable-line
    const localeContext = window.regionalContext;
    const entity = localeContext.getEntitySync('CultureInfo');

    if (!entity) {
      throw new Error('Failed loading CultureInfo.');
    }

    const parsed = JSON.parse(entity.value);
    _lang2.default.setObject('Mobile.CultureInfo', parsed);
  };

  var _lang2 = _interopRequireDefault(_lang);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  module.exports = exports['default'];
});