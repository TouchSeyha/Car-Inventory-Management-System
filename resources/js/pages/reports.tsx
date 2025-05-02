import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import HeadingSmall from '@/components/heading-small';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import PlaceholderPattern from '@/components/placeholder-pattern';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Reports',
    href: '/reports',
  },
];

export default function Reports() {
  const [timeRange, setTimeRange] = useState('month');

  // Sample statistics
  const statistics = {
    totalSales: '$24,680.55',
    ordersCompleted: '387',
    averageOrder: '$63.77',
    topSellingProduct: 'Tesla Model 3',
    customerRetentionRate: '68%',
    inventoryValue: '$105,240.00'
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Reports" />

      <div className="p-4">
        <div className="mb-6 flex justify-between items-center">
          <HeadingSmall title="Reports & Analytics" description="View your business performance metrics" />
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
            <p className="text-2xl font-bold mt-2">{statistics.totalSales}</p>
            <div className="text-xs text-green-600 mt-1">↑ 12.5% from previous period</div>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Orders Completed</h3>
            <p className="text-2xl font-bold mt-2">{statistics.ordersCompleted}</p>
            <div className="text-xs text-green-600 mt-1">↑ 8.2% from previous period</div>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Average Order Value</h3>
            <p className="text-2xl font-bold mt-2">{statistics.averageOrder}</p>
            <div className="text-xs text-green-600 mt-1">↑ 3.7% from previous period</div>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Top Selling Product</h3>
            <p className="text-2xl font-bold mt-2">{statistics.topSellingProduct}</p>
            <div className="text-xs text-gray-500 mt-1">42 units sold</div>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Customer Retention Rate</h3>
            <p className="text-2xl font-bold mt-2">{statistics.customerRetentionRate}</p>
            <div className="text-xs text-yellow-600 mt-1">↓ 2.1% from previous period</div>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Inventory Value</h3>
            <p className="text-2xl font-bold mt-2">{statistics.inventoryValue}</p>
            <div className="text-xs text-gray-500 mt-1">Based on current stock levels</div>
          </Card>
        </div>

        {/* Placeholder Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4">
            <h3 className="text-md font-semibold mb-4">Sales Trend</h3>
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-lg border">
              <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-md font-semibold mb-4">Product Categories</h3>
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-lg border">
              <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}