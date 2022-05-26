import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

let commentTemplates = [];

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
            <p class="film-details__comment-text">${comment}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${author}</span>
              <span class="film-details__comment-day">${date}</span>
              <button class="film-details__comment-delete">Delete</button>
            </p>
          </div>
        </li>`
      );
    }
  }
};

const getEmoji = (emotion) => emotion? `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">` : '';

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
}
