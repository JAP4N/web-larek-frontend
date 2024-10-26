import { Model } from "./base/model";
import { FormErrors, ILarekApp, IOrder, IOrderForm, ICardItem, EventTypes } from "../types";

export type CatalogChangeEvent = {
    catalog: ICardItem[]
};

export class AppData extends Model<ILarekApp> {
    basket: ICardItem[] = [];
    catalog: ICardItem[];
    order: IOrder = {
        payment: '',
        address: '',
        email: '',
        phone: '',
        total: 0,
        id: [],
    };
    preview: string | null;
    formErrors: FormErrors = {};
  
    // Добавляет элемент в корзину, если он еще не существует, и отправляет событие изменения корзины
    addBasket(value: ICardItem) {
      if (!this.basket.some(item => item.id === value.id)) {
        this.basket.push(value);
        this.emitChanges(EventTypes.BASKET_CHANGED, this.basket);
      }
    }
  
    // Удаляет указанный элемент из корзины и отправляет событие изменения корзины
    removeBasket(value: ICardItem) {
      this.basket = this.basket.filter((item) => item !== value);
      this.emitChanges(EventTypes.BASKET_CHANGED, this.basket);
    }
  
    // Очищает корзину и отправляет событие изменения корзины
    clearBasket() {
      this.basket = [];
      this.emitChanges(EventTypes.BASKET_CHANGED, this.basket);
    }
  
    // Подсчитывает и возвращает общую стоимость товаров в корзине
    getTotalPrice() {
      return this.basket.reduce((total, item) => total + item.price, 0);
    }
  
    // Устанавливает каталог товаров и отправляет событие изменения каталога
    setCatalog(items: ICardItem[]) {
        this.catalog = items;
        this.emitChanges(EventTypes.ITEMS_CHANGED, { catalog: this.catalog });
    }
  
    // Устанавливает идентификатор товара для предварительного просмотра и отправляет событие изменения предпросмотра
    setPreview(item: ICardItem) {
        this.preview = item.id;
        this.emitChanges(EventTypes.PREVIEW_CHANGED, item);
    }
  
    // Устанавливает значение для указанного поля заказа и проверяет валидность формы заказа
    setOrderField(field: keyof IOrderForm, value: string ) { 
      this.order[field] = value; 
      if (this.validateOrder()) { 
          this.events.emit(EventTypes.ORDER_READY, this.order); 
      } 
    } 
    // Устанавливает значение для указанного контактного поля и проверяет валидность контактной информации
    setContactField(field: keyof IOrderForm, value: string ) { 
      this.order[field] = value; 
      if (this.validateContact()) { 
          this.events.emit(EventTypes.CONTACTS_READY, this.order); 
      } 
    } 
    // Проверяет, заполнены ли все необходимые поля заказа, и обновляет ошибки формы, если они есть
    validateOrder() { 
        const errors: typeof this.formErrors = {}; 
        if (!this.order.payment) { 
            errors.payment = 'Необходимо выбрать способ оплаты'; 
        } 
        if (!this.order.address) { 
            errors.address = 'Необходимо указать адрес'; 
        }      
        this.formErrors = errors; 
        this.events.emit(EventTypes.FORM_ERRORS_CHANGE, this.formErrors); 
        return Object.keys(errors).length === 0; 
    } 
    // Проверяет корректность введенных контактных данных, таких как email и телефон, и обновляет ошибки формы
    validateContact() { 
      const errors: typeof this.formErrors = {}; 
      if (!this.order.email) { 
          errors.email = 'Необходимо указать email'; 
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(this.order.email)) {
          errors.email = 'email должен быть в формате example123@example.example';
      } 
      if (!this.order.phone) { 
          errors.phone = 'Необходимо указать телефон'; 
      } else if (!/^\+?[0-9]{7,14}$/.test(this.order.phone)) {
          errors.phone = 'Номер телефона может начинаться с + и состоять толко из цифр';
      } 
      this.formErrors = errors; 
      this.events.emit(EventTypes.FORM_ERRORS_CHANGE, this.formErrors); 
      return Object.keys(errors).length === 0; 
    } 
  
    // Сбрасывает форму заказа, очищая все её поля
    resetOrderForm() {
          this.order = {
              payment: '',
              address: '',
              email: '',
              phone: '',
              total: 0,
              id: [],
          };
      }
  
    // Формирует данные заказа, добавляя идентификаторы товаров в заказ и рассчитывая общую сумму
    orderData() {
      this.order.id = [];
      this.basket.forEach((item) => {
        this.order.id.push(item.id);
      });
      this.order.total = this.getTotalPrice();
    }
  }