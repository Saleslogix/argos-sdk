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

  exports.default = (0, _declare2.default)('argos.Store.PouchDB', null, /** @lends module:argos/Store/PouchDB.prototype */{

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