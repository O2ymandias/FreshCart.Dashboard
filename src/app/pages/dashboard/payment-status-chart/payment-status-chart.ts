import {
  PaymentStatus,
  StatusCount,
} from './../../../shared/models/orders-model';
import {
  Component,
  DestroyRef,
  HostListener,
  inject,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { UIChart, ChartModule } from 'primeng/chart';
import { OrdersService } from '../../../core/services/orders/orders-service';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformServer } from '@angular/common';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-payment-status-chart',
  imports: [Card, ChartModule],
  templateUrl: './payment-status-chart.html',
  styleUrl: './payment-status-chart.scss',
})
export class PaymentStatusChart {
  private readonly _ordersService = inject(OrdersService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _destroyRef = inject(DestroyRef);

  paymentStatusChart = viewChild.required<UIChart>('paymentStatusChart');

  paymentStatusChartData: any;
  paymentStatusChartOptions: any;

  @HostListener('window:resize')
  onResize() {
    this.paymentStatusChart().chart.resize();
  }

  ngOnInit(): void {
    this._loadData();
  }

  private _loadData() {
    this._ordersService
      .getPaymentStatusCount$()
      .pipe(
        tap((res) => this._initChart(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _initChart(paymentStatusCounts: StatusCount<PaymentStatus>[]) {
    if (isPlatformServer(this._platformId)) return;

    const labels = paymentStatusCounts.map((o) => {
      switch (o.status) {
        case 'Pending':
          return 'Pending';
        case 'AwaitingPayment':
          return 'Awaiting Payment';
        case 'PaymentReceived':
          return 'Payment Received';
        case 'PaymentFailed':
          return 'Payment Failed';
      }
    });
    const counts = paymentStatusCounts.map((o) => o.count);

    this.paymentStatusChartData = {
      labels,
      datasets: [
        {
          data: counts,
        },
      ],
    };

    this.paymentStatusChartOptions = {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 25,
            font: {
              size: 14,
            },
          },
        },
      },
    };
  }
}
