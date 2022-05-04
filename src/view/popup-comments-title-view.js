import { createElement } from '../render.js';

const createTitleTemplate = (commentsCount) => `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>`;

export default class PopupCommentsTitleView {
  #comments = null;
  #element = null;

  constructor(comments) {
    this.#comments = comments;
  }

  get template() {
    return createTitleTemplate(this.#comments);
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
