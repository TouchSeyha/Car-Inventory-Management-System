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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customers',
        href: '/customers',
    },
    {
        title: 'Add Customer',
        href: '/customers/create',
    },
];

export default function CustomerCreate() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
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

        post(route('customers.store'), {
            onSuccess: () => {
                setIsSuccess(true);
                reset();

                // Show success message for 3 seconds, then redirect
                const timeoutId = setTimeout(() => {
                    window.location.href = route('customers');
                }, 3000);

                setShowSuccessTimeout(timeoutId);
            },
            onError: (errors) => {
                // Check if we have a general error message (not validation errors)
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
            <Head title="Add Customer" />

            <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <HeadingSmall title="Add New Customer" description="Create a new customer record" />
                    <a href={route('customers')}>
                        <Button variant="outline">
                            <ChevronLeftIcon className="mr-2 h-4 w-4" />
                            Back to Customers
                        </Button>
                    </a>
                </div>

                {isSuccess && (
                    <Alert className="mb-6 border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>Customer was created successfully. You will be redirected to the customers list shortly.</AlertDescription>
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
                                    disabled={processing || isSubmitting}
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
                                    disabled={processing || isSubmitting}
                                />
                                {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
                            </div>

                            <div className="space-y-2"></div>
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
                                disabled={processing || isSubmitting}
                            />
                            {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
                        </div>

                        <div className="flex justify-end pt-4"></div>
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => (window.location.href = route('customers'))}
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
                                        Save Customer
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
