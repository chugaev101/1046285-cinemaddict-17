import { createElement } from '../render.js';

const createContainerTemplate = () => '<div class="films-list__container"></div>';

export default class FilmsContainerView {
  #element = null;

  get template() {
    return createContainerTemplate();
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
