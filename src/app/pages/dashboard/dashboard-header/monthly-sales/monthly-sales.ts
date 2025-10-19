import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { SalesService } from '../../../../core/services/sales-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-monthly-sales',
  imports: [CardModule, CurrencyPipe],
  templateUrl: './monthly-sales.html',
  styleUrl: './monthly-sales.scss',
})
export class MonthlySales implements OnInit {
  private readonly _salesService = inject(SalesService);
  private readonly _destroyRef = inject(DestroyRef);

  totalSales = signal(0);

  ngOnInit(): void {
    this._initialize();
  }

  private _initialize() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const startDate = startOfMonth.toISOString();
    const endDate = now.toISOString();

    this._salesService
      .getTotalSales$({
        startDate,
        endDate,
      })
      .pipe(
        tap((res) => this.totalSales.set(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
