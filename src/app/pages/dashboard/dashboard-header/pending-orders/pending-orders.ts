import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { OrdersService } from '../../../../core/services/orders-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-pending-orders',
  imports: [CardModule, ButtonModule],
  templateUrl: './pending-orders.html',
  styleUrl: './pending-orders.scss',
})
export class PendingOrders implements OnInit {
  private readonly _ordersService = inject(OrdersService);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  pendingOrdersCount = signal(0);

  ngOnInit(): void {
    this._initialize();
  }

  navigateToPendingOrders() {
    this._router.navigate(['/orders'], {
      queryParams: { orderStatus: 'Pending' },
    });
  }

  private _initialize() {
    this._ordersService
      .getOrdersCount$({
        orderStatus: 'Pending',
      })
      .pipe(
        tap((res) => this.pendingOrdersCount.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
