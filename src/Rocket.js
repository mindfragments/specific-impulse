import React, {PropTypes, Component} from 'react';
import {DisplayObjectContainer, Sprite} from 'react-pixi';

const PIXEL_PER_METER = 25;

import Exhaust from './pixi-components/Exhaust';

export default class Rocket extends Component {
  static propTypes = {
    rocketTexture: PropTypes.object.isRequired,
    exhaustParticleTexture: PropTypes.object.isRequired,
    position: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    heading: PropTypes.number.isRequired,
    burning: PropTypes.bool.isRequired,
    reverseThrust: PropTypes.bool.isRequired,
    throttle: PropTypes.number.isRequired,
    tx: PropTypes.number.isRequired,
    ty: PropTypes.number.isRequired
  };

  render() {
    const {
      rocketTexture,
      exhaustParticleTexture,
      position,
      heading, burning,
      reverseThrust,
      throttle,
      tx, ty
    } = this.props;
    const pos = {
      x: tx + position.x * PIXEL_PER_METER,
			y: ty + position.y * PIXEL_PER_METER
    };
    const exhaustOffset = {
      x: 0,
      y: 14,
    };
    const exhaust = burning && (
      <Exhaust
        position={{x: 0, y: 15}}
        scale={{x: 0.5, y: 0.5}}
        particle={exhaustParticleTexture}
        rotation={reverseThrust ? Math.PI : 0}
        throttle={throttle}
      />
    );
    return (
      <DisplayObjectContainer position={pos} rotation={heading}>
        <Sprite
					texture={rocketTexture}
					anchor={new PIXI.Point(0.5, 0.7)}
				/>
        {exhaust}
      </DisplayObjectContainer>
    );
  }
}
