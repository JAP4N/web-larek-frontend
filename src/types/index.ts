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

export interface ICardItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: CardCategory;
    price: number | null;
  }

  export interface IOrder {
    payment: string;
    address: string;
    email: string;
    phone: string;
    total: number;
    id: string[];
  }

  export interface IBasketView {
    items: HTMLElement[];
    total: number;
}
