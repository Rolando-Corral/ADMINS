export interface AssetModelTs {
    id: string;
    countName: string;
    currency: Currency;
    shares?: number; // cantidad de acciones (o fracción) que poseés
    acquisitionCostUsd: number;// lo que pagaste al comprar
    currentValueUsd?: number;// lo que vale hoy esa posición
    category: Category;
}

type Currency = 'USD' | 'ARS';
type Category = 'cuenta remunerada' | 'plazo fijo en USD' | 'posición';
