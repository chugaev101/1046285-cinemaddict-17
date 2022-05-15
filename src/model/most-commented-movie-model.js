import { generateMovie } from '../mock/movie.js';

export default class MostCommentedMovieModel {
  #movies = Array.from({ length: 2 }, generateMovie);

  get movies () {
    return this.#movies;
  }
}
