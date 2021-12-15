class App {
  constructor() {
   const existingMenu = this.getItem('menu');

    this.menu = existingMenu ? existingMenu : {
      espresso: [],
      frappuccino: [],
      blended: [],
      teavana: [],
      desert: [],
    };
    let category = this.getItem('category');
    if (!category) {
      this.setItem('category', 'espresso');
      category = 'espresso';
    }
    const menuId = this.getItem('menu-id') || 0;

    this.menuId = this.generateId(menuId);
    this.category = category;
    this.menuCount = 0;

    const form = this.$('#espresso-menu-form');
    const ul = this.$('#espresso-menu-list');
    const categories = document.getElementsByClassName('cafe-category-name');
    const categoryArr = Array.from(categories);

    categoryArr.forEach((cat) => {
      cat.addEventListener('click', (e) => {
        const dataCategoryName = e.target.getAttribute('data-category-name');
        if (this.category !== dataCategoryName) this.removeAllLi();
        this.category = dataCategoryName;
        switch (dataCategoryName) {
          case 'frappuccino':
            this.$('#menu-management').innerText = '🥤 프라푸치노 메뉴 관리';
            break;
          case 'blended':
            this.$('#menu-management').innerText = '🍹 블렌디드 메뉴 관리';
            break;
          case 'teavana':
            this.$('#menu-management').innerText = '🫖 티바나 메뉴 관리';
            break;
          case 'desert':
            this.$('#menu-management').innerText = '🍰 디저트 메뉴 관리';
            break;
          default:
            this.$('#menu-management').innerText = '☕ 에스프레소 메뉴 관리';
            break;
        }

        this.setMenu();
      });
    });

    ul.addEventListener('click', (e) => {
      if (e.target.classList.contains('menu-sold-out-button')) {
        this.handleSoldOut(e);
      } else if (e.target.classList.contains('menu-edit-button')) {
        this.modifyLi(e);
      } else if (e.target.classList.contains('menu-remove-button')) {
        this.removeLi(e);
      }
    });

    input.addEventListener('input', (e) => {
      setTimeout(() => this.updateMenuName(e.target.value), 0);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.confirmMenuName();
    });

    this.setMenu();
  }

  setMenu() {
    const existingMenu = this.getItem('menu'); // string 값으로 받아옴
    if (!existingMenu) {
      this.setItem('menu', this.menu);
    } else {
      const menuDetail = existingMenu[this.category];
      menuDetail.map((menu) => this.createLi(menu));
    }
  }

  $(property) {
    return document.querySelector(property);
  }

  *generateId(givenId) {
    let id = givenId;
    while (true) {
      id++;
      yield id;
    }
  }

  confirmMenuName() {
    const menuName = this.$('#espresso-menu-name').value;
    if (!!menuName.trim()) {
      const newMenu = {
        id: this.menuId.next().value,
        name: menuName.trim(),
        soldOut: false,
      };
      this.menu[this.category].push(newMenu);
      this.setItem('menu', this.menu);
      window.confirm('입력하시겠습니까?')
        ? this.createLi(newMenu)
        : this.emptyInput();
    }
  }

  setItem(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  getItem(key) {
    const val = localStorage.getItem(key);
    try {
      return JSON.parse(val);
    } catch (err) {
      return val;
    }
  }

  updateMenuName(val) {
    this.menuName = val;
  }

  updateMenuCount() {
    this.menuCount = document.querySelectorAll('.menu-list-item').length;
    document.getElementsByClassName(
      'menu-count'
    )[0].textContent = `총 ${this.menuCount}개`;
  }

  resetInputVal() {
    const input = document.getElementById('espresso-menu-name');
    input.value = '';
  }

  removeLi(e) {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;
    const existingMenu = this.getItem('menu');
    const liToDelete = e.target.closest('li');
    const allLi = document.querySelectorAll('.menu-list-item');
    const listArr = Array.prototype.slice.call(allLi);
    const idx = listArr.indexOf(liToDelete);
    existingMenu[this.category].splice(idx, 1);
    this.setItem('menu', existingMenu);
    e.target.closest('li').remove();
    this.updateMenuCount();
  }

  removeAllLi() {
    const ul = this.$('#espresso-menu-list');
    ul.innerHTML = '';
  }

  handleSoldOut(e) {
    const liToSellOut = e.target.closest('li');
    const span = liToSellOut.querySelector('.menu-name');
    const allLi = document.querySelectorAll('.menu-list-item');
    const listArr = Array.prototype.slice.call(allLi);
    const idx = listArr.indexOf(liToSellOut);

    let isSoldOut = span.classList.contains('sold-out');
    if (isSoldOut) {
      this.menu[this.category][idx].soldOut = false;
      span.classList.remove('sold-out');
    } else {
      this.menu[this.category][idx].soldOut = true;
      span.classList.add('sold-out');
    }
    this.setItem('menu', this.menu);
  }

  modifyLi(e) {
    const span = e.target.closest('li').querySelector('.menu-name');
    const modifiedName = window.prompt('메뉴명을 수정하세요', span.innerText);
    span.innerText = modifiedName;
    const menuId = e.target.closest('li').dataset.menuItem;
    const existingMenu = this.getItem('menu');
    const foundIdx = existingMenu[this.category].findIndex(
      (menu) => menu.id === parseInt(menuId)
    );
    existingMenu[this.category][foundIdx].name = modifiedName;
    this.setItem('menu', existingMenu);
  }

  emptyInput() {
    this.$('#espresso-menu-name').value = '';
  }

  createLi(menu) {
    const li = `<li data-menu-item="${menu.id}" class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name ${menu.soldOut && "sold-out"}">${menu.name}</span>
        <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
      >
        품절
      </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
        >
          수정
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
        >
          삭제
        </button>
      </li>`;

    const ul = this.$('#espresso-menu-list');
    ul.insertAdjacentHTML('beforeend', li);
    this.emptyInput();
    this.updateMenuCount();
    this.resetInputVal();
  }
}

new App();
