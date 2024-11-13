import * as THREE from "three";

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.z = 5;

const ambientLight = new THREE.AmbientLight("#fff", 0.5);

const dirLight = new THREE.DirectionalLight("#fff", 1);
dirLight.position.set(5, 5, 5);

// const pointLight = new THREE.PointLight("#fff", 10, 100);
// pointLight.position.set(0.5, 1, 1);

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);

// const texture = new THREE.TextureLoader().load('assets/gettyimages-491578178-612x612.jpg')
// const textureMaterial = new THREE.MeshBasicMaterial({map: texture})

// const spotLight = new THREE.SpotLight('#fff', 3)
// spotLight.position.set(1,1,1)

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: "#fff" });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 0, 0);

scene.add(cube);
// scene.add(spotLight);
// scene.add(pointLight);
// scene.add(pointLightHelper);
scene.add(dirLight);
scene.add(ambientLight);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;

  renderer.render(scene, camera);
}

animate();
