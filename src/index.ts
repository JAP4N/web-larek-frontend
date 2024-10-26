import './scss/styles.scss';
import { AppData, CatalogChangeEvent } from './components/AppData';
import { ICardItem, IOrder, IOrderForm,  EventTypes } from './types';
import { Card } from './components/Card';
import { ContactOrderForm, DeliveryOrderForm } from './components/Order';
import { WebLarekAPI } from './components/WebLarekAPI';
import { Page } from './components/Page';
import { Basket } from './components/common/basket';
import { Modal } from './components/common/modal';
import { Success } from './/components/common/success';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

// Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success')
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog')
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview')
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket')
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket')
const orderTemplate = ensureElement<HTMLTemplateElement>('#order')
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts')

// Модель данных приложения
const appData = new AppData({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const deliveryOrderForm = new DeliveryOrderForm(cloneTemplate(orderTemplate), events);
const contactOrderForm = new ContactOrderForm(cloneTemplate(contactsTemplate), events);

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Получаем товары с сервера 
api.getCardList()
.then(appData.setCatalog.bind(appData))
.catch((err) => {
  console.error(err);
});

// Изменились элементы каталога
events.on<CatalogChangeEvent>(EventTypes.ITEMS_CHANGED, () => {
  page.catalog = appData.catalog.map(item => {
    const card = new Card(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit(EventTypes.CARD_SELECT, item)
    });
    return card.render({
      category: item.category,
      title: item.title,
      image: item.image,
      price: item.price,
    });
  });
});

// Открыть карточку
events.on(EventTypes.CARD_SELECT, (item: ICardItem) => {
  appData.setPreview(item);
});

// изменена открытая карточка
events.on(EventTypes.PREVIEW_CHANGED, (item: ICardItem) => {
  const card = new Card(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      if (!item.inBasket) {
        events.emit(EventTypes.BASKET_ADD, item);
      }
    }
  });
  modal.render({
    content: card.render({
      category: item.category,
      title: item.title,
      description: item.description,
      image: item.image,
      price: item.price,
      inBasket: item.inBasket,
    })
  })
  if (item.price === null) {
    card.disableButton(true)
  }
});

// добавить карточку в корзину
events.on(EventTypes.BASKET_ADD, (item: ICardItem) => {
  item.inBasket = true;
  appData.addBasket(item);
  page.counter = appData.basket.length;
  modal.close();
});

// удалить товар из корзины
events.on(EventTypes.PRODUCT_DELETE, (item: ICardItem) => {
  item.inBasket = false;
  appData.removeBasket(item);
  page.counter = appData.basket.length;
});

// изменения в корзине
events.on(EventTypes.BASKET_CHANGED, (items: ICardItem[]) => {
  basket.items = items.map((item, index) => {
    const card = new Card(cloneTemplate(cardBasketTemplate), {
      onClick: () => {
        events.emit(EventTypes.PRODUCT_DELETE, item),
          (item.inBasket = false),
          appData.removeBasket(item);
        page.counter = appData.basket.length;
      },
    });
    return card.render({
      id: item.id,
      title: item.title,
      price: item.price,
      index: `${index + 1}`,
    });
  });
  basket.total = appData.getTotalPrice();
  appData.order.total = appData.getTotalPrice();
});

// открыть корзину
events.on(EventTypes.BASKET_OPEN, () => {
  modal.render({
    content: basket.render({}),
  });
});

// открыть форму заказа
events.on(EventTypes.ORDER_OPEN, () => {
  modal.render({
    content: deliveryOrderForm.render({
      payment: 'card',
      address: '',
      valid: false,
      errors: [],
    }),
  });
});

// изменилось одно из полей формы заказа
events.on(
  /^order\..*:change/,
  (data: { field: keyof IOrderForm; value: string }) => {
    appData.setOrderField(data.field, data.value);
  }
);

// проверка формы заказа
events.on(EventTypes.ORDER_READY, () => {
  deliveryOrderForm.valid = true;
});

// Открыть форму контактов
events.on(EventTypes.ORDER_SUBMIT, () => {
  modal.render({
    content: contactOrderForm.render({
      email: '',
      phone: '',
      valid: false,
      errors: [],
    }),
  });
})

// изменилось одно из полей формы контактов
events.on(
  /^contacts\..*:change/,
  (data: { field: keyof IOrderForm; value: string }) => {
    appData.setContactField(data.field, data.value);
  }
);

// Проверка формы контактов
events.on(EventTypes.CONTACTS_READY, () => {
  contactOrderForm.valid = true;
});

// ошибки формы
events.on(EventTypes.FORM_ERRORS_CHANGE, (errors: Partial<IOrder>) => {
  const { payment, address, email, phone } = errors;

  deliveryOrderForm.valid = !payment && !address;
  deliveryOrderForm.errors = Object.values({ payment, address }).filter((i) => !!i);

  contactOrderForm.valid = !email && !phone;
  contactOrderForm.errors = Object.values({ email, phone }).filter((i) => !!i);
});

// отправка заказа
events.on(EventTypes.CONTACTS_SUBMIT, () => {
  appData.orderData();
  const orderWithItems = {
    ...appData.order,
    items: appData.basket.map(item => item.id)
  };

  api
    .orderCards(orderWithItems)
    .then((res) => {
      const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => {
          modal.close();
        },
      });
      appData.basket.forEach(item => {
        item.inBasket = false;
      });
      
      appData.resetOrderForm();
      appData.clearBasket();
      page.counter = appData.basket.length;
      events.emit(EventTypes.ITEMS_CHANGED);

      success.result = res.total.toString();
      modal.render({
        content: success.render({}),
      });
    })
    .catch((err) => {
      console.error('Ошибка при отправке заказа:', err);
    });
});

// Блокируем прокрутку страницы если открыта модалка 
events.on(EventTypes.MODAL_OPEN, () => {
  page.locked = true;
});

// ... и разблокируем 
events.on(EventTypes.MODAL_CLOSE, () => {
  page.locked = false;
});