define('tests/View', ['dojo/_base/lang', 'argos/View'], function(lang, View) {
    describe('argos.View', function() {
        var createErrorHandlers = function() {
            return [
                {
                    name: 'one',
                    test: function(error) {
                        return true;
                    },
                    handle: function(error, next) {
                        next();
                    }
                }, {
                    name: 'two',
                    test: function(error) {
                        return true;
                    },
                    handle: function(error, next) {
                        next();
                    }
                }, {
                    name: 'three',
                    test: function(error) {
                        return true;
                    },
                    handle: function(error, next) {
                        next();
                    }
                }
            ];
        };

        it('can execute error handlers in a chain', function(done) {
            var view, errorMessage, count = 0;
            view = new View();
            errorMessage = 'A general error.';

            view.errorHandlers = createErrorHandlers();
            view.errorHandlers[0].test = function(error) {
                expect(error.message).toBe(errorMessage);
                return true;
            };

            view.errorHandlers[0].handle = function(error, next) {
                        expect(error.message).toBe(errorMessage);
                        expect(count).toBe(0);
                        count++;
                        next();
            };

            view.errorHandlers[1].test = function(error) {
                expect(error.message).toBe(errorMessage);
                return true;
            };

            view.errorHandlers[1].handle = function(error, next) {
                expect(error.message).toBe(errorMessage);
                expect(count).toBe(1);
                count++;
                next();
            };

            view.errorHandlers[2].test = function(error) {
                expect(error.message).toBe(errorMessage);
                return true;
            };

            view.errorHandlers[2].handle = function(error, next) {
                expect(error.message).toBe(errorMessage);
                expect(count).toBe(2);
                view.destroy();
                done();
            };

            view.handleError(new Error(errorMessage));
        });

        it('can match and skip error handlers', function() {
            var view, errorMessage, first, second, third;
            view = new View();
            errorMessage = 'A general error.';

            view.errorHandlers = createErrorHandlers();
            first = view.errorHandlers[0];
            second = view.errorHandlers[1];
            third = view.errorHandlers[2];

            spyOn(first, 'handle').and.callThrough();
            spyOn(second, 'handle').and.callThrough();
            spyOn(third, 'handle').and.callThrough();

            first.test = function(error) {
                return false;
            };

            view.handleError(new Error(errorMessage));

            // First should be skipped (it was not matched)
            expect(first.handle).not.toHaveBeenCalled();

            // Second and third should still be called
            expect(second.handle).toHaveBeenCalled();
            expect(third.handle).toHaveBeenCalled();
            view.destroy();
        });

        it('can skip remaining handlers by not calling next()', function() {
            var view, errorMessage, first, second;
            view = new View();
            errorMessage = 'A general error.';

            view.errorHandlers = createErrorHandlers();

            first = view.errorHandlers[0];
            second = view.errorHandlers[1];

            first.handle = function(error, next) {
                // We will omit calling next(), so remaining error handlers should not be invoked
            };

            spyOn(first, 'handle').and.callThrough();
            spyOn(second, 'handle').and.callThrough();

            view.handleError(new Error(errorMessage));
            expect(first.handle).toHaveBeenCalled();
            expect(second.handle).not.toHaveBeenCalled();
            view.destroy();
        });
    });
});

