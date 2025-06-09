# Vehicle Inventory Management System - Project Documentation

## Project Overview

This is a comprehensive **Vehicle Inventory Management System** built with Laravel 11 and React (TypeScript) using Inertia.js for seamless full-stack development. The system manages vehicle inventory, customer relationships, sales operations, and provides detailed analytics through an interactive dashboard.

## 🛠️ Technology Stack

### Backend
- **Framework**: Laravel 11
- **Database**: SQLite (can be configured for MySQL/PostgreSQL)
- **Authentication**: Laravel Breeze with Inertia.js
- **Data Processing**: Eloquent ORM
- **Server-side Rendering**: Inertia.js

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite 6
- **UI Library**: Tailwind CSS 4.0
- **Component Library**: Radix UI + shadcn/ui
- **Charts**: Recharts
- **State Management**: Inertia.js built-in
- **Icons**: Lucide React

### Development Tools
- **Code Quality**: ESLint, Prettier
- **Type Safety**: TypeScript
- **Testing**: PHPUnit (Laravel), Pest
- **Package Manager**: pnpm

## 📊 Database Schema & Relationships

### Core Tables

#### 1. Users Table
```sql
- id (primary key)
- name (string)
- email (string, unique)
- email_verified_at (timestamp)
- password (hashed)
- remember_token (string)
- created_at, updated_at (timestamps)
```

#### 2. Customers Table
```sql
- id (primary key)
- name (string)
- email (string, unique)
- phone (string, nullable)
- purchase_count (integer, default: 0)
- total_spent (decimal 10,2, default: 0.00)
- last_purchase (date, nullable)
- created_at, updated_at (timestamps)
```

#### 3. Inventory Table
```sql
- id (primary key)
- name (string) - Vehicle name
- category (string) - Sedan, SUV, Truck, Luxury, Electric, Sports
- year (integer)
- make (string) - Toyota, Honda, Ford, etc.
- model (string)
- stock (integer, default: 0)
- price (decimal 10,2)
- status (enum) - 'In Stock', 'Low Stock', 'Out of Stock'
- imageurl (text)
- description (text, nullable)
- created_at, updated_at (timestamps)
```

#### 4. Sales Table
```sql
- id (primary key)
- order_id (string, unique) - Format: ORD-YYYY-XXX
- customer_id (foreign key → customers.id)
- total_amount (decimal 10,2)
- item_count (integer)
- status (enum) - 'Processing', 'Shipped', 'Completed', 'Cancelled'
- payment_method (string)
- notes (text, nullable)
- created_at, updated_at (timestamps)
```

#### 5. Sale Items Table
```sql
- id (primary key)
- sale_id (foreign key → sales.id, cascade delete)
- inventory_id (foreign key → inventory.id, cascade delete)
- quantity (integer)
- unit_price (decimal 10,2)
- total_price (decimal 10,2)
- created_at, updated_at (timestamps)
```

#### 6. Reports Table
```sql
- id (primary key)
- name (string)
- type (string) - 'sales', 'inventory', 'customer'
- parameters (json) - Report generation parameters
- data (json) - Actual report data
- period_start (datetime)
- period_end (datetime)
- user_id (foreign key → users.id, nullable)
- created_at, updated_at (timestamps)
```

### 🔗 Model Relationships

#### Customer Model
```php
// Has many sales
public function sales(): HasMany
{
    return $this->hasMany(Sale::class);
}
```

#### Sale Model
```php
// Belongs to a customer
public function customer(): BelongsTo
{
    return $this->belongsTo(Customer::class);
}

// Has many sale items
public function items(): HasMany
{
    return $this->hasMany(SaleItem::class);
}
```

#### SaleItem Model
```php
// Belongs to a sale
public function sale(): BelongsTo
{
    return $this->belongsTo(Sale::class);
}

// Belongs to an inventory item
public function inventory(): BelongsTo
{
    return $this->belongsTo(Inventory::class);
}
```

#### Inventory Model
```php
// Has many sale items
public function saleItems(): HasMany
{
    return $this->hasMany(SaleItem::class);
}
```

## 🎯 Application Features

### 1. Dashboard Analytics
- **Real-time Statistics**: Total sales, revenue, profit, average order value
- **Interactive Charts**: 
  - Line Chart: Monthly revenue trends
  - Bar Chart: Customer activity (new vs returning)
  - Pie Chart: Sales by vehicle category
