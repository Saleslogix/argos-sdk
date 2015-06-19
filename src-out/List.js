define(["require", "exports", 'dojo/_base/declare', 'dojo/_base/lang', './_ListBase', './_SDataListMixin', './_RelatedViewWidgetListMixin'], function (require, exports, declare, lang, _ListBase, _SDataListMixin, _RelatedViewWidgetListMixin) {
    /**
     * @class argos.List
     * List extends _ListBase and mixes in _SDataListMixin to provide backwards compatibility for consumers.
     * @extends argos._ListBase
     * @alternateClassName List
     * @requires argos._ListBase
     * @requires argos._SDataListMixin
     * @mixins argos._RelateViewdWidgetListMixin
     */
    var __class = declare('argos.List', [_ListBase, _SDataListMixin, _RelatedViewWidgetListMixin], {});
    lang.setObject('Sage.Platform.Mobile.List', __class);
    return __class;
});
