import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
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

const ambientLight = new THREE.AmbientLight("#fff", 0.5);

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

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

scene.add(cube);
scene.add(sphere);
scene.add(dirLight);
scene.add(ambientLight);

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
      ease: " power1.out",
    });
  } else if (intersects.length === 0 && isHovered) {
    cube.material = originMaterial;
    isHovered = false;

    gsap.to(cube.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1.5,
      ease: " power1.out",
    });
  }

  controls.update();
  renderer.render(scene, camera);
};

animate();
