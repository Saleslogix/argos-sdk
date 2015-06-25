import domAttr from 'dojo/dom-attr';

export default {
    select: function(el) {
        domAttr.set(el, 'selected', 'true');
    },
    unselect: function(el) {
        domAttr.remove(el, 'selected');
    }
};
