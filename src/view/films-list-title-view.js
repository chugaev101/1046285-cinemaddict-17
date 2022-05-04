import { createElement } from '../render.js';

const createTitleTemplate = (movies) => {
  let title = '';
  let hiddenClass;

  if (!movies.length) {
    title = 'There are no movies in our database';
  } else {
    hiddenClass = 'visually-hidden';
  }

  return `<h2 class="films-list__title ${hiddenClass}">${title}</h2>`;
};

export default class FilmsBoardView {
  #element = null;
  #movies = null;

  constructor(movies) {
    this.#movies = movies;
  }

  get template() {
    return createTitleTemplate(this.#movies);
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
