# ДЗ №2 — 3D Галерея оборудования (Three.js + IndexedDB)

> **Тема:** cloud_hosting.ru  
> [← Вернуться к оглавлению](https://github.com/Dovletov-Seyran/NAP_Course_2026)

---

## Содержание

- [Цель](#цель)
- [Что реализовано](#что-реализовано)
- [Структура проекта](#структура-проекта)
- [Three.js — 3D-рендеринг](#threejs--3d-рендеринг)
  - [Сцена, камера, рендерер](#сцена-камера-рендерер)
  - [Загрузка GLB-моделей (GLTFLoader)](#загрузка-glb-моделей-gltfloader)
  - [OrbitControls — вращение мышью](#orbitcontrols--вращение-мышью)
  - [Автоматическое позиционирование камеры](#автоматическое-позиционирование-камеры)
- [IndexedDB — хранение моделей](#indexeddb--хранение-моделей)
  - [Открытие базы данных](#открытие-базы-данных)
  - [Сохранение модели](#сохранение-модели)
  - [Получение всех моделей](#получение-всех-моделей)
- [Галерея (app.js)](#галерея-appjs)
  - [Карточки с 3D-превью](#карточки-с-3d-превью)
  - [Загрузка пользовательских моделей](#загрузка-пользовательских-моделей)
- [Детальный просмотр (detail.js)](#детальный-просмотр-detailjs)
  - [Управление камерой](#управление-камерой)
  - [Кнопки ракурсов](#кнопки-ракурсов)
- [Import Map](#import-map)
- [Запуск](#запуск)

---

## Цель

Создание интерактивной 3D-галереи серверного оборудования с использованием Three.js. Модели загружаются в формате GLB, пользователь может добавлять свои модели (сохраняются в IndexedDB).

## Что реализовано

- Галерея карточек с 3D-превью моделей на `<canvas>`
- Детальный просмотр модели с вращением (OrbitControls)
- Загрузка GLB-моделей через GLTFLoader
- Хранение пользовательских моделей в IndexedDB
- Кнопки смены ракурса (спереди, сзади, слева, справа)
- Зум (приближение/отдаление)
- Import Map для загрузки Three.js из CDN без сборщика

## Структура проекта

```
hw-2/
├── index.html          ← Главная — галерея карточек
├── detail.html         ← Детальный просмотр модели
├── app.js              ← Логика галереи + превью
├── detail.js           ← Логика детального просмотра
├── idb.js              ← Работа с IndexedDB
├── styles.css          ← Стили галереи
├── css/style.css       ← Общие стили сайта
└── models/
    ├── server.glb      ← 3D-модель сервера
    ├── laptop.glb      ← 3D-модель ноутбука
    └── router.glb      ← 3D-модель роутера
```

## Three.js — 3D-рендеринг

### Сцена, камера, рендерер

Базовая настройка Three.js — создаём сцену, перспективную камеру и WebGL-рендерер:

```js
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d1117);

const camera = new THREE.PerspectiveCamera(
  45,                                    // угол обзора
  viewer.clientWidth / viewer.clientHeight,  // соотношение сторон
  0.1,                                   // ближняя плоскость
  1000                                   // дальняя плоскость
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(viewer.clientWidth, viewer.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
viewer.appendChild(renderer.domElement);
```

Освещение — ambient (общий свет) + два directional (направленных):

```js
const ambient = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);
```

### Загрузка GLB-моделей (GLTFLoader)

GLB — бинарный формат glTF, содержит геометрию, материалы и текстуры в одном файле. `GLTFLoader` загружает и парсит его:

```js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

// Загрузка из файла (URL)
loader.load('models/server.glb', (gltf) => {
  scene.add(gltf.scene);
});

// Загрузка из ArrayBuffer (IndexedDB)
loader.parse(arrayBuffer, '', (gltf) => {
  scene.add(gltf.scene);
});
```

### OrbitControls — вращение мышью

OrbitControls позволяет вращать камеру вокруг модели мышью, с плавным затуханием:

```js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;      // плавное замедление
controls.dampingFactor = 0.08;

// В цикле анимации:
function animate() {
  requestAnimationFrame(animate);
  controls.update();                // обновляем controls каждый кадр
  renderer.render(scene, camera);
}
animate();
```

### Автоматическое позиционирование камеры

После загрузки модели вычисляем её bounding box, чтобы камера автоматически отъехала на нужное расстояние:

```js
const bbox = new THREE.Box3().setFromObject(group);
const center = bbox.getCenter(new THREE.Vector3());
const size = bbox.getSize(new THREE.Vector3());
const maxDim = Math.max(size.x, size.y, size.z);

// Расстояние, чтобы модель целиком поместилась в кадр
const dist = maxDim / (2 * Math.tan((camera.fov * Math.PI) / 360)) * 1.5;

camera.position.set(center.x + dist * 0.5, center.y + dist * 0.3, center.z + dist);
camera.lookAt(center);
```

## IndexedDB — хранение моделей

### Открытие базы данных

IndexedDB — браузерная NoSQL база для хранения больших объёмов данных (в т.ч. ArrayBuffer). Работает через события:

```js
const DB_NAME = 'gallery3d';
const DB_VERSION = 1;
const STORE_NAME = 'models';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'name' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
```

### Сохранение модели

Пользователь загружает `.glb` файл → читаем как `ArrayBuffer` → сохраняем в IndexedDB:

```js
export async function saveModel(name, arrayBuffer) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ name, data: arrayBuffer, addedAt: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
```

### Получение всех моделей

При загрузке галереи достаём все пользовательские модели:

```js
export async function getAllModels() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
```

## Галерея (app.js)

### Карточки с 3D-превью

Каждая карточка содержит `<canvas>`, на котором рендерится статичный превью модели. Клик открывает детальный просмотр:

```js
const PRESET_MODELS = [
  { name: 'Сервер', files: ['models/server.glb'] },
  { name: 'Ноутбук', files: ['models/laptop.glb'] },
  { name: 'Роутер', files: ['models/router.glb'] },
  { name: 'Сервер + Роутер', files: ['models/server.glb', 'models/router.glb'] },
];

function createCard(name, urls, { fromIDB = false } = {}) {
  const card = document.createElement('div');
  card.className = 'card';

  const canvas = document.createElement('canvas');
  // ... создаём элементы карточки

  card.addEventListener('click', () => {
    const params = new URLSearchParams();
    params.set('name', name);
    if (fromIDB) params.set('source', 'idb');
    else params.set('files', urls.join(','));
    window.location.href = `detail.html?${params.toString()}`;
  });

  // Рендерим 3D-превью на canvas
  renderPreview(canvas, urls, { fromIDB });
}
```

### Загрузка пользовательских моделей

Пользователь выбирает `.glb` файл → читаем как ArrayBuffer → сохраняем в IndexedDB → создаём карточку:

```js
uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!selectedFile) return;

  const arrayBuffer = await selectedFile.arrayBuffer();
  const modelName = selectedFile.name.replace('.glb', '');

  await saveModel(modelName, arrayBuffer);
  createCard(modelName, [arrayBuffer], { fromIDB: true });
});
```

## Детальный просмотр (detail.js)

### Управление камерой

Зум через кнопки — приближение интерполяцией к центру, отдаление по направлению от центра:

```js
zoomInBtn.addEventListener('click', () => {
  camera.position.lerp(controls.target, 0.2);
  controls.update();
});

zoomOutBtn.addEventListener('click', () => {
  const dir = camera.position.clone().sub(controls.target).normalize();
  camera.position.add(dir.multiplyScalar(baseDist * 0.2));
  controls.update();
});
```

### Кнопки ракурсов

Четыре кнопки переключают камеру на стандартные позиции (спереди, сзади, слева, справа):

```js
function setCameraView(view) {
  const d = baseDist;
  const c = modelCenter;

  switch (view) {
    case 'front': camera.position.set(c.x, c.y + d*0.3, c.z + d); break;
    case 'back':  camera.position.set(c.x, c.y + d*0.3, c.z - d); break;
    case 'left':  camera.position.set(c.x - d, c.y + d*0.3, c.z); break;
    case 'right': camera.position.set(c.x + d, c.y + d*0.3, c.z); break;
  }

  camera.lookAt(c);
  controls.target.copy(c);
  controls.update();
}
```

## Import Map

Вместо сборщика (Vite/Webpack) используется Import Map — браузерный способ указать, откуда импортировать модули:

```html
<script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
      "three/examples/jsm/": "https://unpkg.com/three@0.160.0/examples/jsm/"
    }
  }
</script>
```

Это позволяет писать `import * as THREE from 'three'` без установки пакетов.

## Запуск

```bash
# Нужен локальный сервер (из-за ES-модулей и CORS)
# Вариант 1 — Live Server в VS Code
# Открыть index.html через Live Server

# Вариант 2 — Python
python3 -m http.server 8080
# Открыть http://localhost:8080
```
