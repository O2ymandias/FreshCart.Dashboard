import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { EditProduct } from './pages/catalog/products-layout/edit-product/edit-product';
import { ProductDetails } from './pages/catalog/products-layout/product-details/product-details';
import { ProductsLayout } from './pages/catalog/products-layout/products-layout';
import { Products } from './pages/catalog/products-layout/products/products';
import { CreateProduct } from './pages/catalog/products-layout/create-product/create-product';
import { BrandsLayout } from './pages/catalog/brands-layout/brands-layout';
import { Brands } from './pages/catalog/brands-layout/brands/brands';
import { EditBrand } from './pages/catalog/brands-layout/edit-brand/edit-brand';
import { CreateBrand } from './pages/catalog/brands-layout/create-brand/create-brand';
import { BrandDetails } from './pages/catalog/brands-layout/brand-details/brand-details';
import { CategoriesLayout } from './pages/catalog/categories-layout/categories-layout';
import { Categories } from './pages/catalog/categories-layout/categories/categories';
import { CreateCategory } from './pages/catalog/categories-layout/create-category/create-category';
import { CategoryDetails } from './pages/catalog/categories-layout/category-details/category-details';
import { EditCategory } from './pages/catalog/categories-layout/edit-category/edit-category';
import { Users } from './pages/users-layout/users/users';
import { NotFound } from './pages/not-found/not-found';
import { UserDetails } from './pages/users-layout/user-details/user-details';
import { UsersLayout } from './pages/users-layout/users-layout';
import { Login } from './pages/login/login';

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
        path: 'details/:id',
        component: BrandDetails,
        title: 'Brand Details',
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
  {
    path: 'categories',
    component: CategoriesLayout,
    children: [
      {
        path: '',
        component: Categories,
        title: 'Categories',
      },
      {
        path: 'details/:id',
        component: CategoryDetails,
        title: 'Category Details',
      },
      {
        path: 'edit/:id',
        component: EditCategory,
        title: 'Edit Category',
      },
      {
        path: 'create',
        component: CreateCategory,
        title: 'Create Category',
      },
    ],
  },
  {
    path: 'users',
    component: UsersLayout,
    children: [
      {
        path: '',
        component: Users,
        title: 'Users',
      },
      {
        path: 'details/:id',
        component: UserDetails,
        title: 'User Details',
      },
    ],
  },

  {
    path: 'login',
    component: Login,
    title: 'Login',
  },

  {
    path: '**',
    component: NotFound,
  },
];
