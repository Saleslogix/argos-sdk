export default class WidgetBase {
  id: any;
  srcNodeRef: any;
  domNode: any;
  containerNode: any;
  ownerDocument: any;
  title: any;
  _started: any;
  params: any;
  widgetTemplate: any;
  constructor(options: any = {}) {
    this.id = options.id || 'generic_widgetbase';
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

  get(prop) {
    console.warn(`Attempting to get ${prop}`);
  }

  set(prop, val) {
    console.warn(`Attempting to set ${prop} to ${val}`);
  }

  subscribe() {
    console.warn('subscribe is deprecated.');
  }

  postscript(params, srcNodeRef) {
    this.create(params, srcNodeRef);
  }

  create(params, srcNodeRef) {
    this.srcNodeRef = $(srcNodeRef);
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
