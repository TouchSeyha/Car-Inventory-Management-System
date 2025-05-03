<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'type',
        'parameters',
        'data',
        'period_start',
        'period_end',
        'user_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'parameters' => 'array',
        'data' => 'array',
        'period_start' => 'datetime',
        'period_end' => 'datetime',
    ];

    /**
     * Get the user that created the report.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Generate a sales summary report
     * 
     * @param array $parameters
     * @return array
     */
    public static function generateSalesSummary(array $parameters): array
    {
        $startDate = $parameters['startDate'] ?? now()->subMonth();
        $endDate = $parameters['endDate'] ?? now();
        
        // Get sales within date range
        $sales = Sale::whereBetween('created_at', [$startDate, $endDate])
            ->with(['items.inventory', 'customer'])
            ->get();
            
        // Calculate summary statistics
        $totalSales = $sales->count();
        $totalAmount = $sales->sum('total_amount');
        $averageOrder = $totalSales > 0 ? $totalAmount / $totalSales : 0;
        
        // Get top selling products
        $topProducts = SaleItem::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('inventory_id, SUM(quantity) as total_quantity')
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
                    'total' => $item->sum('total_price'),
                ];
            });
            
        // Get sales by category
        $salesByCategory = SaleItem::join('inventory', 'sale_items.inventory_id', '=', 'inventory.id')
            ->whereBetween('sale_items.created_at', [$startDate, $endDate])
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
        $weeklyCustomerData = Customer::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('WEEK(created_at) as week, COUNT(*) as new')
            ->groupBy('week')
            ->orderBy('week')
            ->get()
            ->map(function ($item) use ($startDate, $endDate) {
                $weekStart = date('Y-m-d', strtotime($startDate . " +{$item->week} weeks"));
                $returning = Sale::whereBetween('created_at', [$weekStart, date('Y-m-d', strtotime($weekStart . ' +1 week'))])
                    ->distinct('customer_id')
                    ->count('customer_id');
                    
                return [
                    'name' => "Week {$item->week}",
                    'new' => $item->new,
                    'returning' => $returning,
                ];
            });
            
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
            'monthlySales' => $monthlySales,
            'customerData' => $weeklyCustomerData,
        ];
    }
}
