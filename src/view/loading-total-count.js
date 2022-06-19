import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const createTotalCountTemplate = () => '<p>0 movies inside</p>';

export default class LoadingTotaCountlView extends AbstractStatefulView {
  get template() {
    return createTotalCountTemplate();
  }
}
