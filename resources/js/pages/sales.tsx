import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { salesData } from './data/mockData';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sales',
        href: '/sales',
    },
];

export default function Sales() {
    const [status, setStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSales = salesData.filter(
        (sale) =>
            (status === 'all' || sale.status === status) &&
            (searchTerm === '' ||
                sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sale.customer.toLowerCase().includes(searchTerm.toLowerCase())),
    );

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sales" />

            <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <HeadingSmall title="Sales Transactions" description="Manage your orders and sales" />
                    <Button>Create New Order</Button>
                </div>

                <div className="mb-4 flex flex-wrap gap-3">
                    <Input
                        placeholder="Search by order ID or customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-xs"
                    />
                    <Select value={status} onValueChange={setStatus}>
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
                            {filteredSales.map((sale) => (
                                <TableRow key={sale.id}>
                                    <TableCell className="font-medium">{sale.id}</TableCell>
                                    <TableCell>{sale.customer}</TableCell>
                                    <TableCell>{sale.date}</TableCell>
                                    <TableCell>{sale.items}</TableCell>
                                    <TableCell>${sale.total.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${getStatusColor(sale.status)}`}
                                        >
                                            {sale.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{sale.paymentMethod}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="sm">
                                                View
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                Manage
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </AppLayout>
    );
}
