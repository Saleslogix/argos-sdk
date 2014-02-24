define('tests/Stores/SData', [
       'Sage/Platform/Mobile/Store/SData'
], function(Store) {
    var mockSevice, mockRequest;

    mockService = {
        readEntry: function(request, options) {
            options.success.call(options.scope || this, { data: '123' });
        },
        readFeed: function(request, options) {
            var data = { data: '123' };
            options.success.call(options.scope || this, data);
            return data;
        },
        getVersion: function() {
        },
        getIncludeContent: function() {
        },
        getVirtualDirectory: function() {
        },
        getProtocol: function() {
        },
        getServerName: function() {
        },
        getPort: function() {
        },
        getApplicationName: function() {
        },
        getContractName: function() {
        },
        getDataSet: function() {
        },
        isJsonEnabled: function() {
            return true;
        },
        createEntry: function(request, data, options) {
            var data = { data: '123' };
            options.success.call(options.scope || this, data);
            return data;
        },
        updateEntry: function(request, data, options) {
            var data = { data: '123' };
            options.success.call(options.scope || this, data);
            return data;
        }
    };

    mockRequest = {
        service: mockService,
        clone: function() {
            return this;
        },
        read: function(options) {
            this.service.readEntry(this, options);
        }
    };

    return describe('Sage.Platform.Mobile.Store.SData', function() {
        it('can mixin props', function() {
            var store = new Store({foo: 'bar'});
            expect(store.foo).toBe('bar');
        });

        it('can get some data', function(done) {
            var store, promise;
            store = new Store({
                service: mockService,
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

        it('can query some data', function(done) {
            var store, promise;
            store = new Store({
                service: mockService,
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

        it('can write some data', function(done) {
            var store, promise, allDone, count = 0;
            store = new Store({
                service: mockService,
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
                if (count === 3) {
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
            promise = store.put({ data: '123'}, { overwrite: true });
            expect(store.service.createEntry).toHaveBeenCalled();
            promise.then(function(results) {
                allDone();
            });

            // Test with no put options
            promise = store.put({ data: '123'});
            expect(store.service.createEntry).toHaveBeenCalled();
            promise.then(function(results) {
                allDone();
            });
        });

        it('can get using a custom request', function() {
            var store, promise;
            store = new Store({
                service: mockService,
                request: mockRequest
            });

            spyOn(store.service, 'readEntry').and.callThrough();
            promise = store.get();
            expect(store.service.readEntry).toHaveBeenCalled();
            promise.then(function(results) {
                expect(results.data).toBe('123');
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

