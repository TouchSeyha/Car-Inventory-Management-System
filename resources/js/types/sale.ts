import { Customer } from './customer';
import { Inventory } from './inventory';

export type SaleStatus = 'Processing' | 'Shipped' | 'Completed' | 'Cancelled';

export interface SaleItem {
    id: number;
    sale_id: number;
    inventory_id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
    inventory?: Inventory;
    created_at?: string;
    updated_at?: string;
}

export interface Sale {
    id: number;
    order_id: string;
    customer_id: number;
    total_amount: number;
    item_count: number;
    status: SaleStatus;
    payment_method: string;
    notes?: string;
    customer?: Customer;
    items?: SaleItem[];
    created_at?: string;
    updated_at?: string;
}

export interface SaleFormData {
    customer_id: number;
    items: {
        inventory_id: number;
        quantity: number;
    }[];
    payment_method: string;
    notes: string;
    [key: string]: any;
}
