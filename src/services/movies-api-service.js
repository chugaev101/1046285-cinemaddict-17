import { Method } from '../const.js';
import ApiService from '../framework/api-service.js';

export default class MoviesApiService extends ApiService {
  get movies() {
    return this._load({ url: 'movies' })
      .then(ApiService.parseResponse);
  }

  getComments(id) {
    return this._load({ url: `comments/${id}` })
      .then(ApiService.parseResponse);
  }

  updateMovie = async (movie) => {
    const response = await this._load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parseResponse = await ApiService.parseResponse(response);

    return parseResponse;
  };

  addComment = async (comment, movie) => {
    const response = await this._load({
      url: `comments/${movie.id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse.comments;
  };

  deleteComment = async (comment) => {
    const response = await this._load({
      url: `comments/${comment.id}`,
      method: Method.DELETE,
    });

    return response;
  };

  #adaptToServer = (movie) => {
    const adaptedMovie = {
      ...movie,
      'film_info': {
        ...movie.filmInfo,
        'alternative_title': movie.filmInfo.alternativeTitle,
        release: {
          ...movie.filmInfo.release,
          date: movie.filmInfo.release.date instanceof Date ? movie.filmInfo.release.date.toISOString() : null,
          'release_country': movie.filmInfo.release.releaseCountry,
        },
        'total_rating': movie.filmInfo.totalRating,
        'age_rating': movie.filmInfo.ageRating,
      },
      'user_details': {
        ...movie.userDetails,
        'already_watched': movie.userDetails.alreadyWatched,
        'watching_date': movie.userDetails.watchingDate instanceof Date ? movie.userDetails.watchingDate.toISOString() : null,
      }
    };


    delete adaptedMovie['film_info'].alternativeTitle;
    delete adaptedMovie['film_info'].totalRating;
    delete adaptedMovie['film_info'].ageRating;
    delete adaptedMovie['user_details'].alreadyWatched;
    delete adaptedMovie['user_details'].watchingDate;
    delete adaptedMovie['film_info'].release.releaseCountry;
    delete adaptedMovie.filmInfo;
    delete adaptedMovie.userDetails;

    return adaptedMovie;
  };
}
