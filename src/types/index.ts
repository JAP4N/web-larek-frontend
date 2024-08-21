interface iCard{
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

interface iItems {
    items: iCard[];
}