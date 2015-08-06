define('argos/Groups/_GroupBySection', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang) {
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _declare = _interopRequireDefault(_dojo_baseDeclare);

  var _lang = _interopRequireDefault(_dojo_baseLang);

  /**
   * @class argos.Groups._GroupSection
   */
  var __class = (0, _declare['default'])('argos.Groups._GroupBySection', null, {
    /**
     * @property {String}
     * The unique (within the current form) name of the field
     */
    name: null,
    /**
     * @property {String}
     * Signifies that the field should always be included when the form calls {@link Edit#getValues getValues}.
     */
    displayName: null,
    /**
     * @property {String}
     * The SData property that the field will be bound to.
     */
    groupByProperty: null,
    sortDirection: 'desc',
    sections: null,
    constructor: function constructor(o) {
      _lang['default'].mixin(this, o);
    },
    init: function init() {},
    getGroupSection: function getGroupSection() {},
    getOrderByQuery: function getOrderByQuery() {
      return this.groupByProperty + ' ' + this.sortDirection;
    }
  });

  _lang['default'].setObject('Sage.Platform.Mobile.Groups._GroupBySection', __class);
  module.exports = __class;
});
/*entry*/
