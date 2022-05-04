import { createElement } from '../render.js';

const createContainerTemplate = () => (`
  <div class="film-details__bottom-container">
  <section class="film-details__comments-wrap">
    <ul class="film-details__comments-list"></ul>
  </section>
  </div>
`);

export default class PopupCommentsView {
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
