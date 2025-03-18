import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import HeadingSmall from '@/components/heading-small';
import { Customer } from '@/types/customer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

// Sample data
const sampleCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+855 12 345 678',
    address: 'Phnom Penh, Cambodia',
    purchaseCount: 5,
    totalSpent: 1250,
    lastPurchase: '2023-06-15'
  },
  {
    id: '2',
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    phone: '+855 12 876 543',
    address: 'Siem Reap, Cambodia',
    purchaseCount: 3,
    totalSpent: 780,
    lastPurchase: '2023-07-22'
  },
  {
    id: '3',
    name: 'David Chen',
    email: 'david@example.com',
    phone: '+855 11 222 333',
    address: 'Battambang, Cambodia',
    purchaseCount: 8,
    totalSpent: 2340,
    lastPurchase: '2023-08-05'
  }
];

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
          <Button>Add Customer</Button>
        </div>

        <div className="mb-4">
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="overflow-x-auto rounded-lg border bg-white shadow">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Purchases</th>
                <th className="px-6 py-3">Total Spent</th>
                <th className="px-6 py-3">Last Purchase</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{customer.name}</td>
                  <td className="px-6 py-4">{customer.email}</td>
                  <td className="px-6 py-4">{customer.phone}</td>
                  <td className="px-6 py-4">{customer.purchaseCount}</td>
                  <td className="px-6 py-4">${customer.totalSpent.toFixed(2)}</td>
                  <td className="px-6 py-4">{customer.lastPurchase}</td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" className="mr-1">View</Button>
                    <Button variant="ghost" size="sm" className="text-blue-600">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}