import { Car, DashboardStats, User } from '@/types/car';
import { v4 as uuidv4 } from 'uuid';

export const carMakes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Tesla', 'Porsche'];

export const fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];

export const transmissionTypes = ['Automatic', 'Manual', 'CVT', 'Semi-automatic'];

export const statusTypes = ['available', 'sold', 'reserved'] as const;

export const carColors = ['Black', 'White', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Yellow', 'Brown', 'Orange'];

export const adminUsers: User[] = [
    {
        id: uuidv4(),
        username: 'Billy Tom',
        email: 'billy@gmail.com',
        role: 'admin',
        password: '123456',
    },
];

export const mockCars: Car[] = [
    {
        id: uuidv4(),
        make: 'BMW',
        model: '3 Series',
        year: 2022,
        color: 'Black',
        price: 45999,
        mileage: 5200,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        status: 'available',
        imageUrl:
            'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
        createdAt: new Date(2023, 1, 15).toISOString(),
        updatedAt: new Date(2023, 1, 15).toISOString(),
    },
    {
        id: uuidv4(),
        make: 'Tesla',
        model: 'Model 3',
        year: 2023,
        color: 'White',
        price: 52990,
        mileage: 1200,
        fuelType: 'Electric',
        transmission: 'Automatic',
        status: 'available',
        imageUrl:
            'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
        createdAt: new Date(2023, 2, 10).toISOString(),
        updatedAt: new Date(2023, 2, 10).toISOString(),
    },
    {
        id: uuidv4(),
        make: 'Mercedes-Benz',
        model: 'E-Class',
        year: 2021,
        color: 'Silver',
        price: 58700,
        mileage: 12500,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        status: 'sold',
        imageUrl:
            'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
        createdAt: new Date(2022, 11, 5).toISOString(),
        updatedAt: new Date(2023, 1, 20).toISOString(),
    },
    {
        id: uuidv4(),
        make: 'Toyota',
        model: 'Camry',
        year: 2023,
        color: 'Blue',
        price: 32000,
        mileage: 3500,
        fuelType: 'Hybrid',
        transmission: 'CVT',
        status: 'available',
        imageUrl:
            'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
        createdAt: new Date(2023, 3, 2).toISOString(),
        updatedAt: new Date(2023, 3, 2).toISOString(),
    },
    {
        id: uuidv4(),
        make: 'Audi',
        model: 'Q5',
        year: 2022,
        color: 'Gray',
        price: 49500,
        mileage: 8900,
        fuelType: 'Diesel',
        transmission: 'Automatic',
        status: 'reserved',
        imageUrl:
            'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
        createdAt: new Date(2022, 9, 12).toISOString(),
        updatedAt: new Date(2023, 2, 15).toISOString(),
    },
    {
        id: uuidv4(),
        make: 'Porsche',
        model: '911',
        year: 2022,
        color: 'Red',
        price: 112000,
        mileage: 4200,
        fuelType: 'Gasoline',
        transmission: 'Semi-automatic',
        status: 'available',
        imageUrl: 'https://www.carscoops.com/wp-content/uploads/webp/2023/07/Porsche-911-GT3-8_resulta-1024x576.webp',
        createdAt: new Date(2022, 10, 20).toISOString(),
        updatedAt: new Date(2022, 10, 20).toISOString(),
    },
    {
        id: uuidv4(),
        make: 'Honda',
        model: 'Accord',
        year: 2023,
        color: 'White',
        price: 29990,
        mileage: 2100,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        status: 'available',
        imageUrl: 'https://images.cars.com/cldstatic/wp-content/uploads/honda-accord-hybrid-2023-02-exterior-front-angle-scaled.jpg',
        createdAt: new Date(2023, 1, 8).toISOString(),
        updatedAt: new Date(2023, 1, 8).toISOString(),
    },
    {
        id: uuidv4(),
        make: 'Ford',
        model: 'Mustang',
        year: 2021,
        color: 'Yellow',
        price: 45000,
        mileage: 15000,
        fuelType: 'Gasoline',
        transmission: 'Manual',
        status: 'sold',
        imageUrl: 'https://cdn-ds.com/blogs-media/sites/678/2021/08/26024556/2021-Ford-Mustang-Mach-1_A_o-1038x375.jpg',
        createdAt: new Date(2022, 5, 30).toISOString(),
        updatedAt: new Date(2022, 10, 15).toISOString(),
    },
];

export const calculateDashboardStats = (cars: Car[]): DashboardStats => {
    const totalCars = cars.length;
    const availableCars = cars.filter((car) => car.status === 'available').length;
    const soldCars = cars.filter((car) => car.status === 'sold').length;
    const reservedCars = cars.filter((car) => car.status === 'reserved').length;

    const totalPrice = cars.reduce((sum, car) => sum + car.price, 0);
    const averagePrice = totalCars > 0 ? Math.round(totalPrice / totalCars) : 0;

    const newestCar =
        cars.length > 0
            ? cars.reduce((newest, car) => {
                  return new Date(car.createdAt) > new Date(newest.createdAt) ? car : newest;
              }, cars[0])
            : null;

    return {
        totalCars,
        availableCars,
        soldCars,
        reservedCars,
        averagePrice,
        newestCar,
    };
};

export const salesData = [
    {
        id: 'ORD-2023-001',
        customer: 'John Doe',
        date: '2023-08-15',
        items: 3,
        total: 349.97,
        status: 'Completed',
        paymentMethod: 'Credit Card',
    },
    {
        id: 'ORD-2023-002',
        customer: 'Sarah Smith',
        date: '2023-08-14',
        items: 1,
        total: 899.99,
        status: 'Completed',
        paymentMethod: 'PayPal',
    },
    {
        id: 'ORD-2023-003',
        customer: 'Mike Johnson',
        date: '2023-08-14',
        items: 5,
        total: 124.95,
        status: 'Processing',
        paymentMethod: 'Credit Card',
    },
    {
        id: 'ORD-2023-004',
        customer: 'Lisa Wong',
        date: '2023-08-13',
        items: 2,
        total: 199.98,
        status: 'Shipped',
        paymentMethod: 'Bank Transfer',
    },
    {
        id: 'ORD-2023-005',
        customer: 'David Chen',
        date: '2023-08-10',
        items: 4,
        total: 459.96,
        status: 'Completed',
        paymentMethod: 'Credit Card',
    },
    {
        id: 'ORD-2023-006',
        customer: 'Emma Wilson',
        date: '2023-08-09',
        items: 1,
        total: 29.99,
        status: 'Cancelled',
        paymentMethod: 'PayPal',
    },
];
