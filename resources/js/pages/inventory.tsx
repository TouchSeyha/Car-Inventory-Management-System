import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Card } from '@/components/ui/card';

// Sample car inventory items
const sampleInventory = [
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
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=2000&auto=format&fit=crop'
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
    imageUrl: 'https://media.ed.edmunds-media.com/honda/cr-v/2024/oem/2024_honda_cr-v_4dr-suv_sport-hybrid_fq_oem_1_1280.jpg'
  },
  {
    id: '3',
    name: 'Ford F-150',
    category: 'Truck',
    year: 2024,
    make: 'Ford',
    model: 'F-150 Lariat',
    stock: 3,
    price: 53980.00,
    status: 'In Stock',
    imageUrl: 'https://www.motortrend.com/uploads/2023/09/2024-Ford-F-150-Lariat-1.jpg'
  },
  {
    id: '4',
    name: 'BMW 330i',
    category: 'Luxury',
    year: 2024,
    make: 'BMW',
    model: '330i xDrive',
    stock: 2,
    price: 49295.00,
    status: 'Low Stock',
    imageUrl: 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: '5',
    name: 'Tesla Model 3',
    category: 'Electric',
    year: 2024,
    make: 'Tesla',
    model: 'Model 3 Long Range',
    stock: 0,
    price: 47990.00,
    status: 'Out of Stock',
    imageUrl: 'https://www.motortrend.com/files/6628048fbbe66c000856c954/2024teslamodel3performancehighland28.jpg?w=768&width=768&q=75&format=webp'
  },
  {
    id: '6',
    name: 'Chevrolet Corvette',
    category: 'Sports',
    year: 2024,
    make: 'Chevrolet',
    model: 'Corvette Stingray Z51',
    stock: 1,
    price: 71995.00,
    status: 'Low Stock',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: '7',
    name: 'Hyundai Tucson',
    category: 'SUV',
    year: 2024,
    make: 'Hyundai',
    model: 'Tucson Limited',
    stock: 6,
    price: 36845.00,
    status: 'In Stock',
    imageUrl: 'https://res.cloudinary.com/total-dealer/image/upload/w_3840,f_auto,q_75/v1/production/r9j8a21etu6ly924bgd8t24xa974'
  },
  {
    id: '8',
    name: 'Mazda CX-5',
    category: 'SUV',
    year: 2024,
    make: 'Mazda',
    model: 'CX-5 Carbon Edition',
    stock: 4,
    price: 33450.00,
    status: 'In Stock',
    imageUrl: 'https://prod.cdn.secureoffersites.com/images/oem/mazda/2024-cx5/2024_cx5_2_5_Turbo_PremiumPlus_SoulRedCrystal_Car_0000.png'
  },
  {
    id: '9',
    name: 'Jeep Grand Cherokee',
    category: 'SUV',
    year: 2024,
    make: 'Jeep',
    model: 'Grand Cherokee Limited',
    stock: 3,
    price: 47640.00,
    status: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: '10',
    name: 'Kia Telluride',
    category: 'SUV',
    year: 2024,
    make: 'Kia',
    model: 'Telluride SX',
    stock: 2,
    price: 46090.00,
    status: 'Low Stock',
    imageUrl: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?q=80&w=2000&auto=format&fit=crop'
  }
];

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Inventory',
    href: '/inventory',
  },
];

export default function Inventory() {
  const [category, setCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = sampleInventory
    .filter(item =>
      (category === 'all' || item.category === category) &&
      (searchTerm === '' ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.model.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const getStatusColor = (status: string) => {
    if (status === 'In Stock') return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300';
    if (status === 'Low Stock') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
    if (status === 'Out of Stock') return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Car Inventory" />

      <div className="p-4">
        <div className="mb-6 flex justify-between items-center">
          <HeadingSmall title="Car Inventory" description="Manage your vehicle inventory" />
          <Button>Add Vehicle</Button>
        </div>

        <div className="mb-4 flex flex-wrap gap-3">
          <Input
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Sedan">Sedan</SelectItem>
              <SelectItem value="SUV">SUV</SelectItem>
              <SelectItem value="Truck">Truck</SelectItem>
              <SelectItem value="Luxury">Luxury</SelectItem>
              <SelectItem value="Electric">Electric</SelectItem>
              <SelectItem value="Sports">Sports Car</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="h-48 overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{item.name}</h3>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <span>{item.year}</span>
                      <span>•</span>
                      <span>{item.category}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <p className="font-bold text-lg text-foreground">${item.price.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Available: {item.stock}</p>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                  <Button size="sm" className="flex-1">View Details</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}