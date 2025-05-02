import HeadingSmall from '@/components/heading-small';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, ChevronLeftIcon, Loader2, SaveIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

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

export default function CustomerEdit({ customer }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Customers',
            href: '/customers',
        },
        {
            title: customer.name,
            href: `/customers/${customer.id}`,
        },
        {
            title: 'Edit',
            href: `/customers/${customer.id}/edit`,
        },
    ];

    const { data, setData, put, errors, processing } = useForm({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showSuccessTimeout, setShowSuccessTimeout] = useState<NodeJS.Timeout | null>(null);

    // Clear success message after timeout
    useEffect(() => {
        return () => {
            if (showSuccessTimeout) clearTimeout(showSuccessTimeout);
        };
    }, [showSuccessTimeout]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);

        put(route('customers.update', customer.id), {
            onSuccess: () => {
                setIsSuccess(true);

                // Show success message for 2 seconds, then redirect
                const timeoutId = setTimeout(() => {
                    window.location.href = route('customers.show', customer.id);
                }, 2000);

                setShowSuccessTimeout(timeoutId);
            },
            onError: (errors) => {
                if (Object.prototype.hasOwnProperty.call(errors, '_error')) {
                    setErrorMessage(errors._error);
                } else {
                    setErrorMessage('Please correct the errors below and try again.');
                }
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Customer: ${customer.name}`} />

            <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <HeadingSmall title={`Edit Customer: ${customer.name}`} description="Update customer information" />
                    <a href={route('customers.show', customer.id)}>
                        <Button variant="outline">
                            <ChevronLeftIcon className="mr-2 h-4 w-4" />
                            Back to Customer
                        </Button>
                    </a>
                </div>

                {isSuccess && (
                    <Alert className="mb-6 border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>Customer information was updated successfully. You will be redirected shortly.</AlertDescription>
                    </Alert>
                )}

                {errorMessage && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <Card className="mx-auto max-w-2xl p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className={errors.name ? 'text-destructive' : ''}>
                                    Full Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter customer name"
                                    className={errors.name ? 'border-destructive' : ''}
                                    disabled={processing || isSubmitting || isSuccess}
                                />
                                {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className={errors.email ? 'text-destructive' : ''}>
                                    Email Address <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Enter email address"
                                    className={errors.email ? 'border-destructive' : ''}
                                    disabled={processing || isSubmitting || isSuccess}
                                />
                                {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className={errors.phone ? 'text-destructive' : ''}>
                                    Phone Number
                                </Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="Enter phone number (optional)"
                                    className={errors.phone ? 'border-destructive' : ''}
                                    disabled={processing || isSubmitting || isSuccess}
                                />
                                {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
                            </div>

                            <div className="flex justify-end pt-4">
                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => (window.location.href = route('customers.show', customer.id))}
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
                                                Update Customer
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
