import AbstractView  from '../framework/view/abstract-view.js';

const createPopupTemplate = () => '<section class="film-details"><form class="film-details__inner" action="" method="get"></form></section>';

export default class PopupContainerView extends AbstractView {
  get template() {
    return createPopupTemplate();
  }
}
