import {CustomPIXIComponent} from 'react-pixi';
import PIXI from 'pixi.js';

const BackgroundGrid = CustomPIXIComponent({
  customDisplayObject(props) {
    const graphics = new PIXI.Graphics();
    this._draw(graphics, props);
    return graphics;
  },

  applyDisplayObjectProps(oldProps, newProps) {
    const graphics = this._displayObject;
    if(oldProps.width !== newProps.width ||
       oldProps.height !== newProps.height ||
       oldProps.size !== newProps.size ||
       oldProps.tx !== newProps.tx ||
       oldProps.ty !== newProps.ty) {
      this._draw(graphics, newProps);
    }
  },

  _draw(graphics, props) {
    const {width, height, size, tx, ty} = props;
    graphics.clear();
    graphics.beginFill(0x000000, 1.0);
    graphics.drawRect(0, 0, width, height);
    graphics.endFill();
    graphics.lineStyle(1, 0x444444);
    for(let x = 0, n = Math.ceil(width / size) + 2; x < n; x++) {
      graphics.moveTo(tx + x * size, 0);
			graphics.lineTo(tx + x * size, height);
    }
    for(let y = 0, m = Math.ceil(height / size) + 2; y < m; y++) {
      graphics.moveTo(0, ty + y * size);
      graphics.lineTo(width, ty + y * size);
    }
  }
});

export default BackgroundGrid;
