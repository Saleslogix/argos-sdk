define('tests/Stores/PouchDB', [
    'dojo/_base/lang',
    'dojo/when',
    'Sage/Platform/Mobile/Store/PouchDB'
],
function(
    lang,
    when,
    Store
) {

    return describe('Sage.Platform.Mobile.Store.PouchDB', function() {
        beforeEach(function(done) {
            this.store = new Store({
                databaseName: 'argos-test'
            });

            this.store._db.put({
                _id: '1',
                data: '123'
            }, function(err, response) {
                done();
            });
        });

        afterEach(function(done) {
            PouchDB.destroy('argos-test', function(err, info) {
                if (err) {
                    console.log('Error deleting database.');
                    console.error(err);
                }

                done();
            });
        });

        it('can mixin props', function() {
            var store = new Store({foo: 'bar'});
            expect(store.foo).toBe('bar');
        });

        it('can get some data', function(done) {
            var promise;

            promise = this.store.get('1');
            promise.then(function(results) {
                expect(results.data).toBe('123');
                done();
            });
        });

        it('can add some data', function(done) {
            var promise, store = this.store;

            promise = store.add({
                _id: '2',
                data: '456'
            });

            promise.then(function(results) {
                store.get('2').then(function(results) {
                    expect(results.data).toBe('456');
                    done();
                });
            });
        });

        it('can update some data', function(done) {
            var store = this.store;

            // Fetch the first document, update it, then re-fetch to check it was updated
            store.get('1').then(function(doc) {
                doc.data = 'updated';
                store.put(doc).then(function() {
                    store.get('1').then(function(doc) {
                        expect(doc.data).toBe('updated');
                        done();
                    });
                });
            });
        });

        it('can get some data and handle a failure due to no data', function(done) {
            var promise;

            promise = this.store.get('');
            promise.then(function(results) {
            }, function(err) {
                expect(err.message).toBe('missing');
                expect(err.status).toBe(404);
                expect(err.name).toBe('not_found');
                done();
            });
        });

        it('can query', function(done) {
            var promise = this.store.query(function(doc, emit) {
                emit(doc._id, doc.data);
            });

            promise.then(function(results) {
                when(promise.total, function(total) {
                    // Check our total, and the results of our above map query function
                    expect(total).toBe(1);
                    if (results.length > 0) {
                        expect(results[0].key).toBe('1');
                        expect(results[0].value).toBe('123');
                    }

                    done();
                });
            });
        });

        it('can get the identity', function() {
            expect(this.store.getIdentity({'_id': 1})).toBe(1);
        });

        it('can get the metadata', function() {
            var data;
            data = {
                '_id': 1,
                '_rev': 2
            };

            expect(this.store.getMetadata(data)).toEqual({
                id: 1,
                revision: 2
            });

            expect(this.store.getMetadata()).toBe(null);
        });
    });
});
