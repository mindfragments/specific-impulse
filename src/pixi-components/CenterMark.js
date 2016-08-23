import {CustomPIXIComponent} from 'react-pixi';
import PIXI from 'pixi.js';

const CenterMark = CustomPIXIComponent({
  customDisplayObject(props) {
    const graphics = new PIXI.Graphics(props);
    graphics.lineStyle(2, 0xFF8800);
    graphics.moveTo(-5, 0);
    graphics.lineTo(5, 0);
    graphics.moveTo(0, -5);
    graphics.lineTo(0, 5);
    return graphics;
  }
});

export default CenterMark;
