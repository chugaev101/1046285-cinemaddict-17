import { generateMovie } from '../fish/movie.js';

export default class MovieModel {
  movies = Array.from({ length: 5 }, generateMovie);

  getMovies = () => this.movies;
}
