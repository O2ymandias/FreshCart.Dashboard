import { Component, DestroyRef, inject, OnInit } from '@angular/core';

import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroup } from 'primeng/inputgroup';
import { Tooltip } from 'primeng/tooltip';

import { RouterLink } from '@angular/router';
import { ProductsService } from '../../../../core/services/products-service';
import {
  ProductsQueryOptions,
  ProductSortOption,
} from '../../../../shared/models/products.model';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { ProductsActions } from './products-actions/products-actions';
import { ProductsFiltration } from './products-filtration/products-filtration';
import { ProductsPagination } from './products-pagination/products-pagination';

@Component({
  selector: 'app-products',
  imports: [
    TableModule,
    SelectModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    TextareaModule,
    CommonModule,
    InputTextModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputGroup,
    InputGroupAddonModule,
    Tooltip,
    ButtonModule,
    RouterLink,
    Breadcrumb,
    ProductsActions,
    ProductsFiltration,
    ProductsPagination,
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  private readonly _productsService = inject(ProductsService);
  private readonly _destroyRef = inject(DestroyRef);

  products = this._productsService.products;

  // Search Query
  searchQuery = this._productsService.searchQuery;

  pageSize = this._productsService.pageSize;
  pageNumber = this._productsService.pageNumber;

  // Sort
  sortOptions: ProductSortOption[] = [
    {
      label: 'Name: A to Z',
      value: {
        key: 'name',
        dir: 'asc',
      },
    },
    {
      label: 'Name: Z to A',
      value: {
        key: 'name',
        dir: 'desc',
      },
    },
    {
      label: 'Price: High to Low',
      value: {
        key: 'price',
        dir: 'desc',
      },
    },
    {
      label: 'Price: Low to High',
      value: {
        key: 'price',
        dir: 'asc',
      },
    },
    {
      label: 'Stock: Low to High',
      value: {
        key: 'unitsInStock',
        dir: 'asc',
      },
    },
    {
      label: 'Stock: High to Low',
      value: {
        key: 'unitsInStock',
        dir: 'desc',
      },
    },
  ];
  selectedSortOption = this._productsService.selectedSortOption;

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

  private _loadProducts(options: ProductsQueryOptions): void {
    this._productsService
      .getProducts$(options)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  search(): void {
    // Reset the sort option
    this.selectedSortOption.set(undefined);

    // Reset to first page BUT keep the current page size.
    this._loadProducts({
      pageNumber: this._productsService.DEFAULT_PAGE_NUMBER,
      pageSize: this.pageSize(),
      search: this.searchQuery(),
    });
  }

  refresh(): void {
    // Reset the search query.
    this.searchQuery.set('');

    // Reset the sort option.
    this.selectedSortOption.set(undefined);

    // Reset to first page.
    this._loadProducts({
      pageNumber: this._productsService.DEFAULT_PAGE_NUMBER,
      pageSize: this._productsService.DEFAULT_PAGE_SIZE,
    });
  }

  sort(): void {
    const sortOption = this.selectedSortOption();
    if (!sortOption) return;

    const { key, dir } = sortOption.value;

    // Reset to first page BUT keep the current page size.
    // Keep the current search query.
    this._loadProducts({
      pageNumber: this._productsService.DEFAULT_PAGE_NUMBER,
      pageSize: this.pageSize(),
      search: this.searchQuery(),
      sort: { key, dir },
    });
  }
}
