import { createElement } from '../render.js';

const createContainerTemplate = () => (`
  <div class="film-details__bottom-container">
  <section class="film-details__comments-wrap">
    <ul class="film-details__comments-list"></ul>
    <div class="film-details__new-comment"></div>
  </section>
  </div>
`);

export default class PopupCommentsView {
  getTemplate() {
    return createContainerTemplate();
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
