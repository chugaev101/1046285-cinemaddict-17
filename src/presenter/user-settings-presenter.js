import UserRankView from '../view/user-rank-view.js';
import { render, remove, replace } from '../framework/render.js';

export default class UserSettingsPresenter {
  #movieModel = null;
  #header = null;
  #userRankComponent = null;

  constructor(container, movieModel) {
    this.#header = container;
    this.#movieModel = movieModel;

    this.#movieModel.addObserver(this.#handleModelEvent);
  }

  get movies() {
    return this.#movieModel.movies;
  }

  init = () => {
    const moviesWatched = this.movies.filter((movie) => movie.userDetails.alreadyWatched);
    const prevuserRankComponent = this.#userRankComponent;

    this.#userRankComponent = new UserRankView(moviesWatched);

    if (prevuserRankComponent === null) {
      render(this.#userRankComponent, this.#header);
      return;
    }

    replace(this.#userRankComponent, prevuserRankComponent);
    remove(prevuserRankComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
