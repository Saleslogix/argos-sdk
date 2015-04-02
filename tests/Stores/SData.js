define('tests/Stores/SData', [
    'dojo/_base/lang',
    'moment',
    'argos/Store/SData'
], function(lang, moment, Store) {

    // Create a mock SData service
    function MockService(options) {
        var defaultOptions = {};
        if (!options) {
            defaultOptions = {
                callSuccess: true,
                callFailure: false,
                callAbort: false,
                data: {
                    data: '123'
                }
            };
        }

        lang.mixin(this, defaultOptions, options);
    }

    MockService.prototype.readEntry = function(request, options) {
        if (this.callSuccess) {
            options.success.call(options.scope || this, this.data);
        } else if (this.callFailure) {
            options.failure.call(options.scope || this, request, options);
        } else if (this.callAbort) {
            options.aborted.call(options.scope || this, request, options);
        }
    };
    MockService.prototype.readFeed = function(request, options) {
        if (this.callSuccess) {
            options.success.call(options.scope || this, this.data);
        } else if (this.callFailure) {
            options.failure.call(options.scope || this, request, options);
        } else if (this.callAbort) {
            options.aborted.call(options.scope || this, request, options);
        }

        return this.data;
    };
    MockService.prototype.getVersion = function() { };
    MockService.prototype.getIncludeContent = function() { };
    MockService.prototype.getVirtualDirectory = function() { };
    MockService.prototype.getProtocol = function() { };
    MockService.prototype.getServerName = function() { };
    MockService.prototype.getPort = function() { };
    MockService.prototype.getApplicationName = function() { };
    MockService.prototype.getContractName = function() { };
    MockService.prototype.getDataSet = function() { };
    MockService.prototype.isJsonEnabled = function() { return true;
    };
    MockService.prototype.createEntry = function(request, data, options) {
        options.success.call(options.scope || this, data);
        return data;
    };
    MockService.prototype.updateEntry = function(request, data, options) {
        if (this.callSuccess) {
            options.success.call(options.scope || this, data);
        } else if (this.callFailure) {
            options.failure.call(options.scope || this, request, options);
        } else if (this.callAbort) {
            options.aborted.call(options.scope || this, request, options);
        }

        return data;
    };

    function MockRequest(service) {
        this.service = service || new MockService();
    }
    MockRequest.prototype.clone = function() {
        return this;
    };
    MockRequest.prototype.read = function(options) {
        this.service.readEntry(this, options);
    };
    MockRequest.prototype.setQueryArg = function() { };

    return describe('Sage.Platform.Mobile.Store.SData', function() {
        it('can mixin props', function() {
            var store = new Store({foo: 'bar'});
            expect(store.foo).toBe('bar');
        });

        it('can get some data', function(done) {
            var store, promise;
            store = new Store({
                service: new MockService(),
                resourceKind: 'test',
                resourcePredicate: 'test',
                contractName: 'system',
                select: ['a','b','c'],
                include: ['1','2','3'],
                queryName: '',
                queryArgs: '',
                orderBy: '',
                idProperty: '$key',
                applicationName: 'slx',
                scope: this
            });

            spyOn(store.service, 'readEntry').and.callThrough();
            promise = store.get();
            expect(store.service.readEntry).toHaveBeenCalled();
            promise.then(function(results) {
                expect(results.data).toBe('123');
                done();
            });
        });

        it('can get some data using space in id', function(done) {
            var store, promise;
            store = new Store({
                service: new MockService(),
                resourceKind: 'test',
                resourcePredicate: 'test',
                contractName: 'system',
                select: ['a','b','c'],
                include: ['1','2','3'],
                queryName: '',
                queryArgs: '',
                orderBy: '',
                idProperty: '$key',
                applicationName: 'slx',
                scope: this
            });

            spyOn(store.service, 'readEntry').and.callThrough();
            promise = store.get('john abbott');
            expect(store.service.readEntry).toHaveBeenCalled();
            promise.then(function(results) {
                expect(results.data).toBe('123');
                done();
            });
        });

        it('can get some data using no id', function(done) {
            var store, promise;
            store = new Store({
                service: new MockService(),
                resourceKind: 'test',
                contractName: 'system',
                select: ['a','b','c'],
                include: ['1','2','3'],
                queryName: '',
                queryArgs: '',
                orderBy: '',
                idProperty: '$key',
                applicationName: 'slx',
                scope: this
            });

            spyOn(store.service, 'readEntry').and.callThrough();
            promise = store.get();
            expect(store.service.readEntry).toHaveBeenCalled();
            promise.then(function(results) {
                expect(results.data).toBe('123');
                done();
            });
        });

        it('can get some data using no scope', function(done) {
            var store, promise;
            store = new Store({
                service: new MockService(),
                resourceKind: 'test',
                resourcePredicate: 'test',
                contractName: 'system',
                select: ['a','b','c'],
                include: ['1','2','3'],
                queryName: '',
                queryArgs: '',
                orderBy: '',
                idProperty: '$key',
                applicationName: 'slx'
            });

            spyOn(store.service, 'readEntry').and.callThrough();
            promise = store.get();
            expect(store.service.readEntry).toHaveBeenCalled();
            promise.then(function(results) {
                expect(results.data).toBe('123');
                done();
            });
        });

        it('can get some data using resource property', function(done) {
            var store, promise;
            store = new Store({
                service: new MockService(),
                resourceKind: 'test',
                resourcePredicate: 'test',
                contractName: 'system',
                select: ['a','b','c'],
                include: ['1','2','3'],
                queryName: '',
                queryArgs: '',
                orderBy: '',
                idProperty: '$key',
                applicationName: 'slx',
                resourceProperty: 'accounts',
                scope: this
            });

            spyOn(store.service, 'readEntry').and.callThrough();
            promise = store.get();
            expect(store.service.readEntry).toHaveBeenCalled();
            promise.then(function(results) {
                expect(results.data).toBe('123');
                done();
            });
        });

        it('can get some data using no contractName or resourceKind', function(done) {
            var store, promise;
            store = new Store({
                service: new MockService(),
                resourcePredicate: 'test',
                select: ['a','b','c'],
                include: ['1','2','3'],
                queryName: '',
                queryArgs: '',
                orderBy: '',
                idProperty: '$key',
                applicationName: 'slx',
                resourceProperty: 'accounts',
                scope: this,
                doDateConversion: true
            });

            spyOn(store.service, 'readEntry').and.callThrough();
            promise = store.get();
            expect(store.service.readEntry).toHaveBeenCalled();
            promise.then(function(results) {
                expect(results.data).toBe('123');
                done();
            });
        });

        it('can get some data and convert date strings', function(done) {
            var store, promise, date = moment();
            store = new Store({
                service: new MockService({callSuccess: true, data: { data: '123', foo: date.toJSON()}}),
                resourcePredicate: 'test',
                select: ['a','b','c'],
                include: ['1','2','3'],
                queryName: '',
                queryArgs: '',
                orderBy: '',
                idProperty: '$key',
                applicationName: 'slx',
                resourceProperty: 'accounts',
                scope: this,
                doDateConversion: true // This triggers the date conversions
            });

            spyOn(store.service, 'readEntry').and.callThrough();
            promise = store.get();
            expect(store.service.readEntry).toHaveBeenCalled();
            promise.then(function(results) {
                expect(results.foo.constructor).toBe(Date);
                done();
            });
        });

        it('can get some data and handle a failure due to no data', function(done) {
            var store, promise;
            store = new Store({
                service: new MockService({callSuccess: true, data: null}),
                resourcePredicate: 'test',
                select: ['a','b','c'],
                include: ['1','2','3'],
                queryName: '',
                queryArgs: '',
                orderBy: '',
                idProperty: '$key',
                applicationName: 'slx',
                resourceProperty: 'accounts',
                scope: this
            });

            spyOn(store.service, 'readEntry').and.callThrough();
            promise = store.get();
            expect(store.service.readEntry).toHaveBeenCalled();
            promise.then(function(results) {
            }, function(err) {
                expect(err.message).toBe('The entry result is invalid.');
                done();
            });
        });

        it('can query some data and handle a failure', function(done) {
            var store, promise;
            store = new Store({
                service: new MockService({ callFailure: true }),
                resourceKind: 'test',
                resourcePredicate: 'test',
                contractName: 'system',
                select: ['a','b','c'],
                include: ['1','2','3'],
                queryName: '',
                queryArgs: '',
                orderBy: '',
                idProperty: '$key',
                applicationName: 'slx',
                scope: this
            });

            spyOn(store.service, 'readFeed').and.callThrough();
            promise = store.query('foo');
            expect(store.service.readFeed).toHaveBeenCalled();
            promise.then(function(results) {
            }, function(err) {
                expect(true).toEqual(true);
                done();
            });
        });

        it('can query some data and handle a failure due to no data', function(done) {
            var store, promise;
            store = new Store({
                service: new MockService({callSuccess: true, data: null}),
                resourceKind: 'test',
                resourcePredicate: 'test',
                contractName: 'system',
                select: ['a','b','c'],
                include: ['1','2','3'],
                queryName: '',
                queryArgs: '',
                orderBy: '',
                idProperty: '$key',
                applicationName: 'slx',
                scope: this
            });

            spyOn(store.service, 'readFeed').and.callThrough();
            promise = store.query('foo');
            expect(store.service.readFeed).toHaveBeenCalled();
            promise.then(function(results) {
            }, function(err) {
                expect(err.message).toEqual('The feed result is invalid.');
                done();
            });
        });

        it('can query some data and handle an abort', function(done) {
            var store, promise;
            store = new Store({
                service: new MockService({ callAbort: true }),
                resourceKind: 'test',
                resourcePredicate: 'test',
                contractName: 'system',
                select: ['a','b','c'],
                include: ['1','2','3'],
                queryName: '',
                queryArgs: '',
                orderBy: '',
                idProperty: '$key',
                applicationName: 'slx',
                scope: this
            });

            spyOn(store.service, 'readFeed').and.callThrough();
            promise = store.query('foo');
            expect(store.service.readFeed).toHaveBeenCalled();
            promise.then(function(results) {
            }, function(err) {
                expect(err.aborted).toEqual(true);
                done();
            });
        });


        it('can query some data', function(done) {
            var store, promise;
            store = new Store({
                service: new MockService({callSuccess: true, data: { data: '123', '$totalResults': 10 }}),
                resourceKind: 'test',
                resourcePredicate: 'test',
                contractName: 'system',
                select: ['a','b','c'],
                include: ['1','2','3'],
                queryName: '',
                queryArgs: '',
                orderBy: '',
                idProperty: '$key',
                applicationName: 'slx',
                scope: this
            });

            spyOn(store.service, 'readFeed').and.callThrough();
            promise = store.query('foo');
            expect(store.service.readFeed).toHaveBeenCalled();
            promise.then(function(results) {
                done();
            });
        });

        it('can query some data using no scope', function(done) {
            var store, promise;
            store = new Store({
                service: new MockService(),
                resourceKind: 'test',
                resourcePredicate: 'test',
                contractName: 'system',
                select: ['a','b','c'],
                include: ['1','2','3'],
                queryName: 'foo',
                queryArgs: '',
                orderBy: '',
                idProperty: '$key',
                applicationName: 'slx'
            });

            spyOn(store.service, 'readFeed').and.callThrough();
            promise = store.query('foo');
            expect(store.service.readFeed).toHaveBeenCalled();
            promise.then(function(results) {
                done();
            });
        });

        it('can query some data using queryName and no resource predicate', function(done) {
            var store, promise;
            store = new Store({
                service: new MockService(),
                resourceKind: 'test',
                contractName: 'system',
                resourceProperty: 'account',
                select: ['a','b','c'],
                include: ['1','2','3'],
                queryName: 'foo',
                queryArgs: '',
                orderBy: '',
                idProperty: '$key',
                applicationName: 'slx',
                where: 'name eq "bar"'
            });

            spyOn(store.service, 'readFeed').and.callThrough();
            promise = store.query('foo', {start: 1, count: 20});
            expect(store.service.readFeed).toHaveBeenCalled();
            promise.then(function(results) {
                done();
            });
        });

        it('can query some data using an empty query', function(done) {
            var store, promise;
            store = new Store({
                service: new MockService(),
                resourceKind: 'test',
                contractName: 'system',
                resourceProperty: 'account',
                select: ['a','b','c'],
                include: ['1','2','3'],
                queryName: 'foo',
                queryArgs: '',
                orderBy: '',
                idProperty: '$key',
                applicationName: 'slx'
            });

            spyOn(store.service, 'readFeed').and.callThrough();
            promise = store.query('');
            expect(store.service.readFeed).toHaveBeenCalled();
            promise.then(function(results) {
                done();
            });
        });

        it('can query some data using no queryName and a resourceProperty', function(done) {
            var store, promise;
            store = new Store({
                service: new MockService(),
                resourceKind: 'test',
                resourcePredicate: 'test',
                resourceProperty: 'accounts',
                contractName: 'system',
                select: ['a','b','c'],
                include: ['1','2','3'],
                queryArgs: {foo: 'bar'},
                idProperty: '$key',
                applicationName: 'slx',
                orderBy: [{attribute: 'foo', descending: false},{attribute: 'bar', descending: true}]
            });

            spyOn(store.service, 'readFeed').and.callThrough();
            promise = store.query('foo');
            expect(store.service.readFeed).toHaveBeenCalled();
            promise.then(function(results) {
                done();
            });
        });

        it('can query some data using no contractName, resourceKind, or applicationName', function(done) {
            var store, promise;
            store = new Store({
                service: new MockService(),
                resourcePredicate: 'test',
                resourceProperty: 'accounts',
                select: ['a','b','c'],
                include: ['1','2','3'],
                queryArgs: {foo: 'bar'},
                idProperty: '$key',
                orderBy: 'foo'
            });

            spyOn(store.service, 'readFeed').and.callThrough();
            promise = store.query('foo');
            expect(store.service.readFeed).toHaveBeenCalled();
            promise.then(function(results) {
                done();
            });
        });

        it('can write some data', function(done) {
            var store, promise, allDone, count = 0;
            store = new Store({
                service: new MockService(),
                resourceKind: 'test',
                resourcePredicate: 'test',
                contractName: 'system',
                select: ['a','b','c'],
                include: ['1','2','3'],
                queryName: '',
                queryArgs: '',
                orderBy: '',
                idProperty: '$key',
                applicationName: 'slx',
                scope: this
            });

            allDone = function() {
                count = count + 1;
                if (count === 4) {
                    done();
                }
            };

            // Test add
            spyOn(store.service, 'createEntry').and.callThrough();
            promise = store.add({});
            expect(store.service.createEntry).toHaveBeenCalled();
            promise.then(function(results) {
                allDone();
            });

            // Test update
            store.service.isJsonEnabled = function() {
                return false;
            };

            promise = store.put({ data: '123'}, { overwrite: true, id: 'foo', entity: 'account', version: '1234' });
            expect(store.service.createEntry).toHaveBeenCalled();
            promise.then(function(results) {
                expect(results.data).toBe('123');
                allDone();
                store.service.isJsonEnabled = function() {
                    return true;
                };
            });

            // Test with no put options
            promise = store.put({ data: '123'});
            expect(store.service.createEntry).toHaveBeenCalled();
            promise.then(function(results) {
                expect(results.data).toBe('123');
                allDone();
            });

            // Test with data conversion
            var date = moment();
            store.doDateConversion = true;
            promise = store.put({ data: '123', foo: date.toJSON()});
            expect(store.service.createEntry).toHaveBeenCalled();
            promise.then(function(results) {
                expect(results.foo.constructor).toBe(Date);
                allDone();
            });
        });

        it('can get using a custom request', function(done) {
            var store, promise, service = new MockService();
            store = new Store({
                service: service,
                request: new MockRequest(service),
                executeGetAs: 'read'
            });

            spyOn(store.service, 'readEntry').and.callThrough();
            promise = store.get();
            expect(store.service.readEntry).toHaveBeenCalled();
            promise.then(function(results) {
                expect(results.data).toBe('123');
                done();
            });
        });

        it('can query using a custom request', function(done) {
            var store, promise, service = new MockService();
            store = new Store({
                service: service,
                request: new MockRequest(service),
                executeQueryAs: 'read'
            });

            spyOn(store.service, 'readEntry').and.callThrough();
            promise = store.query('foo');
            expect(store.service.readEntry).toHaveBeenCalled();
            promise.then(function(results) {
                done();
            });
        });

        it('can get the identity', function() {
            var store = new Store({
                idProperty: '$key'
            });

            expect(store.getIdentity({'$key': 1})).toBe(1);
        });

        it('can get the entity', function() {
            var store = new Store({
                entityProperty: 'entity'
            });

            expect(store.getEntity({'entity': 1})).toBe(1);
        });

        it('can get the version', function() {
            var store = new Store({
                versionProperty: 'version'
            });

            expect(store.getVersion({'version': 1})).toBe(1);
        });

        it('can get the label', function() {
            var store = new Store({
                labelProperty: 'label'
            });

            expect(store.getLabel({'label': 1})).toBe(1);
        });

        it('can get the metadata', function() {
            var store, data;
            store = new Store({});
            data = {
                '$key': 1,
                '$descriptor': 1,
                '$name': 1,
                '$etag': 1
            };

            expect(store.getMetadata(data)).toEqual({
                id: 1,
                label: 1,
                entity: 1,
                version: 1
            });

            expect(store.getMetadata()).toBe(null);
        });

        it('can not remove (not supported)', function() {
            var store = new Store();
            try {
                store.remove();
            } catch(err) {
                // If we throw an error, perhaps remove was implemented and a service dependency wasn't satisfied here.
                expect(true).toBe(false);
            }
        });
    });
});

