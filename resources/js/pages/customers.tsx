import HeadingSmall from '@/components/heading-small';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { DollarSign, EyeIcon, Loader2, PencilIcon, SearchIcon, UserPlusIcon, XIcon } from 'lucide-react';
import { KeyboardEvent, useCallback, useEffect, useState } from 'react';

// Define types for our API data
interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    purchase_count: number;
    total_spent: number;
    last_purchase: string | null;
}

interface Props {
    customers: {
        data: Customer[];
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
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customers',
        href: '/customers',
    },
];

export default function Customers({ customers }: Props) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        try {
            console.log('Customers data received:', customers);
            if (customers.meta) {
                console.log('Pagination meta:', customers.meta);
            } else {
                console.warn('Missing pagination meta data');
            }
            setIsLoading(false);
        } catch (err) {
            console.error('Error processing customers data:', err);
            setError('Failed to load customer data');
            setIsLoading(false);
        }
    }, [customers]);

    const { data, setData, processing } = useForm({
        search: '',
    });

    // Improved debounced search function
    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setData('search', value);

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
        [searchTimeout, setData],
    );

    // Dedicated function to perform the search
    const performSearch = (value: string) => {
        setIsSearching(true);

        // Use the router directly for better control of the URL
        router.visit(route('customers'), {
            data: value ? { search: value } : {},
            preserveState: true,
            replace: true,
            onFinish: () => setIsSearching(false),
        });
    };

    // Handle keyboard event for search input - allow Enter key to trigger search
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (searchTimeout) {
                clearTimeout(searchTimeout);
                setSearchTimeout(null);
            }
            performSearch(data.search);
        }
    };

    // Clear search function
    const clearSearch = () => {
        setData('search', '');

        // Clear search by removing the parameter completely from URL
        router.visit(route('customers'), {
            preserveState: true,
            replace: true,
            onFinish: () => setIsSearching(false),
        });
    };

    // Handle explicit search button click
    const handleSearchButtonClick = () => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
            setSearchTimeout(null);
        }
        performSearch(data.search);
    };

    // Format date for display
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (e) {
            console.error('Date parsing error:', e);
            return 'Invalid date';
        }
    };

    if (isLoading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Customers" />
                <div className="p-4">
                    <div className="flex h-64 items-center justify-center">
                        <p>Loading customers data...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Customers" />
                <div className="p-4">
                    <div className="flex h-64 items-center justify-center">
                        <p className="text-red-500">{error}</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (!customers || !customers.data) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Customers" />
                <div className="p-4">
                    <div className="flex h-64 items-center justify-center">
                        <p>No customer data available</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customers" />

            <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <HeadingSmall title="Customers" description="Manage your customer information" />
                    <a href={route('customers.create')}>
                        <Button>
                            <UserPlusIcon className="mr-2 h-4 w-4" />
                            Add Customer
                        </Button>
                    </a>
                </div>

                <div className="mb-4 flex gap-2">
                    <div className="relative max-w-sm flex-1">
                        <Input
                            placeholder="Search by name, email or phone..."
                            value={data.search}
                            onChange={handleSearch}
                            onKeyDown={handleKeyDown}
                            className="pr-10"
                            disabled={processing}
                        />
                        {data.search && (
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
                    <Button onClick={handleSearchButtonClick} disabled={processing} type="button">
                        {processing || isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SearchIcon className="mr-2 h-4 w-4" />}
                        Search
                    </Button>
                </div>

                <Card>
                    {(processing || isSearching) && (
                        <div className="flex items-center justify-center bg-gray-50 py-2 text-sm text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Searching...
                        </div>
                    )}

                    {data.search && !processing && !isSearching && customers.data.length > 0 && (
                        <div className="border-b bg-blue-50 px-4 py-2 text-sm dark:bg-blue-900/20">
                            <span className="font-medium">{customers.data.length}</span> {customers.data.length === 1 ? 'result' : 'results'} found
                            for "<span className="font-medium">{data.search}</span>"
                        </div>
                    )}

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Purchases</TableHead>
                                <TableHead>Total Spent</TableHead>
                                <TableHead>Last Purchase</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.data.length > 0 ? (
                                customers.data.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell className="font-medium">{customer.name}</TableCell>
                                        <TableCell>{customer.email}</TableCell>
                                        <TableCell>{customer.phone || 'N/A'}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-sm font-medium ${
                                                    customer.purchase_count > 10
                                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                                                        : customer.purchase_count > 5
                                                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                                }`}
                                            >
                                                {customer.purchase_count}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium ${
                                                    customer.total_spent > 2000
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                        : customer.total_spent > 1000
                                                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
                                                          : 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300'
                                                }`}
                                            >
                                                <DollarSign className="h-4 w-4" />
                                                {parseFloat(customer.total_spent.toString()).toFixed(2)}
                                            </span>
                                        </TableCell>
                                        <TableCell>{formatDate(customer.last_purchase)}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <a href={route('customers.show', customer.id)}>
                                                    <Button variant="ghost" size="icon" title="View customer">
                                                        <EyeIcon className="h-4 w-4" />
                                                    </Button>
                                                </a>
                                                <a href={route('customers.edit', customer.id)}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Edit customer"
                                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        <PencilIcon className="h-4 w-4" />
                                                    </Button>
                                                </a>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-8 text-center text-gray-500">
                                        No customers found. Try a different search or add a new customer.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {customers.meta && customers.meta.last_page > 1 ? (
                        <div className="border-t p-4">
                            <Pagination meta={customers.meta} />
                        </div>
                    ) : customers.data && customers.data.length > 0 ? (
                        <div className="border-t p-4 text-sm text-gray-500">Showing all {customers.data.length} results</div>
                    ) : null}
                </Card>
            </div>
        </AppLayout>
    );
}
