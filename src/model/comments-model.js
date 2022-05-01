import { generateComment } from '../fish/comment.js';
import { getRandomInteger } from '../utils.js';

export default class CommentsModel {
  comments = Array.from({ length: getRandomInteger(1, 6) }, generateComment);

  getComments = () => this.comments;
}
