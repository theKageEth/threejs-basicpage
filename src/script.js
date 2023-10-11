import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
// const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// const axel = new THREE.AxesHelper();
// scene.add(axel);

/**
 * Lights
 */

// const ambientLight = new THREE.AmbientLight(0x404040, 1);
// gui.add(ambientLight, "intensity", 0.5, 50, 0.1);
// gui.addColor(ambientLight, "color");
// scene.add(ambientLight);

// const light = new THREE.PointLight(1, 100);
// light.position.set(0, 1, 5);
// gui.add(light, "intensity", 0.5, 50, 0.1);
// gui.addColor(light, "color");
// scene.add(light);

/**
 * Textures
 */
// const LoadingManager = new THREE.LoadingManager();
// LoadingManager.onStart = () => {
//   console.log("starting");
// };
// LoadingManager.onLoad = () => {
//   console.log("loading");
// };
// LoadingManager.onError = (url) => {
//   console.log("error " + url);
// };

const textureloader = new THREE.TextureLoader();
const matCapTexture = textureloader.load("/textures/matcaps/8.png");
const matCapTexture2 = textureloader.load("/textures/matcaps/3.png");

/**
 * Fonts
 */
const fontLoader = new FontLoader();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Phantom3.dev", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 6,
    bevelEnabled: false,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 3,
  });
  //   textGeometry.computeBoundingBox();
  //   textGeometry.translate(
  //     -textGeometry.boundingBox.max.x * 0.5,
  //     -textGeometry.boundingBox.max.y * 0.5,
  //     -textGeometry.boundingBox.max.z * 0.5));

  textGeometry.center();

  const material = new THREE.MeshMatcapMaterial({ matcap: matCapTexture });
  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matCapTexture });

  const textobj = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(textobj);

  const ringGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

  for (let i = 0; i < 50; i++) {
    const ringObj = new THREE.Mesh(ringGeometry, material);
    ringObj.position.x = (Math.random() - 0.5) * 10;
    ringObj.position.y = (Math.random() - 0.5) * 10;
    ringObj.position.z = (Math.random() - 0.5) * 10;

    ringObj.rotation.x = Math.random() * Math.PI;
    ringObj.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    ringObj.scale.set(scale, scale, scale);

    scene.add(ringObj);
  }
});

/**
 * Object
 */
const cube = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshMatcapMaterial({ matcap: matCapTexture2 });

const cubeA = new THREE.Mesh(cube, cubeMaterial);
cubeA.position.set(1.5, -1, 0.5);
const cubeB = new THREE.Mesh(cube, cubeMaterial);
cubeB.position.set(-1.5, 0.8, -1);
scene.add(cubeA, cubeB);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0.5;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  cubeA.rotation.y = elapsedTime;
  cubeA.rotation.x = -elapsedTime;
  cubeB.rotation.y = elapsedTime;
  cubeB.rotation.x = elapsedTime;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
