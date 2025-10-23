import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CardModule } from 'primeng/card';
import { tap } from 'rxjs';
import { SalesService } from '../../../../core/services/sales-service';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-total-sales',
  imports: [CardModule, CurrencyPipe, RouterLink, ButtonModule],
  templateUrl: './total-sales.html',
  styleUrl: './total-sales.scss',
})
export class TotalSales {
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
