(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class{constructor(e){this.parent=e}getHTML(){let e=window.location.pathname.split(`/`).pop();return`
      <header class="site-header">
        <div class="container site-header__inner">
          <a href="index.html" class="site-logo">
            <span class="site-logo__icon">☁</span>
            cloud_hosting.ru
          </a>
          <nav class="site-nav">${[{label:`Главная`,href:`index.html`},{label:`Продукты`,href:`tariffs.html`},{label:`Калькулятор`,href:`calculator.html`},{label:`О компании`,href:`about.html`}].map(t=>`
      <a href="${t.href}" class="nav__link ${e===t.href?`nav__link--active`:``}">${t.label}</a>
    `).join(``)}</nav>
          <a href="contact.html" class="site-header__cta">Оставить заявку</a>
        </div>
      </header>
    `}render(){this.parent.insertAdjacentHTML(`afterbegin`,this.getHTML())}},t=class{constructor(e){this.parent=e}getHTML(){return`
      <footer class="site-footer">
        <div class="container site-footer__inner">
          <div class="site-footer__brand">
            <div class="site-footer__logo">☁ cloud_hosting.ru</div>
            <p class="site-footer__desc">Надёжные облачные серверы для бизнеса и разработчиков</p>
          </div>
          <div class="site-footer__col">
            <div class="site-footer__heading">Продукты</div>
            <a href="#">Виртуальная машина</a>
            <a href="#">Kubernetes</a>
            <a href="#">S3-хранилище</a>
          </div>
          <div class="site-footer__col">
            <div class="site-footer__heading">Для бизнеса</div>
            <a href="#">Решения</a>
            <a href="#">Кейсы</a>
            <a href="#">Партнеры</a>
          </div>
          <div class="site-footer__col">
            <div class="site-footer__heading">Сообщество</div>
            <a href="#">Блог</a>
            <a href="#">Мероприятия</a>
            <a href="#">Документация</a>
          </div>
        </div>
        <div class="site-footer__bottom container">
          <span>© 2026 cloud_hosting.ru</span>
          <span>Русский</span>
        </div>
      </footer>
    `}render(){this.parent.insertAdjacentHTML(`beforeend`,this.getHTML())}};export{e as n,t};