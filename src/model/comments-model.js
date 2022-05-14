import { generateComment } from '../mock/comment.js';
import { getRandomInteger } from '../utils.js';

export default class CommentsModel {
  #comments = Array.from({ length: getRandomInteger(1, 16) }, generateComment);

  
  get comments() {
    return this.#comments;
  }
}
