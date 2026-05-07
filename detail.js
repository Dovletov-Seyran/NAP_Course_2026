import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { getModel } from "./idb.js";

const viewer = document.getElementById("viewer");
const modelTitle = document.getElementById("modelTitle");
const zoomInBtn = document.getElementById("zoomIn");
const zoomOutBtn = document.getElementById("zoomOut");
const viewBtns = document.querySelectorAll("[data-view]");

const params = new URLSearchParams(window.location.search);
const name = params.get("name") || "Модель";
const source = params.get("source");
const filesParam = params.get("files");

modelTitle.textContent = name;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d1117);

const camera = new THREE.PerspectiveCamera(
  45,
  viewer.clientWidth / viewer.clientHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(viewer.clientWidth, viewer.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
viewer.appendChild(renderer.domElement);

/* Lighting */
const ambient = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight2.position.set(-5, 5, -5);
scene.add(dirLight2);

const grid = new THREE.GridHelper(20, 20, 0x30363d, 0x21262d);
scene.add(grid);

/* OrbitControls */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;

let modelCenter = new THREE.Vector3();
let modelSize = new THREE.Vector3();
let baseDist = 5;

const loader = new GLTFLoader();

async function loadModels() {
  const group = new THREE.Group();

  if (source === "idb") {
    const record = await getModel(name);
    if (!record) {
      console.error("Model not found in IndexedDB:", name);
      return;
    }
    const gltf = await new Promise((resolve, reject) => {
      loader.parse(record.data, "", resolve, reject);
    });
    group.add(gltf.scene);
  } else if (filesParam) {
    const files = filesParam.split(",");
    let offsetX = 0;

    for (const filePath of files) {
      try {
        const gltf = await new Promise((resolve, reject) => {
          loader.load(filePath.trim(), resolve, undefined, reject);
        });
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.x -= center.x;
        model.position.z -= center.z;
        model.position.y -= box.min.y;

        if (files.length > 1) {
          model.position.x += offsetX;
          offsetX += size.x + 0.5;
        }

        group.add(model);
      } catch (err) {
        console.error("Failed to load:", filePath, err);
      }
    }

    if (files.length > 1) {
      const groupBox = new THREE.Box3().setFromObject(group);
      const groupCenter = groupBox.getCenter(new THREE.Vector3());
      group.position.x -= groupCenter.x;
      group.position.z -= groupCenter.z;
    }
  }

  scene.add(group);

  const bbox = new THREE.Box3().setFromObject(group);
  modelCenter = bbox.getCenter(new THREE.Vector3());
  modelSize = bbox.getSize(new THREE.Vector3());
  const maxDim = Math.max(modelSize.x, modelSize.y, modelSize.z);
  baseDist = (maxDim / (2 * Math.tan((camera.fov * Math.PI) / 360))) * 1.5;

  setCameraView("front");
  controls.target.copy(modelCenter);
  controls.update();
}

function setCameraView(view) {
  const d = baseDist;
  const c = modelCenter;

  switch (view) {
    case "front":
      camera.position.set(c.x, c.y + d * 0.3, c.z + d);
      break;
    case "back":
      camera.position.set(c.x, c.y + d * 0.3, c.z - d);
      break;
    case "left":
      camera.position.set(c.x - d, c.y + d * 0.3, c.z);
      break;
    case "right":
      camera.position.set(c.x + d, c.y + d * 0.3, c.z);
      break;
  }

  camera.lookAt(c);
  controls.target.copy(c);
  controls.update();
}

/*  Zoom  */
zoomInBtn.addEventListener("click", () => {
  camera.position.lerp(controls.target, 0.2);
  controls.update();
});

zoomOutBtn.addEventListener("click", () => {
  const dir = camera.position.clone().sub(controls.target).normalize();
  camera.position.add(dir.multiplyScalar(baseDist * 0.2));
  controls.update();
});

/*  View buttons  */
viewBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    setCameraView(btn.dataset.view);
  });
});

/*  Resize  */
window.addEventListener("resize", () => {
  const w = viewer.clientWidth;
  const h = viewer.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

/*  Animation loop  */
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

loadModels();
animate();
