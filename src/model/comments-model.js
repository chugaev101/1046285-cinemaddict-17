import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class CommentsModel extends Observable {
  #moviesApiService = null;
  #comments = [];

  constructor(moviesApiService) {
    super();
    this.#moviesApiService = moviesApiService;
  }

  get comments() {
    return this.#comments;
  }

  init = async (movie) => {
    try {
      const comments = await this.#moviesApiService.getComments(movie.id);
      this.#comments = comments.map(this.#adaptToClient);
    } catch (err) {
      this.#comments = [];
    }

    this._notify(UpdateType.INIT_COMMENTS);
  };

  addComment = (updateType, update) => {
    this.#comments = [
      update,
      ...this.#comments,
    ];

    this._notify(updateType, update);
  };

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType);
  };

  #adaptToClient = (comment) => {
    const adaptedComment = {
      ...comment,
      date: comment.date !== null ? new Date(comment.date) : comment.date,
    };

    return adaptedComment;
  };
}
