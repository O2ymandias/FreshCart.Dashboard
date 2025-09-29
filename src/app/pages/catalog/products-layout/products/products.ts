import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';

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
import { Paginator, PaginatorState } from 'primeng/paginator';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroup } from 'primeng/inputgroup';
import { Tooltip } from 'primeng/tooltip';

import { RouterLink } from '@angular/router';
import { ProductsService } from '../../../../core/services/products-service';
import {
  IProduct,
  IProductsQueryOptions,
  ProductSortOption,
} from '../../../../shared/models/products.model';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { ProductsActions } from './products-actions/products-actions';

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
    Paginator,
    InputGroup,
    InputGroupAddonModule,
    Tooltip,
    ButtonModule,
    RouterLink,
    Breadcrumb,
    ProductsActions,
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  private readonly _productsService = inject(ProductsService);
  private readonly _destroyRef = inject(DestroyRef);

  private readonly DEFAULT_PAGE_NUMBER = 1;
  private readonly DEFAULT_PAGE_SIZE = 10;

  products = signal<IProduct[]>([]);

  // Search Query
  searchQuery = signal('');

  // Pagination
  pageSize = signal(this.DEFAULT_PAGE_SIZE);
  pageNumber = signal(this.DEFAULT_PAGE_NUMBER);
  totalRecords = signal(0);
  first = computed(() => (this.pageNumber() - 1) * this.pageSize()); // Convert To Zero-Based Index
  rowsPerPageOptions = [
    this.DEFAULT_PAGE_SIZE * 0.5,
    this.DEFAULT_PAGE_SIZE * 1,
    this.DEFAULT_PAGE_SIZE * 2,
  ];

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
  selectedSortOption = signal<ProductSortOption | null>(null);

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
      pageNumber: this.DEFAULT_PAGE_NUMBER,
      pageSize: this.DEFAULT_PAGE_SIZE,
    });
  }

  private _loadProducts(options: IProductsQueryOptions): void {
    this._productsService
      .getProducts$(options)
      .pipe(
        tap((res) => {
          this.products.set(res.results);
          this.pageNumber.set(res.pageNumber);
          this.pageSize.set(res.pageSize);
          this.totalRecords.set(res.total);
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  onPageChange(event: PaginatorState): void {
    let pageNumber = this.DEFAULT_PAGE_NUMBER;
    if (event.page) pageNumber = event.page + 1; // event.page is zero-based
    const pageSize = event.rows ?? this.DEFAULT_PAGE_SIZE;

    this.pageNumber.set(pageNumber);
    this.pageSize.set(pageSize);

    // Considers: search query and sort options
    const search = this.searchQuery();
    const sortOption = this.selectedSortOption();
    const sort = sortOption
      ? { key: sortOption.value.key, dir: sortOption.value.dir }
      : undefined;

    this._loadProducts({
      pageNumber,
      pageSize,
      search,
      sort,
    });
  }

  search(): void {
    // Reset the sort option
    this.selectedSortOption.set(null);

    // Reset to first page BUT keep the current page size.
    this._loadProducts({
      pageNumber: this.DEFAULT_PAGE_NUMBER,
      pageSize: this.pageSize(),
      search: this.searchQuery(),
    });
  }

  refresh(): void {
    // Reset the search query.
    this.searchQuery.set('');

    // Reset the sort option.
    this.selectedSortOption.set(null);

    // Reset to first page.
    this._loadProducts({
      pageNumber: this.DEFAULT_PAGE_NUMBER,
      pageSize: this.DEFAULT_PAGE_SIZE,
    });
  }

  sort(): void {
    const sortOption = this.selectedSortOption();
    if (!sortOption) return;

    const { key, dir } = sortOption.value;

    // Reset to first page BUT keep the current page size.
    // Keep the current search query.
    this._loadProducts({
      pageNumber: this.DEFAULT_PAGE_NUMBER,
      pageSize: this.pageSize(),
      search: this.searchQuery(),
      sort: { key, dir },
    });
  }
}
