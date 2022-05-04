import { createElement } from '../render.js';

const createPopupTemplate = () => '<section class="film-details"></section>';

export default class PopupContainerView {
  #element = null;

  get template() {
    return createPopupTemplate();
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
