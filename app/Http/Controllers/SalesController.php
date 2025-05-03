<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Customer;
use App\Models\Inventory;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesController extends Controller
{
    public function index(Request $request)
    {
        $query = Sale::with('customer');
        
        // Apply search filter if provided
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('order_id', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
        }
        
        // Apply status filter if provided
        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }
        
        // Get paginated results
        $sales = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();
        
        return Inertia::render('sales', [
            'sales' => $sales,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new sale.
     */
    public function create()
    {
        $customers = Customer::orderBy('name')->get();
        $inventory = Inventory::where('stock', '>', 0)->orderBy('name')->get();
        
        return Inertia::render('sales/create', [
            'customers' => $customers,
            'inventory' => $inventory,
        ]);
    }

    /**
     * Store a newly created sale in storage.
     */
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
        
        // Generate a unique order ID
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
        
        // Calculate totals
        $totalAmount = 0;
        $itemCount = 0;
        
        foreach ($validated['items'] as $item) {
            $inventory = Inventory::findOrFail($item['inventory_id']);
            
            // Check if there's enough stock
            if ($inventory->stock < $item['quantity']) {
                return redirect()->back()->withErrors([
                    'items.' . $item['inventory_id'] => 'Not enough stock available for ' . $inventory->name,
                ]);
            }
            
            $itemTotal = $inventory->price * $item['quantity'];
            $totalAmount += $itemTotal;
            $itemCount += $item['quantity'];
        }
        
        // Create the sale
        $sale = Sale::create([
            'order_id' => $orderId,
            'customer_id' => $validated['customer_id'],
            'total_amount' => $totalAmount,
            'item_count' => $itemCount,
            'status' => 'Processing',
            'payment_method' => $validated['payment_method'],
            'notes' => $validated['notes'] ?? null,
        ]);
        
        // Create sale items and update inventory
        foreach ($validated['items'] as $item) {
            $inventory = Inventory::findOrFail($item['inventory_id']);
            
            SaleItem::create([
                'sale_id' => $sale->id,
                'inventory_id' => $inventory->id,
                'quantity' => $item['quantity'],
                'unit_price' => $inventory->price,
                'total_price' => $inventory->price * $item['quantity'],
            ]);
            
            // Update inventory stock
            $inventory->decrementStock($item['quantity']);
        }
        
        // Update customer purchase statistics
        $customer = Customer::findOrFail($validated['customer_id']);
        $customer->purchase_count += 1;
        $customer->total_spent += $totalAmount;
        $customer->last_purchase = now();
        $customer->save();
        
        return redirect()->route('sales')->with('success', 'Sale created successfully!');
    }

    /**
     * Display the specified sale.
     */
    public function show(Sale $sale)
    {
        $sale->load(['customer', 'items.inventory']);
        
        return Inertia::render('sales/show', [
            'sale' => $sale,
        ]);
    }

    /**
     * Update the status of a sale.
     */
    public function updateStatus(Request $request, Sale $sale)
    {
        $validated = $request->validate([
            'status' => 'required|in:Processing,Shipped,Completed,Cancelled',
        ]);
        
        $oldStatus = $sale->status;
        $newStatus = $validated['status'];
        
        // If the order is being cancelled, restore inventory
        if ($newStatus === 'Cancelled' && $oldStatus !== 'Cancelled') {
            // Restore inventory stock for each item
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
                
                // If this was their only purchase, reset last_purchase date
                if ($customer->purchase_count === 0) {
                    $customer->last_purchase = null;
                } else {
                    // Find the most recent non-cancelled order
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
        
        // If an order is being changed from Cancelled back to active status
        if ($oldStatus === 'Cancelled' && $newStatus !== 'Cancelled') {
            // Decrease inventory stock again
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
                
                // Update the last purchase date if this is now more recent
                if (!$customer->last_purchase || $sale->created_at > $customer->last_purchase) {
                    $customer->last_purchase = $sale->created_at;
                }
                
                $customer->save();
            }
        }
        
        $sale->status = $newStatus;
        $sale->save();
        
        return redirect()->back()->with('success', 'Sale status updated successfully!');
    }

    /**
     * Show the form for editing the specified sale.
     */
    public function edit(Sale $sale)
    {
        $sale->load(['customer', 'items.inventory']);
        
        return Inertia::render('sales/edit', [
            'sale' => $sale,
        ]);
    }
    
    /**
     * Update the specified sale in storage.
     */
    public function update(Request $request, Sale $sale)
    {
        $validated = $request->validate([
            'status' => 'required|in:Processing,Shipped,Completed,Cancelled',
            'notes' => 'nullable|string',
        ]);
        
        $sale->update($validated);
        
        return redirect()->route('sales.show', $sale->id)
            ->with('success', 'Order updated successfully!');
    }
    
    /**
     * Remove the specified sale from storage.
     */
    public function destroy(Sale $sale)
    {
        // If the order was not cancelled or completed, restore inventory items
        $shouldRestoreInventory = $sale->status !== 'Completed' && $sale->status !== 'Cancelled';
        
        // For cancelled orders, inventory has already been restored during cancellation
        if ($shouldRestoreInventory) {
            // Restore inventory stock for each item
            foreach ($sale->items as $item) {
                if ($item->inventory) {
                    $item->inventory->incrementStock($item->quantity);
                }
            }
        }
        
        // Update customer purchase history if the order was not cancelled
        // (if cancelled, stats were already updated during cancellation)
        if ($sale->status !== 'Cancelled' && $sale->customer) {
            $customer = $sale->customer;
            $customer->purchase_count = max(0, $customer->purchase_count - 1);
            $customer->total_spent = max(0, $customer->total_spent - $sale->total_amount);
            
            // If this was their only purchase, reset last_purchase date
            if ($customer->purchase_count === 0) {
                $customer->last_purchase = null;
            } else {
                // Find the most recent non-deleted order
                $lastOrder = Sale::where('customer_id', $customer->id)
                    ->where('id', '!=', $sale->id)
                    ->orderByDesc('created_at')
                    ->first();
                
                if ($lastOrder) {
                    $customer->last_purchase = $lastOrder->created_at;
                }
            }
            
            $customer->save();
        }
        
        // Delete the sale (will also delete related items due to cascade)
        $sale->delete();
        
        return redirect()->route('sales')
            ->with('success', 'Order deleted successfully!');
    }
}
