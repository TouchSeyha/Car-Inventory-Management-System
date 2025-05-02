<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Inventory::query();
        
        // Apply search filter if provided
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('make', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        
        // Apply category filter if provided
        if ($request->has('category') && $request->input('category') !== 'all') {
            $query->where('category', $request->input('category'));
        }
        
        // Get paginated results with smaller page size to demonstrate pagination
        $inventory = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();
        
        return Inertia::render('inventory', [
            'inventory' => $inventory,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('inventory/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'year' => 'required|integer|min:1900|max:2100',
            'make' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'stock' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'imageurl' => 'required|url',
            'description' => 'nullable|string',
        ]);
        
        // Determine status based on stock
        if ($validated['stock'] <= 0) {
            $validated['status'] = 'Out of Stock';
        } elseif ($validated['stock'] <= 2) {
            $validated['status'] = 'Low Stock';
        } else {
            $validated['status'] = 'In Stock';
        }
        
        $inventory = Inventory::create($validated);
        
        return redirect()->route('inventory')->with('success', 'Vehicle added to inventory successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Inventory $inventory)
    {
        return Inertia::render('inventory/show', [
            'inventory' => $inventory
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Inventory $inventory)
    {
        return Inertia::render('inventory/edit', [
            'inventory' => $inventory
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Inventory $inventory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'year' => 'required|integer|min:1900|max:2100',
            'make' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'stock' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'imageurl' => 'required|url',
            'description' => 'nullable|string',
        ]);
        
        // Determine status based on stock
        if ($validated['stock'] <= 0) {
            $validated['status'] = 'Out of Stock';
        } elseif ($validated['stock'] <= 2) {
            $validated['status'] = 'Low Stock';
        } else {
            $validated['status'] = 'In Stock';
        }
        
        $inventory->update($validated);
        
        return redirect()->route('inventory')->with('success', 'Inventory updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Inventory $inventory)
    {
        $inventory->delete();
        
        return redirect()->route('inventory')->with('success', 'Vehicle removed from inventory successfully!');
    }
}
