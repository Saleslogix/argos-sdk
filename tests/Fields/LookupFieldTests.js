define('tests/Fields/LookupFieldTests', [
    'argos/Fields/LookupField'
], function(
    LookupField
) {
    return describe('Sage.Platform.Mobile.Fields.LookupField', function() {
        beforeEach(function() {
            this.app = {
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

            this.reui = {
                back: function() {}
            };
        });

        it('can clear the value', function() {
            var field = new LookupField();
            field.clearValue();
            expect(field.currentValue).toEqual(false);
            field.destroy();
        });

        it('can create navigation options', function() {
            var field, options, owner;
            owner = {
                fields: {
                    dep: {
                        getValue: function() {
                            return '123';
                        },
                        label: 'abc'
                    }
                }
            };

            field = new LookupField();

            // Default
            options = field.createNavigationOptions();
            expect(options.singleSelect).toEqual(field.singleSelect);
            expect(options.tools.tbar[0].cls).toBe('invisible');

            // No singleSelectionAction specified, defaults to 'complete'
            field.singleSelectAction = '';
            options = field.createNavigationOptions();
            expect(options.singleSelectAction).toEqual('complete');

            // Depends on set, but can't get the depend value
            field.dependsOn = true;
            options = field.createNavigationOptions();
            expect(options).toEqual(false);

            field.dependsOn = 'dep';
            field.owner = owner;
            field.where = 'value eq true';
            options = field.createNavigationOptions();
            expect(options.where).toEqual(field.where);

            field.dependsOn = false;
            options = field.createNavigationOptions();
            expect(options.where).toEqual(field.where);

            field.singleSelect = false;
            options = field.createNavigationOptions();
            expect(options.tools.tbar[0].cls).not.toBe(undefined);


            field.destroy();
        });

        it('can init', function() {
            var field;

            // Readonly
            field = new LookupField();
            spyOn(field, 'isReadOnly').and.returnValue(true);
            spyOn(field, 'disable');
            field.init();
            expect(field.disable).toHaveBeenCalled();
            field.destroy();

            // Writeable - requireSelection false
            field = new LookupField();
            field.requireSelection = false;
            spyOn(field, 'isReadOnly').and.returnValue(false);
            spyOn(field, 'connect');
            field.init();
            expect(field.connect.calls.count()).toEqual(3);
            field.destroy();

            // Writeable - requireSelection true
            field = new LookupField();
            field.requireSelection = true;
            spyOn(field, 'isReadOnly').and.returnValue(false);
            spyOn(field, 'connect');
            field.init();
            expect(field.connect.calls.count()).toEqual(1);
            field.destroy();
        });

        it('can enable', function() {
            var field;

            field = new LookupField();
            field.enable();
            expect(field.inputNode.attributes.getNamedItem('disabled')).toEqual(null);
            field.destroy();
        });

        it('can disable', function() {
            var field;

            field = new LookupField();
            field.disable();
            expect(field.inputNode.attributes.getNamedItem('disabled').value).toEqual('');
            field.destroy();
        });

        it('can check if readOnly', function() {
            var field;

            field = new LookupField();
            expect(field.isReadOnly()).toEqual(true);
            field.view = true;
            expect(field.isReadOnly()).toEqual(false);
            field.destroy();
        });

        it('can get a dependent value and label', function() {
            var field, owner;

            owner = {
                fields: {
                    dep: {
                        getValue: function() {
                            return '123';
                        },
                        label: 'abc'
                    }
                }
            };

            field = new LookupField();
            field.owner = owner;
            field.dependsOn = 'dep';

            expect(field.getDependentValue()).toBe(owner.fields.dep.getValue());
            expect(field.getDependentLabel()).toBe(owner.fields.dep.label);

            // Remove the field
            delete owner.fields.dep;
            expect(field.getDependentValue()).toBe(undefined);
            expect(field.getDependentLabel()).toBe(undefined);

            field.dependsOn = null;
            expect(field.getDependentValue()).toBe(undefined);
            expect(field.getDependentLabel()).toBe(undefined);

            field.destroy();
        });

        it('can complete', function(done) {
            var field;

            field = new LookupField({app: this.app, reui: this.reui});
            spyOn(field, 'onChange');
            field.complete();
            setTimeout(function() {
                expect(field.onChange).toHaveBeenCalled();
                done();
            }, 100);

            field.destroy();
        });

        it('can navigate to list view', function() {
            var field, view;

            field = new LookupField({app: this.app, reui: this.reui});
            spyOn(field.app, 'getView').and.callFake(function() {
                view = {
                    id: 'account_list',
                    show: function() {
                    }
                };

                spyOn(view, 'show');
                return view;
            });

            // Normal
            field.navigateToListView();
            expect(field.app.getView).toHaveBeenCalled();
            expect(view.show).toHaveBeenCalled();

            // On button click
            field.app.getView.calls.reset();
            view.show.calls.reset();

            field.buttonClick();
            expect(field.app.getView).toHaveBeenCalled();
            expect(view.show).toHaveBeenCalled();

            field.app.getView.calls.reset();
            view.show.calls.reset();

            field._onClick({
                target: field.domNode,
                preventDefault: function(){},
                stopPropagation: function() {}
            });

            expect(field.app.getView).toHaveBeenCalled();
            expect(view.show).toHaveBeenCalled();

            field.app.getView.calls.reset();
            view.show.calls.reset();

            field.disabled = true;
            field._onClick({target: field.domNode});

            expect(field.app.getView).not.toHaveBeenCalled();
            expect(view.show).not.toHaveBeenCalled();

            field.destroy();
        });

        it('can not navigate to list view', function() {
            var field, view;

            field = new LookupField({app: this.app, reui: this.reui});
            spyOn(field.app, 'getView').and.callFake(function() {
                view = {
                    id: 'account_list',
                    show: function() {
                    }
                };

                spyOn(view, 'show');
                return view;
            });

            field.disabled = true;
            field.navigateToListView();
            expect(field.app.getView).toHaveBeenCalled();
            expect(view.show).not.toHaveBeenCalled();

            field.destroy();
        });
    });
});

