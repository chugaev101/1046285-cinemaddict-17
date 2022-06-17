import AbstractView  from '../framework/view/abstract-view.js';

const comparersTitle = {
  all: 'There are no movies in our database',
  watchlist: 'There are no movies to watch now',
  history: 'There are no watched movies now',
  favorites: 'There are no favorite movies now'
};

const createTitleTemplate = (movies, isTopRated, isMostCommented, currentFilter) => {
  const isHidden = isTopRated === false && isMostCommented === false && movies.length;

  let title = '';
  const hiddenClass = 'visually-hidden';

  if (!movies.length) {
    title = comparersTitle[currentFilter];
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
  #currentFilter = null;

  constructor(movies, isTopRated = false, isMostCommented = false, currentFilter) {
    super();
    this.#movies = movies;
    this.#isTopRated = isTopRated;
    this.#isMostCommented = isMostCommented;
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createTitleTemplate(this.#movies, this.#isTopRated, this.#isMostCommented, this.#currentFilter);
  }
}
