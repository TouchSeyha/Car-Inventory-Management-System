import HeadingSmall from '@/components/heading-small';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { CalendarIcon, Car, Edit2Icon, TruckIcon } from 'lucide-react';

interface Inventory {
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

interface Props {
    inventory: Inventory;
}

const breadcrumbs = [
    {
        title: 'Inventory',
        href: '/inventory',
    },
    {
        title: 'Vehicle Details',
        href: '#',
    },
];

export default function ShowInventory({ inventory }: Props) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch {
            return 'Invalid date';
        }
    };

    const getStatusColor = (status: string) => {
        if (status === 'In Stock') return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300';
        if (status === 'Low Stock') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
        if (status === 'Out of Stock') return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'SUV':
            case 'Truck':
                return <TruckIcon className="h-4 w-4" />;
            default:
                return <Car className="h-4 w-4" />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={inventory.name} />

            <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <HeadingSmall title={inventory.name} description="Vehicle Details" />
                    <div className="flex gap-2">
                        <Link href={route('inventory.edit', inventory.id)}>
                            <Button>
                                <Edit2Icon className="mr-2 h-4 w-4" />
                                Edit Vehicle
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Vehicle image */}
                    <Card className="lg:col-span-2">
                        <div className="h-96 w-full overflow-hidden">
                            <img
                                src={inventory.imageurl}
                                alt={inventory.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/640x480?text=No+Image+Available';
                                }}
                            />
                        </div>
                    </Card>

                    {/* Vehicle details */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold">{inventory.name}</h3>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <Badge className={getStatusColor(inventory.status)}>
                                            {inventory.status}
                                        </Badge>
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            {getCategoryIcon(inventory.category)}
                                            {inventory.category}
                                        </Badge>
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            <CalendarIcon className="h-4 w-4" />
                                            {inventory.year}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="text-3xl font-bold text-primary">${inventory.price.toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground">Current Stock: {inventory.stock} units</p>
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="text-sm font-medium text-muted-foreground">Make & Model</h4>
                                    <p className="mt-1">{inventory.make} {inventory.model}</p>
                                </div>

                                {inventory.description && (
                                    <div className="border-t pt-4">
                                        <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                                        <p className="mt-1 whitespace-pre-line">{inventory.description}</p>
                                    </div>
                                )}

                                <div className="border-t pt-4">
                                    <h4 className="text-sm font-medium text-muted-foreground">Added on</h4>
                                    <p className="mt-1">{formatDate(inventory.created_at)}</p>
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="text-sm font-medium text-muted-foreground">Last Updated</h4>
                                    <p className="mt-1">{formatDate(inventory.updated_at)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
