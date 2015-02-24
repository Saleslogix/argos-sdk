define('tests/Fields/TextAreaFieldTests', ['dojo/query','argos/Fields/TextAreaField'], function(query, TextArea) {
return describe('Sage.Platform.Mobile.Fields.TextArea', function() {

    it('Can default to 4 rows', function() {
        var field = new TextArea();

        expect(field.rows).toEqual(4);
    });

    it('Can default to no clear button', function() {
        var field = new TextArea();

        expect(field.enableClearButton).toEqual(false);
        expect(query('> button', field.domNode).length).toEqual(0);
        expect(field.clearNode).toEqual(null);
    });

    it('Can set the value', function() {
        var field = new TextArea();
        field.setValue('abc');
        expect(field.getValue()).toBe('abc');

        field.setValue();
        expect(field.getValue()).toBe('');

        field.setValue('abc', true); // initial value
        expect(field.originalValue).toBe('abc');
    });

});
});
