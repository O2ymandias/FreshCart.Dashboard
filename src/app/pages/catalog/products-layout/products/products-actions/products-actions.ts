import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToasterService } from '../../../../../core/services/toaster-service';
import { ProductsService } from '../../../../../core/services/products-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-products-actions',
  imports: [ButtonModule, RouterLink],
  templateUrl: './products-actions.html',
  styleUrl: './products-actions.scss',
})
export class ProductsActions {
  private readonly _productsService = inject(ProductsService);
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _toasterService = inject(ToasterService);
  private readonly _destroyRef = inject(DestroyRef);

  productId = input.required<number>();
  deleted = output();

  onDeleteProduct(event: Event) {
    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this product?',
      header: 'Delete Product',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },

      accept: () => this.deleteProduct(),
    });
  }

  deleteProduct() {
    this._productsService
      .deleteProduct(this.productId())
      .pipe(
        tap((res) => {
          if (res) {
            this._toasterService.success('Product deleted successfully');
            this.deleted.emit();
          }
        }),

        catchError((err: HttpErrorResponse) => {
          this._toasterService.error(err.error.message);
          return throwError(() => err);
        }),

        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
