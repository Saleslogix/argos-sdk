export default class ViewComponent extends React.Component {
  // Mounting lifecycle
  // See: https://facebook.github.io/react/docs/react-component.html
  constructor(props) {
    super(props);
    this.id = props.id;
    this._started = false;
  }

  componentWillMount() {
  }

  render() {
    return (
      <div
        title={this.props.title}
        ref={(div) => { this.domNode = div; }}>
        {this.props.children}
    </div>);
  }

  componentDidMount() {
  }

  // Updating lifecycle
  componentWillReceiveProps(nextProps) {// eslint-disable-line
  }

  shouldComponentUpdate(nextProps, nextState) {// eslint-disable-line
    return true;
  }

  componentWillUpdate(nextProps, nextState) {// eslint-disable-line
  }

  componentDidUpdate(prevProps, prevState) {// eslint-disable-line
  }

  // Unmounting lifecycle
  componentWillUnmount() {
  }

  // Legacy
  onShow() {
  }

  init() {

  }

  placeAt() {
    this._started = true;
  }

  refreshRequiredFor(options) {// eslint-disable-line
  }

  getTag() {
  }

  getContext() {
    return {
      id: this.id,
    };
  }

  show(options, transitionOptions) {
    if (this.onShow(this) === false) {
      return;
    }

    if (this.refreshRequiredFor(options)) {
      this.refreshRequired = true;
    }

    this.options = options || this.options || {};

    const tag = this.getTag();
    const data = this.getContext();

    const newOptions = Object.assign(transitionOptions || {}, {
      tag,
      data,
    });
    ReUI.show(this.domNode.parentNode, newOptions);
  }
}
