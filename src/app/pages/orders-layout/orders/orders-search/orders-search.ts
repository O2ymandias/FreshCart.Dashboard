import { Component, DestroyRef, inject } from '@angular/core';
import { InputGroup } from 'primeng/inputgroup';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { OrdersService } from '../../../../core/services/orders-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-orders-search',
  imports: [
    InputGroup,
    InputNumberModule,
    InputGroupAddonModule,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './orders-search.html',
  styleUrl: './orders-search.scss',
})
export class OrdersSearch {
  private readonly _ordersService = inject(OrdersService);
  private readonly _destroyRef = inject(DestroyRef);

  orderId = this._ordersService.searchByOrderId;

  search(): void {
    // Reset to first page BUT keep the current page size.
    this._ordersService
      .getOrders$({
        pageNumber: this._ordersService.DEFAULT_PAGE_NUMBER,
        pageSize: this._ordersService.pageSize(),
        orderId: this.orderId(),
      })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
