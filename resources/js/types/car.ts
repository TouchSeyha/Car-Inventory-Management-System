export interface Car {
    id: string;
    make: string;
    model: string;
    year: number;
    color: string;
    price: number;
    mileage: number;
    fuelType: string;
    transmission: string;
    status: 'available' | 'sold' | 'reserved';
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'user';
    password: string;
}

export interface CarFormData {
    make: string;
    model: string;
    year: number;
    color: string;
    price: number;
    mileage: number;
    fuelType: string;
    transmission: string;
    status: 'available' | 'sold' | 'reserved';
    imageUrl: string;
}

export interface CarFilters {
    make?: string;
    model?: string;
    yearFrom?: number;
    yearTo?: number;
    priceFrom?: number;
    priceTo?: number;
    status?: 'available' | 'sold' | 'reserved' | 'all';
    [key: string]: string | number | undefined;
}

export interface DashboardStats {
    totalCars: number;
    availableCars: number;
    soldCars: number;
    reservedCars: number;
    averagePrice: number;
    newestCar: Car | null;
}
