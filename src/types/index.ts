export interface ICard{
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// export interface IItems {
//     items: ICard[];
// }

export type TCardBaseInfo = Pick<ICard, 'image' | 'category' | 'title' | 'description' | 'price'>;

export type TCardBuyInfo = Pick<ICard, 'title' | 'price'>;

export interface ICardsData {
	cards: ICard[];
	preview: string | null;
    getCard(cardId: string): TCardBaseInfo;
}