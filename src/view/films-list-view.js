import { createElement } from '../render.js';

const createListTemplate = () => '<section class="films-list"></section>';

export default class FilmsListView {
  #element = null;

  get template() {
    return createListTemplate();
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
