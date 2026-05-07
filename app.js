import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { saveModel, getAllModels } from './idb.js';

/* Preset models */
const PRESET_MODELS = [
  { name: 'Сервер', files: ['models/server.glb'] },
  { name: 'Ноутбук', files: ['models/laptop.glb'] },
  { name: 'Роутер', files: ['models/router.glb'] },
  { name: 'Сервер + Роутер', files: ['models/server.glb', 'models/router.glb'] },
];

const gallery = document.getElementById('gallery');
const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');
const uploadBtn = document.getElementById('uploadBtn');
const uploadForm = document.getElementById('uploadForm');

function renderPreview(canvas, urls, { fromIDB = false } = {}) {
  const width = canvas.clientWidth || 300;
  const height = canvas.clientHeight || 300;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d1117);

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

  /* Lighting */
  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambient);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);

  const loader = new GLTFLoader();
  const loadPromises = urls.map((url, idx) => {
    return new Promise((resolve) => {
      if (fromIDB) {
        /* url is actually an ArrayBuffer */
        loader.parse(url, '', (gltf) => resolve({ gltf, idx }), () => resolve(null));
      } else {
        loader.load(url, (gltf) => resolve({ gltf, idx }), undefined, () => resolve(null));
      }
    });
  });

  Promise.all(loadPromises).then((results) => {
    const group = new THREE.Group();
    let offsetX = 0;

    results.forEach((res) => {
      if (!res) return;
      const model = res.gltf.scene;

      /* Center model at base */
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      model.position.x -= center.x;
      model.position.z -= center.z;
      model.position.y -= box.min.y;

      if (results.length > 1) {
        model.position.x += offsetX;
        offsetX += size.x + 0.5;
      }

      group.add(model);
    });

    if (results.length > 1) {
      const groupBox = new THREE.Box3().setFromObject(group);
      const groupCenter = groupBox.getCenter(new THREE.Vector3());
      group.position.x -= groupCenter.x;
      group.position.z -= groupCenter.z;
    }

    scene.add(group);

    const bbox = new THREE.Box3().setFromObject(group);
    const bsize = bbox.getSize(new THREE.Vector3());
    const bcenter = bbox.getCenter(new THREE.Vector3());
    const maxDim = Math.max(bsize.x, bsize.y, bsize.z);
    const dist = maxDim / (2 * Math.tan((camera.fov * Math.PI) / 360)) * 1.4;
    camera.position.set(bcenter.x + dist * 0.5, bcenter.y + dist * 0.4, bcenter.z + dist);
    camera.lookAt(bcenter);

    renderer.render(scene, camera);

    renderer.dispose();
  });
}

/* Create a card element */
function createCard(name, urls, { fromIDB = false } = {}) {
  const card = document.createElement('div');
  card.className = 'card';

  const canvasWrap = document.createElement('div');
  canvasWrap.className = 'card__canvas-wrap';

  const canvas = document.createElement('canvas');
  canvasWrap.appendChild(canvas);

  const fallback = document.createElement('div');
  fallback.className = 'card__fallback';
  fallback.textContent = '🧩';
  canvasWrap.appendChild(fallback);

  const label = document.createElement('div');
  label.className = 'card__label';
  label.textContent = name;

  card.appendChild(canvasWrap);
  card.appendChild(label);

  card.addEventListener('click', () => {
    const params = new URLSearchParams();
    params.set('name', name);
    if (fromIDB) {
      params.set('source', 'idb');
    } else {
      params.set('files', urls.join(','));
    }
    window.location.href = `detail.html?${params.toString()}`;
  });

  gallery.appendChild(card);

  requestAnimationFrame(() => {
    canvas.width = canvasWrap.clientWidth;
    canvas.height = canvasWrap.clientHeight;

    if (fromIDB) {
      renderPreview(canvas, urls, { fromIDB: true });
    } else {
      renderPreview(canvas, urls);
    }

    setTimeout(() => {
      fallback.style.display = 'none';
    }, 2000);
  });
}

/* Init gallery */
async function init() {
  /* Preset models */
  PRESET_MODELS.forEach((m) => {
    createCard(m.name, m.files);
  });

  try {
    const userModels = await getAllModels();
    userModels.forEach((m) => {
      createCard(m.name, [m.data], { fromIDB: true });
    });
  } catch (err) {
    console.warn('Could not load user models from IndexedDB:', err);
  }
}

/* \Upload handling */
let selectedFile = null;

fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) {
    selectedFile = fileInput.files[0];
    fileName.textContent = selectedFile.name;
    uploadBtn.disabled = false;
  }
});

uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!selectedFile) return;

  const arrayBuffer = await selectedFile.arrayBuffer();
  const modelName = selectedFile.name.replace('.glb', '');

  await saveModel(modelName, arrayBuffer);

  createCard(modelName, [arrayBuffer], { fromIDB: true });

  selectedFile = null;
  fileInput.value = '';
  fileName.textContent = 'Файл не выбран';
  uploadBtn.disabled = true;
});

init();
