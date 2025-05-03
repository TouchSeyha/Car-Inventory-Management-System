import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { Loader2, SearchIcon, XIcon } from 'lucide-react';
import { Sale, SaleStatus } from '@/types/sale';
import { Pagination } from '@/components/pagination';

interface SalesFilters {
    search?: string;
    status?: SaleStatus | 'all';
}

interface Props {
    sales: {
        data: Sale[];
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
    filters: SalesFilters;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sales',
        href: '/sales',
    },
];

export default function Sales({ sales, filters }: Props) {
    const [status, setStatus] = useState(filters.status || 'all');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleStatusChange = (value: SaleStatus | 'all') => {
        setStatus(value);
        
        router.visit(route('sales'), {
            data: { 
                ...(searchTerm ? { search: searchTerm } : {}),
                ...(value !== 'all' ? { status: value } : {})
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

        router.visit(route('sales'), {
            data: { 
                search: value,
                ...(status !== 'all' ? { status } : {})
            },
            preserveState: true,
            replace: true,
            onFinish: () => setIsSearching(false),
        });
    };

    // Clear search function
    const clearSearch = () => {
        setSearchTerm('');

        router.visit(route('sales'), {
            data: status !== 'all' ? { status } : {},
            preserveState: true,
            replace: true,
            onFinish: () => setIsSearching(false),
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300';
            case 'Processing':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
            case 'Shipped':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
            case 'Cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    // Format date helper function
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch (e) {
            return (e as Error).message || 'Invalid date';
        }
    };

    // Format currency helper function
    const formatCurrency = (amount: number | string) => {
        const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(numericAmount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sales" />

            <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <HeadingSmall title="Sales Transactions" description="Manage your orders and sales" />
                    <a href={route('sales.create')}>
                        <Button>Create New Order</Button>
                    </a>
                </div>

                <div className="mb-4 flex flex-wrap gap-3">
                    <div className="relative max-w-xs flex-1">
                        <Input
                            placeholder="Search by order ID or customer..."
                            value={searchTerm}
                            onChange={handleSearch}
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
                    <Button onClick={() => performSearch(searchTerm)} type="button">
                        {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SearchIcon className="mr-2 h-4 w-4" />}
                        Search
                    </Button>
                    <Select value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Processing">Processing</SelectItem>
                            <SelectItem value="Shipped">Shipped</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sales.data.length > 0 ? (
                                sales.data.map((sale) => (
                                    <TableRow key={sale.id}>
                                        <TableCell className="font-medium">{sale.order_id}</TableCell>
                                        <TableCell>{sale.customer?.name || 'Unknown'}</TableCell>
                                        <TableCell>{formatDate(sale.created_at)}</TableCell>
                                        <TableCell>{sale.item_count}</TableCell>
                                        <TableCell>{formatCurrency(sale.total_amount)}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${getStatusColor(sale.status)}`}
                                            >
                                                {sale.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>{sale.payment_method}</TableCell>
                                        <TableCell>
                                                <a href={route('sales.show', sale.id)}>
                                                    <Button variant="ghost" size="sm">
                                                        Manage
                                                    </Button>
                                                </a>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-8 text-center text-gray-500">
                                        No sales found. Try a different search or create a new order.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {sales.meta && sales.meta.last_page > 1 ? (
                        <div className="border-t p-4">
                            <Pagination meta={sales.meta} />
                        </div>
                    ) : null}
                </Card>
            </div>
        </AppLayout>
    );
}
