<?php

use App\Http\Controllers\ProfileController;
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
    Route::get('/customers', function () {
        return Inertia::render('customers');
    })->name('customers');

    // Inventory routes
    Route::get('/inventory', function () {
        return Inertia::render('inventory');
    })->name('inventory');

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
