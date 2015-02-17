define('tests/Fields/SignatureFieldTests', ['argos/Fields/SignatureField'], function(Signature) {
return describe('Sage.Platform.Mobile.Fields.SignatureField', function() {

    it('Can clear value', function() {
        var field = new Signature();

        spyOn(field, 'setValue');

        field.clearValue();

        expect(field.setValue).toHaveBeenCalledWith('', true);
    });

    it('Can create navigation options', function() {
        var field, options;
        field = new Signature();
        options = field.createNavigationOptions();
        expect(options.signature).toEqual([]);
    });

    it('Can get values from view', function() {
        var field, app, original;

        app = {
            getPrimaryActiveView: function() {
                // return a fake view
                return {
                    getValues: function() {
                        return 'value';
                    }
                };
            }
        };

        field = new Signature({
            app: app
        });

        field.getValuesFromView();
        expect(field.currentValue).toBe('value');

        field = new Signature();
        field.getValuesFromView();
        expect(field.currentValue).toBe(null);

        original = window.App;
        window.App = app;
        field = new Signature();
        field.getValuesFromView();
        expect(field.currentValue).toBe('value');
        window.App = original;
    });

    it('Can set value', function() {
        var field = new Signature();
        field.setValue('test');
        expect(field.inputNode.value).toEqual('test');
        field.setValue('another', true);
        expect(field.originalValue).toEqual('another');

        expect(function() {
            field.setValue('');
            field.setValue('{}');
        }).not.toThrow();
    });

    it('Can return exact value for formatted value', function() {
        var field = new Signature();

        expect(field.formatValue('test')).toEqual('test');
    });


});
});
