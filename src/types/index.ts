export enum EventTypes {
  ITEMS_CHANGED = 'items:changed',
  CARD_SELECT = 'card:select',
  BASKET_ADD = 'basket:add',
  PRODUCT_DELETE = 'product:delete',
  BASKET_CHANGED = 'basket:changed',
  BASKET_OPEN = 'basket:open',
  PREVIEW_CHANGED = 'preview:changed',
  ORDER_OPEN = 'order:open',
  CONTACTS_SUBMIT = 'contacts:submit',
  FORM_ERRORS_CHANGE = 'formErrors:change',
  CONTACTS_READY = 'contacts:ready',
  ORDER_READY = 'order:ready',
  MODAL_OPEN = 'modal:open',
  MODAL_CLOSE = 'modal:close',
  ORDER_SUBMIT = 'order:submit',
}

export type CardCategory = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';

export type CategorySelection = {
    [Key in CardCategory]: string;
  };

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export  interface ILarekApp {
    basket: ICardItem[];
    cardsList: ICardItem[];
    preview: string | null;
    order: IOrder | null;
  }

export interface IOrderForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
  }

export interface IOrderResult {
	id: string;
	total: number;
}

export interface IFormState {
  valid: boolean;
  errors: string[];
}

export interface ISuccess {
  total: number;
}

export interface ISuccessActions {
  onClick: () => void;
}

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface Category {
  [key: string]: string;
}

export interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  index: string;
  inBasket: boolean;
}

export interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}

export interface ICardItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    inBasket: boolean;
  }

  export interface IOrder {
    payment: string;
    address: string;
    email: string;
    phone: string;
    total: number;
    id: string[];
  }

  export interface iBasket {
    quantity: number;
    title: string;
    price: number;
    totalPrice: number;
  }

  export interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export interface IModalData {
  content: HTMLElement;
}
