import { Component, DestroyRef, inject, signal } from '@angular/core';
import { InputGroup } from 'primeng/inputgroup';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/Orders/order-service';
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
  private readonly _ordersService = inject(OrderService);
  private readonly _destroyRef = inject(DestroyRef);

  searchByOrderId = signal<number | undefined>(undefined);

  search(): void {
    // Reset to first page BUT keep the current page size.
    this._ordersService
      .getOrders$({
        pageNumber: this._ordersService.DEFAULT_PAGE_NUMBER,
        pageSize: this._ordersService.pageSize(),
        orderId: this.searchByOrderId(),
      })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
