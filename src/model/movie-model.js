import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class MovieModel extends Observable {
  #moviesApiService = null;
  #movies = [];

  constructor(moviesApiService) {
    super();
    this.#moviesApiService = moviesApiService;
  }

  get movies() {
    return this.#movies;
  }

  init = async () => {
    try {
      const movies = await this.#moviesApiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
    } catch (err) {
      this.#movies = [];
    }

    this._notify(UpdateType.INIT);
  };

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

  #adaptToClient = (movie) => {
    const adaptedMovie = {
      ...movie,
      filmInfo: {
        ...movie['film_info'],
        alternativeTitle: movie['film_info']['alternative_title'],
        release: {
          ...movie['film_info']['release'],
          date: movie['film_info']['release']['date'] !== null ? new Date(movie['film_info']['release']['date']) : movie['film_info']['release']['date'],
          releaseCountry: movie['film_info']['release']['release_country'],
        },
        totalRating: movie['film_info']['total_rating'],
        ageRating: movie['film_info']['age_rating'],
      },
      userDetails: {
        ...movie['user_details'],
        alreadyWatched: movie['user_details']['already_watched'],
        watchingDate: movie['user_details']['watching_date'] !== null ? new Date(movie['user_details']['watching_date']) : movie['user_details']['watching_date'],
      }
    };

    delete adaptedMovie.filmInfo['alternative_title'];
    delete adaptedMovie.filmInfo['total_rating'];
    delete adaptedMovie.filmInfo['age_rating'];
    delete adaptedMovie.filmInfo.release['release_country'];
    delete adaptedMovie.userDetails['already_watched'];
    delete adaptedMovie.userDetails['watching_date'];
    delete adaptedMovie['film_info'];
    delete adaptedMovie['user_details'];

    return adaptedMovie;
  };
}
