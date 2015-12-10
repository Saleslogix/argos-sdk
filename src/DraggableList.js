import declare from 'dojo/_base/declare';
import _ListBase from './_ListBase';
import _DraggableBase from './_DraggableBase';

/**
 * @class argos.DraggableList
 * List extends List and _DraggableBase to make the list draggable
 * @extends argos.List
 * @extends argos._DraggableBase
 * @alternateClassName Draggable List
 * @requires argos.List
 * @requires argos._DraggableBase
 */
const __class = declare('argos.DraggableList', [_ListBase, _DraggableBase], {
  rowTemplate: new Simplate([
    '<li data-action="activateEntry" data-key="{%= $[$$.idProperty] %}" data-descriptor="{%: $[$$.labelProperty] %}" class="list-item-draggable">',
      '<button data-action="selectEntry" class="list-item-selector button">',
        '{% if ($$.selectIconClass) { %}',
          '<span class="{%= $$.selectIconClass %}"></span>',
        '{% } else if ($$.icon || $$.selectIcon) { %}',
          '<img src="{%= $$.icon || $$.selectIcon %}" class="icon" />',
        '{% } %}',
      '</button>',
      '<div class="list-item-content" data-snap-ignore="true">{%! $$.itemTemplate %}</div>',
    '</li>',
  ]),
  show: function show() {
    this.setupDraggable(this.contentNode, this.scrollerNode)
        .setClass('draggable')
        .setParentClassToDrag('list-item-draggable');
    this.inherited(arguments);
  },
});

export default __class;
