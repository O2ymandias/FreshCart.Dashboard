import { isPlatformServer } from '@angular/common';
import {
  Component,
  DestroyRef,
  HostListener,
  inject,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UIChart, ChartModule } from 'primeng/chart';
import { tap } from 'rxjs';
import { OrdersService } from '../../../core/services/orders/orders-service';
import { StatusCount, OrderStatus } from '../../../shared/models/orders-model';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-order-status-chart',
  imports: [Card, ChartModule],
  templateUrl: './order-status-chart.html',
  styleUrl: './order-status-chart.scss',
})
export class OrderStatusChart {
  private readonly _ordersService = inject(OrdersService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _destroyRef = inject(DestroyRef);

  ordersChart = viewChild.required<UIChart>('ordersChart');

  ordersChartData: any;
  ordersChartOptions: any;

  @HostListener('window:resize')
  onResize() {
    this.ordersChart().chart.resize();
  }

  ngOnInit(): void {
    this._loadData();
  }

  private _loadData() {
    this._ordersService
      .getOrdersStatusCount$()
      .pipe(
        tap((res) => this._initChart(res)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _initChart(ordersStatusCounts: StatusCount<OrderStatus>[]) {
    if (isPlatformServer(this._platformId)) return;

    const labels = ordersStatusCounts.map((o) => o.status);
    const counts = ordersStatusCounts.map((o) => o.count);

    this.ordersChartData = {
      labels,
      datasets: [
        {
          data: counts,
        },
      ],
    };

    this.ordersChartOptions = {
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
