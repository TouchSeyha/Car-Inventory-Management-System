export type ReportTimeRange = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
export type ReportType = 'sales' | 'inventory' | 'customer';

export interface ReportParameters {
    timeRange: ReportTimeRange;
    startDate?: string;
    endDate?: string;
    category?: string;
    customerId?: number;
}

export interface SalesSummary {
    totalSales: number;
    totalRevenue: number;
    averageOrder: number;
    topSellingProduct: string;
    customerRetentionRate: number;
    inventoryValue: number;
}

export interface TopProduct {
    id: number;
    name: string;
    quantity: number;
    total: number;
}

export interface CategorySales {
    name: string;
    value: number;
    amount: number;
}

export interface MonthlySalesData {
    month: string;
    sales: number;
    revenue: number;
    profit: number;
}

export interface CustomerActivityData {
    name: string; // Week or month
    new: number;
    returning: number;
}

export interface SalesReportData {
    summary: SalesSummary;
    topProducts: TopProduct[];
    salesByCategory: CategorySales[];
    monthlySales: MonthlySalesData[];
    customerData: CustomerActivityData[];
}

export interface Report {
    id: number;
    name: string;
    type: ReportType;
    parameters: ReportParameters;
    data: SalesReportData | any;
    periodStart: string;
    periodEnd: string;
    userId?: number;
    createdAt: string;
    updatedAt: string;
}
