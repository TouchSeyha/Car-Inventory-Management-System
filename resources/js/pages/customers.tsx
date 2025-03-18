import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { sampleCustomers } from './data/mockData';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, EyeIcon, PencilIcon, UserPlusIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Customers',
    href: '/customers',
  },
];

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = searchTerm
    ? sampleCustomers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
    : sampleCustomers;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Customers" />

      <div className="p-4">
        <div className="mb-6 flex justify-between items-center">
          <HeadingSmall title="Customers" description="Manage your customer information" />
          <Button>
            <UserPlusIcon className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>

        <div className="mb-4">
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Purchases</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Purchase</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-sm font-medium
                      ${customer.purchaseCount > 10
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                        : customer.purchaseCount > 5
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}
                    >
                      {customer.purchaseCount}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium
                      ${customer.totalSpent > 2000
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : customer.totalSpent > 1000
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
                          : 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300'}`}
                    >
                      <DollarSign className="h-4 w-4" />
                      {customer.totalSpent.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>{customer.lastPurchase}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" title="View customer">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Edit customer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        <PencilIcon className="h-4 w-4" />
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