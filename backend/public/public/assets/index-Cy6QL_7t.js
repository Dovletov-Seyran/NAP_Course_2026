(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function i(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(e){if(e.ep)return;e.ep=!0;const t=i(e);fetch(e.href,t)}})();class n{constructor(r){this.parent=r}getHTML(){const r=window.location.pathname.split("/").pop();return`
      <header class="site-header">
        <div class="container site-header__inner">
          <a href="index.html" class="site-logo">
            <span class="site-logo__icon">☁</span>
            cloud_hosting.ru
          </a>
          <nav class="site-nav">${[{label:"Главная",href:"index.html"},{label:"Продукты",href:"tariffs.html"},{label:"Калькулятор",href:"calculator.html"},{label:"О компании",href:"about.html"}].map(e=>`
      <a href="${e.href}" class="nav__link ${r===e.href?"nav__link--active":""}">${e.label}</a>
    `).join("")}</nav>
          <a href="contact.html" class="site-header__cta">Оставить заявку</a>
        </div>
      </header>
    `}render(){this.parent.insertAdjacentHTML("afterbegin",this.getHTML())}}class c{constructor(r){this.parent=r}getHTML(){return`
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
    `}render(){this.parent.insertAdjacentHTML("beforeend",this.getHTML())}}export{c as F,n as H};
