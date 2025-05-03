<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Customer;
use App\Models\Inventory;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportsController extends Controller
{
    /**
     * Display the reports dashboard.
     */
    public function index(Request $request)
    {
        $timeRange = $request->input('timeRange', 'month');
        
        // Determine date range based on selected timeRange
        $endDate = now();
        $startDate = match($timeRange) {
            'week' => now()->subWeek(),
            'month' => now()->subMonth(),
            'quarter' => now()->subMonths(3),
            'year' => now()->subYear(),
            default => now()->subMonth(),
        };
        
        // Generate fresh report data
        $reportData = $this->generateReportData($startDate, $endDate);
        
        // Get previous period data for comparison
        $previousEndDate = clone $startDate;
        $previousStartDate = match($timeRange) {
            'week' => (clone $startDate)->subWeek(),
            'month' => (clone $startDate)->subMonth(),
            'quarter' => (clone $startDate)->subMonths(3),
            'year' => (clone $startDate)->subYear(),
            default => (clone $startDate)->subMonth(),
        };
        
        $previousReportData = $this->generateReportData($previousStartDate, $previousEndDate);
        
        // Calculate changes for comparison
        $changes = $this->calculateChanges($reportData['summary'], $previousReportData['summary']);
        
        return Inertia::render('reports', [
            'reportData' => $reportData,
            'timeRange' => $timeRange,
            'changes' => $changes,
            'periodRange' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d'),
            ],
        ]);
    }
    
    /**
     * Generate report data for the given period
     */
    private function generateReportData(Carbon $startDate, Carbon $endDate)
    {
        // Get sales within date range
        $sales = Sale::whereBetween('created_at', [$startDate, $endDate])
            ->with(['items.inventory', 'customer'])
            ->get();
            
        // Calculate summary statistics
        $totalSales = $sales->count();
        $totalAmount = $sales->sum('total_amount');
        $averageOrder = $totalSales > 0 ? $totalAmount / $totalSales : 0;
        
        // Get top selling products
        $topProducts = SaleItem::join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->whereBetween('sales.created_at', [$startDate, $endDate])
            ->selectRaw('inventory_id, SUM(quantity) as total_quantity, SUM(total_price) as total_amount')
            ->groupBy('inventory_id')
            ->orderByDesc('total_quantity')
            ->limit(5)
            ->with('inventory')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->inventory_id,
                    'name' => $item->inventory->name ?? 'Unknown',
                    'quantity' => $item->total_quantity,
                    'total' => $item->total_amount,
                ];
            });
            
        // Get sales by category
        $salesByCategory = SaleItem::join('inventory', 'sale_items.inventory_id', '=', 'inventory.id')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->whereBetween('sales.created_at', [$startDate, $endDate])
            ->selectRaw('inventory.category, SUM(sale_items.quantity) as total_quantity, SUM(sale_items.total_price) as total_amount')
            ->groupBy('inventory.category')
            ->orderByDesc('total_amount')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->category,
                    'value' => $item->total_quantity,
                    'amount' => $item->total_amount,
                ];
            });
            
        // Get monthly sales data
        $monthlySales = Sale::whereBetween('created_at', [$startDate, $endDate])
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
            
        // Calculate customer metrics
        $totalCustomers = Customer::count();
        $newCustomers = Customer::whereBetween('created_at', [$startDate, $endDate])->count();
        $returningCustomers = Sale::whereBetween('created_at', [$startDate, $endDate])
            ->distinct('customer_id')
            ->count('customer_id');
            
        $customerRetentionRate = $totalCustomers > 0 ? ($returningCustomers / $totalCustomers) * 100 : 0;
        
        // Calculate inventory value
        $inventoryValue = Inventory::sum(DB::raw('stock * price'));
        
        // Calculate weekly customer data
        $weeklyCustomerData = [];
        for ($i = 0; $i < $startDate->diffInWeeks($endDate) + 1; $i++) {
            $weekStart = (clone $startDate)->addWeeks($i);
            $weekEnd = (clone $weekStart)->addWeek();
            
            $newCustomersCount = Customer::whereBetween('created_at', [$weekStart, $weekEnd])->count();
            
            $returningCustomersCount = Sale::whereBetween('created_at', [$weekStart, $weekEnd])
                ->whereHas('customer', function($query) use ($weekStart) {
                    $query->where('created_at', '<', $weekStart);
                })
                ->distinct('customer_id')
                ->count('customer_id');
                
            $weeklyCustomerData[] = [
                'name' => "Week " . ($i + 1),
                'new' => $newCustomersCount,
                'returning' => $returningCustomersCount,
            ];
        }
            
        return [
            'summary' => [
                'totalSales' => $totalSales,
                'totalRevenue' => $totalAmount,
                'averageOrder' => $averageOrder,
                'topSellingProduct' => $topProducts->first()['name'] ?? 'N/A',
                'customerRetentionRate' => round($customerRetentionRate, 2),
                'inventoryValue' => $inventoryValue,
            ],
            'topProducts' => $topProducts,
            'salesByCategory' => $salesByCategory,
            'monthlySales' => $monthlySales->toArray(),
            'customerData' => $weeklyCustomerData,
        ];
    }
    
    /**
     * Calculate percentage changes between current and previous periods
     */
    private function calculateChanges(array $current, array $previous)
    {
        $changes = [];
        
        foreach ($current as $key => $value) {
            if (isset($previous[$key]) && is_numeric($value) && is_numeric($previous[$key]) && $previous[$key] != 0) {
                $percentChange = (($value - $previous[$key]) / $previous[$key]) * 100;
                $changes[$key] = round($percentChange, 1);
            } else {
                $changes[$key] = 0;
            }
        }
        
        return $changes;
    }
    
    /**
     * Save a report
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:sales,inventory,customer',
            'timeRange' => 'required|string|in:day,week,month,quarter,year,custom',
            'startDate' => 'required_if:timeRange,custom|date',
            'endDate' => 'required_if:timeRange,custom|date|after_or_equal:startDate',
        ]);
        
        // Determine date range
        $endDate = $validated['timeRange'] === 'custom' 
            ? Carbon::parse($validated['endDate'])
            : now();
            
        $startDate = $validated['timeRange'] === 'custom'
            ? Carbon::parse($validated['startDate'])
            : match($validated['timeRange']) {
                'day' => now()->subDay(),
                'week' => now()->subWeek(),
                'month' => now()->subMonth(),
                'quarter' => now()->subMonths(3),
                'year' => now()->subYear(),
                default => now()->subMonth(),
            };
            
        // Generate report data
        $reportData = $this->generateReportData($startDate, $endDate);
        
        // Create report
        $report = Report::create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'parameters' => [
                'timeRange' => $validated['timeRange'],
                'startDate' => $startDate->toDateString(),
                'endDate' => $endDate->toDateString(),
            ],
            'data' => $reportData,
            'period_start' => $startDate,
            'period_end' => $endDate,
            'user_id' => auth()->id(),
        ]);
        
        return redirect()->route('reports')->with('success', 'Report saved successfully');
    }
}