- **Time Range Filtering**: Week, Month, Quarter, Year
- **Key Metrics**: Customer retention rate, best/worst sales months

### 2. Customer Management
- **CRUD Operations**: Create, Read, Update, Delete customers
- **Search & Filter**: Case-insensitive search by name, email, phone
- **Customer Analytics**: Purchase history, total spent, last purchase date
- **Pagination**: Efficient handling of large customer datasets

### 3. Inventory Management
- **Vehicle Catalog**: Comprehensive vehicle information
- **Stock Management**: Automatic status updates (In Stock/Low Stock/Out of Stock)
- **Category Management**: Sedan, SUV, Truck, Luxury, Electric, Sports
- **Search & Filter**: Multi-field search and category filtering
- **Image Support**: Vehicle images with URL validation

### 4. Sales Management
- **Order Processing**: Complete sales workflow
- **Order Status Tracking**: Processing → Shipped → Completed/Cancelled
- **Inventory Integration**: Automatic stock updates on sales
- **Customer Statistics**: Auto-update customer purchase history
- **Order Management**: Edit orders, update status, cancel orders

### 5. Reporting System
- **Dynamic Reports**: Sales, inventory, customer reports
- **Time Range Selection**: Flexible date range selection
- **Data Visualization**: Charts and graphs for insights
- **Export Capabilities**: PDF, Excel export functionality
- **Report Storage**: Save and retrieve historical reports

## 🔄 Route Structure & Controllers

### Authentication Routes (`routes/auth.php`)
```php
Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create']);
    Route::post('register', [RegisteredUserController::class, 'store']);
    Route::get('login', [AuthenticatedSessionController::class, 'create']);
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
    // Password reset routes...
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy']);
    // Email verification routes...
});
```

### Main Application Routes (`routes/web.php`)
```php
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index']);
    
    // Customer Management
    Route::get('/customers', [CustomerController::class, 'index']);
    Route::get('/customers/create', [CustomerController::class, 'create']);
    Route::post('/customers', [CustomerController::class, 'store']);
    Route::get('/customers/{customer}', [CustomerController::class, 'show']);
    Route::get('/customers/{customer}/edit', [CustomerController::class, 'edit']);
    Route::put('/customers/{customer}', [CustomerController::class, 'update']);
    Route::delete('/customers/{customer}', [CustomerController::class, 'destroy']);
    
    // Inventory Management
    Route::get('/inventory', [InventoryController::class, 'index']);
    Route::post('/inventory', [InventoryController::class, 'store']);
    Route::get('/inventory/create', [InventoryController::class, 'create']);
    Route::get('/inventory/{inventory}/edit', [InventoryController::class, 'edit']);
    Route::put('/inventory/{inventory}', [InventoryController::class, 'update']);
    Route::delete('/inventory/{inventory}', [InventoryController::class, 'destroy']);
    Route::get('/inventory/{inventory}', [InventoryController::class, 'show']);
    
    // Sales Management
    Route::get('/sales', [SalesController::class, 'index']);
    Route::get('/sales/create', [SalesController::class, 'create']);
    Route::post('/sales', [SalesController::class, 'store']);
    Route::get('/sales/{sale}', [SalesController::class, 'show']);
    Route::get('/sales/{sale}/edit', [SalesController::class, 'edit']);
    Route::patch('/sales/{sale}', [SalesController::class, 'update']);
    Route::patch('/sales/{sale}/status', [SalesController::class, 'updateStatus']);
    Route::delete('/sales/{sale}', [SalesController::class, 'destroy']);
    
    // Reports
    Route::get('/reports', [ReportsController::class, 'index']);
    Route::post('/reports', [ReportsController::class, 'store']);
});
```

## 🎮 Controller Logic Explained

### DashboardController
**Purpose**: Provides real-time analytics and dashboard data

**Key Methods**:
- `index()`: Main dashboard with statistics and charts
- `getDashboardStatistics()`: Calculates KPIs
- `getSalesChartData()`: Monthly sales data for line charts
- `getCategoryData()`: Category breakdown for pie charts
- `getCustomerData()`: Customer analytics for bar charts

