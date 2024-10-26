import { Component } from "../base/component";
import { createElement, ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";
import { EventTypes, IBasketView } from "../../types";

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit(EventTypes.ORDER_OPEN);
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        const hasItems = items.length > 0;
        const content = hasItems
            ? items
            : [createElement<HTMLParagraphElement>('p')]

        if (!hasItems) {
            this.setText(content[0], 'Корзина пуста');
        }
        this._list.replaceChildren(...content);
        this.setDisabled(this._button, !hasItems);

    }

    set total(total: number) {
        this.setText(this._total, `${total.toString()} синапсов`);
    }
}