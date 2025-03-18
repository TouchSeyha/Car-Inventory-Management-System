import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
// import { useState } from 'react';
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { salesDatas, customerData, categoryData } from './data/mockData';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const COLORS = ['#8884d8', '#82ca9d', '#FFBB28', '#FF8042', '#0088FE'];

export default function Dashboard() {
    // const [timeRange, setTimeRange] = useState('year');

    // Summary statistics
    const statistics = {
        totalSales: '$124,856',
        totalOrders: '1,245',
        averageOrder: '$98.50',
        customerRetention: '68%'
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
                        <p className="text-2xl font-bold mt-2">{statistics.totalSales}</p>
                        <div className="text-xs text-green-600 mt-1">↑ 12.5% from previous period</div>
                    </Card>
                    <Card className="p-4 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">Orders</h3>
                        <p className="text-2xl font-bold mt-2">{statistics.totalOrders}</p>
                        <div className="text-xs text-green-600 mt-1">↑ 8.2% from previous period</div>
                    </Card>
                    <Card className="p-4 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">Average Order</h3>
                        <p className="text-2xl font-bold mt-2">{statistics.averageOrder}</p>
                        <div className="text-xs text-green-600 mt-1">↑ 3.7% from previous period</div>
                    </Card>
                    <Card className="p-4 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">Customer Retention</h3>
                        <p className="text-2xl font-bold mt-2">{statistics.customerRetention}</p>
                        <div className="text-xs text-yellow-600 mt-1">↓ 2.1% from previous period</div>
                    </Card>
                </div>

                {/* Chart row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Line Chart */}
                    <Card className="p-4 shadow-sm">
                        <h3 className="text-md font-semibold mb-4">Monthly Revenue</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={salesDatas}
                                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Bar Chart */}
                    <Card className="p-4 shadow-sm">
                        <h3 className="text-md font-semibold mb-4">Customer Activity</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={customerData}
                                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="new" fill="#8884d8" name="New Customers" />
                                    <Bar dataKey="returning" fill="#82ca9d" name="Returning Customers" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Pie Chart */}
                    <Card className="p-4 shadow-sm">
                        <h3 className="text-md font-semibold mb-4">Sales by Category</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Area Chart (Full Width) */}
                <Card className="p-4 shadow-sm">
                    <h3 className="text-md font-semibold mb-4">Sales Performance Trend</h3>
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={salesDatas}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="sales" stackId="1" stroke="#8884d8" fill="#8884d8" name="Sales" />
                                <Area type="monotone" dataKey="revenue" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Revenue" />
                                <Area type="monotone" dataKey="profit" stackId="3" stroke="#ffc658" fill="#ffc658" name="Profit" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}