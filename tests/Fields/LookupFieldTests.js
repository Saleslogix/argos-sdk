define('tests/Fields/LookupFieldTests', ['Sage/Platform/Mobile/Fields/LookupField'], function(LookupField) {
    return describe('Sage.Platform.Mobile.Fields.LookupField', function() {
        it('can clear the value', function() {
            var field = new LookupField();
            field.clearValue();
            expect(field.currentValue).toEqual(false);
        });

        it('can create navigation options', function() {
            var field, options;
            field = new LookupField();
            options = field.createNavigationOptions();
            expect(options.singleSelect).toEqual(field.singleSelect);
        });

        it('can init', function() {
            var field;

            // Readonly
            field = new LookupField();
            spyOn(field, 'isReadOnly').and.returnValue(true);
            spyOn(field, 'disable');
            field.init();
            expect(field.disable).toHaveBeenCalled();

            // Writeable - requireSelection false
            field = new LookupField();
            field.requireSelection = false;
            spyOn(field, 'isReadOnly').and.returnValue(false);
            spyOn(field, 'connect');
            field.init();
            expect(field.connect.calls.count()).toEqual(3);

            // Writeable - requireSelection true
            field = new LookupField();
            field.requireSelection = true;
            spyOn(field, 'isReadOnly').and.returnValue(false);
            spyOn(field, 'connect');
            field.init();
            expect(field.connect.calls.count()).toEqual(1);
        });

        it('can enable', function() {
            var field;

            field = new LookupField();
            field.enable();
            expect(field.inputNode.attributes.getNamedItem('disabled')).toEqual(null);

        });

        it('can disable', function() {
            var field;

            field = new LookupField();
            field.disable();
            expect(field.inputNode.attributes.getNamedItem('disabled').value).toEqual('');
        });

        it('can check if readOnly', function() {
            var field;

            field = new LookupField();
            expect(field.isReadOnly()).toEqual(true);
            field.view = true;
            expect(field.isReadOnly()).toEqual(false);
        });

        it('can complete', function(done) {
            var field, app, reui;

            app = {
                getPrimaryActiveView: function() {
                    // Return a fake view
                    return {
                        get: function() {
                            // Return a fake selection module
                            return {
                                getSelectionCount: function() {
                                    return 0;
                                },
                                getSelections: function() {
                                    return [
                                        1,
                                        2,
                                        3
                                    ];
                                }
                            };
                        },
                        options: {
                        }
                    };
                },
                getView: function() {
                }
            };

            reui = {
                back: function() {}
            };

            field = new LookupField({ app: app, reui: reui});
            spyOn(field, 'onChange');
            field.complete();
            setTimeout(function() {
                expect(field.onChange).toHaveBeenCalled();
                done();
            }, 100);
        });
    });
});

