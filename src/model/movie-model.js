import Observable from '../framework/observable.js';
import { generateMovie } from '../mock/movie.js';
import { getRandomInteger } from '../utils.js';

export default class MovieModel extends Observable {
  #movies = Array.from({ length: getRandomInteger(1, 1) }, generateMovie);

  get movies () {
    return this.#movies;
  }

  updateMovie = (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      update,
      ...this.#movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  };
}
