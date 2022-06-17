import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import he from 'he';
import { nanoid } from 'nanoid';
import { humanizeFullDate } from '../utils.js';

let commentTemplates = [];

const settings = new Map([
  [0,()=>'Today'],
  [1,()=>'Yesterday'],
  [2,()=>'2 days ago'],
]);

const daysAgo = (date)=>dayjs().diff(date, 'day');

const getFormatter = (count)=> settings.get(count) || humanizeFullDate;

const formattingOfDate = (date) => (getFormatter(daysAgo(date)))(date);

const getCommentsData = (movie, commentsData) => {
  for (const commentItem of commentsData) {
    const { author, comment, date, emotion } = commentItem;

    if (movie.comments.includes(commentItem.id)) {
      commentTemplates.push(
        `<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
          </span>
          <div>
            <p class="film-details__comment-text">${he.encode(comment)}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${author}</span>
              <span class="film-details__comment-day">${formattingOfDate(date)}</span>
              <button class="film-details__comment-delete" data-id="${commentItem.id}">Delete</button>
            </p>
          </div>
        </li>`
      );
    }
  }
};

const getEmoji = (emotion) => emotion? `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">` : '';

const validateCommentInput = (element) => {
  const emotionNode = element.querySelector('.film-details__add-emoji-label');
  const commentInput = element.querySelector('.film-details__comment-input');

  if (!emotionNode.children.length || !commentInput.value.length) {
    if (!emotionNode.children.length) {
      emotionNode.style.boxShadow = '0 0 15px 0 #ff0000';
      setTimeout(() => {
        emotionNode.style.boxShadow = 'none';
      }, 1000);
    }

    if (!commentInput.value.length) {
      commentInput.style.boxShadow = '0 0 15px 0 #ff0000';
      setTimeout(() => {
        commentInput.style.boxShadow = 'none';
      }, 1000);
    }
    return false;
  } else {
    return true;
  }
};

const createContainerTemplate = (movie, comments) => {
  commentTemplates = [];
  getCommentsData(movie, comments);
  const {emotion, comment} = movie;

  return (`
  <div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentTemplates.length}</span></h3>
      <ul class="film-details__comments-list">${commentTemplates.join('')}</ul>

      <div class="film-details__new-comment">
        <div class="film-details__add-emoji-label">${getEmoji(emotion)}</div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment}</textarea>
        </label>

        <div class="film-details__emoji-list">
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
          <label class="film-details__emoji-label" for="emoji-smile">
            <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
          <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
          <label class="film-details__emoji-label" for="emoji-puke">
            <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
          <label class="film-details__emoji-label" for="emoji-angry">
            <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
          </label>
        </div>
      </div>
    </section>
  </div>
`);
};

export default class PopupCommentsView extends AbstractStatefulView {
  #comments = null;

  constructor(movie, comments) {
    super();
    this._state = PopupCommentsView.parseMovieToState(movie);
    this.#comments = comments;

    this.#setInnerHandlers();
  }

  get template() {
    return createContainerTemplate(this._state, this.#comments);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#emojiChangeHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
    this.element.addEventListener('keydown', this.#addCommentHandler);
    this.element.querySelectorAll('.film-details__comment-delete').forEach((button) => button.addEventListener('click', this.#deleteCommentHandler));
  };

  #emojiChangeHandler = (evt) => {
    evt.preventDefault();
    const emotionAlt = evt.target.id;

    this.updateElement({
      emotion: evt.target.value,
    });
    this.element.querySelector(`#${emotionAlt}`).checked = true;
  };

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      comment: evt.target.value,
    });
  };

  static parseMovieToState = (movie) => ({
    ...movie,
    comment: '',
    emotion: '',
  });

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  setAddCommentHandler = (callback) =>  {
    this._callback.addComment = callback;
    this.element.addEventListener('keydown', this.#addCommentHandler);
  };

  setDeleteCommentHandler = (callback) =>  {
    this._callback.deleteComment = callback;
    this.element.querySelectorAll('.film-details__comment-delete').forEach((button) => button.addEventListener('click', this.#deleteCommentHandler));
  };

  #addCommentHandler = (evt) => {
    if ((evt.ctrlKey || evt.metaKey) && evt.keyCode === 13) {
      evt.preventDefault();

      if (!validateCommentInput(this.element)) {
        return;
      }

      const id = nanoid();
      const author = 'You';
      const date = dayjs().toDate();
      const comment = this.element.querySelector('.film-details__comment-input').value;
      const emotion = [...this.element.querySelectorAll('.film-details__emoji-item')].find((item) => item.checked);

      this._callback.addComment(id, author, comment, date, emotion.value);
    }
  };

  #deleteCommentHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteComment(evt.target.dataset.id);
  };
}
