import AbstractView  from '../framework/view/abstract-view.js';

const createContainerTemplate = () => (`
  <div class="film-details__bottom-container">
  <section class="film-details__comments-wrap">
    <ul class="film-details__comments-list"></ul>
  </section>
  </div>
`);

export default class PopupCommentsView extends AbstractView {
  get template() {
    return createContainerTemplate();
  }
}
