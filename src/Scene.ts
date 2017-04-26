export default class Scene {
  store: any;
  viewset: any[];
  constructor(store) {
    this.viewset = [];
    this.store = store;
  }
}
