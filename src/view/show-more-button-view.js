import { createElement } from '../render.js';

const createButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ShowMoreButtonView {
  #element = null;

  get template() {
    return createButtonTemplate();
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