**Why it works**: The dashboard aggregates data from multiple tables using Eloquent relationships and raw SQL for complex calculations like customer retention rates.

### CustomerController
**Purpose**: Manages customer lifecycle and relationships

**Key Methods**:
- `index()`: List customers with search and pagination
- `store()`: Create new customers with validation
- `show()`: Display customer details and purchase history
- `update()`: Update customer information
- `destroy()`: Delete customers (cascades to related sales)

**Why it works**: Uses Eloquent relationships to efficiently load related data and implements case-insensitive search using SQL LOWER() functions.

### InventoryController
**Purpose**: Manages vehicle inventory and stock levels

**Key Methods**:
- `index()`: List vehicles with filtering and search
- `store()`: Add new vehicles with automatic status calculation
- `update()`: Update vehicle details and stock
- `destroy()`: Remove vehicles from inventory

**Why it works**: Automatic stock status updates (In Stock/Low Stock/Out of Stock) based on quantity thresholds, ensuring data consistency.

### SalesController
**Purpose**: Handles complete sales workflow and order management

**Key Methods**:
- `index()`: List orders with search and status filtering
- `store()`: Create new sales with inventory management
- `updateStatus()`: Change order status with business logic
- `destroy()`: Cancel orders and restore inventory

**Critical Business Logic**:
```php
// When creating a sale:
1. Generate unique order ID (ORD-YYYY-XXX format)
2. Validate inventory availability
3. Calculate totals and create sale record
4. Create sale items and update inventory stock
5. Update customer statistics (purchase_count, total_spent, last_purchase)

// When cancelling a sale:
1. Restore inventory stock for each item
2. Update customer statistics (decrease counts)
3. Update order status to 'Cancelled'
```

**Why it works**: The controller implements complete transaction logic, ensuring data consistency across customers, inventory, and sales tables.

### ReportsController
**Purpose**: Generates business intelligence and analytics

**Key Methods**:
- `index()`: Generate reports with time range filtering
- `generateReportData()`: Compile data from multiple sources
- `store()`: Save reports for future reference

**Why it works**: Uses complex SQL joins and aggregations to provide insights like top-selling products, customer retention rates, and sales trends.

## 🧩 Frontend Architecture

