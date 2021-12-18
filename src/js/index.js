import { $ } from '../utils/utils.js';
import {
  getMenu,
  postMenu,
  putMenu,
  deleteMenu,
  putSoldout,
} from '../api/index.js';
class App {
  constructor() {
    this.menu = [];
    this.category = 'espresso';
    this.renderMenu(this.category);

    const form = $('#menu-form');
    const ul = $('#espresso-menu-list');
    const nav = document.getElementById('menu-nav');

    nav.addEventListener('click', this.handleNavClick.bind(this));

    ul.addEventListener('click', (e) => {
      if (e.target.classList.contains('menu-sold-out-button')) {
        this.handleSoldOut(e);
      } else if (e.target.classList.contains('menu-edit-button')) {
        this.modifyMenu(e);
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

  async renderMenu(category) {
    try {
      this.category = category;
      const list = await getMenu(category);
      this.renderLi(list);
    } catch (err) {
      throw err;
    }
  }

  async modifyMenu(e) {
    try {
      const span = e.target.closest('li').querySelector('.menu-name');
      const name = window.prompt('메뉴명을 수정하세요', span.innerText);
      const id = e.target.closest('li').dataset.menuItem;
      const menu = {
        id,
        name,
      };
      const modified = await putMenu(this.category, menu);
      span.innerText = modified.name;
    } catch (err) {
      throw err;
    }
  }

  handleNavClick(e) {
    if (!e.target.classList.contains('cafe-category-name')) return;
    const dataCategoryName = e.target.getAttribute('data-category-name');
    $('#menu-management').innerText = `${e.target.innerText} 메뉴 관리`;
    this.renderMenu(dataCategoryName);
    this.setMenu();
  }

  setMenu() {
    this.emptyInput();
    this.resetInputVal();
  }

  async confirmMenuName() {
    const name = $('#menu-name').value.trim();
    if (!!name) {
      if (window.confirm('입력하시겠습니까?')) {
        await postMenu(this.category, name);
        this.renderMenu(this.category);
      }
      this.emptyInput();
    }
  }

  renderMenuCount(count) {
    document.getElementsByClassName(
      'menu-count'
    )[0].textContent = `총 ${count}개`;
  }

  resetInputVal() {
    const input = document.getElementById('menu-name');
    input.value = '';
  }

  async removeLi(e) {
    try {
      if (!window.confirm('정말로 삭제하시겠습니까?')) return;
      const id = e.target.closest('li').dataset.menuItem;
      await deleteMenu(this.category, id)
      this.renderMenu(this.category)
    } catch(err) {
      throw err;
    }
  }

  renderLi(list) {
    this.menu = list;
    this.renderMenuCount(list.length)
    if (!list) return;
    const liMenu = list.map((menu) => this.createLi(menu));
    const ul = $('#espresso-menu-list');
    ul.innerHTML = liMenu.join('');
  }

  async handleSoldOut(e) {
    try {
      const liToSellOut = e.target.closest('li');
      const span = liToSellOut.querySelector('.menu-name');
      const menu = {
        id: e.target.closest('li').dataset.menuItem,
        name: span.innerText,
      };
      await putSoldout(this.category, menu);
      this.renderMenu(this.category);
    } catch (err) {
      throw err;
    }
  }

  emptyInput() {
    $('#menu-name').value = '';
  }

  createLi(menu) {
    return `<li data-menu-item="${
      menu.id
    }" class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name ${menu.isSoldOut && 'sold-out'}">${
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
