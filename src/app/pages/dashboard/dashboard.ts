import {
  Component,
  DestroyRef,
  HostListener,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RecentOrders } from './recent-orders/recent-orders';
import { DashboardHeader } from './dashboard-header/dashboard-header';
import { CardModule } from 'primeng/card';
import { ChartModule, UIChart } from 'primeng/chart';
import { SalesService } from '../../core/services/sales-service';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SalesSummary } from '../../shared/models/sales.model';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [RecentOrders, DashboardHeader, CardModule, ChartModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly _salesService = inject(SalesService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _destroyRef = inject(DestroyRef);

  salesSummary = signal<SalesSummary[]>([]);

  salesChart = viewChild.required<UIChart>('salesChart');

  salesChartData: any;
  salesChartOptions: any;

  ngOnInit() {
    this._salesService
      .getSales$({
        pageNumber: 1,
        pageSize: 5,
      })
      .pipe(
        tap((res) => this.initChart(res.results)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  @HostListener('window:resize')
  onResize() {
    const uiChart = this.salesChart();
    uiChart.chart.resize();
  }

  private initChart(salesData: SalesSummary[]) {
    if (isPlatformServer(this._platformId)) return;

    const labels = salesData.map((p) => p.productName);
    const units = salesData.map((p) => p.unitsSold);
    const sales = salesData.map((p) => p.totalSales);

    this.salesChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Units Sold',
          data: units,
          type: 'bar',
          borderRadius: '2',
          yAxisID: 'yUnits', // Left axis
          barPercentage: 0.5,
          categoryPercentage: 0.5,
        },
        {
          label: 'Total Sales ($)',
          data: sales,
          type: 'line',
          borderWidth: 2,
          fill: false,
          tension: 0.5,
          yAxisID: 'ySales', // Right axis
        },
      ],
    };

    this.salesChartOptions = {
      responsive: true,

      interaction: {
        mode: 'index',
        intersect: false,
      },

      scales: {
        yUnits: {
          type: 'linear',
          position: 'left',
          title: { display: true, text: 'Units Sold' },
        },
        ySales: {
          type: 'linear',
          position: 'right',
          grid: { drawOnChartArea: false },
          title: { display: true, text: 'Total Sales ($)' },
        },
      },
    };
  }
}
