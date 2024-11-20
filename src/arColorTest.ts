import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default class ArColorTest {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private model: THREE.Group | null = null;
    private mouseX: number = 0;
    private mouseY: number = 0;

    constructor(canvas: HTMLCanvasElement, video: HTMLVideoElement) {
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

        // 4. 비디오 텍스처 생성
        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.NearestFilter;
        videoTexture.magFilter = THREE.NearestFilter;
        videoTexture.format = THREE.RGBAFormat;

        // 5. 비디오 텍스처를 배경으로 설정
        this.scene.background = videoTexture;
    
        // 7. ShaderMaterial 생성
        const shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vPosition;
                void main() {
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 uColor;
                varying vec3 vPosition;
                void main() {
                    float r = uColor.r;
                    float g = uColor.g;
                    float b = uColor.b;
                    float a = max(g * 0.6, max(r, b * 0.3));
                    gl_FragColor = vec4(uColor, min(a, 1.0));
                }
            `,
            transparent: true,
            uniforms: {
                uColor: { value: new THREE.Color(0xff0000) }
            }
        });

        // 8. GLTFLoader를 사용하여 GLB 파일 로드
        const loader = new GLTFLoader();
        loader.load('models/arrow.glb', (gltf: any) => {
            this.model = gltf.scene;

            if (this.model) {

                // 모델의 모든 Mesh에 ShaderMaterial 적용
                this.model.traverse((child) => {
                    if ((child as THREE.Mesh).isMesh) {
                        (child as THREE.Mesh).material = shaderMaterial;
                    }
                });

                this.scene.add(this.model);
                this.model.scale.x = 0.03;
                this.model.scale.y = 0.03;
                this.model.scale.z = 0.001;
            }
            else {
                console.error('Model not found');
            }

        }, undefined, (error: unknown) => {
            console.error('An error happened', error);
        });

        // 7. 마우스 움직임 이벤트 리스너 추가
        window.addEventListener('mousemove', this.onMouseMove.bind(this), false);

        // 8. 애니메이션 루프 설정
        this.animate();
    }

    // 9. 마우스 움직임 이벤트 핸들러
    private onMouseMove(event: MouseEvent): void {

        // 마우스 좌표를 정규화된 장치 좌표로 변환
        this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    // 10. 애니메이션 루프
    private animate(): void {
        requestAnimationFrame(() => this.animate());

        // 마우스 위치에 따라 모델 회전
        if (this.model) {
            this.model.rotation.y = this.mouseX * 0.2; // 마우스 X 위치에 따라 Y축 회전
            this.model.rotation.x = this.mouseY * 0.2; // 마우스 Y 위치에 따라 X축 회전
        }
        // 장면 렌더링
        this.renderer.render(this.scene, this.camera);
    }

    public updateModelColor(color: string): void {
        console.log(color);
        // 모델의 색상을 업데이트하는 로직을 여기에 작성할 수 있습니다.
        if (this.model) {
            this.model.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    ((child as THREE.Mesh).material as THREE.ShaderMaterial).uniforms.uColor.value = new THREE.Color(color);
                }
            });
        }
    }
}
