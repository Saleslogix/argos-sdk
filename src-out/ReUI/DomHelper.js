define(["require", "exports"], function (require, exports) {
    var domAttr = require('dojo/dom-attr');
    var domHelper;
    domHelper = {
        select: function (el) {
            domAttr.set(el, 'selected', 'true');
        },
        unselect: function (el) {
            domAttr.remove(el, 'selected');
        }
    };
    return domHelper;
});
