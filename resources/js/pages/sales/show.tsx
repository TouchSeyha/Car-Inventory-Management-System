import HeadingSmall from '@/components/heading-small';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Sale, SaleItem, SaleStatus } from '@/types/sale';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { CalendarIcon, CheckCircle2, ChevronLeftIcon, Loader2, ShoppingBagIcon, Truck, UserIcon } from 'lucide-react';
import { useState, useCallback } from 'react';

interface Props {
    sale: Sale;
}

export default function ShowSale({ sale }: Props) {
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [newStatus, setNewStatus] = useState<SaleStatus>(sale.status);
    const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Sales',
            href: '/sales',
        },
        {
            title: `Order ${sale.order_id}`,
            href: `/sales/${sale.id}`,
        },
    ];

    const getStatusColor = useCallback((status: string) => {
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
    }, []);

    // Format date helper function
    const formatDate = useCallback((dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (e) {
            return 'Invalid date';
        }
    }, []);

    // Format currency helper function
    const formatCurrency = useCallback((amount: number | string) => {
        const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(numericAmount);
    }, []);

    const handleStatusChange = useCallback((value: string) => {
        setNewStatus(value);
    }, []);

    const updateStatus = useCallback(() => {
        if (newStatus !== sale.status) {
            setIsUpdatingStatus(true);
            
            router.patch(route('sales.update-status', sale.id), { 
                status: newStatus 
            }, {
                onSuccess: () => {
                    setStatusUpdateSuccess(true);
                    setTimeout(() => setStatusUpdateSuccess(false), 3000);
                },
                onFinish: () => {
                    setIsUpdatingStatus(false);
                }
            });
        }
    }, [newStatus, sale.id, sale.status]);

    const handleDelete = useCallback(() => {
        setIsDeleting(true);
        
        router.delete(route('sales.destroy', sale.id), {
            onFinish: () => {
                setIsDeleting(false);
                setDeleteDialogOpen(false);
            }
        });
    }, [sale.id]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order ${sale.order_id}`} />

            <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <HeadingSmall 
                        title={`Order ${sale.order_id}`} 
                        description="View order details" 
                    />
                    <div className="flex gap-2">
                        <a href={route('sales')}>
                            <Button variant="outline">
                                <ChevronLeftIcon className="mr-2 h-4 w-4" />
                                Back to Sales
                            </Button>
                        </a>
                    </div>
                </div>

                {statusUpdateSuccess && (
                    <Alert className="mb-6 border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        <AlertDescription>
                            Order status successfully updated to {sale.status}.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Order Summary */}
                    <Card className="md:col-span-1">
                        <CardContent className="pt-6">
                            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Order ID</h4>
                                    <p className="text-base font-semibold">{sale.order_id}</p>
                                </div>
                                
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                                    <div className="flex items-center gap-2">
                                        <Badge className={getStatusColor(sale.status)}>
                                            {sale.status}
                                        </Badge>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Order Date</h4>
                                    <p className="flex items-center gap-2 text-base">
                                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                                        {formatDate(sale.created_at)}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Payment Method</h4>
                                    <p className="text-base">{sale.payment_method}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Total Amount</h4>
                                    <p className="text-2xl font-bold text-primary">
                                        {formatCurrency(sale.total_amount)}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Items</h4>
                                    <p className="flex items-center gap-2 text-base">
                                        <ShoppingBagIcon className="h-4 w-4 text-gray-400" />
                                        {sale.item_count} item{sale.item_count !== 1 ? 's' : ''}
                                    </p>
                                </div>

                                {sale.notes && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                                        <p className="text-base whitespace-pre-line">{sale.notes}</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 space-y-4 border-t pt-4">
                                <h4 className="text-sm font-medium text-gray-500">Update Status</h4>
                                <div className="flex items-center gap-2">
                                    <Select value={newStatus} onValueChange={handleStatusChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Processing">Processing</SelectItem>
                                            <SelectItem value="Shipped">Shipped</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button 
                                        onClick={updateStatus} 
                                        disabled={isUpdatingStatus || newStatus === sale.status}
                                        className="whitespace-nowrap"
                                    >
                                        {isUpdatingStatus ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            'Update Status'
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-6 border-t pt-6">
                                <Button 
                                    variant="destructive" 
                                    className="w-full" 
                                    onClick={() => setDeleteDialogOpen(true)}
                                >
                                    Delete Order
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer and Order Items */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Customer Information */}
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="text-xl font-semibold mb-4">Customer Information</h3>
                                
                                {sale.customer ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Name</h4>
                                            <p className="flex items-center gap-2 text-base">
                                                <UserIcon className="h-4 w-4 text-gray-400" />
                                                <a href={route('customers.show', sale.customer.id)} className="hover:underline text-blue-600">
                                                    {sale.customer.name}
                                                </a>
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Email</h4>
                                            <p className="text-base">
                                                <a href={`mailto:${sale.customer.email}`} className="hover:underline text-blue-600">
                                                    {sale.customer.email}
                                                </a>
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                                            <p className="text-base">{sale.customer.phone || 'N/A'}</p>
                                        </div>
                                        
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Purchase Count</h4>
                                            <p className="text-base">{sale.customer.purchase_count} orders</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Customer information not available</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Order Items */}
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="text-xl font-semibold mb-4">Order Items</h3>
                                
                                {sale.items && sale.items.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Vehicle</TableHead>
                                                <TableHead>Unit Price</TableHead>
                                                <TableHead>Quantity</TableHead>
                                                <TableHead>Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {sale.items.map((item: SaleItem) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">
                                                        {item.inventory ? (
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-10 w-10 rounded-md overflow-hidden">
                                                                    <img 
                                                                        src={item.inventory.imageurl} 
                                                                        alt={item.inventory.name}
                                                                        className="h-full w-full object-cover"
                                                                        onError={(e) => {
                                                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=Car';
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <a href={route('inventory.show', item.inventory.id)} className="hover:underline text-blue-600">
                                                                        {item.inventory.name}
                                                                    </a>
                                                                    <div className="text-xs text-gray-500">
                                                                        {item.inventory.make} {item.inventory.model} ({item.inventory.year})
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-500">Vehicle data not available</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                                                    <TableCell>{item.quantity}</TableCell>
                                                    <TableCell className="font-semibold">{formatCurrency(item.total_price)}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow className="bg-gray-50 dark:bg-gray-800">
                                                <TableCell colSpan={3} className="text-right font-semibold">
                                                    Total:
                                                </TableCell>
                                                <TableCell className="font-bold text-lg">
                                                    {formatCurrency(sale.total_amount)}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-gray-500">No items found for this order</p>
                                )}
                                
                                {sale.status === 'Shipped' && (
                                    <div className="mt-4 p-4 border rounded-md border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-2">
                                        <Truck className="h-5 w-5" />
                                        <span>This order has been shipped to the customer</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this order?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete order {sale.order_id} and all of its items.
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
                                'Delete Order'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
