import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Loader2, TrashIcon } from 'lucide-react';
import { useState } from 'react';

interface Inventory {
    id: number;
    name: string;
    category: string;
    year: number;
    make: string;
    model: string;
    stock: number;
    price: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    imageurl: string;
    description?: string;
}

interface Props {
    inventory: Inventory;
}

const breadcrumbs = [
    {
        title: 'Inventory',
        href: '/inventory',
    },
    {
        title: 'Edit Vehicle',
        href: '#',
    },
];

export default function EditInventory({ inventory }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    
    const { data, setData, errors, put, processing } = useForm({
        name: inventory.name || '',
        category: inventory.category || '',
        year: inventory.year || 'N/A',
        make: inventory.make || '',
        model: inventory.model || '',
        stock: inventory.stock || 0,
        price: inventory.price || '',
        imageurl: inventory.imageurl || '',
        description: inventory.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('inventory.update', inventory.id), {
            onSuccess: () => {
              
            },
        });
    };

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route('inventory.destroy', inventory.id), {
            onFinish: () => {
                setIsDeleting(false);
                setDeleteDialogOpen(false);
            },
            onError: () => {
                setIsDeleting(false);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${inventory.name}`} />

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this vehicle?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the vehicle "{inventory.name}" and remove all associated data.
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
                                    Delete Vehicle
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <HeadingSmall title={`Edit ${inventory.name}`} description="Update vehicle information" />
                    <Button 
                        variant="destructive" 
                        onClick={() => setDeleteDialogOpen(true)} 
                        disabled={isDeleting}
                    >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Delete Vehicle
                    </Button>
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
                                    />
                                    {errors.make && <p className="text-sm text-red-500">{errors.make}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="model">Model</Label>
                                    <Input
                                        id="model"
                                        value={data.model}
                                        onChange={(e) => setData('model', e.target.value)}
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
                                    />
                                    {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="imageurl">Image URL</Label>
                                    <Input
                                        id="imageurl"
                                        value={data.imageurl}
                                        onChange={(e) => setData('imageurl', e.target.value)}
                                    />
                                    {errors.imageurl && <p className="text-sm text-red-500">{errors.imageurl}</p>}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={4}
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>
                            </div>

                            {/* Image preview */}
                            {data.imageurl && (
                                <div className="mt-6">
                                    <Label>Image Preview</Label>
                                    <div className="mt-2 h-48 w-full overflow-hidden rounded-md bg-gray-100">
                                        <img 
                                            src={data.imageurl} 
                                            alt={data.name} 
                                            className="h-full w-full object-cover" 
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://via.placeholder.com/640x480?text=Image+Not+Found';
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

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
                                        'Update Vehicle'
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
