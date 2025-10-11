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
import { map, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductsQueryOptions } from '../../../../../shared/models/products.model';
import { ProductsService } from '../../../../../core/services/products-service';

@Component({
  selector: 'app-products-filtration',
  imports: [
    ButtonModule,
    DrawerModule,
    SelectModule,
    InputNumberModule,
    FormsModule,
  ],
  templateUrl: './products-filtration.html',
  styleUrl: './products-filtration.scss',
})
export class ProductsFiltration implements OnInit {
  private readonly _productService = inject(ProductsService);
  private readonly _brandsService = inject(BrandsService);
  private readonly _categoriesService = inject(CategoriesService);
  private readonly _destroyRef = inject(DestroyRef);

  visible = signal(false);

  brandsOptions = signal<BrandOption[]>([]);
  selectedBrand = signal<BrandOption | undefined>(undefined);

  categoriesOptions = signal<CategoryOption[]>([]);
  selectedCategory = signal<CategoryOption | undefined>(undefined);

  minPrice = signal<number | undefined>(undefined);
  maxPrice = signal<number | undefined>(undefined);

  loading = signal(false);

  noFilters() {
    return (
      !this.selectedBrand() &&
      !this.selectedCategory() &&
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

    const brandId = this.selectedBrand()?.id;
    const categoryId = this.selectedCategory()?.id;
    const minPrice = this.minPrice();
    const maxPrice = this.maxPrice();

    if (brandId) query.brandId = brandId;
    if (categoryId) query.categoryId = categoryId;
    if (minPrice) query.minPrice = minPrice;
    if (maxPrice) query.maxPrice = maxPrice;

    console.log(`Query: ${JSON.stringify(query)}`);

    // this._productService
    //   .getProducts$(query)
    //   .pipe(
    //     tap(() => this.visible.set(false)),
    //     finalize(() => this.loading.set(false)),
    //     takeUntilDestroyed(this._destroyRef),
    //   )
    //   .subscribe();
  }

  clearFilters() {
    this.selectedBrand.set(undefined);
    this.selectedCategory.set(undefined);
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
