export interface AssetModelTs {
    id: string;
    name: string;
    currency: Currency;
    amount: number;
    category: string;
}

type Currency = 'USD' | 'ARS';
