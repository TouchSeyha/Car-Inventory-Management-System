# Frontend Architecture Guide

## Overview
This document covers the frontend architecture of the Laravel Vehicle Inventory Management System, built with React, TypeScript, and Inertia.js.

## 🛠️ Technology Stack

### Core Frontend Technologies
- **React 18+**: Component-based UI library
- **TypeScript**: Type-safe JavaScript development
- **Inertia.js**: SPA adapter for Laravel backend
- **Tailwind CSS 4.0**: Utility-first CSS framework
- **Vite 6**: Fast build tool and development server

### UI Components & Libraries
- **Radix UI + shadcn/ui**: Accessible component primitives
- **Recharts**: Chart library for data visualization
- **Lucide React**: Icon library
- **React Hook Form**: Form handling (via Inertia's useForm)

## 📁 Project Structure

```
resources/js/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components (Button, Card, etc.)
│   ├── app-sidebar.tsx  # Navigation sidebar
│   ├── heading-small.tsx # Page headers
│   └── pagination.tsx   # Data pagination
├── layouts/             # Layout components
│   └── app-layout.tsx   # Main application layout
├── pages/               # Page components (Inertia.js routes)
│   ├── dashboard.tsx    # Analytics dashboard
│   ├── inventory/       # Inventory management pages
│   ├── sales/           # Sales management pages
│   ├── customers/       # Customer management pages
│   └── reports.tsx      # Reports page
├── types/               # TypeScript type definitions
│   ├── customer.ts      # Customer interfaces
│   ├── inventory.ts     # Inventory interfaces
│   ├── sale.ts          # Sales interfaces
│   └── report.ts        # Report interfaces
└── utils/               # Utility functions
    └── export-utils.ts  # Data export functionality
```

## 🔗 Frontend-Backend Communication

### Inertia.js Flow
1. **Route Definition**: Laravel routes return Inertia responses
2. **Page Component**: React components receive props from controllers
3. **Form Submission**: Inertia's `useForm` handles CRUD operations
4. **State Management**: Inertia manages page state and navigation

### Example: Customer Search Implementation

**Backend (Controller)**:
```php
public function index(Request $request)
{
    $customers = Customer::query()
        ->when($request->search, function ($query, $search) {
            $search = strtolower(trim($search));
            $query->where(function($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(email) LIKE ?', ["%{$search}%"]);
            });
        })
        ->paginate(10);
        
    return Inertia::render('customers', [
        'customers' => $customers,
    ]);
}
```

**Frontend (React Component)**:
```tsx
export default function Customers({ customers }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    
    const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        setTimeout(() => {
            router.visit(route('customers'), {
                data: { search: value },
                preserveState: true,
                replace: true,
            });
        }, 400);
    }, []);

    return (
        <div>
            <Input 
                placeholder="Search customers..." 
                value={searchTerm} 
                onChange={handleSearch}
            />
            {/* Customer list rendering */}
        </div>
    );
}
```

## 📊 Data Visualization Components

### Dashboard Charts
The dashboard uses Recharts for interactive data visualization:

```tsx
// Line Chart for Revenue Trends
<ResponsiveContainer width="100%" height="100%">
    <LineChart data={dashboardData.salesData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
    </LineChart>
</ResponsiveContainer>

// Pie Chart for Category Distribution
<PieChart>
    <Pie
        data={dashboardData.categoryData}
        cx="50%" cy="50%"
        outerRadius={80}
        dataKey="value"
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
    >
        {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
    </Pie>
    <Tooltip />
    <Legend />
</PieChart>
```

## 🎨 UI Component Architecture

### Component Hierarchy
```
AppLayout (Sidebar + Main Content)
├── AppSidebar (Navigation)
│   ├── NavMain (Primary navigation)
│   ├── NavUser (User menu)
│   └── NavFooter (Footer links)
└── Page Components
    ├── HeadingSmall (Page headers)
    ├── Form Components
    │   ├── Input, Select, Textarea
    │   ├── Button, Card
    │   └── Alert, Dialog
    └── Data Display
        ├── Table (Data grids)
        ├── Pagination
        └── Charts (Dashboard)
```

### Design System
- **Colors**: Tailwind CSS color palette with dark mode support
- **Typography**: Consistent font sizing and hierarchy
- **Spacing**: Standardized margin and padding using Tailwind utilities
- **Icons**: Lucide React for consistent iconography

## 🔧 Form Handling

### Inertia.js Form Management
All forms use Inertia's `useForm` hook for type-safe form handling:

```tsx
const { data, setData, post, processing, errors } = useForm<SaleFormData>({
    customer_id: 0,
    items: [{ inventory_id: 0, quantity: 1 }],
    payment_method: 'select',
    notes: '',
});

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('sales.store'));
};
```

### Validation & Error Handling
- **Client-side**: TypeScript type checking and basic validation
- **Server-side**: Laravel validation rules with error display
- **Real-time**: Debounced search and live form feedback

## 📱 Responsive Design

### Mobile-First Approach
```tsx
// Grid layouts adapt to screen size
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {/* Responsive vehicle cards */}
</div>

// Tables become scrollable on mobile
<div className="overflow-x-auto">
    <Table>
        {/* Table content */}
    </Table>
</div>
```

### Breakpoint Strategy
- **Mobile**: Single column layouts, stacked navigation
- **Tablet**: Two-column grids, collapsible sidebar
- **Desktop**: Multi-column layouts, persistent sidebar

## ⚡ Performance Optimizations

### Code Splitting
- **Route-based**: Each page component is lazy-loaded
- **Component-based**: Heavy components are dynamically imported

### Data Fetching
- **Pagination**: Server-side pagination reduces initial load
- **Search Debouncing**: Prevents excessive API calls
- **Optimistic Updates**: Immediate UI feedback

### Image Optimization
```tsx
// Fallback images for broken URLs
<img 
    src={inventory.imageurl} 
    alt={inventory.name}
    onError={(e) => {
        e.currentTarget.src = 'https://via.placeholder.com/640x480?text=No+Image';
    }}
/>
```

## 🧪 Component Testing Strategy

### Testing Approach
1. **Unit Tests**: Individual component functionality
2. **Integration Tests**: Component interaction with Inertia.js
3. **E2E Tests**: Complete user workflows

### Test Examples
```tsx
// Example component test
describe('Inventory Card', () => {
    test('displays vehicle information correctly', () => {
        render(<InventoryCard vehicle={mockVehicle} />);
        expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
        expect(screen.getByText('$25,000')).toBeInTheDocument();
    });
});
```

## 🎯 Key Frontend Features

### Real-time Features
- **Live Search**: Instant filtering as user types
- **Dynamic Forms**: Add/remove form fields dynamically
- **Status Updates**: Real-time order status changes

### User Experience
- **Loading States**: Skeleton loaders and spinners
- **Error Boundaries**: Graceful error handling
- **Accessibility**: ARIA labels, keyboard navigation
- **Dark Mode**: Automatic theme switching

### Data Management
- **Optimistic Updates**: Immediate UI feedback
- **Form State**: Persistent form data during navigation
- **Cache Management**: Efficient data caching with Inertia.js

## 🔄 State Management Patterns

### Local State (useState)
```tsx
const [searchTerm, setSearchTerm] = useState('');
const [selectedItems, setSelectedItems] = useState<Inventory[]>([]);
```

### Form State (useForm)
```tsx
const { data, setData, errors, processing } = useForm({
    name: '',
    email: '',
    phone: ''
});
```

### Server State (Inertia.js)
```tsx
// Automatic server state synchronization
router.visit(route('inventory'), {
    data: { search: searchTerm },
    preserveState: true,
});
```

## 🎨 Theming & Styling

### Tailwind CSS Configuration
- **Custom Colors**: Brand-specific color palette
- **Dark Mode**: Class-based dark mode switching
- **Responsive Design**: Mobile-first breakpoints

### Component Styling Patterns
```tsx
// Conditional styling with status colors
const getStatusColor = (status: string) => {
    if (status === 'In Stock') return 'bg-green-100 text-green-800';
    if (status === 'Low Stock') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
};
```

## 📈 Analytics & Tracking

### User Interaction Tracking
- **Page Views**: Automatic page view tracking
- **Form Submissions**: Success/error tracking
- **Search Queries**: Popular search terms analysis

### Performance Monitoring
- **Load Times**: Page load performance metrics
- **Error Tracking**: JavaScript error monitoring
- **User Experience**: Core web vitals tracking

## 🚀 Deployment Considerations

### Build Optimization
```json
// vite.config.js optimizations
{
  "build": {
    "rollupOptions": {
      "output": {
        "manualChunks": {
          "vendor": ["react", "react-dom"],
          "charts": ["recharts"]
        }
      }
    }
  }
}
```

### Production Features
- **Asset Optimization**: Minified CSS/JS
- **Image Optimization**: WebP format support
- **CDN Integration**: Static asset delivery
- **Caching Strategy**: Browser and server-side caching

This frontend architecture provides a robust, scalable, and maintainable foundation for the vehicle inventory management system, ensuring excellent user experience across all devices and use cases.
