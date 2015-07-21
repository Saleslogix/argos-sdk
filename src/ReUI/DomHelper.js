define('argos/ReUI/DomHelper', [
    'dojo/dom-attr'
], function(
    domAttr
) {
    var domHelper;

    domHelper = {
        select: function(el) {
            domAttr.set(el, 'selected', 'true');
        },
        unselect: function(el) {
            domAttr.remove(el, 'selected');
        }
    };

    return domHelper;
});

