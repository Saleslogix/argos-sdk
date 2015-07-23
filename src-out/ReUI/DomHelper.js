define('argos/ReUI/DomHelper', ['exports', 'module', 'dojo/dom-attr'], function (exports, module, _dojoDomAttr) {
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _domAttr = _interopRequireDefault(_dojoDomAttr);

    module.exports = {
        select: function select(el) {
            _domAttr['default'].set(el, 'selected', 'true');
        },
        unselect: function unselect(el) {
            _domAttr['default'].remove(el, 'selected');
        }
    };
});
