import HeadingSmall from '@/components/heading-small';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit2Icon, EyeIcon, Loader2, PlusIcon, SearchIcon, XIcon } from 'lucide-react';
import { KeyboardEvent, useCallback, useEffect, useState } from 'react';

// Define types for inventory data
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
    inventory: {
        data: Inventory[];
        links: { url: string | null; label: string; active: boolean }[];
        meta: {
            current_page: number;
            from: number;
            last_page: number;
            links: { url: string | null; label: string; active: boolean }[];
            path: string;
            per_page: number;
            to: number;
            total: number;
        };
    };
    filters: {
        search?: string;
        category?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inventory',
        href: '/inventory',
    },
];

export default function Inventory({ inventory, filters }: Props) {
    const [isLoading, setIsLoading] = useState(true);
    const [category, setCategory] = useState<string>(filters.category || 'all');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        try {
            if (inventory.meta) {
                console.log('Inventory data loaded');
            }
            setIsLoading(false);
        } catch (err) {
            console.error('Error processing inventory data:', err);
            setIsLoading(false);
        }
    }, [inventory]);

    // Handle category change
    const handleCategoryChange = (value: string) => {
        setCategory(value);
        
        router.visit(route('inventory'), {
            data: { 
                ...(searchTerm ? { search: searchTerm } : {}),
                ...(value !== 'all' ? { category: value } : {})
            },
            preserveState: true,
            replace: true,
        });
    };

    // Debounced search function
    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setSearchTerm(value);

            // Clear any existing timeout
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }

            // Set a new timeout to delay the search
            const timeoutId = setTimeout(() => {
                performSearch(value);
            }, 400); // 400ms delay

            setSearchTimeout(timeoutId);
        },
        [searchTimeout],
    );

    // Function to perform the search
    const performSearch = (value: string) => {
        setIsSearching(true);

        router.visit(route('inventory'), {
            data: { 
                search: value,
                ...(category !== 'all' ? { category } : {})
            },
            preserveState: true,
            replace: true,
            onFinish: () => setIsSearching(false),
        });
    };

    // Handle keyboard event for search input
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (searchTimeout) {
                clearTimeout(searchTimeout);
                setSearchTimeout(null);
            }
            performSearch(searchTerm);
        }
    };

    // Clear search function
    const clearSearch = () => {
        setSearchTerm('');

        router.visit(route('inventory'), {
            data: category !== 'all' ? { category } : {},
            preserveState: true,
            replace: true,
            onFinish: () => setIsSearching(false),
        });
    };

    // Handle search button click
    const handleSearchButtonClick = () => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
            setSearchTimeout(null);
        }
        performSearch(searchTerm);
    };

    // Get color for status badge
    const getStatusColor = (status: string) => {
        if (status === 'In Stock') return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300';
        if (status === 'Low Stock') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
        if (status === 'Out of Stock') return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    };

    if (isLoading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Car Inventory" />
                <div className="p-4">
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        <p>Loading inventory data...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Car Inventory" />

            <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <HeadingSmall title="Car Inventory" description="Manage your vehicle inventory" />
                    <Link href={route('inventory.create')}>
                        <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add Vehicle
                        </Button>
                    </Link>
                </div>

                <div className="mb-4 flex flex-wrap gap-3">
                    <div className="relative max-w-sm flex-1">
                        <Input 
                            placeholder="Search vehicles..." 
                            value={searchTerm} 
                            onChange={handleSearch}
                            onKeyDown={handleKeyDown}
                            className="pr-10"
                        />
                        {searchTerm && (
                            <button
                                onClick={clearSearch}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                type="button"
                                aria-label="Clear search"
                            >
                                <XIcon className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <Button onClick={handleSearchButtonClick} type="button">
                        {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SearchIcon className="mr-2 h-4 w-4" />}
                        Search
                    </Button>
                    <Select value={category} onValueChange={handleCategoryChange}>
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

                {searchTerm && !isSearching && inventory.data.length > 0 && (
                    <div className="mb-4 bg-blue-50 px-4 py-2 text-sm dark:bg-blue-900/20 rounded-md">
                        <span className="font-medium">{inventory.data.length}</span> {inventory.data.length === 1 ? 'result' : 'results'} found
                        for "<span className="font-medium">{searchTerm}</span>"
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {inventory.data.length > 0 ? (
                        inventory.data.map((item) => (
                            <Card key={item.id} className="overflow-hidden">
                                <div className="flex h-48 items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    <img src={item.imageurl} alt={item.name} className="h-full w-full object-cover" />
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
                                        <Link href={route('inventory.edit', item.id)} className="flex-1">
                                            <Button size="sm" variant="outline" className="w-full">
                                                <Edit2Icon className="mr-2 h-4 w-4" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <Link href={route('inventory.show', item.id)} className="flex-1">
                                            <Button size="sm" className="w-full">
                                                <EyeIcon className="mr-2 h-4 w-4" />
                                                View
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full flex h-64 items-center justify-center text-gray-500">
                            No vehicles found. Try a different search or add a new vehicle.
                        </div>
                    )}
                </div>

                {inventory.meta && inventory.meta.last_page > 1 ? (
                    <div className="mt-6">
                        <Pagination meta={inventory.meta} />
                    </div>
                ) : inventory.data && inventory.data.length > 0 ? (
                    <div className="mt-6 text-center text-sm text-gray-500">
                        Showing all {inventory.data.length} results
                    </div>
                ) : null}
            </div>
        </AppLayout>
    );
}
