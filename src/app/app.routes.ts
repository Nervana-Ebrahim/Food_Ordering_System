import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'Food Ordering | Home',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    title: 'Login',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
    title: 'Register',
  },
  {
    path: 'foods',
    loadComponent: () =>
      import('./features/foods/food-list/food-list.component').then((m) => m.FoodListComponent),
    title: 'Foods',
  },
  {
    path: 'foods/:id',
    loadComponent: () =>
      import('./features/foods/food-details/food-details.component').then((m) => m.FoodDetailsComponent),
    title: 'Food Details',
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/categories.component').then((m) => m.CategoriesComponent),
    title: 'Categories',
  },
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () => import('./features/cart/cart.component').then((m) => m.CartComponent),
    title: 'My Cart',
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent),
    title: 'Checkout',
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/orders/my-orders/my-orders.component').then((m) => m.MyOrdersComponent),
    title: 'My Orders',
  },
  {
    path: 'orders/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/orders/order-details/order-details.component').then(
        (m) => m.OrderDetailsComponent
      ),
    title: 'Order Details',
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component').then((m) => m.ProfileComponent),
    title: 'My Profile',
  },
  {
    path: 'admin/dashboard',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    title: 'Admin Dashboard',
  },
  {
    path: 'admin/users',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/users/users.component').then((m) => m.UsersComponent),
    title: 'Manage Users',
  },
  {
    path: 'admin/categories',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/categories/categories.component').then((m) => m.AdminCategoriesComponent),
    title: 'Manage Categories',
  },
  {
    path: 'admin/categories/create',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/categories/category-form.component').then(
        (m) => m.CategoryFormComponent
      ),
    title: 'Create Category',
  },
  {
    path: 'admin/categories/:id/edit',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/categories/category-form.component').then(
        (m) => m.CategoryFormComponent
      ),
    title: 'Edit Category',
  },
  {
    path: 'admin/foods',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/foods/foods.component').then((m) => m.AdminFoodsComponent),
    title: 'Manage Foods',
  },
  {
    path: 'admin/foods/create',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/foods/food-form.component').then((m) => m.FoodFormComponent),
    title: 'Create Food',
  },
  {
    path: 'admin/foods/:id/edit',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/foods/food-form.component').then((m) => m.FoodFormComponent),
    title: 'Edit Food',
  },
  {
    path: 'admin/orders',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/orders/orders.component').then((m) => m.AdminOrdersComponent),
    title: 'Manage Orders',
  },
  { path: '**', redirectTo: '' },
];
