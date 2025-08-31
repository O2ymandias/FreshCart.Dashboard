import { Routes } from '@angular/router';
import { ProductDetails } from './pages/catalog/product/product-details/product-details';
import { Dashboard } from './pages/dashboard/dashboard';
import { Products } from './pages/catalog/product/products/products';
import { EditProduct } from './pages/catalog/product/edit-product/edit-product';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard, title: 'Dashboard' },
  { path: 'products', component: Products, title: 'Products' },
  { path: 'products/:id', component: ProductDetails, title: 'Product Details' },
  {
    path: 'products/edit/:id',
    component: EditProduct,
    title: 'Edit Product',
  },
];
