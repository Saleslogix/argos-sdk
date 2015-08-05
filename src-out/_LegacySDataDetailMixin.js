define('argos/_LegacySDataDetailMixin', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/dom-class', 'dojo/dom-construct', 'dojo/string', './ErrorManager'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojoDomClass, _dojoDomConstruct, _dojoString, _ErrorManager) {
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  /*
   * Copyright (c) 1997-2014, SalesLogix, NA., LLC. All rights reserved.
   */

  var _declare = _interopRequireDefault(_dojo_baseDeclare);

  var _lang = _interopRequireDefault(_dojo_baseLang);

  var _domClass = _interopRequireDefault(_dojoDomClass);

  var _domConstruct = _interopRequireDefault(_dojoDomConstruct);

  var _string = _interopRequireDefault(_dojoString);

  var _ErrorManager2 = _interopRequireDefault(_ErrorManager);

  /**
   * _LegacySDataDetailMixin enables legacy SData operations for the Detail view.
   *
   * @alternateClassName _LegacySDataDetailMixin
   */
  var __class = (0, _declare['default'])('argos._LegacySDataDetailMixin', null, {
    /**
     * Initiates the SData request.
     */
    requestData: function requestData() {
      var request = this.createRequest();

      if (request) {
        request.read({
          success: this.onRequestDataSuccess,
          failure: this.onRequestDataFailure,
          aborted: this.onRequestDataAborted,
          scope: this
        });
      }
    },
    /**
     * Creates Sage.SData.Client.SDataSingleResourceRequest instance and sets a number of known properties.
     *
     * List of properties used `this.property/this.options.property`:
     *
     * `/key`, `resourceKind`, `querySelect`, `queryInclude`, `queryOrderBy`, and `contractName`
     *
     * @return {Object} Sage.SData.Client.SDataSingleResourceRequest instance.
     */
    createRequest: function createRequest() {
      var request = new Sage.SData.Client.SDataSingleResourceRequest(this.getService());

      /* test for complex selector */
      /* todo: more robust test required? */
      if (/(\s+)/.test(this.options.key)) {
        request.setResourceSelector(this.options.key);
      } else {
        request.setResourceSelector(_string['default'].substitute('\'${0}\'', [this.options.key]));
      }

      if (this.resourceKind) {
        request.setResourceKind(this.resourceKind);
      }

      if (this.querySelect) {
        request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.Select, this.querySelect.join(','));
      }

      if (this.queryInclude) {
        request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.Include, this.queryInclude.join(','));
      }

      if (this.queryOrderBy) {
        request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.OrderBy, this.queryOrderBy);
      }

      if (this.contractName) {
        request.setContractName(this.contractName);
      }

      return request;
    },
    /**
     * Saves the SData response to `this.entry` and invokes {@link #processLayout processLayout} by passing the customized
     * layout definition. If no entry is provided, empty the screen.
     * @param {Object} entry SData response
     */
    processEntry: function processEntry(entry) {
      this.entry = entry;

      if (this.entry) {
        this.processLayout(this._createCustomizedLayout(this.createLayout()), this.entry);
      } else {
        this.set('detailContent', '');
      }
    },
    /**
     * Handler when a request to SData is successful
     * @param {Object} entry The SData response
     */
    onRequestDataSuccess: function onRequestDataSuccess(entry) {
      this.processEntry(entry);
      _domClass['default'].remove(this.domNode, 'panel-loading');
    },
    /**
     * Handler when an error occurs while request data from the SData endpoint.
     * @param {Object} response The response object.
     * @param {Object} o The options that were passed when creating the Ajax request.
     */
    onRequestDataFailure: function onRequestDataFailure(response, o) {
      if (response && response.status === 404) {
        _domConstruct['default'].place(this.notAvailableTemplate.apply(this), this.contentNode, 'last');
      } else {
        alert(_string['default'].substitute(this.requestErrorText, [response, o])); // eslint-disable-line
        _ErrorManager2['default'].addError('failure', response);
      }

      _domClass['default'].remove(this.domNode, 'panel-loading');
    },
    /**
     * Handler when an a request is aborted from an SData endpoint.
     *
     * Clears the `this.options` object which will by default force a refresh of the view.
     *
     * @param {Object} response The response object.
     * @param {Object} o The options that were passed when creating the Ajax request.
     */
    onRequestDataAborted: function onRequestDataAborted(response /*, o*/) {
      this.options = false; // force a refresh
      _ErrorManager2['default'].addError('aborted', response);
      _domClass['default'].remove(this.domNode, 'panel-loading');
    }
  });

  _lang['default'].setObject('Sage.Platform.Mobile._LegacySDataDetailMixin', __class);
  module.exports = __class;
});
