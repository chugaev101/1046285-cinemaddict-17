import { createElement } from '../render.js';

const createStatisticsTemplate = () => '<section class="footer__statistics"><p>130 291 movies inside</p></section>';

export default class FilmsStatisticsView {
  #element = null;

  getTemplate() {
    return createStatisticsTemplate();
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
