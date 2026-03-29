export class HeaderComponent {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML() {
    const currentPage = window.location.pathname.split("/").pop();
    const navItems = [
      { label: "Главная", href: "index.html" },
      { label: "Продукты", href: "tariffs.html" },
      { label: "Калькулятор", href: "calculator.html" },
      { label: "О компании", href: "about.html" },
    ];

    const links = navItems
      .map(
        (item) => `
      <a href="${item.href}" class="nav__link ${currentPage === item.href ? "nav__link--active" : ""}">${item.label}</a>
    `,
      )
      .join("");

    return `
      <header class="site-header">
        <div class="container site-header__inner">
          <a href="index.html" class="site-logo">
            <span class="site-logo__icon">☁</span>
            cloud_hosting.ru
          </a>
          <nav class="site-nav">${links}</nav>
          <a href="contact.html" class="site-header__cta">Оставить заявку</a>
        </div>
      </header>
    `;
  }

  render() {
    this.parent.insertAdjacentHTML("afterbegin", this.getHTML());
  }
}
