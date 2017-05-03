import * as declare from 'dojo/_base/declare';
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
  isCardView: false,
  liRowTemplate: new Simplate([
    '<li role="option" data-action="activateEntry" data-key="{%= $[$$.idProperty] %}" data-descriptor="{%: $[$$.labelProperty] %}" class="list-item-draggable">', // tslint:disable-line
    '<button type="button" class="btn-icon hide-focus list-item-selector" data-action="selectEntry">',
    `<svg class="icon" focusable="false" aria-hidden="true" role="presentation">
        <use xlink:href="#icon-{%= $$.selectIcon %}" />
      </svg>`,
    '</button>',
    '<div class="list-item-content">{%! $$.itemTemplate %}</div>',
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
