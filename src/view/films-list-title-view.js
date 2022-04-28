import { createElement } from '../render.js';

const createTitleTemplate = () => '<h2 class="films-list__title">There are no movies in our database</h2>';

export default class FilmsBoardView {
    getTemplate() {
        return createTitleTemplate();
    }

    getElement() {
        if (!this.element) {
            this.element = createElement(this.getTemplate());
        }

        return this.element;
    }

    removeElement() {
        this.element = null;
    }
}
