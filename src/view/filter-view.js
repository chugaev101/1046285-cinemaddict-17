import AbstractView  from '../framework/view/abstract-view.js';

const createFilterTemplate = (filterItems, currentFilter) => {
  const activeClass = 'main-navigation__item--active';

  const setActiveClass = (find) => currentFilter === find ? activeClass : '';

  return (
    `<nav class="main-navigation">
          <a href="#all" class="main-navigation__item ${setActiveClass('all')}" data-filter-type="all">All movies</a>
          <a href="#watchlist" class="main-navigation__item ${setActiveClass('watchlist')}" data-filter-type="watchlist">Watchlist <span class="main-navigation__item-count">${filterItems['watchlist']}</span></a>
          <a href="#history" class="main-navigation__item ${setActiveClass('history')}" data-filter-type="history">History <span class="main-navigation__item-count">${filterItems['history']}</span></a>
          <a href="#favorites" class="main-navigation__item ${setActiveClass('favorites')}" data-filter-type="favorites">Favorites <span class="main-navigation__item-count">${filterItems['favorites']}</span></a>
      </nav>`
  );
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilter) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();

    this._callback.filterTypeChange(evt.target.dataset.filterType);
  };
}
