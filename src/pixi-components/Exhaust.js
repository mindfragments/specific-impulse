import {PropTypes} from 'react';
import PIXI from 'pixi.js';
import {CustomPIXIComponent} from 'react-pixi';

import textureShape from '../shapes/textureShape';
import pointShape from '../shapes/pointShape';

/**
 * Rocket exhaust. Wo gehobelt wird fallen Späne.
 *
 * WARNING: rocket engine exhaust can be hazardous to your health.
 *   Do not smoke this class.
 */
const Exhaust = CustomPIXIComponent({
  customDidAttach() {
    let elapsed = new Date().getTime();
    const emitterTick = () => {
      let now = new Date().getTime();
      this._displayObject._emitter.update((now - elapsed) * 0.001);
      elapsed = now;
      this._displayObject._rAFID = requestAnimationFrame(emitterTick);
    }
    emitterTick();
  },

  customWillDetach() {
    const rAFID = this._displayObject._rAFID;
    if(typeof rAFID !== 'undefined') {
      cancelAnimationFrame(rAFID);
    }
  },

  customDisplayObject(props) {
    const {position, throttle, particle, rotation, scale} = props;
    const container = new PIXI.Container({position, rotation, scale});
    container._emitter = new PIXI.particles.Emitter(
      container,
      [particle],
      {
	      "alpha": {
		      "start": 0.62,
		      "end": 0
	      },
	      "scale": {
		      "start": 0.1,
		      "end": 0.01,
		      "minimumScaleMultiplier": 7
	      },
	      "color": {
		      "start": "#c4b43f",
		      "end": "#ff0000"
	      },
	      "speed": {
		      "start": 100,
		      "end": 200
	      },
	      "acceleration": {
		      "x": 5,
		      "y": 0
	      },
	      "startRotation": {
		      "min": 60,
		      "max": 120
	      },
	      "noRotation": false,
	      "rotationSpeed": {
		      "min": 0,
		      "max": 0
	      },
	      "lifetime": {
		      "min": 0.24,
		      "max": 0.91
	      },
	      "blendMode": "screen",
	      "frequency": 0.001,
	      "emitterLifetime": 100,
	      "maxParticles": 1000,
	      "pos": {
          "x": 0,
          "y": 0
        },
	      "addAtBack": false,
	      "spawnType": "circle",
	      "spawnCircle": {
		      "x": 0,
		      "y": 0,
		      "r": 10,
		      "minR": 0
	      }
      }
    );
    return container;
  },

  applyDisplayObjectProps(oldProps, newProps) {
    if(oldProps.throttle !== newProps.throttle) {
      const emitter = this._displayObject._emitter;
      emitter.frequency = 1/(10 * newProps.throttle);
    }
    if(oldProps.position !== newProps.position) {
      this._displayObject.position = newProps.position;
    }
    if(oldProps.rotation !== newProps.rotation) {
      this._displayObject.rotation = newProps.rotation;
    }
    if(oldProps.scale !== newProps.scale) {
      this._displayObject.scale = newProps.scale;
    }
  }
});

Exhaust.propTypes = {
  // texture to use for the particles
  particle: textureShape.isRequired,
  // position (relative to parent)
  position: pointShape.isRequired,
  // controls how fast particles emit (0..100)
  throttle: PropTypes.number.isRequired,
  // rotation of container element (angle in radians)
  rotation: PropTypes.number.isRequired,
  // scale of container element
  scale: pointShape.isRequired
};

export default Exhaust;
