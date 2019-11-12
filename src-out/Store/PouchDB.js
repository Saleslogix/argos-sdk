define('argos/Store/PouchDB', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/_base/Deferred', 'dojo/store/util/QueryResults'], function (module, exports, _declare, _lang, _Deferred, _QueryResults) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _Deferred2 = _interopRequireDefault(_Deferred);

  var _QueryResults2 = _interopRequireDefault(_QueryResults);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = (0, _declare2.default)('argos.Store.PouchDB', null, /** @lends argos.Store.PouchDB# */{

    // interface properties
    /**
     * @property {String} idProperty Name of the property to use as the identifier
     */
    idProperty: '_id',

    /**
     * @property {Array} data Array of objects. If the store has a collection of cached objects,
     * it can make this available in this property.
     */
    data: null,

    /**
     * @property {String} databaseName Name of the local PouchDB database
     */
    databaseName: 'argos',

    // Additional properties for metadata fetching
    revisionProperty: '_rev',

    // Private
    _db: null,

    /**
     * @constructs
     */
    constructor: function constructor(props) {
      _lang2.default.mixin(this, props);
      this._db = new PouchDB(this.databaseName, {
        auto_compaction: true
      });
      this.data = [];
    },
    get: function get(id, options) {
      var deferred = new _Deferred2.default();
      this._db.get(id, options || {}, function (err, doc) {
        if (!err) {
          deferred.resolve(doc);
        } else {
          deferred.reject(err);
        }
      });

      return deferred.promise;
    },
    /**
     * Queries the store for objects. This does not alter the store, but returns a
     * set of data from the store.
     *
     * @param {String|Object|Function} query The query to use for retrieving objects from the store.
     *   A map function by itself (no reduce).
     *   A full CouchDB-style map/reduce object: {map : ..., reduce: ...}.
     *   The name of a view in an existing design document (e.g. 'myview' or 'mydesigndoc/myview').
     * @param {Object} queryOptions
     * @returns {dojo.store.api.Store.QueryResults}
     *
     */
    query: function query(q) {
      var queryOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var deferred = new _Deferred2.default();
      deferred.total = -1;

      // The dojo store interface says query should accept start, count, and sort properties on the queryOptions object
      // We want to allow queryOptions to include PouchDB options, ensure they don't trample each other (PouchDB wins).
      if (queryOptions.start && !queryOptions.skip) {
        queryOptions.skip = queryOptions.start;
      }

      if (queryOptions.count && !queryOptions.limit) {
        queryOptions.limit = queryOptions.count;
      }

      // Query is sorted by key on CouchDB, queryOptions.descending can be set to true.
      // There is no queryOptions.sort array like a dojo store would expect.

      this._db.query(q, queryOptions, function (err, response) {
        if (!err) {
          deferred.total = response.total_rows;
          deferred.resolve(response.rows);
        } else {
          deferred.reject(err);
        }
      });

      return (0, _QueryResults2.default)(deferred.promise); // eslint-disable-line
    },
    /**
     * Stores an object.
     * @param {Object} object The object to store.
     * @param {Object} putOptions Additional directives for storing objects.
     * @param {String|Number} putOptions.id
     * @param {String|Object} putOptions.entity
     * @param {String} putOptions.version
     * @param {Boolean} putOptions.overwrite
     * @returns {String|Number}
     */
    put: function put(object, putOptions) {
      var deferred = new _Deferred2.default();
      function callback(err, response) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(response);
        }
      }

      if (putOptions && putOptions.overwrite) {
        this._db.put(object, putOptions.id || this.getIdentity(object), callback);
      } else {
        this._db.post(object, callback);
      }

      return deferred.promise;
    },
    /**
     * Creates an object, throws an error if the object already exists.
     * @param {Object} object The object to store
     * @param {Object} addOptions Additional directives for creating objects
     * @param {Boolean} addOptions.overwrite
     */
    add: function add(object) {
      var addOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      addOptions.overwrite = false;
      return this.put(object, addOptions);
    },
    /**
     * Removes the document given the id
     * @param id
     * @returns {window.Promise}
     */
    remove: function remove(id) {
      var _this = this;

      return this._db.get(id).then(function (doc) {
        return _this._db.remove(doc);
      });
    },
    /**
     * Returns an object's identity using this.idProperty
     * @param {Object} object The object to get the identity from
     * @param {String} string The optional identity property
     * @returns {String|Number}
     */
    getIdentity: function getIdentity(object, idProperty) {
      if (idProperty) {
        return _lang2.default.getObject(idProperty, false, object);
      }
      return _lang2.default.getObject(this.idProperty, false, object);
    },
    queryEngine: function queryEngine() /* query, options*/{},
    /**
     * Not implemented in this store.
     */
    transaction: function transaction() {},
    /**
     * Not implemented in this store.
     */
    getChildren: function getChildren() {},
    /**
     * Returns any metadata about the object. This may include attribution,
     * cache directives, history, or version information.
     *
     * @param {Object} object The object to return metadata for.
     * @return {Object} Object containing the metadata.
     * @return {String|Number} return.id
     */
    getMetadata: function getMetadata(object) {
      if (object) {
        return {
          id: this.getIdentity(object),
          revision: this.getRevision(object)
        };
      }

      return null;
    },
    /**
     * Returns an object's revision using this.revisionProperty
     * @param {Object} object The object to get the revision from
     * @returns {String}
     */
    getRevision: function getRevision(object) {
      return _lang2.default.getObject(this.revisionProperty, false, object);
    },
    createNamedQuery: function createNamedQuery(doc) {
      this._db.put(doc, {
        force: true
      }).catch(function (err) {
        return console.error(err);
      }); // eslint-disable-line
    }
  });
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TdG9yZS9Qb3VjaERCLmpzIl0sIm5hbWVzIjpbImlkUHJvcGVydHkiLCJkYXRhIiwiZGF0YWJhc2VOYW1lIiwicmV2aXNpb25Qcm9wZXJ0eSIsIl9kYiIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJtaXhpbiIsIlBvdWNoREIiLCJhdXRvX2NvbXBhY3Rpb24iLCJnZXQiLCJpZCIsIm9wdGlvbnMiLCJkZWZlcnJlZCIsImVyciIsImRvYyIsInJlc29sdmUiLCJyZWplY3QiLCJwcm9taXNlIiwicXVlcnkiLCJxIiwicXVlcnlPcHRpb25zIiwidG90YWwiLCJzdGFydCIsInNraXAiLCJjb3VudCIsImxpbWl0IiwicmVzcG9uc2UiLCJ0b3RhbF9yb3dzIiwicm93cyIsInB1dCIsIm9iamVjdCIsInB1dE9wdGlvbnMiLCJjYWxsYmFjayIsIm92ZXJ3cml0ZSIsImdldElkZW50aXR5IiwicG9zdCIsImFkZCIsImFkZE9wdGlvbnMiLCJyZW1vdmUiLCJ0aGVuIiwiZ2V0T2JqZWN0IiwicXVlcnlFbmdpbmUiLCJ0cmFuc2FjdGlvbiIsImdldENoaWxkcmVuIiwiZ2V0TWV0YWRhdGEiLCJyZXZpc2lvbiIsImdldFJldmlzaW9uIiwiY3JlYXRlTmFtZWRRdWVyeSIsImZvcmNlIiwiY2F0Y2giLCJjb25zb2xlIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBMkJlLHVCQUFRLHFCQUFSLEVBQStCLElBQS9CLEVBQXFDLGtDQUFtQzs7QUFFckY7QUFDQTs7O0FBR0FBLGdCQUFZLEtBTnlFOztBQVFyRjs7OztBQUlBQyxVQUFNLElBWitFOztBQWNyRjs7O0FBR0FDLGtCQUFjLE9BakJ1RTs7QUFtQnJGO0FBQ0FDLHNCQUFrQixNQXBCbUU7O0FBc0JyRjtBQUNBQyxTQUFLLElBdkJnRjs7QUF5QnJGOzs7QUFHQUMsaUJBQWEsU0FBU0EsV0FBVCxDQUFxQkMsS0FBckIsRUFBNEI7QUFDdkMscUJBQUtDLEtBQUwsQ0FBVyxJQUFY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TyxlQUFLVSxTQUFMLENBQWUsS0FBS3RDLGdCQUFwQixFQUFzQyxLQUF0QyxFQUE2QzRCLE1BQTdDLENBQVA7QUFDRCxLQXJMb0Y7QUFzTHJGaUIsc0JBQWtCLFNBQVNBLGdCQUFULENBQTBCakMsR0FBMUIsRUFBK0I7QUFDL0MsV0FBS1gsR0FBTCxDQUFTMEIsR0FBVCxDQUFhZixHQUFiLEVBQWtCO0FBQ2hCa0MsZUFBTztBQURTLE9BQWxCLEVBRUdDLEtBRkgsQ0FFUztBQUFBLGVBQU9DLFFBQVFDLEtBQVIsQ0FBY3RDLEdBQWQsQ0FBUDtBQUFBLE9BRlQsRUFEK0MsQ0FHVjtBQUN0QztBQTFMb0YsR0FBeEUsQyIsImZpbGUiOiJQb3VjaERCLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAyMDE3IEluZm9yXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuaW1wb3J0IGxhbmcgZnJvbSAnZG9qby9fYmFzZS9sYW5nJztcclxuaW1wb3J0IERlZmVycmVkIGZyb20gJ2Rvam8vX2Jhc2UvRGVmZXJyZWQnO1xyXG5pbXBvcnQgUXVlcnlSZXN1bHRzIGZyb20gJ2Rvam8vc3RvcmUvdXRpbC9RdWVyeVJlc3VsdHMnO1xyXG5cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuU3RvcmUuUG91Y2hEQlxyXG4gKlxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuQ29udmVydFxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuVXRpbGl0eVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgZGVjbGFyZSgnYXJnb3MuU3RvcmUuUG91Y2hEQicsIG51bGwsIC8qKiBAbGVuZHMgYXJnb3MuU3RvcmUuUG91Y2hEQiMgKi8ge1xyXG5cclxuICAvLyBpbnRlcmZhY2UgcHJvcGVydGllc1xyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBpZFByb3BlcnR5IE5hbWUgb2YgdGhlIHByb3BlcnR5IHRvIHVzZSBhcyB0aGUgaWRlbnRpZmllclxyXG4gICAqL1xyXG4gIGlkUHJvcGVydHk6ICdfaWQnLFxyXG5cclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0FycmF5fSBkYXRhIEFycmF5IG9mIG9iamVjdHMuIElmIHRoZSBzdG9yZSBoYXMgYSBjb2xsZWN0aW9uIG9mIGNhY2hlZCBvYmplY3RzLFxyXG4gICAqIGl0IGNhbiBtYWtlIHRoaXMgYXZhaWxhYmxlIGluIHRoaXMgcHJvcGVydHkuXHJcbiAgICovXHJcbiAgZGF0YTogbnVsbCxcclxuXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IGRhdGFiYXNlTmFtZSBOYW1lIG9mIHRoZSBsb2NhbCBQb3VjaERCIGRhdGFiYXNlXHJcbiAgICovXHJcbiAgZGF0YWJhc2VOYW1lOiAnYXJnb3MnLFxyXG5cclxuICAvLyBBZGRpdGlvbmFsIHByb3BlcnRpZXMgZm9yIG1ldGFkYXRhIGZldGNoaW5nXHJcbiAgcmV2aXNpb25Qcm9wZXJ0eTogJ19yZXYnLFxyXG5cclxuICAvLyBQcml2YXRlXHJcbiAgX2RiOiBudWxsLFxyXG5cclxuICAvKipcclxuICAgKiBAY29uc3RydWN0c1xyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgbGFuZy5taXhpbih0aGlzLCBwcm9wcyk7XHJcbiAgICB0aGlzLl9kYiA9IG5ldyBQb3VjaERCKHRoaXMuZGF0YWJhc2VOYW1lLCB7XHJcbiAgICAgIGF1dG9fY29tcGFjdGlvbjogdHJ1ZSxcclxuICAgIH0pO1xyXG4gICAgdGhpcy5kYXRhID0gW107XHJcbiAgfSxcclxuICBnZXQ6IGZ1bmN0aW9uIGdldChpZCwgb3B0aW9ucykge1xyXG4gICAgY29uc3QgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoKTtcclxuICAgIHRoaXMuX2RiLmdldChpZCwgb3B0aW9ucyB8fCB7fSwgKGVyciwgZG9jKSA9PiB7XHJcbiAgICAgIGlmICghZXJyKSB7XHJcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShkb2MpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFF1ZXJpZXMgdGhlIHN0b3JlIGZvciBvYmplY3RzLiBUaGlzIGRvZXMgbm90IGFsdGVyIHRoZSBzdG9yZSwgYnV0IHJldHVybnMgYVxyXG4gICAqIHNldCBvZiBkYXRhIGZyb20gdGhlIHN0b3JlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fEZ1bmN0aW9ufSBxdWVyeSBUaGUgcXVlcnkgdG8gdXNlIGZvciByZXRyaWV2aW5nIG9iamVjdHMgZnJvbSB0aGUgc3RvcmUuXHJcbiAgICogICBBIG1hcCBmdW5jdGlvbiBieSBpdHNlbGYgKG5vIHJlZHVjZSkuXHJcbiAgICogICBBIGZ1bGwgQ291Y2hEQi1zdHlsZSBtYXAvcmVkdWNlIG9iamVjdDoge21hcCA6IC4uLiwgcmVkdWNlOiAuLi59LlxyXG4gICAqICAgVGhlIG5hbWUgb2YgYSB2aWV3IGluIGFuIGV4aXN0aW5nIGRlc2lnbiBkb2N1bWVudCAoZS5nLiAnbXl2aWV3JyBvciAnbXlkZXNpZ25kb2MvbXl2aWV3JykuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHF1ZXJ5T3B0aW9uc1xyXG4gICAqIEByZXR1cm5zIHtkb2pvLnN0b3JlLmFwaS5TdG9yZS5RdWVyeVJlc3VsdHN9XHJcbiAgICpcclxuICAgKi9cclxuICBxdWVyeTogZnVuY3Rpb24gcXVlcnkocSwgcXVlcnlPcHRpb25zID0ge30pIHtcclxuICAgIGNvbnN0IGRlZmVycmVkID0gbmV3IERlZmVycmVkKCk7XHJcbiAgICBkZWZlcnJlZC50b3RhbCA9IC0xO1xyXG5cclxuICAgIC8vIFRoZSBkb2pvIHN0b3JlIGludGVyZmFjZSBzYXlzIHF1ZXJ5IHNob3VsZCBhY2NlcHQgc3RhcnQsIGNvdW50LCBhbmQgc29ydCBwcm9wZXJ0aWVzIG9uIHRoZSBxdWVyeU9wdGlvbnMgb2JqZWN0XHJcbiAgICAvLyBXZSB3YW50IHRvIGFsbG93IHF1ZXJ5T3B0aW9ucyB0byBpbmNsdWRlIFBvdWNoREIgb3B0aW9ucywgZW5zdXJlIHRoZXkgZG9uJ3QgdHJhbXBsZSBlYWNoIG90aGVyIChQb3VjaERCIHdpbnMpLlxyXG4gICAgaWYgKHF1ZXJ5T3B0aW9ucy5zdGFydCAmJiAhcXVlcnlPcHRpb25zLnNraXApIHtcclxuICAgICAgcXVlcnlPcHRpb25zLnNraXAgPSBxdWVyeU9wdGlvbnMuc3RhcnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHF1ZXJ5T3B0aW9ucy5jb3VudCAmJiAhcXVlcnlPcHRpb25zLmxpbWl0KSB7XHJcbiAgICAgIHF1ZXJ5T3B0aW9ucy5saW1pdCA9IHF1ZXJ5T3B0aW9ucy5jb3VudDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBRdWVyeSBpcyBzb3J0ZWQgYnkga2V5IG9uIENvdWNoREIsIHF1ZXJ5T3B0aW9ucy5kZXNjZW5kaW5nIGNhbiBiZSBzZXQgdG8gdHJ1ZS5cclxuICAgIC8vIFRoZXJlIGlzIG5vIHF1ZXJ5T3B0aW9ucy5zb3J0IGFycmF5IGxpa2UgYSBkb2pvIHN0b3JlIHdvdWxkIGV4cGVjdC5cclxuXHJcbiAgICB0aGlzLl9kYi5xdWVyeShxLCBxdWVyeU9wdGlvbnMsIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIGlmICghZXJyKSB7XHJcbiAgICAgICAgZGVmZXJyZWQudG90YWwgPSByZXNwb25zZS50b3RhbF9yb3dzO1xyXG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2Uucm93cyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBRdWVyeVJlc3VsdHMoZGVmZXJyZWQucHJvbWlzZSk7Ly8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU3RvcmVzIGFuIG9iamVjdC5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gc3RvcmUuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHB1dE9wdGlvbnMgQWRkaXRpb25hbCBkaXJlY3RpdmVzIGZvciBzdG9yaW5nIG9iamVjdHMuXHJcbiAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBwdXRPcHRpb25zLmlkXHJcbiAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBwdXRPcHRpb25zLmVudGl0eVxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwdXRPcHRpb25zLnZlcnNpb25cclxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IHB1dE9wdGlvbnMub3ZlcndyaXRlXHJcbiAgICogQHJldHVybnMge1N0cmluZ3xOdW1iZXJ9XHJcbiAgICovXHJcbiAgcHV0OiBmdW5jdGlvbiBwdXQob2JqZWN0LCBwdXRPcHRpb25zKSB7XHJcbiAgICBjb25zdCBkZWZlcnJlZCA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgZnVuY3Rpb24gY2FsbGJhY2soZXJyLCByZXNwb25zZSkge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAocHV0T3B0aW9ucyAmJiBwdXRPcHRpb25zLm92ZXJ3cml0ZSkge1xyXG4gICAgICB0aGlzLl9kYi5wdXQob2JqZWN0LCBwdXRPcHRpb25zLmlkIHx8IHRoaXMuZ2V0SWRlbnRpdHkob2JqZWN0KSwgY2FsbGJhY2spO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fZGIucG9zdChvYmplY3QsIGNhbGxiYWNrKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYW4gb2JqZWN0LCB0aHJvd3MgYW4gZXJyb3IgaWYgdGhlIG9iamVjdCBhbHJlYWR5IGV4aXN0cy5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gc3RvcmVcclxuICAgKiBAcGFyYW0ge09iamVjdH0gYWRkT3B0aW9ucyBBZGRpdGlvbmFsIGRpcmVjdGl2ZXMgZm9yIGNyZWF0aW5nIG9iamVjdHNcclxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGFkZE9wdGlvbnMub3ZlcndyaXRlXHJcbiAgICovXHJcbiAgYWRkOiBmdW5jdGlvbiBhZGQob2JqZWN0LCBhZGRPcHRpb25zID0ge30pIHtcclxuICAgIGFkZE9wdGlvbnMub3ZlcndyaXRlID0gZmFsc2U7XHJcbiAgICByZXR1cm4gdGhpcy5wdXQob2JqZWN0LCBhZGRPcHRpb25zKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZXMgdGhlIGRvY3VtZW50IGdpdmVuIHRoZSBpZFxyXG4gICAqIEBwYXJhbSBpZFxyXG4gICAqIEByZXR1cm5zIHt3aW5kb3cuUHJvbWlzZX1cclxuICAgKi9cclxuICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShpZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2RiLmdldChpZCkudGhlbigoZG9jKSA9PiB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9kYi5yZW1vdmUoZG9jKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhbiBvYmplY3QncyBpZGVudGl0eSB1c2luZyB0aGlzLmlkUHJvcGVydHlcclxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gZ2V0IHRoZSBpZGVudGl0eSBmcm9tXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZyBUaGUgb3B0aW9uYWwgaWRlbnRpdHkgcHJvcGVydHlcclxuICAgKiBAcmV0dXJucyB7U3RyaW5nfE51bWJlcn1cclxuICAgKi9cclxuICBnZXRJZGVudGl0eTogZnVuY3Rpb24gZ2V0SWRlbnRpdHkob2JqZWN0LCBpZFByb3BlcnR5KSB7XHJcbiAgICBpZiAoaWRQcm9wZXJ0eSkge1xyXG4gICAgICByZXR1cm4gbGFuZy5nZXRPYmplY3QoaWRQcm9wZXJ0eSwgZmFsc2UsIG9iamVjdCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGFuZy5nZXRPYmplY3QodGhpcy5pZFByb3BlcnR5LCBmYWxzZSwgb2JqZWN0KTtcclxuICB9LFxyXG4gIHF1ZXJ5RW5naW5lOiBmdW5jdGlvbiBxdWVyeUVuZ2luZSgvKiBxdWVyeSwgb3B0aW9ucyovKSB7fSxcclxuICAvKipcclxuICAgKiBOb3QgaW1wbGVtZW50ZWQgaW4gdGhpcyBzdG9yZS5cclxuICAgKi9cclxuICB0cmFuc2FjdGlvbjogZnVuY3Rpb24gdHJhbnNhY3Rpb24oKSB7fSxcclxuICAvKipcclxuICAgKiBOb3QgaW1wbGVtZW50ZWQgaW4gdGhpcyBzdG9yZS5cclxuICAgKi9cclxuICBnZXRDaGlsZHJlbjogZnVuY3Rpb24gZ2V0Q2hpbGRyZW4oKSB7fSxcclxuICAvKipcclxuICAgKiBSZXR1cm5zIGFueSBtZXRhZGF0YSBhYm91dCB0aGUgb2JqZWN0LiBUaGlzIG1heSBpbmNsdWRlIGF0dHJpYnV0aW9uLFxyXG4gICAqIGNhY2hlIGRpcmVjdGl2ZXMsIGhpc3RvcnksIG9yIHZlcnNpb24gaW5mb3JtYXRpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcmV0dXJuIG1ldGFkYXRhIGZvci5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE9iamVjdCBjb250YWluaW5nIHRoZSBtZXRhZGF0YS5cclxuICAgKiBAcmV0dXJuIHtTdHJpbmd8TnVtYmVyfSByZXR1cm4uaWRcclxuICAgKi9cclxuICBnZXRNZXRhZGF0YTogZnVuY3Rpb24gZ2V0TWV0YWRhdGEob2JqZWN0KSB7XHJcbiAgICBpZiAob2JqZWN0KSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaWQ6IHRoaXMuZ2V0SWRlbnRpdHkob2JqZWN0KSxcclxuICAgICAgICByZXZpc2lvbjogdGhpcy5nZXRSZXZpc2lvbihvYmplY3QpLFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhbiBvYmplY3QncyByZXZpc2lvbiB1c2luZyB0aGlzLnJldmlzaW9uUHJvcGVydHlcclxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gZ2V0IHRoZSByZXZpc2lvbiBmcm9tXHJcbiAgICogQHJldHVybnMge1N0cmluZ31cclxuICAgKi9cclxuICBnZXRSZXZpc2lvbjogZnVuY3Rpb24gZ2V0UmV2aXNpb24ob2JqZWN0KSB7XHJcbiAgICByZXR1cm4gbGFuZy5nZXRPYmplY3QodGhpcy5yZXZpc2lvblByb3BlcnR5LCBmYWxzZSwgb2JqZWN0KTtcclxuICB9LFxyXG4gIGNyZWF0ZU5hbWVkUXVlcnk6IGZ1bmN0aW9uIGNyZWF0ZU5hbWVkUXVlcnkoZG9jKSB7XHJcbiAgICB0aGlzLl9kYi5wdXQoZG9jLCB7XHJcbiAgICAgIGZvcmNlOiB0cnVlLFxyXG4gICAgfSkuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoZXJyKSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICB9LFxyXG59KTtcclxuIl19