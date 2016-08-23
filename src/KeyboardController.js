import React, {PropTypes, Component} from 'react';

export default class KeyboardController extends Component {
  static propTypes = {
    onControlDown: PropTypes.func.isRequired,
    onControlUp: PropTypes.func.isRequired,
    bindings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  render() {
    return <div>{this.props.children}</div>;
  }

  handleKeyDown(event) {
    const control = this.eventToControl(event);
    if(control) {
      this.props.onControlDown(control);
      return event.preventDefault();
    }
  }

  handleKeyUp(event) {
    const control = this.eventToControl(event);
    if(control) {
      this.props.onControlUp(control);
      return event.preventDefault();
    }
  }

  eventToControl(event) {
    const key = (
      event.keyCode === 16 ?
        'Shift' :
      event.keyCode === 17 ?
        'Ctrl' :
      event.key
    );
    const binding = this.props.bindings[key];
    return binding && binding.control;
  }
}
