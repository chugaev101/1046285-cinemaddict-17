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

  init = async (id) => {
    try {
      const comments = await this.#moviesApiService.getComments(id);
      this.#comments = comments.map(this.#adaptToClient);
    } catch (err) {
      this.#comments = [];
    }

    this._notify(UpdateType.INIT_COMMENTS);
  };

  addComment = async (updateType, update, movie) => {
    try {
      const response = await this.#moviesApiService.addComment(update, movie);
      this.#comments = response.map(this.#adaptToClient);
      this._notify(updateType, movie);
    } catch (err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, update, movie) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#moviesApiService.deleteComment(update);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      this._notify(updateType, movie);
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  };

  #adaptToClient = (comment) => {
    const adaptedComment = {
      ...comment,
      date: comment.date !== null ? new Date(comment.date) : comment.date,
    };

    return adaptedComment;
  };
}
