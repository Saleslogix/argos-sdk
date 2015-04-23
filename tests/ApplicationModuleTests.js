define('tests/ApplicationModuleTests', ['argos/ApplicationModule'], function(ApplicationModule) {
return describe('Sage.Platform.Mobile.ApplicationModule', function() {

    it('Can register a view to the set application', function() {
        var module = new ApplicationModule();

        module.application = {
            registerView: function() {}
        };

        spyOn(module.application, 'registerView');

        module.registerView('test_view');

        expect(module.application.registerView).toHaveBeenCalledWith('test_view', undefined);
    });

    it('Can register a toolbar to the set application', function() {
        var module = new ApplicationModule();

        module.application = {
            registerToolbar: function() {
            },
            registerView: function() {
            }
        };

        spyOn(module.application, 'registerToolbar');

        module.registerToolbar('testbar', 'testbar');

        expect(module.application.registerToolbar).toHaveBeenCalledWith('testbar', 'testbar', undefined);
    });

    it('Can register a customization to the set application', function() {
        var module = new ApplicationModule();

        module.application = {
            registerCustomization: function() {
            },
            registerView: function() {
            }
        };

        spyOn(module.application, 'registerCustomization');

        module.registerCustomization('testcustom', 'testcustom', 'testcustom');

        expect(module.application.registerCustomization).toHaveBeenCalledWith('testcustom', 'testcustom', 'testcustom');
    });

    it('Can store a reference to passed application on init', function() {
        var module, app;

        module = new ApplicationModule();
        app = {
            registerView: function() {
            },
            name: 'test'
        };

        module.init(app);

        expect(module.application.name).toEqual('test');
    });

    it('Calls load customizations on init', function() {
        var module = new ApplicationModule();

        module.loadViews = function() {
        };

        spyOn(module, 'loadCustomizations');

        module.init({
            registerView: function() {
            }
        });

        expect(module.loadCustomizations).toHaveBeenCalled();
    });

    it('Calls load views on init', function() {
        var module = new ApplicationModule();

        spyOn(module, 'loadViews');

        module.init({
            registerView: function() {
            }
        });

        expect(module.loadViews).toHaveBeenCalled();
    });

    it('Calls load toolbars on init', function() {
        var module = new ApplicationModule();

        module.loadViews = function() {
        };


        spyOn(module, 'loadToolbars');

        module.init();

        expect(module.loadToolbars).toHaveBeenCalled();
    });
});
});
