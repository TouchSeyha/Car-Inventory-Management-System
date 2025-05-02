import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { sampleInventory } from './data/mockData';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inventory',
        href: '/inventory',
    },
];

export default function Inventory() {
    const [category, setCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = sampleInventory.filter(
        (item) =>
            (category === 'all' || item.category === category) &&
            (searchTerm === '' ||
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.model.toLowerCase().includes(searchTerm.toLowerCase())),
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
                <div className="mb-6 flex items-center justify-between">
                    <HeadingSmall title="Car Inventory" description="Manage your vehicle inventory" />
                    <Button>Add Vehicle</Button>
                </div>

                <div className="mb-4 flex flex-wrap gap-3">
                    <Input placeholder="Search vehicles..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-xs" />
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

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredItems.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                            <div className="flex h-48 items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-foreground text-lg font-semibold">{item.name}</h3>
                                        <div className="text-muted-foreground flex gap-2 text-sm">
                                            <span>{item.year}</span>
                                            <span>•</span>
                                            <span>{item.category}</span>
                                        </div>
                                    </div>
                                    <span className={`rounded px-2 py-1 text-xs font-medium ${getStatusColor(item.status)}`}>{item.status}</span>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-foreground text-lg font-bold">${item.price.toLocaleString()}</p>
                                    <p className="text-muted-foreground text-sm">Available: {item.stock}</p>
                                </div>
                                <div className="mt-4 flex space-x-2">
                                    <Button size="sm" variant="outline" className="flex-1">
                                        Edit
                                    </Button>
                                    <Button size="sm" className="flex-1">
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
