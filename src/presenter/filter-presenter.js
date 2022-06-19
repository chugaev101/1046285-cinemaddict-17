import FilterView from '../view/filter-view.js';
import { render, remove, replace } from '../framework/render.js';
import { UpdateType, FilterType } from '../const.js';
import { filterMovies } from '../utils.js';

export default class FilterPresenter {
  #container = null;
  #filterModel = null;
  #movieModel = null;
  #filterComponent = null;

  constructor(container, filterModel, movieModel) {
    this.#container = container;
    this.#filterModel = filterModel;
    this.#movieModel = movieModel;

    this.#movieModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const movies = this.#movieModel.movies;

    return {
      [FilterType.ALL]: filterMovies[FilterType.ALL](movies).length,
      [FilterType.WATCHLIST]: filterMovies[FilterType.WATCHLIST](movies).length,
      [FilterType.HISTORY]: filterMovies[FilterType.HISTORY](movies).length,
      [FilterType.FAVORITES]: filterMovies[FilterType.FAVORITES](movies).length,
    };
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);

    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#container);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
