export default class ARColorPicker {

  canvas: HTMLCanvasElement;
  colorBox: HTMLElement;
  selectedColorText: HTMLElement;

  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;

  constructor(canvas: HTMLCanvasElement, colorBox: HTMLElement, selectedColorText: HTMLElement) {
    this.canvas = canvas;
    this.colorBox = colorBox;
    this.selectedColorText = selectedColorText;

    if (!canvas) {
      throw new Error('Canvas element not found');
    }

    this.ctx = (canvas as HTMLCanvasElement).getContext('2d')!
    if (!this.ctx) {
      throw new Error('2D context not available');
    }

    this.width = (canvas as HTMLCanvasElement).width;
    this.height = (canvas as HTMLCanvasElement).height;
  }

  run(): void {
    const imageData = this.ctx.createImageData(this.width, this.height);
    let index = 0;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tex_x = x / this.width * 2.0 - 1.0;
        const tex_y = y / this.height * 2.0 - 1.0;

        const rad = Math.atan2(tex_y, tex_x);
        const len = Math.sqrt(tex_y * tex_y + tex_x * tex_x);

        const b = 64 + ((1 - len) * 255) + Math.max(0.0, Math.sin(rad + Math.PI * 0.0 / 3.0)) * (255);
        const r = 64 + ((1 - len) * 255) + Math.max(0.0, Math.sin(rad + Math.PI * 2.0 / 3.0)) * (255);
        const g = 64 + ((1 - len) * 255) + Math.max(0.0, Math.sin(rad + Math.PI * 4.0 / 3.0)) * (255);

        if (len > 1.0) {
          imageData.data[index++] = 0; // R
          imageData.data[index++] = 0; // G
          imageData.data[index++] = 0; // B
          imageData.data[index++] = 0; // A
        }
        else {
          imageData.data[index++] = r; // R
          imageData.data[index++] = g; // G
          imageData.data[index++] = b; // B
          imageData.data[index++] = 255; // A
        }
      }
    }

    this.ctx.putImageData(imageData, 0, 0);

    // 사용자 클릭 시 색상 선택
    this.canvas.addEventListener('click', (e) => {
      const x = e.offsetX;
      const y = e.offsetY;
      const pixel = this.ctx.getImageData(x, y, 1, 1).data;

      if (pixel[3] > 0) {
        const hexColor = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1]
          .toString(16)
          .padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`;

        if (this.colorBox) {
          this.colorBox.style.backgroundColor = hexColor; // 박스에 색상 채우기
        }
        if (this.selectedColorText) {
          this.selectedColorText.textContent = hexColor.toUpperCase(); // 텍스트로 색상 표시
        }
      } else {
        if (this.colorBox) {
          this.colorBox.style.backgroundColor = 'transparent';
        }
        if (this.selectedColorText) {
          this.selectedColorText.textContent = 'Invalid Color';
        }
      }
    });
  }
};

