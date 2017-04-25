export default class Scene {
  store: any;
  viewset: Array<any>;
  constructor(store) {
    this.viewset = [];
    this.store = store;
  }
}
