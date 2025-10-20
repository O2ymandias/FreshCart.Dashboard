import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { OrdersService } from '../../../../core/services/orders-service';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-total-orders',
  imports: [CardModule],
  templateUrl: './total-orders.html',
  styleUrl: './total-orders.scss',
})
export class TotalOrders {
  private readonly _ordersService = inject(OrdersService);
  private readonly _destroyRef = inject(DestroyRef);
  totalOrders = signal(0);
  ngOnInit(): void {
    this._initialize();
  }

  private _initialize() {
    this._ordersService
      .getOrdersCount$()
      .pipe(
        tap((res) => this.totalOrders.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
