# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура приложения
Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter):

Model - слой данных, отвечает за хранение и изменение данных.

View - слой представления, отвечает за отображение данных на странице.

EventEmitter выступает в роли Представителя (Presenter).

## Данные и типы данных используемые в приложении

Состояние приложения
```
 interface ILarekApp {
  basket: IBasket[];
  cardsList: ICardItem[];
  preview: string | null;
  order: IOrder | null;
}
```

Валидность формы
```
interface IFormState {
    valid: boolean;
    errors: string[];
}
```

Cписок элементов товаров и общая стоимость
```
interface IBasketView {
    items: HTMLElement[];
    total: number;
}
```

Данные заказа
```
 interface IOrder {
  payment: string;
  address: string;
  email: string;
  phone: string;
  total: number;
  id: string[];
}
```

Данные формы заказа
```
interface IOrderForm {
  payment: string;
  address: string;
  email: string;
  phone: string;
}
```

Данные главной страницы 
```
interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}
```

Товар
```
interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  index: string;
  inBasket: boolean;
}
```

Данные заказа
```
 interface IOrder {
  payment: boolean;
  address: string;
  email: string;
  phone: string;
  cardsId: string[];
}
```

Корзина
```
 interface IBasket {
  quantity: number;
  cardsList: ICard[];
  totalPrice: number;
}
```

Ошибки полей формы 
```
type FormErrors = Partial<Record<keyof IOrder, string>>;
```

Валидация формы
```
interface IFormValidation {
  valid: boolean;
  errors: string[];
}
```

Модальное окно
```
interface IModalData {
    content: HTMLElement;
}
```

Успешный заказ
```
interface ISuccess {
  total: number;
}
```

## Базовый код

### Класс `Api`
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

##### Свойства:
- readonly baseUrl: string - неизменяемое свойство, URL основного API.
- protected options: RequestInit - защищенное свойство, дополнительные параметры для HTTP-запросов.

##### Конструктор:
- baseUrl: string - URL основного API.
- options: RequestInit = {} - дополнительные параметры для HTTP-запросов.

##### Методы:
- `protected handleResponse(response: Response): Promise<object>` - Защищённый метод обрабатывает ответ от сервера. При положительном ответе (response.ok) возвращает содержимое в формате JSON. В ином случае — ошибку из JSON-ответа.
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер.
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

### Класс `EventEmitter`
Брокер событий используется в presenter для обработки событий и в слоях приложения для генерации событий.

##### Свойства:
- `_events: Map` - хранит карту событий и их подписчиков;

##### Конструктор:
- `constructor()` - создает _events, представляющую собой карту событий;

##### Методы:
- `on` - подписка на событие.
- `off` - отписка от события.
- `onAll` - подписка на все событие.
- `offAll` - отписка от всех событий.
- `emit` - инициализация события.
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.

### Класс `Component`
Абстрактный класс, предоставляет базовую функциональность для создания дочерних компонентов.

##### Конструктор:
- `constructor(container: HTMLElement)` - Корневой элемент контейнера, в который будет добавлен компонент.
##### Методы:
- `toggleClass(element: HTMLElement, className: string, force?: boolean)` - переключает класс элемента.
- `protected setText(element: HTMLElement, value: unknown)` - устанавливает текстовое содержимое.
- `setDisabled(element: HTMLElement, state: boolean)` - устанавливает состояние блокировки.
- `protected setHidden(element: HTMLElement)` - скрывает элемент.
- `protected setVisible(element: HTMLElement)` - показывает элемент.
- `protected setImage(element: HTMLImageElement, src: string, alt?: string)` - установить изображение с алтернативным текстом.
- `render(data?: Partial<T>): HTMLElement` - возвращает DOM-элемент.

### Класс `Model`
Абстрактный класс, представляет собой базовую модель данных.

##### Конструктор:
- `constructor(data: Partial<T>, protected events: IEvents)` - принимает объект data, который содержит начальные значения модели, и объект events.
##### Методы:
- `emitChanges(event: string, payload?: object) ` - используется для отправки событий, связанных с изменениями модели.

## Модели данных

### Класс `AppData extends Model<ILarekApp>`
Расширяет класс Model. Отвечает за управление состоянием приложения, хранение данных и выполнение операций.

##### Свойства:
- `catalog: ICard[]` - данные о товаре.
- `basket: ICard[] = []` - данные о товаре в корзине.
- `order: IOrder = {}` - данные о заказе.
- `preview: string | null` - идентификационный номер товара.
- `formErrors: FormErrors = {}` - ошибки полей формы.

##### Конструктор:
- constructor() - конструктор наследуется от класса Model.

