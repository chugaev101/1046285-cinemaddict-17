import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const createLoadingTemplate = () => '<h2 class="films-list__title">Loading...</h2>';

export default class LoadingListView extends AbstractStatefulView {
  get template() {
    return createLoadingTemplate();
  }
}
