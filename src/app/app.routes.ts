import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { EditProduct } from './pages/catalog/products-layout/edit-product/edit-product';
import { ProductDetails } from './pages/catalog/products-layout/product-details/product-details';
import { ProductsLayout } from './pages/catalog/products-layout/products-layout';
import { Products } from './pages/catalog/products-layout/products/products';
import { CreateProduct } from './pages/catalog/products-layout/create-product/create-product';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard, title: 'Dashboard' },
  {
    path: 'products',
    component: ProductsLayout,
    children: [
      {
        path: '',
        component: Products,
        title: 'Products',
      },
      {
        path: 'details/:id',
        component: ProductDetails,
        title: 'Product Details',
      },
      {
        path: 'edit/:id',
        component: EditProduct,
        title: 'Edit Product',
      },
      {
        path: 'create',
        component: CreateProduct,
        title: 'Create Product',
      },
    ],
  },
];
