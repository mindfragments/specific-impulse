import {CustomPIXIComponent} from 'react-pixi';
import PIXI from 'pixi.js';

const PIXEL_PER_METER = 25;

/**
 * Renders the 2D version of a sphere.
 *
 * (Among engineers this is sometimes also referred to as a "circle")
 */
const Sphere = CustomPIXIComponent({
  customDisplayObject(props) {
    const {position, radius, tx, ty} = props;
    const graphics = new PIXI.Graphics({
      position: {
        x: (position.x - radius) * PIXEL_PER_METER + tx,
        y: (position.y - radius) * PIXEL_PER_METER + ty
      }
    });
    this._draw(graphics, props);
    return graphics;
  },

  applyDisplayObjectProps(oldProps, newProps) {
    const graphics = this._displayObject;
    if(newProps.tx !== oldProps.tx || newProps.ty !== oldProps.ty) {
      const {position, radius, tx, ty} = newProps;
      graphics.position.set(
        (position.x - radius) * PIXEL_PER_METER + tx,
        (position.y - radius) * PIXEL_PER_METER + ty
      );
    }
  },

  _draw(graphics, props) {
    const {radius, color} = props;
    graphics.beginFill(color, 1.0);
    graphics.drawCircle(
      radius * PIXEL_PER_METER,
      radius * PIXEL_PER_METER,
      radius * PIXEL_PER_METER);
    graphics.endFill();
  }
});

export default Sphere;
