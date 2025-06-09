# Technical Implementation Guide

## Route-Controller-Model Flow Examples

This document explains how specific features work by tracing the flow from routes to controllers to models.

## 📍 Example 1: Customer Search Functionality

### Route Definition
```php
// routes/web.php
Route::get('/customers', [CustomerController::class, 'index'])->name('customers');
```

### How It Works
1. **User Action**: User visits `/customers?search=john` 
2. **Route Matching**: Laravel matches the route and calls `CustomerController@index`
3. **Controller Logic**: 
   ```php
   // CustomerController.php
   public function index(Request $request)
   {
       $customers = Customer::query()
           ->when($request->search, function ($query, $search) {
               $search = strtolower(trim($search));
               $query->where(function($q) use ($search) {
                   $q->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"])
                     ->orWhereRaw('LOWER(email) LIKE ?', ["%{$search}%"])
                     ->orWhereRaw('LOWER(phone) LIKE ?', ["%{$search}%"]);
               });
           })
           ->orderBy('name')
           ->paginate(10)
           ->withQueryString();
           
       return Inertia::render('customers', [
           'customers' => $customers,
       ]);
   }
   ```
4. **Model Query**: Eloquent builds and executes the SQL query
5. **Response**: Inertia.js renders the React component with filtered data

### Why This Route Works
- **Route Parameter**: `$request->search` automatically captures the query parameter
- **Conditional Query**: `when()` method only applies search if parameter exists
- **Case-Insensitive**: `LOWER()` SQL function ensures case-insensitive search
- **Pagination**: `withQueryString()` preserves search parameters across pages
- **Frontend Integration**: Inertia.js seamlessly passes data to React components

---

## 📍 Example 2: Creating a New Sale with Inventory Updates

### Route Definition
```php
// routes/web.php
Route::post('/sales', [SalesController::class, 'store'])->name('sales.store');
```

### Complete Flow
1. **Frontend Form Submission**:
   ```typescript
   // sales/create.tsx
   const { data, setData, post } = useForm({
       customer_id: '',
       items: [{ inventory_id: '', quantity: 1 }],
       payment_method: '',
       notes: ''
   });
   
   const handleSubmit = (e: React.FormEvent) => {
       e.preventDefault();
       post(route('sales.store'));
   };
   ```

2. **Controller Validation**:
   ```php
   // SalesController.php
   public function store(Request $request)
   {
       $validated = $request->validate([
           'customer_id' => 'required|exists:customers,id',
           'items' => 'required|array|min:1',
           'items.*.inventory_id' => 'required|exists:inventory,id',
           'items.*.quantity' => 'required|integer|min:1',
           'payment_method' => 'required|string',
           'notes' => 'nullable|string',
       ]);
   ```

3. **Generate Unique Order ID**:
   ```php
   $orderPrefix = 'ORD-' . date('Y') . '-';
   $lastOrder = Sale::where('order_id', 'like', $orderPrefix . '%')
       ->orderBy('id', 'desc')
       ->first();
       
   if ($lastOrder) {
       $lastOrderNumber = (int)substr($lastOrder->order_id, strlen($orderPrefix));
       $newOrderNumber = $lastOrderNumber + 1;
   } else {
       $newOrderNumber = 1;
   }
   
   $orderId = $orderPrefix . str_pad($newOrderNumber, 3, '0', STR_PAD_LEFT);
   ```

4. **Inventory Validation & Total Calculation**:
   ```php
   $totalAmount = 0;
   $itemCount = 0;
   
   foreach ($validated['items'] as $item) {
       $inventory = Inventory::findOrFail($item['inventory_id']);
       
       // Check stock availability
       if ($inventory->stock < $item['quantity']) {
           return redirect()->back()->withErrors([
               'items.' . $item['inventory_id'] => 'Not enough stock for ' . $inventory->name,
           ]);
       }
       
       $itemTotal = $inventory->price * $item['quantity'];
       $totalAmount += $itemTotal;
       $itemCount += $item['quantity'];
   }
   ```

5. **Create Sale Record**:
   ```php
   $sale = Sale::create([
       'order_id' => $orderId,
       'customer_id' => $validated['customer_id'],
       'total_amount' => $totalAmount,
       'item_count' => $itemCount,
       'status' => 'Processing',
       'payment_method' => $validated['payment_method'],
       'notes' => $validated['notes'] ?? null,
   ]);
   ```

6. **Create Sale Items & Update Inventory**:
   ```php
   foreach ($validated['items'] as $item) {
       $inventory = Inventory::findOrFail($item['inventory_id']);
       
       SaleItem::create([
           'sale_id' => $sale->id,
           'inventory_id' => $inventory->id,
           'quantity' => $item['quantity'],
           'unit_price' => $inventory->price,
           'total_price' => $inventory->price * $item['quantity'],
       ]);
       
       // Update inventory stock using model method
       $inventory->decrementStock($item['quantity']);
   }
   ```

