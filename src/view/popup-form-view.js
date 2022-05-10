import AbstractView  from '../framework/view/abstract-view.js';

const createFormTemplate = () => '<form class="film-details__inner" action="" method="get"></form>';

export default class PopupFormView extends AbstractView {
  get template() {
    return createFormTemplate();
  }
}
