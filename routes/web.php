<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\SalesController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Customer routes
    Route::get('/customers', [CustomerController::class, 'index'])->name('customers');
    Route::get('/customers/create', [CustomerController::class, 'create'])->name('customers.create');
    Route::post('/customers', [CustomerController::class, 'store'])->name('customers.store');
    Route::get('/customers/{customer}', [CustomerController::class, 'show'])->name('customers.show');
    Route::get('/customers/{customer}/edit', [CustomerController::class, 'edit'])->name('customers.edit');
    Route::put('/customers/{customer}', [CustomerController::class, 'update'])->name('customers.update');
    Route::delete('/customers/{customer}', [CustomerController::class, 'destroy'])->name('customers.destroy');

    // Inventory routes
    Route::get('/inventory', [InventoryController::class, 'index'])->name('inventory');
    Route::post('/inventory', [InventoryController::class, 'store'])->name('inventory.store');
    Route::get('/inventory/create', function () {
        return Inertia::render('inventory/create');
    })->name('inventory.create');
    Route::get('/inventory/{inventory}/edit', function (App\Models\Inventory $inventory) {
        return Inertia::render('inventory/edit', ['inventory' => $inventory]);
    })->name('inventory.edit');
    Route::put('/inventory/{inventory}', [InventoryController::class, 'update'])->name('inventory.update');
    Route::delete('/inventory/{inventory}', [InventoryController::class, 'destroy'])->name('inventory.destroy');
    Route::get('/inventory/{inventory}', function (App\Models\Inventory $inventory) {
        return Inertia::render('inventory/show', ['inventory' => $inventory]);
    })->name('inventory.show');

    // Sales routes
    Route::get('/sales', [SalesController::class, 'index'])->name('sales');
    Route::get('/sales/create', [SalesController::class, 'create'])->name('sales.create');
    Route::post('/sales', [SalesController::class, 'store'])->name('sales.store');
    Route::get('/sales/{sale}', [SalesController::class, 'show'])->name('sales.show');
    Route::get('/sales/{sale}/edit', [SalesController::class, 'edit'])->name('sales.edit');
    Route::patch('/sales/{sale}', [SalesController::class, 'update'])->name('sales.update');
    Route::patch('/sales/{sale}/status', [SalesController::class, 'updateStatus'])->name('sales.update-status');
    Route::delete('/sales/{sale}', [SalesController::class, 'destroy'])->name('sales.destroy');

    // Reports routes
    Route::get('/reports', function () {
        return Inertia::render('reports');
    })->name('reports');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