7. **Update Customer Statistics**:
   ```php
   $customer = Customer::findOrFail($validated['customer_id']);
   $customer->purchase_count += 1;
   $customer->total_spent += $totalAmount;
   $customer->last_purchase = now();
   $customer->save();
   ```

### Why This Works
- **Validation First**: Ensures data integrity before any database operations
- **Stock Checking**: Prevents overselling by validating inventory availability
- **Atomic Operations**: All database changes happen in sequence to maintain consistency
- **Model Methods**: `decrementStock()` encapsulates business logic and status updates
- **Relationship Management**: Proper foreign key relationships ensure data integrity

---

## 📍 Example 3: Dashboard Analytics with Time Filtering

### Route Definition
```php
// routes/web.php
Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
```

### Data Aggregation Process
1. **Time Range Processing**:
   ```php
   // DashboardController.php
   public function index(Request $request)
   {
       $timeRange = $request->input('timeRange', 'year');
       
       $endDate = now();
       $startDate = match($timeRange) {
           'week' => now()->subWeek(),
           'month' => now()->subMonth(),
           'quarter' => now()->subMonths(3),
           'year' => now()->subYear(),
           default => now()->subYear(),
       };
   ```

2. **Statistics Calculation**:
   ```php
   private function getDashboardStatistics(Carbon $startDate, Carbon $endDate)
   {
       // Total sales count
       $totalSales = Sale::whereBetween('created_at', [$startDate, $endDate])->count();
       
       // Total revenue
       $totalRevenue = Sale::whereBetween('created_at', [$startDate, $endDate])->sum('total_amount');
       
       // Average order value
       $averageOrderValue = $totalSales > 0 ? $totalRevenue / $totalSales : 0;
       
       // Customer retention calculation
       $totalCustomers = Customer::count();
       $returningCustomers = Sale::whereBetween('created_at', [$startDate, $endDate])
           ->distinct('customer_id')
           ->count('customer_id');
       $customerRetention = $totalCustomers > 0 ? ($returningCustomers / $totalCustomers) * 100 : 0;
   ```

3. **Chart Data Generation**:
   ```php
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
                   'profit' => $item->revenue * 0.15, // 15% profit margin
               ];
           });
   }
   ```

4. **Category Analysis**:
   ```php
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
   ```

### Why This Works
- **Flexible Time Ranges**: Match expression provides clean time range logic
- **Efficient Queries**: Raw SQL aggregations for better performance
- **Data Transformation**: Collection mapping formats data for frontend charts
- **Real-time Data**: No caching means always current information
- **Multi-table Joins**: Complex relationships handled efficiently

---

## 📍 Example 4: Inventory Stock Status Management

### Automatic Status Updates
```php
// Inventory Model
public function decrementStock(int $quantity = 1): void
{
    $this->stock = max(0, $this->stock - $quantity);
    $this->updateStatus();
    $this->save();
}

public function incrementStock(int $quantity = 1): void
{
    $this->stock += $quantity;
    $this->updateStatus();
    $this->save();
}

private function updateStatus(): void
{
    if ($this->stock <= 0) {
        $this->status = 'Out of Stock';
    } elseif ($this->stock <= 2) {
        $this->status = 'Low Stock';
    } else {
        $this->status = 'In Stock';
    }
}
```

### Integration with Sales
```php
// When creating a sale
$inventory->decrementStock($item['quantity']);

// When cancelling a sale
foreach ($sale->items as $item) {
    if ($item->inventory) {
        $item->inventory->incrementStock($item->quantity);
    }
}
```

### Why This Works
- **Encapsulated Logic**: Status calculation is contained within the model
- **Automatic Updates**: Stock changes always trigger status recalculation
- **Business Rules**: Clear thresholds (0 = Out, 1-2 = Low, 3+ = In Stock)
- **Consistency**: Same logic used across all stock modifications

---

## 📍 Example 5: Order Status Management with Business Logic

### Status Update Route
```php
// routes/web.php
Route::patch('/sales/{sale}/status', [SalesController::class, 'updateStatus'])->name('sales.update-status');
```

