import AbstractView  from '../framework/view/abstract-view.js';

const createStatisticsTemplate = (movies) => `<section class="footer__statistics"><p>${movies.length} movies inside</p></section>`;

export default class FilmsStatisticsView extends AbstractView {
  #movies = null;

  constructor (movies) {
    super();
    this.#movies = movies;
  }

  get template() {
    return createStatisticsTemplate(this.#movies.movies);
  }
}
