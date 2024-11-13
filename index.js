import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 2;
controls.maxDistance = 10;

//Post Process
const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.5,
  0.2
);

const composer = new EffectComposer(renderer);
composer.addPass(renderPass);
composer.addPass(bloomPass);

const ambientLight = new THREE.AmbientLight("#fff", 10);

const dirLight = new THREE.DirectionalLight("#fff", 1);
dirLight.position.set(5, 5, 5);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: "#fff" });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 0, 0);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(),
  new THREE.MeshStandardMaterial({ color: "#fff" })
);
sphere.position.x = 2;

const loader = new GLTFLoader();
loader.load(
  "./models/police_car/scene.gltf",
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.set(1, 1, 1);
    scene.add(model);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (err) => {
    console.error("Error loading model:", err);
  }
);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

//Shader
const vertexShader = `
    varying vec3 vPosition;

    void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    varying vec3 vPosition;

    void main() {
        gl_FragColor = vec4(abs(vPosition.x), abs(vPosition.y), abs(vPosition.z), 1.0);
    }
`;

const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});

const newCube = new THREE.Mesh(new THREE.BoxGeometry(), shaderMaterial);

// scene.add(cube);
// scene.add(sphere);
// scene.add(dirLight);
scene.add(ambientLight);
scene.add(newCube);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//GSAP
// gsap.to(cube.position, {
//   y: 2,
//   x: 1,
//   duration: 1,
//   ease: "power1.inOut",
//   repeat: -1,
//   yoyo: true
// });

const onMouseMove = (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

window.addEventListener("mousemove", onMouseMove);

const originMaterial = new THREE.MeshStandardMaterial({ color: "#fff" });
const highlightMaterial = new THREE.MeshStandardMaterial({
  color: "blue",
  emissive: "red",
  emissiveIntensity: 0.5,
});

let isHovered = false;

const animate = () => {
  requestAnimationFrame(animate);

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(cube);

  if (intersects.length > 0 && !isHovered) {
    cube.material = highlightMaterial;
    isHovered = true;

    gsap.to(cube.scale, {
      x: 1.5,
      y: 1.5,
      z: 1.5,
      duration: 1.5,
      ease: "power1.out",
    });
  } else if (intersects.length === 0 && isHovered) {
    cube.material = originMaterial;
    isHovered = false;

    gsap.to(cube.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1.5,
      ease: "power1.out",
    });
  }

  controls.update();
  renderer.setClearColor("blue");
  composer.render();
};

animate();
