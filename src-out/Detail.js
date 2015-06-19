define(["require", "exports", 'dojo/_base/declare', 'dojo/_base/lang', './_DetailBase', './_SDataDetailMixin', './_RelatedViewWidgetDetailMixin'], function (require, exports, declare, lang, _DetailBase, _SDataDetailMixin, _RelatedWidgetDetailMixin) {
    /**
     * @class argos.Detail
     *
     * Extends _DetailBase and mixes in _SDataDetailMixin to provide backwards compatibility to consumers.
     *
     * @alternateClassName Detail
     * @extends argos._DetailBase
     * @requires argos._DetailBase
     * @requires argos._SDataDetailMixin
     * @mixins argos._SDataDetailMixin
     * @mixins argos._RelatedViewWidgetDetailMixin
     */
    var __class = declare('argos.Detail', [_DetailBase, _SDataDetailMixin, _RelatedWidgetDetailMixin], {});
    lang.setObject('Sage.Platform.Mobile.Detail', __class);
    return __class;
});
