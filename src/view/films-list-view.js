import { createElement } from '../render.js';

const createListTemplate = () => '<section class="films-list"></section>';

export default class FilmsListView {
    getTemplate() {
        return createListTemplate();
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
