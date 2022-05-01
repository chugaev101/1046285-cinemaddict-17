import { createElement } from '../render.js';

const createFormTemplate = () => '<form class="film-details__inner" action="" method="get"></form>';

export default class PopupFormView {
  getTemplate() {
    return createFormTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