##### Методы:
- `addBasket(value: ICardItem)` – добавляет товар в корзину, если его там еще нет, и генерирует событие basket:changed.
- `removeBasket(value: ICardItem)` – удаляет указанный товар из корзины и генерирует событие basket:changed.
- `clearBasket()` – очищает все товары из корзины и инициирует событие basket:changed.
- `getTotalPrice()` – возвращает общую стоимость всех товаров, находящихся в корзине.
- `setCatalog(items: ICardItem[])` – устанавливает список доступных товаров в каталоге и генерирует событие items:changed.
- `setPreview(item: ICardItem)` – назначает товар для предварительного просмотра и инициирует событие preview:changed.
- `setOrderField(field: keyof IOrderForm, value: string)` – обновляет значение указанного поля в форме заказа, проверяет корректность данных и инициирует событие order:ready, если все поля формы корректны.
- `setContactField(field: keyof IOrderForm, value: string)` – обновляет контактное поле в форме заказа, проверяет корректность данных и инициирует событие contact:ready, если информация правильная.
- `validateOrder()` – проверяет корректность всех полей формы заказа. Возвращает true, если проверка успешна, иначе возвращает false и генерирует событие formErrors:change.
- `validateContact()` – проверяет правильность заполнения контактных полей в форме. Возвращает true, если проверка успешна, иначе возвращает false и генерирует событие formErrors:change.
- `resetOrderForm()` – сбрасывает все данные в форме заказа.
- `orderData()` – собирает и возвращает данные заказа, включая идентификаторы товаров из корзины и итоговую сумму.

## Компоненты представления

### Класс `extends Component<IModalData>`
Расширяет класс Component, предназначен для реализации модального окна. Так же предоставляет методы `open` и `close`для управления отображением модального окна.
##### Свойства:
- `protected` _closeButton: HTMLButtonElement - кнопка закрытия модального окна.;
- `protected` _content: HTMLElement - контент модального окна;
##### Конструктор:
- `constructor(selector: string, events: IEvents)` - конструктор принимает селектор по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициализации событий.
##### Методы:
- `set content(value: HTMLElement)` - устанавливает новый контент для модального окна;
- `open()` - открывает модальное окно;
- `close()` - закрывает модальное окно;
- `render(data: IModalData): HTMLElement` - рендерит модальное окно с переданным контентом и открывает его;

### Класс `Form<T> extends Component<IFormState>`
Расширяет класс Component, предназначен для реализации модального окна с формой ввода данных пользователя.

##### Свойства:
- `protected _submit: HTMLButtonElement` - кнопка отправки формы;
- `protected _errors: HTMLElement` - элемент для отображения ошибок ввода;
##### Конструктор:
- `constructor(protected container: HTMLFormElement, protected events: IEvents)` - принимает контейнер с элементами формы, объект событий, используемый для всех полей ввода и кнопки отправки формы;
##### Методы:
- `protected onInputChange(field: keyof T, value: string)` - вызывается при изменении значения поля ввода и отправляет событие с измененным значением;
- `set valid(value: boolean)` - устанавливает состояние валидности формы. Если форма не валидна, кнопка отправки формы становится неактивной;
- `set errors(value: string)` - устанавливает текст ошибок ввода в элемент _errors;
- `render(state: Partial<T> & IFormState)` - рендерит форму с переданными данными и состоянием валидности;

### Класс `Basket extends Component<IBasketView>`
Расширяет класс Component, предназначен для реализации модального окна корзины покупок.

##### Свойства:
- `protected _list: HTMLElement` - элемент, содержащий список товаров в корзине;
- `protected _total: HTMLElement` - элемент, отображающий общую стоимость товаров в корзине;
- `protected _button: HTMLElement` - элемент, представляющий кнопку действия (например, "Оформить заказ");
##### Конструктор:
- `constructor(container: HTMLElement, protected events: EventEmitter)` - принимает корневой элемент для корзины и объект событий;
##### Методы:
- `set items(items: HTMLElement[])` - устанавливает список товаров в корзине. Если список пуст, вместо него отображается сообщение "Корзина пуста" и кнопка не активна;
- `set total(total: number)` - устанавливает общую стоимость товаров в корзине;

### Класс `Success extends Component<ISuccess>`
Расширяет класс Component, предназначен для реализации модального окна успешного офомления заказа.

##### Свойства:
- `protected _close: HTMLElement` - элемент, представляющий кнопку закрытия;
##### Конструктор:
- `constructor(container: HTMLElement, actions: ISuccessActions)` - принимает элемент успешной оплаты и устанавливает обработчик события для кнопки закрытия;
##### Методы:
- `set result(text: string)` - устанавливает сообщение об успешной оплате

### Класс `OrderForm extends Form<IOrder>`
Класс OrderForm представляет собой компонент формы, который обрабатывает форму заказа с методом оплаты и доставкой. Он расширяет обобщенный класс Form с типом IOrder.