### Component Structure
```
resources/js/
├── components/
│   ├── ui/          # Reusable UI components (Button, Card, Input, etc.)
│   └── heading-small.tsx
├── layouts/
│   └── app-layout.tsx
├── pages/
│   ├── dashboard.tsx
│   ├── customers/
│   ├── inventory/
│   ├── sales/
│   └── reports/
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

### Type Safety
The application uses comprehensive TypeScript interfaces:

```typescript
export interface Customer {
    id: number;
    name: string;
    email: string;
    phone?: string;
    purchase_count: number;
    total_spent: number;
    last_purchase?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Sale {
    id: number;
    order_id: string;
    customer_id: number;
    total_amount: number;
    item_count: number;
    status: SaleStatus;
    payment_method: string;
    notes?: string;
    customer?: Customer;
    items?: SaleItem[];
    created_at?: string;
    updated_at?: string;
}
```

### State Management
- **Inertia.js**: Handles page state and navigation
- **React Hooks**: Local component state (useState, useEffect)
- **Form Handling**: Inertia's useForm hook for form state and validation

## 🔧 Key Business Rules

### Inventory Management
1. **Stock Status**: Automatically calculated based on quantity
   - 0 items = "Out of Stock"
   - 1-2 items = "Low Stock"
   - 3+ items = "In Stock"

2. **Stock Updates**: Automatic updates when:
   - Sales are created (decreases stock)
   - Sales are cancelled (restores stock)
   - Manual inventory adjustments

### Customer Analytics
1. **Purchase Statistics**: Automatically maintained
   - `purchase_count`: Incremented on each completed sale
   - `total_spent`: Sum of all non-cancelled orders
   - `last_purchase`: Date of most recent order

2. **Customer Retention**: Calculated as percentage of customers with repeat purchases

### Sales Workflow
1. **Order ID Generation**: Automatic format ORD-YYYY-XXX
2. **Status Flow**: Processing → Shipped → Completed/Cancelled
3. **Inventory Validation**: Cannot sell more than available stock
4. **Cancellation Logic**: Restores inventory and updates customer stats

## 🚀 Getting Started

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- pnpm (recommended) or npm

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd example-app

# Install PHP dependencies
composer install

# Install Node.js dependencies
pnpm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Run migrations and seeders
php artisan migrate
php artisan db:seed

# Build frontend assets
pnpm dev

# Start the development server
php artisan serve
```

### Default Access
- **URL**: http://localhost:8000
- **Database**: SQLite (database/database.sqlite)
- **Authentication**: Register new account or use seeded data

## 📈 Performance Considerations

### Database Optimization
- **Indexes**: Proper indexing on foreign keys and search fields
- **Pagination**: All listing pages use pagination to handle large datasets
- **Eager Loading**: Relationships loaded efficiently to prevent N+1 queries

### Frontend Performance
- **Code Splitting**: Vite automatically splits code for optimal loading
- **Type Safety**: TypeScript prevents runtime errors
- **Component Optimization**: React hooks used efficiently

### Caching Strategy
- **Route Caching**: Laravel route caching for production
- **View Caching**: Inertia.js handles client-side navigation caching
- **Database Queries**: Eloquent query optimization with relationships

## 🔍 Testing

### Backend Tests
```bash
# Run PHP tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature
```

### Frontend Tests
```bash
# Run TypeScript type checking
pnpm types

# Run linting
pnpm lint

# Format code
pnpm format
```

## 📝 API Endpoints Summary

While this is primarily a web application using Inertia.js, the routes effectively serve as API endpoints:

### Customer Endpoints
- `GET /customers` - List customers with search/pagination
- `POST /customers` - Create new customer
- `GET /customers/{id}` - View customer details
- `PUT /customers/{id}` - Update customer
- `DELETE /customers/{id}` - Delete customer

### Inventory Endpoints
- `GET /inventory` - List vehicles with filtering
- `POST /inventory` - Add new vehicle
- `GET /inventory/{id}` - View vehicle details
- `PUT /inventory/{id}` - Update vehicle
- `DELETE /inventory/{id}` - Remove vehicle

### Sales Endpoints
- `GET /sales` - List orders with filtering
- `POST /sales` - Create new sale
- `GET /sales/{id}` - View order details
- `PATCH /sales/{id}` - Update order
- `PATCH /sales/{id}/status` - Update order status
- `DELETE /sales/{id}` - Cancel/delete order

### Dashboard Endpoints
- `GET /dashboard` - Get dashboard analytics with time filtering

### Reports Endpoints
- `GET /reports` - Generate reports with filtering
- `POST /reports` - Save report

## 🎯 Demo Questions & Answers

### Q: How does the inventory system prevent overselling?
**A**: The `SalesController::store()` method validates stock availability before creating a sale:
```php
if ($inventory->stock < $item['quantity']) {
    return redirect()->back()->withErrors([
        'items.' . $item['inventory_id'] => 'Not enough stock available for ' . $inventory->name,
    ]);
}
```

### Q: How are customer statistics maintained accurately?
**A**: Customer stats are automatically updated in multiple scenarios:
- **Sale Creation**: Increments `purchase_count`, adds to `total_spent`, updates `last_purchase`
- **Sale Cancellation**: Decrements counters and recalculates `last_purchase`
- **Sale Deletion**: Similar to cancellation with proper cleanup

### Q: How does the dashboard show real-time data?
**A**: The `DashboardController` queries live data using date range filtering:
```php
$totalSales = Sale::whereBetween('created_at', [$startDate, $endDate])->count();
$totalRevenue = Sale::whereBetween('created_at', [$startDate, $endDate])->sum('total_amount');
```

### Q: How is data integrity maintained across relationships?
**A**: Through Laravel's:
- **Foreign Key Constraints**: Defined in migrations
- **Cascade Deletes**: Sale items are deleted when sales are deleted
- **Model Relationships**: Proper Eloquent relationships ensure data consistency
- **Transaction Logic**: Business operations are wrapped in proper transaction logic

### Q: How does the search functionality work?
**A**: Case-insensitive search using SQL functions:
```php
$query->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"])
      ->orWhereRaw('LOWER(email) LIKE ?', ["%{$search}%"]);
```

This documentation provides a comprehensive overview of the Vehicle Inventory Management System, covering architecture, database design, business logic, and implementation details necessary for understanding and maintaining the application.
