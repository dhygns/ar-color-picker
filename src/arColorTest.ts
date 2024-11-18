import * as THREE from 'three';

export default class ArColorTest {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private cube: THREE.Mesh;

    constructor(canvas: HTMLCanvasElement) {
        console.log('ArColorTest');
    
        // 1. 장면 생성
        this.scene = new THREE.Scene();
    
        // 2. 카메라 생성
        this.camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
        this.camera.position.z = 5;
    
        // 3. 렌더러 생성
        this.renderer = new THREE.WebGLRenderer({ canvas });
        this.renderer.setSize(canvas.width, canvas.height);
        document.body.appendChild(this.renderer.domElement);
    
        // 4. 기본적인 3D 객체 추가 (큐브)
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
    
        // 5. 애니메이션 루프 설정
        this.animate();
    }

    // 6. 애니메이션 루프
    private animate(): void {
      requestAnimationFrame(() => this.animate());
  
      // 큐브 회전
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;
  
      // 장면 렌더링
      this.renderer.render(this.scene, this.camera);
    }

    public updateModelColor(color: string): void {
        console.log(color);
        // 모델의 색상을 업데이트하는 로직을 여기에 작성할 수 있습니다.
        (this.cube.material as THREE.MeshBasicMaterial).color.set(color);
    }
}
