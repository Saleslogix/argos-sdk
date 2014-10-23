/*
 * Copyright (c) 1997-2014, SalesLogix, NA., LLC. All rights reserved.
 */

/**
 * @class Sage.Platform.Mobile.Store.PouchDB
 *
 * @requires Sage.Platform.Mobile.Convert
 * @requires Sage.Platform.Mobile.Utility
 */
define('Sage/Platform/Mobile/Store/PouchDB', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/Deferred',
    'dojo/store/util/QueryResults',
    'dojo/string',
    'dojo/_base/json',
    'Sage/Platform/Mobile/Convert',
    '../Utility'
], function (
    declare,
    lang,
    array,
    Deferred,
    QueryResults,
    string,
    json,
    convert,
    utility
) {
    return declare('Sage.Platform.Mobile.Store.PouchDB', null, {

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
         * @constructor
        */
        constructor: function(props) {
            lang.mixin(this, props);
            this._db = new PouchDB(this.databaseName);
            this.data = [];
        },
        get: function(id, options) {
            var deferred = new Deferred();
            this._db.get(id, options || {}, function(err, doc) {
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
        query: function(query, queryOptions) {
            var deferred = new Deferred();
            deferred.total = -1;

            queryOptions = queryOptions || {};
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

            this._db.query(query, queryOptions, function(err, response) {
                if (!err) {
                    deferred.total = response.total_rows;
                    deferred.resolve(response.rows);
                } else {
                    deferred.reject(err);
                }
            });

            return QueryResults(deferred.promise);
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
        put: function(object, putOptions) {
            var deferred = new Deferred(),
                callback = function(err, response) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(response);
                    }
                };

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
        add: function(object, addOptions) {
            addOptions = addOptions || {};
            addOptions.overwrite = false;
            return this.put(object, addOptions);
        },
        /**
         * Removes the document given the id
         * @param id
         * @returns {window.Promise}
         */
        remove: function(id) {
            return this._db.get(id).then(function(doc) {
                return this._db.remove(doc);
            }.bind(this));
        },
        /**
         * Returns an object's identity using this.idProperty
         * @param {Object} object The object to get the identity from
         * @returns {String|Number}
        */
        getIdentity: function(object) {
            return lang.getObject(this.idProperty, false, object);
        },
        queryEngine: function(query, options) {
        },
        /**
         * Not implemented in this store.
         */
        transaction: function() {
        },
        /**
         * Not implemented in this store.
         */
        getChildren: function(object, options){
        },
        /**
         * Returns any metadata about the object. This may include attribution,
         * cache directives, history, or version information.
         *
         * @param {Object} object The object to return metadata for.
         * @return {Object} Object containing the metadata.
         * @return {String|Number} return.id
         */
        getMetadata: function(object) {
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
        getRevision: function(object) {
            return lang.getObject(this.revisionProperty, false, object);
        }
    });
});

