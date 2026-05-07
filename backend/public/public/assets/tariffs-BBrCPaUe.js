import{H as l,F as p}from"./index-Cy6QL_7t.js";/* empty css              */class u{constructor(t){this.parent=t}getHTML(t){return`
      <div class="card lab-card" style="width: 220px;">
        <div class="card-body text-center">
          <img src="${t.src}" alt="${t.title}" class="mb-3" width="64" height="64">
          <h5 class="card-title">${t.title}</h5>
          <p class="lab-price">${t.price}</p>
          <p class="card-text text-muted small">${t.text}</p>
          <button
            class="btn btn-success w-100"
            id="click-card-${t.id}"
            data-id="${t.id}"
          >Подробнее</button>
        </div>
      </div>
    `}addListeners(t,e){document.getElementById(`click-card-${t.id}`).addEventListener("click",e)}render(t,e){const s=this.getHTML(t);this.parent.insertAdjacentHTML("beforeend",s),this.addListeners(t,e)}}class h{constructor(t){this.parent=t}getHTML(t){return`
      <div class="card lab-product-card mt-3">
        <div class="row g-0">
          <div class="col-md-3 d-flex align-items-center justify-content-center p-4">
            <img src="${t.src}" alt="${t.title}" width="96" height="96">
          </div>
          <div class="col-md-9">
            <div class="card-body">
              <h4 class="card-title">${t.title}</h4>
              <p class="lab-price fs-4">${t.price}</p>
              <p class="card-text">${t.text}</p>
              <a href="contact.html?from=${t.id}" class="btn btn-success mt-2">Оставить заявку</a>
            </div>
          </div>
        </div>
      </div>
    `}render(t){const e=this.getHTML(t);this.parent.insertAdjacentHTML("beforeend",e)}}class m{constructor(t){this.parent=t}addListeners(t){document.getElementById("back-button").addEventListener("click",t)}getHTML(){return`
      <button id="back-button" class="btn btn-outline-secondary mb-3" type="button">
        ← Назад к тарифам
      </button>
    `}render(t){const e=this.getHTML();this.parent.insertAdjacentHTML("beforeend",e),this.addListeners(t)}}class f{async get(t){const e=await fetch(t);if(!e.ok)throw new Error(`GET ${t} failed: ${e.status}`);return e.json()}async post(t,e){const s=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!s.ok)throw new Error(`POST ${t} failed: ${s.status}`);return s.json()}async patch(t,e){const s=await fetch(t,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!s.ok)throw new Error(`PATCH ${t} failed: ${s.status}`);return s.json()}async delete(t){const e=await fetch(t,{method:"DELETE"});if(!e.ok)throw new Error(`DELETE ${t} failed: ${e.status}`);return e.status===204?null:e.json()}}const i=new f;class g{constructor(){this.baseUrl=""}getTariffs(t){return`/tariffs${t?`?title=${encodeURIComponent(t)}`:""}`}getTariffById(t){return`/tariffs/${t}`}createTariff(){return"/tariffs"}updateTariffById(t){return`/tariffs/${t}`}deleteTariffById(t){return`/tariffs/${t}`}}const o=new g;class d{constructor(t,e){this.parent=t,this.id=e}async getData(){try{const t=await i.get(o.getTariffById(this.id));this.renderData(t)}catch(t){this.pageRoot.innerHTML='<p style="color:red">Тариф не найден</p>',console.error(t)}}renderData(t){this.pageRoot.innerHTML="",new m(this.pageRoot).render(this.clickBack.bind(this)),new h(this.pageRoot).render(t),this.pageRoot.insertAdjacentHTML("beforeend",this.getEditFormHTML(t)),this.addEditListeners()}getEditFormHTML(t){return`
      <div class="edit-form-card" id="edit-form-card">
        <h3 class="edit-form__title">Редактировать тариф</h3>
        <div class="form-group">
          <label class="form-label">Название</label>
          <input type="text" class="form-input" id="edit-title" value="${t.title}" />
        </div>
        <div class="form-group">
          <label class="form-label">Цена</label>
          <input type="text" class="form-input" id="edit-price" value="${t.price}" />
        </div>
        <div class="form-group">
          <label class="form-label">Краткое описание</label>
          <input type="text" class="form-input" id="edit-text" value="${t.text}" />
        </div>
        <div class="edit-form__actions">
          <button class="form-submit" id="edit-save-btn" style="max-width: 200px;">
            Сохранить →
          </button>
          <span id="edit-status" class="edit-status"></span>
        </div>
      </div>
    `}addEditListeners(){document.getElementById("edit-save-btn").addEventListener("click",async()=>{const t=document.getElementById("edit-title").value.trim(),e=document.getElementById("edit-price").value.trim(),s=document.getElementById("edit-text").value.trim(),r=document.getElementById("edit-status");if(!t||!e||!s){r.textContent="Заполните все поля",r.style.color="red";return}try{const a=await i.patch(o.updateTariffById(this.id),{title:t,price:e,text:s});r.textContent="Сохранено!",r.style.color="var(--green)",this.renderData(a)}catch{r.textContent="Ошибка сохранения",r.style.color="red"}})}get pageRoot(){return document.getElementById("product-page")}getHTML(){return'<div class="lab-section"><div class="container"><div id="product-page"></div></div></div>'}clickBack(){new c(this.parent).render()}render(){this.parent.innerHTML="",this.parent.insertAdjacentHTML("beforeend",this.getHTML()),this.getData()}}class c{constructor(t){this.parent=t}async getData(t=""){try{const e=await i.get(o.getTariffs(t));this.renderData(e)}catch(e){this.pageRoot.innerHTML='<p style="color:red">Ошибка загрузки тарифов</p>',console.error(e)}}renderData(t){this.pageRoot.innerHTML="",t.forEach(e=>{new u(this.pageRoot).render(e,this.clickCard.bind(this))})}get pageRoot(){return document.getElementById("main-page")}getHTML(){return`
      <div class="lab-section">
        <div class="container">
          <h2 class="lab-title">Тарифы VPS/VDS</h2>
          <p class="lab-subtitle">Выберите подходящий тариф — нажмите на карточку, чтобы узнать подробнее</p>
          <div class="filter-row">
            <input
              type="text"
              id="filter-input"
              class="form-input"
              placeholder="Поиск по названию тарифа..."
              style="max-width: 360px; margin-bottom: 28px;"
            />
          </div>
          <div id="main-page" class="d-flex flex-wrap gap-3 justify-content-center"></div>
        </div>
      </div>
    `}clickCard(t){const e=t.target.dataset.id;if(!e)return;const s=document.getElementById("lab-toast"),r=document.getElementById("lab-toast-msg");r&&(r.textContent="Загрузка тарифа..."),s&&new bootstrap.Toast(s,{delay:3e3}).show(),new d(this.parent,e).render()}render(){this.parent.innerHTML="",this.parent.insertAdjacentHTML("beforeend",this.getHTML()),this.getData(),document.getElementById("filter-input").addEventListener("input",s=>{this.getData(s.target.value)});const e=new URLSearchParams(window.location.search).get("open");e&&(history.replaceState(null,"",window.location.pathname),new d(this.parent,e).render())}}new l(document.body).render();new p(document.body).render();const b=document.getElementById("root");new c(b).render();
