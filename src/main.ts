import './style.css'
import ARColorPicker from './arColorPicker.ts'
import ARColorTest from './arColorTest.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `

<div id="left">
  <div id="customColorPicker">
    <canvas id="colorCanvas" width="256" height="256"></canvas>
  </div>
  <p>
    <span id="colorBox" style="display: inline-block; width: 50px; height: 20px; border: 1px solid #000;"></span>
    <span id="selectedColor" style="color: white; margin-left: 10px;">None</span>
  </p>
</div>
<canvas id="modelCanvas" width="400" height="400"></canvas>
`
const arColorPicker = new ARColorPicker(
  document.getElementById('colorCanvas') as HTMLCanvasElement,
  document.getElementById('colorBox') as HTMLElement,
  document.getElementById('selectedColor') as HTMLElement);

const arColorTest = new ARColorTest(
  document.getElementById('modelCanvas') as HTMLCanvasElement);

arColorPicker.run(arColorTest.updateModelColor.bind(arColorTest));
