import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { BrandsService } from '../../../../../core/services/brands-service';
import { CategoriesService } from '../../../../../core/services/categories-service';
import { BrandOption } from '../../../../../shared/models/brands-model';
import { CategoryOption } from '../../../../../shared/models/categories.model';
import { finalize, map, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductsQueryOptions } from '../../../../../shared/models/products.model';
import { ProductsService } from '../../../../../core/services/products-service';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-products-filtration',
  imports: [
    ButtonModule,
    DrawerModule,
    SelectModule,
    InputNumberModule,
    FormsModule,
    TooltipModule,
    InputTextModule,
  ],
  templateUrl: './products-filtration.html',
  styleUrl: './products-filtration.scss',
})
export class ProductsFiltration implements OnInit {
  private readonly _productService = inject(ProductsService);
  private readonly _brandsService = inject(BrandsService);
  private readonly _categoriesService = inject(CategoriesService);
  private readonly _destroyRef = inject(DestroyRef);

  products = this._productService.products;

  visible = signal(false);

  searchQuery = this._productService.searchQuery;

  brandsOptions = signal<BrandOption[]>([]);
  selectedBrandOption = this._productService.selectedBrandOption;

  categoriesOptions = signal<CategoryOption[]>([]);
  selectedCategoryOption = this._productService.selectedCategoryOption;

  minPrice = this._productService.minPrice;
  maxPrice = this._productService.maxPrice;

  loading = signal(false);

  noFilters() {
    return (
      !this.searchQuery() &&
      !this.selectedBrandOption() &&
      !this.selectedCategoryOption() &&
      !this.minPrice() &&
      !this.maxPrice()
    );
  }

  ngOnInit(): void {
    this._getBrands();
    this._getCategories();
  }

  applyFilters() {
    this.loading.set(true);

    const query: ProductsQueryOptions = {
      pageNumber: this._productService.DEFAULT_PAGE_NUMBER,
      pageSize: this._productService.DEFAULT_PAGE_SIZE,
    };

    const search = this.searchQuery();
    const brandId = this.selectedBrandOption()?.id;
    const categoryId = this.selectedCategoryOption()?.id;
    const minPrice = this.minPrice();
    const maxPrice = this.maxPrice();

    if (search) query.search = search;
    if (brandId) query.brandId = brandId;
    if (categoryId) query.categoryId = categoryId;
    if (minPrice) query.minPrice = minPrice;
    if (maxPrice) query.maxPrice = maxPrice;

    this._productService
      .getProducts$(query)
      .pipe(
        tap(() => this.visible.set(false)),
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  clearFilters() {
    this.selectedBrandOption.set(undefined);
    this.selectedCategoryOption.set(undefined);
    this.minPrice.set(undefined);
    this.maxPrice.set(undefined);
  }

  private _getBrands(): void {
    this._brandsService
      .getBrands$()
      .pipe(
        map((res) => res.map((b) => ({ id: b.id, name: b.name }))),
        tap((res: BrandOption[]) => this.brandsOptions.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _getCategories(): void {
    this._categoriesService
      .getCategories$()
      .pipe(
        map((res) => res.map((c) => ({ id: c.id, name: c.name }))),
        tap((res: CategoryOption[]) => this.categoriesOptions.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
