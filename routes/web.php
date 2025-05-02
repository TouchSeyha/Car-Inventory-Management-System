<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\InventoryController;
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

    // Reports routes
    Route::get('/reports', function () {
        return Inertia::render('reports');
    })->name('reports');

    // Sales routes
    Route::get('/sales', function () {
        return Inertia::render('sales');
    })->name('sales');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
