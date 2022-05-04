import { createElement } from '../render.js';

const createFormTemplate = () => '<form class="film-details__inner" action="" method="get"></form>';

export default class PopupFormView {
  #element = null;

  get template() {
    return createFormTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
