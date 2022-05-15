import AbstractView  from '../framework/view/abstract-view.js';

const createListTemplate = (isExtra) => `<section class="films-list ${isExtra ? 'films-list--extra' : ''}"><div class="films-list__container"></div></section>`;

export default class FilmsListView extends AbstractView {
  #isExtra = null;

  constructor (isExtra = false) {
    super();
    this.#isExtra = isExtra;
  }

  get template() {
    return createListTemplate(this.#isExtra);
  }
}
