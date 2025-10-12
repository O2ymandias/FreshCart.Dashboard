import { Component, DestroyRef, inject, OnInit } from '@angular/core';

import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { RouterLink } from '@angular/router';
import { ProductsService } from '../../../../core/services/products-service';
import { ProductsQueryOptions } from '../../../../shared/models/products.model';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { ProductsActions } from './products-actions/products-actions';
import { ProductsFiltration } from './products-filtration/products-filtration';
import { ProductsPagination } from './products-pagination/products-pagination';
import { ProductsSearch } from './products-search/products-search';
import { ProductsSort } from './products-sort/products-sort';

@Component({
  selector: 'app-products',
  imports: [
    TableModule,
    CommonModule,
    ButtonModule,
    RouterLink,
    Breadcrumb,
    ProductsActions,
    ProductsFiltration,
    ProductsPagination,
    ProductsSearch,
    ProductsSort,
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  private readonly _productsService = inject(ProductsService);
  private readonly _destroyRef = inject(DestroyRef);

  products = this._productsService.products;

  navigationItems: MenuItem[] = [
    {
      label: 'Home',
      routerLink: '/dashboard',
      icon: 'pi pi-home',
    },
    {
      label: 'Products',
      disabled: true,
    },
  ];

  ngOnInit(): void {
    this._loadProducts({
      pageNumber: this._productsService.DEFAULT_PAGE_NUMBER,
      pageSize: this._productsService.DEFAULT_PAGE_SIZE,
    });
  }

  refresh(): void {
    this._productsService.reset();

    // Reset to first page.
    this._loadProducts({
      pageNumber: this._productsService.DEFAULT_PAGE_NUMBER,
      pageSize: this._productsService.DEFAULT_PAGE_SIZE,
    });
  }

  private _loadProducts(options: ProductsQueryOptions): void {
    this._productsService
      .getProducts$(options)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
