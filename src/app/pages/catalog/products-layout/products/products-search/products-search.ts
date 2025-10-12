import { ProductsService } from './../../../../../core/services/products-service';
import { Component, DestroyRef, inject } from '@angular/core';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-products-search',
  imports: [
    InputGroup,
    InputGroupAddonModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    TooltipModule
  ],
  templateUrl: './products-search.html',
  styleUrl: './products-search.scss',
})
export class ProductsSearch {
  private readonly _productsService = inject(ProductsService);
  private readonly _destroyRef = inject(DestroyRef);

  searchQuery = this._productsService.searchQuery;

  search() {
    // Reset to first page BUT keep the current page size.
    this._productsService
      .getProducts$({
        pageNumber: this._productsService.DEFAULT_PAGE_NUMBER,
        pageSize: this._productsService.pageSize(),
        search: this.searchQuery(),
      })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
