import declare from 'dojo/_base/declare';
import View from '../View';

const __class = declare('argos.Views.Link', [View], {
  id: 'link_view',
  titleText: '',
  viewType: 'detail',
  link: '',
  cls: 'link-view',
  widgetTemplate: new Simplate([
    '<div id="{%= $.id %}" data-title="{%= $.titleText %}" class="detail panel {%= $.cls %}">',
    '<iframe class="link-node" data-dojo-attach-point="linkNode"',
    'sandbox="allow-scripts allow-forms allow-same-origin">',
    '</iframe>',
    '</div>',
  ]),
  _getLink: function _getLink() {
    const { link } = this.options;
    return link || this.link;
  },
  onTransitionTo: function onTransitionTo() {
    this.linkNode.contentWindow.location.replace(this._getLink());
  },
  onTransitionAway: function onTransitionAway() {
    this.linkNode.contentWindow.location.replace('about:blank');
  },
});

export default __class;
