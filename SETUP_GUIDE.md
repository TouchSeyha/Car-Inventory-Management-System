# 🚀 Project Setup Guide

Welcome to the Laravel React Starter Kit! This guide will walk you through setting up the project on your local machine step by step.

## 📋 Prerequisites

Before you begin, make sure you have the following installed on your system:

1. **PHP 8.2 or higher**
   - Download from: https://www.php.net/downloads
   - Verify installation: `php --version`

2. **Composer** (PHP package manager)
   - Download from: https://getcomposer.org/download/
   - Verify installation: `composer --version`

3. **Node.js 18+ and npm/pnpm**
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`
   - We recommend using **pnpm** for faster installs: `npm install -g pnpm`

4. **Git**
   - Download from: https://git-scm.com/downloads
   - Verify installation: `git --version`

## 🔧 Setup Instructions

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd example-app
```

### Step 2: Install PHP Dependencies
```bash
composer install
```

### Step 3: Install Node.js Dependencies
Using pnpm (recommended):
```bash
pnpm install
```

Or using npm:
```bash
npm install
```

### Step 4: Environment Configuration
1. **Copy the environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Generate application key:**
   ```bash
   php artisan key:generate
   ```

3. **Configure your database settings in `.env`:**
   - The project is configured to use SQLite by default
   - The database file `database.sqlite` should already exist in the `database/` folder
   - If it doesn't exist, create it:
     ```bash
     touch database/database.sqlite
     ```

### Step 5: Database Setup
1. **Run database migrations:**
   ```bash
   php artisan migrate
   ```

2. **Seed the database with sample data (optional):**
   ```bash
   php artisan db:seed
   ```

### Step 6: Build Frontend Assets
For development:
```bash
pnpm run dev
```

Or for production build:
```bash
pnpm run build
```

### Step 7: Start the Development Server
In a **new terminal window/tab**, start the Laravel development server:
```bash
php artisan serve
```

The application will be available at: http://localhost:8000

## 🎯 Quick Start Commands

For daily development, you'll typically need these two commands running in separate terminals:

**Terminal 1 - Frontend (Vite):**
```bash
pnpm run dev
```

**Terminal 2 - Backend (Laravel):**
```bash
php artisan serve
```

## 📂 Project Structure Overview

```
example-app/
├── app/                    # Laravel application logic
│   ├── Http/Controllers/   # API controllers
│   └── Models/            # Eloquent models
├── database/              # Database migrations, factories, seeders
├── resources/             # Frontend React components and assets
│   ├── js/               # React/TypeScript code
│   └── css/              # Stylesheets
├── routes/               # API and web routes
└── public/               # Public assets
```

## 🛠 Available Scripts

### Backend (PHP/Laravel)
- `php artisan serve` - Start development server
- `php artisan migrate` - Run database migrations
- `php artisan db:seed` - Seed database with sample data
- `php artisan tinker` - Laravel interactive shell
- `php artisan route:list` - List all routes

### Frontend (Node.js/React)
- `pnpm run dev` - Start Vite development server
- `pnpm run build` - Build for production
- `pnpm run lint` - Run ESLint
- `pnpm run format` - Format code with Prettier
- `pnpm run types` - Type check TypeScript

## 🔍 Troubleshooting

### Common Issues & Solutions

**1. Port already in use**
If port 8000 is busy, specify a different port:
```bash
php artisan serve --port=8001
```

**2. Permission errors (macOS/Linux)**
```bash
sudo chmod -R 775 storage bootstrap/cache
```

**3. Database connection issues**
- Ensure the SQLite database file exists in `database/database.sqlite`
- Check your `.env` file database configuration

**4. Node modules issues**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**5. Composer dependencies issues**
```bash
rm -rf vendor composer.lock
composer install
```

**6. Clear Laravel cache**
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

## 🌐 Default URLs

- **Main Application:** http://localhost:8000
- **Vite Dev Server:** http://localhost:5173 (auto-configured)

## 📧 Support

If you encounter any issues:
1. Check this troubleshooting section
2. Review the Laravel documentation: https://laravel.com/docs
3. Check the Inertia.js documentation: https://inertiajs.com/
4. Ask your team lead or create an issue in the project repository

## 🎉 You're Ready!

Once you see both servers running without errors, you're all set! The application should be accessible at http://localhost:8000 with hot-reloading enabled for both frontend and backend changes.

Happy coding! 🚀

---

**Last Updated:** June 2025
**Project:** Laravel React Starter Kit
