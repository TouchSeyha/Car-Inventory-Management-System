import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    BarChart3Icon,
    CalendarIcon,
    ChevronLeftIcon,
    DollarSignIcon,
    Loader2,
    MailIcon,
    PencilIcon,
    PhoneIcon,
    ShoppingBagIcon,
    TrashIcon,
} from 'lucide-react';
import { useState } from 'react';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    purchase_count: number;
    total_spent: number;
    last_purchase: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    customer: Customer;
}

export default function CustomerShow({ customer }: Props) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Customers',
            href: '/customers',
        },
        {
            title: customer.name,
            href: `/customers/${customer.id}`,
        },
    ];

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route('customers.destroy', customer.id), {
            onFinish: () => {
                setIsDeleting(false);
                setDeleteDialogOpen(false);
            },
        });
    };

    // Format date helper function
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (e) {
            console.error('Date parsing error:', e);
            return 'Invalid date';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Customer: ${customer.name}`} />

            <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <HeadingSmall title={customer.name} description="Customer Details" />

                    <div className="flex gap-2">
                        <Link href={route('customers')}>
                            <Button variant="outline">
                                <ChevronLeftIcon className="mr-2 h-4 w-4" />
                                Back to List
                            </Button>
                        </Link>
                        <Link href={route('customers.edit', customer.id)}>
                            <Button variant="outline">
                                <PencilIcon className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                            <TrashIcon className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Customer Info Card */}
                    <Card className="col-span-1 p-6 md:col-span-2">
                        <h2 className="mb-4 text-xl font-semibold">Customer Information</h2>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Name</h3>
                                    <p className="mt-1 text-base">{customer.name}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                    <p className="mt-1 flex items-center text-base">
                                        <MailIcon className="mr-2 h-4 w-4 text-gray-400" />
                                        <a href={`mailto:${customer.email}`} className="text-blue-600 hover:underline">
                                            {customer.email}
                                        </a>
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                                    <p className="mt-1 flex items-center text-base">
                                        <PhoneIcon className="mr-2 h-4 w-4 text-gray-400" />
                                        {customer.phone ? (
                                            <a href={`tel:${customer.phone}`} className="text-blue-600 hover:underline">
                                                {customer.phone}
                                            </a>
                                        ) : (
                                            <span className="text-gray-500">Not provided</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Customer Since</h3>
                                    <p className="mt-1 flex items-center text-base">
                                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                                        {formatDate(customer.created_at)}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                                    <p className="mt-1 flex items-center text-base">
                                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                                        {formatDate(customer.updated_at)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Purchase Stats Card */}
                    <Card className="col-span-1 p-6">
                        <h2 className="mb-4 text-xl font-semibold">Purchase Statistics</h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Total Purchases</h3>
                                <p className="mt-1 flex items-center text-2xl font-bold">
                                    <ShoppingBagIcon className="mr-2 h-5 w-5 text-purple-500" />
                                    {customer.purchase_count}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Total Spent</h3>
                                <p className="mt-1 flex items-center text-2xl font-bold">
                                    <DollarSignIcon className="mr-2 h-5 w-5 text-green-500" />$
                                    {parseFloat(customer.total_spent.toString()).toFixed(2)}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Average Purchase</h3>
                                <p className="mt-1 flex items-center text-2xl font-bold">
                                    <BarChart3Icon className="mr-2 h-5 w-5 text-blue-500" />$
                                    {customer.purchase_count
                                        ? (parseFloat(customer.total_spent.toString()) / customer.purchase_count).toFixed(2)
                                        : '0.00'}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Last Purchase</h3>
                                <p className="mt-1 flex items-center text-base">
                                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                                    {formatDate(customer.last_purchase)}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this customer?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the customer record and remove all associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <TrashIcon className="mr-2 h-4 w-4" />
                                    Delete Customer
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
