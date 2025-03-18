import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

// Sample sales data
const salesData = [
  {
    id: 'ORD-2023-001',
    customer: 'John Doe',
    date: '2023-08-15',
    items: 3,
    total: 349.97,
    status: 'Completed',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ORD-2023-002',
    customer: 'Sarah Smith',
    date: '2023-08-14',
    items: 1,
    total: 899.99,
    status: 'Completed',
    paymentMethod: 'PayPal'
  },
  {
    id: 'ORD-2023-003',
    customer: 'Mike Johnson',
    date: '2023-08-14',
    items: 5,
    total: 124.95,
    status: 'Processing',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ORD-2023-004',
    customer: 'Lisa Wong',
    date: '2023-08-13',
    items: 2,
    total: 199.98,
    status: 'Shipped',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'ORD-2023-005',
    customer: 'David Chen',
    date: '2023-08-10',
    items: 4,
    total: 459.96,
    status: 'Completed',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ORD-2023-006',
    customer: 'Emma Wilson',
    date: '2023-08-09',
    items: 1,
    total: 29.99,
    status: 'Cancelled',
    paymentMethod: 'PayPal'
  }
];

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Sales',
    href: '/sales',
  },
];

export default function Sales() {
  const [status, setStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSales = salesData.filter(sale =>
    (status === 'all' || sale.status === status) &&
    (searchTerm === '' ||
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Sales" />

      <div className="p-4">
        <div className="mb-6 flex justify-between items-center">
          <HeadingSmall title="Sales Transactions" description="Manage your orders and sales" />
          <Button>Create New Order</Button>
        </div>

        <div className="mb-4 flex flex-wrap gap-3">
          <Input
            placeholder="Search by order ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.items}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${sale.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(sale.status)}`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.paymentMethod}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900">View</Button>
                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-900 ml-2">Manage</Button>
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