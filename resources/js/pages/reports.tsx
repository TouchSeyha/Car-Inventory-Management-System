import HeadingSmall from '@/components/heading-small';
import PlaceholderPattern from '@/components/placeholder-pattern';
import ExportDialog, { ExportFormat } from '@/components/export-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { 
    Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, 
    Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis 
} from 'recharts';
import { ReportTimeRange, SalesReportData } from '@/types/report';
import { Download } from 'lucide-react';
import { exportToPdf, exportToWord, exportToExcel, exportToCsv } from '@/utils/export-utils';

interface Props {
    reportData: SalesReportData;
    timeRange: ReportTimeRange;
    changes: Record<string, number>;
    periodRange: {
        start: string;
        end: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: '/reports',
    },
];

// Chart colors
const COLORS = ['#8884d8', '#82ca9d', '#FFBB28', '#FF8042', '#0088FE'];

export default function Reports({ reportData, timeRange, changes, periodRange }: Props) {
    const [selectedTimeRange, setSelectedTimeRange] = useState<ReportTimeRange>(timeRange);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Format currency helper function
    const formatCurrency = useCallback((amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(amount);
    }, []);

    // Change indicator helper function
    const getChangeIndicator = useCallback((change: number) => {
        if (change > 0) return <span className="text-green-600">↑ {change}%</span>;
        if (change < 0) return <span className="text-red-600">↓ {Math.abs(change)}%</span>;
        return <span className="text-gray-500">0%</span>;
    }, []);

    // Handle time range change
    const handleTimeRangeChange = (value: ReportTimeRange) => {
        setSelectedTimeRange(value);
        
        router.visit(route('reports'), {
            data: { timeRange: value },
            preserveState: true,
            replace: true,
        });
    };

    // Handle save report
    const handleSaveReport = () => {
        setExportDialogOpen(true);
    };

    // Handle export
    const handleExport = async (format: ExportFormat) => {
        try {
            setIsExporting(true);
            const reportTitle = `Sales Report ${periodRange.start} to ${periodRange.end}`;
            
            switch (format) {
                case 'pdf':
                    await exportToPdf(reportData, reportTitle, periodRange);
                    break;
                case 'excel':
                    await exportToExcel(reportData, reportTitle, periodRange);
                    break;
                case 'csv':
                    exportToCsv(reportData, reportTitle, periodRange);
                    break;
            }
            
            setExportDialogOpen(false);
        } catch (error) {
            console.error('Error exporting report:', error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />

            <div className="p-4">
                <div className="mb-6 flex items-center justify-between">
                    <HeadingSmall 
                        title="Reports & Analytics" 
                        description={`Data from ${periodRange.start} to ${periodRange.end}`}
                    />
                    <div className="flex gap-4">
                        <Select value={selectedTimeRange} onValueChange={handleTimeRangeChange}>
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
                        <Button onClick={handleSaveReport}>
                            <Download className="mr-2 h-4 w-4" />
                            Export Report
                        </Button>
                    </div>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="p-4">
                        <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
                        <p className="mt-2 text-2xl font-bold">{reportData.summary.totalSales}</p>
                        <div className="mt-1 text-xs">
                            {getChangeIndicator(changes.totalSales)} from previous period
                        </div>
                    </Card>
                    <Card className="p-4">
                        <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                        <p className="mt-2 text-2xl font-bold">
                            {formatCurrency(reportData.summary.totalRevenue)}
                        </p>
                        <div className="mt-1 text-xs">
                            {getChangeIndicator(changes.totalRevenue)} from previous period
                        </div>
                    </Card>
                    <Card className="p-4">
                        <h3 className="text-sm font-medium text-gray-500">Average Order Value</h3>
                        <p className="mt-2 text-2xl font-bold">
                            {formatCurrency(reportData.summary.averageOrder)}
                        </p>
                        <div className="mt-1 text-xs">
                            {getChangeIndicator(changes.averageOrder)} from previous period
                        </div>
                    </Card>
                    <Card className="p-4">
                        <h3 className="text-sm font-medium text-gray-500">Top Selling Product</h3>
                        <p className="mt-2 text-2xl font-bold">{reportData.summary.topSellingProduct}</p>
                        <div className="mt-1 text-xs text-gray-500">
                            {reportData.topProducts[0]?.quantity || 0} units sold
                        </div>
                    </Card>
                    <Card className="p-4">
                        <h3 className="text-sm font-medium text-gray-500">Customer Retention Rate</h3>
                        <p className="mt-2 text-2xl font-bold">{reportData.summary.customerRetentionRate}%</p>
                        <div className="mt-1 text-xs">
                            {getChangeIndicator(changes.customerRetentionRate)} from previous period
                        </div>
                    </Card>
                    <Card className="p-4">
                        <h3 className="text-sm font-medium text-gray-500">Total Inventory Value</h3>
                        <p className="mt-2 text-2xl font-bold">
                            {formatCurrency(reportData.summary.inventoryValue)}
                        </p>
                        <div className="mt-1 text-xs text-gray-500">Based on current stock levels</div>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card className="p-4">
                        <h3 className="text-md mb-4 font-semibold">Sales Trend</h3>
                        {reportData.monthlySales.length > 0 ? (
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={reportData.monthlySales} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                                        <Legend />
                                        <Area 
                                            type="monotone" 
                                            dataKey="revenue" 
                                            stroke="#8884d8" 
                                            fill="#8884d8" 
                                            name="Revenue" 
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="profit" 
                                            stroke="#82ca9d" 
                                            fill="#82ca9d" 
                                            name="Profit" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-lg border">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-gray-500">No sales data available for this period</p>
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card className="p-4">
                        <h3 className="text-md mb-4 font-semibold">Sales by Category</h3>
                        {reportData.salesByCategory.length > 0 ? (
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={reportData.salesByCategory}
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
                                            {reportData.salesByCategory.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={COLORS[index % COLORS.length]} 
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            formatter={(value, name, props) => [
                                                `${value} units (${formatCurrency(props.payload.amount)})`, 
                                                name
                                            ]} 
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-lg border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-gray-500">No category data available for this period</p>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card className="p-4">
                        <h3 className="text-md mb-4 font-semibold">Top Selling Products</h3>
                        {reportData.topProducts.length > 0 ? (
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={reportData.topProducts}
                                        layout="vertical"
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis 
                                            type="category" 
                                            dataKey="name" 
                                            width={150}
                                            tick={{ fontSize: 12 }}
                                        />
                                        <Tooltip formatter={(value) => [`${value} units`, 'Quantity']} />
                                        <Legend />
                                        <Bar 
                                            dataKey="quantity" 
                                            fill="#8884d8" 
                                            name="Units Sold" 
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-lg border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-gray-500">No product data available for this period</p>
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card className="p-4">
                        <h3 className="text-md mb-4 font-semibold">Customer Activity</h3>
                        {reportData.customerData.length > 0 ? (
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={reportData.customerData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar 
                                            dataKey="new" 
                                            name="New Customers" 
                                            fill="#8884d8" 
                                        />
                                        <Bar 
                                            dataKey="returning" 
                                            name="Returning Customers" 
                                            fill="#82ca9d" 
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-lg border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-gray-500">No customer activity data available</p>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Export Dialog */}
            <ExportDialog 
                open={exportDialogOpen}
                onOpenChange={setExportDialogOpen}
                onExport={handleExport}
                isExporting={isExporting}
            />
        </AppLayout>
    );
}
