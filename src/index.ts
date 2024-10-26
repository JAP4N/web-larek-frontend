import './scss/styles.scss';
import { AppData, CatalogChangeEvent } from './components/appData';
import { ICardItem, IOrder, IOrderForm,  EventTypes } from './types';
import { Card } from './components/Card';
import { WebLarekAPI } from './components/WebLarekAPI';
import { Page } from './components/Page';
import { Modal } from './components/common/modal';
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

  // Получаем товары с сервера 
api.getCardList()
.then(appData.setCatalog.bind(appData))
.catch((err) => {
  console.error(err);
});