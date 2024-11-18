import './style.css'
import ARColorPicker from './arColorPicker.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div id="customColorPicker">
  <canvas id="colorCanvas" width="256" height="256"></canvas>
</div>
<p>
  <span id="colorBox" style="display: inline-block; width: 50px; height: 20px; border: 1px solid #000;"></span>
  <span id="selectedColor" style="color: white; margin-left: 10px;">None</span>
</p>
`
const arColorPicker = new ARColorPicker(
  document.getElementById('colorCanvas') as HTMLCanvasElement,
  document.getElementById('colorBox') as HTMLElement,
  document.getElementById('selectedColor') as HTMLElement);
arColorPicker.run();
