<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Customer;
use App\Models\Inventory;
use App\Models\SaleItem;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with real data.
     */
    public function index(Request $request)
    {
        // Get time range (default: year)
        $timeRange = $request->input('timeRange', 'year');
        
        // Determine date range based on selected timeRange
        $endDate = now();
        $startDate = match($timeRange) {
            'week' => now()->subWeek(),
            'month' => now()->subMonth(),
            'quarter' => now()->subMonths(3),
            'year' => now()->subYear(),
            default => now()->subYear(),
        };
        
        // Get dashboard statistics
        $statistics = $this->getDashboardStatistics($startDate, $endDate);
        
        // Get sales data for charts
        $salesData = $this->getSalesChartData($startDate, $endDate);
        
        // Get category data for pie chart
        $categoryData = $this->getCategoryData($startDate, $endDate);
        
        // Get customer data for bar chart
        $customerData = $this->getCustomerData($startDate, $endDate);
        
        return Inertia::render('dashboard', [
            'dashboardData' => [
                'statistics' => $statistics,
                'salesData' => $salesData,
                'categoryData' => $categoryData,
                'customerData' => $customerData,
                'timeRange' => $timeRange,
            ]
        ]);
    }
    
    /**
     * Get overall dashboard statistics
     */
    private function getDashboardStatistics(Carbon $startDate, Carbon $endDate)
    {
        // Get total sales count
        $totalSales = Sale::whereBetween('created_at', [$startDate, $endDate])->count();
        
        // Get total revenue
        $totalRevenue = Sale::whereBetween('created_at', [$startDate, $endDate])->sum('total_amount');
        
        // Calculate average order value
        $averageOrderValue = $totalSales > 0 ? $totalRevenue / $totalSales : 0;
        
        // Calculate total profit (assuming 15% profit margin)
        $totalProfit = $totalRevenue * 0.15;
        
        // Get customer retention rate
        $totalCustomers = Customer::count();
        $returningCustomers = Sale::whereBetween('created_at', [$startDate, $endDate])
            ->distinct('customer_id')
            ->count('customer_id');
        $customerRetention = $totalCustomers > 0 ? ($returningCustomers / $totalCustomers) * 100 : 0;
        
        // Get best and worst sales months
        $monthlySales = Sale::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE_FORMAT(created_at, "%b") as month, COUNT(*) as sales')
            ->groupBy('month')
            ->orderBy('sales', 'desc')
            ->get();
            
        $bestSalesMonth = $monthlySales->first()->month ?? 'N/A';
        $worstSalesMonth = $monthlySales->last()->month ?? 'N/A';
        
        return [
            'totalSales' => $totalSales,
            'totalRevenue' => $totalRevenue,
            'totalProfit' => $totalProfit,
            'averageOrderValue' => $averageOrderValue,
            'customerRetention' => $customerRetention,
            'bestSalesMonth' => $bestSalesMonth,
            'worstSalesMonth' => $worstSalesMonth,
        ];
    }
    
    /**
     * Get sales data for charts
     */
    private function getSalesChartData(Carbon $startDate, Carbon $endDate)
    {
        return Sale::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE_FORMAT(created_at, "%b") as month, COUNT(*) as sales, SUM(total_amount) as revenue')
            ->groupBy('month')
            ->orderBy('created_at')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'sales' => $item->sales,
                    'revenue' => $item->revenue,
                    'profit' => $item->revenue * 0.15, // Estimated profit margin
                ];
            });
    }
    
    /**
     * Get category data for pie chart
     */
    private function getCategoryData(Carbon $startDate, Carbon $endDate)
    {
        return SaleItem::join('inventory', 'sale_items.inventory_id', '=', 'inventory.id')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->whereBetween('sales.created_at', [$startDate, $endDate])
            ->selectRaw('inventory.category as name, SUM(sale_items.quantity) as value')
            ->groupBy('inventory.category')
            ->orderByDesc('value')
            ->get();
    }
    
    /**
     * Get customer data for bar chart
     */
    private function getCustomerData(Carbon $startDate, Carbon $endDate)
    {
        $customerData = [];
        $weeks = $startDate->diffInWeeks($endDate) + 1;
        
        for ($i = 0; $i < min($weeks, 4); $i++) {
            $weekStart = (clone $startDate)->addWeeks($i);
            $weekEnd = (clone $weekStart)->addWeek();
            
            $newCustomers = Customer::whereBetween('created_at', [$weekStart, $weekEnd])->count();
            
            $returningCustomers = Sale::whereBetween('created_at', [$weekStart, $weekEnd])
                ->whereHas('customer', function($query) use ($weekStart) {
                    $query->where('created_at', '<', $weekStart);
                })
                ->distinct('customer_id')
                ->count('customer_id');
                
            $customerData[] = [
                'name' => "Week " . ($i + 1),
                'new' => $newCustomers,
                'returning' => $returningCustomers,
            ];
        }
        
        return $customerData;
    }
}
