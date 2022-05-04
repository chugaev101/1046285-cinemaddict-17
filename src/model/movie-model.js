import { generateMovie } from '../mock/movie.js';
import { getRandomInteger } from '../utils.js';

export default class MovieModel {
  #movies = Array.from({ length: getRandomInteger(5, 22) }, generateMovie);

  get movies () {
    return this.#movies;
  }
}
