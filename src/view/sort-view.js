import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

const ACTIVE_BUTTON_CLASS = 'sort__button--active';

const createSortTemplate = () => (
  `<ul class="sort">
      <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
    </ul>`
);

const buttonActiveToggle = (evt) => {
  const sortButtons = document.querySelectorAll('a');

  sortButtons.forEach((button) => {
    button === evt.target ? button.classList.add(ACTIVE_BUTTON_CLASS) : button.classList.remove(ACTIVE_BUTTON_CLASS);
  });
};

export default class SortView extends AbstractView {
  get template() {
    return createSortTemplate();
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    buttonActiveToggle(evt);

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
