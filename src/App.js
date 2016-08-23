import React, {Component, PropTypes} from 'react';
import {Stage, Sprite, CustomPIXIComponent, DisplayObjectContainer} from 'react-pixi';
import {render} from 'react-dom';
import PIXI from 'pixi.js';
import 'pixi-particles';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as vesselActions from './vesselActions';

import KeyboardController from './KeyboardController';

import Rocket from './Rocket';
import Overlay from './Overlay';

import CenterMark from './pixi-components/CenterMark';
import Sphere from './pixi-components/Sphere';
import BackgroundGrid from './pixi-components/BackgroundGrid';

const PIXEL_PER_METER = 25;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // assets loaded by pixi loader
      resources: null,

      // controls currently active. These will take effect on
      // each tick. Set in response to key events.
      controls: {},

      // size of the canvas
      width: 0,
      height: 0
    };
  }

  componentWillMount() {
    const loader = new PIXI.loaders.Loader();
    loader.add('rocket', '/assets/rocket.png');
    loader.add('particle', '/assets/particle.png');
    loader.once('complete', () => this.setState({
      resources: loader.resources
    }));
    loader.load();
  }

  componentDidMount() {
    window.addEventListener('resize', () => this.handleSizeChanged());
    this.handleSizeChanged();
    this.tick();
  }

  tick() {
    const {controls} = this.state;
    for(let key in controls) {
      if(controls[key]) {
        this.props.actions[key]();
      }
    }
    this.props.actions.warp(new Date().getTime());
    requestAnimationFrame(() => this.tick());
  }

  render() {
    const {resources} = this.state;
    if(!resources) {
      return <em>Loading...</em>;
    } else {
      const {rocket, particle} = resources;
      const {vessel, actions, collided} = this.props;
      const {position, heading, velocity, burning, reverseThrust, throttle} = vessel;
      const {height, width} = this.state;
      const tx = (velocity.x - position.x) * PIXEL_PER_METER + width / 2,
            ty = (velocity.y - position.y) * PIXEL_PER_METER + height / 2;
      const spheres = this.props.spheres.map(
        (sphere, i) => <Sphere {...sphere} key={i} tx={tx} ty={ty} />
      );
      const keyBindings = {
        'z': { control: 'throttleFull',    label: 'Throttle full' },
        'x': { control: 'throttleZero',    label: 'Throttle zero' },
        'Shift': { control: 'throttleUp',  label: 'Throttle up' },
        'Ctrl': { control: 'throttleDown', label: 'Throttle down' },
        'a': { control: 'rotateLeft',      label: 'Rotate left' },
        'd': { control: 'rotateRight',     label: 'Rotate right' },
        'w': { control: 'forwardBurn',     label: 'Temporary forward burn' },
        's': { control: 'reverseBurn',     label: 'Temporary reverse burn' },
        'l': { control: 'turnPrograde',    label: 'Turn prograde' },
        'h': { control: 'turnRetrograde',  label: 'Turn retrotrade' },
        'j': { control: 'turnNormal',      label: 'Turn normal' },
        'k': { control: 'turnAntinormal',  label: 'Turn antinormal' }
      };
      if(collided) {
        return (
           <div style={{textAlign: 'center', marginTop: '25px'}}>
             <strong>The vessel collided with a sphere</strong>
             <br />
             <em>(Sorry about that)</em>
           </div>
        );
      }
      return (
        <div style={{fontFamily: 'sans-serif'}}>
          <KeyboardController
            bindings={keyBindings}
            onControlDown={c => this.handleControlDown(c)}
            onControlUp={c => this.handleControlUp(c)}
          >
            <Overlay vessel={vessel} {...actions} keyBindings={keyBindings} />
            <Stage width={width} height={height}>
              <BackgroundGrid
                width={width}
                height={height}
                size={PIXEL_PER_METER}
                tx={tx % PIXEL_PER_METER}
                ty={ty % PIXEL_PER_METER}
              />
              <Rocket
                rocketTexture={rocket.texture}
                exhaustParticleTexture={particle.texture}
                position={position}
                heading={heading}
                tx={tx} ty={ty}
                burning={burning}
                reverseThrust={reverseThrust}
                throttle={throttle}
              />
              <CenterMark position={{x: width/2, y: height/2}} />
              {spheres}
            </Stage>
          </KeyboardController>
        </div>
      );
    }
  }

  handleControlDown(control) {
    if(control === 'forwardBurn') {
      if(this.props.vessel.reverseThrust) {
        this.props.actions.invertThrust();
        this.setState({tempInvert: true});
      }
      this.props.actions.throttleFull();
    } else if(control === 'reverseBurn') {
      if(!this.props.vessel.reverseThrust) {
        this.props.actions.invertThrust();
        this.setState({tempInvert: true});
      }
      this.props.actions.throttleFull();
    } else {
      this.setState({controls: {...this.state.controls, [control]: true}});
    }
  }

  handleControlUp(control) {
    if(control === 'forwardBurn' || control === 'reverseBurn') {
      if(this.state.tempInvert) {
        this.props.actions.invertThrust();
        this.setState({tempInvert: null});
      }
      this.props.actions.throttleZero();
    } else {
      this.setState({controls: {...this.state.controls, [control]: false}});
    }
  }

  handleSizeChanged() {
    this.setState({width: window.innerWidth, height: window.innerHeight});
  }

  eventToKeyControl(event) {
    if(event.keyCode === 16) { // SHIFT
      return 'throttleUp';
    } else if(event.keyCode === 17) { // CTRL
      return 'throttleDown';
    } else {
      switch(event.key) {
      case 'z':
        return 'throttleFull';
      case 'x':
        return 'throttleZero';
      case 'a':
        return 'rotateLeft';
      case 'd':
        return 'rotateRight';
      case 'w':
        return 'forwardBurn';
      case 's':
        return 'reverseBurn';
      case 'l':
        return 'turnPrograde';
      case 'h':
        return 'turnRetrograde';
      case 'j':
        return 'turnNormal';
      case 'k':
        return 'turnAntinormal';
      }
    }
  }

  setPhysics(key, value) {
    this.setState({
      physics: {
        ...this.state.physics,
        [key]: value
      }
    });
  }
}

export default connect(
  state => state,
  dispatch => ({actions: bindActionCreators(vesselActions, dispatch)})
)(App);
