import AbstractView  from '../framework/view/abstract-view.js';

const createTitleTemplate = (movies, isTopRated, isMostCommented) => {
  const isHidden = isTopRated === false && isMostCommented === false;
  let title = '';
  const hiddenClass = 'visually-hidden';

  if (!movies.length) {
    title = 'There are no movies in our database';
  } else {
    switch (true) {
      case isTopRated && isMostCommented:
        throw new Error('Expected single argument equal to true.');
      case isTopRated:
        title = 'Top rated';
        break;
      case isMostCommented:
        title = 'Most commented';
        break;
    }
  }

  return `<h2 class="films-list__title ${isHidden ? hiddenClass : ''}">${title}</h2>`;
};

export default class FilmsListTitleView extends AbstractView {
  #movies = null;
  #isTopRated = null;
  #isMostCommented = null;

  constructor(movies, isTopRated = false, isMostCommented = false) {
    super();
    this.#movies = movies;
    this.#isTopRated = isTopRated;
    this.#isMostCommented = isMostCommented;
  }

  get template() {
    return createTitleTemplate(this.#movies, this.#isTopRated, this.#isMostCommented);
  }
}
