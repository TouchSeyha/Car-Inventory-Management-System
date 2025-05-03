import HeadingSmall from '@/components/heading-small';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Customer } from '@/types/customer';
import { Inventory } from '@/types/inventory';
import { SaleFormData } from '@/types/sale';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, ChevronLeftIcon, Loader2, MinusCircle, PlusCircle, SaveIcon } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';

interface Props {
    customers: Customer[];
    inventory: Inventory[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sales',
        href: '/sales',
    },
    {
        title: 'Create Order',
        href: '/sales/create',
    },
];

export default function CreateSale({ customers, inventory }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<SaleFormData>({
        customer_id: 0,
        items: [{ inventory_id: 0, quantity: 1 }],
        payment_method: 'select', // Fixed: Changed from empty string to 'select'
        notes: '',
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [itemTotals, setItemTotals] = useState<number[]>([0]);
    const [orderTotal, setOrderTotal] = useState<number>(0);
    const [selectedItems, setSelectedItems] = useState<(Inventory | undefined)[]>([undefined]);

    // Calculate totals whenever items change
    useEffect(() => {
        const calculateTotals = () => {
            const newItemTotals: number[] = [];
            let newTotal = 0;
            const newSelectedItems: (Inventory | undefined)[] = [];

            data.items.forEach((item, index) => {
                const inventoryItem = inventory.find(i => i.id === item.inventory_id);
                if (inventoryItem) {
                    newSelectedItems[index] = inventoryItem;
                    const itemTotal = inventoryItem.price * item.quantity;
                    newItemTotals[index] = itemTotal;
                    newTotal += itemTotal;
                } else {
                    newItemTotals[index] = 0;
                    newSelectedItems[index] = undefined;
                }
            });

            setItemTotals(newItemTotals);
            setOrderTotal(newTotal);
            setSelectedItems(newSelectedItems);
        };

        calculateTotals();
    }, [data.items, inventory]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        // Validation
        if (data.customer_id === 0) {
            setErrorMessage('Please select a customer');
            return;
        }

        if (data.items.some(item => item.inventory_id === 0)) {
            setErrorMessage('Please select all inventory items');
            return;
        }

        // Updated to check for 'select' as well
        if (data.payment_method === 'select' || data.payment_method === '') {
            setErrorMessage('Please select a payment method');
            return;
        }

        post(route('sales.store'), {
            onSuccess: () => {
                reset();
            },
            onError: () => {
                // Error messages will be handled by the form errors
            },
        });
    };

    const addItemRow = useCallback(() => {
        setData('items', [...data.items, { inventory_id: 0, quantity: 1 }]);
    }, [data.items, setData]);

    const removeItemRow = useCallback((index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    }, [data.items, setData]);

    const handleItemChange = useCallback((index: number, field: 'inventory_id' | 'quantity', value: number) => {
        const newItems = [...data.items];
        newItems[index][field] = value;

        // If inventory_id changed, check if it's already selected in another row
        if (field === 'inventory_id' && value !== 0) {
            const isDuplicate = newItems.some(
                (item, i) => i !== index && item.inventory_id === value && value !== 0
            );

            if (isDuplicate) {
                setErrorMessage(`This item is already added to the order. Please adjust the quantity instead.`);
                return;
            } else {
                setErrorMessage(null);
            }

            // Set quantity to 1 when selecting a new item
            newItems[index].quantity = 1;
        }

        // Check stock when quantity changes
        if (field === 'quantity') {
            const inventoryItem = inventory.find(i => i.id === newItems[index].inventory_id);
            if (inventoryItem && value > inventoryItem.stock) {
                setErrorMessage(`Only ${inventoryItem.stock} units available for ${inventoryItem.name}`);
                newItems[index].quantity = inventoryItem.stock;
            } else {
                setErrorMessage(null);
            }
        }

        setData('items', newItems);
    }, [data.items, inventory, setData]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Sale" />

            <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <HeadingSmall title="Create New Order" description="Create a new sales order" />
                    <a href={route('sales')}>
                        <Button variant="outline">
                            <ChevronLeftIcon className="mr-2 h-4 w-4" />
                            Back to Sales
                        </Button>
                    </a>
                </div>

                {errorMessage && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* Customer Selection */}
                        <Card className="md:col-span-1">
                            <CardContent className="pt-6">
                                <h3 className="mb-4 text-lg font-semibold">Customer Details</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="customer_id">Select Customer</Label>
                                        <Select
                                            value={data.customer_id.toString()}
                                            onValueChange={(value) => setData('customer_id', parseInt(value))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a customer" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0">-- Select Customer --</SelectItem>
                                                {customers.map((customer) => (
                                                    <SelectItem key={customer.id} value={customer.id.toString()}>
                                                        {customer.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.customer_id && <p className="text-sm text-red-500">{errors.customer_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="payment_method">Payment Method</Label>
                                        <Select
                                            value={data.payment_method}
                                            onValueChange={(value) => setData('payment_method', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select payment method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="select">-- Select Payment Method --</SelectItem>
                                                <SelectItem value="Credit Card">Credit Card</SelectItem>
                                                <SelectItem value="Cash">Cash</SelectItem>
                                                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                                <SelectItem value="PayPal">PayPal</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.payment_method && <p className="text-sm text-red-500">{errors.payment_method}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Notes</Label>
                                        <Textarea
                                            id="notes"
                                            placeholder="Additional notes or instructions"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            rows={4}
                                        />
                                        {errors.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Items */}
                        <Card className="md:col-span-2">
                            <CardContent className="pt-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Order Items</h3>
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={addItemRow}
                                        disabled={data.items.some(item => item.inventory_id === 0)}
                                    >
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add Item
                                    </Button>
                                </div>

                                {data.items.map((item, index) => (
                                    <div key={index} className="mb-4 rounded-lg border p-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-medium">Item #{index + 1}</h4>
                                            {index > 0 && (
                                                <Button 
                                                    type="button"
                                                    variant="ghost" 
                                                    size="sm" 
                                                    onClick={() => removeItemRow(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <MinusCircle className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                        <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label htmlFor={`inventory_id_${index}`}>Vehicle</Label>
                                                <Select
                                                    value={item.inventory_id.toString()}
                                                    onValueChange={(value) => handleItemChange(index, 'inventory_id', parseInt(value))}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select vehicle" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="0">-- Select Vehicle --</SelectItem>
                                                        {inventory.map((inv) => (
                                                            <SelectItem 
                                                                key={inv.id} 
                                                                value={inv.id.toString()}
                                                                disabled={data.items.some((i, idx) => idx !== index && i.inventory_id === inv.id && inv.id !== 0)}
                                                            >
                                                                {inv.name} ({inv.stock} available)
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors[`items.${index}.inventory_id`] && (
                                                    <p className="text-sm text-red-500">{errors[`items.${index}.inventory_id`]}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`quantity_${index}`}>Quantity</Label>
                                                <Input
                                                    id={`quantity_${index}`}
                                                    type="number"
                                                    min={1}
                                                    max={selectedItems[index]?.stock || 1}
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                                    disabled={item.inventory_id === 0}
                                                />
                                                {errors[`items.${index}.quantity`] && (
                                                    <p className="text-sm text-red-500">{errors[`items.${index}.quantity`]}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Subtotal</Label>
                                                <div className="flex h-10 items-center rounded-md border border-input bg-background px-3 text-sm">
                                                    {selectedItems[index]?.price 
                                                        ? formatCurrency(itemTotals[index]) 
                                                        : '$0.00'}
                                                </div>
                                            </div>
                                        </div>
                                        {selectedItems[index] && selectedItems[index]?.price && (
                                            <div className="mt-2 text-sm text-gray-500">
                                                Unit price: {formatCurrency(selectedItems[index]?.price || 0)}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Order Summary */}
                                <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-lg font-medium">Order Total</h4>
                                        <div className="text-xl font-bold">{formatCurrency(orderTotal)}</div>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-500">
                                        Total items: {data.items.reduce((acc, item) => acc + item.quantity, 0)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">
                        <a href={route('sales')}>
                            <Button variant="outline" type="button">Cancel</Button>
                        </a>
                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <SaveIcon className="mr-2 h-4 w-4" />
                                    Create Order
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
