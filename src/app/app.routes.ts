import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { EditProduct } from './pages/catalog/products-layout/edit-product/edit-product';
import { ProductDetails } from './pages/catalog/products-layout/product-details/product-details';
import { ProductsLayout } from './pages/catalog/products-layout/products-layout';
import { Products } from './pages/catalog/products-layout/products/products';
import { CreateProduct } from './pages/catalog/products-layout/create-product/create-product';
import { BrandsLayout } from './pages/catalog/brands-layout/brands-layout';
import { Brands } from './pages/catalog/brands-layout/brands/brands';
import { EditBrand } from './pages/catalog/brands-layout/brands/edit-brand/edit-brand';
import { CreateBrand } from './pages/catalog/brands-layout/brands/create-brand/create-brand';

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
  {
    path: 'brands',
    component: BrandsLayout,
    children: [
      {
        path: '',
        component: Brands,
        title: 'Brands',
      },
      {
        path: 'edit/:id',
        component: EditBrand,
        title: 'Edit Brand',
      },
      {
        path: 'create',
        component: CreateBrand,
        title: 'Create Brand',
      },
    ],
  },
];
