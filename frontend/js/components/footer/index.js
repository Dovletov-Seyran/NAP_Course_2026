export class FooterComponent {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML() {
    return `
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
    `;
  }

  render() {
    this.parent.insertAdjacentHTML('beforeend', this.getHTML());
  }
}
