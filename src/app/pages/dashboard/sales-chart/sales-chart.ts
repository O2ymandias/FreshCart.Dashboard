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
import { CardModule } from 'primeng/card';
import { ChartModule, UIChart } from 'primeng/chart';
import { tap } from 'rxjs';
import { SalesService } from '../../../core/services/sales-service';
import { SalesSummary } from '../../../shared/models/sales.model';

@Component({
  selector: 'app-sales-chart',
  imports: [CardModule, ChartModule],
  templateUrl: './sales-chart.html',
  styleUrl: './sales-chart.scss',
})
export class SalesChart {
  private readonly _salesService = inject(SalesService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _destroyRef = inject(DestroyRef);

  salesChart = viewChild.required<UIChart>('salesChart');

  salesChartData: any;
  salesChartOptions: any;

  @HostListener('window:resize')
  onResize() {
    this.salesChart().chart.resize();
  }

  ngOnInit() {
    this._salesService
      .getSales$({
        pageNumber: 1,
        pageSize: 5,
      })
      .pipe(
        tap((res) => this._initChart(res.results)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private _initChart(salesData: SalesSummary[]) {
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
