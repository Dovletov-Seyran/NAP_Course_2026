import{n as e,t}from"./footer-BXBCHSiC.js";var n=class{constructor(e){this.parent=e}getHTML(e){return`
      <div class="card lab-card" style="width: 220px;">
        <div class="card-body text-center">
          <img src="${e.src}" alt="${e.title}" class="mb-3" width="64" height="64">
          <h5 class="card-title">${e.title}</h5>
          <p class="lab-price">${e.price}</p>
          <p class="card-text text-muted small">${e.text}</p>
          <button
            class="btn btn-success w-100"
            id="click-card-${e.id}"
            data-id="${e.id}"
          >Подробнее</button>
        </div>
      </div>
    `}addListeners(e,t){document.getElementById(`click-card-${e.id}`).addEventListener(`click`,t)}render(e,t){let n=this.getHTML(e);this.parent.insertAdjacentHTML(`beforeend`,n),this.addListeners(e,t)}},r=class{constructor(e){this.parent=e}getHTML(e){return`
      <div class="card lab-product-card mt-3">
        <div class="row g-0">
          <div class="col-md-3 d-flex align-items-center justify-content-center p-4">
            <img src="${e.src}" alt="${e.title}" width="96" height="96">
          </div>
          <div class="col-md-9">
            <div class="card-body">
              <h4 class="card-title">${e.title}</h4>
              <p class="lab-price fs-4">${e.price}</p>
              <p class="card-text">${e.text}</p>
              <a href="contact.html?from=${e.id}" class="btn btn-success mt-2">Оставить заявку</a>
            </div>
          </div>
        </div>
      </div>
    `}render(e){let t=this.getHTML(e);this.parent.insertAdjacentHTML(`beforeend`,t)}},i=class{constructor(e){this.parent=e}addListeners(e){document.getElementById(`back-button`).addEventListener(`click`,e)}getHTML(){return`
      <button id="back-button" class="btn btn-outline-secondary mb-3" type="button">
        ← Назад к тарифам
      </button>
    `}render(e){let t=this.getHTML();this.parent.insertAdjacentHTML(`beforeend`,t),this.addListeners(e)}},a=new class{async get(e){let t=await fetch(e);if(!t.ok)throw Error(`GET ${e} failed: ${t.status}`);return t.json()}async post(e,t){let n=await fetch(e,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)});if(!n.ok)throw Error(`POST ${e} failed: ${n.status}`);return n.json()}async patch(e,t){let n=await fetch(e,{method:`PATCH`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)});if(!n.ok)throw Error(`PATCH ${e} failed: ${n.status}`);return n.json()}async delete(e){let t=await fetch(e,{method:`DELETE`});if(!t.ok)throw Error(`DELETE ${e} failed: ${t.status}`);return t.status===204?null:t.json()}},o=new class{constructor(){this.baseUrl=``}getTariffs(e){return`/tariffs${e?`?title=${encodeURIComponent(e)}`:``}`}getTariffById(e){return`/tariffs/${e}`}createTariff(){return`/tariffs`}updateTariffById(e){return`/tariffs/${e}`}deleteTariffById(e){return`/tariffs/${e}`}},s=class{constructor(e,t){this.parent=e,this.id=t}async getData(){try{let e=await a.get(o.getTariffById(this.id));this.renderData(e)}catch(e){this.pageRoot.innerHTML=`<p style="color:red">Тариф не найден</p>`,console.error(e)}}renderData(e){console.log(`renderData called`,e),console.log(`pageRoot:`,this.pageRoot),this.pageRoot.innerHTML=``,new i(this.pageRoot).render(this.clickBack.bind(this)),console.log(`back button rendered`),new r(this.pageRoot).render(e),this.pageRoot.insertAdjacentHTML(`beforeend`,this.getEditFormHTML(e)),this.addEditListeners()}getEditFormHTML(e){return`
      <div class="edit-form-card" id="edit-form-card">
        <h3 class="edit-form__title">Редактировать тариф</h3>
        <div class="form-group">
          <label class="form-label">Название</label>
          <input type="text" class="form-input" id="edit-title" value="${e.title}" />
        </div>
        <div class="form-group">
          <label class="form-label">Цена</label>
          <input type="text" class="form-input" id="edit-price" value="${e.price}" />
        </div>
        <div class="form-group">
          <label class="form-label">Краткое описание</label>
          <input type="text" class="form-input" id="edit-text" value="${e.text}" />
        </div>
        <div class="edit-form__actions">
          <button class="form-submit" id="edit-save-btn" style="max-width: 200px;">
            Сохранить →
          </button>
          <span id="edit-status" class="edit-status"></span>
        </div>
      </div>
    `}addEditListeners(){document.getElementById(`edit-save-btn`).addEventListener(`click`,async()=>{console.log(`save clicked`);let e=document.getElementById(`edit-title`).value.trim(),t=document.getElementById(`edit-price`).value.trim(),n=document.getElementById(`edit-text`).value.trim(),r=document.getElementById(`edit-status`);if(!e||!t||!n){r.textContent=`Заполните все поля`,r.style.color=`red`;return}try{console.log(`sending PATCH to:`,o.updateTariffById(this.id));let i=await a.patch(o.updateTariffById(this.id),{title:e,price:t,text:n});console.log(`PATCH response:`,i),r.textContent=`✅ Сохранено!`,r.style.color=`var(--green)`,this.renderData(i)}catch(e){console.log(`PATCH error:`,e),r.textContent=`Ошибка сохранения`,r.style.color=`red`}})}get pageRoot(){return document.getElementById(`product-page`)}getHTML(){return`<div class="lab-section"><div class="container"><div id="product-page"></div></div></div>`}clickBack(){new c(this.parent).render()}render(){this.parent.innerHTML=``,this.parent.insertAdjacentHTML(`beforeend`,this.getHTML()),this.getData()}},c=class{constructor(e){this.parent=e}async getData(e=``){try{let t=await a.get(o.getTariffs(e));this.renderData(t)}catch(e){this.pageRoot.innerHTML=`<p style="color:red">Ошибка загрузки тарифов</p>`,console.error(e)}}renderData(e){this.pageRoot.innerHTML=``,e.forEach(e=>{new n(this.pageRoot).render(e,this.clickCard.bind(this))})}get pageRoot(){return document.getElementById(`main-page`)}getHTML(){return`
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
    `}clickCard(e){let t=e.target.dataset.id;if(!t)return;let n=document.getElementById(`lab-toast`),r=document.getElementById(`lab-toast-msg`);r&&(r.textContent=`Загрузка тарифа...`),n&&new bootstrap.Toast(n,{delay:3e3}).show(),new s(this.parent,t).render()}render(){this.parent.innerHTML=``,this.parent.insertAdjacentHTML(`beforeend`,this.getHTML()),this.getData(),document.getElementById(`filter-input`).addEventListener(`input`,e=>{this.getData(e.target.value)});let e=new URLSearchParams(window.location.search).get(`open`);e&&(history.replaceState(null,``,window.location.pathname),new s(this.parent,e).render())}};new e(document.body).render(),new t(document.body).render(),new c(document.getElementById(`root`)).render();