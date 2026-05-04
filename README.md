# Домашнее задание — 3D Gallery (GLB)

Интерактивная веб-галерея для предпросмотра 3D-моделей серверного и сетевого оборудования. Реализована поверх лабораторной работы №3 (cloud_hosting.ru).

## Что добавлено

- Каталог оборудования с 3D-превью моделей (Three.js + GLTFLoader)
- Детальный просмотр модели: вращение мышью (OrbitControls), зум, смена ракурсов
- Загрузка пользовательских `.glb` файлов (хранятся в IndexedDB браузера)
- Автоматическое центрирование моделей по основанию
- Интеграция 3D-вьюера в существующую страницу «Каталог» (tariffs.html)

## Структура проекта

```
project-root/
├── pages/
│   ├── index.html           // Главная страница
│   ├── tariffs.html         // Каталог оборудования (3D Gallery)
│   ├── calculator.html      // Калькулятор
│   ├── about.html           // О компании
│   └── contact.html         // Форма заявки
├── js/
│   ├── components/
│   │   ├── header/          // Шапка сайта
│   │   ├── footer/          // Подвал сайта
│   │   ├── back-button/     // Кнопка «Назад»
│   │   ├── product/         // Детальная карточка товара
│   │   └── product-card/    // Карточка в каталоге
│   └── pages/
│       ├── main/index.js    // Каталог оборудования (список карточек)
│       └── product/index.js // Страница товара + 3D-вьюер
├── models/                  // 3D-модели в формате GLB
│   ├── server.glb
│   ├── laptop.glb
│   └── router.glb
├── css/style.css            // Основные стили
├── app.js                   // Логика standalone-галереи
├── detail.js                // Standalone детальный просмотр
├── idb.js                   // Модуль IndexedDB (пользовательские модели)
└── styles.css               // Стили standalone-галереи
```

## Технологии

- **Three.js** v0.160.0 (ES-модули через importmap)
- **GLTFLoader** — загрузка .glb моделей
- **OrbitControls** — вращение камеры мышью
- **IndexedDB** — хранение пользовательских моделей в браузере
- Vanilla JavaScript (ES6 modules)
- Bootstrap 5.3
- CSS Custom Properties

## Ключевые фрагменты кода

### Import Map (подключение Three.js без сборщика)

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

### Загрузка GLB-модели и центрирование

```js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const gltf = await new Promise((resolve, reject) => {
  loader.load('models/server.glb', resolve, undefined, reject);
});
const model = gltf.scene;

// Центрирование модели по основанию
const box = new THREE.Box3().setFromObject(model);
const center = box.getCenter(new THREE.Vector3());
model.position.x -= center.x;
model.position.z -= center.z;
model.position.y -= box.min.y; // основание на уровне пола

scene.add(model);
```

### OrbitControls (вращение камеры)

```js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
```

### Сохранение модели в IndexedDB

```js
export async function saveModel(name, arrayBuffer) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('models', 'readwrite');
    const store = tx.objectStore('models');
    store.put({ name, data: arrayBuffer, addedAt: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
```

### Интеграция 3D-вьюера в страницу товара

```js
// js/pages/product/index.js — динамический импорт Three.js
async init3DViewer() {
  const THREE = await import("three");
  const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
  const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");

  const container = document.getElementById("viewer3d");
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f7fb);
  // ... загрузка модели, настройка камеры, анимация
}
```

## Каталог оборудования

| Товар | Цена | 3D-модель |
|-------|------|-----------|
| Маршрутизатор | 12 490 ₽ | router.glb |
| Сервер | 89 900 ₽ | server.glb |
| Ноутбук администратора | 74 990 ₽ | laptop.glb |

## Установка и запуск

1. Клонировать репозиторий и переключиться на ветку `hw-2`
2. Поместить `.glb` файлы в папку `models/`
3. Открыть проект через локальный сервер:
   ```bash
   python3 -m http.server 5500
   ```
   или через Live Server в VS Code
4. Перейти на `http://localhost:5500/pages/tariffs.html`

## Где взять 3D-модели

Бесплатные GLB-модели можно скачать на:
- [Sketchfab](https://sketchfab.com) — выбрать формат glTF при скачивании
- [Poly Pizza](https://poly.pizza) — модели сразу в GLB
