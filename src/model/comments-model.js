import Observable from '../framework/observable.js';
import { generateComment } from '../mock/comment.js';
import { getRandomInteger } from '../utils.js';

export default class CommentsModel extends Observable {
  #comments = Array.from({ length: getRandomInteger(1, 16) }, generateComment);


  get comments() {
    return this.#comments;
  }

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
      throw new Error('Can\'t delete unexisting task');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
