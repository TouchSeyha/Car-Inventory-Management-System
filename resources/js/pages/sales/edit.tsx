import HeadingSmall from '@/components/heading-small';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Sale, SaleStatus } from '@/types/sale';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, ChevronLeftIcon, Loader2, SaveIcon } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';

interface Props {
    sale: Sale;
}

interface FormData {
    status: SaleStatus;
    notes: string;
}

export default function EditSale({ sale }: Props) {
    const { data, setData, patch, processing, errors } = useForm<FormData>({
        status: sale.status,
        notes: sale.notes || '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showSuccessTimeout, setShowSuccessTimeout] = useState<NodeJS.Timeout | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Sales',
            href: '/sales',
        },
        {
            title: `Order ${sale.order_id}`,
            href: `/sales/${sale.id}`,
        },
        {
            title: 'Edit',
            href: `/sales/${sale.id}/edit`,
        },
    ];

    // Clear success message after timeout
    useEffect(() => {
        return () => {
            if (showSuccessTimeout) clearTimeout(showSuccessTimeout);
        };
    }, [showSuccessTimeout]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);

        patch(route('sales.update', sale.id), {
            onSuccess: () => {
                setIsSuccess(true);

                // Show success message for 2 seconds, then redirect
                const timeoutId = setTimeout(() => {
                    window.location.href = route('sales.show', sale.id);
                }, 2000);

                setShowSuccessTimeout(timeoutId);
            },
            onError: (errors) => {
                if (Object.prototype.hasOwnProperty.call(errors, '_error')) {
                    setErrorMessage(errors._error as string);
                } else {
                    setErrorMessage('Please correct the errors below and try again.');
                }
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    }, [patch, sale.id, setShowSuccessTimeout]);

    const navigateBack = useCallback(() => {
        window.location.href = route('sales.show', sale.id);
    }, [sale.id]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Order ${sale.order_id}`} />

            <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <HeadingSmall title={`Edit Order ${sale.order_id}`} description="Update order status and notes" />
                    <a href={route('sales.show', sale.id)}>
                        <Button variant="outline">
                            <ChevronLeftIcon className="mr-2 h-4 w-4" />
                            Back to Order
                        </Button>
                    </a>
                </div>

                {isSuccess && (
                    <Alert className="mb-6 border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>Order was updated successfully. You will be redirected shortly.</AlertDescription>
                    </Alert>
                )}

                {errorMessage && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <Card className="mx-auto max-w-2xl">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-medium">Order Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Order ID</p>
                                            <p className="font-medium">{sale.order_id}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Customer</p>
                                            <p className="font-medium">{sale.customer?.name || 'Unknown'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Total Amount</p>
                                            <p className="font-medium">${sale.total_amount.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Items</p>
                                            <p className="font-medium">{sale.item_count}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-lg font-medium">Update Order Status</h3>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value as 'Processing' | 'Shipped' | 'Completed' | 'Cancelled')}
                                    >
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
                                    {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-lg font-medium">Notes</h3>
                                    <Textarea
                                        placeholder="Add notes about this order (optional)"
                                        className="min-h-20"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        disabled={processing || isSubmitting || isSuccess}
                                    />
                                    {errors.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={navigateBack}
                                        disabled={processing || isSubmitting || isSuccess}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing || isSubmitting || isSuccess} className="min-w-[120px]">
                                        {processing || isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : isSuccess ? (
                                            <>
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                Saved
                                            </>
                                        ) : (
                                            <>
                                                <SaveIcon className="mr-2 h-4 w-4" />
                                                Update Order
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
