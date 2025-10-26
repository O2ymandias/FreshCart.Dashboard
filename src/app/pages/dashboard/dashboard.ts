import { Component } from '@angular/core';
import { RecentOrders } from './recent-orders/recent-orders';
import { DashboardHeader } from './dashboard-header/dashboard-header';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { SalesChart } from './sales-chart/sales-chart';
import { PaymentStatusChart } from './payment-status-chart/payment-status-chart';
import { OrderStatusChart } from './order-status-chart/order-status-chart';

@Component({
  selector: 'app-dashboard',
  imports: [
    RecentOrders,
    DashboardHeader,
    CardModule,
    ChartModule,
    SalesChart,
    PaymentStatusChart,
    OrderStatusChart,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}
