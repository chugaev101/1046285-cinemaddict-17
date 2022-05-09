import AbstractView  from '../framework/view/abstract-view.js';

const createTitleTemplate = (commentsCount) => `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>`;

export default class PopupCommentsTitleView extends AbstractView {
  #comments = null;

  constructor(comments) {
    super();
    this.#comments = comments;
  }

  get template() {
    return createTitleTemplate(this.#comments);
  }
}
