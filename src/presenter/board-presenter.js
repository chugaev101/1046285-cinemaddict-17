import {render} from '../render';
import FilmsBoardView from '../view/films-board-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListTitleView from '../view/films-list-title-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';

export default class BoardPresenter {
    boardComponent = new FilmsBoardView();
    listComponent = new FilmsListView();
    titleComponent = new FilmsListTitleView();
    containerComponent = new FilmsContainerView();

    init = (boardContainer) => {
        this.boardContainer = boardContainer;

        render(this.boardComponent, this.boardContainer);
        render(this.listComponent, this.boardComponent.getElement());
        render(this.titleComponent, this.listComponent.getElement());
        render(this.containerComponent, this.listComponent.getElement());

        for (let i = 0; i < 5; i++) {
            render(new FilmCardView(), this.containerComponent.getElement());
        }

        render(new ShowMoreButtonView(), this.listComponent.getElement());
    }
}