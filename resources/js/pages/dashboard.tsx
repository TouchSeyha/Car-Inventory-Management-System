import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ReportTimeRange } from '@/types/report';
import { Head, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface DashboardProps {
    dashboardData: {
        statistics: {
            totalSales: number;
            totalRevenue: number;
            totalProfit: number;
            averageOrderValue: number;
            customerRetention: number;
            bestSalesMonth: string;
            worstSalesMonth: string;
        };
        salesData: Array<{
            month: string;
            sales: number;
            revenue: number;
            profit: number;
        }>;
        categoryData: Array<{
            name: string;
            value: number;
        }>;
        customerData: Array<{
            name: string;
            new: number;
            returning: number;
        }>;
        timeRange: ReportTimeRange;
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const COLORS = ['#8884d8', '#82ca9d', '#FFBB28', '#FF8042', '#0088FE'];

export default function Dashboard({ dashboardData }: DashboardProps) {
    const [timeRange, setTimeRange] = useState<ReportTimeRange>(dashboardData.timeRange);

    // Format currency helper function
    const formatCurrency = useCallback((amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(amount);
    }, []);
    
    // Handle time range change
    const handleTimeRangeChange = (value: ReportTimeRange) => {
        setTimeRange(value);
        
        router.visit(route('dashboard'), {
            data: { timeRange: value },
            preserveState: true,
            replace: true,
        });
    };

    // Convert statistics to display format
    const statistics = {
        totalSales: dashboardData.statistics.totalSales,
        totalRevenue: formatCurrency(dashboardData.statistics.totalRevenue),
        totalProfit: formatCurrency(dashboardData.statistics.totalProfit),
        bestSalesMonth: dashboardData.statistics.bestSalesMonth,
        worstSalesMonth: dashboardData.statistics.worstSalesMonth,
        averageOrderValue: formatCurrency(dashboardData.statistics.averageOrderValue),
        customerRetention: `${dashboardData.statistics.customerRetention.toFixed(2)}%`,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Time range selection */}
                <div className="flex justify-end mb-2">
                    <Select value={timeRange} onValueChange={handleTimeRangeChange}>
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

                {/* Stats cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="p-4 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
                        <p className="mt-2 text-2xl font-bold">{statistics.totalSales}</p>
                        <div className="mt-1 text-xs text-green-600">Best month: {statistics.bestSalesMonth}</div>
                    </Card>
                    <Card className="p-4 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
                        <p className="mt-2 text-2xl font-bold">{statistics.totalRevenue}</p>
                        <div className="mt-1 text-xs text-green-600">Profit: {statistics.totalProfit}</div>
                    </Card>
                    <Card className="p-4 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">Average Order</h3>
                        <p className="mt-2 text-2xl font-bold">{statistics.averageOrderValue}</p>
                        <div className="mt-1 text-xs text-yellow-600">Worst month: {statistics.worstSalesMonth}</div>
                    </Card>
                    <Card className="p-4 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">Customer Retention</h3>
                        <p className="mt-2 text-2xl font-bold">{statistics.customerRetention}</p>
                        <div className="mt-1 text-xs text-blue-600">Of total customer base</div>
                    </Card>
                </div>

                {/* Chart row */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Line Chart */}
                    <Card className="p-4 shadow-sm">
                        <h3 className="text-md mb-4 font-semibold">Monthly Revenue</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dashboardData.salesData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                                    <Legend />
                                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Bar Chart */}
                    <Card className="p-4 shadow-sm">
                        <h3 className="text-md mb-4 font-semibold">Customer Activity</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dashboardData.customerData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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
                        <h3 className="text-md mb-4 font-semibold">Sales by Category</h3>
                        <div className="h-72">
                            {dashboardData.categoryData && dashboardData.categoryData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={dashboardData.categoryData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            nameKey="name"
                                            label={({ name, percent }) => 
                                                `${name}: ${(percent * 100).toFixed(0)}%`
                                            }
                                        >
                                            {dashboardData.categoryData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={COLORS[index % COLORS.length]} 
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [`${value} units`, 'Quantity']} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <p className="text-gray-500">No category data available</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Area Chart (Full Width) */}
                <Card className="p-4 shadow-sm">
                    <h3 className="text-md mb-4 font-semibold">Sales Performance Trend</h3>
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dashboardData.salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
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
