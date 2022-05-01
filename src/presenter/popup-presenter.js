import { render, RenderPosition } from '../render.js';
import PopupContainerView from '../view/popup-container-view.js';
import PopupFormView from '../view/popup-form-view.js';
import PopupFilmDetailsView from '../view/popup-film-details-view.js';
import PopupCommentsView from '../view/popup-comments-container-view.js';
import PopupCommentsTitleView from '../view/popup-comments-title-view.js';
import PopupCommentView from '../view/popup-comment-view.js';
import PopupNewCommentView from '../view/popup-new-comment-view.js';

export default class PopupPresenter {
  containerComponent = new PopupContainerView();
  formComponent = new PopupFormView();
  commentsContainerComponent = new PopupCommentsView();
  commentComponent = new PopupCommentView();
  newCommentComponent = new PopupNewCommentView();


  init = (siteBodyNode, movieModel, commentsModel) => {
    this.siteBody = siteBodyNode;
    this.movieModel = movieModel;
    this.popupMovies = [...this.movieModel.getMovies()];
    this.commentsModel = commentsModel;
    this.popupComments = [...this.commentsModel.getComments()];

    const createRenderList = (container, comment) => render(new PopupCommentView(comment), container);

    render(this.containerComponent, this.siteBody);
    render(this.formComponent, this.containerComponent.getElement());
    render(new PopupFilmDetailsView(this.popupMovies[0]), this.formComponent.getElement());
    render(this.commentsContainerComponent, this.formComponent.getElement());
    render(new PopupCommentsTitleView(this.popupComments), this.commentsContainerComponent.getElement(), RenderPosition.AFTERBEGIN);

    const commentsWrap = this.commentsContainerComponent.getElement().querySelector('.film-details__comments-list');

    Array.from(this.popupComments).forEach((comment) => createRenderList(commentsWrap, comment));
    render(this.newCommentComponent, commentsWrap);
  }
}
