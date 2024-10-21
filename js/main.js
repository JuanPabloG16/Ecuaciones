// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.JS Scene
const scene = new THREE.Scene();
// Create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Keep track of the mouse position, so we can make the eye move
let mouseX = 0;
let mouseY = 0;
let mousePressed = false;

// Keep the 3D object on a global variable so we can access it later
let object;

// OrbitControls allow the camera to move around the scene
let controls;

// Set which object to render
let objToRender = 'eye';

// Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

// Load the file
loader.load(
  `Models/${objToRender}/scene.gltf`,
  function (gltf) {
    // If the file is loaded, add it to the scene
    object = gltf.scene;

    // Increase the scale of the object
    object.scale.set(10, 10, 10);

    // Adjust the initial position of the object
    object.position.y = -20; // Move the object further down

    scene.add(object);

    // Set how far the camera will be from the 3D model
    camera.position.z = 30; // Adjust this value to make the model appear larger
    camera.position.y = 5; // Adjust the vertical position of the camera

  },
  function (xhr) {
    // While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    // If there is an error, log it
    console.error(error);
  }
);


// Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

// Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

// Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500); // Top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 1);
scene.add(ambientLight);

// This adds controls to the camera, so we can rotate / zoom it with the mouse
controls = new OrbitControls(camera, renderer.domElement);
controls.enableKeys = true; // Enable keyboard controls

// Add mouse down listener to detect when the mouse button is pressed
document.addEventListener('mousedown', function(event) {
  mousePressed = true;
});

// Add mouse up listener to detect when the mouse button is released
document.addEventListener('mouseup', function(event) {
  mousePressed = false;
});

// Add mouse move listener to update mouse position
document.addEventListener('mousemove', function(event) {
  if (mousePressed) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }
});

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  // Here we could add some code to update the scene, adding some automatic movement

  // Make the eye move only when the mouse button is pressed
  if (object && objToRender === "eye" && mousePressed) {
    // I've played with the constants here until it looked good 
    object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  }
  renderer.render(scene, camera);
}

// Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the 3D rendering
animate();
