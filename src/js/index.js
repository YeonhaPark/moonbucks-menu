import { $, generateId } from '../utils/utils.js';

class App {
  constructor() {
    const existingMenu = this.getItem('menu');

    this.menu = existingMenu
      ? existingMenu
      : {
          espresso: [],
          frappuccino: [],
          blended: [],
          teavana: [],
          desert: [],
        };

    const menuId = this.getItem('menu-id') || 0;

    this.menuId = generateId(menuId);
    this.category = 'espresso';
    this.menuCount = 0;

    const form = $('#menu-form');
    const ul = $('#espresso-menu-list');
    const nav = document.getElementById('menu-nav');

    nav.addEventListener('click', (e) => {
      if (!e.target.classList.contains('cafe-category-name')) return;
      const dataCategoryName = e.target.getAttribute('data-category-name');
      if (this.category !== dataCategoryName) this.removeAllLi();
      this.category = dataCategoryName;
      $('#menu-management').innerText = `${e.target.innerText} 메뉴 관리`;

      this.setMenu();
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

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.confirmMenuName();
    });

    this.setMenu();
  }

  setMenu() {
    const ul = $('#espresso-menu-list');
    const lists = this.menu[this.category].map(menu => {
      return this.createLi(menu)
    })
    ul.innerHTML = lists.join('');
    this.emptyInput();
    this.resetInputVal();
    this.updateMenuCount();
  }

  confirmMenuName() {
    const menuName = $('#menu-name').value;
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

      this.updateMenuCount();
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

  updateMenuCount() {
    this.menuCount = document.querySelectorAll('.menu-list-item').length;
    document.getElementsByClassName(
      'menu-count'
    )[0].textContent = `총 ${this.menuCount}개`;
  }

  resetInputVal() {
    const input = document.getElementById('menu-name');
    input.value = '';
  }

  removeLi(e) {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;
    const menuId = e.target.closest('li').dataset.menuItem;
    const foundIdx = this.menu[this.category].findIndex(
      (menu) => menu.id === parseInt(menuId)
    );
    this.menu[this.category].splice(foundIdx, 1);
    this.setItem('menu', this.menu);
    e.target.closest('li').remove();
    this.updateMenuCount();
  }

  removeAllLi() {
    const ul = $('#espresso-menu-list');
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
    const foundIdx = this.menu[this.category].findIndex(
      (menu) => menu.id === parseInt(menuId)
    );
    this.menu[this.category][foundIdx].name = modifiedName;
    this.setItem('menu', this.menu);
  }

  emptyInput() {
    $('#menu-name').value = '';
  }

  createLi(menu) {
    
    return `<li data-menu-item="${
      menu.id
    }" class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name ${menu.soldOut && 'sold-out'}">${
      menu.name
    }</span>
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
   
  }
}

new App();
