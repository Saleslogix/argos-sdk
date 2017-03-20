/* eslint-disable */ // TODO: Remove this later
import $ from 'jquery';

export default class WidgetBase {
  constructor() {
    this.id = '';
    this.srcNodeRef = null;
    this.domNode = null;
    this.containerNode = null;
    this.ownerDocument = null;
    this.title = '';
    this._started = false;
  }

  initSoho() {
  }

  updateSoho() {
  }

  postscript(params, srcNodeRef) {
    this.create(params, srcNodeRef);
  }

  create(params, srcNodeRef) {
    this.srcNodeRef = $(srcNodeRef);
    this.id = this.srcNodeRef.attr('id');
    this.params = params;
    this.postMixInProperties();

    const srcNodeRefDom = this.srcNodeRef.get(0);
    this.ownerDocument = this.ownerDocument || (srcNodeRefDom ? srcNodeRefDom.ownerDocument : document);

    this.buildRendering();
    this.postCreate();
  }

  postMixInProperties() {
  }

  buildRendering() {
    let root = null;
    if (this.widgetTemplate && this.widgetTemplate.constructor === Simplate) {
      const templateString = this.widgetTemplate.apply(this);
      root = $(templateString, this.ownerDocument);
    } else if (typeof this.widgetTemplate === 'string') {
      root = $(this.widgetTemplate, this.ownerDocument);
    } else if (this.widgetTemplate instanceof HTMLElement) {
      root = $(this.widgetTemplate).clone();
    }

    if (root.length > 1) {
      root.wrap('<div></div>');
    }

    this.domNode = root.get(0);
  }

  postCreate() {
  }

  startup() {
  }

  resize() {
  }

  destroy(preserveDom) {
  }

  destroyRecursive(preserveDom) {
  }

  destroyRendering(preserveDom) {
  }

  destroyDescendants(preserveDom) {
  }

  uninitialize() {
  }

  toString() {
  }

  getChildren() {
  }

  getParent() {
  }

  placeAt(reference, position) {
  }
}