### Complex Business Logic
```php
// SalesController.php
public function updateStatus(Request $request, Sale $sale)
{
    $validated = $request->validate([
        'status' => 'required|in:Processing,Shipped,Completed,Cancelled',
    ]);
    
    $oldStatus = $sale->status;
    $newStatus = $validated['status'];
    
    // Cancellation logic
    if ($newStatus === 'Cancelled' && $oldStatus !== 'Cancelled') {
        // Restore inventory stock
        foreach ($sale->items as $item) {
            if ($item->inventory) {
                $item->inventory->incrementStock($item->quantity);
            }
        }
        
        // Update customer statistics
        if ($sale->customer) {
            $customer = $sale->customer;
            $customer->purchase_count = max(0, $customer->purchase_count - 1);
            $customer->total_spent = max(0, $customer->total_spent - $sale->total_amount);
            
            // Recalculate last purchase date
            if ($customer->purchase_count === 0) {
                $customer->last_purchase = null;
            } else {
                $lastOrder = Sale::where('customer_id', $customer->id)
                    ->where('id', '!=', $sale->id)
                    ->where('status', '!=', 'Cancelled')
                    ->orderByDesc('created_at')
                    ->first();
                
                if ($lastOrder) {
                    $customer->last_purchase = $lastOrder->created_at;
                }
            }
            $customer->save();
        }
    }
    
    // Reactivation logic (from Cancelled to active)
    if ($oldStatus === 'Cancelled' && $newStatus !== 'Cancelled') {
        // Decrease inventory again
        foreach ($sale->items as $item) {
            if ($item->inventory) {
                $item->inventory->decrementStock($item->quantity);
            }
        }
        
        // Update customer statistics
        if ($sale->customer) {
            $customer = $sale->customer;
            $customer->purchase_count += 1;
            $customer->total_spent += $sale->total_amount;
            $customer->last_purchase = $sale->created_at;
            $customer->save();
        }
    }
    
    $sale->status = $newStatus;
    $sale->save();
    
    return redirect()->back()->with('success', 'Sale status updated successfully!');
}
```

### Why This Works
- **State Transition Logic**: Handles all possible status changes correctly
- **Bidirectional Operations**: Can cancel and reactivate orders properly
- **Data Consistency**: Customer stats and inventory are always in sync
- **Edge Case Handling**: Properly calculates last purchase dates when orders are cancelled

---

## 🔧 Model Relationships in Action

### Loading Related Data Efficiently
```php
// Sales with customer and inventory details
$sale = Sale::with(['customer', 'items.inventory'])->find($id);

// Customer with their sales history
$customer = Customer::with('sales')->find($id);

// Inventory with sales data
$inventory = Inventory::with('saleItems.sale.customer')->find($id);
```

### Query Optimization Examples
```php
// Dashboard: Avoid N+1 queries
$sales = Sale::with('customer')
    ->when($request->search, function ($query, $search) {
        $query->where('order_id', 'like', "%{$search}%")
              ->orWhereHas('customer', function ($q) use ($search) {
                  $q->where('name', 'like', "%{$search}%");
              });
    })
    ->paginate(10);

// Reports: Complex aggregations
$topProducts = SaleItem::join('inventory', 'sale_items.inventory_id', '=', 'inventory.id')
    ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
    ->whereBetween('sales.created_at', [$startDate, $endDate])
    ->selectRaw('inventory_id, SUM(quantity) as total_quantity, SUM(total_price) as total_amount')
    ->groupBy('inventory_id')
    ->orderByDesc('total_quantity')
    ->limit(5)
    ->with('inventory')
    ->get();
```

---

## 🎯 Frontend-Backend Communication

### Form Handling with Inertia.js
```typescript
// Frontend: TypeScript interface
interface SaleFormData {
    customer_id: number;
    items: {
        inventory_id: number;
        quantity: number;
    }[];
    payment_method: string;
    notes: string;
}

// Frontend: Form submission
const { data, setData, post, errors, processing } = useForm<SaleFormData>({
    customer_id: 0,
    items: [{ inventory_id: 0, quantity: 1 }],
    payment_method: '',
    notes: ''
});

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('sales.store'), {
        onSuccess: () => {
            // Handle success
        },
        onError: (errors) => {
            // Handle validation errors
        }
    });
};
```

### Error Handling
```php
// Backend: Validation errors are automatically passed to frontend
if ($inventory->stock < $item['quantity']) {
    return redirect()->back()->withErrors([
        'items.' . $item['inventory_id'] => 'Not enough stock available for ' . $inventory->name,
    ]);
}
```

```typescript
// Frontend: Display validation errors
{errors['items.' + item.inventory_id] && (
    <p className="text-sm text-red-500">
        {errors['items.' + item.inventory_id]}
    </p>
)}
```

---

## 📊 Performance Optimization Techniques

### Database Queries
- **Eager Loading**: Always load relationships that will be used
- **Pagination**: Use pagination for large datasets
- **Indexing**: Proper indexes on foreign keys and search fields
- **Raw Queries**: Use raw SQL for complex aggregations

### Frontend Optimization
- **Code Splitting**: Vite automatically splits components
- **Type Safety**: TypeScript prevents runtime errors
- **Component Memoization**: Use React.memo() for expensive components
- **Efficient Re-renders**: Proper dependency arrays in useEffect

This technical guide provides specific examples of how the application's features are implemented, showing the complete flow from user interaction to database operations and back to the frontend display.
