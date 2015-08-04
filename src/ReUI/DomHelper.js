import domAttr from 'dojo/dom-attr';

export default {
  select: function select(el) {
    domAttr.set(el, 'selected', 'true');
  },
  unselect: function unselect(el) {
    domAttr.remove(el, 'selected');
  },
};
