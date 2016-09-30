import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import string from 'dojo/string';
import domClass from 'dojo/dom-class';
import connect from 'dojo/_base/connect';
import ErrorManager from './ErrorManager';
import convert from './Convert';
import _SDataDetailMixin from './_SDataDetailMixin';

/**
 * _LegacySDataEditMixin enables legacy SData operations for the Edit view.
 *
 * @alternateClassName _LegacySDataEditMixin
 */
const __class = declare('argos._LegacySDataEditMixin', [_SDataDetailMixin], {
  requestData: function requestData() {
    const request = this.createRequest();
    if (request) {
      request.read({
        success: this.onRequestDataSuccess,
        failure: this.onRequestDataFailure,
        scope: this,
      });
    }
  },
  /**
   * Handler when an error occurs while request data from the SData endpoint.
   * @param {Object} response The response object.
   * @param {Object} o The options that were passed when creating the Ajax request.
   */
  onRequestDataFailure: function onRequestDataFailure(response, o) {
    alert(string.substitute(this.requestErrorText, [response, o])); // eslint-disable-line
    ErrorManager.addError('failure', response);
  },
  /**
   * Handler when a request to SData is successful, calls processEntry
   * @param {Object} entry The SData response
   */
  onRequestDataSuccess: function onRequestDataSuccess(entry) {
    this.processEntry(entry);

    if (this.options.changes) {
      this.changes = this.options.changes;
      this.setValues(this.changes);
    }
  },
  /**
   * Creates Sage.SData.Client.SDataSingleResourceRequest instance and sets a number of known properties.
   *
   * List of properties used `this.property/this.options.property`:
   *
   * `entry['$key']/key`, `contractName`, `resourceKind`, `querySelect`, `queryInclude`, and `queryOrderBy`
   *
   * @return {Object} Sage.SData.Client.SDataSingleResourceRequest instance.
   */
  createRequest: function createRequest() {
    const request = new Sage.SData.Client.SDataSingleResourceRequest(this.getService());
    const key = (this.entry && this.entry.$key) || this.options.key;

    if (key) {
      request.setResourceSelector(string.substitute("'${0}'", [key]));
    }

    if (this.contractName) {
      request.setContractName(this.contractName);
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

    return request;
  },
  onUpdate: function onUpdate(values) {
    const entry = this.createEntryForUpdate(values);
    const request = this.createRequest();
    if (request) {
      request.update(entry, {
        success: this.onUpdateSuccess,
        failure: this.onUpdateFailure,
        scope: this,
      });
    }
  },
  /**
   * Handler for when update() is successfull, publishes the global `/app/refresh` event which
   * forces other views listening for this resourceKind to refresh.
   *
   * Finishes up by calling {@link #onUpdateCompleted onUpdateCompleted}.
   *
   * @param entry
   */
  onUpdateSuccess: function onUpdateSuccess(entry) {
    this.enable();

    connect.publish('/app/refresh', [{
      resourceKind: this.resourceKind,
      key: entry.$key,
      data: entry,
    }]);

    this.onUpdateCompleted(entry);
  },
  /**
   * Handler when an error occurs while request data from the SData endpoint.
   * @param {Object} response The response object.
   * @param {Object} o The options that were passed when creating the Ajax request.
   */
  onUpdateFailure: function onUpdateFailure(response, o) {
    this.enable();
    this.onRequestFailure(response, o);
  },
  /**
   * Handler when an error occurs while request data from the SData endpoint.
   * @param {Object} response The response object.
   * @param {Object} o The options that were passed when creating the Ajax request.
   */
  onRequestFailure: function onRequestFailure(response, o) {
    alert(string.substitute(this.requestErrorText, [response, o])); // eslint-disable-line
    ErrorManager.addError('failure', response);
  },
  /**
   * Gathers the values for the entry to send back to SData and returns the appropriate
   * create for inserting or updating.
   * @return {Object} SData entry/payload
   */
  createEntry: function createEntry() {
    const values = this.getValues();
    return this.inserting ? this.createEntryForInsert(values) : this.createEntryForUpdate(values);
  },
  /**
   * Takes the values object and adds in $key, $etag and $name
   * @param {Object} values
   * @return {Object} Object with added properties
   */
  createEntryForUpdate: function createEntryForUpdate(v) {
    const values = this.convertValues(v);

    return lang.mixin(values, {
      $key: this.entry.$key,
      $etag: this.entry.$etag,
      $name: this.entry.$name,
    });
  },
  /**
   * Takes the values object and adds in $name
   * @param {Object} values
   * @return {Object} Object with added properties
   */
  createEntryForInsert: function createEntryForInsert(v) {
    const values = this.convertValues(v);
    return lang.mixin(values, {
      $name: this.entityName,
    });
  },
  /**
   * Does the reverse of {@link #convertEntry convertEntry} in that it loops the payload being
   * sent back to SData and converts Date objects into SData date strings
   * @param {Object} values Payload
   * @return {Object} Entry with string dates
   */
  convertValues: function convertValues(values) {
    for (const n in values) {
      if (values[n] instanceof Date) {
        values[n] = this.getService().isJsonEnabled() ? convert.toJsonStringFromDate(values[n]) : convert.toIsoStringFromDate(values[n]);
      }
    }

    return values;
  },
  /**
   * Extends the getContext function to also include the `resourceKind` of the view, `insert`
   * state and `key` of the entry (false if inserting)
   */
  getContext: function getContext() {
    return lang.mixin(this.inherited(arguments), {
      resourceKind: this.resourceKind,
      insert: this.options.insert,
      key: this.options.insert ? false : this.options.entry && this.options.entry.$key,
    });
  },
  onInsert: function onInsert(values) {
    const entry = this.createEntryForInsert(values);
    const request = this.createRequest();

    if (request) {
      request.create(entry, {
        success: this.onInsertSuccess,
        failure: this.onInsertFailure,
        scope: this,
      });
    }
  },
  /**
   * Handler for when insert() is successfull, publishes the global `/app/refresh` event which
   * forces other views listening for this resourceKind to refresh.
   *
   * Finishes up by calling {@link #onInsertComplete onInsertComplete}.
   *
   * @param entry
   */
  onInsertSuccess: function onInsertSuccess(entry) {
    this.enable();

    connect.publish('/app/refresh', [{
      resourceKind: this.resourceKind,
      key: entry.$key,
      data: entry,
    }]);

    this.onInsertCompleted(entry);
  },
  /**
   * Handler for when instert() fails, enables the form and passes the results to the default
   * error handler which alerts the user of an error.
   * @param response
   * @param o
   */
  onInsertFailure: function onInsertFailure(response, o) {
    this.enable();
    this.onRequestFailure(response, o);
  },
  onRefreshUpdate: function onRefreshUpdate() {
    if (this.options.entry) {
      this.processEntry(this.options.entry);

      // apply changes as modified data, since we want this to feed-back through
      if (this.options.changes) {
        this.changes = this.options.changes;
        this.setValues(this.changes);
      }
    } else {
      // if key is passed request that keys entity and process
      if (this.options.key) {
        this.requestData();
      }
    }
  },
  /**
   * Handles the SData response by converting the date strings and storing the fixed extry to
   * `this.entry` and applies the values.
   * @param entry
   */
  processEntry: function processEntry(entry) {
    this.entry = this.convertEntry(entry || {});
    this.setValues(this.entry, true);

    domClass.remove(this.domNode, 'panel-loading');
  },
});

lang.setObject('Sage.Platform.Mobile._LegacySDataEditMixin', __class);
export default __class;
