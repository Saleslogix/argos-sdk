define(["require", "exports", 'dojo/_base/declare', 'dojo/_base/lang', './_EditBase', './_SDataEditMixin', './_RelatedViewWidgetEditMixin'], function (require, exports, declare, lang, _EditBase, _SDataEditMixin, _RelatedWidgetEditMixin) {
    /**
     * @class argos.Edit
     *
     * Edit extends _EditBase and mixes in _SDataEditMixin to provide backwards compatibility for consumers.
     *
     * @alternateClassName Edit
     * @extends argos._EditBase
     * @requires argos._EditBase
     * @requires argos._SDataEditMixin
     * @mixins argos._SDataEditMixin
     * @requires argos._RelatedViewWidgetEditMixin
     * @mixins argos._RelatedViewWidgetEditMixin
     */
    var __class = declare('argos.Edit', [_EditBase, _SDataEditMixin, _RelatedWidgetEditMixin], {});
    lang.setObject('Sage.Platform.Mobile.Edit', __class);
    return __class;
});