##### Свойства:
- `_card: HTMLButtonElement` - элемент кнопки для выбора метода оплаты картой.
- `_cash: HTMLButtonElement` - элемент кнопки для выбора метода оплаты наличными.
- `_address: HTMLInputElement `- элемент ввода для указания адреса доставки.
- `_contactButton: HTMLButtonElement` - элемент кнопки для отправки контактных данных.
##### Конструктор:
- `constructor(container: HTMLFormElement, events: IEvents)`
- `container` - HTML-элемент формы, в котором сое -ржится форма заказа.
- `events` - Экземпляр объекта событий для управления событиями формы.
##### Методы:
- `_setPaymentMethod(payment: string)` - Приватный метод для установки выбранного метода оплаты.
- `address` - Set Свойство для установки значения адреса доставки.

### Класс `ContactsForm`
Класс ContactsForm представляет собой компонент формы, который обрабатывает контактные данные заказа. Он также расширяет обобщенный класс Form с типом IOrder.

##### Свойства:
- `_email: HTMLInputElement` - элемент ввода для ввода адреса электронной почты.
- `_phone: HTMLInputElement` - элемент ввода для ввода номера телефона.
- `_submitButton: HTMLButtonElement` - кнопка отправки формы.
##### Конструктор:
- `constructor(container: HTMLFormElement, events: IEvents)`
- `container` - HTML-элемент формы, в котором содержится форма контактных данных.
- `events` - Экземпляр объекта событий для управления событиями формы.
##### Методы:
`email` - Set Свойство для установки значения адреса электронной почты. \
`phone` - Set Свойство для установки значения номера телефона.

#### Класс `Page extends Component<IPage>`
Расширяет класс Component, предназначен для управления содержимым страницы и предоставляет механизмы для отображения списка товаров и корзины.
##### Свойства:
- `protected _counter: HTMLElement` - элемент, представляющий счетчик товаров в корзине;
- `protected _catalog: HTMLElement` - элемент, представляющий каталог товаров;
- `protected _wrapper: HTMLElement` - элемент, представляющий обертку страницы;
- `protected _basket: HTMLElement` - элемент, представляющий кнопку корзины товаров;
##### Конструктор:
- `constructor(container: HTMLElement, protected events: IEvents)` - принимает корневой элемент для компонента и объект событий. В конструкторе устанавливается обработчик события для элемента корзины, который открывает окно выбранными товарами;
##### Методы:
- `set counter(value: number)` - устанавливает количество товаров в корзине;
- `set catalog(items: HTMLElement[])` - устанавливает список товаров;
- `set locked(value: boolean)` - устанавливает состояние блокировки страницы;

#### Класс `Card extends Component<ICard>`
Расширяет класс Component, предназначен для отображения и управления карточками товара.

##### Свойства:
- `_category` - элемент, представляющий категорию товара;
- `_title` - элемент, представляющий название товара;
- `_description` - элемент, представляющий описание товара;
- `_image` - элемент, представляющий изображение товар;
- `_button` - элемент, представляющий кнопку карточки;
- `_price` - элемент, представляющий цену товара;
- `_index` - элемент, отображающий номер товара в корзине.
##### Конструктор:
- `constructor(container: HTMLElement, actions?: ICardActions)` - принимает контейнер для карточки и объект действий. В конструкторе устанавливаются обработчики событий для категории, заголовка, изображения, описания, кнопки, цены.
##### Методы:
- `set id(value: string)` - устанавливает идентификатор товара;
- `set category(value: string)` - устанавливает категорию товара и добавляет соответствующий класс к элементу категории;
- `set title(value: string)` - устанавливает название товара;
- `set description(value: string)` - устанавливает описание карточки;
- `set image(value: string)` - устанавливает изображение карточки;
- `disableButton(isDisabled: boolean)` - устанавливает класс disabled, если цена товара null;
- `set price(value: number | null)` - устанавливает цену карточки и, если цена установлена, отключает кнопку карточки;
- `inBasket(value: boolean)` - устанавливает, находится ли карточка в корзине, и, если нет, отключает кнопку карточки.
- `index` - устанавливает порядковый номер товара в каталоге.

## Взаимодействие компонентов
Логика взаимодействия между представлением и данными описана в файле `index.ts`, который выполняет функцию презентера.
Связь между компонентами осуществляется через события, сгенерированные с использованием брокера событий, а также их обработчиков, определенных в `index.ts`.
В `index.ts` сначала создаются экземпляры всех необходимых классов, после чего настраивается система обработки событий.

### Описание событий

- `items:changed` - изменение элементов каталога товаров;
- `card:select` - выбор карточки товара;
- `preview:changed` - изменение открытой карточки товара;
- `basket:add` - добавление товара в корзину;
- `product:delete` - удаление товара из корзины;
- `basket:changed` - изменение содержимого корзины;
- `basket:open` - открытие корзины;
- `order:open` - открытие формы заказа;
- `formErrors:change` - изменение ошибок в форме;
- `order:ready` - подготовка заказа к отправке;
- `contact:ready` - подготовка контактных данных к отправке;
- `order:submit` - отправка заказа;
- `modal:open` - открытие модальных окон;
- `modal:close` - закрытие модальных окон.