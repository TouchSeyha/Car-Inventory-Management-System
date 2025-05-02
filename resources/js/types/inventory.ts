export interface Inventory {
    id: number;
    name: string;
    category: string;
    year: number;
    make: string;
    model: string;
    stock: number;
    price: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    imageurl: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface InventoryFormData {
    name: string;
    category: string;
    year: number;
    make: string;
    model: string;
    stock: number;
    price: number;
    imageurl: string;
    description?: string;
}

export interface InventoryFilters {
    search?: string;
    category?: string;
    yearFrom?: number;
    yearTo?: number;
    priceFrom?: number;
    priceTo?: number;
    status?: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'all';
    [key: string]: string | number | undefined;
}
