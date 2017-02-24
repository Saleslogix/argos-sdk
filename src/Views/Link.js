import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import View from '../View';

const __class = declare('argos.Views.Link', [View], {
  id: 'link_view',
  titleText: '',
  viewType: 'detail',
  link: '',
  cls: 'link-view',
  widgetTemplate: new Simplate([
    '<div id="{%= $.id %}" title="{%= $.titleText %}" class="detail panel {%= $.cls %}">',
    '<iframe class="link-node" data-dojo-attach-point="linkNode"',
    'sandbox="allow-scripts allow-forms allow-same-origin">',
    '</iframe>',
    '</div>',
  ]),
  /*
  Skip adding the open external link for now. This view is not general purpose (yet) and only
  used for opening maps.
  createToolLayout: function createToolLayout() {
    return this.tools || (this.tools = {
      tbar: [{
        id: 'view_external',
        cls: 'fa fa-external-link fa-lg',
        action: 'openExternal',
      }],
    });
  },
  openExternal: function openExternal() {
    window.open(this._getLink(), 'externalWin', '');
  },
  */
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

lang.setObject('Sage.Platform.Mobile.Views.Link', __class);
export default __class;
