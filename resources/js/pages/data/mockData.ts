import { Car, DashboardStats, User } from '@/types/car';
import { Customer } from '@/types/customer';
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

export const sampleInventory = [
    {
        id: '1',
        name: 'Toyota Camry',
        category: 'Sedan',
        year: 2024,
        make: 'Toyota',
        model: 'Camry XLE',
        stock: 7,
        price: 31749.99,
        status: 'In Stock',
        imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=2000&auto=format&fit=crop',
    },
    {
        id: '2',
        name: 'Honda CR-V',
        category: 'SUV',
        year: 2024,
        make: 'Honda',
        model: 'CR-V Hybrid EX-L',
        stock: 5,
        price: 36845.99,
        status: 'In Stock',
        imageUrl: 'https://media.ed.edmunds-media.com/honda/cr-v/2024/oem/2024_honda_cr-v_4dr-suv_sport-hybrid_fq_oem_1_1280.jpg',
    },
    {
        id: '3',
        name: 'Ford F-150',
        category: 'Truck',
        year: 2024,
        make: 'Ford',
        model: 'F-150 Lariat',
        stock: 3,
        price: 53980.0,
        status: 'In Stock',
        imageUrl: 'https://www.motortrend.com/uploads/2023/09/2024-Ford-F-150-Lariat-1.jpg',
    },
    {
        id: '4',
        name: 'BMW 330i',
        category: 'Luxury',
        year: 2024,
        make: 'BMW',
        model: '330i xDrive',
        stock: 2,
        price: 49295.0,
        status: 'Low Stock',
        imageUrl: 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?q=80&w=2000&auto=format&fit=crop',
    },
    {
        id: '5',
        name: 'Tesla Model 3',
        category: 'Electric',
        year: 2024,
        make: 'Tesla',
        model: 'Model 3 Long Range',
        stock: 0,
        price: 47990.0,
        status: 'Out of Stock',
        imageUrl:
            'https://www.motortrend.com/files/6628048fbbe66c000856c954/2024teslamodel3performancehighland28.jpg?w=768&width=768&q=75&format=webp',
    },
    {
        id: '6',
        name: 'Chevrolet Corvette',
        category: 'Sports',
        year: 2024,
        make: 'Chevrolet',
        model: 'Corvette Stingray Z51',
        stock: 1,
        price: 71995.0,
        status: 'Low Stock',
        imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2000&auto=format&fit=crop',
    },
    {
        id: '7',
        name: 'Hyundai Tucson',
        category: 'SUV',
        year: 2024,
        make: 'Hyundai',
        model: 'Tucson Limited',
        stock: 6,
        price: 36845.0,
        status: 'In Stock',
        imageUrl: 'https://res.cloudinary.com/total-dealer/image/upload/w_3840,f_auto,q_75/v1/production/r9j8a21etu6ly924bgd8t24xa974',
    },
    {
        id: '8',
        name: 'Mazda CX-5',
        category: 'SUV',
        year: 2024,
        make: 'Mazda',
        model: 'CX-5 Carbon Edition',
        stock: 4,
        price: 33450.0,
        status: 'In Stock',
        imageUrl: 'https://prod.cdn.secureoffersites.com/images/oem/mazda/2024-cx5/2024_cx5_2_5_Turbo_PremiumPlus_SoulRedCrystal_Car_0000.png',
    },
    {
        id: '9',
        name: 'Jeep Grand Cherokee',
        category: 'SUV',
        year: 2024,
        make: 'Jeep',
        model: 'Grand Cherokee Limited',
        stock: 3,
        price: 47640.0,
        status: 'In Stock',
        imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2000&auto=format&fit=crop',
    },
    {
        id: '10',
        name: 'Kia Telluride',
        category: 'SUV',
        year: 2024,
        make: 'Kia',
        model: 'Telluride SX',
        stock: 2,
        price: 46090.0,
        status: 'Low Stock',
        imageUrl: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?q=80&w=2000&auto=format&fit=crop',
    },
];

export const salesDatas = [
    { month: 'Jan', sales: 24, revenue: 840000, profit: 126000 },
    { month: 'Feb', sales: 18, revenue: 639800, profit: 95970 },
    { month: 'Mar', sales: 32, revenue: 1180000, profit: 177000 },
    { month: 'Apr', sales: 27, revenue: 941500, profit: 141225 },
    { month: 'May', sales: 21, revenue: 772000, profit: 115800 },
    { month: 'Jun', sales: 25, revenue: 886000, profit: 132900 },
    { month: 'Jul', sales: 29, revenue: 1045000, profit: 156750 },
    { month: 'Aug', sales: 31, revenue: 1208000, profit: 181200 },
    { month: 'Sep', sales: 26, revenue: 895000, profit: 134250 },
    { month: 'Oct', sales: 23, revenue: 827000, profit: 124050 },
    { month: 'Nov', sales: 28, revenue: 1058000, profit: 158700 },
    { month: 'Dec', sales: 33, revenue: 1275000, profit: 191250 },
];

export const categoryData = [
    { name: 'SUV', value: 42 },
    { name: 'Sedan', value: 28 },
    { name: 'Truck', value: 15 },
    { name: 'Luxury', value: 8 },
    { name: 'Electric', value: 5 },
    { name: 'Sports', value: 2 },
];

export const customerData = [
    { name: 'Week 1', new: 8, returning: 4 },
    { name: 'Week 2', new: 6, returning: 5 },
    { name: 'Week 3', new: 9, returning: 3 },
    { name: 'Week 4', new: 7, returning: 6 },
];

export const sampleCustomers: Customer[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+855 12 345 678',
        address: 'Phnom Penh, Cambodia',
        purchaseCount: 5,
        totalSpent: 1250,
        lastPurchase: '2023-06-15',
    },
    {
        id: '2',
        name: 'Sarah Smith',
        email: 'sarah@example.com',
        phone: '+855 12 876 543',
        address: 'Siem Reap, Cambodia',
        purchaseCount: 3,
        totalSpent: 780,
        lastPurchase: '2023-07-22',
    },
    {
        id: '3',
        name: 'David Chen',
        email: 'david@example.com',
        phone: '+855 11 222 333',
        address: 'Battambang, Cambodia',
        purchaseCount: 8,
        totalSpent: 2340,
        lastPurchase: '2023-08-05',
    },
];
