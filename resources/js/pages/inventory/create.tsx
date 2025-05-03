import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const breadcrumbs = [
    {
        title: 'Inventory',
        href: '/inventory',
    },
    {
        title: 'Add Vehicle',
        href: '/inventory/create',
    },
];

export default function CreateInventory() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category: '',
        year: new Date().getFullYear(),
        make: '',
        model: '',
        stock: 1,
        price: '',
        imageurl: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('inventory.store'), {
            onSuccess: () => {
                // Form will be reset automatically on successful submission and redirect
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Vehicle" />

            <div className="p-4">
                <div className="mb-6">
                    <HeadingSmall title="Add New Vehicle" description="Add a new vehicle to inventory" />
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Vehicle Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. Toyota Camry XLE"
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Sedan">Sedan</SelectItem>
                                            <SelectItem value="SUV">SUV</SelectItem>
                                            <SelectItem value="Truck">Truck</SelectItem>
                                            <SelectItem value="Luxury">Luxury</SelectItem>
                                            <SelectItem value="Electric">Electric</SelectItem>
                                            <SelectItem value="Sports">Sports Car</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="make">Make</Label>
                                    <Input
                                        id="make"
                                        value={data.make}
                                        onChange={(e) => setData('make', e.target.value)}
                                        placeholder="e.g. Toyota"
                                    />
                                    {errors.make && <p className="text-sm text-red-500">{errors.make}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="model">Model</Label>
                                    <Input
                                        id="model"
                                        value={data.model}
                                        onChange={(e) => setData('model', e.target.value)}
                                        placeholder="e.g. Camry XLE"
                                    />
                                    {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="year">Year</Label>
                                    <Input
                                        id="year"
                                        type="number"
                                        min={1900}
                                        max={2100}
                                        value={data.year}
                                        onChange={(e) => setData('year', parseInt(e.target.value) || new Date().getFullYear())}
                                    />
                                    {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        min={0}
                                        value={data.stock}
                                        onChange={(e) => setData('stock', parseInt(e.target.value) || 0)}
                                    />
                                    {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price">Price ($)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min={0}
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="0.00"
                                    />
                                    {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="imageurl">Image URL</Label>
                                    <Input
                                        id="imageurl"
                                        value={data.imageurl}
                                        onChange={(e) => setData('imageurl', e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    {errors.imageurl && <p className="text-sm text-red-500">{errors.imageurl}</p>}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Enter vehicle description..."
                                        rows={4}
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-end space-x-4">
                                <Link href={route('inventory')}>
                                    <Button variant="outline" type="button">Cancel</Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Add Vehicle'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
