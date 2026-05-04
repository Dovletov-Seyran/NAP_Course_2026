import { ProductComponent } from "../../components/product/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";

export class ProductPage {
  constructor(parent, id, allData) {
    this.parent = parent;
    this.id = id;
    this.allData = allData || [];
  }

  getData() {
    const items = {
      1: {
        id: 1,
        src: "https://img.icons8.com/fluency/96/router.png",
        title: "Маршрутизатор",
        price: "12 490 ₽",
        text: "Высокопроизводительный маршрутизатор корпоративного класса. Поддержка VLAN, QoS, VPN-туннелей. Пропускная способность до 1 Гбит/с. Идеален для организации сети дата-центра или офиса.",
      },
      2: {
        id: 2,
        src: "https://img.icons8.com/fluency/96/server.png",
        title: "Сервер",
        price: "89 900 ₽",
        text: "Стоечный сервер 1U для дата-центров. Процессор Intel Xeon E-2388G, 64 ГБ ECC DDR4, 2x NVMe SSD 1 ТБ в RAID-1, резервный блок питания 550W. Подходит для виртуализации, баз данных и веб-хостинга.",
      },
      3: {
        id: 3,
        src: "https://img.icons8.com/fluency/96/laptop.png",
        title: "Ноутбук администратора",
        price: "74 990 ₽",
        text: "Рабочая станция системного администратора. 16 ГБ DDR5 RAM, SSD NVMe 512 ГБ, IPS-дисплей 15.6\" Full HD. Предустановлен Ubuntu Server. Оптимален для удалённого управления инфраструктурой.",
      },
    };
    return items[this.id] || items[1];
  }

  getModelFiles() {
    const found = this.allData.find((d) => d.id == this.id);
    if (!found || !found.model) return [];
    return Array.isArray(found.model) ? found.model : [found.model];
  }

  get pageRoot() {
    return document.getElementById("product-page");
  }

  getHTML() {
    return `
      <div class="lab-section">
        <div class="container">
          <div id="product-page"></div>
          <div class="viewer3d-section">
            <h3 class="viewer3d-title">3D-модель оборудования</h3>
            <div class="viewer3d-wrap" id="viewer3d"></div>
            <div class="viewer3d-controls">
              <div class="viewer3d-zoom">
                <button class="viewer3d-btn" id="zoomIn">+</button>
                <button class="viewer3d-btn" id="zoomOut">&minus;</button>
              </div>
              <div class="viewer3d-views">
                <button class="viewer3d-btn" data-view="front">Спереди</button>
                <button class="viewer3d-btn" data-view="back">Сзади</button>
                <button class="viewer3d-btn" data-view="left">Слева</button>
                <button class="viewer3d-btn" data-view="right">Справа</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  clickBack() {
    this.destroy3D();
    const mainPage = new MainPage(this.parent);
    mainPage.render();
  }

  destroy3D() {
    if (this._renderer) {
      this._renderer.dispose();
      this._renderer = null;
    }
    if (this._animId) {
      cancelAnimationFrame(this._animId);
      this._animId = null;
    }
  }

  async init3DViewer() {
    const files = this.getModelFiles();
    if (files.length === 0) return;

    const THREE = await import("three");
    const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
    const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");

    const container = document.getElementById("viewer3d");
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f7fb);

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    this._renderer = renderer;

    /* Lighting */
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dir1 = new THREE.DirectionalLight(0xffffff, 1);
    dir1.position.set(5, 10, 7);
    scene.add(dir1);
    const dir2 = new THREE.DirectionalLight(0xffffff, 0.4);
    dir2.position.set(-5, 5, -5);
    scene.add(dir2);

    /* Grid */
    const grid = new THREE.GridHelper(20, 20, 0xe5e7eb, 0xf0f0f0);
    scene.add(grid);

    /* Controls */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    /* Load models */
    const loader = new GLTFLoader();
    const group = new THREE.Group();
    let offsetX = 0;

    for (const filePath of files) {
      try {
        const gltf = await new Promise((resolve, reject) => {
          loader.load(filePath, resolve, undefined, reject);
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

    scene.add(group);

    /* Fit camera */
    const bbox = new THREE.Box3().setFromObject(group);
    const modelCenter = bbox.getCenter(new THREE.Vector3());
    const modelSize = bbox.getSize(new THREE.Vector3());
    const maxDim = Math.max(modelSize.x, modelSize.y, modelSize.z);
    const baseDist = maxDim / (2 * Math.tan((camera.fov * Math.PI) / 360)) * 1.5;

    function setCameraView(view) {
      const d = baseDist;
      const c = modelCenter;
      switch (view) {
        case "front":  camera.position.set(c.x, c.y + d * 0.3, c.z + d); break;
        case "back":   camera.position.set(c.x, c.y + d * 0.3, c.z - d); break;
        case "left":   camera.position.set(c.x - d, c.y + d * 0.3, c.z); break;
        case "right":  camera.position.set(c.x + d, c.y + d * 0.3, c.z); break;
      }
      camera.lookAt(c);
      controls.target.copy(c);
      controls.update();
    }

    setCameraView("front");

    /* Zoom buttons */
    document.getElementById("zoomIn")?.addEventListener("click", () => {
      camera.position.lerp(controls.target, 0.2);
      controls.update();
    });
    document.getElementById("zoomOut")?.addEventListener("click", () => {
      const dir = camera.position.clone().sub(controls.target).normalize();
      camera.position.add(dir.multiplyScalar(baseDist * 0.2));
      controls.update();
    });

    /* View buttons */
    document.querySelectorAll("[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => setCameraView(btn.dataset.view));
    });

    /* Resize */
    const onResize = () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    /* Animate */
    const animate = () => {
      this._animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }

  render() {
    this.parent.innerHTML = "";
    this.parent.insertAdjacentHTML("beforeend", this.getHTML());

    const backButton = new BackButtonComponent(this.pageRoot);
    backButton.render(this.clickBack.bind(this));

    const product = new ProductComponent(this.pageRoot);
    product.render(this.getData());

    this.init3DViewer();
  }
}
