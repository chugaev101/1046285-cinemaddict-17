import { createElement } from '../render.js';

const createContainerTemplate = () => '<div class="films-list__container"></div>';

export default class FilmsContainerView {
    getTemplate() {
        return createContainerTemplate();
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
