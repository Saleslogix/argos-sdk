define(["require", "exports", 'dojo/_base/declare', 'dojo/_base/lang', './TextAreaField', '../FieldManager'], function (require, exports, declare, lang, TextAreaField, FieldManager) {
    /**
     * @class argos.Fields.NoteField
     * The NoteField is a special case where an overly long text string should be inserted and
     * you want to take the user to another view for that specific input.
     *
     * The special part is that the it passes the value between its editor via an object with a
     * "Note" property., meaning the Edit View layout should have a field bound to the `noteProperty`
     * defined in this field ("Notes" by default").
     *
     * ###Example:
     *     {
     *         name: 'FullDescription',
     *         property: 'FullDescription',
     *         label: this.fullDescriptionText,
     *         type: 'note',
     *         view: 'text_editor_edit'
     *     }
     *
     * @alternateClassName NoteField
     * @extends argos.Fields.TextAreaField
     * @requires argos.FieldManager
     */
    var control = declare('argos.Fields.NoteField', [TextAreaField], {});
    lang.setObject('Sage.Platform.Mobile.Fields.NoteField', control);
    return FieldManager.register('note', control);
});
